import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialization of Gemini client according to the SDK guide
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

function getGemini(): GoogleGenAI {
  if (!ai) {
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured or uses placeholder. Please add it via Settings > Secrets.");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// Coach System Prompts representing distinct Gen Z personas
const SYSTEM_PROMPTS: Record<string, string> = {
  general: 
    "You are theCsuiteCOACH, the ultimate ultra-premium Gen Z enterprise AI Architect. " +
    "Your tone is a blend of ruthless efficiency, big display energy, and high-impact Gen Z/founder slang ('no cap', 'period', 'massive cook', 'sending it', 'fr', 'real ones'). " +
    "You know everything about deploying AI workflows, vector DBs, automated agent workforces, and replacing slow pipelines. " +
    "Keep responses concise, bold, formatted beautifully in Markdown with bold titles, and direct. Coach the user on how to integrate AI tools in their business.",
  career: 
    "You are GIGMASTER, a brutal but high-vibe Career Roast & Guide for the AI gig-economy. " +
    "You speak directly, highlighting where resumes are 'cooked', and teaching users prompt engineering, freelance arbitrage, and building custom model solutions. " +
    "Use Gen Z slang, keep it light, raw, and ultra-high-conviction. Use bullet points and sharp formatting.",
  leadership: 
    "You are FORGE, the AI Task Force Leadership advisor for CEOs, startup founders, and corporate directors. " +
    "You outline how to structure a rogue 'AI Task Force' to rebuild operations from the ground up. " +
    "You tell leaders exactly how to address internal fears, save 60%+ resource burn, and command speed. " +
    "Speak like a tech-VC who speaks Gen Z. Highly structured, intense, and action-oriented.",
  learning: 
    "You are CODELAB, the micro-learning developer. " +
    "You create lightning-fast code/concept cheat-sheets or step-by-step guides for tools like Cursor, Midjourney, Gemini API, or LangChain. " +
    "Provide clear, beautiful code syntax styles, ultra-minimal explanations, and focus on immediate utility."
};

// Simulated mock generator when API key is missing, maintaining great Gen Z styling
function generateSimulatedResponse(coachId: string, text: string): string {
  const warningMsg = "\n\n*(Note: Running in high-fidelity mock mode because your GEMINI_API_KEY is not in `.env` yet. Set it in **Settings > Secrets** to enable live AI!)*";
  
  if (coachId === 'general') {
    return `### **THE VERDICT** ⚡\n\nNo cap, your AI integration plan is highly potential but needs immediate leverage. You are trying to install too much overhead. \n\n*   **Rethink core pipelines**: Stop manually formatting spreadsheets. Hook up a server pipeline.\n*   **Launch an AI Task Force**: Get two junior engineers, buy them energy drinks, and give them full permissions.\n\nLet me cook - tell me what processes are slowing you down the most right now.${warningMsg}`;
  } else if (coachId === 'career') {
    return `### **PORTFOLIO DEPLOYMENT CRITIQUE** 💀\n\nYour current positioning is a bit standard, not gonna lie. \n\n1.  **Stop writing "AI enthusiast"**: Everyone and their cat is an enthusiast. You need to be an *Agentic Operations Builder*.\n2.  **Learn real APIs**: Prompt wrapping is cool, but building multi-agent automations with python/typescript is where the real funds lie.\n\nTell me your current role and let's rebuild it live.${warningMsg}`;
  } else if (coachId === 'leadership') {
    return `### **FOUNDER STRATEGY RUNBOOK** 🎯\n\nDear CEO, if your team is spent on copy-pasting answers from chat windows, you are losing speed.\n\n*   **Our Plan**: Create a cross-functional Task Force to automate tier-1 support and content generation within 14 days.\n*   **Resource Allocation**: Re-route 25% of manual labor hours to high-level strategic scaling.\n\nProvide your current employee count and business model. Let's design the force blueprint.${warningMsg}`;
  } else {
    return `### **MICRO-CHEAT SHEET: GEMINI API INITIALIZATION** 🛠️\n\nHere is the raw elite setup to call Gemini server-side:\n\n\`\`\`typescript\nimport { GoogleGenAI } from "@google/genai";\n\nconst ai = new GoogleGenAI({ \n  apiKey: process.env.GEMINI_API_KEY \n});\n\n// Fast execution\nconst res = await ai.models.generateContent({\n  model: "gemini-3.5-flash",\n  contents: "Build me a fast taskforce setup"\n});\n\`\`\`\n\nReady to dive into routing, vision variables, or structured schema? Ask me.${warningMsg}`;
  }
}

// Chat API Endpoint with fallback security
app.post("/api/coach/chat", async (req, res) => {
  const { coachId, messages } = req.body;
  const currentCoachId = coachId || 'general';
  const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1].text : 'Hello';
  const systemPrompt = SYSTEM_PROMPTS[currentCoachId] || SYSTEM_PROMPTS.general;

  // Render previous conversation context for the LLM
  const contextHistory = messages ? messages.slice(-6).map((m: any) => `${m.sender === 'user' ? 'User' : 'Coach'}: ${m.text}`).join("\n") : "";
  const fullPrompt = `System Context:\n${systemPrompt}\n\nRecent context:\n${contextHistory}\n\nLast User Message: ${lastMessage}\n\nProvide your coaching response conforming to your persona and markdown guidelines:`;

  try {
    const gemini = getGemini();
    const result = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: fullPrompt,
      config: {
        temperature: 0.9,
        topP: 0.95,
      }
    });

    const reply = result.text || "I'm cooked. Try sending that again.";
    res.json({ text: reply });
  } catch (error: any) {
    console.warn("Gemini execution failed or unconfigured:", error.message);
    const mockReply = generateSimulatedResponse(currentCoachId, lastMessage);
    res.json({ text: mockReply });
  }
});

