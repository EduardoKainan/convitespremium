import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { MapPin, Clock, Calendar, Music, Pause, Play, Heart, Navigation, Info, MessageCircle, MousePointerClick, GlassWater, Volume2, VolumeX } from 'lucide-react';
import { InvitationData } from '../types';
import Decorations from './Decorations';
import OrnamentCanvas from './ornaments/OrnamentCanvas';

const Reveal = ({ children, delay = 0, direction = 'up' }: { children: React.ReactNode, delay?: number, direction?: 'up' | 'down' | 'left' | 'right' }) => {
  const y = direction === 'up' ? 50 : direction === 'down' ? -50 : 0;
  const x = direction === 'left' ? 50 : direction === 'right' ? -50 : 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y, x, filter: 'blur(8px)' }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 1, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

const BackgroundOverlay = ({ type, color }: { type?: string, color: string }) => {
  if (!type || type === 'solid') return null;

  if (type === 'paper') {
    return (
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30 mix-blend-overlay">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>
    );
  }

  let pattern = null;
  
  switch (type) {
    case 'geometric':
      pattern = <path d="M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z" fill={color} fillOpacity="0.15" fillRule="evenodd"/>;
      break;
    case 'stars':
      pattern = <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z" fill={color} fillOpacity="0.2" fillRule="evenodd"/>;
      break;
    case 'floral-light':
    case 'floral-dark':
      pattern = <path d="M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z" fill={color} fillOpacity={type === 'floral-dark' ? "0.25" : "0.15"} fillRule="evenodd"/>;
      break;
    case 'marble':
      return (
        <div className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="marble">
              <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise"/>
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 -1" in="noise" result="coloredNoise"/>
            </filter>
            <rect width="100%" height="100%" filter="url(#marble)" />
          </svg>
        </div>
      );
  }

  if (pattern) {
    return (
      <div className="absolute inset-0 pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id={`pattern-${type}`} x="0" y="0" width={type === 'geometric' ? 40 : 60} height={type === 'geometric' ? 40 : 60} patternUnits="userSpaceOnUse">
              {pattern}
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#pattern-${type})`} />
        </svg>
      </div>
    );
  }

  return null;
};

