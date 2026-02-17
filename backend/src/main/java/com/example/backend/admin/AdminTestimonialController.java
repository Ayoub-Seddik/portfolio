package com.example.backend.admin;

import com.example.backend.testimonial.business.TestimonialService;
import com.example.backend.testimonial.presentation.TestimonialResponse;
import com.example.backend.testimonial.presentation.TestimonialStatusUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/testimonials")
@RequiredArgsConstructor
public class AdminTestimonialController {

    private final TestimonialService service;

    @GetMapping
    public ResponseEntity<List<TestimonialResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Void> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody TestimonialStatusUpdateRequest request
    ) {
        service.updateStatus(id, request.getStatus());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteIfDeclined(id);
        return ResponseEntity.noContent().build();
    }
}

