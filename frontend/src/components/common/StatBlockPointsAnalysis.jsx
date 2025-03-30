import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StatBlockPointsAnalysis = ({ data }) => {
  // Default data if none provided
  const defaultData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Points',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const chartData = data || defaultData;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Points Analysis Over Time',
      },
    },
    // scales: {
    //   y: {
    //     beginAtZero: true,
    //     title: {
    //       display: true,
    //       text: 'Points',
    //     },
    //   },
    //   x: {
    //     title: {
    //       display: true,
    //       text: 'Date',
    //     },
    //   },
    // },
    backgroundColor: 'rgba(75, 192, 75, 0.5)',
    borderColor: 'rgb(75, 192, 75)',
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default StatBlockPointsAnalysis;