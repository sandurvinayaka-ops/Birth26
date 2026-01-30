import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import * as d3 from 'd3';

// --- APPLICATION CONFIGURATION ---
const BIRTHS_PER_SECOND = 4.35;
const ROTATION_SPEED = 0.015;
const FLASH_DURATION = 3500;

// Demographic weighting for realistic birth simulation
const POP_COUNTRIES = ['IND', 'CHN', 'NGA', 'PAK', 'IDN', 'BRA', 'ETH', 'BGD', 'USA', 'COD', 'MEX', 'PHL', 'EGY', 'VNM', 'TUR', 'IRN', 'DEU', 'THA', 'GBR', 'FRA'];

const THEME = {
  LAND: '#1e1b4b',   // Night Indigo
  BORDER: '#312e81', // Border lines
  FLASH: '#fbbf24',  // Amber flash
  OCEAN: '#05010a',
};

// --- COMPONENT: 3D GLOBE ---
const GlobeView = ({ flashes }: { flashes: Map<string, number> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const geoRef = useRef<any>(null);
  const rotRef = useRef(0);

  useEffect(() => {
    // Fetch world boundaries
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(res => res.json())
      .then(data => { geoRef.current = data; });

    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();

    let frame: number;
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas || !geoRef.current) { frame = requestAnimationFrame(render); return; }
      const ctx = canvas.getContext('2d')!;
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Orthographic projection offset to the right for UI balance
      const projection = d3.geoOrthographic()
        .scale(Math.min(width, height) * 0.46)
        .translate([width * 0.76, height / 2])
        .rotate([rotRef.current, -12]);

      const path = d3.geoPath(projection, ctx);

      // Ocean / Sphere Body
      ctx.beginPath(); 
      ctx.arc(width * 0.76, height / 2, projection.scale(), 0, 2 * Math.PI);
      ctx.fillStyle = THEME.OCEAN; 
      ctx.fill();

      // Atmospheric Corona / Glow
      const aura = ctx.createRadialGradient(
        width * 0.76, height / 2, projection.scale() * 0.98, 
        width * 0.76, height / 2, projection.scale() * 1.3
      );
      aura.addColorStop(0, 'rgba(139, 92, 246, 0)');
      aura.addColorStop(1, 'rgba(139, 92, 246, 0.1)');
      ctx.fillStyle = aura;
      ctx.fillRect(0, 0, width, height);

      // Draw Countries
      geoRef.current.features.forEach((feature: any) => {
        const id = feature.id || feature.properties.ISO_A3 || feature.properties.name;
        const lastFlash = flashes.get(id);
        const isActive = lastFlash && (Date.now() - lastFlash < FLASH_DURATION);

        ctx.beginPath(); 
        path(feature);
        
        if (isActive && lastFlash) {
          const t = 1 - ((Date.now() - lastFlash) / FLASH_DURATION);
          ctx.fillStyle = d3.interpolateRgb(THEME.LAND, THEME.FLASH)(t);
          ctx.shadowBlur = 40 * t; 
          ctx.shadowColor = THEME.FLASH;
        } else {
          ctx.fillStyle = THEME.LAND; 
          ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.strokeStyle = isActive ? THEME.FLASH : THEME.BORDER;
        ctx.lineWidth = isActive ? 1.4 : 0.5;
        ctx.stroke();
      });

      rotRef.current += ROTATION_SPEED;
      frame = requestAnimationFrame(render);
    };

    frame = requestAnimationFrame(render);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frame);
    };
  }, [flashes]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-90" />;
};

