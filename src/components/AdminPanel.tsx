import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, ShieldAlert, CheckCircle, XCircle, FileText,
  TrendingUp, Coins, Search, Eye,
  Activity, UserCheck, Star,
  Car, AlertTriangle
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { cn } from '../lib/utils';

export const AdminPanel = () => {
  const { users, rides, blockUser, unblockUser, verifyUser, verifyDocument } = useAppStore();
  
  const [activeSubTab, setActiveSubTab] = useState<'metrics' | 'users'>('metrics');
  const [userSearchText, setUserSearchText] = useState('');
  const [selectedUserForDocs, setSelectedUserForDocs] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // CALCULATING METRICS
  const totalUsersCount = users.length;
  const totalDriversCount = users.filter(u => u.role === 'driver').length;
  const totalPassengersCount = users.filter(u => u.role === 'passenger').length;
  const blockedUsersCount = users.filter(u => u.isBlocked).length;
  const verifiedUsersCount = users.filter(u => u.isVerified).length;

  const totalRidesCount = rides.length;
  const ridesCompleted = rides.filter(r => r.status === 'completed').length;
  const ridesInProgress = rides.filter(r => r.status === 'in_progress').length;
  const ridesCancelled = rides.filter(r => r.status === 'cancelled').length;
  const ridesAvailable = rides.filter(r => r.status === 'available').length;

  // Revenue Volume Estimate
  const totalCveVolume = rides
    .filter(r => r.status !== 'cancelled')
    .reduce((acc, r) => acc + (r.price || 0) * (r.totalSeats - r.availableSeats), 0);

  // Seat Occupation Rate
  const totalSeatsAllocated = rides.reduce((acc, r) => acc + r.totalSeats, 0);
  const occupiedSeats = rides.reduce((acc, r) => acc + (r.totalSeats - r.availableSeats), 0);
  const occupationRate = totalSeatsAllocated > 0 
    ? Math.round((occupiedSeats / totalSeatsAllocated) * 100) 
    : 0;

  // Selected User Object for Document Inspection
  const inspectingUser = users.find(u => u.id === selectedUserForDocs);

  // Filtered Users List
  const filteredUsers = users.filter(u => {
    const term = userSearchText.toLowerCase();
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.id.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-[200] bg-slate-900 border border-slate-800 text-white px-5 py-3 rounded-2xl shadow-xl dark:shadow-none flex items-center gap-2.5 text-xs font-bold font-mono"
          >
            <Activity size={14} className="text-emerald-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="bg-slate-950 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-xl dark:shadow-none border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-800/25 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-black text-slate-400">Ambiente de Controlo da Aplicação</span>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight leading-none text-white">Central de Administração</h1>
            <p className="text-xs text-slate-400 mt-2 max-w-xl leading-relaxed">
              Painel interno centralizado de monitorização. Verifique candidaturas de motoristas, gira utilizadores e analise a rotação financeira interurbana em tempo real.
            </p>
          </div>

          {/* Submenu Tabs */}
          <div className="flex gap-2.5 pt-4">
            <button
              onClick={() => setActiveSubTab('metrics')}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border cursor-pointer",
                activeSubTab === 'metrics'
                  ? "bg-white dark:bg-slate-900 text-slate-950 border-white shadow-md dark:shadow-none shadow-white/5"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Activity size={14} /> Métricas de Controlo
            </button>
            <button
              onClick={() => setActiveSubTab('users')}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 border cursor-pointer",
                activeSubTab === 'users'
                  ? "bg-white dark:bg-slate-900 text-slate-950 border-white shadow-md dark:shadow-none shadow-white/5"
                  : "bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Users size={14} /> Gestão de Utilizadores
              {users.some(u => u.documents?.some(d => d.status === 'pending')) && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB: METRICS */}
      {activeSubTab === 'metrics' && (
        <div className="space-y-6">
          {/* Bento metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric Card 1 */}
            <Card className="p-5 border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 relative overflow-hidden shadow-sm dark:shadow-none" hover={false}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Volume Financeiro (CVE)</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-50">{totalCveVolume.toLocaleString()} $</p>
                </div>
                <div className="p-2 w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <Coins size={18} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] bg-emerald-50/50 w-fit px-2 py-0.5 rounded-md border border-emerald-100">
                <TrendingUp size={10} className="text-emerald-600" />
                <span className="font-bold text-emerald-700">Estimativa com base em reservas</span>
              </div>
            </Card>

            {/* Metric Card 2 */}
            <Card className="p-5 border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 relative overflow-hidden shadow-sm dark:shadow-none" hover={false}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Utilizadores Totais</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-50">{totalUsersCount}</p>
                </div>
                <div className="p-2 w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Users size={18} />
                </div>
              </div>
              <div className="mt-4 flex gap-3 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                <span>🚘 {totalDriversCount} Condutores</span>
                <span>🚶 {totalPassengersCount} Passageiros</span>
              </div>
            </Card>

            {/* Metric Card 3 */}
            <Card className="p-5 border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 relative overflow-hidden shadow-sm dark:shadow-none" hover={false}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Viagens Publicadas</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-50">{totalRidesCount}</p>
                </div>
                <div className="p-2 w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                  <Car size={18} />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                <span className="text-blue-600">🚗 {ridesAvailable} Disp.</span>
                <span className="text-indigo-600">⚡ {ridesInProgress} Curso</span>
                <span className="text-emerald-600">🏁 {ridesCompleted} Concl.</span>
              </div>
            </Card>

            {/* Metric Card 4 */}
            <Card className="p-5 border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900 relative overflow-hidden shadow-sm dark:shadow-none" hover={false}>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Ocupação de Vagas</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-50">{occupationRate}%</p>
                </div>
                <div className="p-2 w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
              </div>
              <div className="mt-4 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 w-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${occupationRate}%` }}></div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* VISUAL CHART 1: RIDE STATUS GRAPHICS */}
            <Card className="p-6 col-span-1 lg:col-span-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-none" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Volume de Trajetos por Status</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Distribuição estrita de viagens e eficiência de conclusão</p>
                </div>
                <Badge variant="primary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-none font-mono text-[9px]">LIVRE DE ERROS</Badge>
              </div>

              {/* Elegant SVG Custom bar graph */}
              <div className="space-y-4">
                {[
                  { label: 'Boleias Disponíveis', count: ridesAvailable, color: 'bg-blue-500', percent: totalRidesCount ? (ridesAvailable / totalRidesCount) * 100 : 0 },
                  { label: 'Em Curso Ativas', count: ridesInProgress, color: 'bg-indigo-500', percent: totalRidesCount ? (ridesInProgress / totalRidesCount) * 100 : 0 },
                  { label: 'Concluídas com Sucesso', count: ridesCompleted, color: 'bg-emerald-500', percent: totalRidesCount ? (ridesCompleted / totalRidesCount) * 100 : 0 },
                  { label: 'Viagens Canceladas', count: ridesCancelled, color: 'bg-red-400', percent: totalRidesCount ? (ridesCancelled / totalRidesCount) * 100 : 0 },
                ].map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <span className={cn("w-2.5 h-2.5 rounded-full inline-block", item.color)}></span>
                        {item.label}
                      </span>
                      <span className="font-mono text-slate-505 font-bold">{item.count} boleias ({Math.round(item.percent)}%)</span>
                    </div>
                    <div className="h-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800/50 flex">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ delay: index * 0.1, duration: 0.8 }}
                        className={cn("h-full rounded-xl transition-all", item.color)}
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                <span>Rácio de Cancelamento: <strong className="text-red-500 font-bold">{totalRidesCount ? Math.round((ridesCancelled / totalRidesCount) * 100) : 0}%</strong></span>
                <span>Taxa de Sucesso (Conclusão): <strong className="text-emerald-500 font-bold">{totalRidesCount ? Math.round((ridesCompleted / totalRidesCount) * 100) : 0}%</strong></span>
              </div>
            </Card>

            {/* SEGMENT 2: VERIFICATION MATRIX & QUICK STATS */}
            <Card className="p-6 col-span-1 lg:col-span-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800/60 shadow-sm dark:shadow-none flex flex-col justify-between" hover={false}>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Verificação de Contas</h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">Distribuição de integridade da comunidade</p>
                </div>

                <div className="relative py-6 flex items-center justify-center">
                  {/* Custom Graphical Wheel representing verification */}
                  <div className="w-28 h-28 rounded-full border-8 border-slate-50 flex flex-col items-center justify-center shadow-inner relative">
                    <p className="text-xl font-black text-slate-900 dark:text-slate-50 leading-none">{verifiedUsersCount}</p>
                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-tight mt-1">Verificados</p>
                    
                    {/* decorative progress spinner half */}
                    <svg className="absolute inset-0 w-28 h-28 transform -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="50"
                        className="stroke-blue-600 fill-none"
                        strokeWidth="8"
                        strokeDasharray="314"
                        strokeDashoffset={314 - (314 * (verifiedUsersCount / (totalUsersCount || 1)))}
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2 pt-2 text-xs font-bold font-mono">
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <span className="flex items-center gap-1.5"><CheckCircle size={12} className="text-blue-500" /> Contas Verificadas</span>
                    <span>{verifiedUsersCount} / {totalUsersCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <span className="flex items-center gap-1.5"><ShieldAlert size={12} className="text-red-500" /> Contas Bloqueadas</span>
                    <span>{blockedUsersCount}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/50">
                    <span className="flex items-center gap-1.5"><FileText size={12} className="text-amber-500" /> Candidaturas Pendentes</span>
                    <span>{users.filter(u => u.documents?.some(d => d.status === 'pending')).length}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* APPLICATION RUNTIME LOGS (MOCK) */}
          <Card className="p-6 bg-slate-950 border border-slate-800 text-slate-100" hover={false}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-mono text-xs uppercase tracking-wider font-extrabold text-slate-400">Últimos Eventos de Auditoria Local</span>
              </div>
              <Badge variant="neutral" className="bg-slate-900 border-none font-mono text-[9px] text-slate-400">Sincronizado</Badge>
            </div>

            <div className="space-y-2.5 font-mono text-[10px] text-slate-400 max-h-48 overflow-y-auto">
              <div className="flex gap-4 border-b border-slate-900 pb-1.5">
                <span className="text-slate-550">2026-05-25 17:01</span>
                <span className="text-blue-400 uppercase font-bold">[AUTH]</span>
                <span>Utilizador joel@gmail.com efetuou login com sucesso usando privilégios de ROOT.</span>
              </div>
              <div className="flex gap-4 border-b border-slate-900 pb-1.5">
                <span className="text-slate-550">2026-05-25 16:42</span>
                <span className="text-emerald-400 uppercase font-bold">[RIDE]</span>
                <span>Viagem de Praia para Assomada (ID: r1) mudou estado de 'is_progress' para 'completed'. Notificações enviadas.</span>
              </div>
              <div className="flex gap-4 border-b border-slate-900 pb-1.5">
                <span className="text-slate-550">2026-05-25 16:33</span>
                <span className="text-blue-400 uppercase font-bold">[RIDE]</span>
                <span>Motorista iniciou partida de Praia para Assomada (ID: r1). Notificação gerada a passageiros.</span>
              </div>
              <div className="flex gap-4 border-b border-slate-900 pb-1.5">
                <span className="text-slate-550">2026-05-25 15:54</span>
                <span className="text-yellow-400 uppercase font-bold">[DOCS]</span>
                <span>Maria Varela submeteu novo documento de identificação nacional (CNI) em formato digital para auditoria.</span>
              </div>
              <div className="flex gap-4">
                <span className="text-slate-550">2026-05-25 08:30</span>
                <span className="text-magenta-400 uppercase font-bold text-pink-400">[USER]</span>
                <span>Registo integrado de nova viatura pelo utilizador Carlos Semedo (Toyota Hilux, CV-123-AB).</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* SUB-TAB: USERS LIST */}
      {activeSubTab === 'users' && (
        <Card className="p-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none" hover={false}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-black text-slate-950">Filtro de Utilizadores do Sistema</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Pode pesquisar por nome, email ou ID para bloquear, verificar e inspecionar perfis.</p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:max-w-xs">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearchText}
                onChange={(e) => setUserSearchText(e.target.value)}
                placeholder="Pesquisar utilizador..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/50 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  <th className="py-3 px-4">Utilizador</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Filiação</th>
                  <th className="py-3 px-4">Integridade</th>
                  <th className="py-3 px-4">Verificação</th>
                  <th className="py-3 px-4 text-right">Ações de Controlo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-xs">
                {filteredUsers.map((u) => {
                  const hasPendingDocs = u.documents?.some(d => d.status === 'pending');
                  
                  return (
                    <tr 
                      key={u.id} 
                      className={cn(
                        "hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 transition-colors",
                        u.isBlocked && "bg-red-50/10 text-slate-400"
                      )}
                    >
                      {/* Avatar & Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={u.photoUrl} alt={u.name} className="w-9 h-9 rounded-full object-cover bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50" />
                          <div>
                            <p className="font-bold text-slate-950 flex items-center gap-1.5">
                              {u.name}
                              {u.isVerified && <CheckCircle size={13} className="text-blue-500 fill-blue-50" />}
                            </p>
                            <p className="text-[10px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role Card */}
                      <td className="py-3.5 px-4 font-bold">
                        {u.role === 'driver' ? (
                          <span className="text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-md border border-blue-100/30">Motorista</span>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">Passageiro</span>
                        )}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 font-mono text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                        {u.joinedAt}
                      </td>

                      {/* Blocked and Rating State */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          {u.isBlocked ? (
                            <span className="font-bold text-red-600 flex items-center gap-1 text-[10px]">
                              <XCircle size={11} className="shrink-0" /> BLOQUEADO
                            </span>
                          ) : (
                            <span className="font-bold text-emerald-600 flex items-center gap-1 text-[10px]">
                              <CheckCircle size={11} className="shrink-0" /> ACTIVO
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                            <Star size={10} className="text-yellow-500 fill-current" />
                            <span>{u.rating} • {u.totalTrips} viagens</span>
                          </div>
                        </div>
                      </td>

                      {/* Documents state */}
                      <td className="py-3.5 px-4">
                        {hasPendingDocs ? (
                          <button
                            onClick={() => setSelectedUserForDocs(u.id)}
                            className="bg-amber-100 hover:bg-amber-200 border border-amber-200 text-amber-700 font-bold text-[9px] uppercase px-2 py-1 rounded-md animate-pulse flex items-center gap-1 cursor-pointer"
                          >
                            <FileText size={10} /> Pendente ({u.documents?.filter(d => d.status === 'pending').length})
                          </button>
                        ) : u.documents && u.documents.length > 0 ? (
                          <button
                            onClick={() => setSelectedUserForDocs(u.id)}
                            className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold text-[9px] uppercase px-2 py-1 rounded-md flex items-center gap-1 cursor-pointer"
                          >
                            <Eye size={10} /> Ver Docs ({u.documents.length})
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Sem Docs</span>
                        )}
                      </td>

                      {/* User Control actions buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Block Toggler */}
                          {u.isBlocked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs text-emerald-600 hover:text-white border-emerald-100 hover:bg-emerald-600 bg-emerald-50/10"
                              onClick={() => {
                                unblockUser(u.id);
                                triggerToast(`Conta de ${u.name} foi reactivada.`);
                              }}
                            >
                              Desbloquear
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs text-red-600 hover:text-white border-red-150 hover:bg-red-600 bg-red-50/10"
                              onClick={() => {
                                blockUser(u.id);
                                triggerToast(`Conta de ${u.name} foi bloqueada pelo sistema.`);
                              }}
                              disabled={u.email === 'joel@gmail.com'}
                            >
                              Bloquear
                            </Button>
                          )}

                          {/* Manual Verification */}
                          {!u.isVerified ? (
                            <Button
                              variant="primary"
                              size="sm"
                              className="text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={() => {
                                verifyUser(u.id);
                                triggerToast(`Utilizador ${u.name} verificado oficialmente! ⭐`);
                              }}
                            >
                              Verificar
                            </Button>
                          ) : (
                            <button
                              disabled
                              className="text-blue-600/60 bg-blue-50 border border-blue-100/50 px-3 py-1.5 rounded-xl font-bold text-xs cursor-not-allowed flex items-center gap-1"
                            >
                              <UserCheck size={12} /> OK
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-slate-400">
                      Nenhum utilizador encontrado para "{userSearchText}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* DETAILED DOCUMENTS VERIFICATION MODAL */}
      <AnimatePresence>
        {selectedUserForDocs && inspectingUser && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl dark:shadow-none relative border border-slate-100 dark:border-slate-800/50 flex flex-col max-h-[90vh]"
            >
              {/* Head */}
              <div className="flex justify-between items-start border-b border-slate-150 pb-4">
                <div className="flex items-center gap-3">
                  <img src={inspectingUser.photoUrl} alt={inspectingUser.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h3 className="text-lg font-black text-slate-950">Documentação Escaneada de {inspectingUser.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Registo submetido para auditoria de motorista ou passageiro verificado.</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedUserForDocs(null);
                    setSelectedDocId(null);
                  }}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 text-slate-400 transition-colors"
                >
                  <XCircle size={22} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto py-5 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                  {/* Left Column: List of docs */}
                  <div className="col-span-1 md:col-span-5 space-y-2.5">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Documentos do Utilizador</p>
                    {inspectingUser.documents?.map(doc => (
                      <button
                        key={doc.id}
                        onClick={() => setSelectedDocId(doc.id)}
                        className={cn(
                          "w-full text-left p-3.5 rounded-2xl border transition-all flex flex-col gap-1 cursor-pointer",
                          selectedDocId === doc.id || (!selectedDocId && inspectingUser.documents?.[0]?.id === doc.id)
                            ? "bg-slate-900 text-white border-transparent shadow-lg dark:shadow-none"
                            : "bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800"
                        )}
                      >
                        <p className="font-extrabold text-[11px] leading-tight">{doc.name}</p>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                          {doc.status === 'verified' && (
                            <span className="text-emerald-500 font-bold flex items-center gap-0.5"><CheckCircle size={10} /> Validado</span>
                          )}
                          {doc.status === 'rejected' && (
                            <span className="text-red-500 font-bold flex items-center gap-0.5"><XCircle size={10} /> Recusado</span>
                          )}
                          {doc.status === 'pending' && (
                            <span className="text-amber-500 font-bold flex items-center gap-0.5 animate-pulse"><AlertTriangle size={10} /> Pendente</span>
                          )}
                        </div>
                      </button>
                    ))}

                    {(!inspectingUser.documents || inspectingUser.documents.length === 0) && (
                      <p className="text-xs text-slate-400 py-4">Este utilizador ainda não carregou os seus documentos fiscais ou habilitantes.</p>
                    )}
                  </div>

                  {/* Right Column: Doc viewer & Actions */}
                  <div className="col-span-1 md:col-span-7 flex flex-col gap-4">
                    {(() => {
                      const doc = inspectingUser.documents?.find(d => d.id === (selectedDocId || inspectingUser.documents?.[0]?.id));
                      if (!doc) return <div className="p-8 text-center text-slate-400 text-xs">Selecione um documento para visualizar</div>;

                      return (
                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Visualização do Anexo</p>
                          <div className="border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-none bg-slate-100 dark:bg-slate-800 h-64 relative group">
                            <img
                              src={doc.url}
                              alt={doc.name}
                              className="w-full h-full object-cover"
                            />
                            {/* Overlay tag */}
                            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 text-[9px] font-bold rounded-lg leading-tight uppercase tracking-wider">
                              Ficheiro PDF/Imagem Carregado
                            </div>
                          </div>

                          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/50 rounded-2xl space-y-3">
                            <div>
                              <p className="font-black text-slate-900 dark:text-slate-50 text-xs">{doc.name}</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Estado actual: 
                                <strong className={cn(
                                  "font-bold ml-1 uppercase",
                                  doc.status === 'verified' ? 'text-emerald-600' : doc.status === 'rejected' ? 'text-red-600' : 'text-amber-600 animate-pulse'
                                )}> {doc.status === 'verified' ? 'Aprovado' : doc.status === 'rejected' ? 'Recusado' : 'Pendente de Auditoria'}</strong>
                              </p>
                            </div>

                            <div className="flex gap-2.5 pt-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50 font-bold uppercase"
                                onClick={() => {
                                  verifyDocument(inspectingUser.id, doc.id, 'rejected');
                                  triggerToast(`Documentação "${doc.name}" foi recusada.`);
                                  // Re-trigger visual updates
                                }}
                              >
                                Rejeitar Ficheiro
                              </Button>
                              <Button
                                size="sm"
                                variant="primary"
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase"
                                onClick={() => {
                                  verifyDocument(inspectingUser.id, doc.id, 'verified');
                                  triggerToast(`Documentação "${doc.name}" validada com sucesso!`);
                                }}
                              >
                                Aprovar Documento
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Foot */}
              <div className="border-t border-slate-100 dark:border-slate-800/50 pt-4 flex justify-end">
                <Button
                  onClick={() => {
                    setSelectedUserForDocs(null);
                    setSelectedDocId(null);
                  }}
                  className="px-6 font-bold"
                >
                  Fechar Auditoria de Perfil
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
