package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.TherapyDto;
import com.example.wellnessbackend.entity.Therapy;
import com.example.wellnessbackend.repository.TherapyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TherapyService {

    private final TherapyRepository therapyRepository;

    // ------------------ CREATE ------------------
    public Therapy createTherapy(TherapyDto dto) {
        Therapy therapy = Therapy.builder()
                .practitionerId(dto.getPractitionerId())
                .name(dto.getName())
                .description(dto.getDescription())
                .price(dto.getPrice())
                .duration(dto.getDuration())
                .category(dto.getCategory())
                .imageUrl(dto.getImageUrl())
                .available(true)     // ✅ explicitly set
                .rating(0.0)         // ✅ explicitly set
                .build();

        return therapyRepository.save(therapy);
    }

    // ------------------ READ ------------------
    public Therapy getTherapyById(Long id) {
        return therapyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Therapy not found with id: " + id));
    }

    public List<Therapy> getAllTherapies() {
        return therapyRepository.findAll();
    }

    public List<Therapy> getTherapiesByPractitioner(Long practitionerId) {
        return therapyRepository.findByPractitionerId(practitionerId);
    }

    // ------------------ UPDATE ------------------
    public Therapy updateTherapy(Long id, TherapyDto dto) {
        Therapy therapy = therapyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Therapy not found with id: " + id));

        if (dto.getName() != null) therapy.setName(dto.getName());
        if (dto.getDescription() != null) therapy.setDescription(dto.getDescription());
        if (dto.getPrice() != null) therapy.setPrice(dto.getPrice());
        if (dto.getDuration() != null) therapy.setDuration(dto.getDuration());
        if (dto.getCategory() != null) therapy.setCategory(dto.getCategory());
        if (dto.getImageUrl() != null) therapy.setImageUrl(dto.getImageUrl());
        if (dto.getAvailable() != null) therapy.setAvailable(dto.getAvailable());
        if (dto.getRating() != null) therapy.setRating(dto.getRating());

        return therapyRepository.save(therapy);
    }

    // ------------------ DELETE ------------------
    public void deleteTherapy(Long id) {
        Therapy therapy = therapyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Therapy not found with id: " + id));

        therapyRepository.delete(therapy);
    }
}
