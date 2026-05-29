/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { Article } from '../types';

interface TimelineChartProps {
  articles: Article[];
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
}

export default function TimelineChart({
  articles,
  selectedYear,
  onSelectYear,
}: TimelineChartProps) {
  const [hoveredYear, setHoveredYear] = useState<{ year: number; count: number; x: number; y: number } | null>(null);

  // Group and count articles by year
  const rawData = useMemo(() => {
    const counts: Record<number, number> = {};
    // Seed all years from 1900 to 1990 with 0
    for (let y = 1900; y <= 1990; y += 2) {
      counts[y] = 0;
    }
    articles.forEach((art) => {
      // Find nearest even year or exact year to keep chart neat and high density
      const nearestGroupYear = Math.round(art.year / 2) * 2;
      if (nearestGroupYear >= 1900 && nearestGroupYear <= 1990) {
        counts[nearestGroupYear] = (counts[nearestGroupYear] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([yearStr, count]) => ({
      year: parseInt(yearStr, 10),
      count,
    })).sort((a, b) => a.year - b.year);
  }, [articles]);

  const maxCount = useMemo(() => {
    const val = Math.max(...rawData.map((d) => d.count), 0);
    return val === 0 ? 1 : val;
  }, [rawData]);

  return (
    <div id="timeline-chart-container" className="bg-[#F9F8F6] border border-[#E5E1D8] p-4 rounded-sm shadow-xs relative">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1A1A1A] font-sans">
            Corpus Timeline Distribution (1900 — 1990)
          </h3>
          <p className="text-[11px] text-stone-500">
            {selectedYear 
              ? `Showing records matching year ${selectedYear}. Click another or reset to expand.` 
              : 'Click any active bar segment across the 90-year landscape to filter your research.'}
          </p>
        </div>
        {selectedYear !== null && (
          <button
            id="clear-year-filter"
            onClick={() => onSelectYear(null)}
            className="text-[11px] bg-[#F3F1ED] border border-[#E5E1D8] text-[#8B4513] hover:bg-[#8B4513] hover:text-white font-mono px-2 py-0.5 rounded-sm transition cursor-pointer"
          >
            Reset Year Filter [× {selectedYear}]
          </button>
        )}
      </div>

      {/* SVG Container */}
      <div className="relative h-28 w-full mt-2">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 800 100"
          preserveAspectRatio="none"
        >
          {/* Horizontal grid lines */}
          <line x1="0" y1="10" x2="800" y2="10" stroke="#E5E1D8" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="50" x2="800" y2="50" stroke="#E5E1D8" strokeWidth="0.5" strokeDasharray="2,2" />
          <line x1="0" y1="90" x2="800" y2="90" stroke="#E5E1D8" strokeWidth="0.5" strokeDasharray="2,2" />

          {rawData.map((d, index) => {
            const widthPct = 800 / rawData.length;
            const barWidth = Math.max(widthPct - 2, 2.5);
            const x = index * widthPct;
            // Height proportional to counts scaled to max height 80px (starts from bottom y=90)
            const height = (d.count / maxCount) * 80;
            const y = 90 - height;
            const isSelected = selectedYear !== null && Math.abs(d.year - selectedYear) <= 1;
            const isNoFilter = selectedYear === null;
            const hasData = d.count > 0;

            let fillClass = 'fill-stone-300 hover:fill-stone-400';
            if (!hasData) {
              fillClass = 'fill-[#F3F1ED]';
            } else if (isSelected) {
              fillClass = 'fill-[#8B4513] hover:fill-[#8B4513]/80';
            } else if (!isNoFilter) {
              fillClass = 'fill-[#E5E1D8] hover:fill-[#D1CDC1]';
            } else {
              fillClass = 'fill-[#D1CDC1] hover:fill-[#8B4513]';
            }

            return (
              <g key={d.year} className="cursor-pointer">
                {/* Invisible hover helper for thicker touch target */}
                <rect
                  x={x}
                  y={10}
                  width={widthPct}
                  height={80}
                  fill="transparent"
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setHoveredYear({
                      year: d.year,
                      count: d.count,
                      x: x + barWidth / 2,
                      y: y - 8,
                    });
                  }}
                  onMouseLeave={() => setHoveredYear(null)}
                  onClick={() => {
                    if (d.count > 0) {
                      onSelectYear(d.year);
                    }
                  }}
                />
                
                {/* Actual Visual Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(height, d.count > 0 ? 1.5 : 0)}
                  rx="0.5"
                  className={`${fillClass} transition-all duration-150`}
                />
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip inside SVG block */}
        {hoveredYear && (
          <div
            className="absolute z-30 bg-[#1A1A1A] text-white border border-[#E5E1D8] text-[10px] font-mono px-2 py-1 rounded-sm shadow-md pointer-events-none transition-all duration-75"
            style={{
              left: `${(hoveredYear.x / 800) * 100}%`,
              transform: 'translateX(-50%)',
              top: `${hoveredYear.y - 10}px`,
            }}
          >
            <div className="font-semibold text-center">{hoveredYear.year}s</div>
            <div className="text-[9px] text-[#8B4513] font-bold text-center">{hoveredYear.count} articles</div>
          </div>
        )}
      </div>

      {/* Timeline X-Axis Labels */}
      <div className="flex justify-between mt-1 text-[10px] text-stone-500 font-mono px-1">
        <span>1900</span>
        <span>1910</span>
        <span>1920</span>
        <span>1930</span>
        <span>1940</span>
        <span>1950</span>
        <span>1960</span>
        <span>1970</span>
        <span>1980</span>
        <span>1990</span>
      </div>
    </div>
  );
}
