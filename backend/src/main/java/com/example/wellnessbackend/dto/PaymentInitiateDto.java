package com.example.wellnessbackend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInitiateDto {

    private Long orderId;

    /**
     * Payment method examples:
     * CARD
     * UPI
     * WALLET
     */
    private String paymentMethod;
}
