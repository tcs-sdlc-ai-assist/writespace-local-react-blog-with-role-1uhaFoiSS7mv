import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar.jsx';
import { BlogCard } from '../components/BlogCard.jsx';
import { getPosts } from '../utils/storage.js';
import { getCurrentUser } from '../utils/auth.js';

/**
 * Authenticated blog list page at '/blogs'.
 * Shows all posts in a responsive grid sorted newest first.
 * Each post rendered as BlogCard with edit controls based on role/ownership.
 * Empty state with CTA to write first post if no posts exist.
 * Uses Navbar.
 * @returns {JSX.Element}
 */
export default function Home() {
  const currentUser = getCurrentUser();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const allPosts = getPosts();
    const sorted = [...allPosts].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    setPosts(sorted);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
            All Posts
          </h1>
          <Link
            to="/write"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Write Post
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
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
            <h2 className="text-xl font-bold text-neutral-700 mb-2">
              No posts yet
            </h2>
            <p className="text-neutral-500 mb-6">
              Be the first to share something with the community!
            </p>
            <Link
              to="/write"
              className="inline-flex items-center px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Write Your First Post
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}