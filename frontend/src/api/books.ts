import client from './client';
import type { BookDto } from '../types';

export const getBooks = (page = 0, size = 12) =>
  client.get<BookDto[]>('/books', { params: { page, size } });

export const getBook = (id: number) =>
  client.get<BookDto>(`/books/${id}`);

export const searchBooks = (params: { titles?: string; authors?: string }) =>
  client.get<BookDto[]>('/books/search', { params });

export const createBook = (data: Omit<BookDto, 'id'>) =>
  client.post<BookDto>('/books', data);

export const updateBook = (id: number, data: Omit<BookDto, 'id'>) =>
  client.put<BookDto>(`/books/${id}`, data);

export const deleteBook = (id: number) =>
  client.delete(`/books/${id}`);
