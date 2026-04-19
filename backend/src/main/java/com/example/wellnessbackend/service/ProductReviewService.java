package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.ProductReviewCreateDto;
import com.example.wellnessbackend.dto.ProductReviewResponseDto;
import com.example.wellnessbackend.entity.Product;
import com.example.wellnessbackend.entity.ProductReview;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.ProductRepository;
import com.example.wellnessbackend.repository.ProductReviewRepository;
import com.example.wellnessbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductReviewService {

    private final ProductReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // =========================
    // ADD PRODUCT REVIEW
    // =========================
    public void addReview(ProductReviewCreateDto dto) {

        // 1️⃣ Validate product
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2️⃣ Validate user
        userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3️⃣ Build review entity
        ProductReview review = ProductReview.builder()
                .product(product)
                .userId(dto.getUserId())
                .review(dto.getReview())
                .rating(dto.getRating())
                .createdAt(LocalDateTime.now())
                .build();

        // 4️⃣ Save
        reviewRepository.save(review);
    }

    // =========================
    // GET REVIEWS BY PRODUCT
    // =========================
    public List<ProductReviewResponseDto> getReviewsByProduct(Long productId) {

        // 1️⃣ Ensure product exists
        productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2️⃣ Fetch + map reviews
        return reviewRepository.findByProductId(productId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // =========================
    // ENTITY → DTO MAPPER
    // =========================
    private ProductReviewResponseDto mapToDto(ProductReview review) {
        return ProductReviewResponseDto.builder()
                .userName(
                        userRepository.findById(review.getUserId())
                                .map(User::getName)
                                .orElse("Anonymous")
                )
                .review(review.getReview())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
