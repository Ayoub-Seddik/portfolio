package com.example.backend.contact.presentation;

public record ContactMessagesResponse(
        Long id,
        String fullName,
        String contactEmail,
        String contactNumber,
        String reason,
        java.time.Instant createdAt
) {
}
