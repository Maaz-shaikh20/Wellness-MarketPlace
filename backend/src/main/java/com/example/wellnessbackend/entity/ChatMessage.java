package com.example.wellnessbackend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The therapy session this chat belongs to */
    @Column(name = "session_id", nullable = false)
    private Long sessionId;

    /** User ID of the message sender */
    @Column(name = "sender_id", nullable = false)
    private Long senderId;

    /** Name of the sender (denormalized for fast display) */
    @Column(name = "sender_name")
    private String senderName;

    /** The message content */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    /** When the message was sent */
    @Column(name = "sent_at", nullable = false)
    private LocalDateTime sentAt;

    /** Whether the other party has read it */
    @Builder.Default
    @Column(name = "is_read")
    private Boolean read = false;
}
