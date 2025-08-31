import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Package, Layers, CheckCircle, Shield, Leaf } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Smart Inventory',
      description: 'AI-powered room-by-room inventory with photo capture and volume estimation',
      color: 'text-white',
      bgColor: 'bg-black',
    },
    {
      icon: Package,
      title: 'Quotes',
      description: 'Verified quotes from trusted removalists and service providers',
      color: 'text-white',
      bgColor: 'bg-black',
    },
    {
      icon: Layers,
      title: 'Weekly Plan',
      description: 'Detailed weekly plan and Move day checklist.',
      color: 'text-white',
      bgColor: 'bg-black',
    },
    {
      icon: CheckCircle,
      title: 'Task Management',
      description: 'AI-generated checklists and reminders for every stage of your move',
      color: 'text-white',
      bgColor: 'bg-black',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'security with verified partners and protected transactions',
      color: 'text-white',
      bgColor: 'bg-black',
    },
    {
      icon: Leaf,
      title: 'Eco Solutions',
      description: 'Carbon-smart routing, recycling options, and sustainable partner network',
      color: 'text-white',
      bgColor: 'bg-black',
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Everything You Need for a Smooth Move
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-600"
          >
            Our AI-powered platform handles every aspect of your relocation
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;


