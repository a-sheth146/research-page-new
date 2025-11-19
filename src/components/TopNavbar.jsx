import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Code', href: '/code' },
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
      <div className="h-full flex items-center px-6">
        <div className="flex items-center space-x-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const isHome = item.name === 'Home';
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center gap-2 px-4 py-2 rounded-lg text-base',
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
                    src="/home-icon.png" 
                    alt="Home" 
                    className="h-8 w-8 object-contain"
                  />
                ) : (
                  <span>{item.name}</span>
                )}
                {item.name === 'Code' && (
                  <ArrowRight className={cn(
                    "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                    isActive ? "text-blue-700" : "text-black"
                  )} />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

