import { motion } from 'motion/react';
import { Car, Calendar, MapPin, XCircle, ArrowRight, User, Truck, CheckCircle, Phone } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

export const MyRides = () => {
  const { rides, user, cancelRide, addMessage, freightRequests, acceptFreightRequest, declineFreightRequest } = useAppStore();
  const [searchParams] = useSearchParams();
  const selectedFreightId = searchParams.get('freight');

  const myRidesAsDriver = rides.filter(r => r.driverId === user?.id);
  const myRidesAsPassenger = rides.filter(r => r.passengers.includes(user?.id || ''));
  const myFreights = user
    ? freightRequests.filter((request) => (
        request.requesterId === user.id ||
        request.fretistaId === user.id ||
        request.specificFretistaId === user.id ||
        (user.role === 'fretista' && request.status === 'pending' && !request.specificFretistaId)
      ))
    : [];

  const handleCancelRequest = (rideId: string) => {
    const reason = window.prompt('Por favor, informe o motivo do cancelamento (opcional):');
    if (reason !== null) {
      cancelRide(rideId);
      if (reason.trim() && user) {
        addMessage({
          rideId,
          senderId: user.id,
          text: `⚠️ CANCELAMENTO: ${reason}`,
        });
      }
      alert('Boleia cancelada com sucesso.');
    }
  };

  const renderRideCard = (ride: (typeof rides)[number], role: 'driver' | 'passenger') => (
    <motion.div
      key={ride.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
    >
      <Card className="p-6 border-slate-100 dark:border-slate-800/50 hover:border-blue-100 transition-all group">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
              <Badge variant={role === 'driver' ? 'primary' : 'neutral'} className="text-[10px] uppercase font-bold tracking-widest">
                {role === 'driver' ? 'Oferecida' : 'Reservada'}
              </Badge>
              {ride.status === 'cancelled' && (
                <Badge variant="warning" className="text-[10px] uppercase font-bold tracking-widest">Cancelada</Badge>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="space-y-1">
                <p className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  {ride.origin} <ArrowRight size={16} className="text-slate-300" /> {ride.destination}
                </p>
                <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {format(new Date(ride.departureTime), "dd 'de' MMMM", { locale: ptBR })}
                  </span>
                  <span className="flex items-center gap-1 border-l pl-3 border-slate-200 dark:border-slate-800">
                    <MapPin size={14} />
                    {format(new Date(ride.departureTime), "HH:mm")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-4">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Custo</p>
              <p className="text-xl font-black text-slate-900 dark:text-slate-50">{ride.price} CVE</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/ride/${ride.id}`}>
                <Button variant="outline" size="sm" className="gap-2">
                  Detalhes
                </Button>
              </Link>
              {ride.status !== 'cancelled' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 gap-2"
                  onClick={() => handleCancelRequest(ride.id)}
                >
                  <XCircle size={16} /> Cancelar
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const renderFreightCard = (request: (typeof freightRequests)[number]) => {
    const isFretistaView = user?.role === 'fretista' && request.requesterId !== user.id;
    const isHighlighted = selectedFreightId === request.id;

    return (
      <motion.div
        key={request.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        layout
      >
        <Card className={cn(
          "p-6 border-slate-100 dark:border-slate-800/50 hover:border-blue-100 transition-all group",
          isHighlighted && "ring-2 ring-blue-500 border-blue-300 bg-blue-50/40 dark:bg-blue-950/20"
        )}>
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <Badge variant={isFretistaView ? 'primary' : 'neutral'} className="text-[10px] uppercase font-bold tracking-widest">
                  {isFretistaView ? 'Frete para responder' : 'Frete solicitado'}
                </Badge>
                <Badge
                  variant={request.status === 'pending' ? 'warning' : ['accepted', 'in_progress', 'completed'].includes(request.status) ? 'success' : 'neutral'}
                  className="text-[10px] uppercase font-bold tracking-widest"
                >
                  {request.status === 'pending' ? 'Pendente' :
                    request.status === 'accepted' ? 'Aceite' :
                    request.status === 'in_progress' ? 'Em curso' :
                    request.status === 'completed' ? 'Concluida' : 'Recusado'}
                </Badge>
              </div>

              <div className="space-y-2">
                <p className="text-xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-2">
                  {request.origin} <ArrowRight size={16} className="text-slate-300" /> {request.destination}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                  <span className="flex items-center gap-1">
                    <Truck size={14} />
                    {isFretistaView ? `Cliente: ${request.requesterName}` : request.fretistaName ? `Fretista: ${request.fretistaName}` : 'Aguardando fretista'}
                  </span>
                  {isFretistaView && request.requesterPhone && (
                    <a
                      href={`tel:${request.requesterPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1 border-l pl-3 border-slate-200 dark:border-slate-800 text-emerald-600 font-bold hover:underline"
                    >
                      <Phone size={14} /> {request.requesterPhone}
                    </a>
                  )}
                  {!isFretistaView && ['accepted', 'in_progress', 'completed'].includes(request.status) && request.fretistaPhone && (
                    <a
                      href={`tel:${request.fretistaPhone.replace(/\s+/g, '')}`}
                      className="flex items-center gap-1 border-l pl-3 border-slate-200 dark:border-slate-800 text-emerald-600 font-bold hover:underline"
                    >
                      <Phone size={14} /> {request.fretistaPhone}
                    </a>
                  )}
                  {request.requestedTime && (
                    <span className="flex items-center gap-1 border-l pl-3 border-slate-200 dark:border-slate-800">
                      <Calendar size={14} />
                      {format(new Date(request.requestedTime), "dd 'de' MMMM, HH:mm", { locale: ptBR })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3">
              <Link to={`/freight/${request.id}${request.status === 'completed' ? '?action=rate' : ''}`}>
                <Button variant="outline" size="sm">{request.status === 'completed' ? 'Avaliar' : 'Detalhes'}</Button>
              </Link>
              {isFretistaView && request.status === 'pending' ? (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="gap-1 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => acceptFreightRequest(request.id, user.id)}
                  >
                    <CheckCircle size={14} /> Aceitar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-red-600 hover:bg-red-50"
                    onClick={() => declineFreightRequest(request.id)}
                  >
                    <XCircle size={14} /> Recusar
                  </Button>
                </div>
              ) : (
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {request.status === 'accepted' ? 'Serviço confirmado' :
                    request.status === 'in_progress' ? 'Serviço em curso' :
                    request.status === 'completed' ? 'Serviço concluido' :
                    request.status === 'declined' ? 'Serviço recusado' : 'A aguardar resposta'}
                </p>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header>
        <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tight">Minhas Viagens</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium italic mt-2">Gere as tuas boleias agendadas e partilhadas.</p>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200">
            <Car size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Boleias que Ofereço</h2>
        </div>
        
        <div className="space-y-4">
          {myRidesAsDriver.length > 0 ? (
            myRidesAsDriver.map(ride => renderRideCard(ride, 'driver'))
          ) : (
            <Card className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 border-dashed">
              <p className="text-slate-400 font-medium italic text-lg">Ainda não publicou nenhuma viagem.</p>
              <Link to="/publish" className="inline-block mt-4">
                <Button variant="primary">Publicar Viagem</Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200">
            <Truck size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Fretes / Pedidos de Carro</h2>
          {myFreights.filter((request) => request.status === 'pending' && user?.role === 'fretista' && request.requesterId !== user.id).length > 0 && (
            <Badge variant="warning" className="text-[10px] uppercase font-bold tracking-widest">
              {myFreights.filter((request) => request.status === 'pending' && user?.role === 'fretista' && request.requesterId !== user.id).length} por responder
            </Badge>
          )}
        </div>

        <div className="space-y-4">
          {myFreights.length > 0 ? (
            myFreights.map(renderFreightCard)
          ) : (
            <Card className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 border-dashed">
              <p className="text-slate-400 font-medium italic text-lg">Nao tens fretes associados neste momento.</p>
              <Link to="/pedir-carro" className="inline-block mt-4">
                <Button variant="outline">Pedir Carro / Frete</Button>
              </Link>
            </Card>
          )}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200">
            <User size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Boleias que Solicitei</h2>
        </div>
        
        <div className="space-y-4">
          {myRidesAsPassenger.length > 0 ? (
            myRidesAsPassenger.map(ride => renderRideCard(ride, 'passenger'))
          ) : (
            <Card className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 border-dashed">
              <p className="text-slate-400 font-medium italic text-lg">Não tens boleias agendadas como passageiro.</p>
              <Link to="/explore" className="inline-block mt-4">
                <Button variant="outline">Encontrar Boleia</Button>
              </Link>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};
