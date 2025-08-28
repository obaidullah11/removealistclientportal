// Validation utility functions for forms

// Email validation
export const validateEmail = (email) => {
  if (!email) return 'Email is required'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Please enter a valid email address'
  return null
}

// Phone number validation (must start with country code)
export const validatePhone = (phone) => {
  if (!phone) return 'Phone number is required'
  
  // Remove spaces, hyphens, and parentheses for validation
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '')
  
  // Must start with + followed by country code and 8-15 digits
  const phoneRegex = /^\+\d{8,15}$/
  if (!phoneRegex.test(cleanPhone)) {
    return 'Phone number must start with a country code (e.g., +1, +44, +92) and be 8-15 digits long'
  }
  
  // Check for common country codes
  const commonCountryCodes = ['+1', '+44', '+91', '+92', '+61', '+49', '+33', '+86', '+81', '+82']
  const hasValidCountryCode = commonCountryCodes.some(code => cleanPhone.startsWith(code))
  
  if (!hasValidCountryCode) {
    return 'Please use a valid country code (e.g., +1 for US, +44 for UK, +91 for India)'
  }
  
  return null
}

// Password validation (minimum length only)
export const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters long'
  return null
}

// Name validation
export const validateName = (name) => {
  if (!name.trim()) return 'Name is required'
  if (name.trim().length < 3) return 'Name must be at least 3 characters long'
  return null
}

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return 'Please confirm your password'
  if (password !== confirmPassword) return 'Passwords do not match'
  return null
}

// Generic field validation
export const validateField = (name, value, additionalData = {}) => {
  switch (name) {
    case 'email':
      return validateEmail(value)
    case 'phone':
    case 'phone_number':
      return validatePhone(value)
    case 'password':
      return validatePassword(value)
    case 'confirmPassword':
      return validateConfirmPassword(additionalData.password, value)
    case 'name':
    case 'first_name':
    case 'last_name':
      return validateName(value)
    default:
      return null
  }
}

// Terms and conditions validation
export const validateTerms = (agreed) => {
  if (!agreed) return 'You must agree to the terms and conditions'
  return null
}

// Move date validation
export const validateMoveDate = (date) => {
  if (!date) return 'Move date is required'
  
  const moveDate = new Date(date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  if (moveDate < today) {
    return 'Move date must be in the future'
  }
  
  // Don't allow moves more than 1 year in advance
  const oneYearFromNow = new Date()
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
  
  if (moveDate > oneYearFromNow) {
    return 'Move date cannot be more than 1 year in advance'
  }
  
  return null
}

// Property type validation
export const validatePropertyType = (type) => {
  const validTypes = ['apartment', 'house', 'townhouse', 'office', 'storage', 'other']
  if (!type) return 'Property type is required'
  if (!validTypes.includes(type)) return 'Please select a valid property type'
  return null
}

// Property size validation
export const validatePropertySize = (size) => {
  const validSizes = ['studio', '1bedroom', '2bedroom', '3bedroom', '4bedroom', 'small_office', 'medium_office', 'large_office']
  if (!size) return 'Property size is required'
  if (!validSizes.includes(size)) return 'Please select a valid property size'
  return null
}

// Address validation
export const validateAddress = (address) => {
  if (!address) return 'Address is required'
  if (address.trim().length < 10) return 'Please enter a complete address'
  return null
}

// Form validation helper
export const validateForm = (formData, fields) => {
  const errors = {}
  
  fields.forEach(field => {
    const error = validateField(field, formData[field], formData)
    if (error) {
      errors[field] = error
    }
  })
  
  return errors
}

// Real-time validation helper for forms
export const createFieldValidator = (validationRules) => {
  return (fieldName, value, allValues = {}) => {
    const rule = validationRules[fieldName]
    if (!rule) return null
    
    if (typeof rule === 'function') {
      return rule(value, allValues)
    }
    
    return validateField(fieldName, value, allValues)
  }
}
