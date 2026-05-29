import { create } from 'zustand';
import type { User, Ride, Notification, Message, UserDocument, FreightRequest } from '../types';
import { MOCK_USERS, MOCK_RIDES } from '../mock/data';

const INITIAL_USERS: User[] = [
  ...MOCK_USERS.map((user, idx) => ({
    ...user,
    isBlocked: false,
    documents: [
      {
        id: `doc-${user.id}-1`,
        name: 'Bilhete de Identidade / CNI',
        type: 'national_id' as const,
        url: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?auto=format&fit=crop&q=80&w=600',
        status: idx === 1 ? 'pending' : 'verified' as const,
      },
      ...(user.role === 'driver' ? [{
        id: `doc-${user.id}-2`,
        name: 'Carta de Condução',
        type: 'driving_license' as const,
        url: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600',
        status: idx === 2 ? 'pending' : 'verified' as const,
      }] : [])
    ] as UserDocument[]
  })),
  {
    id: 'u-admin',
    name: 'Joel',
    email: 'joel@gmail.com',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
    role: 'driver',
    isVerified: true,
    rating: 5.0,
    totalTrips: 999,
    joinedAt: '2026-05-25',
    isBlocked: false,
    documents: []
  },
  // Adding a mock Fretista
  {
    id: 'u-fretista1',
    name: 'Simão Fretes',
    email: 'simao@fretes.cv',
    phone: '+238 987 65 43',
    photoUrl: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=200',
    role: 'fretista',
    isVerified: true,
    rating: 4.9,
    totalTrips: 340,
    joinedAt: '2024-03-10',
    isBlocked: false,
    vehicles: [
      {
        make: 'Toyota',
        model: 'Dyna (Ligeiro de Carga)',
        color: 'Branco',
        plate: 'PR-88-DD',
      }
    ],
    vehicle: {
      make: 'Toyota',
      model: 'Dyna (Ligeiro de Carga)',
      color: 'Branco',
      plate: 'PR-88-DD',
    },
    documents: []
  }
];

