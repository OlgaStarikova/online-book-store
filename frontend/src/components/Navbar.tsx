import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { isAuthenticated, email, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/books" className="navbar-brand">
        📚 BookStore
      </Link>
      {isAuthenticated && (
        <div className="navbar-links">
          <Link to="/books">Каталог</Link>
          <Link to="/cart">Кошик</Link>
          <Link to="/orders">Замовлення</Link>
          {isAdmin && (
            <Link to="/admin/books" className="navbar-admin">
              ⚙ Адмін
            </Link>
          )}
          <span className="navbar-email">{email}</span>
          <button onClick={handleLogout} className="btn btn-outline">
            Вийти
          </button>
        </div>
      )}
    </nav>
  );
}
