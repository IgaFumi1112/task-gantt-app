package com.example.task_gantt_app_backend.controller;

import com.example.task_gantt_app_backend.dto.GanttTaskDto;
import com.example.task_gantt_app_backend.dto.ProjectDto;
import com.example.task_gantt_app_backend.dto.TaskDto;
import com.example.task_gantt_app_backend.service.ProjectService;
import com.example.task_gantt_app_backend.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;
    private final TaskService taskService;

    public ProjectController(ProjectService projectService, TaskService taskService) {
        this.projectService = projectService;
        this.taskService = taskService;
    }

    /**
     * GET /api/projects
     * → 全プロジェクトをツリー構造のDTOで返却
     */
    @GetMapping
    public ResponseEntity<List<ProjectDto>> getAllProjects() {
        List<ProjectDto> list = projectService.getAllProjectsAsTree();
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/projects/{id}
     * → ID指定で単一プロジェクトを返却
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDto> getProjectById(@PathVariable Long id) {
        ProjectDto dto = projectService.getProjectById(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * POST /api/projects
     * → JSON で受け取ったProjectDtoを新規作成し、保存後のDTOを返却
     */
    @PostMapping
    public ResponseEntity<ProjectDto> createProject(@RequestBody ProjectDto dto) {
        ProjectDto created = projectService.createProject(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * PUT /api/projects/{id}
     * → JSONで受け取ったProjectDtoで既存プロジェクトを更新し、保存後のDTOを返却
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProjectDto> updateProject(
            @PathVariable Long id,
            @RequestBody ProjectDto dto
    ) {
        ProjectDto updated = projectService.updateProject(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/projects/{id}
     * → ID指定でプロジェクトを削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity
                .ok(Map.of("message", "Project deleted: " + id));
    }

    /**
     * GET /api/projects/{id}/gantt?mode=<annual|monthly>&year=<yyyy>&month=<1～12>
     * → ガントチャート用データ取得（ここではまずタスク一覧をそのまま返却）
     *    本来は「mode」「year」「month」に応じた整形ロジックを入れる想定です。
     */
    @GetMapping("/{id}/gantt")
    public ResponseEntity<List<GanttTaskDto>> getGanttData(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "annual") String mode,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        List<GanttTaskDto> ganttData = projectService.getGanttData(id, mode, year, month);
        return ResponseEntity.ok(ganttData);
    }
}
