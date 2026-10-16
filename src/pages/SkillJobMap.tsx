import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Crosshair,
  Loader2,
  Compass,
  Search
} from 'lucide-react';
import PageWrapper from '../components/PageWrapper';

function RecenterMap({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 12, { animate: true });
  }, [center, map]);
  return null;
}

const itiIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: '',
});

const userGpsIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [28, 45],
  iconAnchor: [14, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: '',
});

interface TrainingCentre {
  id: string;
  name: string;
  city: string;
  location_type: 'Government ITI' | 'PMKVY Centre' | 'National Skill Training Institute';
  address: string;
  trades_offered: string[];
  total_seats: number;
  latitude: number;
  longitude: number;
  contact_phone: string;
  verified: boolean;
  distanceKm?: number;
}

const CITIES: Record<string, [number, number]> = {
  'Delhi NCR': [28.6139, 77.2090],
  'Jaipur': [26.9124, 75.7873],
  'Mumbai': [19.0760, 72.8777],
  'Lucknow': [26.8467, 80.9462],
  'Bangalore': [12.9716, 77.5946],
  'Pune': [18.5204, 73.8567],
  'Patna': [25.5941, 85.1376],
};

const ALL_CENTRES: TrainingCentre[] = [
  // Delhi NCR
  {
    id: 'iti-delhi-1',
    name: 'Govt. Industrial Training Institute Pusa',
    city: 'Delhi NCR',
    location_type: 'Government ITI',
    address: 'Pusa Campus, Near Karol Bagh, New Delhi',
    trades_offered: ['Electrician (2 Yrs)', 'Fitter (2 Yrs)', 'Solar PV Installer', 'COPA (Computer Operator)'],
    total_seats: 480,
    latitude: 28.6380,
    longitude: 77.1680,
    contact_phone: '011-25841234',
    verified: true,
  },
  {
    id: 'iti-delhi-2',
    name: 'Govt. ITI Arab Ki Sarai Nizamuddin',
    city: 'Delhi NCR',
    location_type: 'Government ITI',
    address: 'Near Humayun Tomb, Nizamuddin East, New Delhi',
    trades_offered: ['Electrician', 'Automotive Mechanic (MMV)', 'Welder', 'Electronics Tech'],
    total_seats: 360,
    latitude: 28.5910,
    longitude: 77.2480,
    contact_phone: '011-24357890',
    verified: true,
  },
  {
    id: 'pmkvy-delhi-1',
    name: 'Pradhan Mantri Kaushal Kendra (PMKK) Central Delhi',
    city: 'Delhi NCR',
    location_type: 'PMKVY Centre',
    address: 'Barakhamba Road, Connaught Place Zone, New Delhi',
    trades_offered: ['Suryamitra Solar Technician', 'Healthcare Assistant (GDA)', 'IoT Hardware Specialist'],
    total_seats: 250,
    latitude: 28.6290,
    longitude: 77.2250,
    contact_phone: '1800-123-9626',
    verified: true,
  },

  // Jaipur
  {
    id: 'iti-jaipur-1',
    name: 'Govt. Industrial Training Institute Jaipur',
    city: 'Jaipur',
    location_type: 'Government ITI',
    address: 'Near SMS Hospital, Jawahar Lal Nehru Marg, Jaipur, Rajasthan',
    trades_offered: ['Electrician', 'Fitter', 'Solar Technician', 'Welder'],
    total_seats: 420,
    latitude: 26.9050,
    longitude: 75.8120,
    contact_phone: '0141-2567890',
    verified: true,
  },
  {
    id: 'iti-jaipur-2',
    name: 'Govt. ITI Sanganer',
    city: 'Jaipur',
    location_type: 'Government ITI',
    address: 'Industrial Area, Sanganer, Jaipur',
    trades_offered: ['Textile & Garment Design', 'COPA', 'Electrician', 'Machinist'],
    total_seats: 300,
    latitude: 26.8210,
    longitude: 75.7680,
    contact_phone: '0141-2731234',
    verified: true,
  },

  // Mumbai
  {
    id: 'iti-mumbai-1',
    name: 'Govt. ITI Mumbai Sion',
    city: 'Mumbai',
    location_type: 'Government ITI',
    address: 'Sion West, Near Sion Railway Station, Mumbai, Maharashtra',
    trades_offered: ['Electrician', 'Mechanic Motor Vehicle', 'CNC Operator', 'Refrigeration & AC'],
    total_seats: 500,
    latitude: 19.0410,
    longitude: 72.8620,
    contact_phone: '022-24071234',
    verified: true,
  },
  {
    id: 'iti-mumbai-2',
    name: 'National Skill Training Institute (NSTI) Mumbai',
    city: 'Mumbai',
    location_type: 'National Skill Training Institute',
    address: 'V. N. Purav Marg, Chunabhatti, Kurla East, Mumbai',
    trades_offered: ['Advanced Tool & Die', 'Solar Energy Tech', 'Industrial Robotics'],
    total_seats: 380,
    latitude: 19.0560,
    longitude: 72.8820,
    contact_phone: '022-25224567',
    verified: true,
  },

  // Lucknow
  {
    id: 'iti-lucknow-1',
    name: 'Govt. Industrial Training Institute Aliganj',
    city: 'Lucknow',
    location_type: 'Government ITI',
    address: 'Aliganj Main Road, Lucknow, Uttar Pradesh',
    trades_offered: ['Electrician', 'Fitter', 'Wireman', 'Civil Draughtsman', 'COPA'],
    total_seats: 550,
    latitude: 26.8920,
    longitude: 80.9410,
    contact_phone: '0522-2371234',
    verified: true,
  },
  {
    id: 'pmkvy-lucknow-1',
    name: 'NSDC Skill Centre Hazratganj',
    city: 'Lucknow',
    location_type: 'PMKVY Centre',
    address: 'Hazratganj Commercial Belt, Lucknow',
    trades_offered: ['Solar PV Installation', 'Digital Marketing & IT', 'Retail Operations'],
    total_seats: 220,
    latitude: 26.8510,
    longitude: 80.9460,
    contact_phone: '0522-2209876',
    verified: true,
  },
];

