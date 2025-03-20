import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      await checkAuth();
      setIsChecking(false);
    };

    verifyAuth();
  }, [checkAuth]);

  if (isChecking || isLoading) {
    // You can replace this with a loading spinner component
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute; 