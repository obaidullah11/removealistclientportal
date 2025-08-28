import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  MapPin, 
  Upload, 
  Home, 
  Users, 
  Baby, 
  Heart, 
  DollarSign,
  Sparkles,
  Check,
  Image,
  Loader2
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card } from '../../components/ui/card'
import { Progress } from '../../components/ui/progress'
import { useAuth } from '../../contexts/AuthContext'
import { moveAPI } from '../../lib/api'
import { showSuccess, showError } from '../../lib/snackbar'
import { validateMoveDate, validateAddress } from '../../lib/validation'

// Static address suggestions
const addressSuggestions = [
  "123 Main Street, New York, NY 10001",
  "456 Oak Avenue, Los Angeles, CA 90210", 
  "789 Pine Road, Chicago, IL 60601",
  "321 Elm Drive, Houston, TX 77001",
  "654 Maple Lane, Phoenix, AZ 85001",
  "987 Cedar Court, Philadelphia, PA 19101",
  "147 Birch Boulevard, San Antonio, TX 78201",
  "258 Willow Way, San Diego, CA 92101"
]

const steps = [
  { 
    id: 1, 
    title: 'When are you moving?', 
    subtitle: 'Select your ideal move date',
    icon: Calendar,
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 2, 
    title: 'Move Details', 
    subtitle: 'Addresses, property types, and ownership details',
    icon: MapPin,
    color: 'from-green-500 to-green-600',
  },
  { 
    id: 3, 
    title: 'Who\'s moving with you?', 
    subtitle: 'Family members and special considerations',
    icon: Users,
    color: 'from-pink-500 to-pink-600'
  },
  { 
    id: 4, 
    title: 'What\'s your budget?', 
    subtitle: 'Help us recommend the right services',
    icon: DollarSign,
    color: 'from-emerald-500 to-emerald-600'
  }
]

