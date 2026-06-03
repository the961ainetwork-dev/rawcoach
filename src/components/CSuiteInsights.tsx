import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { 
  Heart, 
  User, 
  Tag, 
  Calendar, 
  ArrowRight,
  ExternalLink,
  BookOpen,
  HelpCircle,
  TrendingUp,
  X,
  Plus
} from 'lucide-react';

export interface InsightCard {
  id: string;
  title: string;
  author: string;
  role: string;
  snippet: string;
  content: string;
  bgColor: string; // Tailwinds bg color choice etc
  tag: string;
  imageUrl?: string;
  likesCount: number;
  status: 'draft' | 'published';
  createdAt?: any;
}

const DEFAULT_INSIGHTS: InsightCard[] = [
  {
    id: 'insight-1',
    title: 'THE PARALLEL LIQUIDITY PROTOCOL',
    author: 'Maan Barazy',
    role: 'Sovereign Advisor',
    snippet: 'How decentralized digital ledger pools can reboot commercial credit pipelines across Lebanon without central bank bailouts.',
    content: 'Lebanon’s recovery depends on isolating credit creation from impaired sovereign balance sheets. By establishing cooperative digital clearing networks, local suppliers and enterprises can clear trade invoices using a sovereign-grade parallel credit ledger. This cuts immediate dependency on traditional retail banking pipelines and re-injects velocity into stalled merchant transactions. We detail the mechanics of multi-signature escrow grids and smart-invoice auditing that can scale to $450M in annual trade volume.',
    bgColor: 'bg-slate-900 border-zinc-800 text-white',
    tag: 'FINANCE',
    likesCount: 124,
    status: 'published'
  },
  {
    id: 'insight-2',
    title: 'THE AGENTIC WORKFORCE: SAVING 60% OPERATIONAL BURN',
    author: 'Alpha Team Lead',
    role: 'Sovereign Architect',
    snippet: 'A look at deploying 12 parallel autonomous agents to handle daily administration loops and client-facing brief generation.',
    content: 'Standard corporate offices waste up to 60% of workforce capacity on compiling legacy spreadsheets, formatting client reports, and validating manual checklists. Deploying serverless Agentic Swarms lets businesses run parallel data engines that monitor and resolve structural steps in seconds. Human personnel transition from manual processing targets to executive validation gatekeepers, instantly solving latency issues and reducing routine operational overheads.',
    bgColor: 'bg-white border-zinc-200 text-slate-900',
    tag: 'AI DEPLOYMENT',
    likesCount: 89,
    status: 'published'
  },
  {
    id: 'insight-3',
    title: 'DE-BOTTLENECKING ENTERPRISE DECISION CHAINS',
    author: 'Sovereign Auditor',
    role: 'Operations Expert',
    snippet: 'Eliminating the "approval hoop" drag weight. Empowering decentralized team leaders with automated budget-trigger protocols.',
    content: 'Traditional corporate approvals represent a hidden drag force. Installing smart trigger systems utilizing programmatic multi-sig thresholds allows divisions to execute up to $15k projects automatically when pre-audited metrics are satisfied. By taking human scheduling delays out of the loop, team velocity improves by an average of 4x based on our weekly diagnostic scorecards.',
    bgColor: 'bg-white border-zinc-200 text-slate-900',
    tag: 'MANAGEMENT',
    likesCount: 56,
    status: 'published'
  },
  {
    id: 'insight-4',
    title: 'OFFLINE-FIRST NETWORK ARCHITECTURES IN VOLATILE PHASES',
    author: 'Infrastructure Guild',
    role: 'Router Specialist',
    snippet: 'Designing hybrid local-storage networks to maintain core corporate data security during unexpected regional connectivity cuts.',
    content: 'In highly volatile physical environments, modern enterprises cannot afford complete cloud dependencies. Designing hybrid local networks containing synchronized micro-databases guarantees zero-downtime ledger continuity. Data is securely queued on regional SSD caches using asymmetric encryption, instantly deploying updates to main cloud nodes as soon as optical or fiber links recover.',
    bgColor: 'bg-slate-950 border-zinc-900 text-white',
    tag: 'INFRASTRUCTURE',
    likesCount: 142,
    status: 'published'
  },
  {
    id: 'insight-5',
    title: 'THE RETALENTIZATION PRIORITY CHECKLIST',
    author: 'Training Team Lead',
    role: 'Academy Lead',
    snippet: 'A standard weekly curriculum designed to retrain legal, accounting, and sales personnel onto prompt governance frameworks.',
    content: 'Sovereign recovery is defined by personnel readiness. Weekly audits indicate the quickest pathway to automation is training internal teams to speak "the machine language." Our modular curriculums take typical clerks and upskill them with precise generative workflow instruction matrices within 14 days, creating operational action forces.',
    bgColor: 'bg-[#FAF9F6] border-zinc-300 text-slate-900',
    tag: 'GOVERNANCE',
    likesCount: 38,
    status: 'published'
  }
];

