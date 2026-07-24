"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import './nlyk.css';

// Anime Character SVG Component - Evening Version
const AnimeGirl = ({ mood }: { mood: 'happy' | 'excited' | 'shy' | 'surprised' }) => {
  const getEyeOffset = () => {
    switch (mood) {
      case 'shy': return 2;
      default: return 0;
    }
  };
  
  const getEyeWidth = () => {
    switch (mood) {
      case 'surprised': return 16;
      default: return 12;
    }
  };
  
  const getEyeHeight = () => {
    switch (mood) {
      case 'excited': return 18;
      case 'shy': return 12;
      case 'surprised': return 20;
      default: return 0;
    }
  };
  
  const eyeOffset = getEyeOffset();
  const eyeWidth = getEyeWidth();
  const eyeHeight = getEyeHeight();
  const isClosed = mood === 'happy';
  const showShine = mood === 'excited';

  return (
    <svg viewBox="0 0 200 260" className="w-52 h-64 md:w-72 md:h-88 drop-shadow-2xl filter">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Hair Back - Flowing */}
      <ellipse cx="100" cy="130" rx="85" ry="100" fill="#2D1B4E" />
      <ellipse cx="45" cy="150" rx="40" ry="60" fill="#1E1238" />
      <ellipse cx="155" cy="150" rx="40" ry="60" fill="#1E1238" />
      
      {/* Face */}
      <ellipse cx="100" cy="140" rx="65" ry="70" fill="#FFE8DC" />
      
      {/* Blush */}
      <ellipse cx="55" cy={155 + eyeOffset} rx="14" ry="9" fill="#FFB6C1" opacity="0.5" filter="url(#glow)" />
      <ellipse cx="145" cy={155 + eyeOffset} rx="14" ry="9" fill="#FFB6C1" opacity="0.5" filter="url(#glow)" />
      
      {/* Eyes */}
      {isClosed ? (
        <>
          <path d="M55 135 Q70 125 85 135" stroke="#2D1B4E" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M115 135 Q130 125 145 135" stroke="#2D1B4E" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx="70" cy={135 + eyeOffset} rx={eyeWidth} ry={eyeHeight} fill="#2D1B4E" />
          <ellipse cx="130" cy={135 + eyeOffset} rx={eyeWidth} ry={eyeHeight} fill="#2D1B4E" />
          {showShine && (
            <>
              <circle cx="74" cy={130 + eyeOffset} r="5" fill="white" />
              <circle cx="134" cy={130 + eyeOffset} r="5" fill="white" />
              <circle cx="72" cy={138 + eyeOffset} r="2" fill="white" opacity="0.7" />
              <circle cx="132" cy={138 + eyeOffset} r="2" fill="white" opacity="0.7" />
            </>
          )}
        </>
      )}
      
      {/* Eyelashes */}
      <path d="M50 125 Q70 115 90 125" stroke="#2D1B4E" strokeWidth="2" fill="none" opacity="0.7" />
      <path d="M110 125 Q130 115 150 125" stroke="#2D1B4E" strokeWidth="2" fill="none" opacity="0.7" />
      
      {/* Nose */}
      <path d="M100 152 Q102 155 100 157" stroke="#E8B4A0" strokeWidth="2" fill="none" strokeLinecap="round" />
      
      {/* Mouth */}
      {mood === 'happy' && (
        <path d="M80 175 Q100 195 120 175" stroke="#E88A8A" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      {mood === 'excited' && (
        <ellipse cx="100" cy="180" rx="12" ry="15" fill="#FF6B8A" />
      )}
      {mood === 'shy' && (
        <ellipse cx="100" cy="178" rx="8" ry="5" fill="#E88A8A" />
      )}
      {mood === 'surprised' && (
        <ellipse cx="100" cy="175" rx="10" ry="12" fill="#FF6B8A" />
      )}
      
      {/* Hair Front - Animated strands */}
      <path d="M35 85 Q60 145 40 190" stroke="#2D1B4E" strokeWidth="28" fill="none" strokeLinecap="round">
        <animate attributeName="d" 
          values="M35 85 Q60 145 40 190;M35 85 Q55 145 45 190;M35 85 Q60 145 40 190" 
          dur="3s" repeatCount="indefinite" />
      </path>
      <path d="M165 85 Q140 145 160 190" stroke="#2D1B4E" strokeWidth="28" fill="none" strokeLinecap="round">
        <animate attributeName="d" 
          values="M165 85 Q140 145 160 190;M165 85 Q145 145 155 190;M165 85 Q140 145 160 190" 
          dur="3.5s" repeatCount="indefinite" />
      </path>
      
      {/* Bangs */}
      <path d="M45 75 Q70 120 55 155" stroke="#2D1B4E" strokeWidth="20" fill="none" strokeLinecap="round" />
      <path d="M90 65 Q100 110 95 150" stroke="#2D1B4E" strokeWidth="18" fill="none" strokeLinecap="round" />
      <path d="M135 70 Q125 115 140 155" stroke="#2D1B4E" strokeWidth="20" fill="none" strokeLinecap="round" />
      
      {/* Moon Hair Accessory */}
      <circle cx="155" cy="65" r="12" fill="#F0E68C" opacity="0.9">
        <animate attributeName="opacity" values="0.9;0.5;0.9" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="155" cy="65" r="8" fill="#FFFACD" />
      
      {/* Star Hair Pins */}
      <text x="45" y="75" fontSize="16" fill="#FFD700">⭐</text>
      <text x="140" y="55" fontSize="14" fill="#FFD700">✨</text>
    </svg>
  );
};

// Tree with Swaying Leaves
const Tree = ({ side }: { side: 'left' | 'right' }) => {
  return (
    <div className={`absolute bottom-0 ${side === 'left' ? '-left-10' : '-right-10'} w-64 md:w-96 h-80 md:h-[28rem] pointer-events-none`}>
      <svg viewBox="0 0 200 300" className="w-full h-full" preserveAspectRatio="xMidYMax">
        {/* Trunk */}
        <path d="M90 300 Q85 250 88 200 Q90 150 95 100 Q100 60 100 30" 
          stroke="#3D2817" strokeWidth="18" fill="none" strokeLinecap="round" />
        <path d="M88 200 Q70 170 50 150" stroke="#3D2817" strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M95 140 Q120 110 140 90" stroke="#3D2817" strokeWidth="8" fill="none" strokeLinecap="round" />
        
        {/* Leaves - Left Side */}
        <g className="animate-sway-left">
          <ellipse cx="40" cy="140" rx="35" ry="25" fill="#1A472A" opacity="0.9" />
          <ellipse cx="30" cy="160" rx="30" ry="20" fill="#143620" opacity="0.85" />
          <ellipse cx="55" cy="125" rx="28" ry="22" fill="#1E4D30" opacity="0.9" />
        </g>
        
        {/* Leaves - Right Side */}
        <g className="animate-sway-right">
          <ellipse cx="150" cy="90" rx="40" ry="30" fill="#1A472A" opacity="0.9" />
          <ellipse cx="165" cy="70" rx="35" ry="25" fill="#143620" opacity="0.85" />
          <ellipse cx="135" cy="105" rx="32" ry="24" fill="#1E4D30" opacity="0.9" />
          <ellipse cx="155" cy="115" rx="28" ry="20" fill="#1A472A" opacity="0.9" />
        </g>
        
        {/* Leaves - Top */}
        <g className="animate-sway-top">
          <ellipse cx="100" cy="40" rx="45" ry="35" fill="#1A472A" opacity="0.9" />
          <ellipse cx="80" cy="25" rx="35" ry="28" fill="#143620" opacity="0.85" />
          <ellipse cx="120" cy="30" rx="38" ry="30" fill="#1E4D30" opacity="0.9" />
          <ellipse cx="100" cy="20" rx="30" ry="25" fill="#1A472A" opacity="0.95" />
        </g>
        
        {/* Fireflies */}
        <circle cx="50" cy="180" r="2" fill="#FFFF00" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
          <animate attributeName="cy" values="180;170;180" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="150" cy="120" r="2" fill="#FFFF00" opacity="0.8">
          <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="cy" values="120;110;120" dur="4s" repeatCount="indefinite" />
        </circle>
        <circle cx="100" cy="60" r="1.5" fill="#FFFF00" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.8s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

// Shooting Star
const ShootingStar = ({ delay }: { delay: number }) => (
  <div
    className="absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
    style={{
      top: `${10 + Math.random() * 30}%`,
      left: `${Math.random() * 50}%`,
      animation: `shoot ${3 + Math.random() * 2}s linear infinite`,
      animationDelay: `${delay}s`,
      transform: 'rotate(-45deg)',
    }}
  />
);

// Twinkling Star
const Star = ({ size, top, left, delay }: { size: number; top: number; left: number; delay: number }) => (
  <div
    className="absolute rounded-full bg-white"
    style={{
      width: `${size}px`,
      height: `${size}px`,
      top: `${top}%`,
      left: `${left}%`,
      animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      boxShadow: `0 0 ${size * 2}px ${size}px rgba(255,255,255,0.3)`,
    }}
  />
);

// Moon
const Moon = () => (
  <div className="absolute top-10 right-10 md:top-16 md:right-20 w-24 h-24 md:w-36 md:h-36">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <filter id="moonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle cx="50" cy="50" r="40" fill="#FFFEF0" filter="url(#moonGlow)" opacity="0.95" />
      <circle cx="50" cy="50" r="38" fill="#FFFACD" />
      {/* Craters */}
      <circle cx="35" cy="40" r="6" fill="#F0E68C" opacity="0.4" />
      <circle cx="60" cy="55" r="8" fill="#F0E68C" opacity="0.4" />
      <circle cx="45" cy="65" r="5" fill="#F0E68C" opacity="0.4" />
      <circle cx="65" cy="35" r="4" fill="#F0E68C" opacity="0.3" />
    </svg>
  </div>
);

// Firefly
const Firefly = ({ delay }: { delay: number }) => (
  <div
    className="absolute w-2 h-2 rounded-full bg-yellow-300 pointer-events-none"
    style={{
      top: `${40 + Math.random() * 50}%`,
      left: `${Math.random() * 100}%`,
      boxShadow: '0 0 10px 2px rgba(255,255,0,0.5)',
      animation: `firefly ${5 + Math.random() * 5}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);

export default function App() {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showSuccess, setShowSuccess] = useState(false);
  const [mood, setMood] = useState<'happy' | 'excited' | 'shy' | 'surprised'>('happy');
  const [attemptCount, setAttemptCount] = useState(0);
  const [message, setMessage] = useState("Will you talk on the call tonight?");
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Try to autoplay music immediately as requested
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPlaying(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Start music on user interaction
  const startMusic = useCallback(() => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleGlobalClick = () => startMusic();
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [startMusic]);

  // Generate stars
  const stars = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    top: Math.random() * 70,
    left: Math.random() * 100,
    delay: Math.random() * 3,
  })), []);

  // Generate shooting stars
  const shootingStars = useMemo(() => Array.from({ length: 4 }, (_, i) => ({
    id: i,
    delay: i * 4 + Math.random() * 2,
  })), []);

  // Generate fireflies
  const fireflies = useMemo(() => Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
  })), []);

  const moveNoButton = useCallback((mouseX: number, mouseY: number) => {
    if (!noButtonRef.current) return;
    
    const button = noButtonRef.current;
    const buttonRect = button.getBoundingClientRect();
    
    const buttonCenterX = buttonRect.left + buttonRect.width / 2;
    const buttonCenterY = buttonRect.top + buttonRect.height / 2;
    
    const distance = Math.sqrt(
      Math.pow(mouseX - buttonCenterX, 2) + Math.pow(mouseY - buttonCenterY, 2)
    );
    
    if (distance < 150) {
      // Move to a random position within the bottom half of the screen
      const padding = 20;
      const maxX = window.innerWidth - buttonRect.width - padding;
      const maxY = window.innerHeight - buttonRect.height - padding;
      const minY = window.innerHeight * 0.4;
      
      let newX = padding + Math.random() * (maxX - padding);
      let newY = minY + Math.random() * (maxY - minY);
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      if (Math.abs(newX - centerX) < 150 && Math.abs(newY - centerY) < 100) {
        newX = newX < centerX ? newX - 200 : newX + 200;
      }

      // Ensure button stays strictly within bounds for mobile
      newX = Math.max(padding, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));
      
      setNoButtonPosition({ x: newX, y: newY });
      setAttemptCount(prev => {
        const newCount = prev + 1;
        if (newCount === 1) setMessage("Hey! I'm over here now! 😝");
        else if (newCount === 3) setMessage("Too slow! Catch me if you can! 💨");
        else if (newCount === 5) setMessage("You'll never catch me! 😈");
        else if (newCount === 8) setMessage("Just give up and click Yes! 💕");
        else if (newCount === 12) setMessage("Okay you're persistent... but still no! 😤");
        return newCount;
      });
      setMood('surprised');
      setTimeout(() => setMood('happy'), 400);
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    moveNoButton(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    moveNoButton(touch.clientX, touch.clientY);
  };

  const handleYesClick = () => {
    startMusic();
    setMood('excited');
    setTimeout(() => setShowSuccess(true), 400);
  };

  const handleNoClick = () => {
    startMusic();
    setMood('surprised');
    setMessage("Hey! No clicking! 😤");
    setTimeout(() => setMessage("Will you talk on the call tonight?"), 1500);
  };

  const handleInteraction = (e: React.MouseEvent) => {
    moveNoButton(e.clientX, e.clientY);
  };

  if (!isMounted) {
    return null; // Prevent hydration mismatch from Math.random() on SSR
  }

  return (
    <>

      {/* Background Music */}
      {isPlaying && (
        <audio
          src="/jane-na-tu.mp3"
          autoPlay
          loop
          className="hidden"
        />
      )}

      {showSuccess ? (
      <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center p-4 overflow-hidden relative">
        {/* Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {stars.map((star) => (
            <Star key={star.id} {...star} />
          ))}
        </div>

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <ShootingStar key={star.id} {...star} />
        ))}

        {/* Fireflies */}
        {fireflies.map((firefly) => (
          <Firefly key={firefly.id} {...firefly} />
        ))}

        {/* Trees */}
        <Tree side="left" />
        <Tree side="right" />

        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Success Content */}
        <div className="relative z-10 text-center animate-fadeIn px-4">
          {/* Excited Character */}
          <div className="flex justify-center mb-4 animate-bounce">
            <AnimeGirl mood="excited" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-[0_0_15px_rgba(255,105,180,0.8)]">
            <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
              Yay! I knew it!
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-pink-200 mb-2 drop-shadow-lg">
            待ってたよ！
          </p>
          
          <p className="text-lg md:text-xl text-white/90 font-medium mb-8">
            Can't wait to hear your voice tonight...
          </p>

          <div className="flex justify-center gap-6 text-4xl md:text-5xl">
            <span className="animate-bounce" style={{ animationDelay: '0s' }}>📞</span>
            <span className="animate-bounce" style={{ animationDelay: '0.15s' }}>💕</span>
            <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>✨</span>
            <span className="animate-bounce" style={{ animationDelay: '0.45s' }}>🌙</span>
          </div>

          <p className="mt-8 text-pink-200/80 text-base md:text-lg animate-pulse">
            See you tonight under the stars... 🌟
          </p>

          {/* Music Indicator - Success Screen */}
          {isPlaying && (
            <div className="mt-6 flex items-center justify-center gap-2 text-pink-300/60 text-xs">
              <span className="animate-bounce">🎵</span>
              <span>Playing: Jane Na Tu</span>
              <div className="flex gap-0.5 items-end h-3">
                <div className="w-0.5 bg-pink-400 animate-music-bar" style={{ animationDelay: '0s' }} />
                <div className="w-0.5 bg-pink-400 animate-music-bar" style={{ animationDelay: '0.2s' }} />
                <div className="w-0.5 bg-pink-400 animate-music-bar" style={{ animationDelay: '0.4s' }} />
                <div className="w-0.5 bg-pink-400 animate-music-bar" style={{ animationDelay: '0.1s' }} />
              </div>
            </div>
          )}

          {/* Credit */}
          <p className="mt-6 text-white/30 text-xs tracking-widest">
            by Uttam
          </p>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          
          .animate-music-bar {
            animation: musicBar 0.8s ease-in-out infinite;
            height: 100%;
          }
          
          @keyframes musicBar {
            0%, 100% { height: 20%; }
            50% { height: 100%; }
          }
        `}</style>
      </div>
      ) : (
      <div 
      className="min-h-screen bg-gradient-to-b from-slate-900 via-indigo-950 to-purple-900 flex flex-col items-center justify-center p-4 overflow-hidden relative"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={startMusic}
    >

      {/* Starry Sky */}
      <div className="absolute inset-0 pointer-events-none">
        {stars.map((star) => (
          <Star key={star.id} {...star} />
        ))}
      </div>

      {/* Shooting Stars */}
      {shootingStars.map((star) => (
        <ShootingStar key={star.id} {...star} />
      ))}

      {/* Moon */}
      <Moon />

      {/* Fireflies */}
      {fireflies.map((firefly) => (
        <Firefly key={firefly.id} {...firefly} />
      ))}

      {/* Trees on sides */}
      <Tree side="left" />
      <Tree side="right" />

      {/* Gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />

      {/* Main Content - No Card! */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        {/* Character */}
        <div className="flex justify-center mb-6 transform hover:scale-105 transition-transform duration-500">
          <AnimeGirl mood={mood} />
        </div>

        {/* Main Question */}
        <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-8 drop-shadow-[0_0_10px_rgba(255,105,180,0.5)]">
          {message}
        </h1>

        {/* Buttons */}
        <div className="relative flex items-center justify-center gap-8 md:gap-12">
          {/* Yes Button */}
          <button
            onClick={handleYesClick}
            onMouseEnter={() => setMood('excited')}
            onMouseLeave={() => setMood('happy')}
            className="group relative px-10 py-4 md:px-14 md:py-5 bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 backdrop-blur-sm text-white font-semibold rounded-full shadow-lg shadow-pink-500/30 transform transition-all duration-300 hover:scale-110 hover:shadow-pink-500/50 active:scale-95 text-base md:text-lg border border-pink-400/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <span className="relative flex items-center gap-2">
              <span className="text-xl">💕</span>
              <span>Yes</span>
              <span className="text-sm opacity-80">はい</span>
            </span>
          </button>

          {/* No Button - Moves around but stays visible! */}
          <button
            ref={noButtonRef}
            style={{
              position: noButtonPosition.x !== 0 || noButtonPosition.y !== 0 ? 'fixed' : 'relative',
              left: noButtonPosition.x !== 0 ? `${noButtonPosition.x}px` : undefined,
              top: noButtonPosition.y !== 0 ? `${noButtonPosition.y}px` : undefined,
              transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 50,
            }}
            className="px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-slate-600/80 to-slate-700/80 backdrop-blur-sm text-white/80 font-semibold rounded-full shadow-lg border border-slate-500/30 text-sm md:text-base cursor-pointer hover:scale-105"
            onMouseEnter={(e) => {
              setMood('surprised');
              handleInteraction(e);
            }}
            onClick={handleNoClick}
          >
            <span className="flex items-center gap-2">
              <span>😢</span>
              <span>No</span>
              <span className="text-xs opacity-70">いいえ</span>
            </span>
          </button>
        </div>

        {/* Hint */}
        <p className="mt-8 text-white/40 text-xs md:text-sm animate-pulse font-light">
          {attemptCount === 0 ? "Try hovering over the buttons..." : `Attempts to catch No: ${attemptCount} 😏`}
        </p>

        {/* Music Indicator */}
        <div className="mt-4 flex items-center justify-center gap-2 text-pink-300/60 text-xs">
          <span className="animate-bounce">🎵</span>
          <span>Now Playing: Jane Na Tu</span>
          <div className="flex gap-0.5 items-end h-3">
            <div className="w-0.5 bg-pink-400 animate-music-bar" style={{ animationDelay: '0s' }} />
            <div className="w-0.5 bg-pink-400 animate-music-bar" style={{ animationDelay: '0.2s' }} />
            <div className="w-0.5 bg-pink-400 animate-music-bar" style={{ animationDelay: '0.4s' }} />
            <div className="w-0.5 bg-pink-400 animate-music-bar" style={{ animationDelay: '0.1s' }} />
          </div>
        </div>

        {/* Credit */}
        <p className="mt-6 text-white/30 text-xs tracking-widest">
          by Uttam
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.3; 
            transform: scale(1);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.2);
          }
        }
        
        @keyframes shoot {
          0% {
            transform: translateX(0) translateY(0) rotate(-45deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateX(300px) translateY(300px) rotate(-45deg);
            opacity: 0;
          }
        }
        
        @keyframes firefly {
          0%, 100% {
            opacity: 0.4;
            transform: translate(0, 0);
          }
          25% {
            opacity: 0.9;
            transform: translate(20px, -15px);
          }
          50% {
            opacity: 0.5;
            transform: translate(-10px, -25px);
          }
          75% {
            opacity: 0.8;
            transform: translate(15px, -10px);
          }
        }
        
        .animate-sway-left {
          animation: swayLeft 4s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        .animate-sway-right {
          animation: swayRight 5s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        .animate-sway-top {
          animation: swayTop 3.5s ease-in-out infinite;
          transform-origin: bottom center;
        }
        
        @keyframes swayLeft {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(3deg); }
        }
        
        @keyframes swayRight {
          0%, 100% { transform: rotate(2deg); }
          50% { transform: rotate(-4deg); }
        }
        
        @keyframes swayTop {
          0%, 100% { transform: rotate(-1deg) translateX(0); }
          50% { transform: rotate(2deg) translateX(3px); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .animate-music-bar {
          animation: musicBar 0.8s ease-in-out infinite;
          height: 100%;
        }
        
        @keyframes musicBar {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
    </div>
    )}
    </>
  );
}
