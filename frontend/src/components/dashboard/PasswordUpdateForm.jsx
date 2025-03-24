import React, { useState } from 'react';
import { usersAPI } from '../../api/apiService';
import useUserStore from '../../store/userStore';
import { CheckCircle, AlertCircle } from 'lucide-react';

const PasswordUpdateForm = () => {
  const { userData } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
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
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match!');
      setMessageType('error');
      return;
    }
    
    setIsLoading(true);

    // updatePassword
    try {
      const response = await usersAPI.updatePassword(userData.id, formData.newPassword);
      console.log(response);
      setMessage('Password updated successfully!');
      setMessageType('success');
    } catch (error) {
      console.error(error);
      setMessage('Failed to update password. Please try again.');
      setMessageType('error');
    }

    setIsLoading(false);
    
    // Reset form
    setFormData({
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Update Password</h2>
      <form onSubmit={handleSubmit} className="space-y-8">
        {message && (
          <div className={`flex items-center p-4 mb-4 rounded-lg ${
            messageType === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <div className="flex-shrink-0">
              {messageType === 'success' ? (
                <CheckCircle size={16} className="text-green-600" />
              ) : (
                <AlertCircle size={16} className="text-red-600" />
              )}
            </div>
            <p className="ml-3 text-sm font-medium">{message}</p>
          </div>
        )}
        <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
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
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input 
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </section>
        
        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition"
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordUpdateForm; 