const Countdown = ({ targetDateStr, color }: { targetDateStr: string, color: string }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(`${targetDateStr}T00:00:00`).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  return (
    <div className="flex gap-3 justify-center my-8">
      {[
        { label: 'Dias', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Seg', value: timeLeft.seconds },
      ].map((item) => (
        <div key={item.label} className="flex flex-col items-center">
          <div 
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl sm:text-2xl mb-2 shadow-sm"
            style={{ 
              border: `1px solid ${color}50`, 
              backgroundColor: 'var(--color-surface)',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-title)'
            }}
          >
            {item.value.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest font-semibold" style={{ color: 'var(--color-text)', opacity: 0.7 }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function Invitation({ data }: { data: InvitationData }) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 250]);

  // Helper to convert Google Drive sharing links to direct download/stream links
  const getDirectAudioUrl = (url: string) => {
    if (!url) return url;
    const driveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
    const match = url.match(driveRegex);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
  };

  const directMusicUrl = getDirectAudioUrl(data.musicUrl);

  const handleOpen = () => {
    setIsOpened(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed", e));
      setIsPlaying(true);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const customStyles = {
    '--color-primary': data.theme.primary,
    '--color-secondary': data.theme.secondary,
    '--color-bg': data.theme.background,
    '--color-surface': data.theme.surface,
    '--color-text': data.theme.text,
    '--font-title': data.theme.fontTitle,
    '--font-script': data.theme.fontScript,
    '--font-body': data.theme.fontBody,
  } as React.CSSProperties;

  return (
    <div 
      className="w-full h-full min-h-screen flex justify-center selection:bg-black/10 relative overflow-hidden"
      style={{ ...customStyles, backgroundColor: 'var(--color-bg)', fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}
    >
      <BackgroundOverlay type={data.pageBackground} color={data.theme.primary} />

      {/* Audio Element */}
      <audio ref={audioRef} loop>
        <source src={directMusicUrl} />
      </audio>

      {/* Mobile Container */}
      <div className="w-full max-w-md relative shadow-2xl overflow-x-hidden flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
        <BackgroundOverlay type={data.pageBackground} color={data.theme.primary} />
        
        {/* Premium Decorations */}
        <Decorations type={data.decorationType as any} color={data.theme.primary} scale={data.decorationScale} offsetX={data.decorationOffsetX} offsetY={data.decorationOffsetY} />
        {data.ornamentConfig && <OrnamentCanvas config={data.ornamentConfig} color={data.theme.primary} />}

        {/* Floating Controls */}
        <div className="fixed inset-0 pointer-events-none z-50 flex justify-center">
          <div className="w-full max-w-md relative pointer-events-none h-full">
            
            <AnimatePresence>
              {isOpened && (
                <>
                  {/* Global Mute/Unmute Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 }}
                    onClick={(e) => { e.stopPropagation(); toggleAudio(); }}
                    className="absolute bottom-6 left-6 pointer-events-auto w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105 backdrop-blur-md z-[100]"
                    style={{ backgroundColor: `${data.theme.primary}ee`, color: data.theme.surface }}
                  >
                    {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Splash Screen (Envelope Cover) */}
        <AnimatePresence>
          {!isOpened && (
            <motion.div
              exit={{ y: "-100vh", opacity: 0 }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
              className="absolute inset-0 z-50 flex flex-col items-center overflow-y-auto overflow-x-hidden no-scrollbar"
              style={{ backgroundColor: data.theme.surface }}
            >
              <BackgroundOverlay type={data.pageBackground} color={data.theme.primary} />
              
              {/* Corner Flourishes (Brochuras) */}
              <div className="absolute top-6 left-6 z-30 w-16 h-16 opacity-60 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" stroke={data.theme.primary} strokeWidth="2">
                  <path d="M0,0 L40,0 A20,20 0 0,1 60,20 L60,40 M0,0 L0,40 A20,20 0 0,0 20,60 L40,60" />
                  <circle cx="0" cy="0" r="4" fill={data.theme.primary} />
                </svg>
              </div>
              <div className="absolute top-6 right-6 z-30 w-16 h-16 opacity-60 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
                <svg viewBox="0 0 100 100" fill="none" stroke={data.theme.primary} strokeWidth="2">
                  <path d="M0,0 L40,0 A20,20 0 0,1 60,20 L60,40 M0,0 L0,40 A20,20 0 0,0 20,60 L40,60" />
                  <circle cx="0" cy="0" r="4" fill={data.theme.primary} />
                </svg>
              </div>

              {/* Hero Section on Cover */}
              <div className="relative w-full aspect-[3/4] sm:aspect-[4/5] shrink-0">
                <img src={data.images.cover} className="w-full h-full object-cover" alt="Cover" />
                
                {/* Bottom fade gradient */}
                <div className="absolute bottom-0 inset-x-0 h-48 z-10" style={{ background: `linear-gradient(to top, ${data.theme.surface} 0%, transparent 100%)` }}></div>

                {/* Play Button */}
                <div className="absolute bottom-16 left-6 z-20 flex flex-col items-center">
                  <button onClick={(e) => { e.stopPropagation(); toggleAudio(); }} className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm transition-transform hover:scale-105" style={{ backgroundColor: `${data.theme.primary}cc`, color: data.theme.surface }}>
                    {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                  </button>
                  <span className="text-[10px] mt-2 font-serif italic font-medium" style={{ color: data.theme.primary }}>Tocar música</span>
                </div>
              </div>

              {/* Center Title (Name + Heart + Category) */}
              <div className="relative z-20 flex items-center justify-center gap-3 px-4 -mt-12 mb-12">
                <span className="text-5xl drop-shadow-md" style={{ fontFamily: 'var(--font-script)', color: data.theme.primary }}>{data.name}</span>
                <Heart size={32} strokeWidth={1} style={{ color: data.theme.primary }} className="opacity-70 mt-2" />
                <span className="text-4xl drop-shadow-md mt-3" style={{ fontFamily: 'var(--font-script)', color: data.theme.primary }}>{data.category}</span>
              </div>

              {/* Premium Envelope */}
              <div className="relative z-20 flex flex-col items-center pb-12 cursor-pointer group mt-8" onClick={handleOpen}>
                <div className="relative w-80 h-52 shadow-2xl transition-transform duration-300 group-hover:scale-105 rounded-sm" style={{ backgroundColor: data.theme.primary }}>
                  {/* Texture */}
                  <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
                  
                  {/* Envelope Flaps using Clip Path */}
                  <div className="absolute inset-0 shadow-inner"></div>
                  
                  {/* Left Flap */}
                  <div className="absolute inset-0 origin-left" style={{ backgroundColor: data.theme.primary, clipPath: 'polygon(0 0, 50% 50%, 0 100%)', filter: 'brightness(0.95)' }}></div>
                  {/* Right Flap */}
                  <div className="absolute inset-0 origin-right" style={{ backgroundColor: data.theme.primary, clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)', filter: 'brightness(0.9)' }}></div>
                  {/* Bottom Flap */}
                  <div className="absolute inset-0 origin-bottom" style={{ backgroundColor: data.theme.primary, clipPath: 'polygon(0 100%, 50% 55%, 100% 100%)', filter: 'brightness(0.85)' }}></div>
                  
                  {/* Top Flap */}
                  <div className="absolute inset-0 origin-top transition-transform duration-700 ease-in-out group-hover:rotate-x-180 z-30" style={{ backgroundColor: data.theme.primary, clipPath: 'polygon(0 0, 100% 0, 50% 60%)', filter: 'brightness(1.05)' }}></div>

                  {/* Brooch / Wax Seal */}
                  <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-20 h-20 rounded-full shadow-2xl flex items-center justify-center transition-transform duration-700 group-hover:scale-0 group-hover:opacity-0" style={{ background: 'linear-gradient(135deg, #FFDF73 0%, #B8860B 50%, #8B6508 100%)', padding: '4px' }}>
                    <div className="w-full h-full rounded-full border-2 border-[#FFDF73] flex items-center justify-center" style={{ background: 'radial-gradient(circle, #ffffff 0%, #f0f0f0 100%)', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)' }}>
                      <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at top left, #FFD700 0%, #B8860B 100%)' }}>
                        <span className="text-white font-serif text-3xl opacity-90 drop-shadow-md">{data.name.charAt(0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="mt-8 text-sm font-medium tracking-widest" style={{ color: data.theme.text, fontFamily: 'var(--font-title)' }}>
                  Clique no envelope para abrir
                </p>
              </div>
              
              {/* Intro Message on Cover */}
              <div className="relative z-20 text-center px-8 pb-20 w-full max-w-sm mx-auto">
                <p className="text-xl leading-relaxed" style={{ fontFamily: 'var(--font-title)', color: data.theme.text }}>
                  {data.message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Internal Hero Image */}
          <div className="relative w-full h-[60vh]">
            <img src={data.images.hero} className="w-full h-full object-cover" alt="Internal Hero" />
            {/* Gradient Fade to Surface Color */}
            <div className="absolute bottom-0 inset-x-0 h-48" style={{ background: `linear-gradient(to top, ${data.theme.surface} 0%, transparent 100%)` }}></div>
          </div>

          {/* Inside Header */}
          <div className="pt-12 pb-12 px-8 text-center relative z-10">
            <Reveal direction="up">
              <h2 className="text-xl mb-12 leading-relaxed" style={{ fontFamily: 'var(--font-title)', color: data.theme.text }}>
                {data.message}
              </h2>
            </Reveal>
              
            <Reveal direction="up" delay={0.2}>
              {/* Date/Time Arch */}
              <div className="relative w-64 h-96 mx-auto mb-16 rounded-t-full shadow-xl overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: data.theme.primary }}>
                {/* Texture */}
                <div className="absolute inset-0 opacity-20 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>

                {/* Animated Particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: `${Math.random() * 80 + 10}%`,
                        left: `${Math.random() * 80 + 10}%`,
                      }}
                      animate={{
                        y: [0, -30, 0],
                        opacity: [0, 0.6, 0],
                        scale: [0.5, 1, 0.5],
                        rotate: [0, 90]
                      }}
                      transition={{
                        duration: 4 + Math.random() * 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 3
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="white" fillOpacity="0.6"/>
                      </svg>
                    </motion.div>
                  ))}
                </div>

                {/* Animated Inner Border */}
                <motion.div 
                  className="absolute inset-3 border border-white opacity-20 rounded-t-full pointer-events-none"
                  animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.98, 1, 0.98] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                <div className="relative z-10 flex flex-col items-center text-white drop-shadow-md">
                  <span className="text-8xl font-bold leading-none" style={{ fontFamily: 'var(--font-title)' }}>
                    {data.date.split('-')[2]}
                  </span>
                  <span className="text-4xl mt-2 mb-4" style={{ fontFamily: 'var(--font-script)' }}>
                    {new Date(data.date).toLocaleString('pt-BR', { month: 'long' })}
                  </span>
                  <span className="text-2xl font-medium tracking-widest mb-6" style={{ fontFamily: 'var(--font-title)' }}>
                    {data.date.split('-')[0]}
                  </span>
                  <span className="text-3xl" style={{ fontFamily: 'var(--font-script)' }}>
                    às
                  </span>
                  <span className="text-3xl font-bold mt-2" style={{ fontFamily: 'var(--font-title)' }}>
                    {data.time}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Info Section */}
          <div className="py-12 px-8 text-center relative z-10">
            <Reveal direction="up">
              <Countdown targetDateStr={data.date} color={data.theme.primary} />
            </Reveal>
          </div>

          {/* Interactive Section */}
          <div className="py-20 px-8 text-center relative z-10">
            <Reveal direction="up">
              <div className="mb-16">
                <h2 className="text-2xl tracking-widest uppercase mb-4" style={{ fontFamily: 'var(--font-title)', color: data.theme.text }}>
                  Clique para
                </h2>
                <h3 className="text-6xl" style={{ fontFamily: 'var(--font-script)', color: data.theme.text }}>
                  Interagir
                </h3>
              </div>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              {/* Interactive Buttons Layout */}
              <div className="relative h-72 w-full max-w-sm mx-auto mb-12">
                {/* RSVP Button (Top Left) */}
                <a 
                  href={data.rsvpLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-0 left-4 flex flex-col items-center group hover:scale-105 transition-transform"
                >
                  <div className="w-24 h-24 flex items-center justify-center mb-4">
                    <Heart size={64} fill={data.theme.primary} strokeWidth={0} className="drop-shadow-lg" />
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-bold uppercase tracking-widest" style={{ color: data.theme.primary }}>Confirmar</span>
                    <span className="block text-xs font-bold uppercase tracking-widest" style={{ color: data.theme.primary }}>Presença</span>
                  </div>
                </a>

                {/* Location Button (Bottom Right) */}
                <a 
                  href={data.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-0 right-4 flex flex-col items-center group hover:scale-105 transition-transform"
                >
                  <div className="w-24 h-24 flex items-center justify-center mb-4">
                    <MapPin size={64} fill={data.theme.primary} strokeWidth={0} className="drop-shadow-lg" />
                  </div>
                  <div className="text-center">
                    <span className="block text-xs font-bold uppercase tracking-widest" style={{ color: data.theme.primary }}>Local do</span>
                    <span className="block text-xs font-bold uppercase tracking-widest" style={{ color: data.theme.primary }}>Evento</span>
                  </div>
                </a>
                
                {/* Click Icon Bottom Center */}
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <MousePointerClick size={40} strokeWidth={1} style={{ color: data.theme.primary }} />
                </div>
              </div>
            </Reveal>
          </div>

          {/* Dress Code Section */}
          <div className="py-20 px-8 text-center relative z-10" style={{ backgroundColor: data.theme.background, color: data.theme.surface }}>
            <BackgroundOverlay type={data.pageBackground} color={data.theme.primary} />
            <Reveal direction="up">
              <h2 className="text-3xl mb-8" style={{ fontFamily: 'var(--font-title)', color: data.theme.primary }}>Dress Code</h2>
              <div className="flex justify-center mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center shadow-inner"
                  style={{ border: `1px solid ${data.theme.primary}50`, backgroundColor: `${data.theme.surface}10` }}
                >
                  <Info size={28} style={{ color: data.theme.primary }} />
                </div>
              </div>
              <p className="text-sm leading-relaxed max-w-xs mx-auto" style={{ opacity: 0.8 }}>
                {data.dressCode}
              </p>
            </Reveal>
          </div>

          {/* Footer RSVP Section */}
          <div className="pt-10 pb-32 px-6 text-center relative z-10 flex flex-col items-center" style={{ color: data.theme.text }}>
            <Reveal direction="up">
              <p className="text-lg leading-relaxed max-w-sm mx-auto mb-12" style={{ fontFamily: 'var(--font-title)' }}>
                {data.finalMessage}
              </p>
            </Reveal>

            <Reveal direction="up" delay={0.2}>
              <div className="relative w-full max-w-md mx-auto aspect-[3/4] mb-8">
                {/* Top fade gradient */}
                <div className="absolute top-0 inset-x-0 h-24 z-10" style={{ background: `linear-gradient(to bottom, ${data.theme.surface} 0%, transparent 100%)` }}></div>
                
                <img 
                  src={data.images.footer} 
                  alt="Footer" 
                  className="w-full h-full object-cover"
                />
                
                {/* Bottom fade gradient */}
                <div className="absolute bottom-0 inset-x-0 h-32 z-10" style={{ background: `linear-gradient(to top, ${data.theme.surface} 0%, transparent 100%)` }}></div>

                {/* Espero por você Text */}
                <div className="absolute bottom-4 right-4 z-20">
                  <h2 className="text-4xl sm:text-5xl drop-shadow-md" style={{ fontFamily: 'var(--font-script)', color: data.theme.primary }}>
                    Espero por você!
                  </h2>
                </div>
              </div>
            </Reveal>
            
            <div className="h-16"></div> {/* Spacer for floating button */}
          </div>
        </div>
      </div>
    </div>
  );
}
