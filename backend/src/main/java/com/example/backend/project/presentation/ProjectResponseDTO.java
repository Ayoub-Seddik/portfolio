package com.example.backend.project.presentation;

import java.time.Instant;

public record ProjectResponseDTO(
        Long id,
        String title,
        String slug,
        String description,
        String imageUrl,
        String liveUrl,
        String githubUrl,
        Instant createdAt
) {}