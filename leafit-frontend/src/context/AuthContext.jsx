import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        // First check if we have stored user
        const storedUser = authService.getStoredUser();
        
        if (storedUser && authService.isAuthenticated()) {
          // Verify token is still valid by fetching current user
          try {
            const response = await authService.getCurrentUser();
            if (response.success) {
              setUser(response.user);
              setIsAuthenticated(true);
              // Update stored user with fresh data
              localStorage.setItem('leafit_user', JSON.stringify(response.user));
            } else {
              // Token invalid, clear auth
              await authService.logout();
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (err) {
            // API error, use stored user for now
            setUser(storedUser);
            setIsAuthenticated(true);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = useCallback(async (email, password) => {
    setError(null);
    try {
      const response = await authService.login(email, password);
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        const errorMsg = response.errors?.non_field_errors?.[0] || 
                        Object.values(response.errors || {})[0]?.[0] ||
                        'Login failed. Please try again.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.errors?.non_field_errors?.[0] || 
                      Object.values(err.errors || {})[0]?.[0] ||
                      'Login failed. Please check your credentials.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Register function
  const signup = useCallback(async (name, email, password, confirmPassword) => {
    setError(null);
    try {
      const response = await authService.register(name, email, password, confirmPassword);
      
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true, user: response.user };
      } else {
        const errorMsg = response.errors?.email?.[0] || 
                        response.errors?.password?.[0] ||
                        response.errors?.non_field_errors?.[0] ||
                        Object.values(response.errors || {})[0]?.[0] ||
                        'Registration failed. Please try again.';
        setError(errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (err) {
      const errorMsg = err.errors?.email?.[0] || 
                      err.errors?.password?.[0] ||
                      err.errors?.non_field_errors?.[0] ||
                      Object.values(err.errors || {})[0]?.[0] ||
                      'Registration failed. Please try again.';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await authService.updateProfile(profileData);
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('leafit_user', JSON.stringify(response.user));
        return { success: true, user: response.user };
      }
      return { success: false, error: 'Update failed' };
    } catch (err) {
      return { success: false, error: err.message || 'Update failed' };
    }
  }, []);

  // Refresh user data from server
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response.success) {
        setUser(response.user);
        localStorage.setItem('leafit_user', JSON.stringify(response.user));
        return response.user;
      }
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
    return null;
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    error,
    login,
    logout,
    signup,
    updateProfile,
    refreshUser,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
