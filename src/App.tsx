import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import AICoaches from './components/AICoaches';
import GoalTracker from './components/GoalTracker';
import RoleplaySimulator from './components/RoleplaySimulator';
import HumanMarketplace from './components/HumanMarketplace';
import WhatsAppSandbox from './components/WhatsAppSandbox';
import Analytics from './components/Analytics';
import PhoneSimulator from './components/PhoneSimulator';
import CorporateAssessmentHub from './components/CorporateAssessmentHub';
import CopilotWorkspace from './components/CopilotWorkspace';
import CeoCoaching from './components/CeoCoaching';
import AgenticTransformationService from './components/AgenticTransformationService';
import AboutUs from './components/AboutUs';
import GetStarted from './components/GetStarted';
import ReadinessScorecard from './components/ReadinessScorecard';
import ManifestoPage from './components/ManifestoPage';
import ResiliencyRecon from './components/ResiliencyRecon';
import TransformationSurvey from './components/TransformationSurvey';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthInterface from './components/AuthInterface';
import MyPersonalWorkspace from './components/MyPersonalWorkspace';
import AdminConsole from './components/AdminConsole';
import CSuiteInsights from './components/CSuiteInsights';
import CSuiteMagazine from './components/CSuiteMagazine';
import FAQPage from './components/FAQPage';
import LegalPage from './components/LegalPage';
import GDPRBanner from './components/GDPRBanner';
import ChatbotWidget from './components/ChatbotWidget';
import { db } from './lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { 
  Sparkles, 
  MessageSquareDiff, 
  CheckSquare, 
  Users, 
  Smartphone, 
  ChevronRight,
  TrendingUp,
  Brain,
  HelpCircle,
  FileSpreadsheet,
  Award,
  Terminal,
  Flame,
  ShieldAlert,
  ShieldCheck,
  LogOut,
  User,
  Settings,
  Lock,
  RefreshCw,
  BookOpen
} from 'lucide-react';

type TabId = 
  | 'copilot-workspace' 
  | 'ceo-coaching' 
  | 'corp-academy' 
  | 'ai-coaches' 
  | 'roleplay' 
  | 'goal-tracker' 
  | 'human-marketplace' 
  | 'analytics' 
  | 'whatsapp' 
  | 'mobile' 
  | 'my-workspace' 
  | 'admin'
  | 'csuite-insights'
  | 'csuite-magazine'
  | 'agentic-transformation'
  | 'about-us'
  | 'get-started'
  | 'readiness-scorecard'
  | 'manifesto-section'
  | 'resiliency-recon'
  | 'transformation-survey'
  | 'faq'
  | 'legal';

