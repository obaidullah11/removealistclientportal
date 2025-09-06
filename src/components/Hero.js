import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { moveAPI } from '../lib/api';

const Hero = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleStartMove = async () => {
    if (isAuthenticated) {
      try {
        // Check if user has existing moves
        const movesResult = await moveAPI.getUserMoves();
        if (movesResult.success && movesResult.data && movesResult.data.length > 0) {
          // User has existing moves, navigate to user-moves page
          navigate('/user-moves');
        } else {
          // User has no moves, navigate to create move page
          navigate('/my-move');
        }
      } catch (error) {
        console.error('Error checking user moves:', error);
        // Fallback to create move page if there's an error
        navigate('/my-move');
      }
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

  return (
    <section className="relative pt-8 pb-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-100 rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-200 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered,{' '}
              <span className="bg-[#009A64] bg-clip-text text-transparent">
                Sustainable
              </span>{' '}
              Moving Solutions
            </h1>

            <p className="text-xl text-gray-600 mb-8">
            RemoveAlist is a unique AI-powered platform designed to provide a personalised concierge service for a truly stress-free moving experience. By streamlining every step, RemoveAlist helps users save both time and money, while ensuring a smooth transition. 
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartMove}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-[#009A64] text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <ArrowRight className="w-5 h-5" />
                Start Your Move
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBookTime}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black border-2 border-black rounded-lg font-medium hover:bg-gray-100 transition-all duration-200"
              >
                <Calendar className="w-5 h-5 text-black" />
                Book a Time
              </motion.button>
            </div>
            
            <div className="flex flex-nowrap gap-2">
              {["AI Checklists", "Moving with Pets", "Garage Sale", "Recycle"].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + index * 0.1 }}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-sm border border-gray-200"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Info Card Container */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold text-black mb-6">What you'll get</h3>

              <div className="space-y-4 text-black">
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-xl mt-1">•</span>
                  <p className="text-lg">Smart, room-by-room inventory (photos + volumes)</p>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-xl mt-1">•</span>
                  <p className="text-lg">Concierge for removals, packing, cleaning & utilities</p>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-xl mt-1">•</span>
                  <p className="text-lg">Address change assistant for Australian services</p>
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="flex items-start gap-3"
                >
                  <span className="text-xl mt-1">•</span>
                  <p className="text-lg">Eco tips: donation, recycling & circular options</p>
                </motion.div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                onClick={handleStartMove}
                className="w-full mt-8 py-4 bg-black text-white rounded-xl font-semibold text-lg hover:bg-gray-900 transition-all duration-200 shadow-lg"
              >
                Create my plan
              </motion.button>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white p-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <Shield className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-sm">Verified Partners</span>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              className="absolute -bottom-4 -left-4 bg-white p-3 rounded-xl shadow-lg flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-sm">AI-Powered</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;


