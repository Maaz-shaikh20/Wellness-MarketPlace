package com.example.wellnessbackend;

import com.example.wellnessbackend.controller.NotificationController;
import com.example.wellnessbackend.dto.NotificationResponseDto;
import com.example.wellnessbackend.entity.Notification;
import com.example.wellnessbackend.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class NotificationControllerTest {

    private MockMvc mockMvc;
    private StubNotificationService stubService;
    private NotificationController notificationController;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Stub Subclass of NotificationService to bypass Mockito class-mocking restrictions in Java 23
    private static class StubNotificationService extends NotificationService {
        public List<NotificationResponseDto> getAllNotificationsResult;
        public List<NotificationResponseDto> getUnreadNotificationsResult;
        public Optional<Notification> markAsReadResult;
        public int markAllAsReadResult;

        public Long lastUserIdForCreate;
        public String lastTypeForCreate;
        public String lastMessageForCreate;
        public Long lastUserIdForAll;
        public Long lastUserIdForUnread;
        public Long lastNotificationIdForRead;
        public Long lastUserIdForReadAll;

        public StubNotificationService() {
            super(null);
        }

        @Override
        public void createNotification(Long userId, String type, String message) {
            this.lastUserIdForCreate = userId;
            this.lastTypeForCreate = type;
            this.lastMessageForCreate = message;
        }

        @Override
        public List<NotificationResponseDto> getAllNotifications(Long userId) {
            this.lastUserIdForAll = userId;
            return getAllNotificationsResult;
        }

        @Override
        public List<NotificationResponseDto> getUnreadNotifications(Long userId) {
            this.lastUserIdForUnread = userId;
            return getUnreadNotificationsResult;
        }

        @Override
        public Optional<Notification> markAsRead(Long notificationId) {
            this.lastNotificationIdForRead = notificationId;
            return markAsReadResult;
        }

        @Override
        public int markAllAsRead(Long userId) {
            this.lastUserIdForReadAll = userId;
            return markAllAsReadResult;
        }
    }

    @BeforeEach
    void setUp() {
        stubService = new StubNotificationService();
        notificationController = new NotificationController(stubService);
        mockMvc = MockMvcBuilders.standaloneSetup(notificationController).build();
    }

    @Test
    void testCreateNotification() throws Exception {
        Map<String, Object> request = Map.of(
                "userId", 10L,
                "type", "RECOMMENDATION",
                "message", "Test alerts"
        );

        mockMvc.perform(post("/api/notifications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Notification created successfully"));

        assertEquals(10L, stubService.lastUserIdForCreate);
        assertEquals("RECOMMENDATION", stubService.lastTypeForCreate);
        assertEquals("Test alerts", stubService.lastMessageForCreate);
    }

    @Test
    void testGetAllNotifications() throws Exception {
        NotificationResponseDto dto = NotificationResponseDto.builder()
                .id(1L)
                .type("RECOMMENDATION")
                .message("Test message")
                .read(false)
                .build();

        stubService.getAllNotificationsResult = Collections.singletonList(dto);

        mockMvc.perform(get("/api/notifications/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));

        assertEquals(10L, stubService.lastUserIdForAll);
    }

    @Test
    void testGetUnreadNotifications() throws Exception {
        NotificationResponseDto dto = NotificationResponseDto.builder()
                .id(1L)
                .type("RECOMMENDATION")
                .message("Test message")
                .read(false)
                .build();

        stubService.getUnreadNotificationsResult = Collections.singletonList(dto);

        mockMvc.perform(get("/api/notifications/10/unread"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L));

        assertEquals(10L, stubService.lastUserIdForUnread);
    }

    @Test
    void testMarkAsRead_Success() throws Exception {
        stubService.markAsReadResult = Optional.of(new Notification());

        mockMvc.perform(put("/api/notifications/1/read"))
                .andExpect(status().isOk())
                .andExpect(content().string("Notification 1 marked as read successfully"));

        assertEquals(1L, stubService.lastNotificationIdForRead);
    }

    @Test
    void testMarkAsRead_NotFound() throws Exception {
        stubService.markAsReadResult = Optional.empty();

        mockMvc.perform(put("/api/notifications/1/read"))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Notification with ID 1 not found"));

        assertEquals(1L, stubService.lastNotificationIdForRead);
    }

    @Test
    void testMarkAllAsRead() throws Exception {
        stubService.markAllAsReadResult = 5;

        mockMvc.perform(put("/api/notifications/user/10/read-all"))
                .andExpect(status().isOk())
                .andExpect(content().string("Marked 5 notifications as read successfully"));

        assertEquals(10L, stubService.lastUserIdForReadAll);
    }
}
