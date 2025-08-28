import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../contexts/AuthContext';
import Login from '../../pages/auth/Login';
import * as snackbar from '../../lib/snackbar';
import * as api from '../../lib/api';

// Mock the API and snackbar functions
jest.mock('../../lib/api', () => ({
  authAPI: {
    login: jest.fn()
  }
}));

jest.mock('../../lib/snackbar', () => ({
  showSuccess: jest.fn(),
  showError: jest.fn(),
  showWarning: jest.fn()
}));

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  }
}));

describe('Login Component', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  const renderLogin = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('renders login form correctly', () => {
    renderLogin();
    
    // Check for form elements
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    expect(screen.getByText(/Forgot password/i)).toBeInTheDocument();
    expect(screen.getByText(/Don't have an account/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign up free/i)).toBeInTheDocument();
  });

  test('handles form submission with valid credentials', async () => {
    // Mock successful login response
    api.authAPI.login.mockResolvedValue({
      success: true,
      message: 'Login successful',
      emailVerified: true,
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          is_email_verified: true
        },
        tokens: {
          access: 'fake-access-token',
          refresh: 'fake-refresh-token'
        }
      }
    });

    renderLogin();
    
    // Fill in the form
    fireEvent.change(screen.getByRole('textbox', { name: /Email/i }), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i, { selector: 'input[type="password"]' }), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(api.authAPI.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(snackbar.showSuccess).toHaveBeenCalledWith('Login successful! Welcome back.');
    });
  });

  test('handles form submission with unverified email', async () => {
    // Mock login response with unverified email
    api.authAPI.login.mockResolvedValue({
      success: true,
      message: 'Login successful',
      emailVerified: false,
      data: {
        user: {
          id: 1,
          email: 'test@example.com',
          first_name: 'Test',
          last_name: 'User',
          is_email_verified: false
        },
        tokens: {
          access: 'fake-access-token',
          refresh: 'fake-refresh-token'
        }
      }
    });

    renderLogin();
    
    // Fill in the form
    fireEvent.change(screen.getByRole('textbox', { name: /Email/i }), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i, { selector: 'input[type="password"]' }), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(api.authAPI.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
      expect(snackbar.showWarning).toHaveBeenCalledWith(
        'Your email is not verified. Some features may be limited. Please check your email for verification instructions.'
      );
    });
  });

  test('handles login error', async () => {
    // Mock failed login response
    api.authAPI.login.mockResolvedValue({
      success: false,
      message: 'Invalid credentials',
      errors: {
        non_field_errors: ['Invalid email or password']
      }
    });

    renderLogin();
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));
    
    // Wait for the API call to resolve
    await waitFor(() => {
      expect(api.authAPI.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
      expect(snackbar.showError).toHaveBeenCalledWith('Invalid email or password');
    });
  });

  test('toggles password visibility', () => {
    renderLogin();
    
    // Password should be hidden by default
    const passwordInput = screen.getByLabelText(/Password/i, { selector: 'input[type="password"]' });
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    // Click the eye icon to show password
    const eyeIcon = screen.getByRole('button', { name: 'Show password' });
    fireEvent.click(eyeIcon);
    
    // Password should now be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    // Click again to hide
    fireEvent.click(eyeIcon);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
