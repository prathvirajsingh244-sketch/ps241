import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinks = [
    { to: '/careers', label: 'Careers' },
    { to: '/assessment', label: 'Career Assessment' },
    { to: '/map', label: 'Skill & Job Map' },
    { to: '/videos', label: 'Career Videos' },
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
      { to: '/dashboard', label: 'Student Dashboard' },
      { to: '/roadmap', label: 'My Roadmap' },
      { to: '/assessment', label: 'Assessment' },
      { to: '/my-requests', label: 'My Meetings' },
      { to: '/counsellor-request', label: 'Book Meeting' },
    ],
    parent: [
      { to: '/parent', label: 'Parent Dashboard' },
      { to: '/parent/expectations', label: 'My Expectations' },
      { to: '/parent/comparison', label: 'AI Comparison Report' },
      { to: '/counsellor-request', label: 'Book Counsellor' },
    ],
  };

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl shadow-xl text-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8" aria-label="Main navigation">
        {/* Logo — Always navigates to main landing page */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src="/logo.jpeg"
            alt="MaargMitra logo"
            className="h-10 w-10 rounded-xl object-cover border border-white/10 bg-slate-900 shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col leading-none">
            <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
              मार्गमित्र <span className="text-amber-400 font-extrabold text-xs tracking-wider">MaargMitra</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">AI Vocational & Career Guidance</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-rose-500/25 to-amber-500/25 text-amber-300 border border-amber-400/40 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                id="user-menu-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-900/90 px-3.5 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 hover:border-slate-600 transition-colors shadow-sm"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-500 text-slate-950 text-xs font-black shadow-sm">
                  {user?.display_name?.charAt(0).toUpperCase() ?? 'U'}
                </div>
                <span className="max-w-[130px] truncate text-slate-200 font-semibold">{user?.display_name}</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-800 bg-slate-900/98 p-1.5 shadow-2xl backdrop-blur-xl text-slate-200 animate-fade-up">
                  <div className="border-b border-slate-800 px-3.5 py-2.5">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                    <p className="truncate text-sm font-bold text-white">{user?.email}</p>
                    <span className="inline-block mt-1 rounded-md bg-amber-400/20 text-amber-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                      {user?.role}
                    </span>
                  </div>
                  <div className="py-1">
                    {user?.role && roleLinks[user.role]?.map((l) => (
                      <Link
                        key={l.to}
                        to={l.to}
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-amber-300 transition-colors"
                      >
                        <Settings className="h-4 w-4 text-slate-400" />
                        {l.label}
                      </Link>
                    ))}
                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      My Profile
                    </Link>
                  </div>
                  <div className="border-t border-slate-800 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => navigate('/login')}
                className="rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="rounded-xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 px-4 py-2 text-sm font-bold text-white shadow-md hover:opacity-95 hover:shadow-rose-500/30 active:scale-95 transition-all"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="rounded-xl p-2 text-slate-300 hover:bg-slate-800 hover:text-white lg:hidden transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-800 bg-slate-950/98 px-4 pb-6 pt-3 lg:hidden shadow-2xl">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-rose-500/20 text-amber-300 border border-amber-400/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-800 pt-3">
              {isAuthenticated ? (
                <>
                  {user?.role && roleLinks[user.role]?.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Link
                    to="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="rounded-xl bg-rose-600/20 border border-rose-500/40 text-rose-300 py-2.5 text-sm font-bold w-full mt-1"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => { setMobileOpen(false); navigate('/login'); }}
                    className="rounded-xl border border-slate-700 bg-slate-900 py-2.5 text-sm font-semibold text-slate-200 w-full"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => { setMobileOpen(false); navigate('/signup'); }}
                    className="rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 py-2.5 text-sm font-bold text-white shadow-md w-full"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
