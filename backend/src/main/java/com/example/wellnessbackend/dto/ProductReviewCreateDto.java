package com.example.wellnessbackend.dto;

import lombok.Data;

@Data
public class ProductReviewCreateDto {

    private Long productId;

    private Long userId;

    private String review;

    // Optional (can be null)
    private Integer rating;
}
