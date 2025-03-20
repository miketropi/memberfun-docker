import React, { useState } from 'react';

const SettingsTab = ({ userData }) => {
  const [formData, setFormData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    currentPassword: '',
    newPassword: '',
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically call an API to update user settings
    console.log('Form submitted:', formData);
    // Show success message
    alert('Settings updated successfully!');
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Settings</h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input 
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input 
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>
        
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input 
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input 
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>
        
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="emailNotifications"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-700">
                Email Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="smsNotifications"
                name="smsNotifications"
                checked={formData.smsNotifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-700">
                SMS Notifications
              </label>
            </div>
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="marketingEmails"
                name="marketingEmails"
                checked={formData.marketingEmails}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="marketingEmails" className="ml-2 block text-sm text-gray-700">
                Marketing Emails
              </label>
            </div>
          </div>
        </section>
        
        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsTab; 