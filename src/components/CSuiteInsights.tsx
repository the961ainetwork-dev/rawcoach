import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import CommunityInsights from './CommunityInsights';
import { 
  Heart, 
  User, 
  Tag, 
  Calendar, 
  ArrowRight,
  ExternalLink,
  BookOpen,
  HelpCircle,
  TrendingUp,
  X,
  Plus
} from 'lucide-react';

export interface InsightCard {
  id: string;
  title: string;
  author: string;
  role: string;
  snippet: string;
  content: string;
  bgColor: string; // Tailwinds bg color choice etc
  tag: string;
  imageUrl?: string;
  likesCount: number;
  status: 'draft' | 'published';
  createdAt?: any;
}

const DEFAULT_INSIGHTS: InsightCard[] = [
  {
    id: 'insight-model-resilience-intelligence',
    title: 'A POTENTIAL MODEL FOR RESILIENCE THROUGH INTELLIGENCE',
    author: 'Maan Barazy',
    role: 'Founder - AlKhawarizmi | President NCEI Lebanon reg 2220',
    snippet: 'To support the Lebanese ecosystem in 2026, the strategy must move beyond standard startup acceleration to build modern, AI-native systems of sovereign recovery.',
    content: `Strategic Brief: A Potential Model for Resilience Through Intelligence - Lebanon 2026

To support the Lebanese ecosystem in 2026, the strategy must move beyond standard startup acceleration. Because the traditional financial and public infrastructures are fractured, the "innovation" must be foundational—acting as a digital surrogate for missing state services. 

The Economic Context: Managed Fragility
The current economic state is characterized by "artificial calm." While the Lebanese pound has hovered near 89,500 to the dollar, analysts warn this is a result of tight liquidity control by the Banque du Liban (BDL) rather than genuine economic expansion.
• GDP Contraction: Ongoing regional conflict is projected to shrink real GDP by 7%–10% in 2026, with estimated damages already reaching approximately $20 billion.
• Sectoral Stress: Real estate and construction, once the pillars of the economy, saw a significant decline in Q1 2026, with property sales dropping by nearly 30% compared to the previous year.
• Fiscal Reality: The country remains out of international capital markets, relying on remittances and a highly dollarized consumer market to stave off total collapse. 

The Technological "Survival Logic"
In this environment, technology is not just an efficiency tool; it is a critical component of institutional and individual survival. 
• Fintech as Infrastructure: Because the traditional banking system lost credibility after 2019, digital wallets (like MyMonty and PinPay) and payment processors have become the de facto financial infrastructure. The regulatory environment is slowly maturing, with BDL’s January 2026 circular setting clearer guidelines for these providers. 
• Digital Transformation: The World Bank’s $150 million "Digital Acceleration Project" highlights the importance of public-private partnerships (PPPs) in building resilient, decentralized infrastructure—moving beyond legacy systems to cloud-based, AI-enhanced governance. 
• AI as a Leapfrog Strategy: There is a strong, expert-led push to use AI to "leapfrog" traditional, inefficient government services. AI-driven platforms are being proposed to manage everything from smart city utilities to predictive economic modeling, effectively treating Lebanon as a laboratory for rapid technological adoption in the face of structural crisis. 

Why the "Lebanon Case" is Unique - a potential model for resilience through intelligence.
• Crisis-Driven Innovation: The "Lebanon Case" proves that when traditional institutions fail, the private sector and agile startups step in to provide essential services (payments, data processing, communication).
• Agentic Future: By focusing on agentic workflows and decentralized architecture, you are addressing the specific fragility of Lebanon’s 20th-century systems. The strategy isn't to fix the old systems, but to build modern, AI-native ones that can operate effectively despite the surrounding instability.
In short, the "Lebanon Case" is a study in technological sovereignty. It is about building a digital layer that remains functional, productive, and scalable, even when the national physical and financial infrastructure is under constant, severe pressure.

Where do we go from here
Based on the current trajectory of the ecosystem, here is what can be done to create structural impact:

1. From "Product" to "Public Infrastructure"
Startups in Lebanon are increasingly vital because they provide functions the state cannot.
• Digital Trust Layers: With the banking sector’s credibility damaged, the ecosystem needs platforms that don't just "process payments" but provide verifiable digital identity and transaction history. Projects like those you are leading with 961AI or similar networking hubs can function as the "new registry," establishing a foundation of trust that legacy systems currently lack.
• API-First Governance: The work being done by the "Behavioral Innovation and Digital Transformation Lab" (BIND-Leb) is a start, but the ecosystem needs a broader "Government-as-a-Service" API movement. Startups should build modular, integrable tools that the public sector can "plug into" rather than waiting for large-scale government procurement projects, which are often stalled by bureaucratic gridlock.

2. Strategic "Export-to-Sustain"
The local market is constrained by purchasing power and currency instability. 
• Focus on Regional Servicing: The most successful Lebanese tech firms (like Murex or the broader diaspora-linked SaaS ecosystem) survive by building for the GCC and global markets while keeping engineering costs (and headquarters) in Beirut. The ecosystem needs more "Headquarters in Beirut, Revenue in the Gulf" business models. This maintains high-value jobs locally while insulating the business from the local economic contraction.
• Diaspora-Direct Investment: Shift from "fundraising" toward "talent-equity" partnerships. Instead of just seeking VC funding, Lebanese founders should leverage the massive diaspora network to create technical bridgehead roles—where Lebanese engineers serve as the core R&D arm for international corporations.

3. Solving the "Efficiency Gap" with Agentic AI
Given the extreme scarcity of resources (power, time, administrative bandwidth), Lebanon is the ideal testing ground for Agentic AI.
• Hyper-Automated Operations: Lebanese businesses that traditionally rely on manual, friction-heavy administrative tasks can use agentic swarms to bridge the gap. By automating document processing, permit navigation, and inter-departmental communication, you essentially create a "virtual administrative layer" that bypasses current state inefficiencies.
• Resource Management: Deploying AI for decentralized infrastructure—specifically in the private-generation solar sector—is a massive opportunity. AI-driven fleet management for distributed energy can turn a fragmented power landscape into a more stable, efficient micro-grid ecosystem.

4. Human Capital Retention via "Reskilling Cycles"
With the brain drain continuing, the ecosystem must invest in fast-track, specialized vocational AI training. 
• The "AI-First" Workforce: Partnerships with tech giants (like the Microsoft/Oracle initiatives mentioned in recent government announcements) should be deepened to ensure that Lebanese graduates aren't just "tech-literate" but are "Agentic-Architect-ready."
• Focus on Niche Engineering: Lebanon has an advantage in high-end financial engineering and healthcare tech. Doubling down on these specific verticals, rather than generalist software, will keep the country "disproportionately relevant" in global wholesale-finance AI and medical AI, as seen with local hospital systems.`,
    bgColor: 'bg-lime-50/70 border-lime-200 text-slate-900',
    tag: 'STRATEGIC OUTLOOK',
    likesCount: 512,
    status: 'published'
  },
  {
    id: 'insight-economics-lebanon',
    title: 'THE ECONOMICS OF AI IN ORGANIZATIONS – CASE STUDY LEBANON',
    author: 'Maan Barazy',
    role: 'Founder - AlKhawarizmi | President NCEI Lebanon reg 2220',
    snippet: 'The current landscape of Artificial Intelligence (AI) in business is characterized by a significant shift from the excitement of "building" custom models to the pragmatic challenge of "managing" implementation and operational costs under volatile environments.',
    content: `Strategic Analysis: The Economics of AI in Organizations - Case Study Lebanon
The current landscape of Artificial Intelligence (AI) in business is characterized by a significant shift from the excitement of "building" custom models to the pragmatic challenge of "managing" implementation and operational costs. While development costs for enterprise AI can reach millions, the true burden lies in the ongoing Total Cost of Ownership (TCO), which is often underestimated during the pilot phase.

1. Key Findings: The AI Cost Paradox
• Implementation Outweighs Development: While initial development for complex projects averages $2.7 million, ongoing maintenance typically costs 15–25% of the initial build annually (Lamatic, Keyholesoftware).
• Infrastructure Inflation: Compute costs for organizations using Generative AI are expected to climb 89% between 2023 and 2025 (Ibm).
• The "Production Gap": Approximately 95% of generative AI pilots fail to transition to full production due to unexpected operational complexities and poor readiness (Keyholesoftware).
• Data Dominance: Data preparation and management account for 60–80% of total project effort, making it the single largest hidden cost factor (Keyholesoftware).

2. Cost Breakdown by Solution Complexity
AI development costs vary dramatically based on the technical scope and intended business application.

+-----------------------------------------------------------------------------------------+
| SOLUTION TYPE        | TYPICAL COST RANGE (USD) | PRIMARY COST DRIVERS     | SOURCE     |
+-----------------------------------------------------------------------------------------+
| Simple Chatbot       | $5,000 – $80,000         | Platform fees, basic NLP | Keyhole    |
| Predictive Analytics | $50,000 – $200,000       | Data complexity, BI      | Keyhole    |
| NLP System           | $50,000 – $300,000       | Custom training, real-t  | Keyhole    |
| Computer Vision      | $100,000 – $500,000+     | Hardware, intensity      | Keyhole    |
| Agentic AI Pilot     | $80,000 – $180,000+      | Workflows, integrations  | Keyhole    |
+-----------------------------------------------------------------------------------------+

3. Economic Solutions for High AI Operational Costs
To mitigate the risk of AI becoming a "cost center," organizations are adopting several strategic and technical solutions.

Strategic Optimization: "Build vs. Buy"
Approximately 76% of enterprises now opt to "buy" commodity AI (SaaS) for standard tasks, reserving "build" budgets only for high-differentiation use cases that provide a unique competitive advantage (Keyholesoftware).

Technical Efficiency Solutions
• Small Language Models (SLMs): Shifting from massive LLMs to task-specific SLMs can significantly reduce compute costs while maintaining or improving accuracy (Keyholesoftware, Ibm).
• LLM Routing: Implementing intelligent gateways that direct simple queries to cheaper, faster models (e.g., GPT-3.5 or specialized SLMs) while reserving premium models only for complex tasks (Keyholesoftware).
• FinOps for AI: Establishing dedicated financial operations to monitor token usage and cloud API costs in real-time, preventing "sticker shock" during scaling (Keyholesoftware).

4. Case Study: The AI Economic Landscape in Lebanon
Lebanon presents a unique case study where AI adoption is driven by survival necessity amidst a prolonged financial crisis. Organizations in the region face distinct cost structures and strategic priorities compared to global benchmarks.

National Investment & Adoption
• Government Commitment: The Lebanese government, supported by the World Bank, has launched a $30M – $50M investment plan (2025–2026) focused on Generative AI and Digital Public Infrastructure (Biometricupdate, Tips-Lb).
• Survival-Driven ROI: AI-enabled firms reported 89% operational continuity during the financial crisis, significantly higher than the 56% reported by traditional firms (Sapub).
• Operational Efficiency: Early adopters in Lebanon have achieved 25% – 40% reductions in operational overhead, helping to offset the impacts of hyperinflation (Sapub).

Regional Cost Drivers & Solutions
• Infrastructure "Hidden Costs": Organizations face significant costs related to chronic electricity shortages and internet instability, requiring heavy investment in private power generation and redundant connectivity to keep AI systems running (Tips-Lb).
• Alternative Credit Scoring: Due to the collapse of traditional banking, Lebanese firms are investing in AI for alternative credit scoring (using mobile and social data) to manage risk and provide financial services (Sapub).
• Brain Drain Mitigation: To manage the cost of losing local AI talent (approx. 40% loss since 2019), companies are leveraging cloud-based infrastructures and open-source frameworks to reduce reliance on on-site expertise and licensing fees (Tips-Lb).`,
    bgColor: 'bg-amber-50 border-amber-200 text-slate-900',
    tag: 'STRATEGIC ANALYSIS',
    likesCount: 395,
    status: 'published'
  },
  {
    id: 'insight-maan-affordability',
    title: 'CAN LEBANESE COMPANIES & STARTUPS AFFORD AI TRANSFORMATION?',
    author: 'Maan Barazy',
    role: 'Founder - AlKhawarizmi | President NCEI Lebanon reg 2220',
    snippet: 'An extensive C-Suite Coaching Report examining the economic feasibility of AI adoption for Lebanese businesses, mapping ecosystem players (Eurisko, Hellotree), and presenting a 6-module transformation coaching framework.',
    content: `Can Lebanese Companies and Startups Afford AI Transformation?
- By Maan Barazy - Founder - AlKhawarizmi - President the National Council for Entrepreneurship and Innovation - Ncei Lebanon reg 2220

A C-Suite Coaching Report with Strategic Recommendations

Executive Summary
Lebanon's business landscape sits at a paradoxical crossroads: digital ambition collides with economic fragility. While global AI transformation has become a boardroom imperative, Lebanese companies and startups face a uniquely compressed version of the challenge — navigating currency instability, infrastructure gaps, talent flight, and the psychological weight of prolonged national crisis, all while trying to remain regionally competitive.

This report examines the affordability and feasibility of AI transformation for Lebanese organizations, maps the current market initiatives underway, and delivers a structured C-suite coaching framework to guide executive leaders through this transition with clarity, resilience, and measurable impact.

Part I: The Affordability Question — Can Lebanese Companies Actually Do This?

The Economic Reality
Lebanon's economic collapse, which began in earnest in 2019, has fundamentally altered how companies calculate investment risk. With the Lebanese pound having lost over 90% of its value, most enterprise budgets are now denominated in USD — either informally or formally — creating a two-tier cost structure that cuts both ways.

The harsh constraints:
- Capital access is severely limited. Traditional bank financing has been largely inaccessible since the 2019 financial crisis. Most companies self-fund or rely on diaspora capital.
- Infrastructure costs are elevated. Reliable electricity and internet — prerequisites for AI deployment — carry premium costs due to generator dependency and patchy fiber penetration.
- Talent retention is a structural problem. Lebanon has experienced one of the most severe brain drains in the region. Senior tech talent with AI expertise typically emigrates or commands near-regional salaries, creating a compensation gap.
- Dollar liquidity is a constraint. Most AI platform subscriptions (AWS, Azure AI, OpenAI API, Salesforce Einstein, etc.) are billed in USD, putting pressure on businesses that still earn in pounds or mixed currencies.

Where the Opportunity Exists
Despite these headwinds, several structural factors make AI transformation not only possible but arguably more urgent for Lebanese companies:
- Lean operations favor AI leverage. Companies forced to run with reduced headcounts are natural candidates for AI-augmented productivity — doing more with fewer people is not a choice but a survival strategy.
- Diaspora networks and remote revenue. Many Lebanese firms generate USD revenue from Gulf, European, and North American clients, creating hard currency capacity to invest in AI tooling.
- Cost of not transforming is rising. Regional competitors in the UAE, Saudi Arabia, and Egypt are accelerating AI adoption aggressively. Lebanese firms competing for the same clients risk obsolescence faster than the capital constraint risk.
- Cloud-first economics work in Lebanon's favor. The shift to SaaS and API-based AI (pay-per-use models) eliminates the need for expensive on-premise infrastructure, dramatically lowering the entry cost.

The Real Cost Breakdown:
+-----------------------------------------------------------------------------------------+
| PHASE        | SCOPE                                               | EST. MONTHLY COST  |
+-----------------------------------------------------------------------------------------+
| Foundation   | AI productivity tools (Copilot, ChatGPT Teams)      | $20 - $50 / user  |
| Process      | Workflow automation (Zapier, Make, n8n)             | $200 - $800        |
| Data & BI    | BI with AI features (Power BI, Looker)              | $500 - $2,000      |
| Custom AI    | API integration or fine-tuned custom models         | $2,000 - $15,000+  |
| Enterprise   | Bespoke AI systems + MLOps cloud pipelines          | $20k - $100,000+   |
+-----------------------------------------------------------------------------------------+

The conclusion: foundation and process-layer AI is absolutely within reach for most viable Lebanese businesses. The question is not purely financial — it is one of strategic will, leadership readiness, and change management capability.


Part II: Leading AI Initiatives in the Lebanese Market

Local AI Companies and Ecosystem Players
The Lebanese AI ecosystem, though battered, has not collapsed. According to Clutch's May 2026 rankings, a handful of firms are driving AI development locally:

1. Eurisko — The most established player, with 50–249 employees and a minimum project threshold of $50,000. Eurisko focuses on enterprise-grade AI development and has significant market presence. Their work spans financial services, healthcare, and retail sectors.
2. Hellotree — A leaner firm (2–9 people) based in Jounieh, operating at accessible price points ($25–$49/hr, projects from $5,000). Clients consistently cite their proactive problem-solving and value for money, making them a realistic partner for startups and growth-stage companies.
3. Webspot, Web Synergy, Wiz Consults — Emerging players filling mid-market digital transformation and AI integration needs, particularly for SMEs.

National Strategy Context
Lebanon's Ministry of State for Investment and Technology Affairs formally requested ESCWA's assistance in developing a National AI Strategy as far back as January 2020. While execution has been understandably disrupted by the economic and political crises that followed, the strategic framework exists and provides a reference point for regulatory direction. (unescwa.org)

The key pillars outlined in that advisory included:
- Building national AI capacity through education and research
- Creating an enabling regulatory environment
- Promoting AI for public sector efficiency
- Attracting AI investment through incentives
Progress has been slow, but the framework signals that government — when stabilized — will likely follow regional peers (UAE, Saudi Arabia) in formalizing AI governance and potentially offering incentives to early adopters.

Regional Initiatives Accessible to Lebanese Companies:
- ESCWA Digital Economy programs — Technical assistance and capacity building available to Lebanese entities
- Google for Startups — Cloud credits and AI training accessible remotely
- Microsoft for Startups — Azure AI credits up to $150,000 USD, accessible to Lebanese startups
- AWS Activate — Similar credit programs for cloud and AI infrastructure
- Flat6Labs Beirut — Accelerator with a growing focus on tech-enabled startups
- Speed@BDD — Lebanon's leading startup hub, increasingly supporting AI-adjacent ventures


Part III: The C-Suite AI Coaching Framework

This is where strategy meets behavior. Research consistently shows that AI adoption fails not because of technology, but because of people. Coaching leadership has been empirically demonstrated to buffer job stress during AI transitions and protect employee wellbeing, making it a critical — not optional — element of any transformation. (pmc.ncbi.nlm.nih.gov)
Equally, adding structured coaching to AI initiatives increases productivity gains by as much as 257% over tool training alone. (coachhub.com)

The framework below is designed specifically for C-suite leaders in the Lebanese context — accounting for the psychological burden of operating in a post-crisis environment alongside global transformation pressures.

Module 1: Executive Mindset and AI Leadership Identity
- The core challenge: Many Lebanese executives have built resilience through human problem-solving under crisis conditions. AI can feel like a threat to that identity — a suggestion that what kept the company alive (judgment, relationships, improvisation) is being replaced.
- Coaching objectives:
  * Distinguish between AI as tool versus AI as threat — and coach leaders to articulate this distinction publicly within their organizations.
  * Develop a personal AI leadership narrative: "What does AI make me better at as a leader?"
  * Surface and address hidden beliefs about AI (fear of irrelevance, distrust of data, concerns about workforce displacement).
  * Build psychological safety at the top so it cascades downward.
- Recommended coaching exercises:
  * The Augmentation Audit: Have the executive list the 10 most time-consuming decisions or tasks in their week. Identify which ones AI could assist, accelerate, or automate — and what that frees them to do instead.
  * The Legacy Reframe: Ask, "What do you want to be known for building in the next five years?" Then map AI's role as an enabler of that legacy, not a disruption to it.
  * Stakeholder Narrative Workshop: Coach the leader to craft a 3-minute AI vision speech for their school/team — honest about the difficulty, clear about the direction.

Module 2: Strategic AI Prioritization for Lebanese Conditions
- The core challenge: Lebanese C-suite leaders face a real temptation to either over-invest (chasing global trends without local fit) or under-invest (dismissing AI as a luxury given the economic environment). Neither is appropriate.
- Coaching objectives:
  * Develop a disciplined, ROI-first AI investment thesis calibrated to the company's actual cash position and strategic horizon.
  * Distinguish between quick-win AI (high impact, low cost, fast deployment) and transformative AI (high investment, long timeline).
  * Avoid "AI theatre" — deploying AI for optics rather than outcomes.
- Recommended coaching exercises:
  * The $10,000 AI Bet: If you had $10,000 in AI budget right now, where would you put it, and how would you measure success in 90 days? This forces concrete prioritization over theoretical planning.
  * The Competitor Scan: Research two regional competitors (UAE or Egypt-based) in your sector. What AI capabilities do they visibly have? What is the cost of the gap?

Module 3: Building an AI-Ready Culture from the Top
- The core challenge: Research consistently shows that culture — not technology — is the #1 barrier to AI adoption. Only 16% of business processes are AI-native by design; the rest require behavioral rewiring, not just tool installation. (coachhub.com)
In Lebanon's context, this is compounded by workforce anxiety that is not purely about AI. Employees who have survived salary cuts, emigration of colleagues, and economic whiplash carry a baseline stress load that makes change management more delicate.
- Coaching objectives:
  * Coach leaders to model AI behavior visibly and consistently — not delegate it to IT or HR.
  * Create psychological safety for experimentation and failure.
  * Develop a culture of AI curiosity rather than AI compliance.
  * Address the human cost of automation transparently and ethically.
- The Three Cultural Signals leaders must send:
  * "I use AI myself" — Leaders who personally use AI tools signal that this is real, valued, and not just a directive from above.
  * "We reward trying, not just succeeding" — Establish explicit permission to experiment with AI workflows, with failure treated as data.
  * "Nobody loses their job for adopting AI" — Or, if roles will change, communicate it honestly and early. Uncertainty is more damaging than difficult news.
- Recommended coaching exercises:
  * The Weekly AI Habit: Commit to one AI-assisted task per day for 30 days. Journal the results. This builds embodied knowledge, not theoretical endorsement.
  * Town Hall AI Q&A: Host a monthly 30-minute open forum where employees can ask any question about AI in the company — anonymously if needed. The leader answers directly.
  * The Fear Mapping Session: Facilitate a team session where employees anonymously submit their biggest fears about AI. Categorize them. Respond to each category publicly. This drains the uncertainty that fosters in silence.

Module 4: Leading the Human Side of AI Transition
- The core challenge: AI adoption increases job stress when employees feel unprepared, surveilled, or at risk. Research published in Frontiers in Psychology found that coaching leadership directly moderates the relationship between AI adoption and employee physical health — meaning the quality of leadership literally determines whether AI harms or helps your people. (pmc.ncbi.nlm.nih.gov)
In Lebanon, where workforce mental health has been under prolonged strain, this is not a soft issue — it is a business continuity issue.
- Coaching objectives:
  * Develop a coaching leadership style within the C-suite: listening, questioning, empowering rather than directing.
  * Build manager capability to support their teams through the discomfort of AI-driven change.
  * Create visible support structures: training budgets, time allowances, recognition systems.
- The Coaching Leadership Behaviors to develop:
  * Old Directive Behavior -> Coaching Leadership Alternative
  * "Here's the AI tool, use it" -> "What would make AI useful for your specific work?"
  * "Productivity must increase by Q3" -> "What experiments can we run this month to find what works?"
  * "Those who don't adapt will be left behind" -> "What support do you need to feel confident with these tools?"
  * Measuring compliance -> Measuring capability growth
  * Top-down rollout -> Co-designed adoption with employee input

Module 5: Measuring AI Transformation — The C-Suite Dashboard
- The core challenge: Lebanese companies often lack the data infrastructure to measure AI impact rigorously. Leaders need a lean, practical measurement framework that doesn't require enterprise-grade analytics to start.
- Coaching objectives:
  * Define 3–5 AI-specific KPIs before any initiative launches.
  * Build a 90-day review rhythm to assess adoption and adjust.
  * Distinguish between vanity metrics (number of AI tools deployed, prompts run) and value metrics (hours saved, error rates reduced, revenue influenced).
- Recommended C-Suite AI KPI Framework:
  * Productivity: Hours saved per week, tasks automated (Time-tracking tools, manager surveys)
  * Quality: Error rates, customer satisfaction scores (QA audits, NPS)
  * Adoption: % of team using AI tools weekly (Platform analytics)
  * Financial: Cost per output unit, revenue per employee (Finance reports)
  * People: Employee confidence scores, stress indicators (Quarterly pulse surveys)
- Coaching exercise:
  * The 90-Day AI Sprint Design: Define one business problem, one AI intervention, three success metrics, and a review date. Run it. Review it. Decide: scale, pivot, or stop. Repeat.

Module 6: Resilient AI Leadership — The Lebanese-Specific Dimension
- This module addresses what no global AI coaching framework adequately covers: leading AI transformation under conditions of national adversity.
Lebanese executives carry a leadership tax that their counterparts in Dubai or Riyadh do not. Operating through a banking crisis, a port explosion, COVID, political paralysis, and ongoing economic instability while simultaneously trying to build competitive businesses is an extraordinary feat of resilience. AI transformation must be led from that reality — not the sanitized version in Harvard Business Review.
- Coaching objectives:
  * Acknowledge and process the cumulative leadership fatigue that comes with years of crisis management.
  * Distinguish between crisis resilience (reactive, survival-mode) and strategic resilience (proactive, growth-oriented) — and make the transition.
  * Use AI as a lever for strategic relief — freeing leadership bandwidth consumed by operational tasks.
  * Build a personal sustainability plan for the leader alongside the organizational transformation plan.
- The Resilient Leader AI Audit (Ask the C-suite executive):
  1. Which decisions are you making today that AI could inform better?
  2. Which tasks consume your time but do not require your judgment?
  3. Where is your team's energy going that could be redirected if AI handled the routine?
  4. What would you do differently as a leader if you had 10 more hours per week?
The answers define the personal ROI of AI transformation — and make it emotionally real, not just strategically logical.


Part IV: Consolidated Recommendations

For Lebanese C-Suite Leaders:
1. Start with a 90-day quick-win AI sprint — pick one high-pain, low-complexity process and automate it. Build internal credibility before attempting systemic transformation.
2. Invest in Microsoft for Startups or AWS Activate credits before spending your own capital. Lebanese companies systematically underutilize these programs.
3. Appoint an internal AI Champion — not necessarily the CTO. The best AI champions are often operations or commercial leaders who understand business pain points deeply.
4. Separate AI training from AI behavior change. Training tells people how tools work. Coaching changes how people work. You need both — but most organizations stop at training. (coachhub.com)
5. Be radically transparent with your workforce about what AI will and won't change in their roles. Silence breeds fear; fear kills adoption.
6. Budget for coaching alongside technology. A $5,000 AI tool deployment without behavioral change support will underperform a $2,000 deployment with structured coaching every time.
7. Partner with local AI firms (Eurisko, Hellotree) for implementation, while using global platforms for tooling. This keeps dollars circulating in the local ecosystem and ensures implementation partners understand the Lebanese operating context.
8. Join regional AI communities. Lebanese leaders who participate in UAE or Saudi AI forums often bring back frameworks, partnerships, and funding connections that bypass the domestic constraints.
9. Design for the diaspora. Lebanon's greatest AI asset is not local — it is the network of highly educated Lebanese professionals working in Silicon Valley, London, Dubai, and Toronto. Build reverse mentorship programs that bring AI expertise home without requiring physical return.
10. Protect your people through the transition. Research is clear: coaching leadership buffers the health and wellbeing costs of AI adoption. Leaders who invest in their people's psychological safety during this transition retain talent, maintain morale, and ultimately see better adoption outcomes. (pmc.ncbi.nlm.nih.gov)

For Startups Specifically:
1. Use AI from day one as a force multiplier — do not hire for tasks that AI can perform.
2. Build AI-native processes rather than retrofitting. The 84% of non-AI-native processes that slow down established companies do not have to be your problem.
3. Explore niche AI applications for Lebanon-specific problems: Arabic NLP, agricultural tech, healthcare triage, financial remittance optimization. These represent genuine white-space opportunities.
4. Seek ESCWA technical cooperation programs for capacity building and credibility building with regional partners.

Conclusion:
Lebanese companies can afford AI transformation — not despite their constraints, but in many ways because of them. The economic pressure to do more with less, the diaspora network effect, the access to cloud economics, and the survival-hardened leadership culture all create conditions where lean, disciplined AI adoption is genuinely viable.

What Lebanese C-suite leaders cannot afford is the illusion that deploying AI tools equals AI transformation. The research is unambiguous: behavior change, coaching leadership, and cultural readiness determine whether AI creates value or creates friction.

The leaders who will win this decade are not those with the biggest AI budgets. They are those who lead the human side of this transition with as much rigor as the technical side — and in Lebanon, that kind of resilient, human-centered leadership is something executives have been building under fire for years.

The tools have arrived. The question is whether leadership will meet them.

This report draws on data from Clutch.co (May 2026), UNESCWA, CoachHub research, PMC peer-reviewed research, and market intelligence current as of June 2026. (coachhub.com)`,
    bgColor: 'bg-emerald-50 border-emerald-150 text-slate-900',
    tag: 'STRATEGIC REPORT',
    likesCount: 312,
    status: 'published'
  },
  {
    id: 'insight-maan-software-survey',
    title: 'LEBANON SOFTWARE ECOSYSTEM SURVEY – DECEMBER 2025',
    author: 'Maan Barazy',
    role: 'Editor | Founder - AlKhawarizmi | President NCEI Lebanon reg 2220',
    snippet: 'The first quantitative baseline of Lebanon’s software and tech workforce post-2018 collapse, based on a directional survey of 103 respondents (Sep–Dec 2025). Examine the macro shift toward a remote talent export platform.',
    content: `Lebanon Software Ecosystem Survey – December 2025
Edited by Maan Barazy

This report is framed in a policy, macro, and ecosystem-development lens, investigating the state of Lebanon's software tech workforce.

1. Executive Summary
The report provides a first quantitative baseline of Lebanon’s software and tech workforce post-2018 collapse, based on a directional survey of 103 respondents (Sep–Dec 2025).

Core findings:
• Lebanon’s software ecosystem is alive, globally connected, and AI-native, but structurally under-supported.
• 59% work for international companies, and ~68% work remotely or hybrid, confirming Lebanon’s de facto role as a remote talent exporter.
• AI adoption is mainstream, with ~88% using AI daily, primarily for coding, learning, and documentation.
• Job satisfaction is moderate (3.64/5) but highly sensitive to growth infrastructure, not just pay.
• Academia underperforms as a talent pipeline (2.72/5 perceived impact).
• The workforce is young, generalist-heavy, male-dominated, and urban-centric, with thin senior leadership layers.

The report concludes that talent is not the constraint; strategy, governance, and institutional coordination are.


2. Structural Analysis (What This Really Tells Us)

A. Lebanon Has Shifted from “Local Tech Sector” to “Human Capital Export Platform”
This is no longer a domestic tech economy:
• The majority of income, workflows, and standards are externally anchored.
• Lebanon effectively operates as a low-cost, high-skill, remote software labor pool.

Implication:
Macroeconomic policy, labor law, taxation, and banking regulations are misaligned with reality. The state still regulates as if jobs are local, while value creation is global.


B. AI Is Not Disruptive Here — It Is Compensatory
AI adoption is exceptionally high not because of abundance, but because of:
• Weak middle management
• Poor documentation culture
• Skills mismatches from academia
• Infrastructure instability

AI tools are acting as institutional substitutes, not productivity luxuries.

Risk:
If policy moves toward restrictive AI regulation (copying EU-style frameworks blindly), it will directly erode Lebanon’s only remaining competitive edge.


C. Brain Drain Has Evolved into “Leadership Drain”
While junior and mid-level talent is abundant:
• Only ~15% have 10+ years experience.
• Tech leads and senior architects are scarce.

This produces:
• Flat organizations
• Weak mentoring
• Fragile scaling capacity
• High burnout at the mid-senior layer

This is not a talent problem — it is a retention and incentive failure.


3. Macroeconomic & Policy Reading (Beyond the Report)
The software sector is Lebanon’s only functioning export industry that:
• Requires no ports
• Requires no fuel subsidies
• Requires no FX intermediation
• Generates fresh dollars

Yet:
• It has no national strategy
• No labor protection adapted to remote work
• No FX, tax, or social security framework aligned with cross-border income
• No serious public investment in digital infrastructure reliability

This is a policy paradox: the state ignores the only sector that still works.


4. Strategic Gaps Identified
1. No national software / AI export strategy
2. No senior talent retention mechanism
3. No university–industry compacts
4. No freelance & remote labor legal framework
5. No gender & regional inclusion strategy tied to remote work
6. No data continuity (survey must become annual and institutionalized)


5. Directional Recommendations (System-Level)

At ecosystem level:
• Treat software talent as strategic national infrastructure
• Shift from startup obsession → workforce + export capacity
• Support vertical specialization (GovTech, HealthTech, FinTech, AI Ops)

At policy level:
• Legal recognition of remote-first employment
• Simplified cross-border income and freelance regimes
• Non-restrictive AI governance (guidelines, not bans)
• Incentives for companies retaining senior talent locally

At institutional level:
• Industry-co-designed curricula
• Certification bridges instead of degree inflation
• Leadership and managerial capacity programs for SMEs


6. Bottom Line
This report quietly confirms a critical truth:
Lebanon’s tech collapse never happened — its institutions collapsed around it.
The ecosystem is functioning in spite of the state, not because of it.
Without coordinated action, Lebanon risks remaining a talent quarry, not a knowledge economy.`,
    bgColor: 'bg-indigo-50 border-indigo-150 text-slate-900',
    tag: 'ECOSYSTEM SURVEY',
    likesCount: 247,
    status: 'published'
  },
  {
    id: 'insight-1',
    title: 'THE PARALLEL LIQUIDITY PROTOCOL',
    author: 'Maan Barazy',
    role: 'Sovereign Advisor',
    snippet: 'How decentralized digital ledger pools can reboot commercial credit pipelines across Lebanon without central bank bailouts.',
    content: 'Lebanon’s recovery depends on isolating credit creation from impaired sovereign balance sheets. By establishing cooperative digital clearing networks, local suppliers and enterprises can clear trade invoices using a sovereign-grade parallel credit ledger. This cuts immediate dependency on traditional retail banking pipelines and re-injects velocity into stalled merchant transactions. We detail the mechanics of multi-signature escrow grids and smart-invoice auditing that can scale to $450M in annual trade volume.',
    bgColor: 'bg-slate-900 border-zinc-800 text-white',
    tag: 'FINANCE',
    likesCount: 124,
    status: 'published'
  },
  {
    id: 'insight-2',
    title: 'THE AGENTIC WORKFORCE: SAVING 60% OPERATIONAL BURN',
    author: 'Alpha Team Lead',
    role: 'Sovereign Architect',
    snippet: 'A look at deploying 12 parallel autonomous agents to handle daily administration loops and client-facing brief generation.',
    content: 'Standard corporate offices waste up to 60% of workforce capacity on compiling legacy spreadsheets, formatting client reports, and validating manual checklists. Deploying serverless Agentic Swarms lets businesses run parallel data engines that monitor and resolve structural steps in seconds. Human personnel transition from manual processing targets to executive validation gatekeepers, instantly solving latency issues and reducing routine operational overheads.',
    bgColor: 'bg-white border-zinc-200 text-slate-900',
    tag: 'AI DEPLOYMENT',
    likesCount: 89,
    status: 'published'
  },
  {
    id: 'insight-3',
    title: 'DE-BOTTLENECKING ENTERPRISE DECISION CHAINS',
    author: 'Sovereign Auditor',
    role: 'Operations Expert',
    snippet: 'Eliminating the "approval hoop" drag weight. Empowering decentralized team leaders with automated budget-trigger protocols.',
    content: 'Traditional corporate approvals represent a hidden drag force. Installing smart trigger systems utilizing programmatic multi-sig thresholds allows divisions to execute up to $15k projects automatically when pre-audited metrics are satisfied. By taking human scheduling delays out of the loop, team velocity improves by an average of 4x based on our weekly diagnostic scorecards.',
    bgColor: 'bg-white border-zinc-200 text-slate-900',
    tag: 'MANAGEMENT',
    likesCount: 56,
    status: 'published'
  },
  {
    id: 'insight-4',
    title: 'OFFLINE-FIRST NETWORK ARCHITECTURES IN VOLATILE PHASES',
    author: 'Infrastructure Guild',
    role: 'Router Specialist',
    snippet: 'Designing hybrid local-storage networks to maintain core corporate data security during unexpected regional connectivity cuts.',
    content: 'In highly volatile physical environments, modern enterprises cannot afford complete cloud dependencies. Designing hybrid local networks containing synchronized micro-databases guarantees zero-downtime ledger continuity. Data is securely queued on regional SSD caches using asymmetric encryption, instantly deploying updates to main cloud nodes as soon as optical or fiber links recover.',
    bgColor: 'bg-slate-950 border-zinc-900 text-white',
    tag: 'INFRASTRUCTURE',
    likesCount: 142,
    status: 'published'
  },
  {
    id: 'insight-5',
    title: 'THE RETALENTIZATION PRIORITY CHECKLIST',
    author: 'Training Team Lead',
    role: 'Academy Lead',
    snippet: 'A standard weekly curriculum designed to retrain legal, accounting, and sales personnel onto prompt governance frameworks.',
    content: 'Sovereign recovery is defined by personnel readiness. Weekly audits indicate the quickest pathway to automation is training internal teams to speak "the machine language." Our modular curriculums take typical clerks and upskill them with precise generative workflow instruction matrices within 14 days, creating operational action forces.',
    bgColor: 'bg-[#FAF9F6] border-zinc-300 text-slate-900',
    tag: 'GOVERNANCE',
    likesCount: 38,
    status: 'published'
  }
];