// --- MAIN DASHBOARD ---
const App = () => {
  const [total, setTotal] = useState(0);
  const [flashes, setFlashes] = useState<Map<string, number>>(new Map());
  const [log, setLog] = useState<any[]>([]);
  const [time, setTime] = useState('');
  const geoData = useRef<any>(null);

  useEffect(() => {
    // Load GeoData for the simulation
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(r => r.json()).then(d => { geoData.current = d; });

    // Clock and Base Ticker
    const updateStats = () => {
      const midnight = new Date(); midnight.setHours(0,0,0,0);
      const secondsSinceStart = (Date.now() - midnight.getTime()) / 1000;
      setTotal(Math.floor(secondsSinceStart * BIRTHS_PER_SECOND));
      setTime(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateStats();
    const statsInterval = setInterval(updateStats, 1000);

    // Birth Event Generation Loop
    const scheduleNextEvent = () => {
      const nextDelay = (1000 / BIRTHS_PER_SECOND) * (0.8 + Math.random() * 0.4);
      setTimeout(() => {
        if (geoData.current) {
          const countries = geoData.current.features;
          const weightedPick = Math.random() > 0.45;
          let target = weightedPick 
            ? countries.find((f: any) => POP_COUNTRIES.includes(f.id || f.properties.ISO_A3))
            : countries[Math.floor(Math.random() * countries.length)];
          
          if (!target) target = countries[0];
          const countryID = target.id || target.properties.ISO_A3 || target.properties.name;
          const countryName = target.properties.name || "UN Region";

          // Trigger Visual Flash
          setFlashes(prev => new Map(prev).set(countryID, Date.now()));
          
          // Log Event
          setLog(prev => [{
            id: Date.now(),
            name: countryName,
            time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          }, ...prev].slice(0, 5));
        }
        scheduleNextEvent();
      }, nextDelay);
    };
    scheduleNextEvent();

    return () => clearInterval(statsInterval);
  }, []);

  const dayPercentage = useMemo(() => {
    const d = new Date();
    const s = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const e = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime();
    return Math.floor(((d.getTime() - s) / (e - s)) * 100);
  }, [time]);

  return (
    <div className="relative w-full h-full bg-[#05010a] overflow-hidden select-none">
      <GlobeView flashes={flashes} />
      <div className="vignette" />
      
      {/* HUD OVERLAY */}
      <div className="relative z-10 flex flex-col justify-between w-full h-full p-10 md:p-20 pointer-events-none">
        
        {/* Header */}
        <div className="flex flex-col items-start">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_15px_#fbbf24] animate-pulse" />
             <h1 className="text-[12px] font-black tracking-[0.5em] text-fuchsia-500 uppercase">
                MOTHER & CHILD CARE — VITAL STATISTICS
             </h1>
          </div>
          <div className="w-48 h-[1px] bg-amber-500/40 mt-4" />
        </div>

        {/* Core Metrics */}
        <div className="flex flex-col md:flex-row items-end justify-between w-full gap-12">
          <div className="flex flex-col items-start">
            <h2 className="text-[10px] font-bold tracking-[0.4em] text-amber-500/60 uppercase mb-4">Daily Global Birth Tally</h2>
            <h1 className="amber-glow text-[7.5rem] md:text-[11rem] font-black tracking-tighter text-amber-400 leading-none tabular-nums">
              {total.toLocaleString('de-DE')}
            </h1>
            
            <div className="mt-10 flex flex-col md:flex-row items-start md:items-center gap-12">
               <div className="flex flex-col w-64">
                  <div className="flex justify-between mb-2 text-[9px] font-black tracking-widest text-slate-500 uppercase">
                    <span>Day Cycle</span>
                    <span className="text-amber-500">{dayPercentage}%</span>
                  </div>
                  <div className="w-full h-[4px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 shadow-[0_0_10px_#fbbf24] transition-all duration-1000" style={{ width: `${dayPercentage}%` }} />
                  </div>
               </div>
               <div className="px-6 py-2 bg-slate-900/40 border border-white/5 backdrop-blur-3xl rounded-lg">
                  <span className="text-2xl font-mono font-black text-amber-500 tracking-tighter">{time}</span>
               </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="w-full md:w-80 p-8 bg-black/50 border border-white/5 rounded-[2rem] backdrop-blur-3xl pointer-events-auto shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-8 pb-3 border-b border-white/5">Event_Telemetry</h3>
            <div className="flex flex-col gap-6">
              {log.map((ev, i) => (
                <div key={ev.id} className="flex flex-col animate-in fade-in slide-in-from-bottom-2 transition-all duration-700" style={{ opacity: 1 - i * 0.2 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-1 rounded-full bg-fuchsia-500" />
                    <span className="text-[9px] font-black text-fuchsia-400 uppercase tracking-tighter italic">Birth Detected</span>
                  </div>
                  <span className="text-lg font-black text-slate-100 uppercase tracking-widest truncate">{ev.name}</span>
                  <span className="text-[9px] text-slate-500 font-mono mt-1">{ev.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Metadata */}
        <div className="flex justify-between items-end text-[8px] md:text-[9px] font-black tracking-[0.3em] text-slate-800 uppercase">
          <div className="flex flex-col gap-2">
             <span>SYSTEM: BC2026_CORE // NODE: PRIMARY</span>
             <span>PROTOCOL: AES_256 // ENCRYPTION_ON</span>
          </div>
          <div className="text-right flex flex-col items-end gap-2">
            <span>DATA: UN_PROJECTION_2024</span>
            <span>© 2026 GLOBAL HEALTHCARE DIGITAL TWIN</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);