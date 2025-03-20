import { useState, useEffect } from 'react';
import { seminarsAPI } from '../../api/apiService';
import { format, parseISO } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  CheckCircle, 
  XCircle,
  AlertCircle
} from 'lucide-react';

export default function SeminarRegistrationForm({ 
  seminarId, 
  onRegistrationComplete,
  initialData = {}
}) {
  const [seminar, setSeminar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registrationData, setRegistrationData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    company: initialData.company || '',
    dietary_requirements: initialData.dietary_requirements || '',
    special_requests: initialData.special_requests || ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const fetchSeminarDetails = async () => {
      try {
        setLoading(true);
        // We need to get the seminar details first
        // This would typically use a different endpoint than what we have in the API docs
        // For now, we'll assume we can get a single seminar by ID
        const upcomingSeminars = await seminarsAPI.getUpcomingSeminars();
        const seminarDetails = upcomingSeminars.find(s => s.id === parseInt(seminarId));
        
        if (seminarDetails) {
          setSeminar(seminarDetails);
        } else {
          setError('Seminar not found');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load seminar details. Please try again later.');
        setLoading(false);
        console.error('Error fetching seminar details:', err);
      }
    };

    if (seminarId) {
      fetchSeminarDetails();
    }
  }, [seminarId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!registrationData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!registrationData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registrationData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!registrationData.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      await seminarsAPI.registerForSeminar(seminarId, registrationData);
      setSuccess(true);
      setSubmitting(false);
      
      // Notify parent component that registration is complete
      if (onRegistrationComplete) {
        onRegistrationComplete(seminarId);
      }
    } catch (err) {
      setError('Failed to register for seminar. Please try again later.');
      setSubmitting(false);
      console.error('Error registering for seminar:', err);
    }
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

  if (!seminar) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Notice:</strong>
        <span className="block sm:inline"> Seminar not found.</span>
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 text-green-700 px-6 py-8 rounded-lg text-center">
        <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
        <h2 className="text-2xl font-bold mb-2">Registration Successful!</h2>
        <p className="mb-6">You have successfully registered for "{seminar.title}".</p>
        <p className="mb-4">A confirmation email has been sent to your email address.</p>
        <button
          onClick={() => onRegistrationComplete && onRegistrationComplete(seminarId)}
          className="bg-primary hover:bg-primary-dark text-white py-2 px-6 rounded-md transition-colors"
        >
          Return to Seminars
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Register for Seminar</h1>
      
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{seminar.title}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-3">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{seminar.formatted_date || format(parseISO(seminar.date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Clock className="h-5 w-5 mr-2" />
              <span>{seminar.formatted_time || seminar.time}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <MapPin className="h-5 w-5 mr-2" />
              <span>{seminar.location}</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <User className="h-5 w-5 mr-2" />
              <span>Host: {seminar.host?.name || 'Unknown'}</span>
            </div>
            {seminar.capacity && (
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Users className="h-5 w-5 mr-2" />
                <span>Capacity: {seminar.capacity}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Registration Form</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={registrationData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    validationErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white`}
                  placeholder="Enter your full name"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registrationData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    validationErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white`}
                  placeholder="Enter your email address"
                />
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.email}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={registrationData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    validationErrors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white`}
                  placeholder="Enter your phone number"
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {validationErrors.phone}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Company/Organization
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={registrationData.company}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                  placeholder="Enter your company or organization"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="dietary_requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dietary Requirements
              </label>
              <input
                type="text"
                id="dietary_requirements"
                name="dietary_requirements"
                value={registrationData.dietary_requirements}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                placeholder="Any dietary requirements or allergies"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="special_requests" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Special Requests
              </label>
              <textarea
                id="special_requests"
                name="special_requests"
                value={registrationData.special_requests}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
                placeholder="Any special requests or accommodations"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => onRegistrationComplete && onRegistrationComplete()}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white py-2 px-4 rounded-md transition-colors mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition-colors flex items-center"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Complete Registration
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 