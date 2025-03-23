import React, { useState } from 'react';

const PasswordUpdateForm = () => {
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    
    // Here you would typically call an API to update password
    console.log('Password update submitted:', {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });
    
    // Show success message
    alert('Password updated successfully!');
    
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