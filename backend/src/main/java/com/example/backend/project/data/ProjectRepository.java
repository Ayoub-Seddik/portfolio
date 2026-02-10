package com.example.backend.project.data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Optional<Project> findBySlug(String slug);
    List<Project> findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(String title);
    List<Project> findAllByOrderByCreatedAtDesc();
    boolean existsBySlug(String slug);

}
