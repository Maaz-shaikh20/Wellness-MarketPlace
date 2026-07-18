package com.example.wellnessbackend.service;
import com.example.wellnessbackend.entity.Cart;
import com.example.wellnessbackend.repository.CartRepository;
import com.example.wellnessbackend.repository.ProductRepository;
import com.example.wellnessbackend.repository.UserRepository;
import com.example.wellnessbackend.dto.OrderCreateDto;
import com.example.wellnessbackend.dto.OrderResponseDto;
import com.example.wellnessbackend.entity.Order;
import com.example.wellnessbackend.entity.OrderItem;
import com.example.wellnessbackend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;

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

        // ── Order confirmation email (non-blocking) ──
        try {
            String userEmail = userRepository.findById(dto.getUserId())
                    .map(u -> u.getEmail()).orElse(null);
            String userName = userRepository.findById(dto.getUserId())
                    .map(u -> u.getName() != null ? u.getName() : "Customer").orElse("Customer");

            if (userEmail != null) {
                List<String[]> emailItems = new ArrayList<>();
                for (OrderItem item : savedOrder.getOrderItems()) {
                    String itemName = productRepository.findById(item.getItemId())
                            .map(p -> p.getName()).orElse(item.getItemType() + " #" + item.getItemId());
                    emailItems.add(new String[]{
                            itemName,
                            String.valueOf(item.getQuantity()),
                            item.getUnitPrice().toPlainString(),
                            item.getTotalPrice().toPlainString()
                    });
                }
                emailService.sendOrderConfirmationEmail(
                        userEmail,
                        userName,
                        savedOrder.getId(),
                        emailItems,
                        savedOrder.getTotalAmount().toPlainString(),
                        savedOrder.getDeliveryAddress(),
                        savedOrder.getPhoneNumber(),
                        savedOrder.getDeliveryMessage()
                );
            }
        } catch (Exception e) {
            log.error("⚠️ Order confirmation email failed for order {}: {}", savedOrder.getId(), e.getMessage());
        }

        return mapToResponse(savedOrder);
    }

    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public List<OrderResponseDto> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
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
                .deliveryAddress(order.getDeliveryAddress())
                .phoneNumber(order.getPhoneNumber())
                .deliveryMessage(order.getDeliveryMessage())
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

        // ── Clear cart after order ──
        cartRepository.deleteByUserId(userId);

        // ── Order confirmation email (non-blocking) ──
        try {
            String userEmail = userRepository.findById(userId)
                    .map(u -> u.getEmail()).orElse(null);
            String userName = userRepository.findById(userId)
                    .map(u -> u.getName() != null ? u.getName() : "Customer").orElse("Customer");

            if (userEmail != null) {
                List<String[]> emailItems = new ArrayList<>();
                for (Cart cartItem : cartItems) {
                    emailItems.add(new String[]{
                            cartItem.getProduct().getName(),
                            String.valueOf(cartItem.getQuantity()),
                            String.valueOf(cartItem.getProduct().getPrice()),
                            String.valueOf(cartItem.getProduct().getPrice() * cartItem.getQuantity())
                    });
                }
                emailService.sendOrderConfirmationEmail(
                        userEmail,
                        userName,
                        savedOrder.getId(),
                        emailItems,
                        savedOrder.getTotalAmount().toPlainString(),
                        savedOrder.getDeliveryAddress(),
                        savedOrder.getPhoneNumber(),
                        savedOrder.getDeliveryMessage()
                );
            }
        } catch (Exception e) {
            log.error("⚠️ Order confirmation email failed for order {}: {}", savedOrder.getId(), e.getMessage());
        }

        return mapToResponse(savedOrder);
    }

}
