import { SeminarList, SeminarDetails, SeminarRegistrationForm } from '../index';

export default function SeminarContent({
  showRegistrationForm,
  selectedSeminar,
  seminars,
  filters,
  isRegistered,
  onSeminarClick,
  onRegister,
  onCancelRegistration,
  onExportCalendar,
  registrationLoading,
  onRegistrationComplete,
  onCloseDetails
}) {
  if (showRegistrationForm && selectedSeminar) {
    return (
      <SeminarRegistrationForm
        seminarId={selectedSeminar.id}
        onRegistrationComplete={onRegistrationComplete}
        initialData={{
          name: '',
          email: '',
          phone: '',
          company: '',
          dietary_requirements: '',
          special_requests: ''
        }}
      />
    );
  }

  if (selectedSeminar) {
    return (
      <SeminarDetails
        seminar={selectedSeminar}
        onClose={onCloseDetails}
        isRegistered={isRegistered(selectedSeminar.id)}
        onRegister={onRegister}
        onCancelRegistration={onCancelRegistration}
        onExportCalendar={onExportCalendar}
        registrationLoading={registrationLoading}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {filters.status === 'all' ? 'All Seminars' : 
           filters.status === 'upcoming' ? 'Upcoming Seminars' : 'Past Seminars'}
        </h2>
      </div>
      <SeminarList
        seminars={seminars}
        isRegisteredFn={isRegistered}
        onSeminarClick={onSeminarClick}
        isPast={filters.status === 'past'}
        emptyMessage="No seminars available."
      />
    </div>
  );
} 