import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  Cpu, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  ListTodo, 
  CheckCircle2, 
  Target, 
  Bell, 
  RefreshCw, 
  ArrowRight,
  TrendingUp,
  Award
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

interface RecentActivityFeedProps {
  user: any;
  profile: any;
  widerCompleted: boolean;
  widerAnswers: any;
  tasks: Task[];
  onTabChange?: (tabId: string) => void;
}

interface ActivityItem {
  id: string;
  type: 'progress' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: string;
  status: 'complete' | 'info' | 'pending';
  badge?: string;
  actionLabel?: string;
  actionTab?: string;
}

export default function RecentActivityFeed({ 
  user, 
  profile, 
  widerCompleted, 
  widerAnswers, 
  tasks,
  onTabChange 
}: RecentActivityFeedProps) {
  const [filter, setFilter] = useState<'all' | 'progress' | 'task' | 'system'>('all');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [goalsCount, setGoalsCount] = useState<number>(0);

  // Load custom goals if any
  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem('rawcoach_goals');
      if (savedGoals) {
        const parsed = JSON.parse(savedGoals);
        if (Array.isArray(parsed)) {
          setGoalsCount(parsed.length);
        }
      }
    } catch (e) {
      console.warn("Failed to read user goals", e);
    }
  }, []);

  // Compile activities dynamically based on props & state
  useEffect(() => {
    const list: ActivityItem[] = [];

    // 1. Account Creation / Onboarding Phase 1
    const company = profile?.companyName || 'Venture';
    list.push({
      id: 'act_onboard_1',
      type: 'progress',
      title: 'Sovereign Account Anchored',
      description: `Venture registered under ${company.toUpperCase()} ledger. Core identity authenticated successfully.`,
      timestamp: 'Account Genesis',
      status: 'complete',
      badge: 'PHASE 1'
    });

    // 2. Onboarding Phase 2 (Wider Strategic Blueprint)
    list.push({
      id: 'act_onboard_2',
      type: 'progress',
      title: 'Phase 2 Blueprint Compilation',
      description: widerCompleted 
        ? `Strategic variables compiled (Integration Target: ${widerAnswers?.primarySystem || 'Slack'}).` 
        : 'Strategic comprehensive questionnaires are pending input.',
      timestamp: widerCompleted ? 'Configured' : 'Needed',
      status: widerCompleted ? 'complete' : 'pending',
      badge: 'PHASE 2',
      actionLabel: !widerCompleted ? 'Configure Blueprint' : undefined
    });

    // 3. User custom goals
    if (goalsCount > 0) {
      list.push({
        id: 'act_goals',
        type: 'progress',
        title: 'Custom Focus Goals Integrated',
        description: `Committed ${goalsCount} high-leverage organizational goals to the active tracking console.`,
        timestamp: 'Active Goal Tracker',
        status: 'complete',
        badge: 'GOALS',
        actionLabel: 'View Goal Tracker',
        actionTab: 'goal-tracker'
      });
    }

    // 4. Tasks from subcollection or local
    const completedTasksNum = tasks.filter(t => t.status === 'deployed').length;
    const activeTasksNum = tasks.filter(t => t.status === 'active').length;

    tasks.forEach((task, index) => {
      if (index < 4) { // Only take latest 4 tasks to prevent cluttering the feed
        if (task.status === 'deployed') {
          list.push({
            id: `act_task_dep_${task.id}`,
            type: 'task',
            title: 'Tactical Deployment Succeeded',
            description: `Successfully deployed operational element: "${task.title}" under ${task.vibe} protocols.`,
            timestamp: 'State: Deployed',
            status: 'complete',
            badge: task.vibe.toUpperCase()
          });
        } else if (task.status === 'active') {
          list.push({
            id: `act_task_act_${task.id}`,
            type: 'task',
            title: 'Task Sequence Activated',
            description: `Began active execution stream on note: "${task.title}".`,
            timestamp: 'State: Active',
            status: 'info',
            badge: task.vibe.toUpperCase()
          });
        }
      }
    });

    // 5. System level announcements / updates with specific premium aesthetic
    list.push({
      id: 'sys_rule_audit',
      type: 'system',
      title: 'Zero-Trust Rule Compilation',
      description: 'Firebase backend firestore.rules updated. Strict validation helper logic enforced to block shadow parameter writes.',
      timestamp: 'SYSTEM CORE // v2.5.0',
      status: 'complete',
      badge: 'SECURITY'
    });

    list.push({
      id: 'sys_whatsapp',
      type: 'system',
      title: 'Coaching Automation Hub',
      description: 'WhatsApp Sandbox routing triggers optimized. Operational relays can now broadcast daily brief payloads to supervisors.',
      timestamp: 'SYSTEM CORE // v2.4.8',
      status: 'complete',
      badge: 'INTEGRATION'
    });

    list.push({
      id: 'sys_editorial',
      type: 'system',
      title: 'Anti-Burnout Magazine Layout',
      description: 'High-impact focus formats compiled for standard brief aggregates to minimize executive digital drag scores under 4 minutes.',
      timestamp: 'SYSTEM CORE // v2.4.0',
      status: 'info',
      badge: 'INTERFACE'
    });

    setActivities(list);
  }, [profile, widerCompleted, widerAnswers, tasks, goalsCount]);

  // Compute stats for engagement metrics
  const totalTasksCount = tasks.length;
  const finishedTasksCount = tasks.filter(t => t.status === 'deployed').length;
  const progressRatio = totalTasksCount > 0 ? Math.round((finishedTasksCount / totalTasksCount) * 100) : 0;
  
  // Calculate total onboarding state (Phase 1 is always 100%, Phase 2 is 100% if done, else 0%)
  const onboardingCompletion = widerCompleted ? 100 : 50;

  const filteredActivities = activities.filter(act => {
    if (filter === 'all') return true;
    return act.type === filter;
  });

  const handleAction = (item: ActivityItem) => {
    if (item.actionTab && onTabChange) {
      onTabChange(item.actionTab);
    } else if (item.id === 'act_onboard_2' && !widerCompleted) {
      // Scroll to the checklist or onboarding questionnaire
      const blueprintEl = document.getElementById('founder-workspace-portal');
      if (blueprintEl) {
        blueprintEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="bg-white border-2 border-slate-900 rounded-2xl shadow-sm p-6 space-y-6" id="personal-activity-feed-section">
      {/* Feed Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-150 pb-5 gap-4">
        <div>
          <span className="font-mono text-[9px] text-[#FF4F2E] font-black uppercase tracking-widest block">
            ⚡ PROGRESS & ANALYTICS MONITOR ⚡
          </span>
          <h3 className="text-xl font-bold tracking-tight text-slate-950 mt-1 uppercase font-sans">
            Sovereign Engagements & Activity
          </h3>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Real-time track on system optimizations, committed modular goals, and development actions.
          </p>
        </div>

        {/* Live Status indicator */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#86d900]/10 border border-[#86d900]/20 text-[#86d900] rounded-lg font-mono text-[9px] uppercase font-bold">
          <span className="w-2 h-2 rounded-full bg-[#86d900] animate-ping"></span> MONITOR ACTIVE
        </div>
      </div>

      {/* Numerical Stats Bento section to drive engagement and visual fidelity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Onboarding Stage progress card */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Onboarding Phase</span>
            <Award className="w-4 h-4 text-slate-800" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-950 font-mono">{onboardingCompletion}%</span>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-slate-900 h-full rounded-full transition-all duration-500" 
                style={{ width: `${onboardingCompletion}%` }}
              ></div>
            </div>
            <span className="text-[9px] text-zinc-400 font-mono block mt-1.5 uppercase">
              {widerCompleted ? "Phase I & II Core Registered" : "Phase II Blueprint Required"}
            </span>
          </div>
        </div>

        {/* Task Board deploy efficiency */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Deploy Efficiency</span>
            <TrendingUp className="w-4 h-4 text-[#86d900]" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-slate-950 font-mono">
              {finishedTasksCount} <span className="text-sm text-zinc-400 font-normal">/ {totalTasksCount}</span>
            </span>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#86d900] h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressRatio}%` }}
              ></div>
            </div>
            <span className="text-[9px] text-zinc-400 font-mono block mt-1.5 uppercase">
              {progressRatio}% Tasks securely deployed
            </span>
          </div>
        </div>

        {/* System parameters indicator */}
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500 font-mono font-bold uppercase">Network Integrity</span>
            <Cpu className="w-4 h-4 text-[#FF4F2E]" />
          </div>
          <div className="mt-3">
            <span className="text-3xl font-black text-[#FF4F2E] font-mono">100%</span>
            <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#FF4F2E] w-full h-full rounded-full"></div>
            </div>
            <span className="text-[9px] text-zinc-400 font-mono block mt-1.5 uppercase">
              Relays: {user ? 'Cloud Sync DB Bound' : 'Local Sandbox mode'}
            </span>
          </div>
        </div>
      </div>

      {/* Feed Filters */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-100 pb-4">
        {(['all', 'progress', 'task', 'system'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 rounded-lg font-mono text-[9px] tracking-wider uppercase font-black cursor-pointer transition-all ${
              filter === t 
                ? 'bg-slate-950 text-[#9DFF00] font-bold shadow-xs' 
                : 'bg-zinc-100 text-zinc-550 hover:bg-zinc-200 hover:text-black'
            }`}
          >
            {t === 'all' && '❖ SHOW ALL LOGS'}
            {t === 'progress' && '★ BLUEPRINTS'}
            {t === 'task' && '⚙ ACTION BOARD'}
            {t === 'system' && '💻 SERVER UPDATES'}
          </button>
        ))}
      </div>

      {/* Activity Logs Stream */}
      <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
        {filteredActivities.length === 0 ? (
          <div className="py-10 text-center text-xs font-mono text-zinc-450 border border-dashed border-zinc-200 rounded-xl bg-zinc-50/50">
            No logged items registered under the select category.
          </div>
        ) : (
          filteredActivities.map((item) => (
            <div 
              key={item.id}
              className={`p-4 border rounded-xl flex items-start justify-between gap-4 transition-all hover:bg-zinc-50/40 ${
                item.status === 'pending' 
                  ? 'border-dashed border-amber-300 bg-amber-50/10' 
                  : 'border-zinc-200/80 bg-white'
              }`}
            >
              <div className="flex gap-3.5 items-start">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  item.type === 'progress' 
                    ? 'bg-purple-50 text-purple-600 border-purple-100' 
                    : item.type === 'task' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                }`}>
                  {item.type === 'progress' && <Target className="w-4 h-4" />}
                  {item.type === 'task' && <CheckCircle2 className="w-4 h-4" />}
                  {item.type === 'system' && <Bell className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h5 className="text-xs font-bold text-slate-900 font-sans tracking-tight uppercase">
                      {item.title}
                    </h5>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded font-mono text-[7.5px] font-extrabold bg-zinc-950 text-white uppercase">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-700 leading-normal font-sans font-medium">
                    {item.description}
                  </p>
                  <span className="text-[9px] text-zinc-450 font-mono uppercase block pt-1 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> {item.timestamp}
                  </span>
                </div>
              </div>

              {/* Interaction button for engagement */}
              {(item.actionLabel || item.status === 'pending') && (
                <button
                  type="button"
                  onClick={() => handleAction(item)}
                  className="px-2.5 py-1.5 border border-slate-900 bg-white hover:bg-slate-900 text-slate-900 hover:text-[#9DFF00] font-mono text-[8px] font-black uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1 tracking-wider shrink-0"
                >
                  {item.actionLabel || 'ACTIVATE'} <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
