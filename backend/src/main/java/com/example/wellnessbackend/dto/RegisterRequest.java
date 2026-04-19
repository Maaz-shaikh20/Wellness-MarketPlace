package com.example.wellnessbackend.dto;

import com.example.wellnessbackend.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;  // USER / PRACTITIONER / ADMIN
}
