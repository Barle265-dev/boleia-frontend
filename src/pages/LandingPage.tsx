import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Car, Shield, Users, Wallet, CheckCircle2, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-b from-blue-50 to-slate-50/0 -z-10" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold uppercase tracking-widest shadow-xl dark:shadow-none shadow-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-slate-900"></span>
              </span>
              Lançamento Nacional em Cabo Verde
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-slate-50 leading-[0.9] tracking-tighter">
              Boleia <span className="text-blue-600">Confiável</span> em todo o país.
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-lg leading-snug font-medium">
              Conecte-se com motoristas verificados e viaje de forma segura por Cabo Verde.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/explore">
                <Button size="lg" className="w-full sm:w-auto px-10 py-5 text-lg">
                  Encontrar Boleia
                </Button>
              </Link>
              <Link to="/publish">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 py-5 text-lg">
                  Publicar Trajeto
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(30,58,138,0.2)] border-8 border-white bg-slate-200 dark:bg-slate-700">
              <img 
                src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1200" 
                alt="Viagem em Cabo Verde"
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-10 left-10 right-10 p-6 bg-white dark:bg-slate-900 backdrop-blur-xl rounded-3xl shadow-2xl dark:shadow-none flex items-center justify-between border border-white/20">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-2xl text-white">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <p className="text-base font-black text-slate-900 dark:text-slate-50 uppercase">Manuel Silva</p>
                    <p className="text-xs text-slate-400 font-bold tracking-wider">Motorista Verificado</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-yellow-500">
                  <Star size={20} fill="currentColor" />
                  <span className="text-lg font-black text-slate-900 dark:text-slate-50">4.9</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-20 -mr-32 -mt-32"></div>
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around gap-12">
          <div className="text-center group">
            <p className="text-5xl font-black mb-2 group-hover:scale-110 transition-transform">1.2k+</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Usuários Ativos</p>
          </div>
          <div className="text-center group">
            <p className="text-5xl font-black mb-2 group-hover:scale-110 transition-transform">500+</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Viagens Mensais</p>
          </div>
          <div className="text-center group">
            <p className="text-5xl font-black mb-2 group-hover:scale-110 transition-transform">98%</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Avaliações Positivas</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-300 underline decoration-yellow-400 decoration-4 underline-offset-8">
              Porquê escolher o Morabeza Rides?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">Unimos a hospitalidade cabo-verdiana à mobilidade moderna.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Wallet,
                title: 'Economize Dinheiro',
                desc: 'Compartilhe os custos da viagem com outros passageiros e viaje por uma fração do preço habitual.',
                color: 'bg-emerald-50 text-emerald-600',
              },
              {
                icon: Shield,
                title: 'Segurança em Primeiro',
                desc: 'Motoristas e passageiros verificados, avaliações mútuas e suporte 24/7 para sua tranquilidade.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: Users,
                title: 'Comunidade Forte',
                desc: 'Conheça pessoas novas durante o trajeto e fortaleça as conexões entre nossas ilhas e cidades.',
                color: 'bg-purple-50 text-purple-600',
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-gray-100 dark:border-slate-800/50 bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:bg-slate-900 hover:shadow-xl dark:shadow-none transition-all duration-300"
              >
                <div className={`p-4 rounded-2xl w-fit mb-6 ${benefit.color}`}>
                  <benefit.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300 mb-4">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 bg-gray-50 dark:bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 dark:text-blue-300 leading-tight">
                Como funciona a plataforma?
              </h2>
              <div className="space-y-6">
                {[
                  { step: '01', title: 'Crie sua conta', desc: 'Registe-se em poucos segundos como passageiro ou motorista.' },
                  { step: '02', title: 'Procure ou Publique', desc: 'Encontre trajetos disponíveis ou ofereça lugares no seu carro.' },
                  { step: '03', title: 'Pede a tua boleia', desc: 'Envia um pedido ao motorista e aguarda a confirmação instantânea.' },
                  { step: '04', title: 'Viaje tranquilo', desc: 'Encontre-se no ponto combinado e desfrute da viagem.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <span className="text-2xl font-black text-blue-100 group-hover:text-blue-200 transition-colors">{item.step}</span>
                    <div>
                      <h4 className="text-lg font-bold text-blue-900 dark:text-blue-300">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/register" className="inline-block pt-4">
                <Button variant="primary" size="lg">Criar Conta Grátis</Button>
              </Link>
            </div>
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400" alt="App" className="rounded-2xl shadow-lg dark:shadow-none mt-12" />
              <img src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=400" alt="Travel" className="rounded-2xl shadow-lg dark:shadow-none " />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-4 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-2 space-y-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                  <Car size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-blue-900 dark:text-blue-300">
                  Morabeza<span className="text-blue-600">Rides</span>
                </span>
              </Link>
              <p className="text-gray-500 dark:text-slate-400 max-w-sm">
                A primeira plataforma de boleias partilhadas focada 100% no mercado de Cabo Verde. Unindo o país através da colaboração.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-slate-50 mb-4">Links Úteis</h4>
              <ul className="space-y-2 text-gray-500 dark:text-slate-400 text-sm">
                <li><Link to="/explore" className="hover:text-blue-600">Encontrar Boleia</Link></li>
                <li><Link to="/publish" className="hover:text-blue-600">Publicar Trajeto</Link></li>
                <li><Link to="/security" className="hover:text-blue-600">Segurança</Link></li>
                <li><Link to="/terms" className="hover:text-blue-600">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-slate-50 mb-4">Suporte</h4>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-2">suporte@morabezarides.cv</p>
              <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">+238 9XX XX XX</p>
              <div className="flex gap-4">
                {/* Social icons could go here */}
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 dark:border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">© 2024 Morabeza Rides. Todos os direitos reservados.</p>
            <p className="text-gray-400 text-sm">Made with 💙 in Cape Verde</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
