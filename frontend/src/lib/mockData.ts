export interface Author {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Book {
  id: number;
  title: string;
  author: Author;
  categories: Category[];
  price: number;
  description: string;
  coverImage: string;
  isbn: string;
  publishedYear: number;
}

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, name: "Fiction", description: "Fictional literary works." },
  { id: 2, name: "Science Fiction", description: "Futuristic and imaginative concepts." },
  { id: 3, name: "Classics", description: "Enduring works of high literary value." },
  { id: 4, name: "Biography", description: "Accounts of the lives of real people." }
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: { id: 1, name: "F. Scott Fitzgerald" },
    categories: [INITIAL_CATEGORIES[0], INITIAL_CATEGORIES[2]],
    price: 15.99,
    description: "A novel set in the Roaring Twenties, exploring themes of decadence, idealism, and the American Dream.",
    coverImage: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000&auto=format&fit=crop",
    isbn: "978-0743273565",
    publishedYear: 1925
  },
  {
    id: 2,
    title: "Dune",
    author: { id: 2, name: "Frank Herbert" },
    categories: [INITIAL_CATEGORIES[1]],
    price: 24.50,
    description: "A complex and beautifully crafted universe filled with political intrigue, religion, and ecology.",
    coverImage: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?q=80&w=1000&auto=format&fit=crop",
    isbn: "978-0441172719",
    publishedYear: 1965
  },
  {
    id: 3,
    title: "1984",
    author: { id: 3, name: "George Orwell" },
    categories: [INITIAL_CATEGORIES[0], INITIAL_CATEGORIES[1], INITIAL_CATEGORIES[2]],
    price: 19.99,
    description: "A dystopian social science fiction novel and cautionary tale about the dangers of totalitarianism.",
    coverImage: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1000&auto=format&fit=crop",
    isbn: "978-0451524935",
    publishedYear: 1949
  },
  {
    id: 4,
    title: "Steve Jobs",
    author: { id: 4, name: "Walter Isaacson" },
    categories: [INITIAL_CATEGORIES[3]],
    price: 29.00,
    description: "The exclusive biography of Steve Jobs.",
    coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=1000&auto=format&fit=crop",
    isbn: "978-1451648539",
    publishedYear: 2011
  },
  {
    id: 5,
    title: "To Kill a Mockingbird",
    author: { id: 5, name: "Harper Lee" },
    categories: [INITIAL_CATEGORIES[0], INITIAL_CATEGORIES[2]],
    price: 18.25,
    description: "A novel about the serious issues of rape and racial inequality told with warmth and humor.",
    coverImage: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1000&auto=format&fit=crop",
    isbn: "978-0060935467",
    publishedYear: 1960
  },
  {
    id: 6,
    title: "Project Hail Mary",
    author: { id: 6, name: "Andy Weir" },
    categories: [INITIAL_CATEGORIES[1]],
    price: 22.95,
    description: "A lone astronaut must save the earth from disaster.",
    coverImage: "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=1000&auto=format&fit=crop",
    isbn: "978-0593135204",
    publishedYear: 2021
  }
];
