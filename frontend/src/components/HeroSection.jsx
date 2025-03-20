import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          poster="https://i.pinimg.com/1200x/d1/35/56/d13556ec053cffc2410a682ee33436d6.jpg"
        >
          <source src="/video-77a4da11.mp4" type="video/mp4" />
          {/* Fallback image if video fails to load */}
          <img
            className="w-full h-full object-cover"
            src="https://i.pinimg.com/1200x/d1/35/56/d13556ec053cffc2410a682ee33436d6.jpg"
            alt="Collaborative workspace"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-purple-800/80 opacity-50" aria-hidden="true"></div>
      </div>
      
      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            <span className="block">Communication space of Beplus members</span>
          </h1>
          <p className="mt-6 text-xl text-indigo-100 max-w-2xl mx-auto">
            A place to exchange technology articles, seminar schedules and manage each member's bonus points.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-indigo-700 bg-white shadow-sm hover:bg-indigo-50 transition-all duration-200 transform hover:-translate-y-1"
            >
              Get Started
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-6 py-3 border border-indigo-300 text-base font-medium rounded-full text-white hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-1"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute bottom-0 right-0 transform translate-y-1/2 -translate-x-1/4 lg:translate-x-0 hidden lg:block">
        <div className="w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-20 blur-3xl"></div>
      </div>
    </div>
  );
};

export default HeroSection;