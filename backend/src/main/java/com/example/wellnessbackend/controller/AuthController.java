package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.LoginRequest;
import com.example.wellnessbackend.dto.RegisterRequest;
import com.example.wellnessbackend.entity.PractitionerProfile;
import com.example.wellnessbackend.entity.RefreshToken;
import com.example.wellnessbackend.entity.Role;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.PractitionerProfileRepository;
import com.example.wellnessbackend.repository.RefreshTokenRepository;
import com.example.wellnessbackend.repository.UserRepository;
import com.example.wellnessbackend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
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

    // ------------------- REGISTER -------------------
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
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
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request) {
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

    public static class TokenRefreshRequest {
        private String refreshToken;
        public String getRefreshToken() { return refreshToken; }
        public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
    }

    // ------------------- ADMIN PRACTITIONER MANAGEMENT -------------------

    @GetMapping("/admin/practitioners/unverified")
    public ResponseEntity<?> getUnverifiedPractitioners() {
        List<User> practitioners = userRepository.findByRoleAndVerified(Role.PRACTITIONER, false);
        return ResponseEntity.ok(practitioners);
    }

    @PutMapping("/admin/practitioner/{id}/verify")
    public ResponseEntity<?> verifyPractitioner(@PathVariable Long id) {
        Optional<User> practitionerOpt = userRepository.findById(id);

        if (practitionerOpt.isEmpty() || practitionerOpt.get().getRole() != Role.PRACTITIONER) {
            return ResponseEntity.status(404).body(Map.of("message", "Practitioner not found"));
        }

        User practitioner = practitionerOpt.get();
        practitioner.setVerified(true);
        userRepository.save(practitioner);

        return ResponseEntity.ok(Map.of("message", "Practitioner verified successfully"));
    }

    @GetMapping("/practitioners")
    public ResponseEntity<?> getVerifiedPractitioners() {
        List<User> practitioners = userRepository.findByRoleAndVerified(Role.PRACTITIONER, true);
        return ResponseEntity.ok(practitioners);
    }
}
