import { ExternalLink, CheckCircle2, Clock, AlertCircle, Shield } from 'lucide-react';
import type { Source } from '../types';

interface SourceCitationProps {
  sources: Source[];
}

const verificationIcon = {
  verified: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
  unverified: <AlertCircle className="h-3.5 w-3.5 text-amber-500" />,
  pending: <Clock className="h-3.5 w-3.5 text-gray-400" />,
};

const verificationLabel = {
  verified: 'Verified',
  unverified: 'Unverified',
  pending: 'Pending review',
};

export default function SourceCitation({ sources }: SourceCitationProps) {
  if (!sources || sources.length === 0) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <AlertCircle className="h-4 w-4" />
          <span>No source references available for this career profile.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <Shield className="h-3.5 w-3.5" />
        <span>Information sources — verify before making decisions</span>
      </div>
      {sources.map((src) => (
        <div key={src.id} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">
            {verificationIcon[src.verification_status]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 line-clamp-1">{src.title}</p>
            <p className="text-xs text-gray-500">
              {src.publisher}
              {src.last_verified_at && (
                <> · Last checked: {new Date(src.last_verified_at).toLocaleDateString('en-IN')}</>
              )}
            </p>
            <div className="mt-1 flex items-center gap-3">
              <span className="badge-gray">{verificationLabel[src.verification_status]}</span>
              <a
                href={src.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-green-600 hover:text-green-800 transition-colors"
                aria-label={`Open source: ${src.title}`}
              >
                Open source <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
