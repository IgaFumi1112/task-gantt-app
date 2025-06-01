package com.example.task_gantt_app_backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ProjectDto {
        private Long id;
    private String name;
    private String description;
    private Long parentProjectId;        // 親プロジェクトの ID
    private LocalDate plannedStartDate;
    private LocalDate plannedEndDate;
    private Integer progress;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProjectDto> children;   // 子プロジェクトの DTO リスト

    // ===== コンストラクタ =====
    public ProjectDto() { }

    // ===== ゲッター／セッター =====
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public Long getParentProjectId() {
        return parentProjectId;
    }
    public void setParentProjectId(Long parentProjectId) {
        this.parentProjectId = parentProjectId;
    }

    public LocalDate getPlannedStartDate() {
        return plannedStartDate;
    }
    public void setPlannedStartDate(LocalDate plannedStartDate) {
        this.plannedStartDate = plannedStartDate;
    }

    public LocalDate getPlannedEndDate() {
        return plannedEndDate;
    }
    public void setPlannedEndDate(LocalDate plannedEndDate) {
        this.plannedEndDate = plannedEndDate;
    }

    public Integer getProgress() {
        return progress;
    }
    public void setProgress(Integer progress) {
        this.progress = progress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<ProjectDto> getChildren() {
        return children;
    }
    public void setChildren(List<ProjectDto> children) {
        this.children = children;
    }
}
