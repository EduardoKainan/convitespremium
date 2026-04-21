import { motion } from 'motion/react';

export default function CoverEffects({ type, color }: { type: 'watercolor-flowers' | 'gold-mandala' | 'opening-rose', color: string }) {
  if (!type || type === 'none') return null;

  if (type === 'gold-mandala') {
    return (
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden opacity-90">
        <motion.svg width="300" height="300" viewBox="0 0 200 200" className="drop-shadow-lg">
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "100px 100px" }}
          >
            <circle cx="100" cy="100" r="80" fill="none" stroke={color} strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="65" fill="none" stroke={color} strokeWidth="2" strokeDasharray="10 15" />
            <circle cx="100" cy="100" r="50" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 6" />
            <circle cx="100" cy="100" r="30" fill="none" stroke={color} strokeWidth="3" strokeDasharray="20 10" />
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={i}
                d="M100,20 C110,40 120,60 100,80 C80,60 90,40 100,20"
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                transform={`rotate(${i * 30} 100 100)`}
              />
            ))}
          </motion.g>
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "100px 100px" }}
          >
            <circle cx="100" cy="100" r="95" fill="none" stroke={color} strokeWidth="0.5" strokeDasharray="1 4" />
            {Array.from({ length: 24 }).map((_, i) => (
              <path
                key={i}
                d="M100,5 C105,10 105,15 100,20 C95,15 95,10 100,5"
                fill="none"
                stroke={color}
                strokeWidth="1"
                transform={`rotate(${i * 15} 100 100)`}
              />
            ))}
          </motion.g>
        </motion.svg>
      </div>
    );
  }

  if (type === 'opening-rose') {
    return (
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden opacity-80 mix-blend-plus-lighter">
        <motion.div 
          className="relative w-64 h-64 flex items-center justify-center"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 4, ease: "easeOut" }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${100 + i * 20}px`,
                height: `${100 + i * 20}px`,
                border: `2px solid ${color}`,
                borderRadius: '50% 0 50% 50%',
                opacity: 1 - (i * 0.1),
              }}
              initial={{ rotate: 0, scale: 0 }}
              animate={{ rotate: i * 45 + 360, scale: 1 }}
              transition={{ duration: 3 + i * 0.5, ease: "easeOut", delay: i * 0.2 }}
            />
          ))}
          <motion.div 
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={`inner-${i}`}
                className="absolute origin-bottom-right"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: color,
                  borderRadius: '50% 0 50% 50%',
                  opacity: 0.4,
                  transform: `rotate(${i * 72}deg) translate(-20px, -20px)`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 1.1, 1] }}
                transition={{ duration: 4, delay: 2 + i * 0.1 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (type === 'watercolor-flowers') {
    return (
      <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden opacity-90 drop-shadow-lg">
        <motion.svg width="300" height="300" viewBox="0 0 200 200" className="opacity-80">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.path
              key={i}
              d="M100,100 Q150,20 100,0 Q50,20 100,100"
              fill={color}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.3 }}
              transition={{ duration: 3, delay: i * 0.3, ease: "easeOut" }}
              style={{ transformOrigin: "100px 100px", rotate: i * 60 }}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.path
              key={`line-${i}`}
              d="M100,100 Q130,40 100,20 Q70,40 100,100"
              fill="none"
              stroke={color}
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 3, delay: 1 + i * 0.3, ease: "easeOut" }}
              style={{ transformOrigin: "100px 100px", rotate: i * 60 + 30 }}
            />
          ))}
        </motion.svg>
      </div>
    );
  }

  return null;
}
