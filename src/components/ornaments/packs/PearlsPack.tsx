import React from 'react';
import { Float } from '@react-three/drei';
import { OrnamentConfig } from '../../../types';

interface PearlProps {
  color: string;
  position: [number, number, number];
  scale: number;
  speed: number;
}

function Pearl({ color, position, scale, speed }: PearlProps) {
  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial 
          color={color} 
          metalness={0.1} 
          roughness={0.1} 
          clearcoat={1} 
          clearcoatRoughness={0.1} 
        />
      </mesh>
    </Float>
  );
}

export function PearlsPack({ color, config }: { color: string; config: OrnamentConfig }) {
  const { intensity, delicacy, quantity, movement } = config;
  
  // Base scale modified by delicacy (higher delicacy = smaller pearls)
  const baseScale = 0.8 * (1 - delicacy * 0.5);
  
  // Number of pearls based on quantity
  const count = Math.max(3, Math.floor(quantity * 8));
  
  // Speed based on movement
  const baseSpeed = 1 + movement * 2;

  const positions: [number, number, number][] = [
    [-3, 4, -2],
    [3, -4, -5],
    [4, 3, -3],
    [-4, -3, -4],
    [0, 7, -6],
    [0, -7, -4],
    [-2, -6, -3],
    [2, 6, -4],
  ];

  return (
    <>
      {positions.slice(0, count).map((pos, i) => (
        <Pearl 
          key={i} 
          color={color} 
          position={pos} 
          scale={baseScale * (1 + (i % 3) * 0.2)} 
          speed={baseSpeed * (1 + (i % 2) * 0.5)} 
        />
      ))}
    </>
  );
}
