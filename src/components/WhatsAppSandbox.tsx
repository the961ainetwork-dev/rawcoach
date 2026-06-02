import React, { useState } from 'react';
import { Send, MessageCircle, AlertCircle } from 'lucide-react';

interface MockChat {
  sender: 'user' | 'bot';
  text: string;
  time: string;
}

export default function WhatsAppSandbox() {
  const [messages, setMessages] = useState<MockChat[]>([
    { sender: 'user', text: 'Yo, CFO is saying Vercel build hours are too high. Ideas?', time: '11:15 AM' },
    { sender: 'bot', text: 'Audit your serverless functions immediately 🚀 check for recursive calls. Migrate static assets to custom server static routes!', time: '11:16 AM' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { sender: 'user', text: userText, time: timeStr }]);
    setLoading(true);

    try {
      const response = await fetch('/api/whatsapp/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });

      const data = await response.json();
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.reply || "Yo, let me double check that API gateway config. Give me one sec!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: "Error synchronizing with SMS relays. Live sandbox simulated reply: Integrate Cursor now to double execution rate! ⚡",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-zinc-900 animate-fadeIn" id="whatsapp-sandbox-section">
      {/* Sandbox Info */}
      <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="border-b border-zinc-200 pb-4">
            <h3 className="font-mono text-xs uppercase text-black font-black tracking-widest flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4 text-black" /> ON-THE-GO WHATSAPP COACH
            </h3>
            <h4 className="text-xl font-extrabold text-black mt-1 uppercase">THE ON-DEVICE SMS SIMULATOR</h4>
          </div>

          <p className="text-[11px] text-zinc-650 font-mono leading-relaxed">
            Real execution happens in the field. Our premium members route text updates to our live SMS/WhatsApp relay node. RAWCOACH intercepts these requests and responds with concise, actionable directions under 120 seconds.
          </p>

          <div className="bg-zinc-50 border border-zinc-200 p-5 space-y-2.5 rounded-2xl">
            <h5 className="font-bold text-xs text-black flex items-center gap-1.5 font-sans">
              <AlertCircle className="w-4 h-4 text-black flex-shrink-0" /> MOBILE INTEGRATION SEQUENCE:
            </h5>
            <ol className="text-[10px] font-mono font-medium text-zinc-600 list-decimal pl-4.5 space-y-1 bg-transparent">
              <li>Save +1 (650) RAW-COAC on WhatsApp.</li>
              <li>Authenticate your SaaS subscription key.</li>
              <li>Ask architecture questions anytime. No lag.</li>
            </ol>
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl font-mono text-[9px] tracking-widest space-y-1 mt-6">
          <p className="font-bold text-zinc-500">INTEGRATED SMS GATEWAY STATUS:</p>
          <p className="text-black font-extrabold flex items-center gap-1.5 uppercase">● CONNECTIVITY SECURE</p>
        </div>
      </div>

      {/* WhatsApp Device Mock */}
      <div className="lg:col-span-7 flex justify-center">
        <div className="w-full max-w-sm bg-zinc-50 p-3.5 rounded-[40px] border-2 border-black relative shadow-lg overflow-hidden">
          {/* Top Speaker/Camera */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-5 bg-white rounded-full flex items-center justify-center border border-zinc-200 relative z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 mr-2"></div>
            <div className="w-12 h-0.5 bg-zinc-200 rounded"></div>
          </div>

          <div className="mt-4 bg-white rounded-[32px] overflow-hidden flex flex-col h-[480px] border border-zinc-200 relative z-10">
            {/* Header info */}
            <div className="bg-zinc-50 text-black p-4 flex justify-between items-center border-b border-zinc-205">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-sm border border-zinc-200 select-none">
                  ⚡
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-tight text-black leading-none">RAWCOACH GATEWAY</h4>
                  <span className="font-mono text-[7.5px] text-zinc-500 font-bold uppercase tracking-wider block mt-0.5">ACTIVE DISPATCH NODE</span>
                </div>
              </div>
              <span className="font-mono text-[8.5px] text-black font-black uppercase bg-zinc-100 px-2 py-0.5 border border-zinc-200 rounded tracking-wider">SECURE</span>
            </div>

            {/* Bubble Thread */}
            <div className="flex-1 p-3.5 space-y-4 overflow-y-auto max-h-[380px] bg-white bg-[radial-gradient(#e4e4e7_1px,transparent_1px)] [background-size:16px_16px]">
              {messages.map((m, idx) => {
                const isBot = m.sender === 'bot';
                return (
                  <div key={idx} className={`max-w-[85%] rounded-[14px] p-3 text-[11px] shadow-sm leading-relaxed border ${
                    isBot 
                      ? 'bg-zinc-50 border-zinc-200 border-l-[3px] border-l-black text-zinc-800 mr-auto' 
                      : 'bg-black border-transparent border-r-[3px] border-r-black text-white ml-auto'
                  }`}>
                    <p className="font-mono">{m.text}</p>
                    <span className={`block text-[7.5px] text-right mt-1.5 font-mono uppercase ${isBot ? 'text-zinc-400' : 'text-zinc-300'}`}>{m.time}</span>
                  </div>
                );
              })}

              {loading && (
                <div className="bg-zinc-50 border border-zinc-200 border-l-[3px] border-l-black mr-auto max-w-[80%] rounded-[14px] p-3 text-[9.5px] font-mono text-black font-black tracking-widest uppercase animate-pulse">
                  Typing countermeasure...
                </div>
              )}
            </div>

            {/* Sending Bar */}
            <form onSubmit={handleSend} className="p-3 bg-zinc-50 border-t border-zinc-200 flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask architecture queries..."
                className="flex-1 px-4 py-2 bg-white border border-zinc-200 rounded-full text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="h-8 w-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-zinc-800 transition-all text-xs cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
