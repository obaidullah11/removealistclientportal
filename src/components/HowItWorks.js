import React from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Calendar, 
  MapPin, 
  Heart, 
  DollarSign, 
  Sparkles, 
  Phone,
  CheckCircle,
  Leaf,
  Shield,
  Zap,
  Users
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HowItWorks = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStartMove = () => {
    if (isAuthenticated) {
      navigate('/my-move');
    } else {
      navigate('/signup');
    }
  };

  const handleBookTime = () => {
    if (isAuthenticated) {
      navigate('/my-bookings');
    } else {
      navigate('/login');
    }
  };

  const renderStepImage = (stepNumber) => {
    const imagePath = `/images/step${stepNumber}.png`;
    
    return (
      <>
        <img 
          src={imagePath} 
          alt={`Step ${stepNumber} screenshot`}
          className="max-w-full max-h-full object-contain rounded-2xl"
          style={{ 
            width: 'auto', 
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%'
          }}
          onError={(e) => {
            // Fallback to mock screen if image doesn't exist
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        {/* Fallback mock screen for missing images */}
        <div className="hidden w-full max-w-md">
          {renderMockScreen(stepNumber)}
        </div>
      </>
    );
  };

  const renderMockScreen = (stepNumber) => {
    switch (stepNumber) {
      case '1':
        return (
          <div className="h-full bg-gray-50 p-4">
            <div className="bg-white rounded-lg p-6 h-full">
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-primary-500 rounded-full mx-auto mb-3"></div>
                <h3 className="text-lg font-semibold text-gray-900">Create Account</h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                </div>
                <div className="h-10 bg-primary-500 rounded text-white flex items-center justify-center text-sm font-medium mt-6">
                  Sign Up Free
                </div>
                <div className="text-center text-xs text-gray-500 mt-4">
                  ✓ Free AI moving plan included
                </div>
              </div>
            </div>
          </div>
        );

      case '2':
        return (
          <div className="h-full bg-gray-50 p-4">
            <div className="bg-white rounded-lg p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Moving Date</h3>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div key={i} className="text-xs text-center text-gray-500 p-1">{day}</div>
                ))}
                {Array.from({ length: 30 }, (_, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full flex items-center justify-center text-xs ${
                    i === 15 ? 'bg-primary-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}>
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className="bg-primary-50 rounded-lg p-3">
                <div className="text-sm text-primary-700">
                  📅 AI will create personalized timeline
                </div>
              </div>
            </div>
          </div>
        );

      case '3':
        return (
          <div className="h-full bg-gray-50 p-4">
            <div className="bg-white rounded-lg p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Move Details</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                  <div className="text-xs text-gray-500">Current Address</div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-10 bg-gray-100 rounded border"></div>
                  <div className="text-xs text-gray-500">New Address</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-100 rounded border"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-100 rounded border"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case '4':
        return (
          <div className="h-full bg-gray-50 p-4">
            <div className="bg-white rounded-lg p-6 h-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Requirements</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-primary-500 rounded"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-300 rounded"></div>
                    <span className="text-sm text-gray-700">Moving with Pets</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-gray-300 rounded"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-300 rounded"></div>
                    <span className="text-sm text-gray-700">Moving with Kids</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-primary-500 rounded"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-300 rounded"></div>
                    <span className="text-sm text-gray-700">Hiring Movers</span>
                  </div>
                </div>
                <div className="bg-primary-50 rounded-lg p-3 mt-4">
                  <div className="text-sm text-primary-700">
                    🎯 AI customizes plan based on your needs
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case '5':
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget Calculator</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-100 rounded border flex items-center px-3">
                    <span className="text-gray-500">$</span>
                    <span className="ml-2 text-gray-700">5,000</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Packing Materials</span>
                    <span className="text-gray-900">$200</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transportation</span>
                    <span className="text-gray-900">$1,500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Storage (1 month)</span>
                    <span className="text-gray-900">$300</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Estimated</span>
                      <span className="text-black">$2,000</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-700">
                    🌱 Eco-friendly options available
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case '7':
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Free Consultation</h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-8 h-8 text-black" />
                  </div>
                  <div className="text-sm text-gray-600 mb-4">Schedule your free call with our experts</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Mon, Dec 16</div>
                      <div className="text-xs text-gray-500">2:00 PM - 3:00 PM</div>
                    </div>
                    <div className="text-xs bg-gray-100 text-black px-2 py-1 rounded">Available</div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-3 h-3 bg-black rounded-full"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Tue, Dec 17</div>
                      <div className="text-xs text-gray-500">10:00 AM - 11:00 AM</div>
                    </div>
                    <div className="text-xs bg-gray-100 text-black px-2 py-1 rounded">Available</div>
                  </div>
                </div>
                <button 
                  onClick={handleBookTime}
                  className="h-10 bg-black rounded text-white flex items-center justify-center text-sm font-medium w-full hover:bg-gray-800 transition-colors"
                >
                  Book Free Call
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-black" />
              </div>
              <p className="text-black font-medium">Mock Screen</p>
            </div>
          </div>
        );
    }
  };

  const steps = [
    {
      number: '1',
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Start by creating your free account.',
      details: [
        <>Everyone gets a <strong>free AI-generated moving plan</strong> tailored to their unique moving needs.</>,
        'Upgrade to premium features — coming soon! — for advanced tools and exclusive services.'
      ],
      image: '/images/signup-screen.png'
    },
    {
      number: '2',
      icon: Calendar,
      title: 'Enter Your Moving Date',
      description: 'Tell us when you\'re planning to move.',
      details: [
        'Our AI uses this date to create a personalized timeline with smart reminders to keep you on track.'
      ],
      image: '/images/calendar-moving-date.png'
    },
    {
      number: '3',
      icon: MapPin,
      title: 'Provide Your Move Details',
      description: 'Add your Current and New addresses plus additional information like:',
      details: [
        'Apartment or House',
        'Renting or Ownership',
        <>RemoveAlist factors everything into your plan so you always get the best <strong>free AI-generated moving plan</strong> for your situation.</>
      ],
      image: '/images/address-form.png'
    },
    {
      number: '4',
      icon: Heart,
      title: 'Add Special Requirements',
      description: 'Tell us if you\'re:',
      details: [
        'Moving with Pets or Kids',
        'Doing a Self Move or Hiring Movers',
        'Our AI customizes your plan based on what matters most to you.'
      ],
      image: '/images/family-pets-illustration.png'
    },
    {
      number: '5',
      icon: DollarSign,
      title: 'Set Your Budget',
      description: 'Enter your budget so we can recommend cost-effective and eco-friendly solutions for packing, transport, and storage.',
      details: [],
      image: '/images/budget-calculator.png'
    },
    {
      number: '6',
      icon: Sparkles,
      title: 'Create My Move',
      description: 'Click Create My Move to instantly generate your free AI-powered moving plan with all the above factors included.',
      details: [],
      image: '/images/ai-plan-preview.png'
    },
    {
      number: '7',
      icon: Phone,
      title: 'Book a Free Call with the RemoveAlist Team',
      description: 'Once your plan is ready, book a free appointment with our moving experts to start the offline process and get tailored advice for a stress-free move.',
      details: [],
      image: '/images/booking-call-interface.png'
    }
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: 'Free AI-Generated Moving Plan',
      description: 'For any type of move.'
    },
    {
      icon: Zap,
      title: 'Upgrade Anytime',
      description: 'Premium features available soon!'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly Solutions',
      description: 'Make your move greener and cheaper.'
    },
    {
      icon: Users,
      title: 'Expert Guidance',
      description: 'Free call with the RemoveAlist team.'
    },
    {
      icon: Shield,
      title: 'All-in-One Platform',
      description: 'Every tool you need in one place.'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-black mb-6"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto"
          >
            Moving made simple, sustainable, and stress-free — with your <strong>free AI-generated moving plan</strong> included!
          </motion.p>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch gap-12`}
            >
              {/* Content */}
              <div className="flex-1 flex">
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 w-full flex flex-col">
                  {/* Step Number */}
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg">
                      {step.number}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-2xl font-bold text-black mb-4 break-words">{step.title}</h3>
                  <p className="text-lg text-gray-600 mb-4 break-words leading-relaxed">{step.description}</p>

                  {/* Details */}
                  {step.details.length > 0 && (
                    <ul className="space-y-2 flex-1">
                      {step.details.map((detail, detailIndex) => (
                        <li key={detailIndex} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600 break-words leading-relaxed">
                            {typeof detail === 'string' ? detail : detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {/* Step Image */}
              <div className="flex-1 flex items-center justify-center">
                {renderStepImage(step.number)}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Our AI-Powered Tool */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-black mb-4">
              Why Choose Our AI-Powered Tool?
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-black" />
                </div>
                <h4 className="text-lg font-semibold text-black mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <button 
            onClick={handleStartMove}
            className="px-10 py-4 bg-black text-white rounded-2xl font-semibold text-lg hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Your Move Today
          </button>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 bg-gray-50 rounded-2xl p-8 border border-gray-200"
        >
          <h4 className="text-lg font-semibold text-black mb-4">Disclaimer</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            The AI-generated moving plan is provided as a guideline only. Steps may vary based on individual moves, user inputs, and other factors. Simply Save Australia Pty Ltd (RemoveAlist) is not liable for any false, incomplete, or inaccurate information provided by users or third parties.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;


