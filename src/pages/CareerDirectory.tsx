import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { careersApi, parseApiError } from '../services/api';
import type { CareerListItem } from '../types';
import CareerCard from '../components/CareerCard';
import { SkeletonCard } from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import PageWrapper from '../components/PageWrapper';
import MockBanner from '../components/MockBanner';

const CATEGORIES = [
  'All Categories',
  'Engineering & Technology',
  'Health & Wellness',
  'Construction & Infrastructure',
  'Renewable Energy',
  'Manufacturing & Engineering',
];

export default function CareerDirectory() {
  const [careers, setCareers] = useState<CareerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [total, setTotal] = useState(0);

  const fetchCareers = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await careersApi.list({
        search: search || undefined,
        category: category === 'All Categories' ? undefined : category,
      });
      setCareers(res.items);
      setTotal(res.total);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [search, category]);

  useEffect(() => {
    const timer = setTimeout(fetchCareers, 300);
    return () => clearTimeout(timer);
  }, [fetchCareers]);

  return (
    <>
      <MockBanner />
      <PageWrapper>
        {/* Header */}
        <div className="mb-8">
          <h1 className="section-title">Career Directory</h1>
          <p className="mt-2 text-gray-500">
            Browse {total} verified vocational career profiles — source-backed, eligibility-matched.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              id="career-search"
              type="search"
              placeholder="Search careers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-10"
              aria-label="Search career directory"
            />
            {search && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setSearch('')}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="relative sm:w-56">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              id="career-category-filter"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input pl-10"
              aria-label="Filter by category"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Results */}
        {error ? (
          <ErrorMessage message={error} onRetry={fetchCareers} />
        ) : isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : careers.length === 0 ? (
          <EmptyState
            title="No careers found"
            message={search || category !== 'All Categories' ? 'Try adjusting your search or filter.' : 'No career profiles available yet.'}
            action={search || category !== 'All Categories' ? { label: 'Clear Filters', onClick: () => { setSearch(''); setCategory('All Categories'); } } : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {careers.map((c) => <CareerCard key={c.id} career={c} />)}
          </div>
        )}
      </PageWrapper>
    </>
  );
}
