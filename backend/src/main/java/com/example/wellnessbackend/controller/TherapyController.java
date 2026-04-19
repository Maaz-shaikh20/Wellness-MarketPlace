package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.TherapyDto;
import com.example.wellnessbackend.entity.Therapy;
import com.example.wellnessbackend.service.TherapyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/therapies")
@RequiredArgsConstructor
public class TherapyController {

    private final TherapyService therapyService;

    @PostMapping
    public ResponseEntity<Therapy> createTherapy(@RequestBody TherapyDto dto) {
        return ResponseEntity.ok(therapyService.createTherapy(dto));
    }

    @GetMapping("/practitioner/{id}")
    public ResponseEntity<List<Therapy>> getByPractitioner(@PathVariable Long id) {
        return ResponseEntity.ok(therapyService.getTherapiesByPractitioner(id));
    }

    // ------------------- NEW: Get therapy by id -------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getTherapyById(@PathVariable Long id) {
        try {
            Therapy therapy = therapyService.getTherapyById(id);
            return ResponseEntity.ok(therapy);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(404).body(Map.of("message", ex.getMessage()));
        }
    }

    // ------------------- OPTIONAL: Get all therapies -------------------
    @GetMapping
    public ResponseEntity<List<Therapy>> getAllTherapies() {
        return ResponseEntity.ok(therapyService.getAllTherapies());
    }

    // ------------------ NEW: Update therapy ------------------
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTherapy(@PathVariable Long id, @RequestBody TherapyDto dto) {
        try {
            Therapy updated = therapyService.updateTherapy(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException ex) {
            return ResponseEntity.status(403).body(Map.of("message", ex.getMessage()));
        }
    }

    // ------------------ NEW: Delete therapy ------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTherapy(@PathVariable Long id) {
        try {
            therapyService.deleteTherapy(id);
            return ResponseEntity.ok(Map.of("message", "Therapy deleted successfully"));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(403).body(Map.of("message", ex.getMessage()));
        }
    }
}