export default function CSuiteInsights() {
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<InsightCard | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'csuiteInsights'));
      const list: InsightCard[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.status === 'published') {
          list.push({ id: docSnap.id, ...data } as InsightCard);
        }
      });
      
      if (list.length > 0) {
        const dbIds = new Set(list.map(item => item.id));
        const missingDefaults = DEFAULT_INSIGHTS.filter(item => !dbIds.has(item.id));
        setInsights([...list, ...missingDefaults]);
      } else {
        setInsights(DEFAULT_INSIGHTS);
      }
    } catch (err) {
      console.error('Failed to fetch published insights, falling back to sovereign defaults.', err);
      setInsights(DEFAULT_INSIGHTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleLike = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedIds.includes(id)) return;

    // Local optimization state
    setLikedIds((prev) => [...prev, id]);
    setInsights((prev) => 
      prev.map((item) => item.id === id ? { ...item, likesCount: item.likesCount + 1 } : item)
    );

    // Save to Firestore if database is present
    try {
      const ref = doc(db, 'csuiteInsights', id);
      await updateDoc(ref, {
        likesCount: increment(1)
      });
    } catch (err) {
      console.warn('Liking dynamic sync bypassed, state updated locally.', err);
    }
  };

  return (
    <div className="space-y-8" id="csuite-insights-board">
      {/* Page Header */}
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-zinc-200 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#9DFF00]/10 rounded-full filter blur-3xl opacity-20"></div>
        <div className="space-y-4 max-w-4xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-lime-50 border border-lime-150 text-lime-700 font-mono text-[9px] tracking-wider font-extrabold uppercase rounded-lg">
            ★ C-SUITE INTELLIGENCE ARCHIVE ★
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-slate-900 font-sans leading-none">
            C-Suite Insights Board
          </h2>
          <p className="text-zinc-650 text-xs md:text-sm leading-relaxed max-w-2xl font-medium">
            A high-density strategic insight directory. Staggered, raw-intelligence briefings published by our advisors. Tap cards to read full operational documents or trigger like indicators.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-xs font-mono text-zinc-500 space-y-2">
          <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
          <p>Syncing insights with firestore cloud matrix...</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6" id="pinterest-board-masonry">
          {insights.map((item) => {
            const hasLiked = likedIds.includes(item.id);
            return (
              <div 
                key={item.id}
                onClick={() => setSelectedInsight(item)}
                className={`break-inside-avoid border rounded-2xl p-6 transition-all duration-200 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${item.bgColor || 'bg-white text-slate-900 border-zinc-200'} space-y-4`}
              >
                {/* Header Tag / Action */}
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded font-mono text-[8px] uppercase font-extrabold tracking-widest ${
                    item.bgColor?.includes('slate') 
                      ? 'bg-zinc-800 text-[#9DFF00] border border-zinc-700' 
                      : 'bg-zinc-100 text-slate-800 border border-zinc-200'
                  }`}>
                    {item.tag || 'BRIEFING'}
                  </span>
                  
                  <span className="font-mono text-[8px] opacity-40">
                    ID // {item.id.substring(0, 8).toUpperCase()}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-md font-extrabold uppercase tracking-tight leading-snug">
                  {item.title}
                </h3>

                {/* Snippet */}
                <p className={`text-xs leading-relaxed font-sans font-medium ${
                  item.bgColor?.includes('slate') ? 'text-zinc-300' : 'text-slate-600'
                }`}>
                  {item.snippet}
                </p>

                {/* Author Info */}
                <div className="border-t border-zinc-500/10 pt-3 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-extrabold">{item.author}</p>
                    <p className="text-[8.5px] font-mono opacity-60 leading-none mt-0.5">{item.role}</p>
                  </div>

                  {/* Liking Button */}
                  <button
                    onClick={(e) => handleLike(item.id, e)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9.5px] font-mono font-bold transition-all transition-colors cursor-pointer ${
                      hasLiked
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : item.bgColor?.includes('slate')
                          ? 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-300 hover:text-white'
                          : 'bg-zinc-55/10 hover:bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-current text-rose-500' : ''}`} />
                    <span>{item.likesCount}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Community Insights Section for organic peer Q&A and transformation breakthroughs */}
      <div className="pt-4">
        <CommunityInsights />
      </div>

      {/* Selected Insight Detail Overlay Modal */}
      {selectedInsight && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-zinc-250 overflow-hidden shadow-2xl animate-scaleUp max-h-[90vh] flex flex-col" id="insight-modal-container">
            
            {/* Header top colored bar */}
            <div className="bg-slate-900 text-white p-6 relative flex justify-between items-center shrink-0">
              <div className="space-y-1.5">
                <span className="bg-[#9DFF00]/15 text-[#9DFF00] font-mono text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide border border-[#9DFF00]/20">
                  SYSTEM BRIEFING // CS-INSIGHTS
                </span>
                <h3 className="text-lg font-black uppercase tracking-tight text-white leading-tight">
                  {selectedInsight.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedInsight(null)}
                className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer shrink-0 ml-4"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Inner Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-800">
              <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 border border-zinc-150 rounded-xl">
                <div>
                  <span className="text-[8px] font-mono text-zinc-400 block uppercase font-bold">// ADVISOR SOURCE</span>
                  <p className="text-[12.5px] font-extrabold text-slate-900 mt-0.5">{selectedInsight.author}</p>
                  <p className="text-[9px] font-mono text-zinc-450 uppercase">{selectedInsight.role}</p>
                </div>
                <div className="text-right">
                  <span className="text-[8px] font-mono text-zinc-400 block uppercase font-bold">// TAXONOMY METRIC</span>
                  <p className="text-[11.5px] font-mono font-extrabold text-[#22c55e] mt-0.5">● {selectedInsight.tag}</p>
                  <p className="text-[9px] font-mono text-zinc-450 uppercase">{selectedInsight.likesCount} endorsement indicators</p>
                </div>
              </div>

              <div className="space-y-4">
                <span className="text-[9px] font-mono text-zinc-450 block uppercase font-black">// OPERATIONAL BRIEFING DATA</span>
                <p className="text-xs text-slate-850 font-semibold leading-relaxed border-l-2 border-[#86d900] pl-4 italic">
                  "{selectedInsight.snippet}"
                </p>
                
                <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap font-sans font-medium">
                  {selectedInsight.content}
                </div>
              </div>
            </div>

            {/* Footer Bottom Action Area */}
            <div className="p-5 border-t border-zinc-150 bg-zinc-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <span className="font-mono text-[9px] text-zinc-400 uppercase tracking-tight">DOCUMENT DEPLOYS STRICTLY FOR SOVEREIGN READERS ONLY</span>
              <button
                onClick={(e) => {
                  handleLike(selectedInsight.id, e);
                }}
                className={`w-full sm:w-auto px-4 py-2 text-xs rounded-xl border font-mono font-bold uppercase transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                  likedIds.includes(selectedInsight.id)
                    ? 'bg-rose-50 border-rose-250 text-rose-600'
                    : 'bg-slate-900 border-transparent text-white hover:bg-slate-800'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>{likedIds.includes(selectedInsight.id) ? 'Endorsed' : 'Endorse Insight'} ({selectedInsight.likesCount})</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
