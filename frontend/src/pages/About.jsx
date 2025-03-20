import React from 'react';
import AboutHeader from '../components/about/AboutHeader';
import CompanyInfo from '../components/about/CompanyInfo';
import MissionVision from '../components/about/MissionVision';
import TeamSection from '../components/about/TeamSection';
import HistoryTimeline from '../components/about/HistoryTimeline';

const About = () => {
  return (
    <div className="bg-white">
      {/* Header */}
      <AboutHeader />

      {/* Company Info */}
      <CompanyInfo />

      {/* Mission and Vision */} 
      <MissionVision />

      {/* Team Section */}
      <TeamSection />

      {/* History Timeline */}
      <HistoryTimeline />
    </div>
  );
};

export default About; 