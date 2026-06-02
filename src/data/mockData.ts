import { Coach, Scenario, Goal, HumanCoach, NewsItem } from '../types';

export const COACHES: Record<string, Coach> = {
  general: {
    id: 'general',
    name: 'RAWCOACH',
    tagline: 'ULTRA AI ARCHITECT',
    avatar: '⚡',
    avatarBg: 'bg-[#D2FF3A]',
    specialty: 'Enterprise Tech & Operations Redeployment',
    description: 'No-nonsense AI systems overhaul. Stop manually compiling spreadsheets and deploy modern agent streams.',
    welcomeMessage: 'Yo. Let\'s optimize your workflows. Tell me what processes or files your team is manually pushing, and I\'ll outline the automation map.',
    systemPrompt: ''
  },
  career: {
    id: 'career',
    name: 'GIGMASTER',
    tagline: 'GIG ECONOMY ARBITRAGE',
    avatar: '💎',
    avatarBg: 'bg-[#FF4F2E]',
    specialty: 'SaaS Arbitrage & Prompt Crafting',
    description: 'Stop working for standard rates. Learn to package custom LLM outputs and trade premium tech tasks.',
    welcomeMessage: 'Let\'s get this portfolio roasted. Tell me your role, what you normally charge, and let\'s turn it into a high-leverage agent product line.',
    systemPrompt: ''
  },
  leadership: {
    id: 'leadership',
    name: 'FORGE',
    tagline: 'FOUNDER & CEO INTELLIGENCE',
    avatar: '👁️',
    avatarBg: 'bg-black text-white border border-[#D2FF3A]',
    specialty: 'Executive Alignment & Task Force Creation',
    description: 'Coach CEOs to lead AI-powered workforces. Maximize resource leverage, tackle workforce friction, and scale speed.',
    welcomeMessage: 'Welcome Founder. Accelerating execution speed is our primary metric. Where is your team struggling to integrate AI tools today?',
    systemPrompt: ''
  },
  learning: {
    id: 'learning',
    name: 'CODELAB',
    tagline: 'MICRO-TOOL ACCELERATOR',
    avatar: '✨',
    avatarBg: 'bg-[#00E5FF]',
    specialty: 'Cursor, Midjourney & API Architectures',
    description: 'Short step-by-step cheatsheets and config syntaxes. Skip the fluff and build fast.',
    welcomeMessage: 'What tool are you building today? Pitch me the tech stack, and I\'ll output the instant configuration schema block.',
    systemPrompt: ''
  }
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'cfo-budget',
    title: 'Pitching AI Task Force Budget to CFO',
    description: 'Persuade a conservative CFO to allocate $120k for an internal AI operational overhaul.',
    role: 'Traditional Conservative CFO who hates "hype cycles" and asks for strict ROI.',
    aiPersona: 'Angry, metric-focused CFO who calls AI a "fancy spellchecker" that creates compliance risks.',
    initialMessage: 'Look, we already pay $8,000 a month for our enterprise SaaS subscriptions. Why should I authorize an extra $120k for this "AI task force" project? What is the actual hard dollar timeline?',
    context: 'The company currently burns 80 hours a week on manual inventory data auditing.',
    difficulty: 'Savage'
  },
  {
    id: 'employees-fears',
    title: 'Manager addressing AI Replacement Fears',
    description: 'De-escalate tension with your lead operations manager who is worried AI will make their team redundant.',
    role: 'Operational Lead who is protective of their team group of 12 employees.',
    aiPersona: 'Anxious, dedicated operations manager who believes executive management is plotting silent layoffs.',
    initialMessage: 'The crew is terrified. They saw the memo about "workflows automation". Are you telling us we are all getting replaced by a script? Why should we help train our replacements?',
    context: 'We are deploying AI tools to elevate operations from simple entry to strategic optimization.',
    difficulty: 'Medium'
  },
  {
    id: 'client-ai-pricing',
    title: 'Selling AI-Powered Services at Premium Rates',
    description: 'Get a major design & content client to accept a 40% rate increase while disclosing your use of custom AI models.',
    role: 'Prestige-focused CMO who demands top-tier custom quality.',
    aiPersona: 'Curious CMO who wants premium output but worries using AI is a "lazy shortcut" that drops brand style.',
    initialMessage: 'I understand you want to use technology to speed up your work. But if you are using AI, shouldn\'t your service be *cheaper* for us instead of 40% more expensive? Where is the bespoke value?',
    context: 'Our custom models deliver 5x content variations with pixel-perfect design continuity.',
    difficulty: 'Chill'
  }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Assemble Rogue AI Task Force (2 Engineers, 1 Creator)',
    category: 'Task Force',
    status: 'In Progress',
    dueDate: '2026-06-10',
    streak: 3
  },
  {
    id: '2',
    title: 'Automate content translation with server-side batch AI pipeline',
    category: 'AI Deployment',
    status: 'Pending',
    dueDate: '2026-06-15',
    streak: 0
  },
  {
    id: '3',
    title: 'Roast founder presentation for the series-A pitch',
    category: 'Ceo Action',
    status: 'Done',
    dueDate: '2026-05-30',
    streak: 1
  },
  {
    id: '4',
    title: 'Daily AI Tool micro-learning (Cursor & Midjourney v6)',
    category: 'Habit',
    status: 'In Progress',
    dueDate: '2026-06-01',
    streak: 14
  }
];

