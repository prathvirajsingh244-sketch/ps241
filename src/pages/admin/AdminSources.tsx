import { useState, useEffect } from 'react';
import { FileText, ExternalLink, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { adminApi, parseApiError } from '../../services/api';
import type { Source } from '../../types';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import PageWrapper from '../../components/PageWrapper';
import MockBanner from '../../components/MockBanner';

const statusIcon = {
  verified: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
  unverified: <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
  pending: <Clock className="h-3.5 w-3.5 text-gray-400" />,
};

export default function AdminSources() {
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.listSources()
      .then((data: Source[]) => setSources(data))
      .catch((err: unknown) => setError(parseApiError(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState fullPage message="Loading sources..." />;
  if (error) return <ErrorMessage fullPage message={error} />;

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="flex items-center gap-3 mb-6">
          <FileText className="h-5 w-5 text-green-600" />
          <h1 className="section-title">Manage Sources</h1>
        </div>

        {sources.length === 0 ? (
          <EmptyState icon={FileText} title="No sources" message="Source records will appear here once created." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 px-4 font-medium text-gray-500">Title</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Publisher</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Type</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sources.map((src) => (
                  <tr key={src.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 max-w-xs truncate">{src.title}</td>
                    <td className="py-3 px-4 text-gray-600">{src.publisher}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{src.source_type}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1">
                        {statusIcon[src.verification_status]}
                        <span className="text-xs capitalize">{src.verification_status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <a href={src.source_url} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
                        <ExternalLink className="h-4 w-4" />
                      </a>
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
