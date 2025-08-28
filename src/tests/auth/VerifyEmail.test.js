import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import VerifyEmail from '../../pages/auth/VerifyEmail';
import * as snackbar from '../../lib/snackbar';

// Mock the AuthContext
jest.mock('../../contexts/AuthContext', () => {
  const originalModule = jest.requireActual('../../contexts/AuthContext');
  
  return {
    ...originalModule,
    useAuth: () => ({
      verifyEmail: jest.fn().mockImplementation((token) => {
        if (token === 'valid-token') {
          return Promise.resolve({
            success: true,
            message: 'Email verified successfully'
          });
        }
        return Promise.resolve({
          success: false,
          message: 'Invalid or expired token'
        });
      }),
      resendVerificationEmail: jest.fn().mockImplementation((email) => {
        if (email === 'error@example.com') {
          return Promise.resolve({
            success: false,
            message: 'Failed to resend verification email'
          });
        }
        return Promise.resolve({
          success: true,
          message: 'Verification email sent! Please check your inbox.'
        });
      }),
      emailVerificationStatus: {
        pending: true,
        email: 'test@example.com'
      }
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

// Mock navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    search: ''
  })
}));

describe('VerifyEmail Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  const renderVerifyEmail = (query = '') => {
    return render(
      <MemoryRouter initialEntries={[`/verify-email${query}`]}>
        <AuthProvider>
          <VerifyEmail />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  test('renders email verification page correctly', () => {
    renderVerifyEmail();
    
    // Check for initial state elements
    expect(screen.getByText('Email Verification')).toBeInTheDocument();
    expect(screen.getByText(/Verify your email to continue/i)).toBeInTheDocument();
    expect(screen.getByText(/Please check your email for a verification link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Verification Email/i })).toBeInTheDocument();
    expect(screen.getByText(/Back to login/i)).toBeInTheDocument();
  });

  test('auto-verifies with valid token in URL', async () => {
    // Mock location with valid token
    jest.spyOn(require('react-router-dom'), 'useLocation').mockImplementation(() => ({
      search: '?token=valid-token'
    }));
    
    renderVerifyEmail('?token=valid-token');
    
    // Initially should show loading state
    expect(screen.getByText(/Verifying your email/i)).toBeInTheDocument();
    
    // Wait for verification to complete
    await waitFor(() => {
      expect(snackbar.showSuccess).toHaveBeenCalledWith('Email verified successfully');
      expect(screen.getByText(/Verification Complete!/i)).toBeInTheDocument();
      expect(screen.getByText(/Your email has been verified successfully/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue to Dashboard/i })).toBeInTheDocument();
    });
  });

  test('shows error with invalid token in URL', async () => {
    // Mock location with invalid token
    jest.spyOn(require('react-router-dom'), 'useLocation').mockImplementation(() => ({
      search: '?token=invalid-token'
    }));
    
    renderVerifyEmail('?token=invalid-token');
    
    // Wait for verification to fail
    await waitFor(() => {
      expect(snackbar.showError).toHaveBeenCalledWith('Invalid or expired token');
      expect(screen.getByText(/Verification Failed/i)).toBeInTheDocument();
      expect(screen.getByText(/The verification link is invalid or has expired/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Resend Verification Email/i })).toBeInTheDocument();
    });
  });

  test('handles resend verification email request', async () => {
    renderVerifyEmail();
    
    // Fill in the form with the pre-populated email
    const emailInput = screen.getByLabelText(/Email/i);
    expect(emailInput.value).toBe('test@example.com');
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Send Verification Email/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(snackbar.showSuccess).toHaveBeenCalledWith('Verification email sent! Please check your inbox.');
      
      // Check that the success view is shown
      expect(screen.getByText(/Verification Email Sent!/i)).toBeInTheDocument();
      expect(screen.getByText(/We've sent a verification link to/i)).toBeInTheDocument();
      expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
      
      // Check that the buttons are shown
      expect(screen.getByRole('button', { name: /Resend Again/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Back to Login/i })).toBeInTheDocument();
    });
  });

  test('handles resend verification email error', async () => {
    renderVerifyEmail();
    
    // Change the email to one that will trigger an error
    const emailInput = screen.getByLabelText(/Email/i);
    fireEvent.change(emailInput, {
      target: { value: 'error@example.com' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Send Verification Email/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(snackbar.showError).toHaveBeenCalledWith('Failed to resend verification email');
    });
  });
});
