import React from 'react';
import { Eye, HelpCircle, Layers, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function XAIExplanationPanel({ originalImage, gradcamUrl, featureImportance = [] }) {
  const chartData = featureImportance.map(item => ({
    name: item.feature.replace('_', ' ').toUpperCase(),
    importance: Math.round(item.importance * 100),
    direction: item.direction
  }));

  return (
    <div className="space-y-8">
      {/* Visual Explainability: Grad-CAM */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Grad-CAM Convolutional Visual Explainability</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            Computer Vision XAI
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          The highlighted bright regions indicate the exact spatial leaf features (lesions, discoloration, fungal spots) that most influenced the neural network's disease classification.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Original Leaf */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 block text-center">Original Uploaded Leaf</span>
            <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center">
              {originalImage ? (
                <img src={originalImage} alt="Original Leaf" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-500 text-xs flex flex-col items-center">
                  <Eye className="w-8 h-8 mb-1" />
                  <span>Original Image Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Grad-CAM Overlay */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-400 block text-center flex items-center justify-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grad-CAM Activation Heatmap</span>
            </span>
            <div className="w-full h-56 rounded-xl overflow-hidden border border-emerald-500/40 bg-slate-950 flex items-center justify-center">
              {gradcamUrl ? (
                <img src={gradcamUrl} alt="Grad-CAM Overlay" className="w-full h-full object-cover" />
              ) : (
                <div className="text-emerald-500/60 text-xs flex flex-col items-center">
                  <Layers className="w-8 h-8 mb-1" />
                  <span>Grad-CAM Overlay Heatmap</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabular Explainability: SHAP Feature Importance */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">SHAP / Permutation Feature Importance</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
            Tabular Model XAI
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Relative weight of key agronomic factors driving the XGBoost Yield & Risk predictions.
        </p>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
              <XAxis type="number" unit="%" stroke="#64748b" fontSize={11} />
              <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={100} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                formatter={(value) => [`${value}%`, 'Relative Importance']}
              />
              <Bar dataKey="importance" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.direction === 'positive' ? '#10b981' : '#f97316'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
