import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import activityService from '../services/activityService';
import {
  LayoutDashboard,
  PlusCircle,
  Globe,
  Trophy,
  Store,
  Recycle,
  User,
  Leaf,
  Moon,
  Sun,
  LogOut,
  Menu
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [stats, setStats] = useState({
    totalPoints: 0,
    co2Saved: 0,
    streak: 0,
    rank: '-',
    activitiesThisWeek: 0,
    treesEquivalent: 0,
    waterSaved: 0,
    wasteReduced: 0,
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

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/log-activity', label: 'Log Activity', icon: PlusCircle },
    { path: '/impact', label: 'My Impact', icon: Globe },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/badge-store', label: 'Badge Store', icon: Store },
    { path: '/carbon-footprint', label: 'Carbon Footprint', icon: Leaf },
    { path: '/waste-classifier', label: 'Waste Classifier', icon: Recycle },
    { path: '/profile', label: 'Profile', icon: User },
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
        water_saved: activity.water_saved || 0,
        activity_type: activity.activity_type,
      }));
      setActivities(formattedActivities);
      
      // Calculate water saved and waste reduced from activities
      let totalWaterSaved = 0;
      let totalWasteReduced = 0;
      fetchedActivities.forEach(activity => {
        totalWaterSaved += activity.water_saved || 0;
        // Estimate waste based on recycling activities (each recycling saves ~2kg waste)
        if (activity.activity_type === 'recycling') {
          totalWasteReduced += (activity.co2_saved || 0) * 0.5;
        }
      });
      
      // Calculate stats from user data (from auth context) and activities
      if (user) {
        setStats({
          totalPoints: user.total_points || 0,
          co2Saved: parseFloat(user.total_co2_saved || 0).toFixed(2),
          streak: user.current_streak || 0,
          rank: '-', // Will be fetched from leaderboard
          activitiesThisWeek: fetchedActivities.filter(a => {
            // Use activity_date for when the activity actually happened
            const activityDate = new Date(a.activity_date || a.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return activityDate > weekAgo;
          }).length,
          treesEquivalent: ((user.total_co2_saved || 0) / 21.77).toFixed(2),
          waterSaved: totalWaterSaved,
          wasteReduced: totalWasteReduced,
        });
      }
      
      // Calculate weekly data from activities - use activity_date for the actual date
      const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const today = new Date();
      const weekData = [];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = weekDays[date.getDay()];
        
        const dayActivities = fetchedActivities.filter(a => {
          // Use activity_date (when the activity happened) instead of created_at
          const activityDate = new Date(a.activity_date || a.created_at);
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
          treesEquivalent: ((newStats.total_co2_saved || prev.co2Saved) / 21.77).toFixed(2),
        }));
        
        // Update water and waste if activity details are available
        if (event.detail?.activity) {
          const activity = event.detail.activity;
          setStats(prev => ({
            ...prev,
            waterSaved: prev.waterSaved + (activity.water_saved || 0),
            wasteReduced: activity.activity_type === 'recycling' 
              ? prev.wasteReduced + (activity.co2_saved || 0) * 0.5 
              : prev.wasteReduced,
          }));
        }
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
            <Leaf className="w-6 h-6 text-emerald-500 dark:text-white" />
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
              <p className={`text-xs ${colors.text.secondary} flex items-center gap-1`}>
                <Leaf className="w-3 h-3 dark:text-white" /> {stats.totalPoints} pts
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
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
                    <IconComponent className="w-5 h-5 dark:text-white" />
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
              {isDark ? <Moon className="w-5 h-5 dark:text-white" /> : <Sun className="w-5 h-5 dark:text-white" />}
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
            <LogOut className="w-5 h-5 dark:text-white" />
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
              <p className="text-4xl font-bold text-cyan-600">{stats.waterSaved > 0 ? stats.waterSaved.toLocaleString() : '0'}L</p>
              <p className={`text-sm ${colors.text.secondary} mt-2`}>{stats.waterSaved > 0 ? `Enough to fill ${Math.max(1, Math.floor(stats.waterSaved / 150))} bathtubs!` : 'Start saving water!'}</p>
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
              <p className="text-4xl font-bold text-green-600">{stats.wasteReduced > 0 ? stats.wasteReduced.toFixed(1) : '0'}kg</p>
              <p className={`text-sm ${colors.text.secondary} mt-2`}>{stats.wasteReduced > 0 ? 'Diverted from landfills' : 'Start recycling!'}</p>
            </div>
          </div>

          {/* Carbon Footprint Monitor Card */}
          <Link 
            to="/carbon-footprint"
            className={`block bg-gradient-to-br ${isDark ? 'from-purple-900/50 to-indigo-900/50' : 'from-purple-50 to-indigo-50'} border-2 ${isDark ? 'border-purple-700' : 'border-purple-300'} rounded-xl p-6 hover:shadow-lg transition-all mb-8 cursor-pointer hover:scale-[1.02]`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-3xl shadow-lg">
                  📉
                </div>
                <div>
                  <h3 className={`text-xl font-bold ${colors.text.primary}`}>Carbon Footprint Monitor</h3>
                  <p className={`text-sm ${colors.text.secondary}`}>Track your carbon footprint reduction</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">
                  {((parseFloat(stats.co2Saved) / 4000) * 100).toFixed(1)}%
                </p>
                <p className={`text-sm ${colors.text.secondary}`}>Reduction</p>
              </div>
            </div>
            <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-purple-500/10' : 'bg-purple-100'}`}>
              <p className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                <strong>Your estimated annual footprint:</strong> {(4000 - parseFloat(stats.co2Saved)).toFixed(0)} kg CO₂
                <span className="ml-2">(Average: 4000 kg CO₂)</span>
              </p>
            </div>
          </Link>

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
              {/* Weekly Chart - Heatmap Style */}
              <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-base font-semibold ${colors.text.primary}`}>Weekly Overview</h2>
                  <select className={`text-xs ${isDark ? 'bg-[#162019]' : 'bg-white'} border ${isDark ? 'border-emerald-800/50' : 'border-emerald-200'} rounded-lg px-3 py-1.5 ${colors.text.secondary} focus:outline-none focus:border-emerald-500`}>
                    <option>This Week</option>
                    <option>Last Week</option>
                  </select>
                </div>

                {/* Heatmap Grid */}
                <div className="space-y-4">
                  {/* Time slots header */}
                  <div className="grid grid-cols-8 gap-2">
                    <div className={`text-xs ${colors.text.secondary}`}></div>
                    <div className={`text-xs ${colors.text.secondary} text-center`}>Morning</div>
                    <div className={`text-xs ${colors.text.secondary} text-center`}>Noon</div>
                    <div className={`text-xs ${colors.text.secondary} text-center`}>Afternoon</div>
                    <div className={`text-xs ${colors.text.secondary} text-center`}>Evening</div>
                    <div className={`text-xs ${colors.text.secondary} text-center`}>Night</div>
                    <div className={`text-xs ${colors.text.secondary} text-center`}>Total</div>
                    <div className={`text-xs ${colors.text.secondary} text-center`}>Points</div>
                  </div>
                  
                  {/* Heatmap rows */}
                  {weeklyData.map((day, index) => {
                    const maxValue = Math.max(...weeklyData.map(d => d.value), 1);
                    const intensity = day.value / maxValue;
                    // Generate random-ish time distribution for demo (in real app, would come from actual data)
                    const getHeatIntensity = (slot) => {
                      if (day.activities === 0) return 0;
                      const rand = ((index + slot + 1) * 17) % 10 / 10;
                      return rand * intensity;
                    };
                    
                    return (
                      <div key={index} className="grid grid-cols-8 gap-2 items-center">
                        <div className={`text-xs font-medium ${colors.text.primary}`}>{day.day}</div>
                        {[0, 1, 2, 3, 4].map((slot) => {
                          const heat = getHeatIntensity(slot);
                          return (
                            <div
                              key={slot}
                              className={`h-8 rounded-md transition-all cursor-pointer hover:scale-105 ${
                                heat === 0 
                                  ? isDark ? 'bg-[#162019]' : 'bg-gray-100'
                                  : ''
                              }`}
                              style={heat > 0 ? {
                                background: `linear-gradient(135deg, rgba(16, 185, 129, ${0.2 + heat * 0.8}) 0%, rgba(20, 184, 166, ${0.2 + heat * 0.8}) 100%)`,
                                boxShadow: heat > 0.5 ? `0 0 10px rgba(16, 185, 129, ${heat * 0.3})` : 'none'
                              } : {}}
                              title={`${day.day}: ${Math.round(heat * day.activities)} activities`}
                            />
                          );
                        })}
                        <div className={`text-center`}>
                          <span className={`text-sm font-bold ${day.activities > 0 ? 'text-emerald-500' : colors.text.secondary}`}>
                            {day.activities}
                          </span>
                        </div>
                        <div className={`text-center`}>
                          <span className={`text-sm font-bold ${day.value > 0 ? 'text-teal-500' : colors.text.secondary}`}>
                            {day.value}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Legend */}
                  <div className="flex items-center justify-between pt-4 border-t border-dashed mt-4" style={{ borderColor: isDark ? '#1f4030' : '#d1fae5' }}>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${colors.text.secondary}`}>Less</span>
                      <div className="flex gap-1">
                        {[0.1, 0.3, 0.5, 0.7, 0.9].map((level) => (
                          <div
                            key={level}
                            className="w-4 h-4 rounded"
                            style={{
                              background: `linear-gradient(135deg, rgba(16, 185, 129, ${level}) 0%, rgba(20, 184, 166, ${level}) 100%)`
                            }}
                          />
                        ))}
                      </div>
                      <span className={`text-xs ${colors.text.secondary}`}>More</span>
                    </div>
                    <div className={`text-xs ${colors.text.secondary}`}>
                      Total: <span className="text-emerald-500 font-bold">{weeklyData.reduce((sum, d) => sum + d.activities, 0)}</span> activities • 
                      <span className="text-teal-500 font-bold ml-1">{weeklyData.reduce((sum, d) => sum + d.value, 0)}</span> pts
                    </div>
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
