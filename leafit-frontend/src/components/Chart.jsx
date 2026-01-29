import React from 'react';

// Bar Chart Component
const BarChart = ({ data, height = 200, showLabels = true, showValues = true }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.value));
  const barWidth = 100 / data.length;

  const getBarColor = (index, item) => {
    if (item.color) return item.color;
    const colors = [
      'bg-green-500', 'bg-blue-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
      'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full">
      <div className="flex items-end justify-around gap-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => {
          const barHeight = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex flex-col items-center flex-1 group">
              {showValues && (
                <span className="text-xs font-medium text-gray-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value.toLocaleString()}
                </span>
              )}
              <div
                className={`w-full max-w-12 ${getBarColor(index, item)} rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer`}
                style={{ height: `${barHeight}%`, minHeight: item.value > 0 ? '4px' : '0' }}
                title={`${item.label}: ${item.value}`}
              />
            </div>
          );
        })}
      </div>
      {showLabels && (
        <div className="flex justify-around mt-2">
          {data.map((item, index) => (
            <span key={index} className="text-xs text-gray-500 text-center flex-1 truncate px-1">
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// Line Chart Component using SVG
const LineChart = ({ data, height = 200, showDots = true, showArea = true, color = '#10B981' }) => {
  if (!data || data.length < 2) return null;

  const padding = 40;
  const width = 100;
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * (width - padding * 2) + padding;
    const y = height - padding - ((item.value - minValue) / range) * (height - padding * 2);
    return { x, y, ...item };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: `${height}px` }}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => {
          const y = height - padding - (percent / 100) * (height - padding * 2);
          return (
            <g key={percent}>
              <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />
              <text x={padding - 5} y={y + 3} fontSize="4" fill="#9ca3af" textAnchor="end">
                {Math.round(minValue + (percent / 100) * range)}
              </text>
            </g>
          );
        })}

        {/* Area fill */}
        {showArea && (
          <path d={areaPath} fill={color} fillOpacity="0.1" />
        )}

        {/* Line */}
        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {showDots && points.map((point, index) => (
          <g key={index} className="cursor-pointer">
            <circle cx={point.x} cy={point.y} r="2" fill={color} stroke="white" strokeWidth="0.5" />
            <title>{`${point.label}: ${point.value}`}</title>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((point, index) => (
          <text key={index} x={point.x} y={height - padding + 10} fontSize="4" fill="#6b7280" textAnchor="middle">
            {point.label}
          </text>
        ))}
      </svg>
    </div>
  );
};

// Pie/Donut Chart Component
const PieChart = ({ data, size = 200, donut = true, showLegend = true }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return null;

  const colors = [
    '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', 
    '#EC4899', '#6366F1', '#14B8A6', '#F97316'
  ];

  let currentAngle = 0;
  const radius = 50;
  const center = 50;
  const innerRadius = donut ? radius * 0.6 : 0;

  const slices = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const ix1 = center + innerRadius * Math.cos(startRad);
    const iy1 = center + innerRadius * Math.sin(startRad);
    const ix2 = center + innerRadius * Math.cos(endRad);
    const iy2 = center + innerRadius * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    const path = donut
      ? `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`
      : `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    return {
      path,
      color: item.color || colors[index % colors.length],
      label: item.label,
      value: item.value,
      percentage: (percentage * 100).toFixed(1),
    };
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
        {slices.map((slice, index) => (
          <path
            key={index}
            d={slice.path}
            fill={slice.color}
            className="transition-opacity hover:opacity-80 cursor-pointer"
            stroke="white"
            strokeWidth="0.5"
          >
            <title>{`${slice.label}: ${slice.value} (${slice.percentage}%)`}</title>
          </path>
        ))}
        {donut && (
          <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" fontSize="8" fill="#374151" fontWeight="bold">
            {total.toLocaleString()}
          </text>
        )}
      </svg>

      {showLegend && (
        <div className="flex flex-wrap justify-center gap-3">
          {slices.map((slice, index) => (
            <div key={index} className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: slice.color }} />
              <span className="text-xs text-gray-600">{slice.label}</span>
              <span className="text-xs text-gray-400">({slice.percentage}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Progress Chart Component
const ProgressChart = ({ value, max = 100, label, color = 'bg-green-500', showPercentage = true }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showPercentage && <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>}
        </div>
      )}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Main Chart Component - renders different chart types based on 'type' prop
const Chart = ({ 
  data, 
  type = 'bar', 
  title,
  height = 200,
  ...props 
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return <LineChart data={data} height={height} {...props} />;
      case 'pie':
      case 'donut':
        return <PieChart data={data} donut={type === 'donut'} {...props} />;
      case 'progress':
        return <ProgressChart {...props} />;
      case 'bar':
      default:
        return <BarChart data={data} height={height} {...props} />;
    }
  };

  if (!data || (Array.isArray(data) && data.length === 0)) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 rounded-lg">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      {renderChart()}
    </div>
  );
};

// Export individual chart components for direct use
export { BarChart, LineChart, PieChart, ProgressChart };
export default Chart;
