import api from '../axios';

export const taskAPI = {
  getAll: (projectId) => api.get('/tasks', { params: { projectId } }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (workspaceId, projectId, data) => api.post('/tasks', { workspaceId, projectId, ...data }),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
};

export default taskAPI;
