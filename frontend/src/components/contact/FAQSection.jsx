import React, { useState } from 'react';
import PropTypes from 'prop-types';

const FAQSection = ({
  title = 'Frequently Asked Questions',
  faqs = [
    {
      question: 'How do I get started with MemberFun?',
      answer: 'Getting started is easy! Simply register for an account, and you\'ll be guided through the setup process. If you need help, our support team is always available.'
    },
    {
      question: 'Is there a free trial available?',
      answer: 'Yes, we offer a 14-day free trial for all new users. No credit card required to get started.'
    },
    {
      question: 'Can I import my existing member data?',
      answer: 'Absolutely! MemberFun supports importing member data from CSV files, Excel spreadsheets, and several other membership platforms.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      question: 'Is my data secure with MemberFun?',
      answer: 'Security is our top priority. We use industry-standard encryption and security practices to ensure your data is always protected.'
    },
    {
      question: 'How can I get support if I need help?',
      answer: 'Our support team is available via email, live chat, and phone during business hours. We also have an extensive knowledge base and community forum.'
    }
  ],
  bgColor = 'bg-white',
  titleColor = 'text-gray-900',
  questionColor = 'text-gray-900',
  answerColor = 'text-gray-500',
  className = ''
}) => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className={`${bgColor} ${className}`}>
      <div className="max-w-4xl mx-auto py-16 px-4 sm:py-24 sm:px-6">
        <h2 className={`text-3xl font-extrabold ${titleColor} text-center mb-12`}>{title}</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className={`w-full px-6 py-4 flex justify-between items-center ${questionColor} text-left font-medium focus:outline-none`}
                onClick={() => toggleAccordion(index)}
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              <div
                className={`px-6 overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-96 py-4' : 'max-h-0'
                }`}
              >
                <p className={`${answerColor}`}>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

FAQSection.propTypes = {
  title: PropTypes.string,
  faqs: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      answer: PropTypes.string.isRequired
    })
  ),
  bgColor: PropTypes.string,
  titleColor: PropTypes.string,
  questionColor: PropTypes.string,
  answerColor: PropTypes.string,
  className: PropTypes.string
};

export default FAQSection;