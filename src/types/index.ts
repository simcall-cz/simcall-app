export interface AIAgent {
  id: string;
  name: string;
  personality: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  avatarInitials: string;
  traits: string[];
  exampleScenario: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: "hot-lead" | "warm-lead" | "cold-lead" | "competitive" | "negotiation" | "listing";
  difficulty: "easy" | "medium" | "hard";
  objectives: string[];
  agentId: string;
  imageUrl?: string;
  tips?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  avatarInitials: string;
}

export interface PricingTier {
  calls: number;
  agents: number;
  price: number;
}

export interface PricingFeature {
  label: string;
  tooltip?: string;
}

export interface PricingPlan {
  id: "solo" | "team" | "enterprise";
  name: string;
  description: string;
  tiers: PricingTier[];
  features: PricingFeature[];
  highlighted: boolean;
  cta: string;
  ctaLink: string;
}

export interface FAQ {
  question: string;
  answer: string;
  category: "general" | "technology" | "pricing" | "security";
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}
