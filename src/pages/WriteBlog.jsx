import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Navbar } from '../components/Navbar.jsx';
import { getCurrentUser } from '../utils/auth.js';
import { findPostById, addPost, updatePost } from '../utils/storage.js';

/**
 * Blog post creation and editing page.
 * Create mode at '/write' — generates UUID, sets author info from session, saves to localStorage.
 * Edit mode at '/write/:id' — pre-fills form, validates ownership (user: own posts only, Admin: any), updates post.
 * Unauthorized edit redirects to '/blogs'. Cancel button navigates back. Uses Navbar.
 * @returns {JSX.Element}
 */
export default function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const TITLE_MAX = 150;
  const CONTENT_MAX = 5000;

  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { replace: true });
      return;
    }

    if (isEditMode) {
      const post = findPostById(id);

      if (!post) {
        navigate('/blogs', { replace: true });
        return;
      }

      // Validate ownership: admins can edit any, users can edit only their own
      if (currentUser.role !== 'admin' && currentUser.userId !== post.authorId) {
        navigate('/blogs', { replace: true });
        return;
      }

      setTitle(post.title);
      setContent(post.content);
    }
  }, [id, isEditMode, navigate, currentUser]);

  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError('Title and content are required');
      return;
    }

    if (trimmedTitle.length > TITLE_MAX) {
      setError(`Title must be ${TITLE_MAX} characters or less`);
      return;
    }

    if (trimmedContent.length > CONTENT_MAX) {
      setError(`Content must be ${CONTENT_MAX} characters or less`);
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        const existingPost = findPostById(id);

        if (!existingPost) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        updatePost({
          ...existingPost,
          title: trimmedTitle,
          content: trimmedContent,
          updatedAt: new Date().toISOString(),
        });

        navigate(`/blog/${id}`, { replace: true });
      } else {
        const newPost = {
          id: uuidv4(),
          title: trimmedTitle,
          content: trimmedContent,
          authorId: currentUser.userId,
          authorName: currentUser.displayName,
          authorRole: currentUser.role,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        addPost(newPost);

        navigate(`/blog/${newPost.id}`, { replace: true });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleCancel() {
    navigate(-1);
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            {isEditMode ? 'Edit Post' : 'Write a New Post'}
          </h1>
          <p className="mt-1 text-sm text-neutral-600">
            {isEditMode
              ? 'Update your post below'
              : 'Share your thoughts with the community'}
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-3 rounded-lg bg-danger-50 border border-danger-200 text-danger-700 text-sm animate-fade-in"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-neutral-700"
              >
                Title
              </label>
              <span
                className={`text-xs ${
                  title.length > TITLE_MAX
                    ? 'text-danger-600 font-medium'
                    : 'text-neutral-500'
                }`}
              >
                {title.length}/{TITLE_MAX}
              </span>
            </div>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              placeholder="Enter your post title"
              disabled={loading}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-neutral-700"
              >
                Content
              </label>
              <span
                className={`text-xs ${
                  content.length > CONTENT_MAX
                    ? 'text-danger-600 font-medium'
                    : 'text-neutral-500'
                }`}
              >
                {content.length}/{CONTENT_MAX}
              </span>
            </div>
            <textarea
              id="content"
              name="content"
              required
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-y"
              placeholder="Write your post content here..."
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="inline-flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2.5 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEditMode
                  ? 'Updating…'
                  : 'Publishing…'
                : isEditMode
                  ? 'Update Post'
                  : 'Publish Post'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}