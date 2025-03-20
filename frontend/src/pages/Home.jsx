import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureSection from '../components/FeatureSection';
import TestimonialSection from '../components/TestimonialSection';
import NewsletterSection from '../components/NewsletterSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <NewsletterSection />
    </div>
  );
};

export default Home; 