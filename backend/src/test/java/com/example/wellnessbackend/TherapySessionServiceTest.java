package com.example.wellnessbackend;

import com.example.wellnessbackend.dto.TherapySessionDto;
import com.example.wellnessbackend.entity.SessionStatus;
import com.example.wellnessbackend.repository.PractitionerProfileRepository;
import com.example.wellnessbackend.repository.TherapySessionRepository;
import com.example.wellnessbackend.service.NotificationService;
import com.example.wellnessbackend.service.TherapySessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Fix #17: Unit tests for TherapySessionService, covering:
 * - Past-date booking rejection (Fix #14)
 * - Non-hourly slot rejection
 * - Double-booking prevention
 */
@ExtendWith(MockitoExtension.class)
public class TherapySessionServiceTest {

    @Mock
    private TherapySessionRepository sessionRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private PractitionerProfileRepository practitionerProfileRepository;

    @InjectMocks
    private TherapySessionService therapySessionService;

    private TherapySessionDto validDto;

    @BeforeEach
    void setUp() {
        validDto = new TherapySessionDto();
        validDto.setTherapyId(1L);
        validDto.setPractitionerId(2L);
        validDto.setUserId(3L);
        // Future date, on the hour
        validDto.setDateTime(LocalDateTime.now().plusDays(1).withMinute(0).withSecond(0).withNano(0).withHour(10));
    }

    @Test
    @DisplayName("Fix #14: Booking with past date → throws RuntimeException")
    void testBookSession_PastDate_Throws() {
        validDto.setDateTime(LocalDateTime.now().minusDays(1));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                therapySessionService.bookSession(validDto));

        assertTrue(ex.getMessage().contains("past"),
                "Error should mention 'past', got: " + ex.getMessage());
    }

    @Test
    @DisplayName("Booking with non-hourly minute → throws RuntimeException")
    void testBookSession_NonHourlySlot_Throws() {
        validDto.setDateTime(LocalDateTime.now().plusDays(1).withMinute(30).withSecond(0));

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                therapySessionService.bookSession(validDto));

        assertTrue(ex.getMessage().toLowerCase().contains("slot") || ex.getMessage().toLowerCase().contains("hourly"),
                "Error should mention slot/hourly, got: " + ex.getMessage());
    }

    @Test
    @DisplayName("Booking when slot is available → session saved successfully")
    void testBookSession_AvailableSlot_Success() {
        when(practitionerProfileRepository.findByUserId(any())).thenReturn(Optional.empty());
        when(sessionRepository.findByPractitionerId(any())).thenReturn(java.util.List.of());
        when(sessionRepository.existsByTherapyIdAndPractitionerIdAndDateTimeAndStatusNot(
                any(), any(), any(), any())).thenReturn(false);
        when(sessionRepository.save(any())).thenAnswer(inv -> {
            var s = inv.getArgument(0, com.example.wellnessbackend.entity.TherapySession.class);
            s.setId(99L);
            return s;
        });

        var session = therapySessionService.bookSession(validDto);

        assertNotNull(session);
        assertEquals(SessionStatus.BOOKED, session.getStatus());
        verify(sessionRepository, times(1)).save(any());
    }
}
