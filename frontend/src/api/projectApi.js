import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // package.json の proxy 設定により http://localhost:8080/api へ転送
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllProjects = () => apiClient.get('/projects');
export const getProjectById = (projectId) => apiClient.get(`/projects/${projectId}`);
export const createProject = (projectDto) => apiClient.post('/projects', projectDto);
export const updateProject = (projectId, projectDto) => apiClient.put(`/projects/${projectId}`, projectDto);
export const deleteProject = (projectId) => apiClient.delete(`/projects/${projectId}`);
export const getGanttData = (projectId, mode, year, month) =>
  apiClient.get(`/projects/${projectId}/gantt`, { params: { mode, year, month } });
