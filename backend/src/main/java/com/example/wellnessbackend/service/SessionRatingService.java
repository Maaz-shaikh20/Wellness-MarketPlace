package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.SessionRatingDto;
import com.example.wellnessbackend.entity.PractitionerProfile;
import com.example.wellnessbackend.entity.SessionRating;
import com.example.wellnessbackend.entity.SessionStatus;
import com.example.wellnessbackend.entity.TherapySession;
import com.example.wellnessbackend.repository.PractitionerProfileRepository;
import com.example.wellnessbackend.repository.SessionRatingRepository;
import com.example.wellnessbackend.repository.TherapySessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SessionRatingService {

    private final SessionRatingRepository ratingRepository;
    private final TherapySessionRepository sessionRepository;
    private final PractitionerProfileRepository practitionerProfileRepository;

    // ──────────────────────────────────────────────────────────────
    // SUBMIT RATING
    // ──────────────────────────────────────────────────────────────
    @Transactional
    public SessionRating submitRating(SessionRatingDto dto) {

        // 1. Validate the session exists
        TherapySession session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        // 2. Only COMPLETED sessions can be rated
        if (session.getStatus() != SessionStatus.COMPLETED) {
            throw new RuntimeException("Only completed sessions can be rated");
        }

        // 3. Prevent duplicate ratings (one per session per user)
        if (ratingRepository.findBySessionIdAndUserId(dto.getSessionId(), dto.getUserId()).isPresent()) {
            throw new RuntimeException("You have already rated this session");
        }

        // 4. Validate rating range
        if (dto.getRating() == null || dto.getRating() < 1 || dto.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }

        // 5. Save the rating
        SessionRating rating = SessionRating.builder()
                .sessionId(dto.getSessionId())
                .userId(dto.getUserId())
                .practitionerId(dto.getPractitionerId())
                .rating(dto.getRating())
                .comment(dto.getComment())
                .createdAt(LocalDateTime.now())
                .build();

        rating = ratingRepository.save(rating);

        // 6. Recalculate and update practitioner's average rating
        recalculatePractitionerRating(dto.getPractitionerId());

        log.info("⭐ Session {} rated {} stars by user {}", dto.getSessionId(), dto.getRating(), dto.getUserId());
        return rating;
    }

    // ──────────────────────────────────────────────────────────────
    // CHECK IF ALREADY RATED
    // ──────────────────────────────────────────────────────────────
    public Optional<SessionRating> getRatingBySessionAndUser(Long sessionId, Long userId) {
        return ratingRepository.findBySessionIdAndUserId(sessionId, userId);
    }

    // ──────────────────────────────────────────────────────────────
    // GET ALL RATINGS FOR A PRACTITIONER
    // ──────────────────────────────────────────────────────────────
    public List<SessionRating> getRatingsByPractitioner(Long practitionerId) {
        return ratingRepository.findByPractitionerId(practitionerId);
    }

    // ──────────────────────────────────────────────────────────────
    // RECALCULATE PRACTITIONER AVERAGE RATING
    // ──────────────────────────────────────────────────────────────
    private void recalculatePractitionerRating(Long practitionerId) {
        List<SessionRating> allRatings = ratingRepository.findByPractitionerId(practitionerId);

        if (allRatings.isEmpty()) return;

        double average = allRatings.stream()
                .mapToInt(SessionRating::getRating)
                .average()
                .orElse(0.0);

        // Round to 1 decimal place
        double rounded = Math.round(average * 10.0) / 10.0;

        practitionerProfileRepository.findByUserId(practitionerId).ifPresent(profile -> {
            profile.setRating(rounded);
            practitionerProfileRepository.save(profile);
            log.info("📊 Practitioner {} average rating updated to {}", practitionerId, rounded);
        });
    }

    // ──────────────────────────────────────────────────────────────
    // GET RATING SUMMARY (for API response)
    // ──────────────────────────────────────────────────────────────
    public Map<String, Object> getRatingSummary(Long practitionerId) {
        List<SessionRating> ratings = ratingRepository.findByPractitionerId(practitionerId);
        if (ratings.isEmpty()) {
            return Map.of("average", 0.0, "count", 0);
        }
        double avg = ratings.stream().mapToInt(SessionRating::getRating).average().orElse(0.0);
        return Map.of(
                "average", Math.round(avg * 10.0) / 10.0,
                "count", ratings.size()
        );
    }
}
