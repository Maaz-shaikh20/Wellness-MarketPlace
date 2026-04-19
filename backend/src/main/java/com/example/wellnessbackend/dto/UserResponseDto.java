package com.example.wellnessbackend.dto;

import com.example.wellnessbackend.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponseDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private boolean verified;

    // Optional: use a message for error responses
    private String message;
}
