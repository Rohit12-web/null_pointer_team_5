import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Chart from '../components/Chart';
import Badge, { BadgeCollection } from '../components/Badge';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Eco Warrior',
    email: user?.email || 'eco@leafit.com',
    bio: 'Passionate about making the world a greener place! 🌿',
    location: 'Earth 🌍',
    joinedDate: 'January 2026',
  });

  // Mock user stats
  const userStats = {
    totalPoints: 2450,
    totalCO2Saved: 156.8,
    totalActivities: 87,
    currentStreak: 7,
    longestStreak: 21,
    rank: 42,
    level: 8,
    xpToNextLevel: 350,
    currentXP: 2450,
    nextLevelXP: 2800,
  };

  // Mock badges
  const badges = [
    { id: 1, type: 'gold', name: 'First Steps', description: 'Log your first activity', earnedAt: '2026-01-15' },
    { id: 2, type: 'silver', name: 'Week Warrior', description: '7 day streak', earnedAt: '2026-01-22' },
    { id: 3, type: 'bronze', name: 'Recycler', description: 'Recycle 10 items', earnedAt: '2026-01-20' },
    { id: 4, type: 'gold', name: 'Transport Hero', description: 'Use public transport 20 times', earnedAt: '2026-01-25' },
    { id: 5, type: 'platinum', name: 'Eco Champion', description: 'Save 100kg CO₂', earnedAt: '2026-01-28' },
    { id: 6, type: 'bronze', name: 'Water Saver', description: 'Save 500L of water', earnedAt: null, isLocked: true },
    { id: 7, type: 'silver', name: 'Month Master', description: '30 day streak', earnedAt: null, isLocked: true },
    { id: 8, type: 'gold', name: 'Community Leader', description: 'Reach top 10', earnedAt: null, isLocked: true },
  ];

  // Monthly progress data
  const monthlyProgress = [
    { label: 'Week 1', value: 45 },
    { label: 'Week 2', value: 62 },
    { label: 'Week 3', value: 58 },
    { label: 'Week 4', value: 75 },
  ];

  // Activity breakdown
  const activityBreakdown = [
    { label: 'Transport', value: 35, color: '#3B82F6' },
    { label: 'Energy', value: 28, color: '#F59E0B' },
    { label: 'Recycling', value: 20, color: '#10B981' },
    { label: 'Water', value: 12, color: '#06B6D4' },
    { label: 'Other', value: 5, color: '#8B5CF6' },
  ];

  const levelProgress = ((userStats.currentXP % 350) / 350) * 100;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'badges', label: 'Badges', icon: '🏆' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-5xl border-4 border-white/30">
                🌱
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-gray-800 text-sm font-bold px-2 py-1 rounded-full">
                Lvl {userStats.level}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{profileData.name}</h1>
              <p className="text-green-100 mt-1">{profileData.bio}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-green-100">
                <span className="flex items-center gap-1">
                  <span>📍</span> {profileData.location}
                </span>
                <span className="flex items-center gap-1">
                  <span>📅</span> Joined {profileData.joinedDate}
                </span>
                <span className="flex items-center gap-1">
                  <span>🏆</span> Rank #{userStats.rank}
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold">{userStats.totalPoints}</div>
                <div className="text-sm text-green-100">Points</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold">{userStats.currentStreak} 🔥</div>
                <div className="text-sm text-green-100">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Level {userStats.level}</span>
              <span>{userStats.xpToNextLevel} XP to Level {userStats.level + 1}</span>
            </div>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm mb-8">
          <div className="flex border-b border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-600">{userStats.totalCO2Saved}</div>
                    <div className="text-sm text-gray-600">kg CO₂ Saved</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-blue-600">{userStats.totalActivities}</div>
                    <div className="text-sm text-gray-600">Activities</div>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-orange-600">{userStats.longestStreak}</div>
                    <div className="text-sm text-gray-600">Longest Streak</div>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-purple-600">{badges.filter(b => !b.isLocked).length}</div>
                    <div className="text-sm text-gray-600">Badges Earned</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Progress</h3>
                    <Chart type="bar" data={monthlyProgress} height={180} />
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Activity Breakdown</h3>
                    <Chart type="donut" data={activityBreakdown} size={150} />
                  </div>
                </div>

                {/* Recent Badges */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Badges</h3>
                  <div className="flex flex-wrap gap-4">
                    {badges.filter(b => !b.isLocked).slice(0, 5).map((badge) => (
                      <Badge key={badge.id} badge={badge} size="medium" />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Earned Badges ({badges.filter(b => !b.isLocked).length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {badges.filter(b => !b.isLocked).map((badge) => (
                      <Badge key={badge.id} badge={badge} size="large" />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Locked Badges ({badges.filter(b => b.isLocked).length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {badges.filter(b => b.isLocked).map((badge) => (
                      <Badge key={badge.id} badge={badge} size="large" isLocked />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-medium transition-colors">
                    Save Changes
                  </button>
                  <button
                    onClick={logout}
                    className="px-6 py-3 border border-red-300 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
