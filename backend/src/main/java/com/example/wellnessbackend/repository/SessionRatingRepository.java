package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.SessionRating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRatingRepository extends JpaRepository<SessionRating, Long> {

    /** Check if a user has already rated a specific session */
    Optional<SessionRating> findBySessionIdAndUserId(Long sessionId, Long userId);

    /** All ratings for a practitioner — used to recalculate their average */
    List<SessionRating> findByPractitionerId(Long practitionerId);

    /** All ratings submitted by a user */
    List<SessionRating> findByUserId(Long userId);
}
