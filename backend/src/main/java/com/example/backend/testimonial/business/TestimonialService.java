package com.example.backend.testimonial.business;

import com.example.backend.testimonial.data.TestimonialStatus;
import com.example.backend.testimonial.presentation.TestimonialCreateRequest;
import com.example.backend.testimonial.presentation.TestimonialResponse;

import java.util.List;

public interface TestimonialService {
    void createPending(TestimonialCreateRequest request);
    List<TestimonialResponse> getApprovedOnly();
    List<TestimonialResponse> getAll();
    void updateStatus(Long id, TestimonialStatus status);
    void deleteIfDeclined(Long id);
}
