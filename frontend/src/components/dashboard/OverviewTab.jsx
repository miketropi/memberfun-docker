import { useEffect, useState } from 'react';
import React from 'react';
import { pointsAPI } from '../../api/apiService';
import UserRank from '../UserRank';

const OverviewTab = ({ userData }) => {
  const [activityStats, setActivityStats] = useState([
    { label: 'Member Points', value: 0 },
    { label: 'Ranking', value: 'N/A' },
  ]);

  useEffect(() => {
    const fetchActivityStats = async () => {
      try {
        const response = await pointsAPI.getUserPointsAndRank(userData.id);
        // console.log(response);
        setActivityStats([
          { label: 'Member Points', value: response.points },
          { label: 'Ranking', value: <UserRank rank={ response.rank } /> },
        ]);
      } catch (error) {
        console.error('Error fetching activity stats:', error);
      }
    };

    fetchActivityStats();
  }, [userData?.id]);
  
  
 
  const membershipDetails = [
    { label: 'Role', value: userData?.membershipType || 'Standard' },
    { label: 'Status', value: userData?.membershipStatus || 'Active' },
    { label: 'Member Since', value: userData?.memberSince ? new Date(userData.memberSince).toLocaleDateString() : 'N/A' },
    { label: 'Next Billing', value: userData?.nextBillingDate || 'N/A' }
  ];
  
  // const activityStats = [
  //   { label: 'Member Points', value: 0 },
  //   { label: 'Ranking', value: 'N/A' },
  // ];
  
  const recentActivities = [
    { id: 1, title: 'Logged in from new device', time: '2 days ago', icon: 'clock' },
    { id: 2, title: 'Downloaded Member Benefits Guide', time: '5 days ago', icon: 'document' },
    { id: 3, title: 'Received new message from admin', time: '1 week ago', icon: 'chat' }
  ];
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Membership Overview</h2>
      {/* { JSON.stringify(userData) } */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Member Details" items={membershipDetails} />
        <StatCard title="Points & Ranking" items={activityStats} />
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
              Update Profile
            </button>
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition">
              View Benefits
            </button>
            <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivities.map(activity => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, items }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <h3 className="text-lg font-medium text-gray-800 mb-4">{title}</h3>
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="flex justify-between items-center">
          <div className="text-gray-500">{item.label}:</div>
          <div className="font-medium text-gray-800">{item.value}</div>
        </div>
      ))}
    </div>
  </div>
);

const ActivityItem = ({ activity }) => {
  const iconColors = {
    clock: 'bg-blue-100 text-blue-600',
    document: 'bg-green-100 text-green-600',
    chat: 'bg-indigo-100 text-indigo-600'
  };
  
  return (
    <div className="flex items-start">
      <div className={`p-2 rounded-full mr-3 ${iconColors[activity.icon]}`}>
        {activity.icon === 'clock' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )}
        {activity.icon === 'document' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        )}
        {activity.icon === 'chat' && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
          </svg>
        )}
      </div>
      <div>
        <p className="font-medium text-gray-800">{activity.title}</p>
        <p className="text-sm text-gray-500">{activity.time}</p>
      </div>
    </div>
  );
};

export default OverviewTab; 