package com.example.backend.education.business;

import com.example.backend.education.data.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EducationService {

    private final EducationRepository repo;

    public List<Education> listPublic() {
        return repo.findAllByOrderBySortOrderAsc();
    }

    public Education create(Education e) {
        return repo.save(e);
    }

    public Education update(Long id, Education updated) {
        Education existing = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Education not found"));
        existing.setLevel(updated.getLevel());
        existing.setSchool(updated.getSchool());
        existing.setProgram(updated.getProgram());
        existing.setStatus(updated.getStatus());
        existing.setCompletedYear(updated.getCompletedYear());
        existing.setSortOrder(updated.getSortOrder());
        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
