package com.example.backend.project.presentation;

import jakarta.validation.constraints.NotBlank;

public record ProjectRequestDTO(
        @NotBlank String title,
        @NotBlank String slug,
        @NotBlank String description,
        String imageUrl,
        String liveUrl,
        String githubUrl
) {}