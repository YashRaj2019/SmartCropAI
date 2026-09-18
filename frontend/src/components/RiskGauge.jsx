import React from 'react';

export default function RiskGauge({ score = 78, level = 'HIGH' }) {
  const normalizedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = 283 - (283 * (normalizedScore / 100));

  const getColor = () => {
    if (normalizedScore >= 75) return '#f43f5e'; // Rose-500 CRITICAL
    if (normalizedScore >= 50) return '#f97316'; // Orange-500 HIGH
    if (normalizedScore >= 25) return '#eab308'; // Yellow-500 MEDIUM
    return '#10b981'; // Emerald-500 LOW
  };

  const color = getColor();

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          className="text-slate-800"
          strokeWidth="8"
          stroke="currentColor"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          strokeWidth="8"
          stroke={color}
          strokeDasharray="283"
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold text-white tracking-tight">{normalizedScore}</span>
        <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color }}>
          {level} RISK
        </span>
      </div>
    </div>
  );
}
