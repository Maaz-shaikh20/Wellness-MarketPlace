package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.NotificationResponseDto;
import com.example.wellnessbackend.entity.Notification;
import com.example.wellnessbackend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // ✅ CREATE notification
    @PostMapping
    public ResponseEntity<String> createNotification(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        String type = request.get("type").toString();
        String message = request.get("message").toString();

        notificationService.createNotification(userId, type, message);

        return ResponseEntity.ok("Notification created successfully");
    }

    // ✅ Get all notifications for a user
    @GetMapping("/{userId}")
    public ResponseEntity<List<NotificationResponseDto>> getAllNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getAllNotifications(userId));
    }

    // ✅ Get unread notifications
    @GetMapping("/{userId}/unread")
    public ResponseEntity<List<NotificationResponseDto>> getUnreadNotifications(@PathVariable Long userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }

    // ✅ Mark notification as read
    @PutMapping("/{notificationId}/read")
    public ResponseEntity<String> markAsRead(@PathVariable Long notificationId) {
        return notificationService.markAsRead(notificationId)
                .map(notification -> ResponseEntity.ok(
                        "Notification " + notificationId + " marked as read successfully"
                ))
                .orElseGet(() -> ResponseEntity.status(404)
                        .body("Notification with ID " + notificationId + " not found"));
    }
}
