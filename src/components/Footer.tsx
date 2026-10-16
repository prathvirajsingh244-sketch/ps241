import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-base font-bold text-green-700">
              <BookOpen className="h-5 w-5" />
              <span>मार्गमित्र (MaargMitra)</span>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Vocational career guidance for students and families.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Explore</h3>
            <ul className="mt-3 space-y-2">
              {[
                { to: '/careers', label: 'Career Directory' },
                { to: '/assessment', label: 'Career Assessment' },
                { to: '/map', label: 'Skill & Job Map' },
                { to: '/videos', label: 'Career Videos' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Support</h3>
            <ul className="mt-3 space-y-2">
              {[
                { to: '/counselling', label: 'AI Counsellor' },
                { to: '/counsellor-request', label: 'Book a Meeting' },
                { to: '/my-requests', label: 'My Requests' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Notice */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Notice</h3>
            <p className="mt-3 text-xs text-gray-500 leading-relaxed">
              मार्गमित्र (MaargMitra) provides guidance based on verified sources. It does not guarantee employment, salary, placement, safety or career outcomes. Consult a qualified counsellor for personal decisions.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          <p>© 2026 मार्गमित्र (MaargMitra). Sample data clearly labelled. Sources: NSDC, DGET, Government of India portals.</p>
        </div>
      </div>
    </footer>
  );
}
