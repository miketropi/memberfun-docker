import React from 'react';

/**
 * @param {string} title
 * @param {string} description
 * @param {React.ReactNode} icon
 * @param {string} color - The color of the card (e.g. "indigo", "purple", "pink")
 * @param {string} textIconClass - The class for the text and icon (e.g. "text-indigo-600", "text-purple-600", "text-pink-600")
 * @param {string} bgIconClass - The class for the background of the icon (e.g. "bg-indigo-100", "bg-purple-100", "bg-pink-100")
 */
const FeatureCard = ({ title, description, icon, color }) => { 
  return (
    <div className="group relative bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-100">
      <div className={`h-2 bg-${color}-600 w-full absolute top-0`}></div>
      <div className="p-8 flex flex-col items-center">
        <div className={`flex items-center justify-center w-12 h-12 rounded-full bg-${color}-100 text-${color}-600 mb-5`}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 text-center">{title}</h3>
        <p className="mt-4 text-gray-500 leading-relaxed text-center">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;