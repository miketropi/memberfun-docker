import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

export default function ErrorMessage({
  message,
  variant = 'error',
  className = '',
  onRetry,
}) {
  const variants = {
    error: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  const icons = {
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  return (
    <div
      className={`rounded-lg border p-4 ${variants[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{icons[variant]}</div>
        <div className="ml-3">
          <p className="text-sm font-medium">{message}</p>
          {onRetry && (
            <div className="mt-2">
              <button
                onClick={onRetry}
                className="text-sm font-medium underline hover:text-opacity-80 focus:outline-none"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 