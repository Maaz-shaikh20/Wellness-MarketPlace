package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.GatewayPaymentDetailsResponseDto;
import com.example.wellnessbackend.dto.GatewayPaymentRequestDto;
import com.example.wellnessbackend.dto.GatewayPaymentResponseDto;
import com.example.wellnessbackend.entity.Payment;
import com.example.wellnessbackend.entity.PaymentTransaction;
import com.example.wellnessbackend.repository.PaymentTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FakeGatewayService {

    private final PaymentService paymentService;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final OrderService orderService;

    // ✅ API #3 logic: fetch payment details for fake gateway page
    public GatewayPaymentDetailsResponseDto getPaymentDetails(String gatewayPaymentId) {

        Payment payment = paymentService.getPaymentByGatewayId(gatewayPaymentId);

        return GatewayPaymentDetailsResponseDto.builder()
                .gatewayPaymentId(payment.getGatewayPaymentId())
                .orderId(payment.getOrder().getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getStatus())
                .build();
    }

    // ✅ API #4 logic: process success / failure / cancel
    @Transactional
    public GatewayPaymentResponseDto processPayment(GatewayPaymentRequestDto dto) {

        Payment payment = paymentService.getPaymentByGatewayId(dto.getGatewayPaymentId());

        String finalStatus;
        String orderStatus;

        switch (dto.getAction()) {
            case "SUCCESS":
                finalStatus = "SUCCESS";
                orderStatus = "PAID";
                break;
            case "FAILED":
                finalStatus = "FAILED";
                orderStatus = "FAILED";
                break;
            default:
                finalStatus = "CANCELLED";
                orderStatus = "CANCELLED";
        }

        PaymentTransaction transaction = PaymentTransaction.builder()
                .payment(payment)
                .transactionType("FINAL")
                .status(finalStatus)
                .message("User action: " + dto.getAction())
                .createdAt(LocalDateTime.now())
                .build();

        paymentTransactionRepository.save(transaction);

        paymentService.updatePaymentStatus(payment, finalStatus);
        orderService.updateOrderStatus(payment.getOrder(), orderStatus);

        return GatewayPaymentResponseDto.builder()
                .gatewayPaymentId(payment.getGatewayPaymentId())
                .paymentStatus(finalStatus)
                .message("Payment " + finalStatus)
                .redirectUrl("/payment/result?paymentId=" + payment.getGatewayPaymentId())
                .build();
    }
}
