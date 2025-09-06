import React from "react";
import { motion } from "framer-motion";
import { Home, Users, Heart, CheckCircle, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Discounts = () => {
  const discountOptions = [
    {
      id: "first-home-buyer",
      title: "First Home Buyer",
      description:
        "Special discount for first-time home buyers starting their journey",
      discount: "15% OFF",
      icon: Home,
      benefits: [
        "Priority booking slots",
        // 'Free moving consultation',
        // 'Complimentary packing materials',
        "First-time buyer support guide",
      ],
    },
    {
      id: "seniors-discount",
      title: "Seniors Discount",
      description: "Exclusive savings and specialized care for seniors (65+)",
      discount: "20% OFF",
      icon: Heart,
      benefits: [
        "Gentle handling guarantee",
        "Extended service hours",
        "Senior-friendly support team",
        "Medical equipment care",
      ],
    },
    {
      id: "single-parent",
      title: "Single Parent",
      description: "Supporting single-parent families with flexible solutions",
      discount: "18% OFF",
      icon: Users,
      benefits: [
        "Flexible payment options",
        "Child-safe moving practices",
        "Weekend availability",
        "Family support resources",
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl">
              <Percent className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
              Special Discounts
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe everyone deserves affordable, quality moving services.
            Learn about our special discount programs designed for different life
            situations.
          </p>
        </motion.div>

        {/* Discount Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-3"
        >
          {discountOptions.map((option, index) => {
            const IconComponent = option.icon;

            return (
              <motion.div
                key={option.id}
                variants={cardVariants}
                className="h-full"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg max-w-sm mx-auto h-full flex flex-col">
                  {/* Icon and Discount Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="p-3 bg-black rounded-xl">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-black text-white font-bold text-sm">
                      {option.discount}
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mb-6">{option.description}</p>

                  {/* Benefits List */}
                  <div className="flex-grow">
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-black" />
                      What's Included:
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {option.benefits.map((benefit, benefitIndex) => (
                        <motion.li
                          key={benefitIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: 0.1 * benefitIndex,
                          }}
                          className="flex items-start gap-2 text-gray-600"
                        >
                          <CheckCircle className="w-3 h-3 mt-1 text-black flex-shrink-0" />
                          <span className="text-sm">{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Informational Badge */}
                  <div className="w-full px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold text-center border-2 border-gray-200">
                    Available: {option.discount}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Terms */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            * Terms and conditions apply. Discounts cannot be combined with
            other offers. Verification may be required for eligibility. Contact us for more information.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Discounts;
