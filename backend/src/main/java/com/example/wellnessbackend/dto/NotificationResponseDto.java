package com.example.wellnessbackend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponseDto {

    private Long id;
    private String type;
    private String message;
    private boolean read;
    private LocalDateTime createdAt;
}
