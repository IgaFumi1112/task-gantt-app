package com.example.task_gantt_app_backend.controller;

import com.example.task_gantt_app_backend.model.Project;
import com.example.task_gantt_app_backend.model.Task;
import com.example.task_gantt_app_backend.repository.ProjectRepository;
import com.example.task_gantt_app_backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class TaskControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    private Project project;

    @BeforeEach
    void setUp() {
        // DB をクリアし、テスト用プロジェクトを作成
        taskRepository.deleteAll();
        projectRepository.deleteAll();

        project = new Project();
        project.setName("Test Project");
        project.setPlannedStartDate(LocalDate.of(2025, 6, 1));
        project.setPlannedEndDate(LocalDate.of(2025, 6, 30));
        project = projectRepository.save(project);
    }

    @Test
    void createAndGetTask_flow() throws Exception {
        // 1. 新規タスク作成
        String newTaskJson = String.format("""
                {
                  "projectId": %d,
                  "title": "Integration Task",
                  "plannedStartDate": "2025-06-05",
                  "plannedEndDate": "2025-06-10",
                  "status": "未着手",
                  "priority": "High"
                }
                """, project.getId());

        mockMvc.perform(post("/api/tasks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newTaskJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title", is("Integration Task")))
                .andExpect(jsonPath("$.projectId", is(project.getId().intValue())));

        // 2. プロジェクト配下タスク一覧取得 → 1件存在すること
        mockMvc.perform(get("/api/tasks").param("projectId", project.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        // 3. 作成したタスクの ID を取得して単一取得
        Task savedTask = taskRepository.findAll().get(0);
        mockMvc.perform(get("/api/tasks/{id}", savedTask.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(savedTask.getId().intValue())))
                .andExpect(jsonPath("$.title", is("Integration Task")));
    }

    @Test
    void getTasksByProjectId_nonExistingProject_returns404() throws Exception {
        mockMvc.perform(get("/api/tasks").param("projectId", "999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", is("Not Found")));
    }
}
