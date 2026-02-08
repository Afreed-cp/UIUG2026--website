import React, { useEffect } from 'react';

interface DeepDiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin?: () => void;
  content?: string; // RTE HTML content from Umbraco
  joinButtonText?: string; // Button text from URL picker
  // Modal header configuration
  modalTitle?: string; // Main title (e.g., "UMBRACO_14_CORE")
  modalSubtitle?: string; // Subtitle (e.g., "ARCHITECTURE")
  technicalReportVersion?: string; // Technical report version (e.g., "TECHNICAL_REPORT_v.14.02")
  author?: string; // Author name
  speaker?: string; // Speaker name
  date?: string; // Date text
  node?: string; // Node text
  refId?: string; // Reference ID (e.g., "WRITING_UMBRACO_0x14_CORE")
  classifiedLabel?: string; // Classified label (e.g., "CLASSIFIED_INTEL")
}

const DeepDiveModal: React.FC<DeepDiveModalProps> = ({ 
  isOpen, 
  onClose, 
  onJoin, 
  content, 
  joinButtonText = '',
  modalTitle = 'UMBRACO_14_CORE',
  modalSubtitle = '',
  technicalReportVersion = 'TECHNICAL_REPORT_v.14.02',
  author = 'KERALA_HUB_INTELLIGENCE',
  speaker,
  date = '2024_Q4_SYNC',
  node = 'TVM_MAIN_BACKBONE',
  refId = 'WRITING_UMBRACO_0x14_CORE',
  classifiedLabel = 'CLASSIFIED_INTEL'
}) => {
  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[300] bg-terminal-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-8 animate-in zoom-in-95 duration-300 overflow-y-auto"
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-5xl min-h-[85vh] max-h-[95vh] sm:h-[85vh] bg-white text-black border-4 border-black flex flex-col relative overflow-hidden shadow-[20px_20px_0px_#FF0000] my-auto">
        
        {/* Document Meta Header */}
        <div className="bg-black text-white p-2 sm:p-3 px-3 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 text-[8px] sm:text-[9px] font-black tracking-[0.2em] sm:tracking-[0.4em]">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0">
             {classifiedLabel && <span className="text-terminal-red status-blink whitespace-nowrap">● {classifiedLabel}</span>}
             {refId && <span className="break-all sm:break-normal">REF_ID: {refId}</span>}
          </div>
          <button onClick={onClose} className="hover:text-terminal-red transition-colors whitespace-nowrap text-[8px] sm:text-[9px]">[ TERMINATE_SESSION_X ]</button>
        </div>

        {/* Tactical HUD Header */}
        <header className="p-3 sm:p-4 md:p-6 lg:p-8 xl:p-12 border-b-4 border-black relative overflow-hidden">
          <div className="absolute top-2 sm:top-3 md:top-4 lg:top-6 left-2 sm:left-3 md:left-4 lg:left-6 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border-t-2 border-l-2 border-terminal-red/30"></div>
          <div className="absolute top-2 sm:top-3 md:top-4 lg:top-6 right-2 sm:right-3 md:right-4 lg:right-6 w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 border-t-2 border-r-2 border-terminal-red/30"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 sm:gap-4 md:gap-6 relative z-10">
            <div className="w-full min-w-0 flex-shrink">
              {technicalReportVersion && (
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
                  <span className="w-6 sm:w-8 md:w-12 h-0.5 bg-terminal-red flex-shrink-0"></span>
                  <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black tracking-widest text-terminal-red uppercase break-words min-w-0">{technicalReportVersion}</span>
                </div>
              )}
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-black italic tracking-tighter uppercase leading-[0.85] sm:leading-[0.8] break-words">
                {modalTitle}<span className="text-terminal-red">.</span>
              </h1>
            </div>
            {(author || speaker || date || node) && (
              <div className="bg-gray-50 border-2 border-black p-2 sm:p-3 md:p-4 text-[7px] sm:text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-relaxed w-full md:w-auto flex-shrink-0 mt-3 md:mt-0">
                <div className="break-words">
                  {author && <>AUTHOR: {author}<br/></>}
                  {speaker && <>SPEAKER: {speaker}<br/></>}
                  {date && <>DATE: {date}<br/></>}
                  {node && <>NODE: {node}</>}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Scrollable Document Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-12 font-mono relative min-h-0">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

          <div className="max-w-4xl space-y-8 sm:space-y-10 md:space-y-12 relative z-10">
            {content ? (
              // Use Umbraco RTE content if provided
              <div 
                className="rte-content max-w-none lowercase text-gray-700 italic text-xs md:text-sm leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              // Fallback to default content
              <>
                {/* Section 1 */}
                <section>
                  <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter mb-4 sm:mb-6 border-b-2 border-black pb-2 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
                    <span>[01] THE_MANAGEMENT_API</span>
                    <span className="text-xs text-terminal-red">SECURITY::RESTRICTED</span>
                  </h2>
                  <p className="text-xs md:text-sm leading-relaxed mb-4 sm:mb-6 lowercase text-gray-700 italic break-words">
                    Umbraco 14 marks the definitive shift toward a decoupled, API-first management layer. The legacy WebForms/AngularJS backoffice is replaced by a high-performance Open-API implementation built on .NET 8.
                  </p>
                  <div className="bg-black p-4 sm:p-6 text-white text-[9px] sm:text-[10px] leading-relaxed space-y-2 border-l-8 border-terminal-red">
                     <div className="text-terminal-red font-black">» DEPLOYMENT_STRATEGY:</div>
                     <div>- Fully documented Swagger/OpenAPI endpoints</div>
                     <div>- JWT-based authorization protocols as standard</div>
                     <div>- Real-time node synchronization via WebHooks</div>
                  </div>
                </section>

                {/* Section 2 */}
                <section>
                  <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter mb-4 sm:mb-6 border-b-2 border-black pb-2 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
                    <span>[02] NEW_BACKOFFICE_FRAMEWORK</span>
                    <span className="text-xs text-terminal-red">INTERFACE::v4_ALPHA</span>
                  </h2>
                  <p className="text-xs md:text-sm leading-relaxed mb-4 sm:mb-6 lowercase text-gray-700 italic break-words">
                    Leveraging the Lit web-components standard, the new interface provides a modular, lighting-fast experience. Extensibility is now handled via a strictly-typed TypeScript SDK, reducing node-latency in production environments.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-black p-3 sm:p-4 bg-gray-50">
                       <span className="text-[9px] sm:text-[10px] font-black block mb-2 underline">CORE_BENEFIT: SPEED</span>
                       <p className="text-[8px] sm:text-[9px] opacity-60 italic">90% reduction in initial bundle size. DOM manipulation offloaded to native browser components.</p>
                    </div>
                    <div className="border-2 border-black p-3 sm:p-4 bg-gray-50">
                       <span className="text-[9px] sm:text-[10px] font-black block mb-2 underline">CORE_BENEFIT: SCALE</span>
                       <p className="text-[8px] sm:text-[9px] opacity-60 italic">Architected for multi-tenant enterprise clusters across the sub-continent.</p>
                    </div>
                  </div>
                </section>

                {/* Section 3 */}
                <section>
                  <h2 className="text-xl sm:text-2xl font-black italic tracking-tighter mb-4 sm:mb-6 border-b-2 border-black pb-2 flex flex-col sm:flex-row justify-between gap-2 sm:gap-0">
                    <span>[03] CLOUD_SYNCHRONIZATION</span>
                    <span className="text-xs text-terminal-red">SYNC::STABLE</span>
                  </h2>
                  <p className="text-xs md:text-sm leading-relaxed mb-4 lowercase text-gray-700 italic break-words">
                    Native integration with the Kerala Regional Cloud backbone. Umbraco 14 core has been optimized for high-density delivery nodes (CDN) with immediate cache-invalidation.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-6 border-2 border-dashed border-gray-300 bg-gray-50/50">
                     <div className="text-3xl sm:text-4xl">📡</div>
                     <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 break-words">
                        TRANSMITTING_PARITY_CHECK...<br/>
                        UMBRACO_14.2_NODE_KER_01 :: STATUS_OK
                     </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>

        {/* Tactical Footer */}
        <footer className="p-4 sm:p-6 bg-black text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
           <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 md:gap-12 text-[8px] sm:text-[9px] font-black tracking-widest w-full md:w-auto">
              <div className="flex flex-col">
                 <span className="text-gray-500 mb-1">DATA_HASH</span>
                 <span className="break-all sm:break-normal">SHA_512_0x44F2...</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-gray-500 mb-1">ENCRYPTION</span>
                 <span className="text-terminal-red">RSA_4096_SIGNED</span>
              </div>
           </div>
           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
             {joinButtonText && (
               <button 
                 onClick={onJoin}
                 className="flex-1 md:flex-none border-2 border-white text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 font-black text-xs sm:text-sm hover:bg-white hover:text-black transition-all uppercase tracking-widest whitespace-nowrap"
               >
                 [ {joinButtonText} ]
               </button>
             )}
             <button 
               onClick={onClose}
               className="flex-1 md:flex-none bg-terminal-red text-white px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 font-black text-xs sm:text-sm hover:bg-white hover:text-terminal-black transition-all shadow-[4px_4px_0px_#330000] sm:shadow-[6px_6px_0px_#330000] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase whitespace-nowrap"
             >
               [ ACKNOWLEDGE_&_CLOSE ]
             </button>
           </div>
        </footer>

        {/* Decorative HUD Scanline */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[400] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#000_3px)]"></div>
      </div>
      
      {/* Styles for RTE content */}
      <style>{`
        .rte-content h1,
        .rte-content h2,
        .rte-content h3 {
          font-family: inherit;
          font-weight: 900;
          font-style: italic;
          text-transform: uppercase;
          letter-spacing: -0.02em;
          margin-top: 2rem;
          margin-bottom: 1.5rem;
        }
        .rte-content h2 {
          font-size: 1.5rem;
          border-bottom: 2px solid #000;
          padding-bottom: 0.5rem;
        }
        .rte-content p {
          margin-bottom: 1.5rem;
        }
        .rte-content ul,
        .rte-content ol {
          margin-left: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .rte-content li {
          margin-bottom: 0.5rem;
        }
        .rte-content strong {
          font-weight: 900;
        }
        .rte-content a {
          color: #FF0000;
          text-decoration: underline;
        }
        .rte-content a:hover {
          color: #000;
        }
        .rte-content blockquote {
          border-left: 8px solid #FF0000;
          background: #000;
          color: #fff;
          padding: 1.5rem;
          margin: 1.5rem 0;
        }
      `}</style>
    </div>
  );
};

export default DeepDiveModal;

