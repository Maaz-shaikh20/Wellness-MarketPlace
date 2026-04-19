package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.GatewayPaymentDetailsResponseDto;
import com.example.wellnessbackend.dto.GatewayPaymentRequestDto;
import com.example.wellnessbackend.dto.GatewayPaymentResponseDto;
import com.example.wellnessbackend.service.FakeGatewayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fake-gateway")
@RequiredArgsConstructor
public class FakeGatewayController {

    private final FakeGatewayService fakeGatewayService;

    // ✅ API #3: Get payment details for fake gateway page
    @GetMapping("/payment-details/{gatewayPaymentId}")
    public ResponseEntity<GatewayPaymentDetailsResponseDto> getPaymentDetails(
            @PathVariable String gatewayPaymentId
    ) {
        return ResponseEntity.ok(
                fakeGatewayService.getPaymentDetails(gatewayPaymentId)
        );
    }

    // ✅ API #4: User clicks Success / Fail / Cancel on fake gateway UI
    @PostMapping("/confirm")
    public ResponseEntity<GatewayPaymentResponseDto> confirmPayment(
            @RequestBody GatewayPaymentRequestDto dto
    ) {
        return ResponseEntity.ok(
                fakeGatewayService.processPayment(dto)
        );
    }
}
