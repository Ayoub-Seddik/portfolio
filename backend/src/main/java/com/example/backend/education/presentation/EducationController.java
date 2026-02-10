package com.example.backend.education.presentation;

import com.example.backend.education.business.EducationService;
import com.example.backend.education.data.Education;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/educations")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService service;

    @GetMapping
    public List<Education> list() {
        return service.listPublic();
    }
}
