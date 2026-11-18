import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogIn, LogOut, Hexagon, ClipboardList } from 'lucide-react';
import { useAppContext } from '../lib/AppContext';
import { useAuthStore } from '../store/authStore';

export function Navbar() {
  const { cart } = useAppContext();
  const { isAuthenticated, email, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-warm-200 bg-warm-50/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-warm-900 group">
          <Hexagon className="h-6 w-6 text-accent-terracotta group-hover:rotate-12 transition-transform" />
          <span className="font-serif font-bold text-xl tracking-tight">The Bookery</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link to="/" className="hover:text-accent-terracotta transition-colors">Home</Link>
          <Link to="/books" className="hover:text-accent-terracotta transition-colors">Catalog</Link>
          {isAuthenticated && (
            <Link to="/orders" className="hover:text-accent-terracotta transition-colors">My Orders</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link to="/cart" className="p-2 hover:bg-warm-100 rounded-full transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-accent-terracotta text-[10px] font-bold text-white flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
          )}

          <div className="h-4 w-px bg-warm-200 hidden sm:block"></div>

          {isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs text-warm-500 max-w-[120px] truncate">{email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-warm-600 hover:text-red-500 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="hidden sm:flex items-center gap-2 text-sm font-medium hover:text-accent-indigo transition-colors">
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <div className="h-4 w-px bg-warm-200 hidden sm:block"></div>
              <Link to="/admin" className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-accent-terracotta hover:text-[#a3360a] transition-colors">
                <ClipboardList className="h-4 w-4" />
                <span>Admin</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
