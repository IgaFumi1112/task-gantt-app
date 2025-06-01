package com.example.task_gantt_app_backend.service;

import com.example.task_gantt_app_backend.dto.DtoMapper;
import com.example.task_gantt_app_backend.dto.TaskDto;
import com.example.task_gantt_app_backend.exception.ResourceNotFoundException;
import com.example.task_gantt_app_backend.model.Project;
import com.example.task_gantt_app_backend.model.Task;
import com.example.task_gantt_app_backend.repository.ProjectRepository;
import com.example.task_gantt_app_backend.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;

    public TaskService(TaskRepository taskRepository, ProjectRepository projectRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
    }

    /**
     * 指定プロジェクト配下のタスク一覧を DTO で返却
     */
    @Transactional(readOnly = true)
    public List<TaskDto> getTasksByProjectId(Long projectId) {
        // プロジェクトが存在するかチェック
        if (!projectRepository.existsById(projectId)) {
            throw new ResourceNotFoundException("Project not found: " + projectId);
        }

        List<Task> tasks = taskRepository.findByProjectId(projectId);
        return tasks.stream()
                .map(DtoMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * 指定IDのタスクを DTO で返却
     */
    @Transactional(readOnly = true)
    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
        return DtoMapper.toDto(task);
    }

    /**
     * タスクを新規作成し、保存後の DTO を返却
     */
    @Transactional
    public TaskDto createTask(TaskDto dto) {
        // 所属プロジェクトをフェッチして設定
        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + dto.getProjectId()));

        Task task = DtoMapper.toEntity(dto);
        task.setProject(project);

        // 初期進捗計算（未着手なら 0％ のまま）
        Integer initialProgress = calculateTaskProgress(task);
        task.setProgress(initialProgress);

        Task saved = taskRepository.save(task);
        return DtoMapper.toDto(saved);
    }

    /**
     * 既存タスクを更新し、保存後の DTO を返却
     */
    @Transactional
    public TaskDto updateTask(Long id, TaskDto dto) {
        Task existing = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));

        // タイトル・説明・日付・ステータス・優先度 を更新
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setPlannedStartDate(dto.getPlannedStartDate());
        existing.setPlannedEndDate(dto.getPlannedEndDate());
        existing.setActualStartDate(dto.getActualStartDate());
        existing.setActualEndDate(dto.getActualEndDate());
        existing.setStatus(dto.getStatus());
        existing.setPriority(dto.getPriority());

        // 進捗率を再計算
        Integer newProgress = calculateTaskProgress(existing);
        existing.setProgress(newProgress);

        Task updated = taskRepository.save(existing);
        return DtoMapper.toDto(updated);
    }

    /**
     * 指定IDのタスクを削除
     */
    @Transactional
    public void deleteTask(Long id) {
        Task existing = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
        taskRepository.delete(existing);
    }

    /**
     * Task エンティティの「実績開始日・実績終了日」に基づき進捗率を計算して返却
     * 進捗率 = (日数経過 / プラン期間合計日数) * 100 をクランプして 0～100 に収める
     */
    public Integer calculateTaskProgress(Task task) {
        LocalDate plannedStart = task.getPlannedStartDate();
        LocalDate plannedEnd = task.getPlannedEndDate();
        LocalDate actualStart = task.getActualStartDate();
        LocalDate actualEnd = task.getActualEndDate();
        LocalDate today = LocalDate.now();

        // 計画期間（日数）
        long totalDays = plannedEnd.toEpochDay() - plannedStart.toEpochDay() + 1;
        if (totalDays <= 0) {
            return 0;
        }

        // まだ実績開始日が入っていない → 0%
        if (actualStart == null) {
            return 0;
        }

        // 実績終了日が入っている場合は 100%
        if (actualEnd != null) {
            return 100;
        }

        // 実績開始日は入っているが終了日はまだ → 経過日数を計算
        long elapsedDays = today.toEpochDay() - actualStart.toEpochDay() + 1;
        if (elapsedDays < 0) {
            // 実績開始日が未来の場合
            return 0;
        }

        // 進捗率を計算
        long percent = (elapsedDays * 100) / totalDays;
        if (percent > 100) {
            percent = 100;
        }
        return (int) percent;
    }
}
