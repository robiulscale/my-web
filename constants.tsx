
import { ThemeOption, ContactInfo } from './types';

// Convert GitHub blob links to raw links for correct image rendering
export const IMAGES = {
  profile: "https://lh3.googleusercontent.com/d/1POEHHioV_B2a11h-R_bJtXP_m6N9MMzh",
  gallery: [
    "https://lh3.googleusercontent.com/d/1Ow62W3ZEeobmWXxasDEjxwFuAiiiBN4G",
    "https://lh3.googleusercontent.com/d/1ALv0mNyqCuL5ZsySKXKCoyoMZRMFPK_d",
    "https://lh3.googleusercontent.com/d/1VXfqWsVvPf8dyoaRW8P2zkn6uKPiVaz1",
    "https://lh3.googleusercontent.com/d/1o2-n66eCgueLsZ0J6vGGiDMrHOKTKc_i"
  ],
  audio: "/audio.mp3"
};

export const THEME_COLORS: ThemeOption[] = [
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Purple', color: '#8b5cf6' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Amber', color: '#f59e0b' },
  { name: 'Indigo', color: '#6366f1' }
];

export const ROBIUL_DATA = {
  name: "Md. Robiul Islam",
  title: "Aspiring Digital Marketer & AI Enthusiast",
  education: "B.A. Degree Pass Course, National University of Bangladesh",

  skills: [
    "Google Ads",
    "Digital Marketing"
  ],

  learning: [
    "Artificial Intelligence",
    "Emerging Technologies"
  ],

  values: [
    "Humanity",
    "Kindness",
    "Helping Others"
  ],

  mindset: "Learn, Grow, and Make a Positive Difference",

  mission: "To develop my skills in digital marketing and AI while using my knowledge to help people and make a positive impact on society."
};

export interface EnhancedContactInfo extends ContactInfo {
  number: number;
  subtitle: string;
}

export const SOCIAL_CONNECTS: EnhancedContactInfo[] = [
  { number: 1, platform: "Facebook", value: "Robiul Islam", link: "https://www.facebook.com/robiul.scale", subtitle: "Social updates" },
  { number: 2, platform: "Instagram", value: "@robiul.scale", link: "https://www.instagram.com/robiul.scale", subtitle: "Daily moments" },
  { number: 3, platform: "X", value: "@robiulscale", link: "https://x.com/robiulscale", subtitle: "Quick thoughts" },
  { number: 4, platform: "LinkedIn", value: "Robiul Islam", link: "https://www.linkedin.com/in/md-robiul-islam-1b1001391/", subtitle: "Professional network" }
];

export const CONTACTS: ContactInfo[] = [
  { platform: "Email", value: "robiul.islam@example.com", link: "mailto:robiul.islam@example.com" },
  { platform: "Facebook", value: "Robiul Islam", link: "https://www.facebook.com/robiul.scale" },
  { platform: "LinkedIn", value: "Robiul Islam", link: "https://www.linkedin.com/in/md-robiul-islam-1b1001391/" }
];
