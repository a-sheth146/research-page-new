import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white pt-40">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-6xl text-gray-900 mb-4">
          We're training superintelligence.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We build the systems that improve model performance in coding, real-world, economically valuable tasks, and advanced STEM reasoning.
        </p>
      </div>
      <div className="flex w-full bg-white pt-40">
        <div className="w-1/2 px-20">
          <div className="space-y-0">
            <a
              href="https://arxiv.org/abs/2506.14074"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors hover:bg-gray-50 rounded-lg -mx-2 px-2"
            >
              <div>Verilog Benchmark</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">Evaluating LLMs and agents on RTL design and verification</p>
            </a>
            <div className="border-b border-gray-200 my-2"></div>
            <a
              href="https://arxiv.org/abs/2503.15661"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors hover:bg-gray-50 rounded-lg -mx-2 px-2"
            >
              <div>UI-Vision Benchmark</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">Desktop-centric GUI benchmark for visual perception and interaction</p>
            </a>
            <div className="border-b border-gray-200 my-2"></div>
            <a
              href="https://arxiv.org/abs/2504.13914"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors hover:bg-gray-50 rounded-lg -mx-2 px-2"
            >
              <div>Seed-Thinking-v1.5</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">Advancing superb reasoning models with reinforcement learning</p>
            </a>
            <div className="border-b border-gray-200 my-2"></div>
            <a
              href="https://arxiv.org/abs/2502.12115"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors hover:bg-gray-50 rounded-lg -mx-2 px-2"
            >
              <div>SWE-Lancer Benchmark</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">Evaluating LLMS on real freelancing software engineering tasks</p>
            </a>
          </div>
        </div>
        <div className="w-1/2 px-20">
          <div className="space-y-0">
            <Link
              to="/swebench"
              className="block py-3 text-2xl text-gray-900 hover:text-gray-700 transition-colors hover:bg-gray-50 rounded-lg -mx-2 px-2"
            >
              <div>Swe-bench++</div>
              <p className="text-sm text-gray-600 mb-2 mt-1">A new framework for end-to-end evaluation and training of next-gen software engineering agents</p>
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
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
