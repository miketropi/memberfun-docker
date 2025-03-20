import React from 'react';

const MissionVision = ({
  bgColor = "bg-gradient-to-br from-slate-50 to-indigo-50",
  missionTitle = "Our Mission 🎯",
  missionContent = [
    "🚀 Our mission is to empower businesses with cutting-edge web development solutions that drive digital transformation and create exceptional online experiences.",
    "💡 We believe in crafting innovative, scalable, and user-centric web applications that help our clients stay ahead in the rapidly evolving digital landscape."
  ],
  visionTitle = "Our Vision 🔭",
  visionContent = [
    "🌏 We envision a world where every business, regardless of size or industry, has access to high-quality web development services that drive their digital success.",
    "⭐ Our goal is to become the leading web development agency, known for our technical excellence, innovative solutions, and dedication to exceeding client expectations."
  ]
}) => {
  return (
    <div className={`${bgColor} py-24 relative overflow-hidden`}>
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,transparent,black)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16">
          <div className="backdrop-blur-sm bg-white/30 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {missionTitle}
            </h2>
            {missionContent.map((paragraph, index) => (
              <p key={index} className="mt-6 text-md text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 lg:mt-0 backdrop-blur-sm bg-white/30 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {visionTitle}
            </h2>
            {visionContent.map((paragraph, index) => (
              <p key={index} className="mt-6 text-md text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MissionVision;