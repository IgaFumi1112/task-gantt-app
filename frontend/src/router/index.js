// src/router/index.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectsPage  from '../pages/ProjectsPage';
import TasksPage     from '../pages/TasksPage';
import GanttPage     from '../pages/GanttPage';
import ProjectDetail from '../components/project/ProjectDetail';
import TaskDetail    from '../components/task/TaskDetail';
import ProjectForm  from '../components/project/ProjectForm'; // 新規追加

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/projects" />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/new" element={<ProjectForm />} />                      {/* 新規作成 */}
      <Route path="/projects/:projectId/edit" element={<ProjectForm />} />         {/* 編集 */}
      <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
      <Route path="/projects/:projectId/gantt" element={<GanttPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
      <Route path="/tasks/:taskId" element={<TaskDetail />} />
    </Routes>
  );
}
