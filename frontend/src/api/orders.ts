import client from './client';
import type { OrderDto, OrderItemDto } from '../types';

export const getOrders = (page = 0, size = 10) =>
  client.get<OrderDto[]>('/orders', { params: { page, size } });

export const createOrder = (shippingAddress: string) =>
  client.post<OrderDto>('/orders', { shippingAddress });

export const getOrderItems = (orderId: number) =>
  client.get<OrderItemDto[]>(`/orders/${orderId}/items`);
