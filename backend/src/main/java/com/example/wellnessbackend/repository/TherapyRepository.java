package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.Therapy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TherapyRepository extends JpaRepository<Therapy, Long> {
    List<Therapy> findByPractitionerId(Long practitionerId);
}
