import { describe, it, expect, beforeEach, vi } from 'vitest';
import { login, register, logout, isAdmin, isAuthenticated, getCurrentUser } from './auth.js';
import * as storage from './storage.js';

vi.mock('./storage.js', () => ({
  findUserByUsername: vi.fn(),
  addUser: vi.fn(),
  getSession: vi.fn(),
  saveSession: vi.fn(),
  clearSession: vi.fn(),
}));

vi.mock('uuid', () => ({
  v4: vi.fn(() => 'test-uuid-1234'),
}));

describe('auth utility', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
    storage.getSession.mockReturnValue(null);
  });

  // ─── login ──────────────────────────────────────────────────────────────

  describe('login', () => {
    it('returns success and admin session when using hard-coded admin credentials', () => {
      const result = login('admin', 'admin123');

      expect(result.success).toBe(true);
      expect(result.session).toEqual({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
      expect(storage.saveSession).toHaveBeenCalledWith({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });
    });

    it('returns success and user session when using valid localStorage user credentials', () => {
      const mockUser = {
        id: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        password: 'password123',
        role: 'user',
      };
      storage.findUserByUsername.mockReturnValue(mockUser);

      const result = login('alice', 'password123');

      expect(result.success).toBe(true);
      expect(result.session).toEqual({
        userId: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
      expect(storage.saveSession).toHaveBeenCalledWith({
        userId: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });
    });

    it('returns error when credentials are invalid', () => {
      storage.findUserByUsername.mockReturnValue(undefined);

      const result = login('nonexistent', 'wrongpass');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
      expect(storage.saveSession).not.toHaveBeenCalled();
    });

    it('returns error when password does not match for existing user', () => {
      const mockUser = {
        id: 'user-1',
        username: 'alice',
        displayName: 'Alice',
        password: 'correctpassword',
        role: 'user',
      };
      storage.findUserByUsername.mockReturnValue(mockUser);

      const result = login('alice', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
      expect(storage.saveSession).not.toHaveBeenCalled();
    });

    it('returns error when username is empty', () => {
      const result = login('', 'password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required');
      expect(storage.saveSession).not.toHaveBeenCalled();
    });

    it('returns error when password is empty', () => {
      const result = login('admin', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required');
      expect(storage.saveSession).not.toHaveBeenCalled();
    });

    it('returns error when both fields are empty', () => {
      const result = login('', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required');
    });

    it('returns error when username is null', () => {
      const result = login(null, 'password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required');
    });

    it('does not match hard-coded admin with wrong password', () => {
      storage.findUserByUsername.mockReturnValue(undefined);

      const result = login('admin', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });
  });

  // ─── register ───────────────────────────────────────────────────────────

  describe('register', () => {
    it('registers a new user with unique username and auto-logs in', () => {
      storage.findUserByUsername.mockReturnValue(undefined);

      const result = register('Bob', 'bob', 'securepass');

      expect(result.success).toBe(true);
      expect(result.session).toEqual({
        userId: 'test-uuid-1234',
        username: 'bob',
        displayName: 'Bob',
        role: 'user',
      });
      expect(storage.addUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'test-uuid-1234',
          displayName: 'Bob',
          username: 'bob',
          password: 'securepass',
          role: 'user',
        })
      );
      expect(storage.saveSession).toHaveBeenCalledWith({
        userId: 'test-uuid-1234',
        username: 'bob',
        displayName: 'Bob',
        role: 'user',
      });
    });

    it('returns error when username already exists in localStorage', () => {
      storage.findUserByUsername.mockReturnValue({
        id: 'existing-user',
        username: 'alice',
        displayName: 'Alice',
        password: 'pass',
        role: 'user',
      });

      const result = register('Alice New', 'alice', 'newpass');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists');
      expect(storage.addUser).not.toHaveBeenCalled();
      expect(storage.saveSession).not.toHaveBeenCalled();
    });

    it('returns error when trying to register with admin username', () => {
      const result = register('Fake Admin', 'admin', 'password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Username already exists');
      expect(storage.addUser).not.toHaveBeenCalled();
      expect(storage.saveSession).not.toHaveBeenCalled();
    });

    it('returns error when displayName is empty', () => {
      const result = register('', 'bob', 'password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required');
    });

    it('returns error when username is empty', () => {
      const result = register('Bob', '', 'password');

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required');
    });

    it('returns error when password is empty', () => {
      const result = register('Bob', 'bob', '');

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required');
    });

    it('returns error when all fields are null', () => {
      const result = register(null, null, null);

      expect(result.success).toBe(false);
      expect(result.error).toBe('All fields are required');
    });

    it('creates user with createdAt timestamp', () => {
      storage.findUserByUsername.mockReturnValue(undefined);

      register('Charlie', 'charlie', 'pass123');

      expect(storage.addUser).toHaveBeenCalledWith(
        expect.objectContaining({
          createdAt: expect.any(String),
        })
      );
    });
  });

  // ─── logout ─────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('clears the session from localStorage', () => {
      logout();

      expect(storage.clearSession).toHaveBeenCalledTimes(1);
    });
  });

  // ─── isAdmin ────────────────────────────────────────────────────────────

  describe('isAdmin', () => {
    it('returns true when session role is admin', () => {
      const session = { userId: 'admin', username: 'admin', displayName: 'Admin', role: 'admin' };

      expect(isAdmin(session)).toBe(true);
    });

    it('returns false when session role is user', () => {
      const session = { userId: '1', username: 'alice', displayName: 'Alice', role: 'user' };

      expect(isAdmin(session)).toBe(false);
    });

    it('reads from localStorage when no session argument is provided', () => {
      storage.getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      expect(isAdmin()).toBe(true);
      expect(storage.getSession).toHaveBeenCalled();
    });

    it('returns false when no session exists and no argument is provided', () => {
      storage.getSession.mockReturnValue(null);

      expect(isAdmin()).toBe(false);
    });

    it('returns false when session is null', () => {
      expect(isAdmin(null)).toBe(false);
    });
  });

  // ─── isAuthenticated ───────────────────────────────────────────────────

  describe('isAuthenticated', () => {
    it('returns true when a session exists in localStorage', () => {
      storage.getSession.mockReturnValue({
        userId: '1',
        username: 'alice',
        displayName: 'Alice',
        role: 'user',
      });

      expect(isAuthenticated()).toBe(true);
    });

    it('returns false when no session exists in localStorage', () => {
      storage.getSession.mockReturnValue(null);

      expect(isAuthenticated()).toBe(false);
    });
  });

  // ─── getCurrentUser ────────────────────────────────────────────────────

  describe('getCurrentUser', () => {
    it('returns the session object when a session exists', () => {
      const session = { userId: '1', username: 'alice', displayName: 'Alice', role: 'user' };
      storage.getSession.mockReturnValue(session);

      expect(getCurrentUser()).toEqual(session);
    });

    it('returns null when no session exists', () => {
      storage.getSession.mockReturnValue(null);

      expect(getCurrentUser()).toBeNull();
    });
  });
});