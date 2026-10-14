import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Video, ExternalLink, ArrowLeft, AlertTriangle } from 'lucide-react';
import { meetingsApi, parseApiError } from '../services/api';
import type { Meeting } from '../types';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import PageWrapper from '../components/PageWrapper';

export default function MeetingDetail() {
  const { id } = useParams<{ id: string }>();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    meetingsApi.getMeeting(id)
      .then(setMeeting)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) return <LoadingState fullPage message="Loading meeting details..." />;
  if (error) return <ErrorMessage fullPage message={error} />;
  if (!meeting) return null;

  const startDate = new Date(meeting.start_at);

  return (
    <PageWrapper>
      <div className="max-w-lg mx-auto">
        <Link to="/my-requests" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to My Requests
        </Link>

        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
              <Video className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Meeting Details</h1>
              <span className={meeting.status === 'scheduled' ? 'badge-green' : meeting.status === 'completed' ? 'badge-gray' : 'badge-red'}>
                {meeting.status}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {startDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-xs text-gray-500">Date</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {startDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} ({meeting.timezone})
                </p>
                <p className="text-xs text-gray-500">Time & timezone</p>
              </div>
            </div>

            {/* Google Meet link */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="text-sm font-medium text-gray-900 mb-2">Google Meet</p>
              {meeting.meet_url ? (
                <a
                  href={meeting.meet_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  <Video className="h-4 w-4" /> Join Meeting <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-amber-700">
                    Google Meet link not yet available. The counsellor will share the link once the meeting is confirmed
                    via the backend integration.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400">
            Meeting ID: {meeting.id} · Request: {meeting.request_id}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
