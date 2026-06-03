import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ChevronRight, Settings, Check, X, Shield, BarChart3, Megaphone } from 'lucide-react';

export default function GDPRBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  
  // Granular states
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    // Check if user already dismissed GDPR consensus
    const disposed = localStorage.getItem('gdpr_disposed') === 'true';
    if (!disposed) {
      // Small visual delay before sliding up
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync initial state from localStorage if it exists
  useEffect(() => {
    const savedAnalytic = localStorage.getItem('gdpr_analytical') !== 'false';
    const savedMarketing = localStorage.getItem('gdpr_marketing') === 'true';
    setAnalyticsConsent(savedAnalytic);
    setMarketingConsent(savedMarketing);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('gdpr_analytical', 'true');
    localStorage.setItem('gdpr_marketing', 'true');
    localStorage.setItem('gdpr_disposed', 'true');
    setIsVisible(false);

    // Dispatch reload events
    window.dispatchEvent(new Event('storage'));
  };

  const handleSavePreferences = () => {
    localStorage.setItem('gdpr_analytical', String(analyticsConsent));
    localStorage.setItem('gdpr_marketing', String(marketingConsent));
    localStorage.setItem('gdpr_disposed', 'true');
    setIsVisible(false);

    // Dispatch reload events
    window.dispatchEvent(new Event('storage'));
  };

  const handleDeclineAll = () => {
    localStorage.setItem('gdpr_analytical', 'false');
    localStorage.setItem('gdpr_marketing', 'false');
    localStorage.setItem('gdpr_disposed', 'true');
    setIsVisible(false);

    // Dispatch reload events
    window.dispatchEvent(new Event('storage'));
  };

  const navigateToLegal = () => {
    window.location.hash = '#/legal';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 200, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-45 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] p-5 md:p-6"
          id="gdpr-consensus-footer"
        >
          <div className="max-w-7xl mx-auto space-y-4">
            
            {/* Main banner row */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 text-xs">
              
              {/* Left text disclosures */}
              <div className="flex items-start gap-3.5 max-w-4xl">
                <div className="w-9 h-9 bg-slate-100 border border-zinc-200 text-slate-900 rounded-xl flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="space-y-1">
                  <strong className="text-slate-900 uppercase font-extrabold block tracking-tight text-[12px] leading-snug">
                    ★ General Data Protection Regulation (GDPR) Consensus
                  </strong>
                  <p className="text-zinc-500 font-medium leading-relaxed text-[11px] md:text-[11.5px]">
                    We configure secure essential cookie parameters for managing secure Firestore authentication handshakes. Analytical & personalized marketing variables can be toggled using granular compliant controls to protect your data autonomy.
                  </p>
                </div>
              </div>

              {/* Actions button arrays */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => setShowCustomizer(!showCustomizer)}
                  className={`px-3.5 py-2 font-mono text-[9px] uppercase font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 border ${
                    showCustomizer 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                      : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Customize Toggles</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleDeclineAll}
                  className="px-3.5 py-2 font-mono text-[9px] uppercase font-semibold text-zinc-500 hover:text-rose-600 rounded-lg cursor-pointer transition-colors"
                  title="Decline optional trackers"
                >
                  Decline All
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-950 text-[#9DFF00] font-mono text-[9.5px] uppercase font-extrabold rounded-lg shadow cursor-pointer transition-all flex items-center gap-1"
                >
                  <span>Accept All Consensus</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Collapsible Granular Preference Customizer panel */}
            <AnimatePresence>
              {showCustomizer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="border-t border-zinc-150 pt-4 mt-2 overflow-hidden"
                >
                  <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest mb-3.5">
                    // CHOOSE YOUR COMPLIANCE PERMISSIONS:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Category 1: Essential */}
                    <div className="bg-zinc-50/70 border border-zinc-200/80 p-3.5 rounded-xl space-y-1.5 opacity-80 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-[#10B981]" />
                          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-tight">Essential Cookies</span>
                        </div>
                        <span className="font-mono text-[7.5px] px-1.5 py-0.5 bg-zinc-200 text-zinc-600 rounded-md font-bold uppercase">REQUIRED</span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">
                        Maintains session state and token security keys inside secure Firestore DB channels. Cannot be disabled.
                      </p>
                    </div>

                    {/* Category 2: Analytics */}
                    <div className={`border p-3.5 rounded-xl space-y-1.5 flex flex-col justify-between transition-all ${
                      analyticsConsent 
                        ? 'bg-indigo-50/20 border-indigo-200' 
                        : 'bg-zinc-50/70 border-zinc-200/80'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-indigo-600" />
                          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-tight">Analytical Telemetry</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={analyticsConsent}
                          onChange={(e) => setAnalyticsConsent(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 border-zinc-300 focus:ring-slate-900 cursor-pointer"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">
                        Allows us to anonymize system usage statistics to fine-tune C-Suite state machine diagnostics.
                      </p>
                    </div>

                    {/* Category 3: Marketing */}
                    <div className={`border p-3.5 rounded-xl space-y-1.5 flex flex-col justify-between transition-all ${
                      marketingConsent 
                        ? 'bg-amber-50/20 border-amber-200' 
                        : 'bg-zinc-50/70 border-zinc-200/80'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-amber-600" />
                          <span className="font-bold text-slate-800 text-[11px] uppercase tracking-tight">Marketing cookies</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={marketingConsent}
                          onChange={(e) => setMarketingConsent(e.target.checked)}
                          className="w-4 h-4 rounded text-indigo-600 border-zinc-300 focus:ring-slate-900 cursor-pointer"
                        />
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-normal">
                        Enables tailor-made transformation advisory recommendations based on completed checklists and metrics.
                      </p>
                    </div>

                  </div>

                  <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-zinc-100">
                    <button
                      type="button"
                      onClick={navigateToLegal}
                      className="px-3 py-1.5 font-mono text-[9px] uppercase font-bold text-zinc-500 hover:text-slate-800 cursor-pointer text-xs"
                    >
                      Read Full Policy &rarr;
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      className="px-4 py-1.5 bg-[#9DFF00] hover:bg-slate-900 hover:text-[#9DFF00] text-slate-950 font-mono text-[9px] uppercase font-black rounded-lg cursor-pointer transition-all"
                    >
                      Save Selected Preferences
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

