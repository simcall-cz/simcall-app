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

// ===== EVALUATION V2 TYPES =====

export interface EvalCheckpoint {
  label: string;
  passed: boolean;
}

export interface EvalCategory {
  label: string;
  weight: number;
  score: number;
  checkpoints: EvalCheckpoint[];
  critical_errors?: string[];
  note: string;
}

export interface EvalCriticalMoment {
  label: string;
  passed: boolean;
  evidence: string;
}

// ===== CallFeedback — V1 + V2 compatible =====
// V1 pole zachována pro backward compat se stávajícími záznamy v DB.
// V2 pole jsou volitelná — starší hovory je mít nebudou.

export interface CallFeedback {
  // V1 pole:
  overallScore: number;
  strengths: string[];
  improvements: string[];
  fillerWords: { word: string; count: number }[];
  recommendations: string[];
  summaryGood?: string;
  summaryImprove?: string;
  transcriptHighlights?: { index: number; highlight: "good" | "mistake" | null }[];

  // V2 pole:
  criticalMoment?: EvalCriticalMoment;
  categories?: {
    rapport: EvalCategory;
    discovery: EvalCategory;
    expertise: EvalCategory;
    objections: EvalCategory;
    communication: EvalCategory;
    closing: EvalCategory;
  };
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

export interface LessonDB {
  id: string;               // topic_id
  lessonNumber: number;      // 1-105
  titleCs: string;
  category: string;          // 14 engine categories
  skillsTested: string[];
  knowledgeSnippets: string[];
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
