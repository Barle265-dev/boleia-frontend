import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion } from 'motion/react';
import { MapPin, Clock, Car, CheckCircle, XCircle, Phone, Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

export const RequestCarPage = () => {
  const { user, freightRequests, addFreightRequest, acceptFreightRequest, declineFreightRequest, users, setAuthModalOpen } = useAppStore();
  
  const [activeTab, setActiveTab] = useState<'request' | 'list'>('request');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const [specificFretistaId, setSpecificFretistaId] = useState('');
  

  const isFretista = user?.role === 'fretista';

  // For a normal user: show their own requests
  const myRequests = user ? freightRequests.filter(r => r.requesterId === user.id) : [];

  // For a fretista: show pending requests that are either general OR specifically for them, plus their accepted ones
  const fretistaRequests = user ? freightRequests.filter(r => {
    if (r.status === 'pending') {
      return !r.specificFretistaId || r.specificFretistaId === user.id;
    }
    if (['accepted', 'in_progress', 'completed'].includes(r.status)) {
      return r.fretistaId === user.id;
    }
    return false;
  }) : [];

  const availableFretistas = users.filter(u => u.role === 'fretista');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    if (!origin || !destination) return;
    
    addFreightRequest(origin, destination, requestedTime || undefined, specificFretistaId || undefined);
    
    setOrigin('');
    setDestination('');
    setRequestedTime('');
    setSpecificFretistaId('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight uppercase flex items-center gap-3">
            <Car className="text-blue-600 w-8 h-8" />
            {isFretista ? 'Gestão de Fretes' : 'Pedir Carro / Frete'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mt-2">
            {isFretista 
              ? 'Veja e aceite pedidos de transporte e fretes de outros utilizadores.' 
              : 'Precisa de transportar carga ou de um carro inteiro? Solicite aqui um serviço de frete direto.'}
          </p>
        </div>

        {!isFretista && (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('request')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'request'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm dark:shadow-none'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700/50'
              }`}
            >
              Fazer Solicitação
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'list'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm dark:shadow-none'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700/50'
              }`}
            >
              Fretistas / Ubers Disponíveis
            </button>
          </div>
        )}
      </header>

      {!isFretista && activeTab === 'request' && (
        <Card className="p-6 bg-white dark:bg-slate-900 shadow-sm dark:shadow-none border-slate-200 dark:border-slate-800" hover={false}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-50 border-b border-slate-100 dark:border-slate-800/50 pb-2">Nova Solicitação de Serviço</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Origem</label>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 focus-within:border-blue-500 transition-colors">
                  <MapPin size={18} className="text-slate-400" />
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Praia (Sucupira)"
                    className="bg-transparent border-none outline-none w-full text-sm font-semibold"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Destino</label>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 focus-within:border-blue-500 transition-colors">
                  <MapPin size={18} className="text-blue-500" />
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Assomada (Centro)"
                    className="bg-transparent border-none outline-none w-full text-sm font-semibold"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Data e Hora Desejada (Opcional)</label>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 focus-within:border-blue-500 transition-colors">
                  <Clock size={18} className="text-slate-400" />
                  <input 
                    type="datetime-local"
                    className="bg-transparent border-none outline-none w-full text-sm font-semibold"
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Fretista Específico (Opcional)</label>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50 focus-within:border-blue-500 transition-colors">
                  <Car size={18} className="text-slate-400" />
                  <select
                    className="bg-transparent border-none outline-none w-full text-sm font-semibold text-slate-700 dark:text-slate-300"
                    value={specificFretistaId}
                    onChange={(e) => setSpecificFretistaId(e.target.value)}
                  >
                    <option value="">Qualquer Fretista</option>
                    {availableFretistas.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.name} (⭐ {f.rating}){f.vehicle?.plate ? ` - Matrícula: ${f.vehicle.plate}` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full sm:w-auto mt-4 px-8 py-3 py-4 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md dark:shadow-none cursor-pointer transition-all">
              Submeter Solicitação
            </Button>
          </form>
        </Card>
      )}

      {(isFretista || activeTab === 'request') && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-8">
            {isFretista ? 'Pedidos de Frete' : 'Meus Pedidos Pendentes / Aceites'}
          </h2>

        {isFretista && fretistaRequests.length === 0 && (
           <Card className="p-12 text-center border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
             <Car size={36} className="text-slate-300 mx-auto mb-4" />
             <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Nenhum pedido no momento</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
               As solicitações de fretes dos clientes vão aparecer aqui em tempo real.
             </p>
           </Card>
        )}

        {!isFretista && myRequests.length === 0 && (
           <Card className="p-12 text-center border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
             <Car size={36} className="text-slate-300 mx-auto mb-4" />
             <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Sem pedidos realizados</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
               Quando enviar uma solicitação de fretamento ela será apresentada nesta área.
             </p>
           </Card>
        )}

        {/* Display the requests (fretista view or regular view) */}
        <div className="grid gap-4">
          {(isFretista ? fretistaRequests : myRequests).map((req, index) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className={`p-5 shadow-sm dark:shadow-none border-slate-200 dark:border-slate-800 ${['accepted', 'in_progress', 'completed'].includes(req.status) ? 'border-l-4 border-l-emerald-500 bg-emerald-50/20' : ''}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  
                  <div className="flex gap-4">
                    {/* If fretista, show requester info. If normal user, show an icon representing the freight */}
                    {isFretista ? (
                      <img 
                        src={req.requesterPhoto || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} 
                        alt={req.requesterName} 
                        className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Car size={24} />
                      </div>
                    )}
                    
                    <div className="space-y-3">
                      <div>
                        {isFretista && <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">{req.requesterName}</h3>}
                        {isFretista && req.requesterPhone && (
                          <a
                            href={`tel:${req.requesterPhone.replace(/\s+/g, '')}`}
                            className="mt-1 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            <Phone size={12} /> {req.requesterPhone}
                          </a>
                        )}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Origem:</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-50">{req.origin}</span>
                          <span className="text-slate-300 mx-1">➔</span>
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Destino:</span>
                          <span className="text-sm font-bold text-slate-900 dark:text-slate-50">{req.destination}</span>
                        </div>
                        {req.requestedTime && (
                           <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
                             <Clock size={12} />
                             {format(new Date(req.requestedTime), "d 'de' MMM', às ' HH:mm", { locale: ptBR })}
                           </div>
                        )}
                        <p className="text-[10px] text-slate-400 font-mono mt-2">
                          Pedido feito há: {format(new Date(req.createdAt), "HH:mm")}
                        </p>
                      </div>

                      {req.specificFretistaId && req.status === 'pending' && (
                         <Badge variant="warning" className="text-[9px] uppercase font-bold px-2 py-0.5 w-fit">
                           {isFretista ? 'Pedido Exclusivo para si' : 'Pedido Direto'}
                         </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3 justify-center border-t border-slate-100 dark:border-slate-800/50 md:border-t-0 pt-4 md:pt-0">
                    <Link to={`/freight/${req.id}${req.status === 'completed' ? '?action=rate' : ''}`}>
                      <Button variant="outline" size="sm">{req.status === 'completed' ? 'Avaliar' : 'Detalhes'}</Button>
                    </Link>
                    <Badge variant={
                        req.status === 'pending' ? 'warning' :
                        ['accepted', 'in_progress', 'completed'].includes(req.status) ? 'success' : 'secondary'
                      } className="text-xs uppercase font-bold tracking-widest px-3 py-1">
                      {req.status === 'pending' ? 'AGUARDANDO CONFIRMAÇÃO' :
                       req.status === 'accepted' ? 'SERVIÇO ACEITE' :
                       req.status === 'in_progress' ? 'SERVIÇO EM CURSO' :
                       req.status === 'completed' ? 'SERVIÇO CONCLUIDO' : 'RECUSADO'}
                    </Badge>
                    
                    {/* Actions for Fretista when Pending */}
                    {isFretista && req.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => acceptFreightRequest(req.id, user.id)}
                          variant="primary" 
                          size="sm" 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm dark:shadow-none font-bold gap-1 cursor-pointer"
                        >
                          <CheckCircle size={14} /> Aceitar
                        </Button>
                        <Button 
                          onClick={() => declineFreightRequest(req.id)}
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 font-bold gap-1 cursor-pointer"
                        >
                          <XCircle size={14} /> Recusar
                        </Button>
                      </div>
                    )}

                    {/* Show fretista info to requester if assigned */}
                    {!isFretista && ['accepted', 'in_progress', 'completed'].includes(req.status) && req.fretistaName && (
                      <div className="text-right">
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Fretista Associado</p>
                        <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{req.fretistaName}</p>
                        {req.fretistaPhone && (
                          <a
                            href={`tel:${req.fretistaPhone.replace(/\s+/g, '')}`}
                            className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline"
                          >
                            <Phone size={12} /> {req.fretistaPhone}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
      )}

      {!isFretista && activeTab === 'list' && (
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
            Fretistas e Ubers Disponíveis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableFretistas.map((fretista, index) => (
              <motion.div
                key={fretista.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-5 shadow-sm dark:shadow-none border-slate-200 dark:border-slate-800 h-full flex flex-col justify-between" hover={true}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={fretista.photoUrl || 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=200'} 
                        alt={fretista.name} 
                        className="w-14 h-14 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 shadow-sm dark:shadow-none"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">{fretista.name}</h3>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-0.5">
                          <Star size={12} className="fill-amber-500" />
                          <span>{fretista.rating?.toFixed(1) || 'N/A'}</span>
                          <span className="text-slate-300 font-normal mx-1">•</span>
                          <span className="text-slate-500 dark:text-slate-400 font-normal">{fretista.totalTrips || 0} fretes</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50">
                      {fretista.phone && (
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-semibold">
                          <Phone size={14} className="text-emerald-600" />
                          <a href={`tel:${fretista.phone.replace(/\s+/g, '')}`} className="hover:underline hover:text-emerald-700">
                            {fretista.phone}
                          </a>
                        </div>
                      )}
                      {fretista.vehicle && (
                        <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 font-semibold">
                          <Car size={14} className="text-blue-500" />
                          <span>{fretista.vehicle.make} {fretista.vehicle.model}</span>
                        </div>
                      )}
                      {fretista.vehicle?.plate && (
                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-mono">
                          <Badge variant="neutral" className="px-1.5 py-0 uppercase border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm dark:shadow-none text-[10px]">
                            {fretista.vehicle.plate}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/50">
                    <Button 
                      variant="outline" 
                      className="w-full font-bold border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
                      onClick={() => {
                        setActiveTab('request');
                        setSpecificFretistaId(fretista.id);
                        // Optional scroll to top smooth
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <Car size={16} className="mr-2" /> Solicitar Direto
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
            {availableFretistas.length === 0 && (
              <div className="col-span-full">
                 <Card className="p-12 text-center border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-3xl">
                   <Car size={36} className="text-slate-300 mx-auto mb-4" />
                   <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Nenhum Fretista Encontrado</h3>
                   <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                     Não há motoristas de frete disponíveis na plataforma no momento.
                   </p>
                 </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
