import { useState } from 'react';
import { Bell, Check, Info, MessageSquare, Car, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, markNotificationAsRead } = useAppStore();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'request': return <Car size={16} />;
      case 'confirmation': return <Check size={16} />;
      case 'message': return <MessageSquare size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'request': return 'bg-blue-100 text-blue-600';
      case 'confirmation': return 'bg-emerald-100 text-emerald-600';
      case 'message': return 'bg-purple-100 text-purple-600';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800/50 z-50 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-slate-50">Notificações</h3>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{unreadCount} Novas</span>
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        markNotificationAsRead(n.id);
                        if (n.link) setIsOpen(false);
                      }}
                      className={cn(
                        "p-4 border-b border-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 transition-colors cursor-pointer flex gap-3 relative",
                        !n.isRead && "bg-blue-50/30"
                      )}
                    >
                      {n.link && <Link to={n.link} className="absolute inset-0 z-10" onClick={() => setIsOpen(false)} />}
                      <div className={cn("shrink-0 w-8 h-8 rounded-lg flex items-center justify-center relative z-20", getColor(n.type))}>
                        {getIcon(n.type)}
                      </div>
                      <div className="space-y-1 relative z-20">
                        <div className="flex items-center justify-between gap-2">
                           <p className="text-xs font-bold text-slate-900 dark:text-slate-50 leading-tight">{n.title}</p>
                           <span className="text-[10px] text-slate-400 whitespace-nowrap">
                             {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true, locale: ptBR })}
                           </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{n.message}</p>
                        {n.link && (
                          <div className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-tighter pt-1">
                            Ver detalhes <ExternalLink size={10} />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-400">
                    <p className="text-sm">Nenhuma notificação</p>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 text-center">
                <button className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors">
                  Marcar todas como lidas
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
