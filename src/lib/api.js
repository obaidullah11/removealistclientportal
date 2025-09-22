// Centralized API service for Django backend integration
import config from "../config/environment";
import { showError } from "./snackbar";

// Environment configuration
const API_BASE_URL = config.API_BASE_URL;

// Token management
const getAccessToken = () => localStorage.getItem("accessToken");
const getRefreshToken = () => localStorage.getItem("refreshToken");
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
};
const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};

// Function to detect token expiration errors
const isTokenExpiredError = (errors) => {
  console.log('Checking token expiration for errors:', errors);
  
  if (!errors || typeof errors !== 'object') return false;
  
  // Check for the specific token_not_valid error format
  if (errors.code === "token_not_valid" || errors.detail === "Given token not valid for any token type") {
    console.log('Token expiration detected!');
    return true;
  }
  
  // Check for messages array with token expiration info
  if (errors.messages && Array.isArray(errors.messages)) {
    const hasExpiredToken = errors.messages.some(msg => 
      msg.message === "Token is invalid or expired" || 
      msg.token_type === "access"
    );
    if (hasExpiredToken) {
      console.log('Token expiration detected in messages!');
      return true;
    }
  }
  
  return false;
};

// Alternative function to check the entire response for token expiration
const isTokenExpiredResponse = (responseData) => {
  console.log('Checking full response for token expiration:', responseData);
  
  // Check if the response itself indicates token expiration
  if (responseData && responseData.errors) {
    return isTokenExpiredError(responseData.errors);
  }
  
  // Check if the response message indicates authentication issues
  if (responseData && responseData.message === "Authentication required") {
    return true;
  }
  
  return false;
};

// Handle session expiry
const handleSessionExpiry = () => {
  // Show popup notification
  showError("Session Expired", "Your session has expired. Please login again.");
  
  // Clear tokens from localStorage
  clearTokens();
  
  // Navigate to login page after a short delay to allow user to see the message
  setTimeout(() => {
    window.location.href = "/login";
  }, 2000);
};

// Axios-like fetch wrapper with automatic token management
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
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
    if (response.status === 401 && token && endpoint !== "/auth/refresh/") {
      // Check if this is a token expiration error before attempting refresh
      if (isTokenExpiredError(data.errors) || isTokenExpiredResponse(data)) {
        handleSessionExpiry();
        return {
          success: false,
          message: "Session expired. Please login again.",
          errors: data.errors || {},
          status: response.status,
          data: data.data || {},
        };
      }
      
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
          // Check for token expiration errors in retry response
          if (isTokenExpiredError(retryData.errors) || isTokenExpiredResponse(retryData)) {
            handleSessionExpiry();
            return {
              success: false,
              message: "Session expired. Please login again.",
              errors: retryData.errors || {},
              status: retryResponse.status,
              data: retryData.data || {},
            };
          }
          
          return {
            success: false,
            message: retryData.message || "API request failed",
            errors: retryData.errors || {},
            status: retryResponse.status,
            data: retryData.data || {},
          };
        }

        return {
          success: true,
          message: retryData.message || "Success",
          data: retryData.data || retryData,
          status: retryResponse.status,
        };
      } else {
        // Refresh failed, handle session expiry
        handleSessionExpiry();
        return {
          success: false,
          message: "Session expired. Please login again.",
          errors: { detail: "Authentication required" },
          status: 401,
        };
      }
    }

    // Even if response is not ok, return the data with success: false
    if (!response.ok) {
      // Check for token expiration errors
      if (isTokenExpiredError(data.errors) || isTokenExpiredResponse(data)) {
        handleSessionExpiry();
        return {
          success: false,
          message: "Session expired. Please login again.",
          errors: data.errors || {},
          status: response.status,
          data: data.data || {},
        };
      }
      
      return {
        success: false,
        message: data.message || "API request failed",
        errors: data.errors || {},
        status: response.status,
        data: data.data || {},
      };
    }

    // Return success response
    return {
      success: true,
      message: data.message || "Success",
      data: data.data || data,
      status: response.status,
    };
  } catch (error) {
    console.error("API call failed:", error);
    return {
      success: false,
      message: "Network error or server unavailable",
      errors: { detail: error.message },
      status: 0,
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
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
    console.error("Token refresh failed:", error);
    clearTokens();
    return { success: false };
  }
};

