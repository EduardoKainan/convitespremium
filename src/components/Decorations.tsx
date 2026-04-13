import React from 'react';
import { DecorationType } from '../types';

interface Props {
  type?: DecorationType;
  color: string;
}

export default function Decorations({ type = 'none', color }: Props) {
  if (type === 'none' || !type) return null;

  const Corner = ({ className, children }: { className: string, children: React.ReactNode }) => (
    <div className={`absolute ${className} pointer-events-none z-50 opacity-70 transition-colors duration-500`} style={{ color }}>
      {children}
    </div>
  );

  // Geometric (Art Deco)
  if (type === 'geometric') {
    const GeoSVG = () => (
      <svg className="w-16 h-16 md:w-24 md:h-24" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M0,0 L100,0 L100,10 L10,10 L10,100 L0,100 Z" />
        <path d="M20,20 L80,20 L80,30 L30,30 L30,80 L20,80 Z" strokeOpacity="0.6"/>
        <path d="M40,40 L60,40 L60,50 L50,50 L50,60 L40,60 Z" strokeOpacity="0.3"/>
      </svg>
    );
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <Corner className="top-4 left-4"><GeoSVG /></Corner>
        <Corner className="top-4 right-4 scale-x-[-1]"><GeoSVG /></Corner>
        <Corner className="bottom-4 left-4 scale-y-[-1]"><GeoSVG /></Corner>
        <Corner className="bottom-4 right-4 scale-x-[-1] scale-y-[-1]"><GeoSVG /></Corner>
      </div>
    );
  }

  // Elegant (Swirls/Curves)
  if (type === 'elegant') {
    const ElegantSVG = () => (
      <svg className="w-20 h-20 md:w-32 md:h-32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M0,0 C40,0 80,10 90,50 C95,70 85,90 70,95 C55,100 40,90 45,75 C50,60 70,65 75,80" strokeOpacity="0.8"/>
        <path d="M0,20 C30,20 60,30 70,60 C75,75 65,90 55,95" strokeOpacity="0.5"/>
        <path d="M0,40 C20,40 40,50 50,70" strokeOpacity="0.3"/>
        <circle cx="85" cy="15" r="2" fill="currentColor" />
        <circle cx="70" cy="30" r="1.5" fill="currentColor" opacity="0.6" />
      </svg>
    );
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <Corner className="top-0 left-0"><ElegantSVG /></Corner>
        <Corner className="top-0 right-0 scale-x-[-1]"><ElegantSVG /></Corner>
        <Corner className="bottom-0 left-0 scale-y-[-1]"><ElegantSVG /></Corner>
        <Corner className="bottom-0 right-0 scale-x-[-1] scale-y-[-1]"><ElegantSVG /></Corner>
      </div>
    );
  }

  // Floral (Leaves)
  if (type === 'floral') {
    const FloralSVG = () => (
      <svg className="w-20 h-20 md:w-32 md:h-32" viewBox="0 0 100 100" fill="currentColor">
        <path d="M0,0 C30,0 60,10 80,40 C80,40 70,35 50,35 C30,35 10,45 0,60 C0,60 5,40 0,0 Z" opacity="0.7"/>
        <path d="M0,0 C10,30 15,60 40,80 C40,80 35,70 35,50 C35,30 45,10 60,0 C60,0 40,5 0,0 Z" opacity="0.9"/>
        <path d="M80,40 C90,50 95,65 90,80 C90,80 80,70 65,70 C50,70 40,80 35,95 C35,95 45,75 80,40 Z" opacity="0.5"/>
      </svg>
    );
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <Corner className="top-0 left-0"><FloralSVG /></Corner>
        <Corner className="top-0 right-0 scale-x-[-1]"><FloralSVG /></Corner>
        <Corner className="bottom-0 left-0 scale-y-[-1]"><FloralSVG /></Corner>
        <Corner className="bottom-0 right-0 scale-x-[-1] scale-y-[-1]"><FloralSVG /></Corner>
      </div>
    );
  }

  // Stars (Sparkles)
  if (type === 'stars') {
    const StarSVG = () => (
      <svg className="w-24 h-24 md:w-36 md:h-36" viewBox="0 0 100 100" fill="currentColor">
        <path d="M20,10 Q25,25 40,30 Q25,35 20,50 Q15,35 0,30 Q15,25 20,10 Z" opacity="0.9"/>
        <path d="M60,40 Q62,48 70,50 Q62,52 60,60 Q58,52 50,50 Q58,48 60,40 Z" opacity="0.7"/>
        <path d="M30,70 Q31,74 35,75 Q31,76 30,80 Q29,76 25,75 Q29,74 30,70 Z" opacity="0.5"/>
        <path d="M80,15 Q81,19 85,20 Q81,21 80,25 Q79,21 75,20 Q79,19 80,15 Z" opacity="0.8"/>
      </svg>
    );
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <Corner className="top-2 left-2"><StarSVG /></Corner>
        <Corner className="top-2 right-2 scale-x-[-1]"><StarSVG /></Corner>
        <Corner className="bottom-2 left-2 scale-y-[-1]"><StarSVG /></Corner>
        <Corner className="bottom-2 right-2 scale-x-[-1] scale-y-[-1]"><StarSVG /></Corner>
      </div>
    );
  }

  return null;
}
