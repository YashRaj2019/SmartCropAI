import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Radio, Pause } from 'lucide-react';

export default function AudioPrescriptionReader({ cropName, diseaseName, status, confidence, solution }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleSpeak = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const confPct = Math.round((confidence || 0.7) * 100);
    const speechText = `
      SmartCrop AI Agronomic Prescription Report.
      Step one: Detected crop is ${cropName || 'Crop'}.
      Step two: Diagnosis is ${diseaseName}, status is ${status}, identified with ${confPct} percent machine learning confidence.
      Step three: Prescribed solutions.
      Immediate action: ${solution?.immediate_action || 'Inspect nearby foliage and isolate affected plant zones.'}
      Organic remedy: ${solution?.organic || 'Apply preventative biological controls.'}
      Chemical control: ${solution?.chemical || 'Consult local extension experts before chemical sprays.'}
      Cultural practice: ${solution?.cultural || 'Maintain proper plant spacing and crop sanitation.'}
      End of agronomic prescription.
    `;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      setIsPlaying(false);
    };
    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  if (!isSupported) return null;

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleToggleSpeak}
        className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
          isPlaying
            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 animate-pulse'
            : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/20 hover:scale-105'
        }`}
        title="Listen to Spoken Agronomic Prescription in the field"
      >
        {isPlaying ? (
          <>
            <VolumeX className="w-4 h-4" />
            <span>Stop Audio Readout</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Listen to Prescription</span>
          </>
        )}
      </button>

      {/* Audio Wave Visualizer Animation */}
      {isPlaying && (
        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
          <div className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.45s]" />
          <div className="w-1 h-5 bg-teal-300 rounded-full animate-bounce" />
          <span className="text-[10px] font-mono text-emerald-400 font-bold ml-1">Speaking...</span>
        </div>
      )}
    </div>
  );
}
