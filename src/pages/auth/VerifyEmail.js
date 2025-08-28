import React, { useState, useEffect } from 'react'
import { showSuccess, showError } from '../../lib/snackbar'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { useAuth } from '../../contexts/AuthContext'

export default function VerifyEmail() {
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyEmail, resendVerificationEmail, emailVerificationStatus } = useAuth()
  
  const [token, setToken] = useState('')
  const [email, setEmail] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false) // Add this state

  useEffect(() => {
    // Check for token in URL query params
    const params = new URLSearchParams(location.search)
    const tokenParam = params.get('token')
    const emailParam = params.get('email')
    
    if (tokenParam && !hasAttemptedVerification) { // Add this check
      setToken(tokenParam)
      setHasAttemptedVerification(true) // Mark that we've attempted verification
      handleVerify(tokenParam)
    }
    
    // Set email from URL param or auth context if available
    if (emailParam) {
      setEmail(emailParam)
    } else if (emailVerificationStatus.pending) {
      setEmail(emailVerificationStatus.email)
    }
    
    // If no token but we have email, show resend option
    if (!tokenParam && emailParam) {
      setEmail(emailParam)
    }
  }, [location.search, emailVerificationStatus, hasAttemptedVerification]) // Add hasAttemptedVerification to dependencies

  const handleVerify = async (tokenToVerify) => {
    setVerifying(true)
    setError('')
    
    try {
      const result = await verifyEmail(tokenToVerify)
      
      if (result.success) {
        setVerified(true)
        showSuccess('Email verified successfully!')
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/move')
        }, 3000)
      } else {
        // Check if the error indicates the token is already used
        const errorMessage = result.message || '';
        const nonFieldErrors = result.errors?.non_field_errors || [];
        const hasAlreadyUsedError = errorMessage.includes('already been used') || 
                                  errorMessage.includes('has already been used') ||
                                  nonFieldErrors.some(err => err.includes('already been used'));
        
        if (hasAlreadyUsedError) {
          setVerified(true)
          showSuccess('Email already verified! Redirecting to dashboard...')
          setTimeout(() => {
            navigate('/move')
          }, 2000)
        } else if (errorMessage.includes('expired') || nonFieldErrors.some(err => err.includes('expired'))) {
          setError('This verification link has expired. Please request a new verification email.')
          showError('This verification link has expired. Please request a new verification email.')
        } else if (errorMessage.includes('Invalid') || nonFieldErrors.some(err => err.includes('Invalid'))) {
          setError('This verification link is invalid. Please check your email for the correct link.')
          showError('This verification link is invalid. Please check your email for the correct link.')
        } else {
          // Show the first non-field error or the main message
          const displayError = nonFieldErrors.length > 0 ? nonFieldErrors[0] : (result.message || 'Failed to verify email. Please try again.')
          setError(displayError)
          showError(displayError)
        }
      }
    } catch (error) {
      console.error('Email verification error:', error)
      setError('An unexpected error occurred. Please try again.')
      showError('An unexpected error occurred. Please try again.')
    } finally {
      setVerifying(false)
    }
  }

  const handleResend = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter your email address')
      return
    }
    
    setResending(true)
    setError('')
    
    try {
      const result = await resendVerificationEmail(email)
      
      if (result.success) {
        setResendSuccess(true)
        showSuccess('Verification email sent! Please check your inbox.')
      } else {
        setError(result.message || 'Failed to resend verification email.')
        showError(result.message || 'Failed to resend verification email.')
      }
    } catch (error) {
      console.error('Resend verification error:', error)
      setError('An unexpected error occurred. Please try again.')
      showError('An unexpected error occurred. Please try again.')
    } finally {
      setResending(false)
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
              <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
              <CardDescription className="text-base">
                {verifying ? 'Verifying your email...' : 
                 verified ? 'Email verified successfully!' : 
                 token ? 'Verification failed' :
                 'Verify your email to continue'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Verifying State */}
              {verifying && (
                <div className="text-center py-8">
                  <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary-600" />
                  <p className="mt-4 text-gray-700">Verifying your email address...</p>
                </div>
              )}

              {/* Verified State */}
              {verified && (
                <div className="text-center py-6 space-y-6">
                  <div className="flex justify-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Verification Complete!</h3>
                    <p className="text-gray-600 mt-2">
                      Your email has been verified successfully. You will be redirected to the dashboard shortly.
                    </p>
                  </div>
                  
                  <Link to="/move" className="block">
                    <Button 
                      className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      Continue to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              )}

              {/* Failed Verification State */}
              {!verifying && !verified && token && (
                <div className="text-center py-6 space-y-6">
                  <div className="flex justify-center">
                    <AlertCircle className="h-16 w-16 text-red-500" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Verification Failed</h3>
                    <p className="text-gray-600 mt-2">
                      The verification link is invalid or has expired. Please request a new verification email.
                    </p>
                  </div>
                  
                  <form onSubmit={handleResend} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          className="pl-11 h-12"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={resending}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                      disabled={resending}
                    >
                      {resending ? 'Sending...' : 'Resend Verification Email'}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                  
                  <div className="text-center">
                    <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                      Back to login
                    </Link>
                  </div>
                </div>
              )}

              {/* Initial State - No Token */}
              {!verifying && !verified && !token && (
                <>
                  {resendSuccess ? (
                    <div className="text-center py-6 space-y-6">
                      <div className="flex justify-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Verification Email Sent!</h3>
                        <p className="text-gray-600 mt-2">
                          We've sent a verification link to <span className="font-semibold">{email}</span>.
                          Please check your inbox and click the link to verify your email.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <Button 
                          onClick={() => setResendSuccess(false)}
                          className="w-full h-12 text-base font-semibold"
                          variant="outline"
                        >
                          Resend Again
                        </Button>
                        
                        <Link to="/login" className="block">
                          <Button 
                            className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                          >
                            Back to Login
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-700">
                          Please check your email for a verification link. If you haven't received it, you can request a new one below.
                        </p>
                      </div>
                      
                      <form onSubmit={handleResend} className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700">Email</label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              className="pl-11 h-12"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              disabled={resending}
                            />
                          </div>
                        </div>
                        
                        <Button 
                          type="submit" 
                          className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                          disabled={resending}
                        >
                          {resending ? 'Sending...' : 'Send Verification Email'}
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        
                        <div className="text-center">
                          <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                            Back to login
                          </Link>
                        </div>
                      </form>
                    </>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
