import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage.jsx';
import * as auth from '../utils/auth.js';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../utils/auth.js', () => ({
  register: vi.fn(),
  isAuthenticated: vi.fn(),
  getCurrentUser: vi.fn(),
}));

function renderRegisterPage() {
  return render(
    <BrowserRouter>
      <RegisterPage />
    </BrowserRouter>
  );
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.isAuthenticated.mockReturnValue(false);
    auth.getCurrentUser.mockReturnValue(null);
  });

  // ─── Rendering ──────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders the registration form with all required fields', () => {
      renderRegisterPage();

      expect(screen.getByLabelText(/display name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('renders the WriteSpace brand link', () => {
      renderRegisterPage();

      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
    });

    it('renders the create account heading', () => {
      renderRegisterPage();

      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
    });

    it('renders a link to the login page', () => {
      renderRegisterPage();

      expect(screen.getByText('Sign in')).toBeInTheDocument();
      expect(screen.getByText('Sign in').closest('a')).toHaveAttribute('href', '/login');
    });
  });

  // ─── Successful registration ───────────────────────────────────────────

  describe('successful registration', () => {
    it('redirects to /blogs on successful registration', async () => {
      const user = userEvent.setup();
      const userSession = {
        userId: 'test-uuid-1234',
        username: 'bob',
        displayName: 'Bob',
        role: 'user',
      };
      auth.register.mockReturnValue({ success: true, session: userSession });

      renderRegisterPage();

      await user.type(screen.getByLabelText(/display name/i), 'Bob');
      await user.type(screen.getByLabelText(/username/i), 'bob');
      await user.type(screen.getByLabelText(/^password$/i), 'securepass');
      await user.type(screen.getByLabelText(/confirm password/i), 'securepass');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(auth.register).toHaveBeenCalledWith('Bob', 'bob', 'securepass');
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });

  // ─── Validation errors ─────────────────────────────────────────────────

  describe('validation errors', () => {
    it('displays an error when passwords do not match', async () => {
      const user = userEvent.setup();

      renderRegisterPage();

      await user.type(screen.getByLabelText(/display name/i), 'Bob');
      await user.type(screen.getByLabelText(/username/i), 'bob');
      await user.type(screen.getByLabelText(/^password$/i), 'password1');
      await user.type(screen.getByLabelText(/confirm password/i), 'password2');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Passwords do not match');
      expect(auth.register).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('displays an error when registration fails with duplicate username', async () => {
      const user = userEvent.setup();
      auth.register.mockReturnValue({ success: false, error: 'Username already exists' });

      renderRegisterPage();

      await user.type(screen.getByLabelText(/display name/i), 'Alice');
      await user.type(screen.getByLabelText(/username/i), 'alice');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Username already exists');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('displays a generic error when registration returns no error string', async () => {
      const user = userEvent.setup();
      auth.register.mockReturnValue({ success: false });

      renderRegisterPage();

      await user.type(screen.getByLabelText(/display name/i), 'Bob');
      await user.type(screen.getByLabelText(/username/i), 'bob');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Registration failed');
    });

    it('displays an error when register throws an unexpected error', async () => {
      const user = userEvent.setup();
      auth.register.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      renderRegisterPage();

      await user.type(screen.getByLabelText(/display name/i), 'Bob');
      await user.type(screen.getByLabelText(/username/i), 'bob');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('An unexpected error occurred. Please try again.');
    });
  });

  // ─── Already authenticated redirect ───────────────────────────────────

  describe('already authenticated redirect', () => {
    it('redirects authenticated admin users to /dashboard', () => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      renderRegisterPage();

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    it('redirects authenticated regular users to /blogs', () => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        userId: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      renderRegisterPage();

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });

  // ─── Form interaction ─────────────────────────────────────────────────

  describe('form interaction', () => {
    it('clears previous error when submitting again successfully', async () => {
      const user = userEvent.setup();
      auth.register
        .mockReturnValueOnce({ success: false, error: 'Username already exists' })
        .mockReturnValueOnce({ success: true, session: { userId: '1', username: 'bob', displayName: 'Bob', role: 'user' } });

      renderRegisterPage();

      await user.type(screen.getByLabelText(/display name/i), 'Bob');
      await user.type(screen.getByLabelText(/username/i), 'bob');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Username already exists');

      await user.clear(screen.getByLabelText(/display name/i));
      await user.clear(screen.getByLabelText(/username/i));
      await user.clear(screen.getByLabelText(/^password$/i));
      await user.clear(screen.getByLabelText(/confirm password/i));
      await user.type(screen.getByLabelText(/display name/i), 'Bob');
      await user.type(screen.getByLabelText(/username/i), 'bob2');
      await user.type(screen.getByLabelText(/^password$/i), 'password123');
      await user.type(screen.getByLabelText(/confirm password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('does not call register when passwords do not match', async () => {
      const user = userEvent.setup();

      renderRegisterPage();

      await user.type(screen.getByLabelText(/display name/i), 'Bob');
      await user.type(screen.getByLabelText(/username/i), 'bob');
      await user.type(screen.getByLabelText(/^password$/i), 'pass1');
      await user.type(screen.getByLabelText(/confirm password/i), 'pass2');
      await user.click(screen.getByRole('button', { name: /create account/i }));

      expect(auth.register).not.toHaveBeenCalled();
    });
  });
});