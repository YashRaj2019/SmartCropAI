import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, CheckCircle2, Loader2, Sparkles, ShieldCheck, AlertTriangle } from 'lucide-react';

const STEPS = [
  "Validating leaf image quality & resolution",
  "Preprocessing RGB channels & normalizations",
  "Running PyTorch disease classification pipeline",
  "Generating Grad-CAM explainable visual heatmaps",
  "Preparing tabular soil & environmental feature vectors",
  "Running XGBoost crop yield regression model",
  "Evaluating multi-factor crop risk classifier",
  "Calibrating pathogen, weather & soil risk scores",
  "Synthesizing safe actionable farming recommendations",
  "Finalizing analysis report & persisting records"
];

export default function ProcessingModal({ isOpen, isProduction = true }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const progressPercent = Math.min(100, Math.round(((currentStepIndex + 1) / STEPS.length) * 100));

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-lg p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="glass-card max-w-lg w-full rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle animated background glow */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>

          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <Cpu className="w-6 h-6 text-emerald-400 animate-spin" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>ML Inference Engine</span>
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </h3>
                <p className="text-xs text-slate-400">Processing multi-modal agricultural telemetry</p>
              </div>
            </div>

            <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
              isProduction ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40' : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
            }`}>
              {isProduction ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
              <span>{isProduction ? 'Production Model' : 'Demo Mode'}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Execution Sequence</span>
              <span className="text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {STEPS.map((step, idx) => {
              const isCompleted = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 p-2.5 rounded-xl text-xs transition-all ${
                    isCurrent
                      ? 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-200 shadow-md shadow-emerald-950/50'
                      : isCompleted
                      ? 'text-slate-400 opacity-80'
                      : 'text-slate-600'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </div>
                  )}
                  <span className={isCurrent ? "font-semibold" : ""}>{step}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
