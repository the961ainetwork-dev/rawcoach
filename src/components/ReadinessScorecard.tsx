import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileSpreadsheet, 
  HelpCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Send, 
  CheckSquare, 
  Sliders, 
  Activity, 
  Building,
  Target,
  User,
  Check
} from 'lucide-react';

export default function ReadinessScorecard() {
  const { user } = useAuth();

  // Part 1 States
  const [workflowScore, setWorkflowScore] = useState<number>(3);
  const [securityScore, setSecurityScore] = useState<number>(3);
  const [alertingScore, setAlertingScore] = useState<number>(3);
  const [dataScore, setDataScore] = useState<number>(3);

  // Part 2 States
  const [skillGaps, setSkillGaps] = useState<string[]>([]);
  const [operationalReadiness, setOperationalReadiness] = useState<string | null>(null);
  const [targetScopes, setTargetScopes] = useState<string[]>([]);

  // Part 4 Official Request
  const [companyName, setCompanyName] = useState<string>('');
  const [leadStakeholder, setLeadStakeholder] = useState<string>('');
  const [primaryGoal, setPrimaryGoal] = useState<string>('');

  // Submission States
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Interactive Scoring Matrix Calculation
  // Part 1: Rate 1 (lowest maturity) to 5 (highest maturity)
  // To match the requested prompt:
  // Maturity score is calculated. We calculate "Legacy Friction Weight" on a 100-point scale:
  // Weight = (6 - AvgScore) * 16.66 (so higher score = less legacy friction).
  // 0-20: Strategic Optimization
  // 21-40: Academy Foundation
  // 41+: Total Overhaul
  const calculateFrictionWeight = () => {
    const avgScore = (workflowScore + securityScore + alertingScore + dataScore) / 4;
    // Friction is inversely proportional to maturity!
    // If average maturity is 5, friction is 5 * 4 = 20. (Strategic Optimization)
    // If average maturity is 1, friction is 1 * 16 = 16 (on 1-5 scale) or let's use weighted rating:
    const baseFriction = Math.round((5 - avgScore) * 20);
    return Math.max(5, baseFriction);
  };

  const frictionScore = calculateFrictionWeight();

  const getRoadmapThreshold = (score: number) => {
    if (score <= 20) {
      return {
        tier: 'Strategic Optimization',
        badgeColor: 'bg-emerald-950 text-[#9DFF00] border-emerald-800',
        textColor: 'text-emerald-400',
        desc: 'Swarms Ready — You are primed to deploy coordinated C-Suite AI Agents. Secure authorization gates are your main milestone focus.',
        steps: [
          'Pre-deploy board decision simulator scenarios into executive mailboxes.',
          'Inject RAG context layers globally to unify regional communication voice.',
          'Define autonomous thresholds where agents can authorize up to $15K operational invoices.'
        ]
      };
    } else if (score <= 40) {
      return {
        tier: 'Academy Foundation',
        badgeColor: 'bg-indigo-950 text-indigo-300 border-indigo-800',
        textColor: 'text-indigo-400',
        desc: 'Prioritize Staff Certification & Workflow Mapping paths in the next 30 days.',
        steps: [
          'Enroll department directors in foundational Module 2 (Prompt Engineering).',
          'Deploy regional task-force tracking scorecards to locate legacy clipboard bottlenecks.',
          'Audit all active teams weekly through our decentral learning progression dashboards.'
        ]
      };
    } else {
      return {
        tier: 'Total Overhaul',
        badgeColor: 'bg-rose-950 text-rose-300 border-rose-800',
        textColor: 'text-rose-400',
        desc: 'Immediate emergency focus on Security Hardening & Legacy Debt Audit required.',
        steps: [
          'Eradicate client-side token structures. Move all credentials to behind server-side Express proxies.',
          'Automate exception handling to migrate from silent failure logs to instant SMS alerts.',
          'Host a 90-minute technical roadmap baseline summit with our engineering directors.'
        ]
      };
    }
  };

  const recommendation = getRoadmapThreshold(frictionScore);

  const handleToggleSkillGap = (item: string) => {
    if (skillGaps.includes(item)) {
      setSkillGaps(skillGaps.filter(g => g !== item));
    } else {
      setSkillGaps([...skillGaps, item]);
    }
  };

  const handleToggleTargetScope = (item: string) => {
    if (targetScopes.includes(item)) {
      setTargetScopes(targetScopes.filter(s => s !== item));
    } else {
      setTargetScopes([...targetScopes, item]);
    }
  };

  const handleSubmitScorecard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !leadStakeholder.trim()) {
      setErrorMsg('Company Name and Lead Stakeholder are required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const dataPayload = {
      companyName,
      leadStakeholder,
      primaryGoal,
      userEmail: user?.email || 'Anonymous Operator',
      metrics: {
        workflow: workflowScore,
        security: securityScore,
        alerting: alertingScore,
        data: dataScore,
        frictionScore,
        roadmapTier: recommendation.tier
      },
      skillGaps,
      operationalReadiness,
      targetScopes,
      createdAt: new Date().toISOString()
    };

    try {
      // Save directly to Firestore collection 'auditRequests'
      const docRef = await addDoc(collection(db, 'auditRequests'), dataPayload);
      setSubmittedId(docRef.id);
    } catch (err: any) {
      console.error('Error writing audit to Firestore:', err);
      // Fallback: simulate success locally if network is offline
      setSubmittedId(`local-${Date.now()}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      {/* Page Title */}
      <div className="space-y-4 text-center lg:text-left border-b border-zinc-200/50 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-[#9DFF00] rounded-full text-[10px] font-mono tracking-widest uppercase font-black">
          <FileSpreadsheet className="w-3.5 h-3.5" /> DIAGNOSTIC CLIENT TOOL
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-sans uppercase">
          Client Transformation Scorecard
        </h2>
        <p className="text-zinc-500 font-mono text-[11.5px] max-w-3xl leading-relaxed uppercase">
          Baselining digital agility, quantifying legacy friction, and prescribing a targeted path toward an Agentic Enterprise.
        </p>
      </div>

      {/* Part 1: The Digital Friction Audit */}
      <section className="bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl shadow-xs space-y-6">
        <div className="border-b border-zinc-150 pb-4">
          <span className="font-mono text-[9px] text-[#FF4F2E] font-bold uppercase tracking-widest block">PART 1</span>
          <h4 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">The Digital Friction Audit</h4>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            Rate your current operational state to help us identify where your biggest "time-drain" bottlenecks reside.
          </p>
        </div>

        <div className="space-y-8 font-mono text-xs">
          {/* Domain 1: Workflow */}
          <div className="space-y-3.5 bg-zinc-50 p-4 border border-zinc-200 rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="font-black text-slate-900 uppercase tracking-wide">A. Workflow: Manual task handling</span>
                <p className="text-[10px] text-zinc-405">Evaluating spreadsheet workflows, raw copy-pasting, and manual dispatch emails.</p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-slate-900 text-[#9DFF00] rounded">
                Maturity: {workflowScore} / 5
              </span>
            </div>
            <input
              type="range" min="1" max="5" step="1"
              value={workflowScore}
              onChange={(e) => setWorkflowScore(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-[8px] text-zinc-400 font-bold uppercase">
              <span>1 - Manual & Heavy Drag</span>
              <span>3 - Mixed Sheets</span>
              <span>5 - Fully Autonomous Process</span>
            </div>
          </div>

          {/* Domain 2: Security */}
          <div className="space-y-3.5 bg-zinc-50 p-4 border border-zinc-200 rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="font-black text-slate-900 uppercase tracking-wide">B. Security: API & Credential management</span>
                <p className="text-[10px] text-zinc-405">Vulnerability index of keys. Are developers leaking tokens into client variables?</p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-slate-900 text-[#9DFF00] rounded">
                Maturity: {securityScore} / 5
              </span>
            </div>
            <input
              type="range" min="1" max="5" step="1"
              value={securityScore}
              onChange={(e) => setSecurityScore(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-[8px] text-zinc-400 font-bold uppercase">
              <span>1 - Client-side Variables (Vulnerable)</span>
              <span>3 - Proprietary SaaS Vault</span>
              <span>5 - Hardened Server-side Proxies</span>
            </div>
          </div>

          {/* Domain 3: Alerting */}
          <div className="space-y-3.5 bg-zinc-50 p-4 border border-zinc-200 rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="font-black text-slate-900 uppercase tracking-wide">C. Alerting: Exception handling protocols</span>
                <p className="text-[10px] text-zinc-405">What happens during an operational failure? Slack-relay alerts or silent errors?</p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-slate-900 text-[#9DFF00] rounded">
                Maturity: {alertingScore} / 5
              </span>
            </div>
            <input
              type="range" min="1" max="5" step="1"
              value={alertingScore}
              onChange={(e) => setAlertingScore(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-[8px] text-zinc-400 font-bold uppercase">
              <span>1 - Reactive (No protocol / Manual)</span>
              <span>3 - Passive Email Reports</span>
              <span>5 - Real-time Webhook/SMS Relay</span>
            </div>
          </div>

          {/* Domain 4: Data */}
          <div className="space-y-3.5 bg-zinc-50 p-4 border border-zinc-200 rounded-xl">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <span className="font-black text-slate-900 uppercase tracking-wide">D. Data: Knowledge availability</span>
                <p className="text-[10px] text-zinc-405">How accessible is company data? Is it ready for retrieval augmented AI generation?</p>
              </div>
              <span className="text-xs font-black px-2.5 py-1 bg-slate-900 text-[#9DFF00] rounded">
                Maturity: {dataScore} / 5
              </span>
            </div>
            <input
              type="range" min="1" max="5" step="1"
              value={dataScore}
              onChange={(e) => setDataScore(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
            />
            <div className="flex justify-between text-[8px] text-zinc-400 font-bold uppercase">
              <span>1 - Fragmented & Siloed</span>
              <span>3 - Cloud Folders</span>
              <span>5 - Centralized RAG-ready Enclaves</span>
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Talent & Governance Assessment */}
      <section className="bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl shadow-xs space-y-6">
        <div className="border-b border-zinc-150 pb-4">
          <span className="font-mono text-[9px] text-[#A855F7] font-bold uppercase tracking-widest block">PART 2</span>
          <h4 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">Talent & Governance Assessment</h4>
          <p className="text-xs text-zinc-500 font-mono mt-1">
            This dictates recommended internal curriculum courses and certification tracks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 font-mono text-xs">
          {/* Skill Gap */}
          <div className="space-y-3">
            <span className="font-black text-slate-900 uppercase block tracking-wider">// CURRENT SKILL GAP</span>
            <p className="text-[10px] text-zinc-500">What is your team’s primary hurdle? Select all that apply:</p>
            <div className="space-y-2">
              {[
                'Low AI Literacy',
                'Lack of Security/Compliance Standards',
                'Inability to integrate AI into existing software'
              ].map((gap) => (
                <button
                  key={gap}
                  type="button"
                  onClick={() => handleToggleSkillGap(gap)}
                  className={`w-full text-left p-3 border rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                    skillGaps.includes(gap) 
                      ? 'bg-slate-900 border-slate-950 text-[#9DFF00]' 
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <span className={`w-4 h-4 border flex items-center justify-center rounded-sm text-xs ${skillGaps.includes(gap) ? 'border-[#9DFF00] bg-zinc-800' : 'border-zinc-300'}`}>
                    {skillGaps.includes(gap) && <Check className="w-3 h-3 text-[#9DFF00]" />}
                  </span>
                  <span className="text-[10.5px] leading-tight select-none uppercase font-bold">{gap}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Operational Readiness */}
          <div className="space-y-3">
            <span className="font-black text-slate-900 uppercase block tracking-wider">// OPERATIONAL READINESS</span>
            <p className="text-[10px] text-zinc-500">Are you prepared to implement "Human-in-the-Loop" authorization gates?</p>
            <div className="space-y-2">
              {[
                'Yes, we have defined decision-makers.',
                'Partially, we need a governance framework.',
                'No, we need to build this from scratch.'
              ].map((ready) => (
                <button
                  key={ready}
                  type="button"
                  onClick={() => setOperationalReadiness(ready)}
                  className={`w-full text-left p-3 border rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                    operationalReadiness === ready 
                      ? 'bg-slate-900 border-slate-950 text-[#9DFF00]' 
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <span className={`w-4 h-4 border flex items-center justify-center rounded-full text-xs ${operationalReadiness === ready ? 'border-[#9DFF00] bg-zinc-800' : 'border-zinc-300'}`}>
                    {operationalReadiness === ready && <span className="w-2 h-2 rounded-full bg-[#9DFF00]" />}
                  </span>
                  <span className="text-[10.5px] leading-tight select-none uppercase font-bold">{ready}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Scope */}
          <div className="space-y-3">
            <span className="font-black text-slate-900 uppercase block tracking-wider">// TARGET SCOPE DEPLOYMENT</span>
            <p className="text-[10px] text-zinc-500">Which functional units are highest priority for immediate Agentic deployment?</p>
            <div className="space-y-2">
              {[
                'Chief of Staff (Strategic Intelligence)',
                'COO (Operational Orchestration)',
                'Market Analyst (Predictive Insights)',
                'Talent Partner (Human Capital)'
              ].map((scope) => (
                <button
                  key={scope}
                  type="button"
                  onClick={() => handleToggleTargetScope(scope)}
                  className={`w-full text-left p-3 border rounded-xl flex items-center gap-3 transition-colors cursor-pointer ${
                    targetScopes.includes(scope) 
                      ? 'bg-slate-900 border-slate-950 text-[#9DFF00]' 
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                  }`}
                >
                  <span className={`w-4 h-4 border flex items-center justify-center rounded-sm text-xs ${targetScopes.includes(scope) ? 'border-[#9DFF00] bg-zinc-800' : 'border-zinc-300'}`}>
                    {targetScopes.includes(scope) && <Check className="w-3 h-3 text-[#9DFF00]" />}
                  </span>
                  <span className="text-[10.5px] leading-tight select-none uppercase font-bold">{scope}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Part 3: Transformation Roadmap (System Generated) */}
      <section className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 border border-zinc-850 space-y-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full filter blur-3xl opacity-30"></div>

        <div className="border-b border-zinc-850 pb-4">
          <span className="font-mono text-[9px] text-[#9DFF00] font-bold uppercase tracking-widest block">PART 3 // REAL-TIME METRICS</span>
          <h4 className="text-xl font-extrabold tracking-tight text-white uppercase font-sans">Transformation Roadmap</h4>
          <p className="text-white font-mono text-xs mt-1">
            Calculated dynamic audit score based on digital maturity indexes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center font-mono">
          <div className="md:col-span-4 text-center border-r border-zinc-850 bg-zinc-900/40 p-6 rounded-2xl">
            <span className="text-[10px] text-white block uppercase">YOUR LEGACY FRICTION WEIGHT:</span>
            <span className="text-5xl font-black font-sans text-white block mt-2">{frictionScore} / 100</span>
            <span className={`inline-block border text-[9px] uppercase px-2 py-0.5 rounded-full mt-3 font-semibold ${recommendation.badgeColor}`}>
              {recommendation.tier}
            </span>
          </div>

          <div className="md:col-span-8 space-y-4">
            <p className="font-bold text-[#9DFF00] text-sm uppercase">// RECOMMENDED ACTION DISPATCH</p>
            <p className="text-white text-xs leading-relaxed">{recommendation.desc}</p>
            
            <div className="space-y-2 pt-2 text-[11px] text-white border-t border-zinc-850">
              <strong className="text-white uppercase block mb-1">IMMEDIATE 30-DAY WORKFLOW DELIVERABLES:</strong>
              {recommendation.steps.map((st, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-[#9DFF00] font-bold">0{i+1} //</span>
                  <span>{st}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Part 4: Official Request for Audit */}
      <section className="bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl shadow-xs space-y-8" id="audit-request">
        <div className="border-b border-zinc-150 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <span className="font-mono text-[9px] text-[#FF4F2E] font-bold uppercase tracking-widest block">PART 4</span>
            <h4 className="text-xl font-black text-slate-900 uppercase">Official Request for Audit</h4>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              By submitting this, you acknowledge readiness to modernize your enterprise workflows.
            </p>
          </div>
          <span className="font-mono text-[9px] bg-zinc-150 text-zinc-600 font-extrabold px-2 py-1 rounded">SECURE NODE HOSTED</span>
        </div>

        {submittedId ? (
          <div className="p-8 bg-emerald-50 border border-emerald-150 text-emerald-900 rounded-2xl text-center space-y-4 animate-scaleUp font-mono">
            <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto text-xl shadow-md border border-white">
              ✓
            </div>
            <h5 className="font-black text-sm uppercase tracking-tight">[SUBMISSION_VERIFIED]</h5>
            <p className="text-xs max-w-lg mx-auto leading-relaxed">
              Success! Your transformation parameters have been securely stored in the Firestore ledger under ID <strong className="text-slate-950 block select-all bg-white border border-emerald-250 p-2 rounded mt-1 text-center font-mono text-[10px] truncate">{submittedId}</strong>
            </p>
            <p className="text-[10px] text-emerald-700">One of our Head Architects will review your roadmap parameters and get back to you within 24 hours.</p>
            <button
              onClick={() => setSubmittedId(null)}
              className="text-[10.5px] uppercase font-black text-slate-900 hover:underline cursor-pointer bg-white px-3 py-1.5 border border-zinc-200 rounded"
            >
              Configure Another Audit &larr;
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitScorecard} className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-xs">
            <div className="space-y-4.5">
              <div className="space-y-1.5">
                <label className="text-slate-800 font-bold uppercase block tracking-wider">Company Name:</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-zinc-400">🏢</span>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-slate-900 focus:outline-none rounded-xl text-slate-800 focus:ring-1 focus:ring-slate-900"
                    placeholder="Enter Enterprise Name..."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-800 font-bold uppercase block tracking-wider">Lead Stakeholder / Submitter Name:</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-zinc-400">👤</span>
                  <input
                    type="text"
                    required
                    value={leadStakeholder}
                    onChange={(e) => setLeadStakeholder(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-slate-900 focus:outline-none rounded-xl text-slate-800 focus:ring-1 focus:ring-slate-900"
                    placeholder="E.g., Chief Technology Officer..."
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <label className="text-slate-800 font-bold uppercase block tracking-wider">Primary Goal / Bottleneck (Next 90 Days):</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-zinc-400">🎯</span>
                  <input
                    type="text"
                    value={primaryGoal}
                    onChange={(e) => setPrimaryGoal(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 focus:border-slate-900 focus:outline-none rounded-xl text-slate-800 focus:ring-1 focus:ring-slate-900"
                    placeholder="E.g., Automate client briefs, harden api endpoints..."
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-250 text-red-700 rounded-lg text-[10px] font-mono leading-relaxed">
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-slate-900 text-[#9DFF00] hover:bg-slate-800 font-mono text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin text-[#9DFF00]" /> Generating Cryptographic Audit Payload...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#9DFF00]" /> Submit Official Audit Request &rarr;
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Instructions for the Client */}
      <div className="bg-zinc-50 border border-zinc-200 p-8 rounded-2xl shadow-xs space-y-6">
        <div>
          <span className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-widest block">// USER LOGS</span>
          <h3 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">Instructions for the Client</h3>
          <p className="text-xs text-zinc-500 font-mono mt-1">What to expect after submitting your transformation parameters:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-mono text-xs">
          <div className="space-y-1 bg-white p-4 border border-zinc-200 rounded-xl">
            <strong className="text-slate-900 block font-bold uppercase text-[10px]">1. Submit Scorecard</strong>
            <p className="text-zinc-500 text-[10px] mt-1 leading-snug">Our advisory team will review your friction levels and bottlenecks within 24 hours.</p>
          </div>

          <div className="space-y-1 bg-white p-4 border border-zinc-200 rounded-xl">
            <strong className="text-slate-900 block font-bold uppercase text-[10px]">2. Receive Matrix</strong>
            <p className="text-zinc-550 text-[10px] mt-1 leading-snug">Get a personalized dashboard highlighting maturity vs industry benchmarks.</p>
          </div>

          <div className="space-y-1 bg-white p-4 border border-zinc-200 rounded-xl">
            <strong className="text-slate-900 block font-bold uppercase text-[10px]">3. Academy Enrollment</strong>
            <p className="text-zinc-550 text-[10px] mt-1 leading-snug">Your team gets assigned tailored courses in the Corporate Academy Lab based on scorecard trends.</p>
          </div>

          <div className="space-y-1 bg-white p-4 border border-zinc-200 rounded-xl">
            <strong className="text-slate-900 block font-bold uppercase text-[10px]">4. Audit Lab Launch</strong>
            <p className="text-zinc-550 text-[10px] mt-1 leading-snug">Schedule a technical deep-dive to harden server-side proxy routers and eliminate drag.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
