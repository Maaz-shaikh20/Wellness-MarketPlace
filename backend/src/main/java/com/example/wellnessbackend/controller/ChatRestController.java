package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.ChatMessageDto;
import com.example.wellnessbackend.entity.ChatMessage;
import com.example.wellnessbackend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST endpoints for chat history and unread counts.
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {

    private final ChatMessageRepository chatMessageRepository;

    // ── Get full message history for a session ──────────────────
    // GET /api/chat/history/{sessionId}
    @GetMapping("/history/{sessionId}")
    public ResponseEntity<List<ChatMessageDto>> getHistory(@PathVariable Long sessionId) {
        List<ChatMessageDto> messages = chatMessageRepository
                .findBySessionIdOrderBySentAtAsc(sessionId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messages);
    }

    // ── Mark all messages in a session as read (by the viewer) ──
    // PUT /api/chat/history/{sessionId}/read?userId={userId}
    @PutMapping("/history/{sessionId}/read")
    public ResponseEntity<?> markRead(
            @PathVariable Long sessionId,
            @RequestParam Long userId) {

        List<ChatMessage> unread = chatMessageRepository
                .findBySessionIdAndSenderIdNotAndReadFalse(sessionId, userId);

        unread.forEach(m -> m.setRead(true));
        chatMessageRepository.saveAll(unread);

        return ResponseEntity.ok(Map.of("markedRead", unread.size()));
    }

    // ── Unread count for a user in a session ────────────────────
    // GET /api/chat/history/{sessionId}/unread?userId={userId}
    @GetMapping("/history/{sessionId}/unread")
    public ResponseEntity<?> unreadCount(
            @PathVariable Long sessionId,
            @RequestParam Long userId) {

        int count = chatMessageRepository
                .findBySessionIdAndSenderIdNotAndReadFalse(sessionId, userId)
                .size();
        return ResponseEntity.ok(Map.of("unread", count));
    }

    // ── Helper ──────────────────────────────────────────────────
    private ChatMessageDto toDto(ChatMessage m) {
        return ChatMessageDto.builder()
                .id(m.getId())
                .sessionId(m.getSessionId())
                .senderId(m.getSenderId())
                .senderName(m.getSenderName())
                .content(m.getContent())
                .sentAt(m.getSentAt())
                .read(m.getRead())
                .build();
    }
}
