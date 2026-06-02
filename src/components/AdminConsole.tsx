import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  Ban, 
  Search, 
  RefreshCw, 
  Trash2, 
  AlertCircle, 
  TrendingUp, 
  Building2, 
  Check, 
  X, 
  Globe 
} from 'lucide-react';
import { UserRegistrationProfile } from '../contexts/AuthContext';

export default function AdminConsole() {
  const [registrations, setRegistrations] = useState<UserRegistrationProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchAllRegistrations = async () => {
    setLoading(true);
    setErrorMsg('');
    const path = 'registrations';
    try {
      const querySnap = await getDocs(collection(db, path));
      const list: UserRegistrationProfile[] = [];
      querySnap.forEach((docSnap) => {
        list.push(docSnap.data() as UserRegistrationProfile);
      });
      // Sort: newest first
      setRegistrations(list);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Access disrupted. Check your administrative credentials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRegistrations();
  }, []);

  const handleUpdateStatus = async (userId: string, newStatus: 'pending' | 'verified' | 'suspended') => {
    setUpdatingId(userId);
    setErrorMsg('');
    const docPath = `registrations/${userId}`;
    try {
      const docRef = doc(db, 'registrations', userId);
      await updateDoc(docRef, {
        registrationStatus: newStatus,
        updatedAt: serverTimestamp()
      });
      
      // Update locally
      setRegistrations((prev) => 
        prev.map((reg) => reg.uid === userId ? { ...reg, registrationStatus: newStatus } : reg)
      );
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Failed to adjust registry status: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteRegistration = async (userId: string) => {
    if (!window.confirm('WARNING: Irreversibly erase this participant from the sovereign records?')) return;
    setUpdatingId(userId);
    setErrorMsg('');
    const docPath = `registrations/${userId}`;
    try {
      await deleteDoc(doc(db, 'registrations', userId));
      // Remove locally
      setRegistrations((prev) => prev.filter((reg) => reg.uid !== userId));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(`Registry erasure failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Metrics calculating
  const totalCount = registrations.length;
  const verifiedCount = registrations.filter(r => r.registrationStatus === 'verified').length;
  const pendingCount = registrations.filter(r => r.registrationStatus === 'pending').length;
  const suspendedCount = registrations.filter(r => r.registrationStatus === 'suspended').length;

  // Filter registrations
  const filteredRegs = registrations.filter((reg) => {
    const q = searchQuery.toLowerCase();
    return (
      reg.fullName?.toLowerCase().includes(q) ||
      reg.email?.toLowerCase().includes(q) ||
      reg.companyName?.toLowerCase().includes(q) ||
      reg.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6" id="admin-management-console">
      {/* Admin control room landing top */}
      <div className="bg-slate-950 p-6 md:p-8 rounded-2xl border border-zinc-800 relative overflow-hidden text-white shadow-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-900/10 rounded-full filter blur-3xl opacity-25"></div>
        <div className="space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
            ★ ADMIN CONTROL PANEL ENGINE ★
          </div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white font-sans">
            SOVEREIGN REGISTRATION REGISTRY
          </h2>
          <p className="text-zinc-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Monitor startup applications, elevate CEO credentials, manage security clearance keys, and control participant access across Lebanon's decentralized alpha network.
          </p>
        </div>
      </div>

      {/* Aggregate State Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total card */}
        <div className="bg-white p-4.5 rounded-xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">Total Registrants</span>
            <span className="text-3xl font-black text-slate-900 mt-1 block">{loading ? '...' : totalCount}</span>
          </div>
          <div className="w-10 h-10 bg-zinc-100 rounded-lg flex items-center justify-center text-zinc-700">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Pending card */}
        <div className="bg-white p-4.5 rounded-xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-widest block">Pending Review</span>
            <span className="text-3xl font-black text-amber-500 mt-1 block">{loading ? '...' : pendingCount}</span>
          </div>
          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500 animate-pulse">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Verified card */}
        <div className="bg-white p-4.5 rounded-xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase tracking-widest block">Verified Leaders</span>
            <span className="text-3xl font-black text-[#86d900] mt-1 block">{loading ? '...' : verifiedCount}</span>
          </div>
          <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-605">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Suspended card */}
        <div className="bg-white p-4.5 rounded-xl border border-zinc-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-red-600 uppercase tracking-widest block">Suspended Keys</span>
            <span className="text-3xl font-black text-rose-500 mt-1 block">{loading ? '...' : suspendedCount}</span>
          </div>
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-rose-500">
            <Ban className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Actions / Search bar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search founders, ventures, positions, emails..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200/80 text-xs rounded-lg text-slate-800 focus:outline-none focus:border-zinc-500 font-mono placeholder-zinc-500"
          />
        </div>
        
        <button
          onClick={fetchAllRegistrations}
          disabled={loading}
          className="w-full sm:w-auto px-4 py-2 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-slate-700 rounded-lg font-mono text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Force Sync Registry
        </button>
      </div>

      {/* Alerts */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-150 rounded-xl text-xs text-rose-700 font-mono flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong>Secured Channel Alert // ERROR:</strong>
            <p className="mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Registrations List / Table */}
      <div className="bg-white border border-zinc-200/95 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center space-y-3 font-mono text-xs text-zinc-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-slate-600" />
            <p>Syncing Registry and decoding server logs...</p>
          </div>
        ) : filteredRegs.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-zinc-400">
            No matching participants or nodes discovered in Firestore database.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <th scope="col" className="px-6 py-3.5 text-left text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    Venture & Founder
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    Role & Position
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-left text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    Contact Node
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-center text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    Access Status
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                    Sovereign Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {filteredRegs.map((reg) => {
                  const statusColors = {
                    verified: 'bg-emerald-50 text-emerald-700 border-emerald-150',
                    pending: 'bg-amber-55/10 text-amber-600 border-amber-500/20',
                    suspended: 'bg-rose-50 text-rose-700 border-rose-150'
                  };

                  const isSelf = reg.email === 'maanbarazy@gmail.com';

                  return (
                    <tr key={reg.uid} className="hover:bg-zinc-50/50 transition-colors">
                      {/* Name & Company */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8.5 h-8.5 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                            {reg.companyName?.[0] || 'V'}
                          </div>
                          <div>
                            <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                              {reg.fullName}
                              {reg.isAdmin && (
                                <span className="bg-[#9DFF00] text-slate-950 font-mono text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded leading-none">
                                  ADMIN
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] font-mono text-zinc-400 mt-0.5">{reg.companyName}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role & Mission Description */}
                      <td className="px-6 py-4.5 max-w-xs overflow-hidden">
                        <div className="text-xs font-semibold text-slate-700">{reg.role}</div>
                        <div className="text-[9.5px] text-zinc-400 font-mono truncate max-w-xs mt-0.5" title={reg.companyDescription}>
                          {reg.companyDescription}
                        </div>
                      </td>

                      {/* Email & Phone */}
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="text-xs font-mono text-zinc-700">{reg.email}</div>
                        <div className="text-[9.5px] font-mono text-zinc-400 mt-0.5">{reg.phone}</div>
                      </td>

                      {/* Status Badge */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-center">
                        <span className={`inline-block px-2.5 py-1 text-[9px] font-mono uppercase font-extrabold border rounded-lg ${statusColors[reg.registrationStatus || 'pending']}`}>
                          ● {reg.registrationStatus || 'pending'}
                        </span>
                      </td>

                      {/* Adjust Actions */}
                      <td className="px-6 py-4.5 whitespace-nowrap text-right text-xs">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Verify */}
                          {reg.registrationStatus !== 'verified' && (
                            <button
                              onClick={() => handleUpdateStatus(reg.uid, 'verified')}
                              disabled={updatingId === reg.uid || isSelf}
                              className="p-1 px-2 border border-emerald-200 hover:border-emerald-400 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-md font-mono text-[9px] font-bold uppercase transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                              title="Verify registration"
                            >
                              Verify
                            </button>
                          )}

                          {/* Suspend */}
                          {reg.registrationStatus !== 'suspended' && (
                            <button
                              onClick={() => handleUpdateStatus(reg.uid, 'suspended')}
                              disabled={updatingId === reg.uid || isSelf}
                              className="p-1 px-2 border border-rose-200 hover:border-rose-400 bg-rose-55/10 hover:bg-rose-100 text-rose-705 rounded-md font-mono text-[9px] font-bold uppercase transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                              title="Suspend credential"
                            >
                              Suspend
                            </button>
                          )}

                          {/* Reset to pending */}
                          {reg.registrationStatus !== 'pending' && (
                            <button
                              onClick={() => handleUpdateStatus(reg.uid, 'pending')}
                              disabled={updatingId === reg.uid || isSelf}
                              className="p-1 border border-zinc-200 hover:border-zinc-300 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-md font-mono text-[9px] font-bold uppercase transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                              title="Reset to pending review"
                            >
                              Reset
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteRegistration(reg.uid)}
                            disabled={updatingId === reg.uid || isSelf}
                            className="p-1 text-zinc-400 hover:text-red-650 transition-colors cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                            title="Purge participant record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
