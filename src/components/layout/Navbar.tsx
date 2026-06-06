import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, HelpCircle, LogOut, Moon, Sun, User } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { Button } from '../ui/Button';
import { NotificationCenter } from '../ui/NotificationCenter';

export const Navbar = () => {
  const { user, setAuthModalOpen, theme, toggleTheme, logout } = useAppStore();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-3 h-16 flex items-center">
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Car size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 hidden sm:block">
            Boleia
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/help"
            aria-label="Ajuda"
            title="Ajuda"
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <HelpCircle size={20} />
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors cursor-pointer rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {user && <NotificationCenter />}
          
          {user ? (
            <div className="flex items-center gap-4 border-l pl-4 border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.name}</p>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">Verificado</p>
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsProfileMenuOpen((value) => !value)}
                  className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden"
                  aria-label="Menu do perfil"
                >
                  <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                </button>

                {isProfileMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                    <div className="absolute right-0 top-12 z-50 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          navigate('/profile');
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        <User size={14} /> Meu Perfil
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <Button onClick={() => setAuthModalOpen(true)} variant="primary" size="sm" className="cursor-pointer">Entrar</Button>
          )}
        </div>
      </div>
    </nav>
  );
};
