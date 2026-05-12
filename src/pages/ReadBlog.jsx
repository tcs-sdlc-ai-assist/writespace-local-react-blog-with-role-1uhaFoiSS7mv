import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { Avatar } from '../components/Avatar.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { findPostById, deletePost } from '../utils/storage.js';

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
      month: 'long',
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
 * Determines whether the current user can edit/delete the given post.
 * Admins can edit/delete all posts; regular users can only edit/delete their own.
 * @param {Object|null} currentUser - The current user session
 * @param {Object} post - The blog post object
 * @returns {boolean}
 */
function canModify(currentUser, post) {
  if (!currentUser) return false;
  if (currentUser.role === 'admin') return true;
  return currentUser.userId === post.authorId;
}

/**
 * Blog read page at '/blog/:id'.
 * Displays full post with title, author avatar, display name, date, and content.
 * Admin sees edit/delete on all posts; users see edit/delete only on own posts.
 * Delete confirms via window.confirm before removal and redirects to '/blogs'.
 * Invalid/missing ID shows 'Post not found' message. Uses Navbar.
 * @returns {JSX.Element}
 */
export default function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setNotFound(true);
      return;
    }

    const found = findPostById(id);
    if (found) {
      setPost(found);
    } else {
      setNotFound(true);
    }
  }, [id]);

  function handleDelete() {
    if (!post) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (confirmed) {
      deletePost(post.id);
      navigate('/blogs', { replace: true });
    }
  }

  const showActions = post && canModify(currentUser, post);
  const authorRole = post ? post.authorRole || 'user' : 'user';

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {notFound ? (
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
            <h2 className="text-xl font-bold text-neutral-700 mb-2">
              Post not found
            </h2>
            <p className="text-neutral-500 mb-6">
              The post you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Back to Blogs
            </Link>
          </div>
        ) : post ? (
          <article className="animate-fade-in">
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 flex-1">
                  {post.title}
                </h1>
                {showActions && (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                      to={`/edit/${post.id}`}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-neutral-500 hover:text-primary-700 hover:bg-primary-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      aria-label={`Edit post: ${post.title}`}
                    >
                      <EditIcon />
                    </Link>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-danger-500 hover:text-danger-700 hover:bg-danger-50 transition-colors focus:outline-none focus:ring-2 focus:ring-danger-500 focus:ring-offset-2"
                      aria-label={`Delete post: ${post.title}`}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
                <Avatar role={authorRole} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-neutral-700">
                    {post.authorName || 'Unknown'}
                  </span>
                  <time
                    dateTime={post.createdAt}
                    className="text-xs text-neutral-500"
                  >
                    {formatDate(post.createdAt)}
                  </time>
                </div>
              </div>
            </div>

            <div className="prose max-w-none text-neutral-800 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-200">
              <Link
                to="/blogs"
                className="inline-flex items-center text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
              >
                ← Back to all posts
              </Link>
            </div>
          </article>
        ) : null}
      </main>
    </div>
  );
}