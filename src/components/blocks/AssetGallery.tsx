import React, { useState, useEffect, useCallback } from 'react';

interface GalleryAsset {
  id: string;
  imageUrl: string;
}

interface AssetGalleryProps {
  title?: string;
  assets: GalleryAsset[];
}

const AssetGallery: React.FC<AssetGalleryProps> = ({ 
  title = 'ASSET_VAULT_RECON',
  assets = []
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [cols, setCols] = useState(6);
  const [selectedAssetIndex, setSelectedAssetIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 480) setCols(3);
      else if (window.innerWidth < 768) setCols(4);
      else if (window.innerWidth < 1280) setCols(6);
      else setCols(8);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalCols = Math.ceil(assets.length / 2);
  
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalCols);
  }, [totalCols]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalCols) % totalCols);
  }, [totalCols]);

  useEffect(() => {
    let interval: number;
    if (isAutoPlaying && selectedAssetIndex === null && assets.length > 0) {
      interval = window.setInterval(() => {
        nextSlide();
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide, selectedAssetIndex, assets.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedAssetIndex === null) return;
      if (e.key === 'Escape') setSelectedAssetIndex(null);
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedAssetIndex((prev) => (prev! + 1) % assets.length);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedAssetIndex((prev) => (prev! - 1 + assets.length) % assets.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedAssetIndex, assets.length]);

  const closeLightbox = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedAssetIndex(null);
  }, []);

  if (assets.length === 0) {
    return null;
  }

  return (
    <section className="mt-4 bg-terminal-black text-white border border-terminal-gray overflow-hidden w-full relative" id="gallery">
      {/* Tactical Header */}
      <div className="p-4 bg-terminal-gray/10 flex items-center justify-between border-b border-terminal-gray relative">
        <div className="flex items-center gap-3 relative z-10">
          <span className="w-5 h-5 flex items-center justify-center border border-terminal-white text-terminal-white text-[10px] bg-terminal-red/10 font-black">IMG</span>
          <h2 className="text-xl font-bold tracking-tight uppercase">
            {title}
          </h2>
        </div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="hidden md:flex gap-6 text-[9px] font-bold text-terminal-gray tracking-widest uppercase">
             <span className="status-blink text-terminal-red">● RECON_ACTIVE</span>
             <span>ARRAY_INDEX: {totalCols}x2</span>
          </div>
          <div className="flex gap-2 h-10">
            <button 
              type="button"
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="w-10 border border-terminal-white flex items-center justify-center hover:bg-terminal-white hover:text-terminal-black transition-all font-bold text-[10px]"
              title={isAutoPlaying ? 'PAUSE' : 'RESUME'}
            >
              {isAutoPlaying ? '||' : '▶'}
            </button>
            <button 
              type="button"
              onClick={prevSlide}
              className="w-10 border border-terminal-white flex items-center justify-center hover:bg-terminal-white hover:text-terminal-black transition-all font-bold"
            >
              &lt;
            </button>
            <button 
              type="button"
              onClick={nextSlide}
              className="w-10 border border-terminal-white flex items-center justify-center hover:bg-terminal-white hover:text-terminal-black transition-all font-bold"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Seamless Grid Slider */}
      <div className="relative overflow-hidden bg-black">
        <div className="absolute inset-0 pointer-events-none z-20 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.05)_0%,transparent_100%)]"></div>
        
        <div 
          className="flex transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
          style={{ transform: `translateX(-${currentIndex * (100 / cols)}%)` }}
        >
          {Array.from({ length: totalCols * 3 }).map((_, colIdx) => (
            <div 
              key={colIdx} 
              className="flex flex-col flex-shrink-0"
              style={{ width: `${100 / cols}%` }}
            >
              {[0, 1].map(rowOffset => {
                const assetIdx = (colIdx * 2 + rowOffset) % assets.length;
                const asset = assets[assetIdx];
                return (
                  <div 
                    key={`${colIdx}-${rowOffset}`} 
                    className="aspect-square relative group overflow-hidden border-[0.5px] border-terminal-gray/10 bg-terminal-gray/5 cursor-pointer"
                    onClick={() => setSelectedAssetIndex(assetIdx)}
                  >
                    <img 
                      src={asset.imageUrl} 
                      alt="" 
                      className="w-full h-full object-cover grayscale brightness-[0.25] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
                    />
                    
                    {/* Hover Effect */}
                    <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                      <div className="absolute inset-0 border border-terminal-red/30 m-2"></div>
                      <div className="text-[8px] text-white bg-terminal-red px-2 py-0.5 font-black uppercase tracking-widest shadow-[0_0_10px_red]">
                        OPEN_NODE_{asset.id.slice(-3)}
                      </div>
                      <div className="absolute top-2 right-2 text-[6px] text-terminal-gray font-mono">
                        {Math.random().toString(16).slice(2, 6).toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Edge Gradients */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black via-black/40 to-transparent pointer-events-none z-30"></div>
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black via-black/40 to-transparent pointer-events-none z-30"></div>
      </div>

      {/* Lightbox / Popup */}
      {selectedAssetIndex !== null && (
        <div 
          className="fixed inset-0 z-[1000] bg-terminal-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300 cursor-zoom-out"
          onClick={() => closeLightbox()}
        >
          <div 
            className="relative w-full max-w-6xl aspect-video bg-black border-2 border-terminal-white overflow-hidden shadow-[0_0_50px_rgba(255,0,0,0.2)] cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Lightbox HUD Framing */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-terminal-red z-10 pointer-events-none"></div>
            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-terminal-red z-10 pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-terminal-red z-10 pointer-events-none"></div>
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-terminal-red z-10 pointer-events-none"></div>

            {/* Lightbox Header */}
            <div className="absolute top-0 left-0 w-full p-6 z-[60] flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
              <div className="flex flex-col">
                <span className="text-terminal-red text-[10px] font-black tracking-[0.4em] mb-1 status-blink uppercase">UPLINK_VIEWPORT_ACTIVE</span>
                <h3 className="text-2xl font-black tracking-tighter italic uppercase text-white">
                  {assets[selectedAssetIndex].id} // NODE_RECON_DATA
                </h3>
              </div>
              <button 
                type="button"
                onClick={(e) => closeLightbox(e)}
                className="btn-brutal bg-terminal-red text-white border-none px-6 py-2 font-black text-xs hover:bg-white hover:text-terminal-black transition-all cursor-pointer pointer-events-auto shadow-[0_0_10px_rgba(255,0,0,0.4)]"
              >
                [ ESC_CLOSE_X ]
              </button>
            </div>

            {/* Main Image */}
            <div className="w-full h-full relative group flex items-center justify-center">
              <img 
                src={assets[selectedAssetIndex].imageUrl} 
                alt="" 
                className="max-w-full max-h-full object-contain animate-in zoom-in-95 duration-500"
              />
              
              {/* Scanline Overlay for Modal */}
              <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,rgba(0,0,0,0.1),rgba(0,0,0,0.1)_1px,transparent_1px,transparent_2px)] opacity-50 z-10"></div>
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-y-0 left-0 flex items-center px-4 md:px-8 z-[55]">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAssetIndex((prev) => (prev! - 1 + assets.length) % assets.length);
                }}
                className="w-12 h-24 border border-terminal-white bg-black/50 hover:bg-terminal-red hover:border-terminal-red transition-all flex items-center justify-center font-bold text-xl group cursor-pointer"
              >
                <span className="group-hover:-translate-x-1 transition-transform">&lt;</span>
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 md:px-8 z-[55]">
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAssetIndex((prev) => (prev! + 1) % assets.length);
                }}
                className="w-12 h-24 border border-terminal-white bg-black/50 hover:bg-terminal-red hover:border-terminal-red transition-all flex items-center justify-center font-bold text-xl group cursor-pointer"
              >
                <span className="group-hover:translate-x-1 transition-transform">&gt;</span>
              </button>
            </div>

            {/* Lightbox Footer Meta */}
            <div className="absolute bottom-0 left-0 w-full p-4 bg-black/80 border-t border-terminal-gray flex justify-between items-center text-[9px] font-black tracking-widest text-terminal-gray z-[55]">
               <div className="hidden sm:flex gap-6">
                 <span>RES: 4K_UPLINK</span>
                 <span>COORD: 0x{Math.floor(Math.random()*9999).toString(16).toUpperCase()}</span>
                 <span className="text-terminal-red">ENCRYPTION: RSA_4096</span>
               </div>
               <div className="flex items-center gap-4 ml-auto">
                 <span>ASSET {selectedAssetIndex + 1} OF {assets.length}</span>
                 <div className="flex gap-1 h-2">
                   {assets.map((_, i) => (
                     <div key={i} className={`w-2 h-full ${i === selectedAssetIndex ? 'bg-terminal-red' : 'bg-terminal-gray/30'}`}></div>
                   ))}
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical Footer */}
      <div className="p-4 px-6 flex flex-wrap justify-between items-center text-[9px] font-bold text-terminal-gray tracking-[0.2em] uppercase bg-terminal-black border-t border-terminal-gray relative">
        <div className="flex gap-8 items-center">
          <div className="flex gap-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className={`w-1 h-3 ${i < 3 ? 'bg-terminal-red' : 'bg-terminal-gray/20'}`}></div>
            ))}
          </div>
          <span className="text-terminal-white">NODE_DENSITY: {cols * 2}_NODES</span>
          <span className="hidden sm:inline">BUFFER_SYNC: ACTIVE</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex gap-0.5">
            {Array.from({ length: totalCols }).map((_, i) => (
              <div 
                key={i} 
                className={`w-3 h-1 transition-all duration-300 ${i === currentIndex % totalCols ? 'bg-terminal-red' : 'bg-terminal-gray/20'}`}
              ></div>
            ))}
          </div>
          <span className="text-terminal-white">LATENCY: {Math.floor(Math.random() * 5) + 5}MS</span>
          <span className="text-terminal-red status-blink font-black">● LIVE_FEED</span>
        </div>
      </div>
    </section>
  );
};

export default AssetGallery;

