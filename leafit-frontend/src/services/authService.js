import api from './api';

export const authService = {
  // Register new user
  register: async (name, email, password, confirmPassword) => {
    const response = await api.post('/auth/register/', {
      name,
      email,
      password,
      confirm_password: confirmPassword,
    });
    
    if (response.success) {
      api.setTokens(response.access_token, response.refresh_token);
      localStorage.setItem('leafit_user', JSON.stringify(response.user));
    }
    
    return response;
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login/', { email, password });
    
    if (response.success) {
      api.setTokens(response.access_token, response.refresh_token);
      localStorage.setItem('leafit_user', JSON.stringify(response.user));
    }
    
    return response;
  },
  
  // Logout user
  logout: async () => {
    const refreshToken = api.getRefreshToken();
    try {
      await api.post('/auth/logout/', { refresh_token: refreshToken });
    } catch (error) {
      // Continue with local logout even if server call fails
    }
    api.clearTokens();
    return { success: true };
  },
  
  // Get current user profile
  getCurrentUser: async () => {
    return await api.get('/auth/me/');
  },
  
  // Update user profile
  updateProfile: async (profileData) => {
    return await api.put('/auth/me/', profileData);
  },
  
  // Change password
  changePassword: async (oldPassword, newPassword, confirmPassword) => {
    return await api.post('/auth/change-password/', {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  },
  
  // Refresh token
  refreshToken: async () => {
    const refreshToken = api.getRefreshToken();
    if (!refreshToken) return null;
    
    const response = await api.post('/auth/refresh/', {
      refresh_token: refreshToken,
    });
    
    if (response.success) {
      api.setTokens(response.access_token, response.refresh_token);
    }
    
    return response;
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!api.getAccessToken();
  },
  
  // Get stored user from localStorage
  getStoredUser: () => {
    const userStr = localStorage.getItem('leafit_user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

export default authService;
