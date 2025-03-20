export default function SeminarPagination({ pagination, onPageChange }) {
  if (pagination.pages <= 1) return null;

  return (
    <div className="mt-6 flex justify-center space-x-2">
      <button
        onClick={() => onPageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white"
      >
        Previous
      </button>
      <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
        Page {pagination.page} of {pagination.pages}
      </span>
      <button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={pagination.page === pagination.pages}
        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-700 dark:text-white"
      >
        Next
      </button>
    </div>
  );
} 