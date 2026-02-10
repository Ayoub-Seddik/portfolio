package com.example.backend.experience.presentation;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ExperienceRequestDTO {

    @NotBlank
    private String company;

    @NotBlank
    private String position;

    @NotNull
    @Min(1900)
    @Max(3000)
    private Integer startYear;

    @Min(1900)
    @Max(3000)
    private Integer endYear;

    @NotNull
    private Boolean isPresent;

    @NotBlank
    @Size(max = 2000)
    private String summary;

    @NotNull
    private Integer sortOrder;
}
