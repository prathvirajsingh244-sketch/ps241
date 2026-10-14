interface LoadingStateProps {
  message?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={`animate-spin text-green-600 ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function LoadingState({ message = 'Loading...', fullPage = false }: LoadingStateProps) {
  const inner = (
    <div className="flex flex-col items-center gap-3 py-12">
      <LoadingSpinner className="h-10 w-10" />
      <p className="text-sm text-gray-500 animate-pulse">{message}</p>
    </div>
  );
  if (fullPage) {
    return <div className="flex min-h-[60vh] items-center justify-center">{inner}</div>;
  }
  return inner;
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="skeleton h-5 w-3/4 mb-3" />
      <div className="skeleton h-4 w-full mb-2" />
      <div className="skeleton h-4 w-5/6 mb-4" />
      <div className="flex gap-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}
