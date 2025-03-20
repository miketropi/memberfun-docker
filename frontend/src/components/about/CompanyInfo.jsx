import React from 'react';
import { motion } from 'framer-motion';

const CompanyInfo = ({ 
  title = "Our Story",
  description = "We are a team of professional, dedicated developers who are always patient with their work.",
  whatWeDo = {
    title: "What We Do",
    content: "We specialize in creating intuitive membership management solutions that help organizations focus on what matters most - their members."
  },
  expertise = {
    title: "Our Expertise",
    items: [
      'React Development',
      'Next.js & Server Components',
      'Tailwind CSS & UI Design',
      'TypeScript Integration',
      'API Development & GraphQL',
      'Cloud & DevOps Solutions'
    ]
  },
  stats = [
    {
      value: "500+",
      label: "Happy Customers"
    },
    {
      value: "98%", 
      label: "Client Satisfaction"
    },
    {
      value: "24/7",
      label: "Support Available"  
    },
    {
      value: "8+",
      label: "Years Experience"
    }
  ]
}) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-16"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-gray-900">{title}</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900">{whatWeDo.title}</h3>
                <p className="text-gray-600">
                  {whatWeDo.content}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-medium text-gray-900">{expertise.title}</h3>
                <ul className="grid grid-cols-2 gap-3">
                  {expertise.items.map((item) => (
                    <li key={item} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900">Our Impact</h3>
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CompanyInfo;