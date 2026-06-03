import React, { useState, useEffect } from 'react';
import { Goal } from '../types';
import { INITIAL_GOALS } from '../data/mockData';
import { 
  PlusCircle, 
  CheckCircle, 
  Trash2, 
  Calendar, 
  Flame, 
  Hourglass,
  Bell,
  Volume2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Goal['category']>('Habit');
  const [dueDate, setDueDate] = useState('');

  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    const saved = localStorage.getItem('rawcoach_notifications_enabled');
    return saved !== 'false'; // default true
  });

  const [simulatedNotify, setSimulatedNotify] = useState<{
    id: string;
    title: string;
    message: string;
    goalId?: string;
  } | null>(null);

  // Sound generator using HTML5 Web Audio API
  const playBeep = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
      
      setTimeout(() => {
        const ctx2 = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc2 = ctx2.createOscillator();
        const gain2 = ctx2.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx2.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1046.50, ctx2.currentTime); // C6 Note
        gain2.gain.setValueAtTime(0.08, ctx2.currentTime);
        osc2.start();
        osc2.stop(ctx2.currentTime + 0.155);
      }, 120);
    } catch (e) {
      // Audio issue
    }
  };

  const saveNotificationsEnabled = (val: boolean) => {
    setNotificationsEnabled(val);
    localStorage.setItem('rawcoach_notifications_enabled', String(val));
    if (!val) {
      setSimulatedNotify(null);
    }
  };

  const triggerStreakWarning = (forcedGoal?: Goal) => {
    const habitToAlert = forcedGoal || goals.find(g => 
      g.category === 'Habit' && 
      g.status !== 'Done' && 
      (g.dueDate === '2026-05-31' || g.dueDate === '2026-06-01')
    );

    if (habitToAlert) {
      setSimulatedNotify({
        id: Math.random().toString(),
        title: '🔥 HABIT STREAK EXPIRING SOON',
        message: `Your streak of ${habitToAlert.streak} Days on "${habitToAlert.title}" is nearing its expiration. Guard your progress now!`,
        goalId: habitToAlert.id
      });
      playBeep();
    } else {
      setSimulatedNotify({
        id: Math.random().toString(),
        title: '⚠️ CRITIQUE SENTINEL REPORT',
        message: 'Daily system audits indicate no imminent habit expirations. Keep pushing milestones to maintain high performance indices.',
      });
      playBeep();
    }
  };

  // Auto trigger check to simulate a notification when habit streak is nearing due date
  useEffect(() => {
    if (!notificationsEnabled || goals.length === 0) return;
    
    const timer = setTimeout(() => {
      const targetHabit = goals.find(g => 
        g.category === 'Habit' && 
        g.status !== 'Done' && 
        (g.dueDate === '2026-05-31' || g.dueDate === '2026-06-01')
      );
      if (targetHabit) {
        triggerStreakWarning(targetHabit);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [notificationsEnabled, goals.length]);

  const handleResolveAlert = (id: string, action: 'done' | 'snooze') => {
    if (action === 'done') {
      const updated = goals.map(g => {
        if (g.id === id) {
          return { 
            ...g, 
            status: 'Done' as Goal['status'], 
            streak: g.streak + 1 
          };
        }
        return g;
      });
      saveGoals(updated);
    }
    setSimulatedNotify(null);
  };

  // Initializing from localStorage if existing
  useEffect(() => {
    const saved = localStorage.getItem('rawcoach_goals');
    if (saved) {
      try {
        setGoals(JSON.parse(saved));
      } catch (e) {
        setGoals(INITIAL_GOALS);
      }
    } else {
      setGoals(INITIAL_GOALS);
    }
  }, []);

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem('rawcoach_goals', JSON.stringify(updatedGoals));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: Goal = {
      id: Math.random().toString(),
      title: newTitle.trim(),
      category: newCategory,
      status: 'Pending',
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      streak: newCategory === 'Habit' ? 1 : 0
    };

    const updated = [newGoal, ...goals];
    saveGoals(updated);
    setNewTitle('');
    setDueDate('');
  };

  const toggleStatus = (id: string) => {
    const updated = goals.map(g => {
      if (g.id === id) {
        let nextStatus: Goal['status'] = 'Pending';
        let nextStreak = g.streak;
        if (g.status === 'Pending') {
          nextStatus = 'In Progress';
        } else if (g.status === 'In Progress') {
          nextStatus = 'Done';
          if (g.category === 'Habit') nextStreak += 1;
        } else {
          nextStatus = 'Pending';
          if (g.category === 'Habit') nextStreak = Math.max(0, nextStreak - 1);
        }
        return { ...g, status: nextStatus, streak: nextStreak };
      }
      return g;
    });
    saveGoals(updated);
  };

  const handleIncrementStreak = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = goals.map(g => {
      if (g.id === id) {
        return { ...g, streak: g.streak + 1 };
      }
      return g;
    });
    saveGoals(updated);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = goals.filter(g => g.id !== id);
    saveGoals(updated);
  };

  const doneCount = goals.filter(g => g.status === 'Done').length;
  const progressCount = goals.filter(g => g.status === 'In Progress').length;
  const totalCount = goals.length;

  return (
    <div className="space-y-8 text-zinc-900 animate-fadeIn" id="goal-tracker-space">
      {/* Real-time Simulated Push Notification Toast */}
      <AnimatePresence>
        {simulatedNotify && (
          <motion.div
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed top-20 right-6 z-[9999] w-85 bg-white border-2 border-black p-4 rounded-xl shadow-lg space-y-3"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <div className="flex items-center gap-2 text-black">
                <Bell className="w-4 h-4 text-black animate-bounce" />
                <span className="font-mono text-[9.5px] font-black uppercase tracking-wider">theCsuiteCOACH CO-PILOT SENTINEL GATEWAY</span>
              </div>
              <button 
                onClick={() => setSimulatedNotify(null)} 
                className="text-zinc-400 hover:text-black transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                <h5 className="font-mono text-[9px] font-black text-red-700 bg-red-50 inline-block rounded uppercase tracking-wide border border-red-200 px-1.5 py-0.5">
                  {simulatedNotify.title}
                </h5>
              </div>
              <p className="text-[11px] text-zinc-800 leading-normal font-mono select-all pt-1">
                {simulatedNotify.message}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-zinc-200">
              {simulatedNotify.goalId ? (
                <>
                  <button
                    onClick={() => handleResolveAlert(simulatedNotify.goalId!, 'done')}
                    className="flex-1 py-2 bg-black hover:bg-zinc-805 text-white font-mono text-[9.5px] uppercase font-black tracking-wider rounded-lg transition-colors cursor-pointer"
                  >
                    RESOLVE MILESTONE (+1D STREAK)
                  </button>
                  <button
                    onClick={() => handleResolveAlert(simulatedNotify.goalId!, 'snooze')}
                    className="px-3 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-650 font-mono text-[9px] uppercase font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    SNOOZE
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setSimulatedNotify(null)}
                  className="w-full py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-205 text-zinc-700 font-mono text-[9.5px] uppercase font-bold rounded-lg transition-colors cursor-pointer"
                >
                  DISMISS LOG
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* High impact metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="font-mono text-[10px] text-zinc-550 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> COMPLETED MILESTONES
          </span>
          <h4 className="text-4xl font-extrabold text-black mt-4">{doneCount}<span className="text-zinc-400 text-2xl font-mono">/{totalCount}</span></h4>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono uppercase tracking-wide">100% verified operations.</p>
        </div>

        <div className="bg-zinc-50 border border-black p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="font-mono text-[10px] text-black uppercase tracking-widest font-black flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-red-655" /> HIGH HABIT STREAK
          </span>
          <h4 className="text-4xl font-extrabold text-black mt-4">
            {goals.reduce((acc, g) => Math.max(acc, g.streak), 0)}
            <span className="text-xs font-mono ml-1 font-semibold text-zinc-600">Days</span>
          </h4>
          <p className="text-[10px] text-zinc-500 mt-2 font-mono uppercase tracking-wide">Consistent team building.</p>
        </div>

        <div className="bg-white border border-zinc-200 p-6 rounded-2xl flex flex-col justify-between shadow-sm">
          <span className="font-mono text-[10px] text-zinc-550 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
            <Hourglass className="w-4 h-4 text-amber-550" /> ACTIVE DEPLOYMENTS
          </span>
          <h4 className="text-4xl font-extrabold text-red-500 mt-4">{progressCount}</h4>
          <p className="text-[10px] text-zinc-400 mt-2 font-mono uppercase tracking-wide font-medium">Awaiting evaluation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Creation panel */}
        <div className="lg:col-span-5 bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="border-b border-zinc-200 pb-4">
            <h3 className="font-extrabold text-sm text-black uppercase tracking-wider">ADD ACTION PARAMETER</h3>
            <p className="text-[10px] text-zinc-500 font-mono mt-1 uppercase tracking-wide">Update corporate training pipeline</p>
          </div>

          <form onSubmit={handleAddGoal} className="space-y-4">
            <div>
              <label className="block text-[10px] font-mono font-bold uppercase text-zinc-500 mb-2 tracking-wider">Objective or Habit Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Set up weekly model diagnostics"
                required
                className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-zinc-500 mb-2 tracking-wider">Focus Group</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Goal['category'])}
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 focus:outline-none focus:border-black"
                >
                  <option value="Task Force">Task Force</option>
                  <option value="AI Deployment">AI Deployment</option>
                  <option value="Habit">Daily Habit</option>
                  <option value="Ceo Action">CEO Action</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase text-zinc-500 mb-2 tracking-wider">Target Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-xs font-mono text-zinc-800 focus:outline-none select-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-black text-white hover:bg-zinc-800 rounded-lg font-mono text-xs tracking-wider uppercase font-black transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" /> COMMIT OBJECTIVE
            </button>
          </form>

          {/* Habit Sentinel Notification Control Panel */}
          <div className="border-t border-zinc-200 pt-6 space-y-4">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-500 uppercase font-black tracking-wider">
              <span className="flex items-center gap-2">
                <Bell className={`w-3.5 h-3.5 ${notificationsEnabled ? 'text-black animate-pulse' : 'text-zinc-400'}`} />
                <span>Habit Due Sentinel</span>
              </span>
              <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded ${
                notificationsEnabled 
                  ? 'bg-zinc-100 text-black border border-zinc-200' 
                  : 'bg-zinc-50 border border-zinc-200 text-zinc-400'
              }`}>
                {notificationsEnabled ? 'ONLINE' : 'MUTED'}
              </span>
            </div>

            <p className="text-[10px] text-zinc-550 font-mono leading-relaxed uppercase">
              Monitors expiring streaks and pushes a real-time responsive browser alert with custom synthesis sound when habit milestones approach due thresholds.
            </p>

            <div className="flex items-center justify-between bg-zinc-50 p-3 rounded-lg border border-zinc-200">
              <span className="text-[11px] font-mono text-zinc-700 uppercase">Alert Transmission Active</span>
              <button
                type="button"
                onClick={() => saveNotificationsEnabled(!notificationsEnabled)}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none cursor-pointer ${
                  notificationsEnabled ? 'bg-black' : 'bg-zinc-200'
                }`}
                aria-label="Toggle notifications"
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ease-in-out ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {notificationsEnabled && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => triggerStreakWarning()}
                  className="w-full py-2 bg-white hover:bg-zinc-50 border border-zinc-250 hover:border-black text-black font-mono text-[9px] uppercase font-black tracking-wider transition-all rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Volume2 className="w-3.5 h-3.5 text-black" /> Shock-Simulate Expiry Notification
                </button>
                <p className="text-[8.5px] font-mono text-zinc-455 text-center uppercase">
                  ⚡ Expiring is simulated automatically 2.5s after load. Use key above to manually trigger.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Goals Listing */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
            <h3 className="font-extrabold text-sm text-black uppercase tracking-wider">DEPLOYMENT PROTOCOLS</h3>
            <span className="font-mono text-[9px] font-black text-black uppercase tracking-widest bg-zinc-100 px-2 py-0.5 border border-zinc-205 rounded">LIST STABLE</span>
          </div>

          <div className="space-y-3">
            {goals.length === 0 ? (
              <div className="text-center py-12 text-zinc-500 font-mono text-[11px] border border-dashed border-zinc-200 rounded-xl bg-zinc-50/40">
                NO ACTIVE OBJECTIVES DETECTED. PRESET REGISTRATION EMPTY.
              </div>
            ) : (
              goals.map((g) => {
                const isDone = g.status === 'Done';
                const isInProgress = g.status === 'In Progress';
                
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleStatus(g.id)}
                    className={`p-4 border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer transition-all ${
                      isDone 
                        ? 'bg-zinc-50/60 border-zinc-200 text-zinc-400 opacity-60 hover:opacity-85' 
                        : 'bg-white border-zinc-200 text-zinc-800 hover:border-black hover:bg-zinc-50/50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-5 h-5 border rounded flex items-center justify-center font-bold text-[10px] ${
                        isDone 
                          ? 'bg-emerald-100 border-emerald-200 text-emerald-800' 
                          : isInProgress 
                            ? 'bg-amber-100 border-amber-350 text-amber-800 animate-pulse' 
                            : 'bg-zinc-50 border-zinc-250 text-zinc-550'
                      }`}>
                        {isDone ? '✓' : isInProgress ? '★' : '○'}
                      </div>
                      
                      <div>
                        <h4 className={`text-xs font-bold leading-relaxed tracking-tight ${isDone ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                          {g.title}
                        </h4>
                        
                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                          <span className="font-mono text-[8.5px] font-black uppercase text-red-700 px-1.5 py-0.5 rounded border border-red-200 bg-red-50">
                            {g.category}
                          </span>
                          <span className="font-mono text-[8.5px] text-zinc-500 flex items-center gap-1 uppercase">
                            <Calendar className="w-2.5 h-2.5" /> D: {g.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      {g.category === 'Habit' && (
                        <button
                          onClick={(e) => handleIncrementStreak(g.id, e)}
                          className="px-2 py-1 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 rounded flex items-center gap-1 font-mono text-[9px] font-black text-black hover:border-black transition-all"
                          title="Boost streak count"
                        >
                          <Flame className="w-3 h-3 text-red-500" /> {g.streak}D
                        </button>
                      )}

                      <button
                        onClick={(e) => handleDelete(g.id, e)}
                        className="p-2 hover:bg-red-50 rounded border border-transparent hover:border-red-250 text-zinc-400 hover:text-red-650 transition-all cursor-pointer"
                        title="Delete Objective"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
