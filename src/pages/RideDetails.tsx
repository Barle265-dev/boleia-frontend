import React from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Clock, Users, UserCheck, Star, MessageSquare, ChevronLeft, Car, ShieldCheck, Heart, Share2, XCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChatWindow } from '../components/ui/ChatWindow';
import { useAppStore } from '../store/useAppStore';
import { cn } from '../lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const RideDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view');
  const { 
    rides, 
    requestRide, 
    user, 
    acceptRequest, 
    declineRequest, 
    removePassenger, 
    cancelRide,
    startRide,
    completeRide,
    submitReview,
    setAuthModalOpen,
    users
  } = useAppStore();
  const navigate = useNavigate();

  const [cancelPassengerId, setCancelPassengerId] = React.useState<string | null>(null);
  const [cancelReason, setCancelReason] = React.useState<string>('');
  const [isCancelRideModalOpen, setIsCancelRideModalOpen] = React.useState<boolean>(false);
  const [requestFeedback, setRequestFeedback] = React.useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isRequestingRide, setIsRequestingRide] = React.useState(false);
  const [pendingActionId, setPendingActionId] = React.useState<string | null>(null);
  const [confirmRideAction, setConfirmRideAction] = React.useState<'start' | 'complete' | null>(null);

  // Passenger rating state
  const [givenRating, setGivenRating] = React.useState<number>(5);
  const [reviewComment, setReviewComment] = React.useState<string>('');
  const [certifiedCompleted, setCertifiedCompleted] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    if (view === 'chat' || view === 'requests') {
      const element = document.getElementById(view + '-section');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    } else if (searchParams.get('action') === 'rate') {
      const element = document.getElementById('rating-section');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 150);
      }
    }
  }, [view, searchParams]);

  const ride = rides.find(r => r.id === id);

  if (!ride) return <div>Ride not found</div>;

  const isDriver = user?.id === ride.driverId;
  const isAlreadyPassenger = ride.passengers.includes(user?.id || '');
  const isPendingPassenger = (ride.pendingPassengers || []).includes(user?.id || '');
  const hasRated = (ride.ratedBy || []).includes(user?.id || '');

  const passengersDetails = ride.passengerDetails?.length
    ? ride.passengerDetails
    : users.filter(u => ride.passengers.includes(u.id));
  const pendingPassengersDetails = ride.pendingPassengerDetails?.length
    ? ride.pendingPassengerDetails
    : users.filter(u => (ride.pendingPassengers || []).includes(u.id));

  const handleRequest = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setRequestFeedback(null);
    setIsRequestingRide(true);
    try {
      await requestRide(ride.id);
      setRequestFeedback({
        type: 'success',
        message: 'Pedido enviado com sucesso. Agora aguarda a confirmacao do responsavel da boleia.',
      });
    } catch (error: any) {
      setRequestFeedback({
        type: 'error',
        message: error?.message || 'Nao foi possivel enviar o pedido de boleia.',
      });
    } finally {
      setIsRequestingRide(false);
    }
  };

  const handleAcceptPassenger = async (passengerId: string) => {
    setPendingActionId(passengerId);
    setRequestFeedback(null);
    try {
      await acceptRequest(ride.id, passengerId);
      setRequestFeedback({ type: 'success', message: 'Solicitacao aceite com sucesso.' });
    } catch (error: any) {
      setRequestFeedback({
        type: 'error',
        message: error?.message || 'Nao foi possivel aceitar esta solicitacao.',
      });
    } finally {
      setPendingActionId(null);
    }
  };

  const handleDeclinePassenger = (passengerId: string) => {
    declineRequest(ride.id, passengerId);
    setRequestFeedback({ type: 'success', message: 'Solicitacao recusada.' });
  };

  const handleConfirmRemovePassenger = (passengerId: string) => {
    if (!cancelReason.trim()) return;
    removePassenger(ride.id, passengerId, cancelReason);
    setCancelPassengerId(null);
    setCancelReason('');
  };

  const handleReviewSubmit = () => {
    if (!user) return;
    submitReview(ride.id, user.id, givenRating, reviewComment);
    setCertifiedCompleted(true);
  };

  const handleConfirmRideAction = () => {
    if (confirmRideAction === 'start') {
      startRide(ride.id);
    }
    if (confirmRideAction === 'complete') {
      completeRide(ride.id);
    }
    setConfirmRideAction(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate(-1)}>
          <ChevronLeft size={16} /> Voltar
        </Button>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full">
            <Share2 size={20} className="text-gray-500 dark:text-slate-400" />
          </Button>
          <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-full">
            <Heart size={20} className="text-gray-500 dark:text-slate-400" />
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* ... existing ride info content (omitted header/sections for brevity, but I will keep them) ... */}
          
          <header className="space-y-4">
            <div className="flex items-center gap-2">
              {ride.status === 'cancelled' && (
                <Badge variant="warning" className="text-xs uppercase tracking-wider bg-red-100 text-red-600 border border-red-200">Viagem Cancelada ⚠️</Badge>
              )}
              {ride.status === 'in_progress' && (
                <Badge variant="primary" className="text-xs uppercase tracking-wider bg-blue-100 text-blue-600 border border-blue-200 animate-pulse">Viagem Iniciada 🚗</Badge>
              )}
              {ride.status === 'completed' && (
                <Badge variant="neutral" className="text-xs uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">Viagem Concluída 🏁</Badge>
              )}
              {ride.status === 'full' && (
                <Badge variant="warning" className="text-xs uppercase tracking-wider bg-amber-100 text-amber-700 border border-amber-200">Viagem Lotada 👥</Badge>
              )}
              {ride.status === 'available' && (
                <Badge variant="primary" className="text-xs uppercase tracking-wider">Viagem Disponível 👍</Badge>
              )}
              <span className="text-sm text-gray-400">• Publicado há 2h</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 leading-tight">
              De {ride.origin} para {ride.destination}
            </h1>
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/50 flex flex-col gap-6 relative shadow-sm dark:shadow-none">
              <div className="absolute left-[33px] top-[46px] bottom-[46px] border-l-2 border-dashed border-blue-200" />
              
              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-blue-600 flex items-center justify-center shrink-0 z-10">
                  <div className="w-2 h-2 rounded-full bg-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ponto de Partida</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-50">{ride.origin}</p>
                </div>
              </div>

              <div className="flex gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-yellow-400 flex items-center justify-center shrink-0 z-10">
                  <MapPin size={14} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ponto de Destino</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-50">{ride.destination}</p>
                </div>
              </div>
            </div>
          </header>

          <section className="space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Informações do Trajeto</h2>
            <Card className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Data</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-slate-50">{format(new Date(ride.departureTime), "dd MMM yyyy", { locale: ptBR })}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Clock size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Partida</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-slate-50">{format(new Date(ride.departureTime), "HH:mm")}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Users size={18} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Lugares</span>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-slate-50">{ride.availableSeats} / {ride.totalSeats}</p>
                </div>
                {ride.vehicle && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Car size={18} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Veículo</span>
                    </div>
                    <p className="font-bold text-slate-900 dark:text-slate-50 leading-tight">
                      {ride.vehicle.make} {ride.vehicle.model}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase mt-0.5">{ride.vehicle.color} • <span className="font-mono text-slate-700 dark:text-slate-300">{ride.vehicle.plate}</span></p>
                  </div>
                )}
              </div>
            </Card>
          </section>

          {/* SECÇÃO DE CERTIFICAÇÃO E AVALIAÇÃO DA VIAGEM */}
          {isAlreadyPassenger && ride.status === 'completed' && (
            <section id="rating-section" className={cn("space-y-4 transition-all scroll-mt-24 mb-6", searchParams.get('action') === 'rate' && "ring-2 ring-amber-500 p-4 rounded-3xl bg-amber-50/20")}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black text-amber-600 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 block animate-pulse"></span>
                  Certificação e Avaliação da Viagem
                </h2>
              </div>
              
              <Card className="p-6 border-amber-200 bg-amber-50/10">
                {hasRated ? (
                  <div className="text-center py-6 space-y-3">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm dark:shadow-none">
                      <UserCheck size={24} />
                    </div>
                    <h3 className="text-base font-bold text-slate-950">Viagem Certificada e Avaliada! 🎉</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Agradecemos por certificares o fim da viagem e avaliares o motorista. O teu feedback ajuda a manter a comunidade segura e confiável.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1">A viagem de {ride.origin} para {ride.destination} terminou com sucesso?</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Por favor, certifica se a viagem correu como planeado para podermos fechar o trajeto.</p>
                      
                      <div className="flex gap-3 mt-4">
                        <button
                          type="button"
                          onClick={() => setCertifiedCompleted(true)}
                          className={cn(
                            "flex-1 py-3 px-4 rounded-2xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-2",
                            certifiedCompleted === true
                              ? "bg-emerald-600 border-transparent text-white shadow-md dark:shadow-none shadow-emerald-100"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50"
                          )}
                        >
                          👍 Sim, correu tudo bem
                        </button>
                        <button
                          type="button"
                          onClick={() => setCertifiedCompleted(false)}
                          className={cn(
                            "flex-1 py-3 px-4 rounded-2xl font-bold text-xs border transition-all cursor-pointer flex items-center justify-center gap-2",
                            certifiedCompleted === false
                              ? "bg-red-600 border-transparent text-white shadow-md dark:shadow-none shadow-red-100"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50"
                          )}
                        >
                          👎 Não, houve problemas
                        </button>
                      </div>
                    </div>

                    {certifiedCompleted !== null && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-4 border-t border-dashed border-slate-200 dark:border-slate-800"
                      >
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-1">Avalia o motorista ({ride.driver.name})</h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Introduz de 1 a 5 estrelas para classificar a conduta, pontualidade e simpatia do condutor.</p>
                          
                          <div className="flex items-center gap-1.5 mt-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setGivenRating(star)}
                                className="p-1 cursor-pointer hover:scale-110 transition-transform focus:outline-none"
                              >
                                <Star
                                  size={30}
                                  className={cn(
                                    "transition-colors",
                                    star <= givenRating
                                      ? "text-yellow-500 fill-current"
                                      : "text-slate-300"
                                  )}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">
                              {givenRating === 5 && 'Excelente ⭐⭐⭐⭐⭐'}
                              {givenRating === 4 && 'Muito Bom ⭐⭐⭐⭐'}
                              {givenRating === 3 && 'Bom ⭐⭐⭐'}
                              {givenRating === 2 && 'Regular ⭐⭐'}
                              {givenRating === 1 && 'Mau ⭐'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">Feedback / Comentário adicional (Opcional)</label>
                          <textarea
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            placeholder="Ex: Condutor muito simpático e condução segura, recomendo vivamente!"
                            className="w-full min-h-[70px] p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-1 focus:ring-amber-500 outline-none"
                          />
                        </div>

                        <Button
                          onClick={handleReviewSubmit}
                          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 text-xs"
                          id="submit-review-btn"
                        >
                          Submeter Avaliação e Certificado
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </Card>
            </section>
          )}

          {isDriver && (
            <div className="space-y-6">
              {/* Solicitações Pendentes Section */}
              <section id="requests-section" className={cn("space-y-4 transition-all scroll-mt-24", (view === 'requests' || pendingPassengersDetails.length > 0) && "ring-2 ring-blue-500 p-4 rounded-3xl bg-blue-50/30")}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black text-slate-450 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 block animate-pulse"></span>
                    Solicitações Pendentes ({pendingPassengersDetails.length})
                  </h2>
                </div>
                
                <div className="grid gap-3">
                  {pendingPassengersDetails.map(p => (
                    <Card key={p.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-amber-100 bg-amber-50/20 hover:bg-amber-50/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={p.photoUrl} alt={p.name} className="w-11 h-11 rounded-full border-2 border-white shadow-sm dark:shadow-none object-cover" />
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Star size={10} className="text-yellow-500 fill-current animate-spin" style={{ animationDuration: '3s' }} />
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{p.rating} • {p.totalTrips} viagens</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 w-full sm:w-auto shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeclinePassenger(p.id)}
                          className="flex-1 sm:flex-none border-red-200 hover:bg-red-50 text-red-600 font-bold text-xs"
                          id={`decline-btn-${p.id}`}
                        >
                          Recusar
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAcceptPassenger(p.id)}
                          className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                          id={`accept-btn-${p.id}`}
                          isLoading={pendingActionId === p.id}
                        >
                          Aceitar Boleia
                        </Button>
                      </div>
                    </Card>
                  ))}

                  {pendingPassengersDetails.length === 0 && (
                    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-dashed text-center space-y-3">
                      <p className="text-xs text-slate-400 italic">Nenhum pedido de boleia pendente.</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Confirmados Section */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Passageiros Confirmados ({passengersDetails.length})</h2>
                </div>
                <div className="grid gap-3">
                  {passengersDetails.map(p => (
                    <Card key={p.id} className="p-4 flex flex-col gap-3">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <img src={p.photoUrl} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{p.name}</p>
                            <div className="flex items-center gap-2 mt-0.5 animate-in">
                              <Star size={10} className="text-yellow-500 fill-current" />
                              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{p.rating}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link to={`/profile/${p.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-600 font-bold text-[10px] uppercase cursor-pointer">Ver Perfil</Button>
                          </Link>
                          {ride.status !== 'cancelled' && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setCancelPassengerId(p.id);
                                setCancelReason('');
                              }} 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100 font-bold text-[10px] uppercase gap-1"
                            >
                              Cancelar Vaga
                            </Button>
                          )}
                        </div>
                      </div>

                      {cancelPassengerId === p.id && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 border-t border-slate-100 dark:border-slate-800/50 space-y-2.5"
                        >
                          <label className="text-[10px] uppercase font-black tracking-wider text-slate-400">Justificação de Cancelamento</label>
                          <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Ex: Tivemos problemas técnicos ou alteração do trajeto..."
                            className="w-full min-h-[60px] p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
                            required
                          />
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setCancelPassengerId(null)} 
                              className="text-xs font-bold"
                            >
                              Voltar
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm" 
                              onClick={() => handleConfirmRemovePassenger(p.id)} 
                              className="bg-red-600 hover:bg-red-700 text-xs font-bold"
                              disabled={!cancelReason.trim()}
                            >
                              Submeter Cancelamento
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </Card>
                  ))}
                  {passengersDetails.length === 0 && (
                    <p className="text-sm text-slate-400 italic bg-white dark:bg-slate-900 p-6 rounded-2xl border border-dashed text-center">Nenhum passageiro confirmado ainda.</p>
                  )}
                </div>
              </section>
            </div>
          )}

          <section id="chat-section" className={cn("space-y-4 transition-all scroll-mt-24", view === 'chat' && "ring-2 ring-blue-500 p-2 rounded-3xl bg-blue-50/50")}>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {isDriver ? 'Conversas com Passageiros' : `Conversar com ${ride.driver.name?.split(' ')[0]}`}
              </h2>
              {view === 'chat' && <Badge variant="primary" className="animate-pulse">Nova Mensagem</Badge>}
            </div>
            {user ? (
               <ChatWindow 
                 rideId={ride.id} 
                 recipientName={isDriver ? (passengersDetails[0]?.name || 'Passageiro') : (ride.driver.name || '')} 
                 recipientPhoto={isDriver ? passengersDetails[0]?.photoUrl : ride.driver.photoUrl} 
               />
            ) : (
               <Card className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 border-dashed">
                 <MessageSquare size={32} className="mx-auto text-slate-300 mb-4" />
                 <h4 className="font-bold text-slate-900 dark:text-slate-50 mb-2">Faça login para conversar</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Precisas de estar autenticado para enviar mensagens ao motorista.</p>
                 <Button onClick={() => setAuthModalOpen(true)} variant="primary">Fazer Login</Button>
               </Card>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <div className="sticky top-24">
            {/* Booking Card */}
            <Card className="p-6 bg-slate-900 text-white border-none shadow-2xl dark:shadow-none shadow-blue-900/20">
              <div className="text-center space-y-6">
                <div>
                  <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">Custo da Boleia</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black">{ride.price}</span>
                    <span className="text-xl font-medium text-blue-300 uppercase">CVE</span>
                  </div>
                  <p className="text-blue-400 text-[10px] font-bold mt-2 italic">Valor sugerido por lugar</p>
                </div>

                <div className="space-y-3">
                  {requestFeedback && (
                    <div className={cn(
                      "p-3 rounded-2xl border text-xs font-bold leading-relaxed",
                      requestFeedback.type === 'success'
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                        : "bg-red-500/10 border-red-500/20 text-red-300"
                    )}>
                      {requestFeedback.message}
                    </div>
                  )}

                  {ride.status === 'cancelled' ? (
                    <div className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-center space-y-1">
                      <p className="text-sm font-bold text-red-400">Esta Viagem Foi Cancelada ⚠️</p>
                      <p className="text-[10px] text-slate-300">Todos os passageiros inseridos foram desvinculados e notificados.</p>
                    </div>
                  ) : isDriver ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-center">
                        <p className="text-xs font-bold text-blue-300">És o motorista desta viagem</p>
                        <p className="text-[10px] text-blue-200 mt-1">Status: {
                          ride.status === 'completed' ? 'Finalizada 🏁' :
                          ride.status === 'in_progress' ? 'Em curso 🚗' : 'Agendada'
                        }</p>
                      </div>

                      {ride.status === 'completed' ? (
                        <div className="p-3 bg-emerald-500/15 rounded-2xl border border-emerald-500/20 text-emerald-400 text-center">
                          <p className="text-xs font-bold">🏁 Viagem Concluída com Sucesso!</p>
                        </div>
                      ) : ride.status === 'in_progress' ? (
                        <Button 
                          onClick={() => setConfirmRideAction('complete')}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl cursor-pointer font-bold transition-colors"
                          id="complete-ride-btn"
                        >
                          Concluir Viagem 🏁
                        </Button>
                      ) : (
                        <div className="space-y-2.5">
                          <Button 
                            onClick={() => setConfirmRideAction('start')}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl cursor-pointer font-bold transition-colors"
                            id="start-ride-btn"
                          >
                            Dar Partida na Viagem 🚗
                          </Button>
                          <Button 
                            onClick={() => setIsCancelRideModalOpen(true)}
                            className="w-full bg-red-600 hover:bg-red-750 text-white py-4 text-xs rounded-xl cursor-pointer transition-colors font-medium" 
                          >
                            Cancelar Viagem
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : isAlreadyPassenger ? (
                    <div className="space-y-3">
                      {ride.status === 'completed' ? (
                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center space-y-1">
                          <p className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                            🏁 Viagem Concluída!
                          </p>
                          <p className="text-xs text-blue-200 leading-relaxed">
                            {hasRated 
                              ? 'Obrigado por avaliares e certificares esta boleia.' 
                              : 'Por favor, certifica o fim da viagem e avalia o condutor.'}
                          </p>
                          {!hasRated && (
                            <Button
                              onClick={() => {
                                const element = document.getElementById('rating-section');
                                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }}
                              className="mt-2 text-xs bg-amber-500 hover:bg-amber-600 text-white w-full py-2.5 font-bold rounded-xl"
                            >
                              Avaliar Agora ⭐
                            </Button>
                          )}
                        </div>
                      ) : ride.status === 'in_progress' ? (
                        <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 text-center space-y-1">
                          <p className="text-sm font-bold text-blue-400 flex items-center justify-center gap-1.5 animate-pulse">
                            🚗 Em Trânsito
                          </p>
                          <p className="text-xs text-blue-200 leading-relaxed">
                            A tua boleia está em curso agora. Boa viagem até ao destino!
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-center space-y-1">
                          <p className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                            <UserCheck size={16} /> Boleia Confirmada! 🎉
                          </p>
                          <p className="text-xs text-blue-200 leading-relaxed">
                            Estás na lista de passageiros confirmados desta viagem.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : isPendingPassenger ? (
                    <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-center space-y-1 animate-pulse">
                      <p className="text-sm font-bold text-amber-400">Aguardando Avaliação...</p>
                      <p className="text-xs text-blue-200 leading-relaxed">
                        A tua solicitação de boleia foi enviada. O motorista irá analisar o teu pedido.
                      </p>
                    </div>
                  ) : (
                    <Button 
                      onClick={handleRequest}
                      className="w-full bg-blue-600 text-white hover:bg-blue-700 py-6 text-lg rounded-2xl cursor-pointer" 
                      disabled={ride.availableSeats === 0 || isRequestingRide}
                      isLoading={isRequestingRide}
                    >
                      {ride.availableSeats === 0 ? 'Lotação Esgotada' : 'Pedir Boleia'}
                    </Button>
                  )}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 justify-center text-blue-200">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Pagamento Protegido</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="mt-6 p-6 rounded-[2rem] bg-yellow-400/5 border border-yellow-400/10 space-y-4">
               <div className="flex items-center gap-3 text-yellow-700">
                  <div className="bg-yellow-400/20 p-2 rounded-xl">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-sm font-black uppercase tracking-tight">Morabeza Safe</span>
               </div>
               <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                 "Viagens seguras e tranquilas. Verificamos cada motorista para garantir sua paz de espírito."
               </p>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {confirmRideAction && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl dark:shadow-none space-y-6 border border-slate-100 dark:border-slate-800/50 relative"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                  {confirmRideAction === 'start' ? <Car size={24} /> : <UserCheck size={24} />}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                  {confirmRideAction === 'start' ? 'Dar partida nesta viagem?' : 'Concluir esta viagem?'}
                </h3>
                <p className="text-xs text-slate-550 leading-relaxed">
                  {confirmRideAction === 'start'
                    ? 'Confirme que esta viagem ja vai iniciar. Os passageiros passarao a ver a boleia como em curso.'
                    : 'Confirme que a viagem chegou ao fim. Depois disso, os passageiros poderao certificar e avaliar a boleia.'}
                </p>
                <p className="text-xs text-emerald-700 font-bold bg-emerald-50/70 p-3 rounded-2xl border border-emerald-100">
                  {ride.origin} para {ride.destination}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                  onClick={() => setConfirmRideAction(null)}
                >
                  Voltar
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  onClick={handleConfirmRideAction}
                >
                  {confirmRideAction === 'start' ? 'Confirmar Partida' : 'Confirmar Conclusao'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* RIDE CANCELLATION MODAL */}
      <AnimatePresence>
        {isCancelRideModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl dark:shadow-none space-y-6 border border-slate-100 dark:border-slate-800/50 relative"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                  <XCircle size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Cancelar esta viagem?</h3>
                <p className="text-xs text-slate-550 leading-relaxed">
                  Tem a certeza de que deseja cancelar esta viagem de <strong className="text-slate-800 dark:text-slate-200 dark:text-slate-700 font-bold">{ride.origin} para {ride.destination}</strong>?
                </p>
                <p className="text-xs text-red-600 font-bold bg-red-50/50 p-3 rounded-2xl border border-red-100">
                  ⚠️ Esta ação desvinculará todos os passageiros confirmados ({passengersDetails.length}) e enviar-lhes-á uma notificação informando o cancelamento imediato pelo motorista.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                  onClick={() => setIsCancelRideModalOpen(false)}
                >
                  Manter Viagem
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="flex-[2] bg-red-600 hover:bg-red-700 text-white font-bold"
                  onClick={() => {
                    cancelRide(ride.id);
                    setIsCancelRideModalOpen(false);
                  }}
                >
                  Confirmar Cancelamento
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
