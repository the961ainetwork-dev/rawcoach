import React, { useState, useEffect } from 'react';
import { LATEST_NEWS } from '../data/mockData';
import CorporateAssessmentHub from './CorporateAssessmentHub';
import PhoneSimulator from './PhoneSimulator';
import AgenticTransformationService from './AgenticTransformationService';
import AboutUs from './AboutUs';
import GetStarted from './GetStarted';
import ReadinessScorecard from './ReadinessScorecard';
import { useAuth } from '../contexts/AuthContext';
import { 
  Sparkles, 
  Terminal, 
  Flame, 
  Zap, 
  ArrowUpRight, 
  UserCheck, 
  Shield,
  HelpCircle,
  ArrowRight,
  ChevronLeft,
  Play,
  Check,
  RefreshCw,
  Download,
  BookOpen,
  Heart,
  Plus,
  Lock,
  LogOut,
  Compass,
  X
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { db } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Custom lightweight Markdown-to-HTML parser for theCsuiteCOACH transition reports
function MarkdownDisplay({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-4 text-left font-sans text-sm text-zinc-900 leading-relaxed font-semibold">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Handle Headings (###)
        if (trimmed.startsWith('####')) {
          const content = trimmed.substring(4).replace(/\*/g, '').trim();
          return (
            <h5 key={idx} className="font-mono text-xs uppercase font-extrabold text-[#FF4F2E] tracking-widest mt-6 first:mt-2 border-b border-zinc-200 pb-1">
              {content}
            </h5>
          );
        }
        if (trimmed.startsWith('###')) {
          const content = trimmed.substring(3).replace(/\*/g, '').trim();
          return (
            <h4 key={idx} className="font-mono text-sm uppercase font-black text-black tracking-tight mt-8 border-l-4 border-black pl-3.5 py-1 bg-zinc-50 border border-zinc-200">
              {content}
            </h4>
          );
        }

        // Handle Checklist items ([ ] or [x])
        if (trimmed.includes('[ ]') && (trimmed.startsWith('*') || trimmed.startsWith('-'))) {
          const idxBrace = trimmed.indexOf('[ ]');
          const content = trimmed.substring(idxBrace + 3).replace(/\*/g, '').trim();
          return (
            <div key={idx} className="flex items-center gap-3 ml-4 bg-zinc-50 border border-zinc-200 p-2.5 my-1.5 shadow-sm">
              <span className="w-4 h-4 border border-zinc-300 bg-white flex-shrink-0" />
              <p className="text-xs font-mono font-bold text-zinc-800">{content}</p>
            </div>
          );
        }
        if (trimmed.includes('[x]') && (trimmed.startsWith('*') || trimmed.startsWith('-'))) {
          const idxBrace = trimmed.indexOf('[x]');
          const content = trimmed.substring(idxBrace + 3).replace(/\*/g, '').trim();
          return (
            <div key={idx} className="flex items-center gap-3 ml-4 bg-zinc-50/60 border border-zinc-200 p-2.5 my-1.5 line-through opacity-85">
              <span className="w-4 h-4 border border-zinc-300 bg-zinc-100 flex items-center justify-center flex-shrink-0 text-[10px] text-zinc-500 font-bold">✓</span>
              <p className="text-xs font-mono font-bold text-zinc-400">{content}</p>
            </div>
          );
        }

        // Handle Bullet Lists (* text or - text)
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const content = trimmed.substring(2);
          const parts = content.split('**');
          return (
            <div key={idx} className="flex items-start gap-2.5 ml-4 my-2">
              <span className="text-[#FF4F2E] text-xs mt-0.5 select-none font-bold">▪</span>
              <p className="flex-1 text-xs text-zinc-700">
                {parts.map((p, pIdx) => {
                  return pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold text-black bg-zinc-100 px-1 border border-zinc-250 rounded">{p}</strong> : p;
                })}
              </p>
            </div>
          );
        }

        // Highlight Bold in normal paragraphs
        if (trimmed.includes('**')) {
          const parts = trimmed.split('**');
          return (
            <p key={idx} className="text-xs leading-normal text-zinc-800">
              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-black text-black">{p}</strong> : p)}
            </p>
          );
        }

        // Handle raw italic line wrapper
        let paragraphText = trimmed;
        if (paragraphText.startsWith('*') && paragraphText.endsWith('*')) {
          paragraphText = paragraphText.replace(/\*/g, '');
          return <p key={idx} className="text-xs text-zinc-500 font-medium italic select-all leading-normal">{paragraphText}</p>;
        }

        return <p key={idx} className="text-xs font-medium text-zinc-800 leading-normal select-all">{paragraphText}</p>;
      })}
    </div>
  );
}

interface HeroProps {
  onStartDashboard: (tabId?: any) => void;
  onOpenAuth?: (mode: 'login' | 'signup') => void;
}

const DEFAULT_STORIES = [
  {
    id: 'story-1',
    title: 'THE 1993 DECENT TELECOM RESET',
    subtitle: 'How alpha networks connected 50 local nodes offline',
    content: 'In 1993, unexpected telecom blackouts isolated major business corridors. Rather than waiting for central carrier recovery, a group of local engineers established asynchronous wireless relay hubs using standard high-frequency radios. Within 72 hours, 50 merchant clearance centers were synchronized, allowing core billing logs to bypass network failure gates. This historic event proved that decentralized structures outperform slow monolithic infrastructure.',
    year: '1993',
    author: 'Sovereign Telecom Guild'
  },
  {
    id: 'story-2',
    title: 'THE BEKAA AGRO-ESCROW POOL',
    subtitle: 'Solar micro-irrigation managed by smart grid logs',
    content: 'Faced with volatile supply pipelines, cooperative agronomists assembled distributed solar-pump arrays governed by automated SMS alerts. If water pressure indicators drop below pre-audited levels, resources are automatically re-allocated. Operating entirely on client-simulated SMS payloads, water waste fell by 40% while preserving crop security across 300 hectares.',
    year: '2018',
    author: 'Maan Barazy'
  }
];

const DEFAULT_LITE_INSIGHTS = [
  {
    id: 'insight-1',
    title: 'THE PARALLEL LIQUIDITY PROTOCOL',
    author: 'Maan Barazy',
    role: 'Sovereign Advisor',
    snippet: 'How decentralized digital ledger pools can reboot commercial credit pipelines across Lebanon without central bank bailouts.',
    bgColor: 'bg-slate-900 border-zinc-800 text-white',
    tag: 'FINANCE',
    likesCount: 124
  },
  {
    id: 'insight-2',
    title: 'THE AGENTIC WORKFORCE: SAVING 60% OPERATIONAL BURN',
    author: 'Alpha Team Lead',
    role: 'Sovereign Architect',
    snippet: 'A look at deploying 12 parallel autonomous agents to handle daily administration loops and client-facing brief generation.',
    bgColor: 'bg-white border-zinc-200 text-slate-900',
    tag: 'AI DEPLOYMENT',
    likesCount: 89
  },
  {
    id: 'insight-3',
    title: 'DE-BOTTLENECKING ENTERPRISE DECISION CHAINS',
    author: 'Sovereign Auditor',
    role: 'Operations Expert',
    snippet: 'Eliminating the "approval hoop" drag weight. Empowering decentralized team leaders with automated budget-trigger protocols.',
    bgColor: 'bg-white border-zinc-200 text-slate-900',
    tag: 'MANAGEMENT',
    likesCount: 56
  }
];

