import type { LucideIcon } from 'lucide-react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({
  icon: Icon = SearchX,
  title = 'Nothing found',
  message = 'There is no data to display here yet.',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500 max-w-sm">{message}</p>
      </div>
      {action && (
        <button onClick={action.onClick} className="btn-primary">{action.label}</button>
      )}
    </div>
  );
}
