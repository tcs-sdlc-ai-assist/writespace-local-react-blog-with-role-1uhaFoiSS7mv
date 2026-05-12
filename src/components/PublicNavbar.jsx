import { Link } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/auth.js';
import { Avatar } from './Avatar.jsx';

/**
 * Public navigation bar component.
 * Shows WriteSpace logo/brand with login/register buttons for guests,
 * or avatar and dashboard link for authenticated users.
 * @returns {JSX.Element}
 */
export function PublicNavbar() {
  const authenticated = isAuthenticated();
  const session = authenticated ? getCurrentUser() : null;

  return (
    <nav className="w-full bg-white shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-xl font-bold text-primary-700 hover:text-primary-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7"
              aria-hidden="true"
            >
              <path d="M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM7 4h10v16H7V4zm2 2v2h6V6H9zm0 4v2h6v-2H9zm0 4v2h4v-2H9z" />
            </svg>
            <span>WriteSpace</span>
          </Link>

          <div className="flex items-center gap-3">
            {authenticated && session ? (
              <>
                <Link
                  to="/blogs"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Dashboard
                </Link>
                <Link to="/blogs" className="flex items-center gap-2">
                  <Avatar role={session.role} />
                  <span className="hidden sm:inline text-sm font-medium text-neutral-700">
                    {session.displayName}
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default PublicNavbar;