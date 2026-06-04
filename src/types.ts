export interface Message {
  id: string;
  sender: 'user' | 'coach' | 'system';
  text: string;
  timestamp: string;
}

export type CoachId = 'general' | 'career' | 'leadership' | 'learning';

export interface Coach {
  id: CoachId;
  name: string;
  tagline: string;
  avatar: string;
  avatarBg: string;
  specialty: string;
  description: string;
  welcomeMessage: string;
  systemPrompt: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  role: string;
  aiPersona: string;
  initialMessage: string;
  context: string;
  difficulty: 'Chill' | 'Medium' | 'Savage';
}

export interface Goal {
  id: string;
  title: string;
  category: 'Task Force' | 'AI Deployment' | 'Habit' | 'Ceo Action';
  status: 'Pending' | 'In Progress' | 'Done';
  dueDate: string;
  streak: number;
}

export interface HumanCoach {
  id: string;
  name: string;
  role: string;
  rating: number;
  reviews: number;
  specialties: string[];
  rate: number;
  avatar: string;
  bio: string;
  clientsWorkedAt: string[];
  availableSlots: string[];
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  sentiment: 'Bullish' | 'Hype' | 'Neutral' | 'Skeptical';
  url?: string;
}

export interface CommunityInsight {
  id: string;
  authorUid: string;
  authorName: string;
  authorRole: string;
  title: string;
  type: 'question' | 'experience' | 'case_study';
  content: string;
  likesCount: number;
  createdAt: any;
  updatedAt: any;
}
