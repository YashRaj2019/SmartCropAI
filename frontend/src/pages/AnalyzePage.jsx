import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Sliders, Play, RotateCcw, AlertTriangle, ShieldCheck, Thermometer, Droplets, Wind, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import ProcessingModal from '../components/ProcessingModal';
import { apiService } from '../services/api';

const DEFAULT_FORM = {
  crop_type: 'Potato',
  crop_variety: 'Kufri Jyoti',
  growth_stage: 'Vegetative',
  sowing_date: '2025-02-15',
  location: 'Central Valley',
  season: 'Monsoon',
  
  soil_type: 'Loam',
  soil_ph: 6.5,
  nitrogen: 140,
  phosphorus: 60,
  potassium: 50,
  soil_moisture: 45,

  temperature: 24.5,
  humidity: 65,
  rainfall: 120,
  wind_speed: 12,
  irrigation_type: 'Drip'
};

export default function AnalyzePage() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(() => {
    try {
      return localStorage.getItem('smartcrop_saved_image') || null;
    } catch {
      return null;
    }
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasSavedAnalysis, setHasSavedAnalysis] = useState(() => {
    try {
      return Boolean(localStorage.getItem('smartcrop_latest_analysis'));
    } catch {
      return false;
    }
  });

  // Form State initialized from localStorage if available
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('smartcrop_form_data');
      return saved ? JSON.parse(saved) : DEFAULT_FORM;
    } catch {
      return DEFAULT_FORM;
    }
  });

  // Save changes to localStorage so switching pages never loses user input
  useEffect(() => {
    try {
      localStorage.setItem('smartcrop_form_data', JSON.stringify(formData));
    } catch {}
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' || type === 'range' ? parseFloat(value) : value
    }));
  };

  const handleImageSelect = (fileOrUrl) => {
    setSelectedImage(fileOrUrl);
    try {
      if (typeof fileOrUrl === 'string') {
        localStorage.setItem('smartcrop_saved_image', fileOrUrl);
      }
    } catch {}
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    try {
      localStorage.removeItem('smartcrop_saved_image');
    } catch {}
  };

  const resetToDefaults = () => {
    setFormData(DEFAULT_FORM);
    try {
      localStorage.setItem('smartcrop_form_data', JSON.stringify(DEFAULT_FORM));
    } catch {}
  };

  // Scenario Presets
  const loadPreset = (presetName) => {
    if (presetName === 'potato_blight') {
      setFormData({
        crop_type: 'Potato',
        crop_variety: 'Kufri Jyoti',
        growth_stage: 'Fruiting',
        sowing_date: '2025-01-10',
        location: 'North Region',
        season: 'Rabi',
        soil_type: 'Loam',
        soil_ph: 5.8,
        nitrogen: 110,
        phosphorus: 45,
        potassium: 40,
        soil_moisture: 75,
        temperature: 21.0,
        humidity: 88,
        rainfall: 180,
        wind_speed: 14,
        irrigation_type: 'Flood'
      });
    } else if (presetName === 'tomato_heat') {
      setFormData({
        crop_type: 'Tomato',
        crop_variety: 'Roma',
        growth_stage: 'Flowering',
        sowing_date: '2025-03-01',
        location: 'South Plains',
        season: 'Zaid',
        soil_type: 'Sandy',
        soil_ph: 7.4,
        nitrogen: 90,
        phosphorus: 35,
        potassium: 30,
        soil_moisture: 28,
        temperature: 34.5,
        humidity: 42,
        rainfall: 45,
        wind_speed: 22,
        irrigation_type: 'Sprinkler'
      });
    } else if (presetName === 'corn_high_yield') {
      setFormData({
        crop_type: 'Corn',
        crop_variety: 'Hybrid-X',
        growth_stage: 'Vegetative',
        sowing_date: '2025-02-01',
        location: 'Central Valley',
        season: 'Kharif',
        soil_type: 'Silt',
        soil_ph: 6.8,
        nitrogen: 180,
        phosphorus: 85,
        potassium: 75,
        soil_moisture: 55,
        temperature: 25.0,
        humidity: 60,
        rainfall: 140,
        wind_speed: 10,
        irrigation_type: 'Drip'
      });
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      // Call Composite Full Analysis API
      const result = await apiService.analyzeCrop(selectedImage, formData);
      
      // Persist analysis immediately into localStorage
      try {
        localStorage.setItem('smartcrop_latest_analysis', JSON.stringify(result));
        setHasSavedAnalysis(true);
      } catch {}

      // Smooth progress animation completion
      setTimeout(() => {
        setIsProcessing(false);
        navigate('/results', { state: { analysis: result, imagePreview: selectedImage } });
      }, 1200);
    } catch (err) {
      console.error("Analysis API failed:", err);
      setIsProcessing(false);
      const msg = err.response?.data?.detail?.message || err.response?.data?.error?.message || err.message || "Failed to complete crop analysis.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Active Analysis Shortcut Banner */}
      {hasSavedAnalysis && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs text-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>You have an active crop analysis report ready to view.</span>
          </div>
          <Link
            to="/results"
            className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 transition-colors whitespace-nowrap"
          >
            <span>View Results</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="space-y-2 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <span>Crop Analysis & Diagnostic Center</span>
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </h1>
          <button
            type="button"
            onClick={resetToDefaults}
            className="self-end sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs transition-colors cursor-pointer"
            title="Reset form values to default baseline"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-300">
          Upload a crop leaf photograph and adjust environmental metrics for full-stack deep learning disease diagnosis, XGBoost yield regression, and risk assessment.
        </p>
      </div>

      {/* Preset Quick Load Bar */}
      <div className="glass-card p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-semibold text-slate-300">Quick Scenario Presets:</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => loadPreset('potato_blight')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-emerald-400 border border-slate-700 transition-colors cursor-pointer"
          >
            Potato Late Blight Risk
          </button>
          <button
            type="button"
            onClick={() => loadPreset('tomato_heat')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-amber-400 border border-slate-700 transition-colors cursor-pointer"
          >
            Tomato Heat & Drought
          </button>
          <button
            type="button"
            onClick={() => loadPreset('corn_high_yield')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-teal-400 border border-slate-700 transition-colors cursor-pointer"
          >
            Optimal High Yield Corn
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Analysis Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Image Upload */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800/80 space-y-4">
          <ImageUploader
            selectedImage={selectedImage}
            onImageSelect={handleImageSelect}
            onClearImage={handleClearImage}
          />

          {/* Quick Action Bar under Image */}
          {selectedImage && (
            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-emerald-950/20 p-4 rounded-xl border border-emerald-500/20">
              <div className="text-left">
                <p className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Leaf Image Ready for Inference</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Click to run immediate diagnosis with current farm telemetry, or customize metrics below.
                </p>
              </div>
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleSubmit()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Diagnostics Now</span>
              </button>
            </div>
          )}
        </div>

        {/* Section 2: Farm & Crop Metadata */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800/80 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <span>1. Crop & Agronomic Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Crop Type</label>
              <select
                name="crop_type"
                value={formData.crop_type}
                onChange={handleInputChange}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              >
                <option value="Potato">Potato</option>
                <option value="Tomato">Tomato</option>
                <option value="Corn">Corn (Maize)</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Crop Variety</label>
              <input
                type="text"
                name="crop_variety"
                value={formData.crop_variety}
                onChange={handleInputChange}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Growth Stage</label>
              <select
                name="growth_stage"
                value={formData.growth_stage}
                onChange={handleInputChange}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              >
                <option value="Vegetative">Vegetative Stage</option>
                <option value="Flowering">Flowering Stage</option>
                <option value="Fruiting">Fruiting / Tuberization</option>
                <option value="Maturation">Maturation Stage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location Region</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cropping Season</label>
              <select
                name="season"
                value={formData.season}
                onChange={handleInputChange}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              >
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Irrigation Method</label>
              <select
                name="irrigation_type"
                value={formData.irrigation_type}
                onChange={handleInputChange}
                className="w-full glass-input rounded-xl px-3.5 py-2.5 text-sm"
              >
                <option value="Drip">Drip Irrigation</option>
                <option value="Sprinkler">Sprinkler Irrigation</option>
                <option value="Flood">Flood / Furrow</option>
                <option value="Rainfed">Rainfed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Soil & Environmental Data Sliders */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800/80 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-teal-400" />
            <span>2. Soil Chemistry & Environmental Telemetry</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Soil pH */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Soil pH Level</span>
                <span className="text-emerald-400 font-bold">{formData.soil_ph}</span>
              </div>
              <input
                type="range"
                name="soil_ph"
                min="4.5"
                max="9.0"
                step="0.1"
                value={formData.soil_ph}
                onChange={handleInputChange}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Soil Moisture */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Soil Moisture (%)</span>
                <span className="text-emerald-400 font-bold">{formData.soil_moisture}%</span>
              </div>
              <input
                type="range"
                name="soil_moisture"
                min="10"
                max="90"
                step="1"
                value={formData.soil_moisture}
                onChange={handleInputChange}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Nitrogen */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Nitrogen N (mg/kg)</span>
                <span className="text-emerald-400 font-bold">{formData.nitrogen} mg/kg</span>
              </div>
              <input
                type="range"
                name="nitrogen"
                min="30"
                max="250"
                step="5"
                value={formData.nitrogen}
                onChange={handleInputChange}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Phosphorus */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Phosphorus P (mg/kg)</span>
                <span className="text-emerald-400 font-bold">{formData.phosphorus} mg/kg</span>
              </div>
              <input
                type="range"
                name="phosphorus"
                min="15"
                max="120"
                step="5"
                value={formData.phosphorus}
                onChange={handleInputChange}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Air Temperature (°C)</span>
                <span className="text-emerald-400 font-bold">{formData.temperature}°C</span>
              </div>
              <input
                type="range"
                name="temperature"
                min="10"
                max="45"
                step="0.5"
                value={formData.temperature}
                onChange={handleInputChange}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Relative Humidity */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Relative Humidity (%)</span>
                <span className="text-emerald-400 font-bold">{formData.humidity}%</span>
              </div>
              <input
                type="range"
                name="humidity"
                min="20"
                max="100"
                step="1"
                value={formData.humidity}
                onChange={handleInputChange}
                className="w-full accent-emerald-500 bg-slate-900 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-extrabold text-base shadow-xl shadow-emerald-500/25 flex items-center justify-center space-x-3 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Run SmartCrop AI Diagnostics</span>
          </button>
        </div>
      </form>

      {/* Animated Modal Sequence */}
      <ProcessingModal isOpen={isProcessing} />
    </div>
  );
}
