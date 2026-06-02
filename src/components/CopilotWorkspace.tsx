import React, { useState } from 'react';
import { LATEST_NEWS } from '../data/mockData';
import { 
  Terminal, 
  Zap, 
  CheckCircle2, 
  Download, 
  RefreshCw, 
  ChevronLeft, 
  ArrowRight
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

interface CopilotWorkspaceProps {
  onTabChange?: (tabId: any) => void;
}

export default function CopilotWorkspace({ onTabChange }: CopilotWorkspaceProps) {
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

  const handleSelectTab = (tabId: string) => {
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="space-y-8 text-slate-900 animate-fadeIn" id="copilot-workspace-hub">
      <div className="border-b border-zinc-250/60 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-rose-50 px-2.5 py-1 text-[9px] font-mono font-bold text-rose-700 mb-2 uppercase tracking-wide rounded border border-rose-200">
            <Terminal className="w-3.5 h-3.5 text-rose-600" /> Co-Pilot Workspace Explorer
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight text-[#0F172A] leading-tight font-sans">
            CO-PILOT WORKSPACE DIAGNOSTICS
          </h3>
          <p className="font-sans text-[11.5px] text-zinc-500 tracking-normal font-medium mt-1">
            Test strategic transition blueprints or launch custom roleplay, coaching, and SMS automation setups.
          </p>
        </div>
        <div className="text-zinc-400 font-mono text-[10px] uppercase font-semibold">Ready to Analyze</div>
      </div>

      <section className="bg-white border border-zinc-200 p-6 md:p-10 rounded-2xl relative overflow-hidden shadow-xs">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100 rounded-full filter blur-3xl opacity-40 -z-10 animate-pulse"></div>
        
        <div className="text-center space-y-4 mb-8">
          <div className="inline-block px-3 py-1 bg-[#EEF2F6] border border-[#E0E6ED] text-slate-700 font-mono text-[9px] tracking-wider font-bold uppercase rounded-lg">
            ★ TACTICAL WORKFLOW PORTAL ★
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight uppercase text-slate-900 font-sans">
            EXPLORE THE CO-PILOT WORKSPACE
          </h3>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Explore the features of the workspace suite or run our interactive diagnostic questionnaire below to receive your custom coaching roadmap.
          </p>
        </div>

        {/* Navigation Tab Deck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 border border-zinc-200 rounded-xl overflow-hidden bg-slate-50 shadow-inner mb-10">
          <button
            onClick={() => setActiveTab('capabilities')}
            className={`py-4 px-6 font-mono text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
              activeTab === 'capabilities' 
                ? 'bg-slate-900 text-white font-extrabold shadow-sm' 
                : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Terminal className="w-4 h-4 flex-shrink-0" />
            1. SUMMARY OF PLATFORM CAPABILITIES
          </button>
          <button
            onClick={() => setActiveTab('demo')}
            className={`py-4 px-6 font-mono text-xs font-bold uppercase tracking-wider text-center cursor-pointer transition-all flex items-center justify-center gap-2 ${
              activeTab === 'demo' 
                ? 'bg-slate-900 text-white font-extrabold shadow-sm' 
                : 'bg-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Zap className="w-4 h-4 flex-shrink-0 text-amber-500 animate-pulse" />
            2. RUN WORKSPACE ASSESSMENT DEMO
          </button>
        </div>

        {/* TAB CONTENT A: APALET CAPABILITIES LIST */}
        {activeTab === 'capabilities' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-50/50 border border-zinc-200/85 p-5.5 rounded-2xl hover:bg-white hover:shadow-xs transition-all relative flex flex-col justify-between group">
                <div>
                  <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-white text-sm mb-4 transition-colors rounded-xl font-bold">
                    👤
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-1.5">AI Sparring & Coaches</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    Consult 4 hyper-trained advisor personas (General Advisor, GIGMASTER, FORGE, CODELAB).
                  </p>
                </div>
                <button onClick={() => handleSelectTab('ai-coaches')} className="font-mono text-[10px] font-bold uppercase text-slate-900 mt-4 hover:underline text-left flex items-center gap-1 cursor-pointer">
                  Launch Sparring Suite &rarr;
                </button>
              </div>

              <div className="bg-slate-50/50 border border-zinc-200/85 p-5.5 rounded-2xl hover:bg-white hover:shadow-xs transition-all relative flex flex-col justify-between group">
                <div>
                  <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-white text-sm mb-4 transition-colors rounded-xl font-bold">
                    🎭
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-1.5">Stakeholder Roleplay</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    Face aggressive investors, critical managers, and skeptical clients in high-pressure simulations.
                  </p>
                </div>
                <button onClick={() => handleSelectTab('roleplay')} className="font-mono text-[10px] font-bold uppercase text-slate-900 mt-4 hover:underline text-left flex items-center gap-1 cursor-pointer">
                  Launch Roleplay Board &rarr;
                </button>
              </div>

              <div className="bg-slate-50/50 border border-zinc-200/85 p-5.5 rounded-2xl hover:bg-white hover:shadow-xs transition-all relative flex flex-col justify-between group">
                <div>
                  <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-white text-sm mb-4 transition-colors rounded-xl font-bold">
                    📋
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-1.5">Goal & Habit Tracker</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    Rigorous streak-logging controls designed specifically to verify operations and daily velocity.
                  </p>
                </div>
                <button onClick={() => handleSelectTab('goal-tracker')} className="font-mono text-[10px] font-bold uppercase text-slate-900 mt-4 hover:underline text-left flex items-center gap-1 cursor-pointer">
                  Launch Goal Board &rarr;
                </button>
              </div>

              <div className="bg-slate-50/50 border border-zinc-200/85 p-5.5 rounded-2xl hover:bg-white hover:shadow-xs transition-all relative flex flex-col justify-between group">
                <div>
                  <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-white text-sm mb-4 transition-colors rounded-xl font-bold">
                    💬
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-1.5">WhatsApp & SMS gateway</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    Audit real SMS responses using the raw gateway emulator, or play with the smartphonenative chat.
                  </p>
                </div>
                <button onClick={() => handleSelectTab('whatsapp')} className="font-mono text-[10px] font-bold uppercase text-slate-900 mt-4 hover:underline text-left flex items-center gap-1 cursor-pointer">
                  Launch Gateway Emulator &rarr;
                </button>
              </div>

              <div className="bg-slate-50/50 border border-zinc-200/85 p-5.5 rounded-2xl hover:bg-white hover:shadow-xs transition-all relative flex flex-col justify-between group">
                <div>
                  <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-white text-sm mb-4 transition-colors rounded-xl font-bold">
                    👥
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-1.5">Human Gig Marketplace</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    Loop in vetted, pre-screened human developers, designers, or ops experts directly from the board.
                  </p>
                </div>
                <button onClick={() => handleSelectTab('human-marketplace')} className="font-mono text-[10px] font-bold uppercase text-slate-900 mt-4 hover:underline text-left flex items-center gap-1 cursor-pointer">
                  Launch Expert Board &rarr;
                </button>
              </div>

              <div className="bg-slate-50/50 border border-[#E2E8F0] p-5.5 rounded-2xl hover:bg-white hover:shadow-xs transition-all relative flex flex-col justify-between group">
                <div>
                  <div className="w-9 h-9 bg-slate-900 flex items-center justify-center text-white text-sm mb-4 transition-colors rounded-xl font-bold">
                    📈
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mb-1.5 flex items-center gap-1.5">Statistics & Analytics</h4>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans font-medium">
                    Evaluate your actual Resource Recovery Rates (RRR), track cumulative coaching progress metrics.
                  </p>
                </div>
                <button onClick={() => handleSelectTab('analytics')} className="font-mono text-[10px] font-bold uppercase text-slate-900 mt-4 hover:underline text-left flex items-center gap-1 cursor-pointer">
                  Launch Analytics Board &rarr;
                </button>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setActiveTab('demo')}
                className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white text-xs uppercase font-extrabold tracking-wider transition-all cursor-pointer rounded-xl shadow-md"
              >
                Test Blueprint On Your Business Now &rarr;
              </button>
            </div>
          </div>
        )}

        {/* TAB CONTENT B: ASSESSMENT WORKFLOW DEMO */}
        {activeTab === 'demo' && (
          <div className="space-y-6 animate-fadeIn text-slate-800">
            {/* STEP 1: INITIAL INFORMATION */}
            {demoStep === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setDemoStep(2); }} className="space-y-6 max-w-3xl mx-auto bg-[#F8FAFC]/70 p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-xs">
                <div className="border-b border-zinc-200 pb-4 mb-4 flex justify-between items-center -mx-6 -mt-6 md:-mx-8 md:-mt-8 p-4.5 bg-slate-100 select-none">
                  <span className="font-mono text-[10px] text-slate-600 font-bold tracking-wider">⚡ ASSESSMENT PROTOCOL / SECTION 1 OF 3</span>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold uppercase">ENTITY IDENTIFICATION</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide">Company Name / Entity Title</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Nexus Automated Agency"
                      required
                      className="w-full px-4 py-3 bg-white border border-zinc-200/80 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 placeholder:text-zinc-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide">Primary Industry / Sector</label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-200/85 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 appearance-none"
                    >
                      <option value="SaaS & Software">SaaS & Software Engineering</option>
                      <option value="Digital Marketing Agency">Digital Marketing Agency</option>
                      <option value="Traditional Enterprise">Traditional Operations / Enterprise</option>
                      <option value="E-Commerce & Retail">E-Commerce & Retail Sales</option>
                      <option value="Financial Operations">Financial Management & Services</option>
                      <option value="Creative Studio & Writing">Creative Production & Content</option>
                      <option value="Other High-overhead Sector">Other High-Overhead Sector</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] uppercase font-bold transition-all rounded-lg cursor-pointer flex items-center gap-2"
                  >
                    CONTINUE PROTOCOL <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: METRICS & WORKFLOW PREFERENCES */}
            {demoStep === 2 && (
              <div className="max-w-3xl mx-auto bg-[#F8FAFC]/70 p-6 md:p-8 rounded-2xl border border-zinc-200 shadow-xs">
                <div className="border-b border-zinc-200 pb-4 mb-4 flex justify-between items-center -mx-6 -mt-6 md:-mx-8 md:-mt-8 p-4.5 bg-slate-100">
                  <span className="font-mono text-[10px] text-slate-600 font-bold tracking-wider">⚡ ASSESSMENT PROTOCOL / SECTION 2 OF 3</span>
                  <button onClick={() => setDemoStep(1)} className="text-[10px] font-mono font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer">
                    <ChevronLeft className="w-3.5 h-3.5" /> BACK
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide">Company Scale (Employee Count)</label>
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-200/85 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 appearance-none"
                    >
                      <option value="Solo/Small">Solo / Lean Startup (Under 25 staff)</option>
                      <option value="Medium">Medium Scaling Team (25 - 150 staff)</option>
                      <option value="Enterprise">Enterprise Structure (150+ staff / partners)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide">Existing organizational AI expertise</label>
                    <select
                      value={aiExperience}
                      onChange={(e) => setAiExperience(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-200/85 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 appearance-none"
                    >
                      <option value="None">None (Purely manual spreadsheets & emails)</option>
                      <option value="Basic">Basic (Casual ChatGPT copy-paste templates)</option>
                      <option value="Experienced">Experienced (API automated triggers & slack logs)</option>
                      <option value="Advanced">Advanced (Custom vector databases & parameters)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide">
                      Describe tools in use & your current infrastructure 
                    </label>
                    <textarea
                      value={infraDescription}
                      onChange={(e) => setInfraDescription(e.target.value)}
                      placeholder="e.g., We track clients in spreadsheets, route manuals to Jira, write onboarding briefs with copy-paste notes."
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-zinc-200/80 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 placeholder:text-zinc-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase text-slate-700 tracking-wide">
                      Primary organizational bottleneck you want optimized
                    </label>
                    <textarea
                      value={bottleneckDescription}
                      onChange={(e) => setBottleneckDescription(e.target.value)}
                      placeholder="e.g., Manually setting up each client folder and routing tickets takes 4 hours, slowing our active turnaround times by days."
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-white border border-zinc-200/80 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 placeholder:text-zinc-400"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 text-xs">
                  <button
                    type="button"
                    onClick={() => setDemoStep(1)}
                    className="px-4 py-2 font-mono uppercase font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    REVISE BASICS
                  </button>
                  <button
                    onClick={handleStartDemo}
                    className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-mono uppercase font-bold transition-all rounded-lg cursor-pointer flex items-center gap-2 shadow-sm"
                  >
                    LAUNCH TRANSITION ROADMAP NOW ⚡
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: LOADING TRANSITION PROTOCOL */}
            {demoStep === 3 && (
              <div className="max-w-xl mx-auto bg-slate-50 text-slate-800 p-10 text-center space-y-6 rounded-xl border border-zinc-200 shadow-sm">
                <div className="w-12 h-12 border-3 border-dashed border-slate-900 rounded-full animate-spin mx-auto flex items-center justify-center">
                  <span className="text-sm">⚡</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-xs font-mono text-slate-900 uppercase font-black tracking-widest animate-pulse">
                    COMPILING TRANSITION ROADMAP...
                  </h4>
                  <p className="font-mono text-[10px] text-slate-500">
                    {loadingMsg}
                  </p>
                </div>

                {/* Progress Gauge */}
                <div className="w-full bg-slate-200 border border-zinc-300 h-5 relative overflow-hidden rounded-md">
                  <div 
                    className="bg-slate-900 h-full transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-900 font-extrabold bg-white px-1.5 py-0.5 rounded leading-none select-none">
                    {loadingProgress}% ANALYSIS COMPLETE
                  </span>
                </div>
              </div>
            )}

            {/* STEP 4: DIAGNOSTIC REPORT RESULTS */}
            {demoStep === 4 && (
              <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn text-slate-850">
                <div className="bg-white p-6 rounded-2xl border border-zinc-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
                  <div className="space-y-1">
                    <div className="inline-block px-2.5 py-0.5 bg-slate-100 text-slate-700 border border-zinc-200 text-[8px] font-bold font-mono uppercase tracking-wider mb-1 rounded">
                      ● STRATEGIC BRIEFING DISPATCH
                    </div>
                    <h4 className="text-xl font-extrabold uppercase text-[#0F172A] tracking-tight">
                      Tactical transition briefing: {companyName || 'Incognitos'}
                    </h4>
                    <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wide">
                      OPERATIONAL INTEGRATION AGENDA // CONFIDENTIAL BLUEPRINT
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 md:gap-3">
                    <button
                      onClick={handleCopyToClipboard}
                      className="px-4 py-2 bg-white border border-zinc-250 text-[#0F172A] rounded-lg font-mono text-[9px] uppercase font-bold hover:bg-slate-50 transition-colors cursor-pointer select-none"
                    >
                      {copySuccess ? '✓ DISPATCH COPIED' : '📝 COPY DISPATCH'}
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-mono text-[9px] uppercase font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" /> DOWNLOAD PDF
                    </button>
                    <button
                      onClick={handleResetDemo}
                      className="px-4 py-2 bg-white border border-zinc-200 text-rose-600 rounded-lg font-mono text-[9px] uppercase font-bold hover:border-rose-350 hover:bg-rose-50/50 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> RE-DIAGNOSE
                    </button>
                  </div>
                </div>

                {/* Summary Grid Panels & Main document display */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Diagnostic Panel */}
                  <div className="lg:col-span-4 bg-slate-50/80 border border-zinc-205 p-5 space-y-6 rounded-2xl shadow-sm">
                    <div className="text-center pb-4 border-b border-zinc-200/80">
                      <span className="font-mono text-[9px] text-zinc-500 uppercase font-bold">TRANSITION VELOCITY SCORE</span>
                      <div className="text-4xl font-extrabold tracking-tight text-slate-900 my-2">58<span className="text-xs font-mono text-zinc-400">/100</span></div>
                      <div className="w-full bg-[#E2E8F0] h-3 overflow-hidden rounded-md relative">
                        <div className="bg-slate-900 h-full" style={{ width: '58%' }}></div>
                      </div>
                      <p className="text-[8.5px] text-amber-700 font-mono font-bold uppercase mt-2">● SYSTEM OVERHEAD REARRANGE OPTIONAL</p>
                    </div>

                    <div className="space-y-4 text-xs font-semibold">
                      <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-1">AUDITED PARAMETERS</p>
                      <div className="flex justify-between items-center bg-white border border-zinc-200 p-2.5 rounded-lg text-[10px]">
                        <span className="text-zinc-500 font-mono">INDUSTRY:</span>
                        <span className="text-slate-800 font-bold uppercase">{industry}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white border border-zinc-200 p-2.5 rounded-lg text-[10px]">
                        <span className="text-zinc-500 font-mono">CREW SIZE:</span>
                        <span className="text-slate-800 font-bold uppercase">{companySize}</span>
                      </div>
                      <div className="flex justify-between items-center bg-white border border-zinc-200 p-2.5 rounded-lg text-[10px]">
                        <span className="text-zinc-500 font-mono">AI EXPERIENCE:</span>
                        <span className="text-slate-800 font-bold uppercase">{aiExperience}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Dynamic Report Display */}
                  <div className="lg:col-span-8 border border-zinc-200 p-6 md:p-8 bg-white rounded-2xl relative min-h-[450px] shadow-sm">
                    <div className="absolute top-2.5 right-4 font-mono text-[8.5px] text-emerald-700 bg-emerald-50 border border-emerald-150 px-2.5 py-0.5 rounded font-bold uppercase">
                      🔒 AUTHENTICATED ROADMAP ACTIVE
                    </div>
                    
                    <div className="prose prose-slate max-w-none text-slate-800 text-xs">
                      <MarkdownDisplay text={generatedReport} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