export const HUMAN_COACHES: HumanCoach[] = [
  {
    id: 'hc-1',
    name: 'Zephyr Vance',
    role: 'Ex-Vercel Enterprise Solutions Lead',
    rating: 4.9,
    reviews: 84,
    specialties: ['Custom Agent Frameworks', 'CEO Tooling Sparring', 'Next.js Automations'],
    rate: 220,
    avatar: '👨‍🎤',
    bio: 'Built deployment channels with extreme retention. Here to restructure enterprise technology layers without traditional corporate lag.',
    clientsWorkedAt: ['Stripe', 'Supabase', 'Linear'],
    availableSlots: ['Mon 2pm', 'Tue 10am', 'Thu 4pm']
  },
  {
    id: 'hc-2',
    name: 'Kora Sterling',
    role: 'AI Workforce Design Consultant',
    rating: 5.0,
    reviews: 112,
    specialties: ['AI Org Restructuring', 'Resource Offloading', 'Change Management'],
    rate: 270,
    avatar: '👩‍🎤',
    bio: 'I replace bloated internal spreadsheets with streamlined AI workforces. Coach CEOs to handle personnel redeployment elegantly.',
    clientsWorkedAt: ['Retool', 'Figma', 'Attentive'],
    availableSlots: ['Wed 9am', 'Wed 11am', 'Fri 3pm']
  },
  {
    id: 'hc-3',
    name: 'Dax Thorne',
    role: 'SaaS Arbitrage & Prompt Architect',
    rating: 4.8,
    reviews: 95,
    specialties: ['Prompt Arbitrage', 'Cursor Workflow Scaling', 'Low-Code Pipelines'],
    rate: 180,
    avatar: '🧑‍🚀',
    bio: 'Helping builders deploy bespoke niche models that generate cashflow. Learn prompt strategies the top 1% use.',
    clientsWorkedAt: ['Vercel', 'Copy.ai', 'Daily.co'],
    availableSlots: ['Tue 1pm', 'Wed 5pm', 'Fri 10am']
  }
];

export const LATEST_NEWS: NewsItem[] = [
  {
    id: 'n-1',
    title: 'Multi-Agent Autonomous Staffs Replace Manual Entry in Top 20% of US Logistics SaaS APIs',
    source: 'TechCrunch Vibe',
    time: '2 hours ago',
    sentiment: 'Bullish'
  },
  {
    id: 'n-2',
    title: 'Founders using interactive AI Sparring bots close series rounds 30% faster, telemetry reports',
    source: 'VC Dispatch',
    time: '5 hours ago',
    sentiment: 'Hype'
  },
  {
    id: 'n-3',
    title: 'Are AI task forces creating burnout? Corporate HR teams express skepticism over raw deployment rate',
    source: 'Wired Real',
    time: '1 day ago',
    sentiment: 'Skeptical'
  },
  {
    id: 'n-4',
    title: 'Mobile WhatsApp Coaching spikes on high volume as founders monitor pipelines via phone sandboxes',
    source: 'SaaS Insider',
    time: '2 days ago',
    sentiment: 'Bullish'
  }
];
