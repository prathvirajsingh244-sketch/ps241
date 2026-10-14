import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { to: '/careers', label: 'Careers' },
    { to: '/assessment', label: 'Assessment' },
    { to: '/map', label: 'Skill Map' },
    { to: '/videos', label: 'Videos' },
    { to: '/counselling', label: 'AI Counsellor' },
  ];

  const roleLinks: Record<string, { to: string; label: string }[]> = {
    admin: [
      { to: '/admin', label: 'Admin Dashboard' },
    ],
    counsellor: [
      { to: '/counsellor/requests', label: 'Request Queue' },
    ],
    learner: [
      { to: '/my-requests', label: 'My Meetings' },
      { to: '/counsellor-request', label: 'Book Meeting' },
    ],
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-green-700">
          <BookOpen className="h-6 w-6 text-green-600" aria-hidden />
          <span>SkillSaathi</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
                  {user?.display_name?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <span className="max-w-[120px] truncate">{user?.display_name}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="text-xs text-gray-500">Signed in as</p>
                    <p className="truncate text-sm font-semibold text-gray-900">{user?.email}</p>
                    <span className="badge-gray mt-1 capitalize">{user?.role}</span>
                  </div>
                  {user?.role && roleLinks[user.role]?.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                      {l.label}
                    </Link>
                  ))}
                  <Link
                    to="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-secondary text-sm px-4 py-2">Sign In</button>
              <button onClick={() => navigate('/signup')} className="btn-primary text-sm px-4 py-2">Sign Up</button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-50 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 pb-4 lg:hidden">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive ? 'bg-green-50 text-green-700' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-2">
              {isAuthenticated ? (
                <>
                  {user?.role && roleLinks[user.role]?.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">My Profile</Link>
                  <button onClick={() => { setMobileOpen(false); logout(); }} className="btn-danger w-full mt-1">Sign Out</button>
                </>
              ) : (
                <>
                  <button onClick={() => { setMobileOpen(false); navigate('/login'); }} className="btn-secondary w-full">Sign In</button>
                  <button onClick={() => { setMobileOpen(false); navigate('/signup'); }} className="btn-primary w-full">Sign Up</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
