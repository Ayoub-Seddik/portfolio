package com.example.backend.project.presentation;

import com.example.backend.project.business.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/projects")
@RequiredArgsConstructor
public class AdminProjectController {

    private final ProjectService service;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectResponseDTO create(@Valid @RequestBody ProjectRequestDTO req) {
        return service.create(req);
    }

    @PutMapping("/{id}")
    public ProjectResponseDTO update(@PathVariable Long id, @Valid @RequestBody ProjectRequestDTO req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}