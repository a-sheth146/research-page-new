import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import CodePage from './pages/CodePage';
import SWEbenchResearchPage from './SWEbenchResearchPage';

function App() {
  return (
    <Router basename="/research-page-new">
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 ml-64">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/code" element={<CodePage />} />
            <Route path="/swebench" element={<SWEbenchResearchPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
