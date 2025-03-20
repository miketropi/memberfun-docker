import { useState } from 'react';
import { CheckCircle, XCircle, Download } from 'lucide-react';

export default function SeminarRegistrationButton({ 
  seminarId, 
  isRegistered, 
  onRegister, 
  onCancelRegistration, 
  onExportCalendar,
  loading = false
}) {
  if (isRegistered) {
    return (
      <div className="flex flex-col sm:flex-row sm:space-x-4">
        <button
          onClick={() => onCancelRegistration(seminarId)}
          disabled={loading}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition-colors mb-2 sm:mb-0 flex items-center justify-center"
        >
          {loading ? (
            <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
          ) : (
            <XCircle className="h-5 w-5 mr-2" />
          )}
          Cancel Registration
        </button>
        {onExportCalendar && (
          <button
            onClick={() => onExportCalendar(seminarId)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Add to Calendar
          </button>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onRegister(seminarId)}
      disabled={loading}
      className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center"
    >
      {loading ? (
        <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
      ) : (
        <CheckCircle className="h-5 w-5 mr-2" />
      )}
      Register for Seminar
    </button>
  );
} 