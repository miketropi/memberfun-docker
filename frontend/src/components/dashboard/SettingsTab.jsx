import React, { useState, useRef } from 'react';
import PasswordUpdateForm from './PasswordUpdateForm';
import { usersAPI } from '../../api/apiService';
import useAuthStore from '../../store/authStore';
import Toast from '../../components/Toast';

const SettingsTab = ({ userData }) => {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef(null);
  const [formData, setFormData] = useState({
    ID: userData?.id || '',
    first_name: userData?.first_name || '',
    last_name: userData?.last_name || '',
    email: userData?.email || '',
    description: userData?.description || '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let { email, ...rest } = formData;
    const response = await usersAPI.updateUser(userData.id, rest);
    console.log(response);
    let message = response.message;
    if (response.status === "success") {
      setUser({
        ...user,
        name: `${rest.first_name} ${rest.last_name}`,
      });
      toastRef.current.show(message, { type: 'success' });
    } else {
      toastRef.current.show(message, { type: 'error' });
    }

    setIsLoading(false);
  };
  
  return (
    <div>

      {/* { JSON.stringify(userData) } */}
      <Toast ref={toastRef} />
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Account Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Profile Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2 mb-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                  To update your profile picture, please visit <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Gravatar.com</a> and set up an avatar using your email address. The avatar will automatically sync with your profile.
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input 
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input 
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input 
                disabled
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </section>
        
        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      <PasswordUpdateForm />
    </div>
  );
};

export default SettingsTab; 