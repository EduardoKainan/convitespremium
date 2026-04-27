import { motion } from 'motion/react';

interface FloralVectorProps {
  type: string;
  color: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

export default function FloralVectorDrawing({ type, color, scale = 1, offsetX = 0, offsetY = 0 }: FloralVectorProps) {
  if (!type || type === 'none') return null;

  const draw: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => {
      const delay = 0.5 + i * 0.5;
      return {
        pathLength: 1,
        opacity: 1,
        transition: {
          pathLength: { delay, duration: 4.5, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", repeatDelay: 1 },
          opacity: { delay, duration: 0.5 }
        }
      };
    }
  };

  const sway: any = {
    animate: {
      rotate: [-1.5, 1.5, -1.5],
      transition: { repeat: Infinity, duration: 6, ease: "easeInOut" }
    }
  };

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-[2] overflow-hidden"
      style={{
        transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
        transformOrigin: "center center"
      }}
    >
      {type === 'gold-arabesque' && (
        <>
          {/* Top Left */}
          <motion.svg width="150" height="150" viewBox="0 0 100 100" className="absolute top-0 left-0 drop-shadow-md origin-top-left" variants={sway} animate="animate">
            <motion.path 
              d="M0,0 C30,10 60,30 90,0 C70,30 80,60 100,90 C50,70 30,50 0,60" 
              fill="transparent" 
              stroke={color} 
              strokeWidth="1.5" 
              variants={draw} 
              initial="hidden" 
              animate="visible" 
              custom={0} 
            />
            <motion.path 
              d="M0,20 C20,30 40,50 30,80" 
              fill="transparent" 
              stroke={color} 
              strokeWidth="1" 
              variants={draw} 
              initial="hidden" 
              animate="visible" 
              custom={1} 
            />
          </motion.svg>
          {/* Bottom Right */}
          <motion.svg width="150" height="150" viewBox="0 0 100 100" className="absolute bottom-0 right-0 transform rotate-180 drop-shadow-md origin-bottom-right" variants={sway} animate="animate">
            <motion.path 
              d="M0,0 C30,10 60,30 90,0 C70,30 80,60 100,90 C50,70 30,50 0,60" 
              fill="transparent" 
              stroke={color} 
              strokeWidth="1.5" 
              variants={draw} 
              initial="hidden" 
              animate="visible" 
              custom={2} 
            />
          </motion.svg>
        </>
      )}

      {type === 'boho-leaves' && (
        <>
          {/* Top Right */}
          <motion.svg width="120" height="200" viewBox="0 0 100 200" className="absolute top-0 right-0 drop-shadow-sm origin-top-right" variants={sway} animate="animate">
            <motion.path d="M100,0 C80,40 50,80 50,150" fill="transparent" stroke={color} strokeWidth="2" variants={draw} initial="hidden" animate="visible" custom={0} />
            <motion.path d="M70,40 C60,50 40,40 30,60 C40,70 60,60 60,80 M60,90 C40,100 20,80 10,110 C30,120 50,100 55,120" fill="transparent" stroke={color} strokeWidth="1.5" variants={draw} initial="hidden" animate="visible" custom={1} />
          </motion.svg>
          {/* Bottom Left */}
          <motion.svg width="120" height="200" viewBox="0 0 100 200" className="absolute bottom-0 left-0 transform rotate-180 drop-shadow-sm origin-bottom-left" variants={sway} animate="animate">
            <motion.path d="M100,0 C80,40 50,80 50,150" fill="transparent" stroke={color} strokeWidth="2" variants={draw} initial="hidden" animate="visible" custom={2} />
            <motion.path d="M70,40 C60,50 40,40 30,60 C40,70 60,60 60,80 M60,90 C40,100 20,80 10,110 C30,120 50,100 55,120" fill="transparent" stroke={color} strokeWidth="1.5" variants={draw} initial="hidden" animate="visible" custom={3} />
          </motion.svg>
        </>
      )}

      {type === 'heart-flowers' && (
        <>
          {/* Top Center Heart */}
          <motion.svg width="140" height="140" viewBox="0 0 100 100" className="absolute top-8 left-1/2 -translate-x-1/2 drop-shadow-md origin-center opacity-80" variants={sway} animate="animate">
            <motion.path 
              d="M 50,85 C 50,85 10,55 10,30 C 10,10 35,10 50,30 C 65,10 90,10 90,30 C 90,55 50,85 50,85 Z" 
              fill="transparent" 
              stroke={color} 
              strokeWidth="1.5" 
              variants={draw} 
              initial="hidden" 
              animate="visible" 
              custom={0} 
            />
            {/* Inner floral details */}
            <motion.path 
              d="M 50,85 C 30,60 25,45 35,35 M 50,85 C 70,60 75,45 65,35" 
              fill="transparent" 
              stroke={color} 
              strokeWidth="1" 
              variants={draw} 
              initial="hidden" 
              animate="visible" 
              custom={1} 
            />
          </motion.svg>
          
          {/* Bottom Center Flop */}
          <motion.svg width="100" height="100" viewBox="0 0 100 100" className="absolute bottom-8 left-1/2 -translate-x-1/2 transform rotate-180 drop-shadow-md origin-center opacity-60" variants={sway} animate="animate">
             <motion.path 
              d="M 50,90 C 50,90 20,60 20,35 C 20,15 40,15 50,35 C 60,15 80,15 80,35 C 80,60 50,90 50,90 Z" 
              fill="transparent" 
              stroke={color} 
              strokeWidth="1.5" 
              variants={draw} 
              initial="hidden" 
              animate="visible" 
              custom={2} 
            />
          </motion.svg>
        </>
      )}

      {type === 'vine-leaves' && (
        <>
          {/* Top Border */}
          <motion.svg width="300" height="80" viewBox="0 0 300 80" className="absolute top-0 left-1/2 -translate-x-1/2 drop-shadow-sm origin-top" variants={sway} animate="animate">
            <motion.path d="M 0,20 Q 75,50 150,20 T 300,20" fill="transparent" stroke={color} strokeWidth="1.5" variants={draw} initial="hidden" animate="visible" custom={0} />
            <motion.path d="M 50,30 Q 70,50 90,30 M 210,30 Q 230,50 250,30" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={1} />
            <motion.path d="M 30,15 Q 40,5 50,15 M 100,10 Q 110,0 120,10 M 180,10 Q 190,0 200,10 M 250,15 Q 260,5 270,15" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={2} />
          </motion.svg>
          {/* Bottom Border */}
          <motion.svg width="300" height="80" viewBox="0 0 300 80" className="absolute bottom-0 left-1/2 -translate-x-1/2 transform rotate-180 drop-shadow-sm origin-bottom" variants={sway} animate="animate">
            <motion.path d="M 0,20 Q 75,50 150,20 T 300,20" fill="transparent" stroke={color} strokeWidth="1.5" variants={draw} initial="hidden" animate="visible" custom={3} />
            <motion.path d="M 50,30 Q 70,50 90,30 M 210,30 Q 230,50 250,30" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={4} />
            <motion.path d="M 30,15 Q 40,5 50,15 M 100,10 Q 110,0 120,10 M 180,10 Q 190,0 200,10 M 250,15 Q 260,5 270,15" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={5} />
          </motion.svg>
        </>
      )}

      {type === 'spring-flowers' && (
        <>
          <motion.svg width="120" height="120" viewBox="0 0 100 100" className="absolute top-4 left-4 drop-shadow-sm origin-top-left" variants={sway} animate="animate">
            <motion.path d="M 10,90 Q 50,50 90,10" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={0} />
            <motion.circle cx="90" cy="10" r="4" fill="transparent" stroke={color} strokeWidth="1.5" variants={draw} initial="hidden" animate="visible" custom={1} />
            <motion.circle cx="70" cy="30" r="3" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={2} />
            <motion.circle cx="30" cy="70" r="3" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={3} />
          </motion.svg>
          <motion.svg width="120" height="120" viewBox="0 0 100 100" className="absolute bottom-4 right-4 transform rotate-180 drop-shadow-sm origin-bottom-right" variants={sway} animate="animate">
            <motion.path d="M 10,90 Q 50,50 90,10" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={4} />
            <motion.circle cx="90" cy="10" r="4" fill="transparent" stroke={color} strokeWidth="1.5" variants={draw} initial="hidden" animate="visible" custom={5} />
            <motion.circle cx="70" cy="30" r="3" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={6} />
            <motion.circle cx="30" cy="70" r="3" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={7} />
          </motion.svg>
        </>
      )}

      {type === 'elegant-swirls' && (
        <>
          <motion.svg width="100" height="250" viewBox="0 0 100 250" className="absolute top-1/2 -translate-y-1/2 left-0 drop-shadow-md origin-left" variants={sway} animate="animate">
            <motion.path d="M 0,25 C 80,50 80,100 20,125 C 80,150 80,200 0,225" fill="transparent" stroke={color} strokeWidth="1.5" variants={draw} initial="hidden" animate="visible" custom={0} />
            <motion.path d="M 0,50 C 40,75 40,100 0,100" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={1} />
            <motion.path d="M 0,150 C 40,175 40,200 0,200" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={2} />
          </motion.svg>
          <motion.svg width="100" height="250" viewBox="0 0 100 250" className="absolute top-1/2 -translate-y-1/2 right-0 transform rotate-180 drop-shadow-md origin-right" variants={sway} animate="animate">
            <motion.path d="M 0,25 C 80,50 80,100 20,125 C 80,150 80,200 0,225" fill="transparent" stroke={color} strokeWidth="1.5" variants={draw} initial="hidden" animate="visible" custom={3} />
            <motion.path d="M 0,50 C 40,75 40,100 0,100" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={4} />
            <motion.path d="M 0,150 C 40,175 40,200 0,200" fill="transparent" stroke={color} strokeWidth="1" variants={draw} initial="hidden" animate="visible" custom={5} />
          </motion.svg>
        </>
      )}
    </div>
  );
}
