import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Eye, BarChart3, ShieldCheck, Layers, CheckSquare, Sliders, FileText, Download, ArrowLeft, ShieldAlert, Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import HealthGauge from '../components/HealthGauge';
import XAIExplanationPanel from '../components/XAIExplanationPanel';
import RecommendationList from '../components/RecommendationList';
import WhatIfSimulator from '../components/WhatIfSimulator';
import { apiService } from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function ResultsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('disease');

  // Fallback demo data if navigated directly
  const analysisData = location.state?.analysis || {
    id: "demo-eval-101",
    timestamp: new Date().toISOString(),
    model_type: "production",
    farm_inputs: {
      crop_type: "Potato",
      crop_variety: "Kufri Jyoti",
      growth_stage: "Vegetative",
      temperature: 24.5,
      humidity: 65,
      rainfall: 120,
      soil_ph: 6.5,
      nitrogen: 140,
      phosphorus: 60,
      potassium: 50,
      soil_moisture: 45
    },
    disease_analysis: {
      model_type: "production",
      model_name: "EfficientNet-B0",
      model_version: "1.0.0",
      disease: "Potato Late Blight",
      confidence: 0.94,
      symptoms: ["Irregular water-soaked lesions", "White fungal growth on lower leaf surface", "Dark leaf tip necrosis"],
      alternatives: [
        { label: "Potato Late Blight", probability: 0.94 },
        { label: "Potato Early Blight", probability: 0.04 },
        { label: "Potato Healthy", probability: 0.02 }
      ],
      image_quality: { score: 0.92, status: "Good", resolution: "1920x1080", brightness: "Optimal" },
      gradcam_url: null
    },
    yield_analysis: {
      model_type: "production",
      model_name: "XGBoostRegressor",
      model_version: "1.0.0",
      predicted_yield: 3.85,
      unit: "tons/hectare",
      lower_bound: 3.42,
      upper_bound: 4.28,
      confidence: 0.91,
      feature_importance: [
        { feature: "rainfall", importance: 0.32, direction: "positive" },
        { feature: "nitrogen", importance: 0.28, direction: "positive" },
        { feature: "temperature", importance: 0.22, direction: "negative" },
        { feature: "soil_ph", importance: 0.18, direction: "positive" }
      ]
    },
    risk_analysis: {
      model_type: "production",
      model_name: "XGBoostClassifier",
      model_version: "1.0.0",
      risk_score: 72,
      risk_level: "HIGH",
      components: {
        disease_risk: 85,
        weather_risk: 68,
        soil_risk: 42,
        environmental_stress: 55
      },
      explanation: "High disease probability combined with elevated humidity creates favorable conditions for rapid sporangia dispersal."
    },
    recommendations: [
      {
        priority: "HIGH",
        category: "Pathogen Prevention",
        action: "Inspect foliage for Late Blight lesions and apply protective copper or bio-fungicide.",
        timeframe: "Within 24 to 48 hours",
        reason: "Fungal spores proliferate rapidly in cool, humid micro-climates.",
        safety_note: "Consult certified agricultural extension officers before applying fungicides.",
        knowledge_ref: "FAO Crop Protection Standards - Sec 4.2"
      },
      {
        priority: "MEDIUM",
        category: "Soil Conditioning",
        action: "Apply organic compost to adjust soil pH closer to 6.5.",
        timeframe: "Next irrigation cycle",
        reason: "Slightly acidic soil optimizes phosphorus availability.",
        safety_note: "Test soil moisture prior to amendment application.",
        knowledge_ref: "Soil Science Society Guidelines"
      }
    ],
    crop_health_score: 68
  };

  const { disease_analysis, yield_analysis, risk_analysis, farm_inputs, recommendations, crop_health_score } = analysisData;
  const isProduction = analysisData.model_type === 'production';

  const downloadReport = () => {
    const reportUrl = apiService.getReportUrl(analysisData.id);
    window.open(reportUrl, '_blank');
  };

  // Yield response chart data
  const yieldChartData = [
    { temp: 15, yield: 2.8 },
    { temp: 20, yield: 3.4 },
    { temp: 24, yield: 3.85 },
    { temp: 28, yield: 3.6 },
    { temp: 32, yield: 2.9 },
    { temp: 36, yield: 2.1 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Navigation Top Action */}
      <div className="flex items-center justify-between">
        <Link
          to="/analyze"
          className="flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Run Another Crop Diagnostic</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={downloadReport}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Disease Diagnosis */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Disease Diagnosis</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              isProduction ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
            }`}>
              {isProduction ? 'PyTorch Model' : 'Demo Mode'}
            </span>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white leading-tight">{disease_analysis.disease}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${Math.round(disease_analysis.confidence * 100)}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-emerald-400">{Math.round(disease_analysis.confidence * 100)}%</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">Crop: {farm_inputs.crop_type} ({farm_inputs.crop_variety})</p>
        </div>

        {/* Card 2: Predicted Yield */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Predicted Yield</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">{yield_analysis.predicted_yield}</span>
            <span className="text-xs text-emerald-400 font-semibold">{yield_analysis.unit}</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
            <span>Expected Range:</span>
            <span className="font-bold text-slate-200">{yield_analysis.lower_bound} – {yield_analysis.upper_bound} t/ha</span>
          </div>
        </div>

        {/* Card 3: Risk Score Gauge */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Risk Score</span>
            <div className="text-sm font-extrabold text-amber-400 uppercase">{risk_analysis.risk_level} RISK</div>
            <p className="text-[11px] text-slate-400">Multi-Factor Calibrated</p>
          </div>
          <RiskGauge score={risk_analysis.risk_score} level={risk_analysis.risk_level} />
        </div>

        {/* Card 4: Crop Health Score */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Biophysical Crop Health</span>
          <HealthGauge score={crop_health_score} />
          <p className="text-[11px] text-slate-400">Composite index based on foliage & soil parameters</p>
        </div>
      </div>

      {/* Agronomic Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-3">
        <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-400" />
        <span>
          <strong>Agronomic Support Notice:</strong> Predictions rendered by SmartCrop AI are machine learning decision-support estimates. Always consult qualified local agronomic extension experts prior to field chemical interventions.
        </span>
      </div>

      {/* MULTI-TAB DETAILED SECTION */}
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800">
          {[
            { id: 'disease', label: 'Disease Analysis', icon: Eye },
            { id: 'xai', label: 'Explainable AI (XAI)', icon: Layers },
            { id: 'yield', label: 'Yield Regressor', icon: BarChart3 },
            { id: 'risk', label: 'Risk Breakdown', icon: ShieldCheck },
            { id: 'recommendations', label: 'Action Plan', icon: CheckSquare },
            { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="pt-2">
          {/* TAB 1: Disease Analysis */}
          {activeTab === 'disease' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Diagnosis details */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>Primary Disease Diagnosis</span>
                </h3>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-emerald-400">{disease_analysis.disease}</span>
                    <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      {Math.round(disease_analysis.confidence * 100)}% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">Model: {disease_analysis.model_name} ({disease_analysis.model_version})</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase">Identified Symptoms</h4>
                  <ul className="space-y-1.5">
                    {disease_analysis.symptoms?.map((sym, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: Alternatives Probabilities */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-white">Alternative Diagnosis Probabilities</h3>
                <div className="space-y-4 pt-2">
                  {disease_analysis.alternatives?.map((alt, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-300">{alt.label}</span>
                        <span className="text-emerald-400 font-bold">{Math.round(alt.probability * 100)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full"
                          style={{ width: `${Math.round(alt.probability * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Explainable AI */}
          {activeTab === 'xai' && (
            <XAIExplanationPanel
              originalImage={location.state?.imagePreview}
              gradcamUrl={disease_analysis.gradcam_url}
              featureImportance={yield_analysis.feature_importance}
            />
          )}

          {/* TAB 3: Yield Regressor */}
          {activeTab === 'yield' && (
            <div className="space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white">Agronomic Yield Response Curve</h3>
                  <p className="text-xs text-slate-300">
                    Predicted yield sensitivity for {farm_inputs.crop_type} across temperature variations.
                  </p>
                  <div className="h-60 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={yieldChartData}>
                        <XAxis dataKey="temp" stroke="#64748b" fontSize={11} unit="°C" />
                        <YAxis stroke="#64748b" fontSize={11} unit="t/ha" />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="yield" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-base font-bold text-white">Yield Range Breakdown</h3>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Point Estimate Yield:</span>
                      <span className="font-bold text-emerald-400 text-sm">{yield_analysis.predicted_yield} tons/hectare</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Lower Bound (95% CI):</span>
                      <span className="font-semibold text-slate-200">{yield_analysis.lower_bound} t/ha</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Upper Bound (95% CI):</span>
                      <span className="font-semibold text-slate-200">{yield_analysis.upper_bound} t/ha</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Risk Breakdown */}
          {activeTab === 'risk' && (
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="text-base font-bold text-white">Multi-Factor Risk Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(risk_analysis.components || {}).map(([key, val]) => (
                  <div key={key} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300 uppercase tracking-wider">{key.replace('_', ' ')}</span>
                      <span className="text-amber-400 font-bold">{val} / 100</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-500 h-full rounded-full"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Action Plan */}
          {activeTab === 'recommendations' && (
            <RecommendationList recommendations={recommendations} />
          )}

          {/* TAB 6: What-If Simulator */}
          {activeTab === 'simulator' && (
            <WhatIfSimulator baseAnalysis={analysisData} />
          )}
        </div>
      </div>
    </div>
  );
}
