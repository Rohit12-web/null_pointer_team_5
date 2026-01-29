import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Impact = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const impactStats = {
    totalCO2Saved: 156.8,
    totalEnergySaved: 234.5,
    totalWaterSaved: 1250,
    totalWasteReduced: 45.2,
    treesEquivalent: 7.2,
    carMilesOffset: 392,
    plasticBottlesSaved: 125,
    totalActivities: 87,
  };

  const monthlyData = [
    { label: 'Jan', value: 12 }, { label: 'Feb', value: 18 }, { label: 'Mar', value: 25 },
    { label: 'Apr', value: 22 }, { label: 'May', value: 30 }, { label: 'Jun', value: 35 },
    { label: 'Jul', value: 42 }, { label: 'Aug', value: 38 }, { label: 'Sep', value: 45 },
    { label: 'Oct', value: 52 }, { label: 'Nov', value: 48 }, { label: 'Dec', value: 55 },
  ];

  const categoryBreakdown = [
    { label: 'Transport', value: 45, color: '#3B82F6' },
    { label: 'Energy', value: 28, color: '#F59E0B' },
    { label: 'Recycling', value: 15, color: '#10B981' },
    { label: 'Water', value: 8, color: '#06B6D4' },
    { label: 'Food', value: 4, color: '#8B5CF6' },
  ];

  const activities = [
    { id: 1, type: 'transport', icon: '🚌', description: 'Took the bus to work', carbonSaved: 2.6, points: 25, createdAt: new Date().toISOString() },
    { id: 2, type: 'electricity', icon: '💡', description: 'Used LED lights all day', carbonSaved: 0.8, points: 15, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, type: 'recycling', icon: '♻️', description: 'Recycled 10 plastic bottles', carbonSaved: 1.2, points: 20, createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: 4, type: 'water', icon: '💧', description: 'Shorter shower (5 mins)', carbonSaved: 0.3, points: 10, createdAt: new Date(Date.now() - 259200000).toISOString() },
    { id: 5, type: 'food', icon: '🥗', description: 'Plant-based lunch', carbonSaved: 2.5, points: 30, createdAt: new Date(Date.now() - 345600000).toISOString() },
  ];

  const comparisons = [
    { icon: '🌳', value: impactStats.treesEquivalent, unit: 'trees', description: 'Worth of CO₂ absorbed yearly' },
    { icon: '🚗', value: impactStats.carMilesOffset, unit: 'miles', description: 'Of car emissions offset' },
    { icon: '🍾', value: impactStats.plasticBottlesSaved, unit: 'bottles', description: 'Of plastic waste avoided' },
  ];

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/log-activity', label: 'Log Activity', icon: '➕' },
    { path: '/impact', label: 'My Impact', icon: '🌍' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const maxValue = Math.max(...monthlyData.map(d => d.value));

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
              <p className={`text-xs ${colors.text.secondary}`}>{impactStats.totalCO2Saved} kg CO₂ saved</p>
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
              <h1 className={`text-lg font-semibold ${colors.text.primary}`}>My Impact</h1>
              <p className={`text-xs ${colors.text.secondary}`}>Track your environmental contributions</p>
            </div>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'year', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`hidden sm:block px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : `${isDark ? 'bg-[#1f2d24] text-[#6b8f7a]' : 'bg-white text-[#3d5c47]'} border ${colors.border}`
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 hover:border-emerald-500/50 transition-colors ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">🌍</span>
                <span className="text-emerald-500 text-sm">+15%</span>
              </div>
              <h3 className={`${colors.text.secondary} text-sm`}>CO₂ Saved</h3>
              <p className={`text-3xl font-bold ${colors.text.primary} mt-1`}>{impactStats.totalCO2Saved} <span className={`text-lg ${colors.text.secondary}`}>kg</span></p>
            </div>
            
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 hover:border-yellow-500/50 transition-colors ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">⚡</span>
                <span className="text-emerald-500 text-sm">+8%</span>
              </div>
              <h3 className={`${colors.text.secondary} text-sm`}>Energy Saved</h3>
              <p className={`text-3xl font-bold ${colors.text.primary} mt-1`}>{impactStats.totalEnergySaved} <span className={`text-lg ${colors.text.secondary}`}>kWh</span></p>
            </div>
            
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 hover:border-cyan-500/50 transition-colors ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">💧</span>
                <span className="text-emerald-500 text-sm">+22%</span>
              </div>
              <h3 className={`${colors.text.secondary} text-sm`}>Water Saved</h3>
              <p className={`text-3xl font-bold ${colors.text.primary} mt-1`}>{impactStats.totalWaterSaved} <span className={`text-lg ${colors.text.secondary}`}>L</span></p>
            </div>
            
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 hover:border-purple-500/50 transition-colors ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">♻️</span>
                <span className="text-emerald-500 text-sm">+12%</span>
              </div>
              <h3 className={`${colors.text.secondary} text-sm`}>Waste Reduced</h3>
              <p className={`text-3xl font-bold ${colors.text.primary} mt-1`}>{impactStats.totalWasteReduced} <span className={`text-lg ${colors.text.secondary}`}>kg</span></p>
            </div>
          </div>

          {/* Real-World Comparisons */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-8 text-white shadow-xl shadow-emerald-900/30">
            <h2 className="text-xl font-semibold mb-6">Your Impact in Perspective</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {comparisons.map((item, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <span className="text-4xl">{item.icon}</span>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{item.value}</span>
                    <span className="text-lg ml-1">{item.unit}</span>
                  </div>
                  <p className="text-emerald-100 text-sm mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
              <h2 className={`text-xl font-semibold ${colors.text.primary} mb-6`}>CO₂ Savings Trend</h2>
              <div className="flex items-end justify-between h-48 gap-2">
                {monthlyData.map((month, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg transition-all hover:from-emerald-500 hover:to-teal-400"
                      style={{ height: `${(month.value / maxValue) * 100}%` }}
                    />
                    <span className={`text-xs ${colors.text.secondary}`}>{month.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
              <h2 className={`text-xl font-semibold ${colors.text.primary} mb-6`}>Impact by Category</h2>
              <div className="space-y-4">
                {categoryBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className={colors.text.primary}>{item.label}</span>
                      </div>
                      <span className={`font-medium ${colors.text.primary}`}>{item.value}%</span>
                    </div>
                    <div className={`w-full h-2 ${isDark ? 'bg-[#0d1210]' : 'bg-emerald-100'} rounded-full overflow-hidden`}>
                      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className={`text-xl font-semibold ${colors.text.primary}`}>Activity History</h2>
              <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                {['all', 'transport', 'electricity', 'recycling', 'water', 'food'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                        : `${isDark ? 'bg-[#162019] text-[#6b8f7a]' : 'bg-white text-[#3d5c47]'} border ${colors.border}`
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {activities
                .filter((a) => selectedCategory === 'all' || a.type === selectedCategory)
                .map((activity) => (
                  <div 
                    key={activity.id} 
                    className={`flex items-center justify-between p-4 ${isDark ? 'bg-[#162019]' : 'bg-emerald-50'} border ${isDark ? 'border-emerald-800/30' : 'border-emerald-200'} rounded-xl hover:border-emerald-500/50 transition-colors`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{activity.icon}</span>
                      <div>
                        <p className={`${colors.text.primary} font-medium`}>{activity.description}</p>
                        <p className={`${colors.text.secondary} text-sm`}>{formatDate(activity.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-500 font-semibold">-{activity.carbonSaved} kg CO₂</p>
                      <p className={`${colors.text.secondary} text-sm`}>+{activity.points} pts</p>
                    </div>
                  </div>
                ))}
            </div>

            <button className={`mt-6 w-full py-3 border ${colors.border} rounded-xl ${colors.text.secondary} font-medium ${isDark ? 'hover:bg-[#162019]' : 'hover:bg-emerald-50'} transition-colors`}>
              Load More Activities
            </button>
          </div>

          {/* Download Report */}
          <div className={`mt-8 bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between ${isDark ? '' : 'shadow-sm'}`}>
            <div>
              <h3 className={`text-lg font-semibold ${colors.text.primary}`}>Download Your Impact Report</h3>
              <p className={`${colors.text.secondary} mt-1`}>Get a detailed PDF report of your environmental contributions</p>
            </div>
            <button className="mt-4 md:mt-0 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg shadow-emerald-900/30 flex items-center gap-2">
              <span>📄</span>
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Impact;
