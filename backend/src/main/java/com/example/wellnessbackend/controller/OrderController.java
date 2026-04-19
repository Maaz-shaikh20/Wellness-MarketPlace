package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.OrderCreateDto;
import com.example.wellnessbackend.dto.OrderResponseDto;
import com.example.wellnessbackend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    // ✅ Create order (Checkout)
    @PostMapping
    public ResponseEntity<OrderResponseDto> createOrder(
            @RequestBody OrderCreateDto dto
    ) {
        return ResponseEntity.ok(orderService.createOrder(dto));
    }
    @PostMapping("/from-cart")
    public ResponseEntity<OrderResponseDto> createOrderFromCart(
            @RequestParam Long userId,
            @RequestParam String deliveryAddress,
            @RequestParam String phoneNumber
    ) {
        return ResponseEntity.ok(
                orderService.createOrderFromCart(userId, deliveryAddress, phoneNumber)
        );
    }

}
