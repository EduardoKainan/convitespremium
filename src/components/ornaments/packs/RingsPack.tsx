import React from 'react';
import { Float } from '@react-three/drei';
import { OrnamentConfig } from '../../../types';

interface RingProps {
  color: string;
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  speed: number;
  thickness: number;
}

function Ring({ color, position, scale, rotation, speed, thickness }: RingProps) {
  return (
    <Float speed={speed} rotationIntensity={2} floatIntensity={2} position={position}>
      <mesh scale={scale} rotation={rotation}>
        <torusGeometry args={[1, thickness, 16, 100]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
}

export function RingsPack({ color, config }: { color: string; config: OrnamentConfig }) {
  const { intensity, delicacy, quantity, movement } = config;
  
  const baseScale = 1.2 * (1 - delicacy * 0.3);
  const thickness = 0.05 * (1 - delicacy * 0.5); // Higher delicacy = thinner rings
  const count = Math.max(2, Math.floor(quantity * 6));
  const baseSpeed = 1 + movement * 2;

  const items = [
    { pos: [-3, 4, -2], rot: [Math.PI / 4, 0, 0] },
    { pos: [3, -4, -5], rot: [0, Math.PI / 3, 0] },
    { pos: [4, 3, -3], rot: [Math.PI / 6, Math.PI / 6, 0] },
    { pos: [-4, -3, -4], rot: [0, 0, Math.PI / 4] },
    { pos: [0, 7, -6], rot: [Math.PI / 2, 0, 0] },
    { pos: [0, -7, -4], rot: [0, Math.PI / 2, 0] },
  ];

  return (
    <>
      {items.slice(0, count).map((item, i) => (
        <Ring 
          key={i} 
          color={color} 
          position={item.pos as [number, number, number]} 
          rotation={item.rot as [number, number, number]}
          scale={baseScale * (1 + (i % 3) * 0.2)} 
          speed={baseSpeed * (1 + (i % 2) * 0.5)}
          thickness={thickness}
        />
      ))}
    </>
  );
}
