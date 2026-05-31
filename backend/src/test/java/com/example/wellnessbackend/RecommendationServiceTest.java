package com.example.wellnessbackend;

import com.example.wellnessbackend.dto.RecommendationRequestDto;
import com.example.wellnessbackend.dto.RecommendationResponseDto;
import com.example.wellnessbackend.entity.Notification;
import com.example.wellnessbackend.entity.Recommendation;
import com.example.wellnessbackend.repository.NotificationRepository;
import com.example.wellnessbackend.repository.RecommendationRepository;
import com.example.wellnessbackend.service.RecommendationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class RecommendationServiceTest {

    @Mock
    private RecommendationRepository recommendationRepository;

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private RecommendationService recommendationService;

    private RecommendationRequestDto requestDto;
    private Recommendation recommendation;

    @BeforeEach
    void setUp() {
        requestDto = new RecommendationRequestDto();
        requestDto.setUserId(1L);
        requestDto.setSymptom("Severe back pain and spine stiffness");

        recommendation = Recommendation.builder()
                .id(100L)
                .userId(1L)
                .symptom("Severe back pain and spine stiffness")
                .suggestedTherapy("Physiotherapy / Chiropractic")
                .sourceAPI("Rule-based AI Engine")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testGenerateRecommendation() {
        when(recommendationRepository.save(any(Recommendation.class))).thenReturn(recommendation);
        when(notificationRepository.save(any(Notification.class))).thenReturn(new Notification());

        RecommendationResponseDto responseDto = recommendationService.generateRecommendation(requestDto);

        assertNotNull(responseDto);
        assertEquals(100L, responseDto.getId());
        assertEquals(1L, responseDto.getUserId());
        assertEquals("Severe back pain and spine stiffness", responseDto.getSymptom());
        assertEquals("Physiotherapy / Chiropractic", responseDto.getSuggestedTherapy());
        assertEquals("Rule-based AI Engine", responseDto.getSourceAPI());

        verify(recommendationRepository, times(1)).save(any(Recommendation.class));
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void testGetRecommendationsByUser() {
        when(recommendationRepository.findByUserIdOrderByCreatedAtDesc(1L))
                .thenReturn(Arrays.asList(recommendation));

        List<RecommendationResponseDto> list = recommendationService.getRecommendationsByUser(1L);

        assertEquals(1, list.size());
        assertEquals(100L, list.get(0).getId());
        verify(recommendationRepository, times(1)).findByUserIdOrderByCreatedAtDesc(1L);
    }

    @Test
    void testDeleteById_Success() {
        when(recommendationRepository.existsById(100L)).thenReturn(true);
        doNothing().when(recommendationRepository).deleteById(100L);

        boolean result = recommendationService.deleteById(100L);

        assertTrue(result);
        verify(recommendationRepository, times(1)).existsById(100L);
        verify(recommendationRepository, times(1)).deleteById(100L);
    }

    @Test
    void testDeleteById_NotFound() {
        when(recommendationRepository.existsById(100L)).thenReturn(false);

        boolean result = recommendationService.deleteById(100L);

        assertFalse(result);
        verify(recommendationRepository, times(1)).existsById(100L);
        verify(recommendationRepository, never()).deleteById(anyLong());
    }

    @Test
    void testDeleteAllByUserId() {
        List<Recommendation> list = Arrays.asList(recommendation);
        when(recommendationRepository.findByUserIdOrderByCreatedAtDesc(1L)).thenReturn(list);
        doNothing().when(recommendationRepository).deleteAll(list);

        int count = recommendationService.deleteAllByUserId(1L);

        assertEquals(1, count);
        verify(recommendationRepository, times(1)).findByUserIdOrderByCreatedAtDesc(1L);
        verify(recommendationRepository, times(1)).deleteAll(list);
    }
}
