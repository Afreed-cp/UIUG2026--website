import React, { useState, useEffect, useRef } from 'react';
// We use the global L from the script tag to ensure stability in this environment
declare const L: any;

interface LoaderProps {
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const sequenceRef = useRef<boolean>(false);

  // Tactical Log Sequence
  useEffect(() => {
    const sequences = [
      "INITIALIZING_TACTICAL_UPLINK...",
      "TARGET_ACQUIRED: ODENSE, DENMARK [HQ_NODE]",
      "ESTABLISHING_HANDSHAKE_V14.2...",
      "SYNC_SUCCESS: KNOWLEDGE_CORE_EXTRACTED",
      "BOOTSTRAPPING_WRITING_UMBRACO_ENGINE...",
      "ROUTING_PACKETS_TO_SUBCONTINENT...",
      "SYNCING_GEOSPATIAL_COORDINATES...",
      "PATH_CALCULATED: NORTH_TO_SOUTH_AXIS",
      "CROSSING_GEOSPATIAL_BOUNDARIES...",
      "APPROACHING_KERALA_CLUSTER...",
      "FINALIZING_LOCAL_NODE_SYNC...",
      "UPLINK_STABLE: WELCOME_TO_THE_HUB"
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < sequences.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${sequences[current]}`]);
        setProgress(((current + 1) / sequences.length) * 100);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          // Try calling the callback first
          if (onComplete && typeof onComplete === 'function') {
            try {
              onComplete();
            } catch (error) {
              console.error('[Loader] Error calling onComplete:', error);
            }
          }
          // Fallback to global function if callback fails
          if (typeof (window as any).hideLoader === 'function') {
            (window as any).hideLoader();
          }
        }, 800);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Map Animation Sequence
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || sequenceRef.current) return;
    sequenceRef.current = true;

    // Optimized Coordinates
    const odense: [number, number] = [55.4038, 10.4024];
    const kerala: [number, number] = [8.5241, 76.9366];

    const map = L.map(mapContainerRef.current, {
      center: odense,
      zoom: 3,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      boxZoom: false,
      attributionControl: false
    });

    // Use Standard OSM tiles but rely on CSS filter to invert them (White -> Tactical Dark)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    const hqIcon = L.divIcon({
      className: 'relative',
      html: `<div class="w-2.5 h-2.5 bg-terminal-red border border-black shadow-[0_0_10px_red]"></div>`,
      iconSize: [10, 10],
      iconAnchor: [5, 5]
    });

    const targetIcon = L.divIcon({
      className: 'relative',
      html: `<div class="pulse-marker w-6 h-6"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    L.marker(odense, { icon: hqIcon }).addTo(map);
    const targetMarker = L.marker(kerala, { icon: targetIcon });

    // Initial sizing fix to ensure map container dimensions are captured
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    // Snappier flight sequence (5 seconds)
    setTimeout(() => {
      map.flyTo(kerala, 4, {
        duration: 5.0,
        easeLinearity: 0.25
      });
      
      map.once('moveend', () => {
        targetMarker.addTo(map);
      });
    }, 400);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[1000] bg-terminal-black flex flex-col items-center justify-center overflow-hidden text-xs font-mono uppercase">
      {/* Fullscreen Map Backdrop */}
      <div className="absolute inset-0 z-0 bg-black">
        <div ref={mapContainerRef} className="w-full h-full skeleton-map-loader"></div>
        
        {/* Visual Noise & CRT Overlays */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="w-full h-full bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.2)_1px,transparent_1px,transparent_2px)] opacity-60"></div>
          <div className="w-full h-full bg-[radial-gradient(circle,transparent_40%,rgba(0,0,0,0.7)_100%)]"></div>
        </div>

        {/* Tactical HUD Static Overlays */}
        <div className="absolute inset-0 pointer-events-none z-20">
          {/* Corner Brackets */}
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 md:top-10 md:left-10 border-t-2 border-l-2 border-terminal-red w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-50"></div>
          <div className="absolute top-4 right-4 sm:top-8 sm:right-8 md:top-10 md:right-10 border-t-2 border-r-2 border-terminal-red w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-50"></div>
          <div className="absolute bottom-24 left-4 sm:bottom-24 sm:left-8 md:bottom-24 md:left-10 border-b-2 border-l-2 border-terminal-red w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-50"></div>
          <div className="absolute bottom-24 right-4 sm:bottom-24 sm:right-8 md:bottom-24 md:right-10 border-b-2 border-r-2 border-terminal-red w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-50"></div>
          
          {/* Animated Scanning Sweep */}
          <div className="w-full h-px bg-terminal-red/40 absolute top-0 shadow-[0_0_20px_red] animate-[loader-scan_6s_linear_infinite]"></div>
          
          {/* Large Crosshair Center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30vw] h-[30vw] border border-terminal-red/10 rounded-full flex items-center justify-center pointer-events-none">
             <div className="w-0.5 h-12 sm:h-20 md:h-24 bg-terminal-red/40"></div>
             <div className="w-12 sm:w-20 md:w-24 h-0.5 bg-terminal-red/40 absolute"></div>
          </div>
        </div>
      </div>

      {/* Floating Tactical Data (HUD Style) */}
      <div className="absolute top-12 left-4 sm:top-16 sm:left-8 md:top-16 md:left-16 z-30 flex flex-col gap-1 md:gap-2 max-w-[calc(100%-2rem)] sm:max-w-sm md:max-w-md p-3 md:p-6 bg-black/60 backdrop-blur-md border border-terminal-red/30 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2 md:gap-4 mb-1 md:mb-3">
          <div className="w-3 h-3 md:w-5 md:h-5 bg-terminal-red status-blink shadow-[0_0:10px_red]"></div>
          <h2 className="text-sm sm:text-lg md:text-2xl font-black tracking-[0.3em] md:tracking-[0.5em] uppercase text-terminal-red drop-shadow-[0_0_15px_rgba(255,0,0,0.8)]">
            SYSTEM_UPLINK
          </h2>
        </div>
        <div className="space-y-1 md:space-y-2 max-h-32 sm:max-h-48 md:max-h-none overflow-hidden">
          {logs.slice(-5).map((log, i) => (
            <div key={i} className="text-[10px] sm:text-[11px] md:text-[12px] text-white/90 animate-in slide-in-from-left-6 duration-500 flex items-start gap-2 md:gap-4">
              <span className="text-terminal-red font-black">»</span>
              <span className="opacity-100 font-bold truncate">{log}</span>
            </div>
          ))}
          <div className="text-[10px] md:text-[12px] text-terminal-red status-blink font-black mt-1">_UPLINK_STABLE_0x14</div>
        </div>
      </div>

      {/* Floating Target Telemetry */}
      <div className="absolute bottom-24 right-4 sm:bottom-24 sm:right-8 md:bottom-24 md:right-16 z-30 text-right p-4 sm:p-6 md:p-10 bg-black/60 backdrop-blur-md border border-terminal-red/30 shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-[calc(100%-2rem)] sm:max-w-md md:max-w-none">
        <div className="mb-2 md:mb-6">
          <span className="text-[10px] md:text-sm text-terminal-gray block mb-1 md:mb-3 font-black tracking-[0.1em] md:tracking-[0.2em] uppercase">GEOSPATIAL_VECTOR</span>
          <span className="text-2xl sm:text-4xl md:text-5xl font-black text-white italic tracking-tighter block leading-none">
            DK <span className="text-terminal-red px-1 md:px-4 font-normal">{'>>'}</span> IN
          </span>
        </div>
        <div className="flex flex-col gap-2 md:gap-4 items-end">
          <div className="flex items-center gap-3 md:gap-8 text-[8px] sm:text-[10px] md:text-xs font-black text-terminal-gray tracking-widest">
            <span className="hidden sm:inline">NODES: 4,512</span>
            <span className="text-terminal-red animate-pulse">LAT: 0.08MS</span>
          </div>
          {/* Main Progress Hub */}
          <div className="w-full sm:w-72 md:w-96 space-y-2 md:space-y-4 mt-2 md:mt-6">
            <div className="flex justify-between items-end text-[10px] sm:text-[12px] md:text-sm font-black text-white tracking-[0.2em] md:tracking-[0.4em]">
              <span>SYNC_PROGRESS</span>
              <span className="text-terminal-red text-xl sm:text-3xl md:text-4xl">{Math.floor(progress)}%</span>
            </div>
            <div className="w-full h-2 md:h-3 bg-terminal-gray/30 relative overflow-hidden">
              <div 
                className="h-full bg-terminal-red transition-all duration-300 ease-out shadow-[0_0_25px_rgba(255,0,0,1)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Static Decorative Side Elements - Hidden on small mobile */}
      <div className="absolute left-4 sm:left-8 md:left-10 top-1/2 -translate-y-1/2 hidden sm:flex flex-col gap-2 md:gap-3 z-20">
         {[...Array(12)].map((_, i) => (
           <div key={i} className={`w-1 md:w-1.5 h-6 sm:h-8 md:h-10 transition-colors duration-500 ${i < (progress / 8) ? 'bg-terminal-red' : 'bg-terminal-gray/20'}`}></div>
         ))}
      </div>

      {/* Bottom Data Strip Overlay */}
      <div className="absolute bottom-0 w-full h-16 sm:h-18 md:h-20 bg-black/95 border-t border-terminal-red/50 z-40 flex items-center justify-between px-4 sm:px-12 md:px-20 text-[8px] sm:text-[10px] md:text-[12px] font-black text-terminal-gray tracking-[0.5em] md:tracking-[1em] uppercase">
        <div className="flex gap-4 md:gap-16 items-center">
          <span className="text-terminal-red truncate max-w-[150px] sm:max-w-none">RSA_4096_ACTIVE</span>
          <span className="hidden lg:inline opacity-30">|</span>
          <span className="hidden lg:inline">NODE_CLUSTER_KERALA_v1.4.2</span>
        </div>
        <div className="flex gap-1 sm:gap-2 md:gap-4 h-4 md:h-8 items-center">
           {[...Array(15)].map((_, i) => (
             <div key={i} className={`w-1 h-3 md:h-5 transition-colors duration-300 ${i < (progress / 6.6) ? 'bg-terminal-red' : 'bg-terminal-gray/20'}`}></div>
           ))}
        </div>
      </div>

      <style>{`
        @keyframes loader-scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        /* Crucial: This inverts light tiles to dark. Using it on dark tiles (CartoDark) makes them white. */
        .skeleton-map-loader .leaflet-tile-pane {
          filter: grayscale(100%) invert(100%) brightness(0.7) contrast(1.6);
          opacity: 0.95;
        }
        .skeleton-map-loader .leaflet-container {
          background: #000 !important;
        }
        .pulse-marker {
          background: #FF0000;
          border-radius: 50%;
          box-shadow: 0 0 0 rgba(255, 0, 0, 0.4);
          animation: pulse-loader 1.5s infinite;
        }
        @keyframes pulse-loader {
          0% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.8); }
          70% { box-shadow: 0 0 0 20px rgba(255, 0, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 0, 0, 0); }
        }
      `}</style>
    </div>
  );
};

export default Loader;

