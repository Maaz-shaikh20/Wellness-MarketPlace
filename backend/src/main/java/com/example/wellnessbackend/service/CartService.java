package com.example.wellnessbackend.service;
import com.example.wellnessbackend.dto.CartResponseDto;

import java.math.BigDecimal;
import java.util.stream.Collectors;
import com.example.wellnessbackend.dto.AddToCartDto;
import com.example.wellnessbackend.dto.UpdateCartDto;
import com.example.wellnessbackend.entity.Cart;
import com.example.wellnessbackend.entity.Product;
import com.example.wellnessbackend.repository.CartRepository;
import com.example.wellnessbackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    // CREATE → Add product to cart
    public void addToCart(Long userId, AddToCartDto dto) {

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (dto.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be positive");
        }

        Cart cartItem = cartRepository
                .findByUserIdAndProduct_Id(userId, dto.getProductId())
                .orElse(
                        Cart.builder()
                                .userId(userId)
                                .product(product)
                                .quantity(0)
                                .build()
                );

        cartItem.setQuantity(cartItem.getQuantity() + dto.getQuantity());
        cartRepository.save(cartItem);
    }

    // READ → Get all cart items of user
    public List<Cart> getUserCart(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    // UPDATE → Update quantity
    public Cart updateCartItem(Long cartItemId, UpdateCartDto dto) {
        Cart item = cartRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        item.setQuantity(dto.getQuantity());
        return cartRepository.save(item);
    }

    // DELETE → Remove one item
    public void deleteCartItem(Long cartItemId) {
        cartRepository.deleteById(cartItemId);
    }

    // DELETE → Clear full cart
    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
    // READ → Get cart items (DTO for frontend)
    // READ → Get cart items (DTO for frontend)
    public List<CartResponseDto> getUserCartDto(Long userId) {
        return cartRepository.findByUserId(userId).stream()
                .map(cart -> CartResponseDto.builder()
                        .cartItemId(cart.getId())
                        .productId(cart.getProduct().getId())
                        .productName(cart.getProduct().getName())
                        .price(BigDecimal.valueOf(cart.getProduct().getPrice())) // ✅ FIX
                        .quantity(cart.getQuantity())
                        .build()
                )
                .collect(Collectors.toList());
    }


}
