package com.example.backend.testimonial.presentation;

import com.example.backend.testimonial.data.Testimonial;
import com.example.backend.testimonial.data.TestimonialStatus;

import java.time.Instant;

public record TestimonialResponse(
        Long id,
        String name,
        String company,
        String relation,
        String message,
        TestimonialStatus status,
        Instant createdAt
) {
    public static TestimonialResponse from(Testimonial t) {
        return new TestimonialResponse(
                t.getId(),
                t.getName(),
                t.getCompany(),
                t.getRelation(),
                t.getMessage(),
                t.getStatus(),
                t.getCreatedAt()
        );
    }
}

