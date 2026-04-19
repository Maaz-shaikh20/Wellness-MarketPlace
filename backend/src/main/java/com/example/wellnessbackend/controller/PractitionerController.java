package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.PractitionerCreateDto;
import com.example.wellnessbackend.dto.PractitionerResponseDto;
import com.example.wellnessbackend.dto.PractitionerUpdateDto;
import com.example.wellnessbackend.entity.PractitionerProfile;
import com.example.wellnessbackend.entity.Role;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.UserRepository;
import com.example.wellnessbackend.service.PractitionerService;
import com.example.wellnessbackend.service.TherapySessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/practitioners")
@RequiredArgsConstructor
public class PractitionerController {

    private final PractitionerService service;
    private final UserRepository userRepository;
    private final TherapySessionService sessionService;

    // =========================
    // CREATE PRACTITIONER PROFILE
    // =========================
    @PostMapping("/{userId}")
    public ResponseEntity<PractitionerResponseDto> create(
            @PathVariable Long userId,
            @RequestBody PractitionerCreateDto request
    ) {
        return ResponseEntity.ok(service.createPractitioner(userId, request));
    }

    // =========================
    // GET ALL PRACTITIONERS
    // =========================
    @GetMapping
    public ResponseEntity<List<PractitionerResponseDto>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // =========================
    // GET PRACTITIONER BY PROFILE ID
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<PractitionerResponseDto> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.mapToDto(service.getProfileById(id)));
    }

    // =========================
    // GET PRACTITIONER BY USER ID (PRIMARY)
    // =========================
    @GetMapping("/user/{userId}")
    public ResponseEntity<PractitionerResponseDto> getByUserId(
            @PathVariable Long userId
    ) {
        return ResponseEntity.ok(
                service.mapToDto(service.getByUserId(userId))
        );
    }

    // =========================
    // UPDATE PRACTITIONER PROFILE (BY USER ID)
    // =========================
    @PutMapping("/user/{userId}")
    public ResponseEntity<PractitionerResponseDto> update(
            @PathVariable Long userId,
            @RequestBody PractitionerUpdateDto request
    ) {
        PractitionerProfile profile = service.getByUserId(userId);

        profile.setBio(request.getBio());
        profile.setSpecialization(request.getSpecialization());
        profile.setClinicAddress(request.getClinicAddress());
        profile.setVerified(false);

        service.saveProfile(profile);

        userRepository.findById(userId).ifPresent(user -> {
            user.setBio(request.getBio());
            user.setVerified(false);
            userRepository.save(user);
        });

        return ResponseEntity.ok(service.mapToDto(profile));
    }

    // =========================
    // GET VERIFIED PRACTITIONERS
    // =========================
    @GetMapping("/verified")
    public ResponseEntity<List<PractitionerResponseDto>> getVerifiedPractitioners() {

        List<User> users =
                userRepository.findByRoleAndVerified(Role.PRACTITIONER, true);

        List<PractitionerResponseDto> response = users.stream()
                .map(user -> service.mapToDto(service.getByUserId(user.getId())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    // =========================
    // GET PRACTITIONER AVAILABILITY (BY USER ID)
    // =========================
    @GetMapping("/user/{userId}/availability")
    public ResponseEntity<List<LocalDateTime>> getAvailability(
            @PathVariable Long userId,
            @RequestParam(required = false) String date
    ) {
        return ResponseEntity.ok(
                sessionService.getAvailableSlots(userId, date)
        );
    }

    // =========================
    // UPLOAD / REUPLOAD CERTIFICATE (BY USER ID)
    // =========================
    @PostMapping("/user/{userId}/upload-certificate")
    public ResponseEntity<?> uploadCertificate(
            @PathVariable Long userId,
            @RequestBody Map<String, String> body
    ) {
        String driveLink = body.get("driveLink");

        if (driveLink == null || driveLink.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "driveLink is required"));
        }

        PractitionerProfile profile = service.getByUserId(userId);

        // Prevent upload if already verified
        if (profile.getVerified()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Profile already verified"));
        }

        // Check reupload rules
        if (!service.canReupload(profile)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Re-upload allowed only after 1 month"));
        }

        // Update certificate link and timestamps
        profile.setCertificateLink(driveLink);
        profile.setCertificateSubmittedAt(LocalDateTime.now());

        // If under review, keep rejectionReason and reuploadAllowedAt null
        // If previously rejected, clear rejection reason and reuploadAllowedAt
        profile.setRejectionReason(null);
        profile.setReuploadAllowedAt(null);

        service.saveProfile(profile);

        // Update user verification status
        userRepository.findById(userId).ifPresent(user -> {
            user.setVerified(false);
            userRepository.save(user);
        });

        return ResponseEntity.ok(
                Map.of("message", "Documents submitted successfully. Under review.")
        );
    }

}
