import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, Car, Clock, MoreVertical, Pencil, Star, UserCheck, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card } from './Card';
import { Badge } from './Badge';
import { CancelRideModal } from './CancelRideModal';
import { useAppStore } from '../../store/useAppStore';
import type { Ride } from '../../types';

type RideCardContext = 'explore' | 'driver' | 'passenger' | 'pending';

type RideCardProps = {
  ride: Ride;
  index?: number;
  context?: RideCardContext;
};

const contextLabel: Record<Exclude<RideCardContext, 'explore'>, string> = {
  driver: 'Oferecida',
  passenger: 'Reservada',
  pending: 'Pedido pendente',
};

export const RideCard = ({ ride, index = 0, context = 'explore' }: RideCardProps) => {
  const { user, setAuthModalOpen, cancelRide } = useAppStore();
  const navigate = useNavigate();
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const isOwner = user?.id === ride.driverId;

  const handleProfileClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation();
    if (!user) {
      event.preventDefault();
      setAuthModalOpen(true);
    }
  };

  const handleOpenDetails = () => {
    setIsActionMenuOpen(false);
    navigate(`/ride/${ride.id}`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
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
        <Card className="h-full cursor-pointer hover:border-blue-300 transition-all p-4 shadow-sm dark:shadow-none">
          <div className="flex h-full flex-col gap-4">
            <div className="flex items-start justify-between gap-3 py-1">
              <div className="flex min-w-0 items-center gap-3">
                <Link
                  onClick={handleProfileClick}
                  onKeyDown={(event) => event.stopPropagation()}
                  to={`/profile/${ride.driverId}`}
                  aria-label={`Ver perfil de ${ride.driver.name}`}
                  className="shrink-0 hover:opacity-90 transition-opacity"
                >
                  <div className="relative">
                    <img
                      src={ride.driver.photoUrl}
                      alt={ride.driver.name}
                      className="w-14 h-14 rounded-full object-cover bg-slate-100 dark:bg-slate-800"
                    />
                    {ride.driver.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full border-2 border-white shadow-sm dark:shadow-none">
                        <UserCheck size={10} />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-50">{ride.driver.name}</p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{ride.driver.rating}</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-start gap-1">
                {context !== 'explore' && (
                  <Badge variant={context === 'driver' ? 'primary' : 'neutral'} className="text-[10px] uppercase font-bold tracking-widest">
                    {contextLabel[context]}
                  </Badge>
                )}

                {isOwner && (
                  <div className="relative">
                    <button
                      type="button"
                      aria-label="Acoes da viagem"
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
                          onClick={() => navigate(`/ride/${ride.id}/edit`)}
                          disabled={ride.status !== 'available'}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Pencil size={14} /> Editar viagem
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsActionMenuOpen(false);
                            setIsCancelModalOpen(true);
                          }}
                          disabled={['cancelled', 'completed'].includes(ride.status)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          <XCircle size={14} /> Cancelar viagem
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex flex-col gap-4">
                <div className="relative ml-2 space-y-4 border-l-2 border-dashed border-slate-200 py-1 pl-6 dark:border-slate-800">
                  <div className="relative">
                    <span className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 bg-blue-600 rounded-full ring-4 ring-blue-50"></span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{format(new Date(ride.departureTime), 'HH:mm')}</p>
                    <p className="truncate font-bold text-slate-900 dark:text-slate-50">{ride.origin}</p>
                  </div>
                  <div className="relative">
                    <span className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 bg-slate-300 rounded-full"></span>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destino</p>
                    <p className="truncate font-bold text-slate-900 dark:text-slate-50">{ride.destination}</p>
                  </div>
                </div>

                <div>
                  {ride.price && ride.price > 0 ? (
                    <p className="text-2xl font-black text-blue-600">{ride.price} <span className="text-xs font-normal text-slate-400 uppercase tracking-tighter">CVE</span></p>
                  ) : (
                    <p className="text-sm font-black text-blue-600">Preço a combinar</p>
                  )}
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide mt-1">{ride.availableSeats} lugares livres</p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 border-t border-slate-50 pt-4 dark:border-slate-800/60">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="neutral" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800/50">
                    <Calendar size={12} className="inline mr-1" />
                    {format(new Date(ride.departureTime), 'dd MMM', { locale: ptBR })}
                  </Badge>
                  <Badge variant="neutral" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800/50">
                    <Clock size={12} className="inline mr-1" />
                    {format(new Date(ride.departureTime), 'HH:mm')}
                  </Badge>
                  {ride.status === 'cancelled' && (
                    <Badge variant="warning" className="text-[10px] uppercase font-bold tracking-widest">Cancelada</Badge>
                  )}
                  {ride.status === 'in_progress' && (
                    <Badge variant="primary" className="text-[10px] uppercase font-bold tracking-widest bg-blue-100 text-blue-600">Em curso</Badge>
                  )}
                  {ride.status === 'completed' && (
                    <Badge variant="success" className="text-[10px] uppercase font-bold tracking-widest">Concluida</Badge>
                  )}
                </div>

                {ride.vehicle && (
                  <div className="flex flex-wrap">
                    <Badge variant="neutral" className="max-w-full truncate bg-blue-50 text-blue-600 border border-blue-100">
                      <Car size={12} className="inline mr-1 shrink-0" />
                      {ride.vehicle.make} {ride.vehicle.model} ({ride.vehicle.plate})
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <CancelRideModal
        isOpen={isCancelModalOpen}
        ride={ride}
        passengerCount={ride.passengers.length}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={cancelRide}
      />
    </>
  );
};
