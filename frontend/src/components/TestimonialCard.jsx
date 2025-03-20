import React from 'react';

const TestimonialCard = ({ quote, name, role, image }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
      <div className="text-indigo-500 mb-4">
        <svg width="45" height="36" className="fill-current" viewBox="0 0 45 36" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.415.43c-2.523 0-4.75 1.173-6.682 3.52C4.8 6.298 3.756 9.38 3.756 12.89c0 3.28.986 6.296 2.959 9.048 1.973 2.752 4.49 4.128 7.552 4.128 2.43 0 4.386-.76 5.87-2.28 1.483-1.52 2.225-3.405 2.225-5.656 0-2.153-.74-3.94-2.225-5.36-1.484-1.52-3.24-2.28-5.267-2.28-1.862 0-3.147.42-3.855 1.26.296-2.153 1.187-3.99 2.67-5.51 1.484-1.52 3.24-2.28 5.267-2.28V.43zm25.04 0c-2.524 0-4.75 1.173-6.682 3.52-1.933 2.347-2.977 5.43-2.977 9.048 0 3.28.986 6.296 2.959 9.048 1.973 2.752 4.49 4.128 7.552 4.128 2.43 0 4.386-.76 5.87-2.28 1.483-1.52 2.225-3.405 2.225-5.656 0-2.153-.74-3.94-2.225-5.36-1.484-1.52-3.24-2.28-5.267-2.28-1.862 0-3.147.42-3.855 1.26.296-2.153 1.187-3.99 2.67-5.51 1.484-1.52 3.24-2.28 5.267-2.28V.43z" />
        </svg>
      </div>
      <p className="text-gray-700 mb-6 leading-relaxed">
        {quote}
      </p>
      <div className="flex items-center">
        <img
          className="h-10 w-10 rounded-full object-cover"
          src={image}
          alt={name}
        />
        <div className="ml-3">
          <h4 className="text-sm font-medium text-gray-900">{name}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard; 