import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Books } from './pages/Books';
import { BookDetails } from './pages/BookDetails';
import { Cart } from './pages/Cart';
import { Login } from './pages/Login';
import { Orders } from './pages/Orders';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminBooks } from './pages/admin/AdminBooks';
import { AdminCategories } from './pages/admin/AdminCategories';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-warm-50 text-warm-900 selection:bg-accent-terracotta/20 selection:text-accent-terracotta">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/categories" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />
          <Route path="/login" element={<Login />} />

          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute><AdminLayout /></ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="categories" element={<AdminCategories />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <Routes>
        <Route path="/admin/*" element={null} />
        <Route path="*" element={
          <footer className="bg-warm-900 py-12 text-center text-warm-400">
            <p className="font-serif italic text-lg mb-2">The Bookery</p>
            <p className="text-sm">© 2024 The Bookery. All rights reserved.</p>
          </footer>
        } />
      </Routes>
    </div>
  );
}
