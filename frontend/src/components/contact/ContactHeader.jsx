import React from 'react';
import PropTypes from 'prop-types';

const ContactHeader = ({ 
  title = 'Contact Us',
  subtitle = 'Have questions or need assistance? We\'re here to help!',
  bgColor = 'bg-blue-600',
  titleColor = 'text-white',
  subtitleColor = 'text-blue-200',
  className = ''
}) => {
  return (
    <div className={`${bgColor} ${className}`}>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`text-4xl font-extrabold ${titleColor} sm:text-5xl sm:tracking-tight lg:text-6xl`}>
            {title}
          </h1>
          {subtitle && (
            <p className={`mt-6 max-w-3xl mx-auto text-xl ${subtitleColor}`}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

ContactHeader.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  bgColor: PropTypes.string,
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  className: PropTypes.string
};

export default ContactHeader; 