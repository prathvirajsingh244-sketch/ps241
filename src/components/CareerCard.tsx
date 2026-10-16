import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap } from 'lucide-react';
import type { CareerListItem } from '../types';

const categoryColors: Record<string, string> = {
  'Engineering & Technology': 'badge-blue',
  'Health & Wellness': 'badge-green',
  'Construction & Infrastructure': 'badge-amber',
  'Renewable Energy': 'badge-green',
  'Manufacturing & Engineering': 'badge-blue',
};

interface CareerCardProps {
  career: CareerListItem;
}

export default function CareerCard({ career }: CareerCardProps) {
  const badgeClass = categoryColors[career.category] ?? 'badge-gray';
  return (
    <div className="perspective-1000 group">
      <Link
        to={`/careers/${career.id}`}
        className="relative flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm
                   transition-all duration-300 ease-out
                   hover:-translate-y-2 hover:rotate-1 hover:shadow-xl hover:border-green-300
                   hover:bg-gradient-to-b hover:from-white hover:to-green-50/30"
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 0.25s ease-out, box-shadow 0.25s ease-out, border-color 0.25s ease-out'
        }}
        aria-label={`View career: ${career.title}`}
      >
        {/* 3D Sheen Highlight */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-2">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 text-green-700 shadow-inner group-hover:scale-110 transition-transform">
            <GraduationCap className="h-6 w-6 text-green-600" />
          </div>
          <span className={badgeClass}>{career.category}</span>
        </div>

        <div>
          <h2 className="text-base font-bold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
            {career.title}
          </h2>
          <p className="mt-1.5 text-xs text-gray-500 line-clamp-3 leading-relaxed">{career.overview}</p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-3">
          <p className="text-[11px] text-gray-400 line-clamp-1">
            <span className="font-semibold text-gray-600">Route: </span>
            {career.eligibility.split('.')[0]}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 group-hover:translate-x-1 transition-transform">
            View 3D Pathway <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>
    </div>
  );
}
