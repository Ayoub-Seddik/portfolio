package com.example.backend.project.presentation;

import com.example.backend.project.business.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService service;

    // GET /api/projects?lang=fr
    @GetMapping
    public List<ProjectResponseDTO> listProjects(
            @RequestParam(defaultValue = "en") String lang
    ) {
        return service.getProjects();
    }

    // GET /api/projects/{slug}
    @GetMapping("/{slug}")
    public ProjectResponseDTO bySlug(@PathVariable String slug) {
        return service.getBySlug(slug);
    }
}
