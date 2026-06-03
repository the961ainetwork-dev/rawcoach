import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Award, 
  BookOpen, 
  Grid, 
  Settings, 
  CheckCircle, 
  ShieldCheck, 
  RefreshCw, 
  ArrowUpRight 
} from 'lucide-react';

interface MatrixCell {
  domain: string;
  level: 1 | 2 | 3 | 4;
  title: string;
  syllabus: string;
}

export default function GetStarted() {
  const [selectedCell, setSelectedCell] = useState<MatrixCell | null>({
    domain: 'AI Fundamentals',
    level: 3,
    title: 'Workflow Integration',
    syllabus: 'Learn standard integration protocols to daisy-chain API modules, manage state transfers safely server-side, and operate low-latency tools without leaking sensitive tokens.'
  });

  const matrixData: Record<string, string[]> = {
    'AI Fundamentals': [
      'Recognizes AI tools',
      'Basic prompt usage',
      'Workflow integration',
      'Defines AI Strategy'
    ],
    'Data & Privacy': [
      'Follows policy',
      'Sanitizes data',
      'Defines data flows',
      'Sets Governance'
    ],
    'Workflow Design': [
      'Identifies gaps',
      'Automates tasks',
      'Builds agents/flows',
      'Orchestrates swarms'
    ],
    'Human-in-the-Loop': [
      'Follows "gates"',
      'Audits AI output',
      'Manages exceptions',
      'Designs audit paths'
    ]
  };

  const cellDetails: Record<string, Record<number, { title: string, syllabus: string }>> = {
    'AI Fundamentals': {
      1: { title: 'Recognizes AI tools', syllabus: 'Basic literacy of commercial AI systems. Identifying when general intelligence applies to simple copywriting or meeting transcribing workflows.' },
      2: { title: 'Basic Prompt Usage', syllabus: 'Structure straightforward zero-shot questions properly. Managing system contexts and conversational structures inside simple web playgrounds.' },
      3: { title: 'Workflow Integration', syllabus: 'Automating high-frequency pipelines. Injecting real-time context database parameters (RAG) into custom templates safely.' },
      4: { title: 'Defines AI Strategy', syllabus: 'C-Suite advisory capabilities. Building cost-benefit analysis projections, predicting infrastructure bills, and designing target milestones.' }
    },
    'Data & Privacy': {
      1: { title: 'Follows policy', syllabus: 'Baseline compliance check. Understanding why corporate API keys must never be exposed or fed sensitive internal customer records.' },
      2: { title: 'Sanitizes data', syllabus: 'Identifying and removing PII (Personally Identifiable Information) before dispatching context blocks to cloud endpoints.' },
      3: { title: 'Defines data flows', syllabus: 'Designing secure middleware routes. Implementing Express server architectures that validate token authenticity and buffer regional payloads.' },
      4: { title: 'Sets Governance', syllabus: 'Writing and auditing firestore security rules, enterprise data siloing parameters, and managing strict legal audit loops.' }
    },
    'Workflow Design': {
      1: { title: 'Identifies gaps', syllabus: 'Locating high-drag manual operations (e.g., manual copy-pasting, tedious CRM updates) and quantifying hours lost.' },
      2: { title: 'Automates tasks', syllabus: 'Building clean trigger-action formulas on automated cloud platforms to re-route internal folder records without script failure.' },
      3: { title: 'Builds agents/flows', syllabus: 'Crafting custom system state-prompts and chaining multi-step asynchronous logic chains.' },
      4: { title: 'Orchestrates swarms', syllabus: 'Architecting fully autonomous multi-perspective virtual boardrooms where agents debate strategy and build actionable files.' }
    },
    'Human-in-the-Loop': {
      1: { title: 'Follows "gates"', syllabus: 'Enforcing verification protocols where employees manually review and sign-off generated content before delivery.' },
      2: { title: 'Audits AI output', syllabus: 'Performing precise accuracy and policy assessments, detecting hallucinations early in LLM reports.' },
      3: { title: 'Manages exceptions', syllabus: 'Creating reliable backup pathways that route failed AI pipelines immediately back to human operators via live SMS channels.' },
      4: { title: 'Designs audit paths', syllabus: 'Establishing enterprise authorization patterns for secure operations across financial, compliance, and legal rails.' }
    }
  };

  const handleCellClick = (domain: string, levelIndex: number) => {
    const levelKey = (levelIndex + 1) as 1 | 2 | 3 | 4;
    const detail = cellDetails[domain]?.[levelKey];
    if (detail) {
      setSelectedCell({
        domain,
        level: levelKey,
        title: detail.title,
        syllabus: detail.syllabus
      });
    }
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      {/* Title block */}
      <div className="space-y-4 text-center lg:text-left border-b border-zinc-200/50 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-[#9DFF00] rounded-full text-[10px] font-mono tracking-widest uppercase font-black">
          <Compass className="w-3.5 h-3.5 animate-spin-slow" /> OPERATIONAL BLUEPRINT // GET STARTED
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-sans uppercase">
          Training & Operational Launch
        </h2>
        <p className="text-zinc-500 font-mono text-[11.5px] max-w-3xl leading-relaxed uppercase">
          Transitioning from high-level vision to structured execution frameworks for your staff.
        </p>
      </div>

      {/* Blueprint Introduction Statement */}
      <div className="bg-slate-50 border border-zinc-200/80 p-6 md:p-8 rounded-2xl font-mono text-xs text-zinc-600 leading-relaxed uppercase">
        To effectively operationalize your Corporate Academy & Auditing Lab, we must transition from high-level concepts to a structured framework that your clients can implement immediately. Below is our baseline blueprint for your AI Readiness Competency Matrix and the Enterprise Academy Curriculum.
      </div>

      {/* Matrix Interactive Area */}
      <div className="bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl shadow-xs space-y-6">
        <div>
          <span className="font-mono text-[9px] text-[#FF4F2E] font-black uppercase tracking-widest block">// SECTION 1 // TALENT PROFILING</span>
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">1. The Enterprise AI Competency Matrix</h3>
          <p className="text-xs text-zinc-500 font-mono mt-1">Use this matrix to evaluate talent proficiency across departments. Click on any block to load its specialized syllabus detail.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 overflow-x-auto">
            <table className="w-full text-left border-collapse border-spacing-0">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/75 text-[9px] uppercase font-mono tracking-wider text-zinc-500">
                  <th className="py-3 px-3 font-extrabold">Competency Domain</th>
                  <th className="py-3 px-2 text-center text-[10px]">Level 1: Aware</th>
                  <th className="py-3 px-2 text-center text-[10px]">Level 2: Prac</th>
                  <th className="py-3 px-2 text-center text-[10px]">Level 3: Power</th>
                  <th className="py-3 px-2 text-center text-[10px]">Level 4: Champ</th>
                </tr>
              </thead>
              <tbody className="font-mono text-[10.5px]">
                {Object.entries(matrixData).map(([domain, levels]) => (
                  <tr key={domain} className="border-b border-zinc-100 hover:bg-zinc-50/30 transition-colors">
                    <td className="py-4 px-3 font-extrabold text-slate-800 text-[10px] uppercase tracking-tight max-w-[120px]">{domain}</td>
                    {levels.map((lvlText, idx) => {
                      const levelNum = idx + 1;
                      const isSelected = selectedCell?.domain === domain && selectedCell?.level === levelNum;
                      return (
                        <td key={idx} className="py-2.5 px-1.5 text-center">
                          <button
                            onClick={() => handleCellClick(domain, idx)}
                            className={`w-full p-2.5 rounded-lg border text-left flex flex-col justify-between h-20 group transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-slate-950 border-slate-950 text-[#9DFF00] shadow-sm transform -translate-y-0.5'
                                : 'bg-white border-zinc-200 text-zinc-700 hover:border-slate-800 hover:bg-slate-50/50'
                            }`}
                          >
                            <span className="text-[7.5px] uppercase tracking-widest text-zinc-400 font-extrabold block">LVL {levelNum}</span>
                            <span className="text-[9.5px] leading-tight font-black uppercase mt-1 line-clamp-2">{lvlText}</span>
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Matrix cell details inspector card */}
          <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200 rounded-2xl p-6 flex flex-col justify-between space-y-4">
            {selectedCell ? (
              <div className="space-y-4 animate-scaleUp">
                <div className="border-b border-zinc-200 pb-3">
                  <span className="text-[8px] font-mono text-[#FF4F2E] font-extrabold uppercase tracking-widest block">// ADVISORY HUB DETECTOR</span>
                  <p className="text-xs font-black text-slate-900 uppercase mt-1 leading-snug">{selectedCell.domain}</p>
                  <span className="inline-block font-mono text-[8.5px] leading-none bg-slate-900 text-[#9DFF00] px-2 py-1 rounded mt-2.5 font-bold uppercase select-none">
                    Maturity Level {selectedCell.level} // {selectedCell.title}
                  </span>
                </div>
                <p className="text-[11px] font-mono leading-relaxed text-zinc-650 whitespace-pre-wrap">
                  {selectedCell.syllabus}
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-zinc-400 font-mono text-xs py-10">
                <Grid className="w-6 h-6 mb-2 text-zinc-300" />
                <p className="uppercase text-[9px] font-bold">Select a matrix node</p>
              </div>
            )}

            <div className="bg-white border border-zinc-200/80 p-3 rounded-lg text-[9.5px] font-mono text-zinc-500 leading-normal">
              💡 <strong>Department Check:</strong> Department leads can assess staff members and assign recommended learning tracks inside the <strong>Corporate Academy Lab</strong> interface.
            </div>
          </div>
        </div>
      </div>

      {/* Enterprise Academy Modular Curriculum */}
      <div className="space-y-8">
        <div>
          <span className="font-mono text-[9px] text-[#A855F7] font-black uppercase tracking-widest block">// SECTION 2 // EDUCATION SYLLABI</span>
          <h3 className="text-2xl font-black text-slate-900 uppercase">2. Enterprise Academy: Modular Curriculum</h3>
          <p className="text-xs text-zinc-500 font-mono mt-1">Syllabus structure designed to transform raw personnel into decentralized Agentic architects.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Foundational Modules */}
          <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-xs space-y-6">
            <h4 className="font-sans font-black text-sm uppercase text-slate-900 tracking-tight pb-2 border-b border-zinc-150">
              Core Modules (The Foundation)
            </h4>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1">
                <span className="font-black text-slate-900 leading-none">MODULE 1: AI LITERACY & GOVERNANCE</span>
                <p className="text-zinc-500 text-[10.5px]">Understanding the "Why" and "How." Mastering ethics, policy compliance, and major security risk mitigations.</p>
              </div>

              <div className="space-y-1">
                <span className="font-black text-slate-900 leading-none">MODULE 2: PROMPT ENGINEERING FOR PROFESSIONALS</span>
                <p className="text-zinc-500 text-[10.5px]">Moving past simple questions into robust Chain-of-Thought planning parameters, XML tag delimiters, and dynamic system rules.</p>
              </div>

              <div className="space-y-1">
                <span className="font-black text-slate-900 leading-none">MODULE 3: WORKFLOW MAPPING</span>
                <p className="text-zinc-500 text-[10.5px]">Identifying regional "High-Drag" processes and creating strict process charts tailored for total automation.</p>
              </div>

              <div className="space-y-1">
                <span className="font-black text-slate-900 leading-none">MODULE 4: AGENTIC ORCHESTRATION</span>
                <p className="text-zinc-500 text-[10.5px]">Designing and deploying decentralized agents that interface smoothly with secure internal enterprise directories and CRM endpoints.</p>
              </div>
            </div>
          </div>

          {/* Specialized Tracks */}
          <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-xs space-y-6">
            <h4 className="font-sans font-black text-sm uppercase text-slate-900 tracking-tight pb-2 border-b border-zinc-150">
              Specialized Task-Force Tracks
            </h4>

            <div className="space-y-4 font-mono text-xs">
              <div className="space-y-1 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                <strong className="text-red-650 font-black block uppercase">THE "AUDIT OPS" TRACK</strong>
                <p className="text-zinc-500 text-[10.5px] mt-1">Focuses entirely on maximum API-key hardening parameters, server proxy maintenance, routing security, and policy compliance enforcement.</p>
              </div>

              <div className="space-y-1 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                <strong className="text-indigo-650 font-black block uppercase">THE "STRATEGY & GROWTH" TRACK</strong>
                <p className="text-zinc-500 text-[10.5px] mt-1">Utilizing predictive analytical forecasting models and virtual boardroom simulations to model market changes early.</p>
              </div>

              <div className="space-y-1 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                <strong className="text-purple-650 font-black block uppercase">THE "HUMAN CAPITAL" TRACK</strong>
                <p className="text-zinc-500 text-[10.5px] mt-1">Aligning custom personality feedback models to monitor organizational health, track daily targets, and manage feedback channels.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation: The Auditor Feedback Loop */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 border border-zinc-850 space-y-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#9DFF00]/10 rounded-full filter blur-3xl opacity-30"></div>
        
        <div>
          <span className="font-mono text-[9px] text-[#9DFF00] font-black uppercase tracking-widest block">// SECTION 3 // RECOVERY METRICS</span>
          <h3 className="text-2xl font-extrabold uppercase text-white font-sans">3. Implementation: The "Auditor" Feedback Loop</h3>
          <p className="text-white font-mono text-xs mt-1 uppercase">Establish a Weekly Audit Ritual to guarantee continuous performance return on investment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="border border-zinc-800 bg-zinc-900 rounded-xl p-5 space-y-3">
            <span className="font-black text-[#9DFF00] block uppercase tracking-wider">A. DIGITAL DRAG INDEX</span>
            <p className="text-white text-[10.5px] leading-relaxed">
              <strong>Measure:</strong> Total manual task hours vs. Agentic throughput hours.<br className="mb-2"/>
              <strong>Target Objective:</strong> Reduce regional "Legacy Friction" by 20% month-over-month.
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-900 rounded-xl p-5 space-y-3">
             <span className="font-black text-[#9DFF00] block uppercase tracking-wider">B. COMPLIANCE SCORECARD</span>
            <p className="text-white text-[10.5px] leading-relaxed">
              <strong>Measure:</strong> % of security tokens nested inside proxy databases vs. client storage.<br className="mb-2"/>
              <strong>Target Objective:</strong> 100% eradication of vulnerable variables.
            </p>
          </div>

          <div className="border border-zinc-800 bg-zinc-900 rounded-xl p-5 space-y-3">
            <span className="font-black text-[#9DFF00] block uppercase tracking-wider">C. EXCEPTION LATENCY</span>
            <p className="text-white text-[10.5px] leading-relaxed">
              <strong>Measure:</strong> Time elapsed before dispatching failed pipeline anomalies.<br className="mb-2"/>
              <strong>Target Objective:</strong> Transition from passive emails to instantaneous (under 60s) SMS/WhatsApp alerts.
            </p>
          </div>
        </div>
      </div>

      {/* How to Launch with Your Clients */}
      <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-xs space-y-6">
        <div>
          <span className="font-mono text-[9px] text-[#FF4F2E] font-bold uppercase tracking-widest block">// DEPLOYMENT ENCLAVE</span>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">4. How to Launch with Your Clients</h3>
          <p className="text-xs text-zinc-500 font-mono mt-1">Our step-by-step onboarding protocol ensures rapid transition with zero service downtime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
          <div className="space-y-1.5 p-4.5 bg-zinc-50 rounded-xl border border-zinc-200">
            <strong className="text-slate-900 block font-bold uppercase">1. Baseline Audit</strong>
            <p className="text-zinc-550 leading-relaxed text-[10.5px]">Use the Diagnostic Scorecard to rate your client's initial digital drag indicators.</p>
          </div>

          <div className="space-y-1.5 p-4.5 bg-zinc-50 rounded-xl border border-zinc-200">
            <strong className="text-slate-900 block font-bold uppercase">2. Academy Kickoff</strong>
            <p className="text-zinc-550 leading-relaxed text-[10.5px]">Enroll entire staff divisions into Foundational Module tracks (Lit & Governance).</p>
          </div>

          <div className="space-y-1.5 p-4.5 bg-zinc-50 rounded-xl border border-zinc-200">
            <strong className="text-slate-900 block font-bold uppercase">3. Task-Force Setup</strong>
            <p className="text-zinc-550 leading-relaxed text-[10.5px]">Select Level 3 & Level 4 personnel to establish active regional swarms.</p>
          </div>

          <div className="space-y-1.5 p-4.5 bg-zinc-50 rounded-xl border border-zinc-200">
            <strong className="text-slate-900 block font-bold uppercase">4. Certification</strong>
            <p className="text-zinc-550 leading-relaxed text-[10.5px]">Assign certified governance officer credentials once passing our live scorecards.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
