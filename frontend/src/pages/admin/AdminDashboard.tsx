import { useAppContext } from '../../lib/AppContext';
import { BookOpen, Tags } from 'lucide-react';

export function AdminDashboard() {
  const { books, categories } = useAppContext();

  const stats = [
    { label: 'Total Books', value: books.length, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Categories', value: categories.length, icon: Tags, color: 'text-purple-600', bg: 'bg-purple-100' },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <h1 className="text-3xl font-serif font-bold text-warm-900 mb-2">Dashboard Overview</h1>
      <p className="text-warm-500 mb-8">Welcome back, Administrator.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 border border-warm-200 shadow-sm flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-warm-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-warm-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-warm-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-warm-200">
          <h2 className="text-lg font-bold">Recent Books</h2>
        </div>
        <div className="divide-y divide-warm-100">
          {books.slice(0, 5).map((book) => (
            <div key={book.id} className="px-6 py-4 flex items-center gap-4">
              {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-8 h-11 object-cover rounded shadow-sm bg-warm-100 flex-shrink-0" />
              ) : (
                <div className="w-8 h-11 bg-warm-100 rounded flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-warm-900 truncate">{book.title}</p>
                <p className="text-sm text-warm-500">{book.author.name}</p>
              </div>
              <span className="font-semibold text-warm-900">${book.price.toFixed(2)}</span>
            </div>
          ))}
          {books.length === 0 && (
            <div className="px-6 py-12 text-center text-warm-400">No books yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
