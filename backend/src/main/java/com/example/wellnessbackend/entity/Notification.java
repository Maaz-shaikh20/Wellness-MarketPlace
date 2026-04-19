package com.example.wellnessbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Receiver of notification (User or Practitioner)
    @Column(nullable = false)
    private Long userId;

    // SESSION_BOOKED, SESSION_CANCELLED, SESSION_COMPLETED
    @Column(nullable = false)
    private String type;

    @Column(nullable = false, length = 500)
    private String message;

    // 🔴 FIX: map Java field `read` to safe DB column `is_read`
    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;
}
