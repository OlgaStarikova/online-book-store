import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookCard } from '../components/BookCard';
import { Search, Filter } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

export function Books() {
  const { books, categories, booksLoading } = useAppContext();
  const { isAuthenticated } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const categoryFilter = searchParams.get('category');

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter
        ? book.categories.some((c) => c.id.toString() === categoryFilter)
        : true;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, categoryFilter]);

  const setCategory = (categoryId: string | null) => {
    if (categoryId) {
      searchParams.set('category', categoryId);
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  };

  if (!isAuthenticated) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl font-bold mb-4">Sign in to browse books</h2>
        <p className="text-warm-500 mb-8">Create an account or sign in to access the full catalog.</p>
        <Link to="/login" className="px-8 py-3 bg-warm-900 hover:bg-warm-800 text-white font-medium rounded-full transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4">

        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-serif font-bold mb-4">Complete Catalog</h1>
          <p className="text-warm-500 max-w-2xl">Browse our entire collection of books. Use the filters to find specific titles, authors, or genres.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-2xl border border-warm-200 sticky top-24">

              <div className="mb-8">
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </h3>
                <input
                  type="text"
                  placeholder="Title or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 bg-warm-50 border border-warm-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-indigo/50"
                />
              </div>

              <div>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Categories
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setCategory(null)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!categoryFilter ? 'bg-warm-100 font-medium' : 'hover:bg-warm-50 text-warm-500'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setCategory(category.id.toString())}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${categoryFilter === category.id.toString() ? 'bg-warm-100 font-medium text-accent-indigo' : 'hover:bg-warm-50 text-warm-500'}`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1">
            {booksLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-warm-200 h-80 animate-pulse" />
                ))}
              </div>
            ) : filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-warm-200">
                <h3 className="text-xl font-bold mb-2">No books found</h3>
                <p className="text-warm-500">Try adjusting your search criteria or removing filters.</p>
                <button
                  onClick={() => { setSearchQuery(''); setCategory(null); }}
                  className="mt-6 px-6 py-2 bg-warm-100 hover:bg-warm-200 rounded-full font-medium transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
