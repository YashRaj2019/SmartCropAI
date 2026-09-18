import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AnalyzePage from './pages/AnalyzePage';
import ResultsPage from './pages/ResultsPage';
import HistoryPage from './pages/HistoryPage';
import ComparePage from './pages/ComparePage';
import WeatherPage from './pages/WeatherPage';
import ModelsPage from './pages/ModelsPage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0b0f17] text-slate-100 selection:bg-emerald-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/analyze" element={<AnalyzePage />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/models" element={<ModelsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
