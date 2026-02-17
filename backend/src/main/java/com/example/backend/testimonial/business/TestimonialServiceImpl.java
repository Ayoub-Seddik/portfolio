package com.example.backend.testimonial.business;

import com.example.backend.testimonial.data.Testimonial;
import com.example.backend.testimonial.data.TestimonialRepository;
import com.example.backend.testimonial.data.TestimonialStatus;
import com.example.backend.testimonial.presentation.TestimonialCreateRequest;
import com.example.backend.testimonial.presentation.TestimonialResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TestimonialServiceImpl implements TestimonialService {

    private final TestimonialRepository repo;

    @Override
    public void createPending(TestimonialCreateRequest request) {
        Testimonial t = Testimonial.builder()
                .name(request.getName().trim())
                .company(request.getCompany() == null || request.getCompany().trim().isEmpty()
                        ? null
                        : request.getCompany().trim())
                .relation(request.getRelation().trim())
                .message(request.getMessage().trim())
                .status(TestimonialStatus.PENDING)
                .build();

        repo.save(t);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestimonialResponse> getApprovedOnly() {
        return repo.findAllByStatusOrderByCreatedAtDesc(TestimonialStatus.APPROVED)
                .stream()
                .map(TestimonialResponse::from)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TestimonialResponse> getAll() {
        return repo.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(TestimonialResponse::from)
                .toList();
    }

    @Override
    public void updateStatus(Long id, TestimonialStatus status) {
        Testimonial t = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Testimonial not found: " + id));
        t.setStatus(status);
        repo.save(t);
    }

    @Override
    public void deleteIfDeclined(Long id) {
        Testimonial t = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Testimonial not found: " + id));
        if (t.getStatus() != TestimonialStatus.DECLINED) {
            throw new IllegalStateException("Can only delete declined testimonials.");
        }
        repo.delete(t);
    }
}
