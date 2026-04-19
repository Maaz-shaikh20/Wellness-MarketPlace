package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.PaymentInitiateDto;
import com.example.wellnessbackend.dto.PaymentStatusResponseDto;
import com.example.wellnessbackend.entity.Payment;
import com.example.wellnessbackend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // ✅ Initiate payment (Proceed to Pay)
    @PostMapping("/initiate")
    public ResponseEntity<String> initiatePayment(
            @RequestBody PaymentInitiateDto dto
    ) {
        Payment payment = paymentService.initiatePayment(dto);

        // Frontend redirects to fake gateway page using this ID
        return ResponseEntity.ok(payment.getGatewayPaymentId());
    }

    // ✅ Get payment status (polling)
    @GetMapping("/status/{gatewayPaymentId}")
    public ResponseEntity<PaymentStatusResponseDto> getPaymentStatus(
            @PathVariable String gatewayPaymentId
    ) {
        return ResponseEntity.ok(
                paymentService.getPaymentStatus(gatewayPaymentId)
        );
    }
}
