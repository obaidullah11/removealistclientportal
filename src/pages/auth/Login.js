import React, { useState } from 'react'
import { showSuccess, showWarning, showError } from '../../lib/snackbar'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { useAuth } from '../../contexts/AuthContext'
import { validateField } from '../../lib/validation'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  
  const [fieldErrors, setFieldErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
        // Client-side validation using utility
  const validationErrors = {}
  
  const emailError = validateField('email', formData.email)
  if (emailError) validationErrors.email = emailError
  
  const passwordError = validateField('password', formData.password)
  if (passwordError) validationErrors.password = passwordError
  
  if (Object.keys(validationErrors).length > 0) {
    setFieldErrors(validationErrors)
    setLoading(false)
    return
  }
      
      let credentials = {
        email: formData.email,
        password: formData.password
      }

      const result = await login(credentials)
      
      if (result.success) {
        // Check if email is verified
        if (result.emailVerified === false) {
          // Show warning but still allow login
          showWarning('Your email is not verified. Some features may be limited. Please check your email for verification instructions.')
        } else {
          // Show success message
          showSuccess('Login successful! Welcome back.')
        }
        
        // Redirect to intended destination or default to /move
        const from = location.state?.from?.pathname || '/move'
        navigate('/my-move', { replace: true })
      } else {
        // Handle specific error cases
        if (result.errors && result.errors.non_field_errors) {
          if (result.errors.non_field_errors.includes('verify your email')) {
            const errorMsg = 'Please verify your email before logging in. Check your inbox for verification instructions.';
            setError(errorMsg);
            showError(errorMsg);
          } else {
            setError(result.errors.non_field_errors[0]);
            showError(result.errors.non_field_errors[0]);
          }
        } else {
          const errorMsg = result.message || 'Login failed. Please try again.';
          setError(errorMsg);
          showError(errorMsg);
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMsg = 'Login failed. Please try again.';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setLoading(false)
    }
  }

  // Validation functions using utility
  const validateFieldLocal = (name, value) => {
    return validateField(name, value)
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

  const handleSocialLogin = async (provider) => {
    setLoading(true)
    setError('')

    try {
      // For now, we'll use mock data for social login
      // In production, you'd integrate with Google/Facebook OAuth
      console.log(`Login with ${provider}`)
      
      // Mock social login data
      const userData = {
        id: Date.now(),
        email: `user@${provider}.com`,
        name: `${provider} User`,
        provider
      }
      
      // For now, we'll just redirect
      // In production, you'd call the Google/Facebook OAuth endpoints
      navigate('/my-move', { replace: true })
    } catch (error) {
      setError(`${provider} login failed. Please try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-2"
        >
          <Link to="/" className="inline-flex items-center space-x-3">
           <img src="/images/logo.png" alt="logo" className="w-25 h-12" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">Welcome back!</CardTitle>
              <CardDescription className="text-base">
                Sign in to continue your moving journey
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">


              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Tabs defaultValue="email" className="w-full">
                <TabsContent value="email" className="space-y-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                      <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
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

                    <div className="text-right">
                      <Link to="/reset-password" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Forgot password?
                      </Link>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                      disabled={loading}
                    >
                      {loading ? 'Signing In...' : 'Sign In'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <Link to="/signup" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                  Sign up free
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}