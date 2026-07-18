package com.example.wellnessbackend.service;

import com.example.wellnessbackend.entity.CancelledBy;
import com.example.wellnessbackend.entity.SessionStatus;
import com.example.wellnessbackend.dto.TherapySessionDto;
import com.example.wellnessbackend.entity.TherapySession;
import com.example.wellnessbackend.repository.TherapyRepository;
import com.example.wellnessbackend.repository.TherapySessionRepository;
import com.example.wellnessbackend.repository.PractitionerProfileRepository;
import com.example.wellnessbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TherapySessionService {

    private final TherapySessionRepository sessionRepository;
    private final NotificationService notificationService;
    private final PractitionerProfileRepository practitionerProfileRepository;
    private final UserRepository userRepository;
    private final TherapyRepository therapyRepository;
    private final EmailService emailService;

    // ------------------- Helper: get clinic address -------------------
    private String getClinicAddress(Long practitionerId) {
        return practitionerProfileRepository.findByUserId(practitionerId)
                .map(p -> p.getClinicAddress() != null && !p.getClinicAddress().isBlank()
                        ? " | 📍 Location: " + p.getClinicAddress()
                        : "")
                .orElse("");
    }

    // FIX #7: Use type-safe SessionStatus enum constants
    private static final SessionStatus BOOKED = SessionStatus.BOOKED;
    private static final SessionStatus COMPLETED = SessionStatus.COMPLETED;
    private static final SessionStatus CANCELLED = SessionStatus.CANCELLED;
    private static final SessionStatus REJECTED = SessionStatus.REJECTED;
    private static final SessionStatus ACCEPTED = SessionStatus.ACCEPTED;

    // ------------------- Book a new therapy session -------------------
    public TherapySession bookSession(TherapySessionDto dto) {
        // FIX #14: Validate that the session is not booked in the past
        if (dto.getDateTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book sessions in the past. Please select a future date and time.");
        }

        if (dto.getDateTime().getMinute() != 0) {
            throw new RuntimeException("Invalid slot. Please select a valid hourly slot.");
        }

        List<LocalDateTime> availableSlots = getAvailableSlots(
                dto.getPractitionerId(),
                dto.getDateTime().toLocalDate().toString());

        if (!availableSlots.contains(dto.getDateTime())) {
            throw new RuntimeException("Selected slot is no longer available");
        }

        boolean alreadyBooked = sessionRepository.existsByTherapyIdAndPractitionerIdAndDateTimeAndStatusNot(
                dto.getTherapyId(),
                dto.getPractitionerId(),
                dto.getDateTime(),
                CANCELLED);

        if (alreadyBooked) {
            throw new RuntimeException("This slot is already booked");
        }

        TherapySession session = TherapySession.builder()
                .therapyId(dto.getTherapyId())
                .practitionerId(dto.getPractitionerId())
                .userId(dto.getUserId())
                .dateTime(dto.getDateTime())
                .status(BOOKED)
                .notes(dto.getNotes())
                .build();

        session = sessionRepository.save(session);

        String address = getClinicAddress(session.getPractitionerId());

        notificationService.createNotification(
                session.getUserId(),
                "SESSION_BOOKED",
                "Your session is booked for " + session.getDateTime() + address);

        notificationService.createNotification(
                session.getPractitionerId(),
                "SESSION_BOOKED",
                "You have a new session at " + session.getDateTime() + address);

        // ── Email notifications (non-blocking: failures logged, never thrown) ──
        final TherapySession savedSession = session;
        try {
            // Look up patient
            String patientEmail = userRepository.findById(savedSession.getUserId())
                    .map(u -> u.getEmail()).orElse(null);
            String patientName = userRepository.findById(savedSession.getUserId())
                    .map(u -> u.getName() != null ? u.getName() : "Patient").orElse("Patient");

            // Look up practitioner user (for name + email)
            String practitionerEmail = userRepository.findById(savedSession.getPractitionerId())
                    .map(u -> u.getEmail()).orElse(null);
            String practitionerName = userRepository.findById(savedSession.getPractitionerId())
                    .map(u -> u.getName() != null ? u.getName() : "Practitioner").orElse("Practitioner");

            // Look up practitioner profile (for specialization + clinic address)
            String specialization = practitionerProfileRepository.findByUserId(savedSession.getPractitionerId())
                    .map(p -> p.getSpecialization() != null ? p.getSpecialization() : "").orElse("");
            String clinicAddress = practitionerProfileRepository.findByUserId(savedSession.getPractitionerId())
                    .map(p -> p.getClinicAddress() != null ? p.getClinicAddress() : "").orElse("");

            // Look up therapy name
            String therapyName = therapyRepository.findById(savedSession.getTherapyId())
                    .map(t -> t.getName() != null ? t.getName() : "Therapy").orElse("Therapy");

            String dateTimeStr = savedSession.getDateTime().toString().replace("T", " at ");

            // Send to patient
            if (patientEmail != null) {
                emailService.sendSessionBookingConfirmationToPatient(
                        patientEmail,
                        patientName,
                        therapyName,
                        practitionerName,
                        specialization,
                        clinicAddress,
                        dateTimeStr,
                        savedSession.getNotes()
                );
            }

            // Send to practitioner
            if (practitionerEmail != null) {
                emailService.sendNewSessionNotificationToPractitioner(
                        practitionerEmail,
                        practitionerName,
                        patientName,
                        therapyName,
                        dateTimeStr,
                        savedSession.getNotes()
                );
            }
        } catch (Exception e) {
            log.error("⚠️ Email notification failed for session {}: {}", savedSession.getId(), e.getMessage());
        }

        return session;
    }

    // ------------------- Get sessions -------------------
    public List<TherapySession> getSessionsByUser(Long userId) {
        return sessionRepository.findByUserId(userId);
    }

    public List<TherapySession> getSessionsByPractitioner(Long practitionerId) {
        return sessionRepository.findByPractitionerId(practitionerId);
    }

    // ------------------- Update session (status/notes) -------------------
    @Transactional
    public TherapySession updateSession(Long sessionId, TherapySessionDto dto) {
        TherapySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (dto.getStatus() != null) {
            SessionStatus newStatus;
            try {
                newStatus = SessionStatus.valueOf(dto.getStatus().toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new RuntimeException("Invalid status value: " + dto.getStatus());
            }

            if (CANCELLED == session.getStatus() || REJECTED == session.getStatus()) {
                throw new RuntimeException("Cancelled/Rejected session cannot be updated");
            }

            session.setStatus(newStatus);

            if (COMPLETED == newStatus) {
                notificationService.createNotification(
                        session.getUserId(),
                        "SESSION_COMPLETED",
                        "Your session on " + session.getDateTime() + " is completed");

                notificationService.createNotification(
                        session.getPractitionerId(),
                        "SESSION_COMPLETED",
                        "You completed a session on " + session.getDateTime());

                // ── Email notifications for COMPLETED ──
                final TherapySession completedSession = session;
                try {
                    SessionContext ctx = extractSessionContext(completedSession);
                    String dtStr = completedSession.getDateTime().toString().replace("T", " at ");
                    if (ctx.patientEmail != null) {
                        emailService.sendSessionCompletedToPatient(
                                ctx.patientEmail, ctx.patientName,
                                ctx.therapyName, ctx.practitionerName, dtStr);
                    }
                    if (ctx.practitionerEmail != null) {
                        emailService.sendSessionCompletedToPractitioner(
                                ctx.practitionerEmail, ctx.practitionerName,
                                ctx.patientName, ctx.therapyName, dtStr);
                    }
                } catch (Exception e) {
                    log.error("⚠️ Email notification failed for completed session {}: {}", completedSession.getId(), e.getMessage());
                }
            }
        }

        if (dto.getNotes() != null) {
            session.setNotes(dto.getNotes());
        }

        return sessionRepository.save(session);
    }

    // ------------------- Cancel session -------------------
    @Transactional
    public TherapySession cancelSession(Long sessionId) {
        TherapySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (COMPLETED == session.getStatus()) {
            throw new RuntimeException("Completed session cannot be cancelled");
        }

        if (CANCELLED == session.getStatus()) {
            throw new RuntimeException("Session already cancelled");
        }

        session.setStatus(CANCELLED);
        session = sessionRepository.save(session);

        String address = getClinicAddress(session.getPractitionerId());

        notificationService.createNotification(
                session.getUserId(),
                "SESSION_CANCELLED",
                "Your session on " + session.getDateTime() + " has been cancelled" + address);

        notificationService.createNotification(
                session.getPractitionerId(),
                "SESSION_CANCELLED",
                "Session on " + session.getDateTime() + " has been cancelled" + address);

        // ── Email notifications ──
        final TherapySession cancelledSession = session;
        try {
            SessionContext ctx = extractSessionContext(cancelledSession);
            String dtStr = cancelledSession.getDateTime().toString().replace("T", " at ");
            if (ctx.patientEmail != null) {
                emailService.sendSessionCancelledToPatient(
                        ctx.patientEmail, ctx.patientName,
                        ctx.therapyName, ctx.practitionerName, dtStr);
            }
            if (ctx.practitionerEmail != null) {
                emailService.sendSessionCancelledToPractitioner(
                        ctx.practitionerEmail, ctx.practitionerName,
                        ctx.patientName, ctx.therapyName, dtStr, null);
            }
        } catch (Exception e) {
            log.error("⚠️ Email notification failed for cancelled session {}: {}", cancelledSession.getId(), e.getMessage());
        }

        return session;
    }

    // ------------------- Cancel accepted session by user with reason
    // -------------------
    @Transactional
    public TherapySession cancelSessionByUser(Long sessionId, String reason) {
        TherapySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!ACCEPTED.equals(session.getStatus())) {
            throw new RuntimeException("Only accepted sessions can be cancelled by user");
        }

        session.setStatus(CANCELLED);
        session.setCancellationReason(reason);
        session.setCancelledBy(CancelledBy.USER);

        session = sessionRepository.save(session);

        String address = getClinicAddress(session.getPractitionerId());

        notificationService.createNotification(
                session.getPractitionerId(),
                "SESSION_CANCELLED",
                "Session on " + session.getDateTime() + " was cancelled by user. Reason: " + reason + address);

        // ── Email notification to practitioner ──
        final TherapySession cancelledByUserSession = session;
        try {
            SessionContext ctx = extractSessionContext(cancelledByUserSession);
            String dtStr = cancelledByUserSession.getDateTime().toString().replace("T", " at ");
            if (ctx.practitionerEmail != null) {
                emailService.sendSessionCancelledToPractitioner(
                        ctx.practitionerEmail, ctx.practitionerName,
                        ctx.patientName, ctx.therapyName, dtStr, reason);
            }
        } catch (Exception e) {
            log.error("⚠️ Email notification failed for user-cancelled session {}: {}", cancelledByUserSession.getId(), e.getMessage());
        }

        return session;
    }

    // ------------------- Accept session -------------------
    @Transactional
    public TherapySession acceptSession(Long sessionId) {
        TherapySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!BOOKED.equals(session.getStatus())) {
            throw new RuntimeException("Only booked sessions can be accepted");
        }

        session.setStatus(ACCEPTED);
        session = sessionRepository.save(session);

        String address = getClinicAddress(session.getPractitionerId());

        notificationService.createNotification(
                session.getUserId(),
                "SESSION_ACCEPTED",
                "Your session on " + session.getDateTime() + " has been accepted" + address);

        notificationService.createNotification(
                session.getPractitionerId(),
                "SESSION_ACCEPTED",
                "You have accepted the session on " + session.getDateTime() + address);

        // ── Email notification to patient ──
        final TherapySession acceptedSession = session;
        try {
            SessionContext ctx = extractSessionContext(acceptedSession);
            String dtStr = acceptedSession.getDateTime().toString().replace("T", " at ");
            if (ctx.patientEmail != null) {
                emailService.sendSessionAcceptedToPatient(
                        ctx.patientEmail, ctx.patientName,
                        ctx.therapyName, ctx.practitionerName,
                        ctx.specialization, ctx.clinicAddress, dtStr);
            }
        } catch (Exception e) {
            log.error("⚠️ Email notification failed for accepted session {}: {}", acceptedSession.getId(), e.getMessage());
        }

        return session;
    }

    // ------------------- Reject session -------------------
    @Transactional
    public TherapySession rejectSession(Long sessionId) {
        TherapySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!BOOKED.equals(session.getStatus())) {
            throw new RuntimeException("Only booked sessions can be rejected");
        }

        session.setStatus(REJECTED);
        session = sessionRepository.save(session);

        notificationService.createNotification(
                session.getUserId(),
                "SESSION_REJECTED",
                "Your session on " + session.getDateTime() + " has been rejected");

        notificationService.createNotification(
                session.getPractitionerId(),
                "SESSION_REJECTED",
                "You have rejected the session on " + session.getDateTime());

        // ── Email notification to patient ──
        final TherapySession rejectedSession = session;
        try {
            SessionContext ctx = extractSessionContext(rejectedSession);
            String dtStr = rejectedSession.getDateTime().toString().replace("T", " at ");
            if (ctx.patientEmail != null) {
                emailService.sendSessionRejectedToPatient(
                        ctx.patientEmail, ctx.patientName,
                        ctx.therapyName, ctx.practitionerName, dtStr, null);
            }
        } catch (Exception e) {
            log.error("⚠️ Email notification failed for rejected session {}: {}", rejectedSession.getId(), e.getMessage());
        }

        return session;
    }

    // ------------------- Reject session with reason (Practitioner)
    // -------------------
    @Transactional
    public TherapySession rejectSession(Long sessionId, String reason) {
        TherapySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!BOOKED.equals(session.getStatus())) {
            throw new RuntimeException("Only booked sessions can be rejected");
        }

        session.setStatus(REJECTED);
        session.setRejectedReason(reason);
        session.setCancelledBy(CancelledBy.PRACTITIONER);

        session = sessionRepository.save(session);

        String address = getClinicAddress(session.getPractitionerId());

        notificationService.createNotification(
                session.getUserId(),
                "SESSION_REJECTED",
                "Your session on " + session.getDateTime() + " was rejected. Reason: " + reason + address);

        // ── Email notification to patient (with reason) ──
        final TherapySession rejectedWithReasonSession = session;
        try {
            SessionContext ctx = extractSessionContext(rejectedWithReasonSession);
            String dtStr = rejectedWithReasonSession.getDateTime().toString().replace("T", " at ");
            if (ctx.patientEmail != null) {
                emailService.sendSessionRejectedToPatient(
                        ctx.patientEmail, ctx.patientName,
                        ctx.therapyName, ctx.practitionerName, dtStr, reason);
            }
        } catch (Exception e) {
            log.error("⚠️ Email notification failed for rejected session {}: {}", rejectedWithReasonSession.getId(), e.getMessage());
        }

        return session;
    }

    // ------------------- Internal: extract common session context -------------------
    private SessionContext extractSessionContext(TherapySession session) {
        SessionContext ctx = new SessionContext();
        ctx.patientEmail = userRepository.findById(session.getUserId())
                .map(u -> u.getEmail()).orElse(null);
        ctx.patientName = userRepository.findById(session.getUserId())
                .map(u -> u.getName() != null ? u.getName() : "Patient").orElse("Patient");
        ctx.practitionerEmail = userRepository.findById(session.getPractitionerId())
                .map(u -> u.getEmail()).orElse(null);
        ctx.practitionerName = userRepository.findById(session.getPractitionerId())
                .map(u -> u.getName() != null ? u.getName() : "Practitioner").orElse("Practitioner");
        ctx.specialization = practitionerProfileRepository.findByUserId(session.getPractitionerId())
                .map(p -> p.getSpecialization() != null ? p.getSpecialization() : "").orElse("");
        ctx.clinicAddress = practitionerProfileRepository.findByUserId(session.getPractitionerId())
                .map(p -> p.getClinicAddress() != null ? p.getClinicAddress() : "").orElse("");
        ctx.therapyName = therapyRepository.findById(session.getTherapyId())
                .map(t -> t.getName() != null ? t.getName() : "Therapy").orElse("Therapy");
        return ctx;
    }

    private static class SessionContext {
        String patientEmail, patientName;
        String practitionerEmail, practitionerName;
        String specialization, clinicAddress, therapyName;
    }

    // ------------------- Get available slots -------------------
    public List<LocalDateTime> getAvailableSlots(Long practitionerId, String dateStr) {
        LocalDate date = (dateStr != null) ? LocalDate.parse(dateStr) : LocalDate.now();

        List<LocalDateTime> allSlots = new ArrayList<>();
        for (int hour = 9; hour < 17; hour++) {
            allSlots.add(LocalDateTime.of(date, LocalTime.of(hour, 0)));
        }

        List<TherapySession> sessions = sessionRepository.findByPractitionerId(practitionerId);

        sessions.stream()
                .filter(s -> s.getDateTime().toLocalDate().equals(date)
                        && s.getStatus() != CANCELLED
                        && s.getStatus() != REJECTED)
                .forEach(s -> allSlots.remove(s.getDateTime()));

        return allSlots;
    }

    // ------------------- Check if slot is booked -------------------
    public boolean isSlotBooked(Long therapyId, Long practitionerId, LocalDateTime dateTime) {
        return sessionRepository.existsByTherapyIdAndPractitionerIdAndDateTimeAndStatusNot(
                therapyId,
                practitionerId,
                dateTime,
                CANCELLED);
    }

    // ------------------- Get sessions by user & status -------------------
    public List<TherapySession> getSessionsByUserAndStatus(Long userId, String statusStr) {
        SessionStatus status = SessionStatus.valueOf(statusStr.toUpperCase());
        return sessionRepository.findByUserIdAndStatus(userId, status);
    }

}
