import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Check localStorage for saved preference, default to dark
    const saved = localStorage.getItem('leafit-theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    // Save preference to localStorage
    localStorage.setItem('leafit-theme', isDark ? 'dark' : 'light');
    
    // Update document class for global styling
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Theme colors based on the nature palette
  const theme = {
    isDark,
    toggleTheme,
    colors: isDark ? {
      // Dark theme (current nature theme)
      bg: {
        primary: '#1a1f1c',
        secondary: '#162019',
        card: '#1f2d24',
        deep: '#0d1210',
      },
      text: {
        primary: '#e2f0e8', // emerald-100 equivalent
        secondary: '#6b8f7a',
        muted: '#4a6b5c',
      },
      border: {
        primary: 'rgba(16, 185, 129, 0.3)', // emerald-900/50
        secondary: 'rgba(16, 185, 129, 0.2)', // emerald-800/30
      },
      accent: {
        primary: '#10b981', // emerald-500
        secondary: '#14b8a6', // teal-500
        light: '#34d399', // emerald-400
      }
    } : {
      // Light theme (inverted nature theme)
      bg: {
        primary: '#f5faf7',
        secondary: '#e8f5ec',
        card: '#ffffff',
        deep: '#d4e8dc',
      },
      text: {
        primary: '#1a2f1a',
        secondary: '#3d5c47',
        muted: '#6b8f7a',
      },
      border: {
        primary: 'rgba(16, 185, 129, 0.3)',
        secondary: 'rgba(16, 185, 129, 0.15)',
      },
      accent: {
        primary: '#059669', // emerald-600
        secondary: '#0d9488', // teal-600
        light: '#10b981', // emerald-500
      }
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
