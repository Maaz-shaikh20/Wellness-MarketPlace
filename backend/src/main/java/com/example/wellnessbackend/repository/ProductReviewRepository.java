package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.ProductReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Long> {

    // 🔹 Fetch all reviews for a product
    List<ProductReview> findByProductId(Long productId);
}
