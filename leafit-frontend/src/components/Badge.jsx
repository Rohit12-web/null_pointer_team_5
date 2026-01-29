import React, { useState } from 'react';

const Badge = ({
  badge,
  size = 'medium',
  showDetails = true,
  isLocked = false,
  progress = 0,
  onClick,
  showProgress = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Badge data structure
  const {
    id,
    name,
    description,
    icon,
    category,
    tier = 'bronze',
    earnedAt,
    requirement,
    currentProgress = 0,
    maxProgress = 100,
    rarity = 'common',
  } = badge;

  // Size configurations
  const sizeClasses = {
    small: {
      container: 'w-12 h-12',
      icon: 'text-xl',
      ring: 'ring-2',
      padding: 'p-2',
    },
    medium: {
      container: 'w-16 h-16',
      icon: 'text-3xl',
      ring: 'ring-3',
      padding: 'p-3',
    },
    large: {
      container: 'w-24 h-24',
      icon: 'text-5xl',
      ring: 'ring-4',
      padding: 'p-4',
    },
    xlarge: {
      container: 'w-32 h-32',
      icon: 'text-6xl',
      ring: 'ring-4',
      padding: 'p-5',
    },
  };

  // Tier colors
  const tierColors = {
    bronze: {
      bg: 'bg-gradient-to-br from-amber-600 to-amber-800',
      ring: 'ring-amber-400',
      text: 'text-amber-600',
      glow: 'shadow-amber-300',
      label: 'Bronze',
    },
    silver: {
      bg: 'bg-gradient-to-br from-gray-300 to-gray-500',
      ring: 'ring-gray-300',
      text: 'text-gray-500',
      glow: 'shadow-gray-300',
      label: 'Silver',
    },
    gold: {
      bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
      ring: 'ring-yellow-400',
      text: 'text-yellow-600',
      glow: 'shadow-yellow-300',
      label: 'Gold',
    },
    platinum: {
      bg: 'bg-gradient-to-br from-cyan-300 to-blue-500',
      ring: 'ring-cyan-300',
      text: 'text-cyan-500',
      glow: 'shadow-cyan-300',
      label: 'Platinum',
    },
    diamond: {
      bg: 'bg-gradient-to-br from-purple-400 to-pink-500',
      ring: 'ring-purple-400',
      text: 'text-purple-500',
      glow: 'shadow-purple-300',
      label: 'Diamond',
    },
  };

  // Rarity colors
  const rarityColors = {
    common: 'bg-gray-100 text-gray-600',
    uncommon: 'bg-green-100 text-green-600',
    rare: 'bg-blue-100 text-blue-600',
    epic: 'bg-purple-100 text-purple-600',
    legendary: 'bg-yellow-100 text-yellow-600',
  };

  // Category icons
  const categoryIcons = {
    transport: '🚌',
    energy: '⚡',
    waste: '♻️',
    water: '💧',
    food: '🥗',
    community: '👥',
    streak: '🔥',
    milestone: '🏆',
    special: '⭐',
  };

  const sizes = sizeClasses[size] || sizeClasses.medium;
  const colors = tierColors[tier] || tierColors.bronze;

  // Calculate progress percentage
  const progressPercentage = maxProgress > 0 
    ? Math.min((currentProgress / maxProgress) * 100, 100) 
    : 0;

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle click
  const handleClick = () => {
    if (onClick) {
      onClick(badge);
    } else if (showDetails) {
      setShowModal(true);
    }
  };

  return (
    <>
      {/* Badge Component */}
      <div
        className={`relative inline-flex flex-col items-center cursor-pointer transition-all duration-300 ${
          isHovered && !isLocked ? 'transform scale-110' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {/* Badge Circle */}
        <div
          className={`
            ${sizes.container} 
            ${sizes.padding}
            ${isLocked ? 'bg-gray-300' : colors.bg}
            ${sizes.ring}
            ${isLocked ? 'ring-gray-400' : colors.ring}
            rounded-full 
            flex items-center justify-center
            ${!isLocked && isHovered ? `shadow-lg ${colors.glow}` : 'shadow-md'}
            transition-all duration-300
            relative
            overflow-hidden
          `}
        >
          {/* Locked Overlay */}
          {isLocked && (
            <div className="absolute inset-0 bg-gray-500 bg-opacity-50 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          )}

          {/* Badge Icon */}
          {!isLocked && (
            <span className={`${sizes.icon} filter drop-shadow-sm`}>
              {icon || categoryIcons[category] || '🏅'}
            </span>
          )}

          {/* Shine Effect on Hover */}
          {!isLocked && isHovered && (
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-30 animate-pulse rounded-full" />
          )}
        </div>

        {/* Progress Ring (for locked badges with progress) */}
        {isLocked && showProgress && progressPercentage > 0 && (
          <svg
            className="absolute top-0 left-0 transform -rotate-90"
            style={{ width: sizes.container, height: sizes.container }}
          >
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeDasharray={`${progressPercentage * 2.83} 283`}
              strokeLinecap="round"
            />
          </svg>
        )}

        {/* Badge Name */}
        {showDetails && (
          <div className="mt-2 text-center">
            <p
              className={`text-sm font-medium ${
                isLocked ? 'text-gray-400' : 'text-gray-700'
              }`}
            >
              {name}
            </p>
            {!isLocked && earnedAt && (
              <p className="text-xs text-gray-400">{formatDate(earnedAt)}</p>
            )}
            {isLocked && showProgress && (
              <p className="text-xs text-gray-400">
                {currentProgress}/{maxProgress}
              </p>
            )}
          </div>
        )}

        {/* Tier Label */}
        {!isLocked && size !== 'small' && (
          <span
            className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold rounded-full ${colors.bg} text-white shadow-sm`}
          >
            {tier.charAt(0).toUpperCase()}
          </span>
        )}

        {/* New Badge Indicator */}
        {badge.isNew && !isLocked && (
          <span className="absolute -top-1 -left-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}

        {/* Hover Tooltip */}
        {isHovered && !showModal && (
          <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
              <p className="font-medium">{name}</p>
              <p className="text-gray-300 mt-1">{description}</p>
              {isLocked && requirement && (
                <p className="text-yellow-300 mt-1">🎯 {requirement}</p>
              )}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-16 h-16 ${colors.bg} ${colors.ring} ring-4 rounded-full flex items-center justify-center shadow-lg`}
                >
                  <span className="text-4xl">{icon || categoryIcons[category] || '🏅'}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors.bg} text-white`}>
                      {colors.label}
                    </span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${rarityColors[rarity]}`}>
                      {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4">{description}</p>

            {/* Badge Details */}
            <div className="space-y-3">
              {/* Category */}
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Category</span>
                <span className="text-sm font-medium text-gray-700 flex items-center">
                  {categoryIcons[category]} {category?.charAt(0).toUpperCase() + category?.slice(1)}
                </span>
              </div>

              {/* Earned Date */}
              {earnedAt && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Earned On</span>
                  <span className="text-sm font-medium text-gray-700">
                    {formatDate(earnedAt)}
                  </span>
                </div>
              )}

              {/* Requirement */}
              {requirement && (
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Requirement</span>
                  <span className="text-sm font-medium text-gray-700">{requirement}</span>
                </div>
              )}

              {/* Progress (for locked badges) */}
              {isLocked && (
                <div className="py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Progress</span>
                    <span className="text-sm font-medium text-gray-700">
                      {currentProgress}/{maxProgress}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Share Button */}
            {!isLocked && (
              <button className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share Achievement</span>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Badge Collection Component
export const BadgeCollection = ({ 
  badges, 
  title, 
  showLocked = true, 
  columns = 4,
  emptyMessage = "No badges earned yet. Start logging activities to earn badges!"
}) => {
  const earnedBadges = badges.filter(b => !b.isLocked);
  const lockedBadges = badges.filter(b => b.isLocked);

  return (
    <div className="space-y-6">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <span className="text-sm text-gray-500">
            {earnedBadges.length}/{badges.length} earned
          </span>
        </div>
      )}

      {badges.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <span className="text-4xl mb-4 block">🏅</span>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      ) : (
        <>
          {/* Earned Badges */}
          {earnedBadges.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Earned ({earnedBadges.length})
              </h3>
              <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-${columns} gap-4`}>
                {earnedBadges.map((badge) => (
                  <Badge key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          )}

          {/* Locked Badges */}
          {showLocked && lockedBadges.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Locked ({lockedBadges.length})
              </h3>
              <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-${columns} gap-4`}>
                {lockedBadges.map((badge) => (
                  <Badge 
                    key={badge.id} 
                    badge={badge} 
                    isLocked={true}
                    showProgress={true}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Badge Notification Component (for newly earned badges)
export const BadgeNotification = ({ badge, onClose, onView }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-bounce-in">
      <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-sm border-2 border-yellow-400">
        <div className="flex items-start space-x-4">
          {/* Confetti Effect */}
          <div className="absolute -top-2 -left-2 text-2xl animate-spin-slow">🎉</div>
          <div className="absolute -top-2 -right-2 text-2xl animate-spin-slow">🎊</div>
          
          {/* Badge Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg ring-4 ring-yellow-300">
            <span className="text-3xl">{badge.icon || '🏅'}</span>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <p className="text-xs text-yellow-600 font-medium">NEW BADGE EARNED!</p>
            <h3 className="text-lg font-bold text-gray-800">{badge.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{badge.description}</p>
            
            {/* Actions */}
            <div className="flex space-x-2 mt-3">
              <button
                onClick={onView}
                className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                View Badge
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-medium rounded-lg transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Badge Progress Card Component
export const BadgeProgressCard = ({ badge, size = 'medium' }) => {
  const progressPercentage = badge.maxProgress > 0 
    ? Math.min((badge.currentProgress / badge.maxProgress) * 100, 100) 
    : 0;

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-4">
        <Badge badge={badge} size="small" showDetails={false} isLocked={true} />
        
        <div className="flex-1">
          <h4 className="font-medium text-gray-800">{badge.name}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{badge.requirement}</p>
          
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{badge.currentProgress} / {badge.maxProgress}</span>
              <span>{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badge;