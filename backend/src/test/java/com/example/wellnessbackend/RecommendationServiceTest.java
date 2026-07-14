package com.example.wellnessbackend;

import com.example.wellnessbackend.dto.RecommendationRequestDto;
import com.example.wellnessbackend.dto.RecommendationResponseDto;
import com.example.wellnessbackend.entity.Notification;
import com.example.wellnessbackend.entity.Recommendation;
import com.example.wellnessbackend.repository.NotificationRepository;
import com.example.wellnessbackend.repository.RecommendationRepository;
import com.example.wellnessbackend.service.RecommendationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Fix #17: Comprehensive unit tests for RecommendationService.
 * Verifies each symptom category maps to the correct therapy recommendation.
 */
@ExtendWith(MockitoExtension.class)
public class RecommendationServiceTest {

    @Mock
    private RecommendationRepository recommendationRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private RecommendationService recommendationService;

    @BeforeEach
    void setUp() {
        // Stub save calls — return a dummy Recommendation with whatever is passed
        lenient().when(recommendationRepository.save(any(Recommendation.class)))
                .thenAnswer(invocation -> {
                    Recommendation r = invocation.getArgument(0);
                    r.setId(1L);
                    r.setCreatedAt(LocalDateTime.now());
                    return r;
                });
        lenient().when(notificationRepository.save(any(Notification.class)))
                .thenReturn(new Notification());
    }

    // ── Helper ──────────────────────────────────────────────────────────────
    private String recommend(String symptom) {
        RecommendationRequestDto dto = new RecommendationRequestDto();
        dto.setUserId(1L);
        dto.setSymptom(symptom);
        RecommendationResponseDto result = recommendationService.generateRecommendation(dto);
        return result.getSuggestedTherapy();
    }

    // ── Cardiovascular ───────────────────────────────────────────────────────
    @Test
    @DisplayName("Chest pain → Cardiac Yoga with safety warning")
    void testChestPainRecommendation() {
        String therapy = recommend("chest pain");
        assertTrue(therapy.toLowerCase().contains("cardiac") || therapy.toLowerCase().contains("yoga"),
                "Expected cardiac or yoga for chest pain, got: " + therapy);
        assertTrue(therapy.contains("—"), "Should include safety note separator '—'");
    }

    // ── Musculoskeletal ──────────────────────────────────────────────────────
    @Test
    @DisplayName("Back pain → Physiotherapy / Chiropractic")
    void testBackPainRecommendation() {
        String therapy = recommend("lower back pain");
        assertTrue(therapy.toLowerCase().contains("physiotherapy") || therapy.toLowerCase().contains("chiropractic"),
                "Expected physiotherapy for back pain, got: " + therapy);
    }

    @Test
    @DisplayName("Knee pain → Acupuncture / Physiotherapy")
    void testKneeInflammationRecommendation() {
        String therapy = recommend("knee pain");
        assertTrue(therapy.toLowerCase().contains("acupuncture") || therapy.toLowerCase().contains("physiotherapy"),
                "Expected acupuncture for knee, got: " + therapy);
    }

    @Test
    @DisplayName("Neck stiffness → Chiropractic / Acupuncture")
    void testNeckPainRecommendation() {
        String therapy = recommend("neck stiffness");
        assertTrue(therapy.toLowerCase().contains("chiropractic") || therapy.toLowerCase().contains("acupuncture"),
                "Expected chiro for neck, got: " + therapy);
    }

    // ── Mental Health ────────────────────────────────────────────────────────
    @Test
    @DisplayName("Stress → Mindfulness / Yoga")
    void testStressRecommendation() {
        String therapy = recommend("feeling very stressed and overwhelmed");
        assertTrue(therapy.toLowerCase().contains("mindfulness") || therapy.toLowerCase().contains("yoga"),
                "Expected mindfulness for stress, got: " + therapy);
    }

    @Test
    @DisplayName("Anxiety → Yoga / Pranayama")
    void testAnxietyRecommendation() {
        String therapy = recommend("anxiety and panic attacks");
        assertTrue(therapy.toLowerCase().contains("yoga") || therapy.toLowerCase().contains("pranayama")
                || therapy.toLowerCase().contains("aromatherapy"),
                "Expected yoga/pranayama for anxiety, got: " + therapy);
    }

    @Test
    @DisplayName("Depression → Mindfulness Therapy")
    void testDepressionRecommendation() {
        String therapy = recommend("feeling depressed and hopeless");
        assertTrue(therapy.toLowerCase().contains("mindfulness") || therapy.toLowerCase().contains("meditation"),
                "Expected mindfulness for depression, got: " + therapy);
    }

    // ── Sleep ────────────────────────────────────────────────────────────────
    @Test
    @DisplayName("Insomnia → Sleep Hygiene / Yoga Nidra")
    void testInsomniaRecommendation() {
        String therapy = recommend("insomnia, cannot sleep");
        assertTrue(therapy.toLowerCase().contains("sleep") || therapy.toLowerCase().contains("nidra"),
                "Expected sleep therapy for insomnia, got: " + therapy);
    }

    // ── Digestive ────────────────────────────────────────────────────────────
    @Test
    @DisplayName("Bloating / Indigestion → Ayurvedic")
    void testBloatingRecommendation() {
        String therapy = recommend("bloating and indigestion");
        assertTrue(therapy.toLowerCase().contains("ayurvedic") || therapy.toLowerCase().contains("herbal"),
                "Expected ayurveda for digestion, got: " + therapy);
    }

    // ── Unknown symptom fallback ─────────────────────────────────────────────
    @Test
    @DisplayName("Unknown symptom → Holistic Wellness Assessment fallback")
    void testUnknownSymptomFallback() {
        String therapy = recommend("xyz unknown condition");
        assertTrue(therapy.toLowerCase().contains("holistic") || therapy.toLowerCase().contains("assessment"),
                "Expected holistic fallback for unknown symptom, got: " + therapy);
    }

    // ── Repository interaction ───────────────────────────────────────────────
    @Test
    @DisplayName("Generates recommendation → saves to DB and sends notification")
    void testSavesRecommendationAndNotification() {
        recommend("headache");
        verify(recommendationRepository, times(1)).save(any(Recommendation.class));
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    @DisplayName("Get by user → returns ordered list")
    void testGetRecommendationsByUser() {
        Recommendation r = Recommendation.builder()
                .id(5L).userId(1L).symptom("stress")
                .suggestedTherapy("Yoga").sourceAPI("engine")
                .createdAt(LocalDateTime.now()).build();

        when(recommendationRepository.findByUserIdOrderByCreatedAtDesc(1L))
                .thenReturn(Arrays.asList(r));

        List<RecommendationResponseDto> list = recommendationService.getRecommendationsByUser(1L);

        assertEquals(1, list.size());
        assertEquals(5L, list.get(0).getId());
    }

    @Test
    @DisplayName("Delete existing recommendation → returns true")
    void testDeleteById_Success() {
        when(recommendationRepository.existsById(10L)).thenReturn(true);
        doNothing().when(recommendationRepository).deleteById(10L);
        assertTrue(recommendationService.deleteById(10L));
    }

    @Test
    @DisplayName("Delete non-existent recommendation → returns false")
    void testDeleteById_NotFound() {
        when(recommendationRepository.existsById(99L)).thenReturn(false);
        assertFalse(recommendationService.deleteById(99L));
        verify(recommendationRepository, never()).deleteById(anyLong());
    }
}
