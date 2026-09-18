import React from 'react';

export default function HealthGauge({ score = 62 }) {
  const normalizedScore = Math.max(0, Math.min(100, score));

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-300">Crop Health Score</span>
        <span className="text-emerald-400 font-extrabold text-base">{normalizedScore} / 100</span>
      </div>
      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-1000"
          style={{ width: `${normalizedScore}%` }}
        />
      </div>
    </div>
  );
}
