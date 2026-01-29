import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount (from localStorage)
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('leafit_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (userData) => {
    // Mock login - in production this would call the API
    const mockUser = {
      id: 1,
      name: userData.name || userData.email?.split('@')[0] || 'Eco Warrior',
      email: userData.email,
      totalPoints: 2450,
      totalCO2Saved: 156.8,
      activitiesCount: 87,
      currentStreak: 7,
      badges: ['first_steps', 'week_warrior', 'recycler'],
    };
    localStorage.setItem('leafit_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    return mockUser;
  };

  const logout = async () => {
    localStorage.removeItem('leafit_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const signup = async (userData) => {
    // Mock signup - in production this would call the API
    const mockUser = {
      id: Date.now(),
      name: userData.name || userData.email?.split('@')[0] || 'New Eco Warrior',
      email: userData.email,
      totalPoints: 0,
      totalCO2Saved: 0,
      activitiesCount: 0,
      currentStreak: 0,
      badges: [],
    };
    localStorage.setItem('leafit_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsAuthenticated(true);
    return mockUser;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, loading, isAuthenticated }}>
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
