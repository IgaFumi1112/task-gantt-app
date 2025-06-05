// src/api/taskApi.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const getTasksByProjectId = (projectId) =>
  apiClient.get('/tasks', { params: { projectId } });

export const getTaskById = (taskId) => apiClient.get(`/tasks/${taskId}`);
export const createTask = (taskDto) => apiClient.post('/tasks', taskDto);
export const updateTask = (taskId, taskDto) => apiClient.put(`/tasks/${taskId}`, taskDto);
export const deleteTask = (taskId) => apiClient.delete(`/tasks/${taskId}`);