export default function MyMove() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    moveDate: '',
    fromAddress: '',
    toAddress: '',
    currentPropertyType: '',
    newPropertyType: '',
    currentPropertySize: '',
    newPropertySize: '',
    currentOwnershipType: '',
    newOwnershipType: '',
    currentFloorPlan: null,
    newFloorPlan: null,
    hasChildren: false,
    hasPets: false,
    hasMovers: false,
    budget: ''
  })
  
  const [addressSuggestionsList, setAddressSuggestionsList] = useState([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)

  const progress = (currentStep / steps.length) * 100
  const currentStepData = steps[currentStep - 1]

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        const dateError = validateMoveDate(formData.moveDate)
        if (dateError) {
          showError(dateError)
          return false
        }
        return true
      case 2:
        const fromAddressError = validateAddress(formData.fromAddress)
        if (fromAddressError) {
          showError(`From address: ${fromAddressError}`)
          return false
        }
        const toAddressError = validateAddress(formData.toAddress)
        if (toAddressError) {
          showError(`To address: ${toAddressError}`)
          return false
        }
        if (!formData.currentPropertyType) {
          showError('Please select your current property type')
          return false
        }
        if (!formData.newPropertyType) {
          showError('Please select your new property type')
          return false
        }
        if (!formData.currentPropertySize) {
          showError('Please select your current property size')
          return false
        }
        if (!formData.newPropertySize) {
          showError('Please select your new property size')
          return false
        }
        return true
      case 3:
        return true // Optional step
      case 4:
        return true // Optional step
      default:
        return true
    }
  }

  const nextStep = async () => {
    if (currentStep < steps.length) {
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1)
      }
    } else {
      // Complete the wizard
      await handleSubmit()
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    
    try {
      const moveData = {
        move_date: formData.moveDate,
        current_location: formData.fromAddress,
        destination_location: formData.toAddress,
        from_property_type: formData.currentPropertyType,
        from_property_size: formData.currentPropertySize,
        to_property_type: formData.newPropertyType,
        to_property_size: formData.newPropertySize,
        special_items: [
          formData.hasChildren && 'Moving with children',
          formData.hasPets && 'Moving with pets', 
          formData.hasMovers && 'Professional movers needed'
        ].filter(Boolean).join(', '),
        estimated_budget: formData.budget ? (
          typeof formData.budget === 'string' && formData.budget.includes('-') 
            ? parseFloat(formData.budget.split('-')[1]) 
            : parseFloat(formData.budget)
        ) : null,
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || ''
      }

      const response = await moveAPI.createMove(moveData)
      
      if (response.success) {
        showSuccess('🎉 Your move project has been created! Redirecting to book time...')
        
        // Store move ID in session storage
        if (response.data && response.data.id) {
          sessionStorage.setItem('currentMoveId', response.data.id)
        }
        
        // Redirect to book time after a short delay
        setTimeout(() => {
          window.location.href = '/book-time'
        }, 2000)
      } else {
        showError(response.message || 'Failed to create move. Please try again.')
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error creating move:', error)
      showError(error.message || 'Failed to create move. Please try again.')
      setIsLoading(false)
    }
  }

  const handleAddressSearch = (value, type) => {
    setFormData({ ...formData, [type]: value })
    if (value.length > 2) {
      const filtered = addressSuggestions.filter(addr => 
        addr.toLowerCase().includes(value.toLowerCase())
      )
      setAddressSuggestionsList(filtered)
      if (type === 'fromAddress') setShowFromSuggestions(true)
      if (type === 'toAddress') setShowToSuggestions(true)
    } else {
      setShowFromSuggestions(false)
      setShowToSuggestions(false)
    }
  }

  const selectAddress = (address, type) => {
    setFormData({ ...formData, [type]: address })
    setShowFromSuggestions(false)
    setShowToSuggestions(false)
  }

  const handleFileUpload = (field, file) => {
    setFormData(prev => ({ ...prev, [field]: file }))
  }

  const handleDrop = (field, e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(field, file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleFileInput = (field, file) => {
    if (file) {
      setFormData(prev => ({ ...prev, [field]: file }))
    }
  }

  const renderStep = () => {
    const stepVariants = {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    }

    switch (currentStep) {
      case 1:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center">
              <div className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">{currentStepData.title}</h2>
              <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
            </div>
            <div className="max-w-md mx-auto">
              <Input
                type="date"
                value={formData.moveDate}
                onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                className="text-center text-lg h-14 text-gray-700 font-semibold"
                min={new Date().toISOString().split('T')[0]}
              />
              {formData.moveDate && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-primary-600 font-medium mt-4"
                >
                  Perfect! That gives us time to plan everything properly ✨
                </motion.p>
              )}
            </div>
          </motion.div>
        )
      
      case 2:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            {/* Header with teal moving truck icon */}
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentStepData.title}</h2>
              <p className="text-lg text-gray-600">{currentStepData.subtitle}</p>
            </div>
            
            {/* Two-column layout for addresses and property details */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Current Location Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Current Location</h3>
                
                {/* Address Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Enter your current address"
                      className="pl-11 h-12 text-base"
                      value={formData.fromAddress}
                      onChange={(e) => handleAddressSearch(e.target.value, 'fromAddress')}
                    />
                  </div>
                  {showFromSuggestions && addressSuggestionsList.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-xl max-h-48 overflow-y-auto"
                    >
                      {addressSuggestionsList.map((address, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                          onClick={() => selectAddress(address, 'fromAddress')}
                        >
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{address}</span>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Property Type for Current Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Property Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'apartment', emoji: '🏢', label: 'Apartment' },
                      { value: 'house', emoji: '🏠', label: 'House' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.currentPropertyType === option.value 
                            ? 'border-teal-500 bg-teal-50 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => setFormData({ ...formData, currentPropertyType: option.value })}
                      >
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-sm">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Size for Current Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Property Size</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'studio', emoji: '🏠', label: 'Studio' },
                      { value: '1bedroom', emoji: '🏡', label: '1 Bedroom' },
                      { value: '2bedroom', emoji: '🏘️', label: '2 Bedrooms' },
                      { value: '3bedroom', emoji: '🏰', label: '3+ Bedrooms' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-3 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.currentPropertySize === option.value 
                            ? 'border-teal-500 bg-teal-50 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => setFormData({ ...formData, currentPropertySize: option.value })}
                      >
                        <div className="text-xl mb-1">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-xs">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ownership for Current Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Ownership</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'renting', emoji: '🔑', label: 'Renting' },
                      { value: 'owner', emoji: '🏡', label: 'Owner' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.currentOwnershipType === option.value 
                            ? 'border-teal-500 bg-teal-50 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => setFormData({ ...formData, currentOwnershipType: option.value })}
                      >
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-sm">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floor Plan Upload for Current Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Floor Plan (Optional)</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      formData.currentFloorPlan 
                        ? 'border-teal-500 bg-teal-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={(e) => handleDrop('currentFloorPlan', e)}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      id="current-floor-plan"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(e) => handleFileInput('currentFloorPlan', e.target.files[0])}
                    />
                    <label htmlFor="current-floor-plan" className="cursor-pointer">
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formData.currentFloorPlan ? formData.currentFloorPlan.name : 'Drop your floor plan here'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
              
              {/* New Location Section */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">New Location</h3>
                
                {/* Address Input */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Enter your new address"
                      className="pl-11 h-12 text-base"
                      value={formData.toAddress}
                      onChange={(e) => handleAddressSearch(e.target.value, 'toAddress')}
                    />
                  </div>
                  {showToSuggestions && addressSuggestionsList.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-xl max-h-48 overflow-y-auto"
                    >
                      {addressSuggestionsList.map((address, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
                          onClick={() => selectAddress(address, 'toAddress')}
                        >
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{address}</span>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Property Type for New Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Property Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'apartment', emoji: '🏢', label: 'Apartment' },
                      { value: 'house', emoji: '🏠', label: 'House' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.newPropertyType === option.value 
                            ? 'border-teal-500 bg-teal-50 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => setFormData({ ...formData, newPropertyType: option.value })}
                      >
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-sm">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Size for New Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Property Size</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'studio', emoji: '🏠', label: 'Studio' },
                      { value: '1bedroom', emoji: '🏡', label: '1 Bedroom' },
                      { value: '2bedroom', emoji: '🏘️', label: '2 Bedrooms' },
                      { value: '3bedroom', emoji: '🏰', label: '3+ Bedrooms' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-3 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.newPropertySize === option.value 
                            ? 'border-teal-500 bg-teal-50 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => setFormData({ ...formData, newPropertySize: option.value })}
                      >
                        <div className="text-xl mb-1">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-xs">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ownership for New Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Ownership</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'renting', emoji: '🔑', label: 'Renting' },
                      { value: 'owner', emoji: '🏡', label: 'Owner' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`p-4 border-2 rounded-xl text-center transition-all hover:scale-105 ${
                          formData.newOwnershipType === option.value 
                            ? 'border-teal-500 bg-teal-50 shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                        onClick={() => setFormData({ ...formData, newOwnershipType: option.value })}
                      >
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="font-semibold text-gray-900 text-sm">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Floor Plan Upload for New Location */}
                <div className="space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">Floor Plan (Optional)</label>
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      formData.newFloorPlan 
                        ? 'border-teal-500 bg-teal-50' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onDrop={(e) => handleDrop('newFloorPlan', e)}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      id="new-floor-plan"
                      className="hidden"
                      accept=".png,.jpg,.jpeg,.pdf"
                      onChange={(e) => handleFileInput('newFloorPlan', e.target.files[0])}
                    />
                    <label htmlFor="new-floor-plan" className="cursor-pointer">
                      <div className="space-y-3">
                        <div className="flex justify-center">
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formData.newFloorPlan ? formData.newFloorPlan.name : 'Drop your floor plan here'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )
      
      case 3:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center">
              <div className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                <Users className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">{currentStepData.title}</h2>
              <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
            </div>
            <div className="max-w-lg mx-auto space-y-6">
              <Card className="p-6 border-2 hover:border-primary-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                      <Baby className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Moving with Children</div>
                      <div className="text-sm text-gray-600">Special considerations for kids</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, hasChildren: !formData.hasChildren })}
                    className={`w-12 h-6 rounded-full border-2 transition-colors ${
                      formData.hasChildren 
                        ? 'bg-primary-600 border-primary-600' 
                        : 'bg-gray-200 border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      formData.hasChildren ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </Card>
              
              <Card className="p-6 border-2 hover:border-primary-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center">
                      <Heart className="h-6 w-6 text-pink-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Moving with Pets</div>
                      <div className="text-sm text-gray-600">Pet-friendly moving services</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, hasPets: !formData.hasPets })}
                    className={`w-12 h-6 rounded-full border-2 transition-colors ${
                      formData.hasPets 
                        ? 'bg-primary-600 border-primary-600' 
                        : 'bg-gray-200 border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      formData.hasPets ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </Card>

              <Card className="p-6 border-2 hover:border-primary-200 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                      <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Moving with Movers</div>
                      <div className="text-sm text-gray-600">Professional moving services</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setFormData({ ...formData, hasMovers: !formData.hasMovers })}
                    className={`w-12 h-6 rounded-full border-2 transition-colors ${
                      formData.hasMovers 
                        ? 'bg-primary-600 border-primary-600' 
                        : 'bg-gray-200 border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      formData.hasMovers ? 'translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </Card>

              {(formData.hasChildren || formData.hasPets || formData.hasMovers) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-50 p-4 rounded-xl border border-primary-200"
                >
                  <p className="text-sm text-primary-700 font-medium">
                    Great! We'll include specialized services and tips in your moving plan. 
                    {formData.hasMovers && ' 🚚 Professional movers will be prioritized.'}
                    {formData.hasChildren && ' 👨‍👩‍👧‍👦 Family-friendly considerations included.'}
                    {formData.hasPets && ' 🐾 Pet-safe moving services added.'}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )
      
      case 4:
        return (
          <motion.div
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="space-y-8"
          >
            <div className="text-center">
              <div className={`w-20 h-20 bg-gradient-to-r ${currentStepData.color} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl`}>
                <DollarSign className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">{currentStepData.title}</h2>
              <p className="text-gray-600 text-lg">{currentStepData.subtitle}</p>
            </div>
            <div className="max-w-lg mx-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: '$1,000 - $2,500', value: '1000-2500', popular: false },
                  { label: '$2,500 - $5,000', value: '2500-5000', popular: true },
                  { label: '$5,000 - $10,000', value: '5000-10000', popular: false },
                  { label: '$10,000+', value: '10000+', popular: false }
                ].map((budget) => (
                  <button
                    key={budget.value}
                    className={`relative p-6 border-2 rounded-2xl text-center transition-all hover:scale-105 ${
                      formData.budget === budget.value 
                        ? 'border-primary-500 bg-primary-50 shadow-lg' 
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                    onClick={() => setFormData({ ...formData, budget: budget.value })}
                  >
                    
                    <div className="font-semibold text-gray-900">{budget.label}</div>
                  </button>
                ))}
              </div>
              
              <div className="text-center text-gray-600">
                <p className="mb-3">Or enter a custom amount:</p>
                <div className="relative max-w-xs mx-auto">
                  <DollarSign className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    type="number"
                    placeholder="Enter custom budget"
                    className="pl-12 h-14 text-center text-lg font-semibold"
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Landing Page Style */}
     

      {/* Progress Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Create Your Move</h1>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {steps.length}
            </div>
          </div>
          <div className="relative">
            <Progress value={progress} className="h-2" />
            <div className="absolute top-0 left-0 w-full flex justify-between">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 bg-white transition-colors ${
                    index + 1 <= currentStep
                      ? 'border-primary-500 text-primary-600'
                      : 'border-gray-300 text-gray-400'
                  }`}
                  style={{ transform: 'translateY(-50%)' }}
                >
                  {index + 1 < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 max-w-lg mx-auto">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="h-12 px-6"
          >
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back
          </Button>
          
          <Button 
            onClick={nextStep} 
            disabled={isLoading}
            className="h-12 px-8 font-semibold bg-sustainableGreen hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating...
              </>
            ) : currentStep === steps.length ? (
              <>
                Create My Move
                <Sparkles className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Continue
                <ChevronRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}