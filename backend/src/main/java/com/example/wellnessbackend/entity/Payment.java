package com.example.wellnessbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ One payment belongs to one order
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false, unique = true)
    private Order order;

    // ✅ Store user id directly
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    /**
     * Payment status values:
     * INITIATED
     * PROCESSING
     * SUCCESS
     * FAILED
     * CANCELLED
     */
    @Column(nullable = false, length = 50)
    private String status;

    /**
     * Payment method examples:
     * CARD
     * UPI
     * WALLET
     */
    @Column(name = "payment_method", length = 50)
    private String paymentMethod;

    // ✅ Fake gateway reference (like Razorpay payment_id)
    @Column(name = "gateway_payment_id", unique = true, length = 100)
    private String gatewayPaymentId;

    // ✅ One payment can have multiple transactions/events
    @OneToMany(
            mappedBy = "payment",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<PaymentTransaction> transactions;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
