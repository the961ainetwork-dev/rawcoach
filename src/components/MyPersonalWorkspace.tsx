import React, { useState, useEffect } from 'react';
import { useAuth, UserRegistrationProfile } from '../contexts/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { 
  User, 
  Building2, 
  Phone, 
  Briefcase, 
  FileText, 
  Save, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Cpu, 
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

interface Task {
  id: string;
  userId: string;
  title: string;
  vibe: string;
  status: 'todo' | 'active' | 'deployed';
  createdAt: any;
  updatedAt: any;
}

export default function MyPersonalWorkspace() {
  const { user, profile, refreshProfile, setProfileLocal } = useAuth();

  // Onboarding local states
  const [localOnboardType, setLocalOnboardType] = useState<'founder' | 'enterprise' | null>(() => {
    return (localStorage.getItem('localOnboardType') as 'founder' | 'enterprise') || null;
  });

  const [localOnboardData, setLocalOnboardData] = useState<any>(() => {
    const raw = localStorage.getItem('localOnboardData');
    return raw ? JSON.parse(raw) : null;
  });

  // Wider/Comprehensive questionnaire values
  const [widerCompleted, setWiderCompleted] = useState<boolean>(() => {
    return localStorage.getItem('localWiderCompleted') === 'true';
  });

  const [widerAnswers, setWiderAnswers] = useState(() => {
    const raw = localStorage.getItem('localWiderAnswers');
    if (raw) return JSON.parse(raw);
    return {
      milestone1: 'Implement automated flow mechanics',
      milestone2: 'Minimize digital drag score to < 10%',
      teamSize: '1-5 Active Nodes',
      primarySystem: 'Slack + Customized Spreadsheet',
      serverRegion: 'Frankfurt Local Hub',
      emergencyBackup: 'Autonomous cellular relay',
      escalationSla: 'SMS dispatch under 10 mins'
    };
  });

  // Profile editing inputs
  const [fullName, setFullName] = useState(() => {
    if (profile?.fullName) return profile.fullName;
    const cache = localStorage.getItem('localProfileName');
    if (cache) return cache;
    const rawData = localStorage.getItem('localOnboardData');
    if (rawData) {
      const data = JSON.parse(rawData);
      return data.name || data.repName || '';
    }
    return '';
  });

  const [role, setRole] = useState(() => {
    if (profile?.role) return profile.role;
    const cache = localStorage.getItem('localProfileRole');
    if (cache) return cache;
    const rawData = localStorage.getItem('localOnboardData');
    if (rawData) {
      const data = JSON.parse(rawData);
      return data.repTitle || 'Founder / Builder';
    }
    return '';
  });

  const [companyName, setCompanyName] = useState(() => {
    if (profile?.companyName) return profile.companyName;
    const cache = localStorage.getItem('localProfileCompany');
    if (cache) return cache;
    const rawData = localStorage.getItem('localOnboardData');
    if (rawData) {
      const data = JSON.parse(rawData);
      return data.ventureName || data.companyName || '';
    }
    return '';
  });

  const [companyDescription, setCompanyDescription] = useState(() => {
    if (profile?.companyDescription) return profile.companyDescription;
    const cache = localStorage.getItem('localProfileDesc');
    if (cache) return cache;
    const rawData = localStorage.getItem('localOnboardData');
    if (rawData) {
      const data = JSON.parse(rawData);
      return `Bottleneck: ${data.bottleneck || ''}. Goal: ${data.goal || data.infrastructureGoal || ''}`;
    }
    return '';
  });

  const [phone, setPhone] = useState(() => {
    if (profile?.phone) return profile.phone;
    const cache = localStorage.getItem('localProfilePhone');
    if (cache) return cache;
    const rawData = localStorage.getItem('localOnboardData');
    if (rawData) {
      const data = JSON.parse(rawData);
      return data.phone || '';
    }
    return '';
  });

  // Tasks states
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskVibe, setNewTaskVibe] = useState('High Priority');
  const [loadingTasks, setLoadingTasks] = useState(false);
  
  // Status feedback
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sync state if profile changes
  useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setRole(profile.role || '');
      setCompanyName(profile.companyName || '');
      setCompanyDescription(profile.companyDescription || '');
      setPhone(profile.phone || '');
    } else {
      // Guest mode sync
      const rawType = localStorage.getItem('localOnboardType');
      const rawData = localStorage.getItem('localOnboardData');
      if (rawType && rawData) {
        setLocalOnboardType(rawType as 'founder' | 'enterprise');
        const parsed = JSON.parse(rawData);
        setLocalOnboardData(parsed);
        
        setFullName((prev) => prev || parsed.name || parsed.repName || '');
        setRole((prev) => prev || parsed.repTitle || 'Founder / Builder');
        setCompanyName((prev) => prev || parsed.ventureName || parsed.companyName || '');
        setCompanyDescription((prev) => prev || `Bottleneck: ${parsed.bottleneck || ''}. Goal: ${parsed.goal || parsed.infrastructureGoal || ''}`);
        setPhone((prev) => prev || parsed.phone || '');
      }

      // Check wider completed
      const isComMax = localStorage.getItem('localWiderCompleted') === 'true';
      setWiderCompleted(isComMax);
      const rawWide = localStorage.getItem('localWiderAnswers');
      if (rawWide) {
        setWiderAnswers(JSON.parse(rawWide));
      }
    }
  }, [profile]);

  // Load user tasks from subcollection
  const fetchTasks = async () => {
    setLoadingTasks(true);
    if (!user) {
      // Local fallback
      const local = localStorage.getItem('localTasks');
      if (local) {
        setTasks(JSON.parse(local));
      } else {
        const dummyTasks: Task[] = [
          { id: 't_1', userId: 'guest', title: 'Eliminate manual excel duplication logs', vibe: 'High Priority', status: 'todo', createdAt: new Date(), updatedAt: new Date() },
          { id: 't_2', userId: 'guest', title: 'Draft regional sovereign telemetry metrics', vibe: 'Stealth Stack', status: 'todo', createdAt: new Date(), updatedAt: new Date() }
        ];
        localStorage.setItem('localTasks', JSON.stringify(dummyTasks));
        setTasks(dummyTasks);
      }
      setLoadingTasks(false);
      return;
    }

    try {
      const snap = await getDocs(collection(db, 'registrations', user.uid, 'tasks'));
      const list: Task[] = [];
      snap.forEach((docSnap) => {
        list.push(docSnap.data() as Task);
      });
      // Sort newest tasks first
      setTasks(list.sort((a,b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
    } catch (err) {
      console.error("Failed to load sub-collection tasks", err);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Handle Edit/Save Profile Info
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMsg('');
    setErrorMsg('');

    if (!user) {
      // Guest mode - store locally
      localStorage.setItem('localProfileName', fullName);
      localStorage.setItem('localProfileRole', role);
      localStorage.setItem('localProfileCompany', companyName);
      localStorage.setItem('localProfileDesc', companyDescription);
      localStorage.setItem('localProfilePhone', phone);
      
      const updatedObj = {
        name: fullName,
        repName: fullName,
        repTitle: role,
        ventureName: companyName,
        companyName: companyName,
        bottleneck: companyDescription,
        goal: companyDescription,
        phone
      };
      localStorage.setItem('localOnboardData', JSON.stringify(updatedObj));
      setLocalOnboardData(updatedObj);

      setStatusMsg('Guest profile variables successfully saved in local cache layout. Authenticate to sync with global cloud networks.');
      return;
    }

    setSaveLoading(true);
    const docPath = `registrations/${user.uid}`;
    try {
      const updatedProfile: UserRegistrationProfile = {
        ...profile!,
        fullName,
        role,
        companyName,
        companyDescription,
        phone,
        updatedAt: serverTimestamp()
      };

      const docRef = doc(db, 'registrations', user.uid);
      await updateDoc(docRef, {
        fullName,
        role,
        companyName,
        companyDescription,
        phone,
        updatedAt: serverTimestamp()
      });

      // Update locally in context
      setProfileLocal(updatedProfile);
      setStatusMsg('Sovereign profile changes persisted to cloud database.');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Registry access disruption: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveWiderOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('localWiderAnswers', JSON.stringify(widerAnswers));
    localStorage.setItem('localWiderCompleted', 'true');
    setWiderCompleted(true);
    setStatusMsg('Strategic wider blueprint compiled and registered inside secure sandbox state.');

    if (user) {
      setSaveLoading(true);
      try {
        const docRef = doc(db, 'registrations', user.uid);
        await setDoc(docRef, {
          onboardingDetails: widerAnswers,
          onboardingCompleted: true,
          updatedAt: serverTimestamp()
        }, { merge: true });
        if (refreshProfile) {
          await refreshProfile();
        }
      } catch (err) {
        console.warn("Failed to persist wider details to Firestore, keeping locally", err);
      } finally {
        setSaveLoading(false);
      }
    }
  };

  // Add a task in subcollection
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    // Generate simple compliant alpha ID
    const taskId = 'task_' + Math.random().toString(36).substring(3, 11);
    
    const newTask: Task = {
      id: taskId,
      userId: user ? user.uid : 'guest',
      title: newTaskTitle.trim(),
      vibe: newTaskVibe,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!user) {
      const updated = [newTask, ...tasks];
      setTasks(updated);
      localStorage.setItem('localTasks', JSON.stringify(updated));
      setNewTaskTitle('');
      return;
    }

    const taskPath = `registrations/${user.uid}/tasks/${taskId}`;
    try {
      const docRef = doc(db, 'registrations', user.uid, 'tasks', taskId);
      await setDoc(docRef, {
        ...newTask,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setTasks((prev) => [newTask, ...prev]);
      setNewTaskTitle('');
    } catch (err: any) {
      console.error(err);
      handleFirestoreError(err, OperationType.CREATE, taskPath);
    }
  };

  // Toggle status of a task
  const handleToggleTask = async (taskId: string, currentStatus: 'todo' | 'active' | 'deployed') => {
    const nextStatus: 'todo' | 'active' | 'deployed' = currentStatus === 'todo' ? 'active' : currentStatus === 'active' ? 'deployed' : 'todo';
    
    if (!user) {
      const updated = tasks.map((t) => t.id === taskId ? { ...t, status: nextStatus, updatedAt: new Date() } : t);
      setTasks(updated);
      localStorage.setItem('localTasks', JSON.stringify(updated));
      return;
    }

    try {
      const docRef = doc(db, 'registrations', user.uid, 'tasks', taskId);
      await updateDoc(docRef, {
        status: nextStatus,
        updatedAt: serverTimestamp()
      });

      setTasks((prev) => 
        prev.map((t) => t.id === taskId ? { ...t, status: nextStatus, updatedAt: new Date() } : t)
      );
    } catch (err: any) {
      console.error(err);
    }
  };

  // Delete a task
  const handleDeleteTask = async (taskId: string) => {
    if (!user) {
      const updated = tasks.filter((t) => t.id !== taskId);
      setTasks(updated);
      localStorage.setItem('localTasks', JSON.stringify(updated));
      return;
    }

    try {
      await deleteDoc(doc(db, 'registrations', user.uid, 'tasks', taskId));
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8" id="founder-workspace-portal">
      {/* GUEST MODE SANDBOX NOTIFICATION */}
      {!user && (
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-amber-800 shadow-sm animate-fadeIn">
          <div className="flex items-start gap-3.5">
            <span className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg shrink-0 border border-amber-200/30">⚠️</span>
            <div>
              <p className="font-bold uppercase tracking-wide text-[10px] text-amber-900">GUEST PREVIEW CONSOLE ACTIVE</p>
              <p className="text-amber-700 text-[10.5px] mt-0.5 leading-relaxed">
                Your blueprints, profile registry inputs, and task board are currently stored in your local browser cache instead of our centralized database. Pages have no restrictions. To link this deployment with global backup nodes, authenticate your hub.
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => {
              const authBtn = document.getElementById('login-btn');
              if (authBtn) authBtn.click();
            }}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-xl font-mono text-[9px] hover:bg-slate-800 transition-all cursor-pointer font-bold shrink-0 shadow-xs"
          >
            CONNECT CLOUD DB (SIGN UP)
          </button>
        </div>
      )}

      {/* Workspace Header Panel */}
      <div className="bg-slate-950 p-6 md:p-8 rounded-2xl border border-zinc-800 text-white relative overflow-hidden shadow-lg animate-fadeIn">
        <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-900 rounded-full filter blur-3xl opacity-35 -z-15"></div>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-400/10 border border-yellow-400/25 text-yellow-500 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
              <Cpu className="w-3.5 h-3.5" /> SECURE DECENTRALIZED WORKSPACE
            </div>
            
            <div className="flex items-center gap-2">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-wider">Clearance level:</span>
              <span className={`px-2.5 py-0.5 font-mono text-[9px] font-black uppercase rounded border ${
                profile?.registrationStatus === 'verified'
                  ? 'bg-emerald-500/10 border-emerald-505/20 text-[#86d900]'
                  : profile?.registrationStatus === 'suspended'
                    ? 'bg-rose-500/10 border-rose-505/20 text-rose-500'
                    : 'bg-amber-500/10 border-amber-505/20 text-amber-500'
              }`}>
                {profile?.registrationStatus || 'PENDING_REVIEW'}
              </span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-sans leading-none">
            WELCOME, {fullName.toUpperCase() || 'CO-FOUNDER'}
          </h2>
          <p className="text-zinc-300 text-xs md:text-sm max-w-2xl leading-relaxed font-sans font-medium">
            This is your private administrative vault. Here, your critical venture blueprints, tactical action streams, and organizational metadata are recorded securely inside our hardened cloud database.
          </p>
        </div>
      </div>

      {/* STRATEGIC COMPREHENSIVE ONBOARDING BLUEPRINT */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-900"></div>
        
        {!widerCompleted ? (
          <form onSubmit={handleSaveWiderOnboarding} className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-zinc-150 gap-4">
              <div>
                <div className="inline-block px-2.5 py-0.5 bg-slate-100 border border-zinc-250 text-slate-800 font-mono text-[8.5px] uppercase font-black rounded">
                  Active Configuration Layer: {localOnboardType === 'enterprise' ? 'ENTERPRISE OPERATIONAL ALIGNMENT' : 'FOUNDER STRATEGIC ALIGNMENT'}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight mt-1.5">
                  Wider Tactical Blueprint Questionnaire (Phase 2)
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5 font-sans font-semibold">Please provide core organizational constraints, security paradigms, and operational backup preferences.</p>
              </div>
              
              {/* Vibe toggler if they want to override */}
              <div className="flex items-center gap-1.5 border border-zinc-200 rounded-lg p-1 bg-zinc-50 shrink-0">
                <button 
                  type="button"
                  onClick={() => { setLocalOnboardType('founder'); localStorage.setItem('localOnboardType', 'founder'); }}
                  className={`px-3 py-1 font-mono text-[9px] font-black uppercase rounded transition-all cursor-pointer ${
                    localOnboardType !== 'enterprise' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
                  }`}
                >
                  Founder
                </button>
                <button 
                  type="button"
                  onClick={() => { setLocalOnboardType('enterprise'); localStorage.setItem('localOnboardType', 'enterprise'); }}
                  className={`px-3 py-1 font-mono text-[9px] font-black uppercase rounded transition-all cursor-pointer ${
                    localOnboardType === 'enterprise' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-black hover:bg-zinc-100'
                  }`}
                >
                  Enterprise
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="space-y-1">
                <label className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Strategic Milestone Alpha (Near Term)</label>
                <input 
                  type="text" 
                  required
                  value={widerAnswers.milestone1}
                  onChange={(e) => setWiderAnswers({ ...widerAnswers, milestone1: e.target.value })}
                  placeholder="e.g. Deploy 3 parallel autonomous WhatsApp dispatcher nodes" 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-850 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Strategic Milestone Beta (Mid Term)</label>
                <input 
                  type="text" 
                  required
                  value={widerAnswers.milestone2}
                  onChange={(e) => setWiderAnswers({ ...widerAnswers, milestone2: e.target.value })}
                  placeholder="e.g. Minimize administration cycle latency by 90%" 
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-850 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Team Node Capacity Size</label>
                <select 
                  value={widerAnswers.teamSize}
                  onChange={(e) => setWiderAnswers({ ...widerAnswers, teamSize: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-850 focus:outline-none focus:border-zinc-400"
                >
                  <option value="1 Solo Node">1 Solo Operator</option>
                  <option value="2-5 Active Nodes">2-5 Core Co-Founders</option>
                  <option value="5-15 Venture Nodes">5-15 Advanced Members</option>
                  <option value="15-50 Segment Nodes">15-50 Corporate Members</option>
                  <option value="50+ Enterprise Scale">50+ Large Enterprise Clusters</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Primary System software integration targets</label>
                <input 
                  type="text" 
                  required
                  value={widerAnswers.primarySystem}
                  onChange={(e) => setWiderAnswers({ ...widerAnswers, primarySystem: e.target.value })}
                  placeholder="e.g. Slack workspace feeds, CRM databases, PostgreSQL hubs" 
                  className="w-full bg-[#FCFCFB] border border-zinc-200 rounded-lg px-3 py-2 text-zinc-850 placeholder:text-zinc-300 focus:outline-none focus:border-zinc-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Regional Data Sovereignty Proxy Site</label>
                <select 
                  value={widerAnswers.serverRegion}
                  onChange={(e) => setWiderAnswers({ ...widerAnswers, serverRegion: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-850 focus:outline-none focus:border-zinc-400"
                >
                  <option value="Frankfurt Local Hub">Frankfurt Secure Server Hub (Recommended)</option>
                  <option value="Beirut Local Edge server">Beirut Local Physical Edge</option>
                  <option value="Ireland Regional GDPR Proxy">Ireland GDPR Sovereign Region</option>
                  <option value="USA Northeast Core Node">USA Northeast Core Node</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Urgent hardware escalation response SLA Tier</label>
                <select 
                  value={widerAnswers.escalationSla}
                  onChange={(e) => setWiderAnswers({ ...widerAnswers, escalationSla: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-850 focus:outline-none focus:border-zinc-400"
                >
                  <option value="Standard email review under 24 hours">Standard email review under 24 hours</option>
                  <option value="Live WhatsApp developer channel dispatch under 1 hour">Live WhatsApp developer dispatch under 1 hour</option>
                  <option value="Dual-ring hardware SMS & cellular pager bypass">Dual-ring Hardware SMS priority pager bypass</option>
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Emergency System offline backup protocols</label>
                <select 
                  value={widerAnswers.emergencyBackup}
                  onChange={(e) => setWiderAnswers({ ...widerAnswers, emergencyBackup: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-850 focus:outline-none focus:border-zinc-400"
                >
                  <option value="Paper logs and local spreadsheet archives">Paper system logs and manual spreadsheet exports</option>
                  <option value="Local browser SQLite offline state ledger database">Local browser SQLite offline state ledger database</option>
                  <option value="Autonomous high-frequency local cellular relay networks">Autonomous high-frequency local cellular relay network sync</option>
                  <option value="Cloud data replica clusters with mirror failover nodes">Cloud replication clusters with live mirror failover</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button 
                type="submit"
                disabled={saveLoading}
                className="px-6 py-3.5 bg-zinc-950 border border-transparent hover:bg-zinc-800 text-[#9DFF00] rounded-xl font-bold uppercase text-[10px] tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 w-full md:w-auto shadow-sm"
              >
                {saveLoading ? 'REGISTERING BLUEPRINT...' : 'SAVE & SECURE COMPREHENSIVE TACTICAL BLUEPRINT'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-zinc-150 gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#9DFF00]/10 border border-[#9DFF00]/30 text-slate-900 font-mono text-[8.5px] uppercase font-black rounded animate-pulse">
                  ✓ ACTIVE STRATEGIC BLUEPRINT MATRIX RECORDED
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight mt-1.5">
                  OPERATIONAL PARAMETERS SCORECARD
                </h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Your sovereign variables are preloaded below. You can update or recalibrate these inputs at any time.</p>
              </div>

              <button 
                type="button"
                onClick={() => { setWiderCompleted(false); localStorage.setItem('localWiderCompleted', 'false'); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-zinc-200 rounded-lg text-[9px] font-mono tracking-wider font-extrabold uppercase hover:shadow-xs transition-all cursor-pointer shrink-0"
              >
                [Edit Strategic Blueprint]
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[8.5px] text-zinc-500 font-mono uppercase font-bold">// Strategic Milestone A</span>
                <p className="text-xs font-sans font-extrabold text-slate-900 uppercase block leading-tight">{widerAnswers.milestone1}</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[8.5px] text-zinc-500 font-mono uppercase font-bold">// Strategic Milestone B</span>
                <p className="text-xs font-sans font-extrabold text-slate-900 uppercase block leading-tight">{widerAnswers.milestone2}</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[8.5px] text-zinc-500 font-mono uppercase font-bold">// Node Group Capacity</span>
                <p className="text-xs font-sans font-extrabold text-slate-900 uppercase block leading-tight">{widerAnswers.teamSize}</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[8.5px] text-zinc-500 font-mono uppercase font-bold">// Integration Target API</span>
                <p className="text-xs font-sans font-extrabold text-[#FF4F2E] uppercase block leading-tight">{widerAnswers.primarySystem}</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[8.5px] text-zinc-500 font-mono uppercase font-bold">// Data Sovereignty Proxy</span>
                <p className="text-xs font-sans font-extrabold text-slate-900 uppercase block leading-tight">{widerAnswers.serverRegion}</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl space-y-1.5 shadow-xs">
                <span className="text-[8.5px] text-zinc-500 font-mono uppercase font-bold">// Hardware SLA Tier</span>
                <p className="text-xs font-sans font-extrabold text-slate-900 uppercase block leading-tight">{widerAnswers.escalationSla}</p>
              </div>

              <div className="bg-zinc-50 border border-zinc-200/60 p-4 rounded-xl space-y-1.5 sm:col-span-2 shadow-xs">
                <span className="text-[8.5px] text-zinc-500 font-mono uppercase font-bold">// Emergency Backup Protocols</span>
                <p className="text-xs font-sans font-extrabold text-[#86d900] uppercase block leading-tight">{widerAnswers.emergencyBackup}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Edit Registration Data ("record all info") */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs space-y-6">
          <div className="space-y-1 pb-3 border-b border-zinc-100">
            <h3 className="font-extrabold text-sm uppercase text-slate-900 flex items-center gap-2 font-sans">
              <User className="w-4 h-4 text-zinc-600" /> Co-Founder Profile Registry
            </h3>
            <p className="text-[10px] text-zinc-400 font-mono">PERSISTENT GENERAL LEDGER CREDENTIALS</p>
          </div>

          {/* Messages */}
          {statusMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-800 rounded-xl text-xs font-mono flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-[#86d900] shrink-0 mt-0.5" />
              <p>{statusMsg}</p>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-150 text-rose-700 rounded-xl text-xs font-mono flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4">
            {/* Display static non-immutable Email */}
            <div className="space-y-1">
              <label className="font-mono text-[8.5px] text-zinc-400 uppercase tracking-widest block font-bold">
                Identity Anchor Email (Locked)
              </label>
              <input
                type="text"
                disabled
                value={profile?.email || user?.email || ''}
                className="w-full bg-zinc-50 border border-zinc-200/80 rounded-lg px-3.5 py-2 text-xs text-zinc-500 font-mono focus:outline-none cursor-not-allowed select-all"
              />
            </div>

            {/* Editing: Full Name */}
            <div className="space-y-1">
              <label className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">
                Founder Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Salim K. Warde"
                className="w-full bg-white border border-zinc-200/90 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            {/* Role sector */}
            <div className="space-y-1">
              <label className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">
                Veu-Tech Officer Role
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="CEO & Managing Director"
                className="w-full bg-white border border-zinc-200/90 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            {/* Startup/Venture name */}
            <div className="space-y-1">
              <label className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">
                Venture Startup Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Cedar Agentic Tech"
                className="w-full bg-white border border-zinc-200/90 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            {/* Secure Phone contact */}
            <div className="space-y-1">
              <label className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">
                Secured Contact Phone
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+961 3 123456"
                className="w-full bg-white border border-zinc-200/90 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>

            {/* Venture Mission */}
            <div className="space-y-1">
              <label className="font-mono text-[8.5px] text-zinc-500 uppercase tracking-widest block font-bold">
                Venture Mission & Stack
              </label>
              <textarea
                rows={3}
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
                placeholder="Describe your current tech stacks or optimization request."
                className="w-full bg-white border border-zinc-200/90 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-zinc-500 font-mono resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saveLoading}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-[#9DFF00] font-mono text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                {saveLoading ? 'UPDATING DB REPOSITORY...' : 'COMMIT PROFILE REGISTRY'}
              </button>
            </div>
          </form>
        </div>

        {/* Right column: Action Board and Workspace task list (Subcollection tracking!) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-zinc-200/80 shadow-xs space-y-6">
          <div className="space-y-1 pb-3 border-b border-zinc-100 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm uppercase text-slate-900 flex items-center gap-2 font-sans">
                <CheckSquare className="w-4 h-4 text-zinc-650" /> Tactical Action Engine
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">PRIVATE SECURED SUBCOLLECTION TASK LEDGER</p>
            </div>
            
            <button
              onClick={fetchTasks}
              className="p-1 px-2 border border-zinc-200 hover:bg-zinc-50 text-[9px] font-mono text-zinc-500 hover:text-zinc-800 rounded-md uppercase transition-all flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Sync Tasks
            </button>
          </div>

          {/* Quick inline task generator */}
          <form onSubmit={handleAddTask} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 bg-zinc-50 p-3 rounded-xl border border-zinc-200/50">
            <div className="sm:col-span-2">
              <input
                type="text"
                required
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g., Integrate ArabBankers SMS socket API"
                className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-zinc-400 font-mono placeholder-zinc-400"
              />
            </div>
            <div>
              <select
                value={newTaskVibe}
                onChange={(e) => setNewTaskVibe(e.target.value)}
                className="w-full bg-white border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-700 focus:outline-none focus:border-zinc-400 font-mono"
              >
                <option value="High Priority">⚠️ High Vibe</option>
                <option value="Medium Sync">⚙️ Medium Sync</option>
                <option value="Stealth Stack">📦 Stealth Stack</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 hover:scale-[1.01] transition-all text-[#9DFF00] font-mono text-[9px] font-black uppercase py-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Deploy Note
              </button>
            </div>
          </form>

          {/* Tasks ledger items list */}
          <div className="space-y-2.5">
            {loadingTasks ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-zinc-500" />
                <span>Decoding decentralized task nodes...</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-400 bg-zinc-50/50 rounded-xl border border-dashed border-zinc-200">
                ● Currently no tasks active inside your co-founder segment. Formulate a goal above to commit it securely.
              </div>
            ) : (
              tasks.map((task) => {
                const statusIndicators = {
                  todo: { icon: <Square className="w-4 h-4 text-zinc-400" />, text: 'TODO', color: 'bg-zinc-100 text-zinc-650' },
                  active: { icon: <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />, text: 'ACTIVE', color: 'bg-blue-50 text-blue-700' },
                  deployed: { icon: <CheckCircle className="w-4 h-4 text-emerald-505" />, text: 'DEPLOYED', color: 'bg-emerald-50 text-emerald-705 border-emerald-100' }
                };

                const currentInd = statusIndicators[task.status] || statusIndicators.todo;

                return (
                  <div 
                    key={task.id} 
                    className="p-3.5 bg-white border border-zinc-200 hover:border-zinc-300 rounded-xl shadow-xs transition-all flex items-center justify-between gap-4 group animate-fadeIn"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id, task.status)}
                        className="cursor-pointer hover:scale-110 active:scale-95 transition-transform"
                        title="Change development cycle status"
                      >
                        {currentInd.icon}
                      </button>
                      <div>
                        <p className={`text-xs font-semibold leading-normal ${task.status === 'deployed' ? 'line-through text-zinc-450 font-normal outline-zinc-400' : 'text-slate-900'}`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8.5px] font-mono font-extrabold px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-500 rounded uppercase">
                            {task.vibe}
                          </span>
                          <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded uppercase font-bold border ${currentInd.color}`}>
                            {currentInd.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-1 text-zinc-305 hover:text-red-500 opacity-60 hover:opacity-100 transition-all cursor-pointer"
                      title="Purge tactical task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
