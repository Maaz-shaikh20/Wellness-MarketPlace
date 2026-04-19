package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.ProductReviewCreateDto;
import com.example.wellnessbackend.dto.ProductReviewResponseDto;
import com.example.wellnessbackend.service.ProductReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-reviews")
@RequiredArgsConstructor
public class ProductReviewController {

    private final ProductReviewService reviewService;

    // =========================
    // CREATE REVIEW
    // =========================
    @PostMapping
    public ResponseEntity<?> createReview(
            @RequestBody ProductReviewCreateDto dto
    ) {
        reviewService.addReview(dto);
        return ResponseEntity.ok(
                java.util.Map.of("message", "Review added successfully")
        );
    }

    // =========================
    // GET REVIEWS BY PRODUCT
    // =========================
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ProductReviewResponseDto>> getReviews(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(
                reviewService.getReviewsByProduct(productId)
        );
    }
}
