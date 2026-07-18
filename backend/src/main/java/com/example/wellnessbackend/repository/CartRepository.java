package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {

    List<Cart> findByUserId(Long userId);

    Optional<Cart> findFirstByUserIdAndProduct_Id(Long userId, Long productId);

    @Transactional
    void deleteByUserId(Long userId);
}
