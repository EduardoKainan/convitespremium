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

export type DecorationType = 'none' | 'floral' | 'geometric' | 'stars' | 'elegant' | 'butterflies' | 'delicate-flowers' | '3d-rings' | '3d-diamonds' | '3d-spheres' | '3d-ribbons' | '3d-crystals' | '3d-confetti' | '3d-pyramids' | '3d-dodecahedrons';

export type PageBackground = 'solid' | 'paper' | 'marble' | 'floral-light' | 'floral-dark' | 'geometric' | 'stars';

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
  finalMessage: string;
  decorationType?: DecorationType;
  decorationScale?: number;
  decorationOffsetX?: number;
  decorationOffsetY?: number;
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
