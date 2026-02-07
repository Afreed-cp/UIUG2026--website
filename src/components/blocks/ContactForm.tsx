import React, { useState, useEffect, useRef } from 'react';
// We use the global L from the script tag to ensure stability in this environment
declare const L: any;

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  nodeHandleLabel?: string;
  nodeHandlePlaceholder?: string;
  returnEndpointLabel?: string;
  returnEndpointPlaceholder?: string;
  dataPayloadLabel?: string;
  dataPayloadPlaceholder?: string;
  broadcastButtonText?: string;
  transmittingText?: string;
  successTitle?: string;
  successSubtitle?: string;
  mapTitle?: string;
  mapLatitude?: number;
  mapLongitude?: number;
  mapZoom?: number;
  nodeName?: string;
  nodeCoordinates?: [number, number];
  clusterRegion?: string;
  activeNodes?: string;
  primaryNode?: string;
  noteText?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({
  title = 'INDIA_CLUSTER_UPLINK_V.04',
  subtitle = 'Transmit_To_Cluster',
  nodeHandleLabel = 'NODE_HANDLE',
  nodeHandlePlaceholder = 'E.G. USER_99',
  returnEndpointLabel = 'RETURN_ENDPOINT',
  returnEndpointPlaceholder = 'MAIL@NODE.COM',
  dataPayloadLabel = 'DATA_PAYLOAD',
  dataPayloadPlaceholder = 'ENTER ENCRYPTED MESSAGE FOR THE CLUSTER...',
  broadcastButtonText = '[ BROADCAST_TO_CLUSTER ]',
  transmittingText = 'ROUTING_NATIONAL_PACKETS...',
  successTitle = 'Packet_Distributed',
  successSubtitle = 'LOGGED_TO_NATIONAL_BACKBONE',
  mapTitle = 'INDIA_CLUSTER_TELEMETRY',
  mapLatitude = 20.5937,
  mapLongitude = 78.9629,
  mapZoom = 4,
  nodeName = 'NODE_KER_01',
  nodeCoordinates = [8.5241, 76.9366],
  clusterRegion = 'INDIA_IN_SUBCONTINENT',
  activeNodes = '4,512_IDENTIFIED',
  primaryNode = 'KERALA_HUB_ACTIVE',
  noteText = 'Note: This uplink connects to the national backbone with a primary regional anchor at Node_KER_01. All national synchronization flows through this cluster vertex.'
}) => {
  const [status, setStatus] = useState<'IDLE' | 'TRANSMITTING' | 'SUCCESS'>('IDLE');
  const [formData, setFormData] = useState({ handle: '', endpoint: '', payload: '' });
  const [logs, setLogs] = useState<string[]>([]);
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Simulated live packet logs
  useEffect(() => {
    const logInterval = setInterval(() => {
      const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
      const newLog = `[${new Date().toLocaleTimeString()}] PKT_SH_${hex} :: ${Math.random() > 0.8 ? 'ENCRYPT_SYNC_OK' : 'ROUTING_NODE_STABLE'}`;
      setLogs(prev => [...prev.slice(-12), newLog]);
    }, 2000);
    return () => clearInterval(logInterval);
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const timer = setTimeout(() => {
      const map = L.map(mapContainerRef.current, {
        center: [mapLatitude, mapLongitude],
        zoom: mapZoom,
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map);

      const pulseIcon = L.divIcon({
        className: 'relative',
        html: `
          <div class="pulse-marker w-3 h-3"></div>
          <div class="absolute -top-5 -left-8 bg-black border border-terminal-red text-[7px] text-terminal-red px-1.5 py-0.5 font-black whitespace-nowrap shadow-[0_0_8px_rgba(255,0,0,0.4)]">
            ${nodeName}
          </div>
        `,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });

      L.marker(nodeCoordinates, { icon: pulseIcon }).addTo(map);
      map.invalidateSize();
      mapRef.current = map;
    }, 150);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // Only initialize once - remove dependencies to prevent re-initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Scroll only the log container, not the whole page
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const handleTransmission = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('TRANSMITTING');
    
    setTimeout(() => {
      setStatus('SUCCESS');
      setTimeout(() => {
        setStatus('IDLE');
        setFormData({ handle: '', endpoint: '', payload: '' });
      }, 3000);
    }, 2500);
  };

  return (
    <>
      <div className="p-4 bg-terminal-gray/20 cell-border flex items-center justify-between border-b border-terminal-gray">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center border border-terminal-red text-terminal-red text-[10px]">COM</span>
          {title}
        </h2>
        <div className="flex items-center gap-4 text-[9px] font-bold">
          <span className="text-terminal-red status-blink">● SIGNAL_STRENGTH: OPTIMAL</span>
          <span className="text-terminal-gray">BACKBONE: ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col border-r border-terminal-gray">
          <div className="p-8 relative">
            <div className="mb-8">
              <span className="text-[10px] text-terminal-red font-bold block mb-1">/INPUT_STREAM</span>
              <h3 className="text-3xl font-black italic tracking-tighter uppercase">{subtitle}</h3>
            </div>

            {status === 'SUCCESS' ? (
              <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-terminal-red bg-terminal-red/5 animate-pulse">
                <span className="text-4xl mb-4">📡</span>
                <span className="text-xl font-black italic uppercase">{successTitle}</span>
                <span className="text-[10px] mt-2 opacity-60">{successSubtitle}</span>
              </div>
            ) : (
              <form onSubmit={handleTransmission} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[9px] text-terminal-gray font-bold">{nodeHandleLabel}</label>
                    <input 
                      required
                      type="text" 
                      value={formData.handle}
                      onChange={e => setFormData({...formData, handle: e.target.value})}
                      placeholder={nodeHandlePlaceholder}
                      className="w-full bg-transparent border border-terminal-gray p-3 text-xs font-bold focus:border-terminal-red focus:outline-none transition-colors placeholder:opacity-20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-terminal-gray font-bold">{returnEndpointLabel}</label>
                    <input 
                      required
                      type="email" 
                      value={formData.endpoint}
                      onChange={e => setFormData({...formData, endpoint: e.target.value})}
                      placeholder={returnEndpointPlaceholder}
                      className="w-full bg-transparent border border-terminal-gray p-3 text-xs font-bold focus:border-terminal-red focus:outline-none transition-colors placeholder:opacity-20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] text-terminal-gray font-bold">{dataPayloadLabel}</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.payload}
                    onChange={e => setFormData({...formData, payload: e.target.value})}
                    placeholder={dataPayloadPlaceholder}
                    className="w-full bg-transparent border border-terminal-gray p-3 text-xs font-bold focus:border-terminal-red focus:outline-none transition-colors placeholder:opacity-20"
                  ></textarea>
                </div>

                <button 
                  disabled={status === 'TRANSMITTING'}
                  className="w-full bg-terminal-red text-white py-4 font-black text-lg hover:bg-terminal-white hover:text-terminal-black transition-all flex items-center justify-center gap-4 group disabled:opacity-50"
                >
                  {status === 'TRANSMITTING' ? (
                    <span className="status-blink">{transmittingText}</span>
                  ) : (
                    <>
                      {broadcastButtonText}
                      <span className="group-hover:translate-x-2 transition-transform">{'>>>'}</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="absolute top-2 right-2 flex flex-col gap-1">
               <div className="w-1 h-4 bg-terminal-gray/20"></div>
               <div className="w-1 h-2 bg-terminal-red"></div>
            </div>
          </div>

          {/* Live Transmission Log */}
          <div className="mt-auto border-t border-terminal-gray p-6 bg-terminal-gray/5 font-mono">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[9px] font-bold text-terminal-red tracking-[0.2em] uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-terminal-red rounded-full status-blink"></span>
                UPLINK_TRANSMISSION_LOG
              </span>
              <span className="text-[8px] text-terminal-gray">BUF_SZ: 2048KB</span>
            </div>
            
            <div ref={logContainerRef} className="bg-black/40 border border-terminal-gray/20 p-4 h-40 overflow-y-auto overflow-x-hidden relative">
              {/* Scanline overlay for logs */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#fff_3px)]"></div>
              
              <div className="space-y-1 relative z-10">
                {logs.map((log, i) => (
                  <div key={i} className="text-[8px] text-terminal-gray whitespace-nowrap overflow-hidden">
                    <span className="text-terminal-red/60">{'> '}</span>{log}
                  </div>
                ))}
                <div ref={logEndRef} className="text-[8px] text-terminal-red status-blink">_WAITING_FOR_DATA_BURST</div>
              </div>

              {/* Decorative data bars */}
              <div className="absolute top-4 right-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`w-1 h-2 ${i < 3 ? 'bg-terminal-red' : 'bg-terminal-gray/30'} ${i === 2 ? 'status-blink' : ''}`}></div>
                ))}
              </div>
            </div>

            <div className="mt-4 flex gap-4 text-[7px] font-bold text-terminal-gray/60 uppercase">
              <span>SYNC_LATENCY: 12ms</span>
              <span>PARITY_CHECK: PASS</span>
              <span>CLUSTER_STATE: SYNCED</span>
            </div>
          </div>
        </div>

        <div className="p-8 bg-terminal-gray/5 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-8">
              <div>
                <span className="text-[10px] text-terminal-red font-bold block mb-1">/GEOSPATIAL_METADATA</span>
                <h3 className="text-xl font-black tracking-tight uppercase">{mapTitle}</h3>
              </div>
              <div className="text-right font-mono text-[9px] opacity-40">
                LAT: {mapLatitude.toFixed(4)}° N<br/>
                LON: {mapLongitude.toFixed(4)}° E
              </div>
            </div>

            <div className="relative aspect-video bg-terminal-black border border-terminal-gray/30 mb-8 overflow-hidden group skeleton-map">
              <div 
                ref={mapContainerRef} 
                className="w-full h-full z-0"
              ></div>
              
              <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center opacity-30">
                <div className="w-full h-full border border-terminal-red/5 m-4 flex items-center justify-center">
                   <div className="w-full h-px bg-terminal-red/10"></div>
                   <div className="h-full w-px bg-terminal-red/10 absolute"></div>
                   <div className="w-48 h-48 border border-terminal-red/10 rounded-full"></div>
                   <div className="w-24 h-24 border border-terminal-red/5 rounded-full absolute"></div>
                </div>
              </div>

              <div className="absolute bottom-0 w-full bg-terminal-red/10 p-2 border-t border-terminal-red/20 flex justify-between text-[7px] font-black uppercase tracking-widest text-terminal-red z-20">
                <span>SUB_CONTINENT_SKELETON_SCAN...</span>
                <span>SYNC_STATUS: 100%_ACTIVE</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-terminal-gray/30 pb-2">
                <span className="text-[10px] font-bold text-terminal-gray uppercase">Cluster_Region</span>
                <span className="text-[10px] font-bold text-terminal-white">{clusterRegion}</span>
              </div>
              <div className="flex justify-between items-center border-b border-terminal-gray/30 pb-2">
                <span className="text-[10px] font-bold text-terminal-gray uppercase">Active_Nodes</span>
                <span className="text-[10px] font-bold text-terminal-white">{activeNodes}</span>
              </div>
              <div className="flex justify-between items-center border-b border-terminal-gray/30 pb-2">
                <span className="text-[10px] font-bold text-terminal-gray uppercase">Primary_Node</span>
                <span className="text-[10px] font-bold text-terminal-red underline">{primaryNode}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-terminal-gray/30">
            {noteText && (
              <p className="text-[9px] text-terminal-gray font-mono italic leading-relaxed lowercase">
                {noteText}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactForm;

