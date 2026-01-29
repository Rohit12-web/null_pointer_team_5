import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Chart from '../components/Chart';
import ImpactCard from '../components/ImpactCard';
import ActivityCard from '../components/ActivityCard';

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
      description: 'Recycled 10 plastic bottles',
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
    {
      id: 5,
      type: 'food',
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Environmental Impact</h1>
            <p className="text-gray-600 mt-1">
              See how your actions are making a difference 🌍
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            {['week', 'month', 'year', 'all'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <ImpactCard
            title="CO₂ Saved"
            value={impactStats.totalCO2Saved}
            unit="kg"
            icon="🌍"
            color="green"
            trend="up"
            trendValue="+15% vs last month"
            description="Carbon dioxide emissions prevented"
          />
          <ImpactCard
            title="Energy Saved"
            value={impactStats.totalEnergySaved}
            unit="kWh"
            icon="⚡"
            color="yellow"
            trend="up"
            trendValue="+8% vs last month"
          />
          <ImpactCard
            title="Water Saved"
            value={impactStats.totalWaterSaved}
            unit="L"
            icon="💧"
            color="cyan"
            trend="up"
            trendValue="+22% vs last month"
          />
          <ImpactCard
            title="Waste Reduced"
            value={impactStats.totalWasteReduced}
            unit="kg"
            icon="♻️"
            color="purple"
            trend="up"
            trendValue="+12% vs last month"
          />
        </div>

        {/* Real-World Comparisons */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-8 text-white">
          <h2 className="text-xl font-semibold mb-6">Your Impact in Perspective</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {comparisons.map((item, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <span className="text-4xl">{item.icon}</span>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{item.value}</span>
                  <span className="text-lg ml-1">{item.unit}</span>
                </div>
                <p className="text-green-100 text-sm mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* CO2 Trend Chart */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">CO₂ Savings Trend</h2>
            <Chart type="line" data={monthlyData} height={250} color="#10B981" />
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Impact by Category</h2>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48">
                <Chart type="donut" data={categoryBreakdown} size={180} />
              </div>
              <div className="flex-1 space-y-4">
                {categoryBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-700">{item.label}</span>
                      </div>
                      <span className="font-medium">{item.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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
        </div>

        {/* Activity History */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Activity History</h2>
            <div className="mt-4 md:mt-0 flex space-x-2 overflow-x-auto">
              {['all', 'transport', 'electricity', 'recycling', 'water', 'food'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {activities
              .filter((a) => selectedCategory === 'all' || a.type === selectedCategory)
              .map((activity) => (
                <ActivityCard key={activity.id} activity={activity} showActions={false} />
              ))}
          </div>

          {/* Load More */}
          <button className="mt-6 w-full py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors">
            Load More Activities
          </button>
        </div>

        {/* Download Report */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Download Your Impact Report</h3>
            <p className="text-gray-600 mt-1">Get a detailed PDF report of your environmental contributions</p>
          </div>
          <button className="mt-4 md:mt-0 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2">
            <span>📄</span>
            <span>Download Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Impact;
