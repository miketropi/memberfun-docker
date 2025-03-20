import { Link } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useThemeStore from '../store/themeStore';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className={`${theme === 'dark' ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow-md'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className={`text-2xl font-bold ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}>
                Memberfun
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`border-transparent ${theme === 'dark' ? 'text-gray-300 hover:border-blue-400 hover:text-blue-400' : 'text-gray-500 hover:border-blue-500 hover:text-blue-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Home
              </Link>
              {/* <Link
                to="/about"
                className={`border-transparent ${theme === 'dark' ? 'text-gray-300 hover:border-blue-400 hover:text-blue-400' : 'text-gray-500 hover:border-blue-500 hover:text-blue-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                About
              </Link> */}
              <Link
                to="/contact"
                className={`border-transparent ${theme === 'dark' ? 'text-gray-300 hover:border-blue-400 hover:text-blue-400' : 'text-gray-500 hover:border-blue-500 hover:text-blue-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Contact
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`border-transparent ${theme === 'dark' ? 'text-gray-300 hover:border-blue-400 hover:text-blue-400' : 'text-gray-500 hover:border-blue-500 hover:text-blue-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`mr-4 p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'}`}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center">
                <span className={`mr-4 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Welcome, {user?.name || 'Member'}
                </span>
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 text-sm font-medium text-white ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-md`}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 text-sm font-medium ${theme === 'dark' ? 'text-blue-400 border-blue-400 hover:bg-blue-900' : 'text-blue-600 border-blue-600 hover:bg-blue-50'} border rounded-md`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`ml-4 px-4 py-2 text-sm font-medium text-white ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-md`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full ${theme === 'dark' ? 'bg-gray-700 text-yellow-300' : 'bg-gray-200 text-gray-700'} mr-2`}
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            <button
              onClick={toggleMenu}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500`}
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon for X */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block pl-3 pr-4 py-2 border-l-4 border-transparent ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:border-blue-400 hover:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-700'} text-base font-medium`}
          >
            Home
          </Link>
          <Link
            to="/about"
            className={`block pl-3 pr-4 py-2 border-l-4 border-transparent ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:border-blue-400 hover:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-700'} text-base font-medium`}
          >
            About
          </Link>
          <Link
            to="/contact"
            className={`block pl-3 pr-4 py-2 border-l-4 border-transparent ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:border-blue-400 hover:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-700'} text-base font-medium`}
          >
            Contact
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`block pl-3 pr-4 py-2 border-l-4 border-transparent ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-700 hover:border-blue-400 hover:text-blue-400' : 'text-gray-600 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-700'} text-base font-medium`}
            >
              Dashboard
            </Link>
          )}
        </div>
        <div className={`pt-4 pb-3 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="px-4">
                <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                  Welcome, {user?.name || 'Member'}
                </p>
              </div>
              <div className="px-4">
                <button
                  onClick={handleLogout}
                  className={`block text-center w-full px-4 py-2 text-sm font-medium text-white ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-md`}
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center px-4">
                <Link
                  to="/login"
                  className={`block text-center w-full px-4 py-2 text-sm font-medium ${theme === 'dark' ? 'text-blue-400 border-blue-400 hover:bg-blue-900' : 'text-blue-600 border-blue-600 hover:bg-blue-50'} border rounded-md`}
                >
                  Login
                </Link>
              </div>
              <div className="mt-3 px-4">
                <Link
                  to="/register"
                  className={`block text-center w-full px-4 py-2 text-sm font-medium text-white ${theme === 'dark' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} rounded-md`}
                >
                  Register
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 