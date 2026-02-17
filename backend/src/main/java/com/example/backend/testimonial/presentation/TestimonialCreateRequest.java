package com.example.backend.testimonial.presentation;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class TestimonialCreateRequest {

    @NotBlank
    @Size(max = 120)
    private String name;

    @Size(max = 120)
    private String company; // optional

    @NotBlank
    @Size(max = 120)
    private String relation;

    @NotBlank
    @Size(min = 20, max = 500)
    private String message;
}
