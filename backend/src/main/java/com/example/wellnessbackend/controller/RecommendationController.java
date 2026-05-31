package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.RecommendationRequestDto;
import com.example.wellnessbackend.dto.RecommendationResponseDto;
import com.example.wellnessbackend.service.RecommendationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    // ------------------- Generate recommendation -------------------
    @PostMapping
    public ResponseEntity<RecommendationResponseDto> generateRecommendation(
            @Valid @RequestBody RecommendationRequestDto dto) {

        RecommendationResponseDto response =
                recommendationService.generateRecommendation(dto);

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
