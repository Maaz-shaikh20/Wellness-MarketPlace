package com.example.wellnessbackend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GatewayPaymentResponseDto {

    private String gatewayPaymentId;

    private String paymentStatus;

    private String message;

    // ✅ Frontend redirect URL after payment
    private String redirectUrl;
}
