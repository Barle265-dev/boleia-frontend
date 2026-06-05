import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { User, ShieldCheck, Mail, MapPin, Calendar, Star, Car, History, BadgeCheck, Camera, Edit, Users, Save, X, ToggleLeft, ToggleRight, Check, Settings, FileText, Phone } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAppStore } from '../store/useAppStore';
import type { UserRole } from '../types';
import { uploadFile, uploadImage } from '../services/upload';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const Profile = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user: currentUser, users, updateProfile, submitDocuments, rides } = useAppStore();

  const isMyProfile = !id || id === currentUser?.id;
  const targetUser = isMyProfile ? currentUser : (users.find(u => u.id === id) || null);

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'vehicle' | 'preferences'>('personal');

  // Verification states
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [docNationalIdUrl, setDocNationalIdUrl] = useState('');
  const [docDrivingLicenseUrl, setDocDrivingLicenseUrl] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadingDocument, setUploadingDocument] = useState<'national' | 'driving' | null>(null);

  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [role, setRole] = useState<UserRole>('passenger');
  
  // Vehicle fields
  const [vehicleMake, setVehicleMake] = useState('Toyota');
  const [vehicleModel, setVehicleModel] = useState('Hilux');
  const [vehicleColor, setVehicleColor] = useState('Cinza xadrez');
  const [vehiclePlate, setVehiclePlate] = useState('CV-123-AB');

  // Preferences
  const [maxSeatsThree, setMaxSeatsThree] = useState(true);
  const [nonSmoking, setNonSmoking] = useState(true);

  // Sync state when targetUser changes
  React.useEffect(() => {
    if (targetUser) {
      setName(targetUser.name || '');
      setEmail(targetUser.email || '');
      setPhone(targetUser.phone || '');
      setPhotoUrl(targetUser.photoUrl || '');
      setRole(targetUser.role || 'passenger');
      setDocNationalIdUrl(targetUser.documents?.find(d => d.type === 'national_id')?.url || '');
      setDocDrivingLicenseUrl(targetUser.documents?.find(d => d.type === 'driving_license')?.url || '');
      if (targetUser.vehicle) {
        setVehicleMake(targetUser.vehicle.make || 'Toyota');
        setVehicleModel(targetUser.vehicle.model || 'Hilux');
        setVehicleColor(targetUser.vehicle.color || 'Cinza xadrez');
        setVehiclePlate(targetUser.vehicle.plate || 'CV-123-AB');
      }
    }
  }, [targetUser?.id, targetUser]);

  if (!targetUser) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-slate-550 font-medium">Utilizador não encontrado na comunidade.</p>
        <Button onClick={() => navigate('/community')} variant="primary">
          Ver Comunidade
        </Button>
      </div>
    );
  }

  const handleSave = () => {
    const updatedUser = {
      name,
      email,
      phone,
      photoUrl,
      role,
      vehicle: role === 'driver' || role === 'fretista' ? {
        make: vehicleMake,
        model: vehicleModel,
        color: vehicleColor,
        plate: vehiclePlate,
      } : undefined
    };

    updateProfile(updatedUser);
    setIsEditing(false);
  };

  const handlePhotoFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      const uploaded = await uploadImage(file);
      setPhotoUrl(uploaded.url);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Falha ao carregar foto.');
    } finally {
      setIsUploadingPhoto(false);
      event.target.value = '';
    }
  };

  const handleDocumentFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: 'national' | 'driving',
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSubmitError('');
    setUploadingDocument(documentType);
    try {
      const uploaded = await uploadFile(file);
      if (documentType === 'national') {
        setDocNationalIdUrl(uploaded.url);
      } else {
        setDocDrivingLicenseUrl(uploaded.url);
      }
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || error.message || 'Falha ao carregar documento.');
    } finally {
      setUploadingDocument(null);
      event.target.value = '';
    }
  };

  const handleCancel = () => {
    if (targetUser) {
      // Reset fields to current store values
      setName(targetUser.name || '');
      setEmail(targetUser.email || '');
      setPhone(targetUser.phone || '');
      setPhotoUrl(targetUser.photoUrl || '');
      setRole(targetUser.role || 'passenger');
      if (targetUser.vehicle) {
        setVehicleMake(targetUser.vehicle.make || 'Toyota');
        setVehicleModel(targetUser.vehicle.model || 'Hilux');
        setVehicleColor(targetUser.vehicle.color || 'Cinza xadrez');
        setVehiclePlate(targetUser.vehicle.plate || 'CV-123-AB');
      }
    }
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Profile Header Card */}
      <Card className="p-8 md:p-12 relative overflow-hidden text-slate-900 dark:text-slate-50 border-none bg-white dark:bg-slate-900 shadow-xl dark:shadow-none shadow-slate-200/50">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 to-indigo-700 -z-1" />
        <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-end">
          <div className="relative group">
            <img 
              src={photoUrl || targetUser.photoUrl} 
              alt={name || targetUser.name} 
              className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl dark:shadow-none bg-slate-100 dark:bg-slate-800"
            />
            {isEditing && isMyProfile && (
              <div className="absolute inset-0 bg-slate-900/40 rounded-3xl flex items-center justify-center text-white font-bold text-xs pointer-events-none">
                <Camera size={18} className="animate-pulse" />
              </div>
            )}
            {!isEditing && isMyProfile && (
              <label
                className="absolute -bottom-2 -right-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl shadow-lg dark:shadow-none border border-slate-100 dark:border-slate-800/50 text-blue-600 hover:scale-110 transition-transform cursor-pointer"
              >
                <Camera size={18} />
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={async (event) => {
                    await handlePhotoFileChange(event);
                    setIsEditing(true);
                  }}
                  className="sr-only"
                  disabled={isUploadingPhoto}
                />
              </label>
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-2 md:gap-4">
              <h1 className="text-3.5xl font-black text-slate-900 dark:text-slate-50 tracking-tight uppercase">
                {name || targetUser.name}
              </h1>
              {targetUser.isVerified && (
                <div className="inline-flex self-center items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                  <BadgeCheck size={16} fill="currentColor" className="text-blue-600" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Verificado</span>
                </div>
              )}
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-semibold italic">
              Membro da Comunidade
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
               <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <Star size={18} className="text-yellow-500" fill="currentColor" />
                  <span className="font-bold">{targetUser.rating}</span>
                  <span className="text-slate-400 text-sm">(124 avaliações)</span>
               </div>
               <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                  <History size={18} className="text-blue-500" />
                  <span className="font-bold">{targetUser.totalTrips}</span>
                  <span className="text-slate-400 text-sm">viagens</span>
               </div>
            </div>
          </div>

          <div className="flex gap-2">
            {isMyProfile ? (
              !isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="gap-2 rounded-xl">
                  <Edit size={16} /> Editar Perfil
                </Button>
              ) : (
                <Button onClick={handleCancel} variant="ghost" size="sm" className="gap-2 rounded-xl text-slate-400">
                  <X size={16} /> Cancelar
                </Button>
              )
            ) : (
              <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="gap-2 rounded-xl">
                Voltar
              </Button>
            )}
          </div>
        </div>
      </Card>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div
            key="editing-pane"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {/* Editing Side Tabs */}
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full text-left p-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between ${
                  activeTab === 'personal'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50'
                }`}
              >
                <span>Dados Gerais</span>
                <User size={16} />
              </button>

              <button
                onClick={() => setActiveTab('vehicle')}
                className={`w-full text-left p-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between ${
                  activeTab === 'vehicle'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50'
                }`}
              >
                <span>Meu Veículo</span>
                <Car size={16} />
              </button>

              <button
                onClick={() => setActiveTab('preferences')}
                className={`w-full text-left p-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-between ${
                  activeTab === 'preferences'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50'
                }`}
              >
                <span>Preferências</span>
                <Settings size={16} />
              </button>
            </div>

            {/* Editing Form Container */}
            <div className="md:col-span-2">
              <Card className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 shadow-xl dark:shadow-none shadow-slate-100/30 rounded-3xl space-y-6">
                
                {activeTab === 'personal' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <h3 className="font-black text-slate-900 dark:text-slate-50 border-b pb-3 uppercase tracking-tight text-lg">Dados Gerais</h3>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Foto de Perfil</label>
                      <label className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-sm font-bold text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors">
                        <Camera size={16} />
                        {isUploadingPhoto ? 'A carregar foto...' : 'Carregar foto do dispositivo'}
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp,image/gif"
                          onChange={handlePhotoFileChange}
                          className="sr-only"
                          disabled={isUploadingPhoto}
                        />
                      </label>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome Completo</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Digite seu nome"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Telefone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Ex: +238 999 99 99"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Endereço de E-mail</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="nome@exemplo.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-medium"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'vehicle' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <h3 className="font-black text-slate-900 dark:text-slate-50 border-b pb-3 uppercase tracking-tight text-lg">Cadastro do Veículo</h3>
                    
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 dark:text-slate-700">Possuo um Veículo para Boleias</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">Ativar para registrar os dados do veículo que serão exibidos aos passageiros.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRole(role === 'driver' ? 'passenger' : 'driver')}
                        className="text-blue-600 hover:scale-105 active:scale-95 transition-transform"
                      >
                        {role === 'driver' ? (
                          <ToggleRight size={44} className="text-blue-600" />
                        ) : (
                          <ToggleLeft size={44} className="text-slate-300" />
                        )}
                      </button>
                    </div>

                    <label className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={role === 'fretista'}
                        onChange={(e) => setRole(e.target.checked ? 'fretista' : 'passenger')}
                        className="mt-1 h-4 w-4 accent-blue-600"
                      />
                      <span>
                        <span className="block text-sm font-bold text-slate-800 dark:text-slate-200 dark:text-slate-700">Atuar como fretista</span>
                        <span className="block text-xs text-slate-500 dark:text-slate-400 italic mt-1">
                          Ative para receber pedidos de carro/frete. Desativar volta o perfil para passageiro.
                        </span>
                      </span>
                    </label>

                    {(role === 'driver' || role === 'fretista') && (
                      <div className="space-y-4 pt-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l-2 border-blue-600 pl-2">Dados do Veículo</p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fabricante (Marca)</label>
                            <input
                              type="text"
                              value={vehicleMake}
                              onChange={(e) => setVehicleMake(e.target.value)}
                              placeholder="ex: Volkswagen"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-medium"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Modelo</label>
                            <input
                              type="text"
                              value={vehicleModel}
                              onChange={(e) => setVehicleModel(e.target.value)}
                              placeholder="ex: Polo"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cor</label>
                            <input
                              type="text"
                              value={vehicleColor}
                              onChange={(e) => setVehicleColor(e.target.value)}
                              placeholder="ex: Branco celestial"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-medium"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matrícula (Placa)</label>
                            <input
                              type="text"
                              value={vehiclePlate}
                              onChange={(e) => setVehiclePlate(e.target.value)}
                              placeholder="ex: CV-012-ZZ"
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-sm font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <h3 className="font-black text-slate-900 dark:text-slate-50 border-b pb-3 uppercase tracking-tight text-lg">Preferências de Viagem</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 dark:text-slate-700">Não sou fumante (Ambiente livre de fumo)</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Prefiro viagens em carros limpos e sem fumaça.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={nonSmoking}
                          onChange={(e) => setNonSmoking(e.target.checked)}
                          className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 dark:text-slate-700">Conforto com espaço atrás (Máximo 3 pessoas no veículo)</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Valorizo ter espaço amplo nos bancos de trás.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={maxSeatsThree}
                          onChange={(e) => setMaxSeatsThree(e.target.checked)}
                          className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Actions */}
                <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex-col sm:flex-row">
                  <Button onClick={handleSave} variant="primary" className="flex-1 gap-2 rounded-xl py-3 justify-center">
                    <Save size={18} /> Salvar Alterações
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 gap-2 rounded-xl py-3 justify-center text-slate-500 dark:text-slate-400">
                    <X size={18} /> Cancelar
                  </Button>
                </div>

              </Card>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* Bloco de Estado de Verificação do Perfil */}
            {isMyProfile && !targetUser.isVerified && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/60 p-6 rounded-3xl shadow-sm dark:shadow-none flex flex-col md:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-50 flex items-center gap-2">
                      {targetUser.documents && targetUser.documents.length > 0 
                        ? targetUser.documents.some(d => d.status === 'pending')
                          ? 'Verificação em Análise ⏳'
                          : targetUser.documents.some(d => d.status === 'rejected')
                            ? 'Verificação Recusada ❌'
                            : 'Pendente de Verificação ⚠️'
                        : 'Verifica o teu perfil para maior segurança 🔒'}
                    </h3>
                    <p className="text-xs text-slate-505 leading-relaxed max-w-xl mt-1">
                      {targetUser.documents && targetUser.documents.length > 0
                        ? targetUser.documents.some(d => d.status === 'pending')
                          ? 'Obrigado! Os teus documentos (CNI/BI e Carta de Condução) foram submetidos e estão em análise pela equipa de administração.'
                          : targetUser.documents.some(d => d.status === 'rejected')
                            ? 'Alguns dos teus documentos foram recusados pelo administrador. Por favor, revisa as informações e re-submete novos anexos.'
                            : 'Sube os teus documentos oficiais para receberes o emblema oficial de verificação ⭐.'
                        : 'Perfis verificados passam mais confiança e segurança na comunidade de boleias, aumentando as hipóteses de reservas.'}
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => setIsVerificationModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 px-5 rounded-xl shrink-0 gap-1.5 cursor-pointer"
                >
                  {targetUser.documents && targetUser.documents.length > 0 ? 'Ver Detalhes / Atualizar' : 'Verificar Perfil ⭐'}
                </Button>
              </motion.div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
            {/* View Personal Info Panel */}
            <div className="space-y-6">
              <section className="space-y-4">
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                   Informações Pessoais
                </h3>
                <Card className="p-6 space-y-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/50 shadow-md dark:shadow-none">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">E-mail</p>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Mail size={16} className="text-blue-600 shrink-0" />
                      <span className="text-sm font-bold break-all">{email}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Telefone</p>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Phone size={16} className="text-emerald-600 shrink-0" />
                      {phone ? (
                        <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-sm font-bold hover:text-emerald-700 hover:underline">
                          {phone}
                        </a>
                      ) : (
                        <span className="text-sm font-bold text-slate-400">Nao informado</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Localização</p>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <MapPin size={16} className="text-blue-600 shrink-0" />
                      <span className="text-sm font-bold">Praia, Ilha de Santiago</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Membro desde</p>
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Calendar size={16} className="text-blue-600 shrink-0" />
                      <span className="text-sm font-bold">
                        {format(new Date(targetUser.joinedAt), "MMMM 'de' yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </Card>
              </section>

              {(role === 'driver' || role === 'fretista') && (
                <section className="space-y-4 animate-in fade-in duration-300">
                  <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                    Veículo Cadastrado
                  </h3>
                  <Card className="p-6 bg-gradient-to-br from-slate-50 to-white shadow-md dark:shadow-none border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl shadow-sm dark:shadow-none border border-slate-100 dark:border-slate-800/50 flex items-center justify-center shrink-0">
                        <Car size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-50 tracking-tight">{vehicleMake} {vehicleModel}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{vehicleColor} • {vehiclePlate}</p>
                      </div>
                    </div>
                  </Card>
                </section>
              )}
            </div>

            {/* View Travel History & Preferences */}
            <div className="md:col-span-2 space-y-6">
              <section className="space-y-4">
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                   Últimas Viagens
                </h3>
                <div className="space-y-4">
                  {rides && rides.filter(r => r.driverId === targetUser.id || r.passengers.includes(targetUser.id)).length > 0 ? (
                    rides.filter(r => r.driverId === targetUser.id || r.passengers.includes(targetUser.id)).map((r) => (
                      <Card key={r.id} className="group p-6 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 transition-colors border-slate-100 dark:border-slate-800/50 shadow-sm dark:shadow-none bg-white dark:bg-slate-900 cursor-pointer" onClick={() => navigate(`/ride/${r.id}`)}>
                        <div className="flex justify-between items-start">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-50">{r.origin}</span>
                              <div className="w-8 border-t border-dashed border-slate-300 mx-1" />
                              <div className="w-2.5 h-2.5 rounded-full border-2 border-blue-600 bg-white dark:bg-slate-900 shrink-0" />
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-50">{r.destination}</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400">
                              <span>{format(new Date(r.departureTime), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                              <span>•</span>
                              <span>
                                {r.driverId === targetUser.id 
                                  ? 'Como Motorista' 
                                  : 'Como Passageiro'}
                              </span>
                            </div>
                          </div>
                          <Badge variant={
                            r.status === 'completed' ? 'success' :
                            r.status === 'cancelled' ? 'neutral' : 'primary'
                          }>
                            {r.status === 'completed' ? 'Concluída' :
                             r.status === 'cancelled' ? 'Cancelada' : 'Ativa'}
                          </Badge>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <Card className="p-12 text-center bg-slate-50 dark:bg-slate-800/50 border-dashed rounded-3xl border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-400 italic">Nenhuma viagem registrada na plataforma ainda.</p>
                    </Card>
                  )}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest flex items-center gap-2">
                   Preferências de Viagem
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 flex flex-col items-center gap-2 text-center md:items-start md:text-left shadow-sm dark:shadow-none border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900">
                    <Users size={20} className="text-blue-600" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                      {maxSeatsThree ? 'Máximo 3 pessoas' : 'Lotação normal (4 pessoas)'}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Valorizo o conforto no assento traseiro.</p>
                  </Card>
                  <Card className="p-4 flex flex-col items-center gap-2 text-center md:items-start md:text-left shadow-sm dark:shadow-none border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-900">
                    <ShieldCheck size={20} className="text-emerald-600" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                      {nonSmoking ? 'Não sou fumante' : 'Permito fumantes'}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Prefiro viagens livres de qualquer fumaça.</p>
                  </Card>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>

      {/* VERIFICATION POPUP MODAL */}
      <AnimatePresence>
        {isVerificationModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-xl w-full shadow-2xl dark:shadow-none relative border border-slate-100 dark:border-slate-800/50 flex flex-col max-h-[90vh]"
            >
              {/* Head */}
              <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-950">Verificação de Conta</h3>
                    <p className="text-xs text-slate-505">Submeta os seus documentos para aprovação oficial.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsVerificationModalOpen(false);
                    setSubmitError('');
                  }}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={async (e) => {
                e.preventDefault();
                setSubmitError('');
                if (!docNationalIdUrl) {
                  setSubmitError('Por favor, inclua o seu Bilhete de Identidade ou CNI.');
                  return;
                }
                try {
                  await submitDocuments(docNationalIdUrl, docDrivingLicenseUrl || undefined);
                  setSubmitSuccess(true);
                  setTimeout(() => {
                    setSubmitSuccess(false);
                    setIsVerificationModalOpen(false);
                  }, 2000);
                } catch (error: any) {
                  setSubmitError(error.response?.data?.message || error.message || 'Falha ao submeter documentos.');
                }
              }} className="flex-1 overflow-y-auto py-5 space-y-5">
                
                {submitSuccess ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center p-8 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Check size={32} className="stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-50">Documentos Enviados!</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                        A sua candidatura foi guardada. Os documentos estão agora em fila de espera para auditoria administrativa.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <>
                    {submitError && (
                      <div className="p-3.5 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold leading-tight">
                        ⚠️ {submitError}
                      </div>
                    )}

                    <div className="p-4 bg-blue-50/50 border border-blue-100/30 rounded-2xl text-xs text-slate-650 space-y-2 leading-relaxed">
                      <p className="font-semibold text-blue-800 font-black uppercase text-[10px]">💡 Como funciona o processo?</p>
                      <p>
                        Carregue imagens legíveis ou links de fotos identificativas. Um administrador verificará a integridade dos dados e atribuirá o selo ⭐ na plataforma em poucas horas.
                      </p>
                    </div>

                    <div className="space-y-4 pt-1">
                      {/* Document Type 1: National ID / BI */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>1. Bilhete de Identidade / CNI <span className="text-red-500">*</span></span>
                          {docNationalIdUrl && <span className="text-emerald-600 font-bold text-[10px]">Preenchido</span>}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={docNationalIdUrl}
                            onChange={(e) => setDocNationalIdUrl(e.target.value)}
                            placeholder="Insira o URL ou caminho do CNI (ex: https://...)"
                            className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 dark:text-slate-700"
                            required
                          />
                          <FileText size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <label className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors">
                          <FileText size={14} />
                          {uploadingDocument === 'national' ? 'A carregar ficheiro...' : 'Carregar foto ou PDF do CNI'}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
                            onChange={(event) => handleDocumentFileChange(event, 'national')}
                            className="sr-only"
                            disabled={uploadingDocument !== null}
                          />
                        </label>
                      </div>

                      {/* Document Type 2: Driving License */}
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center justify-between">
                          <span>2. Carta de Condução (Recomendado para condutores)</span>
                          {docDrivingLicenseUrl && <span className="text-emerald-600 font-bold text-[10px]">Preenchido</span>}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={docDrivingLicenseUrl}
                            onChange={(e) => setDocDrivingLicenseUrl(e.target.value)}
                            placeholder="Insira o URL ou caminho da Carta de Condução"
                            className="w-full pl-4 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 dark:text-slate-700"
                          />
                          <Car size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        <label className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-blue-600 cursor-pointer hover:bg-blue-50 transition-colors">
                          <FileText size={14} />
                          {uploadingDocument === 'driving' ? 'A carregar ficheiro...' : 'Carregar foto ou PDF da carta'}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif,application/pdf"
                            onChange={(event) => handleDocumentFileChange(event, 'driving')}
                            className="sr-only"
                            disabled={uploadingDocument !== null}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Pre-fill / Testing Helpers segment */}
                    <div className="hidden">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Auxiliar de Teste do Protótipo</p>
                      <div className="flex gap-2.5">
                        <button
                          type="button"
                          onClick={() => {
                            setDocNationalIdUrl('https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=600');
                            setDocDrivingLicenseUrl('');
                            setSubmitError('');
                          }}
                          className="flex-1 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold text-[9px] uppercase py-2 px-3 rounded-xl transition-all cursor-pointer leading-tight"
                        >
                          Simular B.I. / CNI 🪪
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDocNationalIdUrl('https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=600');
                            setDocDrivingLicenseUrl('https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600');
                            setSubmitError('');
                          }}
                          className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-250 font-bold text-[9px] uppercase py-2 px-3 rounded-xl transition-all cursor-pointer leading-tight"
                        >
                          Simular Ambos Docs 🚗
                        </button>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="border-t border-slate-100 dark:border-slate-800/50 pt-4 flex gap-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setIsVerificationModalOpen(false);
                          setSubmitError('');
                        }}
                        className="flex-1 font-bold text-slate-400 rounded-xl"
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        className="flex-1 font-bold rounded-xl"
                      >
                        Enviar Documentos
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
