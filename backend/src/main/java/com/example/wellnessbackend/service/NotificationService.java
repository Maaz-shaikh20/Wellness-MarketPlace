package com.example.wellnessbackend.service;

import com.example.wellnessbackend.dto.NotificationResponseDto;
import com.example.wellnessbackend.entity.Notification;
import com.example.wellnessbackend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import org.springframework.scheduling.annotation.Async;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    // Create a new notification (Asynchronous)
    @Async
    public void createNotification(Long userId, String type, String message) {
        Notification notification = Notification.builder()
                .userId(userId)
                .type(type)
                .message(message)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);
    }

    // Create rejection notification for practitioner (Asynchronous)
    @Async
    public void notifyPractitionerRejection(Long userId, String reason) {
        createNotification(
                userId,
                "PRACTITIONER_REJECTED",
                "Your practitioner request was rejected. Reason: " + reason
        );
    }

    // Get all notifications for a user
    public List<NotificationResponseDto> getAllNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get unread notifications for a user
    public List<NotificationResponseDto> getUnreadNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Mark notification as read
    public Optional<Notification> markAsRead(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        notificationOpt.ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
        return notificationOpt; // return Optional so controller can handle 404
    }

    // Mapper: Entity -> DTO
    private NotificationResponseDto mapToDto(Notification notification) {
        return NotificationResponseDto.builder()
                .id(notification.getId())
                .type(notification.getType())
                .message(notification.getMessage())
                .read(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}
