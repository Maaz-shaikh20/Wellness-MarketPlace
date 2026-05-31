package com.example.wellnessbackend;

import com.example.wellnessbackend.controller.RecommendationController;
import com.example.wellnessbackend.dto.RecommendationRequestDto;
import com.example.wellnessbackend.dto.RecommendationResponseDto;
import com.example.wellnessbackend.service.RecommendationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class RecommendationControllerTest {

    private MockMvc mockMvc;
    private StubRecommendationService stubService;
    private RecommendationController recommendationController;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Manual Stub Subclass to bypass Java 23 class-mocking issues
    private static class StubRecommendationService extends RecommendationService {
        public RecommendationResponseDto generateRecommendationResult;
        public List<RecommendationResponseDto> getRecommendationsByUserResult;
        public boolean deleteByIdResult;
        public int deleteAllByUserIdResult;

        public RecommendationRequestDto lastGenerateDto;
        public Long lastGetUserId;
        public Long lastDeleteId;
        public Long lastClearUserId;

        public StubRecommendationService() {
            super(null, null);
        }

        @Override
        public RecommendationResponseDto generateRecommendation(RecommendationRequestDto dto) {
            this.lastGenerateDto = dto;
            return generateRecommendationResult;
        }

        @Override
        public List<RecommendationResponseDto> getRecommendationsByUser(Long userId) {
            this.lastGetUserId = userId;
            return getRecommendationsByUserResult;
        }

        @Override
        public boolean deleteById(Long id) {
            this.lastDeleteId = id;
            return deleteByIdResult;
        }

        @Override
        public int deleteAllByUserId(Long userId) {
            this.lastClearUserId = userId;
            return deleteAllByUserIdResult;
        }
    }

    @BeforeEach
    void setUp() {
        stubService = new StubRecommendationService();
        recommendationController = new RecommendationController(stubService);
        mockMvc = MockMvcBuilders.standaloneSetup(recommendationController).build();
    }

    @Test
    void testGenerateRecommendation() throws Exception {
        RecommendationRequestDto requestDto = new RecommendationRequestDto();
        requestDto.setUserId(1L);
        requestDto.setSymptom("Anxiety");

        RecommendationResponseDto responseDto = new RecommendationResponseDto();
        responseDto.setId(100L);
        responseDto.setUserId(1L);
        responseDto.setSymptom("Anxiety");
        responseDto.setSuggestedTherapy("Yoga");
        responseDto.setSourceAPI("Rule-based AI Engine");

        stubService.generateRecommendationResult = responseDto;

        mockMvc.perform(post("/api/recommendations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.suggestedTherapy").value("Yoga"));

        assertNotNull(stubService.lastGenerateDto);
        assertEquals("Anxiety", stubService.lastGenerateDto.getSymptom());
    }

    @Test
    void testGetRecommendationsByUser() throws Exception {
        RecommendationResponseDto responseDto = new RecommendationResponseDto();
        responseDto.setId(100L);
        responseDto.setUserId(1L);
        responseDto.setSymptom("Anxiety");
        responseDto.setSuggestedTherapy("Yoga");

        stubService.getRecommendationsByUserResult = Collections.singletonList(responseDto);

        mockMvc.perform(get("/api/recommendations/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(100L));

        assertEquals(1L, stubService.lastGetUserId);
    }

    @Test
    void testDeleteRecommendation_Success() throws Exception {
        stubService.deleteByIdResult = true;

        mockMvc.perform(delete("/api/recommendations/100"))
                .andExpect(status().isOk())
                .andExpect(content().string("Recommendation deleted successfully"));

        assertEquals(100L, stubService.lastDeleteId);
    }

    @Test
    void testDeleteRecommendation_NotFound() throws Exception {
        stubService.deleteByIdResult = false;

        mockMvc.perform(delete("/api/recommendations/100"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Recommendation not found with id: 100"));

        assertEquals(100L, stubService.lastDeleteId);
    }

    @Test
    void testClearAllRecommendations() throws Exception {
        stubService.deleteAllByUserIdResult = 5;

        mockMvc.perform(delete("/api/recommendations/user/1/all"))
                .andExpect(status().isOk())
                .andExpect(content().string("Cleared 5 recommendations for user 1"));

        assertEquals(1L, stubService.lastClearUserId);
    }
}
