import React, { useState } from 'react';
import Modal from './Modal';

const UserRank = ({ rank }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Rank styles with modern color schemes
  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-rose-500 to-pink-500 text-white border-rose-400 shadow-lg'; // Diamond
      case 2:
        return 'bg-gradient-to-br from-violet-500 to-purple-500 text-white border-violet-400 shadow-md'; // Master
      case 3:
        return 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-md'; // Expert
      case 4:
      case 5:
        return 'bg-gradient-to-br from-sky-500 to-blue-500 text-white border-sky-400 shadow-sm'; // Advanced
      default:
        return 'bg-gradient-to-br from-slate-500 to-gray-500 text-white border-slate-400 shadow-sm'; // Beginner
    }
  };

  // Modern rank titles
  const getRankTitle = (rank) => {
    switch (rank) {
      case 1:
        return 'Diamond';
      case 2:
        return 'Master';
      case 3:
        return 'Expert';
      case 4:
      case 5:
        return 'Advanced';
      default:
        return 'Beginner';
    }
  };

  // Modern rank badges
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1:
        return '💎';
      case 2:
        return '🌟';
      case 3:
        return '⭐';
      case 4:
      case 5:
        return '🚀';
      default:
        return '🍀';
    }
  };

  return <>
    <div className={`
      inline-flex items-center gap-3 px-4 py-2 
      rounded-full border
      hover:opacity-90 cursor-pointer
      transition-all duration-300 ease-in-out
      ${getRankStyle(rank)}
    `} onClick={() => setIsModalOpen(true)}>
      <span className="text-lg" role="img" aria-label={`Rank ${rank} badge`}>
        {getRankBadge(rank)}
      </span>
      <span className="font-medium">
        {getRankTitle(rank)}
      </span>
    </div>

    <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Rank Information">
      <div className="space-y-8">
        <div className="text-center">
          <span className="text-5xl block mb-3">{getRankBadge(rank)}</span>
          <h3 className="text-2xl font-bold text-gray-800">{getRankTitle(rank)}</h3>
          <p className="text-gray-500 mt-1">Level {rank}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-800 mb-3">Rank Description</h4>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {rank === 1 && "Diamond rank represents mastery and excellence. Reserved for members who consistently demonstrate exceptional contributions and leadership."}
            {rank === 2 && "Master rank signifies high expertise and dedication. These members are key contributors who help shape our community."}
            {rank === 3 && "Expert rank shows proficiency and commitment. These members actively participate and provide valuable contributions."}
            {(rank === 4 || rank === 5) && "Advanced rank indicates growing expertise and regular engagement. These members are on their way to becoming community leaders."}
            {rank > 5 && "Beginner rank is the starting point of your journey. Participate regularly to advance and unlock new opportunities."}
          </p>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h4 className="font-semibold text-gray-800 mb-4">Rank Privileges</h4>
          <ul className="space-y-3">
            {rank <= 3 && (
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Priority access to new features
              </li>
            )}
            {rank <= 5 && (
              <li className="flex items-center text-gray-700">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Special community badges
              </li>
            )}
            <li className="flex items-center text-gray-700">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              Participation rewards
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-800 mb-3">Advancement Tips</h4>
          <ul className="space-y-2 text-gray-600">
            <li>• Participate in community discussions</li>
            <li>• Complete available challenges</li>
            <li>• Help other community members</li>
            <li>• Contribute quality content</li>
          </ul>
        </div>
      </div>
    </Modal>
  </>;
};

export default UserRank;