// Helper to calculate distance in km using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export default function SkillJobMap() {
  const [selectedCity, setSelectedCity] = useState<string>('Delhi NCR');
  const [mapCenter, setMapCenter] = useState<[number, number]>(CITIES['Delhi NCR']);
  const [userPos, setUserPos] = useState<[number, number]>(CITIES['Delhi NCR']);
  const [selectedCentre, setSelectedCentre] = useState<TrainingCentre | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [locating, setLocating] = useState<boolean>(false);
  const [gpsStatus, setGpsStatus] = useState<string>('Viewing centres in Delhi NCR (Select your city or click GPS)');

  const locateUserGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('Geolocation not supported by browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPos(coords);
        setMapCenter(coords);
        setLocating(false);
        setGpsStatus(`GPS Found! Showing nearest centres sorted by distance from your coordinates.`);
      },
      () => {
        setLocating(false);
        setGpsStatus('Could not read GPS. Displaying active city centres.');
      },
      { timeout: 7000 }
    );
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    const coords = CITIES[city] || CITIES['Delhi NCR'];
    setMapCenter(coords);
    setUserPos(coords);
    setSelectedCentre(null);
    setGpsStatus(`Showing verified government training institutes in ${city}`);
  };

  // Filter and sort centres by distance from user position
  const displayedCentres = ALL_CENTRES
    .map(c => ({
      ...c,
      distanceKm: calculateDistance(userPos[0], userPos[1], c.latitude, c.longitude)
    }))
    .filter(c => {
      const matchCity = selectedCity === 'All Cities' || c.city === selectedCity;
      const matchType = typeFilter === 'All' || c.location_type === typeFilter;
      const matchSearch = !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.trades_offered.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCity && matchType && matchSearch;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <PageWrapper className="max-w-7xl">
      {/* ─── Header & Search Controls ────────────────────────────────────── */}
      <div className="card mb-6 border-slate-200 bg-white/95 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-rose-500 to-amber-500 text-white shadow-md">
              <MapPin className="h-6 w-6 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase text-emerald-800">
                  DGT & NCVT Verified Institutes
                </span>
                <span className="text-xs text-slate-500 font-semibold">Skill Training Locator</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
                Government Skill & ITI Training Centre Map
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={locateUserGPS}
              disabled={locating}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-slate-800 active:scale-95 transition-all"
            >
              {locating ? <Loader2 className="h-4 w-4 animate-spin text-amber-400" /> : <Crosshair className="h-4 w-4 text-amber-400" />}
              <span>{locating ? 'Locating...' : 'Locate Me (GPS)'}</span>
            </button>
          </div>
        </div>

        {/* City and search filter bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-4">
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Select City / District:</label>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:border-rose-500 focus:outline-none shadow-sm"
            >
              {Object.keys(CITIES).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="All Cities">All Cities (Across India)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Institute Type:</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:border-rose-500 focus:outline-none shadow-sm"
            >
              <option value="All">All Institute Types</option>
              <option value="Government ITI">Government ITI</option>
              <option value="PMKVY Centre">PMKVY Kaushal Kendra</option>
              <option value="National Skill Training Institute">National Skill Training Institute (NSTI)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 block">Search by Trade or Name:</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. Electrician, Solar, Fitter..."
                className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs sm:text-sm font-semibold text-slate-900 focus:border-rose-500 focus:outline-none shadow-sm"
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* GPS Message */}
        <p className="text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg w-fit mt-3">
          📍 {gpsStatus}
        </p>
      </div>

      {/* ─── Map & Nearby Centres List ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leaflet Map Frame */}
        <div className="lg:col-span-2">
          <div className="h-[520px] rounded-3xl overflow-hidden border-2 border-slate-300 shadow-2xl relative">
            <MapContainer center={mapCenter} zoom={12} className="h-full w-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <RecenterMap center={mapCenter} />

              {/* User Location */}
              <Marker position={userPos} icon={userGpsIcon}>
                <Popup>
                  <p className="font-bold text-rose-600 text-xs">📍 Your Location</p>
                </Popup>
              </Marker>

              {/* Centres */}
              {displayedCentres.map((c) => (
                <Marker
                  key={c.id}
                  position={[c.latitude, c.longitude]}
                  icon={itiIcon}
                  eventHandlers={{
                    click: () => setSelectedCentre(c),
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <span className="rounded bg-violet-100 text-violet-800 text-[10px] font-bold px-1.5 py-0.5">
                        {c.location_type}
                      </span>
                      <p className="font-bold text-slate-900 text-sm mt-1">{c.name}</p>
                      <p className="text-xs text-slate-600">{c.address}</p>
                      <p className="text-xs text-emerald-700 font-bold mt-1">✓ {c.distanceKm} km away</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Sidebar: Nearest Institutes List */}
        <div className="flex flex-col gap-4">
          {/* Selected Centre Detail Card */}
          {selectedCentre ? (
            <div className="card border-2 border-violet-400 bg-violet-50/70 p-5 shadow-xl animate-fade-up">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-violet-600 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase">
                  {selectedCentre.location_type}
                </span>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  {selectedCentre.distanceKm} km away
                </span>
              </div>

              <h3 className="text-base font-black text-slate-950 mt-2">{selectedCentre.name}</h3>
              <p className="text-xs text-slate-600 mt-1">{selectedCentre.address}</p>

              <div className="my-3 border-t border-violet-200 pt-3 text-xs space-y-1.5 text-slate-800">
                <p className="font-bold text-slate-900">Available Trades:</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCentre.trades_offered.map((t, i) => (
                    <span key={i} className="rounded-md bg-white border border-violet-200 px-2 py-0.5 text-[11px] font-semibold text-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-slate-600 pt-1 font-medium">📞 Helpline: {selectedCentre.contact_phone}</p>
                <p className="text-emerald-700 font-bold">✓ Government Subsidized Admission Available</p>
              </div>

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCentre.latitude},${selectedCentre.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="btn-primary text-xs w-full text-center block font-black shadow-md mt-2"
              >
                Get Directions (Google Maps) ↗
              </a>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/80 p-5 text-center">
              <Compass className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-800">Select any centre on the map or list</p>
              <p className="text-xs text-slate-500 mt-1">Shows available courses, seats, phone, and route directions.</p>
            </div>
          )}

          {/* List of Nearest Institutes */}
          <div className="card p-4 bg-white/95">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 flex items-center justify-between">
              <span>Nearest Training Centres ({displayedCentres.length})</span>
              <span className="text-[10px] text-emerald-700 font-bold">Sorted by Distance</span>
            </h4>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {displayedCentres.map((centre) => (
                <div
                  key={centre.id}
                  onClick={() => {
                    setSelectedCentre(centre);
                    setMapCenter([centre.latitude, centre.longitude]);
                  }}
                  className={`rounded-xl border p-3 cursor-pointer transition-all ${
                    selectedCentre?.id === centre.id
                      ? 'border-violet-500 bg-violet-50 shadow-sm'
                      : 'border-slate-200 hover:border-violet-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-black text-slate-900 line-clamp-1">{centre.name}</p>
                    <span className="text-[10px] font-black text-violet-800 bg-violet-100 px-1.5 py-0.5 rounded flex-shrink-0 ml-1">
                      {centre.distanceKm} km
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{centre.address}</p>
                  <p className="text-[10px] text-emerald-700 font-bold mt-1">
                    {centre.trades_offered.slice(0, 2).join(', ')} +more
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
