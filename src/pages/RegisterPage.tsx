import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, Car, Camera, ArrowRight, ShieldCheck, Phone } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppStore } from '../store/useAppStore';
import { registerUser } from './RegisterPage/service';
import { uploadImage } from '../services/upload';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isFretista, setIsFretista] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const navigate = useNavigate();
  const { setAuthModalOpen } = useAppStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await registerUser({ name, email, password, phone: phone || undefined, photoUrl: photoUrl || undefined, role: isFretista ? 'fretista' : 'passenger' });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Falha ao criar conta.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setIsUploadingPhoto(true);
    try {
      const uploaded = await uploadImage(file);
      setPhotoUrl(uploaded.url);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Falha ao carregar foto.');
    } finally {
      setIsUploadingPhoto(false);
    }
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
              Boleia
            </span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-50">Criar sua conta</h2>
          <p className="text-gray-500 dark:text-slate-400 mt-2">Junte-se a milhares de viajantes em Cabo Verde</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl dark:shadow-none shadow-blue-900/5 border border-gray-100 dark:border-slate-800/50">
          {error && (
            <div className="mb-5 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold leading-relaxed">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="flex justify-center mb-6">
              <label className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Foto de perfil" className="h-full w-full object-cover" />
                  ) : (
                    <Camera size={24} className="text-gray-400" />
                  )}
                </div>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-[10px] text-white font-bold uppercase">{isUploadingPhoto ? 'A carregar' : 'Upload'}</span>
                </div>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handlePhotoChange}
                  className="sr-only"
                  disabled={isUploadingPhoto}
                />
              </label>
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
              label="Telefone"
              type="tel"
              placeholder="Ex: +238 999 99 99"
              icon={<Phone size={20} />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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

            <label className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isFretista}
                onChange={(e) => setIsFretista(e.target.checked)}
                className="mt-1 h-4 w-4 accent-blue-600"
              />
              <span className="flex-1">
                <span className="block text-sm font-bold text-slate-800 dark:text-slate-100">Registar como fretista</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                  Ative esta opcao se pretende receber pedidos de carro/frete na plataforma.
                </span>
              </span>
            </label>

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
              isLoading={isSubmitting}
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
