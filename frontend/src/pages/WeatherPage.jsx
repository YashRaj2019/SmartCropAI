import React, { useState, useEffect } from 'react';
import { CloudSun, Search, Thermometer, Droplets, Wind, CloudRain, ShieldAlert } from 'lucide-react';
import { apiService } from '../services/api';

export default function WeatherPage() {
  const [location, setLocation] = useState('Central Valley');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeather(location);
  }, []);

  const fetchWeather = async (loc) => {
    setLoading(true);
    try {
      const data = await apiService.getWeather(loc);
      setWeather(data);
    } catch (e) {
      console.error("Failed to load weather data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather(location);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <CloudSun className="w-7 h-7 text-emerald-400" />
            <span>Agricultural Weather & Micro-Climate Hub</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Real-time meteorologic telemetry & 5-day crop disease micro-climate forecasting.
          </p>
        </div>

        {/* Location Search */}
        <form onSubmit={handleSearch} className="flex space-x-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search location..."
              className="glass-input rounded-xl pl-9 pr-4 py-2 text-xs w-48 sm:w-64"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20"
          >
            Fetch
          </button>
        </form>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs">Loading weather telemetry...</div>
      ) : weather ? (
        <div className="space-y-8">
          {/* Current Weather Card */}
          <div className="glass-card p-8 rounded-3xl border border-emerald-500/30 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold uppercase text-emerald-400 tracking-wider">Current Telemetry</span>
                <h2 className="text-3xl font-extrabold text-white mt-1">{weather.location}, {weather.country}</h2>
                <p className="text-xs text-slate-300">{weather.description}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                weather.is_live ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40' : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}>
                {weather.is_live ? 'Live API Telemetry' : 'Simulated Weather'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-slate-800">
              <div className="flex items-center space-x-3">
                <Thermometer className="w-8 h-8 text-rose-400" />
                <div>
                  <span className="text-2xl font-bold text-white">{weather.temperature}°C</span>
                  <p className="text-[11px] text-slate-400">Temperature</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Droplets className="w-8 h-8 text-teal-400" />
                <div>
                  <span className="text-2xl font-bold text-white">{weather.humidity}%</span>
                  <p className="text-[11px] text-slate-400">Relative Humidity</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Wind className="w-8 h-8 text-sky-400" />
                <div>
                  <span className="text-2xl font-bold text-white">{weather.wind_speed} km/h</span>
                  <p className="text-[11px] text-slate-400">Wind Velocity</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CloudRain className="w-8 h-8 text-indigo-400" />
                <div>
                  <span className="text-2xl font-bold text-white">{weather.rainfall} mm</span>
                  <p className="text-[11px] text-slate-400">Precipitation</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5-Day Forecast Grid */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white">5-Day Agronomic Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {weather.forecast?.map((day, idx) => (
                <div key={idx} className="glass-card p-4 rounded-2xl border border-slate-800 text-center space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">{day.day}</span>
                  <CloudSun className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div className="text-sm font-extrabold text-white">{day.temp_high}° / <span className="text-slate-400">{day.temp_low}°</span></div>
                  <span className="text-[10px] text-slate-400 block">{day.condition}</span>
                  <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-500/30 inline-block">
                    Rain {day.rain_prob}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
