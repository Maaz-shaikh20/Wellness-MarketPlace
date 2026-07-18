package com.example.wellnessbackend.dto;

import lombok.*;

import java.time.LocalDateTime;

/**
 * Sent from client → server (via STOMP /app/chat.send)
 * AND broadcast server → client (via /topic/chat/{sessionId})
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDto {

    private Long id;            // null on incoming; set on outgoing
    private Long sessionId;
    private Long senderId;
    private String senderName;
    private String content;
    private LocalDateTime sentAt;
    private Boolean read;
}
