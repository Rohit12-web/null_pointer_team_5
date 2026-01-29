import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/log-activity', label: 'Log Activity', icon: '➕' },
    { path: '/impact', label: 'My Impact', icon: '🌍' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const profileData = {
    name: user?.name || 'Eco Warrior',
    email: user?.email || 'eco@leafit.com',
    joinDate: 'January 2024',
    level: 8,
    totalPoints: 2450,
    co2Saved: 156.8,
    activitiesLogged: 87,
    currentStreak: 7,
    longestStreak: 21,
    rank: 42,
  };

  const badges = [
    { id: 1, icon: '🌱', name: 'First Steps', description: 'Log your first activity', earned: true },
    { id: 2, icon: '🔥', name: 'On Fire', description: '7-day streak', earned: true },
    { id: 3, icon: '♻️', name: 'Recycler', description: 'Recycle 50 items', earned: true },
    { id: 4, icon: '💧', name: 'Water Saver', description: 'Save 1000L of water', earned: true },
    { id: 5, icon: '🚴', name: 'Cyclist', description: 'Cycle 100km', earned: true },
    { id: 6, icon: '🌳', name: 'Tree Hugger', description: 'Plant 5 trees', earned: false },
    { id: 7, icon: '⚡', name: 'Energy Master', description: 'Save 500kWh', earned: false },
    { id: 8, icon: '🏆', name: 'Top 10', description: 'Reach top 10 globally', earned: false },
  ];

  const recentActivities = [
    { id: 1, icon: '🚌', description: 'Took the bus to work', points: 25, date: 'Today' },
    { id: 2, icon: '💡', description: 'Used LED lights all day', points: 15, date: 'Yesterday' },
    { id: 3, icon: '♻️', description: 'Recycled plastic bottles', points: 20, date: '2 days ago' },
    { id: 4, icon: '💧', description: 'Shorter shower', points: 10, date: '3 days ago' },
    { id: 5, icon: '🥗', description: 'Plant-based lunch', points: 30, date: '4 days ago' },
  ];

  const colors = {
    bg: {
      primary: isDark ? '#1a1f1c' : '#f5faf7',
      secondary: isDark ? '#162019' : '#e8f5ec',
      card: isDark ? '#1f2d24' : '#ffffff',
      cardGradient: isDark ? 'from-[#1f2d24] to-[#1a1f1c]' : 'from-white to-[#f5faf7]',
    },
    text: {
      primary: isDark ? 'text-emerald-100' : 'text-[#1a2f1a]',
      secondary: isDark ? 'text-[#6b8f7a]' : 'text-[#3d5c47]',
    },
    border: isDark ? 'border-emerald-900/50' : 'border-emerald-200',
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#1a1f1c]' : 'bg-[#f5faf7]'}`}>
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 ${isDark ? 'bg-[#162019]' : 'bg-[#e8f5ec]'} border-r ${colors.border}
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-200 ease-in-out flex flex-col
      `}>
        <div className={`h-16 flex items-center px-6 border-b ${colors.border}`}>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">LeafIt</span>
          </Link>
        </div>

        <div className={`p-4 border-b ${colors.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${colors.text.primary} truncate`}>{user?.name || 'User'}</p>
              <p className={`text-xs ${colors.text.secondary}`}>Level {profileData.level}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isActive ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : `${colors.text.secondary} ${isDark ? 'hover:bg-[#1f2d24]' : 'hover:bg-emerald-100'}`}
                    `}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`p-4 border-t ${colors.border}`}>
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${colors.text.secondary} ${isDark ? 'hover:bg-[#1f2d24]' : 'hover:bg-emerald-100'} transition-all`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{isDark ? '🌙' : '☀️'}</span>
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`w-10 h-5 rounded-full ${isDark ? 'bg-emerald-600' : 'bg-emerald-300'} relative transition-colors`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isDark ? 'left-5' : 'left-0.5'}`}></div>
            </div>
          </button>
        </div>

        <div className={`p-4 border-t ${colors.border}`}>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${colors.text.secondary} hover:text-red-500 transition-all`}
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 min-w-0">
        <header className={`h-16 ${isDark ? 'bg-[#162019]' : 'bg-[#e8f5ec]'} border-b ${colors.border} flex items-center justify-between px-4 lg:px-8`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 ${colors.text.secondary}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className={`text-lg font-semibold ${colors.text.primary}`}>Profile</h1>
              <p className={`text-xs ${colors.text.secondary}`}>Manage your account</p>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold">
                {profileData.name.charAt(0)}
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <p className="text-emerald-100">{profileData.email}</p>
                <p className="text-sm text-emerald-200 mt-1">Member since {profileData.joinDate}</p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold">{profileData.totalPoints}</div>
                  <div className="text-xs text-emerald-200">Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">#{profileData.rank}</div>
                  <div className="text-xs text-emerald-200">Rank</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">{profileData.co2Saved}kg</div>
                  <div className="text-xs text-emerald-200">CO₂ Saved</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex gap-2 mb-6 border-b ${colors.border} pb-4`}>
            {['overview', 'badges', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : `${isDark ? 'bg-[#1f2d24] text-[#6b8f7a]' : 'bg-white text-[#3d5c47]'} hover:text-emerald-500`
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Activities Logged', value: profileData.activitiesLogged, icon: '📝' },
                { label: 'Current Streak', value: `${profileData.currentStreak} days`, icon: '🔥' },
                { label: 'Longest Streak', value: `${profileData.longestStreak} days`, icon: '⭐' },
                { label: 'Level', value: profileData.level, icon: '🎯' },
              ].map((stat, i) => (
                <div key={i} className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-5 ${isDark ? '' : 'shadow-sm'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`${colors.text.secondary} text-sm`}>{stat.label}</span>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <div className={`text-2xl font-bold ${colors.text.primary}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div key={badge.id} className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-4 text-center ${!badge.earned ? 'opacity-50' : ''} ${isDark ? '' : 'shadow-sm'}`}>
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <h3 className={`font-medium ${colors.text.primary}`}>{badge.name}</h3>
                  <p className={`text-xs ${colors.text.secondary} mt-1`}>{badge.description}</p>
                  {badge.earned && <span className="inline-block mt-2 text-xs text-emerald-500">✓ Earned</span>}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className={`flex items-center gap-4 p-3 rounded-lg ${isDark ? 'hover:bg-[#162019]' : 'hover:bg-emerald-50'} transition-colors`}>
                    <div className={`w-10 h-10 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} rounded-lg flex items-center justify-center text-xl`}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${colors.text.primary}`}>{activity.description}</p>
                      <p className={`text-sm ${colors.text.secondary}`}>{activity.date}</p>
                    </div>
                    <span className="text-emerald-500 font-medium">+{activity.points} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
