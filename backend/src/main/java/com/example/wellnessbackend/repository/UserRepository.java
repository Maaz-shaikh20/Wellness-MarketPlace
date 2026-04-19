package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.Role;
import com.example.wellnessbackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // New method for practitioner verification
    List<User> findByRoleAndVerified(Role role, boolean verified);
}
