package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.SessionRatingDto;
import com.example.wellnessbackend.entity.SessionRating;
import com.example.wellnessbackend.service.SessionRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/session-ratings")
@RequiredArgsConstructor
public class SessionRatingController {

    private final SessionRatingService ratingService;

    // ──────────────────────────────────────────────────────────────
    // SUBMIT A RATING
    // POST /api/session-ratings
    // Body: { sessionId, userId, practitionerId, rating (1-5), comment }
    // ──────────────────────────────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> submitRating(@RequestBody SessionRatingDto dto) {
        try {
            SessionRating saved = ratingService.submitRating(dto);
            return ResponseEntity.ok(Map.of(
                    "message", "Rating submitted successfully",
                    "ratingId", saved.getId(),
                    "rating", saved.getRating()
            ));
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }

    // ──────────────────────────────────────────────────────────────
    // CHECK IF SESSION IS ALREADY RATED BY USER
    // GET /api/session-ratings/session/{sessionId}/user/{userId}
    // Returns: { rated: true/false, rating: 4, comment: "..." }
    // ──────────────────────────────────────────────────────────────
    @GetMapping("/session/{sessionId}/user/{userId}")
    public ResponseEntity<?> checkRating(
            @PathVariable Long sessionId,
            @PathVariable Long userId) {

        Optional<SessionRating> existing = ratingService.getRatingBySessionAndUser(sessionId, userId);
        if (existing.isPresent()) {
            SessionRating r = existing.get();
            return ResponseEntity.ok(Map.of(
                    "rated", true,
                    "rating", r.getRating(),
                    "comment", r.getComment() != null ? r.getComment() : ""
            ));
        }
        return ResponseEntity.ok(Map.of("rated", false));
    }

    // ──────────────────────────────────────────────────────────────
    // GET RATING SUMMARY FOR A PRACTITIONER
    // GET /api/session-ratings/practitioner/{practitionerId}/summary
    // ──────────────────────────────────────────────────────────────
    @GetMapping("/practitioner/{practitionerId}/summary")
    public ResponseEntity<?> getPractitionerRatingSummary(@PathVariable Long practitionerId) {
        return ResponseEntity.ok(ratingService.getRatingSummary(practitionerId));
    }
}
