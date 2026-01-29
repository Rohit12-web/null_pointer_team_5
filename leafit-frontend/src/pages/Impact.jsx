import React, { useState, useEffect, useCallback } from 'react';
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
  Menu,
  Bus,
  Lightbulb,
  Droplets,
  Salad,
  TreePine,
  Car,
  Wine,
  Zap,
  BarChart3
} from 'lucide-react';

const Impact = () => {
  const { user, logout, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  
  // Real stats from API
  const [impactStats, setImpactStats] = useState({
    totalCO2Saved: 0,
    totalEnergySaved: 0,
    totalWaterSaved: 0,
    totalWasteReduced: 0,
    treesEquivalent: 0,
    carMilesOffset: 0,
    plasticBottlesSaved: 0,
    totalActivities: 0,
    totalPoints: 0,
  });

  // Category breakdown from real data
  const [categoryBreakdown, setCategoryBreakdown] = useState([
    { label: 'Transport', value: 0, color: '#3B82F6', key: 'transport' },
    { label: 'Energy', value: 0, color: '#F59E0B', key: 'electricity' },
    { label: 'Recycling', value: 0, color: '#10B981', key: 'recycling' },
    { label: 'Water', value: 0, color: '#06B6D4', key: 'water' },
    { label: 'Food', value: 0, color: '#8B5CF6', key: 'food' },
    { label: 'Other', value: 0, color: '#EC4899', key: 'other' },
  ]);

  const activityIcons = {
    transport: <Bus className="w-5 h-5 dark:text-white" />,
    electricity: <Lightbulb className="w-5 h-5 dark:text-white" />,
    recycling: <Recycle className="w-5 h-5 dark:text-white" />,
    water: <Droplets className="w-5 h-5 dark:text-white" />,
    food: <Salad className="w-5 h-5 dark:text-white" />,
    other: <TreePine className="w-5 h-5 dark:text-white" />,
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/log-activity', label: 'Log Activity', icon: PlusCircle },
    { path: '/impact', label: 'My Impact', icon: Globe },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/badge-store', label: 'Badge Store', icon: Store },
    { path: '/waste-classifier', label: 'Waste Classifier', icon: Recycle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  // Calculate real-world comparisons based on actual stats
  const comparisons = [
    { 
      icon: <TreePine className="w-12 h-12 dark:text-white" />, 
      value: (impactStats.totalCO2Saved / 21.77).toFixed(1), 
      unit: 'trees', 
      description: 'Worth of CO₂ absorbed yearly' 
    },
    { 
      icon: <Car className="w-12 h-12 dark:text-white" />, 
      value: Math.round(impactStats.totalCO2Saved * 2.5), 
      unit: 'miles', 
      description: 'Of car emissions offset' 
    },
    { 
      icon: <Wine className="w-12 h-12 dark:text-white" />, 
      value: Math.round(impactStats.totalCO2Saved * 20), 
      unit: 'bottles', 
      description: 'Of plastic waste avoided' 
    },
  ];

  // Fetch impact data from API
  const fetchImpactData = useCallback(async () => {
    try {
      setLoading(true);
      const [activitiesRes, statsRes] = await Promise.all([
        activityService.getActivities().catch(() => ({ activities: [] })),
        activityService.getUserStats().catch(() => ({ stats: {}, breakdown: [] })),
      ]);

      // Process activities
      if (activitiesRes.activities) {
        const formattedActivities = activitiesRes.activities.map((act) => ({
          id: act.id,
          type: act.activity_type,
          icon: activityIcons[act.activity_type] || '🌱',
          description: act.activity_name,
          carbonSaved: act.co2_saved || 0,
          waterSaved: act.water_saved || 0,
          points: act.points_earned || 0,
          activityDate: act.activity_date,  // Use activity_date for the actual date
          createdAt: act.created_at,
        }));
        setActivities(formattedActivities);

        // Calculate category breakdown from activities
        const categoryCount = {};
        let totalCount = 0;
        formattedActivities.forEach((act) => {
          categoryCount[act.type] = (categoryCount[act.type] || 0) + 1;
          totalCount++;
        });

        if (totalCount > 0) {
          setCategoryBreakdown([
            { label: 'Transport', value: Math.round((categoryCount.transport || 0) / totalCount * 100), color: '#3B82F6', key: 'transport' },
            { label: 'Energy', value: Math.round((categoryCount.electricity || 0) / totalCount * 100), color: '#F59E0B', key: 'electricity' },
            { label: 'Recycling', value: Math.round((categoryCount.recycling || 0) / totalCount * 100), color: '#10B981', key: 'recycling' },
            { label: 'Water', value: Math.round((categoryCount.water || 0) / totalCount * 100), color: '#06B6D4', key: 'water' },
            { label: 'Food', value: Math.round((categoryCount.food || 0) / totalCount * 100), color: '#8B5CF6', key: 'food' },
            { label: 'Other', value: Math.round((categoryCount.other || 0) / totalCount * 100), color: '#EC4899', key: 'other' },
          ]);
        }

        // Calculate total water saved and waste reduced from activities
        let totalWater = 0;
        let totalWaste = 0;
        formattedActivities.forEach((act) => {
          totalWater += act.waterSaved || 0;
          // Estimate waste based on recycling activities
          if (act.type === 'recycling') {
            totalWaste += (act.carbonSaved || 0) * 0.5;
          }
        });

        // Update stats
        const stats = statsRes.stats || {};
        setImpactStats({
          totalCO2Saved: stats.total_co2_saved || user?.total_co2_saved || 0,
          totalEnergySaved: (stats.total_co2_saved || 0) * 1.5, // Estimate energy from CO2
          totalWaterSaved: totalWater,
          totalWasteReduced: totalWaste,
          treesEquivalent: ((stats.total_co2_saved || 0) / 21.77).toFixed(1),
          carMilesOffset: Math.round((stats.total_co2_saved || 0) * 2.5),
          plasticBottlesSaved: Math.round((stats.total_co2_saved || 0) * 20),
          totalActivities: stats.activities_count || formattedActivities.length,
          totalPoints: stats.total_points || user?.total_points || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching impact data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initial data fetch
  useEffect(() => {
    fetchImpactData();
  }, [fetchImpactData]);

  // Listen for activity logged events (real-time updates)
  useEffect(() => {
    const handleActivityLogged = (event) => {
      // Refresh data when a new activity is logged
      fetchImpactData();
      
      // Also refresh user data
      if (refreshUser) {
        refreshUser();
      }
    };

    window.addEventListener('activityLogged', handleActivityLogged);
    return () => window.removeEventListener('activityLogged', handleActivityLogged);
  }, [fetchImpactData, refreshUser]);

  // Update stats when user changes
  useEffect(() => {
    if (user) {
      setImpactStats(prev => ({
        ...prev,
        totalCO2Saved: user.total_co2_saved || prev.totalCO2Saved,
        totalPoints: user.total_points || prev.totalPoints,
        totalActivities: user.activities_count || prev.totalActivities,
      }));
    }
  }, [user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

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
            <Leaf className="w-6 h-6 text-emerald-500 dark:text-white" />
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
              <p className={`text-xs ${colors.text.secondary}`}>{impactStats.totalCO2Saved.toFixed(1)} kg CO₂ saved</p>
            </div>
          </div>
        </div>

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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isActive ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : `${colors.text.secondary} ${isDark ? 'hover:bg-[#1f2d24]' : 'hover:bg-emerald-100'}`}
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

        <div className={`p-4 border-t ${colors.border}`}>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${colors.text.secondary} hover:text-red-500 transition-all`}
          >
            <LogOut className="w-5 h-5 dark:text-white" />
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
                <span className={`text-sm ${impactStats.totalCO2Saved > 0 ? 'text-emerald-500' : colors.text.secondary}`}>
                  {impactStats.totalCO2Saved > 0 ? 'Great!' : 'Start saving'}
                </span>
              </div>
              <h3 className={`${colors.text.secondary} text-sm`}>CO₂ Saved</h3>
              <p className={`text-3xl font-bold ${colors.text.primary} mt-1`}>{impactStats.totalCO2Saved.toFixed(1)} <span className={`text-lg ${colors.text.secondary}`}>kg</span></p>
            </div>
            
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 hover:border-yellow-500/50 transition-colors ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-yellow-400 dark:text-white" />
                <span className={`text-sm ${impactStats.totalEnergySaved > 0 ? 'text-emerald-500' : colors.text.secondary}`}>
                  {impactStats.totalEnergySaved > 0 ? 'Efficient!' : 'Save energy'}
                </span>
              </div>
              <h3 className={`${colors.text.secondary} text-sm`}>Energy Saved</h3>
              <p className={`text-3xl font-bold ${colors.text.primary} mt-1`}>{impactStats.totalEnergySaved.toFixed(1)} <span className={`text-lg ${colors.text.secondary}`}>kWh</span></p>
            </div>
            
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 hover:border-cyan-500/50 transition-colors ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <Droplets className="w-8 h-8 text-cyan-400 dark:text-white" />
                <span className={`text-sm ${impactStats.totalWaterSaved > 0 ? 'text-emerald-500' : colors.text.secondary}`}>
                  {impactStats.totalWaterSaved > 0 ? 'Conserving!' : 'Save water'}
                </span>
              </div>
              <h3 className={`${colors.text.secondary} text-sm`}>Water Saved</h3>
              <p className={`text-3xl font-bold ${colors.text.primary} mt-1`}>{impactStats.totalWaterSaved.toLocaleString()} <span className={`text-lg ${colors.text.secondary}`}>L</span></p>
            </div>
            
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 hover:border-purple-500/50 transition-colors ${isDark ? '' : 'shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <Recycle className="w-8 h-8 text-emerald-400 dark:text-white" />
                <span className={`text-sm ${impactStats.totalWasteReduced > 0 ? 'text-emerald-500' : colors.text.secondary}`}>
                  {impactStats.totalWasteReduced > 0 ? 'Recycling!' : 'Reduce waste'}
                </span>
              </div>
              <h3 className={`${colors.text.secondary} text-sm`}>Waste Reduced</h3>
              <p className={`text-3xl font-bold ${colors.text.primary} mt-1`}>{impactStats.totalWasteReduced.toFixed(1)} <span className={`text-lg ${colors.text.secondary}`}>kg</span></p>
            </div>
          </div>

          {/* Real-World Comparisons */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-8 text-white shadow-xl shadow-emerald-900/30">
            <h2 className="text-xl font-semibold mb-6">Your Impact in Perspective</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {comparisons.map((item, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <div className="text-white mb-2">{item.icon}</div>
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
              <h2 className={`text-xl font-semibold ${colors.text.primary} mb-6`}>CO₂ Savings This Week</h2>
              {(() => {
                // Calculate weekly data from activities (last 7 days)
                const today = new Date();
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const weeklyData = [];
                
                // Build last 7 days data
                for (let i = 6; i >= 0; i--) {
                  const date = new Date(today);
                  date.setDate(date.getDate() - i);
                  const dayStart = new Date(date.setHours(0, 0, 0, 0));
                  const dayEnd = new Date(date.setHours(23, 59, 59, 999));
                  
                  const dayTotal = activities.reduce((sum, act) => {
                    // Use activityDate (the date user selected) instead of createdAt
                    const actDate = new Date(act.activityDate || act.createdAt);
                    if (actDate >= dayStart && actDate <= dayEnd) {
                      return sum + (act.carbonSaved || 0);
                    }
                    return sum;
                  }, 0);
                  
                  weeklyData.push({
                    day: dayNames[new Date(dayStart).getDay()],
                    value: dayTotal,
                    date: dayStart.toLocaleDateString(),
                    isToday: i === 0
                  });
                }
                
                const totalWeek = weeklyData.reduce((sum, d) => sum + d.value, 0);
                const hasData = totalWeek > 0;
                
                if (!hasData) {
                  return (
                    <div className={`flex items-center justify-center h-48 ${colors.text.secondary}`}>
                      <div className="text-center">
                        <span className="text-3xl mb-2 block">🥧</span>
                        <p className="text-sm">Log activities to see your weekly savings</p>
                      </div>
                    </div>
                  );
                }

                // Colors for each day (matching the gradient style)
                const pieColors = ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6'];
                
                // Pie chart calculations
                let currentAngle = 0;
                const pieSlices = weeklyData.filter(d => d.value > 0).map((d) => {
                  const percentage = (d.value / totalWeek) * 100;
                  const angle = (d.value / totalWeek) * 360;
                  const startAngle = currentAngle;
                  currentAngle += angle;
                  const originalIndex = weeklyData.indexOf(d);
                  
                  return {
                    ...d,
                    percentage,
                    startAngle,
                    endAngle: currentAngle,
                    color: pieColors[originalIndex % pieColors.length],
                    originalIndex
                  };
                });

                // Create SVG arc path for donut chart
                const createArc = (startAngle, endAngle, radius = 85, innerRadius = 55) => {
                  const startRad = (startAngle - 90) * (Math.PI / 180);
                  const endRad = (endAngle - 90) * (Math.PI / 180);
                  
                  // Outer arc points
                  const x1 = 100 + radius * Math.cos(startRad);
                  const y1 = 100 + radius * Math.sin(startRad);
                  const x2 = 100 + radius * Math.cos(endRad);
                  const y2 = 100 + radius * Math.sin(endRad);
                  
                  // Inner arc points
                  const x3 = 100 + innerRadius * Math.cos(endRad);
                  const y3 = 100 + innerRadius * Math.sin(endRad);
                  const x4 = 100 + innerRadius * Math.cos(startRad);
                  const y4 = 100 + innerRadius * Math.sin(startRad);
                  
                  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                  
                  return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
                };

                return (
                  <div className="flex flex-col items-center">
                    {/* Pie Chart */}
                    <div className="relative w-52 h-52 mb-6">
                      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
                        {/* Gradient definitions */}
                        <defs>
                          {pieSlices.map((slice, i) => (
                            <linearGradient key={`weekGrad-${i}`} id={`weekGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor={slice.color} stopOpacity="1" />
                              <stop offset="100%" stopColor={slice.color} stopOpacity="0.7" />
                            </linearGradient>
                          ))}
                          <filter id="weekGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                            <feMerge>
                              <feMergeNode in="coloredBlur"/>
                              <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                          </filter>
                          <filter id="weekShadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                          </filter>
                        </defs>
                        
                        {/* Pie slices */}
                        {pieSlices.length === 1 ? (
                          <circle 
                            cx="100" 
                            cy="100" 
                            r="85" 
                            fill="none"
                            stroke={pieSlices[0].color}
                            strokeWidth="30"
                            filter="url(#weekGlow)"
                          />
                        ) : (
                          pieSlices.map((slice, i) => (
                            <path
                              key={i}
                              d={createArc(slice.startAngle, slice.endAngle)}
                              fill={`url(#weekGrad-${i})`}
                              className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                              filter="url(#weekGlow)"
                              style={{
                                transform: 'scale(1)',
                                transformOrigin: 'center',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.03)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                              }}
                            >
                              <title>{`${slice.day}: ${slice.value.toFixed(2)} kg CO₂ (${slice.percentage.toFixed(1)}%)`}</title>
                            </path>
                          ))
                        )}
                        
                        {/* Center circle */}
                        <circle 
                          cx="100" 
                          cy="100" 
                          r="40" 
                          fill={isDark ? '#1a1f1c' : '#f5faf7'}
                          filter="url(#weekShadow)"
                        />
                      </svg>
                      
                      {/* Center content */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-2xl font-bold ${colors.text.primary}`}>{totalWeek.toFixed(1)}</span>
                        <span className={`text-xs ${colors.text.secondary}`}>kg CO₂</span>
                      </div>
                    </div>
                    
                    {/* Legend - Days of the week */}
                    <div className="w-full grid grid-cols-2 gap-3">
                      {weeklyData.map((d, i) => (
                        <div 
                          key={i} 
                          className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                            d.isToday 
                              ? (isDark ? 'bg-emerald-900/30' : 'bg-emerald-100') 
                              : (isDark ? 'hover:bg-[#162019]' : 'hover:bg-emerald-50')
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full flex-shrink-0 shadow-md" 
                            style={{ 
                              backgroundColor: pieColors[i % pieColors.length],
                              boxShadow: `0 2px 8px ${pieColors[i % pieColors.length]}50`
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${colors.text.primary} truncate`}>
                              {d.day} {d.isToday && <span className="text-emerald-500">(Today)</span>}
                            </p>
                            <p className={`text-xs ${colors.text.secondary}`}>{d.value.toFixed(2)} kg</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
              <h2 className={`text-xl font-semibold ${colors.text.primary} mb-6`}>Impact by Category</h2>
              {categoryBreakdown.some(item => item.value > 0) ? (
                (() => {
                  const activeCategories = categoryBreakdown.filter(item => item.value > 0);
                  const total = activeCategories.reduce((sum, item) => sum + item.value, 0);
                  
                  // Calculate pie slices
                  let currentAngle = 0;
                  const pieSlices = activeCategories.map((item) => {
                    const percentage = (item.value / total) * 100;
                    const angle = (item.value / total) * 360;
                    const startAngle = currentAngle;
                    currentAngle += angle;
                    
                    return {
                      ...item,
                      percentage,
                      startAngle,
                      endAngle: currentAngle,
                    };
                  });

                  // Create SVG arc path
                  const createArc = (startAngle, endAngle, radius = 85, innerRadius = 55) => {
                    const startRad = (startAngle - 90) * (Math.PI / 180);
                    const endRad = (endAngle - 90) * (Math.PI / 180);
                    
                    // Outer arc points
                    const x1 = 100 + radius * Math.cos(startRad);
                    const y1 = 100 + radius * Math.sin(startRad);
                    const x2 = 100 + radius * Math.cos(endRad);
                    const y2 = 100 + radius * Math.sin(endRad);
                    
                    // Inner arc points
                    const x3 = 100 + innerRadius * Math.cos(endRad);
                    const y3 = 100 + innerRadius * Math.sin(endRad);
                    const x4 = 100 + innerRadius * Math.cos(startRad);
                    const y4 = 100 + innerRadius * Math.sin(startRad);
                    
                    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
                    
                    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
                  };

                  const categoryIcons = {
                    transport: <Bus className="w-4 h-4 dark:text-white" />,
                    electricity: <Lightbulb className="w-4 h-4 dark:text-white" />,
                    recycling: <Recycle className="w-4 h-4 dark:text-white" />,
                    water: <Droplets className="w-4 h-4 dark:text-white" />,
                    food: <Salad className="w-4 h-4 dark:text-white" />,
                    other: <TreePine className="w-4 h-4 dark:text-white" />,
                  };

                  return (
                    <div className="flex flex-col items-center">
                      {/* Pie Chart */}
                      <div className="relative w-52 h-52 mb-6">
                        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
                          {/* Background glow */}
                          <defs>
                            {pieSlices.map((slice, i) => (
                              <linearGradient key={`grad-${i}`} id={`categoryGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor={slice.color} stopOpacity="1" />
                                <stop offset="100%" stopColor={slice.color} stopOpacity="0.7" />
                              </linearGradient>
                            ))}
                            <filter id="categoryGlow" x="-50%" y="-50%" width="200%" height="200%">
                              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                              <feMerge>
                                <feMergeNode in="coloredBlur"/>
                                <feMergeNode in="SourceGraphic"/>
                              </feMerge>
                            </filter>
                            <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                            </filter>
                          </defs>
                          
                          {/* Pie slices */}
                          {pieSlices.length === 1 ? (
                            <circle 
                              cx="100" 
                              cy="100" 
                              r="85" 
                              fill="none"
                              stroke={pieSlices[0].color}
                              strokeWidth="30"
                              filter="url(#categoryGlow)"
                            />
                          ) : (
                            pieSlices.map((slice, i) => (
                              <path
                                key={i}
                                d={createArc(slice.startAngle, slice.endAngle)}
                                fill={`url(#categoryGrad-${i})`}
                                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                filter="url(#categoryGlow)"
                                style={{
                                  transform: 'scale(1)',
                                  transformOrigin: 'center',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.03)';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                }}
                              >
                                <title>{`${slice.label}: ${slice.percentage.toFixed(1)}%`}</title>
                              </path>
                            ))
                          )}
                          
                          {/* Center circle */}
                          <circle 
                            cx="100" 
                            cy="100" 
                            r="40" 
                            fill={isDark ? '#1a1f1c' : '#f5faf7'}
                            filter="url(#innerShadow)"
                          />
                        </svg>
                        
                        {/* Center content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-2xl mb-1">🌍</span>
                          <span className={`text-xs font-medium ${colors.text.secondary}`}>Categories</span>
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="w-full grid grid-cols-2 gap-3">
                        {pieSlices.map((item, index) => (
                          <div 
                            key={index} 
                            className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${isDark ? 'hover:bg-[#162019]' : 'hover:bg-emerald-50'}`}
                          >
                            <div 
                              className="w-4 h-4 rounded-full flex-shrink-0 shadow-md" 
                              style={{ 
                                backgroundColor: item.color,
                                boxShadow: `0 2px 8px ${item.color}50`
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="text-sm">{categoryIcons[item.key] || <Leaf className="w-4 h-4" />}</span>
                                <span className={`text-sm font-medium ${colors.text.primary} truncate`}>{item.label}</span>
                              </div>
                              <p className={`text-xs ${colors.text.secondary}`}>{item.percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className={`text-center py-8 ${colors.text.secondary}`}>
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p className="text-sm">Log activities to see your category breakdown</p>
                </div>
              )}
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
              {loading ? (
                // Loading skeleton
                [...Array(3)].map((_, i) => (
                  <div key={i} className={`animate-pulse flex items-center justify-between p-4 ${isDark ? 'bg-[#162019]' : 'bg-emerald-50'} rounded-xl`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${isDark ? 'bg-[#1f2d24]' : 'bg-emerald-200'} rounded-lg`}></div>
                      <div>
                        <div className={`h-4 ${isDark ? 'bg-[#1f2d24]' : 'bg-emerald-200'} rounded w-32 mb-2`}></div>
                        <div className={`h-3 ${isDark ? 'bg-[#1f2d24]' : 'bg-emerald-200'} rounded w-20`}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`h-4 ${isDark ? 'bg-[#1f2d24]' : 'bg-emerald-200'} rounded w-16 mb-2`}></div>
                      <div className={`h-3 ${isDark ? 'bg-[#1f2d24]' : 'bg-emerald-200'} rounded w-12`}></div>
                    </div>
                  </div>
                ))
              ) : activities.length === 0 ? (
                // Empty state
                <div className={`text-center py-12 ${colors.text.secondary}`}>
                  <span className="text-5xl mb-4 block">🌱</span>
                  <p className="text-lg font-medium mb-2">No activities yet</p>
                  <p className="text-sm mb-4">Start logging your eco-friendly actions to see your impact!</p>
                  <Link 
                    to="/log-activity" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg font-medium hover:from-emerald-400 hover:to-teal-400 transition-all"
                  >
                    <span>➕</span>
                    <span>Log Your First Activity</span>
                  </Link>
                </div>
              ) : (
                activities
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
                          <p className={`${colors.text.secondary} text-sm`}>{formatDate(activity.activityDate || activity.createdAt)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-500 font-semibold">-{activity.carbonSaved.toFixed(2)} kg CO₂</p>
                        <p className={`${colors.text.secondary} text-sm`}>+{activity.points} pts</p>
                      </div>
                    </div>
                  ))
              )}
            </div>

            {activities.length > 0 && (
              <button className={`mt-6 w-full py-3 border ${colors.border} rounded-xl ${colors.text.secondary} font-medium ${isDark ? 'hover:bg-[#162019]' : 'hover:bg-emerald-50'} transition-colors`}>
                Load More Activities
              </button>
            )}
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
