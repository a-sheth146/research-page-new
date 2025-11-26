import { Link } from 'react-router-dom';
import { useState } from 'react';

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
  const episodes = [
    {
      number: 5,
      date: 'AUG 2025',
      title: "Learning from Reid Hoffman's AI Clone | The Multimodal Frontier",
      link: 'https://podcasts.apple.com/us/podcast/learning-from-reid-hoffmans-ai-clone-the-multimodal/id1820303767?i=1000722016579'
    },
    {
      number: 4,
      date: 'AUG 2025',
      title: 'GPT-5 and SWE-Bench: A Launchpad for O5-Level Code Reasoning',
      link: 'https://podcasts.apple.com/us/podcast/gpt-5-and-swe-bench-a-launchpad-for-o5-level-code-reasoning/id1820303767?i=1000721205625'
    },
    {
      number: 3,
      date: 'AUG 2025',
      title: 'Inside RL Gyms: From Function Calls to Simulated Universes',
      link: 'https://podcasts.apple.com/us/podcast/inside-rl-gyms-from-function-calls-to-simulated-universes/id1820303767?i=1000720426018'
    },
    {
      number: 2,
      date: 'JUL 2025',
      title: 'From RL Gyms to Enterprise Superintelligence',
      link: 'https://podcasts.apple.com/us/podcast/from-rl-gyms-to-enterprise-superintelligence/id1820303767?i=1000715567216'
    },
    {
      number: 1,
      date: 'JUN 2025',
      title: 'Why Turing Is Switzerland',
      link: 'https://podcasts.apple.com/us/podcast/why-turing-is-switzerland/id1820303767?i=1000712663112'
    }
  ];

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  const nextEpisode = () => {
    if (currentEpisodeIndex < episodes.length - 1) {
      setCurrentEpisodeIndex((prev) => prev + 1);
    }
  };

  const prevEpisode = () => {
    if (currentEpisodeIndex > 0) {
      setCurrentEpisodeIndex((prev) => prev - 1);
    }
  };

  const isFirstEpisode = currentEpisodeIndex === episodes.length - 1; // Episode 1 (index 4)
  const isLastEpisode = currentEpisodeIndex === 0; // Episode 5 (index 0)

  const currentEpisode = episodes[currentEpisodeIndex];

  return (
    <div className="min-h-screen bg-white pt-40">
      {/* Header Section - Left Aligned */}
      <div className="mb-20">
        <h1 className="text-2xl md:text-6xl text-gray-900 mb-4 text-left">
          We're training superintelligence.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl text-left">
          We take a research-driven approach to building the systems that improve model performance in coding, real-world, economically valuable tasks, and advanced STEM reasoning.
        </p>
      </div>

      {/* Dataset Releases and Podcast Section */}
      <div className="flex w-full gap-8 mb-16">
        {/* Left Column: Dataset Releases */}
        <div className="flex-[2]">
          <h2 className="text-2xl font-bold text-black mb-6">Dataset Releases</h2>
          <div className="space-y-4">
            {/* SWE Bench ++ */}
            <Link
              to="/swebench"
              className="group block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">SWE Bench ++</h3>
                  <p className="text-sm text-gray-600">A new framework for end-to-end evaluation and training of next-gen software engineering agents</p>
                </div>
                <div className="flex flex-col gap-2 ml-4 items-end">
                  <a
                    href="https://huggingface.co/datasets/TuringEnterprises/SWE-Bench-plus-plus"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    <img src="/hf-logo.svg" alt="Hugging Face" className="w-10 h-10" />
                  </a>
                  <a
                    href="https://github.com/TuringEnterprises/SWE-Bench-plus-plus"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    <img src="/gh-logo.png" alt="GitHub" className="w-10 h-10" />
                  </a>
                </div>
              </div>
              <p className="text-sm text-blue-600 flex items-center mt-3">
                Read the release <span className="ml-1">→</span>
              </p>
            </Link>

            {/* Code Review Benchmark */}
            <Link
              to="/crave"
              className="group block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Code Review Benchmark</h3>
                  <p className="text-sm text-gray-600">We introduce a benchmark for high quality code review, enabling more robust evaluation of agentic code partners.</p>
                </div>
                <div className="flex flex-col gap-2 ml-4 items-end">
                  <a
                    href="https://huggingface.co/datasets/TuringEnterprises/CRAVE"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1 hover:opacity-80 transition-opacity"
                  >
                    <img src="/hf-logo.svg" alt="Hugging Face" className="w-10 h-10" />
                  </a>
                </div>
              </div>
              <p className="text-sm text-blue-600 flex items-center mt-3">
                Read the release <span className="ml-1">→</span>
              </p>
            </Link>
          </div>
        </div>

        {/* Right Column: Podcast */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-black mb-6">Podcast</h2>
          <a
            href={currentEpisode.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-gray-200 rounded-lg p-4 space-y-4 hover:bg-gray-50 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
          >
            {/* Episode Cover Image */}
            <div className="flex justify-center">
              <div className="block transition-transform duration-300 group-hover:scale-105">
                <img 
                  src="/podcast-logo.webp" 
                  alt="Podcast cover" 
                  className="w-32 h-32 border border-gray-200 rounded-lg object-cover"
                />
              </div>
            </div>
            
            {/* Episode Info */}
            <div>
              <p className="text-base text-gray-900 mb-2">
                EP {currentEpisode.number}, {currentEpisode.date}
              </p>
              <div className="block text-xl font-bold text-gray-900 group-hover:text-gray-700 mb-4 leading-tight">
                {currentEpisode.title}
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex gap-2 justify-center" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    prevEpisode();
                  }}
                  disabled={isLastEpisode}
                  className={`w-12 h-8 flex items-center justify-center border rounded-full transition-colors ${
                    isLastEpisode
                      ? 'border-gray-400 text-gray-400 bg-gray-100'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                  aria-label="Previous episode"
                >
                  &lt;
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    nextEpisode();
                  }}
                  disabled={isFirstEpisode}
                  className={`w-12 h-8 flex items-center justify-center border rounded-full transition-colors ${
                    isFirstEpisode
                      ? 'border-gray-400 text-gray-400 bg-gray-100'
                      : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                  }`}
                  aria-label="Next episode"
                >
                  &gt;
                </button>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Research & Contributions Section */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-black mb-6">Research & Contributions</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Verilog Benchmark */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
            <a
              href="https://arxiv.org/abs/2506.14074"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Verilog Benchmark</h3>
              <p className="text-sm text-gray-600 mb-2">Evaluating LLMs and agents on RTL design and verification</p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                Read the paper <span className="ml-1">→</span>
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag tag="Benchmark" />
              </div>
            </a>
          </div>

          {/* UI-Vision Benchmark */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
            <a
              href="https://arxiv.org/abs/2503.15661"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">UI-Vision Benchmark</h3>
              <p className="text-sm text-gray-600 mb-2">Desktop-centric GUI benchmark for visual perception and interaction</p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                Read the paper <span className="ml-1">→</span>
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag tag="Multimodality" />
                <Tag tag="Benchmark" />
              </div>
            </a>
          </div>

          {/* Seed-Thinking-v1.5 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
            <a
              href="https://arxiv.org/abs/2504.13914"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">Seed-Thinking-v1.5</h3>
              <p className="text-sm text-gray-600 mb-2">Advancing superb reasoning models with reinforcement learning</p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                Read the paper <span className="ml-1">→</span>
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag tag="RL" />
              </div>
            </a>
          </div>

          {/* SWE-Lancer Benchmark */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
            <a
              href="https://arxiv.org/abs/2502.12115"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">SWE-Lancer Benchmark</h3>
              <p className="text-sm text-gray-600 mb-2">Evaluating LLMS on real freelancing software engineering tasks</p>
              <p className="text-sm text-blue-600 mt-2 flex items-center">
                Read the paper <span className="ml-1">→</span>
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Tag tag="Code" />
                <Tag tag="Benchmark" />
              </div>
            </a>
          </div>

          {/* RL Gyms for UI and Function-Calling Agents */}
          <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
            <a
              href="https://podcasts.apple.com/us/podcast/inside-rl-gyms-from-function-calls-to-simulated-universes/id1820303767?i=1000720426018"
              target="_blank"
              rel="noopener noreferrer"
              className="group block"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">RL Gyms for UI and Function-Calling Agents</h3>
              <p className="text-sm text-gray-600 mb-2">Building environments for function-calling, computer use agents—and ultimately, entire universes</p>
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
