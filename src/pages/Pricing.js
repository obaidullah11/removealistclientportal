import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Calendar,
  MapPin,
  Clock,
  Shield,
  Headphones,
  Truck,
  Package,
  Users,
  FileText,
  CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { showSuccess, showError } from '../lib/snackbar';

const Pricing = () => {
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('plus');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);

  // Mock pricing calculation based on location and timeline
  const [pricingFactors, setPricingFactors] = useState({
    location: 'Sydney, NSW',
    daysFromMove: 30,
    moveType: 'local',
    propertySize: '3-bedroom'
  });

  const calculatePrice = (basePriceMonthly, basePriceYearly) => {
    // Location multiplier
    const locationMultipliers = {
      'Sydney, NSW': 1.2,
      'Melbourne, VIC': 1.15,
      'Brisbane, QLD': 1.0,
      'Perth, WA': 1.1,
      'Adelaide, SA': 0.95
    };

    // Timeline multiplier (closer to move = higher price)
    const timelineMultiplier = pricingFactors.daysFromMove < 14 ? 1.3 : 
                              pricingFactors.daysFromMove < 30 ? 1.1 : 1.0;

    // Move type multiplier
    const moveTypeMultiplier = pricingFactors.moveType === 'interstate' ? 1.5 : 1.0;

    const locationMult = locationMultipliers[pricingFactors.location] || 1.0;
    const basePrice = billingCycle === 'monthly' ? basePriceMonthly : basePriceYearly;
    
    return Math.round(basePrice * locationMult * timelineMultiplier * moveTypeMultiplier);
  };

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for DIY movers who want basic planning tools',
      price: 0,
      yearlyPrice: 0,
      popular: false,
      color: 'gray',
      icon: Package,
      features: [
        'Basic moving timeline',
        'Simple inventory tracking',
        'Moving checklist',
        'Address change reminders',
        'Community support',
        'Basic moving tips',
        'PDF export of lists'
      ],
      limitations: [
        'No date changes permitted',
        'Limited customer support',
        'Basic templates only',
        'No priority booking'
      ]
    },
    {
      id: 'plus',
      name: 'Plan +',
      description: 'Enhanced features for organized movers',
      price: calculatePrice(49, 490),
      yearlyPrice: calculatePrice(490, 490),
      popular: true,
      color: 'blue',
      icon: Zap,
      features: [
        'Everything in Free',
        '1-2 date changes permitted',
        'Advanced inventory management',
        'QR code generation',
        'Photo documentation',
        'Service provider recommendations',
        'Priority customer support',
        'Custom timeline creation',
        'Collaboration tools',
        'Insurance guidance',
        'Moving cost calculator',
        'Email reminders & notifications'
      ],
      limitations: [
        'Limited date changes (1-2)',
        'Standard support hours'
      ]
    },
    {
      id: 'concierge',
      name: 'Concierge +',
      description: 'White-glove service for stress-free moving',
      price: calculatePrice(149, 1490),
      yearlyPrice: calculatePrice(1490, 1490),
      popular: false,
      color: 'purple',
      icon: Crown,
      features: [
        'Everything in Plan +',
        'Unlimited date changes',
        'Dedicated move coordinator',
        '24/7 priority support',
        'Personal moving consultant',
        'Service booking assistance',
        'Negotiated service rates',
        'Move day coordination',
        'Emergency support hotline',
        'Post-move follow-up',
        'Premium service providers',
        'Concierge task management',
        'VIP customer status'
      ],
      limitations: []
    }
  ];

  const handlePlanSelection = async (planId) => {
    if (!user) {
      showError('Please log in to select a plan');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement actual payment processing
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      
      showSuccess(`Successfully upgraded to ${plans.find(p => p.id === planId)?.name}!`);
      // Redirect to dashboard or payment page
    } catch (error) {
      showError('Failed to process plan selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full opacity-30 blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Moving Plan
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              From basic planning tools to full concierge service, we have the perfect plan for your moving needs
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${billingCycle === 'monthly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${billingCycle === 'yearly' ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingCycle === 'yearly' && (
                <Badge className="ml-2 bg-green-100 text-green-800">Save 20%</Badge>
              )}
            </div>

            {/* Pricing Factors Display */}
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-blue-600 mr-2" />
                      <span>{pricingFactors.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-green-600 mr-2" />
                      <span>{pricingFactors.daysFromMove} days out</span>
                    </div>
                    <div className="flex items-center">
                      <Truck className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="capitalize">{pricingFactors.moveType}</span>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-4 w-4 text-purple-600 mr-2" />
                      <span>{pricingFactors.propertySize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const PlanIcon = plan.icon;
            const isCurrentPlan = user?.pricing_plan === plan.id;
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`h-full transition-all duration-300 hover:shadow-2xl ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-lg scale-105' 
                    : 'border border-gray-200 hover:border-gray-300'
                } ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      plan.color === 'gray' ? 'bg-gray-100' :
                      plan.color === 'blue' ? 'bg-blue-100' :
                      'bg-purple-100'
                    }`}>
                      <PlanIcon className={`h-8 w-8 ${
                        plan.color === 'gray' ? 'text-gray-600' :
                        plan.color === 'blue' ? 'text-blue-600' :
                        'text-purple-600'
                      }`} />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <p className="text-gray-600 text-sm mt-2">{plan.description}</p>
                    
                    <div className="mt-4">
                      <div className="text-4xl font-bold">
                        {plan.price === 0 ? 'Free' : formatPrice(billingCycle === 'monthly' ? plan.price : plan.yearlyPrice)}
                      </div>
                      {plan.price > 0 && (
                        <div className="text-gray-500 text-sm">
                          per {billingCycle === 'monthly' ? 'month' : 'year'}
                        </div>
                      )}
                    </div>

                    {isCurrentPlan && (
                      <Badge className="mt-2 bg-green-100 text-green-800">Current Plan</Badge>
                    )}
                  </CardHeader>

                  <CardContent className="pt-0">
                    {/* Features */}
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Limitations */}
                    {plan.limitations.length > 0 && (
                      <div className="border-t pt-4 mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Limitations:</h4>
                        <div className="space-y-2">
                          {plan.limitations.map((limitation, idx) => (
                            <div key={idx} className="flex items-start">
                              <div className="h-4 w-4 mr-3 mt-0.5 flex-shrink-0">
                                <div className="h-1 w-4 bg-gray-400 rounded"></div>
                              </div>
                              <span className="text-sm text-gray-500">{limitation}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <Button
                      onClick={() => handlePlanSelection(plan.id)}
                      disabled={loading || isCurrentPlan}
                      className={`w-full h-12 ${
                        plan.popular 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : plan.color === 'purple'
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'bg-gray-600 hover:bg-gray-700'
                      } ${isCurrentPlan ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : isCurrentPlan ? (
                        'Current Plan'
                      ) : plan.price === 0 ? (
                        'Get Started Free'
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </Button>

                    {plan.price > 0 && !isCurrentPlan && (
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Cancel anytime • No setup fees
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Validity Rules & Payment Gateway Info */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <Card className="bg-gray-50">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-center mb-6">Pricing & Payment Information</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-green-600" />
                  Validity Rules
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Prices based on location, timeline, and move complexity</li>
                  <li>• Plans can be upgraded or downgraded anytime</li>
                  <li>• Date change limits reset monthly</li>
                  <li>• Unused features don't roll over</li>
                  <li>• Concierge services require 48hr notice</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Payment & Billing
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Secure payment processing via Stripe</li>
                  <li>• All major credit cards accepted</li>
                  <li>• PayPal and bank transfer available</li>
                  <li>• Automatic billing with email receipts</li>
                  <li>• 30-day money-back guarantee</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 text-center">
                <strong>Note:</strong> Pricing rules are configured in the Admin portal. 
                Payment gateway integration is required for live transactions.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
        
        <div className="space-y-6">
          {[
            {
              question: "Can I change my plan anytime?",
              answer: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and you'll be prorated for the difference."
            },
            {
              question: "What happens if I exceed my date change limit?",
              answer: "Free plan users cannot change dates. Plan+ users get 1-2 changes per month. Concierge+ users have unlimited changes."
            },
            {
              question: "Do you offer refunds?",
              answer: "We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance with refunds."
            },
            {
              question: "How does location-based pricing work?",
              answer: "Pricing varies by city and region based on local market conditions, service availability, and cost of living."
            }
          ].map((faq, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">{faq.question}</h4>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;

