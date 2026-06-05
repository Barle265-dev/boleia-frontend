export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  photoUrl?: string;
  role?: 'passenger' | 'fretista';
};
