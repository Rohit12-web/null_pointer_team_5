import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Leaderboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('weekly');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/log-activity', label: 'Log Activity', icon: '➕' },
    { path: '/impact', label: 'My Impact', icon: '🌍' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const leaderboardData = [
    { rank: 1, name: 'Emma Green', points: 4520, co2Saved: 245.6, streak: 45, avatar: 'E', change: 0 },
    { rank: 2, name: 'Alex Rivers', points: 4280, co2Saved: 231.2, streak: 38, avatar: 'A', change: 1 },
    { rank: 3, name: 'Sam Forest', points: 4150, co2Saved: 218.9, streak: 42, avatar: 'S', change: -1 },
    { rank: 4, name: 'Jordan Leaf', points: 3890, co2Saved: 198.4, streak: 28, avatar: 'J', change: 2 },
    { rank: 5, name: 'Taylor Woods', points: 3720, co2Saved: 187.3, streak: 35, avatar: 'T', change: 0 },
    { rank: 6, name: 'Morgan Earth', points: 3580, co2Saved: 176.8, streak: 22, avatar: 'M', change: -2 },
    { rank: 7, name: 'Casey Nature', points: 3420, co2Saved: 165.2, streak: 19, avatar: 'C', change: 1 },
    { rank: 8, name: 'Riley Eco', points: 3280, co2Saved: 154.7, streak: 25, avatar: 'R', change: 0 },
    { rank: 9, name: 'Quinn Solar', points: 3150, co2Saved: 143.9, streak: 17, avatar: 'Q', change: 3 },
    { rank: 10, name: 'Avery Wind', points: 2980, co2Saved: 132.4, streak: 14, avatar: 'A', change: -1 },
  ];

  const currentUserRank = { rank: 42, name: user?.name || 'You', points: 2450, co2Saved: 156.8, streak: 7, avatar: user?.name?.charAt(0) || 'U', change: 5 };

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

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
    if (rank === 3) return 'bg-gradient-to-r from-amber-600 to-amber-700 text-white';
    return isDark ? 'bg-[#162019] text-[#6b8f7a]' : 'bg-emerald-100 text-[#3d5c47]';
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
              <p className={`text-xs ${colors.text.secondary}`}>Rank #{currentUserRank.rank}</p>
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
              <h1 className={`text-lg font-semibold ${colors.text.primary}`}>Leaderboard</h1>
              <p className={`text-xs ${colors.text.secondary}`}>See how you rank globally</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['weekly', 'monthly', 'allTime'].map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`hidden sm:block px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeFilter === filter
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : `${isDark ? 'bg-[#1f2d24] text-[#6b8f7a]' : 'bg-white text-[#3d5c47]'} border ${colors.border}`
                }`}
              >
                {filter === 'allTime' ? 'All Time' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Top 3 Podium */}
          <div className="flex justify-center items-end gap-4 mb-8">
            {/* 2nd Place */}
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-xl font-bold text-gray-800 mb-2`}>
                {leaderboardData[1].avatar}
              </div>
              <div className={`${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${colors.border} rounded-xl p-4 ${isDark ? '' : 'shadow-sm'}`} style={{ height: '120px' }}>
                <div className="text-2xl mb-1">🥈</div>
                <p className={`font-medium ${colors.text.primary} text-sm truncate`}>{leaderboardData[1].name}</p>
                <p className="text-emerald-500 font-bold">{leaderboardData[1].points.toLocaleString()}</p>
              </div>
            </div>

            {/* 1st Place */}
            <div className="text-center -mt-4">
              <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-2xl font-bold text-white mb-2 shadow-lg shadow-yellow-500/30`}>
                {leaderboardData[0].avatar}
              </div>
              <div className={`${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${colors.border} rounded-xl p-4 ${isDark ? '' : 'shadow-sm'}`} style={{ height: '140px' }}>
                <div className="text-3xl mb-1">🥇</div>
                <p className={`font-medium ${colors.text.primary} truncate`}>{leaderboardData[0].name}</p>
                <p className="text-emerald-500 font-bold text-lg">{leaderboardData[0].points.toLocaleString()}</p>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-xl font-bold text-white mb-2`}>
                {leaderboardData[2].avatar}
              </div>
              <div className={`${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${colors.border} rounded-xl p-4 ${isDark ? '' : 'shadow-sm'}`} style={{ height: '100px' }}>
                <div className="text-2xl mb-1">🥉</div>
                <p className={`font-medium ${colors.text.primary} text-sm truncate`}>{leaderboardData[2].name}</p>
                <p className="text-emerald-500 font-bold">{leaderboardData[2].points.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Your Rank Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 mb-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">
                  {currentUserRank.avatar}
                </div>
                <div>
                  <p className="font-medium">{currentUserRank.name}</p>
                  <p className="text-sm text-emerald-100">Your current position</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">#{currentUserRank.rank}</div>
                <div className="text-sm text-emerald-100 flex items-center gap-1">
                  <span className="text-green-300">↑{currentUserRank.change}</span> this week
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Table */}
          <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl overflow-hidden ${isDark ? '' : 'shadow-sm'}`}>
            <div className={`grid grid-cols-12 gap-4 p-4 border-b ${colors.border} ${colors.text.secondary} text-sm font-medium`}>
              <div className="col-span-1">Rank</div>
              <div className="col-span-5">User</div>
              <div className="col-span-2 text-right">Points</div>
              <div className="col-span-2 text-right hidden sm:block">CO₂ Saved</div>
              <div className="col-span-2 text-right">Streak</div>
            </div>
            
            {leaderboardData.slice(3).map((user, index) => (
              <div key={user.rank} className={`grid grid-cols-12 gap-4 p-4 items-center ${isDark ? 'hover:bg-[#162019]' : 'hover:bg-emerald-50'} transition-colors border-b ${colors.border} last:border-b-0`}>
                <div className="col-span-1">
                  <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium ${getRankStyle(user.rank)}`}>
                    {user.rank}
                  </span>
                </div>
                <div className="col-span-5 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} flex items-center justify-center font-medium ${colors.text.primary}`}>
                    {user.avatar}
                  </div>
                  <div>
                    <p className={`font-medium ${colors.text.primary}`}>{user.name}</p>
                    <p className={`text-xs ${colors.text.secondary}`}>
                      {user.change > 0 ? <span className="text-green-500">↑{user.change}</span> : user.change < 0 ? <span className="text-red-500">↓{Math.abs(user.change)}</span> : <span>-</span>}
                    </p>
                  </div>
                </div>
                <div className={`col-span-2 text-right font-bold ${colors.text.primary}`}>{user.points.toLocaleString()}</div>
                <div className={`col-span-2 text-right hidden sm:block ${colors.text.secondary}`}>{user.co2Saved} kg</div>
                <div className="col-span-2 text-right">
                  <span className="inline-flex items-center gap-1">
                    <span>🔥</span>
                    <span className={colors.text.primary}>{user.streak}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
