package com.example.backend.testimonial.presentation;

import com.example.backend.testimonial.data.TestimonialStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TestimonialStatusUpdateRequest {
    @NotNull
    private TestimonialStatus status;
}

