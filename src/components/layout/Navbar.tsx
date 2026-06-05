import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Moon, Sun } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { NotificationCenter } from '../ui/NotificationCenter';

export const Navbar = () => {
  const { user, setAuthModalOpen, theme, toggleTheme, freightRequests } = useAppStore();

  const pendingFreightCount = user?.role === 'fretista'
    ? freightRequests.filter((request) =>
        (request.status === 'pending' &&
          (!request.specificFretistaId || request.specificFretistaId === user.id)) ||
        (['accepted', 'in_progress'].includes(request.status) && request.fretistaId === user.id)
      ).length
    : 0;

  const handleAuthAction = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-3 h-16 flex items-center">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Car size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 hidden sm:block">
            Morabeza<span className="text-blue-600">Rides</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/explore" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-colors">Encontrar Boleia</Link>
          <Link onClick={handleAuthAction} to="/publish" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-colors">Publicar Trajeto</Link>
          <Link to="/community" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-colors">Comunidade</Link>
          {user && (
            <Link to="/my-rides" className="relative text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-colors">
              Minhas Viagens
              {pendingFreightCount > 0 && (
                <span className="absolute -top-2 -right-4 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {pendingFreightCount}
                </span>
              )}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {user && <NotificationCenter />}
          
          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Verificado</p>
              </div>
              <Link to="/profile" className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden">
                <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
              </Link>
            </div>
          ) : (
            <>
              <Button onClick={() => setAuthModalOpen(true)} variant="ghost" size="sm" className="hidden sm:flex text-slate-600 dark:text-slate-300 cursor-pointer">Entrar</Button>
              <Button onClick={() => setAuthModalOpen(true)} variant="primary" size="sm" className="cursor-pointer">Começar</Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
