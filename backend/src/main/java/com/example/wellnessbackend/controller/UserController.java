package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.PatientUpdateDto;
import com.example.wellnessbackend.dto.UserResponseDto;
import com.example.wellnessbackend.entity.Role;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // =========================
    // GET CURRENT LOGGED-IN USER
    // =========================
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .map(user -> ResponseEntity.ok(toDto(user, null)))
                .orElse(ResponseEntity.status(404).body(
                        new UserResponseDto(null, null, null, null, false, "User not found")
                ));
    }

    // =========================
    // GET USER BY ID
    // =========================
    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> ResponseEntity.ok(toDto(user, null)))
                .orElse(ResponseEntity.status(404).body(
                        new UserResponseDto(null, null, null, null, false, "User not found with ID: " + id)
                ));
    }

    // =========================
    // UPDATE USER BY ID (PATIENT ONLY)
    // =========================
    @PutMapping("/{id:[0-9]+}")
    public ResponseEntity<UserResponseDto> updateUser(
            @PathVariable Long id,
            @RequestBody PatientUpdateDto request
    ) {
        return userRepository.findById(id)
                .map(user -> {
                    if (user.getRole() == Role.PATIENT) {
                        // Only update bio, keep all other fields intact
                        if (request.getBio() != null && !request.getBio().isBlank()) {
                            user.setBio(request.getBio());
                            userRepository.save(user);
                        }
                        return ResponseEntity.ok(toDto(user, "User profile updated successfully"));
                    } else {
                        return ResponseEntity.status(403).body(
                                new UserResponseDto(user.getId(), user.getName(), user.getEmail(),
                                        user.getRole(), user.isVerified(),
                                        "Only patients can update this endpoint")
                        );
                    }
                })
                .orElse(ResponseEntity.status(404).body(
                        new UserResponseDto(null, null, null, null, false, "User not found")
                ));
    }

    // =========================
    // GET ALL USERS
    // =========================
    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        List<UserResponseDto> users = userRepository.findAll().stream()
                .map(user -> toDto(user, null))
                .toList();
        return ResponseEntity.ok(users);
    }

    // =========================
    // DELETE USER BY ID
    // =========================
    @DeleteMapping("/{id:[0-9]+}")
    public ResponseEntity<UserResponseDto> deleteUser(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok(
                            new UserResponseDto(null, null, null, null, false, "User deleted successfully")
                    );
                })
                .orElse(ResponseEntity.status(404).body(
                        new UserResponseDto(null, null, null, null, false, "User not found with ID: " + id)
                ));
    }

    // =========================
    // Helper method to convert User -> DTO
    // =========================
    private UserResponseDto toDto(User user, String message) {
        return new UserResponseDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.isVerified(),
                message
        );
    }
}
