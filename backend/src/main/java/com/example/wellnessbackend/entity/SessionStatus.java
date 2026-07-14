package com.example.wellnessbackend.entity;

/**
 * Fix #7: Replaces raw String status in TherapySession with a type-safe enum.
 * Prevents typos like "compleeted" or mismatched cases from reaching the database.
 */
public enum SessionStatus {
    BOOKED,
    ACCEPTED,
    COMPLETED,
    CANCELLED,
    REJECTED
}
