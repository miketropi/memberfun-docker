import React from 'react';
import {
  ContactHeader,
  ContactFormSection,
  MapSection,
  FAQSection
} from '../components/contact';

const Contact = () => {
  // Custom handler for form submission if needed
  const handleFormSubmit = (formData, setFormStatus) => {
    // In a real application, you would send the form data to your backend
    console.log('Form submitted:', formData);
    
    // Set success status
    setFormStatus({
      submitted: true,
      success: true,
      message: 'Thank you for your message! We will get back to you soon.',
    });
  };

  return (
    <div className="bg-white">
      {/* Header Section */}
      <ContactHeader 
        title="Contact Us"
        subtitle="Have questions or need assistance? We're here to help!"
      />

      {/* Contact Form and Info Section */}
      <ContactFormSection 
        contactInfoProps={{
          title: "Get in touch",
          description: "We'd love to hear from you! Send us a message using the form, or reach out to us directly using the contact information below.",
          address: {
            street: "170-172 Xuân Thuỷ Street",
            suite: "Khue Trung, Cam Le District",
            city: "Da Nang City, Vietnam"
          },
          phone: "+84 12 345 67 89",
          email: "info@memberfun.com",
          careerLink: "#",
          careerText: "View all job openings"
        }}
        contactFormProps={{
          onSubmit: handleFormSubmit,
          submitButtonText: "Submit"
        }}
      />

      {/* Map Section */}
      <MapSection 
        title="Our Location"
        subtitle="Visit Our Office"
        mapUrl="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5167.936583273005!2d108.21200311176071!3d16.026069840525757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219f34f2fa307%3A0x4e722ce9f20c80a8!2zMTcwIFh1w6JuIFRo4buneSwgS2h1w6ogVHJ1bmcsIEPhuqltIEzhu4csIMSQw6AgTuG6tW5nLCBWaWV0bmFt!5e1!3m2!1sen!2s!4v1742063339965!5m2!1sen!2s"
      />

      {/* FAQ Section */}
      <FAQSection 
        title="Frequently Asked Questions"
        faqs={[
          {
            question: "🚀 How do I start a web development project with you?",
            answer: "🤝 Starting is simple! Schedule a free consultation call where we'll discuss your project requirements, timeline, and goals. ✨ We'll then provide you with a detailed proposal tailored to your needs."
          },
          {
            question: "💻 What types of web development services do you offer?",
            answer: "🛠️ We offer full-stack web development including custom website development, web applications, e-commerce solutions, CMS development, API integration, and responsive design. 🔧 We work with modern technologies like React, Node.js, and Python."
          },
          {
            question: "⏱️ How long does a typical web development project take?",
            answer: "📅 Project timelines vary based on complexity and requirements. A simple website might take 4-6 weeks, while complex web applications can take 3-6 months. 📊 We'll provide a detailed timeline during our initial consultation."
          },
          {
            question: "⚙️ What is your development process?",
            answer: "🔄 We follow an agile methodology with clear phases: Requirements gathering, design, development, testing, and deployment. 📈 We maintain transparent communication and provide regular updates throughout the project."
          },
          {
            question: "🛡️ Do you provide maintenance and support after launch?",
            answer: "✅ Yes, we offer flexible maintenance packages to keep your website secure, up-to-date, and running smoothly. 🔒 This includes regular updates, security monitoring, backups, and technical support."
          },
          {
            question: "📱 How do you handle project communication?",
            answer: "💬 We use project management tools like Jira or Trello for tracking progress, and maintain regular communication through email, video calls, and a dedicated Slack channel. 👥 You'll have a project manager as your main point of contact."
          }
        ]}
      />
    </div>
  );
};

export default Contact; 