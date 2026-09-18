import React, { useState, useMemo } from 'react';
import { Calculator, Droplets, FlaskConical, Tractor, Clock, ShieldAlert, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function DosageCalculator({ cropName, diseaseName, initialArea = 5 }) {
  const [area, setArea] = useState(initialArea || 5);
  const [unit, setUnit] = useState('ha'); // 'ha' or 'acre'
  const [sprayerType, setSprayerType] = useState('tractor'); // 'tractor', 'knapsack', 'drone'

  // Convert area to hectares for uniform agronomic calculation
  const areaInHa = unit === 'acre' ? area * 0.404686 : area;

  // Prescribed rates based on crop and disease
  const dosageSpecs = useMemo(() => {
    const isLateBlight = (diseaseName || '').toLowerCase().includes('late blight');
    const isEarlyBlight = (diseaseName || '').toLowerCase().includes('early blight');
    const isRust = (diseaseName || '').toLowerCase().includes('rust');
    const isMildew = (diseaseName || '').toLowerCase().includes('mildew');

    if (isLateBlight) {
      return {
        chemical: 'Mancozeb 75% WP + Metalaxyl 8%',
        ratePerHaKg: 2.5,
        waterPerHaL: sprayerType === 'drone' ? 30 : sprayerType === 'knapsack' ? 350 : 450,
        tankCapacityL: sprayerType === 'drone' ? 16 : sprayerType === 'knapsack' ? 16 : 500,
        reiHours: 24,
        phiDays: 7,
        timing: 'Apply every 7-10 days in high humidity conditions.'
      };
    } else if (isEarlyBlight) {
      return {
        chemical: 'Chlorothalonil 720 SC / Azoxystrobin',
        ratePerHaKg: 2.0,
        waterPerHaL: sprayerType === 'drone' ? 25 : sprayerType === 'knapsack' ? 300 : 400,
        tankCapacityL: sprayerType === 'drone' ? 16 : sprayerType === 'knapsack' ? 16 : 500,
        reiHours: 12,
        phiDays: 7,
        timing: 'Apply at first sign of target-spot concentric rings.'
      };
    } else if (isRust) {
      return {
        chemical: 'Propiconazole 25% EC (Tilt)',
        ratePerHaKg: 0.75,
        waterPerHaL: sprayerType === 'drone' ? 25 : sprayerType === 'knapsack' ? 300 : 350,
        tankCapacityL: sprayerType === 'drone' ? 16 : sprayerType === 'knapsack' ? 16 : 500,
        reiHours: 24,
        phiDays: 14,
        timing: 'Spray at flag leaf emergence or initial pustule breakout.'
      };
    } else {
      return {
        chemical: 'Copper Hydroxide 50% WP + Bio-protectant',
        ratePerHaKg: 1.8,
        waterPerHaL: sprayerType === 'drone' ? 25 : sprayerType === 'knapsack' ? 300 : 400,
        tankCapacityL: sprayerType === 'drone' ? 16 : sprayerType === 'knapsack' ? 16 : 500,
        reiHours: 12,
        phiDays: 3,
        timing: 'Apply preventatively during favorable weather conditions.'
      };
    }
  }, [diseaseName, sprayerType]);

  const totalWaterL = Math.round(areaInHa * dosageSpecs.waterPerHaL);
  const totalChemicalKg = (areaInHa * dosageSpecs.ratePerHaKg).toFixed(1);
  const totalTanks = Math.ceil(totalWaterL / dosageSpecs.tankCapacityL);
  const chemicalPerTankG = Math.round((totalChemicalKg * 1000) / (totalTanks || 1));

  // Time estimate: Tractor = 1.5 ha/hr, Drone = 6 ha/hr, Knapsack = 0.25 ha/hr
  const spraySpeedHaPerHr = sprayerType === 'drone' ? 5.5 : sprayerType === 'tractor' ? 1.8 : 0.3;
  const estimatedHours = (areaInHa / spraySpeedHaPerHr).toFixed(1);

  return (
    <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-slate-950 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Interactive Field Treatment Dosage Calculator</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-bold uppercase">
                Dynamic IPM
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Calibrate exact spray volume, tank refills, and active ingredient for {cropName || 'Field'}
            </p>
          </div>
        </div>

        {/* Unit toggle */}
        <div className="inline-flex p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setUnit('ha')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              unit === 'ha' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hectares (ha)
          </button>
          <button
            type="button"
            onClick={() => setUnit('acre')}
            className={`px-3 py-1 rounded-lg transition-colors ${
              unit === 'acre' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Acres
          </button>
        </div>
      </div>

      {/* Control Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Field Area Slider */}
        <div className="space-y-3 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Field Area To Treat:
            </label>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-emerald-400">{area}</span>
              <span className="text-xs font-bold text-slate-400">{unit === 'ha' ? 'ha' : 'acres'}</span>
            </div>
          </div>

          <input
            type="range"
            min="0.5"
            max="30"
            step="0.5"
            value={area}
            onChange={(e) => setArea(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0.5 {unit}</span>
            <span>15 {unit}</span>
            <span>30 {unit}</span>
          </div>
        </div>

        {/* Equipment Selector */}
        <div className="space-y-2 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Select Spraying Equipment:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'tractor', label: 'Tractor Boom', sub: '500L Tank' },
              { id: 'knapsack', label: 'Knapsack', sub: '16L Backpack' },
              { id: 'drone', label: 'Agri Drone', sub: '16L ULV Spray' },
            ].map((eq) => (
              <button
                key={eq.id}
                type="button"
                onClick={() => setSprayerType(eq.id)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  sprayerType === eq.id
                    ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-md shadow-emerald-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold block">{eq.label}</span>
                <span className="text-[10px] text-slate-400 block">{eq.sub}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic Results Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Water Volume */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 relative overflow-hidden group">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Spray Solution</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">
            {totalWaterL.toLocaleString()} <span className="text-xs text-cyan-400 font-semibold">Liters</span>
          </div>
          <p className="text-[10px] text-slate-400">Rate: {dosageSpecs.waterPerHaL} L/ha carrier</p>
        </div>

        {/* Card 2: Active Ingredient */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Active Protectant</span>
            <FlaskConical className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {totalChemicalKg} <span className="text-xs text-emerald-300 font-semibold">kg</span>
          </div>
          <p className="text-[10px] text-slate-400 truncate" title={dosageSpecs.chemical}>
            {dosageSpecs.chemical.split('+')[0]}
          </p>
        </div>

        {/* Card 3: Tank Batches */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Tank Refills</span>
            <Tractor className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {totalTanks} <span className="text-xs text-amber-400 font-semibold">Tanks</span>
          </div>
          <p className="text-[10px] text-slate-400">{chemicalPerTankG}g protectant / tank</p>
        </div>

        {/* Card 4: Estimated Execution Time */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold">Estimated Time</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">
            {estimatedHours} <span className="text-xs text-purple-400 font-semibold">Hours</span>
          </div>
          <p className="text-[10px] text-slate-400">REI: {dosageSpecs.reiHours}h safety interval</p>
        </div>
      </div>

      {/* Safety & Protocol Footer */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong>IPM Protocol:</strong> {dosageSpecs.timing}
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span>Worker Re-Entry: <strong className="text-slate-200">{dosageSpecs.reiHours} Hours</strong></span>
          <span>•</span>
          <span>Pre-Harvest Interval: <strong className="text-slate-200">{dosageSpecs.phiDays} Days</strong></span>
        </div>
      </div>
    </div>
  );
}
