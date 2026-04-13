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

export type DecorationType = 'none' | 'floral' | 'geometric' | 'stars' | 'elegant' | 'butterflies' | 'delicate-flowers';

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
