import { Player } from '@lottiefiles/react-lottie-player';

const LOTTIE_URLS = {
  'watercolor-flowers': 'https://lottie.host/809c961e-1282-45e0-b6ab-1d167fcf400b/1N1T0H77F4.json', // flor abrindo / aquarela
  'gold-mandala': 'https://lottie.host/e2c1ad3a-ebbc-49b2-a42e-1b306b998cfb/Y661Xv7p4m.json', // mandala / floral
  'opening-rose': 'https://lottie.host/beee02ec-f04b-4fd5-8a2b-2a29addec9fa/0y8E1cK76M.json' // rose
};

export default function LottieCover({ type }: { type: 'watercolor-flowers' | 'gold-mandala' | 'opening-rose' }) {
  if (!type || type === 'none') return null;
  
  const src = LOTTIE_URLS[type];

  return (
    <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center overflow-hidden opacity-90">
      <Player
        autoplay
        loop
        src={src}
        style={{ width: '130%', height: '130%' }}
      />
    </div>
  );
}
