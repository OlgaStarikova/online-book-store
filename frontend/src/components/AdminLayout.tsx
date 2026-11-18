import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Tags, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/admin/books', icon: BookOpen, label: 'Manage Books' },
    { to: '/admin/categories', icon: Tags, label: 'Categories' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-warm-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-warm-900 text-warm-50 flex-shrink-0 flex flex-col pt-8 z-20">
        <div className="px-6 mb-8">
          <Link to="/" className="text-2xl font-serif font-bold text-white hover:text-accent-terracotta transition-colors block mb-2">
            The Bookery
          </Link>
          <div className="text-xs font-semibold text-accent-terracotta uppercase tracking-wider">
            Admin Workspace
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {links.map((link) => {
            const isActive = link.exact
              ? location.pathname === link.to
              : location.pathname.startsWith(link.to);
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-accent-terracotta text-white font-medium shadow-md'
                    : 'text-warm-300 hover:bg-warm-800 hover:text-white'
                }`}
              >
                <Icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-warm-800 mt-auto space-y-2">
          <Link to="/" className="flex items-center gap-3 text-warm-400 hover:text-white transition-colors group">
            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform rotate-180" />
            <span className="font-medium">Exit Admin</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-warm-400 hover:text-red-400 transition-colors w-full"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
