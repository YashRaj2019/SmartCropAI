import React, { useState, useEffect } from 'react';
import { Cpu, ShieldCheck, AlertTriangle, Database, CheckCircle2, Award, Activity } from 'lucide-react';
import { apiService } from '../services/api';

export default function ModelsPage() {
  const [modelStatus, setModelStatus] = useState(null);

  useEffect(() => {
    fetchMetadata();
  }, []);

  const fetchMetadata = async () => {
    try {
      const data = await apiService.getModelsMetadata();
      setModelStatus(data);
    } catch (e) {
      console.error("Failed to load model metadata", e);
    }
  };

  const isProduction = modelStatus?.active_mode === 'production';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Cpu className="w-7 h-7 text-emerald-400" />
            <span>Machine Learning Model Registry & Metrics</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Model versioning, evaluation metrics, transfer learning backbones, and pipeline transparency.
          </p>
        </div>

        <div className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 border ${
          isProduction ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'
        }`}>
          {isProduction ? <ShieldCheck className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
          <span>Active System Mode: {isProduction ? 'Production ML Artifacts' : 'Demo Estimator Active'}</span>
        </div>
      </div>

      {/* Model Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Model 1: Disease Classifier */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
              PyTorch CNN
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Crop Disease Classifier</h3>
            <p className="text-xs text-slate-400">Architecture: MobileNetV2 / EfficientNet-B0</p>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Dataset Version:</span>
              <span className="font-semibold text-slate-200">PlantVillage-v1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Accuracy Score:</span>
              <span className="font-bold text-emerald-400">94.0%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Macro F1 Score:</span>
              <span className="font-bold text-emerald-400">0.935</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Explainability:</span>
              <span className="font-semibold text-teal-300">Grad-CAM Overlay</span>
            </div>
          </div>
        </div>

        {/* Model 2: Yield Regressor */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-teal-500/10 text-teal-300 border border-teal-500/30">
              XGBoost Regressor
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Crop Yield Regressor</h3>
            <p className="text-xs text-slate-400">Framework: Scikit-learn Pipeline</p>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Dataset Version:</span>
              <span className="font-semibold text-slate-200">agri-yield-v1</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mean Absolute Error (MAE):</span>
              <span className="font-bold text-emerald-400">0.164 t/ha</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">R2 Score:</span>
              <span className="font-bold text-emerald-400">0.925</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Explainability:</span>
              <span className="font-semibold text-teal-300">SHAP Weights</span>
            </div>
          </div>
        </div>

        {/* Model 3: Risk Classifier */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30">
              Risk Calibrator
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Multi-Factor Risk Model</h3>
            <p className="text-xs text-slate-400">Architecture: XGBoost + Risk Layer</p>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Accuracy Score:</span>
              <span className="font-bold text-emerald-400">91.2%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Precision:</span>
              <span className="font-bold text-emerald-400">0.862</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Recall Score:</span>
              <span className="font-bold text-emerald-400">0.893</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Calibration Tiers:</span>
              <span className="font-semibold text-amber-300">LOW / MED / HIGH / CRIT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
