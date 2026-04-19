package com.example.wellnessbackend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AnswerRequestDto {
    private Long questionId;
    private String answer;
}
