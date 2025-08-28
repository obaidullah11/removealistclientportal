import React, { useState, useEffect } from 'react'
import { showSuccess, showError } from '../../lib/snackbar'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAuth } from '../../contexts/AuthContext'

export default function ResetPasswordConfirm() {
  const { token } = useParams()
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    new_password: '',
    confirm_password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token. Please request a new password reset link.')
    }
  }, [token])

  const validateForm = () => {
    const errors = {}
    
    if (formData.new_password.length < 8) {
      errors.new_password = 'Password must be at least 8 characters long'
    }
    
    if (formData.new_password !== formData.confirm_password) {
      errors.confirm_password = 'Passwords do not match'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const result = await resetPassword({
        token,
        new_password: formData.new_password
      })
      
      if (result.success) {
        setSuccess(true)
        showSuccess('Password reset successful! You can now login with your new password.')
      } else {
        if (result.errors) {
          setValidationErrors(result.errors)
        }
        setError(result.message || 'Failed to reset password. Please try again.')
        showError(result.message || 'Failed to reset password. Please try again.')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setError('An unexpected error occurred. Please try again.')
      showError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
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
              <CardTitle className="text-2xl font-bold">
                {success ? 'Password Reset Complete' : 'Create New Password'}
              </CardTitle>
              <CardDescription className="text-base">
                {success 
                  ? "Your password has been reset successfully" 
                  : "Enter your new password below"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success ? (
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  
                  <p className="text-gray-700">
                    Your password has been reset successfully. You can now login with your new password.
                  </p>
                  
                  <Link to="/login" className="block">
                    <Button 
                      className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      Login Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="new_password"
                        placeholder="Enter new password"
                        className="pl-11 pr-11 h-12"
                        value={formData.new_password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {validationErrors.new_password && (
                      <p className="text-xs text-red-600 mt-1">{validationErrors.new_password}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirm_password"
                        placeholder="Confirm new password"
                        className="pl-11 pr-11 h-12"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                        disabled={loading}
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                    {validationErrors.confirm_password && (
                      <p className="text-xs text-red-600 mt-1">{validationErrors.confirm_password}</p>
                    )}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <div className="text-center">
                    <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                      Back to login
                    </Link>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
