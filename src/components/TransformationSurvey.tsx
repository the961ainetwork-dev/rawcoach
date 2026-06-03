import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, serverTimestamp, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  HelpCircle, 
  Send, 
  CheckCircle, 
  TrendingUp, 
  Layers, 
  ShieldAlert, 
  FileText, 
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Check,
  Building2,
  Mail,
  User,
  Activity,
  Cpu,
  Database,
  Lock,
  Eye,
  Sliders,
  DollarSign
} from 'lucide-react';

const GOAL_OPTIONS = [
  'Workflow/Process Automation',
  'Legacy System Integration',
  'Custom AI Copilots & Coworkers',
  'Data Integration & Centralized RAG',
  'Complex Agentic Orchestration / Swarms',
  'Full Structural Transformation'
];

const STAGE_OPTIONS = [
  'Planning & Initial Discovery',
  'Proof of Concept (POC) / Active Prototyping',
  'Departmental Rollout (Limited Scope)',
  'Enterprise-Wide Adoption & Training',
  'Optimized Sovereign-Grade Autonomy'
];

const BOTTLENECK_OPTIONS = [
  'Staff Literacy & Cultural Resistance',
  'Vulnerability & Security (API leaks, credentials leakage)',
  'Lack of central RAG-ready business enclaves',
  'Inefficient spreadsheet/email manual fallbacks',
  'Budget, planning, or technical orchestration caps'
];

const INVESTMENT_OPTIONS = [
  'SME Scale (<$50k / year)',
  'Mid-Market Growth ($50k - $250k / year)',
  'Enterprise Scale ($250k - $1M / year)',
  'Sovereign Core Investment ($1M+ / year)'
];

const TECH_STACK_OPTIONS = [
  'Office 365 / MS Copilot Suite',
  'OpenAI / ChatGPT Teams Account',
  'Localized RAG & Vector Repositories',
  'Private API & Secure LLM Proxy',
  'Legacy ERP & Excel Spreadsheet Glue'
];

const MATURITY_LEVELS = [
  { level: 1, label: 'Traditional / Non-AI', desc: 'Mainly manual spreadsheet & email workflows with zero language model coordination.' },
  { level: 2, label: 'Experimental / Basic RAG', desc: 'Individual employee usage of public chat agents with no systemic business context.' },
  { level: 3, label: 'Connected / APIs Integrated', desc: 'Secure database connectors feeding standard vector-lookup search pipelines.' },
  { level: 4, label: 'Coordinated Agent Swarms', desc: 'Specialized autonomous workers coordinating via stateful loops and webhooks.' },
  { level: 5, label: 'Sovereign / Autonomous Core', desc: 'Fully-customized, self-updating telemetry nodes functioning as core team members.' }
];

const FUTURE_INTEGRATION_OPTIONS = [
  { value: 'Ad-Hoc Productivity Copilots', label: 'Ad-Hoc Productivity Copilots', desc: 'Assisted draft briefs, templates, and basic search summaries.' },
  { value: 'Human-in-the-Loop Orchestration', label: 'Human-in-the-Loop Orchestration', desc: 'AI agents compiling drafts and organizing briefs with executive human signoffs.' },
  { value: 'Sovereign Autonomous Swarms', label: 'Sovereign Autonomous Swarms', desc: 'Self-coordinating workers operating on secure loops with active audit telemetry.' }
];

const KPI_ALIGNMENT_OPTIONS = [
  { value: 'Operations Time Recovery', label: 'Operations Time Recovery', desc: 'Target 80%+ reduction in manual document lookup and administrative latency.' },
  { value: 'Licensing & Cost Consolidation', label: 'Licensing & Cost Consolidation', desc: 'Unify redundant platform licenses into single self-hosted agents.' },
  { value: 'Compliance & Perfect Integrity', label: 'Compliance & Perfect Integrity', desc: 'Ensure zero token leaks, local data retention, and absolute secure isolation.' },
  { value: 'Throughput & Volume Expansion', label: 'Throughput & Volume Expansion', desc: 'Multiply processing capacity (e.g., invoices/truck routing) without adding headcount.' }
];

