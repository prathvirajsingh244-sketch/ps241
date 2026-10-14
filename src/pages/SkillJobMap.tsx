import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { mapApi, parseApiError } from '../services/api';
import type { SkillLocation } from '../types';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import PageWrapper from '../components/PageWrapper';
import MockBanner from '../components/MockBanner';

// Fix default marker icon for webpack/vite
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const INDIA_CENTER: [number, number] = [22.5, 78.5];
const LOCATION_TYPES = ['All Types', 'ITI', 'Skill Centre', 'PMKVY Centre'];

export default function SkillJobMap() {
  const [locations, setLocations] = useState<SkillLocation[]>([]);
  const [filtered, setFiltered] = useState<SkillLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [selected, setSelected] = useState<SkillLocation | null>(null);

  const fetchLocations = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await mapApi.getSkillCentres();
      setLocations(data);
      setFiltered(data);
    } catch (err) {
      setError(parseApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLocations(); }, []);

  useEffect(() => {
    if (typeFilter === 'All Types') {
      setFiltered(locations);
    } else {
      setFiltered(locations.filter((l) => l.location_type === typeFilter));
    }
  }, [typeFilter, locations]);

  if (isLoading) return <LoadingState fullPage message="Loading map data..." />;
  if (error) return <ErrorMessage fullPage message={error} onRetry={fetchLocations} />;

  return (
    <>
      <MockBanner />
      <PageWrapper>
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
              <MapPin className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <h1 className="section-title">Skill & Job Map</h1>
              <p className="text-sm text-gray-500">
                {filtered.length} verified skill training centres shown · SAMPLE DATA
              </p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          {LOCATION_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                typeFilter === t
                  ? 'bg-green-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Map */}
          <div className="lg:col-span-2">
            {filtered.length === 0 ? (
              <EmptyState title="No locations found" message="Try a different filter." />
            ) : (
              <div className="h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                <MapContainer
                  center={INDIA_CENTER}
                  zoom={5}
                  scrollWheelZoom
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {filtered.map((loc) => (
                    <Marker
                      key={loc.id}
                      position={[loc.latitude, loc.longitude]}
                      icon={defaultIcon}
                      eventHandlers={{ click: () => setSelected(loc) }}
                    >
                      <Popup>
                        <div className="max-w-xs">
                          <p className="font-semibold text-sm">{loc.name}</p>
                          <p className="text-xs text-gray-500">{loc.location_type}</p>
                          <p className="text-xs text-gray-500 mt-1">{loc.address}</p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            )}
          </div>

          {/* Location list & detail */}
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Locations ({filtered.length})
            </h2>
            {filtered.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelected(loc)}
                className={`w-full text-left card !p-4 transition-all ${
                  selected?.id === loc.id ? 'border-green-500 ring-2 ring-green-100' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Navigation className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{loc.name}</p>
                    <p className="text-xs text-gray-500">{loc.location_type} · {loc.address}</p>
                    {loc.last_verified_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Last checked: {new Date(loc.last_verified_at).toLocaleDateString('en-IN')}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {selected && (
              <div className="card !p-4 border-green-200 bg-green-50/50">
                <h3 className="font-semibold text-gray-900 mb-1">{selected.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{selected.description}</p>
                <p className="text-xs text-gray-500 mb-1">📍 {selected.address}</p>
                <p className="text-xs text-gray-500 mb-1">📌 {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}</p>
                <p className="text-xs text-gray-400 mb-2">Type: {selected.location_type} · Status: {selected.status}</p>
                <a
                  href={`https://www.google.com/maps?q=${selected.latitude},${selected.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-700"
                >
                  Open in Google Maps <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-400 text-center">
          Map data: OpenStreetMap · Location data: SAMPLE — coordinates are representative areas, not verified addresses.
        </div>
      </PageWrapper>
    </>
  );
}
