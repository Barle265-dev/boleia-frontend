import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Car } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store/useAppStore';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAppStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha na autenticação');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-800/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Car size={32} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-blue-900 dark:text-blue-300">
              Boleia
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Bem-vindo de volta</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Entre na sua conta para continuar</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl dark:shadow-none shadow-blue-900/5 border border-gray-100 dark:border-slate-800/50">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold leading-relaxed shadow-sm dark:shadow-none"
            >
              ⚠️ {error}
            </motion.div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail size={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-gray-700">Senha</label>
                <button type="button" className="text-xs font-semibold text-blue-600 hover:underline">Esqueceu a senha?</button>
              </div>
              <Input
                type="password"
                placeholder="********"
                icon={<Lock size={20} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full gap-2 mt-2"
              isLoading={isLoading}
              size="lg"
            >
              Entrar <ArrowRight size={20} />
            </Button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100 dark:border-slate-800/50"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-900 px-4 text-gray-400 font-medium">Ou continue com</span>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-slate-400">
            Não tem uma conta?{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              Registe-se agora
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
