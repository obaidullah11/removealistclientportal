import React, { useState } from 'react'
import { showSuccess, showError } from '../../lib/snackbar'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Phone } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Checkbox } from '../../components/ui/checkbox'
import { useAuth } from '../../contexts/AuthContext'
import { validateField, validateTerms } from '../../lib/validation'

export default function Signup() {
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    agree_to_terms: false
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setFieldErrors({})

    // Client-side validation
    const validationErrors = {}
    
    // Validate all fields using utility
    const fieldsToValidate = ['first_name', 'last_name', 'email', 'phone_number', 'password', 'confirm_password']
    fieldsToValidate.forEach(field => {
      let error = null
      if (field === 'phone_number') {
        error = validateField('phone', formData[field])
      } else if (field === 'confirm_password') {
        error = validateField('confirmPassword', formData[field], { password: formData.password })
      } else {
        error = validateField(field, formData[field])
      }
      
      if (error) {
        validationErrors[field] = error
      }
    })
    
    // Check terms agreement
    const termsError = validateTerms(formData.agree_to_terms)
    if (termsError) {
      validationErrors.agree_to_terms = termsError
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors)
      setLoading(false)
      return
    }

    try {
      // Use form data directly as it matches backend structure
      const userData = formData

      const result = await register(userData)
      
      if (result.success) {
        // Show success message and redirect to email verification page
        const successMsg = result.message || 'Account created successfully! Please check your email for verification.';
        showSuccess(successMsg);
        navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`)
      } else {
        // Handle specific error cases
        if (result.errors) {
          // Check for duplicate email error
          if (result.errors.email && result.errors.email.includes('already exists')) {
            const errorMsg = 'This email is already registered. Please log in or use a different email.';
            setError(errorMsg);
            showError(errorMsg);
            setFieldErrors({
              ...result.errors,
              email: ['This email is already registered.']
            })
          } else {
            setFieldErrors(result.errors);
            const errorMsg = result.message || 'Registration failed';
            setError(errorMsg);
            showError(errorMsg);
          }
        } else {
          const errorMsg = result.message || 'Registration failed';
          setError(errorMsg);
          showError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      const errorMsg = 'Registration failed. Please try again.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider) => {
    setLoading(true)
    setError('')

    try {
      // For now, we'll use mock data for social signup
      // In production, you'd integrate with Google/Facebook OAuth
      console.log(`Signup with ${provider}`)
      
      // Mock social signup - redirect to main app
      navigate('/move')
    } catch (error) {
      setError(`${provider} signup failed. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  // Validation functions using utility
  const validateFieldLocal = (name, value) => {
    if (name === 'phone_number') {
      return validateField('phone', value)
    } else if (name === 'confirm_password') {
      return validateField('confirmPassword', value, { password: formData.password })
    }
    return validateField(name, value, formData)
  }

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleFieldBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Validate field on blur
    const error = validateFieldLocal(field, formData[field])
    if (error) {
      setFieldErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName] || null
  }

  const isFieldValid = (fieldName) => {
    return !fieldErrors[fieldName] && touched[fieldName]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-2">
          <Link to="/" className="inline-flex items-center space-x-3">
            <img src="/images/logo.png" alt="logo" className="w-25 h-12" />
          </Link>
        </div>
        
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
            <CardDescription className="text-base">
            Register for an AI-powered personalised moving plan.

            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">


            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="first_name" className="text-sm font-semibold text-gray-700">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="first_name"
                      type="text"
                      placeholder="First name"
                      className={`pl-11 h-12 ${getFieldError('first_name') ? 'border-red-300' : ''} ${isFieldValid('first_name') ? 'border-green-300' : ''}`}
                      value={formData.first_name}
                      onChange={(e) => handleFieldChange('first_name', e.target.value)}
                      onBlur={() => handleFieldBlur('first_name')}
                      required
                      disabled={loading}
                      aria-describedby="first_name-error"
                    />
                  </div>
                  {getFieldError('first_name') && (
                    <p className="text-xs text-red-500">{getFieldError('first_name')}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="last_name" className="text-sm font-semibold text-gray-700">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                    <Input
                      id="last_name"
                      type="text"
                      placeholder="Last name"
                      className={`pl-11 h-12 ${getFieldError('last_name') ? 'border-red-300' : ''} ${isFieldValid('last_name') ? 'border-green-300' : ''}`}
                      value={formData.last_name}
                      onChange={(e) => handleFieldChange('last_name', e.target.value)}
                      onBlur={() => handleFieldBlur('last_name')}
                      required
                      disabled={loading}
                      aria-describedby="last_name-error"
                    />
                  </div>
                  {getFieldError('last_name') && (
                    <p className="text-xs text-red-500">{getFieldError('last_name')}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className={`pl-11 h-12 ${getFieldError('email') ? 'border-red-300' : ''} ${isFieldValid('email') ? 'border-green-300' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleFieldBlur('email')}
                    required
                    disabled={loading}
                    aria-describedby="email-error"
                  />
                </div>
                {getFieldError('email') && (
                  <p className="text-xs text-red-500">{getFieldError('email')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone_number" className="text-sm font-semibold text-gray-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="phone_number"
                    type="tel"
                    placeholder="+1234567890"
                    className={`pl-11 h-12 ${getFieldError('phone_number') ? 'border-red-300' : ''} ${isFieldValid('phone_number') ? 'border-green-300' : ''}`}
                    value={formData.phone_number}
                    onChange={(e) => handleFieldChange('phone_number', e.target.value)}
                    onBlur={() => handleFieldBlur('phone_number')}
                    required
                    disabled={loading}
                    aria-describedby="phone_number-error"
                  />
                </div>
                <p className="text-xs text-gray-500">Include country code (e.g., +1 for US, +44 for UK)</p>
                {getFieldError('phone_number') && (
                  <p className="text-xs text-red-500">{getFieldError('phone_number')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className={`pl-11 pr-11 h-12 ${getFieldError('password') ? 'border-red-300' : ''} ${isFieldValid('password') ? 'border-green-300' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleFieldChange('password', e.target.value)}
                    onBlur={() => handleFieldBlur('password')}
                    required
                    disabled={loading}
                    aria-describedby="password-error"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {getFieldError('password') && (
                  <p className="text-xs text-red-500">{getFieldError('password')}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm_password" className="text-sm font-semibold text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <Input
                    id="confirm_password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className={`pl-11 pr-11 h-12 ${getFieldError('confirm_password') ? 'border-red-300' : ''} ${isFieldValid('confirm_password') ? 'border-green-300' : ''}`}
                    value={formData.confirm_password}
                    onChange={(e) => handleFieldChange('confirm_password', e.target.value)}
                    onBlur={() => handleFieldBlur('confirm_password')}
                    required
                    disabled={loading}
                    aria-describedby="confirm_password-error"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {getFieldError('confirm_password') && (
                  <p className="text-xs text-red-500">{getFieldError('confirm_password')}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="agree_to_terms"
                    checked={formData.agree_to_terms}
                    onCheckedChange={(checked) => handleFieldChange('agree_to_terms', checked)}
                    disabled={loading}
                  />
                  <label htmlFor="agree_to_terms" className="text-sm text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                {getFieldError('agree_to_terms') && (
                  <p className="text-xs text-red-500">{getFieldError('agree_to_terms')}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
