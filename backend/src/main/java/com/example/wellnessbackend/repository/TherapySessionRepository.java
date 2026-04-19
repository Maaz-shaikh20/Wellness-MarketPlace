package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.TherapySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TherapySessionRepository extends JpaRepository<TherapySession, Long> {

    // Get all sessions for a user
    List<TherapySession> findByUserId(Long userId);

    // Get all sessions for a practitioner
    List<TherapySession> findByPractitionerId(Long practitionerId);
    // Get sessions for a user by status
    List<TherapySession> findByUserIdAndStatus(Long userId, String status);


    // ✅ Slot is considered booked ONLY if status != CANCELLED
    boolean existsByTherapyIdAndPractitionerIdAndDateTimeAndStatusNot(
            Long therapyId,
            Long practitionerId,
            LocalDateTime dateTime,
            String status
    );
}
