package com.example.wellnessbackend.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProductResponseDto {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private String category;
    private Integer stock;

    // ✅ NEW FIELD (returned in GET APIs)
    private String imageUrl;
}
