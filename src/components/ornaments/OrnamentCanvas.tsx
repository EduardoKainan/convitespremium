import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { OrnamentConfig } from '../../types';
import { PearlsPack } from './packs/PearlsPack';
import { RingsPack } from './packs/RingsPack';
import { CrystalsPack } from './packs/CrystalsPack';

interface Props {
  config?: OrnamentConfig;
  color: string;
}

export default function OrnamentCanvas({ config, color }: Props) {
  if (!config || config.packId === 'none' || config.packId.endsWith('-2d')) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }} dpr={[1, 2]} style={{ pointerEvents: 'none' }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={2} />
          <Environment preset="city" />
          
          {config.packId === 'pearls-premium' && <PearlsPack color={color} config={config} />}
          {config.packId === 'rings-metallic' && <RingsPack color={color} config={config} />}
          {config.packId === 'crystals-elegant' && <CrystalsPack color={color} config={config} />}
        </Canvas>
      </div>
    </div>
  );
}
