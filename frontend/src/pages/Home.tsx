import { Link } from 'react-router-dom';
import { useAppContext } from '../lib/AppContext';
import { useAuthStore } from '../store/authStore';
import { BookCard } from '../components/BookCard';

export function Home() {
  const { books, categories, booksLoading } = useAppContext();
  const { isAuthenticated } = useAuthStore();
  const featuredBooks = books.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-warm-900 text-warm-50 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2228&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h1 className="font-serif text-5xl sm:text-7xl font-bold mb-6 leading-tight">
            Discover Your Next Great Adventure
          </h1>
          <p className="text-lg sm:text-xl text-warm-200 mb-10 max-w-2xl mx-auto">
            Explore carefully curated collections of literature, from timeless classics to modern science fiction.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/books"
              className="w-full sm:w-auto px-8 py-4 bg-accent-terracotta hover:bg-[#a3360a] text-white font-medium rounded-full transition-colors text-lg"
            >
              Shop Catalog
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-full backdrop-blur-sm transition-colors text-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-20 bg-warm-50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-serif font-bold mb-2">Featured Releases</h2>
              <p className="text-warm-500">Handpicked selections from our catalog.</p>
            </div>
            <Link to="/books" className="hidden sm:inline-flex items-center text-accent-indigo font-medium hover:underline">
              View all
            </Link>
          </div>

          {booksLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-warm-200 h-80 animate-pulse" />
              ))}
            </div>
          ) : featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-warm-400">
              {isAuthenticated ? 'No books in catalog yet.' : (
                <p>
                  <Link to="/login" className="text-accent-indigo hover:underline">Sign in</Link> to browse the catalog.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="py-20 bg-warm-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold mb-2">Shop by Category</h2>
              <p className="text-warm-500">Find exactly what you're looking for.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/books?category=${category.id}`}
                  className="group p-8 bg-white rounded-3xl border border-warm-200 hover:border-accent-terracotta/50 shadow-sm hover:shadow-lg transition-all text-center"
                >
                  <h3 className="font-serif text-xl font-bold mb-3 group-hover:text-accent-terracotta transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-warm-500 text-sm line-clamp-2">{category.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
