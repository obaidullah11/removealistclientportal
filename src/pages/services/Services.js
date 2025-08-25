import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Clock, Users, Shield, Check, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { mockServices } from '../../data/mockData'
import { formatCurrency } from '../../lib/utils'

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)
  const [bookingStep, setBookingStep] = useState('browse') // browse, select, confirm, payment

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setBookingStep('select')
  }

  const handleBookingConfirm = () => {
    setBookingStep('confirm')
  }

  const handlePayment = () => {
    setBookingStep('payment')
  }

  const handleBookingComplete = () => {
    alert('Booking completed successfully! You will receive a confirmation email shortly.')
    setBookingStep('browse')
    setSelectedService(null)
  }

  const renderServiceCard = (service, index) => (
    <motion.div
      key={service.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className={`h-full hover:shadow-lg transition-shadow cursor-pointer relative ${
        service.popular ? 'ring-2 ring-primary-500' : ''
      }`}>
        {service.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
              Most Popular
            </span>
          </div>
        )}
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{service.title}</span>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {formatCurrency(service.price)}
              </div>
              <div className="text-sm text-muted-foreground">starting from</div>
            </div>
          </CardTitle>
          <CardDescription>{service.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{service.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-current text-yellow-500" />
              <span>4.8 (120 reviews)</span>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Includes:</h4>
            <ul className="space-y-1">
              {service.includes.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-2 text-sm">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            onClick={() => handleServiceSelect(service)}
            className="w-full" 
            variant="primary"
          >
            Select Service
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (bookingStep === 'select' && selectedService) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setBookingStep('browse')}
              className="mb-4"
            >
              ← Back to Services
            </Button>
            <h1 className="text-3xl font-bold">Customize Your Service</h1>
            <p className="text-muted-foreground">Selected: {selectedService.title}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Date</label>
                    <input 
                      type="date" 
                      className="w-full p-2 border rounded-md"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Time</label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="morning">Morning (8AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 5PM)</option>
                      <option value="evening">Evening (5PM - 8PM)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Requirements</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Packing materials (+$50)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Storage service (+$100)</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Assembly/Disassembly (+$75)</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Special Instructions</label>
                    <textarea 
                      className="w-full p-2 border rounded-md h-20 resize-none"
                      placeholder="Any special requirements or instructions..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>{selectedService.title}</span>
                    <span>{formatCurrency(selectedService.price)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Packing materials</span>
                    <span>+$50</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span>+$204</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(selectedService.price + 50 + 204)}</span>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Button onClick={handleBookingConfirm} className="w-full" variant="primary">
                      Continue to Confirmation
                    </Button>
                    <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Secure booking • Cancel anytime</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">💡 Pro Tip</h4>
                  <p className="text-sm text-muted-foreground">
                    Book early morning slots for the best availability and to avoid traffic delays.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  if (bookingStep === 'confirm') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Booking</CardTitle>
              <CardDescription>Review your booking details before payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Service Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span>{selectedService.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>March 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span>Morning (8AM - 12PM)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{selectedService.duration}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Pricing Breakdown</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Service:</span>
                    <span>{formatCurrency(selectedService.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Add-ons:</span>
                    <span>+$50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>+$204</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedService.price + 50 + 204)}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setBookingStep('select')}
                  className="flex-1"
                >
                  Back to Edit
                </Button>
                <Button 
                  onClick={handlePayment}
                  variant="primary"
                  className="flex-1"
                >
                  Proceed to Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (bookingStep === 'payment') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
              <CardDescription>Secure payment processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="Doe" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Card Number</label>
                <input type="text" className="w-full p-2 border rounded-md" placeholder="1234 5678 9012 3456" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Expiry Date</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="MM/YY" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input type="text" className="w-full p-2 border rounded-md" placeholder="123" />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Your payment is secured with 256-bit SSL encryption
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setBookingStep('confirm')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleBookingComplete}
                  variant="primary"
                  className="flex-1"
                >
                  Complete Booking - {formatCurrency(selectedService.price + 50 + 204)}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Moving Services</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our professional moving services to make your relocation smooth and stress-free
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockServices.map((service, index) => renderServiceCard(service, index))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Need a Custom Quote?</h2>
            <p className="text-muted-foreground mb-6">
              Every move is unique. Get a personalized quote tailored to your specific needs.
            </p>
            <Button variant="primary" size="lg">
              Get Custom Quote
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
