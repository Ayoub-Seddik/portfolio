package com.example.backend.education.data;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "education",
        uniqueConstraints = @UniqueConstraint(name = "uk_education_level_school_program", columnNames = {"level", "school", "program"})
)
@Data
@NoArgsConstructor @AllArgsConstructor @Builder
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String level; // e.g. "College", "University"

    @Column(nullable = false)
    private String school;

    @Column(nullable = false)
    private String program;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EducationStatus status; // IN_PROGRESS / COMPLETED

    private Integer completedYear; // null if not applicable

    @Column(nullable = false)
    private Integer sortOrder;
}
