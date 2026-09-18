import React, { useState, useEffect } from 'react';
import { GitCompare, ArrowRightLeft, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export default function ComparePage() {
  const [history, setHistory] = useState([]);
  const [selectedId1, setSelectedId1] = useState('');
  const [selectedId2, setSelectedId2] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const records = await apiService.getHistory();
      setHistory(records);
      if (records.length >= 1) setSelectedId1(records[0].id || records[0]._id);
      if (records.length >= 2) setSelectedId2(records[1].id || records[1]._id);
    } catch (e) {
      console.error("Failed to load history for comparison", e);
    }
  };

  const rec1 = history.find(r => (r.id || r._id) === selectedId1) || history[0];
  const rec2 = history.find(r => (r.id || r._id) === selectedId2) || history[1] || history[0];

  const compareChartData = [
    {
      metric: 'Predicted Yield (t/ha)',
      Analysis_1: rec1?.yield_analysis?.predicted_yield || 3.8,
      Analysis_2: rec2?.yield_analysis?.predicted_yield || 3.2
    },
    {
      metric: 'Risk Score (0-100)',
      Analysis_1: rec1?.risk_analysis?.risk_score || 72,
      Analysis_2: rec2?.risk_analysis?.risk_score || 45
    },
    {
      metric: 'Crop Health Index',
      Analysis_1: rec1?.crop_health_score || 68,
      Analysis_2: rec2?.crop_health_score || 82
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <GitCompare className="w-7 h-7 text-emerald-400" />
          <span>Side-by-Side Crop Diagnostics Comparison</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Compare multi-temporal field telemetry, yield variances, disease diagnoses, and risk scores.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 glass-card p-6 rounded-2xl border border-slate-800">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2 uppercase">Select Baseline Evaluation (#1)</label>
          <select
            value={selectedId1}
            onChange={(e) => setSelectedId1(e.target.value)}
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-semibold"
          >
            {history.map((r) => (
              <option key={r.id || r._id} value={r.id || r._id}>
                {new Date(r.timestamp || Date.now()).toLocaleDateString()} — {r.farm_inputs?.crop_type} ({r.disease_analysis?.disease})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2 uppercase">Select Target Evaluation (#2)</label>
          <select
            value={selectedId2}
            onChange={(e) => setSelectedId2(e.target.value)}
            className="w-full glass-input rounded-xl px-3.5 py-2.5 text-xs font-semibold"
          >
            {history.map((r) => (
              <option key={r.id || r._id} value={r.id || r._id}>
                {new Date(r.timestamp || Date.now()).toLocaleDateString()} — {r.farm_inputs?.crop_type} ({r.disease_analysis?.disease})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Comparison Chart */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-white">Comparative Performance Metrics</h3>
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={compareChartData}>
              <XAxis dataKey="metric" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Analysis_1" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Analysis_2" fill="#14b8a6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
