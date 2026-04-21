export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  fontTitle: string;
  fontScript: string;
  fontBody: string;
}

export type DecorationType = 'floral' | 'geometric' | 'minimalist' | 'classic' | 'stars' | 'butterflies' | 'leaves' | 'none';
export type OrnamentPackId = 'none' | 'pearls-premium' | 'rings-metallic' | 'crystals-elegant' | 'floral-2d' | 'geometric-2d' | 'stars-2d' | 'elegant-2d' | 'butterflies-2d' | 'delicate-flowers-2d';
export type OccasionPresetId = 'wedding-classic' | 'wedding-modern' | 'sweet-16' | 'baby-shower' | 'birthday-luxe' | 'custom';

export type PageBackground = 'solid' | 'paper' | 'marble' | 'floral-light' | 'floral-dark' | 'geometric' | 'stars';

export interface OrnamentConfig {
  packId: OrnamentPackId;
  intensity: number; // 0 to 1
  delicacy: number; // 0 to 1 (affects scale/thickness)
  quantity: number; // 0 to 1
  movement: number; // 0 to 1 (animation speed)
}

export interface InvitationData {
  category: string;
  title: string;
  name: string;
  date: string;
  time: string;
  locationName: string;
  locationAddress: string;
  locationUrl: string;
  message: string;
  dressCode: string;
  rsvpLink: string;
  whatsappNumber?: string;
  pixKey?: string;
  finalMessage: string;
  
  // Global visual adjustments
  decorationType?: string;
  decorationScale?: number;
  decorationOffsetX?: number;
  decorationOffsetY?: number;

  occasionPresetId?: OccasionPresetId;
  
  premiumEffects?: {
    floralDrawing?: 'none' | 'gold-arabesque' | 'boho-leaves' | 'heart-flowers' | 'vine-leaves' | 'spring-flowers' | 'elegant-swirls';
    particles?: 'none' | 'rose-petals' | 'sparkles' | 'snow' | 'rain' | 'confetti' | 'stardust' | 'sakura';
    coverLottie?: 'none' | 'watercolor-flowers' | 'gold-mandala' | 'opening-rose';
  };

  pageBackground?: PageBackground;
  theme: ThemeConfig;
  images: {
    cover: string;
    hero: string;
    background: string;
    footer: string;
  };
  musicUrl: string;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  coverImage: string;
  defaultData: InvitationData;
}
