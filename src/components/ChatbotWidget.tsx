import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Shield, Compass, Layers, Bot } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const PRESET_QUERIES = [
  { label: '★ The C-Suite Manifesto', query: 'What is the C-Suite Manifesto and overall philosophy?' },
  { label: '★ Healthcare Realization', query: 'Tell me about the Levant Medical Nexus triage case.' },
  { label: '★ API Security Firewall', query: 'How do you safeguard client workspace keys and tokens?' },
  { label: '★ Submit Parameters', query: 'How does the Transformation Survey help my organization?' }
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Initialize with greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'greeting',
          sender: 'bot',
          text: 'Welcome, Sovereign Leader. I am your C-Suite Agentic AI Companion. How can I facilitate your organizational transformation or audit security parameters today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, []);

  // Scroll to bottom on updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsgId = 'msg-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate smart dynamic advisor responses
    setTimeout(() => {
      let replyText = "I have recognized your inquiry node inside our sovereign simulation matrix. Our advisory swarms are compiled to resolve legacy bottlenecks. For deeper architectural details, check our FAQ directory or consult directly with human experts.";
      const queryLower = textToSend.toLowerCase();

      if (queryLower.includes('manifesto') || queryLower.includes('philosophy')) {
        replyText = "The C-Suite Manifesto represents a call for high-trust executive technology leadership in the Middle East and Levant. It advocates for moving away from generic public API wrappers to localized sovereign RAG pipelines, fully private models, and active sandbox guardrails to secure client-workspace compliance.";
      } else if (queryLower.includes('medical') || queryLower.includes('nexus') || queryLower.includes('healthcare')) {
        replyText = "In our Middle East Medical Nexus case study, emergency triage data retrieval was reduced from 14 minutes per file to just 180 seconds under private containers. Specialized autonomous agents securely check historic logs and run compliance filters using Med-Llama models.";
      } else if (queryLower.includes('security') || queryLower.includes('api') || queryLower.includes('safeguard') || queryLower.includes('leak')) {
        replyText = "We validate token parameters using prompt reflection and active firewalls like Llama Guard to prevent developer credentials leakages. Every transaction payload is sanitized in our secure proxy enclave, preserving 100% data sovereignity.";
      } else if (queryLower.includes('survey') || queryLower.includes('transformation') || queryLower.includes('submit')) {
        replyText = "The Transformation Survey allows you to share your organizational bottlenecks, maturity details, and goal coordinates. These variables are stored inside encrypted Firestore DBs. You can submit parameters on the 'Transformation Survey & Cases' page.";
      } else if (queryLower.includes('logistic') || queryLower.includes('scheduling') || queryLower.includes('invoice')) {
        replyText = "The Sovereign Logistics study demonstrates a 4.2x increase in scheduling output. We deployed event-driven trucking invoice demuxers and capacity models, fully automating WhatsApp dispatch orders in deep Levant dispatch matrix configurations.";
      }

      const replyMsg: ChatMessage = {
        id: 'reply-' + Date.now(),
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, replyMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none" id="chatbot-module-container">
      
      {/* Floating Chat Bubble */}
      <div className="pointer-events-auto">
        <button
          id="chatbot-toggle-trigger"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-slate-900 hover:bg-slate-950 text-[#9DFF00] hover:scale-105 transition-all shadow-xl duration-300 flex items-center justify-center cursor-pointer relative border border-zinc-800"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
          
          {/* Pulsing notification circle if closed */}
          {!isOpen && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-indigo-600 rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
            </span>
          )}
        </button>
      </div>

      {/* Expanded Chat Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="pointer-events-auto mt-4 bg-white border border-zinc-200 rounded-3xl w-[370px] max-w-[calc(100vw-2rem)] h-[490px] shadow-2xl overflow-hidden flex flex-col border border-zinc-200/90"
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-zinc-850">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#9DFF00]/10 border border-[#9DFF00]/30 text-[#9DFF00] flex items-center justify-center">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h4 className="font-sans font-black text-xs uppercase leading-none tracking-tight">C-Suite Advisor</h4>
                  <p className="text-[8px] font-mono text-emerald-400 mt-1 uppercase leading-none tracking-wider">// COMPLIANT BOT INSTANCE</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message window */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-zinc-50/50">
              {messages.map((msg) => {
                const isBot = msg.sender === 'bot';
                return (
                  <div 
                    key={msg.id}
                    className={`flex items-start gap-2 max-w-[85%] ${isBot ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  >
                    {isBot && (
                      <div className="w-6 h-6 rounded-md bg-slate-900 border border-zinc-800 flex items-center justify-center text-[10px] text-[#9DFF00] shrink-0 font-bold select-none">
                        C
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className={`p-3 rounded-2xl text-[12px] leading-relaxed shadow-sm ${
                        isBot 
                          ? 'bg-white border border-zinc-150 text-slate-800 rounded-tl-none' 
                          : 'bg-slate-900 text-white rounded-tr-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className={`block text-[8px] text-zinc-400 font-mono tracking-tighter ${!isBot ? 'text-right' : ''}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-2 mr-auto max-w-[80%]">
                  <div className="w-6 h-6 rounded-md bg-slate-900 border border-zinc-800 flex items-center justify-center text-[9px] text-[#9DFF00] shrink-0 font-bold">
                    C
                  </div>
                  <div className="p-3 bg-white border border-zinc-150 text-zinc-400 rounded-2xl rounded-tl-none text-xs flex gap-1 items-center font-mono">
                    <span>typing</span>
                    <span className="animate-bounce">.</span>
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-200">.</span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Smart Chips */}
            <div className="px-4 py-2 bg-white border-t border-zinc-100 flex gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
              {PRESET_QUERIES.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(item.query)}
                  className="px-2.5 py-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-650 rounded-lg text-[9.5px] font-semibold uppercase tracking-wide whitespace-nowrap cursor-pointer transition-colors shrink-0"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Form Input */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 bg-white border-t border-zinc-205 flex gap-2 shrink-0"
            >
              <input 
                type="text"
                placeholder="Query sovereign c-suite advisors..."
                className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 text-slate-900 text-[11.5px] rounded-xl focus:outline-none focus:border-slate-800 focus:bg-white placeholder-zinc-400"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-9 h-9 bg-slate-900 hover:bg-slate-950 disabled:bg-zinc-100 text-[#9DFF00] disabled:text-zinc-350 rounded-xl flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
