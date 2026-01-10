import api from '../axios';

export const userAPI = {
  updateProfile: (data) => api.patch('/users/profile', data),
  changePassword: (data) => api.patch('/users/password', data),
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getPreferences: () => api.get('/users/preferences'),
  updatePreferences: (data) => api.patch('/users/preferences', data),
};

export default userAPI;
