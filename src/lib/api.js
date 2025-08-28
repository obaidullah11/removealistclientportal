// Centralized API service for Django backend integration
import config from '../config/environment'

// Environment configuration
const API_BASE_URL = config.API_BASE_URL;

// Token management
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

// Axios-like fetch wrapper with automatic token management
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Add authorization header if token exists
  const token = getAccessToken();
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    const data = await response.json();
    
    // Handle token refresh for 401 errors
    if (response.status === 401 && token && endpoint !== '/auth/refresh/') {
      const refreshResult = await refreshAccessToken();
      if (refreshResult.success) {
        // Retry the original request with new token
        const newToken = getAccessToken();
        const retryResponse = await fetch(url, {
          ...defaultOptions,
          ...options,
          headers: {
            ...defaultOptions.headers,
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
        
        const retryData = await retryResponse.json();
        
        if (!retryResponse.ok) {
          return {
            success: false,
            message: retryData.message || 'API request failed',
            errors: retryData.errors || {},
            status: retryResponse.status,
            data: retryData.data || {}
          };
        }
        
        return {
          success: true,
          message: retryData.message || 'Success',
          data: retryData.data || retryData,
          status: retryResponse.status
        };
      } else {
        // Refresh failed, clear tokens and redirect to login
        clearTokens();
        window.location.href = '/login';
        return {
          success: false,
          message: 'Session expired. Please login again.',
          errors: { detail: 'Authentication required' },
          status: 401
        };
      }
    }
    
    // Even if response is not ok, return the data with success: false
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'API request failed',
        errors: data.errors || {},
        status: response.status,
        data: data.data || {}
      };
    }
    
    // Return success response
    return {
      success: true,
      message: data.message || 'Success',
      data: data.data || data,
      status: response.status
    };
  } catch (error) {
    console.error('API call failed:', error);
    return {
      success: false,
      message: 'Network error or server unavailable',
      errors: { detail: error.message },
      status: 0
    };
  }
};

// Token refresh function
const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return { success: false };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      setTokens(data.data.access_token, data.data.refresh_token);
      return { success: true };
    } else {
      clearTokens();
      return { success: false };
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
    clearTokens();
    return { success: false };
  }
};

// File upload helper
export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const formData = new FormData();
  
  formData.append('file', file);
  Object.keys(additionalData).forEach(key => {
    formData.append(key, additionalData[key]);
  });

  const token = getAccessToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'File upload failed',
        errors: data.errors || {},
        status: response.status
      };
    }
    
    return {
      success: true,
      message: data.message || 'File uploaded successfully',
      data: data.data || data,
      status: response.status
    };
  } catch (error) {
    console.error('File upload failed:', error);
    return {
      success: false,
      message: 'Network error or server unavailable',
      errors: { detail: error.message },
      status: 0
    };
  }
};

