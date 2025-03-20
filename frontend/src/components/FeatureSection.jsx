import React from 'react';
import FeatureCard from './FeatureCard';
import { Users, Calendar, Mail } from 'lucide-react';

const FeatureSection = () => {
  const features = [
    {
      title: "Profile Management",
      description: "Easily add, edit, and manage your profile with our intuitive interface.",
      color: "indigo",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "Seminal Scheduling", 
      description: "Create and manage events, track attendance, and send reminders to your members.", 
      color: "purple",
      icon: <Calendar className="h-6 w-6" />
    },
    {
      title: "Communication Tools",
      description: "Send newsletters, announcements, and important updates to your members with ease.",
      color: "pink",
      icon: <Mail className="h-6 w-6" />
    }
  ];

  return (
    <div className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Everything you need in one place
          </p>
          <p className="mt-5 text-xl text-gray-500">
            MemberFun a place that provides tools for you to easily communicate and manage your information.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                color={feature.color}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection; 