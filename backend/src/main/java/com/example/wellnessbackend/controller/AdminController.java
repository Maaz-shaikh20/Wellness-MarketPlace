package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.PractitionerRejectionDto;
import com.example.wellnessbackend.entity.PractitionerProfile;
import com.example.wellnessbackend.entity.Role;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.PractitionerProfileRepository;
import com.example.wellnessbackend.repository.UserRepository;
import com.example.wellnessbackend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PractitionerProfileRepository practitionerProfileRepository;
    private final NotificationService notificationService;

    // =====================================================
    // 1️⃣ GET UNVERIFIED PRACTITIONERS
    // =====================================================
    @GetMapping("/practitioners/unverified")
    public ResponseEntity<?> getUnverifiedPractitioners() {

        List<PractitionerProfile> profiles =
                practitionerProfileRepository
                        .findByVerifiedFalseAndCertificateLinkIsNotNull();

        return ResponseEntity.ok(profiles);
    }

    // =========================
    // 2️⃣ VERIFY PRACTITIONER
    // =========================
    @PutMapping("/practitioner/{profileId}/verify")
    public ResponseEntity<?> verifyPractitioner(@PathVariable Long profileId) {

        PractitionerProfile profile = practitionerProfileRepository
                .findById(profileId)
                .orElseThrow(() -> new RuntimeException("Practitioner profile not found"));

        User user = userRepository.findById(profile.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.PRACTITIONER) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User is not a practitioner"));
        }

        profile.setVerified(true);
        profile.setRejectionReason(null);
        profile.setReuploadAllowedAt(null);
        practitionerProfileRepository.save(profile);

        user.setVerified(true);
        userRepository.save(user);

        return ResponseEntity.ok(
                Map.of("message", "Practitioner verified successfully")
        );
    }

    // =========================
    // 3️⃣ REJECT PRACTITIONER (1 MONTH LOCK)
    // =========================
    @PutMapping("/practitioner/{profileId}/reject")
    public ResponseEntity<?> rejectPractitioner(
            @PathVariable Long profileId,
            @RequestBody PractitionerRejectionDto dto
    ) {

        PractitionerProfile profile = practitionerProfileRepository
                .findById(profileId)
                .orElseThrow(() -> new RuntimeException("Practitioner profile not found"));

        User user = userRepository.findById(profile.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.PRACTITIONER) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "User is not a practitioner"));
        }

        profile.setVerified(false);
        profile.setRejectionReason(dto.getReason());
        profile.setReuploadAllowedAt(LocalDateTime.now().plusMonths(1));
        practitionerProfileRepository.save(profile);

        user.setVerified(false);
        userRepository.save(user);

        notificationService.notifyPractitionerRejection(
                user.getId(),
                dto.getReason()
        );

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Practitioner rejected. Re-upload allowed after 1 month"
                )
        );
    }
}
