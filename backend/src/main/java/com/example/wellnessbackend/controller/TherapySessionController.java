package com.example.wellnessbackend.controller;
import com.example.wellnessbackend.dto.SessionRejectDto;
import com.example.wellnessbackend.dto.SessionCancelDto;
import com.example.wellnessbackend.dto.TherapySessionDto;
import com.example.wellnessbackend.entity.TherapySession;
import com.example.wellnessbackend.service.TherapySessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class TherapySessionController {

    private final TherapySessionService sessionService;

    // ------------------- Book a new session -------------------
    @PostMapping("/book")
    public ResponseEntity<?> bookSession(@RequestBody TherapySessionDto dto) {
        try {
            TherapySession session = sessionService.bookSession(dto);
            return ResponseEntity.ok(session);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    // ------------------- Get sessions for a user -------------------
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TherapySession>> getUserSessions(@PathVariable Long userId) {
        return ResponseEntity.ok(sessionService.getSessionsByUser(userId));
    }

    // ------------------- Get sessions for a practitioner -------------------
    @GetMapping("/practitioner/{id}")
    public ResponseEntity<List<TherapySession>> getPractitionerSessions(@PathVariable Long id) {
        return ResponseEntity.ok(sessionService.getSessionsByPractitioner(id));
    }

    // ------------------- Update session status or notes -------------------
    @PatchMapping("/{id}")
    public ResponseEntity<?> updateSession(@PathVariable Long id,
                                           @RequestBody TherapySessionDto dto) {
        try {
            TherapySession updated = sessionService.updateSession(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(Map.of("message", ex.getMessage()));
        }
    }

    // ------------------- CANCEL session (SOFT CANCEL) -------------------
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelSession(@PathVariable Long id) {
        try {
            TherapySession cancelled = sessionService.cancelSession(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Session cancelled successfully",
                    "session", cancelled
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
    // ------------------- CANCEL accepted session with reason (User) -------------------
    @PutMapping("/{id}/cancel-with-reason")
    public ResponseEntity<?> cancelSessionWithReason(
            @PathVariable Long id,
            @RequestBody SessionCancelDto dto) {

        try {
            TherapySession cancelled =
                    sessionService.cancelSessionByUser(id, dto.getReason());

            return ResponseEntity.ok(Map.of(
                    "message", "Session cancelled successfully",
                    "session", cancelled
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    // ------------------- ACCEPT session -------------------
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptSession(@PathVariable Long id) {
        try {
            TherapySession accepted = sessionService.acceptSession(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Session accepted successfully",
                    "session", accepted
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    // ------------------- REJECT session -------------------
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectSession(@PathVariable Long id) {
        try {
            TherapySession rejected = sessionService.rejectSession(id);
            return ResponseEntity.ok(Map.of(
                    "message", "Session rejected successfully",
                    "session", rejected
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
    // ------------------- REJECT session with reason (Practitioner) -------------------
    @PutMapping("/{id}/reject-with-reason")
    public ResponseEntity<?> rejectSessionWithReason(
            @PathVariable Long id,
            @RequestBody SessionRejectDto dto) {

        try {
            TherapySession rejected =
                    sessionService.rejectSession(id, dto.getReason());

            return ResponseEntity.ok(Map.of(
                    "message", "Session rejected successfully",
                    "session", rejected
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    // ------------------- Check slot availability -------------------
    @PostMapping("/check-slot")
    public ResponseEntity<?> checkSlotAvailability(@RequestBody TherapySessionDto dto) {
        boolean isBooked = sessionService.isSlotBooked(
                dto.getTherapyId(),
                dto.getPractitionerId(),
                dto.getDateTime()
        );

        if (isBooked) {
            return ResponseEntity.badRequest().body("Slot already booked");
        }
        return ResponseEntity.ok("Slot available");
    }

    // ------------------- Get ACCEPTED sessions for a user -------------------
    @GetMapping("/user/{userId}/accepted")
    public ResponseEntity<List<TherapySession>> getAcceptedSessionsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                sessionService.getSessionsByUserAndStatus(userId, "ACCEPTED")
        );
    }

    // ------------------- Get BOOKED sessions for a user -------------------
    @GetMapping("/user/{userId}/booked")
    public ResponseEntity<List<TherapySession>> getBookedSessionsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                sessionService.getSessionsByUserAndStatus(userId, "BOOKED")
        );
    }

    // ------------------- Get REJECTED sessions for a user -------------------
    @GetMapping("/user/{userId}/rejected")
    public ResponseEntity<List<TherapySession>> getRejectedSessionsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                sessionService.getSessionsByUserAndStatus(userId, "REJECTED")
        );
    }

    // ------------------- Get COMPLETED sessions for a user -------------------
    @GetMapping("/user/{userId}/completed")
    public ResponseEntity<List<TherapySession>> getCompletedSessionsByUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                sessionService.getSessionsByUserAndStatus(userId, "COMPLETED")
        );
    }


}
