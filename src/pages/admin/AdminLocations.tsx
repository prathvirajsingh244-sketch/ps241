import { useState, useEffect } from 'react';
import { MapPin, CheckCircle2, XCircle } from 'lucide-react';
import { mapApi, parseApiError } from '../../services/api';
import type { SkillLocation } from '../../types';
import LoadingState from '../../components/LoadingState';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import PageWrapper from '../../components/PageWrapper';
import MockBanner from '../../components/MockBanner';

export default function AdminLocations() {
  const [locations, setLocations] = useState<SkillLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    mapApi.getSkillCentres()
      .then(setLocations)
      .catch((err) => setError(parseApiError(err)))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingState fullPage message="Loading locations..." />;
  if (error) return <ErrorMessage fullPage message={error} />;

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-amber-600" />
            <h1 className="section-title">Manage Locations</h1>
          </div>
          <button
            className="btn-primary text-sm"
            onClick={() => alert('Location creation requires backend POST /api/v1/admin/locations — not yet integrated')}
          >
            Add Location
          </button>
        </div>

        {locations.length === 0 ? (
          <EmptyState icon={MapPin} title="No locations" message="Add skill centre locations." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="py-3 px-4 font-medium text-gray-500">Name</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Type</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Address</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Coordinates</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="py-3 px-4 font-medium text-gray-500">Last Checked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900">{loc.name}</td>
                    <td className="py-3 px-4 text-gray-600">{loc.location_type}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs max-w-xs truncate">{loc.address}</td>
                    <td className="py-3 px-4 text-xs text-gray-400 font-mono">{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</td>
                    <td className="py-3 px-4">
                      {loc.status === 'active' ? (
                        <span className="badge-green"><CheckCircle2 className="h-3 w-3" /> Active</span>
                      ) : (
                        <span className="badge-red"><XCircle className="h-3 w-3" /> Inactive</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-400">
                      {loc.last_verified_at ? new Date(loc.last_verified_at).toLocaleDateString('en-IN') : '—'}
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
