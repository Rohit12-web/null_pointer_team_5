import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chart from '../components/Chart';

const Dashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockStats = {
    totalPoints: 2450,
    totalCO2Saved: 156.8,
    totalEnergySaved: 234.5,
    totalWaterSaved: 1250,
    totalWasteReduced: 45.2,
    activitiesThisWeek: 12,
    currentStreak: 7,
    rank: 42,
  };

  const mockActivities = [
    {
      id: 1,
      type: 'transport',
      description: 'Took the bus to work',
      carbonSaved: 2.6,
      points: 25,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'electricity',
      description: 'Used LED lights all day',
      carbonSaved: 0.8,
      points: 15,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      type: 'recycling',
      description: 'Recycled plastic bottles',
      carbonSaved: 1.2,
      points: 20,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 4,
      type: 'water',
      description: 'Shorter shower (5 mins)',
      carbonSaved: 0.3,
      points: 10,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
  ];

  const weeklyData = [
    { label: 'Mon', value: 35 },
    { label: 'Tue', value: 42 },
    { label: 'Wed', value: 28 },
    { label: 'Thu', value: 55 },
    { label: 'Fri', value: 48 },
    { label: 'Sat', value: 62 },
    { label: 'Sun', value: 38 },
  ];

  const categoryData = [
    { label: 'Transport', value: 35, color: '#3B82F6' },
    { label: 'Energy', value: 25, color: '#F59E0B' },
    { label: 'Recycling', value: 20, color: '#10B981' },
    { label: 'Water', value: 12, color: '#06B6D4' },
    { label: 'Food', value: 8, color: '#8B5CF6' },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setActivities(mockActivities);
      setLoading(false);
    }, 500);
  }, []);

  const quickActions = [
    { icon: '🚌', label: 'Log Transport', path: '/log-activity?type=transport' },
    { icon: '💡', label: 'Save Energy', path: '/log-activity?type=electricity' },
    { icon: '♻️', label: 'Recycle', path: '/log-activity?type=recycling' },
    { icon: '💧', label: 'Save Water', path: '/log-activity?type=water' },
  ];

  const getActivityIcon = (type) => {
    const icons = {
      transport: '🚌',
      electricity: '💡',
      recycling: '♻️',
      water: '💧',
    };
    return icons[type] || '🌱';
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Header */}
        <div className="mb-8">
          <p className="text-emerald-400 text-sm tracking-widest uppercase mb-2">Dashboard</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Welcome back, {user?.name || 'Eco Warrior'}! 🌿
          </h1>
          <p className="text-neutral-400 mt-2">
            Track your impact and keep making a difference.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 hover:border-emerald-500/50 transition-all duration-300 flex items-center space-x-3 group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="font-medium text-neutral-300 group-hover:text-emerald-400 transition-colors">
                {action.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Points */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-emerald-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🌱</span>
              <span className="text-emerald-400 text-sm font-medium">+125 this week</span>
            </div>
            <div className="text-3xl font-bold text-emerald-500">{mockStats.totalPoints}</div>
            <div className="text-neutral-500 text-sm mt-1">Total Points</div>
          </div>

          {/* CO2 Saved */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🌍</span>
              <span className="text-blue-400 text-sm font-medium">+12.5 kg this week</span>
            </div>
            <div className="text-3xl font-bold text-blue-500">{mockStats.totalCO2Saved} <span className="text-lg text-neutral-500">kg</span></div>
            <div className="text-neutral-500 text-sm mt-1">CO₂ Saved</div>
          </div>

          {/* Current Streak */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-orange-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🔥</span>
              <span className="text-orange-400 text-sm font-medium">Keep it going!</span>
            </div>
            <div className="text-3xl font-bold text-orange-500">{mockStats.currentStreak} <span className="text-lg text-neutral-500">days</span></div>
            <div className="text-neutral-500 text-sm mt-1">Current Streak</div>
          </div>

          {/* Global Rank */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-purple-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🏆</span>
              <span className="text-purple-400 text-sm font-medium">Up 5 places</span>
            </div>
            <div className="text-3xl font-bold text-purple-500">#{mockStats.rank}</div>
            <div className="text-neutral-500 text-sm mt-1">Global Rank</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Activity Chart */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Weekly Activity</h2>
                <select className="text-sm bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1.5 text-neutral-300 focus:outline-none focus:border-emerald-500">
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>This Month</option>
                </select>
              </div>
              
              {/* Simple Bar Chart */}
              <div className="flex items-end justify-between h-48 gap-2">
                {weeklyData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-emerald-500/20 rounded-t-lg relative overflow-hidden group cursor-pointer"
                      style={{ height: `${(day.value / 70) * 100}%` }}
                    >
                      <div 
                        className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all group-hover:bg-emerald-400"
                        style={{ height: '100%' }}
                      />
                    </div>
                    <span className="text-xs text-neutral-500">{day.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact by Category */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Impact by Category</h2>
              <div className="space-y-4">
                {categoryData.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-neutral-300">{item.label}</span>
                      <span className="font-medium text-white">{item.value}%</span>
                    </div>
                    <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${item.value}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Recent Activities</h2>
                <Link to="/impact" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                  View All →
                </Link>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex space-x-3">
                      <div className="w-10 h-10 bg-neutral-800 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-neutral-800 rounded w-3/4"></div>
                        <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 4).map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
                    >
                      <span className="text-2xl">{getActivityIcon(activity.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-200 truncate">
                          {activity.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-emerald-400">+{activity.points} pts</span>
                          <span className="text-xs text-neutral-500">•</span>
                          <span className="text-xs text-neutral-500">{getRelativeTime(activity.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Achievements Preview */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">Achievements</h2>
                <Link to="/profile" className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['🌱', '🔥', '♻️', '💧', '🚴', '🌳', '⚡', '🏆'].map((badge, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all ${
                      index < 5 
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 cursor-pointer' 
                        : 'bg-neutral-800 opacity-40'
                    }`}
                    title={index < 5 ? 'Earned' : 'Locked'}
                  >
                    {badge}
                  </div>
                ))}
              </div>
              <p className="text-sm text-neutral-500 mt-4 text-center">5 of 8 badges earned</p>
            </div>

            {/* Daily Goal */}
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Daily Goal</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-emerald-100">Progress</span>
                  <span className="font-medium">3/5 activities</span>
                </div>
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all" style={{ width: '60%' }}></div>
                </div>
              </div>
              <p className="text-emerald-100 text-sm">
                Complete 2 more activities to reach your daily goal! 💪
              </p>
            </div>

            {/* Quick Stats */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">This Week</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-neutral-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-500">{mockStats.activitiesThisWeek}</div>
                  <div className="text-xs text-neutral-500 mt-1">Activities</div>
                </div>
                <div className="text-center p-3 bg-neutral-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-500">{mockStats.totalEnergySaved.toFixed(0)}</div>
                  <div className="text-xs text-neutral-500 mt-1">kWh Saved</div>
                </div>
                <div className="text-center p-3 bg-neutral-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-cyan-500">{mockStats.totalWaterSaved}</div>
                  <div className="text-xs text-neutral-500 mt-1">L Water</div>
                </div>
                <div className="text-center p-3 bg-neutral-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-500">{mockStats.totalWasteReduced.toFixed(0)}</div>
                  <div className="text-xs text-neutral-500 mt-1">kg Waste</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
