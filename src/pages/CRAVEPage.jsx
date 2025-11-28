import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";

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

export default function CRAVEPage() {
  const [selectedEvaluation, setSelectedEvaluation] = useState("hint");
  const [showCodePrompt, setShowCodePrompt] = useState(false);
  const [expandedType1, setExpandedType1] = useState(false);
  const [expandedType2, setExpandedType2] = useState(false);

  // 1) Success Rate (Descending)
  const craveEvalSuccess = [
    { model: "claude-sonnet-4.5", success_rate: 0.5080 },
    { model: "claude-sonnet-4", success_rate: 0.4555 },
    { model: "gemini-2.5-pro", success_rate: 0.3845 },
    { model: "gpt-5-codex", success_rate: 0.3333 }
  ];

  // 2) Bug Catching Rate (Descending)
  const craveEvalCatch = [
    { model: "gpt-5-codex", bug_catching_rate: 0.8915 },
    { model: "claude-sonnet-4.5", bug_catching_rate: 0.6560 },
    { model: "claude-sonnet-4", bug_catching_rate: 0.5226 },
    { model: "gemini-2.5-pro", bug_catching_rate: 0.4121 }
  ];

  // Color mapping for each model
  const modelColors = {
    "claude-sonnet-4.5": "#2563eb",
    "claude-sonnet-4": "#1e40af",
    "gemini-2.5-pro": "#ec4899",
    "gpt-5-codex": "#10b981",
  };


    // 1) Type → Count (Descending)
  const craveTypes = {
    "fix": 264,
    "feature": 228,
    "refactor": 47,
    "doc": 35,
    "test": 10,
    "config": 6,
    "performance": 6,
  };

  // 2) Diff Size → Count (Descending, parentheses removed)
  const craveDiffSize = {
    "Small": 471,
    "Medium": 286,
    "Large": 252,
    "Huge": 191,
  };

  // 3) Language → Count (Descending)
  const craveLanguages = {
    "python": 326,
    "mixed": 178,
    "Typescript": 123,
    "doc": 87,
    "config": 83,
    "rust": 66,
    "javascript": 70,
    "cpp/rust": 63,
    "java": 58,
  };

  // 4) Repo Size → Count (Descending, parentheses removed)
  const craveRepoSize = {
    "medium": 436,
    "small": 390,
    "large": 272,
    "huge": 102,
  };


  const getModelColor = (modelName) => {
    return modelColors[modelName] || "#2563eb";
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Top Header */}
      <div className="px-2 md:px-12 pt-12 pb-4">
        <motion.h1
          className="text-4xl md:text-5xl text-black"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Code Review Bench: Evaluating Agentic Code Partners via Hard Code Review Tasks
        </motion.h1>
        <p className="text-black-600 max-w-3xl mt-3">
          We introduce a benchmark for high quality code review, enabling more robust evaluation of agentic code partners.
        </p>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Tag tag="Code" />
          <Tag tag="Benchmark" />
        </div>
        <div className="flex items-center gap-3 mt-4">
          <a
            href="https://huggingface.co/datasets/TuringEnterprises/CRAVE"
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
        </div>
      </div>

      {/* Evaluation Charts Section */}
      <div className="px-2 md:px-12 pt-16 pb-12">
        <p className="text-black text-center mb-2 font-bold">Evaluation Subset: 1,200 Tasks</p>
        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              const element = document.getElementById('data-access-section');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="flex items-center gap-2 text-blue-600 text-sm font-medium border-none bg-transparent p-0 cursor-pointer hover:text-blue-400"
          >
            <span>6,296 commercially available tasks</span>
            <span className="text-lg">→</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div>
            <p className="text-black text-center mb-4">Success Rate</p>
            <div>
              <div className="flex flex-col justify-start gap-2 py-2">
                {craveEvalSuccess.map((entry, index) => {
                  const percentage = entry.success_rate * 100;
                  const barColor = getModelColor(entry.model);
                  return (
                    <div key={`success-bar-${index}`} className="flex items-center gap-3 h-6">
                      <div className="w-48 text-sm text-black text-right pr-3 truncate" title={entry.model}>
                        {entry.model}
                      </div>
                      <div className="flex-1 relative h-6">
                        {/* Light gray bar (100% background) */}
                        <div className="absolute inset-0 bg-gray-200 rounded"></div>
                        {/* Colored fill (success_rate percentage) */}
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
            <p className="text-black text-center mb-4">Bug Catching Rate</p>
            <div>
              <div className="flex flex-col justify-start gap-2 py-2">
                {craveEvalCatch.map((entry, index) => {
                  const percentage = entry.bug_catching_rate * 100;
                  const barColor = getModelColor(entry.model);
                  return (
                    <div key={`catch-bar-${index}`} className="flex items-center gap-3 h-6">
                      <div className="w-48 text-sm text-black text-right pr-3 truncate" title={entry.model}>
                        {entry.model}
                      </div>
                      <div className="flex-1 relative h-6">
                        {/* Light gray bar (100% background) */}
                        <div className="absolute inset-0 bg-gray-200 rounded"></div>
                        {/* Colored fill (bug_catching_rate percentage) */}
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

      {/* Methodology Section */}
      <div className="px-2 md:px-12 pt-20 pb-6">
        <h2 className="text-center text-4xl text-black mb-6">Methodology</h2>
        <p className="text-center text-black max-w-4xl mx-auto mb-8 leading-relaxed">
          Recent advances in software engineering have leveraged LLMs to create coding agents that handle simple tasks, supported by open-source datasets and unit-test-based verification. However, unit tests are insufficient for evaluating grounded software engineering skillset. We explore using code review as a more scalable and insightful way to evaluate and improve coding agents, leveraging abundant real-world review data to enhance code quality and developer productivity, anticipating a future where code agents and humans collaborate on complex software problems. Our dataset is structured as follows:
        </p>
        <div className="flex justify-center mt-8">
          <img 
            src={`${import.meta.env.BASE_URL}methodology-image.png`} 
            alt="Methodology" 
            className="max-w-2xl w-full h-auto"
          />
        </div>
        <p className="text-center text-black max-w-4xl mx-auto mt-8 leading-relaxed">
          Essentially, this benchmark is broken up into two parts: data collection and evaluation. We explore these in more detail below.
        </p>
        <div className="max-w-4xl mx-auto mt-8 space-y-6">
          {/* Step 1 */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">1</span>
          </div>
              <div className="flex-1">
                <h3 className="text-base text-gray-900 font-semibold mb-2">Data Collection</h3>
                <p className="text-sm text-black leading-relaxed mb-4">
                  We scan a wide range of repositories on GitHub that match a specific set of criteria. We then use these to generate code review tasks. Through this process, we initially collect <strong>305,052</strong> tasks, out of which we choose <strong>216,267</strong> that match our check for standard workflows, followed by <strong>41,511</strong> that have a REQUEST_CHANGES commit (determined through the steps below), only choosing <strong>6,296</strong> high quality tasks for our final dataset.
                </p>
                <p className="text-sm text-black leading-relaxed mb-4">
              For each original PR, we generate a pair of APPROVE and REQUEST_CHANGES tasks. The pair of tasks share the same description and hint, but have different code patches with different verdicts. We also introduce a field  "Hint" to reduce some intrinsic ambiguity in the tasks, including missing context, inconsistent acceptance criteria, etc.
            </p>
            <div className="flex items-center justify-center mt-4">
              <img 
                src={`${import.meta.env.BASE_URL}data-collection-image.png`} 
                alt="Data Collection" 
                className="max-w-full h-auto"
              />
            </div>
                <p className="text-sm text-black leading-relaxed mt-4">
              We use an LLM to consolidate data from a raw PR and put it into the benchmark task.
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
                <h3 className="text-base text-gray-900 font-semibold mb-2">Evaluation Harness</h3>
                <p className="text-sm text-black leading-relaxed">
                  The evaluation harness component supports two types of agents.
                </p>
                
                {/* Expandable Type Boxes */}
                <div className="mt-6 space-y-3">
                  {/* Type 1: Code Review Agent Prompt */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedType1(!expandedType1)}
                      className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-between text-left"
                    >
                      <span className="text-sm font-medium text-black">Type 1: SOTA Model Code Review Agents</span>
                      <span className="text-lg text-black">{expandedType1 ? '−' : '+'}</span>
                    </button>
                    {expandedType1 && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-sm text-black leading-relaxed mb-4">
                          We converted SOTA coding agent CLIs into code review agents using a custom prompt that outputs structured JSON containing a verdict and explanation. During evaluation, repositories are cloned locally, a clean base branch is checked out, and the agent reviews an applied code patch.
                        </p>
                        <div className="mt-4">
                          <button
                            onClick={() => setShowCodePrompt(!showCodePrompt)}
                            className="flex items-center gap-2 text-blue-600 text-sm font-medium border-none bg-transparent p-0 cursor-pointer hover:text-blue-700 mb-3"
                          >
                            <span>CODE REVIEW AGENT PROMPT</span>
                            <span className="text-lg">{showCodePrompt ? '−' : '+'}</span>
                          </button>
                          {showCodePrompt && (
                            <div className="mt-3 p-4 bg-gray-50 rounded border border-gray-200">
                              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
{`# ROLE: Balanced Code Reviewer
## PHILOSOPHY: Ensure code correctly implements requirements while being practical about quality expectations. Approve solid implementations that work, but catch genuine issues that impact functionality or safety.

## TASK: Review git commit {{commit_sha}} against task requirements

## Task Requirements:
- **Title:** {{title}}
- **Description:** {{body}}
- **More details about the task:** {{hint}}

## Review Process:

### Step 1: Access the Commit
- Execute \`git show {{commit_sha}}\` to examine the commit
- If that fails, try \`git diff {{commit_sha}}~1 {{commit_sha}}\`
- If both fail, respond with ERROR

### Step 2: Systematic Evaluation

**Critical Assessment (Must Pass):**
1. **Requirement Implementation**:
  - Are the main requirements from the task description implemented?
  - Does the code deliver the core functionality described?
  - Are key features/fixes present and working?

2. **Functional Correctness**:
  - Does the code work without obvious bugs?
  - Are there logical errors that break functionality?
  - Does it maintain existing system behavior where expected?

3. **Safety & Security**:
  - Are there clear security issues (hardcoded secrets, injection vulnerabilities)?
  - Does the code introduce dangerous behaviors?

**Quality Assessment (Important but not blocking):**
4. **Implementation Quality**:
  - Is the approach reasonable and maintainable?
  - Are error conditions handled appropriately?
  - Is the code reasonably clean and understandable?

### Step 3: Decision Framework

**APPROVE when:**
- ✅ Main task requirements are substantially implemented
- ✅ Code appears functionally correct
- ✅ No serious security or safety issues
- ✅ Implementation approach is reasonable

**REQUEST_CHANGES when:**
- ❌ Core task requirements are missing or incomplete
- ❌ Code has bugs that prevent main functionality from working
- ❌ Clear security vulnerabilities are present
- ❌ Implementation is fundamentally flawed or broken
- ❌ Changes break existing functionality unnecessarily

**Consider acceptable (don't block for):**
- Minor style inconsistencies
- Non-critical error handling gaps
- Optimization opportunities
- Missing comments for straightforward code
- Perfect edge case coverage
- Minor refactoring opportunities

### Step 4: Balanced Assessment

**Focus Areas:**
- **Functional Completeness**: Does it do what it's supposed to do?
- **Correctness**: Does it work without breaking things?
- **Safety**: Are there genuine risks?
- **Reasonableness**: Is the implementation approach sound?

**Avoid over-strictness on:**
- Code style preferences
- Non-critical optimizations
- Theoretical edge cases
- Documentation completeness
- Perfect error handling

## Output Format:
\\\`\\\`\\\`json
{
   "verdict": "APPROVE" | "REQUEST_CHANGES" | "ERROR",
   "explanation": "Clear explanation focusing on requirement fulfillment and any significant issues. Be specific about what works or what critical problems exist."
}
\\\`\\\`\\\``}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Type 2: Github Code Review Bots */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedType2(!expandedType2)}
                      className="w-full px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors duration-200 flex items-center justify-between text-left"
                    >
                      <span className="text-sm font-medium text-black">Type 2: Github Code Review Bots</span>
                      <span className="text-lg text-black">{expandedType2 ? '−' : '+'}</span>
                    </button>
                    {expandedType2 && (
                      <div className="p-4 bg-white border-t border-gray-200">
                        <p className="text-sm text-black leading-relaxed">
                          For GitHub code review bots, we begin by remotely cloning repositories, creating a new pull request for each task, and assigning bots to conduct reviews. We extract the bot's verdict directly from its review text when possible - or, when a direct verdict isn't provided, we infer it from signals such as the number of high-priority inline comments.
                        </p>
                        <p className="text-sm text-black leading-relaxed mt-4">
                          To ensure fairness and prevent information leakage, we run both CLI-style and bot-style agents in isolated environments, especially given that modern agents may use external memory in task completion. CLI-style agents, each task requires the creation of a fresh local clone with a clean base branch; for bot-style agents, each evaluation uses a newly generated GitHub repository and a task-specific branch. Although clones currently retain full git histories, which advanced agents could potentially exploit, we plan to completely scrub Git histories in our future work.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Distributions Section */}
      <div className="px-2 md:px-12 pt-16 pb-6">
        <h2 className="text-center text-4xl text-black mb-6">Task Distributions</h2>

        {/* Bar Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Chart 1: Type (light blue) */}
          <div>
            <h3 className="text-base text-gray-900 mb-4 text-center">Type</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(craveTypes).map(([name, count]) => ({ name, "Count": count }))} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Count" fill="#3b82f6" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Language (slightly darker blue) */}
          <div>
            <h3 className="text-base text-gray-900 mb-4 text-center">Language</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(craveLanguages).map(([name, count]) => ({ name, "Count": count }))} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Count" fill="#2563eb" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Diff Size (darker blue) */}
          <div>
            <h3 className="text-base text-gray-900 mb-4 text-center">Diff Size</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(craveDiffSize).map(([name, count]) => ({ name, "Count": count }))} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Count" fill="#1d4ed8" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Repo Size (darkest blue) */}
          <div>
            <h3 className="text-base text-gray-900 mb-4 text-center">Repo Size</h3>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(craveRepoSize).map(([name, count]) => ({ name, "Count": count }))} margin={{ top: 5, right: 30, left: 20, bottom: 80 }}>
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Count" fill="#1e40af" radius={[8,8,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Evaluation Section */}
      <div className="px-2 md:px-12 pt-16 pb-6">
        <h2 className="text-center text-4xl text-black mb-6">Dataset Evaluation</h2>
        <p className="text-center text-black max-w-4xl mx-auto mb-8 leading-relaxed">
          Due to our heuristic-based generation method, we anticipate that the dataset may contain some poorly defined tasks, possibly from LLM errors or unexpected edge cases from PR threads. To assess the frequency of such issues and determine the overall quality of the dataset, we performed a manual inspection of a subset of the tasks. Although almost all tasks pass our inspections, we've begun building a manual inspection pipeline to further improve task quality.
        </p>
        
        {/* Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setSelectedEvaluation("hint")}
            className={`inline-flex items-center justify-center px-2 py-1 rounded-full border text-xs font-medium transition-all ${
              selectedEvaluation === "hint"
                ? "border-blue-600 text-blue-600 bg-blue-50"
                : "border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            Hint Contamination
          </button>
          <button
            onClick={() => setSelectedEvaluation("code")}
            className={`inline-flex items-center justify-center px-2 py-1 rounded-full border text-xs font-medium transition-all ${
              selectedEvaluation === "code"
                ? "border-blue-900 text-blue-900 bg-blue-50"
                : "border-blue-900 text-blue-900 hover:bg-blue-50"
            }`}
          >
            Issue Quality
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {selectedEvaluation === "hint" && (
            <div className="text-black">
              {/* Question 1 */}
              <div className="mb-10">
                <p className="mb-3">
                  Does the hint leak any line of code or specific code modification that would make code review too easy?
                </p>
                <div className="flex items-center justify-center gap-3 h-6 mt-4">
                  <div className="w-32 text-sm text-black text-left">PASS RATE</div>
                  <div className="w-96 relative h-6">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div 
                      className="absolute inset-y-0 left-0 rounded"
                      style={{ width: "100%", backgroundColor: "#2563eb" }}
                    ></div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-black">
                      100%
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 2 */}
              <div className="mb-10">
                <p className="mb-3">
                  Does the hint add any over-generalized requirement to the task and thus make the agent too strict? For example, the hint generalized a few formatting fixes in a single source file to "fix all formatting issues".
                </p>
                <div className="flex items-center justify-center gap-3 h-6 mt-4">
                  <div className="w-32 text-sm text-black text-left">PASS RATE</div>
                  <div className="w-96 relative h-6">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div 
                      className="absolute inset-y-0 left-0 rounded"
                      style={{ width: "100%", backgroundColor: "#2563eb" }}
                    ></div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-black">
                      100%
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 3 */}
              <div className="mb-10">
                <p className="mb-3">
                  Is there a mismatch between hint and actual implementation? For example, the hint included feedback from the reviewer that was dismissed or ignored later in the thread.
                </p>
                <div className="flex items-center justify-center gap-3 h-6 mt-4">
                  <div className="w-32 text-sm text-black text-left">PASS RATE</div>
                  <div className="w-96 relative h-6">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div 
                      className="absolute inset-y-0 left-0 rounded"
                      style={{ width: "95%", backgroundColor: "#2563eb" }}
                    ></div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-black">
                      95%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {selectedEvaluation === "code" && (
            <div className="text-black">
              <p className="mb-6">
                We want to ensure that the "breaking change" (i.e. subsequent commits) is indeed a meaningful code change and addressed by the approved solution. To do so, we evaluate the following:
              </p>

              {/* Question 1 */}
              <div className="mb-10">
                <p className="mb-3">
                  Is the "breaking change" meaningful enough - pointing out a gap in functionality or bug?
                </p>
                <div className="flex items-center justify-center gap-3 h-6 mt-4">
                  <div className="w-32 text-sm text-black text-left">PASS RATE</div>
                  <div className="w-96 relative h-6">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div 
                      className="absolute inset-y-0 left-0 rounded"
                      style={{ width: "85%", backgroundColor: "#1e3a8a" }}
                    ></div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-black">
                      85%
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 2 */}
              <div className="mb-10">
                <p className="mb-3">
                  Does the "breaking change" come from a specific feedback by the reviewer?
                </p>
                <div className="flex items-center justify-center gap-3 h-6 mt-4">
                  <div className="w-32 text-sm text-black text-left">PASS RATE</div>
                  <div className="w-96 relative h-6">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div 
                      className="absolute inset-y-0 left-0 rounded"
                      style={{ width: "100%", backgroundColor: "#1e3a8a" }}
                    ></div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-black">
                      100%
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 3 */}
              <div className="mb-10">
                <p className="mb-3">
                  Does the "breaking change" match one or a few subsequent commits on the PR?
                </p>
                <div className="flex items-center justify-center gap-3 h-6 mt-4">
                  <div className="w-32 text-sm text-black text-left">PASS RATE</div>
                  <div className="w-96 relative h-6">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div 
                      className="absolute inset-y-0 left-0 rounded"
                      style={{ width: "95%", backgroundColor: "#1e3a8a" }}
                    ></div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-black">
                      95%
                    </div>
                  </div>
                </div>
              </div>

              {/* Question 4 */}
              <div className="mb-10">
                <p className="mb-3">
                  Is the hint coherent with the "breaking change"?
                </p>
                <div className="flex items-center justify-center gap-3 h-6 mt-4">
                  <div className="w-32 text-sm text-black text-left">PASS RATE</div>
                  <div className="w-96 relative h-6">
                    <div className="absolute inset-0 bg-gray-200 rounded"></div>
                    <div 
                      className="absolute inset-y-0 left-0 rounded"
                      style={{ width: "95%", backgroundColor: "#1e3a8a" }}
                    ></div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-black">
                      95%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Access Section */}
      <div id="data-access-section" className="px-6 md:px-12 pt-16 pb-6">
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
                Our 1,200-task public dataset is available for download on Hugging Face.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://huggingface.co/datasets/TuringEnterprises/CRAVE"
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
              </div>
            </div>
          </div>

          {/* Commercial Dataset Box */}
          <Link
            to="/contact?source=crave"
            className="relative block border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
          >
            <div className="absolute -top-3 left-6">
              <span className="inline-flex items-center justify-center px-4 py-2 rounded-full border border-blue-900 text-blue-900 bg-white text-xs font-medium">
                Commercial
              </span>
            </div>
            <div className="pt-4">
              <p className="text-black leading-relaxed mb-4">
                Reach out to our team for access to our complete 6,296 tasks for code review.
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

