import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sprout, Activity, History, CloudSun, Cpu, GitCompare, Sparkles,
  ShieldCheck, AlertTriangle, User, LogOut, LogIn, Menu, X, ChevronDown
} from 'lucide-react';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [modelStatus, setModelStatus] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 20000);
    return () => clearInterval(interval);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const fetchStatus = async () => {
    try {
      const data = await apiService.getHealth();
      setModelStatus(data);
    } catch (e) {
      // Backend offline or starting
    }
  };

  const primaryNavLinks = [
    { path: '/', label: 'Home', icon: Sprout },
    { path: '/analyze', label: 'Analyze Crop', icon: Activity },
    { path: '/results', label: 'Results', icon: Sparkles },
    { path: '/history', label: 'History', icon: History },
    { path: '/compare', label: 'Compare', icon: GitCompare },
    { path: '/weather', label: 'Weather', icon: CloudSun },
    { path: '/models', label: 'Models', icon: Cpu },
  ];

  const isProduction = modelStatus?.mode === 'production';

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 overflow-x-clip">
        {/* Brand Logo - Compact, unified, never wraps */}
        <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-300 bg-clip-text text-transparent">
                SmartCrop
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                AI
              </span>
            </div>
            <span className="hidden xl:block text-[9px] text-slate-400 uppercase tracking-widest font-semibold mt-0.5">
              Decision Support
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Sleek, centered, compact padding */}
        <nav className="hidden lg:flex items-center space-x-1">
          {primaryNavLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Controls Group */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Model Status Pill */}
          <Link
            to="/models"
            className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${
              isProduction
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-950'
                : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
            }`}
            title={isProduction ? 'Production PyTorch + XGBoost Model Active' : 'Deterministic Mode'}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isProduction ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isProduction ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span className="hidden md:inline">{isProduction ? 'Production Mode' : 'Demo Mode'}</span>
          </Link>

          {/* User Auth Info */}
          <div className="flex items-center pl-1 sm:pl-2 sm:border-l sm:border-slate-800">
            {isAuthenticated ? (
              <div className="flex items-center gap-1.5">
                <div
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300"
                  title={`Logged in as ${user?.email}`}
                >
                  <User className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="font-bold text-white max-w-[80px] sm:max-w-[110px] truncate">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 hover:border-rose-500/40 border border-slate-800 text-slate-400 hover:text-rose-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:scale-105"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white focus:outline-none cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800/80 bg-slate-950/98 backdrop-blur-2xl px-4 py-4 space-y-2 animate-fade-in shadow-2xl">
          <div className="grid grid-cols-2 gap-2">
            {primaryNavLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Engine Status: {isProduction ? 'Production Active' : 'Demo Mode'}</span>
            </span>
            <Link to="/analyze" className="text-emerald-400 font-bold hover:underline">
              Start Diagnosis ➔
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
