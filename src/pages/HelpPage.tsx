import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChatWindow } from '../components/ui/ChatWindow';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Geral' | 'Motorista' | 'Passageiro' | 'Segurança';
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Como posso oferecer uma carona de forma segura?',
    answer: 'Aceda à opção "Publicar" no menu esquerdo, insira o ponto de partida, destino final, data, hora estimada, o custo partilhado (em CVE) e o número de lugares livres. Para maior confiança, preencha os dados do seu veículo e certifique-se de que o seu perfil está verificado.',
    category: 'Motorista'
  },
  {
    id: 'faq-2',
    question: 'Como é feito o pagamento da carona?',
    answer: 'O acerto de custos é feito de forma direta e informal entre motoristas e passageiros (dinheiro em mão ou transferência digital). A Morabeza Rides não processa pagamentos online nem cobra comissões sobre as suas boleias - o valor economizado reverte na íntegra para a vossa viagem!',
    category: 'Geral'
  },
  {
    id: 'faq-3',
    question: 'Como funciona a verificação de documentos ⭐?',
    answer: 'Para obter o selo azul de utilizador verificado, aceda ao seu Perfil, expanda a área "Verificar Perfil" e carregue imagens legíveis da sua identificação (CNI ou BI) e da sua Carta de Condução (caso pretenda ser motorista). A nossa equipa de administração irá inspecionar e aprovar a sua conta em menos de 24 horas.',
    category: 'Segurança'
  },
  {
    id: 'faq-4',
    question: 'Como posso cancelar a minha vaga reservada?',
    answer: 'Se o seu plano mudar, vá a "Minhas Viagens" e clique no trajeto pretendido. Poderá cancelar a sua reserva a qualquer momento. Recomendamos vivamente que avise o motorista atempadamente ou lhe envie uma mensagem direta explicativa via chat.',
    category: 'Passageiro'
  },
  {
    id: 'faq-5',
    question: 'O que devo fazer se detetar comportamento suspeito?',
    answer: 'A segurança da nossa comunidade Morabeza é a prioridade absoluta. Caso note condutas inadequadas ou informações enganosas, por favor abra de imediato um chat de apoio ao cliente connosco aqui na Central de Ajuda ou contacte a equipa técnica oficial pelo email suporte@morabezarides.cv.',
    category: 'Segurança'
  }
];

