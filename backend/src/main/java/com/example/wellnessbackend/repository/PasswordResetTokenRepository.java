package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.PasswordResetToken;
import com.example.wellnessbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);
}
