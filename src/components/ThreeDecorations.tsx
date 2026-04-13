import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import { DecorationType } from '../types';

interface Props {
  type?: DecorationType;
  color: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
}

function Ring({ color, position, scale, rotation, globalScale }: any) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2} position={position}>
      <mesh scale={scale * globalScale} rotation={rotation}>
        <torusGeometry args={[1, 0.05, 16, 100]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
}

function Diamond({ color, position, scale, rotation, globalScale }: any) {
  return (
    <Float speed={2.5} rotationIntensity={3} floatIntensity={2} position={position}>
      <mesh scale={scale * globalScale} rotation={rotation}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  );
}

function Pearl({ color, position, scale, rotation, globalScale }: any) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2} position={position}>
      <mesh scale={scale * globalScale} rotation={rotation}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhysicalMaterial color={color} metalness={0.1} roughness={0.1} clearcoat={1} clearcoatRoughness={0.1} />
      </mesh>
    </Float>
  );
}

function Ribbon({ color, position, scale, rotation, globalScale }: any) {
  return (
    <Float speed={1.5} rotationIntensity={3} floatIntensity={2} position={position}>
      <mesh scale={scale * globalScale} rotation={rotation}>
        <torusKnotGeometry args={[0.8, 0.2, 100, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  );
}

function Gem({ color, position, scale, rotation, globalScale }: any) {
  return (
    <Float speed={2.5} rotationIntensity={2} floatIntensity={2} position={position}>
      <mesh scale={scale * globalScale} rotation={rotation}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} metalness={0.9} roughness={0.1} />
      </mesh>
    </Float>
  );
}

function Confetti({ color, position, scale, rotation, globalScale }: any) {
  return (
    <Float speed={3} rotationIntensity={4} floatIntensity={3} position={position}>
      <mesh scale={scale * globalScale} rotation={rotation}>
        <cylinderGeometry args={[1, 1, 0.05, 16]} />
        <meshStandardMaterial color={color} metalness={1} roughness={0.2} />
      </mesh>
    </Float>
  );
}

function Pyramid({ color, position, scale, rotation, globalScale }: any) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2} position={position}>
      <mesh scale={scale * globalScale} rotation={rotation}>
        <coneGeometry args={[1, 1.5, 4]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.2} />
      </mesh>
    </Float>
  );
}

function Polygon({ color, position, scale, rotation, globalScale }: any) {
  return (
    <Float speed={2} rotationIntensity={2} floatIntensity={2} position={position}>
      <mesh scale={scale * globalScale} rotation={rotation}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
    </Float>
  );
}

