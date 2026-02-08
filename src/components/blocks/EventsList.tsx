import React, { useState } from 'react';
import type { Event } from '../../types';
import TalksArchive from './TalksArchive';

interface EventsListProps {
  events: Event[];
  allEvents: Event[];
  title?: string;
}

const EventsList: React.FC<EventsListProps> = ({ events, allEvents, title }) => {
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  return (
    <>
      <section className="mt-4 grid-layout border-l border-r border-terminal-gray" id="console">
        {/* Header Section */}
        <div className="col-span-12 p-3 sm:p-4 bg-terminal-gray/10 cell-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
            <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border border-terminal-white text-[8px] sm:text-[10px]">CMD</span>
            <span className="break-words">{title}</span>
          </h2>
          <button 
            onClick={() => setIsArchiveOpen(true)}
            className="text-[9px] sm:text-[10px] border border-terminal-white px-2 sm:px-3 py-1 hover:bg-terminal-white hover:text-terminal-black transition-all font-bold whitespace-nowrap"
          >
            [VIEW_ALL_TALKS]
          </button>
        </div>
        
        {/* Events List */}
        {events.map((event, idx) => (
          <React.Fragment key={event.id}>
            <div className="col-span-12 sm:col-span-1 p-2 sm:p-4 cell-border text-terminal-red font-bold flex items-center justify-center sm:justify-center text-xs sm:text-sm">
              {String(idx + 1).padStart(3, '0')}
            </div>
            <div className="col-span-12 sm:col-span-8 p-3 sm:p-4 cell-border">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-2">
                <span className="bg-terminal-white text-terminal-black px-1 sm:px-2 py-0.5 font-bold text-[9px] sm:text-xs whitespace-nowrap">{event.category}</span>
                <span className="text-terminal-gray text-[9px] sm:text-xs hidden sm:inline">{event.timestamp}</span>
              </div>
              <a className="text-base sm:text-lg md:text-xl font-bold hover:bg-terminal-white hover:text-terminal-black block transition-colors break-words" href="#">
                {event.title}
              </a>
              <div className="mt-3 sm:mt-4 flex gap-4 sm:gap-6 text-[9px] sm:text-[10px]">
                <span className="hover:text-terminal-red cursor-pointer">[REPLY]</span>
                <span className="hover:text-terminal-red cursor-pointer">[SHARE]</span>
                <span className="hover:text-terminal-red cursor-pointer">[FORK]</span>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-3 p-3 sm:p-4 cell-border text-left sm:text-right flex flex-col justify-center">
              <span className="block truncate text-xs sm:text-sm">USER: {event.user}</span>
              <span className={`text-xs sm:text-sm ${event.status === 'UNSTABLE' ? 'text-terminal-red' : 'text-terminal-white opacity-60'}`}>
                {event.status}
              </span>
            </div>
          </React.Fragment>
        ))}
      </section>

      <TalksArchive 
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        events={allEvents}
      />
    </>
  );
};

export default EventsList;

