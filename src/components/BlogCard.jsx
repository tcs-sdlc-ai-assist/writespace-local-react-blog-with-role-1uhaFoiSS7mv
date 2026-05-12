import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar } from './Avatar.jsx';

/**
 * Truncate text to a maximum length, appending ellipsis if needed.
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum character length
 * @returns {string} Truncated text
 */
function truncate(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

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
 * Pencil/edit SVG icon
 * @returns {JSX.Element}
 */
function EditIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
    </svg>
  );
}

/**
 * Determines whether the current user can edit the given post.
 * Admins can edit all posts; regular users can edit only their own.
 * @param {Object|null} currentUser - The current user session
 * @param {Object} post - The blog post object
 * @returns {boolean}
 */
function canEdit(currentUser, post) {
  if (!currentUser) return false;
  if (currentUser.role === 'admin') return true;
  return currentUser.userId === post.authorId;
}

/**
 * Reusable blog post card component for list views.
 * Displays title, excerpt (truncated content), date, author avatar, and author name.
 * Shows an edit icon for admins on all posts and for users on their own posts.
 * Links to '/blog/:id' for reading.
 * @param {Object} props
 * @param {Object} props.post - The blog post object
 * @param {string} props.post.id - Post id
 * @param {string} props.post.title - Post title
 * @param {string} props.post.content - Post content
 * @param {string} props.post.authorId - Author user id
 * @param {string} props.post.authorName - Author display name
 * @param {string} [props.post.authorRole] - Author role ('admin' or 'user')
 * @param {string} props.post.createdAt - ISO date string
 * @param {Object|null} props.currentUser - The current user session object
 * @returns {JSX.Element}
 */
export function BlogCard({ post, currentUser }) {
  const showEdit = canEdit(currentUser, post);
  const authorRole = post.authorRole || 'user';

  return (
    <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-200 flex flex-col overflow-hidden animate-fade-in">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link
            to={`/blog/${post.id}`}
            className="text-lg font-bold text-neutral-900 hover:text-primary-700 transition-colors line-clamp-2 flex-1"
          >
            {post.title}
          </Link>
          {showEdit && (
            <Link
              to={`/edit/${post.id}`}
              className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-lg text-neutral-500 hover:text-primary-700 hover:bg-primary-50 transition-colors"
              aria-label={`Edit post: ${post.title}`}
            >
              <EditIcon />
            </Link>
          )}
        </div>

        <p className="text-sm text-neutral-600 mb-4 flex-1">
          {truncate(post.content, 150)}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2">
            <Avatar role={authorRole} className="w-7 h-7" />
            <span className="text-sm font-medium text-neutral-700">
              {post.authorName || 'Unknown'}
            </span>
          </div>
          <time
            dateTime={post.createdAt}
            className="text-xs text-neutral-500"
          >
            {formatDate(post.createdAt)}
          </time>
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    authorId: PropTypes.string.isRequired,
    authorName: PropTypes.string,
    authorRole: PropTypes.oneOf(['admin', 'user']),
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    role: PropTypes.oneOf(['admin', 'user']).isRequired,
  }),
};

export default BlogCard;