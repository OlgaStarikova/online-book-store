import client from './client';
import type { UserResponseDto } from '../types';

export const login = (email: string, password: string) =>
  client.post<{ token: string }>('/auth/login', { email, password });

export const register = (data: {
  email: string;
  password: string;
  repeatPassword: string;
  firstName: string;
  lastName: string;
  shippingAddress?: string;
}) => client.post<UserResponseDto>('/auth/register', data);

export const getMe = () =>
  client.get<UserResponseDto>('/auth/me');
