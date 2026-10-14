import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import { meetingsApi, parseApiError } from '../services/api';
import type { MeetingRequest } from '../types';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import PageWrapper from '../components/PageWrapper';
import MockBanner from '../components/MockBanner';

const STATUS_STYLES: Record<string, { class: string; label: string }> = {
  pending: { class: 'badge-amber', label: 'Pending' },
  confirmed: { class: 'badge-green', label: 'Confirmed' },
  alternate_proposed: { class: 'badge-blue', label: 'Alternate Proposed' },
  cancelled: { class: 'badge-red', label: 'Cancelled' },
};

export default function MyRequests() {
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRequests = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await meetingsApi.getMyRequests();
      setRequests(data);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  if (isLoading) return <LoadingState fullPage message="Loading your meeting requests..." />;
  if (error) return <ErrorMessage fullPage message={error} onRetry={fetchRequests} />;

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="section-title">My Meeting Requests</h1>
              <p className="text-sm text-gray-500 mt-1">{requests.length} request(s)</p>
            </div>
            <Link to="/counsellor-request" className="btn-primary text-sm">
              New Request
            </Link>
          </div>

          {requests.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No meeting requests"
              message="You haven't requested any counsellor meetings yet."
              action={{ label: 'Book a Meeting', onClick: () => window.location.href = '/counsellor-request' }}
            />
          ) : (
            <div className="space-y-4">
              {requests.map((req) => {
                const statusInfo = STATUS_STYLES[req.status] ?? STATUS_STYLES.pending;
                return (
                  <div key={req.id} className="card">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          Ref: {req.id.slice(0, 8)}
                        </span>
                      </div>
                      <span className={statusInfo.class}>{statusInfo.label}</span>
                    </div>

                    <p className="text-sm text-gray-800 font-medium mb-3">{req.summary}</p>

                    {/* Preferred slots */}
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 font-medium mb-1">Preferred slots:</p>
                      <div className="flex flex-wrap gap-2">
                        {req.preferred_slots.map((slot, i) => (
                          <span key={i} className="badge-gray">
                            <Clock className="h-3 w-3" />
                            {slot.date} {slot.time} ({slot.timezone})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Confirmed slot */}
                    {req.confirmed_slot && (
                      <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-green-700">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="font-medium">
                            Confirmed: {req.confirmed_slot.date} at {req.confirmed_slot.time} ({req.confirmed_slot.timezone})
                          </span>
                        </div>
                        <Link
                          to={`/meeting/${req.id}`}
                          className="mt-2 inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium"
                        >
                          View meeting details <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-gray-50 pt-2">
                      <span>Created: {new Date(req.created_at).toLocaleDateString('en-IN')}</span>
                      <span>Updated: {new Date(req.updated_at).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
