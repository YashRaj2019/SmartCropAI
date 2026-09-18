import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, CheckCircle2, Award, Sparkles, RefreshCw } from 'lucide-react';

export default function ActionChecklist({ analysisId, cropName, diseaseName, solution }) {
  const storageKey = `smartcrop_checklist_${analysisId || 'latest'}`;

  const defaultTasks = [
    {
      id: 'task-1',
      title: 'Immediate Field Quarantine',
      desc: solution?.immediate_action || 'Inspect neighboring plant canopies and isolate severely infected foliar zones.',
      priority: 'Urgent (24h)',
    },
    {
      id: 'task-2',
      title: 'Targeted Crop Protection Spray',
      desc: solution?.chemical || solution?.organic || 'Apply calibrated fungicide or bio-protectant solution following dosage instructions.',
      priority: 'High',
    },
    {
      id: 'task-3',
      title: 'Canopy Aeration & Moisture Control',
      desc: solution?.cultural || 'Prune touching foliage, eliminate volunteer weeds, and avoid overhead sprinkler splash.',
      priority: 'Preventative',
    },
    {
      id: 'task-4',
      title: 'Biological / Organic Reinforcement',
      desc: solution?.organic || 'Apply preventative biological controls or copper protectant to shield healthy foliage.',
      priority: 'Medium',
    },
    {
      id: 'task-5',
      title: 'Post-Intervention Field Scouting',
      desc: 'Re-inspect treated zones in 48-72 hours to verify lesion arrest and prevent secondary sporulation.',
      priority: 'Monitoring',
    },
  ];

  const [completed, setCompleted] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(completed));
    } catch {}
  }, [completed, storageKey]);

  const toggleTask = (id) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleReset = () => {
    setCompleted({});
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPct = Math.round((completedCount / defaultTasks.length) * 100);

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              Interactive Field Protocol
            </span>
            <span className="text-xs text-slate-400">Action Execution Tracker</span>
          </div>
          <h4 className="text-base font-extrabold text-white mt-1">
            Farmer Action Checklist: {cropName} ({diseaseName})
          </h4>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 block">Progress</span>
            <span className="text-sm font-black text-emerald-400">
              {completedCount} of {defaultTasks.length} Completed ({progressPct}%)
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
            title="Reset Checklist"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Glowing Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 shadow-sm ${
              progressPct === 100
                ? 'bg-gradient-to-r from-emerald-400 to-teal-300 shadow-emerald-500/50'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Congratulatory Achievement Banner at 100% */}
      {progressPct === 100 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 via-teal-950/40 to-slate-900 border border-emerald-400/50 text-emerald-200 text-xs flex items-center justify-between shadow-xl animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-extrabold text-white text-sm">All Field Interventions Implemented!</h5>
              <p className="text-emerald-300/80 text-[11px]">
                Crop protection protocol complete. Foliar spread successfully contained.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-bold text-xs">
            Field Secured
          </span>
        </div>
      )}

      {/* Interactive Task Cards */}
      <div className="space-y-2.5">
        {defaultTasks.map((task) => {
          const isDone = !!completed[task.id];
          return (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3.5 ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-300'
                  : 'bg-slate-950/70 hover:bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
              }`}
            >
              <button
                type="button"
                className={`mt-0.5 p-0.5 rounded transition-colors flex-shrink-0 ${
                  isDone ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5 fill-emerald-400/20" /> : <Square className="w-5 h-5" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                    {task.title}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      task.priority.includes('Urgent')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : task.priority.includes('High')
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <p className={`text-[11px] mt-1 leading-relaxed ${isDone ? 'text-slate-500' : 'text-slate-400'}`}>
                  {task.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
