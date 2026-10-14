import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Eye, EyeOff } from 'lucide-react';
import { careersApi, parseApiError } from '../../services/api';
import type { CareerListItem } from '../../types';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import PageWrapper from '../../components/PageWrapper';
import MockBanner from '../../components/MockBanner';

export default function AdminCareers() {
  const [careers, setCareers] = useState<CareerListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    careersApi.list({ page_size: 100 })
      .then((res) => setCareers(res.items))
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState fullPage message="Loading careers..." />;
  if (error) return <ErrorMessage fullPage message={error} />;

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-green-600" />
            <h1 className="section-title">Manage Careers</h1>
          </div>
          <button
            className="btn-primary text-sm"
            onClick={() => alert('Career creation requires backend POST /api/v1/careers endpoint — not yet integrated')}
          >
            <Plus className="h-4 w-4" /> Add Career
          </button>
        </div>

        {careers.length === 0 ? (
          <EmptyState icon={BookOpen} title="No career profiles" message="Create your first career profile." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 px-4 font-medium text-gray-500">Title</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Category</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {careers.map((career) => (
                  <tr key={career.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{career.title}</td>
                    <td className="py-3 px-4 text-gray-600">{career.category}</td>
                    <td className="py-3 px-4">
                      <span className={career.status === 'published' ? 'badge-green' : 'badge-amber'}>
                        {career.status === 'published' ? <><Eye className="h-3 w-3" /> Published</> : <><EyeOff className="h-3 w-3" /> Draft</>}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="btn-ghost text-xs py-1 px-2"
                        onClick={() => alert(`Edit career ${career.id} — requires PATCH /api/v1/careers/${career.id}`)}
                      >
                        <Edit className="h-3.5 w-3.5" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </PageWrapper>
    </>
  );
}
