import { useState, useEffect } from 'react';
import { seminarsAPI } from '../../api/apiService';
import { useNavigate, useLocation } from 'react-router-dom';
import SeminarFilters from './components/SeminarFilters';
import SeminarPagination from './components/SeminarPagination';
import SeminarHeader from './components/SeminarHeader';
import SeminarContent from './components/SeminarContent';
import Pagination from '../common/Pagination';

export default function CustomSeminarExample() {
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSeminar, setSelectedSeminar] = useState(null);
  const [registeredSeminars, setRegisteredSeminars] = useState([]);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // make function get local pathname
  const getLocalPathname = () => {
    return location.pathname;
  }

  let localPathname = getLocalPathname();

  useEffect(() => {
    if (localPathname.includes('seminars')) {
      const seminarId = localPathname.split('/').pop();
      if(seminarId == 'seminars') return;

      // console.log('seminarId', seminarId);
      // find seminars by id
      const seminar = seminars.find(seminar => seminar.id === parseInt(seminarId));
      if (seminar) {
        // console.log('seminar', seminar);
        setSelectedSeminar(seminar);
      }
      // console.log('seminarId', seminarId);
      // setSelectedSeminar(seminarId);
    }
  }, [localPathname, seminars]);

  // Pagination state
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    page: 1,
    limit: 12
  });

  // Filter state
  const [filters, setFilters] = useState({
    search: '',
    host: '',
    status: 'all' // all, upcoming, past
  });

  useEffect(() => {
    fetchSeminars();
  }, [pagination.page, filters]);

  const fetchSeminars = async () => {
    try {
      setLoading(true);
      
      // Calculate offset based on current page
      const offset = (pagination.page - 1) * pagination.limit;
      
      // Fetch seminars with pagination
      let methodQuery = {
        all: seminarsAPI.getSeminars,
        upcoming: seminarsAPI.getUpcomingSeminars,
      }
      const response = await methodQuery[filters.status]({
        limit: pagination.limit,
        offset: offset,
        search: filters.search,
        host: filters.host
      });
      
      // Update pagination info
      if (response && 'total' in response) {
        setPagination(prev => ({
          ...prev,
          total: response.total || 0,
          pages: response.pages || 0
        }));
      }

      // Filter seminars 
      let filteredSeminars = response.seminars || [];
      filteredSeminars = filteredSeminars.map(seminar => {
        seminar.status = filters.status === 'past' ? isPastSeminar(seminar) : !isPastSeminar(seminar);
        return seminar;
      });
      
      setSeminars(filteredSeminars);
      setLoading(false);
    } catch (err) {
      setError('Failed to load seminars. Please try again later.');
      setLoading(false);
      console.error('Error fetching seminars:', err);
    }
  };

  const isPastSeminar = (seminar) => {
    const dateTimeStr = `${seminar.date}T${seminar.time}`;
    const seminarDateTime = new Date(dateTimeStr);
    const now = new Date();
    return seminarDateTime < now;
  };

  const handleSeminarClick = (seminar) => {
    navigate(`/dashboard/seminars/${seminar.id}`);
    setSelectedSeminar(seminar);
    setShowRegistrationForm(false);
  };

  const handleRegister = (seminarId) => {
    setShowRegistrationForm(true);
  };

  const handleRegistrationComplete = (seminarId) => {
    if (seminarId) {
      setRegisteredSeminars([...registeredSeminars, seminarId]);
    }
    setShowRegistrationForm(false);
    setSelectedSeminar(null);
    fetchSeminars();
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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page when filters change
  };

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const isRegistered = (seminarId) => {
    return registeredSeminars.includes(seminarId);
  };

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center h-64">
  //       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

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
      <SeminarHeader 
        totalSeminars={pagination.total}
        currentSeminars={seminars.length}
        status={filters.status}
      />

      <SeminarFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {
        (() => {
          if(loading) {
            return (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            );
          } else {
            return (
              <>
                <SeminarContent
                  showRegistrationForm={showRegistrationForm}
                  selectedSeminar={selectedSeminar}
                  seminars={seminars}
                  filters={filters}
                  isRegistered={isRegistered}
                  onSeminarClick={handleSeminarClick}
                  onRegister={handleRegister}
                  onCancelRegistration={handleCancelRegistration}
                  onExportCalendar={handleExportCalendar}
                  registrationLoading={registrationLoading}
                  onRegistrationComplete={handleRegistrationComplete}
                  onCloseDetails={() => {
                    navigate('/dashboard/seminars');
                    setSelectedSeminar(null);
                  }}
                />

                {/* <SeminarPagination
                  pagination={pagination}
                  onPageChange={handlePageChange}
                /> */}
                { /* validate pagination.pages > 1 */ }
                { pagination.pages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      totalPages={pagination.pages}
                      currentPage={pagination.page}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )
          }
        })()
      }

      
    </div>
  );
} 