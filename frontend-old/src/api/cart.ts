import client from './client';
import type { ShoppingCartDto } from '../types';

export const getCart = () =>
  client.get<ShoppingCartDto>('/cart');

export const addToCart = (bookId: number, quantity: number) =>
  client.post<ShoppingCartDto>('/cart', { bookId, quantity });

export const updateCartItem = (itemId: number, quantity: number) =>
  client.put<ShoppingCartDto>(`/cart/items/${itemId}`, { quantity });

export const removeCartItem = (itemId: number) =>
  client.delete(`/cart/items/${itemId}`);
