import { useState, useEffect } from 'react';
import { Users, Calendar, Clock, CheckCircle2, Bell, Video } from 'lucide-react';
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

export default function CounsellorQueue() {
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    meetingsApi.getAllRequests()
      .then(setRequests)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setIsLoading(false));
  }, []);

  const pendingCount = requests.filter((r) => r.status === 'pending').length;

  if (isLoading) return <LoadingState fullPage message="Loading request queue..." />;
  if (error) return <ErrorMessage fullPage message={error} />;

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h1 className="section-title">Counsellor Request Queue</h1>
                <p className="text-sm text-gray-500">
                  {requests.length} total · {pendingCount} pending review
                </p>
              </div>
            </div>
            {pendingCount > 0 && (
              <span className="flex items-center gap-1 badge-amber">
                <Bell className="h-3.5 w-3.5" /> {pendingCount} new
              </span>
            )}
          </div>

          {requests.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No requests in queue"
              message="Meeting requests from learners will appear here."
            />
          ) : (
            <div className="space-y-4">
              {/* Pending first */}
              {requests
                .slice()
                .sort((a, b) => {
                  if (a.status === 'pending' && b.status !== 'pending') return -1;
                  if (a.status !== 'pending' && b.status === 'pending') return 1;
                  return 0;
                })
                .map((req) => {
                  const statusInfo = STATUS_STYLES[req.status] ?? STATUS_STYLES.pending;
                  return (
                    <div key={req.id} className={`card ${req.status === 'pending' ? 'border-amber-200 bg-amber-50/30' : ''}`}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-gray-400">Ref: {req.id.slice(0, 8)}</span>
                          <p className="text-sm text-gray-800 font-medium mt-1">{req.summary}</p>
                        </div>
                        <span className={statusInfo.class}>{statusInfo.label}</span>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs text-gray-500 font-medium mb-1">Learner's preferred slots:</p>
                        <div className="flex flex-wrap gap-2">
                          {req.preferred_slots.map((slot, i) => (
                            <span key={i} className="badge-gray">
                              <Calendar className="h-3 w-3" /> {slot.date}
                              <Clock className="h-3 w-3 ml-1" /> {slot.time} ({slot.timezone})
                            </span>
                          ))}
                        </div>
                      </div>

                      {req.confirmed_slot && (
                        <div className="flex items-center gap-2 text-sm text-green-700 mb-3">
                          <CheckCircle2 className="h-4 w-4" />
                          Confirmed: {req.confirmed_slot.date} at {req.confirmed_slot.time}
                        </div>
                      )}

                      <div className="flex items-center gap-2 border-t border-gray-100 pt-3 flex-wrap">
                        {req.status === 'pending' && (
                          <>
                            <button
                              className="btn-primary text-xs py-1.5 px-3"
                              onClick={() => alert(`Confirm request ${req.id} — requires PATCH /api/v1/meetings/requests/${req.id}\nwith confirmed_slot and meet_url from Google Calendar/Meet integration.`)}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> Confirm & Send Meet Link
                            </button>
                            <button
                              className="btn-secondary text-xs py-1.5 px-3"
                              onClick={() => alert(`Propose alternate time — requires PATCH /api/v1/meetings/requests/${req.id}`)}
                            >
                              <Clock className="h-3.5 w-3.5" /> Propose Alternate Time
                            </button>
                          </>
                        )}
                        {req.status === 'confirmed' && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600">
                            <Video className="h-3.5 w-3.5" /> Meet details sent (via backend)
                          </span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto">
                          {new Date(req.created_at).toLocaleDateString('en-IN')}
                        </span>
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
