import type { Ride, User } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Carlos Semedo',
    email: 'carlos@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    role: 'driver',
    isVerified: true,
    rating: 4.8,
    totalTrips: 124,
    joinedAt: '2023-05-10',
    vehicles: [
      {
        make: 'Toyota',
        model: 'Hilux',
        color: 'Cinza',
        plate: 'CV-123-AB',
      }
    ],
    vehicle: {
      make: 'Toyota',
      model: 'Hilux',
      color: 'Cinza',
      plate: 'CV-123-AB',
    },
  },
  {
    id: 'u2',
    name: 'Maria Varela',
    email: 'maria@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    role: 'passenger',
    isVerified: true,
    rating: 4.9,
    totalTrips: 45,
    joinedAt: '2023-08-22',
  },
  {
    id: 'u3',
    name: 'José Lopes',
    email: 'jose@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    role: 'driver',
    isVerified: true,
    rating: 4.7,
    totalTrips: 89,
    joinedAt: '2023-06-15',
    vehicles: [
      {
        make: 'Volkswagen',
        model: 'Polo',
        color: 'Preto',
        plate: 'ST-99-XZ',
      }
    ],
    vehicle: {
      make: 'Volkswagen',
      model: 'Polo',
      color: 'Preto',
      plate: 'ST-99-XZ',
    },
  },
  {
    id: 'u4',
    name: 'Elisângela Silva',
    email: 'elisa@example.com',
    photoUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200',
    role: 'passenger',
    isVerified: true,
    rating: 5.0,
    totalTrips: 12,
    joinedAt: '2024-01-05',
  },
];

export const MOCK_RIDES: Ride[] = [
  {
    id: 'r1',
    driverId: 'u1',
    driver: {
      name: 'Carlos Semedo',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      rating: 4.8,
      isVerified: true,
    },
    origin: 'Praia',
    destination: 'Assomada',
    departureTime: new Date(Date.now() + 3600000 * 2).toISOString(), // 2 hours from now
    availableSeats: 3,
    totalSeats: 4,
    price: 500,
    observations: 'Saída do Platô. Levo bagagem leve.',
    status: 'available',
    passengers: [],
    vehicle: {
      make: 'Toyota',
      model: 'Hilux',
      color: 'Cinza',
      plate: 'CV-123-AB',
    },
  },
  {
    id: 'r2',
    driverId: 'u1',
    driver: {
      name: 'Carlos Semedo',
      photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
      rating: 4.8,
      isVerified: true,
    },
    origin: 'Mindelo',
    destination: 'Calheta',
    departureTime: new Date(Date.now() + 3600000 * 24).toISOString(), // Tomorrow
    availableSeats: 2,
    totalSeats: 4,
    price: 300,
    observations: 'Viagem tranquila.',
    status: 'available',
    passengers: ['u2'],
    vehicle: {
      make: 'Toyota',
      model: 'Hilux',
      color: 'Cinza',
      plate: 'CV-123-AB',
    },
  },
];
