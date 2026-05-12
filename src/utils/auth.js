import { v4 as uuidv4 } from 'uuid';
import {
  findUserByUsername,
  addUser,
  getSession,
  saveSession,
  clearSession,
} from './storage.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

/**
 * Attempt to log in with the given credentials.
 * Checks hard-coded admin account first, then localStorage users.
 * @param {string} username - The username to authenticate
 * @param {string} password - The password to verify
 * @returns {{ success: boolean, session?: Object, error?: string }}
 */
export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'All fields are required' };
  }

  // Check hard-coded admin credentials first
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const session = {
      userId: 'admin',
      username: 'admin',
      displayName: 'Admin',
      role: 'admin',
    };
    saveSession(session);
    return { success: true, session };
  }

  // Check localStorage users
  const user = findUserByUsername(username);
  if (user && user.password === password) {
    const session = {
      userId: user.id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    };
    saveSession(session);
    return { success: true, session };
  }

  return { success: false, error: 'Invalid credentials' };
}

/**
 * Register a new user, save to localStorage, and auto-login.
 * @param {string} displayName - The user's display name
 * @param {string} username - The desired username (must be unique)
 * @param {string} password - The user's password
 * @returns {{ success: boolean, session?: Object, error?: string }}
 */
export function register(displayName, username, password) {
  if (!displayName || !username || !password) {
    return { success: false, error: 'All fields are required' };
  }

  if (username === ADMIN_USERNAME) {
    return { success: false, error: 'Username already exists' };
  }

  if (findUserByUsername(username)) {
    return { success: false, error: 'Username already exists' };
  }

  const user = {
    id: uuidv4(),
    displayName,
    username,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  addUser(user);

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };
  saveSession(session);

  return { success: true, session };
}

/**
 * Log out the current user by clearing the session from localStorage.
 * @returns {void}
 */
export function logout() {
  clearSession();
}

/**
 * Check whether the current session belongs to an admin user.
 * @param {Object} [session] - Optional session object; if omitted, reads from localStorage
 * @returns {boolean} True if the session role is 'admin'
 */
export function isAdmin(session) {
  const s = session || getSession();
  return s !== null && s.role === 'admin';
}

/**
 * Check whether there is an active session in localStorage.
 * @returns {boolean} True if a session exists
 */
export function isAuthenticated() {
  const session = getSession();
  return session !== null;
}

/**
 * Get the current logged-in user's session data.
 * @returns {Object|null} The session object or null if not logged in
 */
export function getCurrentUser() {
  return getSession();
}