package com.example.task_gantt_app_backend.service;

import com.example.task_gantt_app_backend.dto.DtoMapper;
import com.example.task_gantt_app_backend.dto.ProjectDto;
import com.example.task_gantt_app_backend.exception.ResourceNotFoundException;
import com.example.task_gantt_app_backend.model.Project;
import com.example.task_gantt_app_backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    /**
     * すべてのプロジェクトをツリー構造で取得し、DTOに変換して返却
     */
    @Transactional(readOnly = true)
    public List<ProjectDto> getAllProjectsAsTree() {
        // すべてのプロジェクトを取得
        List<Project> allProjects = projectRepository.findAll();

        // 親が null つまりルートプロジェクトのみをフィルター
        return allProjects.stream()
                .filter(p -> p.getParentProject() == null)
                .map(DtoMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * 指定IDのプロジェクトを取得して DTO にして返却
     */
    @Transactional(readOnly = true)
    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
        return DtoMapper.toDto(project);
    }

    /**
     * プロジェクトを新規作成し、保存後の DTO を返却
     */
    @Transactional
    public ProjectDto createProject(ProjectDto dto) {
        // DTO から Entity インスタンスを生成
        Project project = DtoMapper.toEntity(dto);

        // 親プロジェクトが指定されていたら Entity をフェッチしてセット
        if (dto.getParentProjectId() != null) {
            Project parent = projectRepository.findById(dto.getParentProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent project not found: " + dto.getParentProjectId()));
            project.setParentProject(parent);
        }

        Project saved = projectRepository.save(project);
        return DtoMapper.toDto(saved);
    }

    /**
     * 既存プロジェクトを更新し、保存後の DTO を返却
     */
    @Transactional
    public ProjectDto updateProject(Long id, ProjectDto dto) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));

        // 名前・概要・計画期間・進捗を上書き（ID は変更しない）
        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setPlannedStartDate(dto.getPlannedStartDate());
        existing.setPlannedEndDate(dto.getPlannedEndDate());
        existing.setProgress(dto.getProgress());

        // 親プロジェクトの変更
        if (dto.getParentProjectId() != null) {
            Project parent = projectRepository.findById(dto.getParentProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Parent project not found: " + dto.getParentProjectId()));
            existing.setParentProject(parent);
        } else {
            existing.setParentProject(null);
        }

        Project updated = projectRepository.save(existing);
        return DtoMapper.toDto(updated);
    }

    /**
     * 指定IDのプロジェクトを削除
     */
    @Transactional
    public void deleteProject(Long id) {
        Project existing = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));

        projectRepository.delete(existing);
    }

    /**
     * 指定IDのプロジェクト配下タスクの平均進捗を算出し、
     * Project.progress を更新して返却
     */
    @Transactional
    public Integer calculateProjectProgress(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));

        // 配下の全タスクを取り出して進捗率を平均
        List<Integer> taskProgressList = project.getTasks().stream()
                .map(t -> t.getProgress() != null ? t.getProgress() : 0)
                .collect(Collectors.toList());

        if (taskProgressList.isEmpty()) {
            project.setProgress(0);
        } else {
            int sum = taskProgressList.stream().mapToInt(Integer::intValue).sum();
            int avg = sum / taskProgressList.size();
            project.setProgress(avg);
        }

        Project updated = projectRepository.save(project);
        return updated.getProgress();
    }
}
