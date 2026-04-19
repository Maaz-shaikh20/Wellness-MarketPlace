package com.example.wellnessbackend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GatewayPaymentRequestDto {

    // ✅ Fake gateway payment reference
    private String gatewayPaymentId;

    /**
     * User action examples:
     * SUCCESS
     * FAILED
     * CANCELLED
     */
    private String action;
}
