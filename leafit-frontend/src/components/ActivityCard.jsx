import React, { useState } from 'react';

const ActivityCard = ({ activity, onDelete, onEdit, showActions = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getActivityIcon = (type) => {
    const icons = {
      transport: '🚌',
      electricity: '💡',
      plastic: '♻️',
      recycling: '🗑️',
      water: '💧',
      food: '🥗',
      shopping: '🛒',
      tree_planting: '🌳',
      cycling: '🚴',
      walking: '🚶',
      carpooling: '🚗',
      composting: '🌿',
      reusable_bags: '👜',
      solar_energy: '☀️',
      other: '🌱',
    };
    return icons[type] || icons.other;
  };

  const getActivityColor = (type) => {
    const colors = {
      transport: 'bg-blue-50 border-blue-200 hover:border-blue-400',
      electricity: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
      plastic: 'bg-purple-50 border-purple-200 hover:border-purple-400',
      recycling: 'bg-green-50 border-green-200 hover:border-green-400',
      water: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400',
      food: 'bg-orange-50 border-orange-200 hover:border-orange-400',
      shopping: 'bg-pink-50 border-pink-200 hover:border-pink-400',
      tree_planting: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400',
      cycling: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400',
      walking: 'bg-teal-50 border-teal-200 hover:border-teal-400',
      carpooling: 'bg-sky-50 border-sky-200 hover:border-sky-400',
      composting: 'bg-lime-50 border-lime-200 hover:border-lime-400',
      reusable_bags: 'bg-rose-50 border-rose-200 hover:border-rose-400',
      solar_energy: 'bg-amber-50 border-amber-200 hover:border-amber-400',
      other: 'bg-gray-50 border-gray-200 hover:border-gray-400',
    };
    return colors[type] || colors.other;
  };

  const getTypeLabel = (type) => {
    const labels = {
      transport: 'Public Transport',
      electricity: 'Energy Saving',
      plastic: 'Plastic Reduction',
      recycling: 'Recycling',
      water: 'Water Conservation',
      food: 'Sustainable Food',
      shopping: 'Eco Shopping',
      tree_planting: 'Tree Planting',
      cycling: 'Cycling',
      walking: 'Walking',
      carpooling: 'Carpooling',
      composting: 'Composting',
      reusable_bags: 'Reusable Bags',
      solar_energy: 'Solar Energy',
      other: 'Other',
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return formatDate(dateString);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(activity._id || activity.id);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`${getActivityColor(
        activity.type
      )} border-2 rounded-xl p-4 transition-all duration-300 relative`}
    >
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white bg-opacity-95 rounded-xl flex items-center justify-center z-10">
          <div className="text-center p-4">
            <p className="text-gray-700 font-medium mb-4">
              Delete this activity?
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Activity Icon */}
          <div className="text-3xl flex-shrink-0 mt-1">
            {getActivityIcon(activity.type)}
          </div>

          {/* Activity Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 flex-wrap">
              <h3 className="font-semibold text-gray-800">
                {activity.name || getTypeLabel(activity.type)}
              </h3>
              <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full">
                {getTypeLabel(activity.type)}
              </span>
            </div>

            {activity.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {activity.description}
              </p>
            )}

            {/* Impact Metrics */}
            <div className="flex flex-wrap gap-2 mt-3">
              {activity.co2Saved > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  🌿 {activity.co2Saved.toFixed(2)} kg CO₂
                </span>
              )}
              {activity.energySaved > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                  ⚡ {activity.energySaved.toFixed(2)} kWh
                </span>
              )}
              {activity.waterSaved > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                  💧 {activity.waterSaved.toFixed(2)} L
                </span>
              )}
              {activity.wasteSaved > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                  ♻️ {activity.wasteSaved.toFixed(2)} kg
                </span>
              )}
            </div>

            {/* Expanded Details */}
            {isExpanded && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {activity.quantity && (
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-2 font-medium text-gray-700">
                        {activity.quantity} {activity.unit || 'units'}
                      </span>
                    </div>
                  )}
                  {activity.duration && (
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-2 font-medium text-gray-700">
                        {activity.duration} mins
                      </span>
                    </div>
                  )}
                  {activity.distance && (
                    <div>
                      <span className="text-gray-500">Distance:</span>
                      <span className="ml-2 font-medium text-gray-700">
                        {activity.distance} km
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-500">Date:</span>
                    <span className="ml-2 font-medium text-gray-700">
                      {formatDate(activity.createdAt || activity.date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Time:</span>
                    <span className="ml-2 font-medium text-gray-700">
                      {formatTime(activity.createdAt || activity.date)}
                    </span>
                  </div>
                </div>

                {activity.notes && (
                  <div className="mt-3">
                    <span className="text-gray-500 text-sm">Notes:</span>
                    <p className="text-gray-700 text-sm mt-1">{activity.notes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Timestamp & Expand Button */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs text-gray-400">
                {getRelativeTime(activity.createdAt || activity.date)}
              </span>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-green-600 hover:text-green-700 font-medium"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Points & Actions */}
        <div className="flex flex-col items-end ml-4">
          {/* Points Badge */}
          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-sm">
            +{activity.points || 0} pts
          </span>

          {/* Action Buttons */}
          {showActions && (
            <div className="flex space-x-2 mt-3">
              {onEdit && (
                <button
                  onClick={() => onEdit(activity)}
                  className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit activity"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete activity"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Streak Indicator (if applicable) */}
      {activity.isStreak && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-orange-500">🔥</span>
            <span className="text-sm text-orange-600 font-medium">
              {activity.streakCount} day streak!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;