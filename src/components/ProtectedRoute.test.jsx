import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import * as auth from '../utils/auth.js';

vi.mock('../utils/auth.js', () => ({
  isAuthenticated: vi.fn(),
  isAdmin: vi.fn(),
  getCurrentUser: vi.fn(),
}));

function renderWithRouter(initialEntry, adminOnly = false) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<ProtectedRoute adminOnly={adminOnly} />}>
          <Route
            path="/protected"
            element={<div data-testid="protected-content">Protected Content</div>}
          />
          <Route
            path="/dashboard"
            element={<div data-testid="dashboard-content">Dashboard Content</div>}
          />
        </Route>
        <Route
          path="/login"
          element={<div data-testid="login-page">Login Page</div>}
        />
        <Route
          path="/blogs"
          element={<div data-testid="blogs-page">Blogs Page</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── Unauthenticated users ─────────────────────────────────────────────

  describe('unauthenticated users', () => {
    it('redirects to /login when user is not authenticated', () => {
      auth.isAuthenticated.mockReturnValue(false);
      auth.getCurrentUser.mockReturnValue(null);

      renderWithRouter('/protected');

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('redirects to /login when user is not authenticated on admin-only route', () => {
      auth.isAuthenticated.mockReturnValue(false);
      auth.getCurrentUser.mockReturnValue(null);

      renderWithRouter('/dashboard', true);

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard-content')).not.toBeInTheDocument();
    });
  });

  // ─── Authenticated regular users ──────────────────────────────────────

  describe('authenticated regular users', () => {
    it('renders protected content for authenticated users', () => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        userId: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      auth.isAdmin.mockReturnValue(false);

      renderWithRouter('/protected');

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('redirects to /blogs when non-admin user accesses admin-only route', () => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        userId: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      auth.isAdmin.mockReturnValue(false);

      renderWithRouter('/dashboard', true);

      expect(screen.getByTestId('blogs-page')).toBeInTheDocument();
      expect(screen.queryByTestId('dashboard-content')).not.toBeInTheDocument();
    });
  });

  // ─── Authenticated admin users ────────────────────────────────────────

  describe('authenticated admin users', () => {
    it('renders protected content for admin users', () => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
      auth.isAdmin.mockReturnValue(true);

      renderWithRouter('/protected');

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('renders admin-only content for admin users', () => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
      auth.isAdmin.mockReturnValue(true);

      renderWithRouter('/dashboard', true);

      expect(screen.getByTestId('dashboard-content')).toBeInTheDocument();
      expect(screen.queryByTestId('blogs-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });
  });

  // ─── Default props ────────────────────────────────────────────────────

  describe('default props', () => {
    it('defaults adminOnly to false and allows authenticated users', () => {
      auth.isAuthenticated.mockReturnValue(true);
      auth.getCurrentUser.mockReturnValue({
        userId: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      auth.isAdmin.mockReturnValue(false);

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route
                path="/protected"
                element={<div data-testid="default-content">Default Content</div>}
              />
            </Route>
            <Route
              path="/login"
              element={<div data-testid="login-page">Login Page</div>}
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('default-content')).toBeInTheDocument();
    });
  });
});