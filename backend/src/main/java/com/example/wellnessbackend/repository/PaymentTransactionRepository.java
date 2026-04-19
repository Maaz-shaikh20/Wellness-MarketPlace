package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    // ✅ Get all transactions for a payment
    List<PaymentTransaction> findByPaymentId(Long paymentId);
}
