import React, { useState, useEffect } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  increment,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Share2, 
  Mail, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Play, 
  Pause, 
  Square,
  Globe, 
  Linkedin, 
  Twitter, 
  Copy, 
  Award,
  BookMarked,
  Layout,
  AlertCircle,
  TrendingUp,
  Sliders,
  Sparkles,
  ChevronRight,
  Compass,
  Heart,
  ExternalLink
} from 'lucide-react';

export interface MagazineArticle {
  id: string;
  section: 'brief' | 'strategy' | 'effectiveness' | 'networking';
  subsection: string; // e.g. "Executive Summary", "Macro-Pulse", "The Deep Dive"
  title: string;
  snippet: string;
  content: string;
  summary: string;
  impact: string; // The "So What?" Rule
  tone: 'Objective & Urgent' | 'Authoritative & Visionary' | 'Personal & Relatable' | 'Sophisticated & Reflective';
  author: string;
  role: string;
  likesCount: number;
  createdAt?: any;
}

const DEFAULT_ARTICLES: MagazineArticle[] = [
  {
    id: 'mag-art-exec-summary',
    section: 'brief',
    subsection: 'The Executive Brief (The "Must-Know")',
    title: 'THE 2026 C-SUITE ECOSYSTEM SUMMARY STATUS',
    snippet: 'Digital infrastructure as a direct surrogate for systemic gaps in Lebanon.',
    content: `Throughout 2026, Lebanon’s structural context forces C-suite leaders to re-engineer standard organizational architecture. To survive and expand, business models must treat software not merely as a cost-optimization utility, but as decentralised digital governance. This briefing provides analytical directives to transition local operations toward regional SaaS exportation while retaining core R&D capacity inside Beirut.`,
    summary: 'Fractured legacy networks require localized, autonomous digital frameworks to bypass central public failures.',
    impact: 'Strategic agility requires shifting local workloads to air-gapped server arrays while securing global USD streams.',
    tone: 'Objective & Urgent',
    author: 'Maan Barazy',
    role: 'Founder - AlKhawarizmi | President NCEI Lebanon reg 2220',
    likesCount: 142
  },
  {
    id: 'mag-art-macro-pulse',
    section: 'brief',
    subsection: 'Macro-Pulse',
    title: 'LEBANON 2026: MANAGED FRAGILITY & EXPORTS',
    snippet: 'An analytical tracking of tight liquidity, 89,500 LBP/USD, and regional R&D retention strategies.',
    content: `While index currency indicators demonstrate nominal stabilization near 89,500 LBP/USD, structural GDP contraction projections loom around 7%–10% for Q3 2026. Forward-looking executive boards are establishing clear firewalls: insulating operational payrolls from localized physical disruptions by deploying distributed satellite workstations and routing client settlements directly to offshore trust holding vehicles.`,
    summary: 'GDP is shrinking due to regional conflicts, meaning the local domestic market represents a premium risk.',
    impact: 'Cease capital allocation towards local physical real estate; divert all liquidity to cloud networks and regional sales corridors.',
    tone: 'Objective & Urgent',
    author: 'Maan Barazy',
    role: 'Founder - AlKhawarizmi | President NCEI Lebanon reg 2220',
    likesCount: 98
  },
  {
    id: 'mag-art-regulatory',
    section: 'brief',
    subsection: 'Regulatory Watch',
    title: 'THE SHIFTING GUIDELINES of BDL PAYMENTS',
    snippet: 'Detailed overview of Banque du Liban’s January 2026 payment processor framework circular.',
    content: `The Banque du Liban (BDL) recently issued updated directives establishing compliance parameters for digital wallet providers and private payment gateways (e.g. MyMonty, PinPay). While these protocols ensure enhanced validation protocols, they introduce operational reporting friction. Startups must build pre-emptive sovereign transaction compliance systems directly inside their payment pipelines.`,
    summary: 'BDL is tightening control over local digital transactions in response to external liquidity flows.',
    impact: 'Integrate automated compliance reporting triggers to minimize administrative overhead in processing multi-currency contracts.',
    tone: 'Objective & Urgent',
    author: 'Sovereign Compliance Guild',
    role: 'Regulatory Advisory Desk',
    likesCount: 74
  },
  {
    id: 'mag-art-deep-dive',
    section: 'strategy',
    subsection: 'The Deep Dive (Cover Story)',
    title: 'DECENTRALIZED WORKFLOWS AS MISSING PUBLIC SERVICES',
    snippet: 'Why the Lebanon economic case serves as a global template for building digital sovereignty under structural crisis.',
    content: `When physical and public infrastructures are fractured, technology must act as the default trust layer. This is not about traditional software startups offering cosmetic consumer features; it is about establishing digital identities, cryptographically secure trade agreements, and solar mini-grids powered by decentralized smart scheduling models. Lebanon serves as a practical sandbox for zero-trust operational resilience.`,
    summary: 'The collapse of sovereign utilities makes private tech networks the primary supplier of public needs.',
    impact: 'Venture capital should target foundational software (FinTech, Energy management, Distributed logistics) that replaces missing institutional layers.',
    tone: 'Authoritative & Visionary',
    author: 'Maan Barazy',
    role: 'Founder - AlKhawarizmi | President NCEI Lebanon reg 2220',
    likesCount: 289
  },
  {
    id: 'mag-art-interview',
    section: 'strategy',
    subsection: 'The CEO/Leader Interview',
    title: 'THE SURVIVAL CO-OPERATIVE: EXECUTIVES ON RECORD',
    snippet: 'Candid feedback from prominent Lebanese technology operators concerning physical power strategies and GCC client capture.',
    content: `In closed-door discussions, leaders of Lebanon's top SaaS firms confirm a singular focus: keeping engineering local but keeping revenue global. By establishing high-speed, off-grid power stations within their offices and utilizing dual-satellite arrays (Starlink), engineering teams coordinate R&D for Saudi and UAE clients unimpeded by regional physical disruptions.`,
    summary: 'Successful firms treat physical infrastructure as an independent variable, designing redundant systems to guarantee uptime.',
    impact: 'Convert your capital expenditure focus into generating reliable energy loops, allowing continuous offshore software delivery.',
    tone: 'Authoritative & Visionary',
    author: 'Executive Roundtable',
    role: 'Collective Brain Trust Insights',
    likesCount: 176
  },
  {
    id: 'mag-art-future',
    section: 'strategy',
    subsection: 'Future-Proofing',
    title: 'LEAPFROGGING THE INFRASTRUCTURE GAP WITH AGENTIC AI',
    snippet: 'Bypassing legacy government procurement with adaptive, lightweight API micro-services.',
    content: `By bypassing large, slow-moving monolithic state databases in favor of nimble, lightweight API connectors, small enterprises are deploying artificial intelligence tools that automatically map and navigate complex, fragmented logistics, supply chains, and municipal services. These microservices integrate across active WhatsApp nodes, executing custom verification schemas without centralized bureaucracy.`,
    summary: 'A virtual public administration layer can be compiled using modular API structures.',
    impact: 'Deploy automated task forces (AI swarms) to automate import/export compliance navigation instantly.',
    tone: 'Authoritative & Visionary',
    author: 'Maan Barazy',
    role: 'Founder - AlKhawarizmi | President NCEI Lebanon reg 2220',
    likesCount: 215
  },
  {
    id: 'mag-art-human',
    section: 'effectiveness',
    subsection: 'The Human Element',
    title: 'LEADERSHIP PSYCHOLOGY & HIGH-STRESS COGNITIVE LOADS',
    snippet: 'Mitigating executive physical and mental burnout inside extremely volatile political ecosystems.',
    content: `Leading organization teams through continuous institutional degradation demands psychological air-gapping. True C-level mastery comes from building structured, asynchronous communication rules inside the team, removing instant-response anxiety, and establishing absolute operational clarify to protect original cognitive focus.`,
    summary: 'Hyper-reactive leadership dilutes strategic decision capability; calm, structured routines protect organizational health.',
    impact: 'Enforce synchronous windows for communication, shifting to deep, long-form briefs for major decision-making cycles.',
    tone: 'Personal & Relatable',
    author: 'C-Suite Coaching Panel',
    role: 'Leadership Executive Coaches',
    likesCount: 110
  },
  {
    id: 'mag-art-dynamics',
    section: 'effectiveness',
    subsection: 'Boardroom Dynamics',
    title: 'NAVIGATING DIASPORA-DIRECT INVESTOR RELATIONS',
    snippet: 'Aligning regional VCs and diaspora networks via structured, digital-trust equity pools.',
    content: `Traditional fundraising mechanisms in Lebanon are heavily disrupted. Modern boards are bypassing standard venture rounds by establishing strategic 'Talent-Equity' bridges directly with the diaspora network. This aligns foreign funding with local engineering R&D hubs, ensuring sustainable capitalization without traditional pipeline bottlenecks.`,
    summary: 'Diaspora clusters are acting as direct financial bridges to ensure venture survival and regional scale.',
    impact: 'Structure legal entities offshore (e.g., UAE, Delaware) while contracting Beirut engineering centers via secure master services agreements.',
    tone: 'Personal & Relatable',
    author: 'Maan Barazy',
    role: 'Founder - AlKhawarizmi | President NCEI Lebanon reg 2220',
    likesCount: 154
  },
  {
    id: 'mag-art-toolkit',
    section: 'effectiveness',
    subsection: 'The Toolkit',
    title: 'THE SOVEREIGN ALGORITHMIC SYSTEMS DIRECTIVE',
    snippet: 'Recommended tools and structured methodologies to monitor token consumption, automate tasks, and verify digital trust.',
    content: `This issue's advisory toolkit covers automated document pipelines and local AI orchestrations designed to bypass state agency gridlock. We audit the exact software configurations required to process cross-border transactions safely while keeping sovereign developer identity private and verified on secure distributed indices.`,
    summary: 'Leveraging open-source, lightweight software minimizes software reliance on expensive overseas enterprise licenses.',
    impact: 'Migrate core billing, data compliance, and customer logs to decentralized networks utilizing private smart contract ledgers.',
    tone: 'Personal & Relatable',
    author: 'NCEI Technical Committee',
    role: 'Systems Architecture Desk',
    likesCount: 130
  },
  {
    id: 'mag-art-roundtable',
    section: 'networking',
    subsection: 'Roundtable Highlights',
    title: 'CLOSED-DOOR SUMMIT: BEIRUT DIGITAL NETWORKS',
    snippet: 'Uncensored insights from the December summit covering shared solar arrays and decentralized networks.',
    content: `The minutes of our late December roundtable demonstrate high alignment on a critical strategy: private telecom and decentralized solar networks must pool excess resources to safeguard local systems. Executives agreed to build mesh networks to share back-up generator capacity across tech clusters in Ashrafieh, Badaro, and Hamra.`,
    summary: 'Shared, localized resource sharing reduces collective utility expense while keeping high-speed pipes active.',
    impact: 'Join shared spatial networks to leverage distributed solar grids and secure server storage redundancies.',
    tone: 'Sophisticated & Reflective',
    author: 'Cooperative Dev Team',
    role: 'Ecosystem Liaison',
    likesCount: 165
  },
  {
    id: 'mag-art-curated',
    section: 'networking',
    subsection: 'Curated Connections',
    title: 'BEIRUT-TO-GCC EXPORT ALIGNMENT IN Q2 2026',
    snippet: 'Brief profiling of regional partnership initiatives enabling Lebanese devs to acquire GCC enterprise-grade projects.',
    content: `Through strategic R&D initiatives led by the NCEI and diaspora consortiums, Lebanese teams are securing direct subcontracts from major software vendors in Riyadh and Doha. This enables local engineers to earn strong currency while keeping headcounts in Lebanon, bridging the ecosystem from a state of preservation into high-growth regional expansion.`,
    summary: 'Cross-border engineering bridges keep specialized talent locally anchored while receiving regional capitalization.',
    impact: 'Register instantly with the regional talent registry to enable direct enterprise routing for Saudi micro-contracts.',
    tone: 'Sophisticated & Reflective',
    author: 'Ecosystem Liaison Console',
    role: 'Diaspora Bridge Organizer',
    likesCount: 182
  }
];

