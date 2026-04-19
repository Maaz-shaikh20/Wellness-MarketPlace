package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    // ✅ Get all items for a given order
    List<OrderItem> findByOrderId(Long orderId);
}
