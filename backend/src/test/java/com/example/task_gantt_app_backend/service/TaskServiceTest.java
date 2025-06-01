package com.example.task_gantt_app_backend.service;

import com.example.task_gantt_app_backend.dto.TaskDto;
import com.example.task_gantt_app_backend.exception.ResourceNotFoundException;
import com.example.task_gantt_app_backend.model.Project;
import com.example.task_gantt_app_backend.model.Task;
import com.example.task_gantt_app_backend.repository.ProjectRepository;
import com.example.task_gantt_app_backend.repository.TaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTask_existingProject_createsAndReturnsDto() {
        // Arrange: モックとして ProjectRepository が ID=1 の Project を返す
        Project project = new Project();
        project.setId(1L);
        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        // TaskDto 用意
        TaskDto dto = new TaskDto();
        dto.setProjectId(1L);
        dto.setTitle("Test Task");
        dto.setPlannedStartDate(LocalDate.of(2025, 6, 1));
        dto.setPlannedEndDate(LocalDate.of(2025, 6, 5));
        dto.setStatus("未着手");
        dto.setPriority("Medium");

        // モックとして保存後の Task を返す
        Task savedTask = new Task();
        savedTask.setId(10L);
        savedTask.setProject(project);
        savedTask.setTitle("Test Task");
        savedTask.setPlannedStartDate(LocalDate.of(2025, 6, 1));
        savedTask.setPlannedEndDate(LocalDate.of(2025, 6, 5));
        savedTask.setProgress(0);
        savedTask.setStatus("未着手");
        savedTask.setPriority("Medium");
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        // Act
        TaskDto result = taskService.createTask(dto);

        // Assert
        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("Test Task", result.getTitle());
        verify(taskRepository, times(1)).save(any(Task.class));
    }

    @Test
    void createTask_nonExistingProject_throwsException() {
        // Arrange: ProjectRepository が空を返す
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        TaskDto dto = new TaskDto();
        dto.setProjectId(999L);
        dto.setTitle("Test Task");

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> taskService.createTask(dto));
        verify(taskRepository, never()).save(any(Task.class));
    }

    @Test
    void calculateTaskProgress_notStarted_returnsZero() {
        // Arrange: 実績開始日が null の Task
        Task task = new Task();
        task.setPlannedStartDate(LocalDate.of(2025, 6, 1));
        task.setPlannedEndDate(LocalDate.of(2025, 6, 10));
        task.setActualStartDate(null);

        // Act
        int progress = taskService.calculateTaskProgress(task);

        // Assert
        assertEquals(0, progress);
    }
}
