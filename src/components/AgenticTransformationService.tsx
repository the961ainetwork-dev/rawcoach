import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Workflow, 
  Terminal, 
  Play, 
  Activity, 
  Layers, 
  FileText, 
  AlertTriangle, 
  Search, 
  CheckCircle2, 
  User, 
  Cpu, 
  RotateCcw,
  Zap
} from 'lucide-react';

interface AgentMessage {
  sender: string;
  role: 'Chief of Staff' | 'COO' | 'Market Analyst' | 'Talent Partner' | 'System';
  avatar: string;
  color: string;
  text: string;
  delayMs: number;
}

export default function AgenticTransformationService() {
  const [selectedChallenge, setSelectedChallenge] = useState<string>('manual_dispatch');
  const [strategyInput, setStrategyInput] = useState<string>('Accelerate expansion into EMEA while automating sales dispatch overheads by 45%');
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'completed'>('idle');
  const [simulationSteps, setSimulationSteps] = useState<AgentMessage[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [hypotheticalShift, setHypotheticalShift] = useState<string>('Eurozone inflation raises hardware procurement cost by 15%');
  const [riskAssessmentResult, setRiskAssessmentResult] = useState<string | null>(null);
  const [assessingRisk, setAssessingRisk] = useState<boolean>(false);

  const simulateSwarm = () => {
    if (!strategyInput.trim()) return;
    setSimulationState('running');
    setSimulationSteps([]);
    setCurrentStepIndex(-1);

    const steps: AgentMessage[] = [
      {
        sender: 'SYSTEM ENVOY',
        role: 'System',
        avatar: '⚙️',
        color: 'text-zinc-400 bg-zinc-900 border-zinc-700',
        text: `Initializing Swarm Session using strategy: "${strategyInput}"`,
        delayMs: 600
      },
      {
        sender: 'THE CHIEF OF STAFF',
        role: 'Chief of Staff',
        avatar: '♟️',
        color: 'text-rose-500 bg-rose-50 border-rose-100',
        text: `Strategic Intent parsed. I am breaking down the core pillar: "${strategyInput}".\n\n- Primary Objective: EMEA Market Penetration Asset Alignment\n- Efficiency Threshold: 45% Dispatch Automation\n\nSpawning operational tasks for the COO and Market Analyst...`,
        delayMs: 1400
      },
      {
        sender: 'THE COO AGENT',
        role: 'COO',
        avatar: '⚙️',
        color: 'text-indigo-500 bg-indigo-50 border-indigo-100',
        text: `Acknowledged, Chief of Staff. Parsing active pipeline workflows for EMEA.\n\n- Current state: Over 35 hours weekly wasted in regional email formatting and manual dispatching.\n- Proposed Auto-Gate: Build centralized Express middleware routing automated briefs via SMS/WhatsApp relay.\n- Resulting Overhead Recovery Estimate: 45.8% (Target acquired 🎯).`,
        delayMs: 1600
      },
      {
        sender: 'THE MARKET ANALYST',
        role: 'Market Analyst',
        avatar: '📊',
        color: 'text-amber-500 bg-[#FFFBEB] border-amber-200',
        text: `EMEA macro sentinel feed analyzed. Regional trends indicate peak demand for low-latency agentic integration.\n\n- Regional Benchmark: Competitors operating on 6-hour delayed batch briefs.\n- theCsuiteCOACH Competitive Edge: Instantaneous (under 120s) dispatch reports.\n- Risk Factor: EUR/USD volatility may impact procurement unless automated hedge routers are established.`,
        delayMs: 1800
      },
      {
        sender: 'THE TALENT PARTNER',
        role: 'Talent Partner',
        avatar: '👥',
        color: 'text-[#A855F7] bg-fuchsia-50 border-fuchsia-100',
        text: `Corporate Academy readiness check completed for regional sales teams.\n\n- Current Competency Level: Level 1 (Aware) across 60% of personnel.\n- Target Competency Track: Enroll regional staff into Module 4 (Agentic Orchestration).\n- Mitigation: Pre-assigned learning paths will minimize structural friction by Day 5.`,
        delayMs: 1500
      },
      {
        sender: 'THE CHIEF OF STAFF',
        role: 'Chief of Staff',
        avatar: '♟️',
        color: 'text-rose-500 bg-rose-50 border-rose-100',
        text: `Swarm consensus reached. Preparing final Executive Summary briefing & dispatch blueprint.\n\n✅ Automation Target: Secured.\n✅ Talent Training Path: Active.\n✅ Scenario Resiliency Score: 88.5%.\n\n[Swarm Consensus Ready] Ready for simulation interface inputs.`,
        delayMs: 1200
      }
    ];

    let currentIdx = 0;
    const runNextStep = () => {
      if (currentIdx < steps.length) {
        setSimulationSteps(prev => [...prev, steps[currentIdx]]);
        setCurrentStepIndex(currentIdx);
        currentIdx++;
        setTimeout(runNextStep, steps[currentIdx - 1]?.delayMs || 1000);
      } else {
        setSimulationState('completed');
      }
    };

    runNextStep();
  };

  const handleCalculateRisk = () => {
    setAssessingRisk(true);
    setTimeout(() => {
      setRiskAssessmentResult(
        `### ♟️ THE CHIEF OF STAFF DEEP RISK BRIEF // Shift: "${hypotheticalShift}"\n\n` +
        `**1. FINANCIAL IMPART (CEO WAR ROOM IMPACT)**: \n` +
        `- Current projection drops net margin by 3.4% unless operational overheads are further automated.\n` +
        `- Recommendation: Shift 5% more budget into the **"COO Agent" automated process routers**.\n\n` +
        `**2. THE MARKET ANALYST MATRIX RECOMMENDATION**: \n` +
        `- EUR/USD fluctuations favor local server instances in Frankfurt. Standardizing on European CDN minimizes latency risk.\n\n` +
        `**3. HUMAN CAPITAL RECOVERY RESPONSE**: \n` +
        `- Re-route Level 4 (Champion) staff to lead immediate hardware inventory audits.\n\n` +
        `**VERDICT:** COMPATIBLE AND ADAPTABLE // Deploying defensive hedge algorithms now.`
      );
      setAssessingRisk(false);
    }, 1500);
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      {/* Premium Hero Title */}
      <div className="space-y-4 text-center lg:text-left border-b border-zinc-200/50 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-[#9DFF00] rounded-full text-[10px] font-mono tracking-widest uppercase font-black">
          <Workflow className="w-3.5 h-3.5" /> ENTERPRISE AGENTIC TRANSFORMATION
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-sans uppercase">
          Enterprise Agentic Transformation
        </h2>
        <p className="text-zinc-500 font-mono text-[11.5px] max-w-3xl leading-relaxed uppercase">
          "We don't just coach leaders; we architect their digital extensions."
        </p>
      </div>

      {/* Core Value Prop */}
      <div className="bg-slate-950 text-white p-8 md:p-14 rounded-3xl border border-zinc-850 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full filter blur-3xl opacity-30 -z-10"></div>
        <div className="max-w-3xl space-y-6">
          <span className="font-mono text-[9px] text-[#9DFF00] font-bold uppercase tracking-widest block">// CORE VALUE PROPOSITION</span>
          <h3 className="text-2xl md:text-3.5xl font-serif tracking-tight leading-none">
            Deploys Specialist C-Suite AI Agents to Bridge High-Level Intent and Real-Time Execution
          </h3>
          <p className="text-white font-mono text-xs leading-relaxed">
            Our platform deploys custom C-Suite AI Agents—autonomous, specialized systems that bridge the gap between high-level strategic intent and real-time operational execution. By utilizing deep Contextual Grounding (RAG), authorization gates, and instant text sandbox notifications, we craft resilient corporate enclaves.
          </p>
        </div>
      </div>

      {/* Functional Categories Table */}
      <div className="bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl shadow-xs space-y-6">
        <div>
          <span className="font-mono text-[10px] text-[#FF4F2E] font-extrabold uppercase tracking-widest block">// SYSTEM TAXONOMY</span>
          <h4 className="text-xl font-extrabold tracking-tight text-slate-900 mt-1 uppercase">Functional Categories for Enterprise Development</h4>
          <p className="text-xs text-zinc-500 font-mono mt-1">Four custom-tailored nodes structured to operate asynchronously in absolute harmony.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/75 select-none text-[10px] uppercase font-mono tracking-wider text-zinc-500">
                <th className="py-3.5 px-4 font-bold">Function</th>
                <th className="py-3.5 px-4 font-bold">Focus Area</th>
                <th className="py-3.5 px-4 font-bold">Primary Agent Type</th>
              </tr>
            </thead>
            <tbody className="font-mono text-[11px] divide-y divide-zinc-100">
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4.5 px-4 font-bold text-slate-900">Strategic Governance</td>
                <td className="py-4.5 px-4 text-zinc-650">Decision support, risk modeling, policy compliance</td>
                <td className="py-4.5 px-4 text-[#FF4F2E] font-black">"The Chief of Staff" (Strategic Intelligence)</td>
              </tr>
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4.5 px-4 font-bold text-slate-900">Operational Efficiency</td>
                <td className="py-4.5 px-4 text-zinc-650">Workflow automation, cross-departmental sync</td>
                <td className="py-4.5 px-4 text-indigo-600 font-black">"The COO" (Process & Systems Agent)</td>
              </tr>
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4.5 px-4 font-bold text-slate-900">Market Intelligence</td>
                <td className="py-4.5 px-4 text-zinc-650">Trend analysis, competitive monitoring, forecasting</td>
                <td className="py-4.5 px-4 text-amber-600 font-black">"The Market Analyst" (Predictive Insight Agent)</td>
              </tr>
              <tr className="hover:bg-zinc-50/50 transition-colors">
                <td className="py-4.5 px-4 font-bold text-slate-900">Human Capital</td>
                <td className="py-4.5 px-4 text-zinc-650">Talent alignment, culture monitoring, 1:1 support</td>
                <td className="py-4.5 px-4 text-purple-600 font-black">"The Talent Partner" (People & Performance Agent)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Featured Services & Workflows */}
      <div className="space-y-8">
        <div>
          <span className="font-mono text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">// WORKFLOW TRACING</span>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1 uppercase">Featured Services & Workflows</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Workflows 1 */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center font-bold text-rose-500">
              01
            </div>
            <h4 className="font-sans font-black text-sm uppercase text-slate-900">1. The Strategic "Chief of Staff" Agent</h4>
            <div className="font-mono text-[10px] space-y-2 text-zinc-600">
              <p><strong>• Ingestion:</strong> The agent monitors executive communications, board minutes, and KPIs.</p>
              <p><strong>• Synthesis:</strong> It correlates operational data against stated quarterly goals.</p>
              <p><strong>• Advisory:</strong> It delivers a daily "Executive Briefing" highlighting alignment gaps and critical decision triggers.</p>
              <p><strong>• Action:</strong> Proactively drafts board-ready memos and updates strategic risk registers.</p>
            </div>
          </div>

          {/* Workflow 2 */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-150 flex items-center justify-center font-bold text-amber-600">
              02
            </div>
            <h4 className="font-sans font-black text-sm uppercase text-slate-900">2. The Predictive "Market Analyst" Agent</h4>
            <div className="font-mono text-[10px] space-y-2 text-zinc-600">
              <p><strong>• Monitoring:</strong> Connects to Bloomberg/Reuters feeds, social media, and internal sales data.</p>
              <p><strong>• Analysis:</strong> Performs continuous sentiment and trend mapping.</p>
              <p><strong>• Alerting:</strong> Provides real-time "anomaly detection" alerts if market conditions deviate from forecast models.</p>
              <p><strong>• Scenario Planning:</strong> Generates automated "What-if" simulations for supply chain or fiscal shifts.</p>
            </div>
          </div>

          {/* Workflow 3 */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4 hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-150 flex items-center justify-center font-bold text-indigo-600">
              03
            </div>
            <h4 className="font-sans font-black text-sm uppercase text-slate-900">3. The Process Optimizer (COO) Agent</h4>
            <div className="font-mono text-[10px] space-y-2 text-zinc-600">
              <p><strong>• Mapping:</strong> Autonomously maps existing cross-departmental communication flows.</p>
              <p><strong>• Bottleneck Detection:</strong> Identifies process friction points (e.g., approval delays).</p>
              <p><strong>• Orchestration:</strong> Re-routes tasks and optimizes resource allocation between departments.</p>
              <p><strong>• Reporting:</strong> Generates real-time performance dashboards for executive review.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICE OPTIMIZATION SUGGESTION MATRIX */}
      <div className="bg-zinc-50 border-2 border-slate-900 p-6 md:p-10 rounded-2xl shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <span className="font-mono text-[9px] text-[#FF4F2E] font-black uppercase tracking-widest block">
              ★ REAL-TIME OPTIMIZATION ENGINE ★
            </span>
            <h4 className="text-2xl font-black tracking-tight text-slate-955 mt-1 uppercase font-sans">
              Workload & Service Optimizer
            </h4>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Select your organization's primary bottleneck to find the suggested high-impact service optimization.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF4F2E]/10 border border-[#FF4F2E]/20 text-[#FF4F2E] rounded-lg font-mono text-[10px] uppercase font-black">
            <Zap className="w-3.5 h-3.5 animate-pulse" /> SUGGESTION PROTOCOL ACTIVE
          </div>
        </div>

        {/* Bottleneck selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          <button
            onClick={() => setSelectedChallenge('manual_dispatch')}
            className={`p-4 border text-left rounded-xl transition-all cursor-pointer font-sans ${
              selectedChallenge === 'manual_dispatch'
                ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-[#9DFF00]/50'
                : 'bg-white text-slate-800 hover:bg-zinc-100 border-zinc-200'
            }`}
          >
            <span className="block font-mono text-[9px] font-bold text-[#FF4F2E] mb-1.5">01 // LATENCY</span>
            <span className="font-bold text-xs block uppercase leading-tight">Manual Reporting & Dispatch</span>
          </button>

          <button
            onClick={() => setSelectedChallenge('market_volatility')}
            className={`p-4 border text-left rounded-xl transition-all cursor-pointer font-sans ${
              selectedChallenge === 'market_volatility'
                ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-[#9DFF00]/50'
                : 'bg-white text-slate-800 hover:bg-zinc-100 border-zinc-200'
            }`}
          >
            <span className="block font-mono text-[9px] font-bold text-[#FF4F2E] mb-1.5">02 // UNCERTAINTY</span>
            <span className="font-bold text-xs block uppercase leading-tight">Economic Shifts & Risk</span>
          </button>

          <button
            onClick={() => setSelectedChallenge('approval_bottlenecks')}
            className={`p-4 border text-left rounded-xl transition-all cursor-pointer font-sans ${
              selectedChallenge === 'approval_bottlenecks'
                ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-[#9DFF00]/50'
                : 'bg-white text-slate-800 hover:bg-zinc-100 border-zinc-200'
            }`}
          >
            <span className="block font-mono text-[9px] font-bold text-[#FF4F2E] mb-1.5">03 // SILOS</span>
            <span className="font-bold text-xs block uppercase leading-tight">Approval & Delay Loops</span>
          </button>

          <button
            onClick={() => setSelectedChallenge('cognitive_burnout')}
            className={`p-4 border text-left rounded-xl transition-all cursor-pointer font-sans ${
              selectedChallenge === 'cognitive_burnout'
                ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-[#9DFF00]/50'
                : 'bg-white text-slate-800 hover:bg-zinc-100 border-zinc-200'
            }`}
          >
            <span className="block font-mono text-[9px] font-bold text-[#FF4F2E] mb-1.5">04 // EXHAUSTION</span>
            <span className="font-bold text-xs block uppercase leading-tight">C-Suite Burnout & Focus</span>
          </button>

          <button
            onClick={() => setSelectedChallenge('skills_gap')}
            className={`p-4 border text-left rounded-xl transition-all cursor-pointer font-sans ${
              selectedChallenge === 'skills_gap'
                ? 'bg-slate-950 text-white border-slate-950 shadow-md ring-2 ring-[#9DFF00]/50'
                : 'bg-white text-slate-800 hover:bg-zinc-100 border-zinc-200'
            }`}
          >
            <span className="block font-mono text-[9px] font-bold text-[#FF4F2E] mb-1.5">05 // CAPACITY</span>
            <span className="font-bold text-xs block uppercase leading-tight">AI Orchestration Skills Gap</span>
          </button>
        </div>

        {/* Dynamic Suggester Output Panel */}
        <div className="bg-white border border-zinc-200 p-6 md:p-8 rounded-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative overflow-hidden">
          {/* Subtle graphic accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF4F2E]/5 rounded-full filter blur-2xl"></div>

          {/* Left info column */}
          <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 text-[#9DFF00] rounded font-mono text-[9px] font-bold uppercase tracking-wider">
                💡 STRATEGIC DEPLOYMENT RECOMMENDATION
              </div>

              {selectedChallenge === 'manual_dispatch' && (
                <div className="space-y-3 animate-fadeIn text-sans">
                  <h5 className="text-xl font-black text-slate-950 uppercase">Optimize: Process Optimizer (COO) Agent Node</h5>
                  <p className="text-sm text-zinc-650 leading-relaxed font-semibold">
                    Executives and operations managers are spending up to 2.5 hours daily formatting and parsing operational updates across EMEA. Standardizing a programmatic dispatch pipeline using <strong className="text-slate-955">automated notification triggers (WhatsApp Sandbox proxy)</strong> is suggested immediately.
                  </p>
                  <p className="text-xs text-[#FF4F2E] font-mono leading-relaxed bg-[#FF4F2E]/5 p-3 border-l-2 border-[#FF4F2E] rounded">
                    <strong>THE EXECUTIVE BLUEPRINT:</strong> Integrate the Process Optimizer client to map the recurring communication intervals, routing alerts to regional supervisors automatically.
                  </p>
                </div>
              )}

              {selectedChallenge === 'market_volatility' && (
                <div className="space-y-3 animate-fadeIn text-sans">
                  <h5 className="text-xl font-black text-slate-950 uppercase">Optimize: Predictive "Market Analyst" Agent Node</h5>
                  <p className="text-sm text-zinc-650 leading-relaxed font-semibold">
                    With regulatory shifting rules and macroeconomic inflation threatening product supply lines, manual assessment delays decision windows. Standardizing a live market watch telemetry feed is suggested.
                  </p>
                  <p className="text-xs text-[#FF4F2E] font-mono leading-relaxed bg-[#FF4F2E]/5 p-3 border-l-2 border-[#FF4F2E] rounded">
                    <strong>THE EXECUTIVE BLUEPRINT:</strong> Embed Contextual Grounding (RAG feeds) within the simulation console to detect Eurozone compliance shifts under 60 seconds.
                  </p>
                </div>
              )}

              {selectedChallenge === 'approval_bottlenecks' && (
                <div className="space-y-3 animate-fadeIn text-sans">
                  <h5 className="text-xl font-black text-slate-950 uppercase">Optimize: Strategic "Chief of Staff" Gateways</h5>
                  <p className="text-sm text-zinc-650 leading-relaxed font-semibold">
                    Critical strategic plans stagnate for days in multiple nested email validation loops. Implement unified <strong className="text-slate-955">asynchronous validation gates</strong> to accelerate turnaround.
                  </p>
                  <p className="text-xs text-[#FF4F2E] font-mono leading-relaxed bg-[#FF4F2E]/5 p-3 border-l-2 border-[#FF4F2E] rounded">
                    <strong>THE EXECUTIVE BLUEPRINT:</strong> Establish strict one-click validation prompts on mobile nodes, routing escalation triggers instantly to secondary controllers if silent for 180 minutes.
                  </p>
                </div>
              )}

              {selectedChallenge === 'cognitive_burnout' && (
                <div className="space-y-3 animate-fadeIn text-sans">
                  <h5 className="text-xl font-black text-slate-950 uppercase">Optimize: The C-Suite Magazine & Focus Enclave</h5>
                  <p className="text-sm text-zinc-650 leading-relaxed font-semibold">
                    Unstructured metrics overflow dashboard interfaces, inducing executive fatigue. Filter incoming noise with the <strong className="text-slate-955">high-impact editorial summary architecture</strong>.
                  </p>
                  <p className="text-xs text-[#FF4F2E] font-mono leading-relaxed bg-[#FF4F2E]/5 p-3 border-l-2 border-[#FF4F2E] rounded">
                    <strong>THE EXECUTIVE BLUEPRINT:</strong> Adopt the Elegant Editorial table layout (The Pulse, Weekly Focus, Toolkit) to guarantee complete strategic visibility under 4 minutes.
                  </p>
                </div>
              )}

              {selectedChallenge === 'skills_gap' && (
                <div className="space-y-3 animate-fadeIn text-sans">
                  <h5 className="text-xl font-black text-slate-950 uppercase">Optimize: Corporate Academy & AI Coaches Track</h5>
                  <p className="text-sm text-zinc-650 leading-relaxed font-semibold">
                    Employees require months to correctly master complex prompt workflows and multi-agent coordination frameworks. Standardize interactive upskilling sandboxes.
                  </p>
                  <p className="text-xs text-[#FF4F2E] font-mono leading-relaxed bg-[#FF4F2E]/5 p-3 border-l-2 border-[#FF4F2E] rounded">
                    <strong>THE EXECUTIVE BLUEPRINT:</strong> Enroll regional management in Module 4 (Agentic Orchestration) while letting users run simulated client interactions in absolute privacy.
                  </p>
                </div>
              )}
            </div>

            {/* Action plan checklist */}
            <div className="space-y-3 border-t border-zinc-100 pt-4.5">
              <span className="font-mono text-[10px] uppercase font-bold text-zinc-700">Priority Action Steps:</span>
              <ul className="text-xs text-zinc-600 font-sans font-medium space-y-2.5">
                {selectedChallenge === 'manual_dispatch' && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Build centralized triggers routing automated brief summaries.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Deploy the WhatsApp sandbox simulator to test regional relay paths.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Recover 45.8% of manual dispatch latency within 14 business days.
                    </li>
                  </>
                )}
                {selectedChallenge === 'market_volatility' && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Map Bloomberg sentiment indicators to the "Virtual Boardroom" model.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Initialize defensive hedge calculations for procuring local server space.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Verify currency compliance registers automatically.
                    </li>
                  </>
                )}
                {selectedChallenge === 'approval_bottlenecks' && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Incorporate direct mobile Slack-relay action listeners.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Map permission escalation flows to secondary authority nodes.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Eradicate redundant validation steps for sub-critical milestones.
                    </li>
                  </>
                )}
                {selectedChallenge === 'cognitive_burnout' && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Incorporate "Zen Focus" reading filters on standard summaries.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Set strict 4-minute maximum reading constraints for analytical essays.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Introduce offline-safe executive toolkits and daily focus trackers.
                    </li>
                  </>
                )}
                {selectedChallenge === 'skills_gap' && (
                  <>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Assign self-paced Module 4 (Agentic Orchestration) sequences.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Simulate high-risk mock disputes within the interactive roleplay terminal.
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      Track learning streak scores on the collective admin console.
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Right scorecard column */}
          <div className="lg:col-span-5 bg-zinc-950 text-white p-6 rounded-xl flex flex-col justify-between border border-zinc-850 shadow-inner font-mono text-xs">
            <div className="space-y-4">
              <span className="text-[10px] font-bold text-zinc-400 block border-b border-zinc-850 pb-2">
                METRIC MATRIX PROJECTION
              </span>

              <div className="space-y-4">
                <div>
                  <span className="text-zinc-500 text-[10px] block uppercase">Suggested Actionable Node</span>
                  <span className="text-[#9DFF00] font-black text-sm uppercase">
                    {selectedChallenge === 'manual_dispatch' && 'CEO/COO Automated WhatsApp Sandbox'}
                    {selectedChallenge === 'market_volatility' && 'RAG Grounded board Simulation'}
                    {selectedChallenge === 'approval_bottlenecks' && 'Chief of Staff Authorization Gates'}
                    {selectedChallenge === 'cognitive_burnout' && 'Editorial Magazine Format Engine'}
                    {selectedChallenge === 'skills_gap' && 'Modular Roleplay Terminal Training'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="text-zinc-550 text-[9px] block">Impact Efficiency</span>
                    <span className="text-2xl font-black text-white">
                      {selectedChallenge === 'manual_dispatch' && '92.4%'}
                      {selectedChallenge === 'market_volatility' && '85.1%'}
                      {selectedChallenge === 'approval_bottlenecks' && '78.2%'}
                      {selectedChallenge === 'cognitive_burnout' && '95.0%'}
                      {selectedChallenge === 'skills_gap' && '89.6%'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-550 text-[9px] block">difficulty rank</span>
                    <span className={`text-xs font-bold uppercase block mt-1 px-2 py-0.5 rounded text-center max-w-[80px] ${
                      selectedChallenge === 'manual_dispatch' ? 'bg-[#FF4F2E]/10 border border-[#FF4F2E]/30 text-[#FF4F2E]' :
                      selectedChallenge === 'market_volatility' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-500' :
                      'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                    }`}>
                      {selectedChallenge === 'manual_dispatch' && 'Medium'}
                      {selectedChallenge === 'market_volatility' && 'High'}
                      {selectedChallenge === 'approval_bottlenecks' && 'Low'}
                      {selectedChallenge === 'cognitive_burnout' && 'Low'}
                      {selectedChallenge === 'skills_gap' && 'Medium'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-zinc-500 text-[10px] block uppercase">PROJECTED ROI FOCUS</span>
                  <p className="text-xs text-zinc-350 leading-relaxed font-sans font-semibold">
                    {selectedChallenge === 'manual_dispatch' && 'Recovers 14.5 labor-hours per user every week.'}
                    {selectedChallenge === 'market_volatility' && 'Avoids pricing errors with $120k projected risk protection.'}
                    {selectedChallenge === 'approval_bottlenecks' && 'Saves average 3.2 operating days per strategic cycle.'}
                    {selectedChallenge === 'cognitive_burnout' && 'Maximizes decision confidence and focused clarity.'}
                    {selectedChallenge === 'skills_gap' && 'Reduces target operational competence latency by 6 days.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-850 mt-4">
              <span className="text-[10px] text-zinc-650 font-bold block mb-2">ACTIONS AVAILABLE:</span>
              <button
                onClick={() => {
                  if (selectedChallenge === 'manual_dispatch') {
                    setStrategyInput('Automate EMEA dispatch relays and reduce communication turnaround bottleneck');
                  } else if (selectedChallenge === 'market_volatility') {
                    setStrategyInput('Deploy real-time macro hedging and EUR/USD volatility warning indicators');
                  } else if (selectedChallenge === 'approval_bottlenecks') {
                    setStrategyInput('Build autonomous chief validation loops with SMS authorization codes');
                  } else if (selectedChallenge === 'cognitive_burnout') {
                    setStrategyInput('Refocus operational outputs into clear bullet summaries');
                  } else if (selectedChallenge === 'skills_gap') {
                    setStrategyInput('Upskill workforce via simulated practice scenarios and agent modules');
                  }
                }}
                className="w-full text-center py-2.5 bg-zinc-800 hover:bg-zinc-750 text-white hover:text-[#9DFF00] font-mono text-[10px] font-black uppercase tracking-widest rounded-lg cursor-pointer transition-colors"
              >
                📥 Apply To Swarm Input &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Demo: The Virtual Boardroom */}
      <section className="bg-slate-950 text-white rounded-3xl border border-zinc-800 p-8 md:p-12 space-y-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#9DFF00]/10 rounded-full filter blur-3xl opacity-20 -z-10 animate-pulse"></div>

        <div className="space-y-4 text-center">
          <span className="font-mono text-[9px] text-[#9DFF00] font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full inline-block">
            // INTERACTIVE ADVISORY PLATFORM
          </span>
          <h3 className="text-2xl md:text-3xl font-extrabold uppercase font-sans text-white">
            The "Virtual Boardroom" Swarm Demo
          </h3>
          <p className="text-white font-mono text-[11px] max-w-2xl mx-auto uppercase">
            Experience the power of our agentic swarm. Enter your strategy below and trigger the coordinate execution.
          </p>
        </div>

        {/* Demo Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-zinc-850 py-6 text-xs text-white font-mono">
          <div>
            <span className="font-bold text-[#9DFF00] block mb-1">STEP 1: Input Strategy</span>
            Upload/type your current quarterly roadmap or strategic pillars.
          </div>
          <div>
            <span className="font-bold text-[#9DFF00] block mb-1">STEP 2: Observe Autonomy</span>
            Watch as the "Chief of Staff" agent breaks these pillars into trackable items.
          </div>
          <div>
            <span className="font-bold text-[#9DFF00] block mb-1">STEP 3: Decision Simulation</span>
            Interact with the agent to request a "risk assessment" on hypothetical shifts.
          </div>
        </div>

        {/* INTERACTIVE CONTROLS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-4">
            <div className="space-y-2">
              <label className="font-mono text-[10px] uppercase text-white font-bold block">
                Enter Strategic Vision / Roadmaps:
              </label>
              <textarea
                value={strategyInput}
                onChange={(e) => setStrategyInput(e.target.value)}
                disabled={simulationState === 'running'}
                className="w-full h-24 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-mono text-xs focus:ring-1 focus:ring-[#9DFF00] focus:outline-none disabled:opacity-50"
                placeholder="Type strategic objectives..."
              />
            </div>

            <button
              onClick={simulateSwarm}
              disabled={simulationState === 'running'}
              className="w-full font-mono text-xs font-black uppercase bg-[#9DFF00] hover:bg-[#85da00] text-black py-3 px-6 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-50"
            >
              {simulationState === 'running' ? (
                <>
                  <Activity className="w-4 h-4 animate-spin text-black" />
                  Orchestrating Swarm Nodes...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-black" />
                  [Launch Interactive Demo]
                </>
              )}
            </button>

            {simulationState === 'completed' && (
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4 animate-scaleUp">
                <span className="font-mono text-[9px] text-[#FF4F2E] font-bold uppercase tracking-widest block">
                  // HYPOTHETICAL RISK AUDITING GATEWAY
                </span>
                <p className="text-zinc-400 text-[10px] font-mono leading-relaxed">
                  Now, test how the swarm coordinates a defensive maneuver to protect your strategy. Provide a market shift:
                </p>

                <div className="space-y-1.5 font-mono">
                  <input
                    type="text"
                    value={hypotheticalShift}
                    onChange={(e) => setHypotheticalShift(e.target.value)}
                    className="w-full bg-slate-950 border border-zinc-800 p-2.5 rounded-lg text-white font-mono text-xs focus:ring-1 focus:ring-[#FF4F2E] focus:outline-none"
                    placeholder="Enter global risk shift..."
                  />
                  <div className="flex gap-1.5 pt-1">
                    <button
                      onClick={() => setHypotheticalShift('US sanctions blocks direct cloud ingress node updates')}
                      className="text-[9px] text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2 py-0.5 rounded cursor-pointer"
                    >
                      Cloud Ban
                    </button>
                    <button
                      onClick={() => setHypotheticalShift('Immediate competitor launches duplicate automated pipeline')}
                      className="text-[9px] text-zinc-500 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2 py-0.5 rounded cursor-pointer"
                    >
                      Copycat Threat
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCalculateRisk}
                  disabled={assessingRisk}
                  className="w-full py-2 bg-zinc-850 hover:bg-zinc-800 text-white font-mono text-[10px] uppercase font-black tracking-wider rounded-lg border border-zinc-700 cursor-pointer transition-colors flex items-center justify-center gap-1.5"
                >
                  {assessingRisk ? (
                    <>
                      <RotateCcw className="w-3.5 h-3.5 animate-spin" /> Assessing Hedging Alternatives...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Calculate Risk Simulation
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ACTIVE DISPATCH LOG CONSOLE */}
          <div className="lg:col-span-7 bg-zinc-950 border border-zinc-850 rounded-2xl overflow-hidden flex flex-col h-[320px] shadow-inner font-mono text-[10px]">
            <div className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-850 select-none">
              <span className="text-[9px] font-bold text-zinc-400 flex items-center gap-1.5 uppercase">
                <span className="w-2 h-2 rounded-full bg-[#9DFF00] animate-pulse"></span>
                ACTIVE SWARM DEBATE LOG
              </span>
              <span className="text-[8px] text-zinc-550">PROTOCOL // CONSTR-v3.5</span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 leading-relaxed">
              {simulationSteps.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 gap-2">
                  <Terminal className="w-6 h-6 animate-pulse" />
                  <p className="uppercase text-[9px] font-black tracking-widest leading-none">NO ACTIVE SEQUENCE CONFLICTS</p>
                  <p className="text-[9px] font-medium max-w-xs uppercase">Press "[Launch Interactive Demo]" to run the boardroom automation.</p>
                </div>
              ) : (
                simulationSteps.map((step, idx) => (
                  <div key={idx} className="space-y-1.5 animate-scaleUp">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px]">{step.avatar}</span>
                      <strong className={`font-black text-[9px] px-1 py-0.5 rounded ${step.color}`}>
                        {step.sender}
                      </strong>
                      <span className="text-[8px] text-zinc-650">({step.role})</span>
                    </div>
                    <p className="text-zinc-300 pl-5.5 whitespace-pre-wrap">{step.text}</p>
                  </div>
                ))
              )}

              {/* Display Risk Assessment if calculated */}
              {riskAssessmentResult && !assessingRisk && (
                <div className="border-t border-zinc-800 pt-3 mt-3 space-y-2 text-rose-350 animate-scaleUp">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span className="text-[9px] font-black text-rose-400">// HYPOTHETICAL SHIFT DECISION ENGINE INGEST</span>
                  </div>
                  <pre className="text-[10px] font-mono text-white whitespace-pre-wrap pl-5 pt-1.5 bg-zinc-900 border border-zinc-850 p-3 rounded-lg leading-relaxed">
                    {riskAssessmentResult}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Process 4-Week Rapid Deployment */}
      <div className="bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl shadow-xs space-y-8">
        <div>
          <span className="font-mono text-[10px] text-zinc-400 font-extrabold uppercase tracking-widest block">// SPEED DISPATCH PROGRAM</span>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1 uppercase">Implementation Process (The "4-Week Rapid Deployment")</h3>
          <p className="text-xs text-zinc-500 font-mono mt-1">From initial data ingestion to full resilient continuous feedback integrations inside 14 business days.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="relative p-5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
            <span className="absolute top-2 right-3 font-mono text-zinc-300 text-3xl font-black">01</span>
            <h5 className="font-sans font-black text-xs uppercase text-slate-900">Contextual Grounding</h5>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
              We ingest your organization's unique data (RAG architecture) to ensure agents understand your specific culture, voice, and constraints.
            </p>
          </div>

          <div className="relative p-5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
            <span className="absolute top-2 right-3 font-mono text-zinc-300 text-3xl font-black">02</span>
            <h5 className="font-sans font-black text-xs uppercase text-slate-900">Agentic Swarm Design</h5>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
              We map the necessary agents and their internal communication protocols to align targets directly against local bottlenecks.
            </p>
          </div>

          <div className="relative p-5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
            <span className="absolute top-2 right-3 font-mono text-zinc-300 text-3xl font-black">03</span>
            <h5 className="font-sans font-black text-xs uppercase text-slate-900">Human-in-the-Loop</h5>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
              We define rigorous "Authorization Gates" where agents require certified human sign-off for critical financial or logistical decisions.
            </p>
          </div>

          <div className="relative p-5 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2.5">
            <span className="absolute top-2 right-3 font-mono text-zinc-300 text-3xl font-black">04</span>
            <h5 className="font-sans font-black text-xs uppercase text-slate-900">Systemic Scaling</h5>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
              We deploy the agents into your existing ecosystem (Slack, Teams, CRMs, ERPs) and establish recurring feedback loops.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
