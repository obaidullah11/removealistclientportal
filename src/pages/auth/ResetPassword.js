import React, { useState } from 'react'
import { showSuccess, showError } from '../../lib/snackbar'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAuth } from '../../contexts/AuthContext'

export default function ResetPassword() {
  const { requestPasswordReset } = useAuth()
  
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const result = await requestPasswordReset(email)
      
      if (result.success) {
        setSubmitted(true)
        showSuccess('Password reset email sent. Please check your inbox.')
      } else {
        setError(result.message || 'Failed to send reset email. Please try again.')
        showError(result.message || 'Failed to send reset email. Please try again.')
      }
    } catch (error) {
      console.error('Reset password error:', error)
      setError('An unexpected error occurred. Please try again.')
      showError('An unexpected error occurred. Please try again.')
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
              <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
              <CardDescription className="text-base">
                {submitted 
                  ? "Check your email for reset instructions" 
                  : "Enter your email to receive a password reset link"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {submitted ? (
                <div className="text-center space-y-6">
                  <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                    <p className="text-sm text-green-700">
                      If an account exists with email <span className="font-semibold">{email}</span>, 
                      you will receive a password reset link shortly.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => setSubmitted(false)}
                      className="w-full h-12 text-base font-semibold"
                      variant="outline"
                      aria-label="Try a different email address"
                    >
                      Try a different email
                    </Button>
                    
                    <Link to="/login" className="block">
                      <Button 
                        className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                        aria-label="Return to login page"
                      >
                        Return to login
                        <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="reset-email" className="text-sm font-semibold text-gray-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="reset-email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-11 h-12"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                        aria-describedby="email-error"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={loading}
                    aria-label="Send password reset link"
                  >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
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
