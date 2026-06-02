import React, { useState, useRef, useEffect } from 'react';
import { SCENARIOS } from '../data/mockData';
import { Scenario, Message } from '../types';
import { Sparkles, Play, Send, Trophy, BookOpen, ChevronLeft } from 'lucide-react';

export default function RoleplaySimulator() {
  const [selectedScenarioId, setSelectedScenarioId ] = useState(SCENARIOS[0].id);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [dialogHistory, setDialogHistory] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [evalResult, setEvalResult] = useState<string | null>(null);
  const [auditing, setAuditing] = useState(false);

  const activePreset = SCENARIOS.find(s => s.id === selectedScenarioId) || SCENARIOS[0];
  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [dialogHistory]);

  const handleStart = () => {
    setActiveScenario(activePreset);
    setDialogHistory([
      {
        id: 'init',
        sender: 'coach',
        text: activePreset.initialMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setEvalResult(null);
  };

  const handleReset = () => {
    setActiveScenario(null);
    setDialogHistory([]);
    setEvalResult(null);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isSending || !activeScenario) return;

    const userText = userInput;
    setUserInput('');

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      timestamp: timeStr
    };

    const currentHistory = [...dialogHistory, userMsg];
    setDialogHistory(currentHistory);
    setIsSending(true);

    try {
      const payloadMessages = [
        {
          sender: 'system',
          text: `You are roleplaying as: ${activeScenario.aiPersona}. Provide your response representing this stakeholder. Be skeptical, sharp, and focused on operational metrics context: ${activeScenario.context}. Ask tricky buy-in or delivery questions. Keep responses under 2-3 sentences max.`,
          id: 'sys-prompt'
        },
        ...currentHistory
      ];

      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId: 'general',
          messages: payloadMessages
        })
      });

      const data = await res.json();
      
      const stakeholderMsg: Message = {
        id: Math.random().toString(),
        sender: 'coach',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setDialogHistory([...currentHistory, stakeholderMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: Math.random().toString(),
        sender: 'system',
        text: "Stakeholder is considering this... (Error connecting, please retry sending message)",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setDialogHistory([...currentHistory, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handleRunAudit = async () => {
    if (dialogHistory.length < 2) return;
    setAuditing(true);
    setEvalResult(null);

    const transcript = dialogHistory.map(m => `${m.sender === 'user' ? 'Me' : 'Stakeholder'}: ${m.text}`).join("\n");

    try {
      const res = await fetch('/api/roleplay/eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript,
          scenarioTitle: activeScenario?.title,
          scenarioContext: activeScenario?.context
        })
      });

      const data = await res.json();
      setEvalResult(data.evaluation);
    } catch (err) {
      console.error(err);
      setEvalResult("Failed to generate audit score. Network disconnect occurred.");
    } finally {
      setAuditing(false);
    }
  };

  function auditResultAvailable() {
    return evalResult !== null;
  }

  return (
    <div className="space-y-8 text-[#1E293B] animate-fadeIn" id="roleplay-simulator-view">
      {!activeScenario ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Preset scenarios list */}
          <div className="lg:col-span-7 bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="border-b border-zinc-200/80 pb-4">
              <h3 className="font-semibold text-xs text-rose-600 tracking-wider uppercase flex items-center gap-1.5 font-mono">
                <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" /> Alignment stress tests
              </h3>
              <h4 className="text-xl font-extrabold text-slate-900 mt-1 uppercase leading-tight font-sans">Practice Stakeholder Discussions</h4>
            </div>

            <div className="space-y-3.5">
              {SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedScenarioId(s.id)}
                  className={`w-full text-left p-4.5 border transition-all cursor-pointer rounded-xl flex flex-col justify-between ${
                    selectedScenarioId === s.id
                      ? 'border-zinc-950 text-slate-950 bg-zinc-50/50 shadow-xs ring-1 ring-zinc-950'
                      : 'bg-white border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50/20 text-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center flex-wrap gap-2 mb-2">
                    <span className="font-bold text-xs uppercase tracking-tight text-slate-900 font-sans">{s.title}</span>
                    <span className={`text-[8.5px] uppercase font-mono px-2 py-0.5 rounded font-bold border ${
                      s.difficulty === 'Savage' ? 'bg-red-50 text-red-700 border-red-200' :
                      s.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {s.difficulty} MODE
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">{s.description}</p>
                </button>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-3.5 bg-zinc-950 hover:bg-slate-850 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm"
            >
              <Play className="w-4 h-4" /> Start Simulation
            </button>
          </div>

          {/* Quick Guide */}
          <div className="lg:col-span-5 bg-white border border-zinc-200/80 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
            <div className="space-y-6">
              <div className="border-b border-zinc-205 pb-4">
                <h4 className="font-extrabold text-xs text-slate-905 uppercase tracking-wide font-sans">Simulator Benchmarks</h4>
              </div>
              <p className="text-[11px] text-zinc-500 leading-relaxed font-sans">
                Most technical strategies succeed or crash not because of model architecture failures, but because of human developer-to-executive alignment breakdowns. Testing your pitch with simulated stakeholders builds high-agency persuasion skills.
              </p>

              <div className="space-y-4 text-[11px] text-zinc-700">
                <div className="flex gap-3">
                  <div className="font-bold text-xs text-rose-500">01</div>
                  <div className="leading-relaxed font-sans text-[11.5px] text-zinc-600">Select an upcoming stakeholder conversation hurdle on the left.</div>
                </div>
                <div className="flex gap-3">
                  <div className="font-bold text-xs text-rose-500">02</div>
                  <div className="leading-relaxed font-sans text-[11.5px] text-zinc-600">Interact naturally by drafting your responses, handling their objections.</div>
                </div>
                <div className="flex gap-3">
                  <div className="font-bold text-xs text-rose-500">03</div>
                  <div className="leading-relaxed font-sans text-[11.5px] text-zinc-600">Trigger standard scorecard evaluation via Gemini models once finished.</div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-200 font-mono text-[8px] text-zinc-400 uppercase tracking-wider font-semibold">
              Power analytics model: Gemini Series
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Active dialogue room */}
          <div className="lg:col-span-8 flex flex-col bg-white border border-zinc-200/80 rounded-2xl min-h-[480px] overflow-hidden shadow-xs">
            {/* Header info */}
            <div className="p-4 bg-zinc-50/40 border-b border-zinc-200/80 flex justify-between items-center flex-wrap gap-2">
              <div>
                <span className="font-mono text-[8.5px] uppercase font-bold text-rose-600 tracking-wider">Practice discussion active</span>
                <h3 className="font-extrabold text-sm uppercase text-slate-905 mt-0.5 font-sans">{activeScenario.title}</h3>
              </div>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg text-zinc-650 font-mono text-[9px] font-bold flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Back
              </button>
            </div>

            {/* Simulated message stream */}
            <div 
              ref={chatScrollRef}
              className="flex-1 p-5 space-y-4 max-h-[300px] min-h-[220px] overflow-y-auto bg-white"
            >
              <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-[11px] text-rose-950 font-sans leading-relaxed">
                <strong className="text-rose-800">Persona Profile:</strong> {activeScenario.aiPersona} <br/> <strong className="text-rose-800">Objection Background:</strong> {activeScenario.context}
              </div>

              {dialogHistory.map((m, i) => {
                const isStakeholder = m.sender === 'coach';
                return (
                  <div key={i} className={`flex gap-3 max-w-[85%] ${isStakeholder ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 ${
                      isStakeholder ? 'bg-zinc-100 border-zinc-200 text-zinc-850' : 'bg-zinc-950 text-white border-transparent'
                    }`}>
                      {isStakeholder ? '👤' : 'Me'}
                    </div>
                    <div className="space-y-1">
                      <div className={`p-4 border rounded-2xl text-[11.5px] leading-relaxed font-medium ${
                        isStakeholder ? 'bg-zinc-50/80 border-zinc-200 text-zinc-800 font-sans' : 'bg-zinc-950 text-white border-transparent shadow-xs'
                      }`}>
                        {m.text}
                      </div>
                      <div className="text-[8.5px] text-zinc-400 font-mono mt-0.5 uppercase flex justify-end font-semibold">
                        {m.timestamp}
                      </div>
                    </div>
                  </div>
                );
              })}

              {isSending && (
                <div className="flex gap-2 mr-auto items-center animate-pulse">
                  <div className="w-8.5 h-8.5 rounded-lg bg-zinc-50 border border-zinc-200 flex-shrink-0 flex items-center justify-center text-sm font-bold">💬</div>
                  <div className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl text-[9px] font-mono text-zinc-500 font-semibold uppercase tracking-wider">
                    Stakeholder drafting critical response...
                  </div>
                </div>
              )}
            </div>

            {/* Input & Audit Actions */}
            <div className="p-3.5 bg-zinc-50/40 border-t border-zinc-200/80 flex flex-col sm:flex-row gap-3 items-center">
              <form onSubmit={handleSend} className="flex-1 flex gap-2 w-full">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  disabled={isSending || auditResultAvailable()}
                  placeholder="Draft your convincing reply..."
                  className="flex-1 px-4 py-3 bg-white border border-zinc-200 rounded-lg text-xs text-[#1E293B] focus:outline-none focus:border-slate-800 placeholder:text-zinc-400 font-sans shadow-inner"
                />
                <button
                  type="submit"
                  disabled={isSending || !userInput.trim() || auditResultAvailable()}
                  className="px-4.5 py-3 bg-zinc-950 hover:bg-slate-850 text-white font-extrabold uppercase text-[10px] tracking-wider rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                >
                  Send
                </button>
              </form>

              <button
                onClick={handleRunAudit}
                disabled={dialogHistory.length < 2 || auditing}
                className="px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white hover:shadow-xs rounded-lg font-bold text-[10px] uppercase transition-all tracking-wider cursor-pointer flex items-center gap-2 justify-center disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                <Trophy className="w-3.5 h-3.5" /> Score Audit
              </button>
            </div>
          </div>

          {/* Evaluation outcome display */}
          <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-5 rounded-2xl shadow-xs space-y-4">
            <div className="border-b border-zinc-200/80 pb-3 text-center">
              <h4 className="font-bold text-xs uppercase text-slate-905 tracking-wider font-sans">Critique Scorecard</h4>
            </div>

            {auditing ? (
              <div className="py-20 text-center space-y-4 animate-pulse">
                <div className="w-8 h-8 rounded-full border border-zinc-300 border-t-zinc-900 animate-spin mx-auto"></div>
                <p className="font-mono text-[9px] text-zinc-500 font-semibold uppercase tracking-wider">Evaluating dialogue balance...</p>
              </div>
            ) : evalResult ? (
              <div className="space-y-4 select-text">
                <div className="text-[11.5px] leading-relaxed whitespace-pre-wrap select-text text-zinc-700 font-sans">
                  {evalResult}
                </div>
                <button
                  onClick={handleReset}
                  className="w-full py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border-transparent font-mono text-[9px] font-bold uppercase tracking-wider rounded-lg cursor-pointer"
                >
                  Setup Another Discussion
                </button>
              </div>
            ) : (
              <div className="py-16 text-center text-zinc-500 space-y-3 select-none">
                <BookOpen className="w-8 h-8 mx-auto text-zinc-300" />
                <p className="text-[10px] font-mono uppercase tracking-wider font-bold text-zinc-400">Needs Dialogue History</p>
                <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans">Exchange at least 2 messages on the left, then trigger "Score Audit" to request an evaluation.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
