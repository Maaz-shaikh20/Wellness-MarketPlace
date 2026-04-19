package com.example.wellnessbackend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)   // store enum name in DB column
    private Role role;             // PATIENT, PRACTITIONER, ADMIN

    private String bio;

    @Column(nullable = false)
    private boolean verified = false;  // default false

}
