export interface CallRecord {
  id: string;
  date: string;
  agentName: string;
  agentPersonality: string;
  scenario: string;
  duration: string;
  successRate: number;
  audioUrl: string | null;
  transcript: TranscriptEntry[];
  feedback: CallFeedback;
}

export interface TranscriptEntry {
  speaker: "user" | "ai";
  text: string;
  timestamp: string;
  highlight?: "good" | "mistake" | null;
}

export interface CallFeedback {
  overallScore: number;
  strengths: string[];
  improvements: string[];
  fillerWords: { word: string; count: number }[];
  recommendations: string[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
  duration: string;
  completed: boolean;
  progress: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  avatarInitials: string;
  memberSince: string;
  totalCalls: number;
  avgSuccessRate: number;
  callsThisWeek: number;
  bestScenario: string;
}

export interface TeamMember {
  id: string;
  name: string;
  avatarInitials: string;
  role: string;
  successRate: number;
  callsThisMonth: number;
  trend: "up" | "down" | "stable";
  lastActive: string;
}

export interface DailyStats {
  date: string;
  calls: number;
  successRate: number;
}
