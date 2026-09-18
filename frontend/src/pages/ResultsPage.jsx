import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Eye, BarChart3, ShieldCheck, Layers, CheckSquare, Sliders, FileText,
  Download, ArrowLeft, ShieldAlert, Sparkles, Activity, CheckCircle2,
  Sprout, AlertTriangle, Shield, Zap, Leaf
} from 'lucide-react';
import RiskGauge from '../components/RiskGauge';
import HealthGauge from '../components/HealthGauge';
import XAIExplanationPanel from '../components/XAIExplanationPanel';
import RecommendationList from '../components/RecommendationList';
import WhatIfSimulator from '../components/WhatIfSimulator';
import LeafInspectorLoupe from '../components/LeafInspectorLoupe';
import DosageCalculator from '../components/DosageCalculator';
import VitalityRadar from '../components/VitalityRadar';
import AudioPrescriptionReader from '../components/AudioPrescriptionReader';
import ActionChecklist from '../components/ActionChecklist';
import { apiService } from '../services/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default function ResultsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('disease');

  // Load from location.state or fallback to localStorage
  const [analysisData, setAnalysisData] = useState(() => {
    if (location.state?.analysis) {
      try {
        localStorage.setItem('smartcrop_latest_analysis', JSON.stringify(location.state.analysis));
      } catch {}
      return location.state.analysis;
    }
    try {
      const saved = localStorage.getItem('smartcrop_latest_analysis');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  if (!analysisData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <Activity className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-white">No Active Crop Diagnostics Found</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You haven't executed a crop evaluation yet. Head to the Diagnostic Center to upload a leaf photo or paste an image link to generate real-time AI predictions.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Crop Diagnostic Center</span>
          </Link>
        </div>
      </div>
    );
  }

  const { disease_analysis, yield_analysis, risk_analysis, farm_inputs, recommendations, crop_health_score } = analysisData;
  const isProduction = analysisData.model_type === 'production';
  const displayImage = location.state?.imagePreview || apiService.getImageUrl(analysisData.image_url) || localStorage.getItem('smartcrop_saved_image');

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

        <div className="flex flex-wrap items-center gap-3">
          <AudioPrescriptionReader
            cropName={disease_analysis.detected_crop || farm_inputs?.crop_type}
            diseaseName={disease_analysis.disease}
            status={disease_analysis.status}
            confidence={disease_analysis.confidence}
            solution={disease_analysis.solution}
          />
          <button
            onClick={downloadReport}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
        </div>
      </div>

      {/* 3-STEP DIAGNOSTIC PIPELINE (Crop -> Disease -> Solution) */}
      <div className="glass-card p-5 sm:p-6 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-900/60 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Foliar Computer Vision & Agronomic Diagnostic Pipeline</span>
          </span>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase bg-slate-800 text-slate-300 border border-slate-700">
            Precision Agronomy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Step 1: Crop */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Step 1 • Crop Detected</span>
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[11px] flex items-center justify-center">1</span>
            </div>
            <div className="text-xl font-extrabold text-white flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <span>{disease_analysis.detected_crop || farm_inputs?.crop_type || 'Crop'}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Variety: <strong className="text-slate-200">{farm_inputs?.crop_variety || 'Hybrid / Standard'}</strong>
            </p>
          </div>

          {/* Step 2: Disease */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Step 2 • Disease / Status</span>
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-black text-[11px] flex items-center justify-center">2</span>
            </div>
            <div className="text-xl font-extrabold text-white truncate" title={disease_analysis.disease}>
              {disease_analysis.disease}
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                disease_analysis.status === 'Healthy'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-950 text-rose-300 border border-rose-500/30'
              }`}>
                {disease_analysis.status}
              </span>
              <span className="text-[11px] font-bold text-emerald-400">
                {Math.round(disease_analysis.confidence * 100)}% Confidence
              </span>
            </div>
          </div>

          {/* Step 3: Solution */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Step 3 • Prescribed Solution</span>
                <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 font-black text-[11px] flex items-center justify-center">3</span>
              </div>
              <p className="text-xs text-slate-200 font-medium line-clamp-2 mt-1">
                {disease_analysis.solution?.immediate_action || (disease_analysis.status === 'Healthy' ? 'No disease pathogens detected. Maintain routine field management.' : 'Execute targeted crop protection intervention.')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('disease')}
              className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Explore Treatment Plan</span>
              <span>↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* EXECUTIVE SUMMARY HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Disease Diagnosis */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 space-y-3 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Crop & Diagnosis</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
              isProduction ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' : 'bg-amber-950 text-amber-300 border border-amber-500/30'
            }`}>
              {isProduction ? 'PyTorch Model' : 'Demo Mode'}
            </span>
          </div>

          <div>
            <div className="text-xs font-extrabold text-emerald-400 uppercase mb-0.5">
              {disease_analysis.detected_crop || farm_inputs?.crop_type || 'Crop'}
            </div>
            <h3 className="text-lg font-extrabold text-white leading-tight">{disease_analysis.disease}</h3>
            <div className="flex items-center space-x-2 mt-1.5">
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full"
                  style={{ width: `${Math.round(disease_analysis.confidence * 100)}%` }}
                />
              </div>
              <span className="text-xs font-extrabold text-emerald-400">{Math.round(disease_analysis.confidence * 100)}%</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Status:</span>
            <span className={`font-bold ${disease_analysis.status === 'Healthy' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {disease_analysis.status}
            </span>
          </p>
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
            <div className="space-y-8">
              {/* Feature 1: Interactive Foliar Loupe & Micro-Inspector */}
              <LeafInspectorLoupe
                imageUrl={displayImage}
                diseaseName={disease_analysis.disease}
                cropName={disease_analysis.detected_crop || farm_inputs?.crop_type}
                foliageMetrics={disease_analysis.foliage_metrics}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Diagnosis details */}
                <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Primary Disease Diagnosis</span>
                    </h3>
                    <span className="text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      Step 1 & 2 Identified
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {displayImage && (
                        <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
                          <img src={displayImage} alt="Diagnosed leaf" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            {disease_analysis.detected_crop || farm_inputs?.crop_type || 'Crop'}
                          </span>
                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded ${
                            disease_analysis.status === 'Healthy' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                          }`}>
                            {disease_analysis.status}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-white leading-snug">{disease_analysis.disease}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-emerald-400 h-full rounded-full"
                              style={{ width: `${Math.round(disease_analysis.confidence * 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-emerald-400">{Math.round(disease_analysis.confidence * 100)}%</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Model: {disease_analysis.model_name}</p>
                      </div>
                    </div>
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

              {/* Feature 2: 6-Axis Biophysical Crop Vitality Radar */}
              <VitalityRadar
                healthScore={crop_health_score}
                riskScore={risk_analysis.risk_score}
                foliageMetrics={disease_analysis.foliage_metrics}
                farmInputs={farm_inputs}
              />

              {/* STEP 3: DEDICATED SOLUTION & TREATMENT SECTION */}
              <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        Step 3 • Agronomic Treatment
                      </span>
                      <span className="text-xs text-slate-400">Integrated Pest Management (IPM)</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-white mt-1">
                      Prescribed Solutions for {disease_analysis.detected_crop || 'Crop'} ({disease_analysis.disease})
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <AudioPrescriptionReader
                      cropName={disease_analysis.detected_crop || farm_inputs?.crop_type}
                      diseaseName={disease_analysis.disease}
                      status={disease_analysis.status}
                      confidence={disease_analysis.confidence}
                      solution={disease_analysis.solution}
                    />
                    <button
                      onClick={() => setActiveTab('recommendations')}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer ml-2"
                    >
                      <span>Action Plan</span>
                      <span>➔</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1: Immediate Action */}
                  <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-rose-300 flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-rose-400" />
                          <span>Immediate Action</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-200">
                          Within 24h
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {disease_analysis.solution?.immediate_action || 'Inspect nearby crop foliage and isolate affected plant zones.'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 block pt-1">Priority: Critical</span>
                  </div>

                  {/* Card 2: Organic / Bio-Control Remedy */}
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-300 flex items-center gap-1.5">
                          <Leaf className="w-4 h-4 text-emerald-400" />
                          <span>Organic Remedy</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                          Biological
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {disease_analysis.solution?.organic || 'Apply neem extract or beneficial microbial bio-fungicide.'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 block pt-1">Eco-Friendly IPM</span>
                  </div>

                  {/* Card 3: Chemical Treatment */}
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                          <Shield className="w-4 h-4 text-amber-400" />
                          <span>Chemical Control</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                          Targeted
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {disease_analysis.solution?.chemical || 'Consult local extension guidelines before synthetic fungicide spray.'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 block pt-1">Adhere to PHI Intervals</span>
                  </div>

                  {/* Card 4: Cultural Practices */}
                  <div className="p-4 rounded-xl bg-teal-950/20 border border-teal-500/30 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-teal-300 flex items-center gap-1.5">
                          <Sprout className="w-4 h-4 text-teal-400" />
                          <span>Cultural Management</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-200">
                          Preventive
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 font-medium leading-relaxed">
                        {disease_analysis.solution?.cultural || 'Maintain crop spacing, avoid overhead watering, and destroy residues.'}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 block pt-1">Sanitation & Rotation</span>
                  </div>
                </div>
              </div>

              {/* Feature 3: Interactive Field Treatment Dosage Calculator */}
              <DosageCalculator
                cropName={disease_analysis.detected_crop || farm_inputs?.crop_type}
                diseaseName={disease_analysis.disease}
                initialArea={farm_inputs?.field_size || 5}
              />

              {/* Feature 4: Interactive Farmer Action Checklist */}
              <ActionChecklist
                analysisId={analysisData.id}
                cropName={disease_analysis.detected_crop || farm_inputs?.crop_type}
                diseaseName={disease_analysis.disease}
                solution={disease_analysis.solution}
              />
            </div>
          )}

          {/* TAB 2: Explainable AI */}
          {activeTab === 'xai' && (
            <XAIExplanationPanel
              originalImage={displayImage}
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
            <div className="space-y-8">
              <ActionChecklist
                analysisId={analysisData.id}
                cropName={disease_analysis.detected_crop || farm_inputs?.crop_type}
                diseaseName={disease_analysis.disease}
                solution={disease_analysis.solution}
              />
              <RecommendationList recommendations={recommendations} />
            </div>
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
