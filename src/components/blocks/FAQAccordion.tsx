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
      <div className="p-4 bg-terminal-gray/20 cell-border flex items-center justify-between border-b border-terminal-gray">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center border border-terminal-white text-[10px]">QRY</span>
          {title}
        </h2>
        <div className="flex items-center gap-4 text-[9px] font-bold text-terminal-gray">
          <span>INDEXED_QUERIES: {String(queryCount || faqs.length).padStart(3, '0')}</span>
          <span className="status-blink text-terminal-red">● KNOWLEDGE_BASE: ONLINE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 divide-y divide-terminal-gray">
        {faqs.map((item) => (
          <div key={item.id} className="group">
            <button 
              onClick={() => toggleQuery(item.id)}
              className="w-full text-left p-6 flex items-center justify-between hover:bg-terminal-white/5 transition-colors group-active:bg-terminal-red/10"
            >
              <div className="flex items-center gap-6">
                <span className="text-terminal-red font-bold text-[10px] w-12">{String(item.order || 0).padStart(2, '0')}</span>
                <span className="text-sm md:text-lg font-black italic tracking-tighter uppercase group-hover:text-terminal-red transition-colors">
                  {item.query}
                </span>
              </div>
              <span className={`text-xl transition-transform duration-300 ${openId === item.id ? 'rotate-45 text-terminal-red' : ''}`}>
                +
              </span>
            </button>
            
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openId === item.id ? 'max-h-64' : 'max-h-0'}`}>
              <div className="p-8 pt-0 border-l-4 border-terminal-red ml-6 mb-4">
                <div className="bg-terminal-gray/5 p-4 border border-terminal-gray/20 relative">
                  <div className="absolute -top-2 -left-2 w-1 h-1 bg-terminal-red"></div>
                  <div className="absolute -bottom-2 -right-2 w-1 h-1 bg-terminal-red"></div>
                  <p className="text-xs leading-relaxed text-terminal-white/80 lowercase italic font-mono">
                    <span className="text-terminal-red font-bold uppercase not-italic mr-2">/RESPONSE:</span>
                    {item.response}
                  </p>
                  <div className="mt-4 flex justify-between text-[8px] font-bold text-terminal-gray uppercase">
                    <span>SOURCE_NODE: SYS_DB_01</span>
                    <span>VERIFIED_BY: HUB_INTELLIGENCE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative footer for the section */}
      <div className="p-4 border-t border-terminal-gray flex justify-between items-center bg-terminal-gray/10">
        <div className="flex gap-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`w-1 h-4 bg-terminal-gray/30 ${i % 3 === 0 ? 'status-blink' : ''}`}></div>
          ))}
        </div>
        <span className="text-[9px] font-bold text-terminal-gray tracking-widest uppercase">
          [ END_OF_KNOWLEDGE_BUFFER ]
        </span>
      </div>
    </>
  );
};

export default FAQAccordion;

