import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, PlusCircle, User, MessageCircle, HelpCircle, LogOut, Search } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAppStore } from '../../store/useAppStore';
import { isAdminUser } from '../../auth/admin';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', adminOnly: true },
  { icon: Search, label: 'Explorar', path: '/explore' },
  { icon: Car, label: 'Pedir Carro', path: '/pedir-carro' },
  { icon: PlusCircle, label: 'Publicar', path: '/publish' },
  { icon: MessageCircle, label: 'Mensagens', path: '/messages' },
  { icon: User, label: 'Perfil', path: '/profile' },
  { icon: HelpCircle, label: 'Ajuda', path: '/help' },
];

export const Sidebar = () => {
  const { user, logout, setAuthModalOpen } = useAppStore();

  const visibleMenuItems = menuItems.filter(item => !item.adminOnly || isAdminUser(user));

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    const authPaths = ['/publish', '/messages', '/profile', '/settings', '/dashboard', '/my-rides'];
    if (!user && authPaths.includes(path)) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };

  return (
    <aside className="w-64 fixed left-0 top-16 bottom-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 hidden lg:flex flex-col shrink-0">
      <nav className="flex-1 px-4 space-y-1 mt-6">
        {visibleMenuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={(e) => handleNavClick(e, item.path)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all group',
              isActive 
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            )}
          >
            <item.icon size={20} className={cn('transition-colors')} />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800">
        <div className="bg-blue-600 rounded-xl p-5 text-white relative overflow-hidden mb-4">
          <div className="relative z-10">
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">Economia Sustentável</p>
            <p className="text-xs leading-snug">Poupe até 40% nas suas viagens interurbanas.</p>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white dark:bg-slate-900 opacity-10 rounded-full"></div>
        </div>

        {user && (
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full"
          >
            <LogOut size={20} />
            Sair da Conta
          </button>
        )}
      </div>
    </aside>
  );
};
