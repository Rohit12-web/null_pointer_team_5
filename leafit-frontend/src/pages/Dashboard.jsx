import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Eco slideshow data
  const ecoSlides = [
    {
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=400&fit=crop&q=80',
      title: 'Plant Trees, Save Earth',
      description: 'Every tree planted absorbs 22kg of CO₂ annually. Your actions matter!',
      color: 'from-green-600 to-emerald-600'
    },
    {
      image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&h=400&fit=crop&q=80',
      title: 'Recycle for Tomorrow',
      description: 'Recycling one ton of paper saves 17 trees and 7,000 gallons of water.',
      color: 'from-blue-600 to-cyan-600'
    },
    {
      image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=400&fit=crop&q=80',
      title: 'Clean Energy Future',
      description: 'Switching to renewable energy reduces carbon footprint by 80%.',
      color: 'from-yellow-600 to-orange-600'
    },
    {
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop&q=80',
      title: 'Conserve Water',
      description: 'Small changes like shorter showers save thousands of liters yearly.',
      color: 'from-cyan-600 to-blue-600'
    }
  ];

  // Mock data
  const stats = {
    totalPoints: 2450,
    co2Saved: 156.8,
    streak: 7,
    rank: 42,
    activitiesThisWeek: 12,
  };

  const mockActivities = [
    { id: 1, type: 'transport', icon: '🚌', description: 'Took the bus to work', points: 25, time: '2 hours ago' },
    { id: 2, type: 'energy', icon: '💡', description: 'Used LED lights all day', points: 15, time: 'Yesterday' },
    { id: 3, type: 'recycling', icon: '♻️', description: 'Recycled plastic bottles', points: 20, time: '2 days ago' },
    { id: 4, type: 'water', icon: '💧', description: 'Shorter shower', points: 10, time: '3 days ago' },
  ];

  const weeklyData = [
    { day: 'Mon', value: 35, activities: 3 },
    { day: 'Tue', value: 42, activities: 4 },
    { day: 'Wed', value: 28, activities: 2 },
    { day: 'Thu', value: 55, activities: 5 },
    { day: 'Fri', value: 48, activities: 4 },
    { day: 'Sat', value: 62, activities: 6 },
    { day: 'Sun', value: 38, activities: 3 },
  ];

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/log-activity', label: 'Log Activity', icon: '➕' },
    { path: '/impact', label: 'My Impact', icon: '🌍' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/badge-store', label: 'Badge Store', icon: '🏪' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  useEffect(() => {
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 300);
  }, []);

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % ecoSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % ecoSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + ecoSlides.length) % ecoSlides.length);
  };

  const maxValue = Math.max(...weeklyData.map(d => d.value));

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
              <p className={`text-xs ${colors.text.secondary}`}>Level 8 • {stats.totalPoints} pts</p>
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
          {/* Eco Slideshow */}
          <div className="relative overflow-hidden rounded-2xl mb-8 shadow-2xl">
            <div className="relative h-80 md:h-96">
              {ecoSlides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/800x400/${isDark ? '1f2937' : 'e5e7eb'}/10b981?text=${encodeURIComponent(slide.title)}`;
                    }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} opacity-10`}></div>
                  <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                      {slide.title}
                    </h2>
                    <p className="text-xl md:text-2xl text-white/90 max-w-2xl drop-shadow-md">
                      {slide.description}
                    </p>
                    <div className="mt-6 flex gap-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                        <p className="text-sm text-white/80">Your Impact</p>
                        <p className="text-2xl font-bold text-white">{stats.totalPoints.toLocaleString()} pts</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
                        <p className="text-sm text-white/80">CO₂ Saved</p>
                        <p className="text-2xl font-bold text-white">{stats.co2Saved} kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Slideshow Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {ecoSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Highlighted Eco Tip */}
          <div className="relative overflow-hidden rounded-xl mb-8 border-4 border-emerald-400 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=200&fit=crop"
              alt="Nature"
              className="w-full h-32 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/10 to-teal-600/10 flex items-center p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
                  💡
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-1">Eco Tip of the Day</h3>
                  <p className="text-emerald-100 text-sm">Switching to reusable bags can save up to 500 plastic bags per year!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row - Simplified without background images */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className={`bg-gradient-to-br ${isDark ? 'from-gray-800 to-gray-700' : 'from-gray-100 to-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Total Points</span>
                <span className="text-2xl">🏆</span>
              </div>
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.totalPoints.toLocaleString()}</div>
              <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>+12% this week</div>
            </div>
            
            <div className={`bg-gradient-to-br ${isDark ? 'from-gray-800 to-gray-700' : 'from-gray-100 to-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>CO₂ Saved</span>
                <span className="text-2xl">🌍</span>
              </div>
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.co2Saved} <span className="text-lg font-normal">kg</span></div>
              <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>+8% this week</div>
            </div>
            
            <div className={`bg-gradient-to-br ${isDark ? 'from-gray-800 to-gray-700' : 'from-gray-100 to-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Current Streak</span>
                <span className="text-2xl">🔥</span>
              </div>
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{stats.streak} <span className="text-lg font-normal">days</span></div>
              <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Keep it up!</div>
            </div>
            
            <div className={`bg-gradient-to-br ${isDark ? 'from-gray-800 to-gray-700' : 'from-gray-100 to-white'} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Global Rank</span>
                <span className="text-2xl">⭐</span>
              </div>
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>#{stats.rank}</div>
              <div className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Top 5% globally</div>
            </div>
          </div>

          {/* Environmental Impact Visualization - Improved */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className={`bg-gradient-to-br ${isDark ? 'from-emerald-900/50 to-green-900/50' : 'from-emerald-50 to-green-50'} border-2 ${isDark ? 'border-emerald-700' : 'border-emerald-300'} rounded-xl p-6 hover:shadow-lg transition-all`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-3xl shadow-lg">
                  🌳
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${colors.text.primary}`}>Trees Planted</h3>
                  <p className={`text-sm ${colors.text.secondary}`}>Equivalent impact</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-emerald-600">{(stats.co2Saved / 22).toFixed(1)}</p>
              <p className={`text-sm ${colors.text.secondary} mt-2`}>Your CO₂ savings equal planting this many trees annually</p>
            </div>

            <div className={`bg-gradient-to-br ${isDark ? 'from-cyan-900/50 to-blue-900/50' : 'from-cyan-50 to-blue-50'} border-2 ${isDark ? 'border-cyan-700' : 'border-cyan-300'} rounded-xl p-6 hover:shadow-lg transition-all`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-3xl shadow-lg">
                  💧
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${colors.text.primary}`}>Water Saved</h3>
                  <p className={`text-sm ${colors.text.secondary}`}>Conservation effort</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-cyan-600">1,250L</p>
              <p className={`text-sm ${colors.text.secondary} mt-2`}>Enough to fill 8 bathtubs!</p>
            </div>

            <div className={`bg-gradient-to-br ${isDark ? 'from-green-900/50 to-teal-900/50' : 'from-green-50 to-teal-50'} border-2 ${isDark ? 'border-green-700' : 'border-green-300'} rounded-xl p-6 hover:shadow-lg transition-all`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-3xl shadow-lg">
                  ♻️
                </div>
                <div>
                  <h3 className={`text-lg font-semibold ${colors.text.primary}`}>Waste Reduced</h3>
                  <p className={`text-sm ${colors.text.secondary}`}>Recycling impact</p>
                </div>
              </div>
              <p className="text-4xl font-bold text-green-600">45.2kg</p>
              <p className={`text-sm ${colors.text.secondary} mt-2`}>Diverted from landfills</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'} mb-8`}>
            <h2 className={`text-base font-semibold ${colors.text.primary} mb-4`}>Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                {
                  icon: '🚌',
                  label: 'Transport',
                  path: '/log-activity?type=transport',
                  color: 'border-blue-300 bg-blue-50 hover:bg-blue-100'
                },
                {
                  icon: '💡',
                  label: 'Energy',
                  path: '/log-activity?type=electricity',
                  color: 'border-amber-300 bg-amber-50 hover:bg-amber-100'
                },
                {
                  icon: '♻️',
                  label: 'Recycling',
                  path: '/log-activity?type=recycling',
                  color: 'border-emerald-300 bg-emerald-50 hover:bg-emerald-100'
                },
                {
                  icon: '💧',
                  label: 'Water',
                  path: '/log-activity?type=water',
                  color: 'border-cyan-300 bg-cyan-50 hover:bg-cyan-100'
                },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.path}
                  className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors ${action.color} ${isDark ? 'border-gray-600 bg-gray-800 hover:bg-gray-700' : ''}`}
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className={`text-sm font-medium ${colors.text.primary}`}>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Weekly Chart - Pie Chart */}
              <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-base font-semibold ${colors.text.primary}`}>Weekly Overview</h2>
                  <select className={`text-xs ${isDark ? 'bg-[#162019]' : 'bg-white'} border ${isDark ? 'border-emerald-800/50' : 'border-emerald-200'} rounded-lg px-3 py-1.5 ${colors.text.secondary} focus:outline-none focus:border-emerald-500`}>
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                </div>

                <div className="flex flex-col items-center">
                  {/* Simple Bar Chart */}
                  <div className="w-full mb-6">
                    <div className="flex items-end justify-between h-32 gap-2">
                      {weeklyData.map((day, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div className={`text-xs ${colors.text.secondary} mb-1`}>{day.activities}</div>
                          <div
                            className="w-full bg-gradient-to-t from-emerald-500 to-teal-500 rounded-md hover:from-emerald-400 hover:to-teal-400 transition-all cursor-pointer shadow-lg shadow-emerald-900/20"
                            style={{ height: `${(day.value / Math.max(...weeklyData.map(d => d.value))) * 100}%`, minHeight: '8px' }}
                          />
                          <span className={`text-xs ${colors.text.secondary}`}>{day.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="grid grid-cols-2 gap-4 w-full">
                    {weeklyData.map((day, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm" />
                        <div className="flex-1">
                          <span className={`text-sm font-medium ${colors.text.primary}`}>{day.day}</span>
                          <span className={`text-xs ${colors.text.secondary} block`}>{day.activities} activities</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions - Improved */}
                
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
                  ) : (
                    activities.map((activity) => (
                      <div key={activity.id} className={`flex items-center gap-3 p-2 rounded-lg ${isDark ? 'hover:bg-[#162019]' : 'hover:bg-emerald-50'} transition-colors`}>
                        <div className={`w-9 h-9 ${isDark ? 'bg-[#162019]' : 'bg-emerald-100'} border ${isDark ? 'border-emerald-800/30' : 'border-emerald-200'} rounded-lg flex items-center justify-center text-lg`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm ${colors.text.primary} truncate`}>{activity.description}</p>
                          <p className={`text-xs ${colors.text.secondary}`}>{activity.time}</p>
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
                    <span className="text-white font-medium">3/5</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <p className="text-xs text-emerald-100">2 more activities to reach your goal</p>
              </div>

              {/* Achievements with Visual Showcase */}
              <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-base font-semibold ${colors.text.primary}`}>Recent Achievements</h2>
                  <Link to="/profile" className="text-xs text-emerald-500 hover:text-emerald-400">View all</Link>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: '🌱', title: 'First Steps', desc: 'Logged first activity', image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=80&h=80&fit=crop' },
                    { icon: '🔥', title: 'Week Warrior', desc: '7-day streak achieved', image: 'https://images.unsplash.com/photo-1525498128493-380d1990a112?w=80&h=80&fit=crop' },
                    { icon: '♻️', title: 'Recycler', desc: 'Recycled 50 items', image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=80&h=80&fit=crop' },
                  ].map((achievement, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3 ${isDark ? 'bg-[#162019]' : 'bg-emerald-50'} rounded-lg border ${isDark ? 'border-emerald-800/30' : 'border-emerald-200'} hover:border-emerald-500/50 transition-colors`}>
                      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={achievement.image} alt={achievement.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${colors.text.primary} text-sm`}>{achievement.title}</p>
                        <p className={`text-xs ${colors.text.secondary}`}>{achievement.desc}</p>
                      </div>
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Motivational Eco Tip */}
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
