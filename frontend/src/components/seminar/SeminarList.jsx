import SeminarCard from './SeminarCard';

export default function SeminarList({ 
  seminars, 
  isRegisteredFn, 
  onSeminarClick, 
  isPast = false,
  emptyMessage = 'No seminars available.'
}) {
  if (!seminars || seminars.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Seminar
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Date & Location
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Host
            </th>
            {!isPast && (
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {seminars.map((seminar) => (
            <SeminarCard
              key={seminar.id}
              seminar={seminar}
              isRegistered={isRegisteredFn ? isRegisteredFn(seminar.id) : false}
              onClick={onSeminarClick}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
} 