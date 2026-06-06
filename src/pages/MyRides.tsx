import { Link, useSearchParams } from 'react-router-dom';
import { Car, User } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RideCard } from '../components/ui/RideCard';
import { FreightCard } from '../components/ui/FreightCard';

export const MyRides = () => {
  const { rides, user, freightRequests } = useAppStore();
  const [searchParams] = useSearchParams();
  const selectedFreightId = searchParams.get('freight');

  const myRidesAsDriver = rides.filter((ride) => ride.driverId === user?.id);
  const myRidesAsPassenger = rides.filter((ride) =>
    ride.passengers.includes(user?.id || '') || (ride.pendingPassengers || []).includes(user?.id || '')
  );
  const myFreights = user
    ? freightRequests.filter((request) => (
        request.requesterId === user.id ||
        request.fretistaId === user.id ||
        request.specificFretistaId === user.id ||
        (user.role === 'fretista' && request.status === 'pending' && !request.specificFretistaId)
      ))
    : [];
  const pendingFreightCount = myFreights.filter((request) =>
    request.status === 'pending' && user?.role === 'fretista' && request.requesterId !== user.id
  ).length;

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {myRidesAsDriver.length > 0 ? (
            myRidesAsDriver.map((ride, index) => (
              <RideCard key={ride.id} ride={ride} index={index} context="driver" />
            ))
          ) : (
            <Card className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 border-dashed md:col-span-2 xl:col-span-4">
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
            <Car size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 uppercase tracking-tight">Fretes / Pedidos de Carro</h2>
          {pendingFreightCount > 0 && (
            <Badge variant="warning" className="text-[10px] uppercase font-bold tracking-widest">
              {pendingFreightCount} por responder
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {myFreights.length > 0 ? (
            myFreights.map((request, index) => (
              <FreightCard
                key={request.id}
                request={request}
                index={index}
                highlighted={selectedFreightId === request.id}
              />
            ))
          ) : (
            <Card className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 border-dashed md:col-span-2 xl:col-span-4">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {myRidesAsPassenger.length > 0 ? (
            myRidesAsPassenger.map((ride, index) => (
              <RideCard
                key={ride.id}
                ride={ride}
                index={index}
                context={(ride.pendingPassengers || []).includes(user?.id || '') ? 'pending' : 'passenger'}
              />
            ))
          ) : (
            <Card className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 border-dashed md:col-span-2 xl:col-span-4">
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
