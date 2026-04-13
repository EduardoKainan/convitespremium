import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { DecorationType } from '../types';

interface Props {
  type?: DecorationType;
  color: string;
}

function Ring({ color, position, scale, rotation }: any) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2} position={position}>
      <mesh scale={scale} rotation={rotation}>
        <torusGeometry args={[1, 0.05, 16, 100]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
}

function Diamond({ color, position, scale, rotation }: any) {
  return (
    <Float speed={2.5} rotationIntensity={3} floatIntensity={2} position={position}>
      <mesh scale={scale} rotation={rotation}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  );
}

export default function ThreeDecorations({ type, color }: Props) {
  if (type !== '3d-rings' && type !== '3d-diamonds') return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]} style={{ pointerEvents: 'none' }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Environment preset="city" />
        
        {type === '3d-rings' && (
          <>
            <Ring color={color} position={[-3, 4, -2]} scale={1.5} rotation={[Math.PI / 4, 0, 0]} />
            <Ring color={color} position={[3, -4, -5]} scale={2} rotation={[0, Math.PI / 3, 0]} />
            <Ring color={color} position={[4, 3, -3]} scale={1} rotation={[Math.PI / 6, Math.PI / 6, 0]} />
            <Ring color={color} position={[-4, -3, -4]} scale={1.2} rotation={[0, 0, Math.PI / 4]} />
            <Ring color={color} position={[0, 7, -6]} scale={1.8} rotation={[Math.PI / 2, 0, 0]} />
            <Ring color={color} position={[0, -7, -4]} scale={1.4} rotation={[0, Math.PI / 2, 0]} />
          </>
        )}

        {type === '3d-diamonds' && (
          <>
            <Diamond color={color} position={[-3, 4, -2]} scale={0.8} rotation={[Math.PI / 4, 0, 0]} />
            <Diamond color={color} position={[3, -4, -5]} scale={1.2} rotation={[0, Math.PI / 3, 0]} />
            <Diamond color={color} position={[4, 3, -3]} scale={0.6} rotation={[Math.PI / 6, Math.PI / 6, 0]} />
            <Diamond color={color} position={[-4, -3, -4]} scale={0.9} rotation={[0, 0, Math.PI / 4]} />
            <Diamond color={color} position={[0, 7, -6]} scale={1.1} rotation={[Math.PI / 2, 0, 0]} />
            <Diamond color={color} position={[0, -7, -4]} scale={0.7} rotation={[0, Math.PI / 2, 0]} />
          </>
        )}
      </Canvas>
    </div>
  );
}