export default function CSuiteInsights() {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<InsightCard | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'csuiteInsights'));
      const list: InsightCard[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status === 'published') {
          list.push({ id: docSnap.id, ...data } as InsightCard);
        }
      });
      
      if (list.length > 0) {
        setInsights(list);
      } else {
        setInsights(DEFAULT_INSIGHTS);
      }
    } catch (err) {
      console.error('Failed to fetch published insights, falling back to sovereign defaults.', err);
      setInsights(DEFAULT_INSIGHTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedIds.includes(id)) return;

    // Local optimization state
    setLikedIds((prev) => [...prev, id]);
    setInsights((prev) => 
      prev.map((item) => item.id === id ? { ...item, likesCount: item.likesCount + 1 } : item)
    );

    // Save to Firestore if database is present
    try {
      const ref = doc(db, 'csuiteInsights', id);
      await updateDoc(ref, {
        likesCount: increment(1)
      });
    } catch (err) {
      console.warn('Liking dynamic sync bypassed, state updated locally.', err);
    }
  };

  return (
    <div className="space-y-8" id="csuite-insights-board">
      {/* Page Header */}
      <div className="bg-slate-900 text-white p-6 md:p-10 rounded-3xl border border-zinc-800 relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#9DFF00]/10 rounded-full filter blur-3xl opacity-20"></div>
        <div className="space-y-4 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#9DFF00]/10 border border-[#9DFF00]/20 text-[#9DFF00] font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
            ★ C-SUITE INTELLIGENCE ARCHIVE ★
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white font-sans leading-none">
            C-Suite Insights Board
          </h2>
          <p className="text-zinc-300 text-xs md:text-sm leading-relaxed max-w-2xl font-medium">
            A high-density strategic insight directory. Staggered, raw-intelligence briefings published by our advisors. Tap cards to read full operational documents or trigger like indicators.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-zinc-500 space-y-2">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Syncing insights with firestore cloud matrix...</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6" id="pinterest-board-masonry">
          {insights.map((item) => {
            const hasLiked = likedIds.includes(item.id);
            return (
              <div 
                key={item.id}
                onClick={() => setSelectedInsight(item)}
                className={`break-inside-avoid border rounded-2xl p-6 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${item.bgColor || 'bg-white text-slate-900 border-zinc-200'} space-y-4`}
              >
                {/* Header Tag / Action */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded font-mono text-[8px] uppercase font-extrabold tracking-widest ${
                    item.bgColor?.includes('slate') 
                      ? 'bg-zinc-800 text-[#9DFF00] border border-zinc-700' 
                      : 'bg-zinc-100 text-slate-800 border border-zinc-200'
                  }`}>
                    {item.tag || 'BRIEFING'}
                  </span>
                  
                  <span className="font-mono text-[8px] opacity-40">
                    ID // {item.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-md font-extrabold uppercase tracking-tight leading-snug">
                  {item.title}
                </h3>

                {/* Snippet */}
                <p className={`text-xs leading-relaxed font-sans font-medium ${
                  item.bgColor?.includes('slate') ? 'text-zinc-300' : 'text-slate-600'
                }`}>
                  {item.snippet}
                </p>

                {/* Author Info */}
                <div className="border-t border-zinc-500/10 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-extrabold">{item.author}</p>
                    <p className="text-[8.5px] font-mono opacity-60 leading-none mt-0.5">{item.role}</p>
                  </div>

                  {/* Liking Button */}
                  <button
                    onClick={(e) => handleLike(item.id, e)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9.5px] font-mono font-bold transition-all transition-colors cursor-pointer ${
                      hasLiked
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : item.bgColor?.includes('slate')
                          ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-white'
                          : 'bg-zinc-55/10 hover:bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-rose-500' : ''}`} />
                    <span>{item.likesCount}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Insight Detail Overlay Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-zinc-200 overflow-hidden shadow-2xl animate-scaleUp max-h-[85vh] flex flex-col">
            
            {/* Header top colored bar */}
            <div className="bg-slate-900 text-white p-6 relative flex justify-between items-center shrink-0">
              <div className="space-y-1.5">
                <span className="bg-[#9DFF00]/15 text-[#9DFF00] font-mono text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide border border-[#9DFF00]/20">
                  SYSTEM BRIEFING // CS-INSIGHTS
                </span>
                <h3 className="text-lg font-black uppercase tracking-tight text-white leading-tight">
                  {selectedInsight.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedInsight(null)}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Inner Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-800">
              <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 border border-zinc-150 rounded-xl">
                <div>
                  <span className="text-[8px] font-mono text-zinc-400 block uppercase font-bold">// ADVISOR SOURCE</span>
                  <p className="text-[12.5px] font-extrabold text-slate-900 mt-0.5">{selectedInsight.author}</p>
                  <p className="text-[9px] font-mono text-zinc-450 uppercase">{selectedInsight.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-mono text-zinc-400 block uppercase font-bold">// TAXONOMY METRIC</span>
                  <p className="text-[11.5px] font-mono font-extrabold text-[#22c55e] mt-0.5">● {selectedInsight.tag}</p>
                  <p className="text-[9px] font-mono text-zinc-450 uppercase">{selectedInsight.likesCount} endorsement indicators</p>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[9px] font-mono text-zinc-450 block uppercase font-black">// OPERATIONAL BRIEFING DATA</span>
                <p className="text-xs text-slate-850 font-semibold leading-relaxed border-l-2 border-[#86d900] pl-4 italic">
                  "{selectedInsight.snippet}"
                </p>
                
                <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans font-medium">
                  {selectedInsight.content}
                </div>
              </div>
            </div>

            {/* Footer Bottom Action Area */}
            <div className="p-5 border-t border-zinc-150 bg-zinc-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-tight">DOCUMENT DEPLOYS STRICTLY FOR SOVEREIGN READERS ONLY</span>
              <button
                onClick={(e) => {
                  handleLike(selectedInsight.id, e);
                }}
                className={`w-full sm:w-auto px-4 py-2 text-xs rounded-xl border font-mono font-bold uppercase transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  likedIds.includes(selectedInsight.id)
                    ? 'bg-rose-50 border-rose-250 text-rose-600'
                    : 'bg-slate-900 border-transparent text-white hover:bg-slate-800'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{likedIds.includes(selectedInsight.id) ? 'Endorsed' : 'Endorse Insight'} ({selectedInsight.likesCount})</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
