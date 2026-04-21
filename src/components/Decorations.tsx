import React from 'react';
import { DecorationType } from '../types';

interface Props {
  type?: DecorationType;
  color: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export default function Decorations({ type = 'none', color, scale = 1, offsetX = 0, offsetY = 0 }: Props) {
  if (type === 'none' || !type || type === '3d-rings' || type === '3d-diamonds') return null;

  const Corner = ({ className, children }: { className: string, children: React.ReactNode }) => {
    const isTop = className.includes('top');
    const isLeft = className.includes('left');
    const origin = `${isTop ? 'top' : 'bottom'} ${isLeft ? 'left' : 'right'}`;
    
    return (
      <div className={`absolute ${className} pointer-events-none z-50 opacity-70 transition-colors duration-500`} style={{ color }}>
        <div style={{ transform: `scale(${scale}) translate(${isLeft ? offsetX : -offsetX}px, ${isTop ? offsetY : -offsetY}px)`, transformOrigin: origin, transition: 'transform 0.3s ease' }}>
          {children}
        </div>
      </div>
    );
  };

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
  // Floral (Cachos)
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

  // Roses
  if (type === 'roses') {
    const RoseSVG = () => (
      <svg className="w-24 h-24 md:w-36 md:h-36" viewBox="0 0 100 100" fill="currentColor">
        {/* Leaves */}
        <path d="M40,20 C30,10 10,15 15,35 C20,55 45,60 50,45 C50,45 45,30 40,20 Z" opacity="0.4" />
        <path d="M20,40 C10,30 15,10 35,15 C55,20 60,45 45,50 C45,50 30,45 20,40 Z" opacity="0.4" />
        {/* Flower Base */}
        <path d="M30,30 C15,25 0,40 10,55 C20,70 45,75 55,60 C65,45 45,35 30,30 Z" opacity="0.7" />
        {/* Inner Petals */}
        <path d="M35,35 C25,30 20,45 25,55 C30,65 45,60 50,50 C55,40 45,40 35,35 Z" opacity="0.8" />
        {/* Core */}
        <path d="M38,40 C32,38 30,45 35,50 C40,55 45,50 45,45 C45,40 40,42 38,40 Z" opacity="1" />
        {/* Decorative lines/swirls around */}
        <path d="M55,60 C70,75 80,60 90,70" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
        <path d="M10,55 C5,75 20,80 15,95" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </svg>
    );
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <Corner className="top-0 left-0"><RoseSVG /></Corner>
        <Corner className="top-0 right-0 scale-x-[-1]"><RoseSVG /></Corner>
        <Corner className="bottom-0 left-0 scale-y-[-1]"><RoseSVG /></Corner>
        <Corner className="bottom-0 right-0 scale-x-[-1] scale-y-[-1]"><RoseSVG /></Corner>
      </div>
    );
  }

  // Loose Leaves
  if (type === 'leaves') {
    const LooseLeavesSVG = () => (
      <svg className="w-24 h-24 md:w-32 md:h-32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10,10 C30,15 40,30 35,50 C20,45 10,30 10,10 Z" fill="currentColor" opacity="0.6" stroke="none" />
        <path d="M10,10 C30,15 40,30 35,50 C20,45 10,30 10,10 Z" opacity="0.8" />
        <path d="M10,10 C20,25 30,35 35,50" opacity="0.8" />
        
        <path d="M45,15 C60,20 65,35 55,50 C40,45 35,30 45,15 Z" fill="currentColor" opacity="0.4" stroke="none" />
        <path d="M45,15 C60,20 65,35 55,50 C40,45 35,30 45,15 Z" opacity="0.6" />
        
        <path d="M20,60 C35,65 40,80 30,95 C15,85 10,70 20,60 Z" fill="currentColor" opacity="0.3" stroke="none" />
      </svg>
    );
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <Corner className="top-2 left-2"><LooseLeavesSVG /></Corner>
        <Corner className="top-2 right-2 scale-x-[-1]"><LooseLeavesSVG /></Corner>
        <Corner className="bottom-2 left-2 scale-y-[-1]"><LooseLeavesSVG /></Corner>
        <Corner className="bottom-2 right-2 scale-x-[-1] scale-y-[-1]"><LooseLeavesSVG /></Corner>
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

  // Butterflies
  if (type === 'butterflies') {
    const ButterflySVG = () => (
      <svg className="w-20 h-20 md:w-28 md:h-28" viewBox="0 0 100 100" fill="currentColor">
        <path d="M50,50 C40,30 10,10 5,40 C0,70 30,60 50,50 Z" opacity="0.8"/>
        <path d="M50,50 C60,30 90,10 95,40 C100,70 70,60 50,50 Z" opacity="0.8"/>
        <path d="M50,50 C45,70 20,90 15,75 C10,60 35,55 50,50 Z" opacity="0.6"/>
        <path d="M50,50 C55,70 80,90 85,75 C90,60 65,55 50,50 Z" opacity="0.6"/>
        <path d="M48,30 C48,30 45,15 40,10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
        <path d="M52,30 C52,30 55,15 60,10" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5"/>
      </svg>
    );
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <Corner className="top-4 left-4"><ButterflySVG /></Corner>
        <Corner className="top-4 right-4 scale-x-[-1]"><ButterflySVG /></Corner>
        <Corner className="bottom-4 left-4 scale-y-[-1]"><ButterflySVG /></Corner>
        <Corner className="bottom-4 right-4 scale-x-[-1] scale-y-[-1]"><ButterflySVG /></Corner>
      </div>
    );
  }

