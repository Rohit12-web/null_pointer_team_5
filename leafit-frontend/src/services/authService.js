import api from './api';

export const authService = {
  login: async (email, password) => {
    return api.post('/auth/login', { email, password });
  },
  
  signup: async (userData) => {
    return api.post('/auth/signup', userData);
  },
  
  logout: async () => {
    return api.post('/auth/logout');
  },
  
  getCurrentUser: async () => {
    return api.get('/auth/me');
  },
};

export default authService;
