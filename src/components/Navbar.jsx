import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, isAdmin, logout } from '../utils/auth.js';
import { Avatar } from './Avatar.jsx';

/**
 * Authenticated navigation bar component.
 * Shows WriteSpace brand, navigation links (Blogs, Write), avatar with display name,
 * and logout button. Admin users see additional links (Dashboard, Users).
 * @returns {JSX.Element}
 */
export function Navbar() {
  const navigate = useNavigate();
  const session = getCurrentUser();
  const admin = session ? isAdmin(session) : false;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <nav className="w-full bg-white shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link
              to="/blogs"
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

            <div className="hidden sm:flex items-center gap-4">
              <Link
                to="/blogs"
                className="text-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors"
              >
                Blogs
              </Link>
              <Link
                to="/write"
                className="text-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors"
              >
                Write
              </Link>
              {admin && (
                <>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/users"
                    className="text-sm font-medium text-neutral-700 hover:text-primary-700 transition-colors"
                  >
                    Users
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session && (
              <div className="flex items-center gap-2">
                <Avatar role={session.role} />
                <span className="hidden sm:inline text-sm font-medium text-neutral-700">
                  {session.displayName}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-danger-700 bg-white border border-danger-300 rounded-lg hover:bg-danger-50 transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;