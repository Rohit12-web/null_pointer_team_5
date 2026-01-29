import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import activityService from '../services/activityService';

const Profile = () => {
  const { user, logout, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Eco Warrior',
    email: user?.email || 'eco@leafit.com',
    joinDate: 'Member',
    level: 1,
    totalPoints: 0,
    co2Saved: 0,
    activitiesLogged: 0,
    currentStreak: 0,
    longestStreak: 0,
    rank: 0,
  });
  const [badges, setBadges] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/log-activity', label: 'Log Activity', icon: '➕' },
    { path: '/impact', label: 'My Impact', icon: '🌍' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/badge-store', label: 'Badge Store', icon: '🏪' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const activityIcons = {
    transport: '🚌',
    electricity: '💡',
    recycling: '♻️',
    water: '💧',
    food: '🥗',
    other: '🌳',
  };

  // Format time ago
  const formatTimeAgo = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Calculate badges based on user stats and activities
  const calculateBadges = useCallback((stats, activities) => {
    const badgesList = [
      { 
        id: 1, 
        icon: '🌱', 
        name: 'First Steps', 
        description: 'Log your first activity', 
        earned: activities.length > 0 
      },
      { 
        id: 2, 
        icon: '🔥', 
        name: 'On Fire', 
        description: '7-day streak', 
        earned: stats.currentStreak >= 7 
      },
      { 
        id: 3, 
        icon: '♻️', 
        name: 'Recycler', 
        description: 'Recycle 10 items', 
        earned: activities.filter(a => a.activity_type === 'recycling').length >= 10 
      },
      { 
        id: 4, 
        icon: '💧', 
        name: 'Water Saver', 
        description: 'Log 10 water activities', 
        earned: activities.filter(a => a.activity_type === 'water').length >= 10 
      },
      { 
        id: 5, 
        icon: '🚴', 
        name: 'Green Commuter', 
        description: '10 transport activities', 
        earned: activities.filter(a => a.activity_type === 'transport').length >= 10 
      },
      { 
        id: 6, 
        icon: '🌳', 
        name: 'Eco Warrior', 
        description: 'Save 100kg CO₂', 
        earned: stats.co2Saved >= 100 
      },
      { 
        id: 7, 
        icon: '⚡', 
        name: 'Energy Master', 
        description: '10 electricity activities', 
        earned: activities.filter(a => a.activity_type === 'electricity').length >= 10 
      },
      { 
        id: 8, 
        icon: '🏆', 
        name: 'Point Master', 
        description: 'Earn 5000 points', 
        earned: stats.totalPoints >= 5000 
      },
    ];
    return badgesList;
  }, []);

  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    try {
      const [activitiesRes, statsRes, leaderboardRes] = await Promise.all([
        activityService.getActivities().catch(() => ({ activities: [] })),
        activityService.getUserStats().catch(() => ({ stats: {} })),
        activityService.getLeaderboard().catch(() => ({ leaderboard: [] })),
      ]);
      
      const activities = activitiesRes.activities || [];
      const stats = statsRes.stats || {};
      const leaderboard = leaderboardRes.leaderboard || [];
      
      // Find user rank
      const userRank = leaderboard.findIndex(u => u.id === user?.id) + 1;
      
      // Calculate join date
      const joinDate = user?.date_joined 
        ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Member';
      
      const totalPoints = stats.total_points || user?.total_points || 0;
      const co2Saved = stats.total_co2_saved || user?.total_co2_saved || 0;
      const currentStreak = stats.current_streak || user?.current_streak || 0;
      
      const newProfileData = {
        name: user?.name || 'Eco Warrior',
        email: user?.email || 'eco@leafit.com',
        joinDate,
        level: Math.floor(totalPoints / 500) + 1,
        totalPoints,
        co2Saved,
        activitiesLogged: stats.activities_count || activities.length || 0,
        currentStreak,
        longestStreak: Math.max(currentStreak, stats.longest_streak || 0),
        rank: userRank || 0,
      };
      
      setProfileData(newProfileData);
      setBadges(calculateBadges(newProfileData, activities));
      
      // Format recent activities
      const formattedActivities = activities.slice(0, 10).map((act, index) => ({
        id: act.id || index,
        icon: activityIcons[act.activity_type] || '🌱',
        description: act.activity_name,
        points: act.points_earned,
        date: formatTimeAgo(act.activity_date || act.created_at),
      }));
      setRecentActivities(formattedActivities);
      
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  }, [user, calculateBadges]);

  // Initial data fetch
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  // Listen for activity logged events (real-time updates)
  useEffect(() => {
    const handleActivityLogged = (event) => {
      // Refresh profile data when activity is logged
      fetchProfileData();
      
      // Also refresh user data in AuthContext
      if (refreshUser) {
        refreshUser();
      }
    };

    window.addEventListener('activityLogged', handleActivityLogged);
    return () => window.removeEventListener('activityLogged', handleActivityLogged);
  }, [fetchProfileData, refreshUser]);

  // Update when user changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        totalPoints: user.total_points || prev.totalPoints,
        co2Saved: user.total_co2_saved || prev.co2Saved,
        currentStreak: user.current_streak || prev.currentStreak,
        level: Math.floor((user.total_points || 0) / 500) + 1,
      }));
    }
  }, [user]);

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
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center text-4xl font-bold shadow-lg">
                {profileData.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-bold">{profileData.name}</h2>
                <p className="text-emerald-100">{profileData.email}</p>
                <p className="text-sm text-emerald-200 mt-1">
                  {profileData.joinDate !== 'Member' ? `Member since ${profileData.joinDate}` : 'Member'} • Level {profileData.level}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{profileData.totalPoints.toLocaleString()}</div>
                  <div className="text-xs text-emerald-200">Points</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{profileData.rank > 0 ? `#${profileData.rank}` : '-'}</div>
                  <div className="text-xs text-emerald-200">Rank</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{profileData.co2Saved.toFixed(1)}kg</div>
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
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-5 animate-pulse ${isDark ? '' : 'shadow-sm'}`}>
                    <div className={`h-4 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} rounded w-1/2 mb-4`}></div>
                    <div className={`h-8 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} rounded w-1/3`}></div>
                  </div>
                ))
              ) : (
                [
                  { label: 'Activities Logged', value: profileData.activitiesLogged.toLocaleString(), icon: '📝' },
                  { label: 'Current Streak', value: `${profileData.currentStreak} days`, icon: '🔥' },
                  { label: 'Longest Streak', value: `${profileData.longestStreak} days`, icon: '⭐' },
                  { label: 'Level', value: profileData.level, icon: '🎯' },
                ].map((stat, i) => (
                  <div key={i} className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-5 hover:scale-105 transition-transform duration-300 ${isDark ? '' : 'shadow-sm'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`${colors.text.secondary} text-sm`}>{stat.label}</span>
                      <span className="text-xl">{stat.icon}</span>
                    </div>
                    <div className={`text-2xl font-bold ${colors.text.primary}`}>{stat.value}</div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="space-y-8">
              {/* Store Badges Section */}
              <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${colors.text.primary}`}>🏅 Redeemable Badges</h3>
                    <p className={`text-sm ${colors.text.secondary}`}>Every 100kg CO₂ saved = 1 Badge</p>
                  </div>
                  <Link to="/badge-store" className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg text-sm font-medium hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-900/20">
                    Visit Store →
                  </Link>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-[#162019]' : 'bg-emerald-50'} text-center`}>
                    <p className={`text-3xl font-bold ${colors.text.primary}`}>{Math.floor(profileData.co2Saved / 100)}</p>
                    <p className={`text-xs ${colors.text.secondary}`}>Total Earned</p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-[#162019]' : 'bg-amber-50'} text-center`}>
                    <p className={`text-3xl font-bold ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                      {JSON.parse(localStorage.getItem(`redeemed_${user?.id}`) || '[]').reduce((sum, c) => sum + c.badgeCost, 0)}
                    </p>
                    <p className={`text-xs ${colors.text.secondary}`}>Used</p>
                  </div>
                  <div className={`p-4 rounded-xl ${isDark ? 'bg-[#162019]' : 'bg-teal-50'} text-center`}>
                    <p className={`text-3xl font-bold text-emerald-500`}>
                      {Math.max(0, Math.floor(profileData.co2Saved / 100) - JSON.parse(localStorage.getItem(`redeemed_${user?.id}`) || '[]').reduce((sum, c) => sum + c.badgeCost, 0))}
                    </p>
                    <p className={`text-xs ${colors.text.secondary}`}>Available</p>
                  </div>
                </div>
                
                {/* Progress to next badge */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm ${colors.text.secondary}`}>Progress to next badge</span>
                    <span className={`text-sm font-medium ${colors.text.primary}`}>
                      {(profileData.co2Saved % 100).toFixed(1)} / 100 kg CO₂
                    </span>
                  </div>
                  <div className={`h-3 ${isDark ? 'bg-[#162019]' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${((profileData.co2Saved % 100) / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Achievement Badges Section */}
              <div>
                <h3 className={`text-lg font-semibold ${colors.text.primary} mb-4`}>🏆 Achievement Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {badges.map((badge) => (
                    <div key={badge.id} className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-4 text-center transition-all duration-300 ${!badge.earned ? 'opacity-50 grayscale' : 'hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/20'} ${isDark ? '' : 'shadow-sm'}`}>
                      <div className={`text-4xl mb-2 ${badge.earned ? '' : 'filter blur-[1px]'}`}>{badge.icon}</div>
                      <h3 className={`font-medium ${colors.text.primary}`}>{badge.name}</h3>
                      <p className={`text-xs ${colors.text.secondary} mt-1`}>{badge.description}</p>
                      {badge.earned ? (
                        <span className="inline-block mt-2 text-xs text-emerald-500 font-medium">✓ Earned</span>
                      ) : (
                        <span className="inline-block mt-2 text-xs text-gray-500">🔒 Locked</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-4">
                      <div className={`w-10 h-10 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} rounded-lg`}></div>
                      <div className="flex-1">
                        <div className={`h-4 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} rounded w-3/4 mb-2`}></div>
                        <div className={`h-3 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} rounded w-1/2`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivities.length === 0 ? (
                <div className={`text-center py-12 ${colors.text.secondary}`}>
                  <span className="text-5xl mb-4 block">🌱</span>
                  <p className="text-lg font-medium mb-2">No activities yet</p>
                  <p className="text-sm mb-4">Start logging your eco-friendly activities!</p>
                  <Link to="/log-activity" className="inline-block px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-teal-600 transition-all">
                    Log Activity
                  </Link>
                </div>
              ) : (
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
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Profile;
