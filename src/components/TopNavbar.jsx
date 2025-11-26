import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

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

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 h-16 bg-white z-50 transition-transform duration-300",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      <div className="h-full flex items-center px-6 overflow-x-auto">
        <div className="flex items-center space-x-4 flex-nowrap min-w-max">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const isHome = item.name === 'Home';
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center gap-2 px-4 py-2 rounded-lg text-base whitespace-nowrap flex-shrink-0',
                  isHome
                    ? '' // No background or color changes for Home
                    : cn(
                        'transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-black hover:bg-gray-50 hover:text-gray-900'
                      )
                )}
              >
                {isHome ? (
                  <img 
                    src={`${import.meta.env.BASE_URL}home-icon.png`}
                    alt="Home" 
                    className="h-8 w-8 object-contain flex-shrink-0"
                  />
                ) : (
                  <span>{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

