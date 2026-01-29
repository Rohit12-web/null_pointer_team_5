import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import activityService from '../services/activityService';

const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalPoints: 0,
    co2Saved: 0,
    streak: 0,
    rank: '-',
    activitiesThisWeek: 0,
    treesEquivalent: 0,
  });
  const [weeklyData, setWeeklyData] = useState([
    { day: 'Mon', value: 0, activities: 0 },
    { day: 'Tue', value: 0, activities: 0 },
    { day: 'Wed', value: 0, activities: 0 },
    { day: 'Thu', value: 0, activities: 0 },
    { day: 'Fri', value: 0, activities: 0 },
    { day: 'Sat', value: 0, activities: 0 },
    { day: 'Sun', value: 0, activities: 0 },
  ]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/log-activity', label: 'Log Activity', icon: '➕' },
    { path: '/impact', label: 'My Impact', icon: '🌍' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Activity type icons mapping
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
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch activities
      const activitiesResponse = await activityService.getActivities();
      const fetchedActivities = activitiesResponse.activities || [];
      
      // Format activities for display
      const formattedActivities = fetchedActivities.slice(0, 5).map(activity => ({
        id: activity.id,
        type: activity.activity_type,
        icon: activityIcons[activity.activity_type] || '🌱',
        description: activity.activity_name,
        points: activity.points_earned,
        time: formatTimeAgo(activity.created_at),
        co2_saved: activity.co2_saved,
      }));
      setActivities(formattedActivities);
      
      // Calculate stats from user data (from auth context) and activities
      if (user) {
        setStats({
          totalPoints: user.total_points || 0,
          co2Saved: parseFloat(user.total_co2_saved || 0).toFixed(2),
          streak: user.current_streak || 0,
          rank: '-', // Will be fetched from leaderboard
          activitiesThisWeek: fetchedActivities.filter(a => {
            const activityDate = new Date(a.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return activityDate > weekAgo;
          }).length,
          treesEquivalent: ((user.total_co2_saved || 0) / 21.77).toFixed(2),
        });
      }
      
      // Calculate weekly data from activities
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      const weekData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = weekDays[date.getDay()];
        
        const dayActivities = fetchedActivities.filter(a => {
          const activityDate = new Date(a.created_at);
          return activityDate.toDateString() === date.toDateString();
        });
        
        const totalPoints = dayActivities.reduce((sum, a) => sum + (a.points_earned || 0), 0);
        
        weekData.push({
          day: dayName,
          value: totalPoints,
          activities: dayActivities.length,
        });
      }
      setWeeklyData(weekData);
      
      // Try to fetch rank from leaderboard
      try {
        const leaderboardResponse = await activityService.getLeaderboard('total_points', 100);
        const leaderboard = leaderboardResponse.leaderboard || [];
        const userRank = leaderboard.findIndex(u => u.id === user?.id);
        if (userRank !== -1) {
          setStats(prev => ({ ...prev, rank: userRank + 1 }));
        }
      } catch (err) {
        console.log('Could not fetch leaderboard');
      }
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Listen for activity logged events from LogActivity page
    const handleActivityLogged = (event) => {
      console.log('Activity logged, refreshing dashboard...', event.detail);
      // Immediately update stats from the event if available
      if (event.detail?.user_stats) {
        const newStats = event.detail.user_stats;
        setStats(prev => ({
          ...prev,
          totalPoints: newStats.total_points || prev.totalPoints,
          co2Saved: parseFloat(newStats.total_co2_saved || prev.co2Saved).toFixed(2),
          streak: newStats.current_streak || prev.streak,
          activitiesThisWeek: prev.activitiesThisWeek + 1,
        }));
      }
      // Also fetch fresh data from server
      fetchDashboardData();
    };
    
    window.addEventListener('activityLogged', handleActivityLogged);
    
    // Also refresh when window gains focus (user comes back to tab)
    const handleFocus = () => {
      fetchDashboardData();
    };
    window.addEventListener('focus', handleFocus);
    
    // Cleanup listeners
    return () => {
      window.removeEventListener('activityLogged', handleActivityLogged);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const maxValue = Math.max(...weeklyData.map(d => d.value), 1);

  // Theme-aware colors
  const colors = {
    bg: {
      primary: isDark ? '#1a1f1c' : '#f5faf7',
      secondary: isDark ? '#162019' : '#e8f5ec',
      card: isDark ? '#1f2d24' : '#ffffff',
      cardGradient: isDark ? 'from-[#1f2d24] to-[#1a1f1c]' : 'from-white to-[#f5faf7]',
      deep: isDark ? '#0d1210' : '#d4e8dc',
    },
    text: {
      primary: isDark ? 'text-emerald-100' : 'text-[#1a2f1a]',
      secondary: isDark ? 'text-[#6b8f7a]' : 'text-[#3d5c47]',
      muted: isDark ? 'text-[#4a6b5c]' : 'text-[#6b8f7a]',
    },
    border: isDark ? 'border-emerald-900/50' : 'border-emerald-200',
    borderHover: isDark ? 'hover:border-emerald-600/50' : 'hover:border-emerald-400',
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#1a1f1c]' : 'bg-[#f5faf7]'}`}>
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 ${isDark ? 'bg-[#162019]' : 'bg-[#e8f5ec]'} border-r ${colors.border}
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-200 ease-in-out
        flex flex-col
      `}>
        {/* Logo */}
        <div className={`h-16 flex items-center px-6 border-b ${colors.border}`}>
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">LeafIt</span>
          </Link>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b ${colors.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-medium shadow-lg shadow-emerald-900/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${colors.text.primary} truncate`}>{user?.name || 'User'}</p>
              <p className={`text-xs ${colors.text.secondary}`}>🌱 {stats.totalPoints} pts</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30' 
                        : `${colors.text.secondary} ${isDark ? 'hover:text-emerald-100 hover:bg-[#1f2d24]' : 'hover:text-emerald-700 hover:bg-emerald-100'}`
                      }
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

        {/* Theme Toggle */}
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

        {/* Logout */}
        <div className={`p-4 border-t ${colors.border}`}>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${colors.text.secondary} hover:text-red-500 ${isDark ? 'hover:bg-[#1f2d24]' : 'hover:bg-red-50'} transition-all`}
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className={`h-16 ${isDark ? 'bg-[#162019]' : 'bg-[#e8f5ec]'} border-b ${colors.border} flex items-center justify-between px-4 lg:px-8`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 ${colors.text.secondary} ${isDark ? 'hover:text-emerald-100' : 'hover:text-emerald-700'}`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className={`text-lg font-semibold ${colors.text.primary}`}>Dashboard</h1>
              <p className={`text-xs ${colors.text.secondary}`}>Welcome back, {user?.name?.split(' ')[0] || 'there'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/log-activity"
              className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-medium rounded-lg transition-all shadow-lg shadow-emerald-900/30"
            >
              <span>+</span>
              <span>Log Activity</span>
            </Link>
            <div className={`w-8 h-8 rounded-full ${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${isDark ? 'border-emerald-800/50' : 'border-emerald-200'} flex items-center justify-center text-sm`}>
              🔔
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-5 ${colors.borderHover} transition-all ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`${colors.text.secondary} text-sm`}>Total Points</span>
                <span className="text-emerald-500">🌱</span>
              </div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">{stats.totalPoints.toLocaleString()}</div>
            </div>
            
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-5 ${colors.borderHover} transition-all ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`${colors.text.secondary} text-sm`}>CO₂ Saved</span>
                <span className="text-emerald-500">🌍</span>
              </div>
              <div className={`text-2xl font-bold ${colors.text.primary}`}>{stats.co2Saved} <span className={`text-sm ${colors.text.secondary} font-normal`}>kg</span></div>
            </div>
            
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-5 hover:border-orange-500/50 transition-all ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`${colors.text.secondary} text-sm`}>Current Streak</span>
                <span className="text-orange-400">🔥</span>
              </div>
              <div className={`text-2xl font-bold ${colors.text.primary}`}>{stats.streak} <span className={`text-sm ${colors.text.secondary} font-normal`}>days</span></div>
            </div>
            
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-5 hover:border-yellow-500/50 transition-all ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`${colors.text.secondary} text-sm`}>Global Rank</span>
                <span className="text-yellow-400">🏆</span>
              </div>
              <div className={`text-2xl font-bold ${colors.text.primary}`}>#{stats.rank}</div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Chart */}
              <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-base font-semibold ${colors.text.primary}`}>Weekly Overview</h2>
                  <select className={`text-xs ${isDark ? 'bg-[#162019]' : 'bg-white'} border ${isDark ? 'border-emerald-800/50' : 'border-emerald-200'} rounded-lg px-3 py-1.5 ${colors.text.secondary} focus:outline-none focus:border-emerald-500`}>
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                </div>
                
                <div className="flex items-end justify-between h-40 gap-3">
                  {weeklyData.map((day, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                      <div className={`text-xs ${colors.text.secondary} mb-1`}>{day.activities}</div>
                      <div 
                        className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-md hover:from-emerald-500 hover:to-teal-400 transition-all cursor-pointer shadow-lg shadow-emerald-900/20"
                        style={{ height: `${(day.value / maxValue) * 100}%`, minHeight: '8px' }}
                      />
                      <span className={`text-xs ${colors.text.secondary}`}>{day.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
                <h2 className={`text-base font-semibold ${colors.text.primary} mb-4`}>Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon: '🚌', label: 'Transport', path: '/log-activity?type=transport', hoverColor: 'hover:border-blue-500/50 hover:shadow-blue-900/20' },
                    { icon: '💡', label: 'Energy', path: '/log-activity?type=electricity', hoverColor: 'hover:border-yellow-500/50 hover:shadow-yellow-900/20' },
                    { icon: '♻️', label: 'Recycling', path: '/log-activity?type=recycling', hoverColor: 'hover:border-green-500/50 hover:shadow-green-900/20' },
                    { icon: '💧', label: 'Water', path: '/log-activity?type=water', hoverColor: 'hover:border-cyan-500/50 hover:shadow-cyan-900/20' },
                  ].map((action, i) => (
                    <Link
                      key={i}
                      to={action.path}
                      className={`flex flex-col items-center gap-2 p-4 ${isDark ? 'bg-[#162019]' : 'bg-white'} border ${isDark ? 'border-emerald-800/30' : 'border-emerald-200'} rounded-xl transition-all hover:shadow-lg ${action.hoverColor}`}
                    >
                      <span className="text-2xl">{action.icon}</span>
                      <span className={`text-xs ${colors.text.secondary}`}>{action.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-base font-semibold ${colors.text.primary}`}>Recent Activity</h2>
                  <Link to="/impact" className="text-xs text-emerald-500 hover:text-emerald-400">View all</Link>
                </div>
                
                <div className="space-y-3">
                  {loading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse flex gap-3">
                        <div className={`w-9 h-9 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} rounded-lg`}></div>
                        <div className="flex-1">
                          <div className={`h-3 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} rounded w-3/4 mb-2`}></div>
                          <div className={`h-2 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} rounded w-1/2`}></div>
                        </div>
                      </div>
                    ))
                  ) : activities.length === 0 ? (
                    <div className={`text-center py-6 ${colors.text.secondary}`}>
                      <p className="text-3xl mb-2">🌱</p>
                      <p className="text-sm">No activities yet</p>
                      <Link to="/log-activity" className="text-emerald-500 text-xs hover:underline">Log your first activity</Link>
                    </div>
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? 'hover:bg-[#162019]' : 'hover:bg-emerald-50'} transition-colors`}>
                        <div className={`w-9 h-9 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} border ${isDark ? 'border-emerald-800/30' : 'border-emerald-200'} rounded-lg flex items-center justify-center text-lg`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${colors.text.primary} truncate`}>{activity.description}</p>
                          <p className={`text-xs ${colors.text.secondary}`}>{activity.time} • {activity.co2_saved?.toFixed(2)} kg CO₂</p>
                        </div>
                        <span className="text-xs text-emerald-500 font-medium">+{activity.points}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Daily Goal */}
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl p-6 shadow-lg shadow-emerald-900/30">
                <h2 className="text-base font-semibold text-white mb-4">Daily Goal</h2>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-emerald-100">Progress</span>
                    <span className="text-white font-medium">{Math.min(stats.activitiesThisWeek, 5)}/5</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${Math.min((stats.activitiesThisWeek / 5) * 100, 100)}%` }}></div>
                  </div>
                </div>
                <p className="text-xs text-emerald-100">
                  {stats.activitiesThisWeek >= 5 
                    ? '🎉 Goal reached! Keep going!' 
                    : `${5 - Math.min(stats.activitiesThisWeek, 5)} more activities to reach your goal`}
                </p>
              </div>

              {/* Achievements */}
              <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-base font-semibold ${colors.text.primary}`}>Badges</h2>
                  <Link to="/profile" className="text-xs text-emerald-500 hover:text-emerald-400">View all</Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['🌱', '🔥', '♻️', '💧', '🚴'].map((badge, i) => (
                    <div key={i} className={`w-10 h-10 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} border ${isDark ? 'border-emerald-800/30' : 'border-emerald-200'} rounded-lg flex items-center justify-center text-lg hover:border-emerald-500/50 transition-colors`}>
                      {badge}
                    </div>
                  ))}
                  <div className={`w-10 h-10 ${isDark ? 'bg-[#0d1210]' : 'bg-emerald-50'} border border-dashed ${isDark ? 'border-emerald-800/30' : 'border-emerald-300'} rounded-lg flex items-center justify-center text-xs ${colors.text.secondary}`}>
                    +3
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
