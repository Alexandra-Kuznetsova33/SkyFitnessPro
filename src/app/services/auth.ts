import type {
  LoginRequest,
  LoginResponse,
  MessageResponse,
  RegisterRequest,
  User,
} from '../sharedTypes/types';

import { API_ENDPOINTS } from './constants';
import { api } from './api';

export const register = async (data: RegisterRequest): Promise<MessageResponse> => {
  const response = await api.post<MessageResponse>(
    API_ENDPOINTS.auth.register,
    JSON.stringify(data),
    { headers: { 'Content-Type': 'text/plain' } },
  );
  return response.data;
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    API_ENDPOINTS.auth.login,
    JSON.stringify(data),
    { headers: { 'Content-Type': 'text/plain' } },
  );
  return response.data;
};

export const getMe = async (): Promise<User> => {
  const response = await api.get<{ user: User }>(API_ENDPOINTS.users.me);
  return response.data.user;
};
