package com.example.wellnessbackend.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ProductReviewResponseDto {

    // Optional enhancement
    private String userName;

    private String review;

    private Integer rating;

    private LocalDateTime createdAt;
}