interface AppState {
  user: User | null;
  users: User[];
  rides: Ride[];
  notifications: Notification[];
  messages: Message[];
  freightRequests: FreightRequest[];
  isLoading: boolean;
  theme: 'dark' | 'light';
  isAuthModalOpen: boolean;
  toggleTheme: () => void;
  setAuthModalOpen: (isOpen: boolean) => void;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  publishRide: (ride: Omit<Ride, 'id' | 'driverId' | 'driver' | 'status' | 'passengers'>) => void;
  requestRide: (rideId: string) => void;
  cancelRide: (rideId: string) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  markNotificationAsRead: (id: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  acceptRequest: (rideId: string, passengerId: string) => void;
  declineRequest: (rideId: string, passengerId: string) => void;
  simulatePassengerRequest: (rideId: string) => void;
  removePassenger: (rideId: string, passengerId: string, reason: string) => void;
  startRide: (rideId: string) => void;
  completeRide: (rideId: string) => void;
  submitReview: (rideId: string, passengerId: string, rating: number, comment?: string) => void;
  blockUser: (userId: string) => void;
  unblockUser: (userId: string) => void;
  verifyUser: (userId: string) => void;
  verifyDocument: (userId: string, docId: string, status: 'verified' | 'rejected') => void;
  submitDocuments: (docNationalIdUrl: string, docDrivingLicenseUrl?: string) => void;
  
  // Freight Actions
  addFreightRequest: (origin: string, destination: string, requestedTime?: string, specificFretistaId?: string) => void;
  acceptFreightRequest: (requestId: string, fretistaId: string) => void;
  declineFreightRequest: (requestId: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  users: INITIAL_USERS,
  rides: MOCK_RIDES,
  notifications: [
    {
      id: 'n1',
      userId: 'u1',
      title: 'Novo pedido de boleia',
      message: 'Maria Varela solicitou um lugar na sua viagem para Assomada.',
      type: 'request',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: '/ride/r1?view=requests',
    },
    {
      id: 'n2',
      userId: 'u1',
      title: 'Mensagem recebida',
      message: 'José Lopes enviou uma mensagem sobre o ponto de encontro.',
      type: 'message',
      isRead: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      link: '/ride/r1?view=chat',
    }
  ],
  messages: [
    {
      id: 'm1',
      rideId: 'r1',
      senderId: 'u2',
      text: 'Olá Carlos, tudo bem? Podemos combinar a saída no Palmarejo?',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'm2',
      rideId: 'r1',
      senderId: 'u1',
      text: 'Olá Maria! Sim, perfeitamente. Estarei lá às 08:30.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    }
  ],
  freightRequests: [
    {
      id: 'fr-1',
      requesterId: 'u2',
      requesterName: 'Maria Varela',
      requesterPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
      origin: 'Praia',
      destination: 'Tarrafal',
      requestedTime: '2026-05-27T09:00',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'fr-2',
      requesterId: 'u4',
      requesterName: 'Elisângela Silva',
      requesterPhoto: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200',
      origin: 'Assomada',
      destination: 'Praia',
      requestedTime: '2026-05-28T14:00',
      specificFretistaId: 'u-fretista1',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  isLoading: false,
  theme: 'dark',
  isAuthModalOpen: false,
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return { theme: newTheme };
  }),
  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),
  login: async (email: string, password?: string) => {
    set({ isLoading: true });
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (email === 'joel@gmail.com') {
          if (password !== '123456') {
            set({ isLoading: false });
            reject(new Error('Senha incorreta para o administrador do sistema.'));
            return;
          }
        }
        
        const state = useAppStore.getState();
        const foundUser = state.users.find(u => u.email === email);
        
        if (foundUser?.isBlocked) {
          set({ isLoading: false });
          reject(new Error('Esta conta foi bloqueada pelo administrador do sistema.'));
          return;
        }

        if (foundUser) {
          set({ user: foundUser, isLoading: false });
          resolve();
        } else {
          // If typing a new unregistered user, create them
          const newUser: User = {
            id: 'u-' + Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email: email,
            role: 'passenger',
            isVerified: false,
            rating: 5.0,
            totalTrips: 0,
            joinedAt: new Date().toISOString().split('T')[0],
            documents: []
          };
          set({ 
            users: [...state.users, newUser],
            user: newUser,
            isLoading: false 
          });
          resolve();
        }
      }, 1000);
    });
  },
  logout: () => set({ user: null }),
  publishRide: (newRide) => set((state) => ({
    rides: [
      {
        ...newRide,
        id: Math.random().toString(36).substr(2, 9),
        driverId: state.user?.id || 'unknown',
        driver: {
          name: state.user?.name,
          photoUrl: state.user?.photoUrl,
          rating: state.user?.rating,
          isVerified: state.user?.isVerified,
        },
        status: 'available',
        passengers: [],
      },
      ...state.rides,
    ]
  })),
  requestRide: (rideId) => set((state) => {
    const ride = state.rides.find(r => r.id === rideId);
    if (!ride || ride.availableSeats <= 0 || ride.driverId === state.user?.id) return {};

    const requesterId = state.user?.id || 'guest';
    const requesterName = state.user?.name || 'Um utilizador';

    const passengerNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: requesterId,
      title: 'Pedido Enviado',
      message: `A tua solicitação de boleia para a viagem de ${ride.origin} para ${ride.destination} foi enviada com sucesso e aguarda confirmação.`,
      type: 'confirmation',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}`,
    };

    const driverNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: ride.driverId,
      title: 'Nova solicitação de boleia 🚗',
      message: `${requesterName} solicitou um lugar na tua boleia de ${ride.origin} para ${ride.destination}.`,
      type: 'request',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}?view=requests`,
    };

    return {
      rides: state.rides.map(r => 
        r.id === rideId 
          ? {
              ...r,
              pendingPassengers: [...(r.pendingPassengers || []), requesterId]
            }
          : r
      ),
      notifications: [driverNotification, passengerNotification, ...state.notifications]
    };
  }),
  acceptRequest: (rideId, passengerId) => set((state) => {
    const ride = state.rides.find(r => r.id === rideId);
    if (!ride || ride.availableSeats <= 0) return {};

    const updatedPassengers = [...ride.passengers, passengerId];
    const updatedPending = (ride.pendingPassengers || []).filter(p => p !== passengerId);
    const newAvailableSeats = ride.availableSeats - 1;
    const isFull = newAvailableSeats === 0;

    const passengerNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: passengerId,
      title: 'Boleia Confirmada! 🎉',
      message: `O motorista aceitou o teu pedido de boleia de ${ride.origin} para ${ride.destination}.`,
      type: 'confirmation',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}`,
    };

    return {
      rides: state.rides.map(r => 
        r.id === rideId 
          ? {
              ...r,
              passengers: updatedPassengers,
              pendingPassengers: updatedPending,
              availableSeats: newAvailableSeats,
              status: isFull ? 'full' : r.status,
            }
          : r
      ),
      notifications: [passengerNotification, ...state.notifications]
    };
  }),
  declineRequest: (rideId, passengerId) => set((state) => {
    const ride = state.rides.find(r => r.id === rideId);
    if (!ride) return {};

    const updatedPending = (ride.pendingPassengers || []).filter(p => p !== passengerId);

    const passengerNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: passengerId,
      title: 'Pedido Recusado 😔',
      message: `O motorista recusou o teu pedido de boleia de ${ride.origin} para ${ride.destination}.`,
      type: 'system',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}`,
    };

    return {
      rides: state.rides.map(r => 
        r.id === rideId 
          ? {
              ...r,
              pendingPassengers: updatedPending,
            }
          : r
      ),
      notifications: [passengerNotification, ...state.notifications]
    };
  }),
  simulatePassengerRequest: (rideId) => set((state) => {
    const ride = state.rides.find(r => r.id === rideId);
    if (!ride) return {};

    const possiblePassengers = MOCK_USERS.filter(u => 
      u.id !== ride.driverId && 
      !ride.passengers.includes(u.id) && 
      !(ride.pendingPassengers || []).includes(u.id)
    );

    if (possiblePassengers.length === 0) return {};

    const passenger = possiblePassengers[Math.floor(Math.random() * possiblePassengers.length)];

    const driverNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: ride.driverId,
      title: 'Nova solicitação de boleia 🚗',
      message: `${passenger.name} solicitou um lugar na tua boleia de ${ride.origin} para ${ride.destination}.`,
      type: 'request',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}?view=requests`,
    };

    return {
      rides: state.rides.map(r => 
        r.id === rideId 
          ? {
              ...r,
              pendingPassengers: [...(r.pendingPassengers || []), passenger.id]
            }
          : r
      ),
      notifications: [driverNotification, ...state.notifications]
    };
  }),
  cancelRide: (rideId) => set((state) => {
    const ride = state.rides.find(r => r.id === rideId);
    if (!ride) return {};

    const isPassenger = ride.passengers.includes(state.user?.id || '');
    if (isPassenger) {
      return {
        rides: state.rides.map(r => r.id === rideId ? {
          ...r,
          availableSeats: r.availableSeats + 1,
          passengers: r.passengers.filter(p => p !== state.user?.id)
        } : r)
      };
    }

    if (ride.driverId === state.user?.id) {
      // Driver is cancelling the ride
      const cancelledPassengerNotifications: Notification[] = ride.passengers.map(pId => ({
        id: Math.random().toString(36).substr(2, 9),
        userId: pId,
        title: 'Viagem Cancelada pelo Motorista ⚠️',
        message: `A viagem de ${ride.origin} para ${ride.destination} foi cancelada pelo dono/motorista.`,
        type: 'system',
        isRead: false,
        timestamp: new Date().toISOString(),
        link: `/ride/${rideId}`,
      }));

      // Also notify pending passengers just in case
      const pendingNotifications: Notification[] = (ride.pendingPassengers || []).map(pId => ({
        id: Math.random().toString(36).substr(2, 9),
        userId: pId,
      title: 'Pedido de Boleia Cancelado',
        message: `A viagem de ${ride.origin} para ${ride.destination} foi cancelada pelo motorista.`,
        type: 'system',
        isRead: false,
        timestamp: new Date().toISOString(),
      }));

      return {
        rides: state.rides.map(r => r.id === rideId ? { ...r, status: 'cancelled' } : r),
        notifications: [...cancelledPassengerNotifications, ...pendingNotifications, ...state.notifications]
      };
    }

    return {};
  }),
  removePassenger: (rideId, passengerId, reason) => set((state) => {
    const ride = state.rides.find(r => r.id === rideId);
    if (!ride) return {};

    const updatedPassengers = ride.passengers.filter(p => p !== passengerId);
    const newAvailableSeats = ride.availableSeats + 1;

    const passengerNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: passengerId,
      title: 'Reserva Cancelada pelo Motorista ⚠️',
      message: `A tua reserva na viagem de ${ride.origin} para ${ride.destination} foi cancelada pelo motorista. Motivo: "${reason || 'Sem justificação'}"`,
      type: 'system',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}`,
    };

    return {
      rides: state.rides.map(r => 
        r.id === rideId 
          ? {
              ...r,
              passengers: updatedPassengers,
              availableSeats: newAvailableSeats,
              status: r.status === 'full' ? 'available' : r.status,
            }
          : r
      ),
      notifications: [passengerNotification, ...state.notifications]
    };
  }),
  updateProfile: (updatedData) => set((state) => {
    if (!state.user) return {};
    const updatedUser = { ...state.user, ...updatedData };
    return {
      user: updatedUser,
      users: state.users.map(u => u.id === state.user?.id ? updatedUser : u),
      rides: state.rides.map(r => 
        r.driverId === state.user?.id 
          ? {
              ...r,
              driver: {
                ...r.driver,
                name: updatedUser.name,
                photoUrl: updatedUser.photoUrl,
              }
            }
          : r
      )
    };
  }),
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
  })),
  addMessage: (msg) => set((state) => {
    const newMessage = {
      ...msg,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    
    // Simulate a notification for the recipient (or for the current user for testing purposes)
    const newNotification: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: state.user?.id || 'guest',
      title: 'Nova mensagem',
      message: msg.text.length > 50 ? msg.text.substring(0, 47) + '...' : msg.text,
      type: 'message',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: msg.rideId ? `/ride/${msg.rideId}?view=chat` : undefined,
    };

    return {
      messages: [...state.messages, newMessage],
      notifications: [newNotification, ...state.notifications]
    };
  }),
  startRide: (rideId) => set((state) => {
    const ride = state.rides.find(r => r.id === rideId);
    if (!ride) return {};

    const passengerNotifications: Notification[] = ride.passengers.map(pId => ({
      id: Math.random().toString(36).substring(2, 11),
      userId: pId,
      title: 'Viagem Iniciada! 🚗',
      message: `A tua viagem de ${ride.origin} para ${ride.destination} foi iniciada pelo motorista. Boa viagem!`,
      type: 'system',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}`,
    }));

    // Notify driver themselves
    const driverNotification: Notification = {
      id: Math.random().toString(36).substring(2, 11),
      userId: ride.driverId,
      title: 'Viagem Iniciada!',
      message: `Deste a partida na tua viagem de ${ride.origin} para ${ride.destination}.`,
      type: 'confirmation',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}`,
    };

    return {
      rides: state.rides.map(r => r.id === rideId ? { ...r, status: 'in_progress' } : r),
      notifications: [driverNotification, ...passengerNotifications, ...state.notifications]
    };
  }),
  completeRide: (rideId) => set((state) => {
    const ride = state.rides.find(r => r.id === rideId);
    if (!ride) return {};

    const passengerNotifications: Notification[] = ride.passengers.map(pId => ({
      id: Math.random().toString(36).substring(2, 11),
      userId: pId,
      title: 'Viagem Concluída! 🎉 Certifica e Avalia',
      message: `A tua viagem de ${ride.origin} para ${ride.destination} terminou. Confirma que correu tudo bem e deixa uma avaliação ao motorista!`,
      type: 'confirmation',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}?action=rate`,
    }));

    // Notify driver
    const driverNotification: Notification = {
      id: Math.random().toString(36).substring(2, 11),
      userId: ride.driverId,
      title: 'Viagem Concluída com Sucesso! 🏁',
      message: `A tua de viagem de ${ride.origin} para ${ride.destination} foi concluída com sucesso.`,
      type: 'confirmation',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}`,
    };

    return {
      rides: state.rides.map(r => r.id === rideId ? { ...r, status: 'completed' } : r),
      notifications: [driverNotification, ...passengerNotifications, ...state.notifications]
    };
  }),
  submitReview: (rideId, passengerId, rating, comment) => set((state) => {
    const ride = state.rides.find(r => r.id === rideId);
    if (!ride) return {};

    const passengerObj = MOCK_USERS.find(u => u.id === passengerId);
    const passengerName = passengerObj?.name || 'Um passageiro';

    const driverNotification: Notification = {
      id: Math.random().toString(36).substring(2, 11),
      userId: ride.driverId,
      title: 'Nova Avaliação Recebida! ⭐',
      message: `${passengerName} avaliou a viagem de ${ride.origin} para ${ride.destination} com ${rating} estrelas.${comment ? ` Comentário: "${comment}"` : ''}`,
      type: 'confirmation',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: `/ride/${rideId}`,
    };

    const currentRating = ride.driver.rating || 4.5;
    const newRating = Number(((currentRating * 6 + rating) / 7).toFixed(1));

    return {
      rides: state.rides.map(r => {
        let updated = r;
        if (r.id === rideId) {
          updated = {
            ...r,
            ratedBy: [...(r.ratedBy || []), passengerId]
          };
        }
        if (updated.driverId === ride.driverId) {
          updated = {
            ...updated,
            driver: {
              ...updated.driver,
              rating: newRating
            }
          };
        }
        return updated;
      }),
      user: state.user?.id === ride.driverId 
        ? { ...state.user, rating: newRating, totalTrips: state.user.totalTrips + 1 }
        : state.user,
      notifications: [driverNotification, ...state.notifications]
    };
  }),
  blockUser: (userId) => set((state) => {
    const updatedUsers = state.users.map(u => u.id === userId ? { ...u, isBlocked: true } : u);
    const updatedCurrentUser = state.user?.id === userId ? { ...state.user, isBlocked: true } : state.user;
    return { users: updatedUsers, user: updatedCurrentUser };
  }),
  unblockUser: (userId) => set((state) => {
    const updatedUsers = state.users.map(u => u.id === userId ? { ...u, isBlocked: false } : u);
    const updatedCurrentUser = state.user?.id === userId ? { ...state.user, isBlocked: false } : state.user;
    return { users: updatedUsers, user: updatedCurrentUser };
  }),
  verifyUser: (userId) => set((state) => {
    const updatedUsers = state.users.map(u => u.id === userId ? { ...u, isVerified: true } : u);
    const updatedCurrentUser = state.user?.id === userId ? { ...state.user, isVerified: true } : state.user;
    return { users: updatedUsers, user: updatedCurrentUser };
  }),
  verifyDocument: (userId, docId, status) => set((state) => {
    let updatedCurrentUser = state.user;
    const updatedUsers = state.users.map(u => {
      if (u.id !== userId) return u;
      const updatedDocs = (u.documents || []).map(doc => 
        doc.id === docId ? { ...doc, status } : doc
      );
      const allVerified = updatedDocs.length > 0 && updatedDocs.every(d => d.status === 'verified');
      const updatedU = { 
        ...u, 
        documents: updatedDocs,
        isVerified: allVerified ? true : u.isVerified
      };
      if (state.user?.id === userId) {
        updatedCurrentUser = updatedU;
      }
      return updatedU;
    });
    return { users: updatedUsers, user: updatedCurrentUser };
  }),
  submitDocuments: (docNationalIdUrl, docDrivingLicenseUrl) => set((state) => {
    if (!state.user) return {};
    
    const docs: UserDocument[] = [
      {
        id: `doc-${state.user.id}-national`,
        name: 'Bilhete de Identidade / CNI',
        type: 'national_id',
        url: docNationalIdUrl,
        status: 'pending'
      }
    ];

    if (docDrivingLicenseUrl) {
      docs.push({
        id: `doc-${state.user.id}-driving`,
        name: 'Carta de Condução',
        type: 'driving_license',
        url: docDrivingLicenseUrl,
        status: 'pending'
      });
    }

    const updatedUser = {
      ...state.user,
      documents: docs,
      isVerified: false // resetting verification during approval
    };

    return {
      user: updatedUser,
      users: state.users.map(u => u.id === state.user?.id ? updatedUser : u)
    };
  }),
  addFreightRequest: (origin, destination, requestedTime, specificFretistaId) => set((state) => {
    if (!state.user) return {};
    const newRequest: FreightRequest = {
      id: 'fr-' + Math.random().toString(36).substr(2, 9),
      requesterId: state.user.id,
      requesterName: state.user.name,
      requesterPhoto: state.user.photoUrl,
      origin,
      destination,
      requestedTime,
      specificFretistaId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Notify the specific fretista if designated, or notify all fretistas if it is general
    const notifiedFretistas = specificFretistaId 
      ? [state.users.find(u => u.id === specificFretistaId)].filter(Boolean)
      : state.users.filter(u => u.role === 'fretista');

    const newNotifications: Notification[] = (notifiedFretistas as User[]).map(fret => ({
      id: 'n-' + Math.random().toString(36).substr(2, 9),
      userId: fret.id,
      title: 'Nova solicitação de frete! 🚚',
      message: `${state.user?.name} solicitou um frete de ${origin} para ${destination}.`,
      type: 'request',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: '/pedir-carro'
    }));

    return {
      freightRequests: [newRequest, ...state.freightRequests],
      notifications: [...newNotifications, ...state.notifications]
    };
  }),
  acceptFreightRequest: (requestId, fretistaId) => set((state) => {
    const req = state.freightRequests.find(r => r.id === requestId);
    if (!req) return {};

    const fretista = state.users.find(u => u.id === fretistaId);
    if (!fretista) return {};

    // Notify requester (that the fretista accepted the request)
    const notification: Notification = {
      id: 'n-' + Math.random().toString(36).substr(2, 9),
      userId: req.requesterId,
      title: 'Solicitação de Carro Aceita! 🎉',
      message: `${fretista.name} aceitou a sua solicitação de carro de ${req.origin} para ${req.destination}.`,
      type: 'confirmation',
      isRead: false,
      timestamp: new Date().toISOString(),
      link: '/pedir-carro'
    };

    return {
      freightRequests: state.freightRequests.map(r => 
        r.id === requestId 
          ? { ...r, status: 'accepted', fretistaId, fretistaName: fretista.name } 
          : r
      ),
      notifications: [notification, ...state.notifications]
    };
  }),
  declineFreightRequest: (requestId) => set((state) => {
    return {
      freightRequests: state.freightRequests.map(r => 
        r.id === requestId 
          ? { ...r, status: 'declined' } 
          : r
      )
    };
  })
}));
