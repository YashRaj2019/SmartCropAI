import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';
import { Activity, ShieldCheck, Sparkles } from 'lucide-react';

export default function VitalityRadar({ healthScore = 65, riskScore = 40, foliageMetrics, farmInputs }) {
  // Compute calibrated 6-axis crop vitality scores (0-100)
  const pathogenImmunity = Math.max(15, Math.min(95, Math.round(100 - (riskScore || 40))));
  const chlorophyll = Math.max(20, Math.min(98, Math.round((foliageMetrics?.green_pct || 55) * 1.3)));
  const moistureResilience = Math.max(30, Math.min(90, Math.round(100 - Math.abs((farmInputs?.soil_moisture || 60) - 65))));
  const nutrientAssimilation = Math.max(35, Math.min(95, Math.round((healthScore || 65) * 1.05)));
  const canopyAirflow = Math.max(25, Math.min(90, Math.round(85 - (foliageMetrics?.brown_pct || 20) * 1.2)));
  const soilVitality = Math.max(30, Math.min(92, Math.round(88 - Math.abs((farmInputs?.soil_ph || 6.5) - 6.5) * 15)));

  const radarData = [
    { subject: 'Pathogen Immunity', value: pathogenImmunity, optimal: 90 },
    { subject: 'Chlorophyll Vigor', value: chlorophyll, optimal: 85 },
    { subject: 'Moisture Resilience', value: moistureResilience, optimal: 80 },
    { subject: 'Nutrient Assimilation', value: nutrientAssimilation, optimal: 85 },
    { subject: 'Canopy Airflow', value: canopyAirflow, optimal: 75 },
    { subject: 'Soil Microbiome', value: soilVitality, optimal: 80 },
  ];

  const overallComposite = Math.round(
    (pathogenImmunity + chlorophyll + moistureResilience + nutrientAssimilation + canopyAirflow + soilVitality) / 6
  );

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
              6-Axis Foliar Biophysics
            </span>
            <span className="text-xs text-slate-400">Multi-Dimensional Diagnostic</span>
          </div>
          <h4 className="text-base font-extrabold text-white mt-1">Biophysical Crop Vitality Radar</h4>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-400">Vitality Index:</span>
          <span className="text-sm font-black text-emerald-400 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
            {overallComposite} / 100
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Radar Visualizer */}
        <div className="lg:col-span-8 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#334155" strokeDasharray="3 3" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10, fill: '#cbd5e1' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={{ fontSize: 9 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#10b981',
                  borderRadius: '10px',
                  fontSize: '11px',
                  color: '#fff',
                }}
              />
              <Radar
                name="Optimal Benchmark"
                dataKey="optimal"
                stroke="#64748b"
                fill="#64748b"
                fillOpacity={0.15}
                strokeDasharray="4 4"
              />
              <Radar
                name="Current Crop Foliage"
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.35}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown Metric Chips */}
        <div className="lg:col-span-4 space-y-2">
          {radarData.map((item, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs"
            >
              <span className="text-slate-300 text-[11px] font-medium">{item.subject}</span>
              <div className="flex items-center gap-2">
                <div className="w-14 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.value >= 70 ? 'bg-emerald-400' : item.value >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className="font-bold text-white text-[11px] w-6 text-right">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
