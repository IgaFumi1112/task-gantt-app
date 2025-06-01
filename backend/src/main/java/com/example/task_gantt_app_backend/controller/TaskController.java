package com.example.task_gantt_app_backend.controller;

import com.example.task_gantt_app_backend.dto.TaskDto;
import com.example.task_gantt_app_backend.service.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * GET /api/tasks?projectId={projectId}
     * → 指定プロジェクト配下のタスク一覧を返却
     */
    @GetMapping
    public ResponseEntity<List<TaskDto>> getTasksByProjectId(
            @RequestParam Long projectId
    ) {
        List<TaskDto> list = taskService.getTasksByProjectId(projectId);
        return ResponseEntity.ok(list);
    }

    /**
     * GET /api/tasks/{id}
     * → ID指定で単一タスクを返却
     */
    @GetMapping("/{id}")
    public ResponseEntity<TaskDto> getTaskById(@PathVariable Long id) {
        TaskDto dto = taskService.getTaskById(id);
        return ResponseEntity.ok(dto);
    }

    /**
     * POST /api/tasks
     * → JSON で受け取った TaskDto を新規作成し、保存後のDTOを返却
     */
    @PostMapping
    public ResponseEntity<TaskDto> createTask(@RequestBody TaskDto dto) {
        TaskDto created = taskService.createTask(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    /**
     * PUT /api/tasks/{id}
     * → JSON で受け取った TaskDto で既存タスクを更新し、保存後のDTOを返却
     */
    @PutMapping("/{id}")
    public ResponseEntity<TaskDto> updateTask(
            @PathVariable Long id,
            @RequestBody TaskDto dto
    ) {
        TaskDto updated = taskService.updateTask(id, dto);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/tasks/{id}
     * → ID指定で既存タスクを削除
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity
                .ok(Map.of("message", "Task deleted: " + id));
    }
}
