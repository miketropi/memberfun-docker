import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ContactForm = ({
  initialFormData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  },
  onSubmit,
  submitButtonText = 'Submit',
  submitButtonClassName = 'inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
  formClassName = 'grid grid-cols-1 gap-y-6',
  inputClassName = 'py-3 px-4 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md',
  bgColor = 'bg-white',
  labelColor = 'text-gray-700',
  successBgColor = 'bg-green-50',
  successTextColor = 'text-green-800',
  errorBgColor = 'bg-red-50',
  errorTextColor = 'text-red-800',
  className = '',
  showNameField = true,
  showEmailField = true,
  showSubjectField = true,
  showMessageField = true,
  customFields = [],
  successMessage = 'Thank you for your message! We will get back to you soon.',
}) => {
  const [formData, setFormData] = useState(initialFormData);
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // If custom onSubmit is provided, use it
    if (onSubmit) {
      onSubmit(formData, setFormStatus);
      return;
    }
    
    // Default submission behavior
    setFormStatus({
      submitted: true,
      success: true,
      message: successMessage,
    });

    // Reset form after submission
    setFormData(initialFormData);
  };

  return (
    <div className={`${bgColor} py-16 px-4 sm:px-6 lg:py-24 lg:px-8 ${className}`}>
      <div className="max-w-lg mx-auto lg:max-w-none">
        {formStatus.submitted && (
          <div
            className={`mb-6 p-4 rounded-md ${
              formStatus.success ? successBgColor + ' ' + successTextColor : errorBgColor + ' ' + errorTextColor
            }`}
          >
            {formStatus.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className={formClassName}>
          {showNameField && (
            <div>
              <label htmlFor="name" className={`block text-sm font-medium ${labelColor}`}>
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />
              </div>
            </div>
          )}
          
          {showEmailField && (
            <div>
              <label htmlFor="email" className={`block text-sm font-medium ${labelColor}`}>
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />
              </div>
            </div>
          )}
          
          {showSubjectField && (
            <div>
              <label htmlFor="subject" className={`block text-sm font-medium ${labelColor}`}>
                Subject
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                />
              </div>
            </div>
          )}
          
          {showMessageField && (
            <div>
              <label htmlFor="message" className={`block text-sm font-medium ${labelColor}`}>
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className={inputClassName}
                ></textarea>
              </div>
            </div>
          )}
          
          {/* Render custom fields if provided */}
          {customFields.map((field, index) => (
            <div key={index}>
              <label htmlFor={field.name} className={`block text-sm font-medium ${labelColor}`}>
                {field.label}
              </label>
              <div className="mt-1">
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows={field.rows || 4}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className={inputClassName}
                  ></textarea>
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    id={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    required={field.required}
                    className={inputClassName}
                  />
                )}
              </div>
            </div>
          ))}
          
          <div>
            <button
              type="submit"
              className={submitButtonClassName}
            >
              {submitButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ContactForm.propTypes = {
  initialFormData: PropTypes.object,
  onSubmit: PropTypes.func,
  submitButtonText: PropTypes.string,
  submitButtonClassName: PropTypes.string,
  formClassName: PropTypes.string,
  inputClassName: PropTypes.string,
  bgColor: PropTypes.string,
  labelColor: PropTypes.string,
  successBgColor: PropTypes.string,
  successTextColor: PropTypes.string,
  errorBgColor: PropTypes.string,
  errorTextColor: PropTypes.string,
  className: PropTypes.string,
  showNameField: PropTypes.bool,
  showEmailField: PropTypes.bool,
  showSubjectField: PropTypes.bool,
  showMessageField: PropTypes.bool,
  customFields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string,
      required: PropTypes.bool,
      rows: PropTypes.number, // For textarea
    })
  ),
  successMessage: PropTypes.string,
};

export default ContactForm; 