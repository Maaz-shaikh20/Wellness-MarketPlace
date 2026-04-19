package com.example.wellnessbackend.entity;
import com.example.wellnessbackend.entity.CancelledBy;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "therapy_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TherapySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long therapyId; // FK to Therapy

    @Column(nullable = false)
    private Long practitionerId; // FK to practitioner

    @Column(nullable = false)
    private Long userId; // FK to patient

    @Column(nullable = false)
    private LocalDateTime dateTime; // Scheduled session time

    @Column(nullable = false)
    private String status; // booked / completed / cancelled

    @Column(length = 2000)
    private String notes; // Optional session notes

    @Column(length = 2000)
    private String cancellationReason;

    @Column(length = 2000)
    private String rejectedReason;

    @Enumerated(EnumType.STRING)
    private CancelledBy cancelledBy;

}
