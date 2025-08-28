import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, getAccessToken, setTokens, clearTokens } from '../lib/api'
import { showSuccess, showError, showWarning } from '../lib/snackbar'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [emailVerificationStatus, setEmailVerificationStatus] = useState({
    pending: false,
    email: ''
  })

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = getAccessToken()
      
      if (token) {
        // Try to get user profile to validate token
        const result = await authAPI.getProfile()
        
        if (result.success) {
          setIsAuthenticated(true)
          setUser(result.data)
        } else {
          // Token is invalid, clear it
          clearTokens()
        }
      }
      
      // Check if we have pending email verification
      const pendingVerification = localStorage.getItem('pendingEmailVerification')
      if (pendingVerification) {
        try {
          const verificationData = JSON.parse(pendingVerification)
          setEmailVerificationStatus({
            pending: true,
            email: verificationData.email
          })
        } catch (error) {
          localStorage.removeItem('pendingEmailVerification')
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      clearTokens()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const result = await authAPI.login(credentials)
      
      if (result.success) {
        // Store tokens
        setTokens(result.data.access_token, result.data.refresh_token)
        
        // Update state
        setIsAuthenticated(true)
        setUser(result.data.user)
        
        // Clear any pending verification status if user is verified
        if (result.data.user.is_email_verified) {
          localStorage.removeItem('pendingEmailVerification')
          setEmailVerificationStatus({ pending: false, email: '' })
        }
        
        return { 
          success: true, 
          message: result.message || 'Login successful!',
          emailVerified: result.data.user.is_email_verified
        }
      } else {
        return result
      }
    } catch (error) {
      console.error('Login error:', error)
      return { 
        success: false, 
        message: 'Login failed. Please try again.',
        errors: { detail: error.message }
      }
    }
  }

  const register = async (userData) => {
    try {
      const result = await authAPI.registerEmail(userData)
      
      if (result.success) {
        // Set pending verification status
        setEmailVerificationStatus({
          pending: true,
          email: userData.email
        })
        
        localStorage.setItem('pendingEmailVerification', JSON.stringify({ 
          email: userData.email 
        }))
        
        return result
      } else {
        return result
      }
    } catch (error) {
      console.error('Registration error:', error)
      return { 
        success: false, 
        message: 'Registration failed. Please try again.',
        errors: { detail: error.message }
      }
    }
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear tokens and state regardless of API call result
      clearTokens()
      localStorage.removeItem('pendingEmailVerification')
      
      // Update state
      setIsAuthenticated(false)
      setUser(null)
      setEmailVerificationStatus({ pending: false, email: '' })
    }
  }

  const refreshToken = async () => {
    try {
      const result = await authAPI.refreshToken()
      return result.success
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }

  const updateUserData = (updatedData) => {
    if (!user) return
    
    // Update user state
    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    
    return updatedUser
  }
  
  const updateUserAvatar = async (file) => {
    if (!user) return null
    
    try {
      const result = await authAPI.uploadAvatar(file)
      
      if (result.success) {
        // Update user with new avatar URL
        return updateUserData({ avatar: result.data.avatar })
      } else {
        throw new Error(result.message || 'Avatar upload failed')
      }
    } catch (error) {
      console.error('Avatar upload error:', error)
      // Create a temporary URL for preview as fallback
      const tempURL = URL.createObjectURL(file)
      return updateUserData({ avatar: tempURL })
    }
  }
  
  const updateUserProfile = async (profileData) => {
    try {
      const result = await authAPI.updateProfile(profileData)
      
      if (result.success) {
        // Update user data
        updateUserData(result.data)
        return result
      } else {
        return result
      }
    } catch (error) {
      console.error('Profile update error:', error)
      return { 
        success: false, 
        message: 'Profile update failed. Please try again.',
        errors: { detail: error.message }
      }
    }
  }
  
  const changePassword = async (passwordData) => {
    try {
      const result = await authAPI.changePassword(passwordData)
      return result
    } catch (error) {
      console.error('Password change error:', error)
      return { 
        success: false, 
        message: 'Password change failed. Please try again.',
        errors: { detail: error.message }
      }
    }
  }
  
  const requestPasswordReset = async (email) => {
    try {
      const result = await authAPI.forgotPassword(email)
      return result
    } catch (error) {
      console.error('Password reset request error:', error)
      return { 
        success: false, 
        message: 'Password reset request failed. Please try again.',
        errors: { detail: error.message }
      }
    }
  }
  
  const resetPassword = async (resetData) => {
    try {
      const result = await authAPI.resetPassword(resetData)
      return result
    } catch (error) {
      console.error('Password reset error:', error)
      return { 
        success: false, 
        message: 'Password reset failed. Please try again.',
        errors: { detail: error.message }
      }
    }
  }
  
  const verifyEmail = async (token) => {
    try {
      const result = await authAPI.verifyEmail(token)
      
      if (result.success) {
        // Clear pending verification flag
        localStorage.removeItem('pendingEmailVerification')
        setEmailVerificationStatus({
          pending: false,
          email: ''
        })
        
        // Update user state if logged in
        if (user) {
          updateUserData({ is_email_verified: true })
        }
        
        return result
      } else {
        return result
      }
    } catch (error) {
      console.error('Email verification error:', error)
      return { 
        success: false, 
        message: 'Email verification failed. Please try again.',
        errors: { detail: error.message }
      }
    }
  }
  
  const resendVerificationEmail = async (email) => {
    try {
      const result = await authAPI.resendVerificationEmail(email)
      return result
    } catch (error) {
      console.error('Resend verification error:', error)
      return { 
        success: false, 
        message: 'Failed to resend verification email. Please try again.',
        errors: { detail: error.message }
      }
    }
  }
  
  const setPendingEmailVerification = (email) => {
    localStorage.setItem('pendingEmailVerification', JSON.stringify({ email }))
    setEmailVerificationStatus({
      pending: true,
      email
    })
  }

  const value = {
    isAuthenticated,
    user,
    login,
    register,
    logout,
    refreshToken,
    loading,
    updateUserData,
    updateUserAvatar,
    updateUserProfile,
    changePassword,
    requestPasswordReset,
    resetPassword,
    verifyEmail,
    resendVerificationEmail,
    emailVerificationStatus,
    setPendingEmailVerification
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
