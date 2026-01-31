
import React, { useState, useEffect } from 'react';
import GlobeVisualization from './components/GlobeVisualization';
import TopBanner from './components/TopBanner';
import StatsPanel from './components/StatsPanel';
import { SAMPLE_COUNTRIES } from './constants';
import { CountryData, AIInsight } from './types';
import { getDemographicInsights } from './services/geminiService';

const App: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoadingInsights(true);
      const data = await getDemographicInsights();
      setInsights(data);
      setLoadingInsights(false);
    };
    fetchInsights();
  }, []);

  const handleCountryClick = (country: CountryData) => {
    setSelectedCountry(country);
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-slate-50 overflow-hidden select-none">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-900/10 via-slate-950 to-slate-950 z-0"></div>
      
      {/* UI Elements */}
      <TopBanner />
      
      <GlobeVisualization 
        data={SAMPLE_COUNTRIES} 
        onCountryClick={handleCountryClick} 
      />
      
      <StatsPanel 
        data={SAMPLE_COUNTRIES} 
        insights={insights}
        loadingInsights={loadingInsights}
        selectedCountry={selectedCountry}
      />

      {/* Footer Info */}
      <div className="absolute bottom-6 left-10 flex items-center gap-6 z-20">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">High Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-400"></span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Moderate Activity</span>
        </div>
        <div className="text-[10px] text-slate-600 max-w-xs">
          Interactive TV Dashboard optimized for large displays. Visualization shows live estimates based on UN Population Division projections.
        </div>
      </div>
    </div>
  );
};

export default App;
