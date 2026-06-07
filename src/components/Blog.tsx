import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Clock, 
  ArrowLeft, 
  ChevronRight, 
  Mail, 
  Sparkles, 
  BookOpen, 
  Share2, 
  Check, 
  User, 
  Filter, 
  Calendar,
  Layers,
  Activity,
  ThumbsUp
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  imageUrl?: string;
  author: string;
  readTime: string;
  createdAt: string;
  isFeatured?: boolean;
}

const STATIC_BLOG_POSTS: BlogPost[] = [
  {
    id: 'campaign-2026',
    title: 'How to Build a B2B Cold Email Campaign That Actually Converts (2026 Guide)',
    category: 'Email Marketing',
    summary: 'A definitive, high-velocity blueprint for constructing outbox engines that bypass modern email spam filters, land directly in executive inboxes, and secure scalable demo rates.',
    author: 'P2B Marketing Team',
    readTime: '8 min read',
    createdAt: '2026-05-24',
    isFeatured: true,
    content: `
### The New Landscape of B2B Deliverability

In 2026, standard spray-and-pray outbound campaigns are completely obsolete. Primary inbox providers like Google Workspace and Microsoft 365 have initiated structural, AI-driven spam filters that instantly flag domain-wide volume spikes. If you do not construct a highly segment-isolated, warm-pooled server infrastructure, your message will never be seen.

To achieve standard response rates greater than 8.5%, B2B cold outreach must focus on precision firmographic variables, dynamic icebreakers, and authentic structural deliverability settings.

---

### Step 1: The Multi-Domain Secondary Infrastructure

Never launch outbound campaigns using your primary corporate domain. If your configuration suffers domain reputation collapse, your staff will lose real-time email accessibility to core clients.

*   **Secure 5-10 Secondary Domains**: Purchase similar variations (e.g., if your main site is \`company.com\`, acquire \`getcompany.io\`, \`companyoutbound.co\`, or \`companygrowth.net\`).
*   **Cap Daily Sends per Domain**: Strictly limit daily emails to **25-30 messages per account** (inclusive of follow-ups) to prevent volumetric red flags.
*   **Deploy DMARC, DKIM, and SPF Records**: Ensure strict alignment tags. Set DMARC policies to \`p=quarantine\` or \`p=none\` to protect domain delivery.
*   **Implement Warm-up Pools**: Utilize reputable API-based automated warmpools for a minimum of 21 to 30 days before initiating active prospecting campaigns.

---

### Step 2: Sourcing Precision C-Suite B2B Data

Your outbound metrics will only ever match the quality of your target audience list. If your list contains stale, outdated, or generic inbox addresses (like \`info@\` or \`sales@\`), your bounce metrics will exceed the 2.0% threshold, initiating domain status downgrades.

*   **Prioritize Verified Direct Dials and Direct Emails**: Ensure every operational lead matches specific contact titles (e.g., CEO, Managing Director, Partner).
*   **Refine Firmographic Filters**: Filter candidates by precise geographic nodes (Jordan, Lebanon, UAE), employee count tiers, and capital resources.
*   **Scrub Stale Addresses**: Utilize real-time API verification databases to check SMTP response handshakes before queuing message streams.

---

### Step 3: Designing the "Two-Sentence Value Proposition"

Executive managers receive over 100 cold emails daily. They reject templates with generic paragraphs, overly technical specifications, or self-praising marketing phrases. Your proposal must be compact, objective, and focus purely on functional outcomes.

> **Subject Line Pattern**: *[Topic of Mutual Interest] - [Your Company] x [Target Company]*
> 
> **Draft Pitch Matrix**:
> "Hi [Name],
> I noticed [Target Company] is scaling operations across the Levant region this quarter. We recently helped [Similar Local Competitor] integrate automated agent webhook arrays, pruning their scheduling friction by 40% within 14 days.
> 
> If you are open to reviewing our modular transition checklist, let me know if we can schedule a quick 5-minute visual brief next Tuesday."

---

### Conclusion: Continuous Optimization

Automate campaign loops to trigger dynamic alerts only when prospects open messages multiple times or forward threads. By measuring structural intent variables and maintaining a clean sender domain state, you ensure your pipeline continues feeding qualified executive meetings week after week.
`
  },
  {
    id: 'na-business-data',
    title: 'How North America Business Data Improves B2B Marketing Efficiency in 2026',
    category: 'Market Data',
    summary: 'Discover how deploying verified, highly categorized USA and Canadian corporate directories minimizes outbound advertising waste and delivers maximum return on ad spend (ROAS).',
    author: 'P2B Analytics Unit',
    readTime: '6 min read',
    createdAt: '2026-05-18',
    content: `
### Slaying the Marketing Efficiency Dragon

Outbound marketing spend across Western markets has escalated severely over the past two years. Paid programmatic channels suffer from immense keyword competition, bidding inflation, and ad-blocking clients. Today, success belongs to growth teams who skip generic mass channels and establish hyper-direct lines of communication.

Deploying highly refined structural data from North American registries is the single fastest way to isolate high-intent partners and slash your Customer Acquisition Cost (CAC).

---

### The Power of Firmographic Laser Targeting

Standard marketing databases categorize companies into broad, outdated industry labels. Modern North American business datasets provide precise SIC/NAICS sub-codes, enabling deep cohort isolation.

1.  **Employee Count Scaling**: Target growing middle-market nodes while excluding companies too small to support enterprise SLAs.
2.  **Sovereign Geographical Clusters**: Isolate and segment targets located within key logistics corridors or state tax havens.
3.  **Revenue and Capital Event Triggers**: Identify companies that just closed strategic funding rounds or made major executive appointments, signaling high purchase readiness.

---

### The ROI Equation: Data vs. Static Ads

| Strategic Indicator | Generic Programmatic Retargeting | Data-Backed Direct Prospecting |
| :--- | :--- | :--- |
| **Average Cost per Lead** | $120.00 - $180.00 | $15.00 - $35.00 |
| **Response Handshake** | Less than 0.8% | 6.2% - 11.4% |
| **Targeting Precision** | Inferred interest algorithms | Verified professional identity |
| **Outbox Bounce Protection** | Not Applicable | Under 1.5% SMTP verification |

---

### Enhancing Dynamic Campaign Personalization

When you combine verified firmographic properties with modern cold copy, campaigns feel organic. Your messaging can reference local state dynamics, sector-specific security rules, or structural team sizes, proving to reviewers that you completed your analysis before hitting send.
`
  },
  {
    id: 'tech-infrastructure-2026',
    title: 'Technology & Digital Infrastructure: The 4 B2B Sectors Driving $2.5 Trillion in Global Spending in 2026',
    category: 'Industry Focus',
    summary: 'An executive analysis of the massive global enterprise transformation cycle, charting massive infrastructure updates across sovereign clouds, edge nodes, cybersecurity, and container grids.',
    author: 'Chief Market Officer',
    readTime: '7 min read',
    createdAt: '2026-05-09',
    content: `
### Inside the Trillion-Dollar Infrastructure Cycle

Enterprise technology spending is experiencing an unprecedented structural upgrade cycle, on track to reach a cumulative $2.5 Trillion globally this fiscal year. As legacy systems reach structural decay or fall vulnerable to complex cyber-attacks, multinational boards are authorizing capital releases to support long-term operational resilience.

Here are the four key infrastructure sectors attracting the highest percentage of corporate capital and presenting the most lucrative opportunities for B2B service providers.

---

### Sector 1: Sovereign Edge Clouds & High-Security Grids

Multinational operations are migrating away from completely centralized Western data centers in favor of localized, high-performance Edge nodes. In countries like the UAE, Saudi Arabia, and Singapore, data residency rules dictate that critical information must reside inside regional physical assets.

*   **Edge Datacenters**: Massive expansion of regional micro-containers to facilitate low-latency transaction processing.
*   **Compliant Hosting Structures**: Dynamic growth of hybrid infrastructures that allow developers to coordinate client interfaces while isolating personal records.

---

### Sector 2: AI Orchestration Layers & Webhook Web Relay Pipelines

While large language models attract immense public hype, enterprise buyers find little value in standard sandbox chat windows. They require deep, stateful orchestration layers that link AI models directly to legacy ERP databases and CRM networks.

*   **Event-Driven Connectors**: Designing robust APIs to trigger secondary actions (such as sending shipping confirmation documents) automatically when client queries resolve.
*   **Security Guardrails**: Deploying local sanitizers to check context data and protect proprietary system variables.

---

### Sector 3: Zero-Trust Identity Gates & Anti-Spoof Systems

Cyber threats have scaled in complexity, using synthetic records and fake SMTP vectors to target high-value financial paths. Sovereign organizations are retiring simple passwords in favor of multi-factor cryptographic tokens and strict ABAC (Attribute-Based Access Control) security rules.

---

### Sector 4: Hardware and Semiconductor Supply Alignments

The global manufacturing grid is adjusting to tight geographical limits, driving immense equipment acquisition across South Asia, North America, and Eastern Europe.

By specializing your outbound B2B prospecting to address the urgent requirements of these four booming cohorts, your business can intercept massive tech allocations early and secure deep, multi-year supply contracts.
`
  },
  {
    id: 'taiwan-manufacturing-niches',
    title: "Taiwan's Hidden B2B Manufacturing Niches You Should Target in 2026",
    category: 'Global Strategy',
    summary: 'A deep-dive supply corridor brief exposing high-margin, specialized supply chains in Taiwan and explaining how local B2B databases unlock hidden electronics contracts.',
    author: 'P2B Global Research',
    readTime: '5 min read',
    createdAt: '2026-04-30',
    content: `
### Mapping the Uncharted Electronics Corridors

While major tech publications focus exclusively on leading-edge semiconductor giants like TSMC, Taiwan's supply network is actually driven by thousands of highly specialized, mid-sized manufacturing hubs. These hidden niches produce vital components—such as advanced sensors, precision thermal dissipation units, and secure microcontrollers—that power the world's smart systems.

Unlocking communication with these partners requires deep regional databases that match direct decision-makers, bypassing standard organizational layers.

---

### Key High-Margin Niches to Target

*   **Precision Thermal Management**: As computer processors and server arrays run hotter, customized liquid-cooling tubes and copper-mesh heat exchangers are seeing immense global demand.
*   **In-Cabin Automotive Sensors**: Specialized factories designing advanced printed circuit board assemblies (PCBAs) for next-generation automated vehicle systems.
*   **Industrial Automation Controllers**: Companies that build high-durability programmable logic controllers (PLCs) capable of working in high-temperature heavy manufacturing yards.

---

### Bypassing Language and Directory Obstacles

Many of Taiwan's most capability-rich factories do not invest in digital search optimization or English-language indexing. Standard search tools will return little state context on these businesses.

By utilizing focused localized databases—where company records are verified by operational analysts and classified with accurate NAICS codes—you can establish initial direct outreach to supply-chain heads and establish lucrative, friction-free distribution agreements.
`
  },
  {
    id: 'singapore-taiwan-opportunity',
    title: "The $4.7T B2B Opportunity in Singapore & Taiwan You Can't Ignore",
    category: 'Global Strategy',
    summary: 'Analyze the trade flow convergence between Singaporean capital and Taiwanese production lines, and learn to capture transaction volume using dynamic regional lists.',
    author: 'Corporate Advisor Unit',
    readTime: '7 min read',
    createdAt: '2026-04-18',
    content: `
### The Leviathans of Asian Enterprise Commerce

The combined enterprise value of commerce passing through Singapore’s financial institutions and Taiwan's heavy production complexes is projected to cross a staggering $4.7 Trillion this decade. This corridor serves as the primary gateway for trading electronic components, logistics capital, and green energy investments between Eastern and Western markets.

For B2B organizations seeking reliable expansion, this corridor presents a high-volume playground that can be captured with targeted, localized directory lists.

---

### Singapore: The Capital and Command Headquarters

Singapore serves as the regional headquarters for major multinational procurement divisions. While production happens overseas, critical asset acquisition, financial clearances, and logistics routing approvals happen inside Singapore's corporate boardrooms.

*   **Focus Target Titles**: Managing Directors of Supply Chain, Heads of Far East Procurement, and Sovereignty Compliance Officers.
*   **Key Sectors**: Regional Logistics Companies, Electronics Importers, and High-Volume Commodity Trading Hubs.

---

### Taiwan: The Production and Engineering Core

Taiwan is the undisputed factory floor for high-grade technical hardware. If your product simplifies operational workflows, accelerates manufacturing quality, or delivers high-grade raw components, Taiwan's factory executives represent highly receptive buyers.

---

### Executing Your Regional Outreach

When targeting this high-value corridor, ensure your communication remains highly respectful of corporate hierarchies. Craft brief, data-heavy proposals that detail exact margin improvements, speed benchmarks, and compliance credentials to secure rapid executive review.
`
  },
  {
    id: 'hvac-b2b-data',
    title: 'How to Find & Target HVAC Companies Using B2B Data',
    category: 'Lead Generation',
    summary: 'A step-by-step instruction sheet on scraping and verifying operational HVAC directories to fuel high-performance regional sales reps and equipment suppliers.',
    author: 'Outbound Ops Officer',
    readTime: '6 min read',
    createdAt: '2026-04-05',
    content: `
### Sourcing Lucrative Commercial HVAC Targets

Commercial Heating, Ventilation, and Air Conditioning (HVAC) providers represent an exceptionally high-intent market segment. As green carbon codes tighten across urban centers and climate patterns drive intensive HVAC maintenance, these companies are experiencing rapid growth and massive equipment requirements.

Whether you provide specialized service orchestration software, custom sheet metal, or targeted insurance packages, this guide details how to construct high-performance HVAC lead databases.

---

### Step 1: Isolating Commercial vs. Residential Providers

The largest profit pools reside in Commercial and Industrial HVAC sectors. Companies that strictly service residential homes have small operational budgets and lower contract limits.

*   **Firmographic Filter**: Isolate companies that list "HVAC Mechanical Contractors" or "Commercial Building Automation" as their primary line of work.
*   **Staffing Size**: Set employee counts to a minimum of **20-50 personnel** to ensure they maintain dedicated back-office procurement staff.

---

### Step 2: Extracting Key Operational Personas

Skip general business inboxes. Focus your prospecting directly can be done toward:

*   **Director of Services / Operations Manager**: Responsible for routing scheduling apps, choosing tools, and evaluating efficiency software.
*   **Purchasing Agent / Head of Estimating**: Manages relationship nodes with hardware, replacement compressors, and raw duct suppliers.

---

### Step 3: Protecting Outbox Reputation with Real-Time Verification

Local HVAC databases often suffer from high personnel turnover rates, which causes contact lists to go stale quickly. 

Always run your extracted lists through SMTP verification tests before delivering emails. Filter out invalid addresses and maintain total email bounces below **2%** to ensure your server domains stay highly respected.
`
  }
];

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(STATIC_BLOG_POSTS);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Directives');
  
  // Newsletter Sign-up states
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [newsletterError, setNewsletterError] = useState('');

  // Liking system
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  // Dynamic content fetch
  useEffect(() => {
    async function fetchDynamicPosts() {
      try {
        const snap = await getDocs(collection(db, 'blogPosts'));
        const list: BlogPost[] = [];
        snap.forEach((d) => {
          const data = d.data();
          list.push({
            id: d.id,
            title: data.title || 'Untitled Post',
            category: data.category || 'General',
            summary: data.summary || '',
            content: data.content || '',
            imageUrl: data.imageUrl,
            author: data.author || 'Administrator',
            readTime: data.readTime || '5 min read',
            createdAt: data.createdAt ? (data.createdAt.seconds ? new Date(data.createdAt.seconds * 1000).toISOString().split('T')[0] : data.createdAt) : '2026-06-01',
            isFeatured: !!data.isFeatured
          });
        });

        if (list.length > 0) {
          // Merge dynamic posts with static ones prioritizing newest
          const merged = [...list, ...STATIC_BLOG_POSTS];
          
          // Ensure unique IDs
          const unique = merged.filter((item, index, self) =>
            index === self.findIndex((t) => t.id === item.id)
          );
          
          // Re-sort post layouts: featured first, then chronological
          unique.sort((a,b) => (b.createdAt).localeCompare(a.createdAt));
          setPosts(unique);
        }
      } catch (err: any) {
        console.warn("Could not fetch real-time blogPosts. Static files loaded.", err);
      }
    }
    fetchDynamicPosts();
  }, []);

  // Filter & Search Logic
  const categories = ['All Directives', ...Array.from(new Set(posts.map(p => p.category)))];

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'All Directives' || post.category === selectedCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPost = posts.find(p => p.isFeatured) || posts[0];

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      setNewsletterError('Please provide a valid enterprise email address.');
      return;
    }
    setIsSubmitting(true);
    setNewsletterError('');
    try {
      const path = 'subscribers';
      await addDoc(collection(db, path), {
        email: emailInput.toLowerCase().trim(),
        status: 'active',
        createdAt: serverTimestamp()
      });
      setSubscriptionSuccess(true);
      setEmailInput('');
    } catch (err: any) {
      setNewsletterError('Operational submission timeout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  return (
    <div className="space-y-8 animate-scaleUp" id="b2b-blog-portal">
      
      {/* Editorial Header Banner */}
      <div className="bg-slate-900 border border-zinc-800 text-white p-6 md:p-10 rounded-3xl relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-60 h-60 bg-indigo-500/5 rounded-full filter blur-2xl opacity-20"></div>
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] font-mono text-[9px] tracking-widest font-extrabold uppercase rounded-lg">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            ★ P2B EXPERT STRATEGY LOGS
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight font-sans text-white leading-none">
            Precision Marketing Directives
          </h1>
          <p className="text-zinc-450 text-xs md:text-sm font-sans font-medium leading-relaxed max-w-3xl">
            Acquire tactical strategies on high-velocity B2B lead generation, dynamic cold email delivery configurations, and regional market intelligence mapped across North America and Eastern markets.
          </p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedPost ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-10"
          >
            {/* FEATURED POST HERO (Desktop & Tablet only if searchQuery is empty) */}
            {searchQuery.trim() === '' && selectedCategory === 'All Directives' && featuredPost && (
              <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Hero gradient side */}
                <div className="lg:col-span-5 bg-slate-950 p-8 flex flex-col justify-between text-white relative min-h-[300px] lg:min-h-full">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 to-slate-950 z-0"></div>
                  <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-emerald-500/10 rounded-full filter blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-mono text-[9px] font-extrabold uppercase rounded-md tracking-wider">
                      Featured Directive
                    </span>
                    <div className="mt-8 space-y-2">
                      <p className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-tight flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-emerald-400" />
                        {featuredPost.author}
                      </p>
                      <p className="text-[10px] font-mono text-zinc-400 font-bold uppercase tracking-tight flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {featuredPost.readTime} • {featuredPost.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 pt-12">
                    <span className="text-[#9DFF00] font-mono text-[10px] uppercase font-bold block mb-1">
                      // {featuredPost.category}
                    </span>
                    <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight font-sans text-white hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => setSelectedPost(featuredPost)}>
                      {featuredPost.title}
                    </h3>
                  </div>
                </div>

                {/* Hero Summary Side */}
                <div className="lg:col-span-7 p-6 md:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="text-xs font-mono font-bold text-indigo-600 block bg-indigo-50 px-2.5 py-1 rounded-md max-w-fit uppercase">
                      🚀 {featuredPost.category}
                    </span>
                    <p className="text-zinc-650 text-sm leading-relaxed font-sans font-medium">
                      {featuredPost.summary}
                    </p>
                    <p className="text-zinc-400 text-xs font-sans leading-relaxed">
                      This sovereign-grade operational study delivers a complete action roadmap, detailing server warmth processes, secure delivery pipelines, and dynamic prospect personalization mechanisms.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-zinc-150 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedPost(featuredPost)}
                      className="px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white font-mono text-[10px] uppercase font-bold rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                    >
                      Read Entire Directive
                      <ChevronRight className="w-3.5 h-3.5 text-[#9DFF00]" />
                    </button>
                    <button 
                      onClick={() => toggleLike(featuredPost.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        likedPosts[featuredPost.id] 
                          ? 'bg-rose-50 border-rose-200 text-rose-600' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:bg-zinc-100'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* DIRECTIVES SEARCH & FILTER SUITE */}
            <div className="bg-white p-4.5 rounded-2xl border border-zinc-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
              
              {/* Category buttons */}
              <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-[10.5px] font-mono font-bold uppercase transition-all tracking-tight cursor-pointer border ${
                      selectedCategory === cat
                        ? 'bg-slate-950 border-slate-950 text-[#9DFF00] shadow-sm'
                        : 'bg-slate-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Query strategy logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-55/10 border border-zinc-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-slate-800 text-xs rounded-xl pl-9.5 pr-4 py-2.5 outline-none font-sans font-medium"
                />
              </div>

            </div>

            {/* ARTILCE GRID */}
            {filteredPosts.length === 0 ? (
              <div className="text-center p-12 border border-dashed border-zinc-200 rounded-2xl bg-slate-50 font-mono text-zinc-500 text-xs">
                🚨 No matching strategy directives found. Try refining your query.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="blog-posts-grid">
                {filteredPosts.map((post) => (
                  <div 
                    key={post.id}
                    className="bg-white border border-zinc-200 hover:border-zinc-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div className="p-5.5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono font-bold text-indigo-600">
                          // {post.category}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <h4 
                          onClick={() => setSelectedPost(post)}
                          className="font-sans font-black uppercase text-[15px] leading-tight text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {post.title}
                        </h4>
                        <p className="text-zinc-650 text-[12.5px] leading-relaxed font-sans line-clamp-3">
                          {post.summary}
                        </p>
                      </div>
                    </div>

                    <div className="px-5.5 py-4 bg-slate-50/50 border-t border-zinc-150 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedPost(post)}
                        className="text-indigo-600 text-[10px] font-mono uppercase font-black hover:text-indigo-800 transition-colors inline-flex items-center gap-1"
                      >
                        Launch Report
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[9.5px] font-mono text-zinc-400">
                        {post.createdAt}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* NEWSLETTER SIGN-UP AD */}
            <div className="bg-slate-950 border border-slate-800 text-white rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-xl" id="newsletter-segment">
              <div className="absolute top-[-30%] right-[-10%] w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl"></div>
              
              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                <div className="lg:col-span-7 space-y-3">
                  <span className="px-2.5 py-0.5 bg-indigo-500/15 border border-indigo-500/35 text-indigo-400 font-mono text-[9px] font-bold uppercase rounded">
                    📬 Weekly Intelligence Delivery
                  </span>
                  <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight text-white font-sans">
                    Get Weekly Business Insights
                  </h3>
                  <p className="text-zinc-400 text-xs md:text-sm font-sans leading-relaxed">
                    Subscribe to receive high-fidelity cold email campaigns, verified list building tactics, and Levantine regional statistics reports delivered secure directly to your outbox.
                  </p>
                </div>

                <div className="lg:col-span-5 bg-slate-900/50 p-6 border border-zinc-800/80 rounded-2xl">
                  {subscriptionSuccess ? (
                    <div className="text-center space-y-3 font-mono text-xs">
                      <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-[#22c55e] rounded-full flex items-center justify-center mx-auto text-lg">
                        ✓
                      </div>
                      <p className="text-white font-black uppercase text-[11px] tracking-wide">Secure Registration Confirmed</p>
                      <p className="text-zinc-400 text-[10.5px]">Your enterprise address has been active logs registered to receive weekly tactical updates.</p>
                      <button 
                        onClick={() => setSubscriptionSuccess(false)}
                        className="text-xs text-indigo-400 underline uppercase font-bold cursor-pointer hover:text-indigo-300"
                      >
                        Register another email
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <div>
                        <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block mb-1.5 leading-none">
                          Corporate Outbox Address
                        </label>
                        <input
                          type="email"
                          required
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          placeholder="executive.officer@domain.com"
                          className="w-full bg-slate-950 border border-zinc-750 focus:border-indigo-500 text-white text-xs pl-3.5 pr-3 py-2.5 rounded-xl outline-none font-sans"
                        />
                      </div>
                      {newsletterError && (
                        <p className="text-rose-400 text-[10px] font-mono leading-relaxed">{newsletterError}</p>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full text-center px-4 py-2.5 bg-[#9DFF00] text-slate-950 font-mono text-[10px] uppercase font-black rounded-xl hover:bg-opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        {isSubmitting ? 'SECURED REGISTRATION...' : 'Authorize Subscription'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>

          </motion.div>
        ) : (
          <motion.div
            key="reader"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-8 max-w-4xl mx-auto"
            id="article-reader-view"
          >
            {/* Nav and Actions header */}
            <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-2 text-slate-800 hover:text-indigo-600 font-mono text-[10.5px] uppercase font-bold cursor-pointer bg-white border border-zinc-250 px-3 py-1.5 rounded-xl shadow-xs transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Directive list
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[9.5px] font-mono font-bold text-zinc-400 uppercase">
                  ACTIVE ARCHIVE REPORT
                </span>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Directive URL successfully linked to your clipboard buffer.");
                  }}
                  className="p-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Share Directive"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Deep Article Layout */}
            <div className="bg-white border border-zinc-200 rounded-3xl p-6 md:p-10 shadow-sm space-y-6">
              
              {/* Category & meta */}
              <div className="space-y-3">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-mono text-[10px] font-black tracking-wide rounded-md uppercase inline-block">
                  🎯 {selectedPost.category}
                </span>
                
                <h2 className="text-2xl md:text-4xl font-black uppercase text-slate-900 tracking-tight leading-tight font-sans">
                  {selectedPost.title}
                </h2>

                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[11px] font-mono text-zinc-450 pt-2 border-b border-zinc-150 pb-4">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    BY: {selectedPost.author}
                  </span>
                  <span className="hidden md:inline text-zinc-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    PUBLISHED: {selectedPost.createdAt}
                  </span>
                  <span className="hidden md:inline text-zinc-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    EST TIME: {selectedPost.readTime}
                  </span>
                </div>
              </div>

              {/* Summary lead */}
              <p className="text-slate-800 text-sm md:text-base font-medium leading-relaxed font-sans bg-zinc-50 border-l-4 border-slate-950 p-4 rounded-r-xl">
                {selectedPost.summary}
              </p>

              {/* Parsed Body Markup */}
              <div className="prose max-w-none text-zinc-700 text-[13.5px] md:text-[14px] leading-relaxed font-sans space-y-5">
                {selectedPost.content.split('\n\n').map((block, idx) => {
                  const line = block.trim();
                  if (!line) return null;

                  // Render Headings
                  if (line.startsWith('### ')) {
                    return (
                      <h3 key={idx} className="text-slate-900 font-sans font-black text-lg md:text-xl uppercase tracking-tight mt-6 pb-2 border-b border-zinc-200">
                        {line.replace('###', '').trim()}
                      </h3>
                    );
                  }

                  // Render Blockquotes
                  if (line.startsWith('> ')) {
                    return (
                      <div key={idx} className="border-l-4 border-indigo-600 pl-4 py-1.5 bg-indigo-50/30 rounded-r-lg font-mono text-xs text-indigo-900 leading-relaxed my-4">
                        {line.replace('>', '').trim()}
                      </div>
                    );
                  }

                  // Render Bullet points
                  if (line.startsWith('* ') || line.startsWith('- ')) {
                    const items = line.split('\n').map(item => item.replace(/^[\*\-]\s+/, '').trim());
                    return (
                      <ul key={idx} className="list-disc pl-5 space-y-2 font-sans font-medium text-[13px] md:text-[13.5px]">
                        {items.map((it, idx2) => (
                          <li key={idx2}>{it}</li>
                        ))}
                      </ul>
                    );
                  }

                  // Render numbered list
                  if (/^\d+\.\s+/.test(line)) {
                    const items = line.split('\n').map(item => item.replace(/^\d+\.\s+/, '').trim());
                    return (
                      <ol key={idx} className="list-decimal pl-5 space-y-2 font-sans font-medium text-[13px] md:text-[13.5px]">
                        {items.map((it, idx2) => (
                          <li key={idx2}>{it}</li>
                        ))}
                      </ol>
                    );
                  }

                  // Render Tables (Markdown tables)
                  if (line.includes('|') && line.includes('---')) {
                    const rows = line.split('\n').filter(r => r.trim());
                    const parsedRows = rows.map(r => r.split('|').map(cell => cell.trim()).filter((_, i) => i > 0 && i < r.split('|').length - 1));
                    
                    const headers = parsedRows[0];
                    const dataRows = parsedRows.slice(2); // Skip header separator at index 1

                    return (
                      <div key={idx} className="overflow-x-auto my-6 border border-zinc-200 rounded-xl">
                        <table className="w-full text-left font-sans text-xs border-collapse">
                          <thead>
                            <tr className="bg-slate-100 border-b border-zinc-200 text-slate-900 uppercase font-bold text-[10px] tracking-tight">
                              {headers.map((h, hIdx) => (
                                <th key={hIdx} className="px-4 py-3">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 bg-white">
                            {dataRows.map((dr, rIdx) => (
                              <tr key={rIdx} className="hover:bg-zinc-50/50">
                                {dr.map((val, cIdx) => (
                                  <td key={cIdx} className="px-4 py-3 font-medium text-zinc-650">{val}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }

                  // Simple Paragraph, support simple bolding
                  const formattedText = line.split('**').map((chunk, cIdx) => {
                    return cIdx % 2 === 1 ? <strong key={cIdx} className="text-slate-900 font-extrabold">{chunk}</strong> : chunk;
                  });

                  return (
                    <p key={idx} className="leading-relaxed text-zinc-700 font-sans font-medium">
                      {formattedText}
                    </p>
                  );
                })}
              </div>

              {/* End Card Author Stamp */}
              <div className="mt-10 pt-6 border-t border-zinc-200/80 flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-zinc-400 gap-4">
                <span>Direct Authorization: {selectedPost.author}</span>
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg transition-colors font-mono font-bold uppercase text-[9.5px] cursor-pointer inline-flex items-center gap-1.5 self-start"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Keep Reading logs
                </button>
              </div>

            </div>

            {/* RELATED ARTICLES BLOCK */}
            <div className="space-y-4">
              <h4 className="font-mono text-[10.5px] font-extrabold uppercase text-slate-800 tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-500 animate-pulse" />
                // MUTUAL GROWTH OUTLINE DIRECTIVES
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts
                  .filter(p => p.id !== selectedPost.id)
                  .slice(0, 2)
                  .map(p => (
                    <div 
                      key={p.id}
                      onClick={() => {
                        setSelectedPost(p);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="bg-white p-5 border border-zinc-200 hover:border-zinc-300 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-sm group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase font-mono font-bold text-indigo-600">
                          {p.category}
                        </span>
                        <h5 className="font-sans font-black text-[13.5px] leading-tight text-slate-800 group-hover:text-indigo-600 transition-colors uppercase">
                          {p.title}
                        </h5>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-450 mt-4 block">
                        Estimate Read Node: {p.readTime}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
