package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Unanswered questions (for practitioners)
    List<Question> findByAnsweredFalse();

    // Answered questions (for practitioners / public)
    List<Question> findByAnsweredTrue();

    // All questions asked by a specific user (answered + unanswered)
    List<Question> findByUserId(Long userId);
}
