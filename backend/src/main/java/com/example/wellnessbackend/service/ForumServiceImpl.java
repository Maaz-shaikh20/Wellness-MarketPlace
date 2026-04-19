package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.*;
import com.example.wellnessbackend.entity.*;
import com.example.wellnessbackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ForumServiceImpl implements ForumService {

    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final UserRepository userRepository;

    // USER → Ask Question
    @Override
    public Question ask(Long userId, QuestionRequestDto dto) {
        User user = userRepository.findById(userId).orElseThrow();

        Question q = new Question();
        q.setContent(dto.getContent());
        q.setUser(user);
        q.setAnswered(false);

        return questionRepository.save(q);
    }

    // PRACTITIONER → View Unanswered Questions
    @Override
    public List<Question> getUnanswered() {
        return questionRepository.findByAnsweredFalse();
    }

    // PRACTITIONER → View Answered Questions
    @Override
    public List<Question> getAnswered() {
        return questionRepository.findByAnsweredTrue();
    }

    // USER → View Own Questions (Answered + Unanswered)
    @Override
    public List<Question> getUserQuestions(Long userId) {
        return questionRepository.findByUserId(userId);
    }

    // PRACTITIONER → Post Answer
    @Override
    public Answer answer(Long practitionerId, AnswerRequestDto dto) {
        User practitioner = userRepository.findById(practitionerId).orElseThrow();
        Question question = questionRepository.findById(dto.getQuestionId()).orElseThrow();

        Answer a = new Answer();
        a.setAnswer(dto.getAnswer());
        a.setQuestion(question);
        a.setPractitioner(practitioner);

        // Mark question as answered
        question.setAnswered(true);
        questionRepository.save(question);

        return answerRepository.save(a);
    }

    // USER / PRACTITIONER → View Answers
    @Override
    public List<Answer> getAnswers(Long questionId) {
        return answerRepository.findByQuestionId(questionId);
    }
}
