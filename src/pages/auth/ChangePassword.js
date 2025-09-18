import React, { useState } from 'react'
import { showSuccess, showError } from '../../lib/snackbar'
import { motion } from 'framer-motion'
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { PageContainer } from '../../components/ui/page-container'
import { useAuth } from '../../contexts/AuthContext'

export default function ChangePassword() {
  const { changePassword } = useAuth()
  
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({})

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
      const result = await changePassword({
        current_password: formData.current_password,
        new_password: formData.new_password
      })
      
      if (result.success) {
        setSuccess(true)
        setFormData({
          current_password: '',
          new_password: '',
          confirm_password: ''
        })
        showSuccess('Password changed successfully!')
      } else {
        if (result.errors) {
          setValidationErrors(result.errors)
        }
        setError(result.message || 'Failed to change password. Please try again.')
        showError(result.message || 'Failed to change password. Please try again.')
      }
    } catch (error) {
      console.error('Change password error:', error)
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

  const resetForm = () => {
    setSuccess(false)
    setFormData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    })
    setValidationErrors({})
  }

  return (
    <PageContainer maxWidth="max-w-2xl">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700">Your password has been changed successfully.</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type={showCurrentPassword ? "text" : "password"}
                    name="current_password"
                    placeholder="Enter current password"
                    className="pl-11 pr-11"
                    value={formData.current_password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showCurrentPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {validationErrors.current_password && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.current_password}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    name="new_password"
                    placeholder="Enter new password"
                    className="pl-11 pr-11"
                    value={formData.new_password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showNewPassword ? <EyeOff /> : <Eye />}
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
                <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    placeholder="Confirm new password"
                    className="pl-11 pr-11"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 h-5 w-5 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {validationErrors.confirm_password && (
                  <p className="text-xs text-red-600 mt-1">{validationErrors.confirm_password}</p>
                )}
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  type="button" 
                  variant="outline"
                  className="flex-1"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </Button>
                
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
    </PageContainer>
  )
}
