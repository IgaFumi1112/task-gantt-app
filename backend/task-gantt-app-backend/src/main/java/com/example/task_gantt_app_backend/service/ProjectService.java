package com.example.task_gantt_app_backend.service;

import com.example.task_gantt_app_backend.dto.DtoMapper;
import com.example.task_gantt_app_backend.dto.GanttTaskDto;
import com.example.task_gantt_app_backend.dto.ProjectDto;
import com.example.task_gantt_app_backend.exception.ResourceNotFoundException;
import com.example.task_gantt_app_backend.model.Project;
import com.example.task_gantt_app_backend.model.Task;
import com.example.task_gantt_app_backend.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
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

        /**
     * ガントチャート用にタスクを整形して返却
     * @param projectId ガントを表示したいプロジェクトID
     * @param mode "annual" または "monthly"
     * @param year 年を指定 (mode="annual" のとき必須)
     * @param month 月を指定 (mode="monthly" のとき必須、1～12)
     * @return GanttTaskDto のリスト
     */
    @Transactional(readOnly = true)
    public List<GanttTaskDto> getGanttData(Long projectId, String mode, Integer year, Integer month) {
        // 1. プロジェクトが存在するか確認
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + projectId));

        // 2. 該当プロジェクト配下のタスクを取得
        List<Task> tasks = project.getTasks();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return tasks.stream()
            .map(task -> {
                GanttTaskDto dto = new GanttTaskDto();
                dto.setTaskId(task.getId());
                dto.setTaskName(task.getTitle());
                dto.setStatus(task.getStatus());
                dto.setProgress(task.getProgress() != null ? task.getProgress() : 0);
                dto.setPriority(task.getPriority());
                dto.setCreatedAt(task.getCreatedAt());
                dto.setUpdatedAt(task.getUpdatedAt());

                // 計画期間を文字列化
                dto.setPlannedStartDate(task.getPlannedStartDate().format(formatter));
                dto.setPlannedEndDate(task.getPlannedEndDate().format(formatter));

                // 実績期間が null なら空文字
                if (task.getActualStartDate() != null) {
                    dto.setActualStartDate(task.getActualStartDate().format(formatter));
                } else {
                    dto.setActualStartDate("");
                }
                if (task.getActualEndDate() != null) {
                    dto.setActualEndDate(task.getActualEndDate().format(formatter));
                } else {
                    dto.setActualEndDate("");
                }

                // ※mode/year/month に応じて期間を絞り込む場合はここで追加ロジックを入れる
                //   例：mode="monthly" & year=2025 & month=6 の場合、
                //       plannedStartDate が 2025-06-01 ～ 2025-06-30 の間だけ含める etc.

                return dto;
            })
            .collect(Collectors.toList());
    }

}
