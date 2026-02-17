package com.example.backend.testimonial.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {
    List<Testimonial> findAllByStatusOrderByCreatedAtDesc(TestimonialStatus status);
    List<Testimonial> findAllByOrderByCreatedAtDesc();}

