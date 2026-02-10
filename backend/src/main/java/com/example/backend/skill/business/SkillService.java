package com.example.backend.skill.business;

import com.example.backend.skill.data.Skill;
import com.example.backend.skill.data.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository repo;

    public List<Skill> list() {
        return repo.findAllByOrderByCategoryAscSortOrderAsc();
    }

    public Skill create(Skill s) {
        return repo.save(s);
    }

    public Skill update(Long id, Skill updated) {
        Skill existing = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Skill not found"));
        existing.setCategory(updated.getCategory());
        existing.setName(updated.getName());
        existing.setSortOrder(updated.getSortOrder());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
