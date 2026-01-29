const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Token management
const getAccessToken = () => localStorage.getItem('leafit_access_token');
const getRefreshToken = () => localStorage.getItem('leafit_refresh_token');
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('leafit_access_token', accessToken);
  localStorage.setItem('leafit_refresh_token', refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem('leafit_access_token');
  localStorage.removeItem('leafit_refresh_token');
  localStorage.removeItem('leafit_user');
};

// Refresh token function
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        setTokens(data.access_token, data.refresh_token);
        return data.access_token;
      }
    }
    
    clearTokens();
    return null;
  } catch (error) {
    clearTokens();
    return null;
  }
};

// Main fetch function with automatic token refresh
const fetchWithAuth = async (endpoint, options = {}) => {
  const accessToken = getAccessToken();
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // If unauthorized, try to refresh token
  if (response.status === 401 && accessToken) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      headers['Authorization'] = `Bearer ${newAccessToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    }
  }

  return response;
};

export const api = {
  // Basic methods
  get: async (endpoint) => {
    const response = await fetchWithAuth(endpoint, { method: 'GET' });
    const data = await response.json();
    if (!response.ok) {
      throw { status: response.status, ...data };
    }
    return data;
  },
  
  post: async (endpoint, data) => {
    const response = await fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw { status: response.status, ...responseData };
    }
    return responseData;
  },
  
  put: async (endpoint, data) => {
    const response = await fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    if (!response.ok) {
      throw { status: response.status, ...responseData };
    }
    return responseData;
  },
  
  delete: async (endpoint) => {
    const response = await fetchWithAuth(endpoint, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      throw { status: response.status, ...data };
    }
    return data;
  },

  // Token helpers
  setTokens,
  clearTokens,
  getAccessToken,
  getRefreshToken,
};

export default api;
