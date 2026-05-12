import PropTypes from 'prop-types';

/**
 * Crown SVG icon for admin users
 * @returns {JSX.Element}
 */
function CrownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M2 19h20v2H2v-2zm1.5-7.5L6 14l4.5-6L12 11l1.5-3L18 14l2.5-2.5L19 18H5L3.5 11.5z" />
    </svg>
  );
}

/**
 * Book SVG icon for regular users
 * @returns {JSX.Element}
 */
function BookIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M21 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14V4zM5 18V6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14v-2H5z" />
    </svg>
  );
}

/**
 * Reusable avatar component with role-based visuals.
 * Renders a crown icon for admin role and a book icon for user role.
 * @param {Object} props
 * @param {'admin'|'user'} props.role - The role of the user
 * @param {string} [props.className] - Additional CSS classes
 * @returns {JSX.Element}
 */
export function Avatar({ role, className = '' }) {
  const isAdmin = role === 'admin';

  const baseClasses =
    'inline-flex items-center justify-center rounded-full w-9 h-9 flex-shrink-0';

  const roleClasses = isAdmin
    ? 'bg-secondary-100 text-secondary-700'
    : 'bg-primary-100 text-primary-700';

  return (
    <span
      className={`${baseClasses} ${roleClasses} ${className}`.trim()}
      role="img"
      aria-label={isAdmin ? 'Admin avatar' : 'User avatar'}
    >
      {isAdmin ? <CrownIcon /> : <BookIcon />}
    </span>
  );
}

Avatar.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
  className: PropTypes.string,
};

export default Avatar;