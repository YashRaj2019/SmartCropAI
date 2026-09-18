import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Clock, Info, BookOpen, CheckSquare } from 'lucide-react';

export default function RecommendationList({ recommendations = [] }) {
  const [filter, setFilter] = useState('ALL');

  const filteredRecs = recommendations.filter((r) => {
    if (filter === 'ALL') return true;
    return r.priority === filter;
  });

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/40';
      case 'MEDIUM':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/40';
      case 'LOW':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Priority Filter Bar */}
      <div className="flex items-center justify-between glass-card p-4 rounded-xl border border-slate-800">
        <span className="text-xs font-semibold text-slate-300">Filter Recommendations:</span>
        <div className="flex items-center space-x-2">
          {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filter === p
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {filteredRecs.length === 0 ? (
          <div className="glass-card p-8 rounded-xl text-center text-slate-400 text-xs">
            No recommendations matching the selected priority filter.
          </div>
        ) : (
          filteredRecs.map((rec, idx) => (
            <div
              key={idx}
              className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-emerald-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold uppercase border ${getPriorityBadge(rec.priority)}`}>
                    {rec.priority} PRIORITY
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                    {rec.category}
                  </span>
                </div>
                {rec.timeframe && (
                  <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{rec.timeframe}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{rec.action}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">
                  <strong>Reasoning:</strong> {rec.reason}
                </p>
              </div>

              {rec.safety_note && (
                <div className="ml-6 p-3 rounded-lg bg-amber-950/30 border border-amber-500/20 text-xs text-amber-300 flex items-start space-x-2">
                  <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Safety Note:</strong> {rec.safety_note}</span>
                </div>
              )}

              {rec.knowledge_ref && (
                <div className="ml-6 flex items-center space-x-1.5 text-[11px] text-slate-400">
                  <BookOpen className="w-3 h-3 text-slate-500" />
                  <span>Ref: {rec.knowledge_ref}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
