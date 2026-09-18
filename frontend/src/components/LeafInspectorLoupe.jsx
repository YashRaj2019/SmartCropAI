import React, { useState, useRef, useCallback } from 'react';
import { ZoomIn, Crosshair, Eye, Sparkles, Maximize2, Minimize2, Sliders, ShieldAlert } from 'lucide-react';

export default function LeafInspectorLoupe({ imageUrl, diseaseName, cropName, foliageMetrics }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loupePos, setLoupePos] = useState({ x: 50, y: 50 });
  const [zoomLevel, setZoomLevel] = useState(2.5);
  const [showReticle, setShowReticle] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setLoupePos({ x, y });
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((touch.clientY - rect.top) / rect.height) * 100));
    setLoupePos({ x, y });
  }, []);

  const solidity = foliageMetrics?.solidity ?? 0.85;
  const isPotato = foliageMetrics?.is_potato_morphology;
  const brownPct = foliageMetrics?.brown_pct ?? 25;
  const greenPct = foliageMetrics?.green_pct ?? 60;

  return (
    <div className={`glass-card rounded-2xl border border-emerald-500/30 overflow-hidden space-y-3 transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 bg-slate-950/95 p-6 flex flex-col justify-between overflow-y-auto' : 'p-5'
    }`}>
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <ZoomIn className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>Interactive Foliar Loupe Inspector</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                {zoomLevel}x Micro-Zoom
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">Hover or drag across foliage to examine lesion micro-textures</p>
          </div>
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2">
          {/* Zoom selector */}
          <div className="inline-flex p-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-bold">
            {[2, 2.5, 3.5].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setZoomLevel(z)}
                className={`px-2 py-1 rounded transition-colors ${
                  zoomLevel === z ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {z}x
              </button>
            ))}
          </div>

          {/* Reticle toggle */}
          <button
            type="button"
            onClick={() => setShowReticle(!showReticle)}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
              showReticle
                ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Target Crosshair"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>

          {/* Fullscreen toggle */}
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Loupe View'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Interactive Image Viewport */}
        <div className="lg:col-span-7">
          <div
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMove}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
            onTouchMove={handleTouchMove}
            className="relative w-full aspect-square max-h-[380px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 cursor-crosshair select-none shadow-inner group"
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Diagnosed leaf with loupe"
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                No leaf image available
              </div>
            )}

            {/* Target Reticle Indicator on Image */}
            {isHovered && (
              <div
                className="absolute w-8 h-8 rounded-full border-2 border-emerald-400 pointer-events-none -translate-x-1/2 -translate-y-1/2 shadow-lg shadow-emerald-500/50 flex items-center justify-center"
                style={{ left: `${loupePos.x}%`, top: `${loupePos.y}%` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
            )}

            {/* Floating Guide Badge */}
            {!isHovered && (
              <div className="absolute bottom-3 inset-x-3 text-center pointer-events-none">
                <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 text-[11px] font-bold text-slate-200 inline-flex items-center gap-1.5 shadow-lg">
                  <Eye className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>Move cursor over leaf to activate 2.5x Loupe</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Magnified Optical Inspector & Live Foliar Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          {/* Magnified Loupe Circle */}
          <div className="relative mx-auto w-48 h-48 sm:w-52 sm:h-52 rounded-full overflow-hidden border-4 border-emerald-400/80 bg-slate-950 shadow-2xl shadow-emerald-500/20 group">
            {imageUrl && (
              <div
                className="w-full h-full bg-no-repeat transition-all duration-75"
                style={{
                  backgroundImage: `url(${imageUrl})`,
                  backgroundSize: `${zoomLevel * 100}%`,
                  backgroundPosition: `${loupePos.x}% ${loupePos.y}%`,
                }}
              />
            )}

            {/* Crosshairs inside circle */}
            {showReticle && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="absolute w-full h-[1px] bg-emerald-400/40" />
                <div className="absolute h-full w-[1px] bg-emerald-400/40" />
                <div className="w-6 h-6 rounded-full border border-emerald-400/60" />
              </div>
            )}

            {/* Lens Glare Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

            {/* Live coordinate badge */}
            <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
              <span className="px-2 py-0.5 rounded-full bg-slate-950/80 border border-slate-700 text-[10px] font-mono font-bold text-emerald-300">
                X: {Math.round(loupePos.x)}% | Y: {Math.round(loupePos.y)}%
              </span>
            </div>
          </div>

          {/* Live Spectral Foliar Telemetry Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Foliar Chromatic & Structural Readout
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-bold">
                Live Sensor
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Leaf Solidity</span>
                <span className="text-sm font-black text-emerald-400">{solidity}</span>
                <span className="text-[9px] text-slate-500 block">
                  {solidity > 0.78 ? 'Ovate / Smooth Margin (Potato)' : 'Lobed / Jagged (Tomato)'}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Necrotic Lesions</span>
                <span className="text-sm font-black text-amber-400">{brownPct}%</span>
                <span className="text-[9px] text-slate-500 block">Foliar Pathogen Halo</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Active Chlorophyll</span>
                <span className="text-sm font-black text-teal-400">{greenPct}%</span>
                <span className="text-[9px] text-slate-500 block">Photosynthetic Tissue</span>
              </div>

              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block text-[10px]">Botanical Class</span>
                <span className="text-sm font-black text-white">{cropName || 'Solanaceae'}</span>
                <span className="text-[9px] text-slate-500 block">{diseaseName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
