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
  Menu,
  Activity,
  TrendingDown,
  TrendingUp,
  Calendar,
  Award
} from 'lucide-react';

const CarbonFootprintMonitor = () => {
  const { user, logout, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [carbonStats, setCarbonStats] = useState({
    totalCO2Saved: 0,
    monthlyAverage: 0,
    weeklyAverage: 0,
    dailyAverage: 0,
    footprintReduction: 0,
    treesEquivalent: 0,
    avgPersonFootprint: 4000, // kg CO2 per year (average person)
    userAnnualFootprint: 0,
  });

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/log-activity', label: 'Log Activity', icon: PlusCircle },
    { path: '/impact', label: 'My Impact', icon: Globe },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/badge-store', label: 'Badge Store', icon: Store },
    { path: '/carbon-footprint', label: 'Carbon Footprint', icon: Activity },
    { path: '/waste-classifier', label: 'Waste Classifier', icon: Recycle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  // Calculate carbon footprint metrics
  const calculateCarbonMetrics = (activities, userCO2Saved) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Filter activities by time period
    const weeklyActivities = activities.filter(a => new Date(a.activity_date || a.created_at) >= oneWeekAgo);
    const monthlyActivities = activities.filter(a => new Date(a.activity_date || a.created_at) >= oneMonthAgo);
    
    // Calculate CO2 saved in different time periods
    const weeklyCO2 = weeklyActivities.reduce((sum, a) => sum + (a.co2_saved || 0), 0);
    const monthlyCO2 = monthlyActivities.reduce((sum, a) => sum + (a.co2_saved || 0), 0);
    
    // Average person's carbon footprint is ~4000 kg CO2 per year
    const avgPersonFootprint = 4000;
    
    // Estimate user's annual savings and footprint reduction
    const annualSavingsEstimate = (userCO2Saved / 365) * 365; // Projected annual savings
    const userAnnualFootprint = avgPersonFootprint - annualSavingsEstimate;
    const footprintReduction = ((annualSavingsEstimate / avgPersonFootprint) * 100).toFixed(1);
    
    // Trees equivalent: One tree absorbs ~21.77 kg of CO2 per year
    const treesEquivalent = (userCO2Saved / 21.77).toFixed(2);
    
    return {
      totalCO2Saved: parseFloat(userCO2Saved).toFixed(2),
      weeklyAverage: (weeklyCO2 / 7).toFixed(2),
      monthlyAverage: (monthlyCO2 / 30).toFixed(2),
      dailyAverage: (userCO2Saved / Math.max(user?.activities_count || 1, 1)).toFixed(2),
      footprintReduction: footprintReduction,
      treesEquivalent: treesEquivalent,
      avgPersonFootprint: avgPersonFootprint,
      userAnnualFootprint: userAnnualFootprint.toFixed(0),
    };
  };

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const activitiesResponse = await activityService.getActivities();
      const fetchedActivities = activitiesResponse.activities || [];
      setActivities(fetchedActivities);
      
      if (user) {
        const metrics = calculateCarbonMetrics(fetchedActivities, user.total_co2_saved || 0);
        setCarbonStats(metrics);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`min-h-screen ${isDark ? 'bg-neutral-950' : 'bg-gray-50'}`}>
      {/* Top Navigation Bar */}
      <nav className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} border-b sticky top-0 z-50`}>
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button & Logo */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-neutral-400 hover:text-white"
              >
                <Menu size={24} />
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <Leaf className="text-emerald-500" size={28} />
                <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>LeafIt</span>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-100'} transition-colors`}
              >
                {isDark ? <Sun className="text-amber-500" size={20} /> : <Moon className="text-neutral-700" size={20} />}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 w-64 h-screen transition-transform ${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} border-r`}>
          <div className="h-full px-3 py-4 overflow-y-auto mt-16 lg:mt-0">
            {/* User Info */}
            <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-gray-100'}`}>
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-black text-xl font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {user?.name || 'User'}
                  </h3>
                  <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>Eco Warrior</p>
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <span className={`text-xs ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>Total Points</span>
                  <span className="text-sm font-bold text-emerald-400">
                    {user?.total_points || 0} 🌱
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-emerald-500 text-black'
                          : isDark
                          ? 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                🌍 Carbon Footprint Monitor
              </h1>
              <p className={`${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                Track your carbon footprint reduction and environmental impact
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
              </div>
            ) : (
              <>
                {/* Main Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {/* Total CO2 Saved */}
                  <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-emerald-500/10 rounded-lg">
                        <TrendingDown className="text-emerald-500" size={24} />
                      </div>
                      <span className="text-2xl">♻️</span>
                    </div>
                    <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {carbonStats.totalCO2Saved} kg
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>Total CO₂ Saved</p>
                  </div>

                  {/* Footprint Reduction */}
                  <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-blue-500/10 rounded-lg">
                        <Activity className="text-blue-500" size={24} />
                      </div>
                      <span className="text-2xl">📉</span>
                    </div>
                    <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {carbonStats.footprintReduction}%
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>Footprint Reduction</p>
                  </div>

                  {/* Trees Equivalent */}
                  <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-green-500/10 rounded-lg">
                        <Leaf className="text-green-500" size={24} />
                      </div>
                      <span className="text-2xl">🌳</span>
                    </div>
                    <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {carbonStats.treesEquivalent}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>Trees Equivalent</p>
                  </div>

                  {/* Weekly Average */}
                  <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} border rounded-xl p-6 hover:shadow-lg transition-shadow`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-3 bg-purple-500/10 rounded-lg">
                        <Calendar className="text-purple-500" size={24} />
                      </div>
                      <span className="text-2xl">📅</span>
                    </div>
                    <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {carbonStats.weeklyAverage} kg
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>Weekly Average</p>
                  </div>
                </div>

                {/* Carbon Footprint Comparison */}
                <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} border rounded-xl p-6 mb-8`}>
                  <h2 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    📊 Carbon Footprint Comparison
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Average Person vs You */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                          Average Person (Annual)
                        </span>
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {carbonStats.avgPersonFootprint} kg CO₂
                        </span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-red-500 h-4 rounded-full transition-all duration-1000"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                          Your Estimated Footprint (Annual)
                        </span>
                        <span className={`font-bold text-emerald-500`}>
                          {carbonStats.userAnnualFootprint} kg CO₂
                        </span>
                      </div>
                      <div className="w-full bg-neutral-700 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-emerald-500 h-4 rounded-full transition-all duration-1000"
                          style={{ 
                            width: `${(carbonStats.userAnnualFootprint / carbonStats.avgPersonFootprint) * 100}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={`mt-6 p-4 rounded-lg ${isDark ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <p className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      <strong>Great job! 🎉</strong> You've reduced your carbon footprint by{' '}
                      <strong>{carbonStats.footprintReduction}%</strong> compared to the average person.
                      That's equivalent to planting <strong>{carbonStats.treesEquivalent}</strong> trees!
                    </p>
                  </div>
                </div>

                {/* Detailed Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Time-based Averages */}
                  <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                    <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      ⏰ Time-based Averages
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                            <span className="text-xl">📅</span>
                          </div>
                          <span className={isDark ? 'text-neutral-300' : 'text-gray-700'}>Daily Average</span>
                        </div>
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {carbonStats.dailyAverage} kg
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                            <span className="text-xl">📆</span>
                          </div>
                          <span className={isDark ? 'text-neutral-300' : 'text-gray-700'}>Weekly Average</span>
                        </div>
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {carbonStats.weeklyAverage} kg
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                            <span className="text-xl">🗓️</span>
                          </div>
                          <span className={isDark ? 'text-neutral-300' : 'text-gray-700'}>Monthly Average</span>
                        </div>
                        <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {carbonStats.monthlyAverage} kg
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Impact Equivalents */}
                  <div className={`${isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
                    <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      🌟 Impact Equivalents
                    </h2>
                    <div className="space-y-4">
                      <div className={`p-3 rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                            Trees Planted
                          </span>
                          <span className="text-xl">🌲</span>
                        </div>
                        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {carbonStats.treesEquivalent} trees
                        </p>
                      </div>

                      <div className={`p-3 rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                            Gasoline Saved
                          </span>
                          <span className="text-xl">⛽</span>
                        </div>
                        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {(carbonStats.totalCO2Saved * 0.45).toFixed(2)} liters
                        </p>
                      </div>

                      <div className={`p-3 rounded-lg ${isDark ? 'bg-neutral-800' : 'bg-gray-50'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                            Coal Not Burned
                          </span>
                          <span className="text-xl">🪨</span>
                        </div>
                        <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {(carbonStats.totalCO2Saved * 0.4).toFixed(2)} kg
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formula Explanation */}
                <div className={`${isDark ? 'bg-gradient-to-br from-emerald-900/30 to-teal-900/30 border-emerald-500/30' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'} border rounded-xl p-6`}>
                  <h2 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    📐 How We Calculate Your Carbon Footprint
                  </h2>
                  <div className="space-y-3">
                    <p className={`${isDark ? 'text-neutral-300' : 'text-gray-700'}`}>
                      <strong>Formula:</strong> Annual Footprint = Average Person's Footprint - Your CO₂ Savings
                    </p>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                      • Average person's carbon footprint: <strong>4,000 kg CO₂/year</strong>
                    </p>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                      • Your total CO₂ saved: <strong>{carbonStats.totalCO2Saved} kg</strong>
                    </p>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                      • Footprint reduction: <strong>{carbonStats.footprintReduction}%</strong>
                    </p>
                    <p className={`text-sm ${isDark ? 'text-neutral-400' : 'text-gray-600'}`}>
                      • One tree absorbs: <strong>~21.77 kg CO₂/year</strong>
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CarbonFootprintMonitor;