const REAL_CASE_STUDIES = [
  {
    id: 'case-1',
    title: 'Middle East Medical Nexus: Re-Architecting Information Availability',
    excerpt: 'Redesigned patient triage data routing using custom Llama configurations, decreasing operational doctor lookup times from 14 minutes down to 180 seconds under a secure sovereign container setup.',
    context: 'Traditional patient files and triage history were highly fragmented, resulting in an average response drag of 14 minutes per operational medical lookup.',
    action: 'Implemented our System Matrix RAG pipeline to synthesize historic telemetry into localized, high-speed cached indexes served by autonomous workspace agents.',
    result: 'Reduced information latency of lookup files by 82% while keeping all clinical data fully locked inside private secure proxy environments.',
    metric: '180s Access Time',
    tag: 'Healthcare Realization',
    fullReport: {
      background: ' Levant emergency branches suffered from high-latency delays because historical triage logs were stored across separate local clinics, requiring slow manual coordination, telephone relays, and paper checks.',
      implementation: 'We mapped the secure clinical workflow into a specialized three-agent coordination state, utilizing Pinecone-backed semantic lookup caches to fetch triage insights inside secure private servers.',
      architecture: 'Developed an active gateway that sanitizes incoming search queries, validates credential tokens, hashes natural language inputs into medical vectors, and exposes anonymized operational trends on local dashboards.',
      results: 'Clinical lookup time plummeted from 14 minutes to an average of just 180 seconds. Clinical personnel reported substantial relief from operational administrative drag and certified zero security or access leaks.'
    },
    blueprint: {
      model: 'Customized Med-Llama-3 (70B) + Claude-3.5 Secure Gateway',
      orchestration: 'Stateful LangGraph Swarm with pinecone semantic lookup caches',
      nodes: [
        'Triage Synthesizer (Parses raw intake forms)',
        'Local Vector Agent (Matches historical telemetry logs)',
        'Clinical Compliance Filter (Validates privacy and audits access token logs)'
      ],
      flowDescription: 'Secure Client Workspace -> Zero-Trust Guardrail Gateway -> Stateful Swarm Analyzer -> Realtime Local Memory Cache.'
    }
  },
  {
    id: 'case-2',
    title: 'Sovereign Logistics Guild: Automating High-Frequency Scheduling',
    excerpt: 'Deployed an event-driven multi-agent routing swarm that processes inbound trucking invoices and optimizes routes automatically, driving a 4.2x increase in daily route dispatch volume.',
    context: 'Spreadsheet workflows, manual copy-pasting from clients, and raw dispatch emails represented a massive labor overhead for scheduling trucks.',
    action: 'Deployed a coordinated multi-agent dispatch swarm that parsed inbound requests via custom APIs, checked freight capacities, and sent secure webhook dispatch logs.',
    result: 'Bypassed human scheduling fatigue, processing up to 1,200 active routes daily with zero dispatcher intervention required.',
    metric: '4.2x Daily Output',
    tag: 'Agentic Logistics',
    fullReport: {
      background: 'Dispatchers spent hours compiling scheduling queries from infinite inbound client emails, copy-pasting weight constraints, and matching cargo manifests with available truck routes using fragile manual Excel spreadsheets.',
      implementation: 'Engineered an event-driven swarm that listens to client portals, processes inbound invoices, and triggers parallel optimizations across trailer capacities using high-speed Gemini integration.',
      architecture: 'Demuxer nodes read PDF invoices via structured APIs, route the freight dimensions to capacity optimization algorithms, auto-assign certified local drivers, and update WhatsApp dispatch nodes.',
      results: 'Boosted daily logistical scheduling capacity by 4.2x. Handed scheduling fatigue back to algorithmic models, cutting dispatch errors and lowering empty carrier mileage across all Levant networks.'
    },
    blueprint: {
      model: 'Dual Gemini-2.5-Flash + Localized DeepSeek-R1 Router',
      orchestration: 'Event-driven node network executing complex webhook routing logic',
      nodes: [
        'Email Dispatch Demuxer (Extracts key weight and destination variables)',
        'Vessel Capacity Optimizer (Dynamically matches open containers)',
        'Notification Webhook Generator (Pushes dispatch orders directly via WhatsApp API)'
      ],
      flowDescription: 'Raw Inbound Invoices & Emails -> Demuxer Parser -> Capacity Optimization Matrix -> Automated Manifest Issuance.'
    }
  },
  {
    id: 'case-3',
    title: 'Lebanese FinTech Syndicate: Securing Client Workspace Gaps',
    excerpt: 'Implemented a secure prompt-injection scanner and token proxy sandboxing protocol, certifying 100% of executive and development staff on sovereign standards.',
    context: 'Developers and administrative staff were vulnerability-prone, leaking API tokens into external browser fields and utilizing unprotected public terminals.',
    action: 'Instituted zero-trust API sandboxes and an in-house Academy Pipeline to certify personnel on administrative governance protocols.',
    result: 'Zero security breaches reported, with 100% of executive staff certified on sovereign credentials under audited benchmarks.',
    metric: '100% Compliance',
    tag: 'Finance & Security',
    fullReport: {
      background: 'Corporate development groups and spreadsheet clerks were inadvertently exposing secret client API keys and financial spreadsheet metadata inside unsecured public browser fields.',
      implementation: 'Constructed an active reverse-proxy shield running a customized instance of Llama Guard to prevent raw PII or backend database connection strings from leaving internal networks.',
      architecture: 'A local sandbox environment audits every network payload, acts as a credential firewall, and warns staff in real-time, backed by an audited corporate certification training framework.',
      results: 'Secured 100% staff compliance on modern digital security. Since launch, zero sensitive telemetry leaks or security incidents have occurred across their sovereign data nodes.'
    },
    blueprint: {
      model: 'Sovereign Hosted Private Enclave Llama Guard + Mistral Large',
      orchestration: 'Zero-knowledge secure token gateway and strict prompt-injection scanners',
      nodes: [
        'API Token Sentinel (Intercepts external outbound developer tokens)',
        'Vulnerability Auditor (Scans administrative spreadsheets for exposed records)',
        'Certification Validator (Interfaces with the Corporate Academy database)'
      ],
      flowDescription: 'Staff Input Console -> Sovereign Proxy Guardrails -> Core Private Model -> Secure Encrypted Transaction Log.'
    }
  }
];

