package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Fetch all notifications for a user
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Fetch unread notifications only
    List<Notification> findByUserIdAndReadFalseOrderByCreatedAtDesc(Long userId);
}
