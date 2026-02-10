package com.example.backend.experience.business;

import com.example.backend.experience.presentation.ExperienceRequestDTO;
import com.example.backend.experience.presentation.ExperienceResponseDTO;

import java.util.List;

public interface ExperienceService {
    List<ExperienceResponseDTO> getPublicExperience();
    List<ExperienceResponseDTO> getAdminExperience();
    ExperienceResponseDTO create(ExperienceRequestDTO request);
    ExperienceResponseDTO update(Long id, ExperienceRequestDTO request);
    void delete(Long id);
}