export default function TransformationSurvey() {
  const { user, profile } = useAuth();
  
  // Tab control to switch between Questionnaire and Admin Submissions directory
  const [activeMode, setActiveMode] = useState<'form' | 'admin'>('form');

  // Form State
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [organizationName, setOrganizationName] = useState(profile?.companyName || '');
  const [goal, setGoal] = useState('');
  const [stage, setStage] = useState('');
  const [bottleneck, setBottleneck] = useState('');
  const [investment, setInvestment] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [maturityRating, setMaturityRating] = useState<number>(3);
  const [narrative, setNarrative] = useState('');
  const [futureIntegration, setFutureIntegration] = useState('');
  const [primaryKPI, setPrimaryKPI] = useState('');
  
  // Navigation State for Screen-by-Screen Questionnaire
  const [currentStep, setCurrentStep] = useState(1);
  
  // Status State
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Loaded Submissions (Admin Only)
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Selected Case Study Blueprint Modal
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'report' | 'blueprint'>('report');

  useEffect(() => {
    if (selectedCase) {
      setActiveModalTab('report');
    }
  }, [selectedCase]);

  const isUserAdmin = profile?.isAdmin || user?.email?.toLowerCase() === "maanbarazy@gmail.com";

  // Load Submissions if Admin
  const fetchSubmissions = async () => {
    if (!isUserAdmin) return;
    setLoadingSubmissions(true);
    try {
      const q = query(collection(db, 'transformationSurveys'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const loaded: any[] = [];
      querySnapshot.forEach((docSnap) => {
        loaded.push(docSnap.data());
      });
      setSubmissions(loaded);
    } catch (err) {
      console.error('Failed to load submitted records:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    if (isUserAdmin && activeMode === 'admin') {
      fetchSubmissions();
    }
  }, [isUserAdmin, activeMode]);

  const toggleTechOption = (option: string) => {
    if (techStack.includes(option)) {
      setTechStack(techStack.filter(item => item !== option));
    } else {
      setTechStack([...techStack, option]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !goal || !stage || !narrative) {
      setErrorMsg('Please complete all required fields (*).');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const surveyId = 'survey_' + Math.random().toString(36).substring(2, 11);
    const path = `transformationSurveys/${surveyId}`;

    // Formatting comprehensive variables into the structured narrative string 
    // to strictly preserve the Firestore rules schema validation!
    const compiledMaturity = MATURITY_LEVELS.find(m => m.level === maturityRating);
    const formattedNarrativeReport = `
=== SOVEREIGN DIAGNOSTIC PARAMETERS ===
- Estimated Annual AI Investment: ${investment || 'Not Specified'}
- Core Tech Stack Footprint: ${techStack.length > 0 ? techStack.join(', ') : 'None Specified'}
- Transformation Maturity Level: ${maturityRating}/5 (${compiledMaturity?.label || 'Unknown'}) - ${compiledMaturity?.desc || ''}
- Future AI Integration Goal: ${futureIntegration || 'Not Specified'}
- Transformation Target KPI: ${primaryKPI || 'Not Specified'}

=== WORKFLOW TRANSFORMATION NARRATIVE ===
${narrative}
`.trim();

    try {
      await setDoc(doc(db, 'transformationSurveys', surveyId), {
        id: surveyId,
        fullName: fullName || 'Anonymous Peer',
        email,
        organizationName: organizationName || 'Undisclosed Entity',
        goal,
        stage,
        bottleneck: bottleneck || 'None Specified',
        narrative: formattedNarrativeReport,
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
      // Refresh list if admin submits
      if (isUserAdmin) {
        fetchSubmissions();
      }
    } catch (err) {
      console.error('Failed to save survey:', err);
      try {
        handleFirestoreError(err, OperationType.CREATE, path);
      } catch (formattedErr: any) {
        setErrorMsg('Data compilation error. Please verify database connection or sign in credentials.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-12" id="transformation-survey-tab">
      
      {/* Top Hero Accent Header */}
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-zinc-200 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#9DFF00]/10 rounded-full filter blur-3xl opacity-25"></div>
        <div className="space-y-4 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-50 border border-lime-150 text-lime-700 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
            ★ APPLIED RESEARCH & TRANSFORMATION MATRIX ★
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 font-sans leading-none">
            Are you in the process of AI or X Transformation?
          </h2>
          <p className="text-zinc-650 text-base md:text-lg leading-relaxed max-w-3xl font-medium">
            We are compiling deep, structural data about the Lebanese and global enterprise AI landscape to design more resilient frameworks. Share your diagnostic parameters to help customize the <strong>System Matrix</strong> architecture.
          </p>

          {/* Admin Toggle Tabs */}
          {isUserAdmin && (
            <div className="pt-4 flex gap-2">
              <button
                onClick={() => setActiveMode('form')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                  activeMode === 'form'
                    ? 'bg-slate-900 border-slate-900 text-[#9DFF00]'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" /> Submit Survey
              </button>
              <button
                onClick={() => setActiveMode('admin')}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer border ${
                  activeMode === 'admin'
                    ? 'bg-slate-900 border-slate-900 text-[#9DFF00]'
                    : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> View Submitted Records ({submissions.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {activeMode === 'admin' && isUserAdmin ? (
        /* Admin Records Directory screen */
        <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-3xl shadow-xs space-y-6 animate-scaleUp">
          <div className="border-b border-zinc-200 pb-4 flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-xl uppercase text-slate-900 tracking-tight flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Stakeholder Diagnostic Intel Database
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase mt-1">
                // ACTIVE SYSTEM MATRIX TELEMETRY VAULT FOR MAAN BARAZY
              </p>
            </div>
            <button
              onClick={fetchSubmissions}
              disabled={loadingSubmissions}
              className="px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 rounded-lg text-xs font-mono uppercase font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Feed Synchronize
            </button>
          </div>

          {loadingSubmissions ? (
            <div className="py-20 text-center space-y-3 font-mono text-xs text-zinc-400">
              <div className="w-8 h-8 border-2 border-slate-905 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="tracking-widest">// SYNCHRONIZING WITH CLOUD TELEMETRY SERVER...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <Lock className="w-12 h-12 text-zinc-300 mx-auto" />
              <h4 className="font-bold text-slate-900 uppercase">No Remote Records Compiled</h4>
              <p className="text-zinc-500 text-xs max-w-md mx-auto leading-relaxed">
                We have verified the connection node but no responses are located on the Firestore cluster. Submit parameters using the form to populate active registry tables.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {submissions.map((sub, i) => (
                <div key={sub.id || i} className="p-5 md:p-6 bg-zinc-50 border border-zinc-200 rounded-2xl hover:border-indigo-500 transition-all space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 border border-indigo-100 rounded">
                        Record #{submissions.length - i}
                      </span>
                      <h4 className="font-black text-slate-900 text-base">{sub.fullName}</h4>
                      <p className="text-xs text-zinc-500 font-medium">
                        {sub.organizationName} &bull; <span className="underline font-mono text-[11px]">{sub.email}</span>
                      </p>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono font-medium">
                      {sub.createdAt?.seconds 
                        ? new Date(sub.createdAt.seconds * 1000).toLocaleString()
                        : 'Pre-existing Baseline Node'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-zinc-200">
                      <span className="text-[8.5px] font-mono text-zinc-400 block uppercase font-bold">PRIMARY TRANSFORMATION GOAL</span>
                      <span className="text-zinc-800 font-bold text-xs uppercase block mt-1">{sub.goal}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-zinc-200">
                      <span className="text-[8.5px] font-mono text-zinc-400 block uppercase font-bold">CURRENT ORGANIZATIONAL STAGE</span>
                      <span className="text-zinc-800 font-bold text-xs uppercase block mt-1">{sub.stage}</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-zinc-200">
                      <span className="text-[8.5px] font-mono text-zinc-400 block uppercase font-bold">CRITICAL DRAG FORCE BOTTLENECK</span>
                      <span className="text-rose-600 font-bold text-xs uppercase block mt-1">{sub.bottleneck}</span>
                    </div>
                  </div>

                  <div className="bg-[#1E293B] text-slate-300 p-4.5 rounded-xl border border-zinc-800 font-mono text-[11.5px] leading-relaxed whitespace-pre-wrap overflow-x-auto">
                    <span className="text-[#9DFF00] block uppercase font-extrabold text-[9px] mb-2 tracking-widest">// COMPILED TELEMETRY NARRATIVE REPORT:</span>
                    {sub.narrative}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* Standard Questionnaire + Case studies view */
        <div className="space-y-12">
          
          {/* Curated Case Studies Section: Horizontal Grid Layout */}
          <div className="space-y-6 animate-scaleUp">
            <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-zinc-850 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#9DFF00]/5 rounded-full filter blur-2xl opacity-40"></div>
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#9DFF00]/10 border border-[#9DFF00]/25 text-[#9DFF00] font-mono text-[9px] tracking-wider font-extrabold uppercase rounded">
                  ★ CERTIFIED INTELLIGENCE DIRECTORY
                </div>
                <h3 className="font-sans font-black text-2xl tracking-tight uppercase">// CURATED CASES</h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-medium max-w-3xl">
                  Explore real enterprise transformations from our historical directory. We design, implement, and orchestrate highly available state engines and secure custom agent swarms that drive measurable operational leverage.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {REAL_CASE_STUDIES.map((study) => (
                <div 
                  key={study.id}
                  className="bg-white border border-zinc-200 p-6 rounded-2xl hover:border-slate-900 transition-all flex flex-col justify-between group relative overflow-hidden shadow-xs hover:shadow-md"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-[#9DFF00]/10 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-4">
                        <span className="font-mono text-[8px] font-bold px-2 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-650 uppercase rounded tracking-wider">
                          {study.tag}
                        </span>
                        <span className="font-mono text-[10px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          {study.metric}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <strong className="text-slate-950 block font-sans font-black leading-tight uppercase text-[14px] group-hover:text-indigo-600 transition-colors">
                          {study.title}
                        </strong>
                        <p className="text-zinc-600 text-[11.5px] leading-relaxed font-medium">
                          {study.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Elegant Read More Trigger Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedCase(study)}
                      className="w-full mt-4 py-2.5 bg-zinc-50 hover:bg-slate-950 border border-zinc-200 hover:border-slate-950 text-slate-800 hover:text-[#9DFF00] font-mono text-[9px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 group-hover:bg-slate-900 group-hover:text-[#9DFF00] group-hover:border-slate-900"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read More</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Survey Input Section: Beautiful Centered Form Layout */}
          <div className="bg-white border border-zinc-200 p-6 md:p-10 rounded-3xl shadow-xs max-w-4xl mx-auto w-full">
            <div className="border-b border-zinc-200 pb-5 mb-6">
              <h3 className="font-extrabold text-xl uppercase text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-600 animate-pulse" />
                Sovereign Transformation Questionnaire
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono mt-1">// ANONYMOUS OR CREDENTIALED TRANSFORMATION METRIC TRANSMISSION</p>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form 
                  key="survey-form"
                  onSubmit={handleSubmit} 
                  className="space-y-6 text-[12px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Step Progress Stepper */}
                  <div className="mb-6 p-4 bg-zinc-50 border border-zinc-150 rounded-2xl" id="survey-stepper-container">
                    <div className="flex flex-wrap items-center justify-between font-mono text-[9px] font-black uppercase tracking-wider text-zinc-400 gap-2 mb-2.5">
                      <span className="bg-slate-900 text-[#9DFF00] px-2.5 py-0.5 rounded border border-slate-900">Step {currentStep} of 6</span>
                      <span className="text-slate-800">
                        {currentStep === 1 && "CONTACT & IDENTITY DETAILS"}
                        {currentStep === 2 && "TRANSFORMATION GOAL & STAGE"}
                        {currentStep === 3 && "TECH STACK & CAPABILITY MATURITY"}
                        {currentStep === 4 && "DESIRED FUTURE AI AUTONOMY"}
                        {currentStep === 5 && "PRIMARY KEY METRIC FOCUS"}
                        {currentStep === 6 && "BOTTLENECKS & JOURNEY NARRATIVE"}
                      </span>
                    </div>
                    <div className="h-1.5 bg-zinc-200 rounded-full overflow-hidden flex gap-0.5">
                      {[1, 2, 3, 4, 5, 6].map((st) => (
                        <div 
                          key={st}
                          className={`h-full flex-1 transition-all duration-300 ${
                            currentStep >= st ? 'bg-indigo-600' : 'bg-zinc-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 font-mono rounded-lg flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <motion.div
                        key="step-1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <h4 className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                          [1] CONTACT & IDENTITY PATHWAY
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="font-bold text-slate-800 uppercase tracking-wide block flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-zinc-400" /> Full Name
                            </label>
                            <input 
                              type="text"
                              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 text-slate-900 rounded-lg focus:outline-none focus:border-slate-900 transition-colors"
                              placeholder="e.g. Salim Khoury"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="font-bold text-slate-800 uppercase tracking-wide block flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-zinc-400" /> Email Address <span className="text-red-500">*</span>
                            </label>
                            <input 
                              type="email"
                              required
                              className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 text-slate-900 rounded-lg focus:outline-none focus:border-slate-900 transition-colors"
                              placeholder="e.g. salim@enterprise.lb"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="font-bold text-slate-800 uppercase tracking-wide block flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-zinc-400" /> Organization / Company Name
                          </label>
                          <input 
                            type="text"
                            className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 text-slate-900 rounded-lg focus:outline-none focus:border-slate-900 transition-colors"
                            placeholder="e.g. Levant Industrial Holdings relative"
                            value={organizationName}
                            onChange={(e) => setOrganizationName(e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 2 && (
                      <motion.div
                        key="step-2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <h4 className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                          [2] TARGET PARAMETER SELECTION
                        </h4>

                        {/* Question 1: Goal Select */}
                        <div className="space-y-2">
                          <span className="font-black text-slate-900 block font-sans text-sm">
                            What is the primary target/goal of your transformation? <span className="text-red-500">*</span>
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                            {GOAL_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setGoal(opt)}
                                className={`text-left p-3 border rounded-xl font-medium transition-all flex items-center justify-between gap-2 cursor-pointer ${
                                  goal === opt 
                                    ? 'bg-slate-950 border-slate-950 text-white shadow-md' 
                                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
                                }`}
                              >
                                <span className="text-[11px] leading-snug">{opt}</span>
                                {goal === opt && <Check className="w-3.5 h-3.5 text-[#9DFF00] shrink-0" />}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Question 2: Stage Choice */}
                        <div className="space-y-2 pt-2">
                          <span className="font-black text-slate-900 block font-sans text-sm">
                            In which stage is your organization currently operating? <span className="text-red-500">*</span>
                          </span>
                          <div className="space-y-1.5 mt-2">
                            {STAGE_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setStage(opt)}
                                className={`w-full text-left px-4 py-2.5 border rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer ${
                                  stage === opt 
                                    ? 'bg-slate-950 border-slate-950 text-white' 
                                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
                                }`}
                              >
                                <span className="text-[11.5px]">{opt}</span>
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                  stage === opt ? 'border-[#9DFF00] bg-[#9DFF00]/20' : 'border-zinc-300'
                                }`}>
                                  {stage === opt && <div className="w-1.5 h-1.5 bg-[#9DFF00] rounded-full" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 3 && (
                      <motion.div
                        key="step-3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <h4 className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                          [3] MATURITY & SYSTEM INFRASTRUCTURE
                        </h4>

                        {/* Investment budget */}
                        <div className="space-y-2">
                          <label className="font-bold text-slate-800 uppercase tracking-wide block text-[11px] flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5 text-zinc-400" /> Estimated Annual AI/Transformation Budget
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {INVESTMENT_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setInvestment(opt)}
                                className={`text-left p-3 border rounded-xl transition-all cursor-pointer text-xs ${
                                  investment === opt 
                                    ? 'bg-slate-950 border-slate-950 text-white shadow' 
                                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Current Stack footings representation */}
                        <div className="space-y-2 pt-2">
                          <label className="font-bold text-slate-800 uppercase tracking-wide block text-[11px] flex items-center gap-1">
                            <Cpu className="w-3.5 h-3.5 text-zinc-400" /> Core Technology Stack Footprint (Multi-Select)
                          </label>
                          <p className="text-[10px] text-zinc-400 mt-0.5 leading-tight">
                            Choose all tools currently deployed across team workflows.
                          </p>
                          <div className="grid grid-cols-1 gap-2 mt-2">
                            {TECH_STACK_OPTIONS.map((opt) => {
                              const isSelected = techStack.includes(opt);
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => toggleTechOption(opt)}
                                  className={`text-left px-4 py-2.5 border rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-indigo-50 border-indigo-300 text-indigo-950 font-semibold'
                                      : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                    isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-zinc-300'
                                  }`}>
                                    {isSelected && <Check className="w-3 h-3" />}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Maturity range */}
                        <div className="space-y-3 pt-2">
                          <label className="font-bold text-slate-800 uppercase tracking-wide block text-[11px] flex items-center gap-1">
                            ★ Transformation Maturity Assessment
                          </label>
                          
                          <div className="grid grid-cols-5 gap-1.5">
                            {[1, 2, 3, 4, 5].map((lvl) => (
                              <button
                                key={lvl}
                                type="button"
                                onClick={() => setMaturityRating(lvl)}
                                className={`py-2 rounded-lg font-mono text-center font-bold border transition-all cursor-pointer ${
                                  maturityRating === lvl
                                    ? 'bg-slate-950 border-slate-950 text-[#9DFF00]'
                                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-650'
                                }`}
                              >
                                Lvl {lvl}
                              </button>
                            ))}
                          </div>
                          
                          {/* Active level breakdown description display */}
                          <div className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-1">
                            <span className="font-bold text-slate-900 block font-sans text-xs uppercase text-[11px]">
                              {MATURITY_LEVELS[maturityRating - 1].label}
                            </span>
                            <p className="text-zinc-500 text-[10.5px] leading-relaxed">
                              {MATURITY_LEVELS[maturityRating - 1].desc}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 4 && (
                      <motion.div
                        key="step-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <h4 className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                          [4] FUTURE AI INTEGRATION ALIGNMENT
                        </h4>
                        
                        <div className="space-y-2">
                          <span className="font-black text-slate-900 block font-sans text-sm">
                            What is your desired level of user-agent integration in the next 12 months? <span className="text-red-500">*</span>
                          </span>
                          <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                            Define how deeply embedded autonomous delegates should be across company systems.
                          </p>
                          <div className="space-y-2.5 mt-3">
                            {FUTURE_INTEGRATION_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setFutureIntegration(opt.value);
                                  setErrorMsg(null);
                                }}
                                className={`w-full text-left p-4 border rounded-xl font-medium transition-all flex flex-col gap-1 cursor-pointer hover:border-slate-800 ${
                                  futureIntegration === opt.value
                                    ? 'bg-slate-950 border-slate-950 text-white shadow-md'
                                    : 'bg-zinc-50 border-zinc-200 text-zinc-805'
                                }`}
                              >
                                <div className="flex justify-between items-center w-full">
                                  <span className="font-sans font-extrabold text-[#9DFF00] uppercase text-[11px] tracking-wider">
                                    {opt.label}
                                  </span>
                                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                    futureIntegration === opt.value ? 'border-[#9DFF00] bg-[#9DFF00]/20' : 'border-zinc-300'
                                  }`}>
                                    {futureIntegration === opt.value && <div className="w-1.5 h-1.5 bg-[#9DFF00] rounded-full" />}
                                  </div>
                                </div>
                                <span className={`text-[10.5px] leading-relaxed block mt-1 ${
                                  futureIntegration === opt.value ? 'text-zinc-300' : 'text-zinc-500'
                                }`}>
                                  {opt.desc}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 5 && (
                      <motion.div
                        key="step-5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-4"
                      >
                        <h4 className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                          [5] EXPECTED KPI & TRANSFORMATION PRIORITY
                        </h4>
                        
                        <div className="space-y-2">
                          <span className="font-black text-slate-900 block font-sans text-sm">
                            What is the single highest-priority conversion metric or KPI for this transformation? <span className="text-red-500">*</span>
                          </span>
                          <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                            Select the primary tactical metric used to validate investment returns and operational efficiency.
                          </p>
                          <div className="space-y-2.5 mt-3">
                            {KPI_ALIGNMENT_OPTIONS.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                  setPrimaryKPI(opt.value);
                                  setErrorMsg(null);
                                }}
                                className={`w-full text-left p-4 border rounded-xl font-medium transition-all flex flex-col gap-1 cursor-pointer hover:border-slate-800 ${
                                  primaryKPI === opt.value
                                    ? 'bg-slate-950 border-slate-950 text-white shadow-md'
                                    : 'bg-zinc-50 border-zinc-200 text-zinc-805'
                                }`}
                              >
                                <div className="flex justify-between items-center w-full">
                                  <span className="font-sans font-extrabold text-[#9DFF00] uppercase text-[11px] tracking-wider">
                                    {opt.label}
                                  </span>
                                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                    primaryKPI === opt.value ? 'border-[#9DFF00] bg-[#9DFF00]/20' : 'border-zinc-300'
                                  }`}>
                                    {primaryKPI === opt.value && <div className="w-1.5 h-1.5 bg-[#9DFF00] rounded-full" />}
                                  </div>
                                </div>
                                <span className={`text-[10.5px] leading-relaxed block mt-1 ${
                                  primaryKPI === opt.value ? 'text-zinc-300' : 'text-zinc-500'
                                }`}>
                                  {opt.desc}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {currentStep === 6 && (
                      <motion.div
                        key="step-6"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                      >
                        <h4 className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                          [6] SYSTEM DRAG FORCE & COGNITIVE NARRATIVE
                        </h4>

                        {/* Question 3: Greatest Drag Force */}
                        <div className="space-y-2">
                          <span className="font-black text-slate-900 block font-sans text-sm">
                            What is the single greatest bottleneck or structural "Drag Force" you face?
                          </span>
                          <div className="space-y-1.5 mt-2">
                            {BOTTLENECK_OPTIONS.map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setBottleneck(opt)}
                                className={`w-full text-left px-4 py-2.5 border rounded-xl font-medium transition-all flex items-center justify-between cursor-pointer ${
                                  bottleneck === opt 
                                    ? 'bg-slate-950 border-slate-950 text-white' 
                                    : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
                                }`}
                              >
                                <span className="text-[11px] leading-snug">{opt}</span>
                                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${
                                  bottleneck === opt ? 'border-[#9DFF00] bg-[#9DFF00]/20' : 'border-zinc-300'
                                }`}>
                                  {bottleneck === opt && <div className="w-1.5 h-1.5 bg-[#9DFF00] rounded-full" />}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Detailed Narrative */}
                        <div className="space-y-2 pt-2">
                          <span className="font-black text-slate-900 block font-sans text-sm">
                            Describe your journey in detail. What have you learned? <span className="text-red-500">*</span>
                          </span>
                          <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">
                            Mention specific wins, workflow automation bottlenecks, and systems (SCRM, ERP, spreadsheets) you are looking to replace with agentic coworkers.
                          </p>
                          <textarea 
                            required
                            rows={5}
                            className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 text-slate-900 font-sans text-xs rounded-xl focus:outline-none focus:border-slate-900 transition-colors mt-2 resize-y"
                            placeholder="Include detailed steps taken, organizational hurdles, and lessons learned during the integration of autonomous architectures..."
                            value={narrative}
                            onChange={(e) => setNarrative(e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Stepper Navigation Buttons */}
                  <div className="flex justify-between items-center pt-4 border-t border-zinc-100 gap-3">
                    {currentStep > 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg(null);
                          setCurrentStep(prev => prev - 1);
                        }}
                        className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-slate-850 hover:text-slate-950 font-mono text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous Step</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentStep < 6 ? (
                      <button
                        type="button"
                        onClick={() => {
                          setErrorMsg(null);
                          if (currentStep === 1) {
                            if (!email.trim()) {
                              setErrorMsg("An email address is required to register this diagnostic footprint.");
                              return;
                            }
                            if (!email.match(/^\S+@\S+\.\S+$/)) {
                              setErrorMsg("Please provide a cryptographically valid email address.");
                              return;
                            }
                          } else if (currentStep === 2) {
                            if (!goal) {
                              setErrorMsg("A primary transformation goal must be specified.");
                              return;
                            }
                            if (!stage) {
                              setErrorMsg("An active organizational stage must be designated.");
                              return;
                            }
                          } else if (currentStep === 4) {
                            if (!futureIntegration) {
                              setErrorMsg("Select a target AI integration level for your operations.");
                              return;
                            }
                          } else if (currentStep === 5) {
                            if (!primaryKPI) {
                              setErrorMsg("Select your primary transformation priority metric/KPI.");
                              return;
                            }
                          }
                          setCurrentStep(prev => prev + 1);
                        }}
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-950 text-[#9DFF00] font-mono text-[9px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ml-auto"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2 bg-slate-900 hover:bg-slate-950 text-[#9DFF00] font-mono text-[9px] font-black uppercase tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs disabled:opacity-50 ml-auto"
                      >
                        {submitting ? (
                          <>
                            <motion.div 
                              animate={{ rotate: 360 }}
                              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                              className="w-4 h-4 border-2 border-t-transparent border-[#9DFF00] rounded-full"
                            />
                            <span>COMPILING INTEL...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>SUBMIT RESEARCH TRANSMISSION</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.form>
              ) : (
                <motion.div 
                  key="success-div"
                  className="text-center py-12 px-6 bg-lime-50/50 border border-lime-150 rounded-2xl space-y-4"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-extrabold text-xl uppercase text-slate-900 tracking-tight">Intelligence Encrypted & Submitted</h4>
                  <p className="text-zinc-650 text-base max-w-lg mx-auto leading-relaxed">
                    Thank you for contributing your real-world telemetry variables to the <strong>Applied AI Research Matrix</strong>. Your inputs are mapped into our diagnostic optimizer. Our team of systems engineers will leverage these nodes to design more robust proxy configurations.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setGoal('');
                      setStage('');
                      setBottleneck('');
                      setInvestment('');
                      setTechStack([]);
                      setMaturityRating(3);
                      setNarrative('');
                      setFutureIntegration('');
                      setPrimaryKPI('');
                      setCurrentStep(1);
                    }}
                    className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-mono text-[9.5px] font-bold uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    TRANSMIT ANOTHER RECORD
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      )}

      {/* CURATED CASES METADATA BLUEPRINT DIALOG/MODAL */}
      <AnimatePresence>
        {selectedCase && (
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={() => setSelectedCase(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-zinc-200 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] cursor-default"
            >
              {/* Terminal Blueprint Banner */}
              <div className="bg-slate-900 text-white p-6 relative flex justify-between items-center shrink-0">
                <div className="space-y-1">
                  <span className="font-mono text-[8px] font-extrabold tracking-widest text-[#9DFF00] block uppercase">
                    // CORE FEASIBILITY INTEL RECORD
                  </span>
                  <h3 className="text-lg md:text-xl font-black uppercase text-white font-sans tracking-tight">
                    {selectedCase.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setSelectedCase(null)}
                  className="w-8 h-8 rounded-full border border-zinc-800 hover:border-white text-zinc-400 hover:text-white flex items-center justify-center text-xs font-mono font-black transition-colors cursor-pointer shrink-0"
                >
                  X
                </button>
              </div>

              {/* Tab Selector Inside Modal */}
              <div className="bg-zinc-50 border-b border-zinc-200 px-6 py-2 flex gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveModalTab('report')}
                  className={`px-4 py-2 text-[10.5px] font-mono font-bold uppercase transition-all rounded-lg cursor-pointer ${
                    activeModalTab === 'report'
                      ? 'bg-slate-900 text-[#9DFF00]'
                      : 'text-zinc-550 hover:bg-zinc-150'
                  }`}
                >
                  Detailed Report
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('blueprint')}
                  className={`px-4 py-2 text-[10.5px] font-mono font-bold uppercase transition-all rounded-lg cursor-pointer ${
                    activeModalTab === 'blueprint'
                      ? 'bg-slate-900 text-[#9DFF00]'
                      : 'text-zinc-550 hover:bg-zinc-150'
                  }`}
                >
                  System Swarm Blueprint
                </button>
              </div>

              {/* Sub-content scrollframe */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                
                {/* Meta summary block */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-xl">
                    <span className="font-mono text-[8.5px] font-bold text-zinc-400 uppercase">TELEMETRY SCORE</span>
                    <span className="text-indigo-600 font-extrabold text-xs uppercase block mt-1">{selectedCase.metric}</span>
                  </div>
                  <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-xl">
                    <span className="font-mono text-[8.5px] font-bold text-zinc-400 uppercase">RECOVERY SECTOR</span>
                    <span className="text-[#10B981] font-extrabold text-xs uppercase block mt-1">{selectedCase.tag}</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {activeModalTab === 'report' ? (
                    <motion.div 
                      key="report-section"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <h4 className="text-[10.5px] font-mono text-indigo-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                          [1] OPERATIONAL BACKGROUND
                        </h4>
                        <p className="text-zinc-700 text-xs md:text-[13px] leading-relaxed font-sans font-medium">
                          {selectedCase.fullReport?.background}
                        </p>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-zinc-100">
                        <h4 className="text-[10.5px] font-mono text-indigo-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                          [2] SYSTEM ENGINEERING IMPLEMENTATION
                        </h4>
                        <p className="text-zinc-700 text-xs md:text-[13px] leading-relaxed font-sans font-medium">
                          {selectedCase.fullReport?.implementation}
                        </p>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-zinc-100">
                        <h4 className="text-[10.5px] font-mono text-indigo-600 uppercase tracking-widest font-black flex items-center gap-1.5">
                          [3] TOPOLOGY & INFRASTRUCTURE ARCHITECTURE
                        </h4>
                        <p className="text-zinc-700 text-xs md:text-[13px] leading-relaxed font-sans font-medium pb-2">
                          {selectedCase.fullReport?.architecture}
                        </p>
                        <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-[11px] text-zinc-650 leading-normal">
                          <span className="text-indigo-600 uppercase font-black text-[9px] block mb-1">// DEPLOYED FRAMEWORK MODELS</span>
                          {selectedCase.blueprint?.model}
                        </div>
                      </div>

                      <div className="space-y-2 pt-4 border-t border-zinc-100">
                        <h4 className="text-[10.5px] font-mono text-[#10B981] uppercase tracking-widest font-black flex items-center gap-1.5">
                          [4] REALIZED BUSINESS OUTCOMES & IMPACT
                        </h4>
                        <p className="text-zinc-700 text-xs md:text-[13px] leading-relaxed font-sans font-semibold text-slate-800 bg-lime-50/50 border border-lime-150 p-4 rounded-xl">
                          {selectedCase.fullReport?.results}
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="blueprint-section"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="space-y-6"
                    >
                      {/* Model and Orchestration Stack */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-black">
                          [A] INTEGRATED FOUNDRY MODELS & MIDDLEWARE
                        </h4>
                        <div className="p-4 bg-zinc-900 text-[#9DFF00] border border-zinc-850 rounded-xl space-y-2 font-mono text-xs">
                          <div>
                            <span className="text-zinc-400 block">// DEPLOYED FRAMEWORK MODELS:</span>
                            <strong className="text-white text-[12px]">{selectedCase.blueprint?.model}</strong>
                          </div>
                          <div>
                            <span className="text-zinc-400 block">// COMPILER ORCHESTRATION LAYER:</span>
                            <strong className="text-white text-[12px]">{selectedCase.blueprint?.orchestration}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Nodes directory */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-black">
                          [B] CUSTOM ACTIVE WORKING COWORKERS (SWARM DEPLOYMENT)
                        </h4>
                        <div className="space-y-2">
                          {selectedCase.blueprint?.nodes.map((node: string, index: number) => (
                            <div key={index} className="flex gap-3 items-start p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                              <div className="w-5 h-5 rounded-full bg-slate-900 text-[#9DFF00] font-mono text-[9px] font-extrabold flex items-center justify-center shrink-0">
                                0{index + 1}
                              </div>
                              <p className="text-zinc-700 font-medium text-xs font-sans leading-tight pt-0.5">{node}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Schematic Stream flowchart representation */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-mono text-indigo-600 uppercase tracking-widest font-black">
                          [C] SCHEMATIC TELEMETRY PROTOCOL (DATA FLOW PATHWAYS)
                        </h4>
                        <div className="bg-zinc-50 border border-dashed border-zinc-300 p-4 rounded-xl">
                          <div className="flex flex-col items-center space-y-3">
                            
                            {/* Tokenization parsing steps visually represented */}
                            {selectedCase.blueprint?.flowDescription.split(' -> ').map((step: string, sIndex: number, arr: string[]) => (
                              <React.Fragment key={sIndex}>
                                <div className="bg-white px-4 py-2 border border-zinc-200 text-slate-900 font-mono text-[10.5px] font-bold rounded-lg shadow-sm text-center">
                                  {step}
                                </div>
                                {sIndex < arr.length - 1 && (
                                  <div className="w-0.5 h-4 bg-zinc-300 relative">
                                    <div className="absolute -bottom-1 -left-1 text-[8px] text-zinc-400">&darr;</div>
                                  </div>
                                )}
                              </React.Fragment>
                            ))}

                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
              
              {/* Footer action */}
              <div className="bg-zinc-50 border-t border-zinc-150 px-6 py-4.5 flex justify-end shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedCase(null)}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-mono text-[9.5px] font-bold uppercase tracking-wider rounded-xl cursor-pointer"
                >
                  Close Schematic
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
