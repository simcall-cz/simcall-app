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
  category: "hot-lead" | "cold-lead" | "competitive" | "negotiation" | "listing";
  difficulty: "easy" | "medium" | "hard";
  objectives: string[];
  agentId: string;
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

export interface PricingPlan {
  id: string;
  name: string;
  price: string;
  priceAnnual: string;
  description: string;
  features: string[];
  highlighted: boolean;
  cta: string;
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
