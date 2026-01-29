import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Leaderboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');
  const [category, setCategory] = useState('all');

  // Mock leaderboard data
  const leaderboardData = [
    {
      id: 1,
      rank: 1,
      name: 'Sarah Green',
      avatar: '👩‍🦰',
      points: 4850,
      co2Saved: 245.8,
      activities: 156,
      streak: 32,
      badges: 12,
      change: 0,
    },
    {
      id: 2,
      rank: 2,
      name: 'Alex Forest',
      avatar: '👨‍🦱',
      points: 4620,
      co2Saved: 232.4,
      activities: 142,
      streak: 28,
      badges: 10,
      change: 1,
    },
    {
      id: 3,
      rank: 3,
      name: 'Jordan River',
      avatar: '🧑‍🦳',
      points: 4380,
      co2Saved: 218.5,
      activities: 138,
      streak: 25,
      badges: 9,
      change: -1,
    },
    {
      id: 4,
      rank: 4,
      name: 'Emma Leaf',
      avatar: '👱‍♀️',
      points: 4150,
      co2Saved: 205.2,
      activities: 125,
      streak: 21,
      badges: 8,
      change: 2,
    },
    {
      id: 5,
      rank: 5,
      name: 'Mike Ocean',
      avatar: '👨',
      points: 3980,
      co2Saved: 198.7,
      activities: 118,
      streak: 18,
      badges: 8,
      change: 0,
    },
    {
      id: 6,
      rank: 6,
      name: 'Lisa Sun',
      avatar: '👩',
      points: 3750,
      co2Saved: 185.3,
      activities: 112,
      streak: 15,
      badges: 7,
      change: -2,
    },
    {
      id: 7,
      rank: 7,
      name: 'Tom Wind',
      avatar: '🧔',
      points: 3520,
      co2Saved: 172.8,
      activities: 105,
      streak: 12,
      badges: 6,
      change: 1,
    },
    {
      id: 8,
      rank: 8,
      name: 'Nina Earth',
      avatar: '👩‍🦰',
      points: 3280,
      co2Saved: 162.4,
      activities: 98,
      streak: 10,
      badges: 6,
      change: 0,
    },
    {
      id: 9,
      rank: 9,
      name: 'Chris Rain',
      avatar: '👨‍🦰',
      points: 3050,
      co2Saved: 152.1,
      activities: 92,
      streak: 8,
      badges: 5,
      change: 3,
    },
    {
      id: 10,
      rank: 10,
      name: 'Dana Cloud',
      avatar: '👱',
      points: 2820,
      co2Saved: 141.5,
      activities: 85,
      streak: 6,
      badges: 5,
      change: -1,
    },
  ];

  // Current user's position
  const currentUserRank = {
    rank: 42,
    points: 2450,
    co2Saved: 156.8,
    change: 5,
  };

  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return { icon: '🥇', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
      case 2:
        return { icon: '🥈', color: 'bg-neutral-400/20 text-neutral-300 border-neutral-400/30' };
      case 3:
        return { icon: '🥉', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' };
      default:
        return { icon: rank, color: 'bg-neutral-800 text-neutral-400 border-neutral-700' };
    }
  };

  const getChangeIndicator = (change) => {
    if (change > 0) {
      return <span className="text-emerald-400 text-sm">↑ {change}</span>;
    } else if (change < 0) {
      return <span className="text-red-400 text-sm">↓ {Math.abs(change)}</span>;
    }
    return <span className="text-neutral-500 text-sm">-</span>;
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-emerald-400 text-sm tracking-widest uppercase mb-2">Rankings</p>
          <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
          <p className="text-neutral-400 mt-2">
            Compete with others and climb the ranks! 🏆
          </p>
        </div>

        {/* Filters */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Time Range */}
            <div className="flex space-x-2">
              {['week', 'month', 'year', 'all-time'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    timeRange === range
                      ? 'bg-emerald-500 text-black'
                      : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'
                  }`}
                >
                  {range === 'all-time' ? 'All Time' : range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              <option value="transport">Transportation</option>
              <option value="energy">Energy</option>
              <option value="recycling">Recycling</option>
              <option value="water">Water</option>
            </select>
          </div>
        </div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* Second Place */}
          <div className="flex flex-col items-center pt-8">
            <div className="relative">
              <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center text-4xl border-4 border-neutral-600 shadow-lg">
                {leaderboardData[1].avatar}
              </div>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-2xl">
                🥈
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-white">{leaderboardData[1].name}</h3>
            <p className="text-emerald-400 font-bold">{leaderboardData[1].points.toLocaleString()} pts</p>
            <p className="text-sm text-neutral-500">{leaderboardData[1].co2Saved} kg CO₂</p>
          </div>

          {/* First Place */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 bg-yellow-500/20 rounded-full flex items-center justify-center text-5xl border-4 border-yellow-500/50 shadow-xl">
                {leaderboardData[0].avatar}
              </div>
              <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-3xl">
                👑
              </span>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-2xl">
                🥇
              </span>
            </div>
            <h3 className="mt-4 font-bold text-lg text-white">{leaderboardData[0].name}</h3>
            <p className="text-emerald-400 font-bold text-lg">{leaderboardData[0].points.toLocaleString()} pts</p>
            <p className="text-sm text-neutral-500">{leaderboardData[0].co2Saved} kg CO₂</p>
          </div>

          {/* Third Place */}
          <div className="flex flex-col items-center pt-12">
            <div className="relative">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center text-3xl border-4 border-amber-500/50 shadow-lg">
                {leaderboardData[2].avatar}
              </div>
              <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-2xl">
                🥉
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-white">{leaderboardData[2].name}</h3>
            <p className="text-emerald-400 font-bold">{leaderboardData[2].points.toLocaleString()} pts</p>
            <p className="text-sm text-neutral-500">{leaderboardData[2].co2Saved} kg CO₂</p>
          </div>
        </div>

        {/* Your Position */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                #{currentUserRank.rank}
              </div>
              <div>
                <h3 className="font-semibold text-lg">Your Position</h3>
                <p className="text-emerald-100">Keep going to climb the ranks!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{currentUserRank.points.toLocaleString()} pts</p>
              <p className="text-emerald-100 flex items-center justify-end space-x-1">
                <span className="text-yellow-300">↑ {currentUserRank.change}</span>
                <span>positions this week</span>
              </p>
            </div>
          </div>
        </div>

        {/* Full Leaderboard */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-neutral-800">
            <h2 className="text-xl font-semibold text-white">Full Rankings</h2>
          </div>
          
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-neutral-800/50 text-sm font-medium text-neutral-500">
            <div className="col-span-1">Rank</div>
            <div className="col-span-4">User</div>
            <div className="col-span-2 text-right">Points</div>
            <div className="col-span-2 text-right">CO₂ Saved</div>
            <div className="col-span-2 text-right">Streak</div>
            <div className="col-span-1 text-center">Change</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-neutral-800">
            {leaderboardData.map((user, index) => {
              const rankBadge = getRankBadge(user.rank);
              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-neutral-800/50 transition-colors ${
                    index < 3 ? 'bg-gradient-to-r from-transparent to-emerald-500/5' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="col-span-1">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full border ${rankBadge.color} font-semibold text-sm`}>
                      {user.rank <= 3 ? rankBadge.icon : user.rank}
                    </span>
                  </div>

                  {/* User */}
                  <div className="col-span-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-neutral-800 rounded-full flex items-center justify-center text-xl">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-white">{user.name}</p>
                      <p className="text-sm text-neutral-500">{user.badges} badges</p>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="col-span-2 text-right">
                    <span className="font-bold text-emerald-400">{user.points.toLocaleString()}</span>
                    <span className="text-neutral-500 ml-1">pts</span>
                  </div>

                  {/* CO2 Saved */}
                  <div className="col-span-2 text-right">
                    <span className="font-medium text-neutral-300">{user.co2Saved}</span>
                    <span className="text-neutral-500 ml-1">kg</span>
                  </div>

                  {/* Streak */}
                  <div className="col-span-2 text-right">
                    <span className="inline-flex items-center space-x-1">
                      <span className="text-orange-500">🔥</span>
                      <span className="font-medium text-neutral-300">{user.streak} days</span>
                    </span>
                  </div>

                  {/* Change */}
                  <div className="col-span-1 text-center">
                    {getChangeIndicator(user.change)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More */}
          <div className="p-4 border-t border-neutral-800">
            <button className="w-full py-3 text-emerald-400 font-medium hover:bg-neutral-800 rounded-lg transition-colors">
              Load More Rankings
            </button>
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center">
            <span className="text-4xl">👥</span>
            <h3 className="text-2xl font-bold text-white mt-2">15,234</h3>
            <p className="text-neutral-400">Active Users</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center">
            <span className="text-4xl">🌍</span>
            <h3 className="text-2xl font-bold text-white mt-2">2.5M kg</h3>
            <p className="text-neutral-400">Total CO₂ Saved</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 text-center">
            <span className="text-4xl">📊</span>
            <h3 className="text-2xl font-bold text-white mt-2">458K</h3>
            <p className="text-neutral-400">Activities Logged</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
