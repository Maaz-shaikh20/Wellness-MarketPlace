package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.LoginRequest;
import com.example.wellnessbackend.dto.RegisterRequest;
import com.example.wellnessbackend.entity.PasswordResetToken;
import com.example.wellnessbackend.entity.PractitionerProfile;
import com.example.wellnessbackend.entity.RefreshToken;
import com.example.wellnessbackend.entity.Role;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.PasswordResetTokenRepository;
import com.example.wellnessbackend.repository.PractitionerProfileRepository;
import com.example.wellnessbackend.repository.RefreshTokenRepository;
import com.example.wellnessbackend.repository.UserRepository;
import com.example.wellnessbackend.security.JwtUtil;
import com.example.wellnessbackend.service.EmailService;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final PractitionerProfileRepository practitionerProfileRepository;  // ⭐ Added
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final EmailService emailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    // ------------------- REGISTER -------------------
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists"));
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole() != null ? request.getRole() : Role.PATIENT);
        user.setVerified(false);

        User savedUser = userRepository.save(user);

        // ------------------- AUTO CREATE PRACTITIONER PROFILE -------------------
        if (savedUser.getRole() == Role.PRACTITIONER) {

            // Check if already exists (safety)
            if (practitionerProfileRepository.findByUserId(savedUser.getId()).isEmpty()) {

                PractitionerProfile profile = PractitionerProfile.builder()
                        .userId(savedUser.getId())
                        .specialization("")       // default empty
                        .bio("")                  // default empty
                        .verified(false)
                        .rating(0.0)
                        .build();

                practitionerProfileRepository.save(profile);
            }
        }

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    // ------------------- LOGIN -------------------
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@Valid @RequestBody LoginRequest request) {
        return userRepository.findByEmail(request.getEmail())
                .map(user -> {
                    if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {

                        // Convert User to Spring Security UserDetails
                        UserDetails userDetails = org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .roles(user.getRole().name())
                                .build();

                        // Generate AccessToken using userDetails + role
                        // FIX #4: Invalidate any pending password reset tokens on successful login
                        passwordResetTokenRepository.deleteByUser(user);

                        String accessToken = jwtUtil.generateToken(userDetails, user.getRole().name());
                        String refreshToken = UUID.randomUUID().toString();

                        RefreshToken token = new RefreshToken();
                        token.setToken(refreshToken);
                        token.setUser(user);
                        token.setExpiryDate(Instant.now().plusSeconds(7 * 24 * 3600));
                        refreshTokenRepository.save(token);

                        return ResponseEntity.ok(Map.of(
                                "message", "Login successful",
                                "accessToken", accessToken,
                                "refreshToken", refreshToken,
                                "role", user.getRole().name(),
                                "verified", user.isVerified()
                        ));
                    } else {
                        return ResponseEntity.status(401).body(Map.of("message", "Invalid password"));
                    }
                })
                .orElse(ResponseEntity.status(404).body(Map.of("message", "User not found")));
    }

    // ------------------- REFRESH TOKEN -------------------
    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody TokenRefreshRequest request) {
        Optional<RefreshToken> refreshTokenOpt = refreshTokenRepository.findByToken(request.getRefreshToken());

        if (refreshTokenOpt.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("message", "Refresh token is invalid"));
        }

        RefreshToken refreshToken = refreshTokenOpt.get();

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(refreshToken);
            return ResponseEntity.status(403).body(Map.of("message", "Token expired, please login again"));
        }

        User user = refreshToken.getUser();

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();

        return ResponseEntity.ok(Map.of(
                "accessToken", jwtUtil.generateToken(userDetails, user.getRole().name()),
                "refreshToken", request.getRefreshToken()
        ));
    }

    // ------------------- FORGOT PASSWORD -------------------
    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }

        userRepository.findByEmail(email).ifPresent(user -> {
            // Delete any existing tokens for the user
            passwordResetTokenRepository.deleteByUser(user);

            // Generate new token
            String token = UUID.randomUUID().toString();
            PasswordResetToken resetToken = new PasswordResetToken();
            resetToken.setToken(token);
            resetToken.setUser(user);
            resetToken.setExpiryDate(Instant.now().plusSeconds(15 * 60)); // 15 mins expiry
            passwordResetTokenRepository.save(resetToken);

            // Send Email
            String resetLink = frontendUrl + "/reset-password?token=" + token;
            emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
        });

        return ResponseEntity.ok(Map.of("message", "If the email is registered on our platform, a password reset link has been sent."));
    }

    // ------------------- RESET PASSWORD -------------------
    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        if (token == null || newPassword == null || newPassword.trim().length() < 6) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid token or password (min 6 characters)"));
        }

        Optional<PasswordResetToken> tokenOpt = passwordResetTokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.status(400).body(Map.of("message", "Invalid or expired reset token"));
        }

        PasswordResetToken resetToken = tokenOpt.get();
        if (resetToken.getExpiryDate().isBefore(Instant.now())) {
            passwordResetTokenRepository.delete(resetToken);
            return ResponseEntity.status(400).body(Map.of("message", "Reset token has expired"));
        }

        User user = resetToken.getUser();
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            return ResponseEntity.status(400).body(Map.of("message", "New password cannot be the same as your old password."));
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Delete the token
        passwordResetTokenRepository.delete(resetToken);

        return ResponseEntity.ok(Map.of("message", "Password has been successfully reset."));
    }

    public static class TokenRefreshRequest {
        private String refreshToken;
        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    }

}
