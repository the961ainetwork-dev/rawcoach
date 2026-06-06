import React, { useState } from 'react';
import { HUMAN_COACHES } from '../data/mockData';
import { HumanCoach } from '../types';
import { Search, AlertTriangle, Calendar, Sliders } from 'lucide-react';

export default function HumanMarketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<HumanCoach | null>(null);
  const [bookSuccess, setBookSuccess] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-06-03');
  const [selectedSlot, setSelectedSlot] = useState('');

  // Developer Emergency Broadcast Core State
  const [broadcastActive, setBroadcastActive] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastStatus, setBroadcastStatus] = useState<string | null>(null);

  const filteredHumans = HUMAN_COACHES.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartBooking = (coach: HumanCoach) => {
    setSelectedExpert(coach);
    setSelectedSlot(coach.availableSlots[0] || '');
    setBookSuccess(false);
  };

  const handleConfirmBooking = () => {
    if (!selectedSlot) return;
    setBookSuccess(true);
    setTimeout(() => {
      setSelectedExpert(null);
      setBookSuccess(false);
    }, 2000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;

    setBroadcastStatus('broadcasting');
    setTimeout(() => {
      setBroadcastStatus('success');
      setBroadcastActive(false);
      setBroadcastMessage('');
      setTimeout(() => {
        setBroadcastStatus(null);
      }, 4000);
    }, 1800);
  };

  return (
    <div className="space-y-8 text-zinc-900 animate-fadeIn" id="human-marketplace-pane">
      {/* Top filter parameters & search options */}
      <div className="bg-white border border-zinc-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h3 className="font-mono text-xs text-black font-black tracking-widest uppercase flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-black" /> ESCALATION NETWORK
          </h3>
          <p className="text-[10px] text-zinc-500 font-mono uppercase mt-1">Surgical manual overrides with real-world experts</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto flex-1 md:max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by expertise (e.g., Salesforce, compliance)..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-black"
            />
          </div>
          <button
            onClick={() => setBroadcastActive(true)}
            className="px-4 py-3 bg-black text-white hover:bg-zinc-800 font-mono text-[10.5px] uppercase font-black tracking-wider transition-all rounded-lg cursor-pointer flex-shrink-0"
          >
            EMERGENCY BROADCAST
          </button>
        </div>
      </div>

      {/* Broadcast transmission alert banner if successful */}
      {broadcastStatus === 'success' && (
        <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-850 rounded-xl flex items-center gap-3 font-mono text-xs justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="font-black uppercase">BROADCAST SECURED</span>
            <span>- All vetting engineers paged in your locale.</span>
          </div>
          <button onClick={() => setBroadcastStatus(null)} className="font-extrabold hover:text-black">Dismiss</button>
        </div>
      )}

      {/* Broadcast Action Overlay Dialog */}
      {broadcastActive && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-6 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-2 border-black p-6 rounded-2xl w-full max-w-md shadow-xl space-y-6">
            <div className="border-b border-zinc-200 pb-3 flex justify-between items-center">
              <h4 className="font-mono text-xs font-black uppercase text-red-605 flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-500" /> INITIATE EMERGENCY ROADBLOCK PAGE
              </h4>
              <button 
                onClick={() => setBroadcastActive(false)} 
                className="font-mono text-[10px] text-zinc-400 hover:text-black uppercase cursor-pointer"
              >
                Close [x]
              </button>
            </div>

            <p className="text-[11px] text-zinc-650 font-mono leading-relaxed uppercase">
              This broadcasts your issue, logs, and target benchmarks directly to all vetted human consultants currently active. Average feedback loop is under 8 minutes.
            </p>

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div>
                <label className="block text-[9.5px] font-mono font-bold uppercase text-zinc-500 mb-2">ROADBLOCK COMPILATION DETAILS</label>
                <textarea
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Describe the crisis. e.g. Our main Salesforce CRM token is expiring and we cannot sync client schedules manually."
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none focus:border-black placeholder:text-zinc-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setBroadcastActive(false)}
                  className="px-4 py-2 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-mono text-[9px] uppercase font-bold rounded-lg transition-all cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black hover:bg-zinc-805 text-white font-mono text-[9px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
                >
                  DISPATCH TO ACTIVE EXPERTS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Marketplace grid of items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHumans.map((h) => (
          <div
            key={h.id}
            className="bg-white border border-zinc-200 hover:border-black rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between shadow-sm hover:shadow transition-all group animate-fadeIn"
          >
            <div>
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-zinc-150 border border-zinc-250 flex items-center justify-center text-xl font-bold select-none">
                    {h.avatar}
                  </div>
                  <div>
                    <h4 className="font-black text-sm uppercase tracking-tight text-black group-hover:text-black transition-colors">{h.name}</h4>
                    <span className="font-mono text-[8.5px] uppercase tracking-widest text-zinc-500 font-bold">{h.role}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-xs font-black text-black block">${h.rate}/hr</span>
                  <span className="text-[7.5px] uppercase font-mono text-zinc-400 block tracking-widest">EST. BILLING</span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-600 mt-5 leading-relaxed font-mono line-clamp-3 select-all">{h.bio}</p>

              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-dashed border-zinc-200 pt-4">
                {h.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="font-mono text-[8px] uppercase tracking-wide font-black bg-zinc-50 text-zinc-800 border border-zinc-200 px-2 py-0.5 rounded"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleStartBooking(h)}
              className="mt-6 w-full py-3 bg-zinc-50 group-hover:bg-black text-zinc-850 group-hover:text-white border border-zinc-200 group-hover:border-transparent rounded-lg font-mono text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" /> SECURE CONSULTATION
            </button>
          </div>
        ))}

        {filteredHumans.length === 0 && (
          <div className="col-span-full text-center py-20 text-zinc-500 font-mono text-xs border border-dashed border-zinc-200 bg-white rounded-2xl">
            NO HUMAN EXPERTS MATCH THE PARSED ATTRIBUTES. TRY GENERAL KEYWORDS.
          </div>
        )}
      </div>

      {/* Booking Modal Box Popup */}
      {selectedExpert && (
        <div className="fixed inset-0 bg-black/80 z-[99999] flex items-center justify-center p-6 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border-2 border-black p-6 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden text-zinc-900">
            {bookSuccess ? (
              <div className="py-12 text-center space-y-4 animate-scaleUp">
                <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-800 font-bold text-2xl select-none">
                  ✓
                </div>
                <h4 className="font-mono text-xs font-black uppercase text-black">APPOINTMENT DISPATCH LOCKUP OK</h4>
                <p className="text-[10.5px] text-zinc-500 font-mono leading-relaxed uppercase">
                  Confirmed slot at {selectedSlot} with {selectedExpert.name}. Adding calendar anchor...
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="border-b border-zinc-200 pb-3 flex justify-between items-center">
                  <h4 className="font-mono text-xs font-black uppercase text-black">SECURE APPOINTMENT LOCKUP</h4>
                  <button 
                    onClick={() => setSelectedExpert(null)} 
                    className="font-mono text-[10px] text-zinc-400 hover:text-black uppercase cursor-pointer"
                  >
                    Close [x]
                  </button>
                </div>

                <div className="bg-zinc-50 p-3 rounded-lg border border-zinc-200 flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-zinc-200 flex items-center justify-center text-sm font-bold select-none">{selectedExpert.avatar}</div>
                  <div>
                    <span className="text-[10.5px] font-extrabold text-black block">{selectedExpert.name}</span>
                    <span className="text-[8.5px] font-mono text-zinc-500 block uppercase">{selectedExpert.role}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[9.5px] font-mono font-bold uppercase text-zinc-500 tracking-wide">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg text-xs font-mono text-zinc-900 focus:outline-none"
                  />
                </div>

                <div className="space-y-2.5">
                  <label className="block text-[9.5px] font-mono font-bold uppercase text-zinc-500 tracking-wide">Available Sessions (EST)</label>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedExpert.availableSlots.map((slot, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 border rounded text-[10px] font-mono font-bold text-center transition-all cursor-pointer ${
                          selectedSlot === slot 
                            ? 'bg-black text-white border-transparent' 
                            : 'bg-white border-zinc-200 text-zinc-700 hover:border-black'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-200 flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500 uppercase">Consulting rate:</span>
                  <span className="font-black text-black">${selectedExpert.rate}/Hour</span>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-4 bg-black hover:bg-zinc-800 text-white rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  LOCK SLOT & APPROVE CONTRACT
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
