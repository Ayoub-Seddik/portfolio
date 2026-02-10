package com.example.backend.project.data;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "projects", indexes = {
        @Index(name = "idx_projects_slug", columnList = "slug", unique = true),
        @Index(name = "idx_projects_title", columnList = "title")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @NotBlank
    @Column(nullable = false, unique = true)
    private String slug;

    @NotBlank
    @Column(nullable = false, length = 500)
    private String description;

    @Column(length = 1000)
    private String imageUrl;

    @Column(length = 1000)
    private String liveUrl;

    @Column(length = 1000)
    private String githubUrl;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

}