export default function ThreeDecorations({ type, color, scale = 1, offsetX = 0, offsetY = 0 }: Props) {
  const validTypes = ['3d-rings', '3d-diamonds', '3d-spheres', '3d-ribbons', '3d-crystals', '3d-confetti', '3d-pyramids', '3d-dodecahedrons'];
  if (!validTypes.includes(type as string)) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50" style={{ transform: `translate(${offsetX}px, ${offsetY}px)` }}>
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]} style={{ pointerEvents: 'none' }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <Environment preset="city" />
          
          {type === '3d-rings' && (
            <>
              <Ring color={color} position={[-3, 4, -2]} scale={1.5} globalScale={scale} rotation={[Math.PI / 4, 0, 0]} />
              <Ring color={color} position={[3, -4, -5]} scale={2} globalScale={scale} rotation={[0, Math.PI / 3, 0]} />
              <Ring color={color} position={[4, 3, -3]} scale={1} globalScale={scale} rotation={[Math.PI / 6, Math.PI / 6, 0]} />
              <Ring color={color} position={[-4, -3, -4]} scale={1.2} globalScale={scale} rotation={[0, 0, Math.PI / 4]} />
              <Ring color={color} position={[0, 7, -6]} scale={1.8} globalScale={scale} rotation={[Math.PI / 2, 0, 0]} />
              <Ring color={color} position={[0, -7, -4]} scale={1.4} globalScale={scale} rotation={[0, Math.PI / 2, 0]} />
            </>
          )}

          {type === '3d-diamonds' && (
            <>
              <Diamond color={color} position={[-3, 4, -2]} scale={0.8} globalScale={scale} rotation={[Math.PI / 4, 0, 0]} />
              <Diamond color={color} position={[3, -4, -5]} scale={1.2} globalScale={scale} rotation={[0, Math.PI / 3, 0]} />
              <Diamond color={color} position={[4, 3, -3]} scale={0.6} globalScale={scale} rotation={[Math.PI / 6, Math.PI / 6, 0]} />
              <Diamond color={color} position={[-4, -3, -4]} scale={0.9} globalScale={scale} rotation={[0, 0, Math.PI / 4]} />
              <Diamond color={color} position={[0, 7, -6]} scale={1.1} globalScale={scale} rotation={[Math.PI / 2, 0, 0]} />
              <Diamond color={color} position={[0, -7, -4]} scale={0.7} globalScale={scale} rotation={[0, Math.PI / 2, 0]} />
            </>
          )}

          {type === '3d-spheres' && (
            <>
              <Pearl color={color} position={[-3, 4, -2]} scale={0.8} globalScale={scale} rotation={[0, 0, 0]} />
              <Pearl color={color} position={[3, -4, -5]} scale={1.2} globalScale={scale} rotation={[0, 0, 0]} />
              <Pearl color={color} position={[4, 3, -3]} scale={0.6} globalScale={scale} rotation={[0, 0, 0]} />
              <Pearl color={color} position={[-4, -3, -4]} scale={0.9} globalScale={scale} rotation={[0, 0, 0]} />
              <Pearl color={color} position={[0, 7, -6]} scale={1.1} globalScale={scale} rotation={[0, 0, 0]} />
              <Pearl color={color} position={[0, -7, -4]} scale={0.7} globalScale={scale} rotation={[0, 0, 0]} />
            </>
          )}

          {type === '3d-ribbons' && (
            <>
              <Ribbon color={color} position={[-3, 4, -2]} scale={1} globalScale={scale} rotation={[Math.PI / 4, 0, 0]} />
              <Ribbon color={color} position={[3, -4, -5]} scale={1.5} globalScale={scale} rotation={[0, Math.PI / 3, 0]} />
              <Ribbon color={color} position={[4, 3, -3]} scale={0.8} globalScale={scale} rotation={[Math.PI / 6, Math.PI / 6, 0]} />
              <Ribbon color={color} position={[-4, -3, -4]} scale={1.2} globalScale={scale} rotation={[0, 0, Math.PI / 4]} />
              <Ribbon color={color} position={[0, 7, -6]} scale={1.4} globalScale={scale} rotation={[Math.PI / 2, 0, 0]} />
              <Ribbon color={color} position={[0, -7, -4]} scale={0.9} globalScale={scale} rotation={[0, Math.PI / 2, 0]} />
            </>
          )}

          {type === '3d-crystals' && (
            <>
              <Gem color={color} position={[-3, 4, -2]} scale={0.8} globalScale={scale} rotation={[Math.PI / 4, 0, 0]} />
              <Gem color={color} position={[3, -4, -5]} scale={1.2} globalScale={scale} rotation={[0, Math.PI / 3, 0]} />
              <Gem color={color} position={[4, 3, -3]} scale={0.6} globalScale={scale} rotation={[Math.PI / 6, Math.PI / 6, 0]} />
              <Gem color={color} position={[-4, -3, -4]} scale={0.9} globalScale={scale} rotation={[0, 0, Math.PI / 4]} />
              <Gem color={color} position={[0, 7, -6]} scale={1.1} globalScale={scale} rotation={[Math.PI / 2, 0, 0]} />
              <Gem color={color} position={[0, -7, -4]} scale={0.7} globalScale={scale} rotation={[0, Math.PI / 2, 0]} />
            </>
          )}

          {type === '3d-confetti' && (
            <>
              <Confetti color={color} position={[-3, 4, -2]} scale={0.8} globalScale={scale} rotation={[Math.PI / 4, 0, 0]} />
              <Confetti color={color} position={[3, -4, -5]} scale={1.2} globalScale={scale} rotation={[0, Math.PI / 3, 0]} />
              <Confetti color={color} position={[4, 3, -3]} scale={0.6} globalScale={scale} rotation={[Math.PI / 6, Math.PI / 6, 0]} />
              <Confetti color={color} position={[-4, -3, -4]} scale={0.9} globalScale={scale} rotation={[0, 0, Math.PI / 4]} />
              <Confetti color={color} position={[0, 7, -6]} scale={1.1} globalScale={scale} rotation={[Math.PI / 2, 0, 0]} />
              <Confetti color={color} position={[0, -7, -4]} scale={0.7} globalScale={scale} rotation={[0, Math.PI / 2, 0]} />
              <Confetti color={color} position={[-2, -6, -3]} scale={1} globalScale={scale} rotation={[Math.PI / 3, Math.PI / 4, 0]} />
              <Confetti color={color} position={[2, 6, -4]} scale={0.8} globalScale={scale} rotation={[0, Math.PI / 6, Math.PI / 2]} />
            </>
          )}

          {type === '3d-pyramids' && (
            <>
              <Pyramid color={color} position={[-3, 4, -2]} scale={0.8} globalScale={scale} rotation={[Math.PI / 4, 0, 0]} />
              <Pyramid color={color} position={[3, -4, -5]} scale={1.2} globalScale={scale} rotation={[0, Math.PI / 3, 0]} />
              <Pyramid color={color} position={[4, 3, -3]} scale={0.6} globalScale={scale} rotation={[Math.PI / 6, Math.PI / 6, 0]} />
              <Pyramid color={color} position={[-4, -3, -4]} scale={0.9} globalScale={scale} rotation={[0, 0, Math.PI / 4]} />
              <Pyramid color={color} position={[0, 7, -6]} scale={1.1} globalScale={scale} rotation={[Math.PI / 2, 0, 0]} />
              <Pyramid color={color} position={[0, -7, -4]} scale={0.7} globalScale={scale} rotation={[0, Math.PI / 2, 0]} />
            </>
          )}

          {type === '3d-dodecahedrons' && (
            <>
              <Polygon color={color} position={[-3, 4, -2]} scale={0.8} globalScale={scale} rotation={[Math.PI / 4, 0, 0]} />
              <Polygon color={color} position={[3, -4, -5]} scale={1.2} globalScale={scale} rotation={[0, Math.PI / 3, 0]} />
              <Polygon color={color} position={[4, 3, -3]} scale={0.6} globalScale={scale} rotation={[Math.PI / 6, Math.PI / 6, 0]} />
              <Polygon color={color} position={[-4, -3, -4]} scale={0.9} globalScale={scale} rotation={[0, 0, Math.PI / 4]} />
              <Polygon color={color} position={[0, 7, -6]} scale={1.1} globalScale={scale} rotation={[Math.PI / 2, 0, 0]} />
              <Polygon color={color} position={[0, -7, -4]} scale={0.7} globalScale={scale} rotation={[0, Math.PI / 2, 0]} />
            </>
          )}
        </Canvas>
      </div>
    </div>
  );
}
