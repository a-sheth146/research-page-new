import { Link } from 'react-router-dom';

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

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pt-40">
      <div className="text-center mb-12">
        {/* <p className="text-2xl text-gray-600 mb-2">At Turing,</p> */}
        <h1 className="text-2xl md:text-6xl text-gray-900 mb-4">
          We're training superintelligence.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We build the systems that improve model performance in coding, real-world, economically valuable tasks, and advanced STEM reasoning.
        </p>
      </div>
      <div className="flex w-full bg-white pt-40">
        <div className="w-1/2 px-20">
          <h2 className="text-center text-2xl text-black-600 mb-6">Contributions</h2>
          <div className="space-y-0">
            <a
              href="https://arxiv.org/abs/2506.14074"
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors rounded-lg -mx-2 px-2"
            >
              <div>Verilog Benchmark</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">Evaluating LLMs and agents on RTL design and verification</p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                Read the paper <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag tag="Benchmark" />
              </div>
            </a>
            <div className="border-b border-gray-200 my-2"></div>
            <a
              href="https://arxiv.org/abs/2503.15661"
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors rounded-lg -mx-2 px-2"
            >
              <div>UI-Vision Benchmark</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">Desktop-centric GUI benchmark for visual perception and interaction</p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                Read the paper <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag tag="Multimodality" />
                <Tag tag="Benchmark" />
              </div>
            </a>
            <div className="border-b border-gray-200 my-2"></div>
            <a
              href="https://arxiv.org/abs/2504.13914"
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors rounded-lg -mx-2 px-2"
            >
              <div>Seed-Thinking-v1.5</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">Advancing superb reasoning models with reinforcement learning</p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                Read the paper <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag tag="RL" />
              </div>
            </a>
            <div className="border-b border-gray-200 my-2"></div>
            <a
              href="https://arxiv.org/abs/2502.12115"
              target="_blank"
              rel="noopener noreferrer"
              className="group block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors rounded-lg -mx-2 px-2"
            >
              <div>SWE-Lancer Benchmark</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">Evaluating LLMS on real freelancing software engineering tasks</p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                Read the paper <span className="ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag tag="Code" />
                <Tag tag="Benchmark" />
              </div>
            </a>
          </div>
        </div>
        <div className="w-1/2 px-20">
          <h2 className="text-center text-2xl text-black-600 mb-6">Turing Research</h2>
          <div className="space-y-0">
            <Link
              to="/swebench"
              className="block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors hover:bg-gray-50 rounded-lg -mx-2 px-2"
            >
              <div>Swe-bench++</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">A new framework for end-to-end evaluation and training of next-gen software engineering agents</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag tag="Code" />
                <Tag tag="Benchmark" />
              </div>
            </Link>
            <div className="border-b border-gray-200 my-2"></div>
            <a
              href="https://podcasts.apple.com/us/podcast/inside-rl-gyms-from-function-calls-to-simulated-universes/id1820303767?i=1000720426018"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors hover:bg-gray-50 rounded-lg -mx-2 px-2"
            >
              <div>RL Gyms for UI and Function-Calling Agents</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">Building environments for function-calling, computer use agents—and ultimately, entire universes</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag tag="RL" />
                <Tag tag="CUA" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