// File upload helper
export const uploadFile = async (endpoint, file, additionalData = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const formData = new FormData();

  formData.append("file", file);
  Object.keys(additionalData).forEach((key) => {
    formData.append(key, additionalData[key]);
  });

  const token = getAccessToken();
  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "File upload failed",
        errors: data.errors || {},
        status: response.status,
      };
    }

    return {
      success: true,
      message: data.message || "File uploaded successfully",
      data: data.data || data,
      status: response.status,
    };
  } catch (error) {
    console.error("File upload failed:", error);
    return {
      success: false,
      message: "Network error or server unavailable",
      errors: { detail: error.message },
      status: 0,
    };
  }
};

// Authentication API
export const authAPI = {
  // Registration
  registerEmail: (userData) =>
    apiCall("/auth/register/email/", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  // Login
  login: (credentials) =>
    apiCall("/auth/login/", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // Google Sign-In
  googleSignIn: (googleData) =>
    apiCall("/auth/google/", {
      method: "POST",
      body: JSON.stringify(googleData),
    }),

  // Verification
  verifyEmail: (token) =>
    apiCall("/auth/verify-email/", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),

  resendVerificationEmail: (email) =>
    apiCall("/auth/resend-email/", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  // Password Management
  forgotPassword: (email) =>
    apiCall("/auth/forgot-password/", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),

  resetPassword: (resetData) =>
    apiCall("/auth/reset-password/", {
      method: "POST",
      body: JSON.stringify(resetData),
    }),

  changePassword: (passwordData) =>
    apiCall("/auth/change-password/", {
      method: "POST",
      body: JSON.stringify(passwordData),
    }),

  // Profile
  getProfile: () => apiCall("/auth/profile/new/"),

  updateProfile: (profileData) =>
    apiCall("/auth/profile/new/", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  uploadAvatar: (file) => uploadFile("/auth/profile/avatar/", file),

  // Logout
  logout: () =>
    apiCall("/auth/logout/", {
      method: "POST",
      body: JSON.stringify({
        refresh_token: getRefreshToken(),
      }),
    }),

  // Token Refresh
  refreshToken: () => refreshAccessToken(),
};

// Move Management API
export const moveAPI = {
  // Create move
  createMove: (moveData) =>
    apiCall("/move/create/", {
      method: "POST",
      body: JSON.stringify(moveData),
    }),

  // Get move details
  getMove: (moveId) => apiCall(`/move/get/${moveId}/`),

  // Get all moves for current user
  getUserMoves: () => apiCall("/move/user-moves/"),

  // Update move
  updateMove: (moveId, moveData) =>
    apiCall(`/move/update/${moveId}/`, {
      method: "PUT",
      body: JSON.stringify(moveData),
    }),

  // Delete move
  deleteMove: (moveId) =>
    apiCall(`/move/delete/${moveId}/`, {
      method: "DELETE",
    }),

  // Collaborator management
  inviteCollaborator: (collaboratorData) =>
    apiCall("/move/collaborators/invite/", {
      method: "POST",
      body: JSON.stringify(collaboratorData),
    }),

  acceptInvitation: (invitationToken) =>
    apiCall("/move/collaborators/accept/", {
      method: "POST",
      body: JSON.stringify({ invitation_token: invitationToken }),
    }),

  getInvitationDetails: (invitationToken) =>
    apiCall(`/move/collaborators/invitation/${invitationToken}/`),

  getCollaboratorMoves: () =>
    apiCall("/move/collaborators/my-moves/"),

  getCollaborators: (moveId) => 
    apiCall(`/move/collaborators/${moveId}/`),

  removeCollaborator: (collaboratorId) =>
    apiCall(`/move/collaborators/remove/${collaboratorId}/`, {
      method: "DELETE",
    }),

  // Task assignments
  assignTask: (assignmentData) =>
    apiCall("/move/tasks/assign/", {
      method: "POST",
      body: JSON.stringify(assignmentData),
    }),

  getTaskAssignments: (moveId) =>
    apiCall(`/move/tasks/assignments/${moveId}/`),
};

// Booking & Scheduling API
export const bookingAPI = {
  // Get available time slots
  getAvailableSlots: (date) => apiCall(`/booking/slots/?date=${date}`),

  // Book a time slot
  bookTimeSlot: (bookingData) =>
    apiCall("/booking/book/", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  // Get user bookings
  getUserBookings: () => apiCall("/booking/user-bookings/"),
  
  // Cancel booking
  cancelBooking: (bookingId) =>
    apiCall(`/booking/${bookingId}/cancel/`, {
      method: "PATCH",
    }),
};

// Inventory Management API
export const inventoryAPI = {
  // Get rooms for a move
  getRooms: (moveId) => apiCall(`/inventory/rooms/?move_id=${moveId}`),

  // Create room
  createRoom: (roomData) =>
    apiCall("/inventory/rooms/", {
      method: "POST",
      body: JSON.stringify(roomData),
    }),

  // Update room
  updateRoom: (roomId, roomData) =>
    apiCall(`/inventory/rooms/${roomId}/`, {
      method: "PUT",
      body: JSON.stringify(roomData),
    }),

  // Mark room as packed
  markRoomPacked: (roomId, packed) =>
    apiCall(`/inventory/rooms/${roomId}/packed/`, {
      method: "PATCH",
      body: JSON.stringify({ packed }),
    }),

  // Delete room
  deleteRoom: (roomId) =>
    apiCall(`/inventory/rooms/${roomId}/`, {
      method: "DELETE",
    }),

  // Upload room image
  uploadRoomImage: (roomId, file) =>
    uploadFile(`/inventory/rooms/${roomId}/image/`, file),
};

// Timeline & Task Management API
export const timelineAPI = {
  // Get timeline events
  getTimelineEvents: (moveId) => apiCall(`/timeline/events/?move_id=${moveId}`),

  // Update task status
  updateTaskStatus: (eventId, completed) =>
    apiCall(`/timeline/events/${eventId}/`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    }),

  // Get checklist items
  getChecklistItems: (moveId) => apiCall(`/checklist/items/?move_id=${moveId}`),

  // Update checklist item
  updateChecklistItem: (itemId, completed) =>
    apiCall(`/checklist/items/${itemId}/`, {
      method: "PATCH",
      body: JSON.stringify({ completed }),
    }),

  // Add custom task
  addCustomTask: (taskData) =>
    apiCall("/checklist/items/", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),
};

// Task Management API
export const taskAPI = {
  // Get tasks for a move
  getTasks: (moveId, filters = {}) => {
    const params = new URLSearchParams({ move_id: moveId, ...filters });
    return apiCall(`/tasks/?${params}`);
  },

  // Create task
  createTask: (taskData) =>
    apiCall("/tasks/create/", {
      method: "POST",
      body: JSON.stringify(taskData),
    }),

  // Get task details
  getTask: (taskId) => apiCall(`/tasks/${taskId}/`),

  // Update task
  updateTask: (taskId, taskData) =>
    apiCall(`/tasks/${taskId}/update/`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    }),

  // Delete task
  deleteTask: (taskId) =>
    apiCall(`/tasks/${taskId}/delete/`, {
      method: "DELETE",
    }),

  // Create task from template
  createFromTemplate: (templateData) =>
    apiCall("/tasks/from-template/", {
      method: "POST",
      body: JSON.stringify(templateData),
    }),

  // Task timers
  getTimers: (taskId) => apiCall(`/tasks/timers/?task_id=${taskId}`),
  
  startTimer: (timerData) =>
    apiCall("/tasks/timers/start/", {
      method: "POST",
      body: JSON.stringify(timerData),
    }),

  stopTimer: (timerId, timerData) =>
    apiCall(`/tasks/timers/${timerId}/stop/`, {
      method: "PUT",
      body: JSON.stringify(timerData),
    }),

  getActiveTimer: () => apiCall("/tasks/timers/active/"),

  // Task templates
  getTemplates: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/tasks/templates/?${params}`);
  },

  getTemplate: (templateId) => apiCall(`/tasks/templates/${templateId}/`),
};

// Service Booking API
export const serviceAPI = {
  // Get services
  getServices: (moveId, filters = {}) => {
    const params = new URLSearchParams({ move_id: moveId, ...filters });
    return apiCall(`/services/?${params}`);
  },

  // Get service details
  getService: (serviceId) => apiCall(`/services/${serviceId}/`),

  // Get service categories
  getCategories: () => apiCall("/services/categories/"),

  // Service bookings
  getBookings: (moveId, filters = {}) => {
    const params = new URLSearchParams({ move_id: moveId, ...filters });
    return apiCall(`/services/bookings/?${params}`);
  },

  createBooking: (bookingData) =>
    apiCall("/services/bookings/create/", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),

  getBooking: (bookingId) => apiCall(`/services/bookings/${bookingId}/`),

  updateBooking: (bookingId, bookingData) =>
    apiCall(`/services/bookings/${bookingId}/update/`, {
      method: "PUT",
      body: JSON.stringify(bookingData),
    }),

  cancelBooking: (bookingId) =>
    apiCall(`/services/bookings/${bookingId}/cancel/`, {
      method: "DELETE",
    }),

  // Service reviews
  getReviews: (providerId) => apiCall(`/services/reviews/?provider_id=${providerId}`),

  createReview: (reviewData) =>
    apiCall("/services/reviews/create/", {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),

  getReview: (reviewId) => apiCall(`/services/reviews/${reviewId}/`),

  updateReview: (reviewId, reviewData) =>
    apiCall(`/services/reviews/${reviewId}/update/`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    }),

  deleteReview: (reviewId) =>
    apiCall(`/services/reviews/${reviewId}/delete/`, {
      method: "DELETE",
    }),

  // Service quotes
  getQuotes: (bookingId) => apiCall(`/services/quotes/?booking_id=${bookingId}`),

  getQuote: (quoteId) => apiCall(`/services/quotes/${quoteId}/`),
};

// Pricing API
export const pricingAPI = {
  // Get pricing plans
  getPlans: (filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/pricing/plans/?${params}`);
  },

  getPlan: (planId, filters = {}) => {
    const params = new URLSearchParams(filters);
    return apiCall(`/pricing/plans/${planId}/?${params}`);
  },

  // Subscription management
  getSubscription: () => apiCall("/pricing/subscription/"),

  createSubscription: (subscriptionData) =>
    apiCall("/pricing/subscription/create/", {
      method: "POST",
      body: JSON.stringify(subscriptionData),
    }),

  updateSubscription: (subscriptionData) =>
    apiCall("/pricing/subscription/update/", {
      method: "PUT",
      body: JSON.stringify(subscriptionData),
    }),

  cancelSubscription: () =>
    apiCall("/pricing/subscription/cancel/", {
      method: "POST",
    }),

  // Payment history
  getPayments: () => apiCall("/pricing/payments/"),

  // Discount codes
  validateDiscount: (discountData) =>
    apiCall("/pricing/discount/validate/", {
      method: "POST",
      body: JSON.stringify(discountData),
    }),

  getDiscountUsage: () => apiCall("/pricing/discount/usage/"),

  // User plan info
  getUserPlanInfo: () => apiCall("/pricing/user/plan-info/"),
};

// Enhanced Inventory API
export const enhancedInventoryAPI = {
  // Rooms (existing functionality)
  getRooms: (moveId) => apiCall(`/inventory/rooms/?move_id=${moveId}`),
  createRoom: (roomData) =>
    apiCall("/inventory/rooms/", {
      method: "POST",
      body: JSON.stringify(roomData),
    }),
  updateRoom: (roomId, roomData) =>
    apiCall(`/inventory/rooms/${roomId}/`, {
      method: "PUT",
      body: JSON.stringify(roomData),
    }),
  markRoomPacked: (roomId, packed) =>
    apiCall(`/inventory/rooms/${roomId}/packed/`, {
      method: "PATCH",
      body: JSON.stringify({ packed }),
    }),
  deleteRoom: (roomId) =>
    apiCall(`/inventory/rooms/${roomId}/`, {
      method: "DELETE",
    }),
  uploadRoomImage: (roomId, file) =>
    uploadFile(`/inventory/rooms/${roomId}/image/`, file),

  // Boxes
  getBoxes: (moveId) => apiCall(`/inventory/boxes/?move_id=${moveId}`),
  createBox: (boxData) =>
    apiCall("/inventory/boxes/", {
      method: "POST",
      body: JSON.stringify(boxData),
    }),
  getBox: (boxId) => apiCall(`/inventory/boxes/${boxId}/`),
  updateBox: (boxId, boxData) =>
    apiCall(`/inventory/boxes/${boxId}/`, {
      method: "PUT",
      body: JSON.stringify(boxData),
    }),
  deleteBox: (boxId) =>
    apiCall(`/inventory/boxes/${boxId}/`, {
      method: "DELETE",
    }),

  // Heavy Items
  getHeavyItems: (moveId) => apiCall(`/inventory/heavy-items/?move_id=${moveId}`),
  createHeavyItem: (itemData) =>
    apiCall("/inventory/heavy-items/", {
      method: "POST",
      body: JSON.stringify(itemData),
    }),
  getHeavyItem: (itemId) => apiCall(`/inventory/heavy-items/${itemId}/`),
  updateHeavyItem: (itemId, itemData) =>
    apiCall(`/inventory/heavy-items/${itemId}/`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    }),
  deleteHeavyItem: (itemId) =>
    apiCall(`/inventory/heavy-items/${itemId}/`, {
      method: "DELETE",
    }),

  // High Value Items
  getHighValueItems: (moveId) => apiCall(`/inventory/high-value-items/?move_id=${moveId}`),
  createHighValueItem: (itemData) =>
    apiCall("/inventory/high-value-items/", {
      method: "POST",
      body: JSON.stringify(itemData),
    }),
  getHighValueItem: (itemId) => apiCall(`/inventory/high-value-items/${itemId}/`),
  updateHighValueItem: (itemId, itemData) =>
    apiCall(`/inventory/high-value-items/${itemId}/`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    }),
  deleteHighValueItem: (itemId) =>
    apiCall(`/inventory/high-value-items/${itemId}/`, {
      method: "DELETE",
    }),

  // Storage Items
  getStorageItems: (moveId) => apiCall(`/inventory/storage-items/?move_id=${moveId}`),
  createStorageItem: (itemData) =>
    apiCall("/inventory/storage-items/", {
      method: "POST",
      body: JSON.stringify(itemData),
    }),
  getStorageItem: (itemId) => apiCall(`/inventory/storage-items/${itemId}/`),
  updateStorageItem: (itemId, itemData) =>
    apiCall(`/inventory/storage-items/${itemId}/`, {
      method: "PUT",
      body: JSON.stringify(itemData),
    }),
  deleteStorageItem: (itemId) =>
    apiCall(`/inventory/storage-items/${itemId}/`, {
      method: "DELETE",
    }),

  // Export and Share
  exportInventoryPDF: (moveId) => {
    return fetch(`${API_BASE_URL}/inventory/export/pdf/?move_id=${moveId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  },
  exportInventoryExcel: (moveId) => {
    return fetch(`${API_BASE_URL}/inventory/export/excel/?move_id=${moveId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  },
  shareInventory: (shareData) =>
    apiCall("/inventory/share/", {
      method: "POST",
      body: JSON.stringify(shareData),
    }),
};

// File Management API
export const fileAPI = {
  // Upload floor plan
  uploadFloorPlan: (file, moveId, locationType) =>
    uploadFile("/files/floor-plans/", file, {
      move_id: moveId,
      location_type: locationType,
    }),

  // Upload document
  uploadDocument: (file, documentType, moveId) =>
    uploadFile("/files/documents/", file, {
      document_type: documentType,
      move_id: moveId,
    }),

  // Get user files
  getUserFiles: (moveId) => apiCall(`/files/user-files/?move_id=${moveId}`),

  // Delete file
  deleteFile: (fileId) =>
    apiCall(`/files/${fileId}/`, {
      method: "DELETE",
    }),
};

// Export token management functions for use in AuthContext
export { getAccessToken, getRefreshToken, setTokens, clearTokens };
