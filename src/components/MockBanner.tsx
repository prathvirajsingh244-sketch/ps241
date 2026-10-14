import { AlertTriangle } from 'lucide-react';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export default function MockBanner() {
  if (!USE_MOCK) return null;
  return (
    <div className="mock-banner mx-auto mt-4 max-w-7xl w-full px-4 sm:px-6 lg:px-8">
      <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
      <span>
        <strong>SAMPLE DATA MODE</strong> — All data shown is mock/sample data for demonstration only.
        Set <code className="font-mono">VITE_USE_MOCK=false</code> and connect to the backend to use real data.
      </span>
    </div>
  );
}
