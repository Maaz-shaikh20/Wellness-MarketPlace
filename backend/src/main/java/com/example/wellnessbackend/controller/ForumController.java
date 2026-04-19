package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.*;
import com.example.wellnessbackend.entity.User;
import com.example.wellnessbackend.repository.UserRepository;
import com.example.wellnessbackend.service.ForumService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final ForumService forumService;
    private final UserRepository userRepository;

    // USER → Ask Question
    @PostMapping("/ask")
    public Object ask(Authentication auth, @RequestBody QuestionRequestDto dto) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return forumService.ask(user.getId(), dto);
    }

    // PRACTITIONER → View Unanswered Questions
    @GetMapping("/unanswered")
    public Object getUnanswered() {
        return forumService.getUnanswered();
    }

    // PRACTITIONER → View Answered Questions
    @GetMapping("/answered")
    public Object getAnswered() {
        return forumService.getAnswered();
    }

    // USER → View My Questions (Answered + Unanswered)
    @GetMapping("/my-questions")
    public Object getMyQuestions(Authentication auth) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return forumService.getUserQuestions(user.getId());
    }

    // PRACTITIONER → Post Answer
    @PostMapping("/answer")
    public Object answer(Authentication auth, @RequestBody AnswerRequestDto dto) {
        UserDetails userDetails = (UserDetails) auth.getPrincipal();
        User practitioner = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        return forumService.answer(practitioner.getId(), dto);
    }

    // USER / PRACTITIONER → View Answers
    @GetMapping("/answers/{qid}")
    public Object getAnswers(@PathVariable Long qid) {
        return forumService.getAnswers(qid);
    }
}
