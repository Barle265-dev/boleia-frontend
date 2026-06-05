import React from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Calendar, CheckCircle, ChevronLeft, Phone, Star, Truck, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { cn } from '../lib/utils';

export const FreightDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    user,
    freightRequests,
    acceptFreightRequest,
    declineFreightRequest,
    startFreightRequest,
    completeFreightRequest,
    rateFreightRequest,
  } = useAppStore();

  const freight = freightRequests.find((request) => request.id === id);
  const [confirmAction, setConfirmAction] = React.useState<'start' | 'complete' | null>(null);
  const [rating, setRating] = React.useState(5);
  const [rated, setRated] = React.useState(() => localStorage.getItem(`freight-rated:${id}`) === 'true');
  const [feedback, setFeedback] = React.useState('');

  React.useEffect(() => {
    if (searchParams.get('action') === 'rate') {
      setTimeout(() => {
        document.getElementById('freight-rating')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 150);
    }
  }, [searchParams]);

  if (!freight) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-4">
        <p className="text-slate-500 font-bold">Frete nao encontrado nesta sessao.</p>
        <Link to="/my-rides">
          <Button variant="primary">Voltar para Minhas Viagens</Button>
        </Link>
      </div>
    );
  }

  const isRequester = freight.requesterId === user?.id;
  const isAssignedFretista = user?.role === 'fretista' && (freight.fretistaId === user.id || freight.specificFretistaId === user.id || (!freight.specificFretistaId && freight.status === 'pending'));
  const otherName = isRequester ? freight.fretistaName : freight.requesterName;
  const otherPhone = isRequester ? freight.fretistaPhone : freight.requesterPhone;

  const statusLabel = {
    pending: 'Pendente',
    accepted: 'Aceite',
    declined: 'Recusado',
    in_progress: 'Em curso',
    completed: 'Concluido',
  }[freight.status];

  const handleConfirmAction = async () => {
    if (confirmAction === 'start') await startFreightRequest(freight.id);
    if (confirmAction === 'complete') await completeFreightRequest(freight.id);
    setConfirmAction(null);
  };

  const handleRate = async () => {
    await rateFreightRequest(freight.id, rating);
    localStorage.setItem(`freight-rated:${freight.id}`, 'true');
    setRated(true);
    setFeedback('Avaliacao registada com sucesso.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate(-1)}>
        <ChevronLeft size={16} /> Voltar
      </Button>

      <Card className="p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3">
            <Badge variant={freight.status === 'completed' ? 'success' : freight.status === 'pending' ? 'warning' : 'primary'} className="w-fit uppercase">
              {statusLabel}
            </Badge>
            <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50">Detalhes do Frete</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {freight.origin} <ArrowRight size={14} className="inline mx-1" /> {freight.destination}
            </p>
          </div>
          {freight.requestedTime && (
            <div className="text-right text-sm text-slate-500 dark:text-slate-400 font-bold">
              <Calendar size={16} className="inline mr-1" />
              {format(new Date(freight.requestedTime), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">Cliente</p>
            <p className="font-bold text-slate-900 dark:text-slate-50">{freight.requesterName}</p>
            {freight.requesterPhone && (
              <a href={`tel:${freight.requesterPhone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:underline mt-2">
                <Phone size={14} /> {freight.requesterPhone}
              </a>
            )}
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-black mb-1">Fretista</p>
            <p className="font-bold text-slate-900 dark:text-slate-50">{freight.fretistaName || 'Ainda sem fretista associado'}</p>
            {freight.fretistaPhone && (
              <a href={`tel:${freight.fretistaPhone.replace(/\s+/g, '')}`} className="inline-flex items-center gap-1 text-sm font-bold text-emerald-600 hover:underline mt-2">
                <Phone size={14} /> {freight.fretistaPhone}
              </a>
            )}
          </div>
        </div>

        {otherPhone && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold">
            Contacto de {otherName}: <a href={`tel:${otherPhone.replace(/\s+/g, '')}`} className="underline">{otherPhone}</a>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {isAssignedFretista && freight.status === 'pending' && (
            <>
              <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => acceptFreightRequest(freight.id, user!.id)}>
                <CheckCircle size={16} /> Aceitar Frete
              </Button>
              <Button variant="outline" className="gap-2 text-red-600 hover:bg-red-50" onClick={() => declineFreightRequest(freight.id)}>
                <XCircle size={16} /> Recusar
              </Button>
            </>
          )}
          {isAssignedFretista && freight.status === 'accepted' && (
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setConfirmAction('start')}>
              <Truck size={16} /> Dar Partida
            </Button>
          )}
          {isAssignedFretista && freight.status === 'in_progress' && (
            <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={() => setConfirmAction('complete')}>
              <CheckCircle size={16} /> Terminar Frete
            </Button>
          )}
        </div>
      </Card>

      {freight.status === 'completed' && (
        <Card id="freight-rating" className={cn("p-6 space-y-4", searchParams.get('action') === 'rate' && "ring-2 ring-amber-500")}>
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-50">Avaliar frete concluido</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">A tua avaliacao ajuda a comunidade a manter a confianca.</p>
          </div>
          {rated ? (
            <p className="text-sm font-bold text-emerald-600">{feedback || 'Ja avaliaste este frete.'}</p>
          ) : (
            <>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
                    <Star size={28} className={star <= rating ? 'text-yellow-500 fill-current' : 'text-slate-300'} />
                  </button>
                ))}
              </div>
              <Button className="bg-amber-500 hover:bg-amber-600" onClick={handleRate}>
                Enviar Avaliacao
              </Button>
            </>
          )}
        </Card>
      )}

      <AnimatePresence>
        {confirmAction && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl dark:shadow-none space-y-6 border border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  {confirmAction === 'start' ? 'Dar partida neste frete?' : 'Terminar este frete?'}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {confirmAction === 'start'
                    ? 'Confirme que o frete vai iniciar agora.'
                    : 'Confirme que o frete foi concluido. Isso adiciona a viagem ao historico dos integrantes.'}
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setConfirmAction(null)}>Voltar</Button>
                <Button className="flex-[2] bg-emerald-600 hover:bg-emerald-700" onClick={handleConfirmAction}>
                  Confirmar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
