import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppStore } from '../../store/useAppStore';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';

interface ChatWindowProps {
  rideId?: string;
  recipientName: string;
  recipientPhoto?: string;
}

export const ChatWindow = ({ rideId, recipientName, recipientPhoto }: ChatWindowProps) => {
  const { messages, addMessage, loadRideMessages, user } = useAppStore();
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredMessages = messages.filter(m => m.rideId === rideId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [filteredMessages]);

  useEffect(() => {
    if (!rideId || !user) return;

    setIsLoadingMessages(true);
    setError('');
    loadRideMessages(rideId)
      .catch((err) => setError(err instanceof Error ? err.message : 'Nao foi possivel carregar as mensagens.'))
      .finally(() => setIsLoadingMessages(false));
  }, [rideId, user?.id, loadRideMessages, user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    const text = inputText;
    setInputText('');
    setError('');
    setIsSending(true);
    try {
      await addMessage({
        rideId,
        senderId: user.id,
        text,
      });
    } catch (err) {
      setInputText(text);
      setError(err instanceof Error ? err.message : 'Nao foi possivel enviar a mensagem.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl dark:shadow-none shadow-slate-200/50">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={recipientPhoto} alt={recipientName} className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-sm dark:shadow-none" />
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">{recipientName}</h4>
            <span className="flex items-center gap-1 text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Online
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 rounded-lg transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-blue-50/50 px-4 py-2 border-b border-blue-100/50 flex items-center gap-2 justify-center text-[10px] text-blue-600 font-semibold italic">
        <Shield size={12} />
        O Boleia protege suas mensagens. Evite compartilhar dados sensíveis.
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed"
      >
        {isLoadingMessages && (
          <div className="text-center text-xs font-bold text-slate-400 py-4">
            A carregar mensagens...
          </div>
        )}
        {!isLoadingMessages && filteredMessages.length === 0 && (
          <div className="text-center text-xs font-bold text-slate-400 py-10">
            Ainda nao ha mensagens nesta boleia.
          </div>
        )}
        {filteredMessages.map((m, i) => {
          const isOwn = m.senderId === user?.id;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className={cn(
                "flex flex-col max-w-[80%]",
                isOwn ? "ml-auto items-end" : "mr-auto items-start"
              )}
            >
              <div 
                className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm dark:shadow-none",
                  isOwn 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 text-slate-700 dark:text-slate-300 rounded-bl-none"
                )}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-400 font-bold mt-1.5 px-1 uppercase tracking-tighter">
                {format(new Date(m.timestamp), "HH:mm")}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900">
        {error && (
          <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-bold text-red-600">
            {error}
          </div>
        )}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 focus-within:border-blue-300 focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <button type="button" className="text-slate-400 hover:text-yellow-500 transition-colors">
            <Smile size={20} />
          </button>
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium py-1 px-2 text-slate-700 dark:text-slate-300"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="button" className="text-slate-400 hover:text-blue-600 transition-colors">
            <Paperclip size={20} />
          </button>
          <button 
            type="submit"
            disabled={!inputText.trim() || isSending}
            className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
