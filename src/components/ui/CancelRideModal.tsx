import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { XCircle } from 'lucide-react';
import { Button } from './Button';
import type { Ride } from '../../types';

type CancelRideModalProps = {
  isOpen: boolean;
  ride: Pick<Ride, 'id' | 'origin' | 'destination'> | null;
  passengerCount: number;
  onClose: () => void;
  onConfirm: (rideId: string) => Promise<void> | void;
};

export const CancelRideModal = ({
  isOpen,
  ride,
  passengerCount,
  onClose,
  onConfirm,
}: CancelRideModalProps) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirm = async () => {
    if (!ride) return;
    setIsCancelling(true);
    try {
      await onConfirm(ride.id);
      onClose();
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && ride && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl dark:shadow-none space-y-6 border border-slate-100 dark:border-slate-800/50 relative"
          >
            <div className="space-y-2">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <XCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Cancelar esta viagem?</h3>
              <p className="text-xs text-slate-550 leading-relaxed">
                Tem a certeza de que deseja cancelar esta viagem de <strong className="text-slate-800 dark:text-slate-200 dark:text-slate-700 font-bold">{ride.origin} para {ride.destination}</strong>?
              </p>
              <p className="text-xs text-red-600 font-bold bg-red-50/50 p-3 rounded-2xl border border-red-100">
                Esta acao desvinculara todos os passageiros confirmados ({passengerCount}) e enviar-lhes-a uma notificacao informando o cancelamento imediato pelo motorista.
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 font-bold border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300"
                onClick={onClose}
                disabled={isCancelling}
              >
                Manter Viagem
              </Button>
              <Button
                type="button"
                variant="primary"
                className="flex-[2] bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={handleConfirm}
                isLoading={isCancelling}
              >
                Confirmar Cancelamento
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
