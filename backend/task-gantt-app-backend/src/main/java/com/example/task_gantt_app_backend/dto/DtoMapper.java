package com.example.task_gantt_app_backend.dto;

import com.example.task_gantt_app_backend.model.Project;
import com.example.task_gantt_app_backend.model.Task;

import java.util.List;
import java.util.stream.Collectors;

public class DtoMapper {
    // ========================================
    // Project ↔ ProjectDto の変換
    // ========================================

    public static ProjectDto toDto(Project project) {
        if (project == null) {
            return null;
        }

        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setPlannedStartDate(project.getPlannedStartDate());
        dto.setPlannedEndDate(project.getPlannedEndDate());
        dto.setProgress(project.getProgress());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());

        // 親プロジェクト ID をセット
        Project parent = project.getParentProject();
        dto.setParentProjectId(parent != null ? parent.getId() : null);

        // 子プロジェクトを再帰的に DTO 化
        List<ProjectDto> childDtos = project.getChildren().stream()
            .map(DtoMapper::toDto)   // 再帰呼び出し
            .collect(Collectors.toList());
        dto.setChildren(childDtos);

        return dto;
    }

    public static Project toEntity(ProjectDto dto) {
        if (dto == null) {
            return null;
        }

        Project project = new Project();
        project.setId(dto.getId());
        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setPlannedStartDate(dto.getPlannedStartDate());
        project.setPlannedEndDate(dto.getPlannedEndDate());
        project.setProgress(dto.getProgress());
        // createdAt / updatedAt は JPA ライフサイクルコールバックで設定される

        // 親プロジェクトはサービス層でフェッチしてセットする前提
        // 例：project.setParentProject(fetchedParentEntity);
        // dto.getParentProjectId() に基づきサービス層で取得した Project Entity を引き渡す想定

        return project;
    }

    // ========================================
    // Task ↔ TaskDto の変換
    // ========================================

    public static TaskDto toDto(Task task) {
        if (task == null) {
            return null;
        }

        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setProjectId(task.getProject().getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setPlannedStartDate(task.getPlannedStartDate());
        dto.setPlannedEndDate(task.getPlannedEndDate());
        dto.setActualStartDate(task.getActualStartDate());
        dto.setActualEndDate(task.getActualEndDate());
        dto.setProgress(task.getProgress());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }

    public static Task toEntity(TaskDto dto) {
        if (dto == null) {
            return null;
        }

        Task task = new Task();
        task.setId(dto.getId());
        // project はサービス層でフェッチした Entity をセットする
        // 例：task.setProject(fetchedProjectEntity);
        task.setTitle(dto.getTitle());
        task.setDescription(dto.getDescription());
        task.setPlannedStartDate(dto.getPlannedStartDate());
        task.setPlannedEndDate(dto.getPlannedEndDate());
        task.setActualStartDate(dto.getActualStartDate());
        task.setActualEndDate(dto.getActualEndDate());
        task.setProgress(dto.getProgress());
        task.setStatus(dto.getStatus());
        task.setPriority(dto.getPriority());
        // createdAt / updatedAt は JPA ライフサイクルコールバックで設定される
        return task;
    }
}
