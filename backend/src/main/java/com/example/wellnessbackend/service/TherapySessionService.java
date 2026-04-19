package com.example.wellnessbackend.service;
import com.example.wellnessbackend.entity.CancelledBy;
import com.example.wellnessbackend.dto.TherapySessionDto;
import com.example.wellnessbackend.entity.TherapySession;
import com.example.wellnessbackend.repository.TherapySessionRepository;
import com.example.wellnessbackend.repository.PractitionerProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TherapySessionService {

    private final TherapySessionRepository sessionRepository;
    private final NotificationService notificationService;
    private final PractitionerProfileRepository practitionerProfileRepository;

    // ------------------- Helper: get clinic address -------------------
    private String getClinicAddress(Long practitionerId) {
        return practitionerProfileRepository.findByUserId(practitionerId)
                .map(p -> p.getClinicAddress() != null && !p.getClinicAddress().isBlank()
                        ? " | 📍 Location: " + p.getClinicAddress()
                        : "")
                .orElse("");
    }

    private static final String BOOKED = "BOOKED";
    private static final String COMPLETED = "COMPLETED";
    private static final String CANCELLED = "CANCELLED";
    private static final String REJECTED = "REJECTED";
    private static final String ACCEPTED = "ACCEPTED";

    // ------------------- Book a new therapy session -------------------
    public TherapySession bookSession(TherapySessionDto dto) {
        if (dto.getDateTime().getMinute() != 0) {
            throw new RuntimeException("Invalid slot. Please select a valid hourly slot.");
        }

        List<LocalDateTime> availableSlots = getAvailableSlots(
                dto.getPractitionerId(),
                dto.getDateTime().toLocalDate().toString()
        );

        if (!availableSlots.contains(dto.getDateTime())) {
            throw new RuntimeException("Selected slot is no longer available");
        }

        boolean alreadyBooked =
                sessionRepository.existsByTherapyIdAndPractitionerIdAndDateTimeAndStatusNot(
                        dto.getTherapyId(),
                        dto.getPractitionerId(),
                        dto.getDateTime(),
                        CANCELLED
                );

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
                "Your session is booked for " + session.getDateTime() + address
        );

        notificationService.createNotification(
                session.getPractitionerId(),
                "SESSION_BOOKED",
                "You have a new session at " + session.getDateTime() + address
        );

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
            String newStatus = dto.getStatus().toUpperCase();

            if (CANCELLED.equalsIgnoreCase(session.getStatus()) || REJECTED.equalsIgnoreCase(session.getStatus())) {
                throw new RuntimeException("Cancelled/Rejected session cannot be updated");
            }

            session.setStatus(newStatus);

            if (COMPLETED.equals(newStatus)) {
                notificationService.createNotification(
                        session.getUserId(),
                        "SESSION_COMPLETED",
                        "Your session on " + session.getDateTime() + " is completed"
                );

                notificationService.createNotification(
                        session.getPractitionerId(),
                        "SESSION_COMPLETED",
                        "You completed a session on " + session.getDateTime()
                );
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

        if (COMPLETED.equalsIgnoreCase(session.getStatus())) {
            throw new RuntimeException("Completed session cannot be cancelled");
        }

        if (CANCELLED.equalsIgnoreCase(session.getStatus())) {
            throw new RuntimeException("Session already cancelled");
        }

        session.setStatus(CANCELLED);
        session = sessionRepository.save(session);

        String address = getClinicAddress(session.getPractitionerId());

        notificationService.createNotification(
                session.getUserId(),
                "SESSION_CANCELLED",
                "Your session on " + session.getDateTime() + " has been cancelled" + address
        );

        notificationService.createNotification(
                session.getPractitionerId(),
                "SESSION_CANCELLED",
                "Session on " + session.getDateTime() + " has been cancelled" + address
        );

        return session;
    }
    // ------------------- Cancel accepted session by user with reason -------------------
    @Transactional
    public TherapySession cancelSessionByUser(Long sessionId, String reason) {
        TherapySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!ACCEPTED.equalsIgnoreCase(session.getStatus())) {
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
                "Session on " + session.getDateTime() + " was cancelled by user. Reason: " + reason + address
        );

        return session;
    }

    // ------------------- Accept session -------------------
    @Transactional
    public TherapySession acceptSession(Long sessionId) {
        TherapySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!BOOKED.equalsIgnoreCase(session.getStatus())) {
            throw new RuntimeException("Only booked sessions can be accepted");
        }

        session.setStatus(ACCEPTED);
        session = sessionRepository.save(session);

        String address = getClinicAddress(session.getPractitionerId());

        notificationService.createNotification(
                session.getUserId(),
                "SESSION_ACCEPTED",
                "Your session on " + session.getDateTime() + " has been accepted" + address
        );

        notificationService.createNotification(
                session.getPractitionerId(),
                "SESSION_ACCEPTED",
                "You have accepted the session on " + session.getDateTime() + address
        );

        return session;
    }

    // ------------------- Reject session -------------------
    @Transactional
    public TherapySession rejectSession(Long sessionId) {
        TherapySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!BOOKED.equalsIgnoreCase(session.getStatus())) {
            throw new RuntimeException("Only booked sessions can be rejected");
        }

        session.setStatus(REJECTED);
        session = sessionRepository.save(session);

        notificationService.createNotification(
                session.getUserId(),
                "SESSION_REJECTED",
                "Your session on " + session.getDateTime() + " has been rejected"
        );

        notificationService.createNotification(
                session.getPractitionerId(),
                "SESSION_REJECTED",
                "You have rejected the session on " + session.getDateTime()
        );

        return session;
    }
    // ------------------- Reject session with reason (Practitioner) -------------------
    @Transactional
    public TherapySession rejectSession(Long sessionId, String reason) {
        TherapySession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!BOOKED.equalsIgnoreCase(session.getStatus())) {
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
                "Your session on " + session.getDateTime() + " was rejected. Reason: " + reason + address
        );

        return session;
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
                        && !CANCELLED.equalsIgnoreCase(s.getStatus())
                        && !REJECTED.equalsIgnoreCase(s.getStatus()))
                .forEach(s -> allSlots.remove(s.getDateTime()));

        return allSlots;
    }

    // ------------------- Check if slot is booked -------------------
    public boolean isSlotBooked(Long therapyId, Long practitionerId, LocalDateTime dateTime) {
        return sessionRepository.existsByTherapyIdAndPractitionerIdAndDateTimeAndStatusNot(
                therapyId,
                practitionerId,
                dateTime,
                CANCELLED
        );
    }
    // ------------------- Get sessions by user & status -------------------
    public List<TherapySession> getSessionsByUserAndStatus(Long userId, String status) {
        return sessionRepository.findByUserIdAndStatus(userId, status);
    }



}
