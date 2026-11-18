import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext, type Book } from '../lib/AppContext';
import { useAuthStore } from '../store/authStore';

export function BookCard({ book }: { book: Book }) {
  const { addToCart } = useAppContext();
  const { isAuthenticated } = useAuthStore();
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!isAuthenticated) return;
    setAdding(true);
    try {
      await addToCart(book);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-warm-200 shadow-sm hover:shadow-md transition-all duration-300">
      <Link to={`/books/${book.id}`} className="block relative aspect-[3/4] overflow-hidden bg-warm-100">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-warm-400 text-sm">No cover</div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </Link>

      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-semibold text-accent-indigo mb-2 uppercase tracking-wider">
          {book.categories[0]?.name}
        </div>

        <Link to={`/books/${book.id}`} className="block mb-1">
          <h3 className="font-serif text-lg font-bold line-clamp-1 group-hover:text-accent-terracotta transition-colors">
            {book.title}
          </h3>
        </Link>

        <p className="text-sm text-warm-500 mb-4 line-clamp-1">
          {book.author.name}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-semibold text-xl">
            ${book.price.toFixed(2)}
          </span>
          {isAuthenticated ? (
            <button
              onClick={handleAdd}
              disabled={adding}
              className="px-4 py-2 bg-warm-100 hover:bg-warm-200 text-warm-900 text-sm font-medium rounded-full transition-colors active:scale-95 disabled:opacity-50"
            >
              {adding ? '...' : 'Add'}
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-warm-100 hover:bg-warm-200 text-warm-900 text-sm font-medium rounded-full transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
