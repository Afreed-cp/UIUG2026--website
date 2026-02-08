import React, { useState } from 'react';

interface NewsletterFormProps {
  title?: string;
  headline?: string;
  description?: string;
  buttonText?: string;
  placeholderText?: string;
  successMessage?: string;
  encryptionText?: string;
  zeroSpamText?: string;
  bufferStatusText?: string;
  dataUplinkText?: string;
  latencyText?: string;
  endOfBroadcastText?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({
  title = 'NETWORK_BROADCAST_SUBSCRIPTION_V.2',
  headline = 'ENLIST_IN_THE_DATA_BURST.',
  description = 'abstract — receive periodic technical telemetry, architectural breakthroughs, and node synchronization updates. pure technical utility. no metadata bloat.',
  buttonText = '[ ESTABLISH_LINK ]',
  placeholderText = 'ENTER_NODE_ENDPOINT_ADDRESS_',
  successMessage = 'LINK_ESTABLISHED_SUCCESSFULLY_>>>',
  encryptionText = 'ENCRYPTION: AES_256_ACTIVE',
  zeroSpamText = 'ZERO_SPAM_PROTOCOL_v.4',
  bufferStatusText = 'READY_FOR_HANDSHAKE',
  dataUplinkText = 'DATA_UPLINK_ARRAY_v2.09',
  latencyText = 'LATENCY: 12ms',
  endOfBroadcastText = 'END_OF_BROADCAST_SECTION',
}) => {
  const [status, setStatus] = useState<'IDLE' | 'SYNCING' | 'SUCCESS'>('IDLE');
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('SYNCING');
    
    // Simulate encryption handshake/subscription sync
    setTimeout(() => {
      setStatus('SUCCESS');
      setTimeout(() => {
        setStatus('IDLE');
        setEmail('');
      }, 4000);
    }, 2000);
  };

  return (
    <section className="mt-4 border-l border-r border-terminal-gray bg-terminal-black text-terminal-white overflow-hidden" id="broadcast">
      {/* Header Bar */}
      <div className="p-3 sm:p-4 bg-terminal-gray/20 cell-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-terminal-gray">
        <h2 className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold flex items-center gap-2 min-w-0 flex-1">
          <span className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center border border-terminal-red text-terminal-red text-[8px] sm:text-[10px] flex-shrink-0">BCS</span>
          <span className="break-words overflow-wrap-anywhere leading-tight">{title}</span>
        </h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[8px] sm:text-[9px] font-bold text-terminal-gray flex-shrink-0">
          <span className="status-blink text-terminal-red whitespace-nowrap">● UPLINK_STANDBY</span>
          <span className="hidden sm:inline whitespace-nowrap">OS::TERM_PROTO_8.4</span>
        </div>
      </div>

      {/* Main Tactical Layout */}
      <div className="p-4 sm:p-6 md:p-8 lg:p-12 relative group bg-terminal-black">
        {/* Background Texture - Carbon fiber pattern for dark mode */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Top Section: Headline and Meta */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
            <div className="flex-1">
              <div className="inline-block border border-terminal-red px-2 py-0.5 text-[7px] sm:text-[8px] font-bold text-terminal-red mb-4 sm:mb-6">
                MANDATORY_COMMS_LINK
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[76px] font-black italic tracking-tighter uppercase leading-[0.8] mb-0 text-terminal-white break-words">
                {headline}<span className="text-terminal-red">.</span>
              </h3>
            </div>
            {description && (
              <div className="lg:w-1/3 lg:pb-2">
                <p className="text-[9px] sm:text-[10px] font-mono text-terminal-gray leading-relaxed lowercase italic opacity-80 border-l border-terminal-gray pl-3 sm:pl-4 break-words">
                  {description}
                </p>
              </div>
            )}
          </div>

          {/* Interaction Console: Command Bar Design */}
          <div className="relative">
            {status === 'SUCCESS' ? (
              <div className="bg-terminal-red text-white p-4 sm:p-6 md:p-8 text-center flex flex-col items-center justify-center min-h-[80px] sm:h-24 border border-terminal-red shadow-[0_0_30px_rgba(255,0,0,0.2)] animate-pulse italic font-black text-base sm:text-lg md:text-xl lg:text-2xl uppercase tracking-tighter break-words">
                {successMessage}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col lg:flex-row border-2 sm:border-4 border-terminal-gray bg-terminal-black shadow-[6px_6px_0px_#141414] sm:shadow-[12px_12px_0px_#141414] focus-within:border-terminal-red transition-colors group/form">
                {/* Input Area */}
                <div className="flex-1 relative flex items-center border-b-2 sm:border-b-4 lg:border-b-0 lg:border-r-4 border-terminal-gray group-focus-within/form:border-terminal-red transition-colors">
                  <div className="absolute left-3 sm:left-6 text-terminal-red font-bold text-sm sm:text-lg hidden sm:block">CMD&gt;</div>
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholderText}
                    className="w-full bg-transparent p-4 sm:p-6 md:p-8 sm:pl-16 text-sm sm:text-base md:text-lg font-black focus:outline-none placeholder:opacity-20 uppercase tracking-widest text-terminal-white"
                  />
                  {/* Internal Signal Strength indicator */}
                  <div className="hidden sm:flex absolute right-4 sm:right-6 items-end gap-1 h-6">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`w-1.5 bg-terminal-red transition-all duration-300 ${email.length > (i * 3) ? 'opacity-100' : 'opacity-20'}`} style={{ height: `${20 + (i * 20)}%` }}></div>
                    ))}
                  </div>
                </div>

