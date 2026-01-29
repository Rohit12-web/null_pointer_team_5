import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [userStats, setUserStats] = useState(null);

  const updateProfile = (profile) => {
    setUserProfile(profile);
  };

  const updateStats = (stats) => {
    setUserStats(stats);
  };

  return (
    <UserContext.Provider value={{ userProfile, userStats, updateProfile, updateStats }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
