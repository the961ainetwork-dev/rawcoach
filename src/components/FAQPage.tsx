import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronRight, Sparkles, Shield, Cpu, Activity } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'security' | 'coaching' | 'technical' | 'general';
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'coaching',
    question: 'How does the C-Suite AI coaching model work?',
    answer: 'The C-Suite workflow coaches consist of four highly customized, containerized advisory avatars. They analyze your organizational friction metrics in real time and deliver structured, sovereign-grade strategy blueprints. Unlike generic chat services, our coaches are anchored around the principles defined in the C-Suite Manifesto and maintain direct pathways to expert human reviewers.'
  },
  {
    category: 'security',
    question: 'How is confidential company data protected within the workspace?',
    answer: 'All workspace pipelines are fully protected against prompt injection and API credential leakage. Every transaction payload is audited inside our secure reverse-proxy enclave using custom sanitizers like Llama Guard. We never sell, share, or training-pool your proprietary telemetry variables.'
  },
  {
    category: 'technical',
    question: 'What is a "System Swarm Blueprint"?',
    answer: 'A System Swarm Blueprint is a technical flowchart and schematic architecture sheet that outlines how autonomous agent nodes coordinate with your legacy systems. It details the models employed, the stateful orchestration layer (e.g., webhook router loops), and compliance validators to replace manual spreadsheet and email fallbacks.'
  },
  {
    category: 'technical',
    question: 'Can I integrate my existing CRM, EPR, and messaging platforms?',
    answer: 'Yes. Our platform features an interactive WhatsApp Sandbox and Phone Simulator to model client texts and handheld chat triggers. In production configurations, we construct specialized event-driven webhook relays to coordinate seamlessly with standard legacy ERP stacks, databases, and custom APIs.'
  },
  {
    category: 'security',
    question: 'Are my diagnostic inputs stored on the cloud?',
    answer: 'Any diagnostics submitted through our Transformation Survey are backed by robust, cryptographically-secure Google Cloud Firestore datastores. Access is strictly audited under Maan Barazy administrative credentials. You retain absolute ownership and can request immediate node pruning at any time.'
  },
  {
    category: 'coaching',
    question: 'How do I obtain the Corporate Academy Certification?',
    answer: 'Your staff and operations teams can progress through modular, step-by-step curricular paths in our Academy Platform. Upon tracking successful compliance benchmarks and simulating high-pressure alignment sessions in the Roleplay Simulator, verified certificates are issued and compiled into your central corporate registry.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'security' | 'coaching' | 'technical'>('all');

  const filteredItems = selectedCategory === 'all' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-8 animate-scaleUp" id="faq-comp">
      
      {/* FAQ Header Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-zinc-850 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#9DFF00]/5 rounded-full filter blur-2xl opacity-40"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#9DFF00]/10 border border-[#9DFF00]/25 text-[#9DFF00] font-mono text-[9px] tracking-wider font-extrabold uppercase rounded">
            ★ SYSTEM MATRIX DOCUMENTATION KNOWLEDGEBASE
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white font-sans">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl font-medium">
            Acquire deep, structural answers about the C-Suite AI transformation frameworks. Below you will find detailed technical breakdowns of security, compliance sandboxing, and autonomous agent orchestration.
          </p>
        </div>
      </div>

      {/* Categories select */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'security', 'coaching', 'technical'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setOpenIndex(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all border cursor-pointer ${
              selectedCategory === cat
                ? 'bg-slate-900 border-slate-900 text-[#9DFF00]'
                : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50'
            }`}
          >
            {cat} info
          </button>
        ))}
      </div>

      {/* FAQ List with accordion animation */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index}
              className={`bg-white border transition-all rounded-2xl overflow-hidden ${
                isOpen ? 'border-indigo-600 shadow-sm' : 'border-zinc-200/90'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left p-5 md:p-6 flex justify-between items-center gap-4 hover:bg-zinc-50/50 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                    isOpen ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                  }`}>
                    {item.category === 'security' && <Shield className="w-4 h-4" />}
                    {item.category === 'coaching' && <Sparkles className="w-4 h-4" />}
                    {item.category === 'technical' && <Cpu className="w-4 h-4" />}
                    {item.category === 'general' && <HelpCircle className="w-4 h-4" />}
                  </div>
                  <span className="font-sans font-black text-slate-800 uppercase tracking-tight text-[13.5px] leading-snug">
                    {item.question}
                  </span>
                </div>
                <ChevronRight className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-90 text-indigo-600' : ''
                }`} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-6 pb-6 pt-1 text-zinc-650 text-[12.5px] leading-relaxed border-t border-zinc-100 font-medium">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Advisory Support Box */}
      <div className="bg-amber-50/45 border border-amber-150 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <strong className="text-slate-900 font-black text-sm uppercase leading-tight">// HAVE UNLISTED COMPLIANCE INQUIRIES?</strong>
          <p className="text-zinc-500 text-[11px] leading-relaxed max-w-xl">
            Our specialized systems engineers are cleared for custom high-availability sandboxing reviews. Escalate your integration roadmap to our team for high-trust compliance counseling.
          </p>
        </div>
        <button
          onClick={() => {
            const chatbotBtn = document.getElementById('chatbot-toggle-trigger');
            if (chatbotBtn) chatbotBtn.click();
          }}
          className="px-4 py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-mono text-[9.5px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs whitespace-nowrap"
        >
          Activate Chat Assistant
        </button>
      </div>

    </div>
  );
}
