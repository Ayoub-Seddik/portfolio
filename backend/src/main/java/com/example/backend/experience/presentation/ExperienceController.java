package com.example.backend.experience.presentation;

import com.example.backend.experience.business.ExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
@RequiredArgsConstructor
public class ExperienceController {

    private final ExperienceService service;

    @GetMapping
    public List<ExperienceResponseDTO> list() {
        return service.getPublicExperience();
    }
}
