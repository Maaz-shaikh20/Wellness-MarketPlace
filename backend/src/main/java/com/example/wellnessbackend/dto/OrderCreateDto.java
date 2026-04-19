package com.example.wellnessbackend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateDto {

    private Long userId;

    private List<OrderItemCreateDto> items;

    // ✅ NEW: Delivery address from checkout page
    private String deliveryAddress;

    // ✅ NEW: Phone number from checkout page
    private String phoneNumber;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemCreateDto {

        /**
         * PRODUCT
         * THERAPY
         * THERAPY_SESSION
         */
        private String itemType;

        private Long itemId;

        private Integer quantity;

        private BigDecimal unitPrice;
    }
}
