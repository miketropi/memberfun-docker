import React from 'react';
import PropTypes from 'prop-types';

const ContactInfo = ({
  title = 'Get in touch',
  description = 'We\'d love to hear from you! Send us a message using the form, or reach out to us directly using the contact information below.',
  address = {
    street: '170-172 Xuân Thuỷ Street', 
    suite: 'Ward 7, District 3',
    city: 'Da Nang City, Vietnam'
  }, 
  phone = '+1 (555) 123-4567',
  email = 'info@memberfun.com',
  careerLink = '#',
  careerText = 'View all job openings', 
  bgColor = 'bg-gray-50',
  textColor = 'text-gray-500',
  headingColor = 'text-gray-900',
  linkColor = 'text-blue-600 hover:text-blue-500',
  iconColor = 'text-gray-400',
  className = ''
}) => {
  return (
    <div className={`${bgColor} py-16 px-4 sm:px-6 lg:px-8 lg:py-24 xl:pr-12 ${className}`}>
      <div className="max-w-lg mx-auto">
        <h2 className={`text-2xl font-extrabold tracking-tight ${headingColor} sm:text-3xl`}>{title}</h2>
        <p className={`mt-3 text-lg leading-6 ${textColor}`}>
          {description}
        </p>
        <dl className={`mt-8 text-base ${textColor}`}>
          {address && (
            <div>
              <dt className="sr-only">Address</dt>
              <dd>
                {address.street && <p>{address.street}</p>}
                {address.suite && <p>{address.suite}</p>}
                {address.city && <p>{address.city}</p>}
              </dd>
            </div>
          )}
          {phone && (
            <div className="mt-6">
              <dt className="sr-only">Phone number</dt>
              <dd className="flex">
                <svg
                  className={`flex-shrink-0 h-6 w-6 ${iconColor}`}
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
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="ml-3">{phone}</span>
              </dd>
            </div>
          )}
          {email && (
            <div className="mt-3">
              <dt className="sr-only">Email</dt>
              <dd className="flex">
                <svg
                  className={`flex-shrink-0 h-6 w-6 ${iconColor}`}
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
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="ml-3">{email}</span>
              </dd>
            </div>
          )}
        </dl>
        {careerLink && (
          <p className={`mt-6 text-base ${textColor}`}>
            Looking for careers?{' '}
            <a href={careerLink} className={`font-medium ${linkColor}`}>
              {careerText}
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
};

ContactInfo.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  address: PropTypes.shape({
    street: PropTypes.string,
    suite: PropTypes.string,
    city: PropTypes.string
  }),
  phone: PropTypes.string,
  email: PropTypes.string,
  careerLink: PropTypes.string,
  careerText: PropTypes.string,
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  headingColor: PropTypes.string,
  linkColor: PropTypes.string,
  iconColor: PropTypes.string,
  className: PropTypes.string
};

export default ContactInfo; 