import React, { useState } from 'react';
import { TableRow } from '../types/demand';

interface BarChartProps {
  data: TableRow[];
  horizontal?: boolean;
  valueSuffix?: string;
  colorTheme?: 'blue' | 'indigo' | 'emerald';
}

export const SimpleBarChart: React.FC<BarChartProps> = ({
  data,
  horizontal = false,
  valueSuffix = '%',
  colorTheme = 'blue',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(...data.map(d => d.percentage), 1);

  const getThemeClasses = (idx: number, isHovered: boolean) => {
    const isTop = idx === 0;
    if (colorTheme === 'blue') {
      return isHovered
        ? 'bg-sky-500 shadow-md'
        : isTop
        ? 'bg-blue-600'
        : 'bg-blue-500/85';
    }
    return isHovered ? 'bg-indigo-400' : 'bg-indigo-600';
  };

  if (horizontal) {
    return (
      <div className="space-y-3 w-full">
        {data.map((item, idx) => {
          const widthPct = Math.max(5, (item.percentage / maxVal) * 100);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="space-y-1 group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex justify-between items-center text-xs sm:text-sm">
                <span className="font-medium text-slate-700 truncate max-w-[70%]" title={item.category}>
                  {item.category}
                </span>
                <span className="font-semibold text-slate-900 font-mono">
                  {item.percentage}{valueSuffix} <span className="text-slate-500 font-normal">({item.count} resp.)</span>
                </span>
              </div>
              <div className="h-6 w-full bg-slate-100 rounded-lg overflow-hidden flex items-center p-0.5">
                <div
                  className={`h-full rounded-md transition-all duration-500 flex items-center justify-end pr-2 text-[10px] text-white font-medium ${getThemeClasses(
                    idx,
                    isHovered
                  )}`}
                  style={{ width: `${widthPct}%` }}
                >
                  {widthPct > 25 && `${item.percentage}%`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Vertical Bar Chart
  return (
    <div className="w-full">
      <div className="h-64 flex items-end gap-2 sm:gap-4 pt-6 pb-2 px-2 border-b border-slate-200">
        {data.map((item, idx) => {
          const heightPct = Math.max(8, (item.percentage / maxVal) * 92);
          const isHovered = hoveredIdx === idx;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              <div
                className={`absolute -top-10 bg-slate-900 text-white text-[11px] py-1 px-2 rounded pointer-events-none whitespace-nowrap transition-opacity duration-200 z-10 shadow-lg ${
                  isHovered ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="font-semibold">{item.category}</div>
                <div>{item.percentage}% ({item.count} respuestas)</div>
              </div>

              <div className="text-[11px] font-mono font-semibold text-slate-700 mb-1">
                {item.percentage}%
              </div>
              <div
                className={`w-full max-w-[48px] rounded-t-md transition-all duration-300 ${getThemeClasses(
                  idx,
                  isHovered
                )}`}
                style={{ height: `${heightPct}%` }}
              />
            </div>
          );
        })}
      </div>
      {/* Category Labels */}
      <div className="flex gap-2 sm:gap-4 px-2 pt-2">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 text-center text-[10px] sm:text-xs font-medium text-slate-600 truncate"
            title={item.category}
          >
            {item.category.length > 15 ? item.category.substring(0, 13) + '..' : item.category}
          </div>
        ))}
      </div>
    </div>
  );
};

interface DoughnutChartProps {
  data: TableRow[];
  size?: number;
}

export const SimpleDoughnutChart: React.FC<DoughnutChartProps> = ({ data, size = 200 }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Palette of high-contrast professional blues and accents
  const colors = [
    '#1e3a8a', // Dark Navy
    '#0284c7', // Sky Blue
    '#38bdf8', // Light Cyan Blue
    '#6366f1', // Indigo
    '#94a3b8', // Slate Slate
    '#0ea5e9', // Deep Sky
    '#cbd5e1', // Light Gray
  ];

  let cumulativeAngle = 0;
  const radius = size / 2 - 12;
  const innerRadius = radius * 0.58;
  const center = size / 2;

  const slices = data.map((item, idx) => {
    const sliceAngle = total > 0 ? (item.count / total) * 360 : 0;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle += sliceAngle;

    // SVG arc coordinates
    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const x3 = center + innerRadius * Math.cos(endRad);
    const y3 = center + innerRadius * Math.sin(endRad);
    const x4 = center + innerRadius * Math.cos(startRad);
    const y4 = center + innerRadius * Math.sin(startRad);

    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

    const pathData = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;

    return {
      ...item,
      color: colors[idx % colors.length],
      pathData,
      idx,
    };
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
          {slices.map(slice => {
            const isHovered = hoveredIdx === slice.idx;
            return (
              <path
                key={slice.idx}
                d={slice.pathData}
                fill={slice.color}
                className="transition-all duration-300 cursor-pointer"
                opacity={hoveredIdx !== null && !isHovered ? 0.6 : 1}
                transform={isHovered ? `scale(1.03) translate(-${center * 0.03}, -${center * 0.03})` : ''}
                onMouseEnter={() => setHoveredIdx(slice.idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          {hoveredIdx !== null ? (
            <>
              <span className="text-xl font-bold text-slate-900 font-mono">
                {data[hoveredIdx].percentage}%
              </span>
              <span className="text-[10px] text-slate-500 font-medium px-2 truncate max-w-[120px]">
                {data[hoveredIdx].category}
              </span>
            </>
          ) : (
            <>
              <span className="text-lg font-bold text-slate-800 font-mono">{total}</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Respuestas</span>
            </>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-2 min-w-[200px] w-full">
        {slices.map((slice, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
              hoveredIdx === idx ? 'bg-slate-100 font-semibold' : 'hover:bg-slate-50'
            }`}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="flex items-center gap-2 truncate pr-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-slate-700 truncate" title={slice.category}>
                {slice.category}
              </span>
            </div>
            <div className="font-mono text-slate-900 flex-shrink-0">
              {slice.percentage}% <span className="text-slate-400">({slice.count})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
