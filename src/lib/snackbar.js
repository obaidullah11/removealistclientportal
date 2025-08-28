// Toast notification utility using Radix UI Toast
// This provides a centralized way to show notifications throughout the app

// Global toast function - will be set by ToastProvider
let globalToast = null

export const setGlobalToast = (toastFn) => {
  globalToast = toastFn
}

// Fallback function for when toast context is not available
const fallbackNotification = (message, type) => {
  console.log(`${type.toUpperCase()}: ${message}`)
  
  // Create a simple notification element as fallback
  const notification = document.createElement('div')
  notification.className = `fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg text-white font-medium max-w-sm ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    type === 'warning' ? 'bg-yellow-500' :
    'bg-blue-500'
  }`
  notification.textContent = message
  
  document.body.appendChild(notification)
  
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification)
    }
  }, 4000)
}

// Main notification functions
export const showSuccess = (message, description) => {
  if (globalToast) {
    globalToast.success(message, description)
  } else {
    fallbackNotification(message, 'success')
  }
}

export const showError = (message, description) => {
  if (globalToast) {
    globalToast.error(message, description)
  } else {
    fallbackNotification(message, 'error')
  }
}

export const showWarning = (message, description) => {
  if (globalToast) {
    globalToast.warning(message, description)
  } else {
    fallbackNotification(message, 'warning')
  }
}

export const showInfo = (message, description) => {
  if (globalToast) {
    globalToast.info(message, description)
  } else {
    fallbackNotification(message, 'info')
  }
}

// Legacy function for backward compatibility
export const showSnackbar = (message, type = 'info') => {
  switch (type) {
    case 'success':
      showSuccess(message)
      break
    case 'error':
      showError(message)
      break
    case 'warning':
      showWarning(message)
      break
    default:
      showInfo(message)
  }
}