// Authentication API
export const authAPI = {
  // Registration
  registerEmail: (userData) => apiCall('/auth/register/email/', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  // Login
  login: (credentials) => apiCall('/auth/login/', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  // Google Sign-In
  googleSignIn: (googleData) => apiCall('/auth/google/', {
    method: 'POST',
    body: JSON.stringify(googleData)
  }),
  
  // Verification
  verifyEmail: (token) => apiCall('/auth/verify-email/', {
    method: 'POST',
    body: JSON.stringify({ token })
  }),
  
  resendVerificationEmail: (email) => apiCall('/auth/resend-email/', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  
  // Password Management
  forgotPassword: (email) => apiCall('/auth/forgot-password/', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  
  resetPassword: (resetData) => apiCall('/auth/reset-password/', {
    method: 'POST',
    body: JSON.stringify(resetData)
  }),
  
  changePassword: (passwordData) => apiCall('/auth/change-password/', {
    method: 'POST',
    body: JSON.stringify(passwordData)
  }),
  
  // Profile
  getProfile: () => apiCall('/auth/profile/'),
  
  updateProfile: (profileData) => apiCall('/auth/profile/', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),

  uploadAvatar: (file) => uploadFile('/auth/profile/avatar/', file),
  
  // Logout
  logout: () => apiCall('/auth/logout/', {
    method: 'POST',
    body: JSON.stringify({
      refresh_token: getRefreshToken()
    })
  }),
  
  // Token Refresh
  refreshToken: () => refreshAccessToken()
};

// Move Management API
export const moveAPI = {
  // Create move
  createMove: (moveData) => apiCall('/move/create/', {
    method: 'POST',
    body: JSON.stringify(moveData)
  }),
  
  // Get move details
  getMove: (moveId) => apiCall(`/move/get/${moveId}/`),
  
  // Get all moves for current user
  getUserMoves: () => apiCall('/move/user-moves/'),

  // Update move
  updateMove: (moveId, moveData) => apiCall(`/move/update/${moveId}/`, {
    method: 'PUT',
    body: JSON.stringify(moveData)
  }),

  // Delete move
  deleteMove: (moveId) => apiCall(`/move/delete/${moveId}/`, {
    method: 'DELETE'
  })
};

// Booking & Scheduling API
export const bookingAPI = {
  // Get available time slots
  getAvailableSlots: (date) => apiCall(`/booking/slots/?date=${date}`),
  
  // Book a time slot
  bookTimeSlot: (bookingData) => apiCall('/booking/book/', {
    method: 'POST',
    body: JSON.stringify(bookingData)
  }),
  
  // Get user's bookings
  getUserBookings: () => apiCall('/booking/user-bookings/')
};

// Inventory Management API
export const inventoryAPI = {
  // Get rooms for a move
  getRooms: (moveId) => apiCall(`/inventory/rooms/?move_id=${moveId}`),
  
  // Create room
  createRoom: (roomData) => apiCall('/inventory/rooms/', {
    method: 'POST',
    body: JSON.stringify(roomData)
  }),
  
  // Update room
  updateRoom: (roomId, roomData) => apiCall(`/inventory/rooms/${roomId}/`, {
    method: 'PUT',
    body: JSON.stringify(roomData)
  }),
  
  // Mark room as packed
  markRoomPacked: (roomId, packed) => apiCall(`/inventory/rooms/${roomId}/packed/`, {
    method: 'PATCH',
    body: JSON.stringify({ packed })
  }),
  
  // Delete room
  deleteRoom: (roomId) => apiCall(`/inventory/rooms/${roomId}/`, {
    method: 'DELETE'
  }),
  
  // Upload room image
  uploadRoomImage: (roomId, file) => uploadFile(`/inventory/rooms/${roomId}/image/`, file)
};

// Timeline & Task Management API
export const timelineAPI = {
  // Get timeline events
  getTimelineEvents: (moveId) => apiCall(`/timeline/events/?move_id=${moveId}`),
  
  // Update task status
  updateTaskStatus: (eventId, completed) => apiCall(`/timeline/events/${eventId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ completed })
  }),
  
  // Get checklist items
  getChecklistItems: (moveId) => apiCall(`/checklist/items/?move_id=${moveId}`),
  
  // Update checklist item
  updateChecklistItem: (itemId, completed) => apiCall(`/checklist/items/${itemId}/`, {
    method: 'PATCH',
    body: JSON.stringify({ completed })
  }),
  
  // Add custom task
  addCustomTask: (taskData) => apiCall('/checklist/items/', {
    method: 'POST',
    body: JSON.stringify(taskData)
  })
};

// File Management API
export const fileAPI = {
  // Upload floor plan
  uploadFloorPlan: (file, moveId, locationType) => uploadFile('/files/floor-plans/', file, {
    move_id: moveId,
    location_type: locationType
  }),
  
  // Upload document
  uploadDocument: (file, documentType, moveId) => uploadFile('/files/documents/', file, {
    document_type: documentType,
    move_id: moveId
  }),
  
  // Get user files
  getUserFiles: (moveId) => apiCall(`/files/user-files/?move_id=${moveId}`),
  
  // Delete file
  deleteFile: (fileId) => apiCall(`/files/${fileId}/`, {
    method: 'DELETE'
  })
};

// Export token management functions for use in AuthContext
export { getAccessToken, getRefreshToken, setTokens, clearTokens };


