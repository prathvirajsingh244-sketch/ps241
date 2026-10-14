import { useState, useEffect } from 'react';
import { Users, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { meetingsApi, parseApiError } from '../../services/api';
import type { MeetingRequest } from '../../types';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import PageWrapper from '../../components/PageWrapper';
import MockBanner from '../../components/MockBanner';

const STATUS_STYLES: Record<string, { class: string; label: string }> = {
  pending: { class: 'badge-amber', label: 'Pending' },
  confirmed: { class: 'badge-green', label: 'Confirmed' },
  alternate_proposed: { class: 'badge-blue', label: 'Alternate Proposed' },
  cancelled: { class: 'badge-red', label: 'Cancelled' },
};

export default function AdminRequests() {
  const [requests, setRequests] = useState<MeetingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    meetingsApi.getAllRequests()
      .then(setRequests)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState fullPage message="Loading requests..." />;
  if (error) return <ErrorMessage fullPage message={error} />;

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="flex items-center gap-3 mb-6">
          <Users className="h-5 w-5 text-purple-600" />
          <h1 className="section-title">Meeting Requests (Admin)</h1>
        </div>

        {requests.length === 0 ? (
          <EmptyState icon={Users} title="No meeting requests" message="Requests will appear here when submitted by users." />
        ) : (
          <div className="space-y-4">
            {requests.map((req) => {
              const statusInfo = STATUS_STYLES[req.status] ?? STATUS_STYLES.pending;
              return (
                <div key={req.id} className="card">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-xs text-gray-400 font-mono">Ref: {req.id}</span>
                      <p className="text-sm text-gray-800 font-medium mt-1">{req.summary}</p>
                    </div>
                    <span className={statusInfo.class}>{statusInfo.label}</span>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-500 font-medium mb-1">Preferred slots:</p>
                    <div className="flex flex-wrap gap-2">
                      {req.preferred_slots.map((slot, i) => (
                        <span key={i} className="badge-gray">
                          <Calendar className="h-3 w-3" /> {slot.date} <Clock className="h-3 w-3" /> {slot.time}
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

                  <div className="flex items-center gap-2 border-t border-gray-50 pt-3">
                    <button
                      className="btn-primary text-xs py-1.5 px-3"
                      onClick={() => alert(`Confirm/update request ${req.id} — requires PATCH /api/v1/meetings/requests/${req.id}`)}
                    >
                      Confirm / Update
                    </button>
                    <span className="text-xs text-gray-400">
                      Consent: {req.consent ? '✓ Given' : '✗ Not given'} · Created: {new Date(req.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PageWrapper>
    </>
  );
}
