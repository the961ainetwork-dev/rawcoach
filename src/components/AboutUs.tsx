import React, { useState } from 'react';
import { 
  Heart, 
  Layers, 
  Award, 
  HelpCircle, 
  ShieldAlert, 
  Zap, 
  CheckCircle, 
  Sliders, 
  CornerDownRight,
  TrendingDown,
  Building
} from 'lucide-react';

export default function AboutUs() {
  // Section 1 Auditor States
  const [onboarding, setOnboarding] = useState<'manual' | 'semi' | 'full'>('manual');
  const [security, setSecurity] = useState<'client' | 'saas' | 'server'>('client');
  const [exception, setException] = useState<'none' | 'passive' | 'instant'>('none');
  const [dragWeight, setDragWeight] = useState<number>(4);
  const [showAuditorResult, setShowAuditorResult] = useState<boolean>(false);

  // Score Calculator
  const calculateOverheadScore = () => {
    let score = 0;
    
    // Onboarding
    if (onboarding === 'manual') score += 40;
    else if (onboarding === 'semi') score += 20;
    else score += 5;

    // Security
    if (security === 'client') score += 35;
    else if (security === 'saas') score += 18;
    else score += 5;

    // Exception handling
    if (exception === 'none') score += 25;
    else if (exception === 'passive') score += 15;
    else score += 5;

    // Weight multiplication factor
    const finalScore = Math.min(100, Math.round(score * (dragWeight / 3.5)));
    return finalScore;
  };

  const scoreValue = calculateOverheadScore();

  return (
    <div className="space-y-16 animate-fadeIn pb-12">
      {/* Premium Page Title */}
      <div className="space-y-4 text-center lg:text-left border-b border-zinc-200/50 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-[#9DFF00] rounded-full text-[10px] font-mono tracking-widest uppercase font-black">
          <Heart className="w-3.5 h-3.5" /> MISSION & PHILOSOPHY // ABOUT US
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-sans uppercase">
          About Us
        </h2>
        <p className="text-zinc-500 font-mono text-[11.5px] max-w-3xl leading-relaxed uppercase">
          Architecting the Future of High-Sovereignty Corporate Operations.
        </p>
      </div>

      {/* Grid: Mission and Philosophy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-xs space-y-4">
          <span className="font-mono text-[9px] text-[#FF4F2E] font-bold uppercase tracking-widest block">// FOUNDATION MATRIX</span>
          <h3 className="text-2xl font-extrabold uppercase text-slate-900 tracking-tight leading-none">
            Our Mission: Architecting the Future of Executive Leadership
          </h3>
          <p className="text-slate-950 font-mono text-[14px] font-semibold leading-relaxed border-l-2 border-[#FF4F2E] pl-3 py-1 bg-rose-50/40">
            At the intersection of high-level strategic coaching and cutting-edge autonomous technology, we are redefining what it means to be a modern executive. We believe the next generation of leadership isn't just about human intuition—it’s about the seamless integration of human vision with Agentic Intelligence.
          </p>
        </div>

        <div className="bg-slate-950 text-white p-8 rounded-2xl border border-zinc-850 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full filter blur-2xl opacity-40"></div>
          <span className="font-mono text-[9px] text-[#9DFF00] font-bold uppercase tracking-widest block">// SYSTEM PROTOCOL</span>
          <h3 className="text-2xl font-extrabold uppercase text-white tracking-tight leading-none">
            Our Philosophy: The Augmented Executive
          </h3>
          <p className="text-white font-mono text-[14px] font-semibold leading-relaxed border-l-2 border-[#9DFF00] pl-3 py-1 bg-zinc-900/60">
            We move beyond simple "automation." Our mission is to build digital extensions of your C-Succeeding team—specialized AI agents that act as high-leverage partners. By offloading complex data synthesis, risk modeling, and operational oversight to autonomous systems, we empower leaders to stop Managing the day-to-day and return to what they do best: visionary strategic thinking.
          </p>
        </div>
      </div>

      {/* Pillars of Excellence */}
      <div className="space-y-8">
        <div>
          <span className="font-mono text-[10px] text-zinc-450 font-bold uppercase tracking-widest block">// PILARS OF EFFICIENCY</span>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">Our Pillars of Excellence</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pillar 1: The Agentic Enterprise */}
          <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-150">
              <span className="text-xl">🦾</span>
              <h4 className="font-sans font-black text-sm uppercase text-slate-900 tracking-tight">1. The Agentic Enterprise</h4>
            </div>
            
            <p className="text-zinc-650 text-xs font-mono leading-relaxed">
              We transform organizations by deploying swarms of AI agents designed to function with the same precision and insight as a world-class executive team.
            </p>

            <div className="space-y-4 pt-1 font-mono text-[10.5px]">
              <div className="flex items-start gap-2.5">
                <CornerDownRight className="w-3.5 h-3.5 text-[#FF4F2E] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 uppercase">Strategic Governance</strong>
                  <p className="text-zinc-550 mt-0.5">Agents serving as your Chief of Staff, synthesizing cross-departmental data into clear decision triggers.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CornerDownRight className="w-3.5 h-3.5 text-[#FF4F2E] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 uppercase">Operational Orchestration</strong>
                  <p className="text-zinc-550 mt-0.5">Systems acting as your COO, identifying bottlenecks and optimizing resource allocation in real-time.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CornerDownRight className="w-3.5 h-3.5 text-[#FF4F2E] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 uppercase">Market Foresight</strong>
                  <p className="text-zinc-550 mt-0.5">Predictive analysts that continuously monitor your competitive landscape, moving you from reactive to proactive.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CornerDownRight className="w-3.5 h-3.5 text-[#FF4F2E] mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-900 uppercase">Human Capital Alignment</strong>
                  <p className="text-zinc-550 mt-0.5">Talent-focused agents that monitor organizational health and performance to ensure your team is always mission-aligned.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pillar 2: Corporate Academy & Auditing Lab */}
          <div className="bg-white border border-zinc-200 p-8 rounded-2xl shadow-xs space-y-6">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-150">
              <Award className="w-5 h-5 text-indigo-500" />
              <h4 className="font-sans font-black text-sm uppercase text-slate-900 tracking-tight">2. Corporate Academy & Auditing Lab</h4>
            </div>

            <p className="text-zinc-650 text-xs font-mono leading-relaxed">
              We believe that digital transformation is only as strong as the people wielding it. Our Academy ensures your talent force is equipped, audited, and certified for the AI-first era.
            </p>

            <div className="bg-zinc-50 border border-zinc-200 p-5 rounded-xl space-y-4 font-mono text-[10.5px]">
              <span className="font-bold text-slate-900 text-xs uppercase block">THE SYSTEM MATRIX PROTOCOLS:</span>
              <ul className="space-y-2 text-zinc-600">
                <li>• <strong>Corporate Assessment:</strong> Audit legacy hoops and AI tech readiness.</li>
                <li>• <strong>Learning Paths:</strong> Curated workflow transition roadmaps.</li>
                <li>• <strong>Skill Assessments:</strong> Live proficiency testing for core staff.</li>
                <li>• <strong>Training Programs:</strong> Modular curriculums and task-force development.</li>
                <li>• <strong>Progress Reports:</strong> Comprehensive team scorecards and resource indexing.</li>
                <li>• <strong>Certifications:</strong> AI governance credential matching.</li>
              </ul>

              {/* Removed weekly auditing recommendation block per request */}
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Workflow Auditor Section 1 */}
      <section className="bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl shadow-xs space-y-8">
        <div className="border-b border-zinc-150 pb-4">
          <span className="font-mono text-[10px] text-zinc-440 font-bold uppercase tracking-widest block">// ACTIVE TELEMETRY</span>
          <h3 className="text-2xl font-black text-slate-900 uppercase">Corporate Workflow Auditor (Section 1)</h3>
          <p className="text-xs text-zinc-500 font-mono mt-1">Audit your Digital Overhead & Identify Gaps instantly.</p>
        </div>

        <p className="text-xs text-zinc-600 font-mono leading-relaxed uppercase">
          Understand if your employees are currently wasting hundreds of collective hours on outdated manual processes. Take the pulse of your current efficiency:
        </p>

        {/* Form elements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 font-mono text-xs">
            {/* Onboarding */}
            <div className="space-y-2.5">
              <label className="text-slate-900 font-bold uppercase tracking-wider block">
                Onboarding: How does your staff currently handle client folder onboarding briefs & records?
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'manual', label: 'Manual copy-paste (30+ mins)', desc: 'High overhead drag' },
                  { id: 'semi', label: 'Semi-automated (Forms/Sheets)', desc: 'Modest transition gaps' },
                  { id: 'full', label: 'Fully automated (Gemini/CRM sync)', desc: 'Optimized node' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setOnboarding(opt.id as any)}
                    className={`w-full text-left p-3 border rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      onboarding === opt.id 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div>
                      <p className="font-black text-[10.5px] uppercase">{opt.label}</p>
                      <p className={`text-[8.5px] mt-0.5 ${onboarding === opt.id ? 'text-[#9DFF00]' : 'text-zinc-500'}`}>{opt.desc}</p>
                    </div>
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${onboarding === opt.id ? 'border-[#9DFF00]' : 'border-zinc-300'}`}>
                      {onboarding === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-[#9DFF00]" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Security */}
            <div className="space-y-2.5">
              <label className="text-slate-900 font-bold uppercase tracking-wider block">
                Security: Where are core private API keys and database credentials hosted?
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'client', label: 'Client-side variables (Vulnerable)', desc: 'Extreme risk exposure' },
                  { id: 'saas', label: 'Third-party SaaS', desc: 'Intermediate custody' },
                  { id: 'server', label: 'Server-side (Express proxy routers)', desc: 'Maximum enterprise grade' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSecurity(opt.id as any)}
                    className={`w-full text-left p-3 border rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      security === opt.id 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div>
                      <p className="font-black text-[10.5px] uppercase">{opt.label}</p>
                      <p className={`text-[8.5px] mt-0.5 ${security === opt.id ? 'text-[#9DFF00]' : 'text-zinc-500'}`}>{opt.desc}</p>
                    </div>
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${security === opt.id ? 'border-[#9DFF00]' : 'border-zinc-300'}`}>
                      {security === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-[#9DFF00]" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 font-mono text-xs">
            {/* Exception Handling */}
            <div className="space-y-2.5">
              <label className="text-slate-900 font-bold uppercase tracking-wider block">
                Exception Handling: What protocol is dispatched when complex exceptions happen?
              </label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'none', label: 'Manual / None', desc: 'Silent failures, immediate loss' },
                  { id: 'passive', label: 'Passive email reports', desc: 'Information lag' },
                  { id: 'instant', label: 'Instant SMS/WhatsApp relay node', desc: 'Zero downtime routing' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setException(opt.id as any)}
                    className={`w-full text-left p-3 border rounded-xl transition-all flex items-center justify-between cursor-pointer ${
                      exception === opt.id 
                        ? 'bg-slate-900 border-slate-900 text-white' 
                        : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
                    }`}
                  >
                    <div>
                      <p className="font-black text-[10.5px] uppercase">{opt.label}</p>
                      <p className={`text-[8.5px] mt-0.5 ${exception === opt.id ? 'text-[#9DFF00]' : 'text-zinc-500'}`}>{opt.desc}</p>
                    </div>
                    <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${exception === opt.id ? 'border-[#9DFF00]' : 'border-zinc-300'}`}>
                      {exception === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-[#9DFF00]" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider Friction Weight */}
            <div className="space-y-2.5 bg-zinc-50 p-4 border border-zinc-200 rounded-xl">
              <div className="flex justify-between items-center text-slate-900 font-bold uppercase">
                <span>Legacy Friction Weight:</span>
                <span className="text-sm font-black text-[#FF4F2E]">{dragWeight} / 5</span>
              </div>
              <p className="text-[10px] text-zinc-500">Rate your current state (1: Lightning agility — 5: Intense Overheads).</p>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={dragWeight}
                onChange={(e) => setDragWeight(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-slate-900 mt-2"
              />
              <div className="flex justify-between text-[9px] text-zinc-400 font-bold pt-1 uppercase">
                <span>Lightning</span>
                <span>Moderate</span>
                <span>Crushing Overhead</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              onClick={() => setShowAuditorResult(true)}
              className="w-full py-3 bg-slate-900 text-[#9DFF00] hover:bg-slate-850 font-mono text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <Sliders className="w-4 h-4 text-[#9DFF00]" /> Compute Instant Friction Verdict
            </button>
          </div>
        </div>

        {/* Dynamic score results */}
        {showAuditorResult && (
          <div className="p-6 bg-slate-950 border border-zinc-850 text-white rounded-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <span className="text-xs font-black text-[#FF4F2E] font-mono tracking-widest uppercase">// SECURE CLOUD VERDICT</span>
              <span className="font-mono text-[10px] text-[#9DFF00] tracking-widest font-black flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#9DFF00] animate-pulse"></span> VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-4 text-center border-r border-zinc-850/60 pb-4 md:pb-0 font-mono">
                <span className="text-xs text-white font-bold block uppercase">DIGITAL OVERHEAD SCORE</span>
                <span className="text-5xl font-black font-sans text-white block mt-1">{scoreValue}%</span>
                <span className="text-[9px] text-[#FF4F2E] font-black uppercase tracking-wider block mt-1">
                  {scoreValue > 60 ? 'HIGH FRICTION INDEX' : scoreValue > 30 ? 'ELEVATED SLAG RATE' : 'STABLE NODE'}
                </span>
              </div>

              <div className="md:col-span-8 space-y-2 text-xs font-mono">
                <p className="text-zinc-200 uppercase font-bold leading-tight">
                  {scoreValue > 60 ? 'RECOMMENDATION: TOTAL OPERATIONAL OVERHAUL' : 'RECOMMENDATION: DYNAMIC ENCLAVE OPTIMIZATION'}
                </p>
                <p className="text-white text-[11px] leading-relaxed">
                  Your workflow indicates major friction. Automating Onboarding briefs has the potential to recover up to <strong>15.5 hours weekly per team member</strong>. Additionally, moving API protocols server-side removes serious compliance exposure.
                </p>
                <div className="pt-2">
                  <a 
                    href="#marketing-form"
                    className="inline-block text-[10px] font-black text-[#9DFF00] hover:underline uppercase"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.getElementById('corporate-academy-block') || document.getElementById('dispatch-waitlist-block');
                      if (element) element.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Start Your Corporate Transformation Now &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* How We Partner With You */}
      <div className="bg-[#FAF9F6] border border-zinc-200 p-8 rounded-2xl shadow-xs space-y-6">
        <div>
          <span className="font-mono text-[9px] text-zinc-400 font-bold uppercase tracking-widest block">// DELIVERY ECOSYSTEM</span>
          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 uppercase">How We Partner With You</h3>
          <p className="text-xs text-zinc-500 font-mono mt-1">We combine executive-level coaching with technical enterprise deployment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="space-y-1.5 p-4 bg-white border border-zinc-200 rounded-xl">
            <strong className="text-slate-950 uppercase block">• Contextual Grounding</strong>
            <p className="text-zinc-550 leading-relaxed">We ingest your unique organizational data to ensure agents share your specific vision and voice.</p>
          </div>

          <div className="space-y-1.5 p-4 bg-white border border-zinc-200 rounded-xl">
            <strong className="text-slate-950 uppercase block">• Human-in-the-Loop Protocol</strong>
            <p className="text-zinc-550 leading-relaxed">We build rigorous "Authorization Gates." You retain the final, high-level authority over critical enterprise decisions.</p>
          </div>

          <div className="space-y-1.5 p-4 bg-white border border-zinc-200 rounded-xl">
            <strong className="text-slate-950 uppercase block">• Continuous Evolution</strong>
            <p className="text-zinc-550 leading-relaxed">We maintain a persistent feedback loop, allowing your agents and your team to learn and adapt to your style over time.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
