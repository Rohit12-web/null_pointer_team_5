import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Eco Warrior',
    email: user?.email || 'eco@leafit.com',
    bio: 'Passionate about making the world a greener place! 🌿',
    location: 'Earth 🌍',
    joinedDate: 'January 2024',
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
    { id: 1, type: 'gold', name: 'First Steps', description: 'Log your first activity', earnedAt: '2024-01-15', icon: '🌱' },
    { id: 2, type: 'silver', name: 'Week Warrior', description: '7 day streak', earnedAt: '2024-01-22', icon: '🔥' },
    { id: 3, type: 'bronze', name: 'Recycler', description: 'Recycle 10 items', earnedAt: '2024-01-20', icon: '♻️' },
    { id: 4, type: 'gold', name: 'Transport Hero', description: 'Use public transport 20 times', earnedAt: '2024-01-25', icon: '🚌' },
    { id: 5, type: 'platinum', name: 'Eco Champion', description: 'Save 100kg CO₂', earnedAt: '2024-01-28', icon: '🏆' },
    { id: 6, type: 'bronze', name: 'Water Saver', description: 'Save 500L of water', earnedAt: null, isLocked: true, icon: '💧' },
    { id: 7, type: 'silver', name: 'Month Master', description: '30 day streak', earnedAt: null, isLocked: true, icon: '📅' },
    { id: 8, type: 'gold', name: 'Community Leader', description: 'Reach top 10', earnedAt: null, isLocked: true, icon: '👑' },
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

  const getBadgeColor = (type) => {
    const colors = {
      platinum: 'from-purple-500 to-pink-500',
      gold: 'from-yellow-400 to-orange-500',
      silver: 'from-gray-300 to-gray-500',
      bronze: 'from-orange-400 to-orange-600',
    };
    return colors[type] || colors.bronze;
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 text-[200px]">🌿</div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
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
              <p className="text-emerald-100 mt-1">{profileData.bio}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm text-emerald-100">
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
                <div className="text-sm text-emerald-100">Points</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold">{userStats.currentStreak} 🔥</div>
                <div className="text-sm text-emerald-100">Day Streak</div>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="mt-6 relative z-10">
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
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl mb-8">
          <div className="flex border-b border-neutral-800">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.id
                    ? 'text-emerald-400 border-b-2 border-emerald-500'
                    : 'text-neutral-500 hover:text-neutral-300'
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
                  <div className="bg-neutral-800 rounded-xl p-4 text-center border border-neutral-700">
                    <div className="text-3xl font-bold text-emerald-500">{userStats.totalCO2Saved}</div>
                    <div className="text-sm text-neutral-400">kg CO₂ Saved</div>
                  </div>
                  <div className="bg-neutral-800 rounded-xl p-4 text-center border border-neutral-700">
                    <div className="text-3xl font-bold text-blue-500">{userStats.totalActivities}</div>
                    <div className="text-sm text-neutral-400">Activities</div>
                  </div>
                  <div className="bg-neutral-800 rounded-xl p-4 text-center border border-neutral-700">
                    <div className="text-3xl font-bold text-orange-500">{userStats.longestStreak}</div>
                    <div className="text-sm text-neutral-400">Longest Streak</div>
                  </div>
                  <div className="bg-neutral-800 rounded-xl p-4 text-center border border-neutral-700">
                    <div className="text-3xl font-bold text-purple-500">{badges.filter(b => !b.isLocked).length}</div>
                    <div className="text-sm text-neutral-400">Badges Earned</div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Monthly Progress</h3>
                    <div className="flex items-end justify-between h-40 gap-2">
                      {monthlyProgress.map((week, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-400"
                            style={{ height: `${(week.value / 80) * 100}%` }}
                          />
                          <span className="text-xs text-neutral-500">{week.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Activity Breakdown</h3>
                    <div className="space-y-3">
                      {activityBreakdown.map((item, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-neutral-300">{item.label}</span>
                            <span className="text-neutral-400">{item.value}%</span>
                          </div>
                          <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full"
                              style={{ width: `${item.value}%`, backgroundColor: item.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Badges */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Badges</h3>
                  <div className="flex flex-wrap gap-4">
                    {badges.filter(b => !b.isLocked).slice(0, 5).map((badge) => (
                      <div 
                        key={badge.id}
                        className={`bg-gradient-to-br ${getBadgeColor(badge.type)} p-4 rounded-xl text-center min-w-[100px]`}
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <div className="text-sm font-medium text-white">{badge.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Badges Tab */}
            {activeTab === 'badges' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Earned Badges ({badges.filter(b => !b.isLocked).length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.filter(b => !b.isLocked).map((badge) => (
                      <div 
                        key={badge.id}
                        className={`bg-gradient-to-br ${getBadgeColor(badge.type)} p-6 rounded-xl text-center`}
                      >
                        <div className="text-4xl mb-3">{badge.icon}</div>
                        <div className="font-semibold text-white">{badge.name}</div>
                        <div className="text-xs text-white/70 mt-1">{badge.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Locked Badges ({badges.filter(b => b.isLocked).length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.filter(b => b.isLocked).map((badge) => (
                      <div 
                        key={badge.id}
                        className="bg-neutral-800 border border-neutral-700 p-6 rounded-xl text-center opacity-50"
                      >
                        <div className="text-4xl mb-3 grayscale">{badge.icon}</div>
                        <div className="font-semibold text-neutral-400">{badge.name}</div>
                        <div className="text-xs text-neutral-500 mt-1">{badge.description}</div>
                        <div className="text-xs text-neutral-600 mt-2">🔒 Locked</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">Location</label>
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black py-3 rounded-xl font-medium transition-colors">
                    Save Changes
                  </button>
                  <button
                    onClick={logout}
                    className="px-6 py-3 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl font-medium transition-colors"
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
