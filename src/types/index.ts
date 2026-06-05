export type UserRole = 'passenger' | 'driver' | 'fretista';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  photoUrl?: string;
  role: UserRole;
  isVerified: boolean;
  rating: number;
  totalTrips: number;
  joinedAt: string;
  vehicles?: Vehicle[];
  vehicle?: Vehicle;
  isBlocked?: boolean;
  documents?: UserDocument[];
  Permissions?: UserPermission[];
}

export interface UserPermission {
  Permission: {
    name: string;
  };
}

export interface UserDocument {
  id: string;
  name: string;
  type: 'driving_license' | 'national_id' | 'vehicle_registration';
  url: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface Vehicle {
  id?: string;
  make: string;
  model: string;
  color: string;
  plate: string;
  photoUrl?: string;
}

export interface Ride {
  id: string;
  driverId: string;
  driver: Partial<User>;
  origin: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  totalSeats: number;
  price?: number;
  observations?: string;
  status: 'available' | 'full' | 'in_progress' | 'completed' | 'cancelled';
  passengers: string[];
  passengerDetails?: Partial<User>[];
  vehicle?: Vehicle;
  pendingPassengers?: string[];
  pendingPassengerDetails?: Partial<User>[];
  ratedBy?: string[];
}

export interface Message {
  id: string;
  rideId?: string;
  senderId: string;
  recipientId?: string;
  text: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'request' | 'confirmation' | 'message' | 'system';
  isRead: boolean;
  timestamp: string;
  link?: string;
}

export interface FreightRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterPhoto?: string;
  requesterPhone?: string;
  origin: string;
  destination: string;
  requestedTime?: string;
  specificFretistaId?: string;
  status: 'pending' | 'accepted' | 'declined' | 'in_progress' | 'completed';
  fretistaId?: string;
  fretistaName?: string;
  fretistaPhone?: string;
  createdAt: string;
}
