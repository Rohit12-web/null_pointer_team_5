import React from 'react';

const ImpactCard = ({
  title,
  value,
  unit,
  icon,
  color = 'green',
  trend,
  trendValue,
  description,
  size = 'medium',
  comparison,
  goal,
  showProgress = false,
}) => {
  const colorClasses = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      valueText: 'text-green-700',
      trendUp: 'text-green-500',
      trendDown: 'text-red-500',
      progressBg: 'bg-green-200',
      progressFill: 'bg-green-500',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      valueText: 'text-blue-700',
      trendUp: 'text-green-500',
      trendDown: 'text-red-500',
      progressBg: 'bg-blue-200',
      progressFill: 'bg-blue-500',
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconText: 'text-yellow-600',
      valueText: 'text-yellow-700',
      trendUp: 'text-green-500',
      trendDown: 'text-red-500',
      progressBg: 'bg-yellow-200',
      progressFill: 'bg-yellow-500',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconText: 'text-purple-600',
      valueText: 'text-purple-700',
      trendUp: 'text-green-500',
      trendDown: 'text-red-500',
      progressBg: 'bg-purple-200',
      progressFill: 'bg-purple-500',
    },
    cyan: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      iconBg: 'bg-cyan-100',
      iconText: 'text-cyan-600',
      valueText: 'text-cyan-700',
      trendUp: 'text-green-500',
      trendDown: 'text-red-500',
      progressBg: 'bg-cyan-200',
      progressFill: 'bg-cyan-500',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconText: 'text-orange-600',
      valueText: 'text-orange-700',
      trendUp: 'text-green-500',
      trendDown: 'text-red-500',
      progressBg: 'bg-orange-200',
      progressFill: 'bg-orange-500',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      valueText: 'text-red-700',
      trendUp: 'text-green-500',
      trendDown: 'text-red-500',
      progressBg: 'bg-red-200',
      progressFill: 'bg-red-500',
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      iconBg: 'bg-gray-100',
      iconText: 'text-gray-600',
      valueText: 'text-gray-700',
      trendUp: 'text-green-500',
      trendDown: 'text-red-500',
      progressBg: 'bg-gray-200',
      progressFill: 'bg-gray-500',
    },
  };

  const sizeClasses = {
    small: {
      container: 'p-3',
      icon: 'w-8 h-8 text-lg',
      title: 'text-xs',
      value: 'text-xl',
      unit: 'text-xs',
    },
    medium: {
      container: 'p-4',
      icon: 'w-12 h-12 text-2xl',
      title: 'text-sm',
      value: 'text-2xl',
      unit: 'text-sm',
    },
    large: {
      container: 'p-6',
      icon: 'w-16 h-16 text-3xl',
      title: 'text-base',
      value: 'text-4xl',
      unit: 'text-base',
    },
  };

  const colors = colorClasses[color] || colorClasses.green;
  const sizes = sizeClasses[size] || sizeClasses.medium;

  // Calculate progress percentage if goal is provided
  const progressPercentage = goal ? Math.min((value / goal) * 100, 100) : 0;

  // Format large numbers
  const formatValue = (val) => {
    if (typeof val !== 'number') return val;
    if (val >= 1000000) {
      return (val / 1000000).toFixed(1) + 'M';
    }
    if (val >= 1000) {
      return (val / 1000).toFixed(1) + 'K';
    }
    if (val % 1 !== 0) {
      return val.toFixed(2);
    }
    return val.toString();
  };

  // Get comparison icons and text
  const getComparisonContent = () => {
    if (!comparison) return null;

    const comparisons = {
      trees: {
        icon: '🌳',
        text: `Equivalent to ${comparison.value} trees planted`,
      },
      cars: {
        icon: '🚗',
        text: `Equal to ${comparison.value} km not driven`,
      },
      bulbs: {
        icon: '💡',
        text: `Like turning off ${comparison.value} bulbs for a day`,
      },
      bottles: {
        icon: '🍶',
        text: `${comparison.value} plastic bottles saved`,
      },
      showers: {
        icon: '🚿',
        text: `Equivalent to ${comparison.value} shorter showers`,
      },
      meals: {
        icon: '🥗',
        text: `${comparison.value} plant-based meals`,
      },
      flights: {
        icon: '✈️',
        text: `${comparison.value} km of flight emissions offset`,
      },
      homes: {
        icon: '🏠',
        text: `Powers ${comparison.value} homes for a day`,
      },
    };

    return comparisons[comparison.type] || null;
  };

  const comparisonContent = getComparisonContent();

  return (
    <div
      className={`${colors.bg} ${colors.border} border-2 rounded-xl ${sizes.container} hover:shadow-lg transition-all duration-300`}
    >
      {/* Header with Icon and Title */}
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div
            className={`${colors.iconBg} ${sizes.icon} rounded-xl flex items-center justify-center`}
          >
            <span>{icon}</span>
          </div>

          {/* Title */}
          <div>
            <h3 className={`${sizes.title} font-medium text-gray-600`}>
              {title}
            </h3>
            {description && (
              <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            )}
          </div>
        </div>

        {/* Trend Indicator */}
        {trend && (
          <div
            className={`flex items-center space-x-1 ${
              trend === 'up' ? colors.trendUp : colors.trendDown
            }`}
          >
            {trend === 'up' ? (
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
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            ) : (
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
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            )}
            {trendValue && (
              <span className="text-xs font-medium">{trendValue}%</span>
            )}
          </div>
        )}
      </div>

      {/* Value Display */}
      <div className="mt-4">
        <div className="flex items-baseline space-x-2">
          <span className={`${sizes.value} font-bold ${colors.valueText}`}>
            {formatValue(value)}
          </span>
          {unit && (
            <span className={`${sizes.unit} text-gray-500 font-medium`}>
              {unit}
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar (if goal is provided) */}
      {showProgress && goal && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">Progress to goal</span>
            <span className="text-xs font-medium text-gray-600">
              {progressPercentage.toFixed(0)}%
            </span>
          </div>
          <div className={`h-2 ${colors.progressBg} rounded-full overflow-hidden`}>
            <div
              className={`h-full ${colors.progressFill} rounded-full transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-400">
              {formatValue(value)} / {formatValue(goal)} {unit}
            </span>
            {progressPercentage >= 100 && (
              <span className="text-xs text-green-500 font-medium">
                🎉 Goal reached!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Comparison Section */}
      {comparisonContent && (
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{comparisonContent.icon}</span>
            <span className="text-xs text-gray-500">{comparisonContent.text}</span>
          </div>
        </div>
      )}

      {/* Additional Stats (if provided as children) */}
    </div>
  );
};

// Compound component for grouping impact cards
export const ImpactCardGroup = ({ children, columns = 4, title }) => {
  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      )}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns} gap-4`}
      >
        {children}
      </div>
    </div>
  );
};

// Mini version for dashboard widgets
export const ImpactCardMini = ({ icon, value, unit, label, color = 'green' }) => {
  const colorClasses = {
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    purple: 'text-purple-600 bg-purple-50',
    cyan: 'text-cyan-600 bg-cyan-50',
    orange: 'text-orange-600 bg-orange-50',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-3 flex items-center space-x-3`}>
      <span className="text-2xl">{icon}</span>
      <div>
        <div className="flex items-baseline space-x-1">
          <span className="text-lg font-bold">{value}</span>
          <span className="text-xs text-gray-500">{unit}</span>
        </div>
        <span className="text-xs text-gray-500">{label}</span>
      </div>
    </div>
  );
};

export default ImpactCard;