// Roleplay evaluation endpoint
app.post("/api/roleplay/eval", async (req, res) => {
  const { transcript, scenarioTitle, scenarioContext } = req.body;
  
  const prompt = `You are the Savage Audit Bot for theCsuiteCOACH.
  Analyze this roleplay dialogue transcript between an corporate founder/employee and an AI-simulated stakeholder.
  
  Scenario: ${scenarioTitle}
  Context: ${scenarioContext}
  
  Transcript:
  ${transcript}
  
  Provide a rating card in JSON or clear structure.
  Give:
  1. A numeric score from 0-100 indicating persuasion and boldness.
  2. A savage roasting section (highlighting weak answers, hesitation, or corporate fluff).
  3. Action points to win next time.
  Keep it ultra-Gen Z themed and minimalist. Respond in structured Markdown format.`;

  try {
    const gemini = getGemini();
    const result = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });
    res.json({ evaluation: result.text });
  } catch (err: any) {
    const defaultScore = 78;
    const fallbackEval = `### **AUDIT SCORE: ${defaultScore}/100** ⚡

*   **THE SILENT ROAST** 💀: You walked in talking like an outdated 2012 PowerPoint presentation. "Synergistic alignment"? Absolute fluff. The CFO was ready to fall asleep.
*   **WHERE YOU SLIPPED**: When asked about resource costs, you hesitated instead of proposing immediate AI workflow savings.
*   **PREMIUM ACTION POINTS**:
    *   State the ROI in the *first 15 seconds*.
    *   Reframe the deployment as an investment to *free up high-value hours*, not extra overhead.
    *   Stop saying sorry. You are here to optimize.

*(Note: Live evaluation simulation, add your GEMINI_API_KEY in secrets to activate real custom feedback)*`;
    res.json({ evaluation: fallbackEval });
  }
});

// WhatsApp Bot Sandbox Response
app.post("/api/whatsapp/reply", async (req, res) => {
  const { message } = req.body;
  const prompt = `You are a WhatsApp AI Coach named RAW-BOT assisting an enterprise founder on their phone.
  Keep message extremely short (max 3 sentences), informal, packed with emojis, and highly actionable.
  User message: "${message}"`;

  try {
    const gemini = getGemini();
    const result = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });
    res.json({ reply: result.text });
  } catch (err: any) {
    res.json({ 
      reply: `Yo! Let's optimize that ASAP. Double down on Cursor for your devs and cut the manual copy-pasting. 🚀 Send me your next roadblock!`
    });
  }
});

