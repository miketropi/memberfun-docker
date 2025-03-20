import React from 'react';

const AboutHeader = () => {
  return (
    <div className="bg-blue-600">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">About Us</h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-200">
            Learn more about MemberFun and our mission to simplify membership management.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutHeader; 