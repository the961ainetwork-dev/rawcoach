import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BarChart2, 
  TrendingUp, 
  Activity, 
  ArrowUpRight,
  ArrowDownRight,
  Play
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import * as d3 from 'd3';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
}

function D3Sparkline({ data, width = 100, height = 30 }: SparklineProps) {
  const xScale = d3.scaleLinear()
    .domain([0, data.length - 1])
    .range([2, width - 2]);

  const yScale = d3.scaleLinear()
    .domain([d3.min(data) || 0, d3.max(data) || 100])
    .range([height - 2, 2]);

  const lineGenerator = d3.line<number>()
    .x((_, idx) => xScale(idx))
    .y((d) => yScale(d))
    .curve(d3.curveMonotoneX);

  const pathD = lineGenerator(data) || '';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="spark-glow-grad-analytics" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {data.length > 0 && (
        <path
          d={`${pathD} L ${xScale(data.length - 1)} ${height} L ${xScale(0)} ${height} Z`}
          fill="url(#spark-glow-grad-analytics)"
        />
      )}
      <path
        d={pathD}
        fill="none"
        stroke="#0f172a"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.length > 0 && (
        <circle
          cx={xScale(data.length - 1)}
          cy={yScale(data[data.length - 1])}
          r={2}
          fill="#0f172a"
        />
      )}
    </svg>
  );
}

