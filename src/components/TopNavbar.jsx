import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Swe-bench++', href: '/swebench' },
  { name: 'Code Review Bench', href: '/crave' },
  { name: 'Leaderboards', href: '/leaderboards' },
  { name: 'Get in Touch', href: '/contact' },
];

export default function TopNavbar() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show at the top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const homeItem = navigation.find(item => item.name === 'Home');
  const otherItems = navigation.filter(item => item.name !== 'Home');

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 h-16 bg-white z-50 transition-transform duration-300 shadow-sm",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="h-full flex items-center justify-between px-6">
        {/* Home Logo - Always visible */}
        {homeItem && (
          <Link
            to={homeItem.href}
            className="flex items-center flex-shrink-0"
          >
            <img 
              src={`${import.meta.env.BASE_URL}home-icon.png`}
              alt="Home" 
              className="h-8 w-auto object-contain"
            />
          </Link>
        )}

        {/* Desktop Navigation - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4 flex-nowrap">
          {otherItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center gap-2 px-4 py-2 rounded-lg text-base whitespace-nowrap flex-shrink-0 transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-black hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button - Visible only on mobile */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 focus:outline-none"
          aria-label="Toggle menu"
        >
          <motion.span
            className="w-6 h-0.5 bg-gray-900 rounded"
            animate={{
              rotate: isMobileMenuOpen ? 45 : 0,
              y: isMobileMenuOpen ? 8 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="w-6 h-0.5 bg-gray-900 rounded"
            animate={{
              opacity: isMobileMenuOpen ? 0 : 1,
            }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="w-6 h-0.5 bg-gray-900 rounded"
            animate={{
              rotate: isMobileMenuOpen ? -45 : 0,
              y: isMobileMenuOpen ? -8 : 0,
            }}
            transition={{ duration: 0.3 }}
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              className="fixed top-16 left-0 right-0 bg-white shadow-lg z-40 md:hidden border-t border-gray-200"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="px-4 py-2">
                {otherItems.map((item, index) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          'block px-4 py-3 rounded-lg text-base font-medium transition-colors mb-1',
                          isActive
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-900 hover:bg-gray-50'
                        )}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}

