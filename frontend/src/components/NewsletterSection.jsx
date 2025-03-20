import React from 'react';

const NewsletterSection = () => {
  return (
    <div className="bg-gradient-to-r from-indigo-800 to-purple-800">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white" id="newsletter-headline">
            Stay updated with our newsletter
          </h2>
          <p className="mt-4 max-w-3xl text-lg text-indigo-100">
            Get the latest features, tips, and news about MemberFun delivered to your inbox.
          </p>
        </div>
        <div className="mt-8 lg:mt-0 lg:ml-8 lg:flex-1 lg:max-w-md">
          <form className="sm:flex flex-col sm:flex-row">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <div className="w-full">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-5 py-3 border-0 shadow-sm rounded-l-md focus:ring-2 focus:ring-white focus:outline-none"
                placeholder="Enter your email"
              />
            </div>
            <div className="mt-3 sm:mt-0 sm:flex-shrink-0">
              <button
                type="submit"
                className="w-full flex items-center justify-center px-5 py-3 border-0 rounded-l-0 rounded-r-md border-transparent text-base font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-white"
              >
                Subscribe
              </button>
            </div> 
          </form>
          <p className="mt-3 text-sm text-indigo-100">
            We care about your data. Read our{' '}
            <a href="#" className="text-white font-medium underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSection; 