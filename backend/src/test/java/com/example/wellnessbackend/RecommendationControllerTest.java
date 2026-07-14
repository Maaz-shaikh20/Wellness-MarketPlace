package com.example.wellnessbackend;

import com.example.wellnessbackend.controller.RecommendationController;
import com.example.wellnessbackend.dto.RecommendationRequestDto;
import com.example.wellnessbackend.dto.RecommendationResponseDto;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.entity.Role;
import com.example.wellnessbackend.repository.UserRepository;
import com.example.wellnessbackend.service.RecommendationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Fix #17: Updated RecommendationControllerTest to use @WebMvcTest (not standalone setup).
 * This properly handles the Authentication injection added in Fix #2.
 */
@WebMvcTest(controllers = RecommendationController.class)
@Import({com.example.wellnessbackend.security.RateLimitFilter.class})
public class RecommendationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RecommendationService recommendationService;

    @MockBean
    private UserRepository userRepository;

    // Required by Spring Security auto-config in @WebMvcTest context
    @MockBean
    private com.example.wellnessbackend.security.JwtUtil jwtUtil;

    @MockBean
    private com.example.wellnessbackend.security.CustomUserDetailsService userDetailsService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ── POST /api/recommendations ──────────────────────────────────────────

    @Test
    @WithMockUser(username = "test@wellnest.com", roles = {"PATIENT"})
    @DisplayName("POST /api/recommendations → 201 with therapy result")
    void testGenerateRecommendation() throws Exception {
        // Stub userRepository lookup (Fix #2: controller resolves user from JWT email)
        User mockUser = new User();
        mockUser.setId(1L);
        mockUser.setEmail("test@wellnest.com");
        mockUser.setRole(Role.PATIENT);
        when(userRepository.findByEmail("test@wellnest.com")).thenReturn(Optional.of(mockUser));

        RecommendationResponseDto responseDto = new RecommendationResponseDto();
        responseDto.setId(100L);
        responseDto.setUserId(1L);
        responseDto.setSymptom("Anxiety");
        responseDto.setSuggestedTherapy("Yoga / Pranayama");
        responseDto.setSourceAPI("Wellnest Rule-Based Wellness Engine v2");

        when(recommendationService.generateRecommendation(any())).thenReturn(responseDto);

        RecommendationRequestDto requestDto = new RecommendationRequestDto();
        requestDto.setSymptom("Anxiety");

        mockMvc.perform(post("/api/recommendations")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(100L))
                .andExpect(jsonPath("$.suggestedTherapy").value("Yoga / Pranayama"));
    }

    @Test
    @WithMockUser(username = "test@wellnest.com", roles = {"PATIENT"})
    @DisplayName("POST /api/recommendations with blank symptom → 400 validation error")
    void testGenerateRecommendation_BlankSymptom_Returns400() throws Exception {
        RecommendationRequestDto badDto = new RecommendationRequestDto();
        badDto.setSymptom(""); // @NotBlank should reject this

        mockMvc.perform(post("/api/recommendations")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(badDto)))
                .andExpect(status().isBadRequest());
    }

    // ── GET /api/recommendations/user/{userId} ────────────────────────────

    @Test
    @WithMockUser(roles = {"PATIENT"})
    @DisplayName("GET /api/recommendations/user/1 → returns list")
    void testGetRecommendationsByUser() throws Exception {
        RecommendationResponseDto responseDto = new RecommendationResponseDto();
        responseDto.setId(100L);
        responseDto.setUserId(1L);
        responseDto.setSymptom("Anxiety");
        responseDto.setSuggestedTherapy("Yoga");

        when(recommendationService.getRecommendationsByUser(1L))
                .thenReturn(Collections.singletonList(responseDto));

        mockMvc.perform(get("/api/recommendations/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(100L));
    }

    // ── DELETE ────────────────────────────────────────────────────────────

    @Test
    @WithMockUser(roles = {"PATIENT"})
    @DisplayName("DELETE /api/recommendations/100 when exists → 200")
    void testDeleteRecommendation_Success() throws Exception {
        when(recommendationService.deleteById(100L)).thenReturn(true);

        mockMvc.perform(delete("/api/recommendations/100").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Recommendation deleted successfully"));
    }

    @Test
    @WithMockUser(roles = {"PATIENT"})
    @DisplayName("DELETE /api/recommendations/100 when not found → 404")
    void testDeleteRecommendation_NotFound() throws Exception {
        when(recommendationService.deleteById(100L)).thenReturn(false);

        mockMvc.perform(delete("/api/recommendations/100").with(csrf()))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Recommendation not found with id: 100"));
    }

    @Test
    @WithMockUser(roles = {"PATIENT"})
    @DisplayName("DELETE /api/recommendations/user/1/all → clears all")
    void testClearAllRecommendations() throws Exception {
        when(recommendationService.deleteAllByUserId(1L)).thenReturn(5);

        mockMvc.perform(delete("/api/recommendations/user/1/all").with(csrf()))
                .andExpect(status().isOk())
                .andExpect(content().string("Cleared 5 recommendations for user 1"));
    }
}
