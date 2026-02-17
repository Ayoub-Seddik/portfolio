package com.example.backend.testimonial.presentation;

import com.example.backend.testimonial.business.TestimonialService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/testimonials")
@RequiredArgsConstructor
public class TestimonialController {

    private final TestimonialService service;

    @GetMapping
    public ResponseEntity<List<TestimonialResponse>> getApproved() {
        return ResponseEntity.ok(service.getApprovedOnly());
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody TestimonialCreateRequest request) {
        service.createPending(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
