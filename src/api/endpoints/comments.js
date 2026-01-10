import api from '../axios';

export const commentAPI = {
  getAll: (taskId) => api.get('/comments', { params: { taskId } }),
  create: (data) => api.post('/comments', data),
  update: (id, content) => api.put(`/comments/${id}`, { content }),
  delete: (id) => api.delete(`/comments/${id}`),
};

export default commentAPI;
