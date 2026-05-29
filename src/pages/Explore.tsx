import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar, Users, Filter, ArrowRight, UserCheck, Star, Clock, X, RotateCcw, Car } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

export const Explore = () => {
  const { rides, user, setAuthModalOpen } = useAppStore();

  const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user) {
      e.preventDefault();
      setAuthModalOpen(true);
    }
  };
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('');

  // Time and Date filters state
  const [showFilters, setShowFilters] = useState(false);
  const [timePeriod, setTimePeriod] = useState<'all' | 'morning' | 'afternoon' | 'night'>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [specificTime, setSpecificTime] = useState('');

  const getRideDateLabel = (departureTime: string) => {
    const rideDateStr = departureTime.split('T')[0];
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (rideDateStr === todayStr) return 'Hoje';
    if (rideDateStr === tomorrowStr) return 'Amanhã';
    return format(new Date(departureTime), "dd 'de' MMM", { locale: ptBR });
  };

  const clearFilters = () => {
    setTimePeriod('all');
    setSelectedDate('');
    setSpecificTime('');
  };

  const filteredRides = rides.filter(ride => {
    // 1. Destination/Origin matching
    const matchOrigin = ride.origin.toLowerCase().includes(search.toLowerCase());
    const matchDestination = ride.destination.toLowerCase().includes(destination.toLowerCase());
    
    // Parse departure hour and minute from the ISO string
    const rideDate = new Date(ride.departureTime);
    const rideHour = rideDate.getHours();
    const rideMinutes = rideHour * 60 + rideDate.getMinutes();

    // 2. Date Filter
    let matchDate = true;
    if (selectedDate) {
      const rideDateStr = rideDate.toISOString().split('T')[0];
      matchDate = rideDateStr === selectedDate;
    }

    // 3. Time Period Filter range
    let matchPeriod = true;
    if (timePeriod === 'morning') {
      matchPeriod = rideHour >= 6 && rideHour < 12;
    } else if (timePeriod === 'afternoon') {
      matchPeriod = rideHour >= 12 && rideHour < 18;
    } else if (timePeriod === 'night') {
      matchPeriod = rideHour >= 18 || rideHour < 6;
    }

    // 4. Specific Time Match Filter (within 1 hour / 60 mins margin)
    let matchSpecific = true;
    if (specificTime) {
      const [specH, specM] = specificTime.split(':').map(Number);
      const specMin = specH * 60 + (specM || 0);
      const diff = Math.abs(rideMinutes - specMin);
      matchSpecific = diff <= 60; // 1 hour deviation allowed
    }

    return matchOrigin && matchDestination && matchDate && matchPeriod && matchSpecific;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-300">Olá, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-gray-500 dark:text-slate-400">Para onde vamos hoje?</p>
        </div>
        <Link to="/publish">
          <Button className="gap-2 shrink-0 cursor-pointer">
            <Users size={20} /> Oferecer Boleia
          </Button>
        </Link>
      </header>

      {/* Quick Search */}
      <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none" hover={false}>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 w-full">
            <MapPin size={20} className="text-slate-400" />
            <input 
              type="text"
              placeholder="Origem: Cidade da Praia" 
              className="bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 w-full">
            <MapPin size={20} className="text-blue-500" />
            <input 
              type="text"
              placeholder="Para: Assomada" 
              className="bg-transparent border-none outline-none focus:ring-0 text-sm font-semibold w-full"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div 
            className="w-full md:w-auto md:min-w-40 flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Calendar size={20} className="text-blue-500" />
            <span className="text-sm text-slate-600 dark:text-slate-400 font-semibold whitespace-nowrap">
              {selectedDate ? format(new Date(selectedDate + 'T00:00:00'), "dd 'de' MMM", { locale: ptBR }) : 'Qualquer data'}
            </span>
          </div>
          <Button 
            variant={showFilters ? 'primary' : 'outline'} 
            className="w-full md:w-auto px-8 gap-2 cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} /> Filtros
          </Button>
        </div>

        {/* TIME AND DATE FILTERS */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/50 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                  {/* Período do Dia (Time Interval) */}
                  <div className="space-y-2 col-span-1 md:col-span-5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Período do Dia</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all' as const, label: 'Qualquer' },
                        { id: 'morning' as const, label: '(06h-12h)' },
                        { id: 'afternoon' as const, label: '(12h-18h)' },
                        { id: 'night' as const, label: '(18h-24h)' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setTimePeriod(p.id)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer",
                            timePeriod === p.id
                              ? 'bg-blue-600 text-white shadow-sm dark:shadow-none'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700'
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Data da Viagem */}
                  <div className="space-y-2 col-span-1 md:col-span-4">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Data da Viagem</label>
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5">
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="bg-transparent border-none outline-none text-xs font-semibold w-full focus:ring-0 p-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Hora de Partida Específica (Specific Hour) */}
                  <div className="space-y-2 col-span-1 md:col-span-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Hora Específica</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 min-w-[80px]">
                        <Clock size={14} className="text-slate-400 shrink-0" />
                        <input
                          type="time"
                          value={specificTime}
                          onChange={(e) => setSpecificTime(e.target.value)}
                          className="bg-transparent border-none outline-none text-xs font-semibold w-full focus:ring-0 p-0"
                        />
                      </div>
                      {(selectedDate || specificTime || timePeriod !== 'all') && (
                        <button
                          type="button"
                          onClick={clearFilters}
                          title="Limpar Filtros"
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-red-500 rounded-lg transition-transform cursor-pointer"
                        >
                          <RotateCcw size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Active filters display */}
      {(timePeriod !== 'all' || selectedDate || specificTime) && (
        <div className="flex flex-wrap gap-2 items-center px-1 animate-in fade-in duration-200 font-mono">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">Filtros Ativos:</span>
          {timePeriod !== 'all' && (
            <Badge variant="primary" className="gap-1 bg-blue-50 text-blue-600 border border-blue-100 py-1 px-2.5 text-xs font-bold rounded-full flex items-center font-sans">
              <span>Período: {timePeriod === 'morning' ? 'Manhã' : timePeriod === 'afternoon' ? 'Tarde' : 'Noite'}</span>
              <button onClick={() => setTimePeriod('all')} className="hover:text-red-500 transition-colors p-0.5 ml-1 cursor-pointer">
                <X size={12} />
              </button>
            </Badge>
          )}
          {selectedDate && (
            <Badge variant="primary" className="gap-1 bg-blue-50 text-blue-600 border border-blue-100 py-1 px-2.5 text-xs font-bold rounded-full flex items-center font-sans">
              <span>Data: {format(new Date(selectedDate + 'T00:00:00'), "dd/MM/yyyy")}</span>
              <button onClick={() => setSelectedDate('')} className="hover:text-red-500 transition-colors p-0.5 ml-1 cursor-pointer">
                <X size={12} />
              </button>
            </Badge>
          )}
          {specificTime && (
            <Badge variant="primary" className="gap-1 bg-blue-50 text-blue-600 border border-blue-100 py-1 px-2.5 text-xs font-bold rounded-full flex items-center font-sans">
              <span>Hora: {specificTime} (±1h)</span>
              <button onClick={() => setSpecificTime('')} className="hover:text-red-500 transition-colors p-0.5 ml-1 cursor-pointer">
                <X size={12} />
              </button>
            </Badge>
          )}
          <button onClick={clearFilters} className="text-[10px] text-slate-400 hover:text-red-500 font-bold underline transition-colors cursor-pointer ml-1 font-sans">
            Limpar tudo
          </button>
        </div>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            Boleias Disponíveis ({filteredRides.length})
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn(
              "gap-2 cursor-pointer",
              showFilters ? 'text-blue-600 font-bold bg-blue-50' : 'text-slate-400'
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} /> Filtros {(timePeriod !== 'all' || selectedDate || specificTime) && <span className="w-1.5 h-1.5 bg-blue-600 rounded-full inline-block" />}
          </Button>
        </div>

        <div className="grid gap-6">
          {filteredRides.map((ride, i) => (
            <motion.div
              key={ride.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="hover:border-blue-300 transition-all p-5 shadow-sm dark:shadow-none">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Driver Info */}
                  <Link onClick={handleProfileClick} to={`/profile/${ride.driverId}`} className="hover:opacity-90 transition-opacity">
                    <div className="flex md:flex-col items-center gap-4 md:w-32 py-1">
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
                      <div className="md:text-center">
                        <p className="font-bold text-slate-900 dark:text-slate-50 text-sm whitespace-nowrap">{ride.driver.name}</p>
                        <div className="flex items-center gap-1 md:justify-center text-yellow-500">
                          <Star size={12} fill="currentColor" />
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{ride.driver.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Route Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="relative pl-6 py-1 border-l-2 border-dashed border-slate-200 dark:border-slate-800 ml-2 space-y-4">
                        <div className="relative">
                          <span className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 bg-blue-600 rounded-full ring-4 ring-blue-50"></span>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{format(new Date(ride.departureTime), "HH:mm")}</p>
                          <p className="font-bold text-slate-900 dark:text-slate-50">{ride.origin}</p>
                        </div>
                        <div className="relative">
                          <span className="absolute -left-[1.35rem] top-1 w-2.5 h-2.5 bg-slate-300 rounded-full"></span>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Destino</p>
                          <p className="font-bold text-slate-900 dark:text-slate-50">{ride.destination}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-black text-blue-600">{ride.price} <span className="text-xs font-normal text-slate-400 uppercase tracking-tighter">CVE</span></p>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide mt-1">{ride.availableSeats} lugares livres</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-50 pt-4">
                      <div className="flex items-center gap-3">
                        <Badge variant="neutral" className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800/50">{getRideDateLabel(ride.departureTime)}</Badge>
                        {ride.vehicle && (
                          <Badge variant="neutral" className="bg-blue-50 text-blue-600 border border-blue-100">
                            <Car size={12} className="inline mr-1 shrink-0" />
                            {ride.vehicle.make} {ride.vehicle.model} ({ride.vehicle.plate})
                          </Badge>
                        )}
                        {ride.observations && (
                          <Badge variant="neutral" className="hidden sm:block">Bagagem Permitida</Badge>
                        )}
                      </div>
                      <Link to={`/ride/${ride.id}`}>
                        <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                          Detalhes <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
          
          {filteredRides.length === 0 && (
            <div className="text-center py-20 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700 animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-full w-fit mx-auto mb-4 shadow-sm dark:shadow-none text-gray-400 animate-bounce">
                <Search size={32} />
              </div>
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300">Nenhum trajeto encontrado</h3>
              <p className="text-gray-500 dark:text-slate-400 mt-2">Tente pesquisar com outros termos ou altere os filtros.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
