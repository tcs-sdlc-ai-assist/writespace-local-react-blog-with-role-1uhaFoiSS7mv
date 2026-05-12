import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { StatCard } from '../components/StatCard.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { getPosts, getUsers, deletePost } from '../utils/storage.js';

/**
 * Posts SVG icon for total posts stat
 * @returns {JSX.Element}
 */
function PostsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 4h10v16H7V4zm2 2v2h6V6H9zm0 4v2h6v-2H9zm0 4v2h4v-2H9z" />
    </svg>
  );
}

/**
 * Users SVG icon for total users stat
 * @returns {JSX.Element}
 */
function UsersIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

/**
 * Crown SVG icon for admin count stat
 * @returns {JSX.Element}
 */
function CrownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path d="M2 19h20v2H2v-2zm1.5-7.5L6 14l4.5-6L12 11l1.5-3L18 14l2.5-2.5L19 18H5L3.5 11.5z" />
    </svg>
  );
}

/**
 * Person SVG icon for user count stat
 * @returns {JSX.Element}
 */
function PersonIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6"
      aria-hidden="true"
    >
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

/**
 * Admin dashboard page at '/dashboard'.
 * Displays gradient banner header, four StatCards (total posts, total users,
 * admin count, user count), quick-action buttons, and recent posts section.
 * Admin-only access enforced by ProtectedRoute.
 * Uses Navbar.
 * @returns {JSX.Element}
 */
export default function AdminDashboard() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);

    const allUsers = getUsers();
    setUsers(allUsers);
  }

  // Include the hard-coded admin in the total user count
  const totalUsers = users.length + 1;
  const totalPosts = posts.length;
  const adminCount = users.filter((u) => u.role === 'admin').length + 1;
  const userCount = users.filter((u) => u.role === 'user').length;

  const recentPosts = posts.slice(0, 6);

  function handleDeletePost(postId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (confirmed) {
      deletePost(postId);
      loadData();
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      {/* Gradient Banner */}
      <section className="bg-gradient-hero text-white py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 animate-slide-down">
            Admin Dashboard
          </h1>
          <p className="text-primary-100 text-sm sm:text-base animate-fade-in">
            Welcome back, {currentUser ? currentUser.displayName : 'Admin'}. Here&apos;s an overview of your platform.
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            label="Total Posts"
            value={totalPosts}
            icon={<PostsIcon />}
            gradient="bg-gradient-primary"
          />
          <StatCard
            label="Total Users"
            value={totalUsers}
            icon={<UsersIcon />}
            gradient="bg-gradient-warm"
          />
          <StatCard
            label="Admins"
            value={adminCount}
            icon={<CrownIcon />}
            gradient="bg-gradient-primary"
          />
          <StatCard
            label="Writers"
            value={userCount}
            icon={<PersonIcon />}
            gradient="bg-gradient-warm"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          <Link
            to="/write"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mr-2"
              aria-hidden="true"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
            </svg>
            Write New Post
          </Link>
          <Link
            to="/users"
            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 mr-2"
              aria-hidden="true"
            >
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            Manage Users
          </Link>
        </div>

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Recent Posts
            </h2>
            <Link
              to="/blogs"
              className="text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
            >
              View All →
            </Link>
          </div>

          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
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
                <path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 4h10v16H7V4zm2 2v2h6V6H9zm0 4v2h6v-2H9zm0 4v2h4v-2H9z" />
              </svg>
              <h3 className="text-xl font-bold text-neutral-700 mb-2">
                No posts yet
              </h3>
              <p className="text-neutral-500 mb-6">
                Get started by creating the first post on the platform.
              </p>
              <Link
                to="/write"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}