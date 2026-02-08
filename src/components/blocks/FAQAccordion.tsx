import React, { useState } from 'react';

interface FAQItem {
  id: string;
  query: string;
  response: string;
  order: number;
}

interface FAQAccordionProps {
  title?: string;
  queryCount?: number;
  faqs?: FAQItem[];
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({ 
  title = 'FREQUENT_SYSTEM_QUERIES_V.1',
  queryCount = 0,
  faqs = []
}) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleQuery = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      <div className="p-3 sm:p-4 bg-terminal-gray/20 cell-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-terminal-gray">
        <h2 className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2">
          <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border border-terminal-white text-[8px] sm:text-[10px]">QRY</span>
          <span className="break-words">{title}</span>
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[8px] sm:text-[9px] font-bold text-terminal-gray">
          <span className="whitespace-nowrap">INDEXED_QUERIES: {String(queryCount || faqs.length).padStart(3, '0')}</span>
          <span className="status-blink text-terminal-red whitespace-nowrap">● KNOWLEDGE_BASE: ONLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-terminal-gray">
        {faqs.map((item) => (
          <div key={item.id} className="group">
            <button 
              onClick={() => toggleQuery(item.id)}
              className="w-full text-left p-4 sm:p-5 md:p-6 flex items-start sm:items-center justify-between gap-3 sm:gap-4 hover:bg-terminal-white/5 transition-colors group-active:bg-terminal-red/10"
            >
              <div className="flex items-start sm:items-center gap-3 sm:gap-4 md:gap-6 flex-1 min-w-0 pr-4 sm:pr-6 overflow-hidden">
                <span className="text-terminal-red font-bold text-[9px] sm:text-[10px] w-8 sm:w-12 flex-shrink-0">{String(item.order || 0).padStart(2, '0')}</span>
                <span className="text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-lg font-black italic tracking-tighter uppercase group-hover:text-terminal-red transition-colors break-words overflow-wrap-anywhere leading-tight">
                  {item.query}
                </span>
              </div>
              <span className={`text-base sm:text-lg md:text-xl transition-transform duration-300 flex-shrink-0 ${openId === item.id ? 'rotate-45 text-terminal-red' : ''}`}>
                +
              </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openId === item.id ? 'max-h-[500px] sm:max-h-64' : 'max-h-0'}`}>
              <div className="p-4 sm:p-6 md:p-8 pt-0 border-l-4 border-terminal-red ml-4 sm:ml-6 mb-3 sm:mb-4">
                <div className="bg-terminal-gray/5 p-3 sm:p-4 border border-terminal-gray/20 relative">
                  <div className="absolute -top-2 -left-2 w-1 h-1 bg-terminal-red"></div>
                  <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-terminal-red"></div>
                  <p className="text-[10px] sm:text-xs leading-relaxed text-terminal-white/80 lowercase italic font-mono break-words">
                    <span className="text-terminal-red font-bold uppercase not-italic mr-2">/RESPONSE:</span>
                    {item.response}
                  </p>
                  <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 text-[7px] sm:text-[8px] font-bold text-terminal-gray uppercase">
                    <span className="break-words">SOURCE_NODE: SYS_DB_01</span>
                    <span className="break-words">VERIFIED_BY: HUB_INTELLIGENCE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative footer for the section */}
      <div className="p-3 sm:p-4 border-t border-terminal-gray flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 bg-terminal-gray/10">
        <div className="flex gap-1.5 sm:gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`w-1 h-3 sm:h-4 bg-terminal-gray/30 ${i % 3 === 0 ? 'status-blink' : ''}`}></div>
          ))}
        </div>
        <span className="text-[8px] sm:text-[9px] font-bold text-terminal-gray tracking-widest uppercase text-center sm:text-right break-words">
          [ END_OF_KNOWLEDGE_BUFFER ]
        </span>
      </div>
    </>
  );
};

export default FAQAccordion;

