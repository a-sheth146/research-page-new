import { useNavigate } from 'react-router-dom';

export default function CodePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        <h1 className="text-4xl md:text-6xl text-gray-900 mb-8">
          Code
        </h1>
        
        <div 
          className="w-full hover:bg-blue-50 p-6 cursor-pointer transition-colors border-b border-gray-200"
          onClick={() => navigate('/swebench')}
        >
          <div className="text-left">
            <div className="text-base text-blue-600 mb-2">NEW</div>
            <div className="text-2xl text-gray-900 mb-2">Beyond SWE-Bench: SWE-Bench++</div>
            <div className="text-lg text-gray-700">We introduce a new framework for end-to-end evaluation and training of next-gen software engineering agents.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
