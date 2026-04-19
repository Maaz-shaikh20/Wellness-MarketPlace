package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {

    // Fetch all recommendations for a specific user (latest first)
    List<Recommendation> findByUserIdOrderByCreatedAtDesc(Long userId);
}
