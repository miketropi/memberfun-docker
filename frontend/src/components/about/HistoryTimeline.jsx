import React from 'react';

const HistoryTimeline = () => {
  const timelineItems = [
    {
      year: "2025",
      title: "🎉 Foundation",
      description: "🚀 On March 16th, 2025, we launched MemberFun with a vision to revolutionize member management, event scheduling, and reward point systems for organizations. 🌟"
    },
    {
      year: "2025", 
      title: "👥 Member Management Launch",
      description: "📊 Rolled out our core member management features, enabling organizations to efficiently track and engage with their members through detailed profiles and analytics. 📈"
    },
    {
      year: "2025",
      title: "📅 Event & Schedule System", 
      description: "🎯 Introduced comprehensive event planning and scheduling capabilities, allowing organizations to create, manage and track attendance for various activities and meetings. ✨"
    },
    {
      year: "2025",
      title: "🏆 Points & Rewards",
      description: "💎 Implemented an innovative points system where members can earn and redeem rewards for their participation and contributions within the organization. 🎁"
    }
  ];

  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Journey</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            MemberFun History
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            From our humble beginnings to where we are today, here's our story.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {timelineItems.map((item, index) => (
              <div className="relative" key={index}>
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{item.year} - {item.title}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default HistoryTimeline; 