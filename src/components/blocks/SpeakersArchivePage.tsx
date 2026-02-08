import React, { useState, useMemo, useEffect } from 'react';
import type { Speaker } from '../../types';

interface SpeakersArchivePageProps {
  speakers: Speaker[];
}

const SpeakersArchivePage: React.FC<SpeakersArchivePageProps> = ({ speakers }) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  // Extract unique nodes from speakers dynamically
  const nodes = useMemo(() => {
    const nodeSet = new Set<string>();
    speakers.forEach(speaker => {
      // Extract node prefix (e.g., 'TVM' from 'TVM_01')
      const nodePrefix = speaker.node.split('_')[0];
      if (nodePrefix) {
        nodeSet.add(nodePrefix);
      }
    });
    return ['ALL', ...Array.from(nodeSet).sort()];
  }, [speakers]);

  const filteredSpeakers = useMemo(() => {
    return speakers.filter(s => {
      const matchesNode = filter === 'ALL' || s.node.includes(filter);
      const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                           s.role.toLowerCase().includes(search.toLowerCase());
      return matchesNode && matchesSearch;
    });
  }, [filter, search, speakers]);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      {/* Top Meta Hub - Sticky */}
      <div className="sticky top-0 z-[100] w-full bg-black text-white p-1.5 sm:p-2 px-3 sm:px-6 flex justify-between items-center text-[8px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.4em] font-bold shadow-lg">
        <div className="flex gap-2 sm:gap-4 flex-1 min-w-0">
          <span className="text-terminal-red truncate">CONTRIBUTOR_DIRECTORY_v.4.01</span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">PROTOCOL: AUTHENTICATED_VIEW</span>
        </div>
        <a href="/" className="hover:text-terminal-red transition-colors whitespace-nowrap ml-2 text-[8px] sm:text-[9px]">[ ← ] HOME</a>
      </div>

      {/* Header & Search - Sticky */}
      <header className="sticky top-[2rem] sm:top-[2.5rem] z-[90] w-full bg-white px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-5 md:py-6 lg:py-12 border-b-2 border-black flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 sm:gap-5 md:gap-6 lg:gap-8 shadow-lg">
        <div className="max-w-3xl w-full">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
            <span className="w-6 sm:w-8 h-px bg-terminal-red"></span>
            <span className="text-[9px] sm:text-[10px] font-black text-terminal-red">ACTIVE_NODE_RESOURCES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
            THE_CONTRIBUTORS<span className="text-terminal-red">.</span>
          </h1>
          <p className="mt-2 sm:mt-3 md:mt-4 lg:mt-6 text-[10px] sm:text-xs font-mono text-gray-500 max-w-xl lowercase italic">
            Scanning sub-continent nodes for verified Umbraco architectural leads. Every node in this directory has passed clearance level 04 synchronization.
          </p>
        </div>

        <div className="w-full lg:w-96 space-y-3 sm:space-y-3 md:space-y-4">
          <div className="relative">
            <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-[9px] sm:text-[10px] font-black text-gray-400">CMD&gt;</span>
            <input 
              type="text" 
              placeholder="SEARCH_BY_NAME_OR_ROLE_"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border-2 border-black p-2.5 sm:p-3 md:p-4 pl-9 sm:pl-10 md:pl-12 text-[10px] sm:text-xs font-black uppercase focus:bg-terminal-red/5 focus:outline-none placeholder:opacity-20"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {nodes.map(node => (
              <button 
                key={node}
                onClick={() => setFilter(node)}
                className={`text-[8px] sm:text-[9px] font-black px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 border transition-all ${
                  filter === node ? 'bg-black text-white border-black' : 'border-black/20 text-gray-400 hover:border-black hover:text-black'
                }`}
              >
                [{node}]
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Scrollable Main Area */}
      <main className="flex-1 bg-gray-50/50 p-6 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1800px] mx-auto">
          {filteredSpeakers.map((speaker) => (
            <ContributorCard 
              key={speaker.id} 
              speaker={speaker} 
              onClick={() => setSelectedSpeaker(speaker)}
            />
          ))}

          {/* Empty Placeholder slots for density */}
          {filteredSpeakers.length < 8 && [...Array(8 - filteredSpeakers.length)].map((_, i) => (
            <div key={`empty-${i}`} className="border border-dashed border-black/10 aspect-square flex items-center justify-center grayscale opacity-20">
              <span className="text-[10px] font-black rotate-45">NODE_VACANT_{i}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Speaker Detail Modal */}
      {selectedSpeaker && (
        <SpeakerDetailModal 
          speaker={selectedSpeaker} 
          onClose={() => setSelectedSpeaker(null)} 
        />
      )}

      {/* Technical Footer Strip */}
      <footer className="bg-white border-t-2 border-black p-4 px-12 flex flex-col md:flex-row justify-between items-center text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase">
        <div className="flex gap-12 mb-4 md:mb-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-terminal-red rounded-full status-blink"></span>
            TOTAL_NODES: {speakers.length}
          </div>
          <div>ENCRYPTION: RSA_4096_SIGNED</div>
        </div>
        <div className="flex gap-4">
          <button className="hover:text-black transition-colors underline">EXPORT_DATA.CSV</button>
          <span className="opacity-30">|</span>
          <button className="hover:text-black transition-colors underline">SYNC_MANUAL</button>
        </div>
      </footer>
    </div>
  );
};

