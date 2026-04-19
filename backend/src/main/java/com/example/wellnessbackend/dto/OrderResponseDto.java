package com.example.wellnessbackend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponseDto {

    private Long orderId;

    private Long userId;

    private String status;

    private BigDecimal totalAmount;

    private List<OrderItemResponseDto> items;

    // ✅ NEW: Delivery address
    private String deliveryAddress;

    // ✅ NEW: Phone number
    private String phoneNumber;

    // ✅ NEW: Delivery message
    private String deliveryMessage;

    private LocalDateTime createdAt;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemResponseDto {

        private Long itemId;

        private String itemType;

        private Integer quantity;

        private BigDecimal unitPrice;

        private BigDecimal totalPrice;
    }
}
