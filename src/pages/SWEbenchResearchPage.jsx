import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from "recharts";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Tag color mapping
const tagColors = {
  'Code': 'bg-blue-100 text-blue-800',
  'RL': 'bg-green-100 text-green-800',
  'Multimodality': 'bg-purple-100 text-purple-800',
  'Benchmark': 'bg-orange-100 text-orange-800',
  'CUA': 'bg-teal-100 text-teal-800',
};

// Helper component to render circular tags
function Tag({ tag }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-800'}`}>
      {tag}
    </span>
  );
}

export default function SWEbenchResearchPage() {

  const baseEval = [
    { model: "gpt-5-2025-08-07", split: "dev", pass_at_1: 0.2680 },
    { model: "claude-sonnet-4.5", split: "dev", pass_at_1: 0.2600 },
    { model: "gpt5-high-reasoning", split: "dev", pass_at_1: 0.2270 },
    { model: "claude-opus-4.1", split: "dev", pass_at_1: 0.2250 },
    { model: "xai/grok-code-fast-1", split: "dev", pass_at_1: 0.1350 },
    { model: "gemini/gemini-2.5-pro", split: "dev", pass_at_1: 0.1290 },
    { model: "gpt-4o", split: "dev", pass_at_1: 0.0530 },
    { model: "qwen3-coder", split: "dev", pass_at_1: 0.0250 },
    { model: "qwen3-thinking-2507", split: "dev", pass_at_1: 0.0100 }
  ];


  // 1) Public Issue Type → Count (total: 500)
  const publicIssueTypeCounts = {
    "bug-report": 246,
    "feature-request": 209,
    "chore": 21,
    "performance-issue": 13,
    "question": 10,
    "documentation": 1,
  };

  // 2) Public Programming Language → Count (total: 500)
  const publicLanguageCounts = {
    "Python": 150,
    "Go": 100,
    "Java": 100,
    "TypeScript": 53,
    "JavaScript": 47,
    "C++": 25,
    "Rust": 25,
  };

  // 3) Public Repository Type → Count (total: 500)
  const publicRepoTypeCounts = {
    "devtools": 99,
    "infra-devops": 83,
    "ai-ml": 68,
    "webdev": 61,
    "applications": 45,
    "sci-comp": 42,
    "data-eng": 41,
    "security": 23,
    "graphics-media": 19,
    "blockchain": 14,
    "autonomy": 5,
  };


    // 1) Commercial Issue Type → Count (total: 3,891)
  const commercialIssueTypeCounts = {
    "bug-report": 2030,
    "feature-request": 1482,
    "performance-issue": 132,
    "chore": 126,
    "question": 100,
    "documentation": 21,
  };

  // 2) Commercial Programming Language → Count (total: 3,891)
  const commercialLanguageCounts = {
    "Python": 1798,
    "Go": 599,
    "Java": 436,
    "TypeScript": 311,
    "C++": 288,
    "Rust": 206,
    "C#": 132,
    "Ruby": 62,
    "JavaScript": 60,
  };

  // 3) Commercial Repository Type → Count (total: 3,891)
  const commercialRepoTypeCounts = {
    "devtools": 821,
    "sci-comp": 584,
    "ai-ml": 584,
    "infra-devops": 557,
    "webdev": 311,
    "applications": 300,
    "data-eng": 241,
    "security": 167,
    "graphics-media": 160,
    "blockchain": 105,
    "autonomy": 66,
  };




  /*


  gpt-5-2025-08-07	26.80%
claude-sonnet-4.5	26.00%
gpt5-high-reasoning	22.70%
claude-opus-4.1	22.50%
xai/grok-code-fast-1	13.50%
gemini/gemini-2.5-pro	12.90%
gpt-4o	5.30%
qwen3-coder	2.50%
qwen3-thinking-2507	1.00%
  */

  const issueDist = [
    { name: "bug-report", "PR count": 246 },
    { name: "feature-request", "PR count": 209 },
    { name: "chore", "PR count": 21 },
    { name: "performance-issue", "PR count": 13 },
    { name: "question", "PR count": 10 },
    { name: "documentation", "PR count": 1 }
  ];

  const langDist = [
    { name: "Python", "PR count": 150 },
    { name: "Go", "PR count": 100 },
    { name: "Java", "PR count": 100 },
    { name: "TypeScript", "PR count": 53 },
    { name: "JavaScript", "PR count": 47 },
    { name: "C++", "PR count": 25 },
    { name: "Rust", "PR count": 25 },
  ];

  // Commercial dataset data
  const commercialEval = [
    { model: "claude-sonnet-4.5", split: "dev", pass_at_1: 0.2008 },
    { model: "gpt-5-2025-08-07", split: "dev", pass_at_1: 0.1690 },
    { model: "gpt5-high-reasoning", split: "dev", pass_at_1: 0.1670 },
    { model: "claude-opus-4.1", split: "dev", pass_at_1: 0.1570 },
    { model: "gemini/gemini-2.5-pro", split: "dev", pass_at_1: 0.0798 },
    { model: "gpt-4o", split: "dev", pass_at_1: 0.0375 },
    { model: "qwen3-coder", split: "dev", pass_at_1: 0.0183 }
  ];

  /*

claude-sonnet-4.5	20.08%
gpt5-high-reasoning	16.70%
claude-opus-4.1	15.70%
gpt-5-2025-08-07	16.90%
gemini/gemini-2.5-pro	7.98%
gpt-4o	3.75%
qwen3-coder	1.83%

  */

  const commercialIssueDist = [
    { name: "bug-report", "PR count": 450 },
    { name: "feature-request", "PR count": 380 },
    { name: "chore", "PR count": 95 },
    { name: "performance-issue", "PR count": 75 },
    { name: "question", "PR count": 45 },
    { name: "documentation", "PR count": 25 },
    { name: "security-issue", "PR count": 30 },
  ];

  const commercialLangDist = [
    { name: "Python", "PR count": 320 },
    { name: "Java", "PR count": 280 },
    { name: "TypeScript", "PR count": 250 },
    { name: "Go", "PR count": 180 },
    { name: "JavaScript", "PR count": 120 },
    { name: "C++", "PR count": 80 },
    { name: "Rust", "PR count": 60 },
    { name: "C#", "PR count": 50 },
    { name: "Ruby", "PR count": 40 },
  ];

  const COLORS = ["#2563eb", "#1e40af", "#64748b", "#0ea5e9"]; // blues + gray

  // Color mapping for each model
  const modelColors = {
    "gpt-5-2025-08-07": "#2563eb",
    "claude-sonnet-4.5": "#1e40af",
    "gpt5-high-reasoning": "#64748b",
    "claude-opus-4.1": "#0ea5e9",
    "xai/grok-code-fast-1": "#8b5cf6",
    "gemini/gemini-2.5-pro": "#ec4899",
    "gpt-4o": "#10b981",
    "qwen3-coder": "#f59e0b",
    "qwen3-thinking-2507": "#ef4444",
  };

  const getModelColor = (modelName) => {
    return modelColors[modelName] || "#2563eb";
  };

  // --- State ---------------------------------------------------------------
  const [activeModel, setActiveModel] = useState(null);
  const [onlyOpenSource, setOnlyOpenSource] = useState(false);
  const [query, setQuery] = useState("");
  const [activeModelCommercial, setActiveModelCommercial] = useState(null);
  
  // Trajectory viewer state
  const [trajectoryData, setTrajectoryData] = useState(null);
  const [trajectoryLoading, setTrajectoryLoading] = useState(true);
  const [trajectoryError, setTrajectoryError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("Python");
  const [selectedDistribution, setSelectedDistribution] = useState("Public");

  const filteredEval = useMemo(() => {
    let rows = baseEval;
    if (onlyOpenSource) rows = rows.filter((r) => ["Mistral"].includes(r.model));
    if (query) rows = rows.filter((r) => r.model.toLowerCase().includes(query.toLowerCase()));
    return rows;
  }, [baseEval, onlyOpenSource, query]);

  const selectedRow = activeModel ? filteredEval.find((r) => r.model === activeModel) : null;
  const selectedRowCommercial = activeModelCommercial ? commercialEval.find((r) => r.model === activeModelCommercial) : null;

  const fmtPct = (v) => (typeof v === "number" ? `${(v * 100).toFixed(2)}%` : "—");

  // Load trajectory data based on selected language
  useEffect(() => {
    const getTrajectoryFileName = (language) => {
      // GitHub Pages: use the explicit base path
      const basePath = '/research-page-new/';
      // Localhost: use root path
      // const basePath = '/';
      
      switch (language) {
        case 'Java':
          return `${basePath}trajectory-data-java.json`;
        case 'JavaScript':
          return `${basePath}trajectory-data-javascript.json`;
        case 'Python':
        default:
          return `${basePath}trajectory-data.json`;
      }
    };

    const fileName = getTrajectoryFileName(selectedLanguage);
    
    fetch(fileName)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load trajectory data for ${selectedLanguage}`);
        }
        return response.json();
      })
      .then(data => {
        setTrajectoryData(data);
        setTrajectoryLoading(false);
        setTrajectoryError(null);
        setCurrentStep(0); // Reset to first step when switching languages
      })
      .catch(err => {
        setTrajectoryError(err.message);
        setTrajectoryLoading(false);
        setTrajectoryData(null);
      });
  }, [selectedLanguage]);

  // Trajectory navigation functions
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNextStep = () => {
    if (trajectoryData && currentStep < trajectoryData.trajectory.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  // Get model name based on selected language
  const getModelName = (language) => {
    switch (language) {
      case 'Java':
        return 'qwen3-coder-480b-a35b-instruct';
      case 'JavaScript':
        return 'kimi-k2-instruct-0905';
      case 'Python':
      default:
        return 'kimi-k2-instruct';
    }
  };

  const renderStepContent = (stepData, stepIndex) => {
    if (stepIndex === 0) {
      return (
        <div className="space-y-2">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">User Instruction</h4>
            <div className="text-blue-800 text-xs whitespace-pre-wrap">{stepData.query[1].content}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {stepData.thought && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Thought</h4>
            <div className="text-blue-800 text-xs whitespace-pre-wrap">{stepData.thought}</div>
          </div>
        )}
        {stepData.action && (
          <div className="bg-blue-100 border border-blue-300 p-3 rounded text-xs">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Action</h4>
            <div className="text-blue-800 font-mono text-xs bg-white p-2 rounded border">{stepData.action}</div>
          </div>
        )}
        {stepData.observation && (
          <div className="bg-blue-200 border border-blue-400 p-3 rounded text-xs">
            <h4 className="text-sm font-semibold text-blue-900 mb-1">Observation</h4>
            <div className="text-blue-800 text-xs whitespace-pre-wrap">{stepData.observation}</div>
          </div>
        )}
      </div>
    );
  };

  // --- UI ------------------------------------------------------------------
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Top Header */}
      <div className="px-6 md:px-12 pt-12 pb-4">
        <motion.h1
          className="text-4xl md:text-5xl text-black"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Beyond SWE-Bench: SWE-Bench++
        </motion.h1>
        <p className="text-black-600 max-w-3xl mt-3">
        We introduce a new framework for end-to-end evaluation and training of next-gen software engineering agents.
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Tag tag="Code" />
          <Tag tag="Benchmark" />
        </div>
        <div className="flex items-center gap-3 mt-4">
          <a
            href="https://huggingface.co/datasets/TuringEnterprises/SWE-Bench-plus-plus"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src={`${import.meta.env.BASE_URL}hf-logo.svg`}
              alt="Hugging Face Dataset"
              className="h-8 w-auto"
            />
          </a>
          <a
            href="https://github.com/TuringEnterprises/SWE-Bench-plus-plus"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            <img
              src={`${import.meta.env.BASE_URL}gh-logo.png`}
              alt="GitHub Repository"
              className="h-8 w-auto"
            />
          </a>
        </div>
      </div>

      {/* Resolve Rate Section */}
      <div className="px-6 md:px-12 pt-16 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            <p className="text-black text-center mb-2 font-semibold">Public Dataset: 500 Tasks</p>
            <p className="text-black text-center mb-4">Pass@1 Resolve Rate</p>
            <div className="h-96">
              <div className="h-full flex flex-col justify-between py-2">
                {baseEval.map((entry, index) => {
                  const percentage = entry.pass_at_1 * 100;
                  const barColor = getModelColor(entry.model);
                  return (
                    <div key={`public-bar-${index}`} className="flex items-center gap-3 h-8">
                      <div className="w-48 text-sm text-black text-right pr-3 truncate" title={entry.model}>
                        {entry.model}
                      </div>
                      <div className="flex-1 relative h-6">
                        {/* Light gray bar (100% background) */}
                        <div className="absolute inset-0 bg-gray-200 rounded"></div>
                        {/* Colored fill (pass_at_1 percentage) */}
                        <div 
                          className="absolute inset-y-0 left-0 rounded"
                          style={{ width: `${percentage}%`, backgroundColor: barColor }}
                        ></div>
                        {/* Data label at the right edge of the gray bar */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-black">
                          {percentage.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div>
            <p className="text-black text-center mb-2 font-semibold">Commercial Dataset: 7,000+ Tasks (3,892 Evaluation Subset)</p>
            <p className="text-black text-center mb-4">Pass@1 Resolve Rate</p>
            <div className="h-96">
              <div className="h-full flex flex-col justify-between py-2">
                {commercialEval.map((entry, index) => {
                  const percentage = entry.pass_at_1 * 100;
                  const barColor = getModelColor(entry.model);
                  return (
                    <div key={`commercial-bar-${index}`} className="flex items-center gap-3 h-8">
                      <div className="w-48 text-sm text-black text-right pr-3 truncate" title={entry.model}>
                        {entry.model}
                      </div>
                      <div className="flex-1 relative h-6">
                        {/* Light gray bar (100% background) */}
                        <div className="absolute inset-0 bg-gray-200 rounded"></div>
                        {/* Colored fill (pass_at_1 percentage) */}
                        <div 
                          className="absolute inset-y-0 left-0 rounded"
                          style={{ width: `${percentage}%`, backgroundColor: barColor }}
                        ></div>
                        {/* Data label at the right edge of the gray bar */}
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-black">
                          {percentage.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="px-6 md:px-12 pt-16 pb-6">
        <h2 className="text-center text-4xl text-black mb-6">Overview</h2>
        <p className="text-center text-black max-w-4xl mx-auto mb-8 leading-relaxed">
        We introduce SWE-bench++ as a challenging, highly scalable, broadly sourced, multilingual, and fair benchmark. We address various key shortcomings of existing benchmarks, including irreproducible environments, manual-curation-induced scalability bottlenecks, dataset contamination, weak test oracles, and more. We've open-sourced 500 of our 7,000+ tasks, accessible with the evaluation harness on <a href="https://huggingface.co/datasets/TuringEnterprises/SWE-Bench-plus-plus" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:opacity-80 transition-opacity">Hugging Face</a>, with the evaluation repository on <a href="https://github.com/TuringEnterprises/SWE-Bench-plus-plus" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:opacity-80 transition-opacity">GitHub</a>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="p-6 border border-gray-200 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-300 cursor-default">
            <h3 className="text-lg font-semibold text-black mb-3">Quality Assurance</h3>
            <p className="text-sm text-black leading-relaxed">
              All PRs are uncontaminated (merged after 2024, with &gt;100 stars and active maintenance). Human experts review tasks for fairness at various steps.
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-300 cursor-default">
            <h3 className="text-lg font-semibold text-black mb-3">Task Diversity</h3>
            <p className="text-sm text-black leading-relaxed">
              1000s of repos, 9 languages, 6 issue types, 11 repo types, 7000+ commercially-available tasks.
            </p>
          </div>
          <div className="p-6 border border-gray-200 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-300 cursor-default">
            <h3 className="text-lg font-semibold text-black mb-3">Easy Reproducibility</h3>
            <p className="text-sm text-black leading-relaxed">
              Dockerfile templates per language enable scalable environment configuration.
            </p>
          </div>
          <div 
            className="p-6 border border-gray-200 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-300 cursor-pointer"
            onClick={() => {
              const element = document.getElementById('agentic-trajectory-explorer');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <h3 className="text-lg font-semibold text-black mb-3">SFT / DPO Trajectory Capture</h3>
            <p className="text-sm text-black leading-relaxed mb-3">
              We capture successful agent trajectories that improve model performance through fine tuning.
            </p>
            <p className="text-sm text-blue-600 text-right flex items-center justify-end gap-1">
              See more <ChevronDown className="w-4 h-4" />
            </p>
          </div>
        </div>
      </div>

      {/* Task Distributions Section */}
      <div className="px-6 md:px-12 pt-16 pb-6">
        <h2 className="text-center text-4xl text-black mb-6">Task Distributions</h2>
        <p className="text-center text-black max-w-4xl mx-auto mb-6 leading-relaxed">
          We prioritized both quantity and quality, having captured, scraped, and packaged high quality PRs across various programming languages, repository types, and issue types. Over 80% of tasks, both public and commercial, are in the medium-to-hard difficulty range.
        </p>
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setSelectedDistribution("Public")}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-full border text-xs font-medium transition-all ${
              selectedDistribution === "Public"
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            Public
          </button>
          <button
            onClick={() => setSelectedDistribution("Commercial")}
            className={`inline-flex items-center justify-center px-4 py-2 rounded-full border text-xs font-medium transition-all ${
              selectedDistribution === "Commercial"
                ? "border-blue-900 text-blue-900 bg-blue-50"
                : "border-blue-900 text-blue-900 hover:bg-blue-50"
            }`}
          >
            Commercial
          </button>
        </div>
        {selectedDistribution === "Public" ? (
          <>
            <p className="text-center text-sm text-gray-500 mb-4"># PRs: 500 open-source subset</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Repository Type Chart */}
            <div>
              <h3 className="text-base text-gray-900 mb-4 text-center">Repository Type</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(publicRepoTypeCounts).map(([name, count]) => ({ name, "PR count": count }))} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="PR count" fill="#2563eb" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
            
            {/* Programming Language Chart */}
            <div>
              <h3 className="text-base text-gray-900 mb-4 text-center">Programming Language</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(publicLanguageCounts).map(([name, count]) => ({ name, "PR count": count }))} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="PR count" fill="#1e40af" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Issue Type Chart */}
            <div>
              <h3 className="text-base text-gray-900 mb-4 text-center">Issue Type</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(publicIssueTypeCounts).map(([name, count]) => ({ name, "PR count": count }))} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="PR count" fill="#64748b" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          </>
        ) : (
          <>
            <p className="text-center text-sm text-gray-500 mb-4"># PRs: 3,892 evaluation subset</p>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Repository Type Chart */}
            <div>
              <h3 className="text-base text-gray-900 mb-4 text-center">Repository Type</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(commercialRepoTypeCounts).map(([name, count]) => ({ name, "PR count": count }))} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="PR count" fill="#2563eb" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Programming Language Chart */}
            <div>
              <h3 className="text-base text-gray-900 mb-4 text-center">Programming Language</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(commercialLanguageCounts).map(([name, count]) => ({ name, "PR count": count }))} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="PR count" fill="#1e40af" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Issue Type Chart */}
            <div>
              <h3 className="text-base text-gray-900 mb-4 text-center">Issue Type</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(commercialIssueTypeCounts).map(([name, count]) => ({ name, "PR count": count }))} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="PR count" fill="#64748b" radius={[8,8,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          </>
        )}
      </div>

      {/* Methodology Section */}
      <div className="px-6 md:px-12 py-6">
        <h2 className="text-center text-4xl text-black mb-6">Methodology</h2>
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base text-black-900 font-semibold mb-2">Align: Define inclusion thresholds for candidate PRs</h3>
                <p className="text-sm text-black leading-relaxed">
                  Heuristic filters identify pull requests (PRs) that meet predefined quality thresholds, including repository activity, test presence, and PR–issue linkage. This step is designed to be fast and efficient, casting a wide net of thousands, or even millions, of potential tasks, to be vetted later with more comprehensive checks.
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">2</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base text-black-900 font-semibold mb-2">Calibrate: Filter for problem clarity and reproducibility</h3>
                <p className="text-sm text-black leading-relaxed">
                  Each selected task undergoes rigorous filtering to ensure the problem statement is clear, the expected solution is well-defined, and the reproduction steps are unambiguous. This calibration process guarantees that evaluation results are meaningful and comparable.
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">3</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base text-black-900 font-semibold mb-2">Generate: Scaffold Reproducible environments via agentic Dockerization</h3>
                <p className="text-sm text-black leading-relaxed">
                  We pair an LLM with a template-based scaffolding step to Dockerize each PR. It's important to not rely solely on an LLM for this, as purely LLM-based containerizing is prone to security vulnerabilities, logic errors, and more. Template-based scaffolding really means that we've generated custom Dockerfile templates for each programming language that follow best practices for reproduction. Each one has placeholders that our agent will then intelligently populate.
                </p>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">4</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base text-black-900 font-semibold mb-2">Validate: Perform iterative quality assurance through combined LLM- and- human-expert feedback</h3>
                <p className="text-sm text-black leading-relaxed">
                  While it ensures a valid file operationally and syntactically, a successful Docker build doesn't necessarily measure efficiency or full correctness. For example, small issues like redundant steps or test command inaccuracy may slip through the cracks. Hence, we employ an LLM as the final quality check for each PR to pass.
                </p>
              </div>
            </div>
          </div>

          {/* Step 5 */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">5</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base text-black-900 font-semibold mb-2">Verify: Extract diagnostic states via hybrid log parsing</h3>
                <p className="text-sm text-black leading-relaxed">
                  SWE-bench++ uses 3 states to analyze test outcomes, as well as hybrid log parsing to extract test results from execution logs. Our hybrid log parser combines parsers used for standard testing frameworks with an LLM-generated log parser. This process eliminates manual engineering & debugging, thus allowing models and engineers to scalably analyze and debug test results in any framework.
                </p>
              </div>
            </div>
          </div>

          {/* Step 6 */}
          <div 
            className="p-6 border border-gray-200 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-gray-300"
            onClick={() => {
              const element = document.getElementById('agentic-trajectory-explorer');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">6</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-base text-black-900 font-semibold">Capture: Capture successful agentic trajectories for model finetuning</h3>
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-full border border-blue-900 text-blue-900 text-xs font-medium">
                    Commercial
                  </span>
                </div>
                <p className="text-sm text-black leading-relaxed mb-3">
                  We systematically capture and store successful agentic trajectories that demonstrate effective problem-solving strategies. These trajectories serve as high-quality training data for model fine-tuning, enabling the development of more capable AI agents through learning from successful execution patterns.
                </p>
                <p className="text-sm text-blue-600 text-right flex items-center justify-end gap-1">
                  See more <ChevronDown className="w-4 h-4" />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agentic Trajectory Viewer Section */}
      <div className="px-6 md:px-12 pt-16 pb-16">
        <h2 className="text-center text-4xl text-black mb-6">Agentic Trajectory Viewer</h2>
        <p className="text-center text-black max-w-4xl mx-auto mb-8 leading-relaxed">
          We capture successful agentic trajectories (reasoning paths that end on a "submit" action) for finetuning. Each model step includes three parts: a <strong>thought</strong> (what the model explored to arrive at its action), an <strong>action</strong> (what the model did), and <strong>observation</strong> (what the result of the model's action was in the environment). These trajectories enable us to provide proof-of-value for our PRs.
        </p>
        <Card id="agentic-trajectory-explorer">
          <CardHeader>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle>Language</CardTitle>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32 h-8 text-xs bg-blue-100 border-transparent hover:bg-blue-200 focus:outline-none focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Python" className="text-xs">Python</SelectItem>
                    <SelectItem value="Java" className="text-xs">Java</SelectItem>
                    <SelectItem value="JavaScript" className="text-xs">JavaScript</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-black text-sm">
                Model: {getModelName(selectedLanguage)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {trajectoryLoading ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-600">Loading trajectory data...</p>
                </div>
              </div>
            ) : trajectoryError ? (
              <div className="text-center h-96 flex items-center justify-center">
                <div className="text-red-600 text-sm">Error loading data: {trajectoryError}</div>
              </div>
            ) : trajectoryData ? (
              <div className="space-y-4">
                {/* Step Navigation */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Step {currentStep} of {trajectoryData.trajectory.length}
                  </h3>
                  <div className="flex space-x-2">
                    <Button
                      onClick={goToPreviousStep}
                      disabled={currentStep === 0}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-400 disabled:text-blue-300 border-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
                    >
                      ← Previous
                    </Button>
                    <Button
                      onClick={goToNextStep}
                      disabled={currentStep === trajectoryData.trajectory.length}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-400 disabled:text-blue-300 border-none hover:bg-transparent focus:bg-transparent active:bg-transparent"
                    >
                      Next →
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / (trajectoryData.trajectory.length + 1)) * 100}%` }}
                  ></div>
                </div>

                {/* Step Indicators */}
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() => goToStep(0)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      currentStep === 0
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-300 text-black hover:bg-gray-400'
                    }`}
                  >
                    User
                  </button>
                  {trajectoryData.trajectory.map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => goToStep(index + 1)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        index + 1 === currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                {/* Current Step Content */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="mb-3">
                    <h4 className="text-sm font-semibold text-gray-900 mb-1">
                      {currentStep === 0 ? 'User Instruction' : `Model Step ${currentStep}`}
                    </h4>
                    <div className="text-xs text-gray-500">
                      {currentStep === 0 
                        ? 'Initial user instruction for the task'
                        : `Execution time: ${trajectoryData.trajectory[currentStep - 1]?.execution_time?.toFixed(3)}s`
                      }
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {renderStepContent(
                      currentStep === 0 ? trajectoryData.trajectory[0] : trajectoryData.trajectory[currentStep - 1], 
                      currentStep
                    )}
                  </div>
                </div>

              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {/* Dataset Downloads Section */}
      <div className="px-6 md:px-12 pt-16 pb-6">
        <h2 className="text-center text-4xl text-black mb-6">Data Access</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mt-8">
          {/* Public Dataset Box */}
          <div className="relative border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
            <div className="absolute -top-3 left-6">
              <span className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-blue-600 text-blue-600 bg-white text-xs font-medium">
                Public
              </span>
            </div>
            <div className="pt-4">
              <p className="text-black leading-relaxed mb-4">
                Our 500-task public dataset is available for download on Hugging Face. See the evaluation repo on GitHub.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://huggingface.co/datasets/TuringEnterprises/SWE-Bench-plus-plus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}hf-logo.svg`}
                    alt="Hugging Face"
                    className="h-8 w-auto"
                  />
                </a>
                <a
                  href="https://github.com/TuringEnterprises/SWE-Bench-plus-plus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <img
                    src={`${import.meta.env.BASE_URL}gh-logo.png`}
                    alt="GitHub"
                    className="h-8 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Commercial Dataset Box */}
          <Link
            to="/contact?source=swebench"
            className="relative block border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
          >
            <div className="absolute -top-3 left-6">
              <span className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-blue-900 text-blue-900 bg-white text-xs font-medium">
                Commercial
              </span>
            </div>
            <div className="pt-4">
              <p className="text-black leading-relaxed mb-4">
                Reach out to our team for access to our complete 7,000+ tasks, in addition to agentic trajectories.
              </p>
              <div className="flex justify-end">
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                  Contact us
                  <span className="text-lg">→</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
