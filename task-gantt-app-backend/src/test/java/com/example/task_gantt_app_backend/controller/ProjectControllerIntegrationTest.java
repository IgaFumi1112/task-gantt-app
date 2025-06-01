package com.example.task_gantt_app_backend.controller;

import com.example.task_gantt_app_backend.TaskGanttAppBackendApplication;
import com.example.task_gantt_app_backend.model.Project;
import com.example.task_gantt_app_backend.repository.ProjectRepository;
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

@SpringBootTest(classes = TaskGanttAppBackendApplication.class)
@AutoConfigureMockMvc
class ProjectControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @BeforeEach
    void setUp() {
        // テストごとに DB をクリア
        projectRepository.deleteAll();
    }

    @Test
    void createAndGetProject_flow() throws Exception {
        // 1. 新規プロジェクト作成
        String newProjectJson = """
                {
                  "name":"Integration Project",
                  "description":"Integration test",
                  "plannedStartDate":"2025-06-01",
                  "plannedEndDate":"2025-06-15"
                }
                """;

        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newProjectJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Integration Project")))
                .andExpect(jsonPath("$.description", is("Integration test")));

        // 2. プロジェクト一覧取得 → 1件存在することを確認
        mockMvc.perform(get("/api/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        // 3. 作成したプロジェクトの ID を取得して単一取得
        Project saved = projectRepository.findAll().get(0);
        mockMvc.perform(get("/api/projects/{id}", saved.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(saved.getId().intValue())))
                .andExpect(jsonPath("$.name", is("Integration Project")));
    }

    @Test
    void deleteProject_nonExisting_returns404() throws Exception {
        mockMvc.perform(delete("/api/projects/{id}", 999L))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error", is("Not Found")));
    }
}
