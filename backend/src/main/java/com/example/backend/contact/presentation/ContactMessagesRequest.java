package com.example.backend.contact.presentation;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactMessagesRequest(
        @NotBlank @Size(max = 120) String fullName,
        @NotBlank @Email @Size(max = 255) String contactEmail,
        @NotBlank @Size(max = 10) String contactNumber,
        @NotBlank @Size(min = 20, max = 500) String reason
) {
}
