import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function LeaderboardsPage() {
  // Commercial dataset data from SWEbench page
  const commercialEval = [
    { model: "claude-sonnet-4.5", split: "dev", pass_at_1: 0.2008 },
    { model: "gpt-5-2025-08-07", split: "dev", pass_at_1: 0.1690 },
    { model: "gpt5-high-reasoning", split: "dev", pass_at_1: 0.1670 },
    { model: "claude-opus-4.1", split: "dev", pass_at_1: 0.1570 },
    { model: "gemini/gemini-2.5-pro", split: "dev", pass_at_1: 0.0798 },
    { model: "gpt-4o", split: "dev", pass_at_1: 0.0375 },
    { model: "qwen3-coder", split: "dev", pass_at_1: 0.0183 }
  ];

  // Success rate data from CRAVE page
  const craveEvalSuccess = [
    { model: "claude-sonnet-4.5", success_rate: 0.5080 },
    { model: "claude-sonnet-4", success_rate: 0.4555 },
    { model: "gemini-2.5-pro", success_rate: 0.3845 },
    { model: "gpt-5-codex", success_rate: 0.3333 }
  ];

  // Color mapping for SWEbench models
  const swebenchModelColors = {
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

  // Color mapping for CRAVE models
  const craveModelColors = {
    "claude-sonnet-4.5": "#2563eb",
    "claude-sonnet-4": "#1e40af",
    "gemini-2.5-pro": "#ec4899",
    "gpt-5-codex": "#10b981",
  };

  const getSwebenchModelColor = (modelName) => {
    return swebenchModelColors[modelName] || "#2563eb";
  };

  const getCraveModelColor = (modelName) => {
    return craveModelColors[modelName] || "#2563eb";
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <div className="px-6 md:px-12 pt-12 pb-4">
        <motion.h1
          className="text-4xl md:text-5xl text-black text-center mb-12"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Our Leaderboards
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* SWE-bench++ Box */}
          <Link to="/swebench" className="block">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all cursor-pointer h-full relative">
              <h2 className="text-2xl font-semibold text-black mb-4 text-center">SWE-bench++</h2>
              <div>
                <p className="text-sm text-gray-600 text-center mb-4">N = 3,892 tasks</p>
                <div className="h-64 mb-8">
                  <div className="h-full flex flex-col justify-start gap-1 py-2">
                    {commercialEval.map((entry, index) => {
                      const percentage = entry.pass_at_1 * 100;
                      const barColor = getSwebenchModelColor(entry.model);
                      return (
                        <div key={`commercial-bar-${index}`} className="flex items-center gap-3 h-8">
                          <div className="w-48 text-sm text-black text-right pr-3 truncate" title={entry.model}>
                            {entry.model}
                          </div>
                          <div className="flex-1 relative h-6">
                            <div className="absolute inset-0 bg-gray-200 rounded"></div>
                            <div 
                              className="absolute inset-y-0 left-0 rounded"
                              style={{ width: `${percentage}%`, backgroundColor: barColor }}
                            ></div>
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
              <div className="absolute bottom-4 right-6 text-blue-600 text-sm font-medium flex items-center gap-1">
                See more <span>→</span>
              </div>
            </div>
          </Link>

          {/* Code Review Bench Box */}
          <Link to="/crave" className="block">
            <div className="p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all cursor-pointer h-full relative">
              <h2 className="text-2xl font-semibold text-black mb-4 text-center">Code Review Bench</h2>
              <div>
                <p className="text-sm text-gray-600 text-center mb-4">N = 1,200 tasks</p>
                <div className="flex flex-col justify-start gap-4 py-2">
                  {craveEvalSuccess.map((entry, index) => {
                    const percentage = entry.success_rate * 100;
                    const barColor = getCraveModelColor(entry.model);
                    return (
                      <div key={`success-bar-${index}`} className="flex items-center gap-3 h-6">
                        <div className="w-48 text-sm text-black text-right pr-3 truncate" title={entry.model}>
                          {entry.model}
                        </div>
                        <div className="flex-1 relative h-6">
                          <div className="absolute inset-0 bg-gray-200 rounded"></div>
                          <div 
                            className="absolute inset-y-0 left-0 rounded"
                            style={{ width: `${percentage}%`, backgroundColor: barColor }}
                          ></div>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-2 text-sm text-black">
                            {percentage.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="absolute bottom-4 right-6 text-blue-600 text-sm font-medium flex items-center gap-1">
                See more <span>→</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Get Commercial Dataset Access Section */}
      <div className="px-6 md:px-12 pt-32 pb-6">
        <div className="max-w-4xl mx-auto">
          <Link to="/contact" className="block w-full p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-all cursor-pointer text-left">
            <h2 className="text-center text-4xl text-black mb-4">Work with us to improve your models</h2>
            <p className="text-center text-black mb-8">
              We offer access to private datasets and agentic trajectories for SFT and DPO. Reach out to our team for a chat!
            </p>
            <div className="flex justify-center">
              <div className="rounded-full bg-white border border-blue-600 text-sm text-blue-600 px-6 py-2 uppercase hover:bg-blue-50 active:bg-blue-100 transition-colors duration-200">
                Contact Us
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
