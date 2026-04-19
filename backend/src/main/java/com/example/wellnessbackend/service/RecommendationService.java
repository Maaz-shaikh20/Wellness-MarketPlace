package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.RecommendationRequestDto;
import com.example.wellnessbackend.dto.RecommendationResponseDto;
import com.example.wellnessbackend.entity.Notification;
import com.example.wellnessbackend.entity.Recommendation;
import com.example.wellnessbackend.repository.NotificationRepository;
import com.example.wellnessbackend.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final NotificationRepository notificationRepository;

    // Generate recommendation and save in DB
    public RecommendationResponseDto generateRecommendation(RecommendationRequestDto dto) {

        String symptom = dto.getSymptom().toLowerCase();
        String suggestedTherapy;

        // Simple rule-based AI logic
        if (symptom.contains("back pain") || symptom.contains("spine")) {
            suggestedTherapy = "Physiotherapy / Chiropractic";
        } else if (symptom.contains("stress") || symptom.contains("anxiety")) {
            suggestedTherapy = "Yoga / Meditation / Ayurveda";
        } else if (symptom.contains("joint") || symptom.contains("knee")) {
            suggestedTherapy = "Physiotherapy / Acupuncture";
        } else if (symptom.contains("skin")) {
            suggestedTherapy = "Ayurveda / Dermatology Consultation";
        } else {
            suggestedTherapy = "General Wellness Therapy";
        }

        String sourceAPI = "Rule-based AI Engine";

        // Create recommendation entity
        Recommendation recommendation = Recommendation.builder()
                .userId(dto.getUserId())
                .symptom(dto.getSymptom())
                .suggestedTherapy(suggestedTherapy)
                .sourceAPI(sourceAPI)
                .createdAt(LocalDateTime.now()) // match your entity field
                .build();

        Recommendation saved = recommendationRepository.save(recommendation);

        // Trigger notification
        Notification notification = Notification.builder()
                .userId(dto.getUserId())
                .type("RECOMMENDATION")
                .message("New therapy recommendation available: " + suggestedTherapy)
                .read(false) // match your Notification entity
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        return mapToResponseDto(saved);
    }

    // Fetch all recommendations of a user
    public List<RecommendationResponseDto> getRecommendationsByUser(Long userId) {
        List<Recommendation> list = recommendationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return list.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }

    private RecommendationResponseDto mapToResponseDto(Recommendation recommendation) {
        RecommendationResponseDto dto = new RecommendationResponseDto();
        dto.setId(recommendation.getId());
        dto.setUserId(recommendation.getUserId());
        dto.setSymptom(recommendation.getSymptom());
        dto.setSuggestedTherapy(recommendation.getSuggestedTherapy());
        dto.setSourceAPI(recommendation.getSourceAPI());
        dto.setCreatedAt(recommendation.getCreatedAt()); // use createdAt
        return dto;
    }
}
