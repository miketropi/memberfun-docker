import React from 'react';
import TestimonialCard from './TestimonialCard';

const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "MemberFun has transformed how we manage our community. It's intuitive, powerful, and our members love it!",
      name: "Sarah Johnson",
      role: "Community Manager",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      quote: "We've increased our membership by 40% since implementing MemberFun. The tools are exactly what we needed.",
      name: "Michael Chen",
      role: "Club President",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    },
    {
      quote: "The communication tools in MemberFun have helped us stay connected with our members like never before.",
      name: "Emily Rodriguez",
      role: "Non-profit Director",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    }
  ];

  return (
    <div className="py-24 bg-gradient-to-b from-white to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-sm font-semibold text-indigo-600 tracking-wide uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl font-bold text-gray-900 sm:text-4xl">
            Trusted by members
          </p>
        </div>
        
        <div className="mt-16 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2">
            <svg width="404" height="404" fill="none" viewBox="0 0 404 404" aria-hidden="true" className="text-indigo-100">
              <defs>
                <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <rect x="0" y="0" width="4" height="4" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
            </svg>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                quote={testimonial.quote}
                name={testimonial.name}
                role={testimonial.role}
                image={testimonial.image}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection; 