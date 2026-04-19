package com.example.wellnessbackend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PractitionerResponseDto {
    private Long id;
    private Long userId;
    private String specialization;
    private Boolean verified;
    private Double rating;
    private String bio;
    private String certificateLink;
    private String rejectionReason;
    private LocalDateTime certificateSubmittedAt;
    private LocalDateTime reuploadAllowedAt;
    private String clinicAddress;
}
