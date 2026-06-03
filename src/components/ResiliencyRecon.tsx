import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ShieldAlert, BookOpen, Clock, PenTool } from 'lucide-react';

const DEFAULT_STORIES = [
  {
    id: 'story-1',
    title: 'THE 1993 DECENT TELECOM RESET',
    subtitle: 'How alpha networks connected 50 local nodes offline',
    content: 'In 1993, unexpected telecom blackouts isolated major business corridors. Rather than waiting for central carrier recovery, a group of local engineers established asynchronous wireless relay hubs using standard high-frequency radios. Within 72 hours, 50 merchant clearance centers were synchronized, allowing core billing logs to bypass network failure gates. This historic event proved that decentralized structures outperform slow monolithic infrastructure.',
    year: '1993',
    author: 'Sovereign Telecom Guild'
  },
  {
    id: 'story-2',
    title: 'THE BEKAA AGRO-ESCROW POOL',
    subtitle: 'Solar micro-irrigation managed by smart grid logs',
    content: 'Faced with volatile supply pipelines, cooperative agronomists assembled distributed solar-pump arrays governed by automated SMS alerts. If water pressure indicators drop below pre-audited levels, resources are automatically re-allocated. Operating entirely on client-simulated SMS payloads, water waste fell by 40% while preserving crop security across 300 hectares.',
    year: '2018',
    author: 'Maan Barazy'
  }
];

export default function ResiliencyRecon() {
  const [stories, setStories] = useState<any[]>(DEFAULT_STORIES);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchStories() {
      try {
        const storiesSnap = await getDocs(collection(db, 'sheikhStories'));
        const list: any[] = [];
        storiesSnap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        if (list.length > 0) {
          setStories(list);
        } else {
          setStories(DEFAULT_STORIES);
        }
      } catch (e) {
        console.warn('Stories retrieval failed, using fallback:', e);
        setStories(DEFAULT_STORIES);
      } finally {
        setLoading(false);
      }
    }
    fetchStories();
  }, []);

  return (
    <div className="space-y-12 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="space-y-4 text-center lg:text-left border-b border-zinc-200/50 pb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-[#9DFF00] rounded-full text-[10px] font-mono tracking-widest uppercase font-black">
          <ShieldAlert className="w-3.5 h-3.5 animate-pulse" /> SHEIKH HISTORIC SYSTEM ARCHIVES
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight font-sans uppercase">
          Resiliency Recon
        </h2>
        <p className="text-zinc-500 font-mono text-[11.5px] max-w-3xl leading-relaxed uppercase">
          HISTORIC PROFILE DIRECTORY & ARCHIVE HIGHLIGHTING LOCAL LEBANESE ADAPTATION STRATEGIES.
        </p>
      </div>

      {/* Main Grid Wrapper */}
      <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 border border-zinc-850 relative overflow-hidden shadow-xl" id="res resiliency-recon-wrapper">
        <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-900 rounded-full filter blur-3xl opacity-35 -z-10 animate-pulse"></div>
        
        <div className="space-y-4 mb-10">
          <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
            ★ RESILIENCY CASE STUDIES ★
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase text-white font-sans">
            Sheikh Stories Portfolio
          </h3>
          <p className="text-xs text-white max-w-2xl leading-relaxed">
            A continuous live archive profiling decentralized self-powered telecom nodes, community solar microgrid cooperatives, and custom liquidity setups engineered in the most volatile local environments.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-zinc-500 font-mono text-xs animate-pulse">
            // INDEXING RESILIENT ARCHIVAL LOGS...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stories.map((story) => (
              <div key={story.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-all">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8.5px] text-[#22c55e] font-black uppercase tracking-wider">// LOCAL CASE PROTOCOL ({story.year || 'N/A'})</span>
                    <span className="font-mono text-[8px] text-zinc-500 select-all">REF#{story.id.substring(0, 6).toUpperCase()}</span>
                  </div>
                  <h4 className="text-sm font-black text-white uppercase tracking-tight">{story.title}</h4>
                  {story.subtitle && <p className="text-[10px] text-white italic leading-snug">{story.subtitle}</p>}
                  <p className="text-xs text-white leading-relaxed font-sans">{story.content}</p>
                </div>
                
                <div className="border-t border-zinc-800/80 pt-4 mt-6 flex items-center justify-between text-[10px] font-mono text-white">
                  <span className="font-bold">Author: {story.author}</span>
                  <span className="bg-slate-800 px-2.5 py-0.5 rounded text-[8px] text-[#22c55e] font-bold uppercase tracking-wider">CASE-RECON</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
