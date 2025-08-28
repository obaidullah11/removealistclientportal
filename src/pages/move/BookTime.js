import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { showSuccess, showError } from '../../lib/snackbar'
import { motion } from 'framer-motion'
import { Clock, Phone, ArrowRight, Calendar, CheckCircle, MapPin } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAuth } from '../../contexts/AuthContext'
import { bookingAPI, moveAPI } from '../../lib/api'

export default function BookTime() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  // Debug: Log user data on component mount
  console.log('BookTime component - User data:', user)
  console.log('BookTime component - Phone number from user:', user?.phone_number)
  
  const [moveId, setMoveId] = useState(null)
  const [moveDetails, setMoveDetails] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '')
  const [loading, setLoading] = useState(false)
  const [fetchingSlots, setFetchingSlots] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [error, setError] = useState('')
  const [summaryExpanded, setSummaryExpanded] = useState(false)

  // Add this function before the useEffect
  const fetchUserMoves = async () => {
    try {
      const response = await moveAPI.getUserMoves()
      
      if (response.success && response.data && response.data.length > 0) {
        // Use the first move (most recent)
        const firstMove = response.data[0]
        setMoveId(firstMove.id)
        setMoveDetails(firstMove)
        
        // Set the move date as the default selected date
        if (firstMove.move_date) {
          setSelectedDate(firstMove.move_date)
          fetchAvailableSlots(firstMove.move_date)
        }
        
        // Check for existing booking
        setTimeout(() => checkExistingBooking(firstMove.id), 100)
      } else {
        setError('No moves found. Please create a move first.')
        setTimeout(() => {
          navigate('/my-move')
        }, 2000)
      }
    } catch (error) {
      console.error('Error fetching user moves:', error)
      setError('Failed to fetch move details. Please try again.')
      setTimeout(() => {
        navigate('/my-move')
      }, 2000)
    }
  }

  // Fetch move details on component mount
  useEffect(() => {
    const storedMoveId = sessionStorage.getItem('currentMoveId')
    
    if (storedMoveId) {
      setMoveId(storedMoveId)
      fetchMoveDetails(storedMoveId)
      // Check for existing booking after move details are fetched
      setTimeout(() => checkExistingBooking(storedMoveId), 100)
    } else {
      // If no stored move ID, try to get the user's moves
      fetchUserMoves()
    }
  }, [navigate])

  // Update phone number when user data changes
  useEffect(() => {
    if (user?.phone_number) {
      console.log('Updating phone number from user data:', user.phone_number)
      setPhoneNumber(user.phone_number)
    } else {
      console.log('No phone number found in user data:', user)
    }
  }, [user?.phone_number])

  // Add this function before fetchMoveDetails
  const checkExistingBooking = async (moveId) => {
    try {
      const response = await bookingAPI.getUserBookings()
      
      if (response.success && response.data) {
        // Check if there's already a booking for this move
        const existingBooking = response.data.find(booking => 
          booking.move_id === moveId && 
          ['confirmed', 'in_progress'].includes(booking.status)
        )
        
        if (existingBooking) {
          setError('You already have a scheduled booking for this move. Cannot create another booking.')
          setBookingComplete(true) // Prevent further booking attempts
          showError('You already have a scheduled booking for this move. Cannot create another booking.')
        }
      }
    } catch (error) {
      console.error('Error checking existing bookings:', error)
      // Don't block the user if we can't check existing bookings
    }
  }

  const fetchMoveDetails = async (id) => {
    try {
      const response = await moveAPI.getMove(id)
      
      if (response.success) {
        setMoveDetails(response.data)
        
        // Set the move date as the default selected date
        if (response.data.move_date) {
          setSelectedDate(response.data.move_date)
          fetchAvailableSlots(response.data.move_date)
        }
      } else {
        setError('Failed to fetch move details. Please try again.')
      }
    } catch (error) {
      console.error('Error fetching move details:', error)
      setError('An unexpected error occurred. Please try again.')
    }
  }

  const fetchAvailableSlots = async (date) => {
    setFetchingSlots(true)
    setAvailableSlots([])
    setSelectedSlot(null)
    
    try {
      const response = await bookingAPI.getAvailableSlots(date)
      console.log('API Response:', response) // Debug log
      
      if (response.success) {
        // Fix: Access slots from the correct nested path and transform the data structure
        const rawSlots = response.data?.data?.slots || response.data?.slots || []
        console.log('Raw slots:', rawSlots) // Debug log
        
        // Transform the API response to match the expected format
        const transformedSlots = rawSlots.map((slot, index) => ({
          id: index + 1, // Generate unique ID since API doesn't provide one
          start_time: slot.start ? slot.start.split(' ')[1] : slot.start_time, // Extract time part
          end_time: slot.end ? slot.end.split(' ')[1] : slot.end_time, // Extract time part
          available: true, // All slots from API are available
          start: slot.start, // Keep original for reference
          end: slot.end // Keep original for reference
        }))
        
        console.log('Transformed slots:', transformedSlots) // Debug log
        setAvailableSlots(transformedSlots)
        
        if (transformedSlots.length === 0) {
          showError('No available time slots for the selected date. Please choose another date.')
        }
      } else {
        showError('Failed to fetch available time slots. Please try again.')
      }
    } catch (error) {
      console.error('Error fetching time slots:', error)
      showError('An unexpected error occurred. Please try again.')
    } finally {
      setFetchingSlots(false)
    }
  }

  const handleDateChange = (e) => {
    const date = e.target.value
    setSelectedDate(date)
    fetchAvailableSlots(date)
  }

  const handleSlotSelection = (slot) => {
    setSelectedSlot(slot)
  }

  const validateForm = () => {
    if (!selectedSlot) {
      showError('Please select a time slot.')
      return false
    }
    
    if (!phoneNumber) {
      showError('Phone number is required.')
      return false
    }
    
    // Basic phone number validation
    const phoneRegex = /^\+?[0-9\s\-()]{8,20}$/
    if (!phoneRegex.test(phoneNumber)) {
      showError('Please enter a valid phone number.')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    // Add additional validation to check for existing booking
    try {
      const response = await bookingAPI.getUserBookings()
      
      if (response.success && response.data) {
        const existingBooking = response.data.find(booking => 
          booking.move_id === moveId && 
          ['confirmed', 'in_progress'].includes(booking.status)
        )
        
        if (existingBooking) {
          showError('You already have a scheduled booking for this move. Cannot create another booking.')
          return
        }
      }
    } catch (error) {
      console.error('Error checking existing bookings:', error)
      // Continue with booking if we can't check
    }
    
    setLoading(true)
    
    try {
      // Format time slot as a range string instead of just the ID
      let timeSlotString = ''
      
      // Handle new API response format (with start/end datetime strings)
      if (selectedSlot.start && selectedSlot.end) {
        const formatDateTime = (dateTimeStr) => {
          if (!dateTimeStr || typeof dateTimeStr !== 'string') return ''
          
          const parts = dateTimeStr.split(' ')
          if (parts.length < 2) return ''
          
          const timePart = parts[1] // Extract "09:00" from "2025-10-18 09:00"
          return timePart
        }
        
        timeSlotString = `${formatDateTime(selectedSlot.start)}-${formatDateTime(selectedSlot.end)}`
      }
      // Handle old format (with start_time/end_time)
      else if (selectedSlot.start_time && selectedSlot.end_time) {
        timeSlotString = `${selectedSlot.start_time}-${selectedSlot.end_time}`
      }
      // Fallback to slot ID if no time format is available
      else {
        timeSlotString = selectedSlot.id.toString()
      }
      
      const bookingData = {
        move_id: moveId,
        time_slot: timeSlotString,
        phone_number: phoneNumber
      }
      
      console.log('Sending booking data:', bookingData) // Debug log
      
      const response = await bookingAPI.bookTimeSlot(bookingData)
      
      if (response.success) {
        showSuccess('Booking confirmed successfully!')
        setBookingComplete(true)
        
        // Clear the current move ID from session storage
        sessionStorage.removeItem('currentMoveId')
      } else {
        showError(response.message || 'Failed to confirm booking. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      showError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Fix the formatTimeSlot function to properly handle the API response format
  const formatTimeSlot = (slot) => {
    console.log('Formatting slot:', slot) // Debug log
    
    if (!slot) return ''
    
    // Handle API response format (start/end with datetime like "2025-10-18 09:00")
    if (slot.start && slot.end) {
      console.log('Using start/end format') // Debug log
      const formatDateTime = (dateTimeStr) => {
        console.log('Formatting datetime:', dateTimeStr) // Debug log
        if (!dateTimeStr || typeof dateTimeStr !== 'string') return ''
        
        const parts = dateTimeStr.split(' ')
        if (parts.length < 2) return ''
        
        const timePart = parts[1] // Extract "09:00" from "2025-10-18 09:00"
        console.log('Time part:', timePart) // Debug log
        
        const [hours, minutes] = timePart.split(':')
        if (!hours || !minutes) return ''
        
        const hour = parseInt(hours, 10)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${minutes} ${ampm}`
      }
      
      const result = `${formatDateTime(slot.start)} - ${formatDateTime(slot.end)}`
      console.log('Formatted result:', result) // Debug log
      return result
    }
    
    // Handle existing format (start_time/end_time)
    if (slot.start_time && slot.end_time) {
      console.log('Using start_time/end_time format') // Debug log
      const formatTime = (timeStr) => {
        if (!timeStr || typeof timeStr !== 'string') return ''
        
        const [hours, minutes] = timeStr.split(':')
        if (!hours || !minutes) return ''
        
        const hour = parseInt(hours, 10)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${minutes} ${ampm}`
      }
      
      return `${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`
    }
    
    console.log('No valid format found for slot') // Debug log
    return ''
  }

  // Generate mock time slots for development
  const generateMockTimeSlots = () => {
    if (availableSlots.length > 0) return availableSlots
    
    // Mock data for development
    return [
      { id: 1, start_time: '08:00', end_time: '10:00', available: true },
      { id: 2, start_time: '10:00', end_time: '12:00', available: true },
      { id: 3, start_time: '12:00', end_time: '14:00', available: false },
      { id: 4, start_time: '14:00', end_time: '16:00', available: true },
      { id: 5, start_time: '16:00', end_time: '18:00', available: true }
    ]
  }

  const slots = availableSlots.length > 0 ? availableSlots : generateMockTimeSlots()

  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Book Your Move Time</CardTitle>
            <CardDescription>
              Select a convenient time for our team to help with your move
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
                <p className="text-sm text-gray-600 mt-2">Redirecting to move form...</p>
              </div>
            ) : bookingComplete ? (
              <div className="text-center py-8 space-y-6">
                <div className="flex justify-center">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Booking Confirmed!</h3>
                  <p className="text-gray-600 mt-2">
                    Your move has been scheduled successfully. We'll be in touch shortly with additional details.
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md max-w-md mx-auto">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium text-gray-500">Date:</div>
                    <div className="text-gray-800">{selectedDate}</div>
                    
                    <div className="font-medium text-gray-500">Time:</div>
                    <div className="text-gray-800">{formatTimeSlot(selectedSlot)}</div>
                    
                    <div className="font-medium text-gray-500">Phone:</div>
                    <div className="text-gray-800">{phoneNumber}</div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => navigate('/move')}
                  className="bg-primary-600 hover:bg-primary-700 text-white"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {moveDetails && (
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-700 text-lg">Move Summary</h3>
                      <button
                        onClick={() => setSummaryExpanded(!summaryExpanded)}
                        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      >
                        <span>{summaryExpanded ? 'Show Less' : 'Show More'}</span>
                        {summaryExpanded ? (
                          <div className="w-4 h-4 text-gray-600">▲</div>
                        ) : (
                          <div className="w-4 h-4 text-gray-600">▼</div>
                        )}
                      </button>
                    </div>
                    
                    {/* Basic Move Information - Always Visible */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="font-medium text-gray-600">Move Date:</span>
                          <span className="text-gray-800">{new Date(moveDetails.move_date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-600">From:</span>
                            <div className="text-gray-800">{moveDetails.current_location}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <div>
                            <span className="font-medium text-gray-600">To:</span>
                            <div className="text-gray-800">{moveDetails.destination_location}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                          <span className="font-medium text-gray-600">Status:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            moveDetails.status === 'planning' ? 'bg-blue-100 text-blue-800' :
                            moveDetails.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                            moveDetails.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            moveDetails.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {moveDetails.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="font-medium text-gray-600">Progress:</span>
                          <span className="text-gray-800">{moveDetails.progress || 0}%</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                          <span className="font-medium text-gray-600">Created:</span>
                          <span className="text-gray-800">{new Date(moveDetails.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Detailed Information - Collapsible */}
                    {summaryExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 pt-4 border-t border-gray-200"
                      >
                        {/* Property Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Current Property */}
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                              <div className="w-4 h-4 mr-2 text-blue-600">🏠</div>
                              Current Property
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="text-gray-800 font-medium capitalize">
                                  {moveDetails.from_property_type?.replace('_', ' ') || 'Not specified'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Size:</span>
                                <span className="text-gray-800 font-medium capitalize">
                                  {moveDetails.from_property_size?.replace('_', ' ') || 'Not specified'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {/* New Property */}
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                              <div className="w-4 h-4 mr-2 text-green-600">🏡</div>
                              New Property
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Type:</span>
                                <span className="text-gray-800 font-medium capitalize">
                                  {moveDetails.to_property_type?.replace('_', ' ') || 'Not specified'}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Size:</span>
                                <span className="text-gray-800 font-medium capitalize">
                                  {moveDetails.to_property_size?.replace('_', ' ') || 'Not specified'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Special Considerations & Budget */}
                        {(moveDetails.special_items || moveDetails.estimated_budget) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Special Items */}
                            {moveDetails.special_items && (
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                  <div className="w-4 h-4 mr-2 text-pink-600">👥</div>
                                  Special Considerations
                                </h4>
                                <div className="text-sm text-gray-800">
                                  {moveDetails.special_items.split(',').map((item, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-1">
                                      <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>
                                      <span>{item.trim()}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            
                            {/* Budget */}
                            {moveDetails.estimated_budget && (
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                                  <div className="w-4 h-4 mr-2 text-emerald-600">💰</div>
                                  Estimated Budget
                                </h4>
                                <div className="text-sm">
                                  <span className="text-gray-800 font-medium">
                                    ${moveDetails.estimated_budget.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Contact Information */}
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-indigo-600" />
                            Contact Information
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Name:</span>
                              <div className="text-gray-800 font-medium">
                                {moveDetails.first_name} {moveDetails.last_name}
                              </div>
                            </div>
                            <div>
                              <span className="text-gray-600">Email:</span>
                              <div className="text-gray-800 truncate overflow-hidden whitespace-nowrap max-w-[150px]">{moveDetails.email}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Phone:</span>
                              <div className="text-gray-800 font-medium">{phoneNumber || 'To be provided'}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Additional Details */}
                        {moveDetails.additional_details && (
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                              <div className="w-4 h-4 mr-2 text-gray-600">📝</div>
                              Additional Details
                            </h4>
                            <div className="text-sm text-gray-800">
                              {moveDetails.additional_details}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </div>
                )}
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Select Date & Time</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="date"
                        className="pl-11"
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={new Date().toISOString().split('T')[0]} // Set min to today
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Available Time Slots</label>
                    
                    {fetchingSlots ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                      </div>
                    ) : slots.length > 0 ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {slots.map((slot) => (
                          <button
                            key={slot.id}
                            type="button"
                            className={`p-3 rounded-md border ${
                              selectedSlot && selectedSlot.id === slot.id
                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                : slot.available
                                ? 'border-gray-200 hover:border-primary-300 hover:bg-primary-50'
                                : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                            } transition-colors flex flex-col items-center justify-center`}
                            onClick={() => slot.available && handleSlotSelection(slot)}
                            disabled={!slot.available}
                          >
                            <Clock className="h-5 w-5 mb-1" />
                            <span className="text-sm font-medium">{formatTimeSlot(slot)}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                        <p className="text-sm text-yellow-700">
                          No time slots available for the selected date. Please select another date.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Phone Number*</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="pl-11"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      We'll use this number to contact you about your move
                    </p>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={loading || !selectedSlot}
                  >
                    {loading ? 'Confirming...' : 'Confirm Booking'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
