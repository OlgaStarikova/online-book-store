import React from 'react';
import type { BookDto, CategoryDto, CartItemDto } from '../types';
import * as booksApi from '../api/books';
import * as categoriesApi from '../api/categories';
import * as cartApi from '../api/cart';
import { useAuthStore } from '../store/authStore';

export interface Book {
  id: number;
  title: string;
  author: { id: number; name: string };
  categories: CategoryDto[];
  price: number;
  description: string;
  coverImage: string;
  isbn: string;
  publishedYear: number;
}

export interface CartItem {
  id: number;
  book: Book;
  quantity: number;
}

interface AppContextType {
  books: Book[];
  booksLoading: boolean;
  categories: CategoryDto[];
  cart: CartItem[];
  cartLoading: boolean;
  addToCart: (book: Book, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  reloadBooks: () => Promise<void>;
  reloadCart: () => Promise<void>;
  addBook: (data: Omit<BookDto, 'id'>) => Promise<void>;
  editBook: (id: number, data: Omit<BookDto, 'id'>) => Promise<void>;
  deleteBook: (id: number) => Promise<void>;
  addCategory: (data: { name: string; description: string }) => Promise<void>;
  editCategory: (id: number, data: { name: string; description: string }) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined);

function mapBookDto(dto: BookDto, categoryMap: Map<number, CategoryDto>): Book {
  return {
    id: dto.id,
    title: dto.title,
    author: { id: 0, name: dto.author },
    categories: dto.categoryIds
      .map((id) => categoryMap.get(id))
      .filter((c): c is CategoryDto => !!c),
    price: dto.price,
    description: dto.description ?? '',
    coverImage: dto.coverImage ?? '',
    isbn: dto.isbn,
    publishedYear: 0,
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [books, setBooks] = React.useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = React.useState(false);
  const [categories, setCategories] = React.useState<CategoryDto[]>([]);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = React.useState(false);
  const categoryMapRef = React.useRef<Map<number, CategoryDto>>(new Map());

  const loadCategories = React.useCallback(async () => {
    try {
      const res = await categoriesApi.getCategories();
      const map = new Map(res.data.map((c) => [c.id, c]));
      categoryMapRef.current = map;
      setCategories(res.data);
      return map;
    } catch {
      return categoryMapRef.current;
    }
  }, []);

  const reloadBooks = React.useCallback(async () => {
    setBooksLoading(true);
    try {
      const map = categoryMapRef.current.size > 0
        ? categoryMapRef.current
        : await loadCategories();
      const res = await booksApi.getBooks(0, 100);
      setBooks(res.data.map((dto) => mapBookDto(dto, map)));
    } catch {
      // silent — user sees empty state
    } finally {
      setBooksLoading(false);
    }
  }, [loadCategories]);

  const buildCartItems = React.useCallback(
    (cartItemDtos: CartItemDto[], currentBooks: Book[]): CartItem[] => {
      return cartItemDtos.map((dto) => {
        const book = currentBooks.find((b) => b.id === dto.bookId) ?? {
          id: dto.bookId,
          title: dto.bookTitle,
          author: { id: 0, name: '' },
          categories: [],
          price: 0,
          description: '',
          coverImage: '',
          isbn: '',
          publishedYear: 0,
        };
        return { id: dto.id, book, quantity: dto.quantity };
      });
    },
    []
  );

  const reloadCart = React.useCallback(async () => {
    setCartLoading(true);
    try {
      const res = await cartApi.getCart();
      setCart((prev) => {
        const currentBooks = books;
        return buildCartItems(res.data.cartItemDtos, currentBooks);
      });
    } catch {
      setCart([]);
    } finally {
      setCartLoading(false);
    }
  }, [books, buildCartItems]);

  // Load data when authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      setBooks([]);
      setCategories([]);
      setCart([]);
      return;
    }
    loadCategories().then((map) => {
      setBooksLoading(true);
      booksApi.getBooks(0, 100)
        .then((res) => {
          const mappedBooks = res.data.map((dto) => mapBookDto(dto, map));
          setBooks(mappedBooks);
          cartApi.getCart()
            .then((cartRes) => setCart(buildCartItems(cartRes.data.cartItemDtos, mappedBooks)))
            .catch(() => setCart([]));
        })
        .catch(() => {})
        .finally(() => setBooksLoading(false));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const addToCart = async (book: Book, quantity = 1) => {
    await cartApi.addToCart(book.id, quantity);
    const res = await cartApi.getCart();
    setCart(buildCartItems(res.data.cartItemDtos, books));
  };

  const removeFromCart = async (itemId: number) => {
    await cartApi.removeCartItem(itemId);
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
      return;
    }
    await cartApi.updateCartItem(itemId, quantity);
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const addBook = async (data: Omit<BookDto, 'id'>) => {
    await booksApi.createBook(data);
    await reloadBooks();
  };

  const editBook = async (id: number, data: Omit<BookDto, 'id'>) => {
    await booksApi.updateBook(id, data);
    await reloadBooks();
  };

  const deleteBook = async (id: number) => {
    await booksApi.deleteBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const addCategory = async (data: { name: string; description: string }) => {
    await categoriesApi.createCategory(data);
    await loadCategories();
  };

  const editCategory = async (id: number, data: { name: string; description: string }) => {
    await categoriesApi.updateCategory(id, data);
    await loadCategories();
  };

  const deleteCategory = async (id: number) => {
    await categoriesApi.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <AppContext.Provider value={{
      books, booksLoading,
      categories,
      cart, cartLoading,
      addToCart, removeFromCart, updateQuantity,
      reloadBooks, reloadCart,
      addBook, editBook, deleteBook,
      addCategory, editCategory, deleteCategory,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}
