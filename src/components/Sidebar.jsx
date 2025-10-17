import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Code', href: '/code' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-sm z-50">
      <div className="h-full flex flex-col justify-center">
        <nav className="space-y-2 px-6">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center justify-between px-4 py-3 rounded-lg text-base transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-black hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <span>{item.name}</span>
                {item.name === 'Code' && (
                  <ArrowRight className={cn(
                    "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                    isActive ? "text-blue-700" : "text-black"
                  )} />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
