import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import TopNavbar from './components/TopNavbar';
import HomePage from './pages/HomePage';
import SWEbenchResearchPage from './pages/SWEbenchResearchPage';
import CRAVEPage from './pages/CRAVEPage';
import LeaderboardsPage from './pages/LeaderboardsPage';
import ContactPage from './pages/ContactPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    // GitHub Pages:
    <Router basename="/research-page-new">
    {/* Localhost: <Router> */}
      <ScrollToTop />
      <div className="min-h-screen bg-white flex flex-col">
        <TopNavbar />
        <main className="pt-16 flex-1 px-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/swebench" element={<SWEbenchResearchPage />} />
            <Route path="/crave" element={<CRAVEPage />} />
            <Route path="/leaderboards" element={<LeaderboardsPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </main>
        <footer className="bg-white px-6 h-96 flex flex-col justify-end pb-4">
          <p className="text-gray-600 text-sm">© 2025 Turing</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
