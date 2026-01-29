import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Chart from '../components/Chart';
import ActivityCard from '../components/ActivityCard';
import ImpactCard from '../components/ImpactCard';

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name || 'Eco Warrior'}! 🌿
          </h1>
          <p className="text-gray-600 mt-1">
            Track your impact and keep making a difference.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.path}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all flex items-center space-x-3 group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                {action.icon}
              </span>
              <span className="font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ImpactCard
            title="Total Points"
            value={mockStats.totalPoints}
            unit="pts"
            icon="🌱"
            color="green"
            trend="up"
            trendValue="+125 this week"
          />
          <ImpactCard
            title="CO₂ Saved"
            value={mockStats.totalCO2Saved}
            unit="kg"
            icon="🌍"
            color="blue"
            trend="up"
            trendValue="+12.5 kg this week"
          />
          <ImpactCard
            title="Current Streak"
            value={mockStats.currentStreak}
            unit="days"
            icon="🔥"
            color="orange"
            description="Keep it going!"
          />
          <ImpactCard
            title="Global Rank"
            value={`#${mockStats.rank}`}
            icon="🏆"
            color="purple"
            trend="up"
            trendValue="Up 5 places"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weekly Activity Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Weekly Activity</h2>
                <select className="text-sm border rounded-lg px-3 py-1.5 text-gray-600">
                  <option>This Week</option>
                  <option>Last Week</option>
                  <option>This Month</option>
                </select>
              </div>
              <Chart type="bar" data={weeklyData} height={200} />
            </div>

            {/* Impact by Category */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Impact by Category</h2>
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="w-48">
                  <Chart type="donut" data={categoryData} size={180} />
                </div>
                <div className="flex-1 space-y-3">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-700">{item.label}</span>
                      </div>
                      <span className="font-medium text-gray-800">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Recent Activities</h2>
                <Link to="/impact" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.slice(0, 4).map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} showActions={false} />
                  ))}
                </div>
              )}
            </div>

            {/* Achievements Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Achievements</h2>
                <Link to="/profile" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {['🌱', '🔥', '♻️', '💧', '🚴', '🌳', '⚡', '🏆'].map((badge, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                      index < 5 ? 'bg-green-100' : 'bg-gray-100 opacity-50'
                    }`}
                    title={index < 5 ? 'Earned' : 'Locked'}
                  >
                    {badge}
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">5 of 8 badges earned</p>
            </div>

            {/* Daily Goal */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Daily Goal</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>3/5 activities</span>
                </div>
                <div className="w-full h-3 bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <p className="text-green-100 text-sm">
                Complete 2 more activities to reach your daily goal! 💪
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
