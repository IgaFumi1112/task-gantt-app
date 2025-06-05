// src/router/index.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProjectsPage  from '../pages/ProjectsPage';
import TasksPage     from '../pages/TasksPage';
import GanttPage     from '../pages/GanttPage';
import ProjectDetail from '../components/project/ProjectDetail';
import TaskDetail    from '../components/task/TaskDetail';
import ProjectForm   from '../components/project/ProjectForm';
import TaskForm      from '../components/task/TaskForm'; // 新規作成／編集用

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/projects" />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/new" element={<ProjectForm />} />
      <Route path="/projects/:projectId/edit" element={<ProjectForm />} />
      <Route path="/projects/:projectId/tasks" element={<TasksPage />} />
      <Route path="/projects/:projectId/tasks/new" element={<TaskForm />} />            {/* 新規タスク */}
      <Route path="/projects/:projectId/tasks/:taskId/edit" element={<TaskForm />} />  {/* タスク編集 */}
      <Route path="/projects/:projectId/gantt" element={<GanttPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetail />} />
      <Route path="/tasks/:taskId" element={<TaskDetail />} />
    </Routes>
  );
}
