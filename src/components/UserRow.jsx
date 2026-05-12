import PropTypes from 'prop-types';
import { Avatar } from './Avatar.jsx';

/**
 * Format an ISO date string to a human-readable format.
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
function formatDate(dateString) {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Trash/delete SVG icon
 * @returns {JSX.Element}
 */
function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
    </svg>
  );
}

/**
 * Determines whether the delete action should be disabled for a given user.
 * Delete is disabled for the hard-coded admin account and for the currently logged-in user.
 * @param {Object} user - The user object
 * @param {Object|null} currentUser - The current user session
 * @returns {boolean}
 */
function isDeleteDisabled(user, currentUser) {
  // Hard-coded admin account cannot be deleted
  if (user.username === 'admin' || user.id === 'admin') {
    return true;
  }
  // Currently logged-in user cannot delete themselves
  if (currentUser && currentUser.userId === user.id) {
    return true;
  }
  return false;
}

/**
 * Reusable user display row for admin user management.
 * Displays avatar, display name, username, role badge, created date, and delete button.
 * Delete button is disabled/hidden for the hard-coded admin and for the currently logged-in admin.
 * @param {Object} props
 * @param {Object} props.user - The user object
 * @param {string} props.user.id - User id
 * @param {string} props.user.displayName - User display name
 * @param {string} props.user.username - Username
 * @param {'admin'|'user'} props.user.role - User role
 * @param {string} [props.user.createdAt] - ISO date string
 * @param {Object|null} props.currentUser - The current user session object
 * @param {Function} props.onDelete - Callback invoked with user id when delete is clicked
 * @returns {JSX.Element}
 */
export function UserRow({ user, currentUser, onDelete }) {
  const deleteDisabled = isDeleteDisabled(user, currentUser);
  const isAdmin = user.role === 'admin';

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-200 flex items-center gap-4 p-4 animate-fade-in">
      <Avatar role={user.role} />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-neutral-900 truncate">
            {user.displayName}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full ${
              isAdmin
                ? 'bg-secondary-100 text-secondary-700'
                : 'bg-primary-100 text-primary-700'
            }`}
          >
            {isAdmin ? 'Admin' : 'User'}
          </span>
        </div>
        <span className="text-xs text-neutral-500 truncate">
          @{user.username}
        </span>
      </div>

      <div className="hidden sm:flex flex-col items-end flex-shrink-0">
        {user.createdAt && (
          <time
            dateTime={user.createdAt}
            className="text-xs text-neutral-500"
          >
            {formatDate(user.createdAt)}
          </time>
        )}
      </div>

      <div className="flex-shrink-0">
        {!deleteDisabled && (
          <button
            type="button"
            onClick={() => onDelete(user.id)}
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-danger-500 hover:text-danger-700 hover:bg-danger-50 transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
            aria-label={`Delete user: ${user.displayName}`}
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
  }),
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;