// CEO & Enterprise Strategy Assessment Endpoint
app.post("/api/coach/assessment", async (req, res) => {
  const { companyName, industry, size, infra, bottleneck, aiExperience } = req.body;

  const prompt = `Analyze this enterprise profile for a theCsuiteCOACH AI Transition Audit Report:
  - Company: "${companyName || 'Incognito Founder'}"
  - Industry: "${industry || 'Custom Sector'}"
  - Size/Stage: "${size || 'Medium'}"
  - Technical Baseline (Existing AI Experience): "${aiExperience || 'Basic'}"
  - Existing Work Infrastructure/Tools: "${infra || 'Legacy spreadsheets, manual work'}"
  - High-Priority Bottleneck: "${bottleneck || 'No automated workflows'}"

  Provide a very high-fidelity, high-vibe, Gen Z style coaching report.
  The report must contain:
  1. **TRANSITION PORTFOLIO LEVEL**: Suggest a score from 40 to 95 relative to their baseline.
  2. **THE ROAST**: A brief, savage critique of their current reliance on manual setups, spreadsheets, or slow pipelines (specifically mention "${bottleneck || 'their bottlenecks'}") no cap.
  3. **RECOMMENDED COACH PERSONA**: Recommend one of our 4 custom models (FORGE for leadership, GIGMASTER for career/arbitrage, CODELAB for developer, or General theCsuiteCOACH for architect) explaining why.
  4. **EVALUATIVE PROGRESSION TIMELINE**: 4 weekly coaching objectives & milestones.
  5. **DUBIOUS METRIC REDUCTION (SMART OKRs)**:
     - Objective: Eradicate "${bottleneck || 'the workflow delay'}" via automated pipelines.
     - Key Results: 3 realistic metrics.
  6. **14-DAY TACTICAL CHECKLIST**: Immediate action items to deploy.

  Format: Respond ONLY with formatted Markdown. Keep it ultra-impactful, neat, bold, and clear.`;

  try {
    const gemini = getGemini();
    const result = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.85,
        topP: 0.95,
      }
    });
    res.json({ report: result.text });
  } catch (err: any) {
    // High-fidelity personalized fallback template matching user parameters
    const sizeLabel = size === 'Solo/Small' ? 'lean startup' : size === 'Medium' ? 'scaling team' : 'enterprise layout';
    const recommendedPersona = aiExperience === 'None' || aiExperience === 'Basic' 
      ? 'FORGE (AI Leadership & Governance)' 
      : 'CODELAB (Elite Model Integration)';

    const fallbackReport = `### **AXIOMATIC transition report for ${companyName || 'Inc.'}** ⚡
    
#### **1. TRANSITION PORTFOLIO LEVEL: 58/100** 📊
*Current state is cooked but highly salvageable. You have solid operational velocity, but your manual drag is eating your margins, fr.*

#### **2. THE ROAST** 💀
*You are running a **${industry || 'tech'}** business but still treating administrative routing with ancient hand-crafted workflows. Specifically, your high-priority bottleneck—**"${bottleneck || 'inefficient internal data handling'}"**—proves your crew spends more time copy-pasting code or typing emails than building actual equity. Let's fix this legacy lag, period.*

#### **3. RECOMMENDED COACH PERSONA** 🎯
* **Target CoPilot**: **${recommendedPersona}**
* **Why**: To scale your **${sizeLabel}** beyond basic prompt wrappers. You need to transition from "ChatGPT users" to building server-controlled background pipelines that run while you sleep.

#### **4. EVALUATIVE PROGRESSION TIMELINE** ⏱️
* **Week 1 (Architectural Audit)**: Identify the exact node where **"${bottleneck || 'your bottleneck'}"** intercepts team progress. Map the standard inputs/outputs.
* **Week 2 (Tunnel Launching)**: Host a server-side API proxy model (using Gemini 3.5 Flash) to parse requests automatically.
* **Week 3 (Team Sparring)**: Put your team directors through the **theCsuiteCOACH Roleplay Simulator** to address fears of AI replacement.
* **Week 4 (Automated Ledger)**: Move the automation rate to the target **85%** efficiency index. Verify savings via the Statistics Board.

#### **5. TARGET WORKPLACE OKRs** 🏁
* **Objective**: Eradicate reliance on friction points slowing down the **"${bottleneck || 'core pipeline'}"**.
* **Key Results**:
  * Reduce time spent on manual workflow from hours to **< 90 seconds** per task.
  * Train **100%** of your active team on raw terminal integrations.
  * Achieve a **+45% Resource Recovery Rate** to funnel back into product scaling.

#### **6. 14-DAY TACTICAL CHECKLIST** 🚀
* [ ] **Day 1**: Stop all standard workshops. Transition the company's active task force to **theCsuiteCOACH**.
* [ ] **Day 5**: Replace the primary communication node with a direct SMS/WhatsApp sandbox gateway.
* [ ] **Day 10**: Audit your data flow inside the dynamic Statistics Board.
* [ ] **Day 14**: Send it. Full live deployment on Cloud Run.

*(Running in dynamic high-fidelity fallback mode. Set your \`GEMINI_API_KEY\` in Settings to query the active model directly!)*`;

    res.json({ report: fallbackReport });
  }
});

