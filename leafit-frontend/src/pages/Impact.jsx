import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Impact = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock impact data
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
    { label: 'Jan', value: 12 },
    { label: 'Feb', value: 18 },
    { label: 'Mar', value: 25 },
    { label: 'Apr', value: 22 },
    { label: 'May', value: 30 },
    { label: 'Jun', value: 35 },
    { label: 'Jul', value: 42 },
    { label: 'Aug', value: 38 },
    { label: 'Sep', value: 45 },
    { label: 'Oct', value: 52 },
    { label: 'Nov', value: 48 },
    { label: 'Dec', value: 55 },
  ];

  const categoryBreakdown = [
    { label: 'Transport', value: 45, color: '#3B82F6' },
    { label: 'Energy', value: 28, color: '#F59E0B' },
    { label: 'Recycling', value: 15, color: '#10B981' },
    { label: 'Water', value: 8, color: '#06B6D4' },
    { label: 'Food', value: 4, color: '#8B5CF6' },
  ];

  const activities = [
    {
      id: 1,
      type: 'transport',
      icon: '🚌',
      description: 'Took the bus to work',
      carbonSaved: 2.6,
      points: 25,
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      type: 'electricity',
      icon: '💡',
      description: 'Used LED lights all day',
      carbonSaved: 0.8,
      points: 15,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 3,
      type: 'recycling',
      icon: '♻️',
      description: 'Recycled 10 plastic bottles',
      carbonSaved: 1.2,
      points: 20,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
    },
    {
      id: 4,
      type: 'water',
      icon: '💧',
      description: 'Shorter shower (5 mins)',
      carbonSaved: 0.3,
      points: 10,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
    },
    {
      id: 5,
      type: 'food',
      icon: '🥗',
      description: 'Plant-based lunch',
      carbonSaved: 2.5,
      points: 30,
      createdAt: new Date(Date.now() - 345600000).toISOString(),
    },
  ];

  const comparisons = [
    {
      icon: '🌳',
      value: impactStats.treesEquivalent,
      unit: 'trees',
      description: 'Worth of CO₂ absorbed yearly',
    },
    {
      icon: '🚗',
      value: impactStats.carMilesOffset,
      unit: 'miles',
      description: 'Of car emissions offset',
    },
    {
      icon: '🍾',
      value: impactStats.plasticBottlesSaved,
      unit: 'bottles',
      description: 'Of plastic waste avoided',
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="min-h-screen bg-neutral-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <p className="text-emerald-400 text-sm tracking-widest uppercase mb-2">Analytics</p>
            <h1 className="text-3xl font-bold text-white">Your Environmental Impact</h1>
            <p className="text-neutral-400 mt-1">
              See how your actions are making a difference 🌍
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            {['week', 'month', 'year', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  timeRange === range
                    ? 'bg-emerald-500 text-black'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">🌍</span>
              <span className="text-emerald-400 text-sm">+15%</span>
            </div>
            <h3 className="text-neutral-400 text-sm">CO₂ Saved</h3>
            <p className="text-3xl font-bold text-white mt-1">{impactStats.totalCO2Saved} <span className="text-lg text-neutral-500">kg</span></p>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-yellow-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">⚡</span>
              <span className="text-emerald-400 text-sm">+8%</span>
            </div>
            <h3 className="text-neutral-400 text-sm">Energy Saved</h3>
            <p className="text-3xl font-bold text-white mt-1">{impactStats.totalEnergySaved} <span className="text-lg text-neutral-500">kWh</span></p>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">💧</span>
              <span className="text-emerald-400 text-sm">+22%</span>
            </div>
            <h3 className="text-neutral-400 text-sm">Water Saved</h3>
            <p className="text-3xl font-bold text-white mt-1">{impactStats.totalWaterSaved} <span className="text-lg text-neutral-500">L</span></p>
          </div>
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">♻️</span>
              <span className="text-emerald-400 text-sm">+12%</span>
            </div>
            <h3 className="text-neutral-400 text-sm">Waste Reduced</h3>
            <p className="text-3xl font-bold text-white mt-1">{impactStats.totalWasteReduced} <span className="text-lg text-neutral-500">kg</span></p>
          </div>
        </div>

        {/* Real-World Comparisons */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 mb-8 text-white">
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
          {/* CO2 Trend Chart */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">CO₂ Savings Trend</h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {monthlyData.map((month, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-400"
                    style={{ height: `${(month.value / maxValue) * 100}%` }}
                  />
                  <span className="text-xs text-neutral-500">{month.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Impact by Category</h2>
            <div className="space-y-4">
              {categoryBreakdown.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-neutral-300">{item.label}</span>
                    </div>
                    <span className="font-medium text-white">{item.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
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

        {/* Activity History */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Activity History</h2>
            <div className="mt-4 md:mt-0 flex space-x-2 overflow-x-auto">
              {['all', 'transport', 'electricity', 'recycling', 'water', 'food'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-black'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
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
                  className="flex items-center justify-between p-4 bg-neutral-800 border border-neutral-700 rounded-xl hover:border-neutral-600 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{activity.icon}</span>
                    <div>
                      <p className="text-white font-medium">{activity.description}</p>
                      <p className="text-neutral-500 text-sm">{formatDate(activity.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-emerald-400 font-semibold">-{activity.carbonSaved} kg CO₂</p>
                    <p className="text-neutral-500 text-sm">+{activity.points} pts</p>
                  </div>
                </div>
              ))}
          </div>

          {/* Load More */}
          <button className="mt-6 w-full py-3 border border-neutral-700 rounded-xl text-neutral-400 font-medium hover:bg-neutral-800 hover:text-neutral-200 transition-colors">
            Load More Activities
          </button>
        </div>

        {/* Download Report */}
        <div className="mt-8 bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Download Your Impact Report</h3>
            <p className="text-neutral-400 mt-1">Get a detailed PDF report of your environmental contributions</p>
          </div>
          <button className="mt-4 md:mt-0 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2">
            <span>📄</span>
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Impact;
