import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import MyMove from '../../pages/move/MyMove';
import * as snackbar from '../../lib/snackbar';
import * as api from '../../lib/api';

// Mock the API and snackbar functions
jest.mock('../../lib/api', () => ({
  moveAPI: {
    createMove: jest.fn()
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
        email: 'test@example.com'
      }
    })
  };
});

describe('MyMove Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  const renderMyMove = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <MyMove />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('renders move form correctly', () => {
    renderMyMove();
    
    // Check for form elements
    expect(screen.getByText('Plan Your Move')).toBeInTheDocument();
    expect(screen.getByText(/Tell us about your move/i)).toBeInTheDocument();
    
    // Move details section
    expect(screen.getByText('Move Details')).toBeInTheDocument();
    expect(screen.getByLabelText(/Move Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destination Location/i)).toBeInTheDocument();
    
    // Property information section
    expect(screen.getByText('Property Information')).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Property Size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Special Items/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Additional Details/i)).toBeInTheDocument();
    
    // User information section
    expect(screen.getByText('Your Information')).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    
    // Submit button
    expect(screen.getByRole('button', { name: /Continue to Book Time/i })).toBeInTheDocument();
  });

  test('pre-fills user information from AuthContext', () => {
    renderMyMove();
    
    // Check that user information is pre-filled
    expect(screen.getByLabelText(/First Name/i)).toHaveValue('Test');
    expect(screen.getByLabelText(/Last Name/i)).toHaveValue('User');
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue('test@example.com');
  });

  test('validates required fields', async () => {
    renderMyMove();
    
    // Submit the form without filling required fields
    fireEvent.click(screen.getByRole('button', { name: /Continue to Book Time/i }));
    
    // Check for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Move date is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Current location is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Destination location is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Property type is required/i)).toBeInTheDocument();
    });
  });

  test('validates move date is in the future', async () => {
    renderMyMove();
    
    // Set move date to yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText(/Move Date/i), {
      target: { value: yesterdayString }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Continue to Book Time/i }));
    
    // Check for validation error
    await waitFor(() => {
      expect(screen.getByText(/Move date must be in the future/i)).toBeInTheDocument();
    });
  });

  test('handles form submission with valid data', async () => {
    // Mock successful API response
    api.moveAPI.createMove.mockResolvedValue({
      success: true,
      message: 'Move details saved successfully',
      data: { id: 123 }
    });
    
    renderMyMove();
    
    // Fill in the form
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText(/Move Date/i), {
      target: { value: tomorrowString }
    });
    
    fireEvent.change(screen.getByLabelText(/Current Location/i), {
      target: { value: '123 Current St, City, State' }
    });
    
    fireEvent.change(screen.getByLabelText(/Destination Location/i), {
      target: { value: '456 New St, City, State' }
    });
    
    // Select property type
    fireEvent.change(screen.getByLabelText(/Property Type/i), {
      target: { value: 'house' }
    });
    
    // Select property size
    fireEvent.change(screen.getByLabelText(/Property Size/i), {
      target: { value: '3bedroom' }
    });
    
    // Fill in special items
    fireEvent.change(screen.getByLabelText(/Special Items/i), {
      target: { value: 'Piano, Artwork' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Continue to Book Time/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(api.moveAPI.createMove).toHaveBeenCalledWith(expect.objectContaining({
        move_date: tomorrowString,
        current_location: '123 Current St, City, State',
        destination_location: '456 New St, City, State',
        property_type: 'house',
        property_size: '3bedroom',
        special_items: 'Piano, Artwork',
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com'
      }));
      
      expect(snackbar.showSuccess).toHaveBeenCalledWith('Move details saved successfully!');
      expect(mockNavigate).toHaveBeenCalledWith('/book-time');
      expect(sessionStorage.getItem('currentMoveId')).toBe('123');
    });
  });

  test('handles API error', async () => {
    // Mock API error
    api.moveAPI.createMove.mockResolvedValue({
      success: false,
      message: 'Failed to save move details',
      errors: {
        move_date: 'Invalid date format'
      }
    });
    
    renderMyMove();
    
    // Fill in minimal required fields
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];
    
    fireEvent.change(screen.getByLabelText(/Move Date/i), {
      target: { value: tomorrowString }
    });
    
    fireEvent.change(screen.getByLabelText(/Current Location/i), {
      target: { value: '123 Current St, City, State' }
    });
    
    fireEvent.change(screen.getByLabelText(/Destination Location/i), {
      target: { value: '456 New St, City, State' }
    });
    
    // Select property type
    fireEvent.change(screen.getByLabelText(/Property Type/i), {
      target: { value: 'house' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Continue to Book Time/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(api.moveAPI.createMove).toHaveBeenCalled();
      expect(snackbar.showError).toHaveBeenCalledWith('Failed to save move details. Please try again.');
      expect(screen.getByText('Invalid date format')).toBeInTheDocument();
    });
  });
});
