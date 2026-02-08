import React from 'react';
import type { Event } from '../../types';

interface TalksArchiveProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
}

const TalksArchive: React.FC<TalksArchiveProps> = ({ isOpen, onClose, events }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-terminal-black/95 flex items-center justify-center p-2 sm:p-4 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-5xl h-[90vh] sm:h-[85vh] border-2 border-terminal-white bg-terminal-black flex flex-col shadow-[0_0_40px_rgba(255,255,255,0.1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-6 border-b-2 border-terminal-white">
          <div className="flex flex-col">
            <span className="font-bold text-xl sm:text-2xl tracking-tighter">ARCHIVE_EXPLORER_V1.0</span>
            <span className="text-[9px] sm:text-[10px] text-terminal-gray font-bold tracking-widest">PATH: ROOT/LOGS/COMMUNITY_TALKS/*</span>
          </div>
          <button 
            onClick={onClose} 
            className="btn-brutal text-xs sm:text-sm font-bold bg-terminal-white text-terminal-black hover:bg-terminal-red hover:text-terminal-white border-none px-4 py-2 whitespace-nowrap"
          >
            [CLOSE_ARCHIVE_X]
          </button>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 sm:gap-4 pb-2 border-b border-terminal-gray text-[9px] sm:text-[10px] font-bold text-terminal-gray uppercase">
            <div className="col-span-1">ID</div>
            <div className="col-span-2">CATEGORY</div>
            <div className="col-span-5">SUBJECT_LINE</div>
            <div className="col-span-2">CONTRIBUTOR</div>
            <div className="col-span-2 text-right">STATUS</div>
          </div>

          {/* List Items */}
          {events.length > 0 ? events.map((event, idx) => (
            <div 
              key={event.id} 
              className="grid grid-cols-12 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-terminal-gray/30 items-center hover:bg-terminal-white/5 transition-colors group"
            >
              <div className="col-span-1 text-terminal-red font-bold text-xs sm:text-sm">
                {String(idx + 1).padStart(3, '0')}
              </div>
              <div className="col-span-2">
                <span className="border border-terminal-white px-1 text-[9px] sm:text-[10px] group-hover:bg-terminal-white group-hover:text-terminal-black transition-colors break-words">
                  {event.category}
                </span>
              </div>
              <div className="col-span-5 font-bold truncate text-xs sm:text-sm break-words">
                {event.title}
              </div>
              <div className="col-span-2 text-[9px] sm:text-[10px] opacity-60 truncate">
                {event.user}
              </div>
              <div className="col-span-2 text-right">
                <span className={`text-[9px] sm:text-[10px] font-bold ${event.status === 'UNSTABLE' ? 'text-terminal-red status-blink' : 'opacity-80'}`}>
                  {event.status}
                </span>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-terminal-gray animate-pulse">
              [ EMPTY_SET: NO_RECORDS_FOUND_IN_CURRENT_BUFFER ]
            </div>
          )}

          {/* Simulated additional archive entries for density */}
          {[...Array(5)].map((_, i) => (
            <div key={`dummy-${i}`} className="grid grid-cols-12 gap-2 sm:gap-4 py-3 sm:py-4 border-b border-terminal-gray/10 items-center opacity-20 grayscale">
              <div className="col-span-1 text-xs">---</div>
              <div className="col-span-2 text-[9px] sm:text-[10px]">LEGACY</div>
              <div className="col-span-5 italic text-[9px] sm:text-[10px] truncate">ENCRYPTED_ARCHIVE_DATA_NODE_{1024 + i}</div>
              <div className="col-span-2 text-[9px] sm:text-[10px]">SYSTEM</div>
              <div className="col-span-2 text-right text-[9px] sm:text-[10px]">OFFLINE</div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-terminal-gray bg-terminal-gray/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-[8px] sm:text-[9px] font-bold text-terminal-gray">
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <span>TOTAL_RECORDS: {events.length + 5}</span>
            <span>ENCRYPTION: RSA_4096</span>
          </div>
          <div className="flex flex-wrap gap-3 sm:gap-4">
            <span className="status-blink text-terminal-red">● LIVE_FEED_CONNECTED</span>
            <span className="text-[7px] sm:text-[8px]">{new Date().toISOString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalksArchive;

