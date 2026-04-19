package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.PractitionerCreateDto;
import com.example.wellnessbackend.dto.PractitionerResponseDto;
import com.example.wellnessbackend.entity.PractitionerProfile;
import com.example.wellnessbackend.entity.Role;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.PractitionerProfileRepository;
import com.example.wellnessbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PractitionerService {

    private final PractitionerProfileRepository repository;
    private final UserRepository userRepository;

    @CacheEvict(value = "practitioners", allEntries = true)
    public PractitionerResponseDto createPractitioner(Long userId, PractitionerCreateDto request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() != Role.PRACTITIONER) {
            throw new RuntimeException("User is not a practitioner");
        }

        if (repository.findByUserId(userId).isPresent()) {
            throw new RuntimeException("Practitioner profile already exists");
        }

        PractitionerProfile profile = PractitionerProfile.builder()
                .userId(userId)
                .specialization(request.getSpecialization())
                .bio(request.getBio())
                .clinicAddress(request.getClinicAddress())
                .verified(false)
                .rating(0.0)
                .build();

        return mapToDto(repository.save(profile));
    }

    public PractitionerProfile getProfileById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Practitioner not found"));
    }

    @Cacheable(value = "practitioners", key = "#userId")
    public PractitionerProfile getByUserId(Long userId) {
        return repository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Practitioner not found"));
    }

    // =========================
    // UPDATED canReupload LOGIC FOR WELLNEST
    // =========================
    public boolean canReupload(PractitionerProfile profile) {
        if (profile.getVerified()) return false; // verified profiles cannot reupload

        if (profile.getCertificateSubmittedAt() == null) return true; // first submission allowed

        if (profile.getRejectionReason() != null) {
            // rejected → allow reupload only after reuploadAllowedAt
            return profile.getReuploadAllowedAt() == null ||
                    LocalDateTime.now().isAfter(profile.getReuploadAllowedAt());
        }

        // under review → allow immediate reupload
        return true;
    }

    @CacheEvict(value = "practitioners", allEntries = true)
    public PractitionerProfile saveProfile(PractitionerProfile profile) {
        return repository.save(profile);
    }

    @Cacheable(value = "practitioners")
    public List<PractitionerResponseDto> getAll() {
        return repository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PractitionerResponseDto mapToDto(PractitionerProfile profile) {
        return PractitionerResponseDto.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .specialization(profile.getSpecialization())
                .bio(profile.getBio())
                .verified(profile.getVerified())
                .rating(profile.getRating())
                .certificateLink(profile.getCertificateLink())
                .rejectionReason(profile.getRejectionReason())
                .certificateSubmittedAt(profile.getCertificateSubmittedAt())
                .reuploadAllowedAt(profile.getReuploadAllowedAt())
                .clinicAddress(profile.getClinicAddress())
                .build();
    }
}
