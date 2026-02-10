package com.example.backend.project.business;

import com.example.backend.exception.DuplicateSlugException;
import com.example.backend.project.data.Project;
import com.example.backend.project.data.ProjectRepository;
import com.example.backend.project.presentation.ProjectRequestDTO;
import com.example.backend.project.presentation.ProjectResponseDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository repo;

    public List<ProjectResponseDTO> getProjects(String q) {
        List<Project> projects = (q == null || q.isBlank())
                ? repo.findAllByOrderByCreatedAtDesc()
                : repo.findByTitleContainingIgnoreCaseOrderByCreatedAtDesc(q.trim());

        return projects.stream().map(this::toDto).toList();
    }

    public ProjectResponseDTO getBySlug(String slug) {
        Project p = repo.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return toDto(p);
    }

    @Transactional
    public ProjectResponseDTO create(ProjectRequestDTO req) {

        if (repo.existsBySlug(req.slug())) {
            throw new DuplicateSlugException(req.slug());
        }

        Project p = Project.builder()
                .title(req.title())
                .slug(req.slug())
                .description(req.description())
                .imageUrl(req.imageUrl())
                .liveUrl(req.liveUrl())
                .githubUrl(req.githubUrl())
                .build();

        return toDto(repo.save(p));
    }

    @Transactional
    public ProjectResponseDTO update(Long id, ProjectRequestDTO req) {

        Project existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        repo.findBySlug(req.slug()).ifPresent(other -> {
            if (!other.getId().equals(id)) {
                throw new DuplicateSlugException(req.slug());
            }
        });

        existing.setTitle(req.title());
        existing.setSlug(req.slug());
        existing.setDescription(req.description());
        existing.setImageUrl(req.imageUrl());
        existing.setLiveUrl(req.liveUrl());
        existing.setGithubUrl(req.githubUrl());

        return toDto(repo.save(existing));
    }


    @Transactional
    public void delete(Long id) {
        if (!repo.existsById(id)) {
            throw new RuntimeException("Project not found");
        }
        repo.deleteById(id);
    }

    private ProjectResponseDTO toDto(Project p) {
        return new ProjectResponseDTO(
                p.getId(),
                p.getTitle(),
                p.getSlug(),
                p.getDescription(),
                p.getImageUrl(),
                p.getLiveUrl(),
                p.getGithubUrl(),
                p.getCreatedAt()
        );
    }
}