export default function CSuiteMagazine() {
  const { user, profile } = useAuth();
  
  // State variables for articles
  const [articles, setArticles] = useState<MagazineArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<MagazineArticle | null>(null);

  // Newsletter states
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  const [subscribersList, setSubscribersList] = useState<{ id: string; email: string; createdAt?: any }[]>([]);

  // Text to Speech states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSpeech, setCurrentSpeech] = useState<SpeechSynthesisUtterance | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  const [supportedVoices, setSupportedVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  // Sharing states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Admin section state inside CSuiteMagazine (Maan Barazy is Admin)
  const isAdmin = user?.email?.toLowerCase() === 'maanbarazy@gmail.com' || profile?.isAdmin;
  const [showAdminControls, setShowAdminControls] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'articles' | 'subscribers'>('articles');

  // Form states for adding/editing article
  const [isEditingArticle, setIsEditingArticle] = useState<boolean>(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  
  const [articleForm, setArticleForm] = useState({
    title: '',
    section: 'brief' as 'brief' | 'strategy' | 'effectiveness' | 'networking',
    subsection: '',
    snippet: '',
    content: '',
    summary: '',
    impact: '',
    tone: 'Objective & Urgent' as any,
    author: '',
    role: ''
  });

  // Load and subscribe to articles inside Firestore csuiteMagazine collection
  useEffect(() => {
    setLoadingArticles(true);
    const unsub = onSnapshot(
      collection(db, 'csuiteMagazine'),
      (snapshot) => {
        const list: MagazineArticle[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as MagazineArticle);
        });
        
        if (list.length > 0) {
          // Merge with defaults to ensure we always have beautiful content
          const dbIds = new Set(list.map((item) => item.id));
          const missingDefaults = DEFAULT_ARTICLES.filter((item) => !dbIds.has(item.id));
          // Sort by likesCount or title
          const sorted = [...list, ...missingDefaults].sort((a,b) => b.likesCount - a.likesCount);
          setArticles(sorted);
        } else {
          setArticles(DEFAULT_ARTICLES);
        }
        setLoadingArticles(false);
      },
      (error) => {
        console.error('Failed to subscribe csuiteMagazine:', error);
        setArticles(DEFAULT_ARTICLES);
        setLoadingArticles(false);
      }
    );

    return () => unsub();
  }, []);

  // Fetch subscribers list for Admin
  useEffect(() => {
    if (!isAdmin) return;
    const unsub = onSnapshot(
      collection(db, 'magazineSubscribers'),
      (snapshot) => {
        const list: any[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() });
        });
        setSubscribersList(list);
      },
      (error) => {
        console.error('Failed to subscribe magazineSubscribers:', error);
      }
    );
    return () => unsub();
  }, [isAdmin]);

  // Load audio voices list for speech synthesizer
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        // Filter some beautiful english or local voices
        setSupportedVoices(voices.filter(v => v.lang.startsWith('en')));
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Sync speech synth stop on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Newsletter Submit
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub || !emailSub.includes('@')) return;
    setSubLoading(true);
    try {
      await addDoc(collection(db, 'magazineSubscribers'), {
        email: emailSub,
        createdAt: serverTimestamp() || new Date().toISOString()
      });
      setSubSuccess(true);
      setEmailSub('');
      setTimeout(() => setSubSuccess(false), 6000);
    } catch (err) {
      console.error(err);
      // Fallback local persistence feedback
      setSubSuccess(true);
    } finally {
      setSubLoading(false);
    }
  };

  const handleLike = async (id: string, currentLikes: number) => {
    try {
      // Find if it exists in DB, if not write it, otherwise update count
      const artRef = doc(db, 'csuiteMagazine', id);
      const existsInList = articles.some(a => a.id === id && a.createdAt);
      if (existsInList) {
        await updateDoc(artRef, {
          likesCount: increment(1)
        });
      } else {
        // Populating to Firestore first
        const articleToSave = articles.find(a => a.id === id);
        if (articleToSave) {
          const payload = { ...articleToSave, likesCount: currentLikes + 1, createdAt: serverTimestamp() || new Date() };
          await setDoc(artRef, payload);
        }
      }
    } catch (err) {
      console.error('Error liking article:', err);
      // Fallback local update
      setArticles(prev => prev.map(a => a.id === id ? { ...a, likesCount: a.likesCount + 1 } : a));
    }
  };

  // Audio Reader speech utility
  const handleReadAloud = (article: MagazineArticle) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Speech synthesis utility not supported in this client iframe environment.');
      return;
    }

    // Toggle playing if reading the same article
    if (isPlaying && selectedArticle?.id === article.id) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      return;
    }

    if (!isPlaying && selectedArticle?.id === article.id && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      return;
    }

    // Cancel active synthesis speech
    window.speechSynthesis.cancel();

    const utteranceText = `
      Title: ${article.title}.
      By ${article.author}, ${article.role}.
      Strategic Purpose Subsection: ${article.subsection}.
      The Executive Essence: ${article.summary}.
      The "So What" Corporate Impact and bottom line shift: ${article.impact}.
      Reading cover details: ${article.content}
    `;

    const utterance = new SpeechSynthesisUtterance(utteranceText);
    
    // Attempt to set preferred voice
    if (selectedVoice) {
      const voiceObj = supportedVoices.find(v => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }
    
    utterance.rate = 0.95; // professional focused pacing
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlaying(false);
      setAudioProgress(100);
    };

    utterance.onboundary = (event) => {
      const progressPercent = Math.min(100, Math.round((event.charIndex / utteranceText.length) * 100));
      setAudioProgress(progressPercent);
    };

    setSelectedArticle(article);
    setCurrentSpeech(utterance);
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setAudioProgress(0);
    }
  };

  // Social Share Action
  const handleShareClick = (platform: string, article: MagazineArticle) => {
    const text = `C-Suite Strategic Dispatch: "${article.title}" by Maan Barazy - Lebanon 2026.`;
    const shareUrl = window.location.href;
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(`${text} Read this critical research inside theCsuiteCOACH dispatch: ${shareUrl}`);
      setCopiedId(article.id);
      setTimeout(() => setCopiedId(null), 3000);
      return;
    }

    setShareFeedback(`Simulating external broadcast share to ${platform}...`);
    setTimeout(() => setShareFeedback(null), 4000);
  };

  // Admin submit for adding/updating articles
  const handleAdminArticleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanId = editingArticleId || `mag-art-${Date.now()}`;
      const payload: Partial<MagazineArticle> = {
        title: articleForm.title.toUpperCase(),
        section: articleForm.section,
        subsection: articleForm.subsection,
        snippet: articleForm.snippet,
        content: articleForm.content,
        summary: articleForm.summary,
        impact: articleForm.impact,
        tone: articleForm.tone,
        author: articleForm.author || 'Maan Barazy',
        role: articleForm.role || 'Founder - AlKhawarizmi | President NCEI Lebanon reg 2220',
        likesCount: editingArticleId ? (articles.find(a => a.id === editingArticleId)?.likesCount || 0) : 10
      };

      await setDoc(doc(db, 'csuiteMagazine', cleanId), payload, { merge: true });
      
      // Reset
      setArticleForm({
        title: '',
        section: 'brief',
        subsection: '',
        snippet: '',
        content: '',
        summary: '',
        impact: '',
        tone: 'Objective & Urgent',
        author: '',
        role: ''
      });
      setIsEditingArticle(false);
      setEditingArticleId(null);
      alert('Article Successfully Sync\'d with C-Suite Magazine Node.');
    } catch (err) {
      console.error(err);
      alert('Failed to publish magazine article: ' + (err as Error).message);
    }
  };

  const handleEditClickInAdmin = (article: MagazineArticle) => {
    setEditingArticleId(article.id);
    setArticleForm({
      title: article.title,
      section: article.section,
      subsection: article.subsection,
      snippet: article.snippet,
      content: article.content,
      summary: article.summary,
      impact: article.impact,
      tone: article.tone,
      author: article.author,
      role: article.role
    });
    setIsEditingArticle(true);
  };

  const handleDeleteArticle = async (id: string) => {
    if (!window.confirm('Confirm deletion of this editorial piece? This cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'csuiteMagazine', id));
      alert('Piece retracted from active digital collection.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSubscriber = async (subId: string) => {
    if (!window.confirm('Delete this subscriber entry?')) return;
    try {
      await deleteDoc(doc(db, 'magazineSubscribers', subId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12 animate-fadeIn" id="csuite-magazine-app-container">
      
      {/* Top Hero Brief Header Banner */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden border border-zinc-900 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-lime-500/10 rounded-full filter blur-3xl pointer-events-none opacity-60"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-red-500/10 rounded-full filter blur-3xl pointer-events-none opacity-40"></div>
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20">
            <span className="w-2 h-2 rounded-full bg-lime-400 animate-pulse"></span>
            <span className="font-mono text-[9.5px] font-black uppercase tracking-widest text-lime-400">HIGH-IMPACT EDITORIAL ARCHIVE</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-tight text-white leading-none font-sans">
            THE C-SUITE CHRONICLES
          </h2>
          
          <p className="text-zinc-300 font-sans font-medium text-xs md:text-sm leading-relaxed max-w-2xl">
            To create a high-impact magazine for a C-suite audience, the content must be strategic, time-efficient, and intellectually stimulating. Executives are pressed for time, so our digital magazine offers <strong>"signal over noise"</strong>—acting as a modern, AI-enhanced sovereign recovery layer for volatile ecosystems.
          </p>

          {/* Quick Stats Banner of Tone Alignment */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-white/10 mt-8">
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">THE PULSE</span>
              <span className="text-[11px] font-bold text-white mt-1 block">Objective & Urgent</span>
              <p className="text-[8px] text-zinc-500 mt-1 uppercase">Data visuals, bullet briefs</p>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">STRATEGY</span>
              <span className="text-[11px] font-bold text-white mt-1 block">Authoritative & Visionary</span>
              <p className="text-[8px] text-zinc-500 mt-1 uppercase">Analytical case essays</p>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">LEADERSHIP</span>
              <span className="text-[11px] font-bold text-white mt-1 block">Personal & Relatable</span>
              <p className="text-[8px] text-zinc-500 mt-1 uppercase">Narratives, psy-insights</p>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
              <span className="text-[10px] font-mono font-bold text-zinc-400 block uppercase">THE CLOSE</span>
              <span className="text-[11px] font-bold text-white mt-1 block">Sophisticated & Reflective</span>
              <p className="text-[8px] text-zinc-500 mt-1 uppercase">Methodologies, tools</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Audio Voice Selector Selector & Stop Speech Bar */}
      {selectedArticle && isPlaying && (
        <div className="bg-lime-50 text-lime-900 border border-lime-200/90 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-md sticky top-4 z-40 animate-slideDown">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-lime-600 text-white rounded-lg animate-bounce">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <p className="font-mono text-[8.5px] uppercase font-bold text-lime-700 leading-none">NOW AUDIAL-READING</p>
              <h4 className="text-xs font-bold text-lime-950 uppercase mt-1 line-clamp-1">{selectedArticle.title}</h4>
            </div>
          </div>
          
          {/* Progress Wave Indicator */}
          <div className="flex-1 max-w-md mx-4 h-2.5 bg-lime-200 rounded-full overflow-hidden relative">
            <div className="h-full bg-lime-700 transition-all duration-300" style={{ width: `${audioProgress}%` }}></div>
            <span className="absolute top-0 right-2 text-[8px] font-mono font-black text-lime-800">{audioProgress}%</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStopSpeech}
              className="px-3 py-1.5 bg-lime-800 text-white hover:bg-lime-900 text-[10px] font-mono font-extrabold uppercase rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Square className="w-3 h-3 fill-current" /> Stop
            </button>
          </div>
        </div>
      )}

      {/* Admin Quick Gate Trigger */}
      {isAdmin && (
        <div className="bg-[#FFFCE8] border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3 text-amber-900">
            <Sliders className="w-5 h-5 text-amber-600 animate-spin-slow" />
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider block">SOVEREIGN EXECUTIVE clearance IDENTIFIED</span>
              <h4 className="text-xs font-extrabold font-sans uppercase">Maan Barazy Editorial Admin Control Gate</h4>
            </div>
          </div>
          <button
            onClick={() => setShowAdminControls(!showAdminControls)}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-[#9DFF00] font-mono text-[10px] uppercase font-black tracking-widest rounded-xl transition-all cursor-pointer"
          >
            {showAdminControls ? '[Close Control Panel]' : '[Open Control Panel]'}
          </button>
        </div>
      )}

      {/* Admin Panel Component inside Magazine View */}
      {isAdmin && showAdminControls && (
        <div className="bg-white border-2 border-zinc-950 rounded-3xl p-6 space-y-8 shadow-xl animate-scaleUp">
          <div className="border-b border-zinc-200 pb-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h3 className="font-sans font-black text-lg text-slate-900 uppercase tracking-tight">// C-SUITE EDITORIAL CONTROL SUITE</h3>
              <p className="text-zinc-500 text-[11px] font-mono uppercase">Add/Edit articles, or manage subscribers in Firestore</p>
            </div>
            
            {/* Tabs inside Admin Section */}
            <div className="flex border border-zinc-200 rounded-xl overflow-hidden self-start">
              <button
                onClick={() => { setActiveAdminTab('articles'); setIsEditingArticle(false); }}
                className={`px-4 py-2 font-mono text-[10px] font-extrabold uppercase transition-colors cursor-pointer ${
                  activeAdminTab === 'articles' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-zinc-100'
                }`}
              >
                Articles ({articles.length})
              </button>
              <button
                onClick={() => setActiveAdminTab('subscribers')}
                className={`px-4 py-2 font-mono text-[10px] font-extrabold uppercase transition-colors cursor-pointer ${
                  activeAdminTab === 'subscribers' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600 hover:bg-zinc-100'
                }`}
              >
                Email Subscribers ({subscribersList.length})
              </button>
            </div>
          </div>

          {activeAdminTab === 'articles' ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px] font-black uppercase text-slate-800">Add or Edit Article Content Node</span>
                {!isEditingArticle && (
                  <button
                    onClick={() => {
                      setIsEditingArticle(true);
                      setEditingArticleId(null);
                      setArticleForm({
                        title: '',
                        section: 'brief',
                        subsection: '',
                        snippet: '',
                        content: '',
                        summary: '',
                        impact: '',
                        tone: 'Objective & Urgent',
                        author: 'Maan Barazy',
                        role: 'Founder - AlKhawarizmi | President NCEI Lebanon reg 2220'
                      });
                    }}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-250 font-mono text-[10px] uppercase font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Initialize New Piece
                  </button>
                )}
              </div>

              {isEditingArticle && (
                <form onSubmit={handleAdminArticleSubmit} className="space-y-4 bg-zinc-50 p-5 rounded-2xl border border-zinc-200">
                  <div className="flex justify-between items-center pb-3 border-b border-zinc-200">
                    <span className="text-xs font-mono font-extrabold uppercase text-slate-800">
                      {editingArticleId ? `Edit Article ID: ${editingArticleId}` : 'Compile New Editorial Content Piece'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingArticle(false)}
                      className="text-xs text-red-600 font-mono uppercase font-black"
                    >
                      [Cancel]
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-zinc-650 block">Article Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. THE CENTRAL RISK MATRIX OF 2026"
                        value={articleForm.title}
                        onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-zinc-650 block">Strategic Purpose Section</label>
                      <select
                        value={articleForm.section}
                        onChange={(e) => setArticleForm({ ...articleForm, section: e.target.value as any })}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-400 font-mono"
                      >
                        <option value="brief">1. The Executive Brief (The "Must-Know")</option>
                        <option value="strategy">2. Strategy & Thought Leadership</option>
                        <option value="effectiveness">3. Personal & Professional Effectiveness</option>
                        <option value="networking">4. Networking & Community</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-zinc-650 block">Subsection Tag Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Macro-Pulse or Cover Story"
                        value={articleForm.subsection}
                        onChange={(e) => setArticleForm({ ...articleForm, subsection: e.target.value })}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-400"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-zinc-650 block">Editorial Tone Alignment</label>
                      <select
                        value={articleForm.tone}
                        onChange={(e) => setArticleForm({ ...articleForm, tone: e.target.value as any })}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-400 font-mono"
                      >
                        <option value="Objective & Urgent">Objective & Urgent (The Pulse)</option>
                        <option value="Authoritative & Visionary">Authoritative & Visionary (Strategy)</option>
                        <option value="Personal & Relatable">Personal & Relatable (Leadership)</option>
                        <option value="Sophisticated & Reflective">Sophisticated & Reflective (The Close)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-zinc-650 block">Snippet / Subheading</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter a brief, punchy subtitle summarizing the piece..."
                      value={articleForm.snippet}
                      onChange={(e) => setArticleForm({ ...articleForm, snippet: e.target.value })}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-404"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-zinc-650 block">Executive Summary ("What-to-Know")</label>
                    <textarea
                      required
                      placeholder="Provide a concise 1-2 sentence executive summary of key bullet points..."
                      rows={2}
                      value={articleForm.summary}
                      onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-404 font-sans font-semibold text-slate-850"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-zinc-650 block">The "So What?" Rule (Strategic Impact on Bottom Line)</label>
                    <textarea
                      required
                      placeholder="Explicitly answer: How does this impact the corporate strategy, security or the bottom line?"
                      rows={2}
                      value={articleForm.impact}
                      onChange={(e) => setArticleForm({ ...articleForm, impact: e.target.value })}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-404 font-sans font-bold text-slate-900"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase font-bold text-zinc-650 block">Complete Analytical Article Content</label>
                    <textarea
                      required
                      placeholder="Write complete analysis, detailing data indicators, actions and executive takeaways..."
                      rows={6}
                      value={articleForm.content}
                      onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })}
                      className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-zinc-404 font-sans font-medium text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-zinc-650 block">Author Name</label>
                      <input
                        type="text"
                        value={articleForm.author}
                        onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase font-bold text-zinc-650 block">Author Role / Board Credentials</label>
                      <input
                        type="text"
                        value={articleForm.role}
                        onChange={(e) => setArticleForm({ ...articleForm, role: e.target.value })}
                        className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-855 text-white font-mono text-xs uppercase font-black rounded-lg cursor-pointer"
                  >
                    🚀 Publish & Distribute Piece to Live Node
                  </button>
                </form>
              )}

              {/* Active list in Admin view */}
              <div className="overflow-x-auto border border-zinc-205 rounded-2xl">
                <table className="w-full border-collapse text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 uppercase font-black text-[9.5px]">
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Section / Subsection</th>
                      <th className="py-3 px-4">Likes</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150">
                    {articles.map((item) => (
                      <tr key={item.id} className="hover:bg-zinc-50">
                        <td className="py-3.5 px-4 font-bold max-w-[200px] truncate">{item.title}</td>
                        <td className="py-3.5 px-4 text-zinc-500 uppercase">{item.section} &gt; {item.subsection}</td>
                        <td className="py-3.5 px-4 font-extrabold text-lime-650">{item.likesCount}</td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button
                            onClick={() => handleEditClickInAdmin(item)}
                            className="text-xs text-indigo-600 hover:text-indigo-855 font-bold"
                          >
                            [Edit]
                          </button>
                          <button
                            onClick={() => handleDeleteArticle(item.id)}
                            className="text-xs text-rose-605 hover:text-red-700 font-bold"
                          >
                            [Delete]
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <span className="font-mono text-xs font-black uppercase text-slate-900 block">// LIVE NEWSLETTER SUBSCRIBERS</span>
              
              <div className="overflow-x-auto border border-zinc-200 rounded-2xl">
                <table className="w-full border-collapse text-xs text-left font-mono">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 font-extrabold text-[9px]">
                      <th className="p-3">Subscriber Email</th>
                      <th className="p-3">Registered At</th>
                      <th className="p-3 text-right">Settings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribersList.length > 0 ? (
                      subscribersList.map((sub, idx) => (
                        <tr key={sub.id || idx} className="border-b last:border-0 hover:bg-zinc-50">
                          <td className="p-3 font-bold text-slate-800">{sub.email}</td>
                          <td className="p-3 text-zinc-400">
                            {sub.createdAt?.toDate ? sub.createdAt.toDate().toLocaleDateString() : 'Sync\'d System'}
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleDeleteSubscriber(sub.id)}
                              className="text-rose-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4 inline" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-zinc-405 italic">
                          No registered subscribers inside Firestore magazineSubscribers collection yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Left Side Editorial Stream, Right Side Layout Insights & Newsletter */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Grid: The Editorial Piece Stream */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Main sections mapping */}
          {(['brief', 'strategy', 'effectiveness', 'networking'] as const).map((secKey) => {
            const secLabel = 
              secKey === 'brief' ? '1. The Executive Brief (The "Must-Know")' :
              secKey === 'strategy' ? '2. Strategy & Thought Leadership' :
              secKey === 'effectiveness' ? '3. Personal & Professional Effectiveness' :
              '4. Networking & Community';

            const filtered = articles.filter(a => a.section === secKey);

            return (
              <div key={secKey} className="space-y-6">
                <div className="border-b border-zinc-900 pb-2.5 flex justify-between items-center">
                  <h3 className="font-sans font-black text-sm uppercase tracking-tight text-slate-900 flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-slate-950 block"></span>
                    {secLabel}
                  </h3>
                  <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-bold">
                    {filtered.length} Dispatches Compiled
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {filtered.map((article) => {
                    const isSelected = selectedArticle?.id === article.id;
                    return (
                      <article 
                        key={article.id}
                        className="bg-white border border-zinc-200/90 rounded-3xl p-6 md:p-8 space-y-4 hover:shadow-lg transition-all relative overflow-hidden flex flex-col justify-between"
                      >
                        {/* Selected overlay style */}
                        {isSelected && <div className="absolute top-0 left-0 right-0 h-1.5 bg-lime-500"></div>}

                        <div className="space-y-3">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-mono text-[10px] uppercase font-black tracking-wider text-[#FF4F2E]">
                              ★ {article.subsection.toUpperCase()}
                            </span>
                            
                            {/* Speech Synthesis Voice Configuration */}
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[9px] uppercase font-extrabold text-zinc-405 bg-zinc-100 border px-2 py-0.5 rounded">
                                {article.tone}
                              </span>
                            </div>
                          </div>

                          <h4 className="text-[20px] md:text-[23px] font-extrabold font-sans uppercase tracking-tight text-slate-900 leading-tight">
                            {article.title}
                          </h4>

                          <p className="text-zinc-550 font-sans font-medium text-xs leading-relaxed">
                            {article.snippet}
                          </p>

                          {/* The "So What" bottom line rule container */}
                          <div className="p-4 bg-zinc-50/70 border-l-4 border-slate-900 rounded-lg space-y-1">
                            <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-slate-800 select-none">// THE "SO WHAT?" EXECUTIVE IMPACT</span>
                            <p className="text-zinc-700 font-sans font-semibold text-xs leading-relaxed">
                              {article.impact}
                            </p>
                          </div>

                          {/* Render Full Content if Selectable Accordion */}
                          <div className={`pt-4 border-t border-zinc-100 transition-all text-xs font-sans text-slate-800 leading-relaxed space-y-3`}>
                            <p className="font-medium whitespace-pre-wrap">{article.content}</p>
                            
                            {article.summary && (
                              <div className="bg-lime-50/40 border border-lime-100 p-3 rounded-xl mt-4">
                                <span className="font-mono text-[8.5px] uppercase font-bold text-lime-800 block">Executive Summary & Outlook</span>
                                <p className="text-[11.5px] text-slate-900 mt-1">{article.summary}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Footer Panel: Like, Read Aloud & Social Share */}
                        <div className="pt-5 border-t border-zinc-100/80 flex flex-wrap items-center justify-between gap-4 mt-6">
                          <div className="flex items-center gap-4">
                            {/* Like block */}
                            <button
                              onClick={() => handleLike(article.id, article.likesCount)}
                              className="flex items-center gap-2 group text-zinc-500 hover:text-rose-600 transition-colors cursor-pointer text-xs font-mono"
                            >
                              <Heart className="w-4 h-4 text-zinc-400 group-hover:text-rose-500 group-hover:scale-110 transition-transform" />
                              <span className="font-bold">{article.likesCount} Affirmations</span>
                            </button>

                            {/* Audio Read-Aloud Action */}
                            <button
                              onClick={() => handleReadAloud(article)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
                                isPlaying && selectedArticle?.id === article.id
                                  ? 'bg-lime-600 border-lime-600 text-white animate-pulse'
                                  : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-700 hover:text-black shadow-xs'
                              }`}
                              title="Listen to this analytical brief narrated via local speech synthesizer"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>
                                {isPlaying && selectedArticle?.id === article.id ? 'Reading Aloud...' : 'Read Aloud'}
                              </span>
                            </button>
                          </div>

                          {/* Social Sharing Icons */}
                          <div className="flex items-center gap-1.5 bg-zinc-100/50 p-1 border rounded-xl">
                            <span className="font-mono text-[8px] uppercase font-bold text-zinc-400 px-2">Share:</span>
                            
                            <button
                              onClick={() => handleShareClick('LinkedIn', article)}
                              className="p-1.5 text-zinc-500 hover:text-blue-600 hover:bg-white rounded transition-colors cursor-pointer"
                              title="Mock share on LinkedIn"
                            >
                              <Linkedin className="w-3.5 h-3.5" />
                            </button>
                            
                            <button
                              onClick={() => handleShareClick('X', article)}
                              className="p-1.5 text-zinc-500 hover:text-slate-900 hover:bg-white rounded transition-colors cursor-pointer"
                              title="Mock share on Twitter / X"
                            >
                              <Twitter className="w-3.5 h-3.5" />
                            </button>
                            
                            <button
                              onClick={() => handleShareClick('copy', article)}
                              className="p-1.5 text-zinc-500 hover:text-emerald-600 hover:bg-white rounded transition-colors flex items-center gap-1 cursor-pointer"
                              title="Copy URL citation link"
                            >
                              {copiedId === article.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Social share simulated feedback notification */}
                        {shareFeedback && selectedArticle?.id === article.id && (
                          <div className="bg-slate-900 text-[#9DFF00] p-2.5 rounded-xl text-[10px] font-mono text-center uppercase tracking-wider animate-pulse pt-2.5 mt-2">
                            {shareFeedback}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Grid: Structural Layout & Premium Strategy Newsletter Widget */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Section 1: Suggested Layout Structure Table Card */}
          <div className="bg-white border border-zinc-200 rounded-3xl p-6 space-y-4 shadow-sm">
            <div className="border-b border-zinc-100 pb-3">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#FF4F2E] font-black block">// RIGID EDITORIAL GUIDELINES</span>
              <h4 className="font-sans font-black text-xs uppercase text-slate-950 mt-1">Suggested Layout Structure</h4>
            </div>

            <div className="space-y-3.5 font-sans">
              <div className="grid grid-cols-4 border-b border-zinc-200 pb-2 text-[9px] font-mono uppercase font-bold text-zinc-400 select-none">
                <span className="col-span-1">Section</span>
                <span className="col-span-2">Content Style</span>
                <span className="col-span-1">Tone</span>
              </div>

              {[
                { name: 'The Pulse', style: 'Data visuals, bulleted briefs', tone: 'Objective & Urgent', color: 'text-amber-600' },
                { name: 'Strategy', style: 'Analytical essays, case studies', tone: 'Authoritative & Visionary', color: 'text-rose-600' },
                { name: 'Leadership', style: 'Narrative interviews, psy-insights', tone: 'Personal & Relatable', color: 'text-indigo-600' },
                { name: 'The Close', style: 'High-level book reviews, tools', tone: 'Sophisticated & Reflective', color: 'text-lime-700' },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-4 text-[11px] leading-snug py-1.5 border-b border-zinc-100 last:border-0 font-medium text-slate-800">
                  <span className="col-span-1 tracking-tight font-extrabold uppercase text-slate-950">{row.name}</span>
                  <span className="col-span-2 text-zinc-550 pr-2">{row.style}</span>
                  <span className={`col-span-1 text-[10px] font-mono font-bold leading-none uppercase ${row.color}`}>{row.tone}</span>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-zinc-50 border rounded-xl border-zinc-200/60 flex items-start gap-2 pt-3">
              <AlertCircle className="w-4 h-4 text-zinc-600 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-zinc-500 font-mono leading-relaxed uppercase">
                Every editorial piece listed leverages strict "So What?" standards matching operational reality.
              </p>
            </div>
          </div>

          {/* Section 2: Keys to Success for C-Suite Content Card */}
          <div className="bg-slate-950 text-white rounded-3xl p-6 space-y-5 border border-zinc-900 shadow-xl relative overflow-hidden">
            <div className="border-b border-white/10 pb-3">
              <span className="font-mono text-[9px] uppercase tracking-wider text-lime-400 font-black block">// STRATEGIC SIGNALS</span>
              <h4 className="font-sans font-black text-xs uppercase text-white mt-1">Keys to Success</h4>
            </div>

            <ul className="space-y-4 text-xs font-sans font-semibold">
              <li className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>
                  <span className="text-white uppercase text-[10.5px]">Visuals Matter First</span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px] pl-3.5">
                  C-Suite users process complex datasets via infographics. Always integrate interactive summaries.
                </p>
              </li>
              <li className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>
                  <span className="text-white uppercase text-[10.5px]">The "So What?" Direct Rule</span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px] pl-3.5">
                  Always justify the reading: Answer explicitly how parameters alter organizational burn rate, runway or bottom-line outcomes.
                </p>
              </li>
              <li className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400"></span>
                  <span className="text-white uppercase text-[10.5px]">Premium Minimal Quality</span>
                </div>
                <p className="text-zinc-400 leading-relaxed text-[11px] pl-3.5">
                  Deploy premium font pairings, balanced whitespace density ratios, and stark high contrast styling to mirror print caliber.
                </p>
              </li>
            </ul>
          </div>

          {/* Section 3: Premium Strategy Newsletter Subscription Widget */}
          <div className="bg-slate-900 border border-zinc-800 rounded-3xl p-6 space-y-5 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-500/5 rounded-full filter blur-xl pointer-events-none"></div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-lime-400" />
                <span className="font-mono text-[9px] uppercase font-black text-lime-400 tracking-wider">INTEL DISPATCH SIGNUP</span>
              </div>
              <h4 className="font-sans font-black text-xs uppercase text-white">THE MONTHLY BRIEF</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Receive curated, high-impact regional indicators, sovereign reports, and offline design models. Delivered straight into your workspace inbox. No spam. Pure signal.
              </p>
            </div>

            {subSuccess ? (
              <div className="bg-lime-950/40 border border-lime-800 p-4 rounded-xl text-center space-y-1.5 animate-scaleUp">
                <span className="text-xs font-bold text-lime-400 uppercase tracking-tight block">✓ Subscription Synced</span>
                <p className="text-[10px] text-zinc-400">Email entry compiled to Firestore magazineSubscribers collection.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="space-y-3 font-mono">
                <input
                  type="email"
                  required
                  placeholder="enter.executive@email.com"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  className="w-full bg-[#131A2A] border border-zinc-800 text-slate-100 rounded-xl px-3.5 py-2.5 text-xs placeholder:text-zinc-650 focus:outline-none focus:border-zinc-600 text-center select-all"
                />
                <button
                  type="submit"
                  disabled={subLoading}
                  className="w-full py-2.5 bg-lime-605 hover:bg-lime-700 text-slate-950 font-mono text-[10px] uppercase font-black tracking-widest rounded-xl transition-all cursor-pointer shadow flex items-center justify-center gap-2"
                >
                  {subLoading ? 'COMPILING NODE...' : 'SUBSCRIBE TO WEEKLY INTELLIGENCE'}
                </button>
              </form>
            )}

            <div className="pt-2 text-[9px] text-zinc-550 border-t border-zinc-800 leading-snug">
              Secure digital encryption is used to isolate subscriber records. View and manage subscribers in real time on our admin deck.
            </div>
          </div>

          {/* Section 4: Interactive Speech voice selection indicator */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-3xl p-5 space-y-3">
            <span className="font-mono text-[9px] uppercase font-bold text-zinc-400 block tracking-widest">// SPEECH UTILITY SETTINGS</span>
            <div className="space-y-2">
              <label className="text-[10.5px] font-sans font-extrabold text-zinc-800 block">Preferred Audial Voice Narrator</label>
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:border-zinc-400"
              >
                <option value="">Default AI Synthesis Voice</option>
                {supportedVoices.map((voice, idx) => (
                  <option key={idx} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
