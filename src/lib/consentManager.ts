/**
 * GDPR Granular Consent Manager
 * Controls Essential, Analytics, and Marketing level cookies,
 * and dynamically initializes/tears down third-party tracking scripts.
 */

export interface ConsentPreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
}

const STORAGE_KEYS = {
  PREF_SET: 'gdpr_preferences_configured',
  ANALYTICS: 'gdpr_analytical_v2',
  MARKETING: 'gdpr_marketing_v2',
};

// Simulated script elements storage to allow clean removal when revoked
const activeScriptElements: { [key: string]: HTMLScriptElement | HTMLStyleElement | null } = {
  gtag: null,
  linkedin: null,
};

/**
 * Gets current consent preference states
 */
export function getConsentPreferences(): ConsentPreferences {
  // Essential is always true
  const analyticsSaved = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
  const marketingSaved = localStorage.getItem(STORAGE_KEYS.MARKETING);

  return {
    essential: true,
    analytics: analyticsSaved === null ? true : analyticsSaved === 'true', // defaults to true per initial layout
    marketing: marketingSaved === null ? false : marketingSaved === 'true', // defaults to false
  };
}

/**
 * Checks if the user has already configured/submitted their privacy preferences
 */
export function hasConfiguredPreferences(): boolean {
  return localStorage.getItem(STORAGE_KEYS.PREF_SET) === 'true';
}

/**
 * Saves explicit consent preferences and triggers script re-evaluation.
 */
export function saveConsentPreferences(prefs: Omit<ConsentPreferences, 'essential'>) {
  localStorage.setItem(STORAGE_KEYS.PREF_SET, 'true');
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, String(prefs.analytics));
  localStorage.setItem(STORAGE_KEYS.MARKETING, String(prefs.marketing));

  // Re-evaluate scripts inline
  evaluateConsentAndApply();

  // Notify components
  window.dispatchEvent(new CustomEvent('gdprConsentChanged', { detail: { ...prefs, essential: true } }));
}

/**
 * Decides whether to mount or remove third-party tracking scripts based on user consent states.
 */
export function evaluateConsentAndApply() {
  const prefs = getConsentPreferences();
  
  console.log('🛡️ [GDPR Consent Engine] Evaluating granular permissions:', prefs);

  // 1. ANALYTICS SCRIPTS - Google Analytics tag setup
  if (prefs.analytics) {
    if (!activeScriptElements.gtag) {
      console.log('📊 [GDPR Consent Engine] Analytics consent GRANTED. Injecting Google Analytics (GTAG) script.');
      
      // Setup mock global data layer for GTAG
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).gtag = function(...args: any[]) {
        (window as any).dataLayer.push(args);
      };
      (window as any).gtag('js', new Date());
      (window as any).gtag('config', 'G-MOCK-CSUITE-COACH');

      // Create physical script tag
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-MOCK-CSUITE-COACH';
      script.async = true;
      script.id = 'gdpr-thirdparty-gtag';
      document.head.appendChild(script);
      activeScriptElements.gtag = script;
    }
  } else {
    if (activeScriptElements.gtag) {
      console.log('⛔ [GDPR Consent Engine] Analytics consent REVOKED. Deleting Google Analytics (GTAG) scripts.');
      const element = document.getElementById('gdpr-thirdparty-gtag');
      if (element) element.remove();
      activeScriptElements.gtag = null;
      // Clear variables safely
      delete (window as any).gtag;
    }
  }

  // 2. MARKETING SCRIPTS - LinkedIn Insight Tag / customized retargeting tags
  if (prefs.marketing) {
    if (!activeScriptElements.linkedin) {
      console.log('📢 [GDPR Consent Engine] Marketing preferences GRANTED. Injecting LinkedIn Pixel (Insight Tag).');
      
      // Setup mock global structures for marketing scripts
      (window as any)._linkedin_partner_id = '99999-MOCK';
      (window as any)._linkedin_data_partner_ids = (window as any)._linkedin_data_partner_ids || [];
      (window as any)._linkedin_data_partner_ids.push((window as any)._linkedin_partner_id);

      // Create physical mock script block representing LinkedIn Insight injection
      const script = document.createElement('script');
      script.text = `
        (function(l) {
          if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
          window.lintrk.q=[]}
          console.log("🚀 [GDPR Third-Party Script] LinkedIn Insight tracking module initialised.");
        })(window.lintrk);
      `;
      script.id = 'gdpr-thirdparty-linkedin';
      document.head.appendChild(script);
      activeScriptElements.linkedin = script;
    }
  } else {
    if (activeScriptElements.linkedin) {
      console.log('⛔ [GDPR Consent Engine] Marketing preferences REVOKED. Deleting LinkedIn tracking scripts.');
      const element = document.getElementById('gdpr-thirdparty-linkedin');
      if (element) element.remove();
      activeScriptElements.linkedin = null;
      delete (window as any).lintrk;
    }
  }
}
