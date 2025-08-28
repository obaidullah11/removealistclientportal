import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Star, Users, Truck, Shield, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/Footer';

const Partners = () => {
  const partners = [
    {
      id: 'men-in-black-removals',
      name: 'Men in Black Removals',
      description: 'Men in Black Removals offers efficient and affordable house moving services in Sydney, ensuring a smooth relocation experience for families and individuals.',
      website: 'https://www.meninblackremovals.com.au',
      location: 'Sydney, NSW',
      rating: 4.8,
      reviews: 120,
      specialties: [
        'House Removals',
        'Residential Moving',
        'Local Relocations', 
        'Furniture Moving',
        'Packing Services',
        'Loading & Unloading'
      ],
      features: [
        'Affordable Pricing',
        'Experienced Team',
        'Reliable Service',
        'Careful Handling',
        'Local Expertise',
        'Customer Focused'
      ],
      logo: '/images/partners/men-in-black-logo.png', // You can add this later
      established: '2010',
      employees: '25+'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Our Trusted Partners
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                We've partnered with Australia's most reliable moving and removal companies 
                to ensure you get the best service for your relocation needs.
              </p>
              <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Fully Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-600" />
                  <span>Quality Assured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span>Customer Approved</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-12"
            >
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="grid lg:grid-cols-2 gap-0">
                    {/* Partner Info */}
                    <div className="p-8 lg:p-12">
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {partner.name}
                          </h2>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{partner.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>{partner.rating} ({partner.reviews} reviews)</span>
                            </div>
                          </div>
                        </div>
                        {/* Logo placeholder - you can add actual logo later */}
                        <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center">
                          <Truck className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      <p className="text-gray-600 mb-8 leading-relaxed">
                        {partner.description}
                      </p>

                      {/* Company Stats */}
                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Established</h4>
                          <p className="text-gray-600">{partner.established}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Team Size</h4>
                          <p className="text-gray-600">{partner.employees} employees</p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Button
                        onClick={() => window.open(partner.website, '_blank')}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Website
                      </Button>
                    </div>

                    {/* Services & Features */}
                    <div className="bg-gray-50 p-8 lg:p-12">
                      <div className="space-y-8">
                        {/* Specialties */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-primary-600" />
                            Services Offered
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {partner.specialties.map((specialty, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-gray-700"
                              >
                                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                <span className="text-sm">{specialty}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Features */}
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary-600" />
                            Why Choose Them
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {partner.features.map((feature, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-gray-700"
                              >
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Partnership Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-20"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  Partnership Benefits
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Verified Quality
                    </h3>
                    <p className="text-gray-600">
                      All our partners are thoroughly vetted and maintain high service standards.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Best Rates
                    </h3>
                    <p className="text-gray-600">
                      Exclusive partnership rates and special discounts for RemoveAList users.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Seamless Experience
                    </h3>
                    <p className="text-gray-600">
                      Integrated booking and communication through our platform.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center mt-16"
            >
              <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">
                  Ready to Move with Our Partners?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Get connected with verified removal professionals for your next move.
                </p>
                <Button
                  onClick={() => window.location.href = '/my-move'}
                  className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Start Your Move
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default Partners;
