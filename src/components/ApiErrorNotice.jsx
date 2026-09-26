import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

/**
 * ApiErrorNotice
 * Non-intrusive alert notice for API errors and connectivity issues.
 */
export default function ApiErrorNotice({
  message = 'Unable to connect to the cloud service. Operating in local mode.',
  onDismiss,
}) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="bg-amber-50/95 border border-amber-200 text-amber-900 px-4 py-3 rounded-2xl flex items-center justify-between gap-3 shadow-xs text-xs sm:text-sm my-3"
    >
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="font-medium leading-snug">{message}</span>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-amber-700 hover:text-amber-900 p-1 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
          aria-label="Dismiss error notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
