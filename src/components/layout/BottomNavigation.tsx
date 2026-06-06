import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { CalendarCheck, Car, MessageCircle, PlusCircle, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/useAppStore';

const navItems = [
  { icon: Search, label: 'Explorar', path: '/', activePaths: ['/', '/explore'] },
  { icon: Car, label: 'Pedir carro', path: '/pedir-carro' },
  { icon: PlusCircle, label: 'Publicar', path: '/publish', requiresAuth: true },
  { icon: MessageCircle, label: 'Mensagens', path: '/messages', requiresAuth: true },
  { icon: CalendarCheck, label: 'Viagens', path: '/my-rides', requiresAuth: true },
];

export const BottomNavigation = () => {
  const { user, setAuthModalOpen } = useAppStore();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, requiresAuth?: boolean) => {
    if (!user && requiresAuth) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <div className="grid h-16 w-full grid-cols-5 items-stretch">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            aria-label={item.label}
            title={item.label}
            onClick={(e) => handleNavClick(e, item.requiresAuth)}
            className={({ isActive }) => cn(
              'flex h-full min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 md:flex-row md:gap-2 md:px-3',
              (isActive || item.activePaths?.includes(location.pathname)) &&
                'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            )}
          >
            <item.icon size={22} strokeWidth={2.25} />
            <span className="hidden min-w-0 truncate text-xs font-semibold md:block">
              {item.label}
            </span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
