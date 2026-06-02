import React, { useState, useEffect, useRef } from 'react';
import { COACHES } from '../data/mockData';
import { CoachId, Message } from '../types';
import { Send, Cpu, CheckCircle } from 'lucide-react';

export default function AICoaches() {
  const [selectedCoachId, setSelectedCoachId] = useState<CoachId>('general');
  const [messages, setMessages] = useState<Record<CoachId, Message[]>>({
    general: [
      { id: '1', sender: 'coach', text: COACHES.general.welcomeMessage, timestamp: '10:00 AM' }
    ],
    career: [
      { id: '1', sender: 'coach', text: COACHES.career.welcomeMessage, timestamp: '10:01 AM' }
    ],
    leadership: [
      { id: '1', sender: 'coach', text: COACHES.leadership.welcomeMessage, timestamp: '10:02 AM' }
    ],
    learning: [
      { id: '1', sender: 'coach', text: COACHES.learning.welcomeMessage, timestamp: '10:03 AM' }
    ]
  });

  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeCoach = COACHES[selectedCoachId];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedCoachId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || loading) return;

    const userText = inputVal;
    setInputVal('');

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      timestamp: timeString
    };

    const currentHistory = [...messages[selectedCoachId], userMsg];
    setMessages(prev => ({
      ...prev,
      [selectedCoachId]: currentHistory
    }));

    setLoading(true);

    try {
      const response = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId: selectedCoachId,
          messages: currentHistory
        })
      });

      const data = await response.json();
      
      const responseMsg: Message = {
        id: Math.random().toString(),
        sender: 'coach',
        text: data.text || "An unexpected disconnect occurred. Try sending your inquiry again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => ({
        ...prev,
        [selectedCoachId]: [...currentHistory, responseMsg]
      }));

    } catch (error) {
      console.error("Failed to fetch coach response:", error);
      const systemErrorMsg: Message = {
        id: Math.random().toString(),
        sender: 'system',
        text: "Error connecting to AI Coach node. Secure gateway may be offline or rate-limited.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => ({
        ...prev,
        [selectedCoachId]: [...currentHistory, systemErrorMsg]
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-[#1E293B] animate-fadeIn" id="ai-coaches-container">
      {/* Sidebar selection */}
      <div className="lg:col-span-4 space-y-3.5">
        <div className="bg-white p-4.5 rounded-xl border border-zinc-200/80 shadow-xs">
          <h3 className="font-semibold text-xs text-slate-900 tracking-wider uppercase flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-700" />
            Advisory Directory
          </h3>
          <p className="text-[10px] text-zinc-400 mt-1 uppercase font-mono tracking-wider font-semibold">Select your active specialist</p>
        </div>

        <div className="space-y-2.5">
          {(Object.values(COACHES)).map((c) => {
            const isSelected = selectedCoachId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCoachId(c.id as CoachId)}
                className={`w-full text-left p-4.5 border transition-all cursor-pointer rounded-xl flex flex-col justify-between ${
                  isSelected 
                    ? 'border-zinc-900 text-slate-950 bg-white shadow-xs ring-1 ring-zinc-900' 
                    : 'bg-white/70 border-zinc-200/70 hover:border-zinc-305 hover:bg-white text-zinc-700 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9.5 h-9.5 rounded-lg flex items-center justify-center font-bold text-lg select-none ${
                    isSelected ? 'bg-zinc-950 text-white animate-pulse' : 'bg-zinc-100 text-zinc-800'
                  }`}>
                    {c.avatar}
                  </div>
                  <div>
                    <h4 className={`font-bold text-xs uppercase tracking-tight ${isSelected ? 'text-slate-950 font-extrabold' : 'text-zinc-850'}`}>{c.name}</h4>
                    <span className="font-mono text-[8.5px] uppercase tracking-wider text-zinc-400 font-semibold block mt-0.5">{c.tagline}</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-450 mt-3Leading leading-relaxed font-medium font-sans">{c.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main chat interface */}
      <div className="lg:col-span-8 flex flex-col bg-white border border-zinc-200/80 rounded-2xl min-h-[550px] relative overflow-hidden shadow-xs">
        {/* Active Coach display status */}
        <div className="border-b border-zinc-200/80 p-5 bg-zinc-50/20 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-zinc-50 border border-zinc-200/70 rounded-xl flex items-center justify-center text-xl font-bold font-sans">
              {activeCoach.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm uppercase tracking-tight text-slate-900 font-sans">{activeCoach.name}</h4>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase font-bold bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">Active</span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium font-sans mt-0.5">{activeCoach.specialty}</p>
            </div>
          </div>
          <div>
            <span className="px-2.5 py-1 bg-zinc-50 text-zinc-450 border border-zinc-200/80 rounded font-mono text-[9px] uppercase tracking-wider font-semibold">
              Client node proxy active
            </span>
          </div>
        </div>

        {/* Message board */}
        <div 
          ref={scrollRef}
          className="flex-1 p-6 space-y-6 overflow-y-auto max-h-[350px] min-h-[250px] bg-white border-b border-zinc-200/80"
        >
          {messages[selectedCoachId].map((msg) => {
            const isCoach = msg.sender === 'coach';
            const isSystem = msg.sender === 'system';

            if (isSystem) {
              return (
                <div key={msg.id} className="text-center mx-auto max-w-md bg-red-50 text-red-700 border border-red-200/80 p-2.5 text-[10.5px] font-mono rounded-lg">
                  {msg.text}
                </div>
              );
            }

            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isCoach ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
              >
                <div className={`w-8.5 h-8.5 rounded-lg border flex-shrink-0 flex items-center justify-center text-sm font-bold ${
                  isCoach ? 'bg-zinc-50 border-zinc-200 text-zinc-800' : 'bg-slate-900 border-transparent text-white'
                }`}>
                  {isCoach ? activeCoach.avatar : 'Me'}
                </div>
                <div className="space-y-1">
                  <div className={`p-4.5 border rounded-2xl ${
                    isCoach 
                      ? 'bg-zinc-50/70 border-zinc-200 text-slate-800' 
                      : 'bg-zinc-950 text-white border-transparent shadow-xs'
                  }`}>
                    <div className="text-[12.5px] whitespace-pre-wrap leading-relaxed select-text font-sans">
                      {msg.text}
                    </div>
                  </div>
                  <div className={`flex items-center gap-1.5 text-[8.5px] font-mono text-zinc-400 ${!isCoach && 'justify-end'}`}>
                    <span>{msg.timestamp}</span>
                    <span>•</span>
                    <span className="uppercase">{msg.sender === 'coach' ? activeCoach.name : msg.sender}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-[80%] mr-auto items-center animate-pulse">
              <div className="w-8.5 h-8.5 rounded-lg bg-zinc-50 border border-zinc-200 flex-shrink-0 flex items-center justify-center text-sm font-bold">
                {activeCoach.avatar}
              </div>
              <div className="p-4 bg-zinc-50 border border-zinc-200/80 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce delay-200" />
                  </div>
                  <span className="font-mono text-[9.5px] text-zinc-500 font-semibold uppercase tracking-wider pl-1">
                    Typing countermeasure...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-zinc-50/40 flex gap-3 items-center">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            disabled={loading}
            placeholder={`Instruct ${activeCoach.name} (e.g. "How do I automate data entries?")...`}
            className="flex-1 px-4.5 py-3.5 bg-white border border-zinc-200 text-[#1E293B] font-medium text-xs rounded-xl focus:outline-none focus:border-slate-800 transition-all focus:ring-1 focus:ring-slate-800 placeholder:text-zinc-400 font-sans shadow-inner"
          />
          <button
            type="submit"
            disabled={!inputVal.trim() || loading}
            className="px-5 py-3.5 bg-zinc-950 hover:bg-slate-850 text-white font-bold uppercase text-[10.5px] tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded-xl cursor-pointer shadow-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
