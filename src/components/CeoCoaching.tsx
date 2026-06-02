import React, { useState } from 'react';
import { 
  Terminal, 
  Shield, 
  Zap, 
  Sparkles, 
  Flame, 
  Cpu, 
  Globe, 
  Database, 
  TrendingUp, 
  Play, 
  Check, 
  ArrowRight, 
  AlertTriangle, 
  Smartphone,
  RefreshCw,
  X
} from 'lucide-react';

interface ServiceItem {
  id: string;
  category: string;
  vibe: string;
  title: string;
  description: string;
  deliverables: string[];
  impactMetric: string;
  overheadSaved: string;
  slangQuote: string;
}

export default function CeoCoaching() {
  const [selectedService, setSelectedService] = useState<string>('agentic-swarm');
  const [activeTab, setActiveTab] = useState<'turnkey' | 'drills' | 'telemetry'>('turnkey');
  
  // Hardened tech socket console states
  const [hostLog, setHostLog] = useState<string[]>(['[SYSTEM_READY]: SECURE ENVELOPE INITIALIZED']);
  const [socketRunning, setSocketRunning] = useState<boolean>(false);
  const [zrolodexInput, setZrolodexInput] = useState<string>('');
  const [zrolodexDb, setZrolodexDb] = useState<{name: string, role: string, verified: boolean}[]>([
    { name: 'Riad S. (Beirut Angel)', role: 'Lead Syndicator / LP', verified: true },
    { name: 'Karim G. (Forge Web3)', role: 'Core Dev Ops Lead', verified: true },
    { name: 'Nayla M. (MENA Retail)', role: 'Logistics / Supply Anchor', verified: false }
  ]);

  // Decision arena drills states
  const [drillScore, setDrillScore] = useState<number | null>(null);
  const [answeredDrillId, setAnsweredDrillId] = useState<number | null>(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [metricSovereignState, setMetricSovereignState] = useState({ alpha: 60, glitchSec: 25, liraDeflection: 40 });

  // Sovereign services config (incorporating user's turnkey menu)
  const services: ServiceItem[] = [
    {
      id: 'agentic-swarm',
      category: 'Agentic Swarm Ops',
      vibe: 'Full-Auto or Nothing',
      title: 'Autonomous Swarm Orchestration',
      description: 'We deploy customized RAG architectures, multi-agent automated task queues, and custom "vibe-coded" internal micro-tools. No more manual copy-pasting to legacy spreadsheets.',
      deliverables: [
        'Multi-Agent orchestration loops (Autonomous Lead Intake to Proposal Engine)',
        'Cognitive internal agent tools matching native Discord & Slack webhooks',
        'Custom local RAG retrieval vector index powered by Gemini'
      ],
      impactMetric: '40%+ Back-office Overhead Redirected',
      overheadSaved: '-75% Operations Lag',
      slangQuote: '"No more cap. Send the agents to fight the manual routine while your team cooks the strategy."'
    },
    {
      id: 'sovereign-scale',
      category: 'Sovereign-Scale Strategy',
      vibe: 'The Big Brain Move',
      title: 'Economic & Fiscal Tactical Prototyping',
      description: 'Macroeconomic risk modeling, debt restructuring simulations, and fiscal policy prototyping built strictly to bypass structural economic crashes.',
      deliverables: [
        'Real-time multi-currency peg and volatile market exposure modeling',
        'Debt-for-equity swap scenario frameworks for early angel syndicates',
        'Sovereign operations contingency playbooks'
      ],
      impactMetric: '99% Deflection of Sudden Market Shocks',
      overheadSaved: '-90% Advisory Consultation Wait',
      slangQuote: '"We’ve seen the systemic collapses live. We code the fiscal parameters so your runway is bulletproof."'
    },
    {
      id: 'turnkey-venture',
      category: 'Turnkey Venture Launch',
      vibe: 'From Zero to Moon',
      title: 'Accelerated MVPs & Market Proving',
      description: 'End-to-end rapid engineering architecture, comprehensive "Shoufimafi" regional market entry blueprints, and live product deployment in days, not quarters.',
      deliverables: [
        'End-to-end full-stack modern React-Tailwind custom boilerplates',
        'Automated local customer outreach funnel',
        'Direct deployment pathways using Cloud Run architecture hooks'
      ],
      impactMetric: 'Time-to-Market Slashed by 6 Weeks',
      overheadSaved: '-80% Initial Technical Spend',
      slangQuote: '"Walla, we build and deploy highly optimized stacks faster than standard legacy design agencies can schedule a briefing call."'
    },
    {
      id: 'founder-lab',
      category: 'Founder Performance Lab',
      vibe: 'Unbreakable Minds',
      title: 'High-Density Strategic Decision Arena',
      description: '1-on-1 "Terminal-Style" executive coaching, volatile crisis navigation, and high-density simulated operational decision-making drills.',
      deliverables: [
        'Aggressive AI stakeholder alignment simulation protocols',
        'Weekly tactical briefing dispatches on active market anomalies',
        'Direct async architectural advice pipeline to our seasoned advisors'
      ],
      impactMetric: '+150% Executive Execution Density',
      overheadSaved: '-50% Indecision Bottleneck Time',
      slangQuote: '"Stay ahead of the glitch. When standard channels panic, you boot up the tactical playbook and execute."'
    },
    {
      id: 'digital-infra',
      category: 'Digital Infrastructure',
      vibe: 'Hardened Tech',
      title: 'Sovereign Core Connectivity',
      description: 'Secure, high-availability data layers via ArabBankers.network sockets, real-time CRM/Zrolodex integration, and robust automated logistics tracking pipelines.',
      deliverables: [
        'Encrypted tunnel gateways resistant to network congestion',
        'Zrolodex localized client and partner state directories',
        'Automated supply-chain logistics routing and live signal telemetry'
      ],
      impactMetric: '100% Redundant Secure Channel Active',
      overheadSaved: '-95% Manual Contact Tracking',
      slangQuote: '"Keep your intelligence loops private. Secure data doesn\'t wait for institutional clearance."'
    }
  ];

  // Exercises config for drills
  const drillsList = [
    {
      id: 1,
      title: 'CRISIS: THE MULTI-CURRENCY SPREAD SPIKE',
      scenario: 'Your main digital logistics vendor in Marseille suddenly demands payments in fresh euros only, while your checkout collection in Beirut is lagging with unstable local payment processors. Your server runway is 12 days.',
      options: [
        { label: 'Wait for bank clearances & schedule high-fee third party integrations.', score: -20, feedback: 'Cap detected. Unnecessary bank lag wastes precious runway. Immediate risk of a freeze.' },
        { label: 'Set up an automated peer-to-peer crypto proxy cache and bridge stable liquidity via ArabBankers.network.', score: 40, feedback: 'Alpha Choice! You bypassed institutional blockage and maintained dynamic runway routing.' },
        { label: 'Suspend high-growth outreach and run a fire-sale of local inventory.', score: 10, feedback: 'Sub-optimal. You preserved runway but butchered future scaling margins. Soft leverage.' }
      ]
    },
    {
      id: 2,
      title: 'OPERATIONS: SECURING PRIVATE INTELLIGENCE',
      scenario: 'A competitor with major institutional backup is scraping your team\'s public onboarding briefs and using open models to clone your client list. Your lead pipeline is leaking.',
      options: [
        { label: 'Complain via formal institutional channels and send a cease-and-desist.', score: -10, feedback: 'Ineffective. Legal loops in volatile zones take years. The competitor will scale regardless.' },
        { label: 'Pull your client databases behind an encrypted local Zrolodex vault and route credentials exclusively via secure private tunnels.', score: 50, feedback: 'Hardened Move! You completely closed the scraping loop and established supreme system dominance.' },
        { label: 'Stop using internal AI models entirely and return to manual paper journals.', score: -30, feedback: 'Total retreat. You avoided scraping but zeroed out administrative speed. The glitch wins.' }
      ]
    }
  ];

  // Service interaction trigger
  const [provisioningDone, setProvisioningDone] = useState<string | null>(null);
  const handleProvisionEngine = (srvId: string) => {
    setProvisioningDone(srvId);
    setTimeout(() => {
      setProvisioningDone(null);
    }, 4000);
  };

  // Run socket testing simulation
  const triggerSocketTest = () => {
    if (socketRunning) return;
    setSocketRunning(true);
    setHostLog(prev => [...prev, `[INIT_CONNECT]: Handshaking via secure ArabBankers.network socket...`]);
    
    setTimeout(() => {
      setHostLog(prev => [...prev, `[RESOLVING_HOST]: ArabBankers.network cluster resolved via alternative subnets.`]);
    }, 1000);

    setTimeout(() => {
      setHostLog(prev => [...prev, `[SECURE_TUNNEL]: MTLS Handshake Complete. RSA-4096 layer verified.`]);
    }, 2000);

    setTimeout(() => {
      setHostLog(prev => [...prev, `[ZROLODEX_CACHE]: Linked dynamic address book to active routing loops.`]);
      setHostLog(prev => [...prev, `[STATUS]: SOVEREIGN SECURE CHANNEL ONLINE.`]);
      setSocketRunning(false);
    }, 3200);
  };

  const handleAddZrolodex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zrolodexInput.trim()) return;
    const newContact = {
      name: zrolodexInput,
      role: 'Sovereign Network Peer',
      verified: true
    };
    setZrolodexDb(prev => [...prev, newContact]);
    setHostLog(prev => [...prev, `[ZROLODEX_UPDATE]: New peer "${zrolodexInput}" routed and encrypted.`]);
    setZrolodexInput('');
  };

  const handleAnswerDrill = (optScore: number, feedback: string) => {
    setDrillScore(optScore);
    setFeedbackMsg(feedback);
    setAnsweredDrillId(currentScenarioIndex);
    
    // update real-time visual progress metrics
    setMetricSovereignState(prev => {
      const nextAlpha = Math.max(20, Math.min(100, prev.alpha + Math.floor(optScore * 0.4)));
      const nextGlitch = Math.max(5, Math.min(105, prev.glitchSec - Math.floor(optScore * 0.3)));
      const nextLira = Math.max(10, Math.min(100, prev.liraDeflection + Math.floor(optScore * 0.5)));
      return { alpha: nextAlpha, glitchSec: nextGlitch, liraDeflection: nextLira };
    });
  };

  const handleResetDrill = () => {
    setDrillScore(null);
    setAnsweredDrillId(null);
    setFeedbackMsg('');
  };

  const activeSrv = services.find(s => s.id === selectedService) || services[0];

  return (
    <div className="bg-[#FAF9F6] border border-zinc-200 rounded-2xl overflow-hidden shadow-xs p-6 md:p-8 space-y-8 animate-fadeIn" id="ceo-coaching-workspace">
      
      {/* Upper Terminal Title Branding Block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-rose-50 border border-rose-150 text-rose-700 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded mb-2">
            <Terminal className="w-3.5 h-3.5" /> Core Strategy Deck // Elite CEO Turnkey Hub
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
            FOUNDER/CEO COACHING & WAR CHEST
          </h2>
          <p className="text-xs text-slate-500 font-sans mt-1">
            We don’t just offer generic business advice; we partner, code, and deploy sovereign-grade agentic modules.
          </p>
        </div>

        {/* View Switches */}
        <div className="flex bg-slate-100 border border-zinc-200 p-1.5 rounded-xl self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab('turnkey')}
            className={`flex-1 md:flex-initial px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'turnkey' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            1. Service Turnkeys
          </button>
          <button
            onClick={() => setActiveTab('drills')}
            className={`flex-1 md:flex-initial px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'drills' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            2. Decision Arena
          </button>
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 md:flex-initial px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              activeTab === 'telemetry' 
                ? 'bg-slate-900 text-white shadow-xs' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            3. Local Infra Hardening
          </button>
        </div>
      </div>

      {/* VIEW A: SERVICES GRID & CO-FOUNDER ENGINE PROVISIONER */}
      {activeTab === 'turnkey' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2 max-w-2xl">
              <span className="font-mono text-[9px] text-[#9DFF00] font-bold uppercase tracking-widest">• ACTIVE OPERATIONAL ETHOS</span>
              <h3 className="text-xl md:text-2xl font-black uppercase text-white tracking-tight font-sans">
                Stop Guessing. Start Architecting.
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans font-medium">
                Siloed teams manually editing text configs represent a giant operational waste. We build, code, and deploy the agentic swarms that will power your startup. We do not just analyze—we write real infrastructure.
              </p>
            </div>
            <div className="bg-zinc-850 p-3 border border-zinc-820 rounded-xl flex-shrink-0 text-center select-none font-mono">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">SOVEREIGN TECH</span>
              <span className="text-md text-[#9DFF00] font-black">100% NO CAP</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left selector menu */}
            <div className="lg:col-span-5 space-y-2">
              <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-extrabold pb-1">AVAILABLE ENGINE BLUEPRINTS</p>
              
              {services.map((srv) => {
                const isSelected = selectedService === srv.id;
                return (
                  <button
                    key={srv.id}
                    onClick={() => {
                      setSelectedService(srv.id);
                      setProvisioningDone(null);
                    }}
                    className={`w-full text-left p-4.5 border transition-all rounded-xl cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 text-white border-transparent shadow-md ring-1 ring-[#9DFF00]'
                        : 'bg-white text-slate-900 border-zinc-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1">
                      <span className="font-mono text-[8px] uppercase tracking-wider font-extrabold text-zinc-400 bg-zinc-100 p-1 rounded group-hover:bg-zinc-200 px-2 text-zinc-700">
                        {srv.vibe}
                      </span>
                      <span className={`text-[8.5px] font-mono leading-none ${isSelected ? 'text-[#9DFF00]' : 'text-slate-400'}`}>
                        {srv.overheadSaved}
                      </span>
                    </div>
                    <h4 className="font-black text-xs uppercase tracking-tight mt-1">{srv.category}</h4>
                    <p className={`text-[10px] leading-relaxed mt-2.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {srv.title}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Detailed Panel and Live Simulator */}
            <div className="lg:col-span-7 bg-white border border-zinc-200 p-6 md:p-8 rounded-2xl relative flex flex-col justify-between space-y-6">
              <div className="absolute top-3 right-4 font-mono text-[8.5px] text-slate-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded uppercase font-bold">
                PROVISIONING STATE: APPROVED
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-mono text-[9px] text-rose-500 uppercase font-black tracking-widest mb-1">THE VALUE-PROP BLUEPRINT</h4>
                  <h3 className="text-2xl font-black text-slate-900 uppercase font-sans tracking-tight leading-none">
                    {activeSrv.category}
                  </h3>
                  <p className="text-xs font-mono text-zinc-400 uppercase mt-1 tracking-wider">
                    {activeSrv.vibe}
                  </p>
                </div>

                <div className="p-4 bg-[#F8FAFC] border border-zinc-200/80 rounded-xl">
                  <p className="text-zinc-700 leading-relaxed text-xs font-medium font-sans">
                    {activeSrv.description}
                  </p>
                </div>

                <div className="space-y-3.5">
                  <p className="font-mono text-[9.5px] text-zinc-950 uppercase font-extrabold tracking-widest border-b border-zinc-200 pb-1">DELIVERABLES DEPLOYED</p>
                  <ul className="space-y-2">
                    {activeSrv.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 my-1.5 text-xs text-zinc-600">
                        <span className="text-[#FF4F2E] font-bold text-sm leading-none mt-0.5 select-none">▪</span>
                        <p className="flex-1 font-medium text-slate-800">{item}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Simulated Meme Accent Quote */}
                <div className="bg-slate-950 text-teal-400 p-4 rounded-xl border border-slate-900 font-mono text-[10.5px]">
                  <p className="italic">{activeSrv.slangQuote}</p>
                  <span className="text-[8.5px] text-zinc-500 block text-right mt-2 uppercase font-extrabold tracking-widest">★ LIVE FOUNDER SHIELD SIGNAL</span>
                </div>
              </div>

              {/* Grid Interactive Execution Panel */}
              <div className="pt-6 border-t border-zinc-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6">
                <div>
                  <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block">RECOVERY VALUE RATING</span>
                  <span className="text-xs font-bold text-slate-900 uppercase mt-1 block">{activeSrv.impactMetric}</span>
                </div>

                {provisioningDone === activeSrv.id ? (
                  <div className="px-5 py-3 bg-emerald-50 text-emerald-800 border border-emerald-250 font-mono text-[9px] font-black uppercase rounded-xl flex items-center justify-center gap-1.5 shadow-inner">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                    SOVEREIGN ENGINE PROVISIONED ✓
                  </div>
                ) : (
                  <button
                    onClick={() => handleProvisionEngine(activeSrv.id)}
                    className="px-5 py-3.5 bg-slate-900 hover:bg-slate-800 hover:scale-[1.01] text-white font-mono text-[10px] font-black uppercase tracking-wider transition-all rounded-lg cursor-pointer shadow-md inline-flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 text-[#9DFF00]" />
                    PROVISION SOVEREIGN ENGINE
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW B: HIGH-DENSITY DECISION ARENA DRILLS */}
      {activeTab === 'drills' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Real-time drill results status bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 text-white p-5 rounded-2xl border border-zinc-850 font-mono">
            <div>
              <span className="text-[8px] text-zinc-400 uppercase tracking-widest block">FOUNDER RUNWAY ALPHA</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${metricSovereignState.alpha}%` }}></div>
                </div>
                <span className="text-xs font-bold">{metricSovereignState.alpha}%</span>
              </div>
            </div>
            <div>
              <span className="text-[8px] text-zinc-400 uppercase tracking-widest block">GLITCH RECURRENCE SEC</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-red-400 transition-all duration-300" style={{ width: `${metricSovereignState.glitchSec}%` }}></div>
                </div>
                <span className="text-xs font-bold">{metricSovereignState.glitchSec}%</span>
              </div>
            </div>
            <div>
              <span className="text-[8px] text-zinc-400 uppercase tracking-widest block font-extrabold text-[#9DFF00]">LIRA PEGGING DEFLECTION</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="h-2 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 transition-all duration-300" style={{ width: `${metricSovereignState.liraDeflection}%` }}></div>
                </div>
                <span className="text-xs font-bold">{metricSovereignState.liraDeflection}%</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-2xl">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-4 mb-6">
              <div>
                <span className="font-mono text-[9px] text-zinc-400 uppercase font-extrabold tracking-widest block">TACTICAL EXERCISE DECK</span>
                <h4 className="text-sm font-bold text-slate-900 uppercase mt-0.5">HIGH-DENSITY DECISION DRILL PROGRESS // {currentScenarioIndex + 1} OF {drillsList.length}</h4>
              </div>
              <div className="flex gap-1">
                {drillsList.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentScenarioIndex(idx);
                      handleResetDrill();
                    }}
                    className={`w-6 h-6 rounded font-mono text-[9px] font-extrabold select-none cursor-pointer flex items-center justify-center transition-all ${
                      currentScenarioIndex === idx 
                        ? 'bg-slate-900 text-white font-extrabold' 
                        : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-5.5 bg-rose-50/50 border border-rose-150 rounded-2xl">
                <div className="flex items-center gap-2 text-rose-700 font-mono text-[9.5px] uppercase font-extrabold tracking-widest mb-2">
                  <AlertTriangle className="w-4 h-4 animate-bounce" /> SYSTEM CRITICAL LOG
                </div>
                <h3 className="text-lg font-black text-slate-900 uppercase font-sans tracking-tight mb-2.5">
                  {drillsList[currentScenarioIndex].title}
                </h3>
                <p className="text-xs font-sans text-slate-800 leading-relaxed font-semibold">
                  {drillsList[currentScenarioIndex].scenario}
                </p>
              </div>

              <div className="space-y-3">
                <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest font-extrabold pb-0.5">SELECT DRILL ACTION DIRECTIVE</p>
                {drillsList[currentScenarioIndex].options.map((opt, oIdx) => {
                  const isChosen = answeredDrillId === currentScenarioIndex && drillScore === opt.score;
                  return (
                    <button
                      key={oIdx}
                      disabled={answeredDrillId === currentScenarioIndex}
                      onClick={() => handleAnswerDrill(opt.score, opt.feedback)}
                      className={`w-full text-left p-4.5 border rounded-xl text-xs font-sans transition-all flex items-center justify-between gap-4 cursor-pointer ${
                        answeredDrillId === currentScenarioIndex
                          ? isChosen 
                            ? opt.score > 20 ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'
                            : 'bg-white opacity-40 border-zinc-200'
                          : 'bg-white border-zinc-200 hover:border-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-medium">{opt.label}</span>
                      <ChevronRightArrow show={answeredDrillId !== currentScenarioIndex} />
                    </button>
                  );
                })}
              </div>

              {answeredDrillId === currentScenarioIndex && (
                <div className="p-5 bg-slate-950 text-white rounded-2xl border border-slate-900 mt-4 animate-scaleUp">
                  <div className="flex justify-between items-center mb-2 font-mono">
                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400 block">// ALGORITHM METRICS GENERATOR</span>
                    <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded ${drillScore! > 20 ? 'bg-emerald-900 text-emerald-400 border border-emerald-800' : 'bg-red-900/45 text-red-400 border border-red-800'}`}>
                      IMPACT SCORE: {drillScore > 0 ? `+${drillScore}` : drillScore}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-350 leading-relaxed font-mono italic">
                    {feedbackMsg}
                  </p>
                  <div className="pt-4 mt-4 border-t border-zinc-800 flex justify-end">
                    <button
                      onClick={() => {
                        if (currentScenarioIndex < drillsList.length - 1) {
                          setCurrentScenarioIndex(currentScenarioIndex + 1);
                          handleResetDrill();
                        } else {
                          // reset to start
                          setCurrentScenarioIndex(0);
                          handleResetDrill();
                        }
                      }}
                      className="px-4 py-2 bg-white text-slate-950 font-mono text-[9px] uppercase font-bold hover:bg-zinc-100 transition-colors cursor-pointer rounded-lg"
                    >
                      {currentScenarioIndex < drillsList.length - 1 ? 'NEXT DRILL SCENARIO' : 'RESTART EXERCISES'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW C: SOVEREIGN DIGITAL CORECATION & HARDENING CONSOLE */}
      {activeTab === 'telemetry' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
          {/* Left Console Log */}
          <div className="lg:col-span-7 bg-slate-950 text-emerald-400 p-6 rounded-2xl font-mono text-xs border border-zinc-900 shadow-xl space-y-4 flex flex-col justify-between min-h-[420px]">
            <div className="space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800/80 mb-3 text-[10px] text-zinc-500 font-extrabold">
                <span>⚡ CORE_SOCKET_LOGGER ID: LBN_COACH_99</span>
                <span className="text-[#9DFF00] tracking-widest animate-pulse">● SIGNAL LISTENING</span>
              </div>
              
              <div className="space-y-2 max-h-[280px] overflow-y-auto font-mono scrollbar-none text-[11px] leading-relaxed">
                {hostLog.map((log, idx) => (
                  <div key={idx} className="hover:bg-zinc-900/40 p-1 rounded">
                    <span className="text-zinc-650 font-semibold uppercase mr-2.5">[{new Date().toTimeString().split(' ')[0]}]</span>
                    <span className={log.includes('[SYSTEM_READY]') ? 'text-zinc-400' : log.includes('✓') || log.includes('SECURE') ? 'text-[#9DFF00] font-bold' : 'text-emerald-400'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex justify-between items-center">
              <span className="text-[9px] text-zinc-500 uppercase font-black">STABILITY RATE: 100% SECURE</span>
              <button
                onClick={triggerSocketTest}
                disabled={socketRunning}
                className={`px-4 py-2.5 font-mono text-[9px] uppercase font-black rounded-lg transition-all cursor-pointer ${
                  socketRunning 
                    ? 'bg-zinc-900 text-zinc-500 shadow-inner' 
                    : 'bg-[#9DFF00] text-slate-950 hover:bg-[#86d900]'
                }`}
              >
                {socketRunning ? 'RUNNING PROBE...' : 'TEST ArabBankers.network SOCKET'}
              </button>
            </div>
          </div>

          {/* Right Zrolodex Directory Forms */}
          <div className="lg:col-span-5 bg-white border border-zinc-200 p-6 md:p-8 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="font-mono text-[9px] text-[#FF4F2E] font-extrabold uppercase tracking-widest block">• PRIVATE CONTACT ROSTER</span>
                <h4 className="text-md font-black text-slate-950 uppercase mt-0.5">THE LOCAL ZROLODEX</h4>
                <p className="text-[10.5px] text-zinc-500 font-sans mt-1">
                  Keep critical MENA syndicators, core developers, and supply-chain personnel mapped in your sovereign workspace. Fully client-side encrypted directory.
                </p>
              </div>

              <form onSubmit={handleAddZrolodex} className="flex gap-2">
                <input
                  type="text"
                  value={zrolodexInput}
                  onChange={(e) => setZrolodexInput(e.target.value)}
                  placeholder="e.g. Salim K. (Sovereign Angel)..."
                  className="flex-1 px-3.5 py-2 border border-zinc-200 text-slate-900 font-mono text-[10px] rounded-lg focus:outline-none focus:border-slate-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[9px] uppercase font-bold cursor-pointer rounded-lg shrink-0"
                >
                  ROUTE PEER
                </button>
              </form>

              <div className="space-y-2 max-h-[180px] overflow-y-auto">
                {zrolodexDb.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-slate-50 border border-zinc-200 p-2.5 rounded-xl uppercase text-[10px] font-mono hover:bg-slate-100 transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-slate-900 font-extrabold leading-none">{item.name}</p>
                      <p className="text-zinc-400 text-[8.5px] font-semibold leading-none">{item.role}</p>
                    </div>
                    {item.verified ? (
                      <span className="text-[8px] bg-emerald-50 text-emerald-800 border border-emerald-150 rounded px-1.5 font-bold uppercase">VERIFIED</span>
                    ) : (
                      <span className="text-[8px] bg-amber-50 text-amber-800 border border-amber-150 rounded px-1.5 font-bold uppercase">UNVERIFIED HOST</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 text-[10px] font-mono text-zinc-400">
              <p className="leading-relaxed">
                ● This Zrolodex works in real-time. Routing contacts logs telemetry signals straight into the secure listener on the left.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action-Oriented Footer block */}
      <div className="pt-6 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono">
        <span className="text-zinc-500 uppercase tracking-widest text-[9.5px]">Stop scrolling. Start building. Direct access channels open.</span>
        <a 
          href="https://ArabBankers.network" 
          target="_blank" 
          rel="noreferrer" 
          className="text-slate-900 hover:underline font-extrabold uppercase flex items-center gap-1.5"
        >
          Direct Access [ArabBankers.network] &rarr;
        </a>
      </div>
    </div>
  );
}

// Minimal icons/decorations helper
function ChevronRightArrow({ show }: { show: boolean }) {
  if (!show) return <span className="text-[10px] bg-emerald-900 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold uppercase animate-pulse">DIRECTIVE SENT</span>;
  return <ArrowRight className="w-4 h-4 text-zinc-400" />;
}
