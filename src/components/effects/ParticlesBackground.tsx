import { useEffect, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesBackground({ type }: { type: 'rose-petals' | 'sparkles' | 'snow' | 'rain' | 'confetti' | 'stardust' | 'sakura' }) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  let options: any = {};

  if (type === 'rose-petals') {
    options = {
      fpsLimit: 60,
      particles: {
        color: { value: ["#ffb6c1", "#ffc0cb", "#ff69b4"] },
        move: { direction: "bottom", enable: true, outModes: "out", speed: 2, straight: false },
        number: { density: { enable: true, value_area: 800 }, value: 30 },
        opacity: { value: { min: 0.3, max: 0.8 } },
        shape: { type: ["circle", "polygon"], polygon: { nb_sides: 5 } },
        size: { value: { min: 5, max: 15 } },
        wobble: { enable: true, distance: 5, speed: 2 }
      },
      interactivity: { events: { onHover: { enable: true, mode: "repulse" } }, modes: { repulse: { distance: 100, duration: 0.4 } } }
    };
  } else if (type === 'sparkles') {
    options = {
      fpsLimit: 60,
      particles: {
        color: { value: ["#ffd700", "#ffffff"] },
        move: { direction: "top", enable: true, outModes: "out", speed: 1, straight: false },
        number: { density: { enable: true, value_area: 800 }, value: 60 },
        opacity: { value: { min: 0.1, max: 0.8 }, animation: { enable: true, speed: 1, sync: false } },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 3 } },
      }
    };
  } else if (type === 'snow') {
    options = {
      fpsLimit: 60,
      particles: {
        color: { value: "#ffffff" },
        move: { direction: "bottom", enable: true, outModes: "out", speed: 1.5, straight: false },
        number: { density: { enable: true, value_area: 800 }, value: 80 },
        opacity: { value: { min: 0.4, max: 0.9 } },
        shape: { type: "circle" },
        size: { value: { min: 2, max: 4 } },
        wobble: { enable: true, distance: 10, speed: 1 }
      }
    };
  } else if (type === 'rain') {
    options = {
      fpsLimit: 60,
      particles: {
        color: { value: "#a0aec0" },
        move: { direction: "bottom", enable: true, outModes: "out", speed: 15, straight: true },
        number: { density: { enable: true, value_area: 800 }, value: 100 },
        opacity: { value: { min: 0.1, max: 0.5 } },
        shape: { type: "line" },
        size: { value: { min: 1, max: 20 } },
      }
    };
  } else if (type === 'confetti') {
    options = {
      fpsLimit: 60,
      particles: {
        color: { value: ["#26ccff", "#a25afd", "#ff5e7e", "#88ff5a", "#fcff42", "#ffa62d", "#ff36ff"] },
        move: { direction: "bottom", enable: true, outModes: "out", speed: 3, straight: false },
        number: { density: { enable: true, value_area: 800 }, value: 80 },
        opacity: { value: 1 },
        shape: { type: ["square", "circle"] },
        size: { value: { min: 4, max: 10 } },
        wobble: { enable: true, distance: 30, speed: 10 }
      }
    };
  } else if (type === 'stardust') {
    options = {
      fpsLimit: 60,
      particles: {
        color: { value: ["#ffffff", "#e0e7ff", "#fbcfe8"] },
        move: { direction: "none", enable: true, outModes: "out", speed: 0.5, straight: false },
        number: { density: { enable: true, value_area: 800 }, value: 100 },
        opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 2, sync: false } },
        shape: { type: "circle" },
        size: { value: { min: 0.5, max: 2 }, animation: { enable: true, speed: 2, sync: false } },
      }
    };
  } else if (type === 'sakura') {
    options = {
      fpsLimit: 60,
      particles: {
        color: { value: ["#fbcfe8", "#f472b6", "#fdf2f8"] },
        move: { direction: "bottom-right", enable: true, outModes: "out", speed: 2, straight: false },
        number: { density: { enable: true, value_area: 800 }, value: 40 },
        opacity: { value: { min: 0.5, max: 0.9 } },
        shape: { type: "circle" },
        size: { value: { min: 3, max: 8 }, animation: { enable: true, speed: 1, sync: false } },
        wobble: { enable: true, distance: 10, speed: 5 }
      }
    };
  }

  if (!init) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20" style={{ width: '100%', height: '100%' }}>
      <Particles
        id={`tsparticles-${type}`}
        options={{
          ...options,
          fullScreen: { enable: false, zIndex: 0 },
          detectRetina: true,
        }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
    </div>
  );
}
