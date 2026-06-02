import React, { useState } from 'react';
import { LATEST_NEWS } from '../data/mockData';
import CorporateAssessmentHub from './CorporateAssessmentHub';
import PhoneSimulator from './PhoneSimulator';
import SystemDiagnostics from './SystemDiagnostics';
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
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';

// Custom lightweight Markdown-to-HTML parser for RAWCOACH transition reports
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
  onStartDashboard: (tabId?: 'copilot-workspace' | 'ceo-coaching') => void;
}

export default function Hero({ onStartDashboard }: HeroProps) {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

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

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setJoined(true);
      setTimeout(() => setJoined(false), 4000);
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
    doc.setFillColor(18, 19, 24); // Deep black/slate RAWCOACH header block
    doc.rect(0, 0, pageWidth, 42, 'F');

    // Title in header
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('RAWCOACH EXECUTIVE DISPATCH', margin, 18);

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
        doc.text(`RAWCOACH ROADMAP // CLIENT: ${companyName.toUpperCase() || 'INCOGNITOS'}`, margin, 8);
        
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

    doc.save(`RAWCOACH_Transition_Roadmap_${companyName.replace(/[^a-zA-Z0-9]/g, '_') || 'Blueprint'}.pdf`);
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
              RAWCOACH<span className="text-zinc-400 font-normal">.AI</span>
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

        {/* Gigantic Premium Headline Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-red-50 border border-red-150 inline-block px-3.5 py-1 rounded-lg">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 font-mono">⚡ SOVEREIGN ADVISORY ENGINES</span>
            </div>
            
            <h2 className="text-5xl sm:text-7xl md:text-[74px] leading-[0.95] font-black uppercase tracking-tight text-slate-900 font-sans">
              STOP GUESSING. <br className="hidden sm:inline" /> START <br className="hidden sm:inline" /> <span className="bg-slate-900 text-[#9DFF00] px-4 inline-block py-1">ARCHITECTING.</span>
            </h2>

            <p className="text-base md:text-lg text-slate-700 font-semibold max-w-2xl leading-relaxed">
              We don’t just coach; we build the engine. From sovereign-grade macroeconomic modeling to agentic swarm deployment, we equip Lebanon’s next generation of founders to survive, scale, and disrupt.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-3">
              <button
                onClick={() => onStartDashboard('ceo-coaching')}
                id="btn-sandbox"
                className="group px-7 py-4.5 bg-slate-900 hover:bg-slate-800 text-[#9DFF00] rounded-xl font-bold uppercase text-[11px] tracking-wider transition-all cursor-pointer flex items-center gap-2.5 shadow-sm"
              >
                Let’s Build the Alpha <ArrowRight className="w-4 h-4 text-[#9DFF00]" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('manifesto-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-4.5 bg-white hover:bg-zinc-50 text-slate-800 border border-zinc-200 rounded-xl text-[11px] uppercase font-bold tracking-wider transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                View the War Chest (Services)
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 glass-panel border border-zinc-200 p-8 rounded-2xl space-y-6 relative overflow-hidden bg-zinc-50/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF4F2E] rounded-full filter blur-xl opacity-20 transform translate-x-8 -translate-y-8"></div>
            
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-405 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
              <p className="font-mono text-xs text-red-650 font-extrabold tracking-widest uppercase">LIVE DISPATCHES</p>
            </div>
            
            <h3 className="font-mono text-sm font-black tracking-wider text-black uppercase">AI REVENUE SIGNALS</h3>
            
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
                  <h4 className="text-xs font-semibold leading-normal text-zinc-800 hover:text-black transition-colors cursor-pointer">{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-mono mt-0.5">{item.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The Manifesto: From the War Room to the Engine Room */}
        <section id="manifesto-section" className="mb-24 bg-slate-950 text-white p-8 md:p-14 rounded-3xl border border-zinc-800 relative overflow-hidden shadow-xl scroll-mt-24">
          <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-900 rounded-full filter blur-3xl opacity-35 -z-10 animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-900/10 rounded-full filter blur-2xl opacity-15"></div>
          
          <div className="max-w-4xl space-y-6">
            <div className="inline-block px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
              ★ Our Philosophy: From the War Room to the Engine Room ★
            </div>
            
            <h3 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight leading-none font-sans">
              We’ve seen the collapse. <br />
              <span className="text-[#9DFF00]">Now we’re coding the recovery.</span>
            </h3>

            <div className="space-y-4 text-xs md:text-sm text-zinc-300 leading-relaxed font-sans font-medium">
              <p className="text-zinc-150 border-l-2 border-[#9DFF00] pl-4 italic">
                For 40 years, I’ve tracked the numbers, reported from the frontlines, and witnessed the structural failures that define our economy. But watching is for the history books. We are here for the future.
              </p>
              
              <p>
                The age of waiting for institutional change is over. Today, the most resilient infrastructure isn’t built with concrete—it’s built with <span className="text-white font-extrabold underline decoration-[#9DFF00] decoration-2">Agentic Swarms</span>, high-density data loops, and hardened AI workflows. We don’t just coach founders; we partner with the visionaries who are ready to bypass the status quo and build a sovereign-grade digital Lebanon.
              </p>
              
              <p>
                Whether you’re scaling a startup in a volatile market or trying to automate your enterprise, we provide the turnkey architecture to ensure you don’t just survive the cycle—you own it.
              </p>

              <div className="bg-zinc-900 border border-zinc-800 p-4.5 rounded-xl text-[11px] font-mono text-amber-500 leading-normal">
                <strong>BOTTOM LINE:</strong> We’ve done the research. We’ve fought the battles. Now, let’s build your Alpha.
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button 
                onClick={() => onStartDashboard('ceo-coaching')}
                className="px-6 py-3.5 bg-[#9DFF00] hover:bg-[#86d900] text-slate-950 font-mono text-[10px] uppercase font-black tracking-wider transition-all rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
              >
                Let’s Build the Alpha &rarr;
              </button>
              <button 
                onClick={() => onStartDashboard('ceo-coaching')}
                className="px-6 py-3.5 bg-transparent border border-zinc-700 hover:border-zinc-500 text-white font-mono text-[10px] uppercase font-black transition-all rounded-xl cursor-pointer"
              >
                Inspect the War Chest Menu
              </button>
            </div>
          </div>
        </section>



        {/* CORPORATE ACADEMY HUB & WORKSPACE ALIGNMENT */}
        <section className="mb-24 scroll-mt-24 bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl relative overflow-hidden shadow-xs">
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

        {/* CHAOS TO CODE SYSTEM DIAGNOSTICS */}
        <section className="mb-24 scroll-mt-24">
          <div className="text-center space-y-4 mb-10">
            <div className="inline-block px-3 py-1 bg-rose-50 border border-rose-100 text-rose-705 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
              ★ RAPID PIPELINE RECONSTRUCTION ★
            </div>
            <h3 className="text-3xl md:text-5xl font-black tracking-tight uppercase text-slate-900 font-sans">
              SYSTEM DIAGNOSTICS: FROM CHAOS TO CODE
            </h3>
            <p className="text-xs md:text-sm text-slate-505 max-w-2xl mx-auto leading-relaxed font-semibold">
              Convert uncertainty into precise algorithmic blueprints instantly. Guide your business from reactive stress to a master-grade, turnkey automation roadmap using our advanced diagnostic bot.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SystemDiagnostics onStartProtocol={(tab) => {
              if (tab === 'ceo-coaching' || tab === 'copilot-workspace') {
                onStartDashboard(tab);
              } else {
                onStartDashboard('copilot-workspace');
              }
            }} />
          </div>
        </section>

        {/* RAW MOBILE SUITE SIMULATION */}
        <section className="mb-24 scroll-mt-24 bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl relative overflow-hidden shadow-xs">
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

        <div className="mb-24">
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
        <div className="bg-[#F8FAFC] border border-zinc-200 text-slate-900 p-10 md:p-16 text-center space-y-6 relative overflow-hidden rounded-3xl shadow-xs">
          
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
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 text-zinc-600 py-12 rounded-b-3xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black tracking-tighter text-white bg-black px-2.5 py-1 rounded">RAWCOACH.AI</span>
            <span className="text-[10px] text-zinc-400 font-mono">© 2026 OVERKILL RESEARCH DEPT.</span>
          </div>
          <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500">
            <a href="#hero-section" className="hover:underline hover:text-black">TOP</a>
            <span>•</span>
            <button onClick={onStartDashboard} className="hover:underline text-black font-bold cursor-pointer">LAUNCH INTERACTIVE SAAS WORKSPACE</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
