package com.example.wellnessbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Many transactions belong to one payment
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    /**
     * Transaction type examples:
     * INIT
     * AUTH
     * SUCCESS
     * FAILURE
     */
    @Column(name = "transaction_type", nullable = false, length = 50)
    private String transactionType;

    /**
     * Transaction status examples:
     * PENDING
     * SUCCESS
     * FAILED
     */
    @Column(nullable = false, length = 50)
    private String status;

    // ✅ Optional message (failure reason, info, etc.)
    @Column(length = 500)
    private String message;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
