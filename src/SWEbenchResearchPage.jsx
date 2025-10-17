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
import { useMemo, useState } from "react";
import { Info } from "lucide-react";

export default function SWEbenchResearchPage() {
  // --- Mock Data (pass@1-only per latest spec) -----------------------------
  const baseEval = [
    { model: "GPT-4", split: "dev", pass_at_1: 0.62 },
    { model: "Claude 3", split: "dev", pass_at_1: 0.58 },
    { model: "Gemini 1.5", split: "dev", pass_at_1: 0.54 },
    { model: "Mistral", split: "dev", pass_at_1: 0.43 },
  ];

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

  const COLORS = ["#2563eb", "#1e40af", "#64748b", "#0ea5e9"]; // blues + gray

  // --- State ---------------------------------------------------------------
  const [activeModel, setActiveModel] = useState("GPT-4");
  const [onlyOpenSource, setOnlyOpenSource] = useState(false);
  const [query, setQuery] = useState("");
  const [activeModelCommercial, setActiveModelCommercial] = useState("GPT-4");

  const filteredEval = useMemo(() => {
    let rows = baseEval;
    if (onlyOpenSource) rows = rows.filter((r) => ["Mistral"].includes(r.model));
    if (query) rows = rows.filter((r) => r.model.toLowerCase().includes(query.toLowerCase()));
    return rows;
  }, [baseEval, onlyOpenSource, query]);

  const selectedRow = filteredEval.find((r) => r.model === activeModel) || filteredEval[0];
  const selectedRowCommercial = baseEval.find((r) => r.model === activeModelCommercial) || baseEval[0];
  const commercialData = useMemo(
    () => baseEval.map((r) => ({ ...r, pass_at_1: Math.min(1, r.pass_at_1 + 0.05) })),
    [baseEval]
  );

  const fmtPct = (v) => (typeof v === "number" ? `${Math.round(v * 100)}%` : "—");

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
        <p className="text-gray-600 max-w-3xl mt-3">
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
            <div className="flex items-center gap-2 text-sm text-gray-700">
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
                <AccordionTrigger className="text-2xl font-semibold">Overview</AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>SWE-bench++ (Public)</CardTitle>
                      </CardHeader>
                      <CardContent className="text-gray-700 leading-relaxed">
                      While foundational, benchmarks like SWE-bench, SWE-bench Verified, and other such variants are incomplete, with manually curated design causing scalability bottlenecks, weak test oracles, dataset aging and contamination, reproducibility challenges, and more. We introduce SWE-bench++: a reenvisioned, innovative, end-to-end evaluation framework. It both addresses existing evaluation pain points and introduces new capabilities, positioning it as a forerunner for software reasoning evaluation and training. SWE-bench++ (Public) is the community-accessible release of this benchmark. It includes 500 high-quality tasks designed to evaluate the ability of LLMs and coding agents to resolve real-world GitHub issues and pull requests.
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>At a Glance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between"><span>Tasks</span><span>500</span></div>
                        <div className="flex justify-between"><span>Repos</span><span>11</span></div>
                        <div className="flex justify-between"><span>Languages</span><span>Py, Java, TS, Go, and more</span></div>
                        <div className="flex justify-between"><span>Issues</span><span>6</span></div>
                      </CardContent>
                    </Card>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Results + Controls */}
            <Card>
              <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
                <CardTitle>Evaluation Results</CardTitle>
                <div className="flex gap-3 items-center">
                  <Select value={activeModel} onValueChange={setActiveModel}>
                    <SelectTrigger className="w-44"><SelectValue placeholder="Model" /></SelectTrigger>
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
                      <BarChart data={filteredEval} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(v) => `${Math.round(v * 100)}%`} domain={[0, 1]} />
                        <YAxis type="category" dataKey="model" width={100} />
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
                      <div className="text-xl font-semibold">{selectedRow?.model}</div>
                      <div className="mt-2 text-gray-700">pass@1: <span className="font-medium">{fmtPct(selectedRow?.pass_at_1)}</span></div>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => window.open('https://huggingface.co/datasets/TuringEnterprises/SWE-Bench-plus-plus', '_blank')}
                    >
                      See leaderboard on Hugging Face
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Our Methodology */}
            <Card>
              <CardHeader>
                <CardTitle>Our Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Align: Define inclusion thresholds for candidate PRs</h3>
                        <p className="text-gray-700 leading-relaxed">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Calibrate: Filter for problem clarity and reproducibility</h3>
                        <p className="text-gray-700 leading-relaxed">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate: Scaffold reproducible environments via agentic Dockerization</h3>
                        <p className="text-gray-700 leading-relaxed">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Validate: Perform iterative quality assurance through combined LLM- and- human-expert feedback</h3>
                        <p className="text-gray-700 leading-relaxed">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify: Extract diagnostic states via hybrid log parsing</h3>
                        <p className="text-gray-700 leading-relaxed">
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
                <CardTitle>Distributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Issue Types Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Types</h3>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
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
            <div className="grid md:grid-cols-2 gap-6">
              <Accordion type="multiple" className="space-y-4 w-full">
                {/* <AccordionItem value="m1">
                  <AccordionTrigger className="text-lg font-semibold">Metadata</AccordionTrigger>
                  <AccordionContent>
                    <Card>
                      <CardContent className="p-4 text-sm text-gray-700 space-y-2">
                        <div>Version: <span className="font-medium">v0.9-public</span></div>
                        <div>Splits: <span className="font-medium">dev/test</span></div>
                        <div>Annotations: <span className="font-medium">patch, test, repo-state</span></div>
                        <div>Release Notes: Placeholder bullet list here.</div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem> */}
                <AccordionItem value="m2">
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
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          {/* ---------------- COMMERCIAL ---------------- */}
          <TabsContent value="commercial" className="mt-8 space-y-8">
            {/* Overview (restored as accordion) */}
            <Accordion type="single" collapsible defaultValue="c0">
              <AccordionItem value="c0">
                <AccordionTrigger className="text-2xl font-semibold">Overview</AccordionTrigger>
                <AccordionContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Concept */}
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Concept</CardTitle>
                      </CardHeader>
                      <CardContent className="text-gray-700 leading-relaxed">
                        The commercial SWE-bench++ release extends the public variant with enterprise-grade assets: full agentic
                        trajectories (JSONL), sandbox instrumentation, reproducible environments, and longitudinal task tracking
                        for training and eval. Use this area to outline contractual terms, governance, and security posture.
                      </CardContent>
                    </Card>

                    {/* At a Glance */}
                    <Card>
                      <CardHeader>
                        <CardTitle>At a Glance</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between"><span>Repos</span><span>~250 (enterprise-curated)</span></div>
                        <div className="flex justify-between"><span>Tasks</span><span>~1,200 + private addenda</span></div>
                        <div className="flex justify-between"><span>Trajectories</span><span>{">= 50k steps"}</span></div>
                        <div className="flex justify-between"><span>Retention</span><span>rolling quarterly</span></div>
                        <div className="flex justify-between"><span>License</span><span>Commercial / EULA</span></div>
                      </CardContent>
                    </Card>

                    {/* Access
                    <Card className="md:col-span-3">
                      <CardHeader>
                        <CardTitle>Access</CardTitle>
                      </CardHeader>
                      <CardContent className="grid md:grid-cols-3 gap-4 text-sm text-gray-700">
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
                      <CardContent className="text-sm text-gray-700 space-y-2">
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
                    <SelectTrigger className="w-44"><SelectValue placeholder="Model" /></SelectTrigger>
                    <SelectContent>
                      {baseEval.map((r) => (
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
                      <BarChart data={commercialData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={(v) => `${Math.round(v * 100)}%`} domain={[0, 1]} />
                        <YAxis type="category" dataKey="model" width={100} />
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
                          {commercialData.map((entry) => (
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
                      <div className="text-xl font-semibold">{selectedRowCommercial?.model}</div>
                      <div className="mt-2 text-gray-700">pass@1: <span className="font-medium">{fmtPct(selectedRowCommercial?.pass_at_1)}</span></div>
                    </div>
                    {/* <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Download Commercial Results (JSON)</Button> */}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Our Methodology */}
            <Card>
              <CardHeader>
                <CardTitle>Our Methodology</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">1</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Align: Define inclusion thresholds for candidate PRs</h3>
                        <p className="text-gray-700 leading-relaxed">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Calibrate: Filter for problem clarity and reproducibility</h3>
                        <p className="text-gray-700 leading-relaxed">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Generate: Scaffold Reproducible environments via agentic Dockerization</h3>
                        <p className="text-gray-700 leading-relaxed">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Validate: Perform iterative quality assurance through combined LLM- and- human-expert feedback</h3>
                        <p className="text-gray-700 leading-relaxed">
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Verify: Extract diagnostic states via hybrid log parsing</h3>
                        <p className="text-gray-700 leading-relaxed">
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
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            Capture: Capture successful agentic trajectories for model finetuning
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
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
                <CardTitle>Distributions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Issue Types Chart */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Types</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={issueDist}>
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={langDist}>
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

            {/* Agentic Trajectories – interactive viewer placeholder */}
            <Card id="agentic-trajectory-explorer">
              <CardHeader>
                <CardTitle>Agentic Trajectory Explorer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <Select defaultValue="trace-001">
                      <SelectTrigger className="w-full"><SelectValue placeholder="Select trace" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="trace-001">Trace #001 (bugfix/py)</SelectItem>
                        <SelectItem value="trace-014">Trace #014 (refactor/java)</SelectItem>
                        <SelectItem value="trace-108">Trace #108 (feature/cpp)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="w-full">Download Trajectory (JSONL)</Button>
                    <div className="text-xs text-gray-500">Each trajectory includes tool calls, diffs, tests, and environment state.</div>
                  </div>
                  <div className="md:col-span-2 p-4 border rounded-2xl bg-gray-50 h-72 overflow-auto text-sm leading-relaxed">
                    <div className="font-mono text-gray-800">[00:00] plan → identify failing tests</div>
                    <div className="font-mono text-gray-800">[00:07] tool.run(pytest -q)</div>
                    <div className="font-mono text-gray-800">[00:30] read file: utils/normalize.py</div>
                    <div className="font-mono text-gray-800">[01:05] patch applied (hunk 1/2)</div>
                    <div className="font-mono text-gray-800">[02:10] tool.run(pytest -q) ⇒ 1 failed → iterate</div>
                    <div className="font-mono text-gray-800">[03:42] patch applied (hunk 2/2) | tests pass ✓</div>
                    <div className="font-mono text-gray-500 mt-3">(Replace with an interactive DAG/log viewer in production.)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Metadata & CLI */}
            <Accordion type="multiple" className="space-y-4">
              <AccordionItem value="cmeta">
                <AccordionTrigger className="text-lg font-semibold">Metadata</AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="p-4 text-sm text-gray-700 space-y-2">
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
            </Accordion>
          </TabsContent>
        </Tabs>

        {/* Footer CTA */}
        <div className="text-center py-12">
          <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-8 py-3 text-lg">
            Access SWE-bench++
          </Button>
        </div>
      </div>
    </div>
  );
}
