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

    // GET /api/projects?q=tracker
    @GetMapping
    public List<ProjectResponseDTO> list(@RequestParam(required = false) String q) {
        return service.getProjects(q);
    }

    // GET /api/projects/{slug}
    @GetMapping("/{slug}")
    public ProjectResponseDTO bySlug(@PathVariable String slug) {
        return service.getBySlug(slug);
    }
}