export default function Hero({ onStartDashboard, onOpenAuth }: HeroProps) {
  const { user, profile, logOut } = useAuth();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  // Solopreneur Pop-up State
  const [showSolopreneurPopup, setShowSolopreneurPopup] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem('dismissedSolopreneurPopup') === 'true';
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setShowSolopreneurPopup(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Onboarding states
  const [onboardType, setOnboardType] = useState<'founder' | 'enterprise' | null>(null);
  const [onboardSuccess, setOnboardSuccess] = useState(false);
  const [founderForm, setFounderForm] = useState({
    name: '',
    ventureName: '',
    phone: '',
    stage: 'Ideation / Validation',
    bottleneck: 'Manual operations and copy-pasting',
    goal: ''
  });
  const [enterpriseForm, setEnterpriseForm] = useState({
    repName: '',
    repTitle: '',
    companyName: '',
    compliance: 'GDPR & Privacy Rules',
    bottleneck: 'Operations dispatch & log flow',
    infrastructureGoal: ''
  });

  const handleFounderOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('localOnboardType', 'founder');
    localStorage.setItem('localOnboardData', JSON.stringify(founderForm));
    localStorage.setItem('localWiderCompleted', 'false'); // Reset phase 2 state for clean route
    setOnboardSuccess(true);
    setTimeout(() => {
      setOnboardSuccess(false);
      onStartDashboard('my-workspace');
    }, 1500);
  };

  const handleEnterpriseOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('localOnboardType', 'enterprise');
    localStorage.setItem('localOnboardData', JSON.stringify(enterpriseForm));
    localStorage.setItem('localWiderCompleted', 'false'); // Reset phase 2 state for clean route
    setOnboardSuccess(true);
    setTimeout(() => {
      setOnboardSuccess(false);
      onStartDashboard('my-workspace');
    }, 1500);
  };

  // Dynamic loaded content state
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  // Fetch dynamic content on load
  useEffect(() => {
    const loadDynamicData = async () => {
      // 1. Fetch custom page sections
      try {
        const sectionsSnap = await getDocs(collection(db, 'pageSections'));
        const list: any[] = [];
        sectionsSnap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setCustomSections(list);
      } catch (e) {
        console.warn('Page sections dynamic loads bypassed:', e);
      }

      // 2. Fetch stories
      try {
        const storiesSnap = await getDocs(collection(db, 'sheikhStories'));
        const list: any[] = [];
        storiesSnap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        if (list.length > 0) {
          setStories(list);
        } else {
          setStories(DEFAULT_STORIES);
        }
      } catch (e) {
        setStories(DEFAULT_STORIES);
      }

      // 3. Fetch insights
      try {
        const insightsSnap = await getDocs(collection(db, 'csuiteInsights'));
        const list: any[] = [];
        insightsSnap.forEach((docSnap) => {
          const d = docSnap.data();
          if (d.status === 'published') {
            list.push({ id: docSnap.id, ...d });
          }
        });
        if (list.length > 0) {
          setInsights(list.slice(0, 3)); // show top 3 on home page
        } else {
          setInsights(DEFAULT_LITE_INSIGHTS);
        }
      } catch (e) {
        setInsights(DEFAULT_LITE_INSIGHTS);
      }
    };

    loadDynamicData();
  }, []);

  // Active Section Tracking State for vertical menu
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 150;
      const sections = [
        { id: 'intro', top: 0 },
        { id: 'corporate-academy-block', el: document.getElementById('corporate-academy-block') },
        { id: 'mobile-preview-block', el: document.getElementById('mobile-preview-block') },
        { id: 'service-pillars-block', el: document.getElementById('service-pillars-block') },
        { id: 'dispatch-waitlist-block', el: document.getElementById('dispatch-waitlist-block') },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const item = sections[i];
        if (item.id === 'intro') {
          if (scrollPos < 350) {
            setActiveSection('intro');
            break;
          }
        } else if (item.el) {
          const offset = item.el.offsetTop;
          if (scrollPos >= offset) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'intro') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Questionnaire States
  const [activeTab, setActiveTab] = useState<'capabilities' | 'demo'>('capabilities');
  const [demoStep, setDemoStep] = useState<1 | 2 | 3 | 4>(1); // 1: Info, 2: Infrastructure, 3: Loading, 4: Report Result
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('SaaS & Software');
  const [companySize, setCompanySize] = useState('Medium');
  const [aiExperience, setAiExperience] = useState('Basic');
  const [infraDescription, setInfraDescription] = useState('');
  const [bottleneckDescription, setBottleneckDescription] = useState('');
  
  // Loading & Report results
  const [loadingMsg, setLoadingMsg] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(10);
  const [generatedReport, setGeneratedReport] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setJoined(true);
      try {
        const subId = 'sub-' + Date.now();
        await setDoc(doc(db, 'subscribers', subId), {
          id: subId,
          email: email.toLowerCase(),
          status: 'active',
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Subscription saved locally. Firebase sync bypassed:', err);
      }
      setTimeout(() => setJoined(false), 4500);
      setEmail('');
    }
  };

  const runSimulatedProgress = () => {
    setLoadingProgress(10);
    setLoadingMsg('// INITIALIZING COMPILING SYSTEMS INTAKE...');
    
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        const next = prev + Math.floor(Math.random() * 12) + 8;
        if (next >= 40 && next < 70) {
          setLoadingMsg('// DETECTING BOTTLENECK PATTERNS AND LEGACY HOOPS...');
        } else if (next >= 70 && next < 90) {
          setLoadingMsg('// RE-ROUTING WORK FLOW LOGS & DESIGNING SMART OKRS...');
        } else if (next >= 90) {
          setLoadingMsg('// FINALIZING TACTICAL SECURE DISPATCH COMPILATION...');
        }
        return next > 95 ? 95 : next;
      });
    }, 400);

    return interval;
  };

  const handleStartDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !infraDescription.trim() || !bottleneckDescription.trim()) {
      alert('Please fill out all required prompts to cook your transition blueprint.');
      return;
    }
    setDemoStep(3); // Loading screen
    const interval = runSimulatedProgress();

    try {
      const response = await fetch('/api/coach/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName,
          industry,
          size: companySize,
          infra: infraDescription,
          bottleneck: bottleneckDescription,
          aiExperience
        })
      });
      const data = await response.json();
      clearInterval(interval);
      setLoadingProgress(100);
      setGeneratedReport(data.report || 'Something went off. Try starting another analysis.');
      setDemoStep(4); // Report result
    } catch (err) {
      console.error(err);
      clearInterval(interval);
      setLoadingProgress(100);
      setGeneratedReport('Coaching telemetry failed to contact the model. Falling back to default coaching matrices...');
      setDemoStep(4);
    }
  };

  const handleCopyToClipboard = () => {
    if (generatedReport) {
      navigator.clipboard.writeText(generatedReport);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedReport) return;
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let y = 52;

    // Page 1 Background & Cover header
    doc.setFillColor(18, 19, 24); // Deep black/slate theCsuiteCOACH header block
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Title in header
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('theCsuiteCOACH EXECUTIVE DISPATCH', margin, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(157, 255, 0); // Signature neon green
    doc.text(`TACTICAL TRANSITION ROADMAP // ${companyName.toUpperCase() || 'INCOGNITOS'}`, margin, 25);

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const nowStr = new Date().toUTCString();
    doc.text(`COMPILED: ${nowStr} // TARGET LEVEL: HIGH VELOCITY`, margin, 31);

    // Line separating header
    doc.setDrawColor(157, 255, 0);
    doc.setLineWidth(0.8);
    doc.line(margin, 35, pageWidth - margin, 35);

    // Split lines of markdown
    const lines = generatedReport.split('\n');
    doc.setTextColor(30, 30, 30); // Dark text for readability on standard print backgrounds

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 25) {
        doc.addPage();
        
        // Page background (pure white for professional print)
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        // Page header mini
        doc.setFillColor(18, 19, 24);
        doc.rect(0, 0, pageWidth, 12, 'F');
        
        doc.setTextColor(157, 255, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7);
        doc.text(`theCsuiteCOACH ROADMAP // CLIENT: ${companyName.toUpperCase() || 'INCOGNITOS'}`, margin, 8);
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(`PAGE ${doc.internal.pages.length - 1}`, pageWidth - margin - 10, 8);
        
        // Reset text configuration
        doc.setTextColor(30, 30, 30);
        y = 22;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const origLine = lines[i];
      const line = origLine.trim();

      if (!line) {
        y += 4;
        continue;
      }

      if (line.startsWith('####')) {
        const cleanLine = line.replace(/####/g, '').replace(/\*/g, '').trim();
        checkPageBreak(12);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(220, 50, 20); // Accent Red color
        y += 3;
        doc.text(cleanLine.toUpperCase(), margin, y);
        y += 6;
        doc.setTextColor(30, 30, 30);
      } else if (line.startsWith('###')) {
        const cleanLine = line.replace(/###/g, '').replace(/\*/g, '').trim();
        checkPageBreak(15);
        
        // Highlight background block
        y += 4;
        doc.setFillColor(244, 244, 246);
        doc.rect(margin - 2, y - 5, contentWidth + 4, 8, 'F');
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.rect(margin - 2, y - 5, contentWidth + 4, 8, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text(cleanLine.toUpperCase(), margin, y);
        y += 8;
        doc.setTextColor(30, 30, 30);
      } else if (line.startsWith('*') || line.startsWith('-')) {
        const cleanLine = line.replace(/^[\*\-\s]+/, '').replace(/\*/g, '').trim();
        const wrappedTexts = doc.splitTextToSize(cleanLine, contentWidth - 8);
        
        const neededHeight = wrappedTexts.length * 5 + 2;
        checkPageBreak(neededHeight);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('o', margin, y);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        for (let j = 0; j < wrappedTexts.length; j++) {
          doc.text(wrappedTexts[j], margin + 5, y);
          y += 4.5;
        }
        y += 1.5;
      } else {
        const cleanLine = line.replace(/\*/g, '');
        const wrappedTexts = doc.splitTextToSize(cleanLine, contentWidth);
        
        const neededHeight = wrappedTexts.length * 5 + 2;
        checkPageBreak(neededHeight);
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        for (let j = 0; j < wrappedTexts.length; j++) {
          doc.text(wrappedTexts[j], margin, y);
          y += 4.5;
        }
        y += 2;
      }
    }

    doc.save(`theCsuiteCOACH_Transition_Roadmap_${companyName.replace(/[^a-zA-Z0-9]/g, '_') || 'Blueprint'}.pdf`);
  };

  const handleResetDemo = () => {
    setDemoStep(1);
    setCompanyName('');
    setInfraDescription('');
    setBottleneckDescription('');
    setGeneratedReport('');
  };

  return (
    <div className="bg-transparent text-slate-900 min-h-screen selection:bg-slate-900 selection:text-white" id="hero-section">
      {/* Running Marquee of AI Coaching Ethos */}
      <div className="bg-slate-950 text-white/95 py-3 overflow-hidden whitespace-nowrap border-b border-zinc-200/60 font-mono text-[11px] tracking-wider uppercase flex items-center">
        <div className="animate-marquee inline-block">
          ⚡ /// GO PRO OR GET REPLACED • /// ENTERPRISE DEPLOYMENT SERVICES • /// BUILD CO-FOUNDER TASK FORCES • /// COACH CEOS LIVE • /// OPTIMIZE WORKFLOWS • /// SPEED IS LEVERAGE &nbsp;•&nbsp;
        </div>
        <div className="animate-marquee-2 inline-block">
          ⚡ /// GO PRO OR GET REPLACED • /// ENTERPRISE DEPLOYMENT SERVICES • /// BUILD CO-FOUNDER TASK FORCES • /// COACH CEOS LIVE • /// OPTIMIZE WORKFLOWS • /// SPEED IS LEVERAGE &nbsp;•&nbsp;
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Top Minimal Header Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-200/50 pb-8 mb-16">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900" id="branding-title">
              theCsuiteCOACH
            </h1>
            <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest mt-1">Strategic AI Advisory Core</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-white border border-zinc-200 rounded-lg font-mono text-[10px] font-bold text-zinc-500 shadow-xs">
              Platform: Active
            </span>
            <span className="px-3 py-1 bg-zinc-950 rounded-lg font-mono text-[10px] font-bold text-white shadow-xs">
              Powered by Gemini
            </span>
          </div>
        </div>

        {/* Dynamic Left Vertical Menu + Right Content Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* STICKY MINIMALIST LEFT VERTICAL NAVIGATION */}
          <aside className="lg:col-span-3 lg:sticky lg:top-6 z-30 bg-white/70 backdrop-blur-md border border-zinc-200/80 p-5 rounded-2xl shadow-xs">
            <div className="space-y-6">
              <div>
                <p className="font-mono text-[11px] text-[#FF4F2E] uppercase tracking-widest leading-none font-black">/// CORE INTERFACES</p>
                <h4 className="font-sans font-black text-[14px] uppercase text-slate-900 mt-2">DIRECTORY HUB</h4>
              </div>

              {/* NAVIGATION LINKS */}
              <nav className="flex flex-col gap-1 border-y border-zinc-200/60 py-4">
                {[
                  { id: 'intro', label: '01 // TOP ARCHITECT' },
                  { id: 'manifesto', label: '02 // THE MANIFESTO', tabId: 'manifesto-section' },
                  { id: 'insights', label: '03 // C-SUITE INSIGHTS', tabId: 'csuite-insights' },
                  { id: 'magazine', label: '03B // C-SUITE MAGAZINE', tabId: 'csuite-magazine' },
                  { id: 'recon', label: '04 // RESILIENCY RECON', tabId: 'resiliency-recon' },
                  { id: 'transformation', label: '05 // AGENTIC TRANSFORMATION', tabId: 'agentic-transformation' },
                  { id: 'about-us', label: '06 // ABOUT THE PROGRAM', tabId: 'about-us' },
                  { id: 'get-started', label: '07 // LAUNCH BLUEPRINT', tabId: 'get-started' },
                  { id: 'scorecard', label: '08 // DIAGNOSTIC SCORECARD', tabId: 'readiness-scorecard' },
                  { id: 'corporate-academy-block', label: '09 // AUDITING CLINIC' },
                  { id: 'mobile-preview-block', label: '10 // MOBILE ENGINE' },
                  { id: 'service-pillars-block', label: '11 // ADVISORY PILLARS' },
                  { id: 'dispatch-waitlist-block', label: '12 // INTEL DISPATCH' },
                ].map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => sec.tabId ? onStartDashboard(sec.tabId) : scrollToSection(sec.id)}
                      className={`w-full text-left font-mono text-[11px] uppercase py-2 px-2.5 tracking-wider rounded-lg transition-all flex items-center justify-between group cursor-pointer font-extrabold ${
                        isActive 
                          ? 'bg-slate-900 text-[#9DFF00]' 
                          : 'text-zinc-500 hover:text-slate-900 hover:bg-zinc-100/65'
                      }`}
                    >
                      <span>{sec.label}</span>
                      <span className={`w-1.5 h-1.5 rounded-full transition-all ${
                        isActive ? 'bg-[#9DFF00] scale-110' : 'bg-transparent group-hover:bg-zinc-300'
                      }`} />
                    </button>
                  );
                })}
              </nav>

              {/* DYNAMIC SECURED AUTH CONTROLS */}
              <div className="pt-2">
                {user ? (
                  <div className="space-y-3 bg-zinc-50/50 border border-zinc-200/60 p-3 rounded-xl">
                    <div className="space-y-1">
                      <p className="text-[8px] font-mono uppercase tracking-widest text-emerald-600 font-extrabold flex items-center gap-1 leading-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        CONNECTED NODE
                      </p>
                      <p className="text-[9px] font-mono text-zinc-500 truncate" title={user.email}>{user.email}</p>
                      <p className="text-[9px] font-extrabold text-slate-800 bg-white border border-zinc-200 inline-block px-1.5 py-0.5 rounded uppercase leading-none mt-1">
                        {profile?.fullName || 'EXECUTIVE MEMBER'}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 pt-1 border-t border-zinc-200/50">
                      <button
                        onClick={() => onStartDashboard('my-workspace')}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-850 text-white font-mono text-[9px] uppercase font-bold text-center rounded-md transition-colors cursor-pointer"
                      >
                        WORKSPACE VIEW &rarr;
                      </button>
                      <button
                        onClick={() => logOut()}
                        className="w-full py-1 text-center font-mono text-[9px] uppercase text-zinc-405 hover:text-red-500 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" /> [DISCONNECT]
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5 bg-zinc-50/50 border border-zinc-200/60 p-3 rounded-xl">
                    <p className="text-[8.5px] font-mono uppercase tracking-widest text-zinc-400 font-bold leading-none">// AUTHENTICATION</p>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => onOpenAuth?.('login')}
                        className="w-full text-center py-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-slate-900 font-mono text-[9px] uppercase font-black rounded-lg cursor-pointer transition-all shadow-xs leading-tight px-1"
                      >
                        Secure Member Sign In
                      </button>
                      <button
                        onClick={() => onOpenAuth?.('signup')}
                        className="w-full text-center py-2 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[9px] uppercase font-black rounded-lg cursor-pointer transition-all shadow-xs leading-tight px-1"
                      >
                        Standard Sign Up (Explore)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE DATA COLUMN CONTAINER */}
          <div className="lg:col-span-9 space-y-24">

            {/* Gigantic Premium Headline Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-3.5 py-1 bg-zinc-950 border border-zinc-805 text-[#9DFF00] font-mono text-[9px] uppercase tracking-wider font-extrabold rounded-lg">
                ★ AUGMENTED SOLOPRENEUR CORE ★
              </div>
              
              <h2 className="text-4xl sm:text-5xl md:text-[58px] leading-[0.95] font-black uppercase tracking-tight text-slate-900 font-sans">
                You Are the CEO.<br />
                <span className="text-slate-950">We Build Your Empowered Leadership.</span>
              </h2>

              <p className="text-xs md:text-sm text-zinc-650 font-sans font-medium leading-relaxed max-w-2xl">
                We are the infrastructure and implementation partner for building <strong>AI Coworkers</strong>. Our platform provides the technical scaffolding—the <strong>System Matrix</strong>—required to create autonomous agents that handle end-to-end business processes across your existing enterprise systems. Just as global alliances now pair model builders with transformation experts, we bridge the gap between technical potential and organizational reality. We recognize that while model capability is critical, implementation capability is what makes AI adoption stick.
              </p>
            </div>

            {/* Redesigned 2-Column Onboarding Cards in Hero Left Column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Founder/Solopreneur */}
              <div 
                onClick={() => { setOnboardType('founder'); setOnboardSuccess(false); }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px] h-auto ${
                  onboardType === 'founder'
                    ? 'bg-white border-zinc-900 shadow-md ring-1 ring-zinc-950 scale-[1.01]'
                    : 'bg-white/70 border-zinc-200/80 hover:bg-white hover:border-zinc-400 hover:shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 bg-zinc-100 rounded-lg flex items-center justify-center border border-zinc-200/40">
                    <UserCheck className="w-6 h-6 text-zinc-900" />
                  </div>
                  <div>
                    <span className="font-mono text-[16px] uppercase tracking-widest text-[#FF4F2E] font-black block">SOLOPRENEUR PATHWAY</span>
                    <h4 className="text-[22px] font-extrabold text-slate-900 uppercase tracking-tight mt-1 leading-snug">FOUNDER & SOLOPRENEUR</h4>
                  </div>
                  <p className="text-[19px] text-zinc-550 leading-relaxed font-sans font-semibold">
                    Ideal for startup visionaries aiming to crush operational drag and orchestrate autonomous agent swarms.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 mt-4">
                  <span className="text-[17px] font-mono font-black uppercase text-slate-800">
                    Sovereign Assessment
                  </span>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold transition-all ${
                    onboardType === 'founder' ? 'bg-zinc-900 text-white' : 'bg-zinc-200/50 text-zinc-650'
                  }`}>
                    →
                  </span>
                </div>
              </div>

              {/* Card 2: Enterprise */}
              <div 
                onClick={() => { setOnboardType('enterprise'); setOnboardSuccess(false); }}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-350 relative overflow-hidden flex flex-col justify-between min-h-[300px] h-auto ${
                  onboardType === 'enterprise'
                    ? 'bg-zinc-950 border-zinc-800 shadow-md scale-[1.01] text-white'
                    : 'bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-900/95 hover:shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 bg-zinc-800 rounded-lg flex items-center justify-center border border-zinc-700">
                    <Shield className="w-6 h-6 text-[#9DFF00]" />
                  </div>
                  <div>
                    <span className="font-mono text-[16px] uppercase tracking-widest text-[#9DFF00] font-black block">CORP-LEVEL INTEGRATIONS</span>
                    <h4 className="text-[22px] font-extrabold text-white uppercase tracking-tight mt-1 leading-snug">SOCIETY & ENTERPRISE</h4>
                  </div>
                  <p className="text-[19px] text-white leading-relaxed font-sans font-semibold">
                    Designed for corporate administrators seeking regional proxy servers and team learning workflows.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800 mt-4">
                  <span className="text-[17px] font-mono font-black uppercase text-[#9DFF00]">
                    Enterprise Assessment
                  </span>
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-[14px] font-bold transition-all ${
                    onboardType === 'enterprise' ? 'bg-[#9DFF00] text-zinc-950' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    →
                  </span>
                </div>
              </div>
            </div>

            {/* INLINE QUESTIONNAIRE INTERFACE - APPEARS DYNAMICALLY IN THE HERO GRID */}
            {onboardType && (
              <div className="bg-white border-2 border-zinc-900 rounded-2xl p-5 shadow-sm space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2.5 border-b border-zinc-155">
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-wide text-[#FF4F2E] block font-extrabold">// RAPID ADVISORY ONBOARDING</span>
                    <h4 className="font-sans font-black uppercase text-slate-900 tracking-tight text-xs mt-0.5">
                      {onboardType === 'founder' ? 'Founder Venture Setup' : 'Enterprise Operational Alignment'}
                    </h4>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setOnboardType(null)}
                    className="font-mono text-[9px] text-zinc-400 hover:text-[#FF4F2E] uppercase font-black cursor-pointer"
                  >
                    [Dismiss]
                  </button>
                </div>

                {onboardSuccess ? (
                  <div className="py-8 text-center space-y-4 animate-scaleUp">
                    <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-[#86d900] mx-auto border border-emerald-100 font-extrabold">
                      ✓
                    </div>
                    <h4 className="font-sans font-black text-slate-900 uppercase text-xs">BLUEPRINT COMPILED SUCCESSFULLY</h4>
                    <p className="text-zinc-500 font-mono text-[9px] uppercase">Connecting variables. Redirecting to sovereign workspace...</p>
                    <div className="w-20 h-1 bg-zinc-100 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-emerald-500 animate-pulse w-full"></div>
                    </div>
                  </div>
                ) : onboardType === 'founder' ? (
                  <form onSubmit={handleFounderOnboardSubmit} className="space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Founder Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={founderForm.name} 
                          onChange={(e) => setFounderForm({ ...founderForm, name: e.target.value })}
                          placeholder="Nabil G. Lahoud" 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-305 text-zinc-800 text-[15px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Venture / Startup Name</label>
                        <input 
                          type="text" 
                          required
                          value={founderForm.ventureName} 
                          onChange={(e) => setFounderForm({ ...founderForm, ventureName: e.target.value })}
                          placeholder="Cedar Swarms Tech" 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-305 text-zinc-800 text-[15px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Contact Phone (Secure)</label>
                        <input 
                          type="tel" 
                          required
                          value={founderForm.phone} 
                          onChange={(e) => setFounderForm({ ...founderForm, phone: e.target.value })}
                          placeholder="+961 3 456789" 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-305 text-zinc-800 text-[15px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Venture Stage</label>
                        <select 
                          value={founderForm.stage} 
                          onChange={(e) => setFounderForm({ ...founderForm, stage: e.target.value })}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 text-zinc-800 text-[15px]"
                        >
                          <option value="Ideation / Validation">Ideation / Validation</option>
                          <option value="MVP Bootstrapping">MVP Bootstrapping</option>
                          <option value="Scaling Assets & Customers">Scaling Assets & Customers</option>
                          <option value="Global Integration expansion">Global Integration expansion</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Primary System drag Bottleneck</label>
                      <select 
                        value={founderForm.bottleneck} 
                        onChange={(e) => setFounderForm({ ...founderForm, bottleneck: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 text-zinc-800 text-[15px]"
                      >
                        <option value="Manual operations and copy-pasting">Manual operations and copy-pasting</option>
                        <option value="Customer response and email routing latency">Customer response and email routing latency</option>
                        <option value="Escrow logs and financial ledger sync gates">Escrow logs and financial ledger sync gates</option>
                        <option value="Offline system status notifications">Offline system status notifications</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Describe your Primary Tech Stacks / AI Intentions</label>
                      <textarea 
                        rows={2}
                        required
                        value={founderForm.goal} 
                        onChange={(e) => setFounderForm({ ...founderForm, goal: e.target.value })}
                        placeholder="e.g., We want to implement automated WhatsApp trigger notifications to keep suppliers synced..." 
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 resize-none placeholder:text-zinc-305 text-zinc-800 text-[15px]"
                      />
                    </div>

                    <div className="pt-1.5">
                      <button 
                        type="submit" 
                        className="w-full py-3.5 bg-zinc-950 border border-transparent hover:bg-zinc-800 text-[#9DFF00] rounded-xl font-bold uppercase text-[14px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 "
                      >
                        COMPROMISE-FREE WORKSPACE DEPLOYMENT &rarr;
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleEnterpriseOnboardSubmit} className="space-y-4 font-mono text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Representative Name</label>
                        <input 
                          type="text" 
                          required
                          value={enterpriseForm.repName} 
                          onChange={(e) => setEnterpriseForm({ ...enterpriseForm, repName: e.target.value })}
                          placeholder="Marc Y. Chalhoub" 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-305 text-zinc-800 text-[15px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Office Title / Role</label>
                        <input 
                          type="text" 
                          required
                          value={enterpriseForm.repTitle} 
                          onChange={(e) => setEnterpriseForm({ ...enterpriseForm, repTitle: e.target.value })}
                          placeholder="Head of Operations" 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-305 text-zinc-800 text-[15px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Organization/Enterprise Name</label>
                        <input 
                          type="text" 
                          required
                          value={enterpriseForm.companyName} 
                          onChange={(e) => setEnterpriseForm({ ...enterpriseForm, companyName: e.target.value })}
                          placeholder="Levant Industrial Holdings Group" 
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-305 text-zinc-800 text-[15px]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Compliance Goal</label>
                        <select 
                          value={enterpriseForm.compliance} 
                          onChange={(e) => setEnterpriseForm({ ...enterpriseForm, compliance: e.target.value })}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 text-zinc-800 text-[15px]"
                        >
                          <option value="GDPR & Privacy Rules">GDPR & General Privacy Rules</option>
                          <option value="SOC2 Data Auditing Proxy">SOC2 Data Auditing / SEC Proxy</option>
                          <option value="Local/Regional Sovereignty">Local/Regional Grid Sovereignty</option>
                          <option value="No special compliance (Public)">No special compliance (Public)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Core friction sector</label>
                      <select 
                        value={enterpriseForm.bottleneck} 
                        onChange={(e) => setEnterpriseForm({ ...enterpriseForm, bottleneck: e.target.value })}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 text-zinc-800 text-[15px]"
                      >
                        <option value="Operations dispatch & log flow">Operations supply log flow & routing</option>
                        <option value="Administrative invoice tracking and invoices">Administrative invoice tracking and invoices</option>
                        <option value="Corporate personnel education and learning matrices">Corporate personnel education and learning matrices</option>
                        <option value="Secure database setup & proxy API hardening">Secure database setup & proxy API hardening</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-zinc-650 text-[12px] uppercase font-black tracking-wider">Primary System Alignment Goal</label>
                      <textarea 
                        rows={2}
                        required
                        value={enterpriseForm.infrastructureGoal} 
                        onChange={(e) => setEnterpriseForm({ ...enterpriseForm, infrastructureGoal: e.target.value })}
                        placeholder="e.g., Securely auditing compliance logs without leaking customer profile secrets..." 
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 focus:outline-none focus:border-zinc-400 resize-none placeholder:text-zinc-305 text-zinc-800 text-[15px]"
                      />
                    </div>

                    <div className="pt-1.5">
                      <button 
                        type="submit" 
                        className="w-full py-3 bg-zinc-950 border border-transparent hover:bg-zinc-850 text-[#9DFF00] rounded-xl font-bold uppercase text-[14px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        SECURED ENTERPRISE ONBOARD MATRIX &rarr;
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-4 glass-panel border border-zinc-200 p-8 rounded-2xl space-y-6 relative overflow-hidden bg-zinc-50/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 rounded-full filter blur-xl opacity-20 transform translate-x-8 -translate-y-8"></div>
            
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <p className="font-mono text-xs text-emerald-600 font-extrabold tracking-widest uppercase">C-Suite Insights Board</p>
            </div>
            
            <h3 className="font-mono text-sm font-black tracking-wider text-black uppercase">STRATEGIC ALIGNMENTS</h3>
            
            <div className="space-y-4">
              {LATEST_NEWS.map((item) => (
                <div key={item.id} className="border-b border-zinc-200 pb-3 last:border-0 last:pb-0">
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="font-mono text-[9px] bg-zinc-100 px-2 py-0.5 border border-zinc-200 rounded text-zinc-500 font-semibold">{item.source}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                      item.sentiment === 'Bullish' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold' :
                      item.sentiment === 'Hype' ? 'bg-purple-50 text-purple-700 border border-purple-200 font-bold' : 'bg-amber-50 text-amber-700 border border-amber-200 font-bold'
                    }`}>
                      {item.sentiment}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold leading-normal text-zinc-800 hover:text-black transition-colors cursor-pointer" onClick={() => onStartDashboard('csuite-insights')}>{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.time}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-200">
              <button 
                onClick={() => onStartDashboard('csuite-insights')}
                className="w-full py-2 bg-slate-900 text-[#9DFF00] hover:bg-slate-950 font-mono text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer text-center"
              >
                READ MORE ON THE BOARD &rarr;
              </button>
            </div>
          </div>
        </div>


        {/* HIGH-IMPACT C-SUITE EDITORIAL SHOWCASE */}
        <section className="mb-24 scroll-mt-24 bg-white border-2 border-slate-900/90 p-8 md:p-12 rounded-2xl relative overflow-hidden shadow-sm" id="csuite-magazine-spotlight">
          {/* Subtle elegant background element */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-900/5 rounded-full filter blur-3xl opacity-30 -z-10"></div>
          <div className="absolute -left-10 -bottom-10 w-44 h-44 bg-[#FF4F2E]/5 rounded-full filter blur-2xl opacity-25 -z-10"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-zinc-200">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-[#9DFF00] font-mono text-[9px] uppercase tracking-widest font-black rounded">
                ★ OUTSTANDING PUBLICATION DISPATCH ★
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase text-slate-950 tracking-tight leading-none font-sans">
                THE C-SUITE MAGAZINE
              </h3>
              <p className="text-sm font-semibold text-[#FF4F2E] font-mono tracking-wide uppercase">
                STRATEGIC SIGNAL OVER INFRASTRUCTURE NOISE
              </p>
            </div>
            <div>
              <button 
                onClick={() => onStartDashboard('csuite-magazine')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-slate-950 text-white hover:bg-zinc-800 font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer border border-transparent shadow-md"
              >
                <BookOpen className="w-4 h-4 text-[#9DFF00]" />
                ENTER THE EDITORIAL PORTAL &rarr;
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Header intro explicitly matching requested wording */}
            <p className="text-zinc-700 leading-relaxed font-sans text-sm md:text-base font-medium max-w-4xl italic border-l-4 border-slate-950 pl-4">
              "To create a high-impact magazine for a C-suite audience, the content must be strategic, time-efficient, and intellectually stimulating. Executives are pressed for time, so our digest is engineered from the ground up to offer <span className="text-slate-955 font-bold underline decoration-[#FF4F2E] decoration-2">signal over noise</span>."
            </p>

            {/* Grid of the 4 Essential Strategic Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {/* Section 1 */}
              <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-[#FF4F2E] font-extrabold block mb-1">01 // ESSENTIALS</span>
                  <h4 className="font-sans font-black text-sm text-slate-950 uppercase mb-2">The Executive Brief</h4>
                  <ul className="text-[11.5px] text-zinc-500 space-y-1.5 list-disc pl-4 font-sans font-medium">
                    <li><strong className="text-zinc-700">Executive Summary:</strong> Crucial at-a-glance trends.</li>
                    <li><strong className="text-zinc-700">Macro-Pulse:</strong> Geomarkets, policy risks, & 6-12 mo vectors.</li>
                    <li><strong className="text-zinc-700">Regulatory Watch:</strong> Regulatory & compliance shifts.</li>
                  </ul>
                </div>
              </div>

              {/* Section 2 */}
              <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-[#FF4F2E] font-extrabold block mb-1">02 // STRATEGY</span>
                  <h4 className="font-sans font-black text-sm text-slate-950 uppercase mb-2">Thought Leadership</h4>
                  <ul className="text-[11.5px] text-zinc-500 space-y-1.5 list-disc pl-4 font-sans font-medium">
                    <li><strong className="text-zinc-700">The Deep Dive:</strong> Single core challenge cover stories.</li>
                    <li><strong className="text-zinc-700">C-Suite Interview:</strong> Elite peers sharing actionable blueprints.</li>
                    <li><strong className="text-zinc-700">Future-Proofing:</strong> Navigating tech, AI, & workforce stress.</li>
                  </ul>
                </div>
              </div>

              {/* Section 3 */}
              <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-[#FF4F2E] font-extrabold block mb-1">03 // HUMANS</span>
                  <h4 className="font-sans font-black text-sm text-slate-950 uppercase mb-2">Personal Effectiveness</h4>
                  <ul className="text-[11.5px] text-zinc-500 space-y-1.5 list-disc pl-4 font-sans font-medium">
                    <li><strong className="text-zinc-700">Human Element:</strong> Burnout mitigation & focus strategies.</li>
                    <li><strong className="text-zinc-700">Board Dynamics:</strong> Managing investor & stakeholder expectations.</li>
                    <li><strong className="text-zinc-700">The Toolkit:</strong> Selected checklists, hacks & software.</li>
                  </ul>
                </div>
              </div>

              {/* Section 4 */}
              <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs text-[#FF4F2E] font-extrabold block mb-1">04 // COLLABORATIVE</span>
                  <h4 className="font-sans font-black text-sm text-slate-950 uppercase mb-2">Networking</h4>
                  <ul className="text-[11.5px] text-zinc-500 space-y-1.5 list-disc pl-4 font-sans font-medium">
                    <li><strong className="text-zinc-700">Roundtable Highlights:</strong> Peer perspectives on local grids.</li>
                    <li><strong className="text-zinc-700">Curated Connections:</strong> Secure avenues for private dialog.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Layout Table Layout Structure requested */}
            <div className="border border-zinc-200/90 rounded-xl overflow-hidden bg-zinc-50/50">
              <div className="bg-zinc-100 p-3 border-b border-zinc-200">
                <h4 className="font-mono text-[10px] uppercase font-bold text-zinc-650 tracking-wider">EDITORIAL ARCHITECTURE (SUGGESTED LAYOUT STRUCTURE)</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-[11px] border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/70 text-zinc-600">
                      <th className="p-3 font-bold uppercase">Section</th>
                      <th className="p-3 font-bold uppercase">Content Style</th>
                      <th className="p-3 font-bold uppercase">Tone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 text-zinc-700">
                    <tr>
                      <td className="p-3 font-sans font-bold text-slate-950">The Pulse</td>
                      <td className="p-3 font-sans">Data visuals, bulleted briefs, regulatory watch tickers</td>
                      <td className="p-3 font-semibold text-amber-600">Objective & Urgent</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-bold text-slate-950">Strategy</td>
                      <td className="p-3 font-sans">Analytical essays, case studies, future-proofing grids</td>
                      <td className="p-3 font-semibold text-emerald-600">Authoritative & Visionary</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-bold text-slate-950">Leadership</td>
                      <td className="p-3 font-sans">Narrative interviews, board psychology, toolkit hacks</td>
                      <td className="p-3 font-semibold text-indigo-600">Personal & Relatable</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-sans font-bold text-slate-950">The Close</td>
                      <td className="p-3 font-sans">High-level books, sovereign philosophy, leisure assets</td>
                      <td className="p-3 font-semibold text-purple-600">Sophisticated & Reflective</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>


        {/* Dynamic Page Sections added by Administration Console */}
        {customSections.map((sec) => (
          <section key={sec.id} className="mb-24 scroll-mt-24 bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl relative overflow-hidden shadow-xs">
            <div className={`p-2 space-y-4 ${sec.layoutType === 'image-left' ? 'flex flex-col md:flex-row gap-8 items-center' : ''}`}>
              <div className="flex-grow space-y-4">
                <div className="inline-block px-3 py-1 bg-yellow-50 border border-yellow-105 text-yellow-805 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
                  ★ {sec.subtitle || 'CUSTOM ADMIN EXPANSION'} ★
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold uppercase text-slate-900 tracking-tight leading-none font-sans">
                  {sec.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-sans font-semibold whitespace-pre-wrap">
                  {sec.content}
                </p>
              </div>

              {sec.imageUrl && (
                <div className="w-full md:w-80 shrink-0 border border-zinc-200 rounded-xl overflow-hidden shadow-xs leading-none bg-zinc-50">
                  <img src={sec.imageUrl} alt={sec.title} className="w-full h-auto object-cover max-h-56" referrerPolicy="no-referrer" />
                </div>
              )}
            </div>
          </section>
        ))}




        {/* RESEARCH SUBSECTION: AI OR X TRANSFORMATION JOURNEY */}
        <section className="mb-24 bg-slate-900 text-white border border-zinc-800 p-6 md:p-10 rounded-2xl relative overflow-hidden shadow-lg" id="transformation-research-block">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#9DFF00]/10 rounded-full filter blur-3xl opacity-40 -z-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Column 1: Info (7 spans) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-white font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
                ★ CO-OP RESEARCH MATRIX ★
              </div>
              
              <h3 className="text-2xl md:text-4xl font-extrabold uppercase text-white tracking-tight leading-none font-sans">
                Are you in the process of AI or X Transformation?
              </h3>
              
              <p className="text-white font-bold text-sm tracking-wide uppercase font-mono">
                // We need to learn from your experience.
              </p>
              
              <p className="text-zinc-300 text-[13px] leading-relaxed">
                Modern enterprise transformation isn't a simple plug-and-play upgrade; it is an active redesign of workflows and organizational structures. By contributing your current goals, bottlenecks, and stages of implementation, we can tailor custom agentic configurations that mitigate operational drag completely.
              </p>

              <div>
                <button 
                  onClick={() => onStartDashboard('transformation-survey')}
                  className="px-6 py-3 bg-[#9DFF00] hover:bg-[#8cee00] text-slate-950 font-mono text-[10.5px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center gap-2"
                >
                  <span>Go to Questionnaire & Cases</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            </div>

            {/* Column 2: Cases Snapshot Preview (5 spans) */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-5 border border-white/10 rounded-xl space-y-4">
              <span className="font-mono text-[9px] text-[#9DFF00] font-black uppercase tracking-widest block border-b border-white/10 pb-2">
                // CASE STUDIES DIRECTORY PREVIEW
              </span>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <strong className="text-white text-[12px] block uppercase font-mono">1. Medical Information RAG</strong>
                  <p className="text-zinc-300 text-[11px] leading-snug">Reduced historical triage retrieval lookup duration by 82% safely inside a secure healthcare proxy environment.</p>
                </div>
                
                <div className="space-y-1">
                  <strong className="text-white text-[12px] block uppercase font-mono">2. Logistics Capacity scheduling</strong>
                  <p className="text-zinc-300 text-[11px] leading-snug">Autonomous freight dispatch agents bypass scheduling errors, raising peak operations capacity by 4.2x.</p>
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => onStartDashboard('transformation-survey')}
                  className="text-[#9DFF00] hover:underline font-mono text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
                >
                  View All Real Case Studies &rarr;
                </button>
              </div>
            </div>

          </div>
        </section>


        {/* CORPORATE ACADEMY HUB & WORKSPACE ALIGNMENT */}
        <section className="mb-24 scroll-mt-24 bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl relative overflow-hidden shadow-xs" id="corporate-academy-block">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50 rounded-full filter blur-3xl opacity-40 -z-10 animate-pulse"></div>
          
          <div className="text-center space-y-4 mb-10">
            <div className="inline-block px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
              ★ ENTERPRISE RECON CENTRE ★
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-slate-900 font-sans">
              CORPORATE ACADEMY & AUDITING LAB
            </h3>
            <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Equip your corporate talent forces with structured learning resources, live assessments, skill checkpoints, and certification pipelines to maximize administrative time savings.
            </p>
          </div>

          <CorporateAssessmentHub />
        </section>

        {/* RAW MOBILE SUITE SIMULATION */}
        <section className="mb-24 scroll-mt-24 bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl relative overflow-hidden shadow-xs" id="mobile-preview-block">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-50 rounded-full filter blur-3xl opacity-40 -z-10"></div>
          
          <div className="text-center space-y-4 mb-10">
            <div className="inline-block px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-650 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
              ★ MOBILE EX-VETTED TELECOMMUNICATIONS ★
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-slate-900 font-sans">
              RAW-MOBILE APP PREVIEW SUITE
            </h3>
            <p className="text-xs text-slate-550 max-w-2xl mx-auto leading-relaxed">
              Don't compromise operational speed. Preview our ultra-clean, raw-text mobile client designed specifically for high-capacity push signals and diagnostic notifications.
            </p>
          </div>

          <PhoneSimulator />
        </section>

        <div className="mb-24 scroll-mt-24" id="service-pillars-block">
          <div className="text-center space-y-3 mb-12">
            <p className="font-mono text-xs uppercase text-slate-600 font-extrabold tracking-widest">COACHING SERVICE PILLARS</p>
            <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase text-slate-900 font-sans">THE STABILITY INFRASTRUCTURE</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-xs">
              <Sparkles className="w-8 h-8 text-slate-800 mb-3" />
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-sans">Human & Machine Symbiosis</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">We do not just hand you a chat box. We design the human escalation strategy. Knowing when to loop in the senior architect is the difference between a functional workspace and infinite loops.</p>
            </div>
            <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-xs">
              <Terminal className="w-8 h-8 text-slate-800 mb-3" />
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-sans">AI Roleplay Simulators</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">Don't rehearse with standard personnel. Face our raw, aggressive AI stakeholders programmed with metric-focused guardrails to mimic investor, CMO, or CFO skepticism.</p>
            </div>
            <div className="bg-white border border-slate-900 p-6 rounded-2xl shadow-xs">
              <Flame className="w-8 h-8 text-amber-500 mb-3 animate-pulse" />
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-sans">WhatsApp & Mobile Bot</h4>
              <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">Never disconnect from your mentor. Connect via SMS or simulated mobile frames to trigger swift, actionable advice on current business blocks inside your browser.</p>
            </div>
          </div>
        </div>

        {/* Newsletter / Waitlist Signup */}
        <div className="bg-[#F8FAFC] border border-zinc-200 text-slate-900 p-10 md:p-16 text-center space-y-6 relative overflow-hidden rounded-3xl shadow-xs scroll-mt-24" id="dispatch-waitlist-block">
          
          <h3 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-slate-900 max-w-3xl mx-auto leading-none font-sans">
            Get the tactical intelligence dispatch. No fluff.
          </h3>
          <p className="font-mono text-slate-500 text-xs uppercase tracking-wider max-w-xl mx-auto font-bold">
            Once a week. A curated, bulletproof report detailing which enterprise pipelines were automated and which tools died.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-4 relative z-10">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your professional email..."
              required
              className="flex-1 px-4 py-3.5 bg-white border border-zinc-200 text-slate-900 font-mono text-xs rounded-lg focus:outline-none focus:border-slate-900 transition-colors placeholder:text-zinc-405"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs uppercase font-extrabold tracking-wider rounded-lg transition-all cursor-pointer"
            >
              SUBSCRIBE
            </button>
          </form>

          {joined && (
            <div className="text-emerald-700 font-mono text-xs tracking-wider animate-bounce">
              ⚡ WELCOME TO THE FORCE. INBOX DISPATCH DEPLOYED.
            </div>
          )}
        </div>

        </div> {/* Close lg:col-span-9 */}
      </div> {/* Close grid */}
    </div> {/* Close main container wrap */}

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 text-zinc-600 py-12 rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black tracking-tighter text-white bg-black px-2.5 py-1 rounded">theCsuiteCOACH</span>
            <span className="text-[10px] text-zinc-400 font-mono">© 2026 OVERKILL RESEARCH DEPT.</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
            <a href="#hero-section" className="hover:underline hover:text-black">TOP</a>
            <span>•</span>
            <button onClick={onStartDashboard} className="hover:underline text-black font-bold cursor-pointer">LAUNCH INTERACTIVE SAAS WORKSPACE</button>
          </div>
        </div>
      </footer>

      {showSolopreneurPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn" id="solopreneur-popup-overlay">
          <div className="bg-white border-2 border-zinc-900 rounded-3xl p-6 md:p-8 max-w-md w-full relative overflow-hidden shadow-2xl animate-scaleUp">
            {/* Minimal Background Gradients */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#9DFF00]/10 rounded-full filter blur-2xl opacity-60 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-44 h-44 bg-[#FF4F2E]/5 rounded-full filter blur-2xl opacity-60 pointer-events-none"></div>
            
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => {
                setShowSolopreneurPopup(false);
                sessionStorage.setItem('dismissedSolopreneurPopup', 'true');
              }}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-slate-900 hover:bg-zinc-100 rounded-full transition-all cursor-pointer flex items-center justify-center"
              id="close-solopreneur-popup"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content & Design */}
            <div className="space-y-6 pt-2 relative z-10">
              {/* Launcher Aura */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-950 text-[#9DFF00] font-mono text-[9px] uppercase font-bold tracking-wider rounded-lg">
                ★ AUGMENTED SOLOPRENEUR LAYER
              </div>

              {/* Title Section */}
              <div className="space-y-2.5">
                <h3 className="text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight leading-tight">
                  You Are the CEO.<br />
                  <span className="text-slate-950">We Build Your Empowered Leadership.</span>
                </h3>
                <p className="text-zinc-650 text-xs md:text-[13px] leading-relaxed font-sans font-medium">
                  Stop playing every role in your business. Experience the <strong className="text-slate-950">Lebanese AI Renaissance</strong> by deploying a digital executive team designed for the individual entrepreneur.
                </p>
              </div>

              {/* Pillars list (The Solopreneur's Advantage) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 py-1">
                {[
                  {
                    title: "The Core",
                    desc: "Architect your strategic vision with an AI Chief of Staff.",
                    icon: <Compass className="w-4 h-4 text-emerald-500" />
                  },
                  {
                    title: "The Lab",
                    desc: "Secure your digital infrastructure and audit your performance.",
                    icon: <Shield className="w-4 h-4 text-indigo-500" />
                  },
                  {
                    title: "The Academy",
                    desc: "Master the skills of an enterprise leader.",
                    icon: <BookOpen className="w-4 h-4 text-amber-500" />
                  },
                  {
                    title: "The Swarm",
                    desc: "Deploy autonomous agents to handle the daily grind.",
                    icon: <Zap className="w-4 h-4 text-purple-500" />
                  }
                ].map((item, idx) => (
                  <div key={idx} className="bg-zinc-50 border border-zinc-200/80 p-3.5 rounded-2xl flex gap-3 items-start hover:bg-white hover:border-zinc-350 transition-all text-left">
                    <div className="p-1.5 bg-white border border-zinc-200 rounded-lg shrink-0 flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-[11px] font-sans font-extrabold uppercase text-slate-900 leading-tight">{item.title}</h4>
                      <p className="text-[10px] text-zinc-500 font-sans font-semibold mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action and CTAs */}
              <div className="space-y-3 pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem('dismissedSolopreneurPopup', 'true');
                    setShowSolopreneurPopup(false);
                    onStartDashboard('readiness-scorecard');
                  }}
                  className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-[#9DFF00] font-sans font-extrabold uppercase text-xs tracking-wider transition-all cursor-pointer rounded-2xl flex items-center justify-center gap-2 shadow-md hover:translate-y-[-1px] group"
                >
                  Get My "Solopreneur-to-CEO" Audit
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
                
                <p className="text-[9px] font-mono uppercase text-zinc-400 tracking-wider">
                  "Join the elite cohort leading the Lebanese AI Renaissance"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
