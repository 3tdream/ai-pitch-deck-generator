// Type definitions for AI Pitch Deck Generator

export type ViewType = 'home' | 'deck' | 'edit';

export interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  button: string;
}

export interface TitleSlide {
  type: 'title';
  title: string;
  subtitle: string;
  content: string;
}

export interface ProblemSlide {
  type: 'problem';
  title: string;
  points: string[];
}

export interface SolutionSlide {
  type: 'solution';
  title: string;
  description: string;
  features: string[];
}

export interface MarketSlide {
  type: 'market';
  title: string;
  stat: string;
  description: string;
  details: string;
}

export interface BusinessSlide {
  type: 'business';
  title: string;
  tiers: {
    name: string;
    price: string;
    users: string;
  }[];
}

export interface TractionSlide {
  type: 'traction';
  title: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface TeamSlide {
  type: 'team';
  title: string;
  members: {
    name: string;
    role: string;
    background: string;
  }[];
}

export interface AskSlide {
  type: 'ask';
  title: string;
  amount: string;
  usage: string;
  goal: string;
}

export type Slide =
  | TitleSlide
  | ProblemSlide
  | SolutionSlide
  | MarketSlide
  | BusinessSlide
  | TractionSlide
  | TeamSlide
  | AskSlide;

export interface Deck {
  id: number;
  title: string;
  description: string;
  date: string;
  slideCount: number;
  colorScheme: ColorScheme;
  slides: Slide[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
