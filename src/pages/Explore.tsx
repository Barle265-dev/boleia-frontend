import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Calendar, Users, Filter, Clock, X, RotateCcw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RideCard } from '../components/ui/RideCard';
import { useAppStore } from '../store/useAppStore';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '../lib/utils';

export const Explore = () => {
  const { rides, user } = useAppStore();
  const [search, setSearch] = useState('');
  const [destination, setDestination] = useState('');

  // Time and Date filters state
  const [showFilters, setShowFilters] = useState(false);
  const [timePeriod, setTimePeriod] = useState<'all' | 'morning' | 'afternoon' | 'night'>('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [specificTime, setSpecificTime] = useState('');
  const clearFilters = () => {
    setTimePeriod('all');
    setSelectedDate('');
    setSpecificTime('');
  };

  const filteredRides = rides.filter(ride => {
    const isParticipant =
      Boolean(user) &&
      (ride.driverId === user?.id || ride.passengers.includes(user?.id || ''));

    if (ride.status !== 'available' && !(ride.status === 'in_progress' && isParticipant)) {
      return false;
    }

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
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-300">Olá, {user?.name.split(' ')[0]}</h1>
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
                  {/* PerÃƒÂ­odo do Dia (Time Interval) */}
                  <div className="space-y-2 col-span-1 md:col-span-5">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">PerÃƒÂ­odo do Dia</label>
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

                  {/* Hora de Partida EspecÃƒÂ­fica (Specific Hour) */}
                  <div className="space-y-2 col-span-1 md:col-span-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Hora EspecÃƒÂ­fica</label>
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
              <span>PerÃƒÂ­odo: {timePeriod === 'morning' ? 'ManhÃƒÂ£' : timePeriod === 'afternoon' ? 'Tarde' : 'Noite'}</span>
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
              <span>Hora: {specificTime} (Ã‚Â±1h)</span>
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
            Boleias Disponiveis / Em Curso ({filteredRides.length})
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredRides.map((ride, i) => (
            <RideCard key={ride.id} ride={ride} index={i} />
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
