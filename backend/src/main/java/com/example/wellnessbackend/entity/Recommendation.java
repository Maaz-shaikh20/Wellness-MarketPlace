package com.example.wellnessbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "recommendations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;   // Patient who received the recommendation

    @Column(nullable = false, length = 255)
    private String symptom;   // Symptom reported by the user

    @Column(nullable = false, length = 100)
    private String suggestedTherapy;  // Suggested therapy type

    @Column(nullable = false, length = 50)
    private String sourceAPI;  // RULE_ENGINE / OPENFDA / WHO etc.

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
