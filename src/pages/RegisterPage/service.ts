import { api } from '../../services/api';
import type { RegisterPayload } from './types';

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post('/register', payload);
  return data;
}
