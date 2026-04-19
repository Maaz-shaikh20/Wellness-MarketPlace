package com.example.wellnessbackend.dto;

import lombok.Data;

@Data
public class NotificationRequestDto {
    private String type;
    private String message;
}