interface TabItem {
  id: TabId;
  label: string;
  sub: string;
  icon: React.ReactNode;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, profile, loading, logOut, refreshProfile } = useAuth();
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>('copilot-workspace');
  const [hasAdminOverride, setHasAdminOverride] = useState(false);
  const [isAdminPasswordUnlocked, setIsAdminPasswordUnlocked] = useState(false);

  const isUserAdmin = profile?.isAdmin || user?.email?.toLowerCase() === "maanbarazy@gmail.com" || hasAdminOverride;
  
  // Dynamic visible sections mapped from admin activeModules config
  const [activeModules, setActiveModules] = useState<Record<string, boolean>>({
    manifestoPage: true,
    csuiteInsightsBoard: true,
    corpAcademy: true,
  });

  // Auth modal overlay states
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [authDefaultMode, setAuthDefaultMode] = useState<'login' | 'signup'>('login');

  // Listen to Firestore site settings config in real-time
  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'siteSettings', 'config'),
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.activeModules) {
            setActiveModules(data.activeModules);
          }
        }
      },
      (error) => {
        console.error('Failed to stream site settings config:', error);
      }
    );
    return () => unsub();
  }, []);

  // Safety redirect: If standard user attempts to load a disabled section, reset activeTab
  useEffect(() => {
    if (!loading && !isUserAdmin) {
      const isCurrentTabHidden =
        (activeTab === 'manifesto-section' && activeModules.manifestoPage === false) ||
        (activeTab === 'csuite-insights' && activeModules.csuiteInsightsBoard === false) ||
        (activeTab === 'corp-academy' && activeModules.corpAcademy === false);
      
      if (isCurrentTabHidden) {
        setActiveTab(user ? 'my-workspace' : 'readiness-scorecard');
      }
    }
  }, [activeTab, activeModules, isUserAdmin, loading, user]);

  // Handle direct url path & hash location routing (unified state management)
  useEffect(() => {
    const handleRouting = () => {
      const path = window.location.pathname.toLowerCase().replace(/\/$/, "");
      const hash = window.location.hash.toLowerCase().replace(/^#\/?/, "");
      
      let matchedTab: TabId | null = null;
      if (path === '/admin' || path.startsWith('/admin') || hash === 'admin') {
        matchedTab = 'admin';
      } else {
        const cleanPath = path.replace(/^\//, "");
        const allTabIds: TabId[] = [
          'copilot-workspace', 'ceo-coaching', 'corp-academy', 'ai-coaches', 
          'roleplay', 'goal-tracker', 'human-marketplace', 'analytics', 
          'whatsapp', 'mobile', 'my-workspace', 'admin', 'csuite-insights', 
          'csuite-magazine', 'agentic-transformation', 'about-us', 'get-started', 
          'readiness-scorecard', 'manifesto-section', 'resiliency-recon', 
          'transformation-survey', 'faq', 'legal'
        ];
        
        for (const tid of allTabIds) {
          if (cleanPath === tid || hash === tid) {
            matchedTab = tid;
            break;
          }
        }
      }
      
      if (matchedTab) {
        setShowDashboard(true);
        setActiveTab(matchedTab);
      }
    };

    handleRouting();
    window.addEventListener('popstate', handleRouting);
    window.addEventListener('hashchange', handleRouting);
    return () => {
      window.removeEventListener('popstate', handleRouting);
      window.removeEventListener('hashchange', handleRouting);
    };
  }, []);

  // Update hash when tab switches
  useEffect(() => {
    if (showDashboard) {
      const currentHash = window.location.hash.toLowerCase().replace(/^#\/?/, "");
      if (currentHash !== activeTab) {
        window.location.hash = `/${activeTab}`;
      }
    } else {
      if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  }, [activeTab, showDashboard]);

  const handleStartDashboard = (tab?: TabId) => {
    if (tab) {
      setActiveTab(tab);
    } else {
      setActiveTab(user ? 'my-workspace' : 'readiness-scorecard');
    }
    setShowDashboard(true);
  };

  // Build the dynamic tab listings
  const tabs: TabItem[] = [
    // Dynamic: If logged in, add profile/workspace as the first primary item!
    ...(user ? [{
      id: 'my-workspace' as TabId,
      label: 'MY SOVEREIGN WORKSPACE',
      sub: 'Manage info & tactical checklists',
      icon: <Settings className="w-5 h-5 text-amber-500 animate-pulse" />
    }] : []),
    {
      id: 'copilot-workspace',
      label: 'CO-PILOT WORKSPACE',
      sub: 'Summary & interactive assessment',
      icon: <Terminal className="w-5 h-5 text-rose-500" />
    },
    {
      id: 'ceo-coaching',
      label: 'CEO WAR ROOM & TURNEY',
      sub: 'Sovereign-grade venture tech',
      icon: <Flame className="w-5 h-5 text-orange-500" />
    },
    {
      id: 'corp-academy',
      label: 'Corporate Academy',
      sub: 'Align staff & track certifications',
      icon: <Award className="w-5 h-5 text-[#A855F7]" />
    },
    {
      id: 'ai-coaches',
      label: 'AI WORKFLOW COACHES',
      sub: '4 Advisory model avatars',
      icon: <MessageSquareDiff className="w-5 h-5 text-indigo-500" />
    },
    {
      id: 'roleplay',
      label: 'ROLEPLAY SIMULATOR',
      sub: 'High-pressure alignment practice',
      icon: <Brain className="w-5 h-5 text-rose-500" />
    },
    {
      id: 'goal-tracker',
      label: 'GOAL & ACTION ENGINE',
      sub: 'Tactical automation roadmaps',
      icon: <CheckSquare className="w-5 h-5 text-emerald-500" />
    },
    {
      id: 'human-marketplace',
      label: 'EXPERT CONSULTANTS',
      sub: 'On-demand technical guides',
      icon: <Users className="w-5 h-5 text-blue-500" />
    },
    {
      id: 'analytics',
      label: 'PERFORMANCE BOARD',
      sub: 'Savings statistics & recovery',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />
    },
    {
      id: 'whatsapp',
      label: 'WHATSAPP GATEWAY',
      sub: 'Client text simulation portal',
      icon: <Smartphone className="w-5 h-5 text-teal-500" />
    },
    {
      id: 'mobile',
      label: 'MOBILE CLIENT SUITE',
      sub: 'Handheld chat interface simulation',
      icon: <Smartphone className="w-5 h-5 text-zinc-500" />
    },
    {
      id: 'manifesto-section' as TabId,
      label: 'THE C-SUITE MANIFESTO',
      sub: 'Philosophy & recovery plans',
      icon: <BookOpen className="w-5 h-5 text-yellow-500" />
    },
    {
      id: 'csuite-insights' as TabId,
      label: 'C-Suite Insights Board',
      sub: 'Decentralized layout pins',
      icon: <Brain className="w-5 h-5 text-emerald-500" />
    },
    {
      id: 'csuite-magazine' as TabId,
      label: 'C-SUITE MAGAZINE',
      sub: 'High-impact analytical digest',
      icon: <BookOpen className="w-5 h-5 text-[#FF4F2E]" />
    },
    {
      id: 'resiliency-recon' as TabId,
      label: 'RESILIENCY RECON ARCS',
      sub: 'Sovereign local system stories',
      icon: <ShieldAlert className="w-5 h-5 text-amber-500" />
    },
    {
      id: 'agentic-transformation' as TabId,
      label: 'AGENTIC TRANSFORMATION',
      sub: 'C-Suite swarm simulator',
      icon: <Sparkles className="w-5 h-5 text-[#9DFF00]" />
    },
    {
      id: 'about-us' as TabId,
      label: 'ABOUT THE PROGRAM',
      sub: 'Philosophy & Pillars of Excellence',
      icon: <Users className="w-5 h-5 text-indigo-500" />
    },
    {
      id: 'get-started' as TabId,
      label: 'ACADEMY PLATFORM',
      sub: 'Modular curricular training matrix',
      icon: <Award className="w-5 h-5 text-rose-500" />
    },
    {
      id: 'readiness-scorecard' as TabId,
      label: 'AI DIAGNOSTIC SCORECARD',
      sub: 'Assess friction & target gaps',
      icon: <FileSpreadsheet className="w-5 h-5 text-[#FF4F2E]" />
    },
    {
      id: 'transformation-survey' as TabId,
      label: 'TRANSFORMATION SURVEY & CASES',
      sub: 'Share your journey & learn from cases',
      icon: <HelpCircle className="w-5 h-5 text-indigo-500" />
    },
    {
      id: 'faq' as TabId,
      label: 'FREQUENTLY ASKED QUESTIONS',
      sub: 'Transformation questions & answers',
      icon: <HelpCircle className="w-5 h-5 text-indigo-600" />
    },
    {
      id: 'legal' as TabId,
      label: 'LEGAL & GDPR COMPLIANCE',
      sub: 'Privacy, Terms & sovereign standards',
      icon: <ShieldCheck className="w-5 h-5 text-zinc-550" />
    },
    {
      id: 'admin' as TabId,
      label: 'ADMIN CONTROL ROOM',
      sub: 'Sovereign site control room',
      icon: <ShieldCheck className="w-5 h-5 text-rose-500" />
    }
  ];

  if (loading) {
    return (
      <div className="bg-slate-950 text-white min-h-screen flex flex-col items-center justify-center font-mono text-xs space-y-4">
        <RefreshCw className="w-8 h-8 text-yellow-400 animate-spin" />
        <p className="tracking-widest">// INITIALIZING CRYPTO SECURE AUTH NODES...</p>
      </div>
    );
  }

  if (!showDashboard) {
    return (
      <>
        <Hero 
          onStartDashboard={(tab) => handleStartDashboard(tab)} 
          onOpenAuth={(mode) => {
            setAuthDefaultMode(mode);
            setShowAuthOverlay(true);
          }}
        />
        
        {/* Sign In Header floating trigger for landing page */}
        <div className="fixed top-5 right-5 z-40 bg-white/90 backdrop-blur border border-zinc-200 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono text-zinc-500">Logged as <strong className="text-slate-900">{profile?.fullName || user.email}</strong></span>
              <button
                onClick={() => {
                  setShowDashboard(true);
                  setActiveTab('my-workspace');
                }}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-[#9DFF00] font-mono text-[9px] uppercase font-bold rounded-md cursor-pointer"
              >
                My Workspace
              </button>
              <button onClick={() => logOut()} className="text-zinc-400 hover:text-red-500 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
             <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthDefaultMode('login');
                  setShowAuthOverlay(true);
                }}
                className="px-2.5 py-1 text-slate-700 hover:text-slate-950 font-mono text-[9px] uppercase font-bold transition-all cursor-pointer border border-zinc-200 rounded hover:bg-slate-50"
              >
                Secure Member Sign In
              </button>
              <button
                onClick={() => {
                  setAuthDefaultMode('signup');
                  setShowAuthOverlay(true);
                }}
                className="px-2.5 py-1 bg-slate-900 text-white hover:text-yellow-350 font-mono text-[9px] uppercase font-extrabold rounded-md transition-all cursor-pointer"
              >
                Standard Sign Up (Explore)
              </button>
            </div>
          )}
        </div>

        {/* Global Modal Overlay */}
        {showAuthOverlay && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <AuthInterface 
              defaultMode={authDefaultMode} 
              onCancel={() => setShowAuthOverlay(false)} 
              onSuccess={() => {
                setShowAuthOverlay(false);
                setShowDashboard(true);
                setActiveTab('my-workspace');
              }}
            />
          </div>
        )}
      </>
    );
  }

  // Get User Initials for Profile badge
  const userInitials = profile?.fullName
    ? profile.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'FX';

  return (
    <div className="bg-[#FAF9F6] text-[#1E293B] min-h-screen flex flex-col font-sans selection:bg-slate-900 selection:text-white" id="main-root">
      {/* Dynamic top bar */}
      <header className="border-b border-zinc-200/60 bg-white/95 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDashboard(false)}
              className="font-extrabold text-xl tracking-tight text-slate-900 uppercase hover:text-slate-650 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              theCsuiteCOACH
            </button>
            <span className="hidden md:inline-block font-mono text-[9px] uppercase font-semibold text-zinc-500 bg-zinc-100 px-2.5 py-1 border border-zinc-200/80 rounded">
              Active Workspace
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDashboard(false)}
              className="px-3.5 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 font-mono text-[10px] font-bold text-zinc-800 transition-all cursor-pointer flex items-center gap-1.5 rounded-lg shadow-sm"
            >
              Landing Hub
            </button>

            {/* Profile badge replaces mock secured nodes */}
            <div className="flex items-center gap-3.5 bg-zinc-50/50 pl-2.5 pr-3 py-1.5 border border-zinc-200/80 rounded-lg">
              {user ? (
                <>
                  <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
                    {userInitials}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-[10px] font-bold text-zinc-900 leading-none">{profile?.fullName || user.email}</p>
                    <p className="text-[8px] font-mono text-[#86d900] font-black mt-1 uppercase leading-none">
                      {profile?.registrationStatus || 'ACTIVE'} MODE
                    </p>
                  </div>
                  <button 
                    onClick={async () => {
                      await logOut();
                      setShowDashboard(false);
                    }} 
                    className="p-1 text-zinc-400 hover:text-red-500 hover:scale-105 transition-all cursor-pointer"
                    title="Terminate Secured Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1.5 animate-scaleUp">
                  <button
                    onClick={() => {
                      setAuthDefaultMode('login');
                      setShowAuthOverlay(true);
                    }}
                    className="px-3 py-1.5 text-slate-800 hover:text-slate-950 font-mono text-[9.5px] uppercase font-bold transition-all cursor-pointer border border-zinc-205 rounded hover:bg-slate-50"
                  >
                    Secure Member Sign In
                  </button>
                  <button
                    onClick={() => {
                      setAuthDefaultMode('signup');
                      setShowAuthOverlay(true);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 text-[#9DFF00] font-mono text-[9.5px] uppercase font-extrabold rounded-md shadow transition-all cursor-pointer"
                  >
                    Standard Sign Up (Explore)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Navigation Columns */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 px-4 py-3 rounded-lg border border-slate-800 shadow-sm text-center lg:text-left">
            <h3 className="font-semibold text-xs text-white uppercase flex items-center justify-center lg:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Core Services
            </h3>
            <p className="text-[8.5px] text-slate-400 mt-1 uppercase font-mono tracking-wider">Select active team module</p>
          </div>

          <nav className="space-y-1.5">
            {tabs
              .filter(tab => tab.id !== 'admin')
              .filter(tab => {
                if (isUserAdmin) return true;
                if (tab.id === 'manifesto-section' && activeModules.manifestoPage === false) return false;
                if (tab.id === 'csuite-insights' && activeModules.csuiteInsightsBoard === false) return false;
                if (tab.id === 'corp-academy' && activeModules.corpAcademy === false) return false;
                return true;
              })
              .map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`w-full text-left p-3 border transition-all cursor-pointer flex items-center justify-between group rounded-xl ${
                     isSelected
                       ? 'bg-white text-slate-950 border-zinc-900 shadow-[0_4px_16px_rgba(15,23,42,0.04)] ring-1 ring-zinc-950'
                       : 'bg-white/60 text-zinc-500 border-zinc-200/80 hover:bg-white hover:text-slate-900 hover:shadow-xs'
                   }`}
                   id={`nav-item-${tab.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8.5 h-8.5 border rounded-lg flex items-center justify-center font-bold text-sm select-none transition-all ${
                      isSelected 
                        ? 'bg-zinc-950 text-white border-transparent' 
                        : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}>
                      {tab.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold text-xs uppercase tracking-tight leading-none ${
                        isSelected ? 'text-slate-900' : 'text-zinc-700 group-hover:text-slate-900'
                      }`}>{tab.label}</h4>
                      <p className={`text-[8.5px] font-mono mt-1 ${isSelected ? 'text-zinc-500' : 'text-zinc-400'}`}>{tab.sub}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${isSelected ? 'text-slate-900' : 'text-zinc-400'}`} />
                </button>
              );
            })}
          </nav>

          <div className="bg-zinc-50 border border-zinc-200/90 p-4 rounded-xl text-xs leading-relaxed text-zinc-600 shadow-xs">
            <span className="font-bold text-zinc-950 block uppercase tracking-wider text-[10px] mb-1 font-sans">Sovereign Ecosystem</span>
            <p className="leading-relaxed text-zinc-400 text-[10.5px]">
              Need custom technical setups, decentralized API access, or expert reviews? Request customized workspace tooling or direct developer escalations instantly from the directory above.
            </p>
          </div>
        </aside>

        {/* Dynamic Display Area */}
        <main className="lg:col-span-9 bg-transparent w-full">
          {activeTab === 'my-workspace' && <MyPersonalWorkspace onTabChange={(id) => setActiveTab(id)} />}
          {activeTab === 'copilot-workspace' && <CopilotWorkspace onTabChange={(id) => setActiveTab(id)} />}
          {activeTab === 'ceo-coaching' && <CeoCoaching />}
          {activeTab === 'corp-academy' && <CorporateAssessmentHub />}
          {activeTab === 'ai-coaches' && <AICoaches />}
          {activeTab === 'roleplay' && <RoleplaySimulator />}
          {activeTab === 'goal-tracker' && <GoalTracker />}
          {activeTab === 'human-marketplace' && <HumanMarketplace />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'whatsapp' && <WhatsAppSandbox />}
          {activeTab === 'mobile' && <PhoneSimulator />}
          {activeTab === 'csuite-insights' && <CSuiteInsights />}
          {activeTab === 'csuite-magazine' && <CSuiteMagazine />}
          {activeTab === 'agentic-transformation' && <AgenticTransformationService />}
          {activeTab === 'about-us' && <AboutUs />}
          {activeTab === 'get-started' && <GetStarted />}
          {activeTab === 'readiness-scorecard' && <ReadinessScorecard />}
          {activeTab === 'manifesto-section' && <ManifestoPage />}
          {activeTab === 'resiliency-recon' && <ResiliencyRecon />}
          {activeTab === 'transformation-survey' && <TransformationSurvey />}
          {activeTab === 'faq' && <FAQPage />}
          {activeTab === 'legal' && <LegalPage />}
          
          {/* Admin Control Center Protection Checks */}
          {activeTab === 'admin' && (
            <div className="animate-scaleUp">
              {!isAdminPasswordUnlocked ? (
                <div className="bg-white p-8 rounded-2xl border border-zinc-200 text-center space-y-5 max-w-md mx-auto shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 text-rose-500 flex items-center justify-center mx-auto">
                    <Lock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-sans font-black text-sm uppercase tracking-tight text-slate-900">// SECURED SOVEREIGN ADMIN GATE</h3>
                    <p className="text-zinc-500 text-xs leading-relaxed">
                      Sovereign administrative clearance is required to view the central control room. Enter the sovereign clearance password to unlock details.
                    </p>
                  </div>
                  
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const val = (e.currentTarget.elements.namedItem('adminPassword') as HTMLInputElement).value;
                    if (val === 'Maan70939779') {
                      setIsAdminPasswordUnlocked(true);
                      setHasAdminOverride(true);
                    } else {
                      alert('Sovereign Clearance Rejected.');
                    }
                  }} className="space-y-4 max-w-xs mx-auto">
                    <input
                      type="password"
                      name="adminPassword"
                      placeholder="Enter administrative password..."
                      required
                      className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-205 text-slate-800 text-xs rounded-xl focus:outline-none focus:border-slate-800 font-mono text-center tracking-widest"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-900 text-slate-900 hover:text-[#9DFF00] font-mono text-[9px] uppercase font-black tracking-wider rounded-xl cursor-pointer transition-colors border border-zinc-200 hover:border-transparent"
                    >
                      Verify Sovereign Password &rarr;
                    </button>
                  </form>

                  <div className="pt-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setActiveTab('copilot-workspace');
                        setShowDashboard(true);
                      }}
                      className="text-xs text-zinc-400 hover:text-slate-800 transition-colors uppercase font-mono text-[9px] font-bold cursor-pointer"
                    >
                      &larr; Return to Secure Workspace
                    </button>
                  </div>
                </div>
              ) : (
                <AdminConsole />
              )}
            </div>
          )}
        </main>
      </div>

      {showAuthOverlay && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <AuthInterface 
            defaultMode={authDefaultMode} 
            onCancel={() => setShowAuthOverlay(false)} 
            onSuccess={() => {
              setShowAuthOverlay(false);
              setShowDashboard(true);
              setActiveTab('my-workspace');
            }}
          />
        </div>
      )}

      {/* Global GDPR cookies overlay and C-Suite Agentic FAQ chatbot */}
      <GDPRBanner />
      <ChatbotWidget />
    </div>
  );
}
