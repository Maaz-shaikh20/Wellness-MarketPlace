package com.example.wellnessbackend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PractitionerCreateDto {
    private String specialization;
    private String bio;
    private String clinicAddress;
}
