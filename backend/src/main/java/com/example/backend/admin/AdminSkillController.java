package com.example.backend.admin;

import com.example.backend.skill.business.SkillService;
import com.example.backend.skill.data.Skill;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/skills")
@RequiredArgsConstructor
public class AdminSkillController {

    private final SkillService service;

    @GetMapping
    public List<Skill> list() {
        return service.list();
    }

    @PostMapping
    public Skill create(@RequestBody Skill s) {
        return service.create(s);
    }

    @PutMapping("/{id}")
    public Skill update(@PathVariable Long id, @RequestBody Skill s) {
        return service.update(id, s);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}