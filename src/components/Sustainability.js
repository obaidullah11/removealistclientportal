import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Recycle, Truck, Package } from 'lucide-react';

const Sustainability = () => {
  const ecoFeatures = [
    {
      icon: '🌱',
      title: 'Carbon Tracking',
      description: 'Monitor and offset your move\'s carbon footprint',
      iconComponent: Leaf,
    },
    {
      icon: '♻️',
      title: 'Recycling Network',
      description: 'Connect with local recycling and donation centers',
      iconComponent: Recycle,
    },
    {
      icon: '🚛',
      title: 'Eco Partners',
      description: 'Partners using EVs and sustainable practices',
      iconComponent: Truck,
    },
    {
      icon: '📦',
      title: 'Smart Packing',
      description: 'Reusable materials and minimal waste strategies',
      iconComponent: Package,
    },
  ];

  return (
    <section id="sustainability" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Moving Towards a Greener Future
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Our commitment to sustainable moving practices
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ecoFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-primary-50 p-6 rounded-2xl text-center hover:bg-primary-100 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Environmental Impact Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-primary-500 to-primary-600 p-8 md:p-12 rounded-3xl"
        >
          <div className="grid md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">2.5M kg</div>
              <div className="text-white/90">CO₂ Offset</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">85%</div>
              <div className="text-white/90">Waste Diverted from Landfill</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-white/90">Items Donated</div>
            </div>
          </div>
        </motion.div>

        {/* Sustainability Commitment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-3 bg-primary-50 px-6 py-3 rounded-full">
            <Leaf className="w-6 h-6 text-primary-600" />
            <span className="text-primary-700 font-medium">
              Certified B Corporation • Carbon Neutral by 2025
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Sustainability;


