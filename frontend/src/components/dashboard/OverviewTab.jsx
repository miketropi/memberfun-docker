import { useEffect, useState } from 'react';
import React from 'react';
import { pointsAPI, generalAPI } from '../../api/apiService';
import UserRank from '../UserRank';
import { Beer, Calendar, FileText, MessageCircle } from 'lucide-react';
import StatBlock from '../common/StatBlock';
import StatBlockPointsAnalysis from '../common/StatBlockPointsAnalysis';
import ClaimPointsDaily from '../common/ClaimPointsDaily';

const OverviewTab = ({ userData }) => {
  const [activityStats, setActivityStats] = useState([
    { label: 'Member Points', value: 0 },
    { label: 'Ranking', value: 'N/A' },
  ]);

  const [dashboardOverview, setDashboardOverview] = useState({});

  const fetchDashboardOverview = async () => {
    const response = await generalAPI.getDashboardOverview(userData.id);
    setActivityStats([
      { label: 'Member Points', value: response.total_points },
      { label: 'Ranking', value: <UserRank rank={ response.rank } /> },
    ]);
    setDashboardOverview(response);
  };

  // fetch dashboard overview
  useEffect(() => {

    // validate userData?.id
    if(userData?.id) {
      fetchDashboardOverview();
    }
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
    // { id: 1, title: 'Logged in from new device', time: '2 days ago', icon: 'clock' },
    // { id: 2, title: 'Downloaded Member Benefits Guide', time: '5 days ago', icon: 'document' },
    { id: 1, title: 'Welcome to MemberFun!', time: 'N/A', icon: 'Beer' }
  ];

  // Function to convert transaction data and group points by date
  const convertTransactionsToChartData = (transactions) => {
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Points',
          data: [],
          fill: false,
          tension: 0.1,
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1,
        }]
      };
    }

    // Group transactions by date
    const pointsByDate = {};
    
    transactions.forEach(transaction => {
      // Extract date part only (YYYY-MM-DD)
      const date = transaction.created_at.split(' ')[0];
      const points = parseInt(transaction.points, 10);
      
      // Initialize date if not exists
      if (!pointsByDate[date]) {
        pointsByDate[date] = 0;
      }
      
      // Add or subtract points based on transaction type
      if (transaction.type === 'add') {
        pointsByDate[date] += points;
      } else if (transaction.type === 'subtract') {
        pointsByDate[date] -= points;
      }
    });

    // Convert to arrays for chart
    const sortedDates = Object.keys(pointsByDate).sort();
    const pointsArray = sortedDates.map(date => pointsByDate[date]);

    return {
      labels: sortedDates,
      datasets: [{
        label: 'Points',
        data: pointsArray,
        fill: false,
        tension: 0.1,
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      }]
    };
  };

  // const pointsData = {
  //   labels: ['2024-01', '2024-02', '2024-03', '2024-04'],
  //   datasets: [{
  //     label: 'Points',
  //     data: [100, 150, 200, 180],
  //     fill: false,
  //     // borderColor: 'rgb(75, 192, 192)',
  //     tension: 0.1,

  //     backgroundColor: 'rgba(75, 192, 192, 0.5)',
  //     borderColor: 'rgb(75, 192, 192)',
  //     borderWidth: 1,
  //   }]
  // };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Membership Overview</h2>
      {/* { JSON.stringify(userData) } */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Member Details" items={membershipDetails} />
        <StatCard title="Points & Ranking" items={activityStats} />
        
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button disabled={true} className="disabled:opacity-50 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
              Update Profile
            </button>
            <button disabled={true} className="disabled:opacity-50 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition">
              View Benefits
            </button>
            <button disabled={true} className="disabled:opacity-50 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition">
              Contact Support
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* {  } */}
        {/* Points Analysis */}
        <StatBlockPointsAnalysis data={ convertTransactionsToChartData(dashboardOverview?.transactions) } />

        {/* Count your seminars */}
        <StatBlock icon={Calendar} duration={1000} title="Total Seminars" number={dashboardOverview?.total_seminars} description="Total number of seminars you are hosting, contact with admin to register for seminars and get more information" />
        {/* Count your submissions */}
        <StatBlock icon={FileText} duration={1000} title="Total Submissions" number={dashboardOverview?.total_submissions} description="Total number of submissions made by you, join challenge and submit your work to get more points." />
        {/* Count your comments */}
        {/* <StatBlock icon={MessageCircle} duration={1000} title="Comments from your" number={10} description="Total number of comments made, actively participate and grow the community with your contributions." /> */}
      </div>

      {/** Claim Points Daily */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Claim Points Daily</h3>
        <ClaimPointsDaily lastClaimDate={dashboardOverview?.last_claim_date} serverCurrentDate={dashboardOverview?.server_current_date} updatedUserPoints={ (points) => {
          // console.log(points);
          fetchDashboardOverview()
        } } />
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
    <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
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
        {activity.icon === 'Beer' && (
          <Beer className="h-5 w-5" />
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