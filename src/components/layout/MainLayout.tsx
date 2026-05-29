import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../../store/useAppStore';
import { AnimatePresence, motion } from 'motion/react';
import { Car, ArrowRight, BellRing } from 'lucide-react';
import type { Notification } from '../../types';

export const MainLayout = () => {
  const { user, notifications, markNotificationAsRead } = useAppStore();
  const navigate = useNavigate();
  const [activeRequestNotification, setActiveRequestNotification] = useState<Notification | null>(null);

  useEffect(() => {
    if (!user) return;
    const latestUnreadRequest = notifications.find(
      (n) => n.userId === user.id && n.type === 'request' && !n.isRead
    );

    if (latestUnreadRequest) {
      setActiveRequestNotification(latestUnreadRequest);
    } else {
      setActiveRequestNotification(null);
    }
  }, [notifications, user]);

  const handleRedirect = () => {
    if (activeRequestNotification) {
      markNotificationAsRead(activeRequestNotification.id);
      if (activeRequestNotification.link) {
        navigate(activeRequestNotification.link);
      }
      setActiveRequestNotification(null);
    }
  };

  const handleDismiss = () => {
    if (activeRequestNotification) {
      markNotificationAsRead(activeRequestNotification.id);
      setActiveRequestNotification(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Navbar />
      <div className="flex pt-16">
        <Sidebar />
        <main className="flex-1 p-8 lg:ml-64">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* POP-UP DETECTOR FOR NEW RIDE REQUESTS (AUTO-REDIRECT / TRIGGER RETURN OPTIONS) */}
      <AnimatePresence>
        {activeRequestNotification && (
          <div className="fixed bottom-6 right-6 z-[100] max-w-sm w-full mx-4 sm:mx-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 shadow-2xl dark:shadow-none space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Car size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest flex items-center gap-1">
                    <BellRing size={10} className="animate-pulse" /> Solicitação Pronta
                  </span>
                  <p className="text-xs font-bold text-white/90 leading-tight mt-0.5">
                    {activeRequestNotification.title}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                {activeRequestNotification.message}
              </p>

              <div className="flex gap-2.5 pt-1.5">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="flex-1 text-slate-400 hover:text-white hover:bg-white dark:bg-slate-900 text-xs py-2 px-3 border border-white/10 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Ignorar
                </button>
                <button
                  type="button"
                  onClick={handleRedirect}
                  className="flex-[2] bg-blue-600 hover:bg-blue-750 text-white font-black text-xs py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-blue-700 transition-colors"
                  id="redirect-to-requests-btn"
                >
                  Ver Trajeto <ArrowRight size={12} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
