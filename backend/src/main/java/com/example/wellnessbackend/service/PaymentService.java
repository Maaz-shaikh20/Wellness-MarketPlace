package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.PaymentInitiateDto;
import com.example.wellnessbackend.dto.PaymentStatusResponseDto;
import com.example.wellnessbackend.entity.Order;
import com.example.wellnessbackend.entity.Payment;
import com.example.wellnessbackend.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderService orderService;

    @Transactional
    public Payment initiatePayment(PaymentInitiateDto dto) {

        Order order = orderService.getOrderById(dto.getOrderId());

        Payment payment = Payment.builder()
                .order(order)
                .userId(order.getUserId())
                .amount(order.getTotalAmount())
                .paymentMethod(dto.getPaymentMethod())
                .status("SUCCESS") // ✅ AUTO-SUCCESS FOR DEMO
                .gatewayPaymentId("PAY_" + UUID.randomUUID())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

// ✅ Order is now paid
        orderService.updateOrderStatus(order, "PAID");

        return paymentRepository.save(payment);

    }

    public PaymentStatusResponseDto getPaymentStatus(String gatewayPaymentId) {

        Payment payment = paymentRepository.findByGatewayPaymentId(gatewayPaymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        return PaymentStatusResponseDto.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrder().getId())
                .paymentStatus(payment.getStatus())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .gatewayPaymentId(payment.getGatewayPaymentId())
                .updatedAt(payment.getUpdatedAt())
                .build();
    }

    public Payment getPaymentByGatewayId(String gatewayPaymentId) {
        return paymentRepository.findByGatewayPaymentId(gatewayPaymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    public void updatePaymentStatus(Payment payment, String status) {
        payment.setStatus(status);
        payment.setUpdatedAt(LocalDateTime.now());
        paymentRepository.save(payment);
    }
}
