package com.example.wellnessbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RecommendationRequestDto {

    @NotNull(message = "User ID is required")
    private Long userId;   // ID of the user requesting recommendation

    @NotBlank(message = "Symptom must not be empty")
    @Size(max = 255, message = "Symptom must be less than 255 characters")
    private String symptom;  // Symptom reported
}
