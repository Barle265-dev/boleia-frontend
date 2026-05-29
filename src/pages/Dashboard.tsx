import { useAppStore } from '../store/useAppStore';
import { AdminPanel } from '../components/AdminPanel';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAppStore();
  const navigate = useNavigate();

  const isAdmin = user?.email === 'joel@gmail.com';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-md mx-auto animate-in fade-in duration-300">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm dark:shadow-none mb-6">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 tracking-tight mb-2">Acesso Restrito</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
          Esta área é de uso exclusivo para o administrador da plataforma para monitorização de métricas, gestão de utilizadores e aprovação de documentação de motoristas.
        </p>
        <Button onClick={() => navigate('/explore')} variant="primary" className="w-full py-3 font-bold cursor-pointer">
          Ir para Encontrar Boleia
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <AdminPanel />
    </div>
  );
};
