package com.example.backend.experience.business;

import com.example.backend.experience.data.Experience;
import com.example.backend.experience.data.ExperienceRepository;
import com.example.backend.experience.presentation.ExperienceRequestDTO;
import com.example.backend.experience.presentation.ExperienceResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExperienceServiceImpl implements ExperienceService {

    private final ExperienceRepository repo;

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceResponseDTO> getPublicExperience() {
        // Public ordering: current first, then newest -> oldest
        return repo.findAll().stream()
                .sorted(publicComparator())
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExperienceResponseDTO> getAdminExperience() {
        // Admin ordering: your explicit sortOrder
        return repo.findAllByOrderBySortOrderAsc().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public ExperienceResponseDTO create(ExperienceRequestDTO request) {
        validate(request);

        Experience e = Experience.builder()
                .company(request.getCompany().trim())
                .position(request.getPosition().trim())
                .startYear(request.getStartYear())
                .endYear(request.getIsPresent() ? null : request.getEndYear())
                .isPresent(request.getIsPresent())
                .summary(request.getSummary().trim())
                .sortOrder(request.getSortOrder())
                .build();

        return toDto(repo.save(e));
    }

    @Override
    public ExperienceResponseDTO update(Long id, ExperienceRequestDTO request) {
        validate(request);

        Experience e = repo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Experience not found"));

        e.setCompany(request.getCompany().trim());
        e.setPosition(request.getPosition().trim());
        e.setStartYear(request.getStartYear());
        e.setIsPresent(request.getIsPresent());
        e.setEndYear(request.getIsPresent() ? null : request.getEndYear());
        e.setSummary(request.getSummary().trim());
        e.setSortOrder(request.getSortOrder());

        return toDto(repo.save(e));
    }

    @Override
    public void delete(Long id) {
        if (!repo.existsById(id)) throw new IllegalArgumentException("Experience not found");
        repo.deleteById(id);
    }

    private void validate(ExperienceRequestDTO r) {
        // If present, endYear must be null (we enforce it)
        // If not present, endYear must exist and be >= startYear
        if (Boolean.FALSE.equals(r.getIsPresent())) {
            if (r.getEndYear() == null) {
                throw new IllegalArgumentException("endYear is required when isPresent is false");
            }
            if (r.getEndYear() < r.getStartYear()) {
                throw new IllegalArgumentException("endYear must be >= startYear");
            }
        }
    }

    private ExperienceResponseDTO toDto(Experience e) {
        return ExperienceResponseDTO.builder()
                .id(e.getId())
                .company(e.getCompany())
                .position(e.getPosition())
                .startYear(e.getStartYear())
                .endYear(e.getEndYear())
                .isPresent(e.getIsPresent())
                .summary(e.getSummary())
                .sortOrder(e.getSortOrder())
                .build();
    }

    private Comparator<Experience> publicComparator() {
        // present first, then endYear desc (nulls last), then startYear desc
        return Comparator
                .comparing((Experience e) -> e.getIsPresent() != null && e.getIsPresent() ? 0 : 1)
                .thenComparing((Experience e) -> e.getEndYear() == null ? Integer.MIN_VALUE : e.getEndYear(), Comparator.reverseOrder())
                .thenComparing(Experience::getStartYear, Comparator.reverseOrder());
    }
}
