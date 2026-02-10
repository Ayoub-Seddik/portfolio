package com.example.backend.admin;

import com.example.backend.experience.business.ExperienceService;
import com.example.backend.experience.presentation.ExperienceRequestDTO;
import com.example.backend.experience.presentation.ExperienceResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/experiences")
@RequiredArgsConstructor
public class AdminExperienceController {

    private final ExperienceService service;

    @GetMapping
    public List<ExperienceResponseDTO> list() {
        return service.getAdminExperience();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExperienceResponseDTO create(@Valid @RequestBody ExperienceRequestDTO request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    public ExperienceResponseDTO update(@PathVariable Long id, @Valid @RequestBody ExperienceRequestDTO request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
