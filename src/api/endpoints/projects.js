import api from '../axios';

export const projectAPI = {
  // Project CRUD
  getAll: (workspaceId) => api.get('/projects', { params: { workspaceId } }),
  getById: (id) => api.get(`/projects/${id}`),
  create: (workspaceId, data) => api.post('/projects', { workspaceId, ...data }),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),

  // Members
  addMember: (id, userId) => api.post(`/projects/${id}/members`, { userId }),
  removeMember: (id, userId) => api.delete(`/projects/${id}/members/${userId}`),
};

export default projectAPI;
