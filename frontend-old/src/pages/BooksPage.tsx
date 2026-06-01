import { useEffect, useState } from 'react';
import { getBooks, searchBooks } from '../api/books';
import { addToCart } from '../api/cart';
import type { BookDto } from '../types';

export default function BooksPage() {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [addedId, setAddedId] = useState<number | null>(null);

  const loadBooks = async (query = '') => {
    setLoading(true);
    try {
      const res = query
        ? await searchBooks({ titles: query, authors: query })
        : await getBooks();
      setBooks(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadBooks(search.trim());
  };

  const handleAddToCart = async (bookId: number) => {
    await addToCart(bookId, 1);
    setAddedId(bookId);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Каталог книг</h1>
        <form onSubmit={handleSearch} className="search-form">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Пошук за назвою або автором..."
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">Знайти</button>
          {search && (
            <button type="button" className="btn btn-outline" onClick={() => { setSearch(''); loadBooks(); }}>
              Скинути
            </button>
          )}
        </form>
      </div>

      {loading ? (
        <div className="loading">Завантаження...</div>
      ) : books.length === 0 ? (
        <div className="empty">Книги не знайдено</div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <div key={book.id} className="book-card">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="book-cover" />
              ) : (
                <div className="book-cover-placeholder">📖</div>
              )}
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">{book.author}</p>
                {book.description && (
                  <p className="book-description">{book.description}</p>
                )}
                <div className="book-footer">
                  <span className="book-price">{Number(book.price).toFixed(2)} ₴</span>
                  <button
                    className={`btn ${addedId === book.id ? 'btn-success' : 'btn-primary'}`}
                    onClick={() => handleAddToCart(book.id)}
                  >
                    {addedId === book.id ? '✓ Додано' : 'В кошик'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
