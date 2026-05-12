import { Navigate, Outlet } from 'react-router-dom';
import PropTypes from 'prop-types';
import { isAuthenticated, isAdmin, getCurrentUser } from '../utils/auth.js';

/**
 * Route guard component for protected routes.
 * Checks authentication and optionally restricts to admin-only access.
 * @param {Object} props
 * @param {boolean} [props.adminOnly=false] - Whether the route requires admin role
 * @returns {JSX.Element}
 */
export function ProtectedRoute({ adminOnly = false }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly) {
    const session = getCurrentUser();
    if (!isAdmin(session)) {
      return <Navigate to="/blogs" replace />;
    }
  }

  return <Outlet />;
}

ProtectedRoute.propTypes = {
  adminOnly: PropTypes.bool,
};

export default ProtectedRoute;