  // Delicate Flowers
  if (type === 'delicate-flowers') {
    const DelicateFlowerSVG = () => (
      <svg className="w-24 h-24 md:w-32 md:h-32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10,90 Q40,60 90,10" strokeOpacity="0.6"/>
        <path d="M20,70 Q40,40 70,20" strokeOpacity="0.4"/>
        <circle cx="90" cy="10" r="3" fill="currentColor" opacity="0.8"/>
        <circle cx="70" cy="20" r="2" fill="currentColor" opacity="0.6"/>
        <path d="M40,60 C30,50 20,55 25,65 C30,75 45,70 40,60 Z" fill="currentColor" stroke="none" opacity="0.5"/>
        <path d="M60,40 C50,30 40,35 45,45 C50,55 65,50 60,40 Z" fill="currentColor" stroke="none" opacity="0.5"/>
        <path d="M80,20 C75,10 65,15 70,25 C75,35 85,30 80,20 Z" fill="currentColor" stroke="none" opacity="0.5"/>
      </svg>
    );
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <Corner className="top-0 left-0"><DelicateFlowerSVG /></Corner>
        <Corner className="top-0 right-0 scale-x-[-1]"><DelicateFlowerSVG /></Corner>
        <Corner className="bottom-0 left-0 scale-y-[-1]"><DelicateFlowerSVG /></Corner>
        <Corner className="bottom-0 right-0 scale-x-[-1] scale-y-[-1]"><DelicateFlowerSVG /></Corner>
      </div>
    );
  }

  // Flower Borders
  if (type === 'flower-borders') {
    const FlowerBorderSVG = () => (
      <svg className="w-24 h-24 md:w-32 md:h-32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M0,50 C20,30 40,10 50,0" strokeOpacity="0.8"/>
        <path d="M20,70 C40,50 60,30 70,20" strokeOpacity="0.5"/>
        <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.4"/>
        <path d="M50,42 C55,30 70,30 65,45 C75,40 85,55 70,60 C75,70 60,85 50,70 C40,85 25,70 30,60 C15,55 25,40 35,45 C30,30 45,30 50,42 Z" fill="currentColor" stroke="none" opacity="0.8"/>
      </svg>
    );
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <Corner className="top-4 left-4"><FlowerBorderSVG /></Corner>
        <Corner className="top-4 right-4 scale-x-[-1]"><FlowerBorderSVG /></Corner>
        <Corner className="bottom-4 left-4 scale-y-[-1]"><FlowerBorderSVG /></Corner>
        <Corner className="bottom-4 right-4 scale-x-[-1] scale-y-[-1]"><FlowerBorderSVG /></Corner>
      </div>
    );
  }

  // Leafy Borders
  if (type === 'leafy-borders') {
    const LeafBorderSVG = () => (
      <svg className="w-32 h-32 md:w-40 md:h-40" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M0,0 Q50,20 100,50" strokeOpacity="0.8"/>
        <path d="M0,20 C10,10 30,10 40,30 C20,30 10,20 0,20 Z" fill="currentColor" stroke="none" opacity="0.6"/>
        <path d="M20,30 C30,20 50,20 60,40 C40,40 30,30 20,30 Z" fill="currentColor" stroke="none" opacity="0.6"/>
        <path d="M40,40 C50,30 70,30 80,50 C60,50 50,40 40,40 Z" fill="currentColor" stroke="none" opacity="0.6"/>
        <path d="M10,0 C20,10 20,30 0,40 C0,20 10,10 10,0 Z" fill="currentColor" stroke="none" opacity="0.4"/>
      </svg>
    );
    return (
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        <Corner className="top-0 left-0"><LeafBorderSVG /></Corner>
        <Corner className="top-0 right-0 scale-x-[-1]"><LeafBorderSVG /></Corner>
        <Corner className="bottom-0 left-0 scale-y-[-1]"><LeafBorderSVG /></Corner>
        <Corner className="bottom-0 right-0 scale-x-[-1] scale-y-[-1]"><LeafBorderSVG /></Corner>
      </div>
    );
  }

  return null;
}
