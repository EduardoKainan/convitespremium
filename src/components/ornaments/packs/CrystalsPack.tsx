import React from 'react';
import { Float } from '@react-three/drei';
import { OrnamentConfig } from '../../../types';

interface CrystalProps {
  color: string;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  speed: number;
}

function Crystal({ color, position, scale, rotation, speed }: CrystalProps) {
  return (
    <Float speed={speed} rotationIntensity={3} floatIntensity={2} position={position}>
      <mesh scale={scale} rotation={rotation}>
        <octahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.2} 
          roughness={0.1}
          transmission={0.9} // Glass-like
          thickness={0.5}
          ior={1.5}
        />
      </mesh>
    </Float>
  );
}

export function CrystalsPack({ color, config }: { color: string; config: OrnamentConfig }) {
  const { intensity, delicacy, quantity, movement } = config;
  
  const baseScale = 0.8 * (1 - delicacy * 0.4);
  const count = Math.max(3, Math.floor(quantity * 7));
  const baseSpeed = 1.5 + movement * 2;

  const items = [
    { pos: [-3, 4, -2], rot: [Math.PI / 4, 0, 0] },
    { pos: [3, -4, -5], rot: [0, Math.PI / 3, 0] },
    { pos: [4, 3, -3], rot: [Math.PI / 6, Math.PI / 6, 0] },
    { pos: [-4, -3, -4], rot: [0, 0, Math.PI / 4] },
    { pos: [0, 7, -6], rot: [Math.PI / 2, 0, 0] },
    { pos: [0, -7, -4], rot: [0, Math.PI / 2, 0] },
    { pos: [-2, -6, -3], rot: [Math.PI / 3, Math.PI / 4, 0] },
  ];

  return (
    <>
      {items.slice(0, count).map((item, i) => (
        <Crystal 
          key={i} 
          color={color} 
          position={item.pos as [number, number, number]} 
          rotation={item.rot as [number, number, number]}
          scale={baseScale * (1 + (i % 3) * 0.3)} 
          speed={baseSpeed * (1 + (i % 2) * 0.5)}
        />
      ))}
    </>
  );
}
