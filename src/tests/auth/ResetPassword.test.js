import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import ResetPassword from '../../pages/auth/ResetPassword';
import * as snackbar from '../../lib/snackbar';

// Mock the AuthContext
jest.mock('../../contexts/AuthContext', () => {
  const originalModule = jest.requireActual('../../contexts/AuthContext');
  return {
    ...originalModule,
    useAuth: () => ({
      requestPasswordReset: jest.fn().mockImplementation((email) => {
        if (email === 'error@example.com') {
          return Promise.resolve({
            success: false,
            message: 'Failed to send reset email'
          });
        }
        return Promise.resolve({
          success: true,
          message: 'Password reset email sent. Please check your inbox.'
        });
      })
    })
  };
});

// Mock snackbar functions
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

describe('ResetPassword Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  const renderResetPassword = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <ResetPassword />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('renders reset password form correctly', () => {
    renderResetPassword();
    
    // Check for form elements
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
    expect(screen.getByText('Enter your email to receive a password reset link')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send password reset link/i })).toBeInTheDocument();
    expect(screen.getByText(/Back to login/i)).toBeInTheDocument();
  });

  test('handles form submission with valid email', async () => {
    renderResetPassword();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Send password reset link/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(snackbar.showSuccess).toHaveBeenCalledWith('Password reset email sent. Please check your inbox.');
      
      // Check that the success view is shown
      expect(screen.getByText(/Check your email for reset instructions/i)).toBeInTheDocument();
      expect(screen.getByText(/If an account exists with email/i)).toBeInTheDocument();
      expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
      
      // Check that the buttons are shown
      expect(screen.getByRole('button', { name: /Try a different email address/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Return to login page/i })).toBeInTheDocument();
    });
  });

  test('handles form submission with error', async () => {
    renderResetPassword();
    
    // Fill in the form with an email that will trigger an error
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'error@example.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Send password reset link/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(snackbar.showError).toHaveBeenCalledWith('Failed to send reset email');
      
      // Check that the error message is shown
      expect(screen.getByText('Failed to send reset email')).toBeInTheDocument();
      
      // Check that we're still on the form view
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Send password reset link/i })).toBeInTheDocument();
    });
  });

  test('allows trying a different email after submission', async () => {
    renderResetPassword();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Send password reset link/i }));
    
    // Wait for the success view
    await waitFor(() => {
      expect(screen.getByText(/Check your email for reset instructions/i)).toBeInTheDocument();
    });
    
    // Click the "Try a different email" button
    fireEvent.click(screen.getByRole('button', { name: /Try a different email address/i }));
    
    // Check that we're back to the form view
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send password reset link/i })).toBeInTheDocument();
  });
});
