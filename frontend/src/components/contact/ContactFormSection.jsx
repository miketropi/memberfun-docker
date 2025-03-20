import React from 'react';
import PropTypes from 'prop-types';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';

const ContactFormSection = ({
  contactInfoProps = {},
  contactFormProps = {},
  bgColor = 'bg-white',
  className = ''
}) => {
  return (
    <div className={`relative ${bgColor} ${className}`}>
      <div className="absolute inset-0">
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-50"></div>
      </div>
      <div className="relative max-w-7xl mx-auto lg:grid lg:grid-cols-5">
        <ContactInfo 
          className="lg:col-span-2"
          {...contactInfoProps} 
        />
        <ContactForm 
          className="lg:col-span-3 xl:pl-12"
          {...contactFormProps}
        />
      </div>
    </div>
  );
};

ContactFormSection.propTypes = {
  contactInfoProps: PropTypes.object,
  contactFormProps: PropTypes.object,
  bgColor: PropTypes.string,
  className: PropTypes.string
};

export default ContactFormSection; 