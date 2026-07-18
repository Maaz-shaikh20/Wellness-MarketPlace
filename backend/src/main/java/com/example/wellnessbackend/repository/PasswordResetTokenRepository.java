package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.PasswordResetToken;
import com.example.wellnessbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);

    @Transactional
    void deleteByUser(User user);
}
