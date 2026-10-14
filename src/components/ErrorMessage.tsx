import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

export default function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  fullPage = false,
}: ErrorMessageProps) {
  const inner = (
    <div className="flex flex-col items-center gap-4 py-12 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
        <AlertCircle className="h-7 w-7 text-red-500" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
  if (fullPage) {
    return <div className="flex min-h-[60vh] items-center justify-center">{inner}</div>;
  }
  return inner;
}
