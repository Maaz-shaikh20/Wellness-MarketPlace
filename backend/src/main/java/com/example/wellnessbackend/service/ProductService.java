package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.ProductCreateDto;
import com.example.wellnessbackend.dto.ProductResponseDto;
import com.example.wellnessbackend.dto.ProductUpdateDto;
import com.example.wellnessbackend.entity.Product;
import com.example.wellnessbackend.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public ProductResponseDto createProduct(ProductCreateDto dto) {
        Product product = Product.builder()
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .category(dto.getCategory())
                .stock(dto.getStock())
                // ✅ NEW MAPPING
                .imageUrl(dto.getImageUrl())
                .build();

        return mapToResponse(productRepository.save(product));
    }

    public List<ProductResponseDto> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public ProductResponseDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToResponse(product);
    }

    public ProductResponseDto updateProduct(Long id, ProductUpdateDto dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setStock(dto.getStock());

        // ✅ SAFE UPDATE (only if provided)
        if (dto.getImageUrl() != null) {
            product.setImageUrl(dto.getImageUrl());
        }

        return mapToResponse(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private ProductResponseDto mapToResponse(Product product) {
        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .stock(product.getStock())
                // ✅ INCLUDED IN RESPONSE
                .imageUrl(product.getImageUrl())
                .build();
    }
}
