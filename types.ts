
export interface ThemeOption {
  name: string;
  color: string;
}

export interface ContactInfo {
  platform: string;
  value: string;
  link: string;
}

export interface PortfolioData {
  robiul: {
    name: string;
    rank: string;
    status: string;
    interests: string[];
  };
  contacts: ContactInfo[];
}
