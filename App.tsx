
import React, { useState, useEffect, useCallback } from 'react';
import BirthCounter from './components/BirthCounter';
import WorldMap from './components/WorldMap';
import { BirthEvent } from './types';
import { REGION_WEIGHTS, GLOBAL_BIRTH_RATE_PER_SEC } from './constants';

const App: React.FC = () => {
  const [events, setEvents] = useState<BirthEvent[]>([]);

  const spawnBirth = useCallback(() => {
    const random = Math.random();
    let cumulative = 0;
    const region = REGION_WEIGHTS.find(r => {
      cumulative += r.weight;
      return random <= cumulative;
    }) || REGION_WEIGHTS[REGION_WEIGHTS.length - 1];

    const jitterLat = (Math.random() - 0.5) * region.radius;
    const jitterLng = (Math.random() - 0.5) * region.radius;

    const newEvent: BirthEvent = {
      id: Math.random().toString(36).substr(2, 9),
      lat: region.coords[0] + jitterLat,
      lng: region.coords[1] + jitterLng,
      country: region.name,
      timestamp: Date.now()
    };

    setEvents(prev => [...prev.slice(-50), newEvent]);
  }, []);

  useEffect(() => {
    const intervalTime = 1000 / GLOBAL_BIRTH_RATE_PER_SEC;
    const interval = setInterval(spawnBirth, intervalTime);
    return () => clearInterval(interval);
  }, [spawnBirth]);

  return (
    <div className="relative h-screen w-full flex flex-col bg-slate-950 overflow-hidden font-sans">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Floating Centered Header */}
      <header className="relative w-full pt-8 pb-4 flex items-center justify-center z-20 px-4">
        <div className="flex items-center gap-4 bg-slate-900/80 backdrop-blur-md px-8 py-4 rounded-full border border-yellow-500/30 shadow-[0_0_40px_rgba(234,179,8,0.2)]">
          <span className="p-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl shadow-lg shadow-yellow-500/30 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </span>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 tracking-[0.2em] uppercase text-center leading-none">
              Global Birth Counter
            </h1>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Live Demographic Stream</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main 2-Column Content Split */}
      <main className="flex-1 flex flex-row gap-6 p-6 min-h-0 relative z-10">
        {/* Left Sidebar: Counter Display (30%) */}
        <aside className="w-[30%] min-w-[300px] max-w-[500px] flex flex-col">
          <BirthCounter />
        </aside>

        {/* Right Section: World Map Visualization (70%) */}
        <section className="flex-1 min-w-0 h-full">
          <WorldMap events={events} />
        </section>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-4 text-center z-20 px-4 opacity-50">
        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.5em]">
          &copy; {new Date().getFullYear()} Global Birth Pulse Monitor &bull; Real-Time Data Visualization
        </p>
      </footer>
    </div>
  );
};

export default App;
