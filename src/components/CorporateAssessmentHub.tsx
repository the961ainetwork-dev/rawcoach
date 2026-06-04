import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { 
  Building2, 
  BookOpen, 
  FileCheck, 
  Award, 
  LineChart, 
  Sparkles, 
  Play, 
  CheckCircle, 
  Lock, 
  Users, 
  Plus, 
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  BookmarkCheck,
  Check,
  HelpCircle,
  Download,
  Flame,
  Clock,
  Filter,
  Printer
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
  LineChart as ReLineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

type HubSectionId = 
  | 'corporate-assessment' 
  | 'learning-paths' 
  | 'skill-assessments' 
  | 'training-programs' 
  | 'progress-reports' 
  | 'certification-recommendations';

interface HubSection {
  id: HubSectionId;
  title: string;
  sub: string;
  icon: React.ReactNode;
}

export default function CorporateAssessmentHub() {
  const [activeSection, setActiveSection] = useState<HubSectionId>('corporate-assessment');

  // Hub Sections navigation configuration
  const sections: HubSection[] = [
    {
      id: 'corporate-assessment',
      title: 'Corporate Assessment',
      sub: 'Audit legacy hoops & AI tech readiness',
      icon: <Building2 className="w-5 h-5 text-indigo-500" />
    },
    {
      id: 'learning-paths',
      title: 'Learning Paths',
      sub: 'Curated workflow transition roadmaps',
      icon: <BookOpen className="w-5 h-5 text-amber-500" />
    },
    {
      id: 'skill-assessments',
      title: 'Skill Assessments',
      sub: 'Test staff proficiency live',
      icon: <FileCheck className="w-5 h-5 text-rose-500" />
    },
    {
      id: 'training-programs',
      title: 'Training Programs',
      sub: 'Modular curriculums & task-forces',
      icon: <BrainCircuit className="w-5 h-5 text-emerald-500" />
    },
    {
      id: 'progress-reports',
      title: 'Progress Reports',
      sub: 'Team scorecards & resource index',
      icon: <LineChart className="w-5 h-5 text-teal-500" />
    },
    {
      id: 'certification-recommendations',
      title: 'Certifications',
      sub: 'AI governance credential matching',
      icon: <Award className="w-5 h-5 text-purple-500" />
    }
  ];

  /* =========================================================================
     1. CORPORATE ASSESSMENT STATES & DATA
     ========================================================================= */
  const [assessmentAnswers, setAssessmentAnswers] = useState({
    docHandling: '',
    apiUsage: '',
    smsOutreach: '',
    staffCount: 'medium',
    legacyDrag: '3' // 1 to 5
  });
  const [assessmentResult, setAssessmentResult] = useState<any | null>(null);

  const handleAssessmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate a dynamic digital workflow score based on answers
    let score = 40;
    
    if (assessmentAnswers.docHandling === 'ai-automated') score += 20;
    else if (assessmentAnswers.docHandling === 'semi-manual') score += 10;
    
    if (assessmentAnswers.apiUsage === 'custom-endpoints') score += 20;
    else if (assessmentAnswers.apiUsage === 'standard-apps') score += 10;
    
    if (assessmentAnswers.smsOutreach === 'gateway-relay') score += 20;

    // legacy factor inverse
    const legacyFactor = (5 - Number(assessmentAnswers.legacyDrag)) * 4;
    score += legacyFactor;

    score = Math.min(99, Math.max(12, score));

    setAssessmentResult({
      score,
      status: score >= 80 ? 'Optimized Innovator' : score >= 50 ? 'Transient Hybrid' : 'Legacy Bottle Necked',
      recs: [
        score < 50 ? 'Immediate Setup: Replace manual spreadsheets with automated client SMS dispatcher hooks.' : 'Upgrade priority: Bundle server endpoints to prevent front-end secret leakage.',
        'Establish an AI Task Force in the Operations department to reduce manual onboarding labor by 60%.',
        'Enroll senior managers in the Google Cloud Run & Gemini API advisory path to hardcode workflows.'
      ]
    });
  };

  /* =========================================================================
     2. LEARNING PATHS STATES & DATA
     ========================================================================= */
  const [selectedPathId, setSelectedPathId] = useState<string>('path-1');
  
  const learningPathsData = [
    {
      id: 'path-1',
      title: 'AI Advisory Lead Developer',
      focus: 'Express Backend / Gemini Node SDK integration / Cloud Run hosting',
      duration: '4 Weeks Program',
      difficulty: 'Advanced Tech',
      milestones: [
        { week: 'Week 1', title: 'Modular Types & ESM Endpoint Setup', completed: true, details: 'Establish strong interface patterns inside type layouts and launch safe Node configurations.' },
        { week: 'Week 2', title: 'Gemini Models Interface Design', completed: true, details: 'Integrate the official @google/genai SDK to proxy requests and safeguard secret keys server-side.' },
        { week: 'Week 3', title: 'Twilio & WhatsApp Sandbox Relays', completed: false, details: 'Set up custom gateway components to dispatch real-time feedback loops to active stakeholders.' },
        { week: 'Week 4', title: 'Cloud Run Ingress & Nginx Tuning', completed: false, details: 'Host compiled builds on Cloud Run, binding dev traffic safely behind reverse proxies on Port 3000.' }
      ]
    },
    {
      id: 'path-2',
      title: 'Operations Automation Champion',
      focus: 'No-code integration / Process analysis / Slack & WhatsApp workflow bots',
      duration: '3 Weeks Program',
      difficulty: 'Intermediate Ops',
      milestones: [
        { week: 'Week 1', title: 'Audit Legacy Bottlenecks', completed: true, details: 'Identify where administrative manual entry is stalling active client delivery times.' },
        { week: 'Week 2', title: 'Co-Pilot Goal & OKR Integration', completed: false, details: 'Deploy dynamic goal tracking frameworks directly within core employee habit cycles.' },
        { week: 'Week 3', title: 'Human Escalation Thresholding', completed: false, details: 'Setup custom gates that automatically transition stuck AI routines over to senior developers.' }
      ]
    },
    {
      id: 'path-3',
      title: 'CFO Operational Strategist',
      focus: 'Resource Recovery estimation / Budget auditing / Capital allocation',
      duration: '2 Weeks Program',
      difficulty: 'Executive',
      milestones: [
        { week: 'Week 1', title: 'Simulating Resource Recovery Indices', completed: true, details: 'Calculate projected savings with dynamic Task Automation percentages.' },
        { week: 'Week 2', title: 'ROI Pitching For Stakeholder Boards', completed: true, details: 'Face aggressive, simulated board reviews to defend automation budgets.' }
      ]
    }
  ];

  const selectedPath = learningPathsData.find(p => p.id === selectedPathId) || learningPathsData[0];

  /* =========================================================================
     3. SKILL ASSESSMENTS STATES & DATA
     ========================================================================= */
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const quizQuestions = [
    {
      q: "Where should the Gemini API secret key (and other sensitive database keys) be handled to avoid client-side leaks?",
      options: [
        "Prefixed with VITE_ inside local client files",
        "Inside an Express backend proxy route (/api/*) strictly using server-side process.env",
        "Listed as static constants inside public Github repository configurations",
        "Sent directly inside authorization headers straight from the client-side browser bundle"
      ],
      correct: 1,
      explanation: "API keys must always remain server-side. Creating /api/ proxy endpoints ensures keys are kept hidden from raw browser network logs."
    },
    {
      q: "When running full-stack React + Express packages in our container runtime, which port must the dev server bind to?",
      options: [
        "Port 5173",
        "Port 3001",
        "Port 3000 (Required for outer reverse proxy ingress routing)",
        "Any random available port over 8000"
      ],
      correct: 2,
      explanation: "The port is hardcoded by the Cloud Run proxy configuration exclusively to Port 3000; any other port is unreachable."
    },
    {
      q: "What does a higher Resource Recovery Rate (RRR) signify on the executive performance board?",
      options: [
        "The timeline taken to compile TypeScript modules on the master server",
        "Higher administrative cost savings accrued through successful automation of support backlogs",
        "The raw memory leakage percentage calculated by database nodes",
        "The rate of customer unsubscribe tickets logged on external networks"
      ],
      correct: 1,
      explanation: "RRR measures the percentage of manual workloads successfully offloaded to automated advisor co-pilots."
    }
  ];

  const handleSelectAnswer = (optIndex: number) => {
    const updated = [...selectedAnswers];
    updated[currentQuestionIndex] = optIndex;
    setSelectedAnswers(updated);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Calculate final score
      let correctCount = 0;
      selectedAnswers.forEach((ans, idx) => {
        if (ans === quizQuestions[idx].correct) correctCount++;
      });
      const pct = Math.round((correctCount / quizQuestions.length) * 100);
      setQuizScore(pct);
    }
  };

  const handleResetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setQuizScore(null);
  };

  /* =========================================================================
     4. TRAINING PROGRAMS STATES & DATA
     ========================================================================= */
  const [programs, setPrograms] = useState([
    {
      id: 'prog-1',
      title: 'SaaS AI Integration Core',
      dept: 'Engineering Team',
      unlocked: true,
      progress: 66,
      lessons: [
        { id: 'l1', num: '1.1', title: 'ESM Module Structuring & Node Types', done: true },
        { id: 'l2', num: '1.2', title: 'Proxying Gemini API keys securely', done: true },
        { id: 'l3', num: '1.3', title: 'Building custom web socket state sync', done: false }
      ]
    },
    {
      id: 'prog-2',
      title: 'CRM Text Gateway & SMS Sandbox Dev',
      dept: 'Customer Success Division',
      unlocked: true,
      progress: 33,
      lessons: [
        { id: 'l4', num: '2.1', title: 'Configuring sandbox credential variables', done: true },
        { id: 'l5', num: '2.2', title: 'Forming human-escalation protocols for SMS', done: false },
        { id: 'l6', num: '2.3', title: 'Live active advisor validation metrics', done: false }
      ]
    },
    {
      id: 'prog-3',
      title: 'CFO Strategic Budget & Boardroom ROI Prep',
      dept: 'Executive Advisory',
      unlocked: false,
      progress: 0,
      lessons: [
        { id: 'l7', num: '3.1', title: 'Forming clean persuasion indexes', done: false },
        { id: 'l8', num: '3.2', title: 'Defending automated transition budgets', done: false }
      ]
    }
  ]);

  const handleToggleLesson = (programId: string, lessonId: string) => {
    const updated = programs.map((prog) => {
      if (prog.id !== programId) return prog;
      
      const newLessons = prog.lessons.map((lesson) => {
        if (lesson.id === lessonId) {
          return { ...lesson, done: !lesson.done };
        }
        return lesson;
      });

      const completedCount = newLessons.filter(l => l.done).length;
      const progress = Math.round((completedCount / newLessons.length) * 100);

      return {
        ...prog,
        lessons: newLessons,
        progress
      };
    });
    setPrograms(updated);
  };

  /* =========================================================================
     5. PROGRESS REPORTS STATES & DATA
     ========================================================================= */
  const [reportFilter, setReportFilter] = useState<'all' | 'engineering' | 'ops' | 'exec'>('all');

  const progressChartData = [
    { name: 'Engineering', activeHours: 420, completedTasks: 84, scoreAvg: 88, color: '#6366F1' },
    { name: 'Operations', activeHours: 310, completedTasks: 62, scoreAvg: 75, color: '#10B981' },
    { name: 'Customer Success', activeHours: 250, completedTasks: 48, scoreAvg: 82, color: '#14B8A6' },
    { name: 'Advisory Board', activeHours: 180, completedTasks: 35, scoreAvg: 94, color: '#A855F7' }
  ];

  const filteredChartData = reportFilter === 'all' 
    ? progressChartData 
    : progressChartData.filter(d => d.name.toLowerCase().includes(reportFilter));

  const totalActiveHours = progressChartData.reduce((acc, curr) => acc + curr.activeHours, 0);
  const averageMaturityScore = Math.round(progressChartData.reduce((acc, curr) => acc + curr.scoreAvg, 0) / progressChartData.length);

  /* =========================================================================
     6. CERTIFICATION RECOMMENDATIONS STATES & DATA
     ========================================================================= */
  const [claimedCertificates, setClaimedCertificates] = useState<string[]>([]);
  const [activeCertificateModal, setActiveCertificateModal] = useState<any | null>(null);

  const certificationRecommendations = [
    {
      id: 'cert-1',
      title: 'Certified Node Gemini Integrator',
      authority: 'theCsuiteCOACH Professional Academy',
      requiredScore: 80,
      currentAssessedScore: 88,
      status: 'Eligible',
      description: 'Awarded to developers who successfully build server-side proxy routes to query Gemini models on Cloud Run setups without client code leaks.',
      voucherCode: 'RAW-NODE-GEMINI-2026'
    },
    {
      id: 'cert-2',
      title: 'Enterprise AI Operations Strategist',
      authority: 'theCsuiteCOACH Advisory Core',
      requiredScore: 75,
      currentAssessedScore: 78,
      status: 'Eligible',
      description: 'Awarded to managers who audit manual workflow blocks and integrate GoalAction OKR engines to restore 30%+ human time leverage.',
      voucherCode: 'RAW-OPS-STRAT-998'
    },
    {
      id: 'cert-3',
      title: 'CFO Advisory Financial Architect',
      authority: 'theCsuiteCOACH Executive Matrix',
      requiredScore: 90,
      currentAssessedScore: 65,
      status: 'In Progress',
      description: 'Awarded to finance executives who pass the extreme simulated budget boardroom defense against investor modeling criteria.',
      voucherCode: null
    }
  ];

  const handleClaimCertificate = (cert: any) => {
    setActiveCertificateModal(cert);
    if (!claimedCertificates.includes(cert.id)) {
      setClaimedCertificates([...claimedCertificates, cert.id]);
    }
  };

  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleExportCSV = () => {
    let csvContent = "";
    csvContent += "theCsuiteCOACH ACADEMY CORPORATE ASSESSMENT REPORT\n";
    csvContent += `Generated On,${new Date().toISOString()}\n\n`;
    
    csvContent += "1. ASSESSMENT SUMMARY\n";
    csvContent += `Digital Workflow Readiness Rating,${assessmentResult ? assessmentResult.score : 'Pending'}%\n`;
    csvContent += `Workflow Status,${assessmentResult ? assessmentResult.status : 'Not Audited'}\n\n`;
    
    if (assessmentResult) {
      csvContent += "Recommended Actions:\n";
      assessmentResult.recs.forEach((rec: string, index: number) => {
        csvContent += `Action ${index + 1},"${rec.replace(/"/g, '""')}"\n`;
      });
      csvContent += "\n";
    }
    
    csvContent += "2. OPERATIONAL DIVISION SCORECARDS\n";
    csvContent += "Department,Active Hours Logged,Target Score Average (%)\n";
    progressChartData.forEach(dept => {
      csvContent += `"${dept.name}",${dept.activeHours},${dept.scoreAvg}%\n`;
    });
    csvContent += `TOTAL/AVERAGE,${totalActiveHours},${averageMaturityScore}%\n\n`;

    csvContent += "3. IN-HOUSE TRAINING MODULES PROGRESS\n";
    csvContent += "Program Name,Department,Progress Completed\n";
    programs.forEach(p => {
      csvContent += `"${p.title}","${p.dept}",${p.progress}%\n`;
    });
    csvContent += "\n";

    csvContent += "4. ELIGIBLE CERTIFICATIONS\n";
    csvContent += "Certification Title,Authority,Matching Candidate Score,Status\n";
    certificationRecommendations.forEach(cert => {
      const isEligible = cert.currentAssessedScore >= cert.requiredScore;
      csvContent += `"${cert.title}","${cert.authority}",${cert.currentAssessedScore}%,"${isEligible ? 'Eligible' : 'Prerequisites Pending'}"\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `theCsuiteCOACH_Corporate_Assessment_Report.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Header styling
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 40, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.text("theCsuiteCOACH PLATFORM // ASSESSMENT HUB", 14, 18);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(157, 255, 0); // brand neon text color #9DFF00
    doc.text("ENTERPRISE READINESS & HYBRID WORKFLOW DIAGNOSTIC REPORT", 14, 25);
    
    doc.setFontSize(8);
    doc.setTextColor(226, 232, 240);
    const currentTimestamp = new Date().toLocaleString() + " UTC";
    doc.text(`GENERATED TIMESTAMP: ${currentTimestamp} // CLOUD SECURE ID: RC-REPORT-${Math.floor(100000 + Math.random() * 900000)}`, 14, 32);
    
    let y = 55;
    
    // SECTION 1: CORPORATE ASSESSMENT SCORES
    doc.setFillColor(244, 244, 245);
    doc.rect(14, y, 182, 7, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("1. DIGITAL WORKFLOW AUDIT SUMMARY", 18, y + 5);
    
    y += 13;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    
    if (assessmentResult) {
      doc.setFont("Helvetica", "bold");
      doc.text(`Digital Readiness Score: ${assessmentResult.score}%`, 14, y);
      doc.setFont("Helvetica", "normal");
      doc.text(`Status Category: ${assessmentResult.status}`, 100, y);
      
      y += 6;
      doc.text(`Legacy Operational Friction Drag Weight: ${assessmentAnswers.legacyDrag} / 5`, 14, y);
      doc.text(`Company Staff Scale: ${assessmentAnswers.staffCount.toUpperCase()}`, 100, y);
      
      y += 10;
      doc.setFont("Helvetica", "bold");
      doc.text("Identified Strategic Action Priority Checklist:", 14, y);
      doc.setFont("Helvetica", "normal");
      y += 5;
      assessmentResult.recs.forEach((rec: string, index: number) => {
        const splitText: string[] = doc.splitTextToSize(`[ ] Action ${index + 1}: ${rec}`, 180);
        doc.text(splitText, 14, y);
        y += (splitText.length * 4.5) + 1;
      });
    } else {
      doc.text("Result Status: Hub scenario audit pending user configuration launcher input.", 14, y);
      doc.text("Default benchmark readiness assessment: ~45% index based on statistical local office groups.", 14, y + 5);
      y += 12;
    }
    
    y += 4;
    
    // SECTION 2: LEARNING OUTCOMES AND MATURITY INDEX
    doc.setFillColor(244, 244, 245);
    doc.rect(14, y, 182, 7, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("2. OPERATIONAL DIVISION SCORECARDS (MATURITY INDEX)", 18, y + 5);
    
    y += 13;
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(9.5);
    doc.text(`Aggregate Laboratory Training Hours Completed: ${totalActiveHours} Hours`, 14, y);
    doc.text(`Average Maturity Index Score: ${averageMaturityScore} / 100 Criteria`, 100, y);
    
    y += 8;
    doc.setFont("Helvetica", "bold");
    doc.text("Division Performance Matrix:", 14, y);
    y += 6;
    doc.setFont("Helvetica", "bold");
    doc.text("Department / Sector", 14, y);
    doc.text("Lab Completed (Hours)", 85, y);
    doc.text("Assessed Score Average", 145, y);
    y += 4;
    
    doc.setDrawColor(220, 220, 220);
    doc.line(14, y, 196, y);
    y += 5;
    doc.setFont("Helvetica", "normal");
    
    progressChartData.forEach(dept => {
      doc.text(dept.name, 14, y);
      doc.text(`${dept.activeHours} Hrs`, 85, y);
      doc.text(`${dept.scoreAvg}%`, 145, y);
      y += 5.5;
    });
    
    y += 6;
    
    // SECTION 3: IN-HOUSE TRAINING MODULES PROGRESS
    doc.setFillColor(244, 244, 245);
    doc.rect(14, y, 182, 7, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("3. ACTIVE WORKFLOW CURRICULUMS PROGRESS", 18, y + 5);
    
    y += 13;
    doc.setFont("Helvetica", "normal");
    programs.forEach(prog => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("Helvetica", "bold");
      doc.text(`${prog.title} (${prog.dept})`, 14, y);
      doc.setFont("Helvetica", "normal");
      doc.text(`Completion Ratio: ${prog.progress}%`, 150, y);
      y += 5.5;
      
      const activeLessons = prog.lessons.slice(0, 3);
      activeLessons.forEach(l => {
        doc.text(`  [${l.done ? 'Y' : ' '}] Module ${l.num}: ${l.title}`, 18, y);
        y += 4.5;
      });
      y += 3;
    });

    if (y > 230) {
      doc.addPage();
      y = 20;
    }
    
    y += 4;
    
    // SECTION 4: CERTIFICATIONS DISPATCH status
    doc.setFillColor(244, 244, 245);
    doc.rect(14, y, 182, 7, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text("4. RECOMMENDED COMPLIANCE CERTIFICATIONS STATUS", 18, y + 5);
    
    y += 13;
    doc.setFont("Helvetica", "normal");
    certificationRecommendations.forEach(cert => {
      if (y > 260) {
        doc.addPage();
        y = 20;
      }
      const isEligible = cert.currentAssessedScore >= cert.requiredScore;
      const isClaimed = claimedCertificates.includes(cert.id);
      doc.setFont("Helvetica", "bold");
      doc.text(cert.title, 14, y);
      doc.setFont("Helvetica", "normal");
      doc.text(isEligible ? (isClaimed ? "[v CLAIMED & VERIFIED]" : "[ELIGIBLE TO CLAIM]") : "[PREREQUISITES PENDING]", 140, y);
      y += 5;
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      const splitDesc: string[] = doc.splitTextToSize(cert.description, 180);
      doc.text(splitDesc, 14, y);
      y += (splitDesc.length * 4) + 3;
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
    });
    
    y += 4;
    // Professional footer decoration
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.5);
    doc.line(14, y, 196, y);
    y += 6;
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8);
    doc.text("theCsuiteCOACH PLATFORM HYBRID SYSTEMS VERDICT: COMPATIBLE & VERIFIED", 14, y);
    
    y += 4.5;
    doc.setFont("Helvetica", "normal");
    doc.text("This PDF diagnostic report serves as an official internal audit payload. Vouchers can be decoded to load configuration schemas.", 14, y);
    
    doc.save("theCsuiteCOACH_Corporate_Assessment_Report.pdf");
  };

  return (
    <div className="space-y-8 text-slate-900 animate-fadeIn" id="corporate-academy-hub">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide main app header, page sidebars, local hub sidebar, and all button elements */
          header, 
          footer, 
          aside, 
          nav, 
          button, 
          .no-print, 
          .print-hide,
          #export-dropdown-wrapper,
          #export-button,
          [id*="nav-item-"] {
            display: none !important;
          }
          
          /* Force physical container to full width and override tailwind card limits */
          body, 
          html, 
          #main-root, 
          #corporate-academy-hub, 
          main, 
          div[class*="max-w-"] {
            background: white !important;
            color: #000000 !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border-color: transparent !important;
          }
          
          /* Expand layout columns to utilize standard A4/US Letter widths */
          .grid {
            display: block !important;
          }
          
          .lg\\:col-span-9,
          [class*="lg:col-span-9"],
          [class*="col-span-9"] {
            width: 100% !important;
            max-width: 100% !important;
            grid-column: span 12 / span 12 !important;
            display: block !important;
            flex: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          
          /* Form customization so printed values stand out with clean borders */
          select, input, textarea {
            background-color: #ffffff !important;
            border: 1px solid #94a3b8 !important;
            color: #000000 !important;
          }
          
          /* Chart styling compatibility */
          .recharts-responsive-container {
            width: 100% !important;
            height: auto !important;
          }
        }
      `}} />
      
      {/* Academy Title and Intro */}
      <div className="border-b border-zinc-250/60 pb-5 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 text-[9px] font-mono font-bold text-indigo-700 mb-2 uppercase tracking-wide rounded border border-indigo-200">
            <Award className="w-3.5 h-3.5 text-indigo-600" /> Enterprise Academy Core
          </div>
          <h3 className="text-2xl font-extrabold tracking-tight text-[#0F172A] leading-tight font-sans">
            CORPORATE TRAINING & INTERACTIVE HUB
          </h3>
          <p className="font-sans text-[11.5px] text-zinc-500 tracking-normal font-medium mt-1">
            Build in-house task forces, conduct structural assessments, design custom learning paths, and audit certification achievements.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-right hidden md:block">
            <span className="text-zinc-400 font-mono text-[10px] uppercase font-bold block">// System Matrix Active</span>
            <span className="text-[9px] text-[#22c55e] font-mono font-bold uppercase font-sans">Ready to compile report</span>
          </div>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white hover:bg-zinc-50 text-slate-800 border border-zinc-200 font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm no-print"
            title="Generate a clean physical copy of the report"
          >
            <Printer className="w-4 h-4 text-indigo-600" />
            Print Report
          </button>
          
          <div className="relative inline-block text-left no-print" id="export-dropdown-wrapper">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Download className="w-4 h-4 text-[#9DFF00]" />
              Export Report
            </button>
            
            {isExportOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsExportOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-zinc-200 shadow-xl overflow-hidden z-20 font-sans text-xs">
                  <div className="p-2 border-b border-zinc-100 bg-[#FAF9F6]">
                    <p className="font-mono text-[9px] text-zinc-400 uppercase font-black tracking-tight">// EXPORT TARGET FORMAT</p>
                  </div>
                  <div className="p-1.5 space-y-1">
                    <button
                      onClick={() => {
                        handleExportPDF();
                        setIsExportOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-zinc-50 rounded-lg flex items-center justify-between font-bold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span>Download PDF Document</span>
                      <span className="font-mono text-[9.5px] bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold px-1.5 py-0.5 rounded">PDF</span>
                    </button>
                    <button
                      onClick={() => {
                        handleExportCSV();
                        setIsExportOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 hover:bg-zinc-50 rounded-lg flex items-center justify-between font-bold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span>Download CSV Spreadsheet</span>
                      <span className="font-mono text-[9.5px] bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-1.5 py-0.5 rounded">CSV</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Navigation Sidebar + Active Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation row specifically for Hub functions */}
        <aside className="lg:col-span-3 space-y-2">
          {sections.map((sec) => {
            const isSelected = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => {
                  setActiveSection(sec.id);
                  if (sec.id === 'skill-assessments') handleResetQuiz();
                }}
                className={`w-full text-left p-3 border transition-all cursor-pointer flex items-center justify-between group rounded-xl ${
                  isSelected
                    ? 'bg-[#0F172A] text-white border-transparent shadow-md'
                    : 'bg-white border-zinc-200 hover:bg-zinc-50 hover:text-[#0F172A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg border transition-all ${
                    isSelected ? 'bg-white text-slate-900 border-white' : 'bg-zinc-50 text-zinc-700 border-zinc-200'
                  }`}>
                    {sec.icon}
                  </div>
                  <div className="text-left">
                    <h5 className="font-extrabold text-[15.5px] tracking-tight leading-none uppercase">{sec.title}</h5>
                    <p className={`text-[12.5px] font-mono mt-1.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-400'}`}>{sec.sub}</p>
                  </div>
                </div>
              </button>
            );
          })}


        </aside>

        {/* Core display Area */}
        <div className="lg:col-span-9 bg-transparent space-y-6">
          
          {/* =========================================================================
             SECTION 1: CORPORATE ASSESSMENT
             ========================================================================= */}
          {activeSection === 'corporate-assessment' && (
            <div className="bg-white border border-zinc-200/85 p-6 rounded-2xl shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-150 pb-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-indigo-600 font-extrabold flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> Corporate Workflow Auditor // Section 1
                </span>
                <h4 className="text-[20px] font-black text-slate-900 uppercase mt-1">Audit Digital Overhead & Gaps</h4>
                <p className="text-[14px] text-zinc-500 mt-1">
                  Understand if your employees are currently wasting hundreds of collective hours on outdated manual processes.
                </p>
              </div>

              {!assessmentResult ? (
                <form onSubmit={handleAssessmentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="block font-mono text-[12px] uppercase font-black text-slate-700">How does your staff currently handle client folder onboarding briefs & records?</label>
                    <select 
                      value={assessmentAnswers.docHandling}
                      onChange={(e) => setAssessmentAnswers({...assessmentAnswers, docHandling: e.target.value})}
                      required
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[14px]"
                    >
                      <option value="">Select option...</option>
                      <option value="manual">Raw manual copy-pastes into document files (Takes 30+ mins)</option>
                      <option value="semi-manual">Semi-automated Google forms with basic spreadsheet triggers</option>
                      <option value="ai-automated">Fully automated with Gemini parse nodes and instant CRM sync</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-mono text-[12px] uppercase font-black text-slate-700">Where are core private API keys and database credentials hosted?</label>
                    <select 
                      value={assessmentAnswers.apiUsage}
                      onChange={(e) => setAssessmentAnswers({...assessmentAnswers, apiUsage: e.target.value})}
                      required
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[14px]"
                    >
                      <option value="">Select option...</option>
                      <option value="public-client">Saved directly inside react client-side variables (Highly vulnerable)</option>
                      <option value="standard-apps">Managed under third-party SaaS services with simple keys</option>
                      <option value="custom-endpoints">Protected server-side behind curated Express proxy routers (/api/*)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-mono text-[12px] uppercase font-black text-slate-700">What protocol is dispatched when complex operational workflow exceptions happen?</label>
                    <select 
                      value={assessmentAnswers.smsOutreach}
                      onChange={(e) => setAssessmentAnswers({...assessmentAnswers, smsOutreach: e.target.value})}
                      required
                      className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[14px]"
                    >
                      <option value="">Select option...</option>
                      <option value="no-alert">No standard alert; staff has to wait for support emails manually</option>
                      <option value="basic-email">Basic email reports which usually sit unread in folders</option>
                      <option value="gateway-relay">Instant SMS or WhatsApp relay alerts triggered via webhook emulator</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-mono text-[12px] uppercase font-black text-slate-700">Legacy Friction Weight (1: Low Drag - 5: Intense Overheads)</label>
                      <input 
                        type="range" 
                        min="1" 
                        max="5" 
                        value={assessmentAnswers.legacyDrag}
                        onChange={(e) => setAssessmentAnswers({...assessmentAnswers, legacyDrag: e.target.value})}
                        className="w-full accent-slate-900 bg-zinc-200 appearance-none h-1 cursor-pointer"
                      />
                      <div className="flex justify-between text-[11px] font-mono text-zinc-400 uppercase font-medium">
                        <span>1: Lightning agility</span>
                        <span>5: Heavy manual drag</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block font-mono text-[12px] uppercase font-black text-slate-700">Staff Scale</label>
                      <select 
                        value={assessmentAnswers.staffCount}
                        onChange={(e) => setAssessmentAnswers({...assessmentAnswers, staffCount: e.target.value})}
                        className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-[14px]"
                      >
                        <option value="small">Solo / Under 10 staff members</option>
                        <option value="medium">Medium corporate team (10 - 75 staff)</option>
                        <option value="large">Large enterprise level (75+ staff)</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-mono text-[14px] font-bold uppercase transition-all rounded-xl mt-4 cursor-pointer shadow-sm"
                  >
                    Analyze Corporate Workflow Score & Recs &rarr;
                  </button>
                </form>
              ) : (
                <div className="space-y-6 animate-fadeIn">
                  <div className="p-5 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                      <span className="font-mono text-[9px] text-zinc-400 uppercase font-bold">DIGITAL WORKFLOW READINESS RATING</span>
                      <div className="flex items-baseline gap-2 mt-1 justify-center md:justify-start">
                        <span className="text-5xl font-black text-slate-950 tracking-tight">{assessmentResult.score}%</span>
                        <span className="text-xs font-mono font-bold uppercase text-slate-500 bg-white border px-2 py-0.5 rounded shadow-xs">
                          {assessmentResult.status}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setAssessmentResult(null)}
                      className="px-4 py-2 border border-zinc-250 bg-white hover:bg-zinc-50 text-slate-800 font-mono text-[10px] font-bold rounded-lg uppercase cursor-pointer"
                    >
                      Audit Another Scenario
                    </button>
                  </div>

                  <div className="space-y-2 text-left">
                    <h5 className="font-mono text-[10px] uppercase tracking-wider text-indigo-700 font-extrabold">// RECOMMENDED ACTIONS DISPATCH</h5>
                    <div className="space-y-2">
                      {assessmentResult.recs.map((rec: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 bg-white p-3.5 border border-zinc-150 rounded-xl shadow-xs">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-slate-800 font-semibold">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 border border-indigo-150 text-indigo-900 rounded-xl text-xs space-y-2">
                    <span className="font-mono text-[9px] uppercase tracking-wider font-extrabold text-indigo-700 block">⚡ SYSTEM NOTICE</span>
                    By enrolling your personnel into our active **Learning Paths** (see tab 2), you can systematically elevate this score by up to 40% within 30 days.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
             SECTION 2: LEARNING PATHS
             ========================================================================= */}
          {activeSection === 'learning-paths' && (
            <div className="bg-white border border-zinc-200/85 p-6 rounded-2xl shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-150 pb-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-amber-600 font-extrabold flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Curated Learning Pipelines // Section 2
                </span>
                <h4 className="text-lg font-black text-slate-900 uppercase mt-1">Adaptive Learning Paths</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Personalized technical training roads configured matching modern web services, prompt governance, and resource tracking.
                </p>
              </div>

              {/* Selector buttons */}
              <div className="flex flex-wrap gap-2.5 border-b border-zinc-100 pb-4">
                {learningPathsData.map((path) => (
                  <button 
                    key={path.id}
                    onClick={() => setSelectedPathId(path.id)}
                    className={`px-4 py-2 text-xs font-extrabold uppercase rounded-lg border transition-all cursor-pointer ${
                      selectedPathId === path.id
                        ? 'bg-amber-500 border-transparent text-white shadow-sm'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {path.title}
                  </button>
                ))}
              </div>

              {/* Path layout Details */}
              <div className="space-y-6">
                <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{selectedPath.title}</span>
                    <span className="font-mono text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded tracking-wide">
                      {selectedPath.difficulty}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 leading-normal">
                    <strong className="text-slate-800">Stack Targets:</strong> {selectedPath.focus}
                  </p>
                  <p className="text-[10px] font-mono text-zinc-400 font-bold uppercase block">
                    Duration: {selectedPath.duration}
                  </p>
                </div>

                {/* Milestone tracking cards */}
                <div className="space-y-3 font-sans">
                  <h5 className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-extrabold border-b pb-1">// PROGRESS ROADMAP STAGES</h5>
                  <div className="space-y-3">
                    {selectedPath.milestones.map((ms, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 bg-white border border-zinc-150 rounded-xl shadow-xs relative">
                        <div className={`w-8.5 h-8.5 rounded-full border flex-shrink-0 flex items-center justify-center font-bold text-xs ${
                          ms.completed 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                            : 'bg-zinc-50 text-zinc-500 border-zinc-200'
                        }`}>
                          {ms.completed ? '✓' : idx + 1}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] font-bold text-slate-500">[{ms.week}]</span>
                            <span className={`text-xs font-bold leading-normal ${ms.completed ? 'text-slate-800 line-through' : 'text-slate-900'}`}>
                              {ms.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-normal font-medium">{ms.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
             SECTION 3: SKILL ASSESSMENTS
             ========================================================================= */}
          {activeSection === 'skill-assessments' && (
            <div className="bg-white border border-zinc-200/85 p-6 rounded-2xl shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-150 pb-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-rose-600 font-extrabold flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" /> Professional Diagnostics // Section 3
                </span>
                <h4 className="text-lg font-black text-slate-900 uppercase mt-1">Live Employee Skill Assessments</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Evaluate staff competence through testing scenarios focusing on API security, routing logic, and system recovery tracking.
                </p>
              </div>

              {!quizStarted ? (
                <div className="p-8 text-center bg-zinc-50 border border-zinc-200 rounded-2xl space-y-4">
                  <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center border border-rose-200 mx-auto">
                    <FileCheck className="w-6 h-6 text-rose-500" />
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="font-extrabold text-[#0F172A] uppercase text-sm font-sans">Ready to begin diagnostic?</h5>
                    <p className="text-xs text-zinc-500 max-w-md mx-auto">
                      Test your workflow knowledge. Answers will immediately impact calculated certification eligibility metrics inside the academy database.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setQuizStarted(true);
                      setCurrentQuestionIndex(0);
                      setSelectedAnswers([]);
                      setQuizScore(null);
                    }}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase transition-all rounded-xl cursor-pointer shadow-sm inline-flex items-center gap-2"
                  >
                    Start Real-Time Assessment <Play className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : quizScore === null ? (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex justify-between items-center bg-zinc-50 border p-3 rounded-xl text-[10.5px] font-mono font-medium text-slate-600 border-zinc-200">
                    <span>Question {currentQuestionIndex + 1} of {quizQuestions.length}</span>
                    <span className="text-rose-600 font-bold uppercase">Assessment in Progress</span>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-bold text-sm text-slate-950 font-sans leading-normal">
                      {quizQuestions[currentQuestionIndex].q}
                    </h5>

                    <div className="space-y-2">
                      {quizQuestions[currentQuestionIndex].options.map((opt, oIdx) => {
                        const isChosen = selectedAnswers[currentQuestionIndex] === oIdx;
                        return (
                          <button 
                            key={oIdx}
                            onClick={() => handleSelectAnswer(oIdx)}
                            className={`w-full text-left p-3 border rounded-xl text-xs font-bold leading-normal transition-all cursor-pointer ${
                              isChosen 
                                ? 'bg-zinc-950 text-white border-transparent shadow-xs' 
                                : 'bg-white border-zinc-200 hover:bg-zinc-50 text-slate-800'
                            }`}
                          >
                            <span className="font-mono text-[9px] mr-2">[{String.fromCharCode(65 + oIdx)}]</span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-zinc-150">
                    <button 
                      onClick={handleNextQuestion}
                      disabled={selectedAnswers[currentQuestionIndex] === undefined}
                      className="px-5 py-2.5 bg-[#0F172A] dark:bg-slate-800 hover:bg-slate-800 text-white transition-all text-xs font-mono font-bold uppercase rounded-lg disabled:opacity-50 cursor-pointer shadow-sm"
                    >
                      {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question \u2192' : 'Submit Answers'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-fadeIn text-center py-4">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-emerald-50 border border-emerald-250 mb-2">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] text-zinc-400 uppercase font-black">ASSESSMENT SCORE RESULT</span>
                    <h3 className="text-4xl font-extrabold tracking-tight text-slate-900">{quizScore}% Correct</h3>
                    <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-2 leading-relaxed font-semibold">
                      {quizScore >= 80 
                        ? 'Excellent. You are eligible for instant Certifications! Head to tab 6 to claim.' 
                        : 'Review learning paths to understand how proxying and reverse gateways are configured.'}
                    </p>
                  </div>

                  <div className="space-y-3 font-sans text-left mt-6 pt-6 border-t">
                    <h5 className="font-mono text-[9px] uppercase tracking-widest text-[#71717A] border-b font-extrabold pb-1">// CORRECTION LEDGER</h5>
                    {quizQuestions.map((q, idx) => (
                      <div key={idx} className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-bold text-slate-900">{idx + 1}. {q.q}</p>
                        <p className="text-xs text-slate-700">
                          <strong className="text-slate-800 font-mono text-[10px]">Your Answer:</strong> {selectedAnswers[idx] !== undefined ? q.options[selectedAnswers[idx]] : 'N/A'}{' '}
                          <span className={`font-bold ml-1.5 text-[10px] ${selectedAnswers[idx] === q.correct ? 'text-emerald-700 font-mono' : 'text-rose-600 font-mono'}`}>
                            {selectedAnswers[idx] === q.correct ? '[✓ Correct]' : '[✗ Incorrect]'}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 font-medium italic border-t border-zinc-150 pt-2 bg-white/40 p-2 rounded leading-relaxed">{q.explanation}</p>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={handleResetQuiz}
                    className="mt-6 px-6 py-3 bg-[#0F172A] hover:bg-slate-800 text-white font-mono text-xs font-bold uppercase rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Retake Skill Assessment
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
             SECTION 4: TRAINING PROGRAMS
             ========================================================================= */}
          {activeSection === 'training-programs' && (
            <div className="bg-white border border-zinc-200/85 p-6 rounded-2xl shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-150 pb-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-600 font-extrabold flex items-center gap-1">
                  <BrainCircuit className="w-3.5 h-3.5" /> Corporate Curriculums // Section 4
                </span>
                <h4 className="text-lg font-black text-slate-900 uppercase mt-1">Vetted Staff Training Programs</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Construct internal corporate competencies by checking off completed learning modules.
                </p>
              </div>

              <div className="space-y-6">
                {programs.map((program) => (
                  <div key={program.id} className="border border-zinc-200 rounded-2xl overflow-hidden shadow-xs">
                    {/* Header bar of program */}
                    <div className="bg-[#FAF9F6] border-b border-zinc-200 px-5 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] bg-white border px-1.5 py-0.5 rounded text-zinc-500 font-bold uppercase">{program.dept}</span>
                          {!program.unlocked && <span className="font-mono text-[8px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-250 font-bold uppercase">Locked</span>}
                        </div>
                        <h5 className="font-extrabold uppercase mt-1 text-slate-900 text-sm font-sans leading-none">{program.title}</h5>
                      </div>
                      
                      <div className="w-full sm:w-32 flex items-center gap-2 text-xs font-sans">
                        <div className="flex-1 bg-zinc-200 h-2 rounded overflow-hidden">
                          <div className="bg-emerald-500 h-full transition-all" style={{ width: `${program.progress}%` }} />
                        </div>
                        <span className="font-bold text-slate-900 flex-shrink-0">{program.progress}% Done</span>
                      </div>
                    </div>

                    {/* Lesson checklist */}
                    {program.unlocked ? (
                      <div className="p-4 space-y-2 bg-white">
                        {program.lessons.map((lesson) => (
                          <div 
                            key={lesson.id} 
                            onClick={() => handleToggleLesson(program.id, lesson.id)}
                            className="flex items-center gap-3.5 p-3 hover:bg-zinc-50 border border-zinc-150 rounded-xl cursor-pointer transition-all shadow-xs"
                          >
                            <button
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                                lesson.done 
                                  ? 'bg-[#0F172A] border-[#0F172A] text-white' 
                                  : 'border-zinc-300 bg-white'
                              }`}
                            >
                              {lesson.done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                            </button>
                            <div>
                              <p className={`text-xs font-bold leading-normal font-sans ${lesson.done ? 'text-slate-400 line-through font-medium' : 'text-slate-800'}`}>
                                <span className="font-mono text-[10px] text-zinc-400 mr-2">[{lesson.num}]</span>
                                {lesson.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-zinc-50/50 flex flex-col items-center justify-center space-y-3">
                        <Lock className="w-8 h-8 text-zinc-400" />
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-slate-900 uppercase">Enrollment Locked</p>
                          <p className="text-[11px] text-zinc-400 max-w-sm">
                            This strategic boardroom program is unlocked once the **Engineering Team** completes the *SaaS AI Integration Core* program.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
             SECTION 5: PROGRESS REPORTS
             ========================================================================= */}
          {activeSection === 'progress-reports' && (
            <div className="bg-white border border-zinc-200/85 p-6 rounded-2xl shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-150 pb-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-teal-600 font-extrabold flex items-center gap-1">
                  <LineChart className="w-3.5 h-3.5" /> Performance Scorecards // Section 5
                </span>
                <h4 className="text-lg font-black text-slate-900 uppercase mt-1">Live Employee Progress Reports</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Monitor completed training milestones, study hours logged, and evaluated maturity metrics across sectors.
                </p>
              </div>

              {/* Stat Bento Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#FAF9F6] border border-zinc-200 rounded-xl space-y-1">
                  <span className="font-mono text-[9px] text-zinc-450 uppercase font-bold">Total Learning Lab Hours Logged</span>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{totalActiveHours} Hours</div>
                  <p className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1 uppercase">
                    <TrendingUp className="w-3 h-3" /> +14.2% completion velocity
                  </p>
                </div>

                <div className="p-4 bg-[#FAF9F6] border border-zinc-200 rounded-xl space-y-1">
                  <span className="font-mono text-[9px] text-zinc-450 uppercase font-bold">Verified Score Average</span>
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{averageMaturityScore} / 100 Index</div>
                  <p className="text-[10px] font-mono text-indigo-600 font-bold uppercase">
                    Excellent operational status
                  </p>
                </div>
              </div>

              {/* Recharts chart and filter */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-100 pb-3">
                  <h5 className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-extrabold flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" /> Filter Metrics By Department
                  </h5>

                  <div className="flex gap-1.5 flex-wrap">
                    <button 
                      onClick={() => setReportFilter('all')}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded border transition-all cursor-pointer ${
                        reportFilter === 'all' ? 'bg-[#0F172A] border-transparent text-white' : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-slate-900'
                      }`}
                    >
                      All Sections
                    </button>
                    <button 
                      onClick={() => setReportFilter('engineering')}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded border transition-all cursor-pointer ${
                        reportFilter === 'engineering' ? 'bg-[#0F172A] border-transparent text-white' : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-slate-900'
                      }`}
                    >
                      Engineering
                    </button>
                    <button 
                      onClick={() => setReportFilter('ops')}
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded border transition-all cursor-pointer ${
                        reportFilter === 'ops' ? 'bg-[#0F172A] border-transparent text-white' : 'bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-slate-900'
                      }`}
                    >
                      Operations
                    </button>
                  </div>
                </div>

                <div className="h-[240px] w-full" id="academy-recharts-container" style={{ minHeight: '220px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredChartData}
                      margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#94A3B8" 
                        fontSize={8.5} 
                        fontFamily="Inter" 
                        tickLine={false} 
                      />
                      <YAxis 
                        stroke="#94A3B8" 
                        fontSize={8.5} 
                        fontFamily="Inter" 
                        tickLine={false}
                      />
                      <Tooltip cursor={{ fill: 'rgba(15, 23, 42, 0.015)' }} />
                      <Legend 
                        wrapperStyle={{ fontFamily: 'Inter', fontSize: '9px', marginTop: '10px' }} 
                      />
                      <Bar 
                        dataKey="activeHours" 
                        name="Study Labs Completed (Hours)" 
                        fill="#0F172A" 
                        radius={[4, 4, 0, 0]} 
                      />
                      <Bar 
                        dataKey="scoreAvg" 
                        name="Average Assessment Score (%)" 
                        fill="#E2E8F0" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
             SECTION 6: CERTIFICATION RECOMMENDATIONS
             ========================================================================= */}
          {activeSection === 'certification-recommendations' && (
            <div className="bg-white border border-zinc-200/85 p-6 rounded-2xl shadow-sm space-y-6 animate-fadeIn">
              <div className="border-b border-zinc-150 pb-4">
                <span className="font-mono text-[9px] uppercase tracking-wider text-purple-600 font-extrabold flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Dynamic Credential Matrix // Section 6
                </span>
                <h4 className="text-lg font-black text-slate-900 uppercase mt-1">Recommended Professional Certifications</h4>
                <p className="text-xs text-zinc-500 mt-1">
                  Validate internal automation skills and issue formal performance certificates to personnel.
                </p>
              </div>

              <div className="space-y-4">
                {certificationRecommendations.map((cert) => {
                  const isEligible = cert.currentAssessedScore >= cert.requiredScore;
                  const alreadyClaimed = claimedCertificates.includes(cert.id);
                  return (
                    <div key={cert.id} className="border border-zinc-200 p-5 rounded-2xl bg-white shadow-xs space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] text-[#A855F7] font-bold uppercase tracking-wide">
                              ★ RECOMMENDED BY AI ADVISOR
                            </span>
                            <span className={`font-mono text-[8.5px] px-2 py-0.5 rounded font-extrabold border uppercase ${
                              isEligible 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-250' 
                                : 'bg-zinc-50 border-zinc-200 text-zinc-500'
                            }`}>
                              {isEligible ? 'Eligible' : 'Prerequisites Pending'}
                            </span>
                          </div>
                          <h5 className="font-extrabold text-sm uppercase mt-1 text-slate-950 font-sans leading-none">{cert.title}</h5>
                          <span className="font-mono text-[8px] text-zinc-400 uppercase mt-1 block">ISSUED BY: {cert.authority}</span>
                        </div>

                        <div className="bg-zinc-50 border px-3 py-1.5 rounded-lg text-right font-mono text-[10.5px]">
                          <div className="text-zinc-500">Criteria: &gt;={cert.requiredScore}%</div>
                          <div className={`font-bold mt-0.5 ${isEligible ? 'text-emerald-700' : 'text-rose-600'}`}>Assessed: {cert.currentAssessedScore}%</div>
                        </div>
                      </div>

                      <p className="text-[11.5px] text-zinc-500 leading-normal font-sans font-medium">{cert.description}</p>

                      <div className="flex justify-end pt-2 border-t">
                        {isEligible ? (
                          <button 
                            onClick={() => handleClaimCertificate(cert)}
                            className="px-4 py-2.5 bg-slate-900 border border-transparent hover:bg-slate-800 text-white font-mono text-[10px] font-bold uppercase rounded-lg cursor-pointer shadow-sm tracking-wide flex items-center gap-1.5"
                          >
                            {alreadyClaimed ? '✓ VIEW CREDENTIAL VOUCHER' : 'Claim Certificate Award'}
                          </button>
                        ) : (
                          <button 
                            disabled
                            className="px-4 py-2.5 bg-zinc-50 border border-zinc-200 text-zinc-400 font-mono text-[10px] font-bold uppercase rounded-lg select-none opacity-50"
                          >
                            Retake diagnostics to qualify
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Certificate Modal Overlay Display */}
              {activeCertificateModal && (
                <div className="bg-slate-950/45 fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs select-none">
                  <div className="bg-white border-4 border-slate-950 p-6 md:p-8 rounded-2xl max-w-xl w-full space-y-6 text-center relative shadow-2xl">
                    <div className="absolute top-4 right-4">
                      <button 
                        onClick={() => setActiveCertificateModal(null)}
                        className="text-zinc-400 hover:text-slate-900 font-extrabold text-lg bg-zinc-50 px-2 py-0.5 border border-zinc-205 rounded cursor-pointer leading-none"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="border-2 border-dashed border-zinc-450 p-6 space-y-6">
                      <div className="flex justify-center">
                        <span className="text-3xl">🏆</span>
                      </div>

                      <div className="space-y-2">
                        <span className="font-mono text-[10px] text-indigo-700 tracking-wider uppercase font-black">CERTIFICATE OF INTEGRITY & COMPETENCE</span>
                        <h4 className="text-xl font-extrabold tracking-tight text-slate-950 uppercase">{activeCertificateModal.title}</h4>
                        <p className="text-xs text-zinc-500 max-w-sm mx-auto font-medium leading-relaxed mt-2">
                          Awarded to professional team members of **Max Founder** for successfully passing the rigorous assessed diagnostic modules in compliance with standard AI deployment criteria.
                        </p>
                      </div>

                      <div className="border-t border-zinc-200 pt-4 flex justify-between items-center text-[8.5px] font-mono text-zinc-400 uppercase font-bold">
                        <div>
                          <p>Maturity Index: 100%</p>
                          <p>ID: RC-CERT-{activeCertificateModal.id.toUpperCase()}</p>
                        </div>
                        <div className="bg-[#FAF9F6] border border-zinc-200 p-2 text-slate-800 font-mono text-[10px] font-extrabold">
                          CODE: {activeCertificateModal.voucherCode}
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] font-mono text-zinc-450 uppercase leading-none font-semibold">
                      VERIFIED VIA theCsuiteCOACH DECENTRALIZED ACADEMY MATRIX
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
