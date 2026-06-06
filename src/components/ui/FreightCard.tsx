import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Car, CheckCircle, MoreVertical, Phone, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from './Card';
import { Badge } from './Badge';
import { useAppStore } from '../../store/useAppStore';
import type { FreightRequest } from '../../types';
import { cn } from '../../lib/utils';

type FreightCardProps = {
  request: FreightRequest;
  index?: number;
  highlighted?: boolean;
};

const statusLabel: Record<FreightRequest['status'], string> = {
  pending: 'Pendente',
  accepted: 'Aceite',
  declined: 'Recusado',
  in_progress: 'Em curso',
  completed: 'Concluido',
};

export const FreightCard = ({ request, index = 0, highlighted = false }: FreightCardProps) => {
  const { user, acceptFreightRequest, declineFreightRequest } = useAppStore();
  const navigate = useNavigate();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const isFretistaView = user?.role === 'fretista' && request.requesterId !== user.id;
  const canRespond = Boolean(isFretistaView && request.status === 'pending' && user);
  const detailPath = `/freight/${request.id}${request.status === 'completed' ? '?action=rate' : ''}`;

  const handleOpenDetails = () => {
    setIsActionMenuOpen(false);
    navigate(detailPath);
  };

  return (
    <motion.div
      key={request.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      layout
      className="h-full"
      role="link"
      tabIndex={0}
      onClick={handleOpenDetails}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleOpenDetails();
        }
      }}
    >
      <Card className={cn(
        'h-full cursor-pointer hover:border-blue-300 transition-all p-4 shadow-sm dark:shadow-none',
        highlighted && 'ring-2 ring-blue-500 border-blue-300 bg-blue-50/40 dark:bg-blue-950/20'
      )}>
        <div className="flex h-full flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30">
                  <Car size={22} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">
                    {isFretistaView ? request.requesterName : request.fretistaName || 'Aguardando fretista'}
                  </p>
                  <p className="truncate text-xs font-bold text-slate-400">
                    {isFretistaView ? 'Cliente' : request.fretistaName ? 'Fretista' : 'Pedido de carro'}
                  </p>
                </div>
              </div>

              {canRespond && (
                <div className="relative shrink-0">
                  <button
                    type="button"
                    aria-label="Acoes do frete"
                    title="Acoes"
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsActionMenuOpen((value) => !value);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {isActionMenuOpen && (
                    <div
                      onClick={(event) => event.stopPropagation()}
                      className="absolute right-0 top-10 z-20 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-xl dark:border-slate-800 dark:bg-slate-900"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          acceptFreightRequest(request.id, user!.id);
                          setIsActionMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-emerald-600 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                      >
                        <CheckCircle size={14} /> Aceitar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          declineFreightRequest(request.id);
                          setIsActionMenuOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        <XCircle size={14} /> Recusar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="relative ml-2 space-y-4 border-l-2 border-dashed border-slate-200 py-1 pl-6 dark:border-slate-800">
              <div className="relative">
                <span className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 bg-emerald-600 rounded-full ring-4 ring-emerald-50"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Origem</p>
                <p className="truncate font-bold text-slate-900 dark:text-slate-50">{request.origin}</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 bg-slate-300 rounded-full"></span>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destino</p>
                <p className="truncate font-bold text-slate-900 dark:text-slate-50">{request.destination}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 border-t border-slate-50 pt-4 dark:border-slate-800/60">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant={request.status === 'pending' ? 'warning' : ['accepted', 'in_progress', 'completed'].includes(request.status) ? 'success' : 'neutral'}
                className="text-[10px] uppercase font-bold tracking-widest"
              >
                {statusLabel[request.status]}
              </Badge>
              {request.requestedTime && (
                <Badge variant="neutral" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800/50">
                  <Calendar size={12} className="inline mr-1" />
                  {format(new Date(request.requestedTime), 'dd MMM, HH:mm', { locale: ptBR })}
                </Badge>
              )}
            </div>

            {(isFretistaView ? request.requesterPhone : request.fretistaPhone) && (
              <a
                href={`tel:${(isFretistaView ? request.requesterPhone : request.fretistaPhone)?.replace(/\s+/g, '')}`}
                onClick={(event) => event.stopPropagation()}
                className="inline-flex w-fit items-center gap-1 text-xs font-bold text-emerald-600 hover:underline"
              >
                <Phone size={13} /> {isFretistaView ? request.requesterPhone : request.fretistaPhone}
              </a>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
