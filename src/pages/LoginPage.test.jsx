import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
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
  login: vi.fn(),
  isAuthenticated: vi.fn(),
  getCurrentUser: vi.fn(),
}));

function renderLoginPage() {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.isAuthenticated.mockReturnValue(false);
    auth.getCurrentUser.mockReturnValue(null);
  });

  // ─── Rendering ──────────────────────────────────────────────────────────

  describe('rendering', () => {
    it('renders the login form with username and password fields', () => {
      renderLoginPage();

      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('renders the WriteSpace brand link', () => {
      renderLoginPage();

      expect(screen.getByText('WriteSpace')).toBeInTheDocument();
    });

    it('renders the welcome heading', () => {
      renderLoginPage();

      expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    });

    it('renders a link to the register page', () => {
      renderLoginPage();

      expect(screen.getByText('Create one')).toBeInTheDocument();
      expect(screen.getByText('Create one').closest('a')).toHaveAttribute('href', '/register');
    });
  });

  // ─── Successful login ──────────────────────────────────────────────────

  describe('successful login', () => {
    it('redirects admin users to /dashboard on successful login', async () => {
      const user = userEvent.setup();
      const adminSession = {
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      };
      auth.login.mockReturnValue({ success: true, session: adminSession });

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'admin');
      await user.type(screen.getByLabelText(/password/i), 'admin123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(auth.login).toHaveBeenCalledWith('admin', 'admin123');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });

    it('redirects regular users to /blogs on successful login', async () => {
      const user = userEvent.setup();
      const userSession = {
        userId: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      };
      auth.login.mockReturnValue({ success: true, session: userSession });

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'alice');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(auth.login).toHaveBeenCalledWith('alice', 'password123');
      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });

    it('redirects to /blogs when session has no role specified', async () => {
      const user = userEvent.setup();
      auth.login.mockReturnValue({ success: true, session: null });

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'alice');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });

  // ─── Failed login ─────────────────────────────────────────────────────

  describe('failed login', () => {
    it('displays an error message when login fails with invalid credentials', async () => {
      const user = userEvent.setup();
      auth.login.mockReturnValue({ success: false, error: 'Invalid credentials' });

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'wrong');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('displays a generic error message when login returns no error string', async () => {
      const user = userEvent.setup();
      auth.login.mockReturnValue({ success: false });

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'wrong');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Login failed');
    });

    it('displays an error message when login throws an unexpected error', async () => {
      const user = userEvent.setup();
      auth.login.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'test');
      await user.type(screen.getByLabelText(/password/i), 'test');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

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

      renderLoginPage();

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

      renderLoginPage();

      expect(mockNavigate).toHaveBeenCalledWith('/blogs', { replace: true });
    });
  });

  // ─── Form interaction ─────────────────────────────────────────────────

  describe('form interaction', () => {
    it('clears previous error when submitting again', async () => {
      const user = userEvent.setup();
      auth.login
        .mockReturnValueOnce({ success: false, error: 'Invalid credentials' })
        .mockReturnValueOnce({ success: true, session: { userId: '1', username: 'alice', displayName: 'Alice', role: 'user' } });

      renderLoginPage();

      await user.type(screen.getByLabelText(/username/i), 'wrong');
      await user.type(screen.getByLabelText(/password/i), 'wrongpass');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');

      await user.clear(screen.getByLabelText(/username/i));
      await user.clear(screen.getByLabelText(/password/i));
      await user.type(screen.getByLabelText(/username/i), 'alice');
      await user.type(screen.getByLabelText(/password/i), 'password123');
      await user.click(screen.getByRole('button', { name: /sign in/i }));

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });
});