import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sprout, Activity, ShieldCheck, Layers, Sliders, ArrowRight, Cpu, CheckCircle, BarChart3, CloudSun, Eye } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="space-y-24 py-8">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-emerald-500/30 text-xs font-semibold text-emerald-400 shadow-xl"
          >
            <Sprout className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Next-Generation Agricultural Decision Support Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto"
          >
            AI-Powered <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500 bg-clip-text text-transparent">Crop Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Detect crop diseases, predict expected yield, assess multi-factor agricultural risks, and execute explainable AI-guided farming decisions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/analyze"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-2 hover:scale-105 transition-all"
            >
              <span>Analyze My Crop</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/history"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card hover:bg-slate-800/80 text-white font-bold text-base border border-slate-700/80 flex items-center justify-center space-x-2 transition-all"
            >
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              <span>Explore Dashboard</span>
            </Link>
          </motion.div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-12">
            {[
              { label: 'Disease Accuracy', val: '94.0%', detail: 'MobileNetV2 Transfer Learning' },
              { label: 'Yield MAE', val: '0.16 t/ha', detail: 'XGBoost Regressor' },
              { label: 'Risk Latency', val: '< 15 ms', detail: 'Multi-Factor Classifier' },
              { label: 'Explainability', val: 'Grad-CAM', detail: 'Visual Heatmap & SHAP' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-4 rounded-xl border border-slate-800/80 text-center">
                <span className="text-2xl font-extrabold text-emerald-400">{stat.val}</span>
                <p className="text-xs font-bold text-white mt-1">{stat.label}</p>
                <p className="text-[10px] text-slate-400">{stat.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE PLATFORM FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Comprehensive Agronomic Modules</h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            End-to-end decision support combining computer vision, biophysical tabular models, and expert rules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Computer Vision Disease Detection",
              desc: "Classify foliage diseases (Blights, Rusts, Mildews) with instant confidence scoring and image quality checks.",
              icon: Eye,
              badge: "PyTorch Transfer Learning"
            },
            {
              title: "Agronomic Crop Yield Prediction",
              desc: "Predict expected crop yields (t/ha) alongside lower & upper prediction intervals based on soil chemistry & climate.",
              icon: BarChart3,
              badge: "XGBoost Regressor"
            },
            {
              title: "Multi-Factor Risk Assessment",
              desc: "Calculate 0-100 composite risk scores breaking down pathogen, weather, soil, and environmental stress factors.",
              icon: ShieldCheck,
              badge: "Calibrated Classifier"
            },
            {
              title: "Grad-CAM & SHAP Explainability",
              desc: "Understand exactly why predictions were made with visual neural heatmaps and tabular feature weight charts.",
              icon: Layers,
              badge: "Explainable AI (XAI)"
            },
            {
              title: "Smart Actionable Guidance",
              desc: "Receive prioritized, safe recommendations with timeframes, reasons, and safety notes (no toxic dosage claims).",
              icon: CheckCircle,
              badge: "Hybrid Rule Engine"
            },
            {
              title: "What-If Crop Simulator",
              desc: "Perform real-time sensitivity analysis by adjusting temperature, rainfall, humidity, and soil pH sliders.",
              icon: Sliders,
              badge: "Real-time Perturbation"
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 transition-all space-y-4 group">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-700 font-semibold">
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MACHINE LEARNING PIPELINE ARCHITECTURE SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-emerald-500/30 space-y-8 bg-gradient-to-b from-slate-900/80 to-slate-950">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Technical Foundation</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Machine Learning Pipeline Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mx-auto">1</span>
              <h4 className="text-sm font-bold text-white">Leaf Image Preprocessing</h4>
              <p className="text-xs text-slate-400">Laplacian variance blur check, RGB decoding, resolution score, 224x224 normalization.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mx-auto">2</span>
              <h4 className="text-sm font-bold text-white">Deep CNN Disease Model</h4>
              <p className="text-xs text-slate-400">PyTorch MobileNetV2 / EfficientNet transfer learning backbone + temperature scaling.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mx-auto">3</span>
              <h4 className="text-sm font-bold text-white">XGBoost Yield & Risk</h4>
              <p className="text-xs text-slate-400">Scikit-learn pipeline with SimpleImputer, OneHotEncoder, StandardScaler, & quantile bounds.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-center">
              <span className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mx-auto">4</span>
              <h4 className="text-sm font-bold text-white">XAI & Action Generator</h4>
              <p className="text-xs text-slate-400">Grad-CAM visual heatmap overlay generation + SHAP feature importance & safety rules.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
