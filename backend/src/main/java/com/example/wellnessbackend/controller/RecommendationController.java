package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.RecommendationRequestDto;
import com.example.wellnessbackend.dto.RecommendationResponseDto;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.UserRepository;
import com.example.wellnessbackend.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final UserRepository userRepository;

    // ------------------- Generate recommendation -------------------
    // FIX #2: userId is now derived from the JWT token, not from the request body.
    // This prevents BOLA (Broken Object Level Authorization) attacks where a user
    // could tamper the userId field in the request to write recommendations for another account.
    @PostMapping
    public ResponseEntity<?> generateRecommendation(
            @Valid @RequestBody RecommendationRequestDto dto,
            Authentication authentication) {

        // Extract the authenticated user's email from the JWT
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        // Override any client-supplied userId with the real one from the token
        dto.setUserId(user.getId());

        RecommendationResponseDto response = recommendationService.generateRecommendation(dto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    // ------------------- Get recommendations of a user -------------------
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<RecommendationResponseDto>> getRecommendationsByUser(
            @PathVariable Long userId) {

        List<RecommendationResponseDto> list =
                recommendationService.getRecommendationsByUser(userId);

        return ResponseEntity.ok(list);
    }

    // ------------------- Delete a single recommendation -------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRecommendation(@PathVariable Long id) {
        boolean deleted = recommendationService.deleteById(id);
        if (deleted) {
            return ResponseEntity.ok("Recommendation deleted successfully");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Recommendation not found with id: " + id);
    }

    // ------------------- Clear all recommendations of a user -------------------
    @DeleteMapping("/user/{userId}/all")
    public ResponseEntity<String> clearAllRecommendations(@PathVariable Long userId) {
        int count = recommendationService.deleteAllByUserId(userId);
        return ResponseEntity.ok("Cleared " + count + " recommendations for user " + userId);
    }
}

