package com.example.wellnessbackend.dto;

import lombok.Data;

@Data
public class AddToCartDto {
    private Long productId;
    private Integer quantity;
}
