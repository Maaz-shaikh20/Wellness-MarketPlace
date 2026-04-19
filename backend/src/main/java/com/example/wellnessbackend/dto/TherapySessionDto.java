package com.example.wellnessbackend.dto;
import com.example.wellnessbackend.entity.CancelledBy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TherapySessionDto {

    private Long therapyId;       // Required for booking

    private Long practitionerId;  // Required for booking

    private Long userId;          // Patient booking the session

    private LocalDateTime dateTime; // Scheduled date & time

    private String status;        // Optional: booked / completed / cancelled

    private String notes;         // Optional session notes

    private String rejectedReason;

    private String cancellationReason;

    private CancelledBy cancelledBy;

}
