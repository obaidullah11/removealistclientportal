import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, MapPin, FileText, Truck } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      number: '1',
      icon: UserPlus,
      title: 'Sign Up & Verify',
      description: 'Create your account with email and Australian phone number. Verify with OTP for security.',
    },
    {
      number: '2',
      icon: MapPin,
      title: 'Plan Your Move',
      description: 'Enter addresses, create inventory, and let AI generate your personalized moving plan.',
    },
    {
      number: '3',
      icon: FileText,
      title: 'Get Quotes',
      description: 'Receive  quotes from verified partners.',
    },
    {
      number: '4',
      icon: Truck,
      title: 'Move Day',
      description: 'Manage tasks, and enjoy a stress-free relocation.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Moving Made Simple
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Get started in minutes with our streamlined process
          </motion.p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                <div className="text-center">
                  {/* Step Number */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-12 h-12 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 relative z-10"
                  >
                    {step.number}
                  </motion.div>

                  {/* Icon */}
                  <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="w-10 h-10 text-primary-600" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Start Your Move Today
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;


