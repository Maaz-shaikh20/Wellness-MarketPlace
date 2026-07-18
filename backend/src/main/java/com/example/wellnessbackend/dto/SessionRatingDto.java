package com.example.wellnessbackend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SessionRatingDto {

    private Long sessionId;
    private Long userId;
    private Long practitionerId;

    /** 1 – 5 */
    private Integer rating;

    private String comment;
}
