package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // ✅ Find payment for a specific order
    Optional<Payment> findByOrderId(Long orderId);

    // ✅ Find payment using fake gateway reference
    Optional<Payment> findByGatewayPaymentId(String gatewayPaymentId);
}
