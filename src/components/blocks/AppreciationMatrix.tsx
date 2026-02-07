import React, { useState, useEffect, useRef } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  char: string;
  velocity: { x: number; y: number };
  life: number;
}

interface AppreciationMatrixProps {
  title?: string;
  description?: string;
  protocolName?: string;
  encryptionText?: string;
  nodeTelemetryLabel?: string;
  headline?: string;
  densityLabel?: string;
  totalPulsesLabel?: string;
  resetButtonText?: string;
  gridSize?: number;
  initialTotalAppreciation?: number;
}

const AppreciationMatrix: React.FC<AppreciationMatrixProps> = ({
  description = 'transmit high-frequency appreciation pulses to the contributor cluster. click nodes to bridge the emotional gap between architectures.',
  protocolName = 'PROTOCOL_NAME: APPRECIATION_MATRIX_v1.0',
  encryptionText = 'ENCRYPTION: HEART_SECURE_v4',
  nodeTelemetryLabel = '/NODE_TELEMETRY',
  headline = 'Appreciate\nThe_Core.',
  densityLabel = 'Density',
  totalPulsesLabel = 'Total_Pulses',
  resetButtonText = '[ RESET_LOCAL_ARRAY ]',
  gridSize = 48,
  initialTotalAppreciation = 8420,
}) => {
  const [activeNodes, setActiveNodes] = useState<Set<number>>(new Set());
  const [particles, setParticles] = useState<Particle[]>([]);
  const [totalAppreciation, setTotalAppreciation] = useState(initialTotalAppreciation);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const spawnParticles = (x: number, y: number) => {
    const chars = ['❤️', '♥', '<3', '♡', '❣'];
    const newParticles: Particle[] = Array.from({ length: 6 }).map(() => ({
      id: nextId.current++,
      x,
      y,
      char: chars[Math.floor(Math.random() * chars.length)],
      velocity: {
        x: (Math.random() - 0.5) * 4,
        y: -(Math.random() * 3 + 2)
      },
      life: 1.0
    }));
    setParticles(prev => [...prev, ...newParticles]);
  };

  const handleNodeClick = (index: number, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      const clickX = rect.left - containerRect.left + rect.width / 2;
      const clickY = rect.top - containerRect.top + rect.height / 2;
      spawnParticles(clickX, clickY);
    }

    const next = new Set(activeNodes);
    if (!next.has(index)) {
      next.add(index);
      setTotalAppreciation(prev => prev + 1);
      setActiveNodes(next);
    }
  };

  // Particle Animation Loop
  useEffect(() => {
    if (particles.length === 0) return;

    const frame = requestAnimationFrame(() => {
      setParticles(prev => 
        prev
          .map(p => ({
            ...p,
            x: p.x + p.velocity.x,
            y: p.y + p.velocity.y,
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0)
      );
    });

    return () => cancelAnimationFrame(frame);
  }, [particles]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full border-2 border-black bg-gray-50 p-6 md:p-8 overflow-hidden select-none"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-2 text-[8px] font-black text-gray-200 uppercase tracking-widest leading-none">
        {protocolName}<br/>
        {encryptionText}
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
        {/* Stats Panel */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center">
          <div className="mb-6">
            <span className="bg-black text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">{nodeTelemetryLabel}</span>
            <h3 className="text-3xl font-black tracking-tighter uppercase italic mt-2 leading-none whitespace-pre-line">
              {headline}
            </h3>
            {description && (
              <p className="text-[10px] font-mono text-gray-400 mt-4 leading-relaxed lowercase italic">
                {description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="border-l-2 border-black pl-4">
              <span className="text-[8px] font-bold text-gray-400 block uppercase">{densityLabel}</span>
              <span className="text-xl font-black tracking-tighter">
                {((activeNodes.size / gridSize) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="border-l-2 border-black pl-4">
              <span className="text-[8px] font-bold text-gray-400 block uppercase">{totalPulsesLabel}</span>
              <span className="text-xl font-black tracking-tighter">
                {totalAppreciation.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* The Matrix Grid */}
        <div className="flex-1 w-full relative">
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-2">
            {Array.from({ length: gridSize }).map((_, i) => (
              <button
                key={i}
                onClick={(e) => handleNodeClick(i, e)}
                className={`aspect-square border flex items-center justify-center transition-all duration-300 relative group/node
                  ${activeNodes.has(i) 
                    ? 'border-terminal-red bg-terminal-red/10 shadow-[0_0_10px_rgba(255,0,0,0.2)] scale-105' 
                    : 'border-black/10 bg-white hover:border-black hover:bg-gray-100'}
                `}
              >
                {activeNodes.has(i) ? (
                  <span className="text-terminal-red text-xs animate-pulse">❤️</span>
                ) : (
                  <span className="w-1 h-1 bg-black/10 group-hover/node:bg-black/40 rounded-full"></span>
                )}
                
                {/* Micro Label */}
                <span className="absolute bottom-0.5 right-0.5 text-[5px] text-gray-300 font-mono">
                  {String(i).padStart(2, '0')}
                </span>
              </button>
            ))}
          </div>

          {/* Floating Particles Container */}
          {particles.map(p => (
            <div
              key={p.id}
              className="absolute pointer-events-none select-none text-sm z-50 whitespace-nowrap font-bold"
              style={{
                left: p.x,
                top: p.y,
                opacity: p.life,
                transform: `scale(${0.5 + p.life}) translate(-50%, -50%)`,
                color: '#FF0000',
                textShadow: '0 0 5px rgba(255,0,0,0.5)'
              }}
            >
              {p.char}
            </div>
          ))}
        </div>
      </div>

      {/* Manual Refresh Bar */}
      <div className="mt-8 pt-4 border-t border-black/5 flex justify-between items-center">
        <div className="flex gap-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`w-3 h-1 ${i < 2 ? 'bg-terminal-red' : 'bg-black/10'}`}></div>
          ))}
        </div>
        <button 
          onClick={() => {
            setActiveNodes(new Set());
            setTotalAppreciation(prev => prev + 100);
          }}
          className="text-[9px] font-black uppercase tracking-widest hover:text-terminal-red transition-colors"
        >
          {resetButtonText}
        </button>
      </div>
    </div>
  );
};

export default AppreciationMatrix;

