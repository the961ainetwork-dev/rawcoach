import React, { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { 
  Send, 
  Cpu, 
  CheckCircle, 
  Play, 
  RefreshCw, 
  Terminal, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

function SystemMarkdown({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <div className="space-y-2.5 text-left font-sans text-xs text-zinc-150 leading-relaxed font-semibold">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-2" />;

        // Handle Headings (###)
        if (trimmed.startsWith('####')) {
          const content = trimmed.substring(4).replace(/\*/g, '').trim();
          return (
            <h5 key={idx} className="font-mono text-[9px] uppercase font-bold text-zinc-400 tracking-wider mt-4 first:mt-1 border-b border-zinc-805 pb-1">
              {content}
            </h5>
          );
        }
        if (trimmed.startsWith('###')) {
          const content = trimmed.substring(3).replace(/\*/g, '').trim();
          return (
            <h4 key={idx} className="font-mono text-xs uppercase font-black text-[#9DFF00] tracking-tight mt-5 border-l-2 border-[#9DFF00] pl-3 py-0.5 bg-zinc-900 border border-zinc-800">
              {content}
            </h4>
          );
        }

        // Checklist items ([ ] or [x])
        if (trimmed.includes('[ ]') && (trimmed.startsWith('*') || trimmed.startsWith('-'))) {
          const idxBrace = trimmed.indexOf('[ ]');
          const content = trimmed.substring(idxBrace + 3).replace(/\*/g, '').trim();
          return (
            <div key={idx} className="flex items-center gap-2 ml-4 bg-zinc-900/60 border border-zinc-800 p-2 my-1">
              <span className="w-3.5 h-3.5 border border-zinc-700 bg-zinc-950 flex-shrink-0" />
              <p className="text-[11px] font-mono font-bold text-zinc-300">{content}</p>
            </div>
          );
        }

        // Bullet Lists (* text or - text)
        if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const content = trimmed.substring(2);
          const parts = content.split('**');
          return (
            <div key={idx} className="flex items-start gap-2 ml-2 my-1.5 animate-fadeIn">
              <span className="text-[#9DFF00] text-sm leading-none mt-0.5 select-none">•</span>
              <p className="flex-1 text-xs text-zinc-250">
                {parts.map((p, pIdx) => {
                  return pIdx % 2 === 1 ? <strong key={pIdx} className="font-extrabold text-white text-[11.5px] bg-zinc-905 px-1 rounded">{p}</strong> : p;
                })}
              </p>
            </div>
          );
        }

        // Bold formatting
        if (trimmed.includes('**')) {
          const parts = trimmed.split('**');
          return (
            <p key={idx} className="text-xs leading-normal text-zinc-200">
              {parts.map((p, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-[#9DFF00]">{p}</strong> : p)}
            </p>
          );
        }

        // Italic line
        let paragraphText = trimmed;
        if (paragraphText.startsWith('*') && paragraphText.endsWith('*')) {
          paragraphText = paragraphText.replace(/\*/g, '');
          return <p key={idx} className="text-xs text-zinc-400 font-semibold italic leading-normal">{paragraphText}</p>;
        }

        return <p key={idx} className="text-xs font-semibold text-zinc-200 leading-normal select-all">{paragraphText}</p>;
      })}
    </div>
  );
}

interface SystemDiagnosticsProps {
  onStartProtocol: (tab?: 'ceo-coaching' | 'copilot-workspace') => void;
}

interface ChatMessage {
  id: string;
  sender: 'system' | 'user';
  text: string;
  timestamp: string;
}

export default function SystemDiagnostics({ onStartProtocol }: SystemDiagnosticsProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [bottleneck, setBottleneck] = useState('');
  const [struggles, setStruggles] = useState('');
  const [finalReport, setFinalReport] = useState('');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const addSystemMessage = (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), sender: 'system', text, timestamp: time }
    ]);
  };

  const startDiagnostic = () => {
    setStep(1);
    setMessages([]);
    setFinalReport('');
    setBottleneck('');
    setStruggles('');
    
    addSystemMessage(
      "⚡ **DIAGNOSTIC CHANNEL INITIALIZED** // Source: theCsuiteCOACH sovereign node.\n\n" +
      "Our sole purpose is to convert your operational \"uncertainty\" into a precise, high-stakes **Turnkey Automation Roadmap**.\n\n" +
      "**STEP 1: The Friction Audit** 💀\n" +
      "Describe your biggest daily \"bottleneck\" or source of stress. What is holding back your team's velocity? *(Constraint: Keep it under 100 words, habibi.)*"
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput('');

    // Add user message to log
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      { id: Math.random().toString(), sender: 'user', text: userText, timestamp: time }
    ]);

    setLoading(true);

    if (step === 1) {
      setBottleneck(userText);
      // Wait a bit to simulate processing, then transition to Step 2
      setTimeout(() => {
        addSystemMessage(
          "📥 **FRICTION NODE RECORDED AND REGISTERED.**\n\n" +
          "**STEP 2: The Data Mapping** 📊\n" +
          "What data systems, pipelines, or reporting flows are you currently struggling with? *(e.g. manual spreadsheets, outdated reports, lack of market intelligence, or communication siloes)*"
        );
        setStep(2);
        setLoading(false);
      }, 900);
    } else if (step === 2) {
      setStruggles(userText);
      
      // Let's call our backend API to generate the solution report using Gemini
      try {
        const response = await fetch('/api/coach/diagnostic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            bottleneck: bottleneck,
            struggles: userText
          })
        });

        const data = await response.json();
        
        // Add artificial breathing delay for terminal output sync effect
        setTimeout(() => {
          setFinalReport(data.report);
          setStep(3);
          setLoading(false);
        }, 1200);

      } catch (err) {
        console.error("Diagnostic error:", err);
        // Fallback simulated report
        setTimeout(() => {
          const fallback = `### SYSTEM DIAGNOSTICS COMPLETE.

**Status**: Heavy friction around manual administration and spreadsheets.
**Diagnosis**: You are spending prime intellectual hours fighting spreadsheets instead of locking in customers, habibi.

#### Deployment Plan:

* **Phase 1 (The Vibe Check)**: Spin up a serverless capturing web hook to auto-parse inbound files in 24 hours.
* **Phase 2 (The Agentic Swarm)**: Deploy an AI Research Agent (using gemini-3.5-flash) to scrape system logs and output direct actionable targets into Slack.
* **Phase 3 (The Sovereign Scale)**: Align this workspace with active digital logs to automate 70% of lead data overheads.

**Verdict**: We can bypass standard Beirut delays and automate 70% of your current manual workflow by the end of the week.

***

Ready to deploy? Initialize the workflow here [Initialize Deployment Protocol]`;
          setFinalReport(fallback);
          setStep(3);
          setLoading(false);
        }, 1200);
      }
    }
  };

  return (
    <div className="bg-slate-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative" id="system-diagnostics-suite">
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
      
      {/* Console Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-rose-500 animate-pulse" />
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold leading-none">PRE-FLIGHT STRETCH</span>
            <h3 className="text-white text-xs font-black uppercase tracking-wider font-mono mt-0.5">
              System Diagnostics: From Chaos to Code
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#9DFF00] animate-ping"></span>
          <span className="text-[9px] font-mono text-[#9DFF00] font-black uppercase tracking-widest">LIVE_DIAGNOSTIC_BOT</span>
        </div>
      </div>

      {step === 0 ? (
        /* Landing/Intro Screen */
        <div className="p-8 text-center space-y-6 max-w-2xl mx-auto py-14">
          <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
            <Cpu className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
              STOP REJECTING EFFICIENCY
            </h4>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed max-w-lg mx-auto font-sans font-medium">
              Our sole purpose is to convert your daily uncertainty into a precise, battle-hardened <strong className="text-white font-bold">"Turnkey Automation Roadmap."</strong> Take our 3-step diagnostic right now, absolutely no-cap.
            </p>
          </div>

          <button
            onClick={startDiagnostic}
            className="px-6 py-3 bg-[#9DFF00] hover:bg-[#86d900] active:scale-[0.98] text-slate-950 font-mono text-[10px] uppercase font-black tracking-widest transition-all rounded-xl cursor-pointer shadow flex items-center justify-center gap-2 mx-auto"
          >
            <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
            Initialize Diagnostic Matrix
          </button>
        </div>
      ) : (
        /* Active Diagnostic Chat Screen */
        <div className="flex flex-col h-[460px] bg-slate-950 text-white font-mono">
          
          {/* Scrollable chat display area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs scrollbar-thin scrollbar-thumb-zinc-800">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1 animate-fadeIn`}
              >
                <div className={`max-w-[85%] px-4 py-3 rounded-xl border text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-zinc-900 border-zinc-700 text-white' 
                    : 'bg-zinc-950/20 border-zinc-800 text-zinc-100'
                }`}>
                  <SystemMarkdown text={msg.text} />
                </div>
                <span className="text-[8px] text-zinc-600 font-bold px-1">{msg.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 text-zinc-500 font-mono text-[10px] pl-2 py-1">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>theCsuiteCOACH backend is parsing nodes...</span>
              </div>
            )}

            {/* Final interactive Turnkey solutions section */}
            {step === 3 && finalReport && (
              <div className="p-5 bg-zinc-900/65 border border-zinc-800 rounded-xl space-y-4 animate-scaleUp">
                <div className="flex items-center gap-2 text-[#9DFF00] border-b border-zinc-800 pb-2.5">
                  <CheckCircle className="w-4 h-4 text-[#9DFF00]" />
                  <span className="font-extrabold uppercase text-[10px] tracking-widest">SOVEREIGN ROUTING DECIDED</span>
                </div>
                
                <div className="text-zinc-300 leading-relaxed font-sans space-y-2 text-xs select-all markdown-body">
                  <SystemMarkdown text={finalReport} />
                </div>

                {/* Styled Call To Action */}
                <div className="bg-slate-950 border border-zinc-800 p-4 rounded-xl space-y-3.5">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-sans font-semibold text-zinc-350 leading-relaxed">
                      Habibi, this roadmap requires certified credentials to implement. Let's start your dedicated Alpha setup to secure the cloud database.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => onStartProtocol('ceo-coaching')}
                    className="w-full py-3 bg-[#9DFF00] hover:bg-[#86d900] text-slate-950 font-mono text-[10px] uppercase font-black tracking-widest rounded-lg transition-transform active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    🚀 Initialize Deployment Protocol
                  </button>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Form input line */}
          {step < 3 && (
            <form onSubmit={handleSend} className="p-3 bg-zinc-900/40 border-t border-zinc-800/80 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                placeholder={
                  step === 1 ? "Enter your daily stress bottleneck..." : "Describe files, databases or sheets you handle manually..."
                }
                className="flex-1 bg-zinc-950 border border-zinc-800 px-3 py-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 rounded-lg"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-4.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 text-white rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Controls toolbar */}
          <div className="bg-zinc-950 p-2.5 px-4 border-t border-zinc-900 flex justify-between items-center text-[8px] text-zinc-500 tracking-wider">
            <span>STAGES: {step}/3</span>
            <button 
              type="button" 
              onClick={startDiagnostic}
              className="hover:text-white transition-colors uppercase font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" /> Restart Diagnostics
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
