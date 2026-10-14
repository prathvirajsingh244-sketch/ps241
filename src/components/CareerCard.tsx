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
    <Link
      to={`/careers/${career.id}`}
      className="card group flex flex-col gap-3 hover:border-green-200 hover:shadow-md transition-all duration-200 animate-fade-up"
      aria-label={`View career: ${career.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-50">
          <GraduationCap className="h-5 w-5 text-green-600" />
        </div>
        <span className={badgeClass}>{career.category}</span>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 group-hover:text-green-700 transition-colors line-clamp-2">
          {career.title}
        </h2>
        <p className="mt-1 text-sm text-gray-500 line-clamp-3">{career.overview}</p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
        <p className="text-xs text-gray-400 line-clamp-1">
          <span className="font-medium text-gray-600">Eligibility: </span>
          {career.eligibility.split('.')[0]}
        </p>
        <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all flex-shrink-0" />
      </div>
    </Link>
  );
}
