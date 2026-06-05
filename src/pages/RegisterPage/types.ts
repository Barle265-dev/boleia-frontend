export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role?: 'passenger' | 'fretista';
};