                {/* Button Area */}
                <button 
                  disabled={status === 'SYNCING'}
                  className="w-full lg:w-[320px] bg-terminal-white text-terminal-black font-black text-sm sm:text-base md:text-lg lg:text-xl hover:bg-terminal-red hover:text-white transition-all flex items-center justify-center gap-2 sm:gap-4 py-4 sm:py-6 md:py-8 lg:py-0 disabled:opacity-50 active:translate-y-1 relative group/btn overflow-hidden whitespace-nowrap"
                >
                  {status === 'SYNCING' ? (
                    <span className="status-blink italic flex items-center gap-2 sm:gap-3 relative z-10 text-xs sm:text-sm md:text-base">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-terminal-black border-t-transparent animate-spin rounded-full"></span>
                      SYNCING...
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10 text-xs sm:text-sm md:text-base lg:text-lg">{buttonText}</span>
                      <span className="relative z-10 group-hover/btn:translate-x-2 transition-transform text-xs sm:text-sm md:text-base lg:text-lg">{'>>>'}</span>
                      <div className="absolute left-0 top-0 h-full w-0 bg-terminal-red group-hover/btn:w-full transition-all duration-300"></div>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Sub-Console Metadata */}
            <div className="flex flex-wrap justify-between items-center mt-3 sm:mt-4 px-2 text-[8px] sm:text-[9px] font-black text-terminal-gray uppercase tracking-[0.1em] sm:tracking-[0.2em] gap-2 sm:gap-0">
              <div className="flex flex-wrap gap-3 sm:gap-6">
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 bg-terminal-red rounded-full status-blink"></span>
                  {encryptionText}
                </span>
                {zeroSpamText && <span className="whitespace-nowrap">{zeroSpamText}</span>}
              </div>
              {bufferStatusText && (
                <div className="hidden md:block whitespace-nowrap">
                  BUFFER_STATUS: <span className="text-terminal-white">{bufferStatusText}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Data Strip */}
      <div className="p-2 sm:p-3 bg-terminal-gray/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 text-[7px] sm:text-[8px] font-bold text-terminal-gray tracking-[0.3em] sm:tracking-[0.4em] border-t border-terminal-gray">
        <div className="flex flex-wrap gap-3 sm:gap-4 items-center">
          <span className="text-terminal-red break-words">{dataUplinkText}</span>
          <span className="opacity-30 hidden sm:inline">|</span>
          <span className="whitespace-nowrap">{latencyText}</span>
        </div>
        <div className="flex gap-1.5 sm:gap-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className={`w-0.5 h-1 sm:h-1.5 bg-terminal-gray/20 ${i % 3 === 0 ? 'bg-terminal-red/40' : ''}`}></div>
          ))}
        </div>
        {endOfBroadcastText && (
          <span className="hidden sm:inline uppercase break-words">{endOfBroadcastText}</span>
        )}
      </div>
    </section>
  );
};

export default NewsletterForm;

