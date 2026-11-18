import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../lib/AppContext';
import { useAuthStore } from '../store/authStore';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

export function BookDetails() {
  const { id } = useParams<{ id: string }>();
  const { books, addToCart } = useAppContext();
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const book = books.find((b) => b.id.toString() === id);

  if (!book) {
    return (
      <div className="py-24 text-center">
        <h2 className="font-serif text-3xl font-bold mb-4">Book not found</h2>
        <Link to="/books" className="text-accent-indigo hover:underline">Return to catalog</Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCart(book, quantity);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="py-12 bg-white min-h-screen">
      <div className="container mx-auto px-4">

        <Link to="/books" className="inline-flex items-center gap-2 text-warm-500 hover:text-warm-900 mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>

        <div className="flex flex-col md:flex-row gap-12 lg:gap-20">

          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border border-warm-100 bg-warm-100">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-warm-400">No cover</div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="mb-2 flex flex-wrap gap-2">
              {book.categories.map((cat) => (
                <span key={cat.id} className="text-xs font-semibold text-accent-indigo bg-accent-indigo/10 px-3 py-1 rounded-full">
                  {cat.name}
                </span>
              ))}
            </div>

            <h1 className="text-4xl md:text-5xl font-serif font-bold text-warm-900 mb-2">
              {book.title}
            </h1>

            <p className="text-xl text-warm-500 mb-6">
              By <span className="text-warm-800 font-medium">{book.author.name}</span>
            </p>

            <div className="text-3xl font-bold text-warm-900 mb-8">
              ${book.price.toFixed(2)}
            </div>

            {book.description && (
              <div className="prose prose-warm max-w-none mb-10">
                <p className="text-warm-600 leading-relaxed text-lg">{book.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 py-6 border-y border-warm-200 mb-10">
              <div>
                <p className="text-sm text-warm-500">ISBN</p>
                <p className="font-medium text-warm-900">{book.isbn}</p>
              </div>
              {book.publishedYear > 0 && (
                <div>
                  <p className="text-sm text-warm-500">Published</p>
                  <p className="font-medium text-warm-900">{book.publishedYear}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-warm-200 rounded-full bg-warm-50 px-2 flex-shrink-0 h-14">
                <button
                  className="p-3 hover:text-accent-terracotta transition-colors"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >-</button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  className="p-3 hover:text-accent-indigo transition-colors"
                  onClick={() => setQuantity(quantity + 1)}
                >+</button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="flex-1 h-14 bg-warm-900 hover:bg-warm-800 text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <ShoppingCart className="h-5 w-5" />
                {adding ? 'Adding...' : isAuthenticated ? 'Add to Cart' : 'Sign in to buy'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
