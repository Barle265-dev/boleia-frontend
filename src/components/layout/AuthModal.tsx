import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { X, Mail, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

export const AuthModal = () => {
  const { isAuthModalOpen, setAuthModalOpen, login, isLoading } = useAppStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password || undefined);
      setAuthModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao iniciar sessão');
    }
  };

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAuthModalOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120]"
          />
          
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-x-0 bottom-0 z-[130] max-h-[calc(100dvh-1rem)] overflow-y-auto bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl dark:shadow-none p-6 pb-28 sm:max-w-md sm:mx-auto sm:bottom-6 sm:rounded-3xl sm:pb-8 border-t border-slate-200 dark:border-slate-800"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase">Iniciar Sessão</h2>
              <button
                onClick={() => setAuthModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-medium">
              Por favor, inicie sessão para continuar e aceder às funcionalidades.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 pb-4">
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold text-center mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors">
                  <Mail size={18} className="text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="teuemail@cv.com"
                    className="bg-transparent border-none outline-none w-full text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Palavra-passe</label>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 focus-within:border-blue-500 dark:focus-within:border-blue-500 transition-colors">
                  <Lock size={18} className="text-slate-400" />
                  <input
                    type="password"
                    placeholder="123456 (Apenas Administrador)"
                    className="bg-transparent border-none outline-none w-full text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-4 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md dark:shadow-none transition-all uppercase tracking-wide text-sm"
              >
                {isLoading ? 'A entrar...' : 'Entrar'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Não tens uma conta?{' '}
                <Link 
                  to="/register" 
                  onClick={() => {
                    setAuthModalOpen(false);
                  }}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Registre-se agora
                </Link>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
