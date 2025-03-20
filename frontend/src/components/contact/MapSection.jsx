import React from 'react';
import PropTypes from 'prop-types';

const MapSection = ({
  title = 'Our Location',
  subtitle = 'Visit Our Office',
  mapUrl = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0952890513616!2d-122.40058068440696!3d37.78778791908435!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807ded297e89%3A0xcfd1b2f12b1b2ba6!2sSalesforce%20Tower!5e0!3m2!1sen!2sus!4v1647887631211!5m2!1sen!2sus',
  mapHeight = 'h-96',
  mapTitle = 'Office Location',
  bgColor = 'bg-gray-50',
  titleColor = 'text-blue-600',
  subtitleColor = 'text-gray-900',
  className = ''
}) => {
  return (
    <div className={`${bgColor} ${className}`}>
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          {title && (
            <h2 className={`text-base ${titleColor} font-semibold tracking-wide uppercase`}>{title}</h2>
          )}
          {subtitle && (
            <p className={`mt-2 text-3xl leading-8 font-extrabold tracking-tight ${subtitleColor} sm:text-4xl`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="mt-10">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className={`w-full ${mapHeight} rounded-lg shadow-lg`}
              src={mapUrl}
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title={mapTitle}
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

MapSection.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  mapUrl: PropTypes.string,
  mapHeight: PropTypes.string,
  mapTitle: PropTypes.string,
  bgColor: PropTypes.string,
  titleColor: PropTypes.string,
  subtitleColor: PropTypes.string,
  className: PropTypes.string
};

export default MapSection; 