export const HelpPage = () => {
  const { user, users, messages } = useAppStore();
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedAdminChatUserId, setSelectedAdminChatUserId] = useState<string | null>(null);

  const isAdmin = user?.email === 'joel@gmail.com';

  // Toggle FAQ accordion
  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  // Admin help views:
  // Admin needs to see all unique help-center channels initiated by users.
  // A channel is formed whenever a message exists with rideId = `admin-help-${userId}`
  const helpChannels = Array.from(
    new Set(
      messages
        .filter(m => m.rideId?.startsWith('admin-help-'))
        .map(m => m.rideId?.replace('admin-help-', ''))
    )
  ).map(userId => {
    const chatUser = users.find(u => u.id === userId);
    const lastChatMsg = messages
      .filter(m => m.rideId === `admin-help-${userId}`)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    return {
      userId,
      user: chatUser,
      lastMessage: lastChatMsg,
    };
  }).filter(ch => ch.user); // Only keep channels with valid users

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight uppercase flex items-center gap-3">
          <HelpCircle className="text-blue-600 w-8 h-8" />
          Central de Ajuda e Suporte
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl">
          Tire as suas dúvidas em segundos sobre o funcionamento da rede Morabeza Rides ou fale em tempo real com os nossos administradores de suporte.
        </p>
      </header>

      {!isAdmin ? (
        // --- CUSTOMER VIEW ---
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* FAQ Area (Accordion) */}
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Instruções e Dúvidas Frequentes</h2>
            
            <div className="space-y-3">
              {FAQS.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <Card key={faq.id} className="border-slate-100 dark:border-slate-800/50 overflow-hidden shadow-sm dark:shadow-none" hover={false}>
                    <button
                      type="button"
                      onClick={() => toggleFaq(faq.id)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 transition-colors focus:outline-none cursor-pointer"
                    >
                      <div className="space-y-1">
                        <Badge variant={
                          faq.category === 'Motorista' ? 'primary' :
                          faq.category === 'Passageiro' ? 'success' :
                          faq.category === 'Segurança' ? 'warning' : 'neutral'
                        } className="text-[9px] font-bold uppercase py-0.5 px-2">
                          {faq.category}
                        </Badge>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 mt-1">{faq.question}</h4>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="text-slate-400 shrink-0" size={18} />
                      ) : (
                        <ChevronDown className="text-slate-400 shrink-0" size={18} />
                      )}
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800/50/50"
                        >
                          <p className="p-5 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Support Chat Trigger */}
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Canal de Suporte Direto</h2>
            
            {!isChatOpen ? (
              <Card className="p-6 text-center space-y-4 shadow-sm dark:shadow-none border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm dark:shadow-none">
                  <MessageSquare size={28} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Suporte Técnico da Plataforma</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                    Precisa de falar com quem manda? Clique em "Abrir Chat" para abrir um canal de mensagens em tempo real com o administrador <strong>Joel</strong>.
                  </p>
                </div>
                <Button 
                  onClick={() => setIsChatOpen(true)} 
                  variant="primary" 
                  className="w-full py-3 shrink-0 cursor-pointer font-bold"
                >
                  Abrir Suporte com Administrador
                </Button>
              </Card>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-150 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wide">Suporte técnico ativo</span>
                  <button 
                    onClick={() => setIsChatOpen(false)}
                    className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                  >
                    Fechar Chat
                  </button>
                </div>
                {user && (
                  <ChatWindow 
                    rideId={`admin-help-${user.id}`}
                    recipientName="Joel (Administrador)"
                    recipientPhoto="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // --- ADMIN VIEW ---
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Active Support Tickets List */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Mensagens Recebidas de Ajuda</h2>
            
            <div className="space-y-3">
              {helpChannels.length > 0 ? (
                helpChannels.map((ch) => {
                  const isSelected = selectedAdminChatUserId === ch.userId;
                  return (
                    <Card
                      key={ch.userId}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 transition-colors border-slate-100 dark:border-slate-800/50 shadow-sm dark:shadow-none cursor-pointer ${
                        isSelected ? 'ring-2 ring-blue-600 bg-blue-50/20' : ''
                      }`}
                      onClick={() => {
                        setSelectedAdminChatUserId(ch.userId);
                        setIsChatOpen(true);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={ch.user?.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'}
                          alt={ch.user?.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-150"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-50 truncate">
                              {ch.user?.name}
                            </h4>
                            <span className="text-[9px] text-slate-400 font-mono">
                              {ch.lastMessage 
                                ? format(new Date(ch.lastMessage.timestamp), "HH:mm") 
                                : ''}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {ch.user?.email}
                          </p>
                          <p className="text-xs text-slate-650 italic leading-relaxed line-clamp-1 mt-1.5 p-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                            "{ch.lastMessage?.text || 'Sem mensagens'}"
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <Card className="p-10 text-center border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                  <MessageSquare size={24} className="text-slate-350 mx-auto mb-3" />
                  <p className="text-xs text-slate-400 italic">Nenhum canal de suporte ativo no momento.</p>
                </Card>
              )}
            </div>
          </div>

          {/* Active Administrator Chat Window */}
          <div className="md:col-span-7 space-y-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Monitor do Chat de Atendimento</h2>
            
            {selectedAdminChatUserId && isChatOpen ? (
              (() => {
                const targetUser = users.find(u => u.id === selectedAdminChatUserId);
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-2xl border border-blue-100">
                      <div className="flex items-center gap-2">
                        <Badge variant="primary" className="bg-blue-600 text-white font-bold py-0.5 px-2">Suporte</Badge>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 dark:text-slate-700">Canal: {targetUser?.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          setIsChatOpen(false);
                          setSelectedAdminChatUserId(null);
                        }}
                        className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                      >
                        Desativar Monitor
                      </button>
                    </div>
                    <ChatWindow
                      rideId={`admin-help-${selectedAdminChatUserId}`}
                      recipientName={targetUser?.name || 'Utente'}
                      recipientPhoto={targetUser?.photoUrl}
                    />
                  </div>
                );
              })()
            ) : (
              <Card className="p-12 text-center border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-3xl min-h-[400px] flex flex-col justify-center items-center">
                <ShieldAlert size={36} className="text-slate-300 mb-4" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50">Nenhum Chat de Suporte Selecionado</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-2 leading-relaxed">
                  Selecione um utilizador na lista à esquerda para carregar com segurança o seu formulário e histórico de chat direto e responder às suas dúvidas.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
