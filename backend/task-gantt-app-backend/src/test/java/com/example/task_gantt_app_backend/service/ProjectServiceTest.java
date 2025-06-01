package com.example.task_gantt_app_backend.service;

import com.example.task_gantt_app_backend.dto.ProjectDto;
import com.example.task_gantt_app_backend.exception.ResourceNotFoundException;
import com.example.task_gantt_app_backend.model.Project;
import com.example.task_gantt_app_backend.repository.ProjectRepository;
import com.example.task_gantt_app_backend.service.ProjectService;

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

class ProjectServiceTest {

    @Mock
    private ProjectRepository projectRepository;

    @InjectMocks
    private ProjectService projectService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void getProjectById_existingId_returnsDto() {
        // Arrange: モックとして ProjectRepository が ID=1 で返す Project を用意
        Project project = new Project();
        project.setId(1L);
        project.setName("Test Project");
        project.setDescription("Desc");
        project.setPlannedStartDate(LocalDate.of(2025, 6, 1));
        project.setPlannedEndDate(LocalDate.of(2025, 6, 30));
        project.setProgress(0);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));

        // Act
        ProjectDto dto = projectService.getProjectById(1L);

        // Assert
        assertNotNull(dto);
        assertEquals(1L, dto.getId());
        assertEquals("Test Project", dto.getName());
        verify(projectRepository, times(1)).findById(1L);
    }

    @Test
    void getProjectById_notExisting_throwsException() {
        // Arrange: findById で空を返す
        when(projectRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> projectService.getProjectById(999L));
        verify(projectRepository, times(1)).findById(999L);
    }

    @Test
    void calculateProjectProgress_noTasks_setsZero() {
        // Arrange: プロジェクトにタスクがないケース
        Project project = new Project();
        project.setId(2L);
        project.setTasks(Collections.emptyList());

        when(projectRepository.findById(2L)).thenReturn(Optional.of(project));
        when(projectRepository.save(any(Project.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // Act
        int progress = projectService.calculateProjectProgress(2L);

        // Assert
        assertEquals(0, progress);
        verify(projectRepository, times(1)).save(project);
    }
}
