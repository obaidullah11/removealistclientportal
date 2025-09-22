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
  const [hasAttemptedVerification, setHasAttemptedVerification] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const tokenParam = params.get('token')
    const emailParam = params.get('email')
    
    if (tokenParam) {
      setToken(tokenParam)
      
      // Only auto-verify if we haven't attempted verification yet
      if (!hasAttemptedVerification) {
        setHasAttemptedVerification(true)
        
        // Add a small delay to ensure state is set
        setTimeout(() => {
          handleVerify(tokenParam)
        }, 100)
      }
    }
    
    if (emailParam) {
      setEmail(emailParam)
    } else if (emailVerificationStatus && emailVerificationStatus.pending) {
      setEmail(emailVerificationStatus.email)
    }
  }, [location.search, emailVerificationStatus, hasAttemptedVerification])

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
        // Handle error cases
        const errorMessage = result.message || 'Verification failed'
        setError(errorMessage)
        showError(errorMessage)
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
    setResendSuccess(false)
    
    try {
      const result = await resendVerificationEmail(email)
      
      if (result.success) {
        setResendSuccess(true)
        showSuccess('Verification email sent! Please check your inbox.')
      } else {
        const errorMsg = result.message || 'Failed to send verification email'
        setError(errorMsg)
        showError(errorMsg)
      }
    } catch (error) {
      console.error('Resend email error:', error)
      setError('Failed to send verification email. Please try again.')
      showError('Failed to send verification email. Please try again.')
    } finally {
      setResending(false)
    }
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

            {/* Default State - Show resend form */}
            {!verifying && !verified && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    <Mail className="h-12 w-12 text-primary-600" />
                  </div>
                  <p className="text-gray-700 mb-4">
                    Please check your email for a verification link, or enter your email below to resend the verification.
                  </p>
                </div>

                <form onSubmit={handleResend} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
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

                  {resendSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-600">
                        Verification email sent! Please check your inbox and spam folder.
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold bg-primary-600 hover:bg-primary-700 text-white"
                    disabled={resending}
                  >
                    {resending ? 'Sending...' : 'Send Verification Email'}
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
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}