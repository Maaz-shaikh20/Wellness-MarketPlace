package com.example.wellnessbackend.repository;

import com.example.wellnessbackend.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {

    /** All messages for a session, ordered by time (oldest first) */
    List<ChatMessage> findBySessionIdOrderBySentAtAsc(Long sessionId);

    /** Unread messages sent TO a user (by the other participant) in a session */
    List<ChatMessage> findBySessionIdAndSenderIdNotAndReadFalse(Long sessionId, Long senderId);
}
