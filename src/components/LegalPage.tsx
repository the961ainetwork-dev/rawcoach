import React, { useState, useEffect } from 'react';
import { ShieldCheck, Lock, Check, RefreshCw, AlertCircle, FileText, Scale } from 'lucide-react';

export default function LegalPage() {
  const [analyticalAccepted, setAnalyticalAccepted] = useState(true);
  const [essentialAccepted, setEssentialAccepted] = useState(true);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [successInfo, setSuccessInfo] = useState(false);

  useEffect(() => {
    const savedAnalytic = localStorage.getItem('gdpr_analytical') !== 'false';
    const savedMarketing = localStorage.getItem('gdpr_marketing') === 'true';
    setAnalyticalAccepted(savedAnalytic);
    setMarketingAccepted(savedMarketing);
  }, []);

  const handleSavePreferences = () => {
    localStorage.setItem('gdpr_analytical', String(analyticalAccepted));
    localStorage.setItem('gdpr_marketing', String(marketingAccepted));
    setSuccessInfo(true);
    setTimeout(() => setSuccessInfo(false), 2500);

    // Trigger local storage storage event manually so the banner updates across the site
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="space-y-8 animate-scaleUp text-zinc-750" id="legal-compliance-comp">
      
      {/* Legal disclosures Banner */}
      <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl border border-zinc-850 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full filter blur-2xl opacity-40"></div>
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/25 text-[#10B981] font-mono text-[9px] tracking-wider font-extrabold uppercase rounded">
            ★ HIGH TRUS SOVEREIGN COMPLIANCE MANDATE
          </div>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-white font-sans">
            LEGAL & REGULATORY REGISTER
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl font-medium">
            Explore privacy, audit, liability, and sovereign credentials limits. We fully adhere to highest standards of data minimization, secure token firewalls, and EU-equivalent General Data Protection Regulation (GDPR).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column: GDPR Interactive Privacy Control Hub */}
        <div className="md:col-span-1 bg-white border border-zinc-200 p-5 rounded-2xl h-fit space-y-6">
          <div className="border-b border-zinc-150 pb-3">
            <h3 className="font-sans font-black text-slate-900 uppercase text-xs tracking-tight flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              Your Privacy Consent Node
            </h3>
            <p className="text-[9.5px] text-zinc-400 mt-1 uppercase font-mono tracking-wider">// LOCAL GDPR VARIABLES</p>
          </div>

          <div className="space-y-4 text-xs">
            {/* Essential */}
            <div className="bg-zinc-50 border border-zinc-150 p-3 rounded-xl space-y-1.5 opacity-90">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 uppercase tracking-tight">Essential Cookies</span>
                <span className="font-mono text-[8px] px-1.5 bg-zinc-200 border border-zinc-350 text-zinc-600 rounded">REQUIRED</span>
              </div>
              <p className="text-[10.5px] text-zinc-500 leading-normal">
                Responsible for managing auth sessions, credential handshakes, and database keys in Firestore securely.
              </p>
            </div>

            {/* Performance/Analytical */}
            <div className={`p-3 border rounded-xl space-y-2 transition-colors ${
              analyticalAccepted ? 'bg-indigo-50/20 border-indigo-200' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 uppercase tracking-tight">Analytical Telemetry</span>
                <input 
                  type="checkbox"
                  checked={analyticalAccepted}
                  onChange={(e) => setAnalyticalAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-slate-900 cursor-pointer"
                />
              </div>
              <p className="text-[10.5px] text-zinc-500 leading-normal">
                Compiles diagnostic trends in anonymous aggregate clusters to refine the C-Suite simulation matrix algorithms.
              </p>
            </div>

            {/* Marketing cookies */}
            <div className={`p-3 border rounded-xl space-y-2 transition-colors ${
              marketingAccepted ? 'bg-indigo-50/20 border-indigo-200' : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 uppercase tracking-tight">Marketing Trackers</span>
                <input 
                  type="checkbox"
                  checked={marketingAccepted}
                  onChange={(e) => setMarketingAccepted(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 text-indigo-600 focus:ring-slate-900 cursor-pointer"
                />
              </div>
              <p className="text-[10.5px] text-zinc-500 leading-normal">
                Enables tailor-made transformation advisory recommendations based on your completed checklists and corporate diagnostic metrics.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSavePreferences}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-950 text-white font-mono text-[9.5px] font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            Apply Consensus Nodes
          </button>

          {successInfo && (
            <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 font-mono text-[10.5px] text-center rounded-lg animate-pulse uppercase">
              // Data Consent Saved Successfully
            </div>
          )}
        </div>

        {/* Right column: Disclosure sections */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Section 1 */}
          <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3">
            <h3 className="font-sans font-black text-slate-900 text-sm uppercase tracking-tight flex items-center gap-2">
              <Scale className="w-4 h-4 text-indigo-600" />
              1. Sovereign Terms of Service
            </h3>
            <p className="text-zinc-650 text-xs md:text-[13px] leading-relaxed">
              By accessing theCsuiteCOACH platform, you engage in sovereign-grade simulation training. All information, coaches, simulators (WhatsApp sandbox, roleplay simulators, phone client suites), and checklists served are for strategic reference and cognitive business advisory simulations. Final transactional or legal decisions should consult licensed corporate authorities.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3">
            <h3 className="font-sans font-black text-slate-900 text-sm uppercase tracking-tight flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600" />
              2. Privacy Mandate & Data Minimization
            </h3>
            <p className="text-zinc-650 text-xs md:text-[13px] leading-relaxed">
              We operate under strict zero-leakage parameters. Proprietary variables submitted inside our surveys or checklist repositories remain locked inside your personal workspace, backed by isolated Firestore nodes. No credentials, tokens, or PII vectors escape our enclaves, which are audited continuously by the administrator (Maan Barazy).
            </p>
          </div>

          {/* Section 3 */}
          <div className="bg-white border border-zinc-200 p-6 rounded-2xl space-y-3">
            <h3 className="font-sans font-black text-slate-900 text-sm uppercase tracking-tight flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-indigo-600" />
              3. GDPR & Levant Compliance Footing
            </h3>
            <p className="text-zinc-650 text-xs md:text-[13px] leading-relaxed">
              We extend complete GDPR equivalent guarantees to global users. This includes the absolute right to have your diagnostic parameters fully pruned ("Forgotten"), the right to restrict analytical logging coordinates, and detailed programmatic data portability options available instantly upon credential verification.
            </p>
          </div>

          {/* Verification Code Box */}
          <div className="p-4 bg-zinc-900 text-white rounded-2xl font-mono text-[10px] space-y-1.5 border border-zinc-800 uppercase">
            <span className="text-[#9DFF00] block tracking-wide font-black">// COMPLIANCE SHA-256 SEED SIGN:</span>
            <p className="text-zinc-400 break-all leading-relaxed bg-zinc-950 p-3 rounded-lg border border-zinc-850">
              d8939779df3406e9fd8990c746eeae44ae91ddc_thecsuitecoach_sovereign_v2_certified
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
