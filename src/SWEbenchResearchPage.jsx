import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { Info, ArrowUpRight } from "lucide-react";

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
    { model: "gpt5-high-reasoning", split: "dev", pass_at_1: 0.1670 },
    { model: "claude-opus-4.1", split: "dev", pass_at_1: 0.1570 },
    { model: "gpt-5-2025-08-07", split: "dev", pass_at_1: 0.1690 },
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
      // Use the base path from Vite's import.meta.env.BASE_URL
      const basePath = import.meta.env.BASE_URL;
      
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
      </div>

      {/* Sticky Controls
      <div className="px-6 md:px-12 py-4 sticky top-0 z-40 bg-white/95 backdrop-blur border-b">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600 text-white rounded-full">Prototype</Badge>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Info className="w-4 h-4" /> Interactive mockup with progressive disclosure
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3 w-full md:w-auto">
            <Input
              placeholder="Search model…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full md:w-56"
            />
            <div className="flex items-center gap-2 text-sm text-black">
              <Switch checked={onlyOpenSource} onCheckedChange={setOnlyOpenSource} id="oss" />
              <label htmlFor="oss">Open-source only</label>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Content Tabs: Public vs Commercial */}
      <div className="px-6 md:px-12 py-10">
        <Tabs defaultValue="public" className="w-full">
          <TabsList className="grid grid-cols-2 max-w-xl">
            <TabsTrigger value="public">Public Dataset</TabsTrigger>
            <TabsTrigger value="commercial">Commercial Dataset</TabsTrigger>
          </TabsList>

          {/* ---------------- PUBLIC ---------------- */}
          <TabsContent value="public" className="mt-8 space-y-8">
            {/* Overview – collapsible to avoid info dump */}
            <Accordion type="single" collapsible defaultValue="o1">
              <AccordionItem value="o1">
                <AccordionTrigger className="text-xl">Overview</AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-xl">SWE-bench++ (Public)</CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => window.open('https://huggingface.co/datasets/TuringEnterprises/SWE-Bench-plus-plus', '_blank')}
                            className="text-blue-600 hover:bg-transparent hover:text-blue-400"
                          >
                            Hugging Face <ArrowUpRight className="w-3 h-3 ml-1" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="text-sm text-black leading-relaxed">
                      While foundational, benchmarks like SWE-bench, SWE-bench Verified, and other such variants are incomplete, with manually curated design causing scalability bottlenecks, weak test oracles, dataset aging and contamination, reproducibility challenges, and more. We introduce SWE-bench++: a reenvisioned, innovative, end-to-end evaluation framework. It both addresses existing evaluation pain points and introduces new capabilities, positioning it as a forerunner for software reasoning evaluation and training. SWE-bench++ (Public) is the community-accessible release of this benchmark. It includes 500 high-quality tasks designed to evaluate the ability of LLMs and coding agents to resolve real-world GitHub issues and pull requests.
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">At a Glance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-black">
                        <div className="flex justify-between"><span>Tasks</span><span>500</span></div>
                        <div className="flex justify-between"><span>Repos</span><span>11</span></div>
                        <div className="flex justify-between"><span>Languages</span><span>Py, Java, TS, Go, and more</span></div>
                        <div className="flex justify-between"><span>Issue Types</span><span>6</span></div>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Results + Controls */}
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle className="text-xl">Evaluation Results (Public)</CardTitle>
                <div className="flex gap-3 items-center">
                  <Select value={activeModel} onValueChange={setActiveModel}>
                    <SelectTrigger className="w-64 focus:outline-none focus:ring-0"><SelectValue placeholder="Select a model" /></SelectTrigger>
                    <SelectContent>
                      {filteredEval.map((r) => (
                        <SelectItem key={r.model} value={r.model}>{r.model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-8">
                  {/* Horizontal (vertical layout) bar chart */}
                  <div className="md:col-span-2 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={filteredEval} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(v) => `${(v * 100).toFixed(2)}%`} domain={[0, 0.5]} />
                        <YAxis type="category" dataKey="model" width={180} />
                        <Tooltip formatter={(v) => fmtPct(Number(v))} />
                        <Legend />
                        <Bar
                          dataKey="pass_at_1"
                          onClick={(data) => {
                            if (data && data.payload && data.payload.model) setActiveModel(data.payload.model);
                          }}
                          fill="#2563eb"
                          radius={[6, 6, 6, 6]}
                        >
                          {filteredEval.map((entry) => (
                            <Cell
                              key={`cell-${entry.model}`}
                              cursor="pointer"
                              fill={entry.model === activeModel ? "#1e40af" : "#2563eb"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Selected panel */}
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-gray-50 border">
                      <div className="text-sm text-gray-500">Selected</div>
                      <div className="text-lg">{selectedRow?.model || "None"}</div>
                      <div className="mt-2 text-black">pass@1: <span className="font-medium">{selectedRow ? fmtPct(selectedRow.pass_at_1) : "—"}</span></div>
                    </div>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="w-full text-blue-600 hover:bg-transparent hover:text-blue-400"
                      onClick={() => window.open('https://huggingface.co/datasets/TuringEnterprises/SWE-Bench-plus-plus', '_blank')}
                    >
                      See dataset on Hugging Face <ArrowUpRight className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Our Methodology */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Our Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4">
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

                  <div className="grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">2</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base text-black-900 font-semibold mb-2">Calibrate: Filter for problem clarity and reproducibility</h3>
                        <p className="text-sm text-black leading-relaxed">
                          Each selected task undergoes rigorous filtering to ensure the problem statement is clear, 
                          the expected solution is well-defined, and the reproduction steps are unambiguous. 
                          This calibration process guarantees that evaluation results are meaningful and comparable.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">3</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base text-black-900 font-semibold mb-2">Generate: Scaffold reproducible environments via agentic Dockerization</h3>
                        <p className="text-sm text-black leading-relaxed">
                        We pair an LLM with a template-based scaffolding step to Dockerize each PR. It’s important to not rely solely on an LLM for this, as purely LLM-based containerizing is prone to security vulnerabilities, logic errors, and more. Template-based scaffolding really means that we’ve generated custom Dockerfile templates for each programming language that follow best practices for reproduction. Each one has placeholders that our agent will then intelligently populate.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">4</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base text-black-900 font-semibold mb-2">Validate: Perform iterative quality assurance through combined LLM- and- human-expert feedback</h3>
                        <p className="text-sm text-black leading-relaxed">
                        While it ensures a valid file operationally and syntactically, a successful Docker build doesn’t necessarily measure efficiency or full correctness. For example, small issues like redundant steps or test command inaccuracy may slip through the cracks. Hence, we employ an LLM as the final quality check for each PR to pass.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
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
                </div>
              </CardContent>
            </Card>

            {/* Distributions – vertical bar charts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Task Distributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Issue Types Chart */}
                  <div>
                    <h3 className="text-base text-gray-900 mb-4">Issue Types</h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={issueDist} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="PR count" fill="#2563eb" radius={[8,8,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Languages Chart */}
                  <div>
                    <h3 className="text-base text-gray-900 mb-4">Languages</h3>
                    <div className="h-96">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={langDist} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="PR count" fill="#1e40af" radius={[8,8,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata & CLI – progressive disclosure */}
            {/* <div className="grid md:grid-cols-2 gap-6">
              <Accordion type="multiple" className="space-y-4 w-full"> */}
                {/* <AccordionItem value="m1">
                  <AccordionTrigger className="text-lg font-semibold">Metadata</AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="p-4 text-sm text-black space-y-2">
                        <div>Version: <span className="font-medium">v0.9-public</span></div>
                        <div>Splits: <span className="font-medium">dev/test</span></div>
                        <div>Annotations: <span className="font-medium">patch, test, repo-state</span></div>
                        <div>Release Notes: Placeholder bullet list here.</div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem> */}
                {/* <AccordionItem value="m2">
                  <AccordionTrigger className="text-lg font-semibold">Evaluation CLI</AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardHeader>
                        <CardTitle>Quick Start</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto">{`pip install swebench++

swebench-eval --model gpt-4 --dataset public --metric pass@1 --output results.json`}</pre>
                        <div className="mt-3 flex gap-3">
                          <Button className="bg-blue-600 text-white">Copy</Button>
                          <Button variant="outline" className="text-blue-700 border-blue-200">Open Docs</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem> */}
              {/* </Accordion>
            </div> */}

            {/* Implications Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Implications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-black leading-relaxed space-y-4">
                  <p>
                    The path to ASI resembles a three-legged race between model improvement and human evaluation: models get better, benchmarks adjust, and the cycle repeats. Essentially, models can only be systematically improved when benchmarks are rigorous enough to surface their limitations, creating a feedback loop where better models demand better benchmarks, and vice versa. Each side is dependent on the other to push forward. On the "benchmark side," SWE-bench++ gives the push ahead needed to stabilize the team.
                  </p>
                  <p>
                    This framework both generalizes to other software engineering tasks (including those that may have non-standard build procedures or dependencies on external hardware), and paves the way for model hill-climbing and future research advancements (ex. realistic, evolving RL gyms). SWE-bench++ sets a new standard for evaluating and training software reasoning capabilities, with its core innovations addressing leaderboard overfitting and enabling the development of models that can more robustly reason, self correct, and plan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ---------------- COMMERCIAL ---------------- */}
          <TabsContent value="commercial" className="mt-8 space-y-8">
            {/* Overview (restored as accordion) */}
            <Accordion type="single" collapsible defaultValue="c0">
              <AccordionItem value="c0">
                <AccordionTrigger className="text-xl">Overview</AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Concept */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-xl">SWE-bench++ (Commercial)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-black leading-relaxed">
                        Our private, commercial SWE-bench++ dataset is the enterprise-grade release of our extended SWE-bench benchmark. It contains 3,892 high-quality tasks (an order of magnitude larger than the public set) that are designed for organizations to train, fine-tune, and benchmark production-ready coding agents.
                      </CardContent>
                    </Card>

                    {/* At a Glance */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">At a Glance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-black">
                        <div className="flex justify-between"><span>Tasks</span><span>3,800+ (enterprise-curated)</span></div>
                        <div className="flex justify-between"><span>Repos</span><span>1000s+</span></div>
                        <div className="flex justify-between"><span>Languages</span><span>9</span></div>
                        <div className="flex justify-between"><span>Issue Types</span><span>6</span></div>
                      </CardContent>
                    </Card>

                    {/* Access
                    <Card className="md:col-span-3">
                      <CardHeader>
                        <CardTitle>Access</CardTitle>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-3 gap-4 text-sm text-black">
                        <div className="flex justify-between md:block"><span className="text-gray-500">SLA</span><span className="font-medium">99.9%</span></div>
                        <div className="flex justify-between md:block"><span className="text-gray-500">Support</span><span className="font-medium">Research Concierge</span></div>
                        <div className="flex justify-between md:block"><span className="text-gray-500">PII Handling</span><span className="font-medium">Redaction on ingest</span></div>
                      </CardContent>
                    </Card> */}

                    {/* Methods
                    <Card className="md:col-span-3">
                      <CardHeader>
                        <CardTitle>Methods</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-black space-y-2">
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-gray-500">Evaluation Protocol</div>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                              <li>Environment: containerized, pinned deps</li>
                              <li>Judging: unit tests + semantic checks</li>
                              <li>Metrics: pass@k, patch success, time-to-fix</li>
                            </ul>
                          </div>
                          <div>
                            <div className="text-gray-500">Grounding</div>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                              <li>Issue → PR alignment heuristics</li>
                              <li>Repo state snapshots</li>
                              <li>Trajectory provenance (tool calls)</li>
                            </ul>
                          </div>
                          <div>
                            <div className="text-gray-500">Access & Governance</div>
                            <ul className="list-disc ml-5 mt-1 space-y-1">
                              <li>Enterprise EULA & SLA</li>
                              <li>PII redaction on ingest</li>
                              <li>Audit logs (enterprise)</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card> */}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Results */}
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle>Evaluation Results (Commercial)</CardTitle>
                <div className="flex gap-3 items-center">
                  <Select value={activeModelCommercial} onValueChange={setActiveModelCommercial}>
                    <SelectTrigger className="w-64 focus:outline-none focus:ring-0"><SelectValue placeholder="Select a model" /></SelectTrigger>
                    <SelectContent>
                      {commercialEval.map((r) => (
                        <SelectItem key={`commercial-${r.model}`} value={r.model}>{r.model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={commercialEval} layout="vertical" margin={{ left: 20, right: 20, top: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(v) => `${(v * 100).toFixed(2)}%`} domain={[0, 0.5]} />
                        <YAxis type="category" dataKey="model" width={180} />
                        <Tooltip formatter={(v) => fmtPct(Number(v))} />
                        <Legend />
                        <Bar
                          dataKey="pass_at_1"
                          onClick={(data) => {
                            if (data && data.payload && data.payload.model) setActiveModelCommercial(data.payload.model);
                          }}
                          fill="#1e40af"
                          radius={[6, 6, 6, 6]}
                        >
                          {commercialEval.map((entry) => (
                            <Cell
                              key={`cell-commercial-${entry.model}`}
                              cursor="pointer"
                              fill={entry.model === activeModelCommercial ? "#0f2a78" : "#1e40af"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-gray-50 border">
                      <div className="text-sm text-gray-500">Selected</div>
                      <div className="text-lg">{selectedRowCommercial?.model || "None"}</div>
                      <div className="mt-2 text-black">pass@1: <span className="font-medium">{selectedRowCommercial ? fmtPct(selectedRowCommercial.pass_at_1) : "—"}</span></div>
                    </div>
                    {/* <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Download Commercial Results (JSON)</Button> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Our Methodology */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Our Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4">
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

                  <div className="grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">2</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base text-black-900 font-semibold mb-2">Calibrate: Filter for problem clarity and reproducibility</h3>
                        <p className="text-sm text-black leading-relaxed">
                          Each selected task undergoes rigorous filtering to ensure the problem statement is clear, 
                          the expected solution is well-defined, and the reproduction steps are unambiguous. 
                          This calibration process guarantees that evaluation results are meaningful and comparable.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">3</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base text-black-900 font-semibold mb-2">Generate: Scaffold Reproducible environments via agentic Dockerization</h3>
                        <p className="text-sm text-black leading-relaxed">
                        We pair an LLM with a template-based scaffolding step to Dockerize each PR. It’s important to not rely solely on an LLM for this, as purely LLM-based containerizing is prone to security vulnerabilities, logic errors, and more. Template-based scaffolding really means that we’ve generated custom Dockerfile templates for each programming language that follow best practices for reproduction. Each one has placeholders that our agent will then intelligently populate.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">4</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base text-black-900 font-semibold mb-2">Validate: Perform iterative quality assurance through combined LLM- and- human-expert feedback</h3>
                        <p className="text-sm text-black leading-relaxed">
                        While it ensures a valid file operationally and syntactically, a successful Docker build doesn’t necessarily measure efficiency or full correctness. For example, small issues like redundant steps or test command inaccuracy may slip through the cracks. Hence, we employ an LLM as the final quality check for each PR to pass.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4">
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

                  <div className="grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">6</span>
                      </div>
                      <div className="flex-1">
                        <button 
                          onClick={() => {
                            const element = document.getElementById('agentic-trajectory-explorer');
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="text-left bg-blue-50 hover:bg-blue-100 p-4 rounded-lg transition-colors w-full"
                        >
                          <h3 className="text-base text-black-900 font-semibold mb-2">
                            Capture: Capture successful agentic trajectories for model finetuning
                          </h3>
                          <p className="text-sm text-black leading-relaxed">
                            We systematically capture and store successful agentic trajectories that demonstrate effective 
                            problem-solving strategies. These trajectories serve as high-quality training data for model 
                            fine-tuning, enabling the development of more capable AI agents through learning from 
                            successful execution patterns.
                          </p>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Distributions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Task Distributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Issue Types Chart */}
                  <div>
                    <h3 className="text-base text-gray-900 mb-4">Issue Types</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={commercialIssueDist}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="PR count" fill="#2563eb" radius={[8,8,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {/* Languages Chart */}
                  <div>
                    <h3 className="text-base text-gray-900 mb-4">Languages</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={commercialLangDist}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="PR count" fill="#1e40af" radius={[8,8,0,0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Agentic Trajectories – interactive viewer */}
            <Card id="agentic-trajectory-explorer">
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CardTitle>Agentic Trajectory Viewer</CardTitle>
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

            {/* Metadata & CLI */}
            {/* <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="cmeta">
                <AccordionTrigger className="text-lg font-semibold">Metadata</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-4 text-sm text-black space-y-2">
                      <div>Version: <span className="font-medium">v0.9-commercial</span></div>
                      <div>Add-ons: <span className="font-medium">trajectories, env logs, security scan</span></div>
                      <div>Compliance: Placeholder details</div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ccli">
                <AccordionTrigger className="text-lg font-semibold">Evaluation CLI</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Start</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-auto">{`pip install swebench++-commercial

swebench-eval --model gpt-4 --dataset commercial --with-trajectories --metric pass@1 --output results_comm.json`}</pre>
                      <div className="mt-3 flex gap-3">
                        <Button className="bg-blue-600 text-white">Copy</Button>
                        <Button variant="outline" className="text-blue-700 border-blue-200">Request Access</Button>
                      </div>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            </Accordion> */}

            {/* Implications Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Implications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-black leading-relaxed space-y-4">
                  <p>
                    The path to ASI resembles a three-legged race between model improvement and human evaluation: models get better, benchmarks adjust, and the cycle repeats. Essentially, models can only be systematically improved when benchmarks are rigorous enough to surface their limitations, creating a feedback loop where better models demand better benchmarks, and vice versa. Each side is dependent on the other to push forward. On the "benchmark side," SWE-bench++ gives the push ahead needed to stabilize the team.
                  </p>
                  <p>
                    This framework both generalizes to other software engineering tasks (including those that may have non-standard build procedures or dependencies on external hardware), and paves the way for model hill-climbing and future research advancements (ex. realistic, evolving RL gyms). SWE-bench++ sets a new standard for evaluating and training software reasoning capabilities, with its core innovations addressing leaderboard overfitting and enabling the development of models that can more robustly reason, self correct, and plan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer CTA
        <div className="text-center py-12">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-8 py-3 text-lg">
            Access SWE-bench++
          </Button>
        </div> */}
      </div>
    </div>
  );
}
