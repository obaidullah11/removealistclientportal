import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MapPin, Star, Truck, Shield } from 'lucide-react';

const PartnerSection = () => {
  const partner = {
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
    established: '2010',
    employees: '25+'
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured Partner
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet one of our trusted removal partners who can help make your move seamless and stress-free.
          </p>
        </motion.div>

        {/* Partner Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden max-w-5xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Partner Info */}
            <div className="p-8 lg:p-12">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {partner.name}
                  </h3>
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
                {/* Logo placeholder */}
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
              <button
                onClick={() => window.open(partner.website, '_blank')}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Website
              </button>
            </div>

            {/* Services & Features */}
            <div className="bg-gray-50 p-8 lg:p-12">
              <div className="space-y-8">
                {/* Services */}
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary-600" />
                    Services Offered
                  </h4>
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
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary-600" />
                    Why Choose Them
                  </h4>
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

        {/* View All Partners CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => window.location.href = '/partners'}
            className="px-8 py-3 bg-white text-primary-600 border-2 border-primary-600 rounded-xl font-semibold hover:bg-primary-50 transition-all duration-200"
          >
            View All Partners
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnerSection;
