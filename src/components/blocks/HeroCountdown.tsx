import React, { useState, useEffect } from 'react';

const HeroCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
    millis: '00'
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(23 - now.getHours()).padStart(2, '0');
      const m = String(59 - now.getMinutes()).padStart(2, '0');
      const s = String(59 - now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(Math.random() * 99)).padStart(2, '0');
      setTimeLeft({ hours: h, minutes: m, seconds: s, millis: ms });
    }, 40);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-4xl md:text-8xl font-black tracking-tighter flex items-baseline gap-4 text-terminal-white drop-shadow-[0_0_25px_rgba(255,0,0,0.2)] leading-none">
      <div className="flex flex-col items-center">
        <span>{timeLeft.hours}</span>
        <span className="text-[10px] text-terminal-gray tracking-widest mt-1">HOURS</span>
      </div>
      <span className="text-terminal-red status-blink">:</span>
      <div className="flex flex-col items-center">
        <span>{timeLeft.minutes}</span>
        <span className="text-[10px] text-terminal-gray tracking-widest mt-1">MINUTES</span>
      </div>
      <span className="text-terminal-red status-blink">:</span>
      <div className="flex flex-col items-center">
        <span>{timeLeft.seconds}</span>
        <span className="text-[10px] text-terminal-gray tracking-widest mt-1">SECONDS</span>
      </div>
      <span className="text-xl md:text-3xl text-terminal-red font-bold self-start mt-2 opacity-50">.{timeLeft.millis}</span>
    </div>
  );
};

export default HeroCountdown;

