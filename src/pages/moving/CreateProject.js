import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Calendar, MapPin, Upload, Home, Users, Baby, Heart, DollarSign } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Progress } from '../../components/ui/progress'
import { Checkbox } from '../../components/ui/checkbox'
import { addressSuggestions } from '../../data/mockData'

const steps = [
  { id: 1, title: 'Move Date', description: 'When are you moving?' },
  { id: 2, title: 'Addresses', description: 'Where are you moving from and to?' },
  { id: 3, title: 'Floor Plan', description: 'Upload your floor plan' },
  { id: 4, title: 'Property Details', description: 'Tell us about your property' },
  { id: 5, title: 'Personal Details', description: 'Moving with family or pets?' },
  { id: 6, title: 'Budget', description: 'What\'s your moving budget?' }
]

export default function CreateProject() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    moveDate: '',
    fromAddress: '',
    toAddress: '',
    floorPlan: null,
    apartmentType: '',
    ownershipType: '',
    hasChildren: false,
    hasPets: false,
    budget: ''
  })
  
  const [addressSuggestionsList, setAddressSuggestionsList] = useState([])
  const [showFromSuggestions, setShowFromSuggestions] = useState(false)
  const [showToSuggestions, setShowToSuggestions] = useState(false)

  const progress = (currentStep / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit form
      console.log('Creating project:', formData)
      alert('Project created successfully!')
      window.location.href = '/dashboard'
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({ ...formData, floorPlan: file })
    }
  }

  const generateRooms = () => {
    alert('AI is analyzing your floor plan... This feature will be available soon!')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Calendar className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">When are you moving?</h2>
              <p className="text-muted-foreground">Select your preferred move date</p>
            </div>
            <div className="max-w-md mx-auto">
              <Input
                type="date"
                value={formData.moveDate}
                onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                className="text-center text-lg"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </motion.div>
        )
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <MapPin className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Moving addresses</h2>
              <p className="text-muted-foreground">Enter your current and new addresses</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="relative">
                <label className="block text-sm font-medium mb-2">From Address</label>
                <Input
                  placeholder="Enter current address"
                  value={formData.fromAddress}
                  onChange={(e) => handleAddressSearch(e.target.value, 'fromAddress')}
                />
                {showFromSuggestions && addressSuggestionsList.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg">
                    {addressSuggestionsList.map((address, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                        onClick={() => selectAddress(address, 'fromAddress')}
                      >
                        {address}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium mb-2">To Address</label>
                <Input
                  placeholder="Enter new address"
                  value={formData.toAddress}
                  onChange={(e) => handleAddressSearch(e.target.value, 'toAddress')}
                />
                {showToSuggestions && addressSuggestionsList.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md mt-1 shadow-lg">
                    {addressSuggestionsList.map((address, index) => (
                      <button
                        key={index}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b last:border-b-0"
                        onClick={() => selectAddress(address, 'toAddress')}
                      >
                        {address}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Upload className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Upload Floor Plan</h2>
              <p className="text-muted-foreground">Help us understand your space better</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="border-2 border-dashed border-primary-200 rounded-lg p-8 text-center">
                {formData.floorPlan ? (
                  <div>
                    <p className="text-sm font-medium">{formData.floorPlan.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(formData.floorPlan.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-8 w-8 text-primary-600 mx-auto mb-2" />
                    <p className="text-sm">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, PDF up to 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              {formData.floorPlan && (
                <Button onClick={generateRooms} className="w-full" variant="primary">
                  🤖 AI Generate Rooms
                </Button>
              )}
            </div>
          </motion.div>
        )
      
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Home className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Property Details</h2>
              <p className="text-muted-foreground">Tell us about your property</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Property Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`p-4 border rounded-lg text-center ${
                      formData.apartmentType === 'apartment' 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setFormData({ ...formData, apartmentType: 'apartment' })}
                  >
                    <div className="text-2xl mb-2">🏢</div>
                    <div className="font-medium">Apartment</div>
                  </button>
                  <button
                    className={`p-4 border rounded-lg text-center ${
                      formData.apartmentType === 'house' 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setFormData({ ...formData, apartmentType: 'house' })}
                  >
                    <div className="text-2xl mb-2">🏠</div>
                    <div className="font-medium">House</div>
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-3">Ownership</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className={`p-4 border rounded-lg text-center ${
                      formData.ownershipType === 'renting' 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setFormData({ ...formData, ownershipType: 'renting' })}
                  >
                    <div className="text-2xl mb-2">🔑</div>
                    <div className="font-medium">Renting</div>
                  </button>
                  <button
                    className={`p-4 border rounded-lg text-center ${
                      formData.ownershipType === 'owner' 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setFormData({ ...formData, ownershipType: 'owner' })}
                  >
                    <div className="text-2xl mb-2">🏡</div>
                    <div className="font-medium">Owner</div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )
      
      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <Users className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Personal Details</h2>
              <p className="text-muted-foreground">Are you moving with family or pets?</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Baby className="h-6 w-6 text-primary-600" />
                  <div>
                    <div className="font-medium">Moving with Children</div>
                    <div className="text-sm text-muted-foreground">
                      Special considerations for kids
                    </div>
                  </div>
                </div>
                <Checkbox
                  checked={formData.hasChildren}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasChildren: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Heart className="h-6 w-6 text-primary-600" />
                  <div>
                    <div className="font-medium">Moving with Pets</div>
                    <div className="text-sm text-muted-foreground">
                      Pet-friendly moving services
                    </div>
                  </div>
                </div>
                <Checkbox
                  checked={formData.hasPets}
                  onCheckedChange={(checked) => setFormData({ ...formData, hasPets: checked })}
                />
              </div>
            </div>
          </motion.div>
        )
      
      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <DollarSign className="h-16 w-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Moving Budget</h2>
              <p className="text-muted-foreground">What's your estimated budget?</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '$1,000 - $2,500', value: '1000-2500' },
                  { label: '$2,500 - $5,000', value: '2500-5000' },
                  { label: '$5,000 - $10,000', value: '5000-10000' },
                  { label: '$10,000+', value: '10000+' }
                ].map((budget) => (
                  <button
                    key={budget.value}
                    className={`p-4 border rounded-lg text-center ${
                      formData.budget === budget.value 
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-200'
                    }`}
                    onClick={() => setFormData({ ...formData, budget: budget.value })}
                  >
                    <div className="font-medium">{budget.label}</div>
                  </button>
                ))}
              </div>
              <div className="text-center text-sm text-muted-foreground">
                Or enter a custom amount:
              </div>
              <Input
                type="number"
                placeholder="Enter custom budget"
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
          </motion.div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle>Create Moving Project</CardTitle>
                <CardDescription>
                  Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
                </CardDescription>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round(progress)}% complete
              </div>
            </div>
            <Progress value={progress} className="w-full" />
          </CardHeader>
          
          <CardContent className="py-8">
            {renderStep()}
          </CardContent>
          
          <div className="flex justify-between p-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            <Button onClick={nextStep} variant="primary">
              {currentStep === steps.length ? 'Create Project' : 'Next'}
              {currentStep !== steps.length && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
