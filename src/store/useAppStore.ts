import { create } from 'zustand';
import { api } from '../services/api';
import type { FreightRequest, Message, Notification, Ride, User, UserDocument, Vehicle } from '../types';

type Theme = 'dark' | 'light';

type LoginResponse = {
  token: string;
  user: User;
};

type UsersResponse = {
  users?: User[];
};

interface AppState {
  user: User | null;
  users: User[];
  rides: Ride[];
  notifications: Notification[];
  messages: Message[];
  freightRequests: FreightRequest[];
  isLoading: boolean;
  theme: Theme;
  isAuthModalOpen: boolean;
  initialize: () => Promise<void>;
  refreshData: () => Promise<void>;
  toggleTheme: () => void;
  setAuthModalOpen: (isOpen: boolean) => void;
  login: (email: string, password?: string) => Promise<void>;
  logout: () => void;
  publishRide: (ride: Omit<Ride, 'id' | 'driverId' | 'driver' | 'status' | 'passengers'>) => Promise<void>;
  updateRide: (rideId: string, ride: Partial<Pick<Ride, 'origin' | 'destination' | 'departureTime' | 'totalSeats' | 'price' | 'observations' | 'vehicle'>>) => Promise<void>;
  requestRide: (rideId: string) => Promise<void>;
  cancelRide: (rideId: string) => Promise<void>;
  updateProfile: (updatedData: Partial<User>) => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  loadRideMessages: (rideId: string) => Promise<void>;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Promise<void>;
  acceptRequest: (rideId: string, passengerId: string) => Promise<void>;
  declineRequest: (rideId: string, passengerId: string) => void;
  removePassenger: (rideId: string, passengerId: string, reason: string) => void;
  startRide: (rideId: string) => Promise<void>;
  completeRide: (rideId: string) => Promise<void>;
  submitReview: (rideId: string, passengerId: string, rating: number, comment?: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;
  verifyUser: (userId: string) => Promise<void>;
  verifyDocument: (userId: string, docId: string, status: 'verified' | 'rejected') => void;
  submitDocuments: (docNationalIdUrl: string, docDrivingLicenseUrl?: string) => Promise<void>;
  addFreightRequest: (origin: string, destination: string, requestedTime?: string, specificFretistaId?: string) => Promise<void>;
  acceptFreightRequest: (requestId: string, fretistaId: string) => Promise<void>;
  declineFreightRequest: (requestId: string) => Promise<void>;
  startFreightRequest: (requestId: string) => Promise<void>;
  completeFreightRequest: (requestId: string) => Promise<void>;
  rateFreightRequest: (requestId: string, rating: number) => Promise<void>;
}

function normalizeRide(ride: any): Ride {
  const passengerDetails = Array.isArray(ride.passengers)
    ? ride.passengers.filter((passenger: User | string) => typeof passenger !== 'string')
    : [];
  const pendingPassengerDetails = Array.isArray(ride.pendingPassengers)
    ? ride.pendingPassengers.filter((passenger: User | string) => typeof passenger !== 'string')
    : [];

  return {
    ...ride,
    passengers: Array.isArray(ride.passengers)
      ? ride.passengers.map((passenger: User | string) => (typeof passenger === 'string' ? passenger : passenger.id))
      : [],
    passengerDetails,
    pendingPassengers: Array.isArray(ride.pendingPassengers)
      ? ride.pendingPassengers.map((passenger: User | string) => (typeof passenger === 'string' ? passenger : passenger.id))
      : [],
    pendingPassengerDetails,
    driver: {
      ...ride.driver,
      isVerified: ride.driver?.isVerified ?? true,
    },
  };
}

function normalizeUser(user: User): User {
  return {
    ...user,
    vehicles: user.vehicles ?? [],
    vehicle: user.vehicle ?? user.vehicles?.[0],
    documents: user.documents ?? [],
    rating: user.rating ?? 0,
    totalTrips: user.totalTrips ?? 0,
    isVerified: user.isVerified ?? false,
  };
}

async function fetchUsers() {
  const { data } = await api.get<UsersResponse | User[]>('/users', {
    params: { perPage: 100, sorterBy: 'name', sorterOrder: 'asc' },
  });
  const users = Array.isArray(data) ? data : data.users ?? [];
  return users.map(normalizeUser);
}

async function fetchRides() {
  const { data } = await api.get<any[]>('/rides');
  return data.map(normalizeRide);
}

function getApiMessage(error: any, fallback: string) {
  return error?.response?.data?.message || error?.response?.data?.error || fallback;
}

async function fetchMe() {
  const { data } = await api.get<User>('/me');
  return normalizeUser(data);
}

async function fetchNotifications() {
  try {
    const { data } = await api.get<Notification[]>('/notifications');
    return data;
  } catch {
    return [];
  }
}

async function fetchFreights() {
  try {
    const { data } = await api.get<any[]>('/freights');
    return data.map((request) => ({
      ...request,
      requesterName: request.requester?.name ?? request.requesterName ?? 'Utilizador',
      requesterPhoto: request.requester?.photoUrl,
      requesterPhone: request.requester?.phone ?? request.requesterPhone,
      fretistaName: request.fretista?.name,
      fretistaPhone: request.fretista?.phone ?? request.fretistaPhone,
      specificFretistaId: request.specificFretistaId,
    }));
  } catch {
    return [];
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  users: [],
  rides: [],
  notifications: [],
  messages: [],
  freightRequests: [],
  isLoading: false,
  theme: 'dark',
  isAuthModalOpen: false,

  initialize: async () => {
    const token = localStorage.getItem('token');
    const cachedUser = localStorage.getItem('user');
    if (cachedUser) {
      set({ user: normalizeUser(JSON.parse(cachedUser)) });
    }
    if (!token) {
      const [users, rides] = await Promise.all([fetchUsers().catch(() => []), fetchRides().catch(() => [])]);
      set({ users, rides });
      return;
    }
    await get().refreshData();
  },

  refreshData: async () => {
    const token = localStorage.getItem('token');
    const [users, rides, me, notifications, freightRequests] = await Promise.all([
      fetchUsers().catch(() => []),
      fetchRides().catch(() => []),
      token ? fetchMe().catch(() => null) : Promise.resolve(null),
      token ? fetchNotifications() : Promise.resolve([]),
      token ? fetchFreights() : Promise.resolve([]),
    ]);

    if (me) localStorage.setItem('user', JSON.stringify(me));
    set({
      users,
      rides,
      user: me ?? get().user,
      notifications,
      freightRequests,
    });
  },

  toggleTheme: () => set((state) => {
    const theme: Theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    return { theme };
  }),

  setAuthModalOpen: (isOpen) => set({ isAuthModalOpen: isOpen }),

  login: async (email, password = '') => {
    set({ isLoading: true });
    try {
      const { data } = await api.post<LoginResponse>('/login', { email, password });
      const user = normalizeUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ user, isLoading: false });
      await get().refreshData();
      window.dispatchEvent(new Event('auth:changed'));
    } catch (error: any) {
      set({ isLoading: false });
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Falha ao iniciar sessao.');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, notifications: [], freightRequests: [] });
    window.dispatchEvent(new Event('auth:changed'));
  },

  publishRide: async (newRide) => {
    const vehicle = newRide.vehicle;
    if (!vehicle?.id) throw new Error('Selecione um veiculo registado.');
    await api.post('/rides', {
      origin: newRide.origin,
      destination: newRide.destination,
      departureTime: newRide.departureTime,
      totalSeats: newRide.totalSeats,
      price: newRide.price,
      observations: newRide.observations,
      vehicleId: vehicle.id,
    });
    await get().refreshData();
  },

  updateRide: async (rideId, updatedRide) => {
    const vehicle = updatedRide.vehicle;
    if (vehicle && !vehicle.id) throw new Error('Selecione um veiculo registado.');
    await api.put(`/rides/${rideId}`, {
      origin: updatedRide.origin,
      destination: updatedRide.destination,
      departureTime: updatedRide.departureTime,
      totalSeats: updatedRide.totalSeats,
      price: updatedRide.price,
      observations: updatedRide.observations,
      vehicleId: vehicle?.id,
    });
    await get().refreshData();
  },

  requestRide: async (rideId) => {
    try {
      await api.post(`/rides/${rideId}/request-join`);
      await get().refreshData();
    } catch (error: any) {
      throw new Error(getApiMessage(error, 'Nao foi possivel enviar o pedido de boleia.'));
    }
  },

  acceptRequest: async (rideId, passengerId) => {
    try {
      await api.post(`/rides/${rideId}/accept-passenger`, { passengerId });
      await get().refreshData();
    } catch (error: any) {
      throw new Error(getApiMessage(error, 'Nao foi possivel aceitar esta solicitacao.'));
    }
  },

  declineRequest: (rideId, passengerId) => set((state) => ({
    rides: state.rides.map((ride) =>
      ride.id === rideId
        ? { ...ride, pendingPassengers: (ride.pendingPassengers ?? []).filter((id) => id !== passengerId) }
        : ride,
    ),
  })),

  cancelRide: async (rideId) => {
    await api.patch(`/rides/${rideId}/cancel`);
    await get().refreshData();
  },

  startRide: async (rideId) => {
    await api.put(`/rides/${rideId}`, { status: 'in_progress' });
    await get().refreshData();
  },

  completeRide: async (rideId) => {
    await api.put(`/rides/${rideId}`, { status: 'completed' });
    await get().refreshData();
  },

  submitReview: async (rideId, _passengerId, rating, comment) => {
    await api.post(`/rides/${rideId}/rate`, { rating, comment });
    await get().refreshData();
  },

  updateProfile: async (updatedData) => {
    const vehicle = updatedData.vehicle;
    const vehicles = updatedData.vehicles;
    const profileData = {
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      photoUrl: updatedData.photoUrl,
      role: updatedData.role,
    };
    const cleanProfileData = Object.fromEntries(
      Object.entries(profileData).filter(([, value]) => value !== undefined),
    );

    if (Object.keys(cleanProfileData).length) {
      const { data } = await api.put<User>('/me', cleanProfileData);
      const user = normalizeUser(data);
      set({ user });
      localStorage.setItem('user', JSON.stringify(user));
    }

    const currentVehicles = get().user?.vehicles ?? [];
    const desiredVehicles = vehicles ?? (vehicle ? [vehicle] : undefined);
    if (desiredVehicles) {
      const newVehicles = desiredVehicles.filter((item) => !item.id && !currentVehicles.some((v) => v.plate === item.plate));
      for (const item of newVehicles) {
        await api.post<Vehicle>('/vehicles', item);
      }
      await get().refreshData();
    }
  },

  markNotificationAsRead: async (id) => {
    await api.patch(`/notifications/${id}/read`);
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification,
      ),
    }));
  },

  loadRideMessages: async (rideId) => {
    try {
      const { data } = await api.get<Message[]>(`/rides/${rideId}/messages`);
      set((state) => ({
        messages: [
          ...state.messages.filter((message) => message.rideId !== rideId),
          ...data,
        ],
      }));
    } catch (error: any) {
      throw new Error(getApiMessage(error, 'Nao foi possivel carregar as mensagens.'));
    }
  },

  addMessage: async (message) => {
    if (!message.rideId) return;
    try {
      const { data } = await api.post<Message>(`/rides/${message.rideId}/messages`, {
        text: message.text,
        recipientId: message.recipientId,
      });
      set((state) => ({
        messages: [
          ...state.messages.filter((item) => item.id !== data.id),
          data,
        ],
      }));
      await get().loadRideMessages(message.rideId);
    } catch (error: any) {
      throw new Error(getApiMessage(error, 'Nao foi possivel enviar a mensagem.'));
    }
  },

  removePassenger: (rideId, passengerId) => set((state) => ({
    rides: state.rides.map((ride) =>
      ride.id === rideId
        ? {
            ...ride,
            passengers: ride.passengers.filter((id) => id !== passengerId),
            availableSeats: ride.availableSeats + 1,
          }
        : ride,
    ),
  })),

  blockUser: async (userId) => {
    await api.put(`/remove-user/${userId}`);
    await get().refreshData();
  },

  unblockUser: async (userId) => {
    await api.put(`/user/${userId}`, { isBlocked: false });
    await get().refreshData();
  },

  verifyUser: async (userId) => {
    await api.put(`/user/${userId}`, { isVerified: true });
    await get().refreshData();
  },

  verifyDocument: (userId, docId, status) => set((state) => ({
    users: state.users.map((user) => {
      if (user.id !== userId) return user;
      const documents = (user.documents ?? []).map((doc) => (doc.id === docId ? { ...doc, status } : doc));
      return { ...user, documents };
    }),
  })),

  submitDocuments: async (docNationalIdUrl, docDrivingLicenseUrl) => {
    await api.post('/me/documents', {
      nationalIdUrl: docNationalIdUrl,
      drivingLicenseUrl: docDrivingLicenseUrl,
    });

    const state = get();
    if (!state.user) return;
    const documents: UserDocument[] = [
      {
        id: `doc-${state.user.id}-national`,
        name: 'Bilhete de Identidade / CNI',
        type: 'national_id',
        url: docNationalIdUrl,
        status: 'pending',
      },
    ];
    if (docDrivingLicenseUrl) {
      documents.push({
        id: `doc-${state.user.id}-driving`,
        name: 'Carta de Conducao',
        type: 'driving_license',
        url: docDrivingLicenseUrl,
        status: 'pending',
      });
    }
    const user = { ...state.user, documents, isVerified: false };
    localStorage.setItem('user', JSON.stringify(user));
    set({
      user,
      users: state.users.map((item) => (item.id === user.id ? user : item)),
    });
    await get().refreshData();
  },

  addFreightRequest: async (origin, destination, requestedTime, specificFretistaId) => {
    await api.post('/freights', {
      origin,
      destination,
      requestedTime: requestedTime ? new Date(requestedTime).toISOString() : undefined,
      specificFretistaId,
    });
    await get().refreshData();
  },

  acceptFreightRequest: async (requestId) => {
    await api.patch(`/freights/${requestId}/respond`, { status: 'accepted' });
    await get().refreshData();
  },

  declineFreightRequest: async (requestId) => {
    await api.patch(`/freights/${requestId}/respond`, { status: 'declined' });
    await get().refreshData();
  },

  startFreightRequest: async (requestId) => {
    await api.patch(`/freights/${requestId}/respond`, { status: 'in_progress' });
    await get().refreshData();
  },

  completeFreightRequest: async (requestId) => {
    await api.patch(`/freights/${requestId}/respond`, { status: 'completed' });
    await get().refreshData();
  },

  rateFreightRequest: async (requestId, rating) => {
    await api.post(`/freights/${requestId}/rate`, { rating });
    await get().refreshData();
  },
}));
