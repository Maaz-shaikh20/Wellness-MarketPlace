package com.example.wellnessbackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "therapies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Therapy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long practitionerId;    // FK to Practitioner Profile

    private String name;

    @Column(length = 2000)
    private String description;

    private Double price;

    private Integer duration;       // minutes

    private String category;

    private String imageUrl;

    private Boolean available = true;

    private Double rating = 0.0;
}
