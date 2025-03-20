import React from 'react';

const DashboardHeader = ({ userData }) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-md p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome back, {userData?.name || 'User'}!</h1>
          <p className="opacity-90">
            Your membership is currently <span className="font-semibold">{userData?.membershipStatus?.toLowerCase() || 'active'}</span>
          </p>
        </div>
        {userData?.avatar && (
          <div className="hidden md:block">
            <img 
              src={userData.avatar} 
              alt={userData.name} 
              className="h-16 w-16 rounded-full border-2 border-white shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader; 