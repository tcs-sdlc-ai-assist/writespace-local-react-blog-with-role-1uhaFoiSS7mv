import { Link } from 'react-router-dom';
import { PublicNavbar } from '../components/PublicNavbar.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getPosts } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';

/**
 * Shield/lock SVG icon for Role-Based Access feature
 * @returns {JSX.Element}
 */
function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  );
}

/**
 * Database/storage SVG icon for Local Storage feature
 * @returns {JSX.Element}
 */
function StorageIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z" />
    </svg>
  );
}

/**
 * Palette/design SVG icon for Modern UI feature
 * @returns {JSX.Element}
 */
function PaletteIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-8 h-8"
      aria-hidden="true"
    >
      <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10a2.5 2.5 0 0 0 2.5-2.5c0-.61-.23-1.21-.64-1.67a.528.528 0 0 1-.13-.33c0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
    </svg>
  );
}

/**
 * Feature card component for the features section.
 * @param {Object} props
 * @param {JSX.Element} props.icon - The icon element
 * @param {string} props.title - Feature title
 * @param {string} props.description - Feature description
 * @returns {JSX.Element}
 */
function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-200 p-6 flex flex-col items-center text-center animate-fade-in">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-primary text-white mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  );
}

/**
 * Public landing page at '/'.
 * Features hero section with app name, tagline, and CTA buttons.
 * Features section with three cards (Role-Based Access, Local Storage, Modern UI).
 * Latest posts preview showing up to 3 most recent posts or empty state.
 * Footer with links and copyright.
 * Uses PublicNavbar.
 * @returns {JSX.Element}
 */
export default function LandingPage() {
  const currentUser = getCurrentUser();
  const allPosts = getPosts();

  const latestPosts = [...allPosts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-hero text-white py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-slide-down">
            WriteSpace
          </h1>
          <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto animate-fade-in">
            A distraction-free writing platform. Create, share, and manage your
            blog posts with ease.
          </p>
          <div className="flex items-center justify-center gap-4 animate-slide-up">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-primary-700 bg-white rounded-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white border border-white rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
              Why WriteSpace?
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Everything you need for a seamless writing experience, right in
              your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<ShieldIcon />}
              title="Role-Based Access"
              description="Admin and user roles with fine-grained permissions. Admins manage all content and users, while writers focus on their own posts."
            />
            <FeatureCard
              icon={<StorageIcon />}
              title="Local Storage"
              description="No server required. All your data is stored securely in your browser's localStorage, so you can write offline anytime."
            />
            <FeatureCard
              icon={<PaletteIcon />}
              title="Modern UI"
              description="A clean, responsive design built with Tailwind CSS. Enjoy a beautiful writing experience on any device."
            />
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
              Latest Posts
            </h2>
            <p className="text-neutral-600 max-w-xl mx-auto">
              Check out what the community has been writing about.
            </p>
          </div>

          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <p className="text-neutral-500 text-lg mb-4">
                No posts yet. Be the first to write something!
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Start Writing
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
                aria-hidden="true"
              >
                <path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 4h10v16H7V4zm2 2v2h6V6H9zm0 4v2h6v-2H9zm0 4v2h4v-2H9z" />
              </svg>
              <span>WriteSpace</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/login"
                className="hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-white transition-colors"
              >
                Register
              </Link>
              <Link
                to="/blogs"
                className="hover:text-white transition-colors"
              >
                Blogs
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-neutral-800 text-center text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} WriteSpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}