const ContributorCard: React.FC<{ speaker: Speaker; onClick: () => void }> = ({ speaker, onClick }) => (
  <div 
    onClick={onClick}
    className="group relative bg-white border-2 border-black overflow-hidden hover:shadow-[12px_12px_0px_#000] transition-all duration-300 flex flex-col cursor-pointer"
  >
    {/* Identity Bar */}
    <div className="bg-black text-white p-2 px-4 flex justify-between items-center text-[8px] font-bold">
      <span>REF::{speaker.id}</span>
      <span className={speaker.status === 'ONLINE' ? 'text-green-400' : speaker.status === 'BUSY' ? 'text-orange-400' : 'text-terminal-red'}>● {speaker.status}</span>
    </div>

    {/* Visual Profile */}
    <div className="aspect-square relative grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden bg-gray-200">
      {speaker.imageUrl ? (
        <img 
          src={speaker.imageUrl} 
          alt={speaker.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
      ) : (
        <div className="w-full h-full bg-terminal-gray/20 flex items-center justify-center">
          <span className="text-terminal-gray text-xs font-black">NO_IMAGE</span>
        </div>
      )}
      {/* Tactical Overlays */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/50"></div>
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/50"></div>
      
      {/* Scanline line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-terminal-red/40 shadow-[0_0_10px_red] opacity-0 group-hover:opacity-100 animate-[archive-scan_3s_linear_infinite]"></div>
    </div>

    {/* Content */}
    <div className="p-6 flex-1 flex flex-col">
      <span className="text-[9px] font-black text-terminal-red mb-1">NODE_{speaker.node}</span>
      <h3 className="text-2xl font-black italic tracking-tighter uppercase leading-tight mb-1">{speaker.name}</h3>
      <p className="text-[10px] font-mono text-gray-500 mb-6 border-l-2 border-black pl-3">{speaker.role}</p>
      
      <div className="mt-auto pt-4 border-t border-black/5 flex justify-between items-center">
        <span className="text-[10px] font-black hover:text-terminal-red cursor-pointer transition-colors underline">{speaker.handle}</span>
        <button className="bg-black text-white p-2 group-hover:bg-terminal-red transition-colors">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
        </button>
      </div>
    </div>

    {/* Animation CSS Hook */}
    <style>{`
      @keyframes archive-scan {
        0% { top: 0%; }
        100% { top: 100%; }
      }
    `}</style>
  </div>
);

const SpeakerDetailModal: React.FC<{ speaker: Speaker; onClose: () => void }> = ({ speaker, onClose }) => {
  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-12 animate-in zoom-in-95 duration-300 overflow-y-auto"
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white border-4 border-black w-full max-w-4xl relative overflow-hidden flex flex-col md:flex-row my-auto max-h-[95vh] md:max-h-none">
      {/* Visual Block */}
      <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative overflow-hidden border-b-4 md:border-b-0 md:border-r-4 border-black group flex-shrink-0">
         {speaker.imageUrl ? (
           <img src={speaker.imageUrl} className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-700" alt={speaker.name} />
         ) : (
           <div className="w-full h-full bg-terminal-gray/20 flex items-center justify-center">
             <span className="text-terminal-gray text-xs font-black">NO_IMAGE</span>
           </div>
         )}
         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
         <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white z-10">
           <span className="text-[9px] sm:text-[10px] font-black tracking-[0.3em] sm:tracking-[0.5em] text-terminal-red status-blink uppercase block mb-2">TARGET_SCAN_COMPLETE</span>
           <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black italic tracking-tighter uppercase leading-none break-words">{speaker.name}</h2>
         </div>
         {/* HUD Elements */}
         <div className="absolute top-4 sm:top-6 left-4 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-l-2 border-terminal-red pointer-events-none"></div>
         <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-8 h-8 sm:w-12 sm:h-12 border-t-2 border-r-2 border-terminal-red pointer-events-none"></div>
      </div>

      {/* Content Block */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-between bg-white relative overflow-y-auto min-h-0">
        <button 
          onClick={onClose}
          className="absolute top-3 sm:top-4 md:top-6 right-3 sm:right-4 md:right-6 text-black font-black text-[10px] sm:text-xs border-2 border-black px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 hover:bg-black hover:text-white transition-all uppercase tracking-widest z-10"
        >
          [ CLOSE_X ]
        </button>

        <div className="pt-8 sm:pt-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-8">
            <span className="bg-black text-white px-2 sm:px-3 py-1 text-[9px] sm:text-[10px] font-black tracking-widest break-all">{`REF_0x${speaker.id}`}</span>
            <span className={`text-[9px] sm:text-[10px] font-black tracking-widest ${speaker.status === 'ONLINE' ? 'text-green-600' : speaker.status === 'BUSY' ? 'text-orange-600' : 'text-terminal-red'} sm:mt-[15px] sm:ml-[25px]`}>
              ● STATUS::{speaker.status}
            </span>
          </div>

          <div className="mb-6 sm:mb-10">
            <span className="text-[9px] sm:text-[10px] font-black text-gray-400 block mb-2 uppercase tracking-[0.2em]">IDENTIFIED_ROLE</span>
            <h3 className="text-xl sm:text-2xl font-black uppercase italic border-l-4 border-terminal-red pl-4 sm:pl-6 leading-tight mb-3 sm:mb-4 break-words">
              {speaker.role}
            </h3>
            <div className="flex flex-wrap gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
               <span>NODE: {speaker.node}</span>
               <span className="opacity-30 hidden sm:inline">|</span>
               <span>CLEARANCE: {speaker.clearanceLevel || 'LVL_04'}</span>
            </div>
          </div>

          <div className="mb-6 sm:mb-10">
            <span className="text-[9px] sm:text-[10px] font-black text-gray-400 block mb-3 sm:mb-4 uppercase tracking-[0.2em]">SYSTEM_ABSTRACT</span>
            <p className="text-xs sm:text-sm font-mono leading-relaxed text-gray-700 lowercase italic break-words">
              {speaker.bio || 'no extended abstract available for this node. identifying data stream...'}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
          <button 
            type="button"
            className="flex-1 bg-black text-white py-2 sm:py-2.5 px-3 font-black text-[10px] sm:text-xs hover:bg-terminal-red transition-all transform active:scale-95 uppercase tracking-widest cursor-pointer border-2 border-black"
          >
            [ INITIATE_PROTOCOL ]
          </button>
          <div className="flex-1 border-2 border-black flex items-center justify-center p-2 sm:p-2.5 min-w-0">
             <span className="text-[9px] sm:text-[10px] md:text-xs font-black lowercase truncate w-full text-center">{speaker.handle}</span>
          </div>
        </div>

        {/* Footer Telemetry */}
        <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 text-[7px] sm:text-[8px] font-black text-gray-300 uppercase tracking-widest">
           <span>ENCRYPT: RSA_4096</span>
           <span>SYNC_LATENCY: 12ms</span>
        </div>
      </div>
    </div>
  </div>
  );
};

export default SpeakersArchivePage;

