import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ChevronRight, Settings, Check, X, Shield, BarChart3, Megaphone, Terminal, Activity } from 'lucide-react';
import { 
  getConsentPreferences, 
  saveConsentPreferences, 
  hasConfiguredPreferences, 
  evaluateConsentAndApply, 
  ConsentPreferences 
} from '../lib/consentManager';

export default function GDPRBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomizer, setShowCustomizer] = useState(false);
  
  // Local toggles corresponding to the granular consent preferences
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  // Initial trigger delay & synchronize status on mount
  useEffect(() => {
    // Synchronize initial checkbox states
    const initialPrefs = getConsentPreferences();
    setAnalyticsConsent(initialPrefs.analytics);
    setMarketingConsent(initialPrefs.marketing);

    // Initial script application based on existing storage
    evaluateConsentAndApply();

    // Show banner if not yet explicitly configured
    if (!hasConfiguredPreferences()) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Sync back from store if changed externally/storage changed
  useEffect(() => {
    const handleConsentChange = (e: Event) => {
      const customEvent = e as CustomEvent<ConsentPreferences>;
      if (customEvent.detail) {
        setAnalyticsConsent(customEvent.detail.analytics);
        setMarketingConsent(customEvent.detail.marketing);
      }
    };
    window.addEventListener('gdprConsentChanged', handleConsentChange);
    return () => window.removeEventListener('gdprConsentChanged', handleConsentChange);
  }, []);

  const handleAcceptAll = () => {
    const freshPrefs = { analytics: true, marketing: true };
    setAnalyticsConsent(true);
    setMarketingConsent(true);
    saveConsentPreferences(freshPrefs);
    setIsVisible(false);
  };

  const handleDeclineAll = () => {
    const freshPrefs = { analytics: false, marketing: false };
    setAnalyticsConsent(false);
    setMarketingConsent(false);
    saveConsentPreferences(freshPrefs);
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveConsentPreferences({
      analytics: analyticsConsent,
      marketing: marketingConsent,
    });
    setIsVisible(false);
  };

  const navigateToLegal = () => {
    window.location.hash = '#/legal';
  };

  return (
    <AnimatePresence>
      {(isVisible || showCustomizer) && (
        <motion.div
          initial={{ y: 250, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 250, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 25 }}
          className="fixed bottom-0 left-0 right-0 z-45 bg-[#0d111d]/98 backdrop-blur-md border-t border-zinc-800 shadow-[0_-15px_40px_rgba(0,0,0,0.5)] p-5 md:p-6 text-white"
          id="gdpr-consensus-footer"
        >
          <div className="max-w-7xl mx-auto space-y-4">
            
            {/* Main banner row */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 text-xs">
              
              {/* Left text disclosures */}
              <div className="flex items-start gap-4 max-w-4xl">
                <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 text-[#9DFF00] rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                  <ShieldAlert className="w-5.5 h-5.5 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[8px] tracking-wider text-[#9DFF00] block uppercase font-bold">// SECURE USER SOVEREIGNTY CONSENT</span>
                  <strong className="text-white uppercase font-black block tracking-tight text-[12px] md:text-[13px] leading-snug">
                    Granular Data Protection & SDK Initialization Control
                  </strong>
                  <p className="text-zinc-400 font-medium leading-relaxed text-[11px] md:text-[11.5px]">
                    Configure which tracking engines are authorized. Session state and Firestore auth handshakes (Essential) are active automatically. Analytics metrics and Marketing advisory variables can be authorized or revoked in real-time.
                  </p>
                </div>
              </div>

              {/* Actions button arrays */}
              <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0 justify-end font-mono">
                {/* Floating indicator: Show status trigger optionally if the banner was already saved */}
                {hasConfiguredPreferences() && (
                  <button
                    type="button"
                    onClick={() => setIsVisible(false)}
                    className="p-2 text-zinc-500 hover:text-white rounded-lg"
                    title="Collapse GDPR Banner"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowCustomizer(!showCustomizer)}
                  className={`px-3.5 py-2 text-[9px] uppercase font-bold rounded-lg cursor-pointer transition-colors flex items-center gap-1.5 border ${
                    showCustomizer 
                      ? 'bg-[#9DFF00] border-transparent text-[#0d111d]' 
                      : 'bg-[#161a24] border-zinc-800 text-zinc-300 hover:bg-zinc-850 hover:text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>{showCustomizer ? 'Close Preferences' : 'Granular Preferences'}</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleDeclineAll}
                  className="px-3.5 py-2 text-[9px] uppercase font-bold text-zinc-400 hover:text-red-400 rounded-lg cursor-pointer transition-colors bg-[#11141e] border border-transparent hover:border-red-950/40"
                  title="Decline optional trackers"
                >
                  Decline All
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="px-4 py-2 bg-[#9DFF00] hover:bg-[#86d900] text-[#0d111d] text-[9.5px] uppercase font-black rounded-lg shadow-lg cursor-pointer transition-all flex items-center gap-1"
                >
                  <span>Accept All Tracker SDKs</span>
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
                  className="border-t border-zinc-800 pt-4 mt-2 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3.5 font-mono text-[9px] text-[#9DFF00]">
                    <span className="uppercase tracking-widest">// CHOOSE YOUR COMPLIANCE PERMISSIONS & VERIFY INJECTION:</span>
                    <div className="flex items-center gap-2 text-zinc-400 bg-[#161b26] px-2.5 py-1 rounded border border-zinc-800">
                      <Terminal className="w-3.5 h-3.5 text-[#9DFF00]" />
                      <span>Sovereign Sandbox Active</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Category 1: Essential */}
                    <div className="bg-[#111420]/80 border border-zinc-800/80 p-3.5 rounded-xl space-y-1.5 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-emerald-400 animate-pulse" />
                          <span className="font-extrabold text-white text-[11px] uppercase tracking-tight font-sans">1. Session Essential</span>
                        </div>
                        <span className="font-mono text-[7px] px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-900 rounded font-bold uppercase">REQUIRED</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        Encrypts secure Firestore handshakes, retains login credentials, and verifies administrator and spectator authorization levels.
                      </p>
                      <div className="text-[8px] font-mono text-emerald-400/80 pt-1.5 border-t border-zinc-800/60 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                        <span>SDK INJECTED & INITIATED</span>
                      </div>
                    </div>

                    {/* Category 2: Analytics */}
                    <div className={`border p-3.5 rounded-xl space-y-1.5 flex flex-col justify-between transition-all ${
                      analyticsConsent 
                        ? 'bg-blue-950/20 border-blue-800/70' 
                        : 'bg-[#111420]/40 border-zinc-800/50 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-blue-400" />
                          <span className="font-extrabold text-white text-[11px] uppercase tracking-tight font-sans">2. Analytical Telemetry</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={analyticsConsent}
                            onChange={(e) => setAnalyticsConsent(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4.5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#9DFF00]"></div>
                        </label>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        Initializes Google Analytics (GTAG setup). Collects anonymized system usage metrics to fine-tune model diagnostic feedback loops.
                      </p>
                      <div className={`text-[8px] font-mono pt-1.5 border-t border-zinc-800/60 flex items-center gap-1.5 ${analyticsConsent ? 'text-blue-400' : 'text-zinc-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${analyticsConsent ? 'bg-blue-400 animate-ping' : 'bg-zinc-650'}`} />
                        <span>{analyticsConsent ? 'ACTIVE: google-tags/gtag.js LOADED' : 'BLOCKED / STANDBY'}</span>
                      </div>
                    </div>

                    {/* Category 3: Marketing */}
                    <div className={`border p-3.5 rounded-xl space-y-1.5 flex flex-col justify-between transition-all ${
                      marketingConsent 
                        ? 'bg-purple-950/20 border-purple-800/70' 
                        : 'bg-[#111420]/40 border-zinc-800/50 opacity-60'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Megaphone className="w-4 h-4 text-purple-400" />
                          <span className="font-extrabold text-white text-[11px] uppercase tracking-tight font-sans">3. Marketing Advisory</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={marketingConsent}
                            onChange={(e) => setMarketingConsent(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-8 h-4.5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#9DFF00]"></div>
                        </label>
                      </div>
                      <p className="text-[10px] text-zinc-400 leading-normal">
                        Enables tailor-made transformation advisory pixels (LinkedIn Insight Tag block) to serve personalized case studies.
                      </p>
                      <div className={`text-[8px] font-mono pt-1.5 border-t border-zinc-800/60 flex items-center gap-1.5 ${marketingConsent ? 'text-purple-400' : 'text-zinc-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${marketingConsent ? 'bg-purple-400 animate-ping' : 'bg-zinc-650'}`} />
                        <span>{marketingConsent ? 'ACTIVE: linkedin-insights/partner.js LOADED' : 'BLOCKED / STANDBY'}</span>
                      </div>
                    </div>

                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-zinc-800 font-mono">
                    <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 bg-zinc-950/50 px-3 py-1 text-xs rounded border border-zinc-900 leading-normal">
                      <Activity className="w-3.5 h-3.5 text-yellow-500" />
                      <span>GDPR Settings saved automatically upon selection. Change at any time.</span>
                    </div>

                    <div className="flex justify-end gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={navigateToLegal}
                        className="px-3 py-1.5 text-[9px] uppercase font-bold text-zinc-400 hover:text-[#9DFF00] cursor-pointer"
                      >
                        Read Full Privacy Policy &rarr;
                      </button>
                      
                      {/* Close Customizer / Dismiss Banner button */}
                      <button
                        type="button"
                        onClick={handleSavePreferences}
                        className="px-4 py-1.5 bg-[#9DFF00] hover:bg-white hover:text-slate-950 text-slate-950 text-[9px] uppercase font-black rounded-lg cursor-pointer transition-all shadow-md"
                      >
                        Save & Commit Preferences
                      </button>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}

      {/* Floating settings cog so users can reopen privacy parameters whenever they like */}
      {hasConfiguredPreferences() && !isVisible && !showCustomizer && (
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileHover={{ scale: 1.1, rotate: 45 }}
          onClick={() => {
            setShowCustomizer(true);
            setIsVisible(true);
          }}
          className="fixed bottom-4 left-4 z-40 w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-[#9DFF00] flex items-center justify-center cursor-pointer shadow-lg hover:shadow-cyan-900/10"
          title="Privacy Settings (GDPR)"
        >
          <Shield className="w-4 h-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
