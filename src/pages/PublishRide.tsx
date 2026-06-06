import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Calendar, Users, FileText, ArrowRight, Car, Trash2, X, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../store/useAppStore';

export const PublishRide = () => {
  const { id: editingRideId } = useParams<{ id: string }>();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState('3');
  const [price, setPrice] = useState('');
  const [observations, setObservations] = useState('');
  
  // App Store functions
  const { publishRide, updateRide, user, updateProfile, rides } = useAppStore();
  const navigate = useNavigate();
  const editingRide = editingRideId ? rides.find((ride) => ride.id === editingRideId) : undefined;
  const isEditing = Boolean(editingRideId);

  // Active user vehicles and selected vehicle
  const userVehicles = user?.vehicles || (user?.vehicle ? [user.vehicle] : []);
  const [selectedVehiclePlate, setSelectedVehiclePlate] = useState('');

  // Modal State for New Vehicle Registration
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMake, setNewMake] = useState('');
  const [newModel, setNewModel] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newPlate, setNewPlate] = useState('');
  const [modalError, setModalError] = useState('');
  const [formError, setFormError] = useState('');

  // Automatically select the first vehicle if available
  useEffect(() => {
    const availableVehicles = user?.vehicles || (user?.vehicle ? [user.vehicle] : []);
    if (availableVehicles.length > 0 && !selectedVehiclePlate) {
      setSelectedVehiclePlate(availableVehicles[0].plate);
    }
  }, [user, selectedVehiclePlate]);

  useEffect(() => {
    if (!editingRide) return;
    const departureDate = new Date(editingRide.departureTime);

    setOrigin(editingRide.origin);
    setDestination(editingRide.destination);
    setDate(departureDate.toISOString().split('T')[0]);
    setTime(departureDate.toTimeString().slice(0, 5));
    setSeats(String(editingRide.totalSeats));
    setPrice(editingRide.price ? String(editingRide.price) : '');
    setObservations(editingRide.observations || '');
    setSelectedVehiclePlate(editingRide.vehicle?.plate || '');
  }, [editingRide]);

  if (isEditing && !editingRide && rides.length === 0) {
    return <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">A carregar viagem...</div>;
  }

  if (isEditing && !editingRide) {
    return <Navigate to="/" replace />;
  }

  if (isEditing && editingRide?.driverId !== user?.id) {
    return <Navigate to={`/ride/${editingRideId}`} replace />;
  }

  if (isEditing && editingRide?.status !== 'available') {
    return <Navigate to={`/ride/${editingRideId}`} replace />;
  }

  const handleRegisterVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    setModalError('');

    if (!newMake.trim() || !newModel.trim() || !newColor.trim() || !newPlate.trim()) {
      setModalError('Todos os campos do veículo são obrigatórios.');
      return;
    }

    // Check if plate already exists in current list
    if (userVehicles.some(v => v.plate.toUpperCase() === newPlate.trim().toUpperCase())) {
      setModalError('Já tens um veículo registado com esta matrícula.');
      return;
    }

    // Checking max limit of 3
    if (userVehicles.length >= 3) {
      setModalError('Limite máximo de 3 veículos atingido. Elimine um existente para poder registar outro.');
      return;
    }

    const newVehicle = {
      make: newMake.trim(),
      model: newModel.trim(),
      color: newColor.trim(),
      plate: newPlate.trim().toUpperCase(),
    };

    const updatedVehicles = [...userVehicles, newVehicle];
    
    updateProfile({
      vehicles: updatedVehicles,
      vehicle: newVehicle, // sets most recently registered as active/primary
    });

    setSelectedVehiclePlate(newVehicle.plate);
    
    // Clear registration fields and close modal
    setNewMake('');
    setNewModel('');
    setNewColor('');
    setNewPlate('');
    setModalError('');
    setIsModalOpen(false);
    setFormError(''); // clear any publishing block error
  };

  const handleDeleteVehicle = (plateToDelete: string) => {
    const updatedVehicles = userVehicles.filter(v => v.plate !== plateToDelete);
    updateProfile({
      vehicles: updatedVehicles,
      vehicle: updatedVehicles[0] || undefined
    });
    if (selectedVehiclePlate === plateToDelete) {
      setSelectedVehiclePlate(updatedVehicles[0]?.plate || '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormError('');

    if (userVehicles.length === 0) {
      setFormError('Precisas de registar pelo menos um veículo para oferecer uma boleia.');
      return;
    }

    if (!selectedVehiclePlate) {
      setFormError('Por favor, escolhe o veículo correspondente a esta viagem.');
      return;
    }

    const selectedVehicle = userVehicles.find(v => v.plate === selectedVehiclePlate);

    try {
      const ridePayload = {
        origin,
        destination,
        departureTime: new Date(`${date}T${time}`).toISOString(),
        availableSeats: parseInt(seats),
        totalSeats: parseInt(seats),
        price: price ? parseInt(price) : undefined,
        observations,
        vehicle: selectedVehicle,
      };

      if (isEditing && editingRideId) {
        await updateRide(editingRideId, ridePayload);
        navigate(`/ride/${editingRideId}`);
        return;
      }

      await publishRide(ridePayload);
      navigate('/dashboard');
    } catch (error: any) {
      setFormError(error?.message || (isEditing ? 'Nao foi possivel editar esta viagem.' : 'Nao foi possivel publicar esta viagem.'));
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-300">{isEditing ? 'Editar Viagem' : 'Publicar Trajeto'}</h1>
        <p className="text-gray-500 dark:text-slate-400">
          {isEditing ? 'Atualize os dados desta boleia antes da partida.' : 'Ajude alguém a chegar ao seu destino e economize nos custos.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-8 space-y-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <MapPin size={20} className="text-blue-600" /> Itinerário
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="De (Origem)"
                placeholder="Ex: Praia"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                required
              />
              <Input
                label="Para (Destino)"
                placeholder="Ex: Assomada"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <Calendar size={20} className="text-blue-600" /> Data e Horário
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Data da Partida"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <Input
                label="Hora da Partida"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
              <Users size={20} className="text-blue-600" /> Lugares e Preço
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Lugares Disponíveis"
                type="number"
                min="1"
                max="8"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                required
              />
              <Input
                label="Preço por Lugar (CVE)"
                type="number"
                placeholder="Ex: 500"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* SELECIONAR VEÍCULO */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <Car size={20} className="text-blue-600" /> Selecionar Veículo
              </h3>
              {userVehicles.length < 3 ? (
                <button
                  type="button"
                  onClick={() => {
                    setModalError('');
                    setIsModalOpen(true);
                  }}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  + Registar Novo Veículo ({userVehicles.length}/3)
                </button>
              ) : (
                <span className="text-[10px] uppercase font-mono font-bold text-amber-600 px-2 py-1 bg-amber-50 border border-amber-100 rounded-lg">
                  Lote de 3 carros cheio
                </span>
              )}
            </div>

            {userVehicles.length === 0 ? (
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400">
                  <Car size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 dark:text-slate-700 text-sm">Não deves ter nenhum veículo registado</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">Precisas de registar pelo menos um veículo para poder publicar trajetos.</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setModalError('');
                    setIsModalOpen(true);
                  }}
                  className="gap-2 mx-auto"
                >
                  <Car size={16} /> Registar Primeiro Veículo
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {userVehicles.map((v) => {
                    const isSelected = selectedVehiclePlate === v.plate;
                    return (
                      <div
                        key={v.plate}
                        onClick={() => setSelectedVehiclePlate(v.plate)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 text-blue-900 dark:text-blue-300 shadow-sm dark:shadow-none'
                            : 'border-slate-100 dark:border-slate-800/50 hover:border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50'
                        }`}
                      >
                        <div className="pr-8">
                          <p className="font-bold text-[10px] uppercase tracking-wider text-slate-400">Matrícula</p>
                          <p className="font-mono font-black text-slate-900 dark:text-slate-50 text-sm">{v.plate}</p>
                          <p className="font-bold text-sm text-slate-800 dark:text-slate-200 dark:text-slate-700 mt-1">{v.make} {v.model}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{v.color}</p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteVehicle(v.plate);
                          }}
                          className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-colors"
                          title="Eliminar veículo"
                          id={`delete-vehicle-${v.plate}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 ml-1 flex items-center gap-2">
              <FileText size={16} /> Observações
            </label>
            <textarea
              className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-gray-400 min-h-[100px] transition-all"
              placeholder="Ex: Saída nas proximidades da Praça Alexandre Albuquerque..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
            />
          </div>

          <div className="p-4 bg-blue-50 rounded-2xl flex gap-3">
            <div className="bg-blue-600 text-white p-1.5 rounded-full shrink-0 h-fit">
              <Car size={16} />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Informação Importante</p>
              <p className="text-xs text-blue-700/80 leading-relaxed">
                {isEditing
                  ? 'As alterações ficam associadas a esta viagem e devem manter os dados claros para os passageiros.'
                  : 'Ao publicares o teu trajeto, concordas em seguir as normas de segurança do Boleia. Certifica-te de que o teu veículo está em boas condições.'}
              </p>
            </div>
          </div>

          {formError && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-red-600 text-xs font-bold animate-in fade-in duration-200">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-[2] gap-2"
              size="lg"
            >
              {isEditing ? 'Guardar Alterações' : 'Publicar Viagem'} <ArrowRight size={20} />
            </Button>
          </div>
        </Card>
      </form>

      {/* REAL VEHICLE REGISTRATION MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl dark:shadow-none space-y-6 border border-slate-100 dark:border-slate-800/50 relative"
            >
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 dark:bg-slate-800 transition-all"
                id="close-vehicle-modal-btn"
              >
                <X size={18} />
              </button>

              <div className="space-y-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Car size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Registar Novo Veículo</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Introduza os dados corretos do veículo para que os passageiros o identifiquem facilmente.</p>
              </div>

              {modalError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleRegisterVehicle} className="space-y-4">
                <Input
                  label="Marca (Ex: Toyota, Volkswagen)"
                  placeholder="Marca o veículo"
                  value={newMake}
                  onChange={(e) => setNewMake(e.target.value)}
                  required
                />
                <Input
                  label="Modelo (Ex: Hilux, Polo)"
                  placeholder="Modelo do veículo"
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  required
                />
                <Input
                  label="Cor (Ex: Cinza, Preto, Branco)"
                  placeholder="Cor do veículo"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  required
                />
                <Input
                  label="Nº Matrícula (Ex: CV-123-AB, ST-99-XZ)"
                  placeholder="Matrícula do veículo"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  required
                />

                <div className="flex gap-3 pt-2 w-full">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setIsModalOpen(false)}
                    id="cancel-vehicle-reg-btn"
                  >
                    Retroceder
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-[2]"
                    id="save-vehicle-reg-btn"
                  >
                    Guardar Veículo
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
