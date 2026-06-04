import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  getDoc,
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Users, 
  ShieldCheck, 
  Clock, 
  Ban, 
  Search, 
  RefreshCw, 
  Trash2, 
  AlertCircle, 
  Check, 
  X, 
  Plus,
  BookOpen,
  Edit3,
  Mail,
  Layers,
  Settings,
  Flame,
  Layout,
  ExternalLink,
  PlusCircle,
  FileCheck2,
  Heart
} from 'lucide-react';
import { UserRegistrationProfile } from '../contexts/AuthContext';
import { InsightCard } from './CSuiteInsights';

type AdminTab = 'registrations' | 'sections' | 'subscribers' | 'stories' | 'resources' | 'insights' | 'settings';

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState<AdminTab>('registrations');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // ---------------------------------------------------------------------------
  // Data lists state
  // ---------------------------------------------------------------------------
  const [registrations, setRegistrations] = useState<UserRegistrationProfile[]>([]);
  const [customSections, setCustomSections] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);

  // ---------------------------------------------------------------------------
  // Edit & Add modes state
  // ---------------------------------------------------------------------------
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states for Sections
  const [secTitle, setSecTitle] = useState('');
  const [secSubtitle, setSecSubtitle] = useState('');
  const [secContent, setSecContent] = useState('');
  const [secLayout, setSecLayout] = useState<'standard' | 'image-left' | 'bento' | 'dark-slate'>('standard');
  const [secImageUrl, setSecImageUrl] = useState('');

  // Form states for Subscribers
  const [subEmail, setSubEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'active' | 'suspended' | 'unsubscribed'>('active');

  // Form states for Stories
  const [storyTitle, setStoryTitle] = useState('');
  const [storySubtitle, setStorySubtitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [storyYear, setStoryYear] = useState('2026');
  const [storyAuthor, setStoryAuthor] = useState('');
  const [storyFeatured, setStoryFeatured] = useState(false);

  // Form states for Resources
  const [resTitle, setResTitle] = useState('');
  const [resType, setResType] = useState<'guide' | 'cheatsheet' | 'whitepaper' | 'roadmap'>('guide');
  const [resCategory, setResCategory] = useState('Workspace Security');
  const [resDesc, setResDesc] = useState('');
  const [resUrl, setResUrl] = useState('');

  // Form states for Insights
  const [insTitle, setInsTitle] = useState('');
  const [insSnippet, setInsSnippet] = useState('');
  const [insContent, setInsContent] = useState('');
  const [insAuthor, setInsAuthor] = useState('');
  const [insRole, setInsRole] = useState('Sovereign Advisor');
  const [insBgColor, setInsBgColor] = useState('bg-white border-zinc-200 text-slate-900');
  const [insTag, setInsTag] = useState('FINANCE');
  const [insStatus, setInsStatus] = useState<'draft' | 'published'>('published');
  const [insLikes, setInsLikes] = useState(0);

  // Global administrative configurations state
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [allowSignIns, setAllowSignIns] = useState(true);
  const [requireApproval, setRequireApproval] = useState(false);
  const [siteTitle, setSiteTitle] = useState('theCsuiteCOACH');
  const [globalAlert, setGlobalAlert] = useState('');
  const [activeModules, setActiveModules] = useState<{ [key: string]: boolean }>({
    coaches: true,
    simulator: true,
    whatsapp: true,
    mobile: true,
    analytics: true,
    insights: true,
    transformation: true,
    manifestoPage: true,
    csuiteInsightsBoard: true,
    corpAcademy: true,
  });

  // ---------------------------------------------------------------------------
  // Auto Loads / Fetch engines
  // ---------------------------------------------------------------------------
  const syncData = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (activeTab === 'registrations') {
        const snap = await getDocs(collection(db, 'registrations'));
        const list: any[] = [];
        snap.forEach(d => list.push(d.data()));
        setRegistrations(list);
      } else if (activeTab === 'sections') {
        const snap = await getDocs(collection(db, 'pageSections'));
        const list: any[] = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setCustomSections(list);
      } else if (activeTab === 'subscribers') {
        const snap = await getDocs(collection(db, 'subscribers'));
        const list: any[] = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setSubscribers(list);
      } else if (activeTab === 'stories') {
        const snap = await getDocs(collection(db, 'sheikhStories'));
        const list: any[] = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setStories(list);
      } else if (activeTab === 'resources') {
        const snap = await getDocs(collection(db, 'knowledgeResources'));
        const list: any[] = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setResources(list);
      } else if (activeTab === 'insights') {
        const snap = await getDocs(collection(db, 'csuiteInsights'));
        const list: any[] = [];
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
        setInsights(list);
      } else if (activeTab === 'settings') {
        const docRef = doc(db, 'siteSettings', 'config');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setAllowRegistrations(data.allowRegistrations ?? true);
          setAllowSignIns(data.allowSignIns ?? true);
          setRequireApproval(data.requireApproval ?? false);
          setSiteTitle(data.siteTitle ?? 'theCsuiteCOACH');
          setGlobalAlert(data.globalAlert ?? '');
          if (data.activeModules) {
            setActiveModules(data.activeModules);
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error occurred during secure synchronization pipeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncData();
    // Clear forms when switching tabs
    resetForm();
  }, [activeTab]);

  const resetForm = () => {
    setEditingId(null);
    
    // reset sections
    setSecTitle('');
    setSecSubtitle('');
    setSecContent('');
    setSecLayout('standard');
    setSecImageUrl('');

    // reset subscribers
    setSubEmail('');
    setSubStatus('active');

    // reset stories
    setStoryTitle('');
    setStorySubtitle('');
    setStoryContent('');
    setStoryYear('2026');
    setStoryAuthor('');
    setStoryFeatured(false);

    // reset resources
    setResTitle('');
    setResType('guide');
    setResCategory('Workspace Security');
    setResDesc('');
    setResUrl('');

    // reset insights
    setInsTitle('');
    setInsSnippet('');
    setInsContent('');
    setInsAuthor('');
    setInsRole('Sovereign Advisor');
    setInsBgColor('bg-white border-zinc-200 text-slate-900');
    setInsTag('FINANCE');
    setInsStatus('published');
    setInsLikes(0);
  };

  // ---------------------------------------------------------------------------
  // Action handlers
  // ---------------------------------------------------------------------------

  // Registrations updates
  const handleUpdateRegStatus = async (userId: string, newStatus: any) => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await updateDoc(doc(db, 'registrations', userId), {
        registrationStatus: newStatus,
        updatedAt: serverTimestamp()
      });
      setSuccessMsg(`Registrant code status successfully elevated to ${newStatus}.`);
      syncData();
    } catch (err: any) {
      setErrorMsg(`Registry update failed: ${err.message}`);
    }
  };

  const handleDeleteReg = async (userId: string) => {
    if (!window.confirm('IRREVERSIBLE PURGE: Remove participant record permanently from alpha nodes?')) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await deleteDoc(doc(db, 'registrations', userId));
      setSuccessMsg('Registrant record purged successfully.');
      syncData();
    } catch (err: any) {
      setErrorMsg(`Purge failure: ${err.message}`);
    }
  };

  // 1. ADD or EDIT PAGE SECTIONS
  const handleSavePageSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    const id = editingId || 'sec-' + Date.now();
    const payload = {
      id,
      title: secTitle,
      subtitle: secSubtitle,
      content: secContent,
      layoutType: secLayout,
      imageUrl: secImageUrl,
      createdAt: editingId ? serverTimestamp() : serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'pageSections', id), payload);
      setSuccessMsg(`Custom page section has been saved and compiled to landing page nodes.`);
      resetForm();
      syncData();
    } catch (err: any) {
      setErrorMsg(`Compilation error: ${err.message}`);
    }
  };

  const handleEditSection = (item: any) => {
    setEditingId(item.id);
    setSecTitle(item.title || '');
    setSecSubtitle(item.subtitle || '');
    setSecContent(item.content || '');
    setSecLayout(item.layoutType || 'standard');
    setSecImageUrl(item.imageUrl || '');
  };

  // 2. ADD or EDIT SUBSCRIBERS
  const handleSaveSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail) return;
    setErrorMsg('');
    setSuccessMsg('');

    const id = editingId || 'sub-' + Date.now();
    const payload = {
      id,
      email: subEmail.toLowerCase(),
      status: subStatus,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'subscribers', id), payload);
      setSuccessMsg(`Subscriber record successfully registered.`);
      resetForm();
      syncData();
    } catch (err: any) {
      setErrorMsg(`Subscriber registry error: ${err.message}`);
    }
  };

  const handleEditSubscriber = (item: any) => {
    setEditingId(item.id);
    setSubEmail(item.email || '');
    setSubStatus(item.status || 'active');
  };

  // 3. ADD or EDIT SHEIKH STORIES
  const handleSaveSheikhStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const id = editingId || 'story-' + Date.now();
    const payload = {
      id,
      title: storyTitle,
      subtitle: storySubtitle,
      content: storyContent,
      year: storyYear,
      author: storyAuthor,
      isFeatured: storyFeatured,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'sheikhStories', id), payload);
      setSuccessMsg(`Resilient Sheikh Story indexed successfully.`);
      resetForm();
      syncData();
    } catch (err: any) {
      setErrorMsg(`Story writing failed: ${err.message}`);
    }
  };

  const handleEditSheikhStory = (item: any) => {
    setEditingId(item.id);
    setStoryTitle(item.title || '');
    setStorySubtitle(item.subtitle || '');
    setStoryContent(item.content || '');
    setStoryYear(item.year || '2026');
    setStoryAuthor(item.author || '');
    setStoryFeatured(item.isFeatured || false);
  };

  // 4. ADD or EDIT KNOWLEDGE RESOURCES
  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const id = editingId || 'res-' + Date.now();
    const payload = {
      id,
      title: resTitle,
      type: resType,
      category: resCategory,
      description: resDesc,
      downloadUrl: resUrl,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'knowledgeResources', id), payload);
      setSuccessMsg(`Knowledge academy resource updated.`);
      resetForm();
      syncData();
    } catch (err: any) {
      setErrorMsg(`Resource publishing failed: ${err.message}`);
    }
  };

  const handleEditResource = (item: any) => {
    setEditingId(item.id);
    setResTitle(item.title || '');
    setResType(item.type || 'guide');
    setResCategory(item.category || '');
    setResDesc(item.description || '');
    setResUrl(item.downloadUrl || '');
  };

  // 5. ADD or EDIT CS-INSIGHTS
  const handleSaveInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const id = editingId || 'insight-' + Date.now();
    const payload = {
      id,
      title: insTitle,
      snippet: insSnippet,
      content: insContent,
      author: insAuthor,
      role: insRole,
      bgColor: insBgColor,
      tag: insTag,
      status: insStatus,
      likesCount: insLikes,
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(doc(db, 'csuiteInsights', id), payload);
      setSuccessMsg(`C-Suite Pinboard briefing deployed.`);
      resetForm();
      syncData();
    } catch (err: any) {
      setErrorMsg(`C-Suite Insight compilation failure: ${err.message}`);
    }
  };

  const handleEditInsight = (item: any) => {
    setEditingId(item.id);
    setInsTitle(item.title || '');
    setInsSnippet(item.snippet || '');
    setInsContent(item.content || '');
    setInsAuthor(item.author || '');
    setInsRole(item.role || 'Sovereign Advisor');
    setInsBgColor(item.bgColor || 'bg-white border-zinc-200 text-slate-900');
    setInsTag(item.tag || 'FINANCE');
    setInsStatus(item.status || 'published');
    setInsLikes(item.likesCount || 0);
  };

  // Generic document deletion
  const handleDeleteDocument = async (collectionName: string, id: string) => {
    if (!window.confirm(`DANGER: Are you sure you want to delete report node '${id}' from '${collectionName}'?`)) return;
    setErrorMsg('');
    setSuccessMsg('');
    try {
      await deleteDoc(doc(db, collectionName, id));
      setSuccessMsg(`Node '${id}' cleared successfully.`);
      syncData();
    } catch (err: any) {
      setErrorMsg(`Purge error: ${err.message}`);
    }
  };

  // Save site options override
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const docRef = doc(db, 'siteSettings', 'config');
      await setDoc(docRef, {
        allowRegistrations,
        allowSignIns,
        requireApproval,
        siteTitle,
        globalAlert,
        activeModules,
        updatedAt: serverTimestamp()
      });
      setSuccessMsg(`Global Site & Security parameters updated successfully.`);
    } catch (err: any) {
      setErrorMsg(`Failed to save settings: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Filters for lists based on search query
  // ---------------------------------------------------------------------------
  const getFilteredList = () => {
    const q = searchQuery.toLowerCase();
    
    if (activeTab === 'registrations') {
      return registrations.filter(r => 
        r.fullName?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || r.companyName?.toLowerCase().includes(q)
      );
    }
    if (activeTab === 'sections') {
      return customSections.filter(s => s.title?.toLowerCase().includes(q) || s.subtitle?.toLowerCase().includes(q));
    }
    if (activeTab === 'subscribers') {
      return subscribers.filter(s => s.email?.toLowerCase().includes(q) || s.status?.toLowerCase().includes(q));
    }
    if (activeTab === 'stories') {
      return stories.filter(s => s.title?.toLowerCase().includes(q) || s.author?.toLowerCase().includes(q));
    }
    if (activeTab === 'resources') {
      return resources.filter(s => s.title?.toLowerCase().includes(q) || s.category?.toLowerCase().includes(q));
    }
    if (activeTab === 'insights') {
      return insights.filter(s => s.title?.toLowerCase().includes(q) || s.snippet?.toLowerCase().includes(q));
    }
    return [];
  };

  const filteredItems = getFilteredList();

  return (
    <div className="space-y-6" id="sovereign-admin-control-hub">
      {/* Admin header */}
      <div className="bg-slate-950 p-6 md:p-8 rounded-2xl border border-zinc-805 text-white relative overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full filter blur-3xl opacity-20"></div>
        <div className="space-y-3 relative z-10">
          <span className="px-3 py-1 bg-[#9DFF00]/10 border border-[#9DFF00]/25 text-[#9DFF00] font-mono text-[9px] font-bold uppercase rounded-lg">
            ★ DECEN MATRIX ADMIN OPERATOR // CLEARANCE APPROVED ★
          </span>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Sovereign Administration Console</h2>
          <p className="text-zinc-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Direct database override permissions. Adjust user clearances, create new landing sections, publish historic sheikh stories, dispatch waiting subscribers, and coordinate C-Suite Pinboard insights.
          </p>
        </div>
      </div>

      {/* Main Admin Subnavigation tabs */}
      <div className="flex flex-wrap gap-1.5 border-b border-zinc-200 pb-3" id="admin-subnav">
        {[
          { id: 'registrations', label: 'Clearance Registry', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'sections', label: 'Page Sections', icon: <Layout className="w-3.5 h-3.5" /> },
          { id: 'subscribers', label: 'Newsletter list', icon: <Mail className="w-3.5 h-3.5" /> },
          { id: 'stories', label: 'Sheikh Stories', icon: <Flame className="w-3.5 h-3.5 animate-pulse" /> },
          { id: 'resources', label: 'Academy items', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { id: 'insights', label: 'C-Suite Briefs', icon: <FileCheck2 className="w-3.5 h-3.5" /> },
          { id: 'settings', label: 'Global Controls', icon: <Settings className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as AdminTab)}
            className={`px-3 py-2 border rounded-xl font-mono text-[10.5px] uppercase font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              activeTab === tab.id
                ? 'bg-slate-900 border-transparent text-white'
                : 'bg-white hover:bg-zinc-50 text-slate-700 border-zinc-250/70'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Area (Conditional rendering based on selected adminTab) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Entry Editor Forms */}
        <div className="lg:col-span-4 bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="border-b border-zinc-100 pb-3 flex items-center justify-between">
            <h3 className="font-extrabold text-xs uppercase text-slate-900 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-[#86d900]" />
              {editingId ? 'Edit Brief Resource' : 'Register New Node'}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-zinc-400 hover:text-rose-500 font-mono text-[9px] uppercase font-bold cursor-pointer">
                Cancel
              </button>
            )}
          </div>

          {activeTab === 'registrations' && (
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2 text-center text-xs font-mono text-zinc-500">
              <p>User registrations are adjusted directly via rows in the main clearance board to the right.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-4 font-mono text-xs text-zinc-650 leading-relaxed">
              <div className="text-slate-900 font-extrabold uppercase text-[10px] tracking-wider mb-1 flex items-center gap-1">
                <Settings className="w-3.5 h-3.5 text-[#86d900]" /> // SECURE CONTROL DECK
              </div>
              <p>These configurations offer instant, system-wide toggling of essential site functionalities.</p>
              <p>You can dynamically disable registrations, halt logs to maintain strict perimeter hygiene, and force manual co-founder approval.</p>
              <div className="h-[1px] bg-zinc-150 my-2"></div>
              <p className="text-zinc-400 text-[10.5px]">Save configurations on the right to transmit state updates globally.</p>
            </div>
          )}

          {activeTab === 'sections' && (
            <form onSubmit={handleSavePageSection} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">SECTION MAIN TITLE</label>
                <input
                  type="text"
                  value={secTitle}
                  onChange={(e) => setSecTitle(e.currentTarget.value)}
                  placeholder="e.g. THE SOVEREIGN CLOUD GRID"
                  required
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">SUBTITLE/TAGLINE</label>
                <input
                  type="text"
                  value={secSubtitle}
                  onChange={(e) => setSecSubtitle(e.currentTarget.value)}
                  placeholder="e.g. Offline resilient data frames"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">LAYOUT TYPE</label>
                <select
                  value={secLayout}
                  onChange={(e: any) => setSecLayout(e.currentTarget.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800 cursor-pointer"
                >
                  <option value="standard">Standard Card Block</option>
                  <option value="image-left">Image Left Text Right Split</option>
                  <option value="bento">Bento Rounded Module</option>
                  <option value="dark-slate">Retro Dark Slate Canvas</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">IMAGE URL (OPTIONAL)</label>
                <input
                  type="url"
                  value={secImageUrl}
                  onChange={(e) => setSecImageUrl(e.currentTarget.value)}
                  placeholder="e.g. https://images.unsplash.com/photo-example"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">SECTION CONTENT (SUPPORT TEXT)</label>
                <textarea
                  value={secContent}
                  onChange={(e) => setSecContent(e.currentTarget.value)}
                  rows={4}
                  required
                  placeholder="Describe your corporate pipeline or service parameters..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white uppercase font-black tracking-wider rounded-lg"
              >
                COMPILE & SAVE SECTION
              </button>
            </form>
          )}

          {activeTab === 'subscribers' && (
            <form onSubmit={handleSaveSubscriber} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={subEmail}
                  onChange={(e) => setSubEmail(e.currentTarget.value)}
                  placeholder="name@company.com"
                  required
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">STATUS</label>
                <select
                  value={subStatus}
                  onChange={(e: any) => setSubStatus(e.currentTarget.value)}
                  className="w-full px-2.5 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-850 cursor-pointer"
                >
                  <option value="active">Active Receiver</option>
                  <option value="suspended">Suspended Node</option>
                  <option value="unsubscribed">Opted Out</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white uppercase font-bold tracking-wider rounded-lg shadow-sm"
              >
                SAVE SUBSCRIBER KEY
              </button>
            </form>
          )}

          {activeTab === 'stories' && (
            <form onSubmit={handleSaveSheikhStory} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">STORY TITLE</label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.currentTarget.value)}
                  placeholder="e.g. THE AGROSOLAR WATER RECOVERY"
                  required
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">SUBTITLE/TACTICAL SUMMARY</label>
                <input
                  type="text"
                  value={storySubtitle}
                  onChange={(e) => setStorySubtitle(e.currentTarget.value)}
                  placeholder="e.g. Saving $12k fuel costs annually"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">CASE STUDY YEAR</label>
                <input
                  type="text"
                  value={storyYear}
                  onChange={(e) => setStoryYear(e.currentTarget.value)}
                  placeholder="e.g. 1993, 2026..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">AUTHOR ARCHITECT</label>
                <input
                  type="text"
                  value={storyAuthor}
                  onChange={(e) => setStoryAuthor(e.currentTarget.value)}
                  placeholder="e.g. Maan Barazy"
                  required
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5 flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="storyFeatured"
                  checked={storyFeatured}
                  onChange={(e) => setStoryFeatured(e.currentTarget.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-transparent"
                />
                <label htmlFor="storyFeatured" className="text-zinc-700 font-bold select-none cursor-pointer">FEATURE FIRST ON PORTFOLIO</label>
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">STORY CONTENT BRIEF</label>
                <textarea
                  value={storyContent}
                  onChange={(e) => setStoryContent(e.currentTarget.value)}
                  rows={5}
                  required
                  placeholder="Type historic narrative breakdown here..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-[#9DFF00] uppercase font-black tracking-wider rounded-lg"
              >
                DEPLOY SHEIKH STORY NODE
              </button>
            </form>
          )}

          {activeTab === 'resources' && (
            <form onSubmit={handleSaveResource} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">RESOURCE HEADER</label>
                <input
                  type="text"
                  value={resTitle}
                  onChange={(e) => setResTitle(e.currentTarget.value)}
                  placeholder="e.g. GPT SECURITY AUDITING CHEATSHEET"
                  required
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">CLASSIFICATION TYPE</label>
                <select
                  value={resType}
                  onChange={(e: any) => setResType(e.currentTarget.value)}
                  className="w-full px-2.5 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-850 cursor-pointer"
                >
                  <option value="guide">Operational Guide</option>
                  <option value="cheatsheet">Hardened Cheatsheet</option>
                  <option value="whitepaper">Sovereign Whitepaper</option>
                  <option value="roadmap">Turnkey Roadmap</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">CATEGORY DEPT</label>
                <input
                  type="text"
                  value={resCategory}
                  onChange={(e) => setResCategory(e.currentTarget.value)}
                  placeholder="e.g. Prompt Engineering, Fiscal Planning"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">DOWNLOAD LINK URL</label>
                <input
                  type="url"
                  value={resUrl}
                  onChange={(e) => setResUrl(e.currentTarget.value)}
                  placeholder="e.g. https://drive.google.com/or-pdf"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">DESCRIPTION BRIEF</label>
                <textarea
                  value={resDesc}
                  onChange={(e) => setResDesc(e.currentTarget.value)}
                  rows={4}
                  required
                  placeholder="Specify immediate business benefit summary..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white uppercase font-bold tracking-widest rounded-lg shadow-sm"
              >
                SAVE ACADEMY RESOURCE
              </button>
            </form>
          )}

          {activeTab === 'insights' && (
            <form onSubmit={handleSaveInsight} className="space-y-4 text-xs font-mono">
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">INSIGHT TITLE</label>
                <input
                  type="text"
                  value={insTitle}
                  onChange={(e) => setInsTitle(e.currentTarget.value)}
                  placeholder="e.g. CO-OP LIQUID LEDGER PARALLEL"
                  required
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">TAG / FIELD CATEGORY</label>
                <input
                  type="text"
                  value={insTag}
                  onChange={(e) => setInsTag(e.currentTarget.value.toUpperCase())}
                  placeholder="e.g. FINANCE, AUTOMATION"
                  required
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">AUTHOR</label>
                <input
                  type="text"
                  value={insAuthor}
                  onChange={(e) => setInsAuthor(e.currentTarget.value)}
                  placeholder="e.g. Maan Barazy"
                  required
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">ROLE</label>
                <input
                  type="text"
                  value={insRole}
                  onChange={(e) => setInsRole(e.currentTarget.value)}
                  placeholder="e.g. Sovereign Advisor"
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">CARD THEME STYLES</label>
                <select
                  value={insBgColor}
                  onChange={(e: any) => setInsBgColor(e.currentTarget.value)}
                  className="w-full px-2.5 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-850 cursor-pointer"
                >
                  <option value="bg-slate-900 border-zinc-800 text-white">Classic Dark Cosmic</option>
                  <option value="bg-white border-zinc-200 text-slate-900">Elite Soft Light Card</option>
                  <option value="bg-slate-950 border-zinc-900 text-white">Brutal Deep Black</option>
                  <option value="bg-[#FAF9F6] border-zinc-300 text-slate-900">Academic Warm Alabaster</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">PUBLISHING STATUS</label>
                <select
                  value={insStatus}
                  onChange={(e: any) => setInsStatus(e.currentTarget.value)}
                  className="w-full px-2.5 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-850 cursor-pointer"
                >
                  <option value="published">Published Board Live</option>
                  <option value="draft">Saved Private Draft</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block text-[9.5px]">LITE SNIPPET (CARD HEAD)</label>
                <textarea
                  value={insSnippet}
                  onChange={(e) => setInsSnippet(e.currentTarget.value)}
                  rows={2}
                  required
                  placeholder="A one-sentence attractive hook snippet..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-zinc-650 block">FULL INSIGHT DISPATCH BRIEF</label>
                <textarea
                  value={insContent}
                  onChange={(e) => setInsContent(e.currentTarget.value)}
                  rows={4}
                  required
                  placeholder="Type the full analytical report body here..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-250 rounded-lg text-slate-800"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-[#86d900] uppercase font-black tracking-wider rounded-lg"
              >
                DEPLOY BRIEFING TO BOARD
              </button>
            </form>
          )}

        </div>

        {/* Right Side Clearance Boards & Tables */}
        <div className="lg:col-span-8 space-y-4">

          {activeTab === 'settings' && (
            <div className="bg-white border border-zinc-200/95 rounded-2xl p-6 shadow-xs space-y-6">
              <div className="pb-4 border-b border-zinc-100 flex items-center justify-between text-slate-800">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 uppercase font-mono tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-700" /> Site Controls & Access Gates
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono">GLOBAL HARD ACCESS PERIMETER PARAMS</p>
                </div>
                <button
                  type="button"
                  onClick={() => syncData()}
                  className="p-1.5 border border-zinc-200 hover:bg-zinc-50 rounded-lg text-[9px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} /> RELOAD
                </button>
              </div>

              {/* Success / Error Dispatches inside settings */}
              {errorMsg && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-rose-700 font-mono flex items-start gap-2">
                  <AlertCircle className="w-4.5 h-4.5 text-rose-650 shrink-0 mt-0.5" />
                  <div>
                    <strong>Action Disrupted:</strong> {errorMsg}
                  </div>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-150 rounded-xl text-xs text-emerald-800 font-mono flex items-start gap-2">
                  <Check className="w-4.5 h-4.5 text-[#86d900] shrink-0 mt-0.5" />
                  <div>
                    <strong>Success:</strong> {successMsg}
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveSiteSettings} className="space-y-6 font-mono text-xs">
                
                {/* 1. BRANDING & ANNOUNCEMENTS */}
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/50 space-y-4">
                  <h4 className="font-bold text-[10px] text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <Layout className="w-3.5 h-3.5 text-zinc-650" /> // Live Branding & announcements
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-zinc-500 uppercase font-bold text-[8.5px] tracking-wide block">Site Branding Header</label>
                      <input 
                        type="text" 
                        required
                        value={siteTitle}
                        onChange={(e) => setSiteTitle(e.currentTarget.value)}
                        placeholder="theCsuiteCOACH"
                        className="w-full px-3 py-2 bg-white border border-zinc-250 rounded-lg text-slate-800"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-zinc-500 uppercase font-bold text-[8.5px] tracking-wide block">Broadcast System announcement alert</label>
                      <input 
                        type="text" 
                        value={globalAlert}
                        onChange={(e) => setGlobalAlert(e.target.value)}
                        placeholder="e.g. Server maintenance or status broadcast..."
                        className="w-full px-3 py-2 bg-white border border-zinc-250 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. AUTH REGISTRATION GATES */}
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/50 space-y-4">
                  <h4 className="font-bold text-[10px] text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-650" /> // Hard Authentication Security Gates
                  </h4>
                  
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between p-3 bg-white border border-zinc-200/80 rounded-xl transition-all hover:bg-zinc-50/20">
                      <div className="space-y-0.5 max-w-[85%]">
                        <p className="font-bold text-slate-850 uppercase text-[10px]">Permit new peer sign-ups (REGISTRATION)</p>
                        <p className="text-[10px] text-zinc-400 font-sans leading-normal">Allows standard visitors to register new accounts. Disabling blocks standard visitor registration flows.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={allowRegistrations}
                        onChange={(e) => setAllowRegistrations(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-zinc-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white border border-zinc-200/80 rounded-xl transition-all hover:bg-zinc-50/20">
                      <div className="space-y-0.5 max-w-[85%]">
                        <p className="font-bold text-slate-850 uppercase text-[10px]">Permit existing user logs (SIGN-INS)</p>
                        <p className="text-[10px] text-zinc-400 font-sans leading-normal font-medium">Freezes standard system log-ins. Admins (maanbarazy@gmail.com) retain absolute bypass clearance rules.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={allowSignIns}
                        onChange={(e) => setAllowSignIns(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-zinc-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white border border-zinc-200/80 rounded-xl transition-all hover:bg-zinc-50/20">
                      <div className="space-y-0.5 max-w-[85%]">
                        <p className="font-bold text-slate-850 uppercase text-[10px]">Require Administrator Manual Approval</p>
                        <p className="text-[10px] text-zinc-450 font-sans leading-normal">New registrations are saved with "pending" status and locked out of personal workspaces until manually verified by the supervisor.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={requireApproval}
                        onChange={(e) => setRequireApproval(e.target.checked)}
                        className="w-4.5 h-4.5 rounded border-zinc-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. CORE SYSTEM MODULE GATES */}
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/50 space-y-4">
                  <h4 className="font-bold text-[10px] text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <Layout className="w-3.5 h-3.5 text-zinc-650" /> // Site Section Module control Ledger
                  </h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                    {[
                      { key: 'coaches', label: 'AI COACH DECK' },
                      { key: 'simulator', label: 'ROLEPLAY ENGINE' },
                      { key: 'whatsapp', label: 'WHATSAPP EDGE' },
                      { key: 'mobile', label: 'MOBILE OFFICE PORTAL' },
                      { key: 'analytics', label: 'METRICS BOARD' },
                      { key: 'insights', label: 'C-SUITE INSIGHT BRIEF' },
                      { key: 'transformation', label: 'AUDIT QUESTIONNAIRE' },
                    ].map((m) => (
                      <div key={m.key} className="flex items-center justify-between p-2.5 bg-white border border-zinc-200 rounded-lg">
                        <span className="font-bold text-slate-700 tracking-tight text-[10px]">{m.label}</span>
                        <input 
                          type="checkbox" 
                          checked={activeModules[m.key] ?? true}
                          onChange={(e) => setActiveModules({ ...activeModules, [m.key]: e.target.checked })}
                          className="w-4.5 h-4.5 rounded border-zinc-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. STANDARD USER PORTAL - SECTION VISIBILITY TOGGLES */}
                <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200/50 space-y-4">
                  <h4 className="font-bold text-[10px] text-slate-900 uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-zinc-650" /> // STANDARD MEMBER TAB VISIBILITY CONTROL
                  </h4>
                  <p className="text-[10px] text-zinc-450 leading-relaxed font-sans">
                    Toggle visibility of specific primary sections on the sidebar navigation menus for non-admin standard users in real-time.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    {[
                      { key: 'manifestoPage', label: 'MANIFESTO BOARD', desc: 'The C-Suite Manifesto philosophy section' },
                      { key: 'csuiteInsightsBoard', label: 'INSIGHTS BOARD', desc: 'Central pinboard of daily news & briefs' },
                      { key: 'corpAcademy', label: 'CORPORATE ACADEMY', desc: 'Structured employee training alignment platform' }
                    ].map((item) => (
                      <div key={item.key} className="p-3 bg-white border border-zinc-200 rounded-xl flex flex-col justify-between gap-2.5">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-850 tracking-tight text-[10px] block">{item.label}</span>
                          <span className="text-[9.5px] text-zinc-400 font-sans block leading-normal">{item.desc}</span>
                        </div>
                        <div className="flex items-center justify-between border-t border-zinc-100 pt-2 mt-auto">
                          <span className="text-[9px] text-zinc-500 uppercase font-mono font-bold">
                            {activeModules[item.key] !== false ? '● Visible' : '○ Hidden'}
                          </span>
                          <input 
                            type="checkbox" 
                            checked={activeModules[item.key] ?? true}
                            onChange={(e) => setActiveModules({ ...activeModules, [item.key]: e.target.checked })}
                            className="w-4.5 h-4.5 rounded border-zinc-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-[#86d900] font-black uppercase text-[10px] tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'SYNCING POLICY CHANGES...' : 'PERSIST GLOBAL ACCESS POLICY'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab !== 'settings' && (
            <>
              {/* Diagnostic controls and search input */}
          <div className="bg-white p-4 rounded-xl border border-zinc-200/80 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
            <div className="relative w-full sm:max-w-md">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-zinc-400" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Realtime search database filters..."
                className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 text-xs rounded-lg text-slate-850 focus:outline-none focus:border-zinc-500 font-mono"
              />
            </div>
            
            <button
              onClick={syncData}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 text-[10.5px] uppercase font-mono font-bold bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-slate-700 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              FORCE CORE RESYNC
            </button>
          </div>

          {/* Success / Error Dispatches */}
          {errorMsg && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-rose-700 font-mono flex items-start gap-2 animate-bounce">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <div>
                <strong>Administrative Node Failure Alert:</strong>
                <p className="mt-1">{errorMsg}</p>
              </div>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-xs text-emerald-800 font-mono flex items-start gap-2">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Matrix Action Synced Successfully:</strong>
                <p className="mt-0.5">{successMsg}</p>
              </div>
            </div>
          )}

          {/* TABLE BOARDS */}
          <div className="bg-white border border-zinc-200/95 rounded-xl overflow-hidden shadow-xs">
            {loading ? (
              <div className="p-12 text-center text-xs font-mono text-zinc-400 space-y-3">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto text-slate-650" />
                <p>Decoding system clearance pipelines...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-12 text-center text-xs font-mono text-zinc-400">
                Data pipeline is registered but currently empty. Re-verify search filter queries.
              </div>
            ) : (
              <div className="overflow-x-auto">
                
                {/* registrations list */}
                {activeTab === 'registrations' && (
                  <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-extrabold">Peer Node</th>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-extrabold">Company Domain</th>
                        <th className="px-6 py-3 text-center text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-extrabold">Sovereign State</th>
                        <th className="px-6 py-3 text-right text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-extrabold">Clearance Override</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white text-xs">
                      {filteredItems.map((reg: any) => (
                        <tr key={reg.uid} className="hover:bg-zinc-50/50">
                          <td className="px-6 py-3">
                            <span className="font-bold text-slate-900 block">{reg.fullName}</span>
                            <span className="text-[10px] text-zinc-400 font-mono">{reg.email}</span>
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-semibold block text-slate-800">{reg.companyName}</span>
                            <span className="text-[9.5px] font-mono text-zinc-400 block mt-0.5">{reg.role}</span>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase font-bold border ${
                              reg.registrationStatus === 'verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                              reg.registrationStatus === 'suspended' ? 'bg-rose-50 text-rose-700 border-rose-250' : 'bg-amber-50 text-amber-600 border-amber-250'
                            }`}>
                              ● {reg.registrationStatus || 'pending'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleUpdateRegStatus(reg.uid, 'verified')}
                              className="px-2 py-0.5 border border-emerald-300 hover:bg-emerald-50 text-emerald-700 rounded text-[9.5px] font-mono font-bold uppercase transition-all duration-100 cursor-pointer"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleUpdateRegStatus(reg.uid, 'suspended')}
                              className="px-2 py-0.5 border border-rose-300 hover:bg-rose-50 text-rose-705 rounded text-[9.5px] font-mono font-bold uppercase transition-all duration-100 cursor-pointer"
                            >
                              Suspend
                            </button>
                            <button
                              onClick={() => handleDeleteReg(reg.uid)}
                              className="text-zinc-400 hover:text-rose-600 p-1 font-bold h-full inline-block cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* dynamic custom page sections */}
                {activeTab === 'sections' && (
                  <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-extrabold">Custom Page Section</th>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-extrabold">Layout Style</th>
                        <th className="px-6 py-3 text-right text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-extrabold">Override Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white text-xs">
                      {filteredItems.map((item: any) => (
                        <tr key={item.id} className="hover:bg-zinc-50/50">
                          <td className="px-6 py-3">
                            <p className="font-bold text-slate-900 uppercase tracking-tight">{item.title}</p>
                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{item.subtitle || 'No dynamic tag line'}</p>
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-mono bg-zinc-100 border px-2 py-0.5 rounded text-[9px] text-zinc-650 tracking-wide font-semibold">
                              {item.layoutType || 'standard'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleEditSection(item)}
                              className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 border border-zinc-250 rounded text-[9px] font-mono font-black uppercase text-slate-800 cursor-pointer"
                            >
                              Edit Section
                            </button>
                            <button
                              onClick={() => handleDeleteDocument('pageSections', item.id)}
                              className="p-1 px-2 border border-rose-200 hover:bg-rose-50 text-rose-600 rounded text-[9px] font-mono font-bold uppercase cursor-pointer"
                            >
                              Erase
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Waitlist subscribers */}
                {activeTab === 'subscribers' && (
                  <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Email</th>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">State</th>
                        <th className="px-6 py-3 text-right text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Override</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white text-xs font-mono">
                      {filteredItems.map((item: any) => (
                        <tr key={item.id} className="hover:bg-zinc-50/50">
                          <td className="px-6 py-3 text-slate-950 font-bold font-mono">{item.email}</td>
                          <td className="px-6 py-3">
                            <span className={`px-2 py-0.5 text-[9px] rounded font-bold border capitalize ${
                              item.status === 'active' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                              item.status === 'suspended' ? 'bg-amber-50 text-amber-800 border-amber-250' : 'bg-zinc-50 text-zinc-500 border-zinc-300'
                            }`}>
                              {item.status || 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleEditSubscriber(item)}
                              className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 border rounded text-[9px] text-slate-800 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDocument('subscribers', item.id)}
                              className="px-2 py-1 border border-zinc-200 hover:bg-zinc-150 rounded text-[9px] text-rose-605 cursor-pointer"
                            >
                              Purge
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* sheikh stories list */}
                {activeTab === 'stories' && (
                  <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Story Code</th>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Year</th>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Author</th>
                        <th className="px-6 py-3 text-right text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Control</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white text-xs">
                      {filteredItems.map((item: any) => (
                        <tr key={item.id} className="hover:bg-zinc-50/50">
                          <td className="px-6 py-3">
                            <p className="font-bold text-slate-950 uppercase">{item.title}</p>
                            <p className="text-[9.5px] font-mono text-zinc-400 mt-0.5">{item.subtitle}</p>
                          </td>
                          <td className="px-6 py-3 font-mono font-bold text-[#22c55e]">{item.year || '2026'}</td>
                          <td className="px-6 py-3 font-mono">{item.author}</td>
                          <td className="px-6 py-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleEditSheikhStory(item)}
                              className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 border rounded text-[9.5px] font-mono uppercase font-black text-slate-755 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDocument('sheikhStories', item.id)}
                              className="px-2 py-1 border border-rose-250 hover:bg-rose-50 rounded text-[9.5px] font-mono font-bold text-rose-600 uppercase cursor-pointer"
                            >
                              Wipe
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* Knowledge Academy Resources */}
                {activeTab === 'resources' && (
                  <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Academy Resource</th>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Format</th>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Category</th>
                        <th className="px-6 py-3 text-right text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white text-xs">
                      {filteredItems.map((item: any) => (
                        <tr key={item.id} className="hover:bg-zinc-50/50">
                          <td className="px-6 py-3">
                            <p className="font-bold text-slate-900 uppercase tracking-tight">{item.title}</p>
                            <p className="text-[10px] text-zinc-450 line-clamp-1 mt-0.5">{item.description}</p>
                          </td>
                          <td className="px-6 py-3">
                            <span className="font-mono bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded text-[8.5px] text-indigo-750 font-bold uppercase">
                              {item.type || 'guide'}
                            </span>
                          </td>
                          <td className="px-6 py-3 font-mono text-zinc-650">{item.category}</td>
                          <td className="px-6 py-3 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleEditResource(item)}
                              className="px-2 py-1 bg-zinc-55 hover:bg-zinc-200 border rounded text-[9.5px] font-mono text-slate-800 cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDocument('knowledgeResources', item.id)}
                              className="px-2 py-1 border border-zinc-200 hover:bg-pink-50 rounded text-[9.5px] font-mono text-rose-600 cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {/* C-Suite Insights Board briefs list */}
                {activeTab === 'insights' && (
                  <table className="min-w-full divide-y divide-zinc-200">
                    <thead className="bg-zinc-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-extrabold">CS-Briefing title</th>
                        <th className="px-6 py-3 text-left text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Author & Tag</th>
                        <th className="px-6 py-3 text-center text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Status</th>
                        <th className="px-6 py-3 text-right text-[9px] font-mono uppercase tracking-wider text-zinc-500 font-bold">Board Ops</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 bg-white text-xs">
                      {filteredItems.map((item: any) => (
                        <tr key={item.id} className="hover:bg-zinc-50/50">
                          <td className="px-6 py-3">
                            <p className="font-black text-slate-900 uppercase tracking-tight">{item.title}</p>
                            <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{item.snippet}</p>
                          </td>
                          <td className="px-6 py-3">
                            <p className="font-bold text-slate-850">{item.author}</p>
                            <p className="font-mono text-[9px] text-[#22c55e] uppercase font-bold tracking-wider">{item.tag}</p>
                          </td>
                          <td className="px-6 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-black uppercase text-center border ${
                              item.status === 'published' ? 'bg-emerald-55/10 text-emerald-805 border-emerald-500/25' : 'bg-zinc-100 text-zinc-650'
                            }`}>
                              {item.status || 'published'}
                            </span>
                          </td>
                          <td className="px-6 py-3 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleEditInsight(item)}
                              className="px-2 py-1 bg-zinc-100 hover:bg-zinc-200 border rounded text-[9px] font-mono uppercase font-black tracking-widest cursor-pointer"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDocument('csuiteInsights', item.id)}
                              className="px-2 py-1 border border-zinc-250 hover:bg-rose-50 rounded text-[9.5px] font-mono font-bold text-rose-600 uppercase cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

              </div>
            )}
          </div>
          </>
          )}

          {/* Quick instructions block */}
          <div className="bg-zinc-55/15 border border-zinc-200 p-4.5 rounded-xl space-y-2 text-xs leading-relaxed text-zinc-650">
            <h4 className="font-bold text-[10px] uppercase font-mono tracking-wider text-slate-900">// SECURE DEPLOYMENT NOTES</h4>
            <p className="text-[10.5px]">
              Any addition or deletion on custom page sections, sheikh stories, subscriber records, or C-suite briefings registers immediately dynamically onto our centralized MongoDB / Firestore data grids, synchronizing layout render trees across Lebanon instantly and securely.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
