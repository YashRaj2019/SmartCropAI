import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { History, Search, Trash2, ExternalLink, Calendar, Sprout, BarChart2, TrendingUp, AlertTriangle } from 'lucide-react';
import { apiService } from '../services/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [historyRecords, setHistoryRecords] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await apiService.getHistory();
      setHistoryRecords(data);
    } catch (e) {
      console.error("Failed to load history", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this historical analysis record?")) return;
    try {
      await apiService.deleteHistory(id);
      setHistoryRecords(prev => prev.filter(r => r.id !== id && r._id !== id));
    } catch (e) {
      alert("Failed to delete record.");
    }
  };

  const handleSelectRecord = (record) => {
    navigate('/results', { state: { analysis: record } });
  };

  const filtered = historyRecords.filter(r => {
    const crop = r.farm_inputs?.crop_type || '';
    const disease = r.disease_analysis?.disease || '';
    const q = searchQuery.toLowerCase();
    return crop.toLowerCase().includes(q) || disease.toLowerCase().includes(q);
  });

  const chartData = historyRecords.slice().reverse().map((r, idx) => ({
    name: `Eval #${idx + 1}`,
    yield: r.yield_analysis?.predicted_yield || 0,
    risk: r.risk_analysis?.risk_score || 0
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <History className="w-7 h-7 text-emerald-400" />
            <span>Farm Evaluation History & Telemetry</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Persisted crop health diagnostic records and multi-temporal yield trends.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop or disease..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input rounded-xl pl-9 pr-4 py-2 text-xs"
          />
        </div>
      </div>

      {/* Historical Trend Charts */}
      {historyRecords.length > 1 && (
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Multi-Temporal Crop Performance Trends</span>
          </h3>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                <Line type="monotone" dataKey="yield" name="Yield (t/ha)" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="risk" name="Risk Score (0-100)" stroke="#f43f5e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs space-y-2">
            <Sprout className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No historical analysis records found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[10px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Crop Type</th>
                  <th className="p-4">Disease Diagnosis</th>
                  <th className="p-4">Yield (t/ha)</th>
                  <th className="p-4">Risk Score</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((record) => {
                  const recId = record.id || record._id;
                  const dateStr = record.timestamp ? new Date(record.timestamp).toLocaleDateString() : 'N/A';
                  const crop = record.farm_inputs?.crop_type || 'Potato';
                  const disease = record.disease_analysis?.disease || 'N/A';
                  const yieldVal = record.yield_analysis?.predicted_yield || 'N/A';
                  const riskVal = record.risk_analysis?.risk_score || 0;
                  const riskLvl = record.risk_analysis?.risk_level || 'MED';

                  return (
                    <tr
                      key={recId}
                      onClick={() => handleSelectRecord(record)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-mono text-slate-400">{dateStr}</td>
                      <td className="p-4 font-bold text-white">{crop}</td>
                      <td className="p-4 text-emerald-400 font-semibold">{disease}</td>
                      <td className="p-4 font-extrabold text-white">{yieldVal}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                          riskVal > 60 ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
                        }`}>
                          {riskVal} ({riskLvl})
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={(e) => handleDelete(recId, e)}
                            className="p-1.5 rounded bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition-colors"
                            title="Delete analysis"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
