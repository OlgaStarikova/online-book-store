export interface BookDto {
  id: number;
  title: string;
  author: string;
  isbn: string;
  price: number;
  description?: string;
  coverImage?: string;
  categoryIds: number[];
}

export interface CategoryDto {
  id: number;
  name: string;
  description?: string;
}

export interface CartItemDto {
  id: number;
  bookId: number;
  bookTitle: string;
  quantity: number;
}

export interface ShoppingCartDto {
  id: number;
  userId: number;
  cartItemDtos: CartItemDto[];
}

export interface OrderItemDto {
  id: number;
  bookId: number;
  quantity: number;
}

export interface OrderDto {
  id: number;
  userId: number;
  orderItemDtos: OrderItemDto[];
  orderDate: string;
  total: number;
  status: string;
}

export interface UserResponseDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
}
