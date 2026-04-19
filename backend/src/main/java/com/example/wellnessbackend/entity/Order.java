package com.example.wellnessbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_orders_user_id", columnList = "user_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ✅ Store user id directly (consistent with ProductReview)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // ✅ One order can have multiple items
    @OneToMany(
            mappedBy = "order",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    private List<OrderItem> orderItems;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    /**
     * Order status values (string-based for flexibility):
     * CREATED
     * PAYMENT_INITIATED
     * PAID
     * FAILED
     * CANCELLED
     */
    @Column(nullable = false, length = 50)
    private String status;

    // ✅ NEW: Delivery address entered by user
    @Column(name = "delivery_address", nullable = false, length = 500)
    private String deliveryAddress;

    // ✅ NEW: User phone number for delivery/contact
    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    // ✅ OPTIONAL: Default delivery message
    @Column(name = "delivery_message", length = 255)
    private String deliveryMessage;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
