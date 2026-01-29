import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: '📊',
    },
    {
      path: '/log-activity',
      name: 'Log Activity',
      icon: '➕',
    },
    {
      path: '/impact',
      name: 'My Impact',
      icon: '🌍',
    },
    {
      path: '/leaderboard',
      name: 'Leaderboard',
      icon: '🏆',
    },
    {
      path: '/profile',
      name: 'Profile',
      icon: '👤',
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white shadow-lg min-h-screen">
      {/* User Info */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-500">Eco Warrior</p>
          </div>
        </div>
        
        {/* Points Display */}
        <div className="mt-4 bg-green-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Points</span>
            <span className="text-lg font-bold text-green-600">
              {user?.totalPoints || 0} 🌱
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-green-500 text-white shadow-md'
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-500 mb-3">Quick Stats</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">CO₂ Saved</span>
            <span className="font-medium text-green-600">
              {user?.totalCO2Saved?.toFixed(1) || 0} kg
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Activities</span>
            <span className="font-medium text-green-600">
              {user?.activitiesCount || 0}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Badges</span>
            <span className="font-medium text-green-600">
              {user?.badges?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Eco Tip */}
      <div className="p-4 m-4 bg-green-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">💡 Eco Tip</p>
        <p className="text-sm text-gray-700">
          Switching to LED bulbs can save up to 75% energy compared to traditional bulbs!
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;