import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';

interface SplashScreenProps {
  onComplete?: () => void;
  showAlways?: boolean; // If true, doesn't hide automatically
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, showAlways = false }) => {
  const { language } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const [scale, setScale] = useState(false);

  useEffect(() => {
    // Trigger scale animation shortly after mounting
    const timerScale = setTimeout(() => {
      setScale(true);
    }, 100);

    if (showAlways) return;

    // Fade out splash screen after 3.2 seconds, and call onComplete after 3.7 seconds
    const timerFade = setTimeout(() => {
      setIsVisible(false);
    }, 3200);

    const timerComplete = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3700);

    return () => {
      clearTimeout(timerScale);
      clearTimeout(timerFade);
      clearTimeout(timerComplete);
    };
  }, [onComplete, showAlways]);

  if (!isVisible && !showAlways) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#0B1329] via-[#0F172A] to-[#1E3A8A] text-white transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Background Soft Lighting and Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-500/20 rounded-full blur-[80px] animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[250px] h-[250px] bg-orange-500/10 rounded-full blur-[60px]"></div>

        {/* Floating Particles */}
        <div className="absolute inset-0 opacity-40">
          {[...Array(20)].map((_, i) => {
            const size = Math.random() * 4 + 2;
            const delay = Math.random() * 5;
            const duration = Math.random() * 6 + 6;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            return (
              <div
                key={i}
                className="absolute bg-white/40 rounded-full animate-float-particle"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}%`,
                  top: `${top}%`,
                  animationDelay: `${delay}s`,
                  animationDuration: `${duration}s`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Top spacing or signal indicator simulation (for mobile feel) */}
      <div className="w-full flex justify-between px-6 py-4 text-white/40 text-xs font-semibold z-10 select-none">
        <span>KaushalSetu Startup</span>
        <span>v2.1.0</span>
      </div>

      {/* Main Central Brand elements */}
      <div 
        className={`flex flex-col items-center justify-center flex-1 transition-all duration-1000 ease-out z-10 ${
          scale ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Glow backdrop behind logo */}
        <div className="relative flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-orange-500/20 rounded-full blur-2xl animate-pulse"></div>

          {/* KS Handshake Logo SVG */}
          <svg
            viewBox="0 0 240 160"
            className="w-48 h-48 drop-shadow-[0_10px_25px_rgba(37,99,235,0.4)] relative z-10"
          >
            <defs>
              <linearGradient id="blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient id="orange-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F97316" />
                <stop offset="100%" stopColor="#EA580C" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Letter K (Orange) */}
            {/* Vertical stem */}
            <path
              d="M 50,30 L 50,130"
              stroke="url(#orange-grad)"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            {/* Bottom diagonal of K */}
            <path
              d="M 50,85 L 85,120"
              stroke="url(#orange-grad)"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            {/* Sleeve/Arm pointing to handshake from K */}
            <path
              d="M 50,80 C 65,72 80,68 95,68"
              stroke="url(#orange-grad)"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />

            {/* Letter S (Blue) */}
            {/* Bottom half of S */}
            <path
              d="M 125,72 C 145,72 185,74 185,100 C 185,125 155,130 135,130"
              stroke="url(#blue-grad)"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />
            {/* Top half of S going into handshake */}
            <path
              d="M 180,35 C 160,30 135,32 135,52 C 135,62 145,68 150,68"
              stroke="url(#blue-grad)"
              strokeWidth="16"
              strokeLinecap="round"
              fill="none"
            />

            {/* Handshake in the center (Overlap point: 95 - 135) */}
            <g transform="translate(85, 50)" filter="url(#glow)">
              {/* Shaking Hands Details */}
              {/* Left hand cuff (Orange) */}
              <path
                d="M 8,18 L 16,18"
                stroke="#EA580C"
                strokeWidth="6"
                strokeLinecap="round"
              />
              
              {/* Right hand cuff (Blue) */}
              <path
                d="M 50,18 L 42,18"
                stroke="#1D4ED8"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Handshake fingers / clasped hands */}
              {/* Base hands connector */}
              <rect x="18" y="10" width="22" height="16" rx="8" fill="#FDBA74" />
              
              {/* Clasp outline / fingers detail */}
              <path
                d="M 22,12 C 24,10 26,10 28,12 C 29,14 27,16 25,16"
                stroke="#E28743"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M 26,16 C 28,14 30,14 32,16 C 33,18 31,20 29,20"
                stroke="#E28743"
                strokeWidth="2.5"
                fill="none"
              />
              <path
                d="M 30,20 C 32,18 34,18 36,20 C 37,22 35,24 33,24"
                stroke="#E28743"
                strokeWidth="2.5"
                fill="none"
              />

              {/* Shaking Handshake thumbs crossing */}
              <path
                d="M 20,8 C 22,12 28,12 28,8"
                stroke="#F97316"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </svg>
        </div>

        {/* Text and Tagline */}
        <div className="text-center mt-4 px-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)] uppercase">
            KAUSHALSETU
          </h1>
          <p className="mt-2 text-sm md:text-base font-medium text-blue-200/90 tracking-wide max-w-sm mx-auto">
            {language === 'kn'
              ? 'ಕೌಶಲ್ಯಗಳ ಸಬಲೀಕರಣ, ಅವಕಾಶಗಳ ಜೋಡಣೆ'
              : 'Empowering Skills, Connecting Opportunities'}
          </p>
        </div>
      </div>

      {/* Ecosystem illustration card at the bottom */}
      <div 
        className={`w-full max-w-sm px-6 pb-6 transition-all duration-1000 delay-300 ease-out z-10 ${
          scale ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}
      >
        <div className="relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl overflow-hidden shadow-2xl">
          {/* Subtle light reflection on card */}
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 skew-y-12 pointer-events-none" />

          {/* Clean Modern Ecosystem SVG illustration */}
          <svg viewBox="0 0 320 160" className="w-full h-auto drop-shadow-md">
            {/* Soft backdrop circle */}
            <circle cx="160" cy="110" r="80" fill="rgba(37,99,235,0.15)" />
            
            {/* Friendly professional characters - vector shapes */}
            {/* 1. Job Seeker (left side) */}
            <g transform="translate(60, 60)">
              {/* Torso / Clothes */}
              <path d="M 10,60 C 10,40 40,40 40,60 Z" fill="#F97316" />
              {/* Head */}
              <circle cx="25" cy="30" r="12" fill="#FED7AA" />
              {/* Hair */}
              <path d="M 12,28 C 12,18 38,18 38,28 C 38,20 12,20 12,28 Z" fill="#1E293B" />
              {/* Laptop in hand */}
              <path d="M 30,52 L 48,52 L 46,58 L 28,58 Z" fill="#CBD5E1" />
              <line x1="30" y1="52" x2="25" y2="60" stroke="#94A3B8" strokeWidth="2" />
            </g>

            {/* 2. Business Owner / Employer (right side) */}
            <g transform="translate(200, 60)">
              {/* Torso / Suit */}
              <path d="M 10,60 C 10,42 40,42 40,60 Z" fill="#2563EB" />
              {/* Tie */}
              <path d="M 23,42 L 27,42 L 28,55 L 25,58 L 22,55 Z" fill="#F97316" />
              {/* Head */}
              <circle cx="25" cy="30" r="12" fill="#FEE2E2" />
              {/* Hair */}
              <path d="M 13,26 C 13,18 37,18 37,26" stroke="#475569" strokeWidth="3" fill="none" />
              {/* Shop/Hiring clipboard */}
              <rect x="2" y="45" width="16" height="20" rx="2" fill="#F8FAFC" />
              <rect x="4" y="43" width="12" height="3" fill="#94A3B8" />
              <line x1="6" y1="50" x2="14" y2="50" stroke="#22C55E" strokeWidth="1.5" />
              <line x1="6" y1="55" x2="12" y2="55" stroke="#94A3B8" strokeWidth="1.5" />
            </g>

            {/* 3. Center Hiring Ecosystem / Connecting Hands / Lightbulb */}
            <g transform="translate(130, 40)">
              {/* Connection lines */}
              <path d="M -40,40 Q 30,10 100,40" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4,4" fill="none" />
              
              {/* Lightbulb (symbolizing skills/opportunities) */}
              <g transform="translate(20, -5)" className="animate-bounce">
                {/* Yellow glow */}
                <circle cx="10" cy="10" r="12" fill="rgba(234,179,8,0.2)" />
                {/* Bulb */}
                <circle cx="10" cy="8" r="8" fill="#FACC15" />
                <path d="M 7,14 L 13,14 L 11,18 L 9,18 Z" fill="#94A3B8" />
                {/* Rays */}
                <line x1="10" y1="-2" x2="10" y2="1" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="1" y1="8" x2="4" y2="8" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="16" y1="8" x2="19" y2="8" stroke="#FACC15" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Speech bubble: "Hired!" or Local symbol */}
              <g transform="translate(25, 45)">
                <rect x="-10" y="-12" width="40" height="18" rx="5" fill="#22C55E" />
                <polygon points="5,6 10,6 7,10" fill="#22C55E" />
                <text x="10" y="0" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">HIRED</text>
              </g>
            </g>
          </svg>

          {/* Description of connection */}
          <p className="text-center text-xs text-blue-200/70 mt-2 font-medium">
            {language === 'kn' 
              ? 'ಉದ್ಯೋಗ ಆಕಾಂಕ್ಷಿಗಳು ಮತ್ತು ಸ್ಥಳೀಯ ಉದ್ಯಮಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ' 
              : 'Connecting Job Seekers & Local Businesses'}
          </p>
        </div>
      </div>

      {/* Loading Indicator at bottom center */}
      <div className="pb-10 flex flex-col items-center justify-center z-10">
        <div className="relative flex items-center justify-center">
          {/* Radial outer glow */}
          <div className="absolute w-12 h-12 bg-orange-500/30 rounded-full blur-md"></div>
          {/* Spinner */}
          <div className="w-9 h-9 border-[3.5px] border-blue-500/30 border-t-orange-500 rounded-full animate-spin"></div>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-blue-300/60 mt-3 font-semibold">
          {language === 'kn' ? 'ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...' : 'Loading Opportunities...'}
        </span>
      </div>

      {/* CSS Animation injected within the component */}
      <style>{`
        @keyframes float-particle {
          0% {
            transform: translateY(0px) scale(0.8);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-200px) scale(1.2);
            opacity: 0;
          }
        }
        .animate-float-particle {
          animation-name: float-particle;
          animation-iteration-count: infinite;
          animation-timing-function: linear;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
