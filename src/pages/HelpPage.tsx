import { Car, CheckCircle, Clock, Coins, HelpCircle, Route, Search, ShieldCheck, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';

const steps = [
  {
    icon: Search,
    title: 'Procura uma viagem',
    text: 'Indica origem, destino, data ou horário para encontrar boleias disponíveis.',
  },
  {
    icon: CheckCircle,
    title: 'Pede a tua vaga',
    text: 'Envia um pedido ao motorista e aguarda a confirmação da tua participação.',
  },
  {
    icon: Route,
    title: 'Combina os detalhes',
    text: 'Usa as mensagens para alinhar ponto de encontro, hora e outras informações.',
  },
  {
    icon: Car,
    title: 'Viaja com confiança',
    text: 'Depois da confirmação, acompanha a viagem e mantém tudo organizado na aplicação.',
  },
];

const benefits = [
  {
    icon: Coins,
    title: 'Economia de custos',
    text: 'Motoristas e passageiros podem dividir despesas e tornar deslocações mais acessíveis.',
  },
  {
    icon: Search,
    title: 'Facilidade para encontrar viagens',
    text: 'A listagem mostra viagens disponíveis de forma simples, com filtros por origem, destino e data.',
  },
  {
    icon: ShieldCheck,
    title: 'Segurança e confiança',
    text: 'Perfis, avaliações, mensagens e confirmações ajudam a criar confiança entre utilizadores.',
  },
  {
    icon: Clock,
    title: 'Rapidez na organização',
    text: 'Publicar, pedir vaga, responder solicitações e conversar acontece no mesmo lugar.',
  },
];

export const HelpPage = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <HelpCircle size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-50">Ajuda da Boleia</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Entenda como usar a aplicação para encontrar, publicar e organizar boleias.
            </p>
          </div>
        </div>
      </header>

      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">O que é a Boleia?</h2>
        <Card className="p-6">
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            A Boleia é uma aplicação para ligar pessoas que têm lugares livres no carro a pessoas que precisam de se deslocar.
            O objetivo é facilitar viagens partilhadas, reduzir custos e tornar a organização de deslocações mais simples e segura.
          </p>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Como funciona</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <Card key={step.title} className="p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                <step.icon size={20} />
              </div>
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-50">{step.title}</h3>
              <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">{step.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Principais vantagens</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {benefits.map((benefit) => (
            <Card key={benefit.title} className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30">
                  <benefit.icon size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-slate-50">{benefit.title}</h3>
                  <p className="mt-2 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">{benefit.text}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">Dicas rápidas</h2>
        <Card className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex gap-3">
              <Users size={18} className="mt-0.5 text-blue-600" />
              <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">Mantenha o perfil atualizado para gerar confiança.</p>
            </div>
            <div className="flex gap-3">
              <ShieldCheck size={18} className="mt-0.5 text-blue-600" />
              <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">Combine detalhes importantes por mensagem antes da viagem.</p>
            </div>
            <div className="flex gap-3">
              <Clock size={18} className="mt-0.5 text-blue-600" />
              <p className="text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">Avise cedo se houver atraso, alteração ou cancelamento.</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};
