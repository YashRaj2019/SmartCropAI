import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sprout, Activity, History, CloudSun, Cpu, GitCompare, ChevronRight, ShieldCheck, AlertTriangle, Sparkles, User, LogOut, LogIn } from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [modelStatus, setModelStatus] = useState(null);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const data = await apiService.getHealth();
      setModelStatus(data);
    } catch (e) {
      console.warn("Backend API offline or connecting...");
    }
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: Sprout },
    { path: '/analyze', label: 'Analyze Crop', icon: Activity },
    { path: '/results', label: 'Results', icon: Sparkles },
    { path: '/history', label: 'Farm History', icon: History },
    { path: '/compare', label: 'Compare', icon: GitCompare },
    { path: '/weather', label: 'Weather Hub', icon: CloudSun },
    { path: '/models', label: 'ML Models', icon: Cpu },
  ];

  const isProduction = modelStatus?.mode === 'production';

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
              SmartCrop <span className="text-emerald-500 font-extrabold">AI</span>
            </span>
            <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
              AgriTech Decision Support
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center space-x-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Model Mode Live Status Badge */}
        <div className="flex items-center space-x-3">
          <Link
            to="/models"
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isProduction
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-900/50'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
            }`}
            title={
              isProduction
                ? 'Production Model Active: PyTorch MobileNetV2 + XGBoost Regressor'
                : 'Demo Model Active: Using deterministic fallback estimates'
            }
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isProduction ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isProduction ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              ></span>
            </span>
            {isProduction ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Production Mode</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo Estimator</span>
              </>
            )}
          </Link>

          {location.pathname === '/analyze' ? (
            <Link
              to="/results"
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-sm border border-emerald-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>View Results</span>
            </Link>
          ) : (
            <Link
              to="/analyze"
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Analyze Crop</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}

          {/* User Profile & Auth Controls */}
          <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300" title={`Logged in as ${user?.email}`}>
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-bold text-white max-w-[90px] truncate">{user?.name}</span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/60 hover:border-rose-500/40 border border-slate-800 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
