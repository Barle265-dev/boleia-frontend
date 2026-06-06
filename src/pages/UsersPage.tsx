import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { UserCheck, Star, ShieldCheck, MapPin, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';

export const UsersPage = () => {
  const { users } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">Comunidade</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium italic">Conheça os membros verificados do Boleia.</p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none w-full md:w-80">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Procurar membros..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none outline-none text-sm font-medium w-full"
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((u, i) => (
          <motion.div
            key={u.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-0 overflow-hidden group">
              <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]" />
                <div className="absolute -bottom-10 left-6">
                  <div className="relative">
                    <img 
                      src={u.photoUrl} 
                      alt={u.name} 
                      className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl dark:shadow-none object-cover bg-white dark:bg-slate-900"
                    />
                    {u.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-lg border-2 border-white shadow-sm dark:shadow-none">
                        <UserCheck size={12} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-12 p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-50 text-lg uppercase tracking-tight">{u.name}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant={u.vehicle ? 'primary' : 'neutral'} className="text-[10px] uppercase font-bold tracking-widest px-2">
                       {u.vehicle ? 'Com Veículo' : 'Membro'}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={12} fill="currentColor" />
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-50">{u.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin size={14} />
                    <span className="text-xs font-medium">Cidade da Praia, Santiago</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <ShieldCheck size={14} />
                    <span className="text-xs font-medium italic">Documento verificado</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-center">
                    <p className="text-lg font-black text-blue-600">{u.totalTrips}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Viagens</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl text-center">
                    <p className="text-lg font-black text-yellow-500">98%</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Positivo</p>
                  </div>
                </div>

                <Link to={`/profile/${u.id}`} className="block w-full">
                  <Button variant="outline" className="w-full group-hover:bg-blue-600 group-hover:text-white transition-all cursor-pointer">
                    Ver Perfil
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
