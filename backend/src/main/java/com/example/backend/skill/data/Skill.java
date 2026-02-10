package com.example.backend.skill.data;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "skills",
        uniqueConstraints = @UniqueConstraint(name = "uk_skill_category_name", columnNames = {"category", "name"})
)
@Data
@NoArgsConstructor @AllArgsConstructor @Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String category; // "FrontEnd", "BackEnd", "Design"

    @Column(nullable = false)
    private String name; // "React", "Java", etc

    @Column(nullable = false)
    private Integer sortOrder;
}
