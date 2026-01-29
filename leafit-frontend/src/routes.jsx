import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/constants';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LogActivity from './pages/LogActivity';
import Impact from './pages/Impact';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Landing />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />
      <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
      <Route path={ROUTES.LOG_ACTIVITY} element={<LogActivity />} />
      <Route path={ROUTES.IMPACT} element={<Impact />} />
      <Route path={ROUTES.LEADERBOARD} element={<Leaderboard />} />
      <Route path={ROUTES.PROFILE} element={<Profile />} />
    </Routes>
  );
};

export default AppRoutes;