export default function Analytics() {
  const [insightIndex, setInsightIndex] = useState(0);
  const [delegateRatio, setDelegateRatio] = useState<number>(55);
  const [efficiencyPreset, setEfficiencyPreset] = useState<'bootstrap' | 'standard' | 'overkill' | 'custom'>('standard');

  // Real-time System Efficiency Trends
  const [realTimeTrends, setRealTimeTrends] = useState([
    { elapsed: '0s', manual: 120, automated: 15 },
    { elapsed: '10s', manual: 118, automated: 14 },
    { elapsed: '20s', manual: 125, automated: 15 },
    { elapsed: '30s', manual: 130, automated: 13 },
    { elapsed: '40s', manual: 122, automated: 12 },
    { elapsed: '50s', manual: 128, automated: 14 },
    { elapsed: '60s', manual: 135, automated: 11 },
  ]);
  const [isLiveActive, setIsLiveActive] = useState(true);
  const [efficiencyTicks, setEfficiencyTicks] = useState(60);

  useEffect(() => {
    if (!isLiveActive) return;

    const interval = setInterval(() => {
      setEfficiencyTicks((prev) => {
        const nextTick = prev + 10;
        setRealTimeTrends((prevTrends) => {
          const nextTrends = [...prevTrends.slice(1)];
          const baseManual = 120 + Math.sin(nextTick / 20) * 15 + (Math.random() * 10 - 5);
          const baseAutomated = 11 + Math.cos(nextTick / 20) * 2 + (Math.random() * 3 - 1.5);

          nextTrends.push({
            elapsed: `${nextTick}s`,
            manual: Math.round(Math.max(80, Math.min(180, baseManual))),
            automated: Math.round(Math.max(5, Math.min(25, baseAutomated)))
          });
          return nextTrends;
        });
        return nextTick;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLiveActive]);

  const CustomEfficiencyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const manualVal = payload[0].value;
      const autoVal = payload[1].value;
      const reduction = Math.round(((manualVal - autoVal) / manualVal) * 100);
      return (
        <div className="bg-[#0b0f19] border border-zinc-800 p-3.5 rounded-xl font-mono text-[10px] text-zinc-300 space-y-1.5 shadow-xl">
          <p className="font-extrabold text-white border-b border-zinc-800 pb-1 mb-1 uppercase tracking-wider">// RUNTIME TICK: {payload[0].payload.elapsed}</p>
          <p className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Manual Task Processing Time: <strong className="text-white">{manualVal} mins</strong>
          </p>
          <p className="flex items-center gap-1.5 text-zinc-400">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            Automated Agent Node Processing Time: <strong className="text-white">{autoVal} mins</strong>
          </p>
          <div className="pt-1 border-t border-zinc-850 text-[#9DFF00] font-black uppercase text-[8.5px] tracking-wider text-center">
            {reduction}% SPEED SAVINGS SECURED // NO-CAP
          </div>
        </div>
      );
    }
    return null;
  };

  const recoveryRate = Math.min(98, Math.ceil(delegateRatio * 0.72 + 10)); 
  const baseSalaryDaily = 1200; 
  const daysInPeriod = 7;
  
  const chartData = [
    { name: 'Week 1', ResourceSavings: Math.round(baseSalaryDaily * daysInPeriod * 1 * (recoveryRate / 100)), AlternativeInvestment: Math.round(baseSalaryDaily * daysInPeriod * 1 * 0.15) },
    { name: 'Week 2', ResourceSavings: Math.round(baseSalaryDaily * daysInPeriod * 2 * (recoveryRate / 100)), AlternativeInvestment: Math.round(baseSalaryDaily * daysInPeriod * 2 * 0.15) },
    { name: 'Week 3', ResourceSavings: Math.round(baseSalaryDaily * daysInPeriod * 3 * (recoveryRate / 100)), AlternativeInvestment: Math.round(baseSalaryDaily * daysInPeriod * 3 * 0.15) },
    { name: 'Week 4', ResourceSavings: Math.round(baseSalaryDaily * daysInPeriod * 4 * (recoveryRate / 100)), AlternativeInvestment: Math.round(baseSalaryDaily * daysInPeriod * 4 * 0.15) },
    { name: 'Week 5', ResourceSavings: Math.round(baseSalaryDaily * daysInPeriod * 5 * (recoveryRate / 100)), AlternativeInvestment: Math.round(baseSalaryDaily * daysInPeriod * 5 * 0.15) },
    { name: 'Week 6', ResourceSavings: Math.round(baseSalaryDaily * daysInPeriod * 6 * (recoveryRate / 100)), AlternativeInvestment: Math.round(baseSalaryDaily * daysInPeriod * 6 * 0.15) },
  ];

  const estimatedSavings = chartData[5].ResourceSavings; 

  const hourlyTrend = Array.from({ length: 24 }, (_, i) => {
    if (i === 23) return recoveryRate;
    const progress = i / 23;
    const base = recoveryRate * 0.85 + (recoveryRate * 0.15 * progress);
    const wiggle = Math.sin(i * 1.5) * 1.5;
    return Math.min(98, Math.max(5, Math.ceil(base + wiggle)));
  });

  const startValue = hourlyTrend[0];
  const endValue = hourlyTrend[23];
  const diffRate = endValue - startValue;
  const pctChangeInRecovery = startValue > 0 ? (diffRate / startValue) * 100 : 0;
  const pctChangeInRecoveryString = `${pctChangeInRecovery >= 0 ? '+' : ''}${pctChangeInRecovery.toFixed(1)}%`;

  const handlePreset = (val: number) => {
    setDelegateRatio(val);
    if (val === 20) setEfficiencyPreset('bootstrap');
    else if (val === 55) setEfficiencyPreset('standard');
    else if (val === 85) setEfficiencyPreset('overkill');
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-zinc-200 p-3.5 rounded-lg font-sans text-xs space-y-1 shadow-lg text-slate-900">
          <p className="font-extrabold text-slate-900 border-b border-zinc-150 pb-1 mb-1">{payload[0].payload.name}</p>
          <p className="font-bold text-slate-950">Active Savings: ${payload[0].value.toLocaleString()} USD</p>
          <p className="text-zinc-500 font-medium text-[11px]">Recovery Index: +{recoveryRate}% RRR</p>
          <p className="text-zinc-400 font-medium text-[10.5px]">Alternative Target Cost: ${payload[1].value.toLocaleString()} USD</p>
        </div>
      );
    }
    return null;
  };

  const rawInsights = [
    "TREND: AI adoption velocity increased by 42% across corporate advisory task forces.",
    "ACTION ARCHIVE: System logged reduction in redundant software project roadmapping steps.",
    "PREDICTION: Reallocating expert consultant hours is projected to drive developer output by 38%.",
    "DECISION POINT: Replaced manual workflow tracking with the automated Goal & Action engine."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setInsightIndex((prev) => (prev + 1) % rawInsights.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 text-slate-900 animate-fadeIn" id="analytics-section">
      {/* Header section */}
      <div className="border-b border-zinc-250/60 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#EEF2F6] px-2.5 py-1 text-[9px] font-mono font-bold text-slate-700 mb-2 uppercase tracking-wide rounded border border-[#E0E6ED]">
            <Activity className="w-3.5 h-3.5 text-slate-600" /> Executive Analytics Active
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight text-[#0F172A] leading-tight font-sans">
            PERFORMANCE BOARD
          </h3>
          <p className="font-sans text-[11.5px] text-zinc-500 tracking-normal font-medium mt-1">
            Track operational efficiency metrics, active consultant hours, and structural cost optimizations.
          </p>
        </div>
        <div className="text-zinc-450 font-mono text-[10px] uppercase font-semibold">Live Workspace Report</div>
      </div>

      {/* Real-time System Efficiency Trends Section */}
      <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-sm space-y-6" id="realtime-system-efficiency-tracker">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-150 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
              <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-bold">RAWSTATE TELEMETRY // LIVESTREAM ENGINE ACTION</p>
            </div>
            <h4 className="text-lg font-extrabold text-[#0F172A] uppercase tracking-tight mt-1 font-sans">
              System Efficiency Trends: Manual vs. Automated Tasks
            </h4>
            <p className="text-xs text-zinc-500 font-medium">
              Compare human manual processing latency against serverless Agentic Swarm response timelines in real-time.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsLiveActive(!isLiveActive)}
              className={`px-3 py-1.5 font-mono text-[9px] uppercase font-bold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                isLiveActive
                  ? 'bg-[#0F172A] border-transparent text-white'
                  : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLiveActive ? 'bg-[#9DFF00] animate-ping' : 'bg-zinc-400'}`} />
              {isLiveActive ? 'Live Streaming' : 'Stream Paused'}
            </button>
            <button
              onClick={() => {
                setRealTimeTrends((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    manual: Math.round(160 + Math.random() * 20),
                    automated: Math.round(23 + Math.random() * 2)
                  };
                  return updated;
                });
              }}
              className="px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 font-mono text-[9px] uppercase font-bold text-zinc-700 rounded-lg transition-all cursor-pointer"
            >
              ⚠️ Trigger Load Spike
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Real-time Recharts Chart Container */}
          <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-5 rounded-2xl flex flex-col justify-between min-h-[350px] shadow-sm">
            <div className="flex justify-between items-center border-b border-zinc-150 pb-2 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#0F172A]" />
                <span className="font-sans text-[10.5px] text-[#0F172A] uppercase font-extrabold">Active Task Processing Times (Lower is Better)</span>
              </div>
              <div className="flex items-center gap-2 text-[8px] font-mono text-zinc-450 uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Manual Task Processing Time (mins)
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" /> Automated Agent Node Processing Time (mins)
              </div>
            </div>

            <div className="h-[250px] w-full" id="efficiency-recharts-container" style={{ minHeight: '230px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={realTimeTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F8FAFC" vertical={false} />
                  <XAxis 
                    dataKey="elapsed" 
                    stroke="#94A3B8" 
                    fontSize={9} 
                    fontFamily="Inter" 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    fontSize={9} 
                    fontFamily="Inter" 
                    tickLine={false}
                    tickFormatter={(val) => `${val}m`}
                  />
                  <Tooltip content={<CustomEfficiencyTooltip />} cursor={{ stroke: '#E2E8F0', strokeWidth: 1 }} />
                  <Legend 
                    wrapperStyle={{ fontFamily: 'Inter', fontSize: '9px', marginTop: '10px' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="manual" 
                    name="Manual Task Processing Time" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="automated" 
                    name="Automated Agent Node Processing Time" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ r: 3, strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center font-mono text-[8.5px] text-zinc-400 uppercase mt-4 font-semibold">
              <span>Streaming rate: 1 packet / 4s</span>
              <span>Average latency: ~12.4ms (Achrafieh fiber route)</span>
            </div>
          </div>

          {/* Operational Log & Analysis Column */}
          <div className="lg:col-span-4 bg-[#0a0f1d] border border-zinc-900 p-5 rounded-2xl space-y-4 text-white">
            <div className="border-b border-zinc-800 pb-2 flex justify-between items-center">
              <span className="font-mono text-[9px] uppercase font-bold text-zinc-400">// AUTOMATION TELEMETRY</span>
              <span className="text-[7px] text-[#9DFF00] bg-emerald-950 font-mono px-1.5 py-0.5 border border-emerald-800 rounded font-bold">STABLE</span>
            </div>

            <div className="space-y-3 font-mono text-[10.5px]">
              <div className="bg-zinc-950/40 p-3 border border-zinc-850 rounded-xl space-y-1.5">
                <span className="text-[8.5px] text-[#86d900] block tracking-wide font-black uppercase">💡 THE HARSH REALITY</span>
                <p className="text-zinc-300 leading-normal text-[10.5px] font-semibold">
                  While your employees fight spreadsheet calculations or write manual client summary briefs for hours, raw-coach agents execute parallelized processes in seconds.
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-[8.5px] text-zinc-500 uppercase block font-black">// TELEMETRY LOG STATE</span>
                <div className="space-y-1.5 text-[10px]">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Active Loops:</span>
                    <span className="text-[#9DFF00] font-bold">12 Swarm Nodes</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Manual Latency Error:</span>
                    <span className="text-rose-500 font-bold">35.4% Excess Time</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Average Swarm Duration:</span>
                    <span className="text-white font-bold">13.2 mins</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Saved Effort Pool:</span>
                    <span className="text-[#9DFF00] font-bold">8.5x Capacity</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-800 pt-2.5">
                <p className="text-[9px] text-[#9DFF00] uppercase font-bold leading-relaxed">
                  🚀 VERDICT: Evolve or stay stuck in manual latency loops, habibi. Automating tasks cuts throughput overheads by 9x instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Core Stats Bento Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core Stats Bento Left: AI Performance Percentage Card */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Card: AI Performance with Sparkline background */}
          <div className="md:col-span-7 bg-white border border-zinc-200/80 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-between min-h-[220px] shadow-sm">
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="font-sans text-[10.5px] uppercase tracking-wide font-bold text-zinc-500">Operation Success Rate</p>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">
                    98.2%
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3 text-emerald-600" strokeWidth={3} />
                    +1.4%
                  </span>
                </div>
              </div>
              <div className="font-mono text-[8.5px] uppercase tracking-wider text-slate-500 bg-zinc-50 border border-zinc-200 px-2 py-1 rounded-md font-semibold">
                Updated live
              </div>
            </div>

            {/* Sparkline Visual */}
            <div className="absolute bottom-5 left-0 right-0 h-20 opacity-30">
              <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                <path 
                  d="M0,80 Q20,30 40,50 T80,40 T120,70 T160,20 T200,60 T240,30 L300,10 L300,100 L0,100 Z" 
                  fill="#EEF2F6" 
                />
                <path 
                  d="M0,80 Q20,30 40,50 T80,40 T120,70 T160,20 T200,60 T240,30 L300,10" 
                  fill="none" 
                  stroke="#0F172A" 
                  strokeWidth="2" 
                />
                <circle cx="40" cy="50" r="3" fill="#0F172A" />
                <circle cx="160" cy="20" r="3" fill="#0F172A" />
                <circle cx="240" cy="30" r="3" fill="#0F172A" />
              </svg>
            </div>

            <div className="z-10 flex justify-between items-center text-[9.5px] font-mono text-zinc-450 mt-4 font-semibold">
              <span>ACTIVE ADVISOR AGENT LOOPS</span>
              <span>STABILITY ENVELOPE: 100%</span>
            </div>
          </div>

          {/* Card: AI Agent Activity list */}
          <div className="md:col-span-5 bg-white border border-zinc-200/80 p-6 rounded-2xl flex flex-col justify-between min-h-[220px] shadow-sm">
            <div>
              <p className="font-sans text-[10.5px] uppercase tracking-wide font-bold text-zinc-500">Workspace Activity</p>
              
              <div className="grid grid-cols-2 gap-4 mt-4 text-left">
                <div className="border-l-2 border-slate-300 pl-3">
                  <span className="font-mono text-[9px] text-[#71717A] uppercase block font-semibold">AI Tokens</span>
                  <div className="flex items-center gap-1 flex-wrap mt-0.5">
                    <span className="text-lg font-black text-[#0F172A] tracking-tight">4.5M</span>
                    <span className="text-[8.5px] font-mono font-bold text-emerald-600">
                      ↑+18%
                    </span>
                  </div>
                </div>
                <div className="border-l-2 border-slate-900 pl-3">
                  <span className="font-mono text-[9px] text-[#71717A] uppercase block font-semibold">Milestones</span>
                  <div className="flex items-center gap-1 flex-wrap mt-0.5">
                    <span className="text-lg font-black text-[#0F172A] tracking-tight">12,870</span>
                    <span className="text-[8.5px] font-mono font-bold text-emerald-600">
                      ↑+24%
                    </span>
                  </div>
                </div>
                <div className="border-l-2 border-slate-300 pl-3">
                  <span className="font-mono text-[9px] text-[#71717A] uppercase block font-semibold">API Queries</span>
                  <div className="flex items-center gap-1 flex-wrap mt-0.5">
                    <span className="text-lg font-black text-[#0F172A] tracking-tight">1.4B</span>
                    <span className="text-[8.5px] font-mono font-bold text-emerald-600">
                      ↑+8%
                    </span>
                  </div>
                </div>
                <div className="border-l-2 border-rose-500 pl-3">
                  <span className="font-mono text-[9px] text-[#71717A] uppercase block font-semibold">Discrepancy</span>
                  <div className="flex items-center gap-1 flex-wrap mt-0.5">
                    <span className="text-lg font-black text-rose-600 tracking-tight">0.01%</span>
                    <span className="text-[8.5px] font-mono font-bold text-[#10B981]">
                      ↓-5%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="font-mono text-[8.5px] text-zinc-400 mt-4 uppercase font-semibold">
              All systems operational
            </p>
          </div>

        </div>

        {/* Right Active Agents List Panel */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-6 rounded-2xl flex flex-col justify-between min-h-[220px] shadow-sm">
          <div>
            <p className="font-sans text-[10.5px] uppercase tracking-wide font-bold text-zinc-500 mb-3">Model Specialists Active</p>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center bg-zinc-50/70 p-2 border border-zinc-200/60 rounded-lg">
                <span className="text-[10px] text-zinc-700 font-bold font-mono">ADVISOR 04 (FORGE MODEL)</span>
                <span className="text-[7.5px] bg-[#E2E8F0] text-zinc-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center bg-zinc-50/70 p-2 border border-zinc-200/60 rounded-lg">
                <span className="text-[10px] text-zinc-700 font-bold font-mono">ADVISOR 03 (GIGMASTER MODEL)</span>
                <span className="text-[7.5px] bg-[#E2E8F0] text-zinc-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center bg-zinc-50/70 p-2 border border-zinc-200/60 rounded-lg">
                <span className="text-[10px] text-zinc-700 font-bold font-mono">ADVISOR 02 (CODELAB MODEL)</span>
                <span className="text-[7.5px] bg-[#E2E8F0] text-zinc-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>
              <div className="flex justify-between items-center bg-zinc-50/70 p-2 border border-zinc-200/60 rounded-lg">
                <span className="text-[10px] text-zinc-700 font-bold font-mono">ADVISOR 01 (GENERAL MODEL)</span>
                <span className="text-[7.5px] bg-[#E2E8F0] text-zinc-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                  Active
                </span>
              </div>
            </div>
          </div>

          <button className="w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white transition-all text-xs font-bold uppercase rounded-xl mt-4 cursor-pointer shadow-sm">
            Configure Team Model
          </button>
        </div>

      </div>

      {/* Grid Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Market Segment Analytics Card */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-6 rounded-2xl flex flex-col justify-between min-h-[300px] shadow-sm">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-150 pb-2 mb-4">
              <span className="font-sans text-[10.5px] uppercase tracking-wide font-bold text-zinc-500">Market Performance trend</span>
              <span className="text-zinc-400 text-xs font-bold leading-none select-none">•••</span>
            </div>

            <div className="h-28 relative flex items-end">
              <svg className="w-full h-full" viewBox="0 0 150 70">
                <path 
                  d="M10,50 L30,20 L50,45 L75,10 L95,60 L120,30 L140,5" 
                  fill="none" 
                  stroke="#E2E8F0" 
                  strokeWidth="1.5" 
                />
                <path 
                  d="M10,50 L30,20 L50,45 L75,10 L95,60 L120,30 L140,5" 
                  fill="none" 
                  stroke="#0F172A" 
                  strokeWidth="2" 
                />
                <circle cx="75" cy="10" r="3.5" fill="#0F172A" />
              </svg>
              <div className="absolute text-[8.5px] font-mono text-zinc-400 font-semibold bottom-0 left-0 right-0 flex justify-between">
                <span>JAN</span>
                <span>MAR</span>
                <span>MAY</span>
                <span>JUL</span>
                <span>SEP</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-200">
              <span className="font-sans text-[10px] text-zinc-500 block uppercase font-bold">Total Valued Volume</span>
              <span className="text-lg font-black text-slate-900 tracking-tight block mt-0.5">CURRENT: $14.2B</span>
            </div>
          </div>
          <div className="font-mono text-[8px] text-zinc-400 uppercase font-semibold">
            Operational projection tool v2
          </div>
        </div>

        {/* Predictive Insights Card */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-6 rounded-2xl flex flex-col justify-between min-h-[300px] shadow-sm">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-150 pb-2 mb-4">
              <span className="font-sans text-[10.5px] uppercase tracking-wide font-bold text-rose-600 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" /> Strategic Insights
              </span>
              <span className="text-zinc-400 text-xs font-bold leading-none select-none">•••</span>
            </div>

            <div className="bg-[#FAF9F6] p-4.5 border border-zinc-200/80 rounded-xl h-40 overflow-hidden relative flex flex-col justify-center shadow-inner">
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 font-mono text-[7px] text-slate-800 bg-[#EEF2F6] px-1.5 py-0.5 rounded border border-[#E0E6ED] font-semibold">
                <span className="w-1 h-1 rounded-full bg-slate-850 animate-ping" />
                Live update
              </div>

              <div className="space-y-4">
                <span className="font-mono text-[8px] text-zinc-400 uppercase tracking-wide block font-bold">
                  // AGENT RADAR INSIGHT
                </span>
                <p className="text-[11.5px] font-mono font-semibold text-zinc-850 text-left uppercase leading-relaxed tracking-wider">
                  {rawInsights[insightIndex]}
                </p>
              </div>

              <div className="absolute bottom-2.5 left-2.5 right-2.5 border-t border-zinc-200/60 pt-1.5 flex justify-between text-[7px] font-mono text-zinc-400 font-semibold uppercase">
                <span>Model standard analysis</span>
                <span>Active stream</span>
              </div>
            </div>
          </div>

          <p className="font-mono text-[8.5px] uppercase text-zinc-400 font-semibold mt-4">
            *Insights rotate regularly based on operations.
          </p>
        </div>

        {/* Network Pulse Dashboard Card */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/80 p-6 rounded-2xl flex flex-col justify-between min-h-[300px] shadow-sm">
          <div>
            <div className="flex justify-between items-center border-b border-zinc-150 pb-2 mb-4">
              <span className="font-sans text-[10.5px] uppercase tracking-wide font-bold text-zinc-500">Allocation Health</span>
              <span className="text-zinc-400 text-xs font-bold leading-none select-none">•••</span>
            </div>

            <div className="flex items-center gap-5 my-4">
              <div className="relative w-18 h-18 bg-zinc-50 rounded-full border-4 border-zinc-100 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="36" cy="36" r="32" stroke="transparent" strokeWidth="4" fill="transparent" />
                  <circle cx="36" cy="36" r="32" stroke="#0F172A" strokeWidth="4" fill="transparent" strokeDasharray="200" strokeDashoffset="16" />
                </svg>
                <div className="text-center">
                  <span className="text-sm font-black text-slate-950">92%</span>
                </div>
              </div>

              <div>
                <span className="font-sans text-[10px] text-zinc-400 block uppercase font-bold">Capacity Rate</span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">Automated Advisor Cap</span>
                <span className="font-mono text-[8.5px] text-slate-500 font-semibold block uppercase">Workspace standard status</span>
              </div>
            </div>

            <div className="space-y-2 mt-4 pt-3 border-t border-zinc-200">
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-zinc-500">Active Bandwidth:</span>
                <span className="font-mono text-[11px] font-bold text-slate-900">1.2 GB/S</span>
              </div>
              <div className="flex justify-between items-center text-xs font-sans">
                <span className="text-zinc-500">Query Success Index:</span>
                <span className="font-mono text-[11px] font-bold text-emerald-600">99.9%</span>
              </div>
            </div>
          </div>

          <div className="font-mono text-[8px] text-zinc-400 uppercase font-semibold">
            Stabilized node matrix v1.2
          </div>
        </div>

      </div>

      {/* Dynamic Resource Recovery Rate & Savings Board */}
      <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-150 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-950" />
              <p className="font-mono text-[9px] uppercase tracking-wider text-slate-500 font-semibold">CFO Projection tools // operational recovery planner</p>
            </div>
            <h4 className="text-lg font-extrabold text-[#0F172A] uppercase tracking-tight mt-1 font-sans">
              Resource Recovery & Estimated Savings Calculator
            </h4>
            <p className="text-xs text-zinc-500 font-medium">
              Simulate enterprise optimization scenarios by adjusting automated task distribution rates.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => handlePreset(20)}
              className={`px-3 py-1.5 font-mono text-[9px] uppercase font-bold rounded-lg border transition-all cursor-pointer ${
                efficiencyPreset === 'bootstrap' 
                  ? 'bg-[#0F172A] border-transparent text-white shadow-sm' 
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              Bootstrap Index (20%)
            </button>
            <button 
              onClick={() => handlePreset(55)}
              className={`px-3 py-1.5 font-mono text-[9px] uppercase font-bold rounded-lg border transition-all cursor-pointer ${
                efficiencyPreset === 'standard' 
                  ? 'bg-[#0F172A] border-transparent text-white shadow-sm' 
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              Standard CFO Target (55%)
            </button>
            <button 
              onClick={() => handlePreset(85)}
              className={`px-3 py-1.5 font-mono text-[9px] uppercase font-bold rounded-lg border transition-all cursor-pointer ${
                efficiencyPreset === 'overkill' 
                  ? 'bg-[#0F172A] border-transparent text-white shadow-sm' 
                  : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'
              }`}
            >
              theCsuiteCOACH Optimal (85%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls Segment */}
          <div className="lg:col-span-4 bg-[#FAF9F6] border border-zinc-200/80 p-5 rounded-2xl space-y-4">
            <div>
              <label className="flex justify-between items-center text-xs font-mono text-slate-800 uppercase font-bold mb-2">
                <span>Task Automation Rate</span>
                <span className="text-[#0F172A] font-black">{delegateRatio}%</span>
              </label>
              <input 
                type="range"
                min="10"
                max="95"
                value={delegateRatio}
                onChange={(e) => {
                  setDelegateRatio(Number(e.target.value));
                  setEfficiencyPreset('custom');
                }}
                className="w-full accent-slate-900 bg-zinc-200 rounded-lg appearance-none h-1 cursor-pointer"
              />
              <span className="text-[9px] font-mono text-zinc-400 block uppercase leading-relaxed font-semibold mt-1">
                Refine percentage of standard support workflows automated by Model Advisors.
              </span>
            </div>

            <div className="border-t border-zinc-200/80 pt-4 space-y-2.5">
              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-zinc-200/60 shadow-xs">
                <span className="font-mono text-[9px] text-zinc-550 uppercase font-semibold">Resource Recovery Rate</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-[10.5px] font-bold text-slate-950 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded">
                    +{recoveryRate}% RRR
                  </span>
                  <span className="font-mono text-[8px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    +{(delegateRatio * 0.08 + 1.2).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-zinc-200/60 shadow-xs">
                <div className="flex flex-col">
                  <span className="font-mono text-[9px] text-zinc-550 uppercase font-semibold">Operational Trend</span>
                  <span className="font-mono text-[9px] font-bold text-slate-800 mt-0.5 flex items-center gap-1">
                    {pctChangeInRecoveryString} Recovery
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[8px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded uppercase font-semibold">
                    Upward
                  </span>
                  <div className="bg-white p-1 rounded border border-zinc-200 flex items-center justify-center">
                    <D3Sparkline data={hourlyTrend} width={80} height={20} />
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-zinc-200/60 shadow-xs">
                <span className="font-mono text-[9px] text-zinc-550 uppercase font-semibold">Escalation Threshold</span>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-[10.5px] font-bold text-slate-900">
                    {Math.max(5, Math.ceil(100 - delegateRatio * 1.05))}% Human / {(delegateRatio * 1.05 / 20).toFixed(1)}x Copilot
                  </span>
                  <span className="font-mono text-[8px] text-[#059669] bg-emerald-50 px-1.5 py-0.5 rounded mt-1 font-semibold">
                    -{Math.min(25, (delegateRatio * 0.15 + 2.5)).toFixed(1)}% override
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-zinc-200/60 shadow-xs">
                <span className="font-mono text-[9px] text-zinc-550 uppercase font-semibold">Six-Week Saved Cost</span>
                <div className="flex flex-col items-end">
                  <span className="font-mono text-xs font-extrabold text-[#0F172A] tracking-tight">
                    ${estimatedSavings.toLocaleString()} USDC
                  </span>
                  <span className="font-mono text-[8px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 font-bold">
                    +{(delegateRatio * 0.22 + 3).toFixed(1)}% Velocity
                  </span>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-zinc-500 leading-relaxed bg-[#EEF2F6] border border-[#E0E6ED] p-3 rounded-xl">
              <span className="text-[#0F172A] font-bold block mb-1">💡 Optimization Recommendation</span>
              Increasing automated delegates to {delegateRatio}% drives the enterprise to a {recoveryRate}% recovery velocity, lowering administrative bottlenecks.
            </div>
          </div>

          {/* Recharts Chart Slot */}
          <div className="lg:col-span-8 bg-white border border-zinc-200/80 p-5 rounded-2xl flex flex-col justify-between min-h-[350px] shadow-sm">
            <div className="flex justify-between items-center border-b border-zinc-150 pb-2 mb-4">
              <div className="flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-slate-900" />
                <span className="font-sans text-[10.5px] text-[#0F172A] uppercase font-bold">Estimated Cost Savings Projection (Week-by-Week)</span>
              </div>
              <span className="font-mono text-[8px] bg-zinc-50 text-zinc-450 px-2 py-0.5 rounded border border-zinc-200 font-semibold uppercase">
                Active Graph
              </span>
            </div>

            <div className="h-[250px] w-full" id="savings-recharts-container" style={{ minHeight: '230px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94A3B8" 
                    fontSize={9} 
                    fontFamily="Inter" 
                    tickLine={false} 
                  />
                  <YAxis 
                    stroke="#94A3B8" 
                    fontSize={9} 
                    fontFamily="Inter" 
                    tickLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15, 23, 42, 0.015)' }} />
                  <Legend 
                    wrapperStyle={{ fontFamily: 'Inter', fontSize: '9px', marginTop: '10px' }} 
                  />
                  <Bar 
                    dataKey="ResourceSavings" 
                    name="Automated Value ($)" 
                    fill="#0F172A" 
                    radius={[4, 4, 0, 0]} 
                  />
                  <Bar 
                    dataKey="AlternativeInvestment" 
                    name="Support Alternative ($)" 
                    fill="#E2E8F0" 
                    stroke="#CBD5E1"
                    strokeWidth={1}
                    radius={[4, 4, 0, 0]} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center font-mono text-[8px] text-zinc-400 uppercase mt-4 font-semibold">
              <span>Projection model stable</span>
              <span>100% simulated calculations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stability Logs Sub Ledger */}
      <div className="bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center flex-wrap gap-2 border-b border-zinc-150 pb-3 mb-4">
          <h5 className="font-extrabold text-sm uppercase flex items-center gap-1.5 font-sans text-slate-905">
            <TrendingUp className="w-4 h-4 text-[#0F172A]" /> Activity Journal
          </h5>
          <span className="font-mono text-[8.5px] text-zinc-450 uppercase font-semibold">Workspace logs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#FAF9F6] p-4.5 border border-zinc-200/85 rounded-xl relative shadow-inner">
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-950" />
            <span className="font-mono text-[8px] bg-white text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded font-bold uppercase">
              Advisor Audit
            </span>
            <p className="text-xs font-semibold text-zinc-700 mt-3 leading-relaxed font-sans">
              Founder session initialized to review Midjourney integration options.
            </p>
            <p className="text-[8.5px] font-mono text-zinc-400 mt-2.5 font-semibold">Time: June 2, 2026, 05:40 UTC</p>
          </div>

          <div className="bg-[#FAF9F6] p-4.5 border border-zinc-200/85 rounded-xl relative shadow-inner">
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-rose-500" />
            <span className="font-mono text-[8px] bg-white text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded font-bold uppercase">
              Simulation Completed
            </span>
            <p className="text-xs font-semibold text-zinc-700 mt-3 leading-relaxed font-sans">
              Active simulation of stakeholder budget pitch scored 84/100 persuasion index.
            </p>
            <p className="text-[8.5px] font-mono text-zinc-400 mt-2.5 font-semibold">Time: June 2, 2026, 06:12 UTC</p>
          </div>

          <div className="bg-[#FAF9F6] p-4.5 border border-zinc-200/85 rounded-xl relative shadow-inner">
            <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#0F172A]" />
            <span className="font-mono text-[8px] bg-white text-zinc-600 border border-zinc-200 px-2 py-0.5 rounded font-bold uppercase">
              Milestone Loop
            </span>
            <p className="text-xs font-semibold text-zinc-700 mt-3 leading-relaxed font-sans">
              Daily strategic learning goal updated: 14 consecutive active days logged.
            </p>
            <p className="text-[8.5px] font-mono text-zinc-400 mt-2.5 font-semibold">Time: June 2, 2026, 06:30 UTC</p>
          </div>
        </div>
      </div>
    </div>
  );
}
