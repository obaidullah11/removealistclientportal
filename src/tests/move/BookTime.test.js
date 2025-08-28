import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import BookTime from '../../pages/move/BookTime';
import * as snackbar from '../../lib/snackbar';
import * as api from '../../lib/api';

// Mock the API and snackbar functions
jest.mock('../../lib/api', () => ({
  moveAPI: {
    getMove: jest.fn()
  },
  bookingAPI: {
    getAvailableSlots: jest.fn(),
    bookTimeSlot: jest.fn()
  }
}));

jest.mock('../../lib/snackbar', () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showWarning: jest.fn()
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}));

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock AuthContext
jest.mock('../../contexts/AuthContext', () => {
  const originalModule = jest.requireActual('../../contexts/AuthContext');
  return {
    ...originalModule,
    useAuth: () => ({
      user: {
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        phone_number: '+12025550179'
      }
    })
  };
});

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
})();
Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage
});

describe('BookTime Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Set up mock move ID in sessionStorage
    mockSessionStorage.setItem('currentMoveId', '123');
    
    // Mock successful move API response
    api.moveAPI.getMove.mockResolvedValue({
      success: true,
      data: {
        id: 123,
        move_date: '2023-06-15',
        current_location: '123 Current St, City, State',
        destination_location: '456 New St, City, State',
        property_type: 'house',
        property_size: '3bedroom',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        from_property_type: 'house',
        from_property_size: '3bedroom',
        to_property_type: 'apartment',
        to_property_size: '2bedroom',
      }
    });
    
    // Mock successful time slots API response
    api.bookingAPI.getAvailableSlots.mockResolvedValue({
      success: true,
      data: {
        slots: [
          { id: 1, start_time: '08:00', end_time: '10:00', available: true },
          { id: 2, start_time: '10:00', end_time: '12:00', available: true },
          { id: 3, start_time: '13:00', end_time: '15:00', available: false }
        ]
      }
    });
  });

  const renderBookTime = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <BookTime />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('renders booking form correctly', async () => {
    renderBookTime();
    
    // Wait for move details to load
    await waitFor(() => {
      expect(api.moveAPI.getMove).toHaveBeenCalledWith('123');
    });
    
    // Check for form elements
    expect(screen.getByText('Book Your Move Time')).toBeInTheDocument();
    expect(screen.getByText(/Select a convenient time/i)).toBeInTheDocument();
    
    // Move summary section
    expect(screen.getByText('Move Summary')).toBeInTheDocument();
    expect(screen.getByText('From:')).toBeInTheDocument();
    expect(screen.getByText('123 Current St, City, State')).toBeInTheDocument();
    expect(screen.getByText('To:')).toBeInTheDocument();
    expect(screen.getByText('456 New St, City, State')).toBeInTheDocument();
    
    // Date & Time section
    expect(screen.getByText('Select Date & Time')).toBeInTheDocument();
    expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    expect(screen.getByText('Available Time Slots')).toBeInTheDocument();
    
    // Time slots
    await waitFor(() => {
      expect(screen.getByText('8:00 AM - 10:00 AM')).toBeInTheDocument();
      expect(screen.getByText('10:00 AM - 12:00 PM')).toBeInTheDocument();
      expect(screen.getByText('1:00 PM - 3:00 PM')).toBeInTheDocument();
    });
    
    // Contact information section
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    
    // Submit button
    expect(screen.getByRole('button', { name: /Confirm Booking/i })).toBeInTheDocument();
  });

  test('pre-fills phone number from AuthContext', async () => {
    renderBookTime();
    
    // Wait for move details to load
    await waitFor(() => {
      expect(api.moveAPI.getMove).toHaveBeenCalledWith('123');
    });
    
    // Check that phone number is pre-filled
    expect(screen.getByLabelText(/Phone Number/i)).toHaveValue('+12025550179');
  });

  test('loads available time slots when date changes', async () => {
    renderBookTime();
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(api.moveAPI.getMove).toHaveBeenCalledWith('123');
      expect(api.bookingAPI.getAvailableSlots).toHaveBeenCalled();
    });
    
    // Change the date
    const newDate = '2023-06-20';
    fireEvent.change(screen.getByLabelText(/Date/i), {
      target: { value: newDate }
    });
    
    // Check that time slots are reloaded
    await waitFor(() => {
      expect(api.bookingAPI.getAvailableSlots).toHaveBeenCalledWith(newDate);
    });
  });

  test('selects a time slot', async () => {
    renderBookTime();
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(api.moveAPI.getMove).toHaveBeenCalledWith('123');
      expect(api.bookingAPI.getAvailableSlots).toHaveBeenCalled();
    });
    
    // Select the first time slot
    const firstSlot = await screen.findByText('8:00 AM - 10:00 AM');
    fireEvent.click(firstSlot);
    
    // Check that the slot is selected (has a different style)
    expect(firstSlot.parentElement).toHaveClass('border-primary-600');
    
    // Check that the confirm button is enabled
    expect(screen.getByRole('button', { name: /Confirm Booking/i })).not.toBeDisabled();
  });

  test('handles form submission with valid data', async () => {
    // Mock successful booking API response
    api.bookingAPI.bookTimeSlot.mockResolvedValue({
      success: true,
      message: 'Booking confirmed successfully',
      data: { id: 456 }
    });
    
    renderBookTime();
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(api.moveAPI.getMove).toHaveBeenCalledWith('123');
      expect(api.bookingAPI.getAvailableSlots).toHaveBeenCalled();
    });
    
    // Select the first time slot
    const firstSlot = await screen.findByText('8:00 AM - 10:00 AM');
    fireEvent.click(firstSlot);
    
    // Enter phone number
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '+12025550180' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(api.bookingAPI.bookTimeSlot).toHaveBeenCalledWith({
        move_id: 123,
        time_slot: 1,
        phone_number: '+12025550180'
      });
      
      expect(snackbar.showSuccess).toHaveBeenCalledWith('Booking confirmed successfully!');
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith('currentMoveId');
      
      // Check that the success view is shown
      expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument();
      expect(screen.getByText(/Your move has been scheduled successfully/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Go to Dashboard/i })).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    // Mock API error
    api.bookingAPI.bookTimeSlot.mockResolvedValue({
      success: false,
      message: 'Failed to confirm booking',
      errors: {
        time_slot: 'This time slot is no longer available'
      }
    });
    
    renderBookTime();
    
    // Wait for initial data to load
    await waitFor(() => {
      expect(api.moveAPI.getMove).toHaveBeenCalledWith('123');
      expect(api.bookingAPI.getAvailableSlots).toHaveBeenCalled();
    });
    
    // Select the first time slot
    const firstSlot = await screen.findByText('8:00 AM - 10:00 AM');
    fireEvent.click(firstSlot);
    
    // Enter phone number
    fireEvent.change(screen.getByLabelText(/Phone Number/i), {
      target: { value: '+12025550180' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Confirm Booking/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(api.bookingAPI.bookTimeSlot).toHaveBeenCalled();
      expect(snackbar.showError).toHaveBeenCalledWith('Failed to confirm booking. Please try again.');
    });
  });

  test('redirects when no move ID is found', async () => {
    // Clear the move ID from sessionStorage
    mockSessionStorage.removeItem('currentMoveId');
    
    renderBookTime();
    
    // Wait for error message and redirect
    await waitFor(() => {
      expect(screen.getByText('No move details found. Please create a move first.')).toBeInTheDocument();
      expect(screen.getByText('Redirecting to move form...')).toBeInTheDocument();
      expect(mockNavigate).toHaveBeenCalledWith('/my-move');
    });
  });
});
