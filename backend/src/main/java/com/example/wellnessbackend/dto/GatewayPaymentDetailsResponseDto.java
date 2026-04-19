package com.example.wellnessbackend.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GatewayPaymentDetailsResponseDto {

    private String gatewayPaymentId;

    private Long orderId;

    private BigDecimal amount;

    private String paymentMethod;

    private String paymentStatus;
}
