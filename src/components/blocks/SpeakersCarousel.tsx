import React, { useState, useEffect, useCallback } from 'react';
import type { Speaker } from '../../types';

interface SpeakersCarouselProps {
  speakers: Speaker[];
  title?: string;
  onViewAll?: () => void;
}

const SpeakersCarousel: React.FC<SpeakersCarouselProps> = ({ speakers, title, onViewAll }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const totalItems = speakers.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  }, [totalItems]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  }, [totalItems]);

  useEffect(() => {
    let interval: number;
    if (isAutoPlaying && totalItems > 0) {
      interval = window.setInterval(() => {
        nextSlide();
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, totalItems]);

  if (totalItems === 0) return null;

  return (
    <>
      {/* Header Bar */}
      <div className="p-4 bg-terminal-gray/10 cell-border flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="w-5 h-5 flex items-center justify-center border border-terminal-white text-[10px]">USR</span>
            {title || 'ACTIVE_CONTRIBUTORS_NODE'}
          </h2>
          <div className="hidden lg:flex items-center gap-2 text-[8px] text-terminal-gray font-bold">
            <span className={isAutoPlaying ? 'text-terminal-red status-blink' : ''}>
              [ {isAutoPlaying ? 'LIVE_STREAMING' : 'PAUSED'} ]
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={onViewAll}
            className="text-[10px] border border-terminal-white px-3 py-1 hover:bg-terminal-white hover:text-terminal-black transition-all font-bold h-10 hidden sm:block"
          >
            [VIEW_ALL_CONTRIBUTORS]
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="w-10 h-10 border border-terminal-white flex items-center justify-center hover:bg-terminal-white hover:text-terminal-black transition-all font-bold text-[10px]"
              title={isAutoPlaying ? 'PAUSE' : 'RESUME'}
            >
              {isAutoPlaying ? '||' : '▶'}
            </button>
            <button 
              onClick={prevSlide}
              className="w-10 h-10 border border-terminal-white flex items-center justify-center hover:bg-terminal-white hover:text-terminal-black transition-all font-bold"
            >
              &lt;
            </button>
            <button 
              onClick={nextSlide}
              className="w-10 h-10 border border-terminal-white flex items-center justify-center hover:bg-terminal-white hover:text-terminal-black transition-all font-bold"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Slider Window */}
      <div className="relative overflow-hidden group">
        {/* Scanline Overlay Effect */}
        <div className="absolute inset-0 z-10 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        
        <div 
          className="flex transition-transform duration-700"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {speakers.map((speaker) => (
            <div 
              key={speaker.id} 
              className="min-w-full p-8 md:p-12 cell-border bg-terminal-black hover:bg-terminal-white/5 transition-colors cursor-crosshair flex flex-col md:flex-row gap-8 items-center md:items-stretch"
            >
              {/* Speaker Visual Frame */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 border-4 border-terminal-white p-1 shrink-0">
                <div className="absolute top-[-10px] left-[-10px] w-6 h-6 border-t-4 border-l-4 border-terminal-red z-20"></div>
                <div className="absolute bottom-[-10px] right-[-10px] w-6 h-6 border-b-4 border-r-4 border-terminal-red z-20"></div>
                
                <div className="w-full h-full bg-terminal-black relative overflow-hidden group/img">
                  {speaker.imageUrl ? (
                    <>
                      <img 
                        src={speaker.imageUrl} 
                        alt={speaker.name} 
                        className="w-full h-full object-cover grayscale brightness-75 contrast-125 group-hover/img:grayscale-0 group-hover/img:brightness-100 transition-all duration-700 scale-110 group-hover/img:scale-100"
                      />
                      {/* Red filter on hover */}
                      <div className="absolute inset-0 bg-terminal-red/10 mix-blend-overlay opacity-0 group-hover/img:opacity-100 transition-opacity"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-black">
                      {speaker.name.charAt(0)}
                    </div>
                  )}
                  {/* Internal scanline for image only */}
                  <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.15),rgba(0,0,0,0.15)_1px,transparent_1px,transparent_2px)]"></div>
                </div>
              </div>

              {/* Speaker Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-terminal-red font-bold text-[10px] tracking-[0.2em]">IDENTIFIED_ENTITY</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 ${
                      speaker.status === 'ONLINE' ? 'bg-terminal-white text-terminal-black' : 
                      speaker.status === 'BUSY' ? 'bg-terminal-red text-terminal-white' : 
                      'border border-terminal-gray text-terminal-gray'
                    }`}>
                      STATUS::{speaker.status}
                    </span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter leading-none group-hover:text-terminal-red transition-colors italic">
                    {speaker.name}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <p className="text-sm text-terminal-white font-bold bg-terminal-gray/30 px-2 py-1 border-l-2 border-terminal-white">
                      {speaker.role}
                    </p>
                    <p className="text-sm text-terminal-gray font-mono self-center">
                      NODE_{speaker.node}
                    </p>
                  </div>

                  {speaker.bio && (
                    <p className="text-xs leading-relaxed opacity-60 lowercase max-w-xl mb-8">
                      {speaker.bio}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-terminal-gray pt-6">
                  <div>
                    <span className="block text-[8px] text-terminal-gray font-bold">COMM_ID</span>
                    <span className="text-xs font-bold underline cursor-pointer hover:text-terminal-red">{speaker.handle}</span>
                  </div>
                  <div>
                    <span className="block text-[8px] text-terminal-gray font-bold">CLEARANCE_LVL</span>
                    <span className="text-xs font-bold text-terminal-red">
                      {speaker.clearanceLevel}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <button className="w-full h-full bg-terminal-white text-terminal-black font-black text-[10px] py-2 hover:bg-terminal-red hover:text-terminal-white transition-all transform active:scale-95">
                      [INIT_PROTOCOL]
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-1 bg-terminal-gray w-full flex relative">
        {/* Animated Progress for active slide if playing */}
        {isAutoPlaying && (
          <div 
            className="absolute top-0 h-full bg-terminal-red/30 z-0 transition-all duration-4000 linear"
            style={{ 
              left: `${(currentIndex / totalItems) * 100}%`,
              width: `${(1 / totalItems) * 100}%`
            }}
          ></div>
        )}
        {speakers.map((_, idx) => (
          <button 
            key={idx} 
            onClick={() => {
              setCurrentIndex(idx);
              setIsAutoPlaying(false);
            }}
            className={`flex-1 transition-all duration-300 relative z-10 hover:bg-terminal-white/10 ${idx === currentIndex ? 'bg-terminal-red shadow-[0_0_10px_#FF0000]' : 'bg-transparent'}`}
          ></button>
        ))}
      </div>
      
      {/* Footer Info */}
      <div className="p-3 border-t border-terminal-gray text-[9px] text-terminal-gray flex justify-between items-center bg-terminal-black font-bold">
        <div className="flex gap-6">
          <span>SEQUENCE_ID: {speakers[currentIndex]?.id || ''}</span>
          <span className="hidden sm:inline">DATA_STREAM: {((currentIndex + 1) / totalItems * 100).toFixed(0)}%_SYNCED</span>
        </div>
        <div className="flex gap-4 items-center">
          <span className="status-blink text-terminal-red">● REFRESH_RATE: 4000MS</span>
          <span className="opacity-40">AUTO_ADVANCE_V2.1</span>
        </div>
      </div>
    </>
  );
};

export default SpeakersCarousel;

