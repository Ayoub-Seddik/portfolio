package com.example.backend.admin;

import com.example.backend.education.business.EducationService;
import com.example.backend.education.data.Education;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/educations")
@RequiredArgsConstructor
public class AdminEducationController {

    private final EducationService service;

    @GetMapping
    public List<Education> list() {
        return service.listPublic();
    }

    @PostMapping
    public Education create(@RequestBody Education e) {
        return service.create(e);
    }

    @PutMapping("/{id}")
    public Education update(@PathVariable Long id, @RequestBody Education e) {
        return service.update(id, e);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
