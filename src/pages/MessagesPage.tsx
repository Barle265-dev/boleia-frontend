import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { MessageSquare, ArrowRight, UserCheck } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const MessagesPage = () => {
  const { messages, rides, users, user } = useAppStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-slate-400">Por favor, faça login para ver as suas mensagens.</p>
      </div>
    );
  }

  // Filter ride messages (exclude admin-help chats)
  const rideMessagesByRide = messages.reduce((acc, m) => {
    if (!m.rideId || m.rideId.startsWith('admin-help-')) return acc;
    
    // Check if the current user is part of the ride
    const ride = rides.find(r => r.id === m.rideId);
    if (!ride) return acc;

    const isParticipant = ride.driverId === user.id || ride.passengers.includes(user.id);
    if (!isParticipant) return acc;

    // We only want to group by ride. Keep the latest message for each ride.
    const existing = acc[m.rideId];
    if (!existing || new Date(m.timestamp) > new Date(existing.timestamp)) {
      acc[m.rideId] = m;
    }
    return acc;
  }, {} as Record<string, typeof messages[0]>);

  const inboxItems = Object.values(rideMessagesByRide).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight uppercase flex items-center gap-3">
          <MessageSquare className="text-blue-600 w-8 h-8" />
          Mensagens Recebidas
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
          Consulte as mensagens e discussões ativas com passageiros e motoristas das suas viagens. Clique para abrir os detalhes.
        </p>
      </header>

      <div className="space-y-4">
        {inboxItems.length > 0 ? (
          inboxItems.map((item, index) => {
            const ride = rides.find(r => r.id === item.rideId);
            if (!ride) return null;

            const sender = users.find(u => u.id === item.senderId);
            const isOwn = item.senderId === user.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="p-6 bg-white dark:bg-slate-900 hover:border-blue-400 border-slate-200 dark:border-slate-800 transition-all shadow-sm dark:shadow-none flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer group"
                  onClick={() => navigate(`/ride/${ride.id}?view=chat`)}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative shrink-0">
                      <img 
                        src={sender?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                        alt={sender?.name || 'Utilizador'} 
                        className="w-12 h-12 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 border-2 border-white shadow-sm dark:shadow-none"
                      />
                      {sender?.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-0.5 rounded-full border border-white">
                          <UserCheck size={8} />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-50 text-sm">
                          {isOwn ? `Tu para ${ride.driverId === user.id ? 'Passageiro' : ride.driver.name}` : sender?.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {format(new Date(item.timestamp), "d 'de' MMM, HH:mm", { locale: ptBR })}
                        </span>
                        {!isOwn && (
                          <Badge variant="primary" className="bg-blue-50 text-blue-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Nova mensagem
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 italic pr-4 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        "{item.text}"
                      </p>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 pt-1">
                        <span className="text-blue-600 font-extrabold">{ride.origin}</span>
                        <span>➔</span>
                        <span className="text-slate-600 dark:text-slate-400 font-extrabold">{ride.destination}</span>
                        <span className="text-slate-300">•</span>
                        <span>{format(new Date(ride.departureTime), "dd 'de' MMMM", { locale: ptBR })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Button variant="ghost" size="sm" className="gap-2 text-blue-600 font-bold text-xs group-hover:bg-blue-50/80 rounded-xl">
                      Ir para Conversa <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <Card className="p-16 text-center border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-3xl animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 text-slate-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-sm dark:shadow-none">
              <MessageSquare size={28} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50">Nenhuma mensagem pendente</h3>
            <p className="text-slate-550 text-xs max-w-sm mx-auto mt-2 leading-relaxed">
              Não tens mensagens ativas nas tuas boleias de momento. Quando combinares detalhes com passageiros ou motoristas, as mensagens aparecerão aqui.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};
