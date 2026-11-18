import client from './client';
import type { CategoryDto } from '../types';

export const getCategories = (page = 0, size = 50) =>
  client.get<CategoryDto[]>('/categories', { params: { page, size } });

export const createCategory = (data: { name: string; description: string }) =>
  client.post<CategoryDto>('/categories', data);

export const updateCategory = (id: number, data: { name: string; description: string }) =>
  client.put<CategoryDto>(`/categories/${id}`, data);

export const deleteCategory = (id: number) =>
  client.delete(`/categories/${id}`);
