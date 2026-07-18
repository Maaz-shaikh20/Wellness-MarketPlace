package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.RefreshToken;
import com.example.wellnessbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);

    @Transactional
    void deleteByUser(User user);
}
