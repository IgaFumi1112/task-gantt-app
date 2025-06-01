package com.example.task_gantt_app_backend.dto;

import java.time.LocalDateTime;

public class GanttTaskDto {
    private Long taskId;
    private String taskName;
    private String status;
    private int progress;
    private String priority;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // 計画期間
    private String plannedStartDate; // "YYYY-MM-DD"
    private String plannedEndDate;   // "YYYY-MM-DD"

    // 実績期間（null なら空文字）
    private String actualStartDate;  // "YYYY-MM-DD" or ""
    private String actualEndDate;    // "YYYY-MM-DD" or ""

    // 追加で、バーを表示する際に必要な数値インデックスを入れるフィールドを加えてもよい
    // 例：プラン期間の「日数インデックス開始」「日数インデックス終了」
    //      月表示用に「月内日数開始」「月内日数終了」などの項目を持たせてもよい

    public GanttTaskDto() { }

    // ===== ゲッター／セッター =====
    public Long getTaskId() {
        return taskId;
    }
    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public String getTaskName() {
        return taskName;
    }
    public void setTaskName(String taskName) {
        this.taskName = taskName;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public int getProgress() {
        return progress;
    }
    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getPriority() {
        return priority;
    }
    public void setPriority(String priority) {
        this.priority = priority;
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

    public String getPlannedStartDate() {
        return plannedStartDate;
    }
    public void setPlannedStartDate(String plannedStartDate) {
        this.plannedStartDate = plannedStartDate;
    }

    public String getPlannedEndDate() {
        return plannedEndDate;
    }
    public void setPlannedEndDate(String plannedEndDate) {
        this.plannedEndDate = plannedEndDate;
    }

    public String getActualStartDate() {
        return actualStartDate;
    }
    public void setActualStartDate(String actualStartDate) {
        this.actualStartDate = actualStartDate;
    }

    public String getActualEndDate() {
        return actualEndDate;
    }
    public void setActualEndDate(String actualEndDate) {
        this.actualEndDate = actualEndDate;
    }
}
