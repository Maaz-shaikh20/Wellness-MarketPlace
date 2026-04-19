package com.example.wellnessbackend.controller;
import com.example.wellnessbackend.dto.CartResponseDto;
import com.example.wellnessbackend.dto.AddToCartDto;
import com.example.wellnessbackend.dto.UpdateCartDto;
import com.example.wellnessbackend.entity.Cart;
import com.example.wellnessbackend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    // POST → Add item to cart
    @PostMapping("/add")
    public ResponseEntity<String> addToCart(
            @RequestParam Long userId,
            @RequestBody AddToCartDto dto
    ) {
        cartService.addToCart(userId, dto);
        return ResponseEntity.ok("Product added to cart");
    }

    // GET → Get all cart items for a user
    @GetMapping
    public ResponseEntity<List<CartResponseDto>> getUserCart(@RequestParam Long userId) {
        return ResponseEntity.ok(cartService.getUserCartDto(userId));
    }

    // PUT → Update quantity of a cart item
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<Cart> updateCart(
            @PathVariable Long cartItemId,
            @RequestBody UpdateCartDto dto
    ) {
        return ResponseEntity.ok(
                cartService.updateCartItem(cartItemId, dto)
        );
    }

    // DELETE → Delete entire cart item (✅ THIS IS THE IMPORTANT FIX)
    @DeleteMapping("/delete/{cartItemId}")
    public ResponseEntity<String> deleteCartItem(
            @PathVariable Long cartItemId
    ) {
        cartService.deleteCartItem(cartItemId);
        return ResponseEntity.ok("Item removed from cart");
    }

    // DELETE → Clear all cart items for a user
    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(@RequestParam Long userId) {
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared");
    }
}
