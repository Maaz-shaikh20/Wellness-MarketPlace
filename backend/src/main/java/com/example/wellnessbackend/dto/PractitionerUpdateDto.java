package com.example.wellnessbackend.dto;

import lombok.Data;

@Data
public class PractitionerUpdateDto {
    private String specialization;
    private String bio;
    private String clinicAddress;
}
