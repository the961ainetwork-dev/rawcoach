import React, { useState, useEffect, useRef } from 'react';
import { Send, Smartphone, Battery, Wifi, ShieldCheck } from 'lucide-react';
import { Message } from '../types';

export default function PhoneSimulator() {
  const [unlocked, setUnlocked] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', sender: 'coach', text: 'Yo. RAW-MOBILE active. Throw me your startup bottleneck or deployment glitch, let\'s resolve it now.', timestamp: '12:00 PM' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const mScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mScrollRef.current) {
      mScrollRef.current.scrollTop = mScrollRef.current.scrollHeight;
    }
  }, [messages, unlocked]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: userText,
      timestamp: timeStr
    };

    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    setLoading(true);

    try {
      const res = await fetch('/api/coach/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId: 'general',
          messages: currentHistory
        })
      });

      const data = await res.json();
      const botMsg: Message = {
        id: Math.random().toString(),
        sender: 'coach',
        text: data.text || "Operational loop finished. Throw me your next prompt.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...currentHistory, botMsg]);
    } catch (err) {
      const fallbackMsg: Message = {
        id: Math.random().toString(),
        sender: 'coach',
        text: "Error syncing mobile websocket. Remember: Speed is power! Automate Salesforce triggers with Node, no cap. 🚀",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...currentHistory, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-zinc-900 animate-fadeIn" id="phone-simulator-section">
      {/* Informative Grid Row */}
      <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="border-b border-zinc-200 pb-4">
            <h3 className="font-mono text-xs uppercase text-black font-black tracking-widest flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-black" /> MOBILE CO-PILOT DEPLOYMENT
            </h3>
            <h4 className="text-xl font-extrabold text-black mt-1 uppercase">THE RAW-MOBILE SIMULATOR</h4>
          </div>

          <p className="text-[11px] text-zinc-650 font-mono leading-relaxed">
            The RAWCOACH client app for iOS and Android is engineered for maximum speed. It excludes heavy web components and focuses purely on high-frequency, raw-text feedback channels. We deliver tactical advice direct to your home screen.
          </p>

          <div className="space-y-3 font-mono text-[10px] text-zinc-700">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-black rounded-full animate-pulse"></div>
              <span className="uppercase tracking-wide">ZERO OVERHEAD PUSH NOTIFICATIONS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
              <span className="uppercase tracking-wide">REAL-TIME PIPELINE MONITORING</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
              <span className="uppercase tracking-wide">DIRECT EX-VETTED ADVISOR HOTLINE</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-4 font-mono text-[9px] tracking-widest space-y-1 rounded-xl mt-6">
          <p className="font-bold text-zinc-500">DOWNLOADABLE SAAS CLIENT V24.1:</p>
          <div className="flex items-center gap-1.5 text-black font-extrabold text-[9.5px]">
            <ShieldCheck className="w-3.5 h-3.5 text-black" /> SIGNATURE VERIFIED
          </div>
        </div>
      </div>

      {/* Floating iPhone Emulator Frame */}
      <div className="lg:col-span-7 flex justify-center">
        <div className="w-80 h-[580px] bg-zinc-50 p-3.5 rounded-[48px] border-2 border-black relative shadow-lg flex flex-col justify-between overflow-hidden">
          
          {/* Dynamic Island Header notch */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-white rounded-full flex items-center justify-between px-3.5 z-30 border border-zinc-200">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300"></div>
            <div className="w-12 h-1 bg-zinc-100 rounded-lg"></div>
          </div>

          {/* Screen Content Container */}
          <div className="flex-1 bg-white rounded-[36px] overflow-hidden flex flex-col relative text-zinc-900 border border-zinc-200">
            
            {/* Battery, Wifi display top bars */}
            <div className="p-3 pt-6 flex justify-between items-center text-[8.5px] font-mono font-bold text-black z-20">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1.5 bg-transparent animate-pulse">
                <Wifi className="w-3 h-3 text-black" />
                <Battery className="w-3.5 h-3.5 text-black" />
              </div>
            </div>

            {!unlocked ? (
              /* Lock Screen */
              <div className="flex-1 flex flex-col justify-between items-center p-6 text-center select-none bg-gradient-to-b from-white to-zinc-50">
                <div className="pt-12 space-y-3">
                  <span className="text-4xl block select-none">📱</span>
                  <p className="font-mono text-[8px] uppercase tracking-widest text-zinc-400 font-extrabold">RAWCOACH APP SUITE</p>
                  <h4 className="text-black font-extrabold text-lg uppercase tracking-wider">ON-THE-GO ADVICE</h4>
                </div>

                <div className="space-y-4 w-full">
                  <div className="bg-zinc-50 p-3.5 rounded-xl border border-zinc-200 text-left">
                    <p className="font-mono text-[7.5px] text-zinc-500 uppercase font-bold tracking-wider">LATEST TRANSMISSION</p>
                    <p className="text-[10px] text-zinc-800 mt-1 font-mono leading-relaxed font-semibold">"Stop manual database scaling, trigger our serverless task force immediately."</p>
                  </div>

                  <button
                    onClick={() => setUnlocked(true)}
                    className="w-full py-3 bg-black hover:bg-zinc-805 text-white font-mono text-[9px] font-black tracking-widest uppercase rounded-lg transition-all cursor-pointer"
                  >
                    TAP TO ACTIVATE ⚡
                  </button>
                </div>
              </div>
            ) : (
              /* Live Chat App */
              <div className="flex-1 flex flex-col h-full justify-between bg-white overflow-hidden">
                {/* Micro App Header */}
                <div className="bg-zinc-50 border-b border-zinc-200 p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border border-zinc-200 bg-white rounded flex items-center justify-center font-bold text-[10px]">
                      🦖
                    </div>
                    <div>
                      <h5 className="font-extrabold text-[9.5px] uppercase text-black leading-none">RAWCOACH MOBILE</h5>
                      <span className="font-mono text-[7px] text-zinc-500 font-bold uppercase leading-none block mt-0.5 tracking-wider">AUTHENTICATED</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setUnlocked(false)}
                    className="text-[7.5px] font-mono text-zinc-400 hover:text-black uppercase font-black tracking-wide cursor-pointer"
                  >
                    LOCK APP
                  </button>
                </div>

                {/* Smartphone Chat Area */}
                <div 
                  ref={mScrollRef}
                  className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[350px] bg-white bg-[radial-gradient(#e4e4e7_1.1px,transparent_1.1px)] [background-size:12px_12px] border-b border-zinc-200"
                >
                  {messages.map((m, idx) => {
                    const isBot = m.sender === 'coach';
                    return (
                      <div key={idx} className={`max-w-[85%] rounded-xl p-3 text-[10.5px] leading-relaxed font-semibold font-mono border ${
                        isBot 
                          ? 'bg-zinc-50 border-zinc-200 border-l-2 border-l-black text-zinc-800 mr-auto' 
                          : 'bg-black text-white border-transparent ml-auto'
                      }`}>
                        <p>{m.text}</p>
                        <span className={`block text-[7px] text-right mt-1 font-mono uppercase ${isBot ? 'text-zinc-400' : 'text-zinc-350'}`}>{m.timestamp}</span>
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="bg-zinc-50 border border-zinc-205 border-l-2 border-l-black text-black mr-auto max-w-[80%] rounded-xl p-2.5 text-[8px] font-mono font-black uppercase tracking-widest animate-pulse">
                      Synthesizing mobile protocol...
                    </div>
                  )}
                </div>

                {/* Send Footer */}
                <form onSubmit={handleSend} className="p-2.5 bg-zinc-50 flex gap-2 items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask mobile coach..."
                    className="flex-1 px-3 py-2 bg-white border border-zinc-200 text-zinc-900 text-[10px] font-mono rounded-full focus:outline-none focus:border-black placeholder:text-zinc-650"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="p-1.5 bg-black hover:bg-zinc-800 text-white rounded-full transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Device Home Bar */}
          <div className="mx-auto w-24 h-1 bg-zinc-300 rounded-full mt-1.5"></div>
        </div>
      </div>
    </div>
  );
}
