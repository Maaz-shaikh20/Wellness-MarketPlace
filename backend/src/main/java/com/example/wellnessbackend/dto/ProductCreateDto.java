package com.example.wellnessbackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductCreateDto {

    private String name;
    private String description;
    private Double price;
    private String category;
    private Integer stock;

    // ✅ NEW FIELD
    private String imageUrl;
}
