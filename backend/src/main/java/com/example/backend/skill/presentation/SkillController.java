package com.example.backend.skill.presentation;

import com.example.backend.skill.business.SkillService;
import com.example.backend.skill.data.Skill;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService service;

    @GetMapping
    public List<Skill> list() {
        return service.list();
    }
}
