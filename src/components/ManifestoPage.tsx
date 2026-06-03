import React from 'react';
import { Sparkles, Trophy, BookOpen, Forward } from 'lucide-react';

export default function ManifestoPage() {
  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      {/* Page header */}
      <div className="space-y-4 text-center lg:text-left border-b border-zinc-200/50 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-[#9DFF00] rounded-full text-[10px] font-mono tracking-widest uppercase font-black">
          <BookOpen className="w-3.5 h-3.5" /> PROGRAM MISSION STATEMENT
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-sans uppercase">
          The C-Suite Manifesto
        </h2>
        <p className="text-zinc-500 font-mono text-[11.5px] max-w-3xl leading-relaxed uppercase">
          FROM THE WAR ROOM TO THE ENGINE ROOM — REDEFIINIG SOVEREIGN DEPLOYMENT & WORKFLOW RESILIENCE.
        </p>
      </div>

      {/* Main literature wrapper */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-14 border border-zinc-800 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-900 rounded-full filter blur-3xl opacity-35 -z-10 animate-pulse"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-900/10 rounded-full filter blur-2xl opacity-15"></div>
        
        <div className="max-w-4xl space-y-8">
          <div className="inline-block px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-[9.5px] tracking-wider font-extrabold uppercase rounded-lg">
            ★ Our Philosophy: From the War Room to the Engine Room ★
          </div>
          
          <h3 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight leading-none font-sans">
            We’ve seen the collapse. <br />
            <span className="text-[#9DFF00]">Now we’re coding the recovery.</span>
          </h3>

          <div className="space-y-6 text-sm md:text-base text-white leading-relaxed font-sans font-medium">
            <p className="text-white border-l-4 border-[#9DFF00] pl-4 italic text-base md:text-lg">
              "For 40 years, I’ve tracked the numbers, reported from the frontlines, and witnessed the structural failures that define our economy. But watching is for the history books. We are here for the future."
            </p>
            
            <p>
              The age of waiting for institutional change is over. Today, the most resilient infrastructure isn’t built with concrete—it’s built with <span className="text-white font-extrabold underline decoration-[#9DFF00] decoration-2">Agentic Swarms</span>, high-density data loops, and hardened AI workflows. We don’t just coach founders; we partner with the visionaries who are ready to bypass the status quo and build a sovereign-grade digital enterprise.
            </p>
            
            <p>
              Our Agentic Swarms are built for the reality of Lebanese business. Whether it’s offline-first logging or instant WhatsApp-relay alerts when your servers blink, we ensure your business doesn't sleep—even if the grid decides to.
            </p>

            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-xs md:text-sm font-mono text-amber-500 leading-relaxed">
              <strong className="text-white block mb-2 font-mono text-xs uppercase">// SYSTEMIC BOTTOM LINE:</strong> 
              We’ve done the research. We’ve fought the battles. Now, let’s build your Alpha. Transition from administrative overhead to modern sovereign-grade AI agents that operate with true real-time agency.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-800 font-mono text-xs text-white">
            <div className="space-y-2 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <h4 className="text-[#9DFF00] font-black uppercase tracking-wider">// PILLAR 01</h4>
              <strong className="text-white uppercase block">Zero Latency Agency</strong>
              <p className="text-[11px] text-white leading-normal">Eliminating copy-paste bottlenecks and manual dispatches through server-side automated processing.</p>
            </div>
            <div className="space-y-2 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <h4 className="text-indigo-400 font-black uppercase tracking-wider">// PILLAR 02</h4>
              <strong className="text-white uppercase block">Sovereign Encryption</strong>
              <p className="text-[11px] text-white leading-normal">Securing API integrations strictly behind Node-Express proxy servers. No browser-side secrets leak.</p>
            </div>
            <div className="space-y-2 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <h4 className="text-rose-450 font-black uppercase tracking-wider">// PILLAR 03</h4>
              <strong className="text-white uppercase block">Continuous Resiliency</strong>
              <p className="text-[11px] text-white leading-normal">Deploying self-healing, Slack/SMS alerting networks capable of routing operations during failures.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ENTERPRISE PHILOSOPHY & Value Proposition */}
      <div className="bg-white text-slate-900 rounded-3xl p-8 md:p-14 border border-zinc-200 relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#9DFF00]/10 rounded-full filter blur-3xl opacity-20 -z-10 animate-pulse"></div>
        
        {/* First Row (One Column) */}
        <div className="border-b border-zinc-200 pb-8 mb-8">
          <div className="inline-block px-3 py-1 bg-lime-50 border border-lime-100 text-lime-700 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg mb-4">
            ★ Enterprise Philosophy ★
          </div>
          <h3 className="text-2xl md:text-3xl font-black uppercase text-slate-900 tracking-tight leading-none font-sans mb-4">
            Our Value Proposition: The Agentic Enterprise Architect
          </h3>
          <p className="text-[13.5px] text-zinc-650 leading-relaxed font-sans font-medium">
            We are transitioning the Lebanese corporate landscape from passive AI adoption to active Agentic Orchestration. Mirroring the strategies of industry leaders like OpenAI and Anthropic, we do not merely provide AI tools; we embed specialized expertise directly into your operations to redesign, build, and deploy reliable, scalable agentic systems.
          </p>
        </div>

        {/* Second Row (Two Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[12.5px] font-sans font-medium leading-relaxed text-zinc-650">
          {/* Column 1 */}
          <div className="space-y-4">
            <p>
              By embedding our System Matrix and Agentic Swarm architectures, we bypass the slow, trial-and-error adoption rates typical of traditional consulting. We act as your specialized engineering partner, turning theoretical AI gains into durable, high-performance business workflows.
            </p>
            <div className="bg-zinc-50 border border-zinc-150 p-4.5 rounded-xl space-y-1">
              <strong className="text-slate-950 block font-bold uppercase text-[10.5px] tracking-wide font-mono text-indigo-600">// Forward-Deployed Expertise</strong>
              <p className="text-[12px] leading-relaxed text-zinc-600">
                Much like the "Forward Deployed Engineer" model, we provide hands-on, expert-led guidance to embed agents directly into your company’s core architecture.
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-3.5 bg-zinc-50/50 p-4.5 border border-zinc-150 rounded-xl">
            <div className="flex gap-2.5 items-start">
              <span className="text-white font-black shrink-0 bg-slate-950 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">•</span>
              <p>
                <strong className="text-slate-900">The Academy Certification Pipeline:</strong> Similar to the Claude Partner Network, we utilize our Corporate Academy to certify your talent, building an in-house bench of experts capable of managing custom systems and integrating agents into your daily operations.
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="text-white font-black shrink-0 bg-slate-950 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">•</span>
              <p>
                <strong className="text-slate-900">Infrastructure-as-Partnership:</strong> We move beyond software by establishing dedicated deployment frameworks, ensuring your business has the administrative tools, security controls, and agentic workflows required to compete at a global standard.
              </p>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="text-white font-black shrink-0 bg-slate-950 rounded-full w-5 h-5 flex items-center justify-center text-[10px]">•</span>
              <p>
                <strong className="text-slate-900">Enterprise Renaissance:</strong> By partnering with us, you are not just purchasing a service; you are gaining a sovereign intelligence hub that brings the power of applied, custom AI to your enterprise, ensuring you remain at the vanguard of the Lebanese AI Renaissance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
