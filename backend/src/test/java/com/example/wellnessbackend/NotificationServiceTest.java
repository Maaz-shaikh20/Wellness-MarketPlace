package com.example.wellnessbackend;

import com.example.wellnessbackend.dto.NotificationResponseDto;
import com.example.wellnessbackend.entity.Notification;
import com.example.wellnessbackend.repository.NotificationRepository;
import com.example.wellnessbackend.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class NotificationServiceTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationService notificationService;

    private Notification notification1;
    private Notification notification2;

    @BeforeEach
    void setUp() {
        notification1 = Notification.builder()
                .id(1L)
                .userId(10L)
                .type("RECOMMENDATION")
                .message("Test recommendation alert")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();

        notification2 = Notification.builder()
                .id(2L)
                .userId(10L)
                .type("SESSION")
                .message("Test session booked alert")
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void testCreateNotification() {
        notificationService.createNotification(10L, "RECOMMENDATION", "Test message");
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void testGetAllNotifications() {
        when(notificationRepository.findByUserIdOrderByCreatedAtDesc(10L))
                .thenReturn(Arrays.asList(notification1, notification2));

        List<NotificationResponseDto> list = notificationService.getAllNotifications(10L);

        assertEquals(2, list.size());
        assertEquals(1L, list.get(0).getId());
        assertEquals(2L, list.get(1).getId());
        verify(notificationRepository, times(1)).findByUserIdOrderByCreatedAtDesc(10L);
    }

    @Test
    void testGetUnreadNotifications() {
        when(notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(10L))
                .thenReturn(Arrays.asList(notification1, notification2));

        List<NotificationResponseDto> list = notificationService.getUnreadNotifications(10L);

        assertEquals(2, list.size());
        assertFalse(list.get(0).isRead());
        verify(notificationRepository, times(1)).findByUserIdAndReadFalseOrderByCreatedAtDesc(10L);
    }

    @Test
    void testMarkAsRead() {
        when(notificationRepository.findById(1L)).thenReturn(Optional.of(notification1));
        when(notificationRepository.save(any(Notification.class))).thenReturn(notification1);

        Optional<Notification> result = notificationService.markAsRead(1L);

        assertTrue(result.isPresent());
        assertTrue(result.get().isRead());
        verify(notificationRepository, times(1)).findById(1L);
        verify(notificationRepository, times(1)).save(notification1);
    }

    @Test
    void testMarkAllAsRead() {
        List<Notification> list = Arrays.asList(notification1, notification2);
        when(notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(10L)).thenReturn(list);
        when(notificationRepository.saveAll(list)).thenReturn(list);

        int count = notificationService.markAllAsRead(10L);

        assertEquals(2, count);
        assertTrue(notification1.isRead());
        assertTrue(notification2.isRead());
        verify(notificationRepository, times(1)).findByUserIdAndReadFalseOrderByCreatedAtDesc(10L);
        verify(notificationRepository, times(1)).saveAll(list);
    }
}
