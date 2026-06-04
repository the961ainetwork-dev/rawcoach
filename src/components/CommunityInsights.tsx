import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';
import { 
  MessageSquare, 
  Sparkles, 
  Award, 
  Heart, 
  Plus, 
  Send, 
  Lock, 
  X, 
  Trash2, 
  ArrowUpDown, 
  HelpCircle, 
  Activity, 
  User,
  Filter
} from 'lucide-react';
import { CommunityInsight } from '../types';

export default function CommunityInsights() {
  const { user, profile } = useAuth();
  
  // State variables
  const [insights, setInsights] = useState<CommunityInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'question' | 'experience' | 'case_study'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<'question' | 'experience' | 'case_study'>('question');
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Local storage to persist liked IDs and prevent double liking
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Load liked post IDs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('community_liked_posts');
      if (saved) {
        setLikedIds(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Could not read liked posts from storage', e);
    }
  }, []);

  // Fetch insights in real-time
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'communityInsights'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: CommunityInsight[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            id: docSnap.id,
            ...data,
            // Convert server timestamps to date objects or strings
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(data.createdAt || Date.now()),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt || Date.now()),
          } as CommunityInsight);
        });
        setInsights(list);
        setLoading(false);
      },
      (error) => {
        console.warn('Silent fallback: communityInsights table not populated or accessible yet.', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Upvote handling
  const handleUpvote = async (insightId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setErrorMessage('Please authenticate first to upvote peer contributions.');
      setTimeout(() => setErrorMessage(''), 4000);
      return;
    }

    if (likedIds.includes(insightId)) return;

    // Persist upvote locally to block duplicate clicks
    const updatedLikes = [...likedIds, insightId];
    setLikedIds(updatedLikes);
    localStorage.setItem('community_liked_posts', JSON.stringify(updatedLikes));

    // Update in Firestore
    const postRef = doc(db, 'communityInsights', insightId);
    try {
      await updateDoc(postRef, {
        likesCount: increment(1),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      // Revert local state on failure
      const reverted = likedIds.filter(id => id !== insightId);
      setLikedIds(reverted);
      localStorage.setItem('community_liked_posts', JSON.stringify(reverted));
      handleFirestoreError(err, OperationType.UPDATE, `communityInsights/${insightId}`);
    }
  };

  // Delete handling
  const handleDelete = async (insightId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this contribution?')) return;

    const postRef = doc(db, 'communityInsights', insightId);
    try {
      await deleteDoc(postRef);
      setSuccessMessage('Contribution successfully archived.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `communityInsights/${insightId}`);
    }
  };

  // Submit handling
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formTitle.trim()) {
      setErrorMessage('Please enter a descriptive header.');
      return;
    }
    if (!formContent.trim()) {
      setErrorMessage('Please write some content before submitting.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');
    
    const insightId = `ci-${Date.now()}`;
    const authorName = profile?.fullName || user.displayName || 'Anonymous Leader';
    const authorRole = profile?.role || 'Startup Founder';

    const payload = {
      id: insightId,
      authorUid: user.uid,
      authorName,
      authorRole,
      title: formTitle.trim(),
      type: formType,
      content: formContent.trim(),
      likesCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'communityInsights', insightId), payload);
      
      // Cleanup states
      setFormTitle('');
      setFormContent('');
      setShowForm(false);
      setSuccessMessage('Insight successfully committed to the board!');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to publish contribution. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  // Sort and filter computation
  const filteredInsights = insights
    .filter((it) => filterType === 'all' || it.type === filterType)
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.likesCount - a.likesCount;
      } else {
        const timeA = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const timeB = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return timeB - timeA;
      }
    });

  return (
    <div className="bg-[#0b0f19] border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 text-white shadow-xl" id="community-insights-section">
      
      {/* Banner / Header Row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#9DFF00]/10 border border-[#9DFF00]/30 text-[#9DFF00] font-mono text-[9px] tracking-wider font-extrabold uppercase rounded">
            ★ PEER CONVENE & EXCHANGE ★
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white font-sans">
            Community Insights Board
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed max-w-xl font-medium">
            Post tactical questions, share raw AI transition breakthroughs, and upvote peer-generated findings on Lebanese business realities.
          </p>
        </div>

        {/* Action button to expand form */}
        {user ? (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#9DFF00] hover:bg-white text-slate-950 font-mono text-[10px] tracking-wide uppercase font-black rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showForm ? 'Cancel Contribution' : 'Post Contribution'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-[#121724] border border-zinc-800 px-4 py-2.5 rounded-xl text-zinc-400 text-[10px] font-mono uppercase">
            <Lock className="w-3.5 h-3.5 text-[#9DFF00] shrink-0" />
            <span>Sign In to Contribute</span>
          </div>
        )}
      </div>

      {/* Messaging / Notifications Block */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2"
          >
            <Activity className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </motion.div>
        )}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-[#9DFF00] text-xs font-mono flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#9DFF00] shrink-0" />
            <span>{successMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expandable Creation Form */}
      <AnimatePresence>
        {showForm && user && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="bg-[#121727] border border-zinc-800 p-5 rounded-2xl space-y-4 overflow-hidden"
          >
            <span className="font-mono text-[9px] tracking-wider text-[#9DFF00] block uppercase font-bold">
              // PUBLISH STRATEGIC REPORT OR INQUIRY
            </span>

            {/* Selection Grid for Post Type */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setFormType('question')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  formType === 'question'
                    ? 'bg-blue-950/35 border-blue-500 text-blue-300'
                    : 'bg-[#161a29]/60 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-5 h-5 mb-1" />
                <span className="text-[9.5px] font-mono tracking-tight uppercase font-extrabold">Ask Question</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormType('experience')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  formType === 'experience'
                    ? 'bg-amber-950/35 border-amber-500 text-amber-300'
                    : 'bg-[#161a29]/60 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-5 h-5 mb-1" />
                <span className="text-[9.5px] font-mono tracking-tight uppercase font-extrabold">Transition Experience</span>
              </button>

              <button
                type="button"
                onClick={() => setFormType('case_study')}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  formType === 'case_study'
                    ? 'bg-lime-950/35 border-lime-500 text-lime-300'
                    : 'bg-[#161a29]/60 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Award className="w-5 h-5 mb-1" />
                <span className="text-[9.5px] font-mono tracking-tight uppercase font-extrabold">Peer Case Study</span>
              </button>
            </div>

            {/* Input fields */}
            <div className="space-y-1">
              <label className="text-[9px] font-mono block uppercase tracking-wider text-zinc-400">Descriptive Title</label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                maxLength={240}
                placeholder={
                  formType === 'question'
                    ? 'e.g., Does any firm have local metrics on Euriskos mid-scale API transition?'
                    : formType === 'experience'
                      ? 'e.g., Upskilled our financial clerks to n8n prompt controllers in 10 days'
                      : 'e.g., Overcoming fiber drops in Jounieh with offline SSD caches'
                }
                className="w-full bg-[#161b2c] border border-zinc-850 p-2.5 rounded-xl text-xs placeholder-zinc-550 focus:outline-none focus:border-zinc-700 font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono block uppercase tracking-wider text-zinc-400">Content / Strategic Details</label>
              <textarea
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                rows={5}
                maxLength={8000}
                placeholder="Detail the operational bottlenecks, numerical results, and executive coaching lessons learned..."
                className="w-full bg-[#161b2c] border border-zinc-850 p-2.5 rounded-xl text-xs placeholder-zinc-550 focus:outline-none focus:border-zinc-700 font-medium font-sans leading-relaxed"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1.5 text-zinc-400 text-[10px]">
                <User className="w-3.5 h-3.5 text-[#9DFF00]" />
                <span>Posting as: <strong className="text-white">{profile?.fullName || user.displayName || 'Anonymous'}</strong> ({profile?.role || 'Startup Founder'})</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`flex items-center gap-1.5 px-4 py-1.5 bg-[#9DFF00] hover:bg-white text-slate-950 font-mono text-[10px] tracking-wide uppercase font-black rounded-lg transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                  submitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Streaming...' : 'Commit Live'}</span>
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Filters and Search Bar Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#111522] border border-zinc-850 p-3 rounded-2xl">
        {/* Navigation Tabs for Filter */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-extrabold cursor-pointer transition-all ${
              filterType === 'all'
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
            }`}
          >
            All Peers
          </button>
          
          <button
            onClick={() => setFilterType('question')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-extrabold cursor-pointer transition-all flex items-center gap-1 border ${
              filterType === 'question'
                ? 'bg-blue-950/55 border-blue-900 text-blue-300'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-transparent'
            }`}
          >
            <MessageSquare className="w-3 h-3" />
            <span>Questions</span>
          </button>

          <button
            onClick={() => setFilterType('experience')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-extrabold cursor-pointer transition-all flex items-center gap-1 border ${
              filterType === 'experience'
                ? 'bg-amber-950/55 border-amber-900 text-amber-300'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-transparent'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Experiences</span>
          </button>

          <button
            onClick={() => setFilterType('case_study')}
            className={`px-3 py-1.5 rounded-lg text-[9px] font-mono uppercase tracking-wider font-extrabold cursor-pointer transition-all flex items-center gap-1 border ${
              filterType === 'case_study'
                ? 'bg-lime-950/55 border-lime-900 text-lime-300'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border-transparent'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>Case Studies</span>
          </button>
        </div>

        {/* Sorting Dropdowns */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-[9px] font-mono text-zinc-500 uppercase">Sort:</span>
          
          <button
            onClick={() => setSortBy('recent')}
            className={`px-2.5 py-1 text-[9px] font-mono uppercase rounded font-bold cursor-pointer transition-colors ${
              sortBy === 'recent' ? 'text-[#9DFF00] bg-zinc-800' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Recent
          </button>
          
          <button
            onClick={() => setSortBy('popular')}
            className={`px-2.5 py-1 text-[9px] font-mono uppercase rounded font-bold cursor-pointer transition-colors ${
              sortBy === 'popular' ? 'text-[#9DFF00] bg-zinc-800' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Endorsed
          </button>
        </div>
      </div>

      {/* Main List Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-zinc-500 space-y-2">
          <div className="w-5 h-5 border-2 border-[#9DFF00] border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Syncing peer briefings with firestore grid...</p>
        </div>
      ) : filteredInsights.length === 0 ? (
        <div className="p-12 border border-zinc-850 rounded-2xl bg-zinc-950/40 text-center space-y-3">
          <HelpCircle className="w-8 h-8 text-zinc-650 mx-auto" />
          <h4 className="text-sm font-bold uppercase text-zinc-300 tracking-wider">No Peer Contributions Yet</h4>
          <p className="text-[11px] text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Be the first to share a question or AI transition case. Expand the posting parameters above to commit to the Firestore board.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="community-cards-grid">
          <AnimatePresence mode="popLayout">
            {filteredInsights.map((it) => {
              const hasLiked = likedIds.includes(it.id);
              const isAuthor = user?.uid === it.authorUid;
              
              const relativeTime = it.createdAt instanceof Date 
                ? it.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                : 'Briefing Live';

              // Theme config for badge
              let badgeStyle = 'bg-blue-950/20 text-blue-400 border-blue-900/50';
              let badgeLabel = 'Question';
              if (it.type === 'experience') {
                badgeStyle = 'bg-amber-950/20 text-amber-400 border-amber-900/50';
                badgeLabel = 'Transition Experience';
              } else if (it.type === 'case_study') {
                badgeStyle = 'bg-lime-950/20 text-lime-400 border-lime-900/50';
                badgeLabel = 'Peer Case Study';
              }

              return (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#101422] border border-zinc-850 p-5 rounded-2xl flex flex-col justify-between hover:border-zinc-700 transition-all space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    {/* Card Headings */}
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded font-mono text-[8px] uppercase font-extrabold tracking-widest border ${badgeStyle}`}>
                        {badgeLabel}
                      </span>
                      
                      <span className="font-mono text-[8.5px] text-zinc-500">
                        {relativeTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-extrabold uppercase tracking-tight text-white leading-snug">
                      {it.title}
                    </h4>

                    {/* Content */}
                    <p className="text-[11.5px] leading-relaxed text-zinc-300 font-sans font-medium whitespace-pre-wrap">
                      {it.content}
                    </p>
                  </div>

                  {/* Card Actions / Attribution Row */}
                  <div className="pt-3 border-t border-zinc-850/60 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-extrabold text-zinc-200">{it.authorName}</p>
                      <p className="text-[8.5px] font-mono text-zinc-500 leading-none mt-0.5">{it.authorRole}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Delete option if current author or admin */}
                      {(isAuthor || (profile?.isAdmin)) && (
                        <button
                          onClick={(e) => handleDelete(it.id, e)}
                          className="p-1 px-2 rounded hover:bg-zinc-900 border border-transparent hover:border-zinc-800 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                          title="Archive this block"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Liking option */}
                      <button
                        onClick={(e) => handleUpvote(it.id, e)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9.5px] font-mono font-bold transition-all cursor-pointer ${
                          hasLiked
                            ? 'bg-rose-950/25 border-rose-800 text-rose-400'
                            : 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-rose-500' : ''}`} />
                        <span>{it.likesCount}</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
