import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, Car, Camera, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store/useAppStore';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setAuthModalOpen } = useAppStore();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate register
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-slate-800/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
              <Car size={32} />
            </div>
            <span className="text-2xl font-bold tracking-tight text-blue-900 dark:text-blue-300">
              Morabeza<span className="text-blue-600">Rides</span>
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Criar sua conta</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Junte-se a milhares de viajantes em Cabo Verde</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl dark:shadow-none shadow-blue-900/5 border border-gray-100 dark:border-slate-800/50">
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="flex justify-center mb-6">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  <Camera size={24} className="text-gray-400" />
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-[10px] text-white font-bold uppercase">Upload</span>
                </div>
              </div>
            </div>

            <Input
              label="Nome Completo"
              placeholder="Ex: João Silva"
              icon={<User size={20} />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="E-mail"
              type="email"
              placeholder="seu@email.com"
              icon={<Mail size={20} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Crie uma senha forte"
              icon={<Lock size={20} />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-2xl flex gap-3 items-start">
              <ShieldCheck className="text-blue-600 shrink-0" size={20} />
              <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                Ao criares uma conta, concordas que o teu documento será solicitado para verificação de identidade após o login.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 mt-4"
              size="lg"
            >
              Criar Conta <ArrowRight size={20} />
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-8">
            Já tem uma conta?{' '}
            <button 
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
                setAuthModalOpen(true);
              }}
              className="text-blue-600 font-bold hover:underline cursor-pointer"
            >
              Fazer Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
