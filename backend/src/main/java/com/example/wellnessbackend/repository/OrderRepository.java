package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    // ✅ Get all orders for a user
    List<Order> findByUserId(Long userId);
}
