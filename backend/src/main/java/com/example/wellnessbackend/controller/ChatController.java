package com.example.wellnessbackend.controller;

import com.example.wellnessbackend.dto.ChatMessageDto;
import com.example.wellnessbackend.entity.ChatMessage;
import com.example.wellnessbackend.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

/**
 * Handles real-time STOMP messages.
 *
 * Flow:
 *  1. Client sends to: /app/chat.send
 *  2. This method saves to DB and broadcasts to /topic/chat/{sessionId}
 *  3. All subscribers in that session receive the message instantly
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;

    @MessageMapping("/chat.send")
    public void handleChatMessage(@Payload ChatMessageDto dto) {
        // 1. Persist to database
        ChatMessage entity = ChatMessage.builder()
                .sessionId(dto.getSessionId())
                .senderId(dto.getSenderId())
                .senderName(dto.getSenderName())
                .content(dto.getContent())
                .sentAt(LocalDateTime.now())
                .read(false)
                .build();

        entity = chatMessageRepository.save(entity);
        log.info("💬 Chat [session={}] from {}: {}", dto.getSessionId(), dto.getSenderName(), dto.getContent());

        // 2. Build response DTO with server-assigned id + timestamp
        ChatMessageDto response = ChatMessageDto.builder()
                .id(entity.getId())
                .sessionId(entity.getSessionId())
                .senderId(entity.getSenderId())
                .senderName(entity.getSenderName())
                .content(entity.getContent())
                .sentAt(entity.getSentAt())
                .read(false)
                .build();

        // 3. Broadcast to everyone subscribed to this session's topic
        messagingTemplate.convertAndSend(
                "/topic/chat/" + entity.getSessionId(),
                response
        );
    }
}
