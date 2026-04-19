package com.example.wellnessbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "practitioner_profile")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PractitionerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private String specialization;

    @Builder.Default
    @Column(nullable = false)
    private Boolean verified = false;

    @Builder.Default
    @Column(nullable = false)
    private Double rating = 0.0;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(columnDefinition = "TEXT")
    private String certificateLink;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    private LocalDateTime certificateSubmittedAt;

    private LocalDateTime reuploadAllowedAt;

    @Column(columnDefinition = "TEXT")
    private String clinicAddress;
}