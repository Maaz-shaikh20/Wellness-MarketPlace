package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.*;
import com.example.wellnessbackend.entity.*;
import java.util.List;

public interface ForumService {

    // USER → Ask Question
    Question ask(Long userId, QuestionRequestDto dto);

    // PRACTITIONER → View unanswered questions
    List<Question> getUnanswered();

    // PRACTITIONER → View answered questions
    List<Question> getAnswered();

    // USER → View own questions (answered + unanswered)
    List<Question> getUserQuestions(Long userId);

    // PRACTITIONER → Post answer
    Answer answer(Long practitionerId, AnswerRequestDto dto);

    // USER / PRACTITIONER → View answers of a question
    List<Answer> getAnswers(Long questionId);
}
