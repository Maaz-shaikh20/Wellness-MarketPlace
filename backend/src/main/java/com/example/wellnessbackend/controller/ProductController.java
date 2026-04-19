package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.ProductCreateDto;
import com.example.wellnessbackend.dto.ProductResponseDto;
import com.example.wellnessbackend.dto.ProductUpdateDto;
import com.example.wellnessbackend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // ADMIN / PRACTITIONER
    @PostMapping
    public ProductResponseDto createProduct(@RequestBody ProductCreateDto dto) {
        return productService.createProduct(dto);
    }

    // PUBLIC
    @GetMapping
    public List<ProductResponseDto> getAllProducts() {
        return productService.getAllProducts();
    }

    // PUBLIC
    @GetMapping("/{id}")
    public ProductResponseDto getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    // ADMIN
    @PutMapping("/{id}")
    public ProductResponseDto updateProduct(
            @PathVariable Long id,
            @RequestBody ProductUpdateDto dto
    ) {
        return productService.updateProduct(id, dto);
    }

    // ADMIN
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);

        return ResponseEntity.ok(
                Map.of("message", "Product with ID " + id + " deleted successfully")
        );
    }
}