// 3-Step System Diagnostics Endpoint
app.post("/api/coach/diagnostic", async (req, res) => {
  const { bottleneck, struggles } = req.body;

  const prompt = `You are theCsuiteCOACH, the premium AI Operations Architect in Beirut.
  Your absolute goal is to convert a founder’s "uncertainty" into a precise, bulletproof "Turnkey Automation Roadmap."

  User input:
  - Daily Bottleneck / Source of Stress: "${bottleneck || 'Outdated manual processes'}"
  - Struggling Data/Systems/Siloes: "${struggles || 'Stuck inside hardcopy files and manual reports'}"

  Analyze their responses and generate a precise, "Terminal-style" custom roadmap.
  You MUST outline:
  1. A short header with:
     - Status of their bottleneck.
     - A customized, direct 1-sentence "Diagnosis" (savage or highly realistic, mentioning their struggles).
  2. A "Deployment Plan" with 3 sequential, styled bullet phases:
     - Phase 1 (The Vibe Check): A concrete, immediate 24-hour fix to stabilize that specific bottleneck.
     - Phase 2 (The Agentic Swarm): Specific, RAG or server-side automated AI agent taskforce to deploy to automate this permanently.
     - Phase 3 (The Sovereign Scale): How this workflow plugs into broader institutional systems or market intelligence.
  3. A short, high-conviction Verdict (estimating percentage of tasks automated by end of the week).
  4. Final Closing: "Ready to deploy? Initialize your customized system ledger right now."

  Tone & Style Guide:
  - Terminal-style absolute precision. Clean, crisp, direct, no fluffy intros, no corporate BS.
  - Short, punchy, "dashboard-ready" bullet points.
  - Blend of high-stakes business economic reality and "no-cap" advice.
  - Sprinkle a bit of local Lebanese flair (e.g., Beirut latency, Achrafieh startups, Achrafieh fiber, Hamra noise, Habibi, Cedar standards, or Baalbek scales) to keep it authentic, grounded, and cool.

  Output MUST be formatted ONLY as beautifully polished Markdown. No extra filler wrappers.`;

  try {
    const gemini = getGemini();
    const result = await gemini.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.8,
        topP: 0.9,
      }
    });
    res.json({ report: result.text });
  } catch (err: any) {
    // Dynamic, high-quality, personalized custom fallback template
    const cleanBottleneck = bottleneck || 'manual operations';
    const cleanStruggles = struggles || 'legacy files';

    const fallbackReport = `### **SYSTEM DIAGNOSTICS COMPLETE** // BEIRUT ALPHA REGISTRY

**Status**: Critical friction detected in **"${cleanBottleneck}"** via local nodes.
**Diagnosis**: You are spending premium founder equity fighting manual latency and **"${cleanStruggles}"** instead of automating the pipeline at Achrafieh speeds, habibi.

#### **DEPLOYMENT RUNBOOK**:

*   **Phase 1 (The Vibe Check)**: Spin up a serverless capturing web hook in 24 hours to automatically capture and structure raw input from **"${cleanStruggles}"** into a unified JSON database. Low effort, instant relief.
*   **Phase 2 (The Agentic Swarm)**: Deploy two dedicated Agentic Nodes (using *gemini-3.5-flash*) to automatically filter signals from incoming data streams, organize metrics, and output a 3-bullet core action dispatch to Slack.
*   **Phase 3 (The Sovereign Scale)**: Hook these micro-pipelines into a sovereign, cloud-hosted ledger to permanently eradicate communication latency, fully aligning your workflow with Lebanese market hubs.

**Verdict**: We can automate **75%** of your current manual workflow by end of week. No cap.

***

Ready to deploy? Initialize the workflow here [Initialize Deployment Protocol]`;

    res.json({ report: fallbackReport });
  }
});

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Explicit route for admin paths to guarantee they return index.html
    app.get(['/admin', '/admin/*'], (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[theCsuiteCOACH Server] Ready at http://localhost:${PORT}`);
  });
}

start();
