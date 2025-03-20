import { useState, useEffect } from 'react';
import { seminarsAPI } from '../../api/apiService';
import { isPast, isFuture, parseISO } from 'date-fns';
import SeminarTabs from './SeminarTabs';
import SeminarList from './SeminarList';
import SeminarDetails from './SeminarDetails';

export default function SeminarManager() {
  const [upcomingSeminars, setUpcomingSeminars] = useState([]);
  const [pastSeminars, setPastSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [registeredSeminars, setRegisteredSeminars] = useState([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1
  });

  useEffect(() => {
    fetchSeminars();
  }, []);

  const fetchSeminars = async () => {
    try {
      setLoading(true);
      
      // Fetch upcoming seminars
      const upcomingData = await seminarsAPI.getUpcomingSeminars({
        limit: 10,
        offset: 0
      });
      setUpcomingSeminars(upcomingData || []);
      
      // Set pagination data if available
      if (upcomingData && upcomingData.length > 0 && 'total' in upcomingData) {
        setPagination({
          total: upcomingData.total || 0,
          pages: upcomingData.pages || 0,
          page: upcomingData.page || 1
        });
      }
      
      // Fetch past seminars (we'll need to create a custom endpoint for this or filter client-side)
      // For now, we'll just use the upcoming endpoint and filter client-side
      const allSeminars = await seminarsAPI.getUpcomingSeminars({
        limit: 50, // Get more to have enough past seminars
        offset: 0
      });
      
      // Filter past seminars client-side
      const past = (allSeminars || []).filter(seminar => 
        isPast(parseISO(seminar.date))
      );
      setPastSeminars(past);
      
      // // Fetch registered seminars
      // try {
      //   const registered = await seminarsAPI.getRegisteredSeminars();
      //   setRegisteredSeminars(registered.map(reg => reg.id));
      // } catch (regErr) {
      //   console.error('Error fetching registered seminars:', regErr);
      //   // Non-critical error, continue without registered seminars
      // }
      
      setLoading(false);
    } catch (err) {
      setError('Failed to load seminars. Please try again later.');
      setLoading(false);
      console.error('Error fetching seminars:', err);
    }
  };

  const handleSeminarClick = (seminar) => {
    setSelectedSeminar(seminar);
  };

  const handleRegister = async (seminarId) => {
    try {
      setRegistrationLoading(true);
      await seminarsAPI.registerForSeminar(seminarId, {});
      setRegisteredSeminars([...registeredSeminars, seminarId]);
      setRegistrationLoading(false);
    } catch (err) {
      console.error('Error registering for seminar:', err);
      setRegistrationLoading(false);
    }
  };

  const handleCancelRegistration = async (seminarId) => {
    try {
      setRegistrationLoading(true);
      await seminarsAPI.cancelRegistration(seminarId);
      setRegisteredSeminars(registeredSeminars.filter(id => id !== seminarId));
      setRegistrationLoading(false);
    } catch (err) {
      console.error('Error canceling registration:', err);
      setRegistrationLoading(false);
    }
  };

  const handleExportCalendar = async (seminarId) => {
    try {
      const blob = await seminarsAPI.exportToIcal(seminarId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seminar-${seminarId}.ics`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Error exporting calendar:', err);
    }
  };

  const isRegistered = (seminarId) => {
    return registeredSeminars.includes(seminarId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Member Seminars</h1>
        <SeminarTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {selectedSeminar ? (
        <SeminarDetails
          seminar={selectedSeminar}
          onClose={() => setSelectedSeminar(null)}
          isRegistered={isRegistered(selectedSeminar.id)}
          onRegister={handleRegister}
          onCancelRegistration={handleCancelRegistration}
          onExportCalendar={handleExportCalendar}
          registrationLoading={registrationLoading}
        />
      ) : (
        <div>
          {activeTab === 'upcoming' && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Upcoming Seminars</h2>
              <SeminarList
                seminars={upcomingSeminars}
                isRegisteredFn={isRegistered}
                onSeminarClick={handleSeminarClick}
                emptyMessage="No upcoming seminars available."
              />
            </>
          )}

          {activeTab === 'past' && (
            <>
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Past Seminars</h2>
              <SeminarList
                seminars={pastSeminars}
                isRegisteredFn={isRegistered}
                onSeminarClick={handleSeminarClick}
                isPast={true}
                emptyMessage="No past seminars available."
              />
            </>
          )}
        </div>
      )}
    </div>
  );
} 