import React, { useState } from 'react';
import { useAuth, UserRegistrationProfile } from '../contexts/AuthContext';
import { 
  Terminal, 
  Shield, 
  Key, 
  UserPlus, 
  LogIn, 
  User, 
  Building2, 
  Briefcase, 
  Phone, 
  FileText, 
  Sparkles, 
  Cpu, 
  AlertTriangle 
} from 'lucide-react';

interface AuthInterfaceProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultMode?: 'login' | 'signup';
}

export default function AuthInterface({ onSuccess, onCancel, defaultMode = 'login' }: AuthInterfaceProps) {
  const { logIn, signUp, signUpWithGoogle } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [signupType, setSignupType] = useState<'founder' | 'scroller'>('scroller'); // Default to scroller for ease
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Signup fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('CEO & Founder');
  const [companyName, setCompanyName] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Email and Credentials required.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName) {
        setErrorMsg('Please specify your full name.');
        return;
      }
      if (signupType === 'founder' && (!companyName || !phone)) {
        setErrorMsg('Venture Name and Contact Phone are required for full Co-Founder Registration.');
        return;
      }
    }

    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      if (mode === 'login') {
        await logIn(email, password);
        setInfoMsg('Authentication Verified. Routing to private workspace...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1500);
      } else {
        const profileData = {
          fullName,
          role: signupType === 'scroller' ? 'Viewer / Spectator' : role,
          companyName: signupType === 'scroller' ? 'Public Exploration' : companyName,
          companyDescription: signupType === 'scroller' 
            ? 'Just scrolling, reading, and exploring insights.' 
            : (companyDescription || 'A stealth modern agentic startup.'),
          phone: signupType === 'scroller' ? 'N/A' : phone
        };
        await signUp(email, password, profileData);
        setInfoMsg('Secure Profile Registered & Saved to Firestore. Deploying your sovereign workspace...');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1800);
      }
    } catch (err: any) {
      console.error(err);
      let friendlyErr = err.message || 'Operation failed. Check details.';
      if (friendlyErr.includes('auth/email-already-in-use')) {
        friendlyErr = 'This email node is already registered. Try logging in.';
      } else if (friendlyErr.includes('auth/invalid-credential') || friendlyErr.includes('auth/wrong-password')) {
        friendlyErr = 'Invalid security credentials. Double check password and email.';
      } else if (friendlyErr.includes('auth/weak-password')) {
        friendlyErr = 'Password strength insufficient. Minimum 6 characters required.';
      } else if (friendlyErr.includes('PERMISSION_DENIED')) {
        friendlyErr = 'Firestore permission denied. Ensure all fields obey rules.';
      }
      setErrorMsg(friendlyErr);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signUpWithGoogle();
      setInfoMsg('Sovereign Google identity verified. Provisioning sandbox...');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Google Auth sequence disrupted.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white max-w-md w-full mx-auto p-6 md:p-8 rounded-2xl border border-zinc-800 shadow-2xl relative overflow-hidden" id="auth-interface-container">
      {/* Decorative ambient visual background indicators */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-xl opacity-45 -z-10"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-rose-500/15 rounded-full filter blur-xl opacity-35 -z-10"></div>

      <div className="space-y-6">
        {/* Terminal Header Info */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900 border border-zinc-700 text-[#9DFF00] font-mono text-[8.5px] tracking-wider font-extrabold uppercase rounded">
            <Shield className="w-3.5 h-3.5" /> SECURE GATEWAY ID: CO_LBN_99
          </div>
          <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-white font-sans leading-snug">
            {mode === 'login' 
              ? 'SECURE MEMBER ACCESS PORTAL' 
              : signupType === 'founder'
                ? 'BUILD SOVEREIGN CO-FOUNDER PROFILE'
                : 'STANDARD SIGN UP (EXPLORE & SCROLL)'}
          </h3>
          <p className="text-[10px] text-zinc-400 font-mono tracking-wider">
            {mode === 'login' 
              ? 'Sign in to access your private sovereign workspace, coaching history, and active modules.' 
              : signupType === 'founder'
                ? 'Register your enterprise parameters securely to initialize your co-founder credentials.'
                : 'Sign up with standard access parameters to explore, read research and scroll freely.'
            }
          </p>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-3 bg-zinc-900/80 p-1 border border-zinc-800 rounded-xl gap-1">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 px-1 font-mono text-[8.5px] font-bold uppercase rounded-lg transition-all cursor-pointer leading-tight text-center ${
              mode === 'login' 
                ? 'bg-zinc-800 text-[#9DFF00] border border-zinc-750 shadow-inner scale-[1.02]' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            1. SECURE<br/>SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setSignupType('founder');
              setErrorMsg('');
            }}
            className={`py-2 px-1 font-mono text-[8.5px] font-bold uppercase rounded-lg transition-all cursor-pointer leading-tight text-center ${
              mode === 'signup' && signupType === 'founder'
                ? 'bg-zinc-800 text-[#9DFF00] border border-zinc-750 shadow-inner scale-[1.02]' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            2. CO-FOUNDER<br/>SIGN UP
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setSignupType('scroller');
              setErrorMsg('');
            }}
            className={`py-2 px-1 font-mono text-[8.5px] font-bold uppercase rounded-lg transition-all cursor-pointer leading-tight text-center ${
              mode === 'signup' && signupType === 'scroller'
                ? 'bg-zinc-800 text-[#9DFF00] border border-zinc-750 shadow-inner scale-[1.02]' 
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            3. STANDARD<br/>(JUST SCROLL)
          </button>
        </div>

        {/* Action / Diagnostial Alerts */}
        {errorMsg && (
          <div className="p-3 bg-red-900/40 border border-red-800 text-rose-400 rounded-xl text-[10.5px] font-mono flex items-start gap-2 animate-scaleUp">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold uppercase tracking-wider text-[8px]">// ERROR CODE_DISRUPTION</p>
              <p className="mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        {infoMsg && (
          <div className="p-3 bg-[#9DFF00]/10 border border-[#9DFF00]/35 text-teal-300 rounded-xl text-[10.5px] font-mono flex items-start gap-2 animate-scaleUp">
            <Cpu className="w-4 h-4 text-[#9DFF00] shrink-0 mt-0.5 animate-spin" />
            <div>
              <p className="font-bold uppercase tracking-wider text-[8px] text-[#9DFF00]">// TRANSIT_OK STATUS</p>
              <p className="mt-0.5 text-white">{infoMsg}</p>
            </div>
          </div>
        )}

        {/* Real Dynamic Form Block */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-3.5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest font-black block">
                [SECURITY_EMAIL_ADDRESS]
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest font-black block">
                [SECURED_PASSWORD_ENVELOPE]
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-zinc-500 font-mono"
                />
              </div>
            </div>

            {/* EXPANDED PROFILE INFO FIELDS UPON SIGN UP */}
            {mode === 'signup' && (
              <div className="space-y-3 pt-3 border-t border-zinc-900/80 animate-fadeIn text-left">
                <div className="text-left font-mono">
                  <span className="text-[7.5px] text-amber-500 uppercase tracking-widest font-extrabold block">
                    {signupType === 'founder' 
                      ? '// WORKSPACE PARAMETERS REQUIRED' 
                      : '// STANDARD REGISTRATION PARAMETERS'}
                  </span>
                </div>

                {/* Full name */}
                <div className="space-y-1">
                  <label className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block font-bold">
                    FULL_NAME / ALIAS
                  </label>
                  <input
                    type="text"
                    required={mode === 'signup'}
                    value={fullName}
                    disabled={loading}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Salim K. Warde"
                    className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-zinc-550 font-mono"
                  />
                </div>

                {signupType === 'founder' && (
                  <>
                    {/* Company / Startup Name */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block font-bold">
                          VENTURE_NAME
                        </label>
                        <input
                          type="text"
                          required={signupType === 'founder'}
                          value={companyName}
                          disabled={loading}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="e.g. Cedar Agentic"
                          className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-zinc-550 font-mono"
                        />
                      </div>
                      {/* Role */}
                      <div className="space-y-1">
                        <label className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block font-bold">
                          OFFICER_ROLE
                        </label>
                        <input
                          type="text"
                          required={signupType === 'founder'}
                          value={role}
                          disabled={loading}
                          onChange={(e) => setRole(e.target.value)}
                          placeholder="CEO & Co-founder"
                          className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-zinc-550 font-mono"
                        />
                      </div>
                    </div>

                    {/* Phone number */}
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block font-bold">
                        SECURED_CONTACT_PHONE
                      </label>
                      <input
                        type="tel"
                        required={signupType === 'founder'}
                        value={phone}
                        disabled={loading}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +961 3 123456"
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-zinc-550 font-mono"
                      />
                    </div>

                    {/* Startup Description */}
                    <div className="space-y-1">
                      <label className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block font-bold">
                        VENTURE_MISSION (BRIEF)
                      </label>
                      <textarea
                        rows={2}
                        value={companyDescription}
                        disabled={loading}
                        onChange={(e) => setCompanyDescription(e.target.value)}
                        placeholder="Decoupled automated micro-finance logistics tracking."
                        className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-lg px-3.5 py-2 text-[11px] text-white placeholder-zinc-550 focus:outline-none focus:border-zinc-550 font-mono resize-none"
                      />
                    </div>
                  </>
                )}

                {signupType === 'scroller' && (
                  <div className="p-3 bg-zinc-900/65 border border-zinc-800 rounded-lg text-[10px] text-zinc-400 leading-normal font-mono">
                    💡 <strong>Standard Scroller Pass:</strong> You bypass deep corporate profiling. Your secure session will authorize complete reading clearance for ecosystem surveys, Lebanese policy cases and analysis reels immediately.
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 bg-zinc-100 hover:bg-white text-slate-950 hover:scale-[1.01] transition-all font-mono text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5 ${
                loading ? 'opacity-50 select-none' : ''
              }`}
            >
              {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
              {loading 
                ? 'COMPILING PROTOCOLS...' 
                : mode === 'login' 
                  ? 'SECURE MEMBER SIGN IN' 
                  : signupType === 'scroller'
                    ? 'INITIATE STANDARD SCROLL PASS'
                    : 'REGISTER SOVEREIGN TEAM & ENTER'
              }
            </button>
          </div>
        </form>

        {/* Separator */}
        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-zinc-900"></div>
          <span className="flex-shrink mx-3 text-[9px] font-mono text-zinc-550 uppercase tracking-widest">ALGORITHM PEER LOGINS</span>
          <div className="flex-grow border-t border-zinc-900"></div>
        </div>

        {/* Alternative Authentication Tools (Google, etc.) */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-100 transition-all font-mono text-[10px] font-bold uppercase tracking-wider rounded-xl cursor-pointer flex items-center justify-center gap-2"
          >
            {/* Hand-drawn SVG Google Logo to avoid external asset dependency */}
            <svg className="w-3.5 h-3.5 mr-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google Sovereign ID Access
          </button>
        </div>

        {/* Note on Email/Password Activation */}
        <p className="text-[9px] text-zinc-500 font-mono text-center leading-relaxed">
          ● Note: Standard Google login is active. Email log-in requires the service provider configuration configured inside the respective Firebase console parameters.
        </p>

        {onCancel && (
          <div className="text-center">
            <button
              type="button"
              onClick={onCancel}
              className="text-zinc-500 hover:text-white transition-colors font-mono text-[9px] uppercase tracking-wider underline cursor-pointer"
            >
              Exit Authorization Sequence &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
