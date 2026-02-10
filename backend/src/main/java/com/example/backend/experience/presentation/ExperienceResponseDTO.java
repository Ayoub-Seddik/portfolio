package com.example.backend.experience.presentation;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ExperienceResponseDTO {
    private Long id;
    private String company;
    private String position;
    private Integer startYear;
    private Integer endYear;
    private Boolean isPresent;
    private String summary;
    private Integer sortOrder;
}
