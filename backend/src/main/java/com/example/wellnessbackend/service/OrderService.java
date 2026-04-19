package com.example.wellnessbackend.service;
import com.example.wellnessbackend.entity.Cart;
import com.example.wellnessbackend.repository.CartRepository;
import com.example.wellnessbackend.dto.OrderCreateDto;
import com.example.wellnessbackend.dto.OrderResponseDto;
import com.example.wellnessbackend.entity.Order;
import com.example.wellnessbackend.entity.OrderItem;
import com.example.wellnessbackend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;

    @Transactional
    public OrderResponseDto createOrder(OrderCreateDto dto) {

        // ✅ BASIC VALIDATION (minimal & safe)
        if (dto.getDeliveryAddress() == null || dto.getDeliveryAddress().isBlank()) {
            throw new RuntimeException("Delivery address is required");
        }

        if (dto.getPhoneNumber() == null || dto.getPhoneNumber().isBlank()) {
            throw new RuntimeException("Phone number is required");
        }

        if (dto.getItems() == null || dto.getItems().isEmpty()) {
            throw new RuntimeException("Order items cannot be empty");
        }

        Order order = Order.builder()
                .userId(dto.getUserId())
                .status("CREATED")
                .deliveryAddress(dto.getDeliveryAddress()) // ✅ NEW
                .phoneNumber(dto.getPhoneNumber())         // ✅ NEW
                .deliveryMessage("Delivery will be made within 5 business days.") // ✅ OPTIONAL DEFAULT
                .createdAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = dto.getItems().stream().map(itemDto -> {
            BigDecimal totalPrice =
                    itemDto.getUnitPrice().multiply(BigDecimal.valueOf(itemDto.getQuantity()));

            return OrderItem.builder()
                    .order(order)
                    .itemType(itemDto.getItemType())
                    .itemId(itemDto.getItemId())
                    .quantity(itemDto.getQuantity())
                    .unitPrice(itemDto.getUnitPrice())
                    .totalPrice(totalPrice)
                    .build();
        }).collect(Collectors.toList());

        BigDecimal totalAmount = orderItems.stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        return mapToResponse(savedOrder);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public void updateOrderStatus(Order order, String status) {
        order.setStatus(status);
        order.setUpdatedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    private OrderResponseDto mapToResponse(Order order) {

        return OrderResponseDto.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .items(order.getOrderItems().stream().map(item ->
                        OrderResponseDto.OrderItemResponseDto.builder()
                                .itemId(item.getItemId())
                                .itemType(item.getItemType())
                                .quantity(item.getQuantity())
                                .unitPrice(item.getUnitPrice())
                                .totalPrice(item.getTotalPrice())
                                .build()
                ).collect(Collectors.toList()))
                .build();
    }
    @Transactional
    public OrderResponseDto createOrderFromCart(
            Long userId,
            String deliveryAddress,
            String phoneNumber
    ) {
        List<Cart> cartItems = cartRepository.findByUserId(userId);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = Order.builder()
                .userId(userId)
                .status("CREATED")
                .deliveryAddress(deliveryAddress)
                .phoneNumber(phoneNumber)
                .deliveryMessage("Delivery will be made within 5 business days.")
                .createdAt(LocalDateTime.now())
                .build();

        List<OrderItem> orderItems = cartItems.stream().map(cart -> {

            BigDecimal unitPrice = BigDecimal.valueOf(cart.getProduct().getPrice());

            BigDecimal totalPrice =
                    unitPrice.multiply(BigDecimal.valueOf(cart.getQuantity()));

            return OrderItem.builder()
                    .order(order)
                    .itemType("PRODUCT")
                    .itemId(cart.getProduct().getId())
                    .quantity(cart.getQuantity())
                    .unitPrice(unitPrice)
                    .totalPrice(totalPrice)
                    .build();

        }).collect(Collectors.toList());

        BigDecimal totalAmount = orderItems.stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        // ✅ clear cart after order
        cartRepository.deleteByUserId(userId);

        return mapToResponse(savedOrder);
    }

}
