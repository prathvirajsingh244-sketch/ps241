import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, Play, ExternalLink, Filter } from 'lucide-react';
import { videosApi, parseApiError } from '../services/api';
import type { CareerVideo } from '../types';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import PageWrapper from '../components/PageWrapper';
import MockBanner from '../components/MockBanner';

export default function CareerVideos() {
  const [videos, setVideos] = useState<CareerVideo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [langFilter, setLangFilter] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    videosApi.list(langFilter !== 'all' ? { language: langFilter } : undefined)
      .then(setVideos)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setIsLoading(false));
  }, [langFilter]);

  if (isLoading) return <LoadingState fullPage message="Loading career videos..." />;
  if (error) return <ErrorMessage fullPage message={error} onRetry={() => window.location.reload()} />;

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
              <Video className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h1 className="section-title">Career Videos</h1>
              <p className="text-sm text-gray-500">
                {videos.length} curated career introduction videos · SAMPLE DATA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              id="video-lang-filter"
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value)}
              className="form-input !w-auto !py-1.5 text-sm"
              aria-label="Filter by language"
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
        </div>

        {videos.length === 0 ? (
          <EmptyState
            icon={Video}
            title="No videos available"
            message="Career videos will appear here once published by the content team."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {videos.map((video) => (
              <div key={video.id} className="card overflow-hidden !p-0">
                {/* Video embed / thumbnail */}
                <div className="relative aspect-video bg-gray-900">
                  {playingId === video.id && video.video_url ? (
                    <iframe
                      src={video.video_url}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <button
                      onClick={() => setPlayingId(video.id)}
                      className="absolute inset-0 flex items-center justify-center group"
                      aria-label={`Play video: ${video.title}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg group-hover:bg-white group-hover:scale-110 transition-all">
                        <Play className="h-7 w-7 text-green-700 ml-1" />
                      </div>
                      <div className="absolute bottom-3 left-4 right-4">
                        <p className="text-white text-sm font-medium truncate">{video.title}</p>
                      </div>
                    </button>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h2 className="font-semibold text-gray-900 line-clamp-1">{video.title}</h2>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="badge-blue">{video.provider}</span>
                    <span className="badge-gray">{video.language === 'hi' ? 'हिंदी' : 'English'}</span>
                    <span className={video.status === 'published' ? 'badge-green' : 'badge-amber'}>
                      {video.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <Link
                      to={`/careers/${video.career_id}`}
                      className="text-xs text-green-600 hover:text-green-700 font-medium"
                    >
                      View Career Profile →
                    </Link>
                    {video.video_url && (
                      <a
                        href={video.video_url.replace('/embed/', '/watch?v=')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Open original <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video creation link */}
        <div className="mt-10 card text-center">
          <Video className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900">Create Career Videos</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            The video creation workflow (scripting and publishing) is managed through the admin panel
            and requires backend video job support.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Backend endpoint: <code className="font-mono">POST /api/v1/videos/jobs</code> — not yet integrated
          </p>
        </div>
      </PageWrapper>
    </>
  );
}
