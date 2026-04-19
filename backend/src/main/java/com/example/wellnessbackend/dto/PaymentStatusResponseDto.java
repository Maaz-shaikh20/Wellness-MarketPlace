package com.example.wellnessbackend.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentStatusResponseDto {

    private Long paymentId;

    private Long orderId;

    private String paymentStatus;

    private BigDecimal amount;

    private String paymentMethod;

    private String gatewayPaymentId;

    private LocalDateTime updatedAt;
}
