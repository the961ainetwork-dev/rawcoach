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

  // Profile editing inputs
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [role, setRole] = useState(profile?.role || '');
  const [companyName, setCompanyName] = useState(profile?.companyName || '');
  const [companyDescription, setCompanyDescription] = useState(profile?.companyDescription || '');
  const [phone, setPhone] = useState(profile?.phone || '');

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
    }
  }, [profile]);

  // Load user tasks from subcollection
  const fetchTasks = async () => {
    if (!user) return;
    setLoadingTasks(true);
    const subPath = `registrations/${user.uid}/tasks`;
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
    if (!user || !profile) return;
    setSaveLoading(true);
    setStatusMsg('');
    setErrorMsg('');

    const docPath = `registrations/${user.uid}`;
    try {
      const updatedProfile: UserRegistrationProfile = {
        ...profile,
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

  // Add a task in subcollection
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTaskTitle.trim()) return;
    
    // Generate simple compliant alpha ID
    const taskId = 'task_' + Math.random().toString(36).substring(3, 11);
    const taskPath = `registrations/${user.uid}/tasks/${taskId}`;
    
    const newTask: Task = {
      id: taskId,
      userId: user.uid,
      title: newTaskTitle.trim(),
      vibe: newTaskVibe,
      status: 'todo',
      createdAt: new Date(), // Local fallback while in state
      updatedAt: new Date()
    };

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
    if (!user) return;
    const nextStatus: 'todo' | 'active' | 'deployed' = currentStatus === 'todo' ? 'active' : currentStatus === 'active' ? 'deployed' : 'todo';
    
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
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'registrations', user.uid, 'tasks', taskId));
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8" id="founder-workspace-portal">
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
            WELCOME, {profile?.fullName?.toUpperCase() || 'CO-FOUNDER'}
          </h2>
          <p className="text-zinc-300 text-xs md:text-sm max-w-2xl leading-relaxed font-sans font-medium">
            This is your private administrative vault. Here, your critical venture blueprints, tactical action streams, and organizational metadata are recorded securely inside our hardened cloud database.
          </p>
        </div>
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
