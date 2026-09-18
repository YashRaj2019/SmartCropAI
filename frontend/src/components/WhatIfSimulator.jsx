import React, { useState, useEffect, useRef } from 'react';
import { Sliders, RefreshCw, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';

export default function WhatIfSimulator({ baseAnalysis }) {
  const defaultInputs = baseAnalysis?.farm_inputs || {
    temperature: 24.5,
    humidity: 65,
    rainfall: 120,
    soil_ph: 6.5,
    soil_moisture: 45,
    nitrogen: 140,
    phosphorus: 60,
    potassium: 50,
  };

  const [sliders, setSliders] = useState(defaultInputs);
  const [simulationResult, setSimulationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    runSim(sliders);
  }, []);

  const handleSliderChange = (key, val) => {
    const updated = { ...sliders, [key]: parseFloat(val) };
    setSliders(updated);

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      runSim(updated);
    }, 300);
  };

  const runSim = async (currentSliders) => {
    setLoading(true);
    try {
      const res = await apiService.runSimulation(
        baseAnalysis?.farm_inputs || defaultInputs,
        currentSliders
      );
      setSimulationResult(res);
    } catch (e) {
      console.error("Simulation request failed", e);
    } finally {
      setLoading(false);
    }
  };

  const resetSliders = () => {
    setSliders(defaultInputs);
    runSim(defaultInputs);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-emerald-500/30">
        <div>
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Crop What-If Scenario Simulator</h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Adjust environmental and soil sliders to simulate real-time ML yield and risk perturbations.
          </p>
        </div>
        <button
          onClick={resetSliders}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Simulation KPI Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Sim Yield */}
        <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-1 relative overflow-hidden">
          <span className="text-xs text-slate-400 uppercase font-semibold">Simulated Yield</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {simulationResult ? simulationResult.predicted_yield : '--'}
            </span>
            <span className="text-xs text-slate-400">t/ha</span>
          </div>
          {simulationResult && (
            <div className={`text-xs font-semibold flex items-center space-x-1 ${
              simulationResult.yield_delta >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{simulationResult.yield_delta >= 0 ? '+' : ''}{simulationResult.yield_delta} t/ha delta</span>
            </div>
          )}
        </div>

        {/* Sim Risk */}
        <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Simulated Risk</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white">
              {simulationResult ? simulationResult.risk_score : '--'}
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
              {simulationResult ? simulationResult.risk_level : '--'}
            </span>
          </div>
          {simulationResult && (
            <div className={`text-xs font-semibold ${
              simulationResult.risk_delta <= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              <span>{simulationResult.risk_delta <= 0 ? '' : '+'}{simulationResult.risk_delta} risk score delta</span>
            </div>
          )}
        </div>

        {/* Sim Health */}
        <div className="glass-card p-5 rounded-xl border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 uppercase font-semibold">Crop Health Index</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              {simulationResult ? simulationResult.crop_health_score : '--'}
            </span>
            <span className="text-xs text-slate-400">/ 100</span>
          </div>
          <span className="text-xs text-slate-400">Calculated biophysical health</span>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="glass-card p-6 rounded-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Temperature (°C)</span>
            <span className="text-emerald-400 font-bold">{sliders.temperature}°C</span>
          </div>
          <input
            type="range"
            min="10"
            max="45"
            step="0.5"
            value={sliders.temperature}
            onChange={(e) => handleSliderChange('temperature', e.target.value)}
            className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Humidity */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Relative Humidity (%)</span>
            <span className="text-emerald-400 font-bold">{sliders.humidity}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            step="1"
            value={sliders.humidity}
            onChange={(e) => handleSliderChange('humidity', e.target.value)}
            className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Rainfall */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Seasonal Rainfall (mm)</span>
            <span className="text-emerald-400 font-bold">{sliders.rainfall} mm</span>
          </div>
          <input
            type="range"
            min="20"
            max="300"
            step="5"
            value={sliders.rainfall}
            onChange={(e) => handleSliderChange('rainfall', e.target.value)}
            className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Soil pH */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Soil pH</span>
            <span className="text-emerald-400 font-bold">{sliders.soil_ph}</span>
          </div>
          <input
            type="range"
            min="4.5"
            max="9.0"
            step="0.1"
            value={sliders.soil_ph}
            onChange={(e) => handleSliderChange('soil_ph', e.target.value)}
            className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Soil Moisture */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Soil Moisture (%)</span>
            <span className="text-emerald-400 font-bold">{sliders.soil_moisture}%</span>
          </div>
          <input
            type="range"
            min="10"
            max="90"
            step="1"
            value={sliders.soil_moisture}
            onChange={(e) => handleSliderChange('soil_moisture', e.target.value)}
            className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* Nitrogen */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Nitrogen (mg/kg)</span>
            <span className="text-emerald-400 font-bold">{sliders.nitrogen} mg/kg</span>
          </div>
          <input
            type="range"
            min="30"
            max="250"
            step="5"
            value={sliders.nitrogen}
            onChange={(e) => handleSliderChange('nitrogen', e.target.value)}
            className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
