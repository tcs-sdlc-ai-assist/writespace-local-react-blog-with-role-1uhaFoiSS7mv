import { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar.jsx';
import { UserRow } from '../components/UserRow.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { getUsers, addUser, saveUsers, getPosts, savePosts } from '../utils/storage.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * Admin user management page at '/users'.
 * Displays all users (including hard-coded admin) in a responsive list.
 * Provides a form to create new users with display name, username, password, and role.
 * Delete confirms before removal; hard-coded admin and self cannot be deleted.
 * Admin-only access enforced by ProtectedRoute. Uses Navbar.
 * @returns {JSX.Element}
 */
export default function UserManagement() {
  const currentUser = getCurrentUser();

  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  function loadUsers() {
    const storedUsers = getUsers();
    setUsers(storedUsers);
  }

  /**
   * Build the full user list including the hard-coded admin account.
   * @returns {Array<Object>}
   */
  function getAllUsersWithAdmin() {
    const hardCodedAdmin = {
      id: 'admin',
      displayName: 'Admin',
      username: 'admin',
      role: 'admin',
      createdAt: null,
    };
    return [hardCodedAdmin, ...users];
  }

  function handleCreateUser(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedDisplayName || !trimmedUsername || !trimmedPassword) {
      setError('All fields are required');
      return;
    }

    // Check against hard-coded admin username
    if (trimmedUsername === 'admin') {
      setError('Username already exists');
      return;
    }

    // Check against existing users
    const existingUser = users.find((u) => u.username === trimmedUsername);
    if (existingUser) {
      setError('Username already exists');
      return;
    }

    setLoading(true);

    try {
      const newUser = {
        id: uuidv4(),
        displayName: trimmedDisplayName,
        username: trimmedUsername,
        password: trimmedPassword,
        role,
        createdAt: new Date().toISOString(),
      };

      addUser(newUser);
      loadUsers();

      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('user');
      setSuccess(`User "${trimmedDisplayName}" created successfully`);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleDeleteUser(userId) {
    const userToDelete = users.find((u) => u.id === userId);
    if (!userToDelete) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${userToDelete.displayName}"? This action cannot be undone.`
    );

    if (confirmed) {
      // Remove user from users list
      const updatedUsers = users.filter((u) => u.id !== userId);
      saveUsers(updatedUsers);

      // Remove all posts by this user
      const allPosts = getPosts();
      const filteredPosts = allPosts.filter((p) => p.authorId !== userId);
      savePosts(filteredPosts);

      loadUsers();
      setSuccess(`User "${userToDelete.displayName}" has been deleted`);
      setError('');
    }
  }

  const allUsers = getAllUsersWithAdmin();

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      {/* Gradient Banner */}
      <section className="bg-gradient-hero text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 animate-slide-down">
            User Management
          </h1>
          <p className="text-primary-100 text-sm sm:text-base animate-fade-in">
            Manage platform users, create new accounts, and control access.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create User Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-card p-6 animate-fade-in">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">
                Create New User
              </h2>

              {error && (
                <div
                  className="mb-4 p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm animate-fade-in"
                  role="alert"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  className="mb-4 p-3 rounded-lg bg-success-50 border border-success-200 text-success-700 text-sm animate-fade-in"
                  role="status"
                >
                  {success}
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Enter display name"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Choose a username"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Create a password"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-neutral-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    disabled={loading}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creating…' : 'Create User'}
                </button>
              </form>
            </div>
          </div>

          {/* Users List */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                All Users
              </h2>
              <span className="text-sm text-neutral-500">
                {allUsers.length} {allUsers.length === 1 ? 'user' : 'users'}
              </span>
            </div>

            {allUsers.length > 0 ? (
              <div className="space-y-3">
                {allUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    currentUser={currentUser}
                    onDelete={handleDeleteUser}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 animate-fade-in">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-16 h-16 mx-auto text-neutral-300 mb-4"
                  aria-hidden="true"
                >
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                <h3 className="text-xl font-bold text-neutral-700 mb-2">
                  No users yet
                </h3>
                <p className="text-neutral-500">
                  Create the first user using the form.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}