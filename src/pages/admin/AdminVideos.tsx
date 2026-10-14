import { useState, useEffect } from 'react';
import { Video, Eye, EyeOff } from 'lucide-react';
import { videosApi, parseApiError } from '../../services/api';
import type { CareerVideo } from '../../types';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import PageWrapper from '../../components/PageWrapper';
import MockBanner from '../../components/MockBanner';

export default function AdminVideos() {
  const [videos, setVideos] = useState<CareerVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    videosApi.list()
      .then(setVideos)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState fullPage message="Loading videos..." />;
  if (error) return <ErrorMessage fullPage message={error} />;

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="flex items-center gap-3 mb-6">
          <Video className="h-5 w-5 text-red-600" />
          <h1 className="section-title">Manage Videos</h1>
        </div>

        {videos.length === 0 ? (
          <EmptyState icon={Video} title="No videos" message="Career videos will appear here when created." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 px-4 font-medium text-gray-500">Title</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Career</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Provider</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Language</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Reviewed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {videos.map((video) => (
                  <tr key={video.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 max-w-xs truncate">{video.title}</td>
                    <td className="py-3 px-4 text-gray-600 text-xs font-mono">{video.career_id.slice(0, 12)}</td>
                    <td className="py-3 px-4 text-gray-600">{video.provider}</td>
                    <td className="py-3 px-4">
                      <span className="badge-gray">{video.language === 'hi' ? 'हिंदी' : 'English'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={video.status === 'published' ? 'badge-green' : video.status === 'review' ? 'badge-amber' : 'badge-gray'}>
                        {video.status === 'published' ? <><Eye className="h-3 w-3" /> Published</> : <><EyeOff className="h-3 w-3" /> {video.status}</>}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400">
                      {video.reviewed_at ? new Date(video.reviewed_at).toLocaleDateString('en-IN') : '—'}
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
