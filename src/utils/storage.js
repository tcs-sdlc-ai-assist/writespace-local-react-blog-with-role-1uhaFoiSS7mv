const USERS_KEY = 'writespace_users';
const POSTS_KEY = 'writespace_posts';
const SESSION_KEY = 'writespace_session';

/**
 * Safely parse JSON from localStorage
 * @param {string} key - localStorage key
 * @returns {any|null} Parsed value or null on failure
 */
function safeGetItem(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      return null;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error(`Failed to read "${key}" from localStorage:`, error);
    return null;
  }
}

/**
 * Safely write JSON to localStorage
 * @param {string} key - localStorage key
 * @param {any} value - Value to serialize and store
 * @returns {boolean} Whether the write succeeded
 */
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to write "${key}" to localStorage:`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * @param {string} key - localStorage key
 * @returns {boolean} Whether the removal succeeded
 */
function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove "${key}" from localStorage:`, error);
    return false;
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

/**
 * Get all users from localStorage
 * @returns {Array<Object>} Array of user objects
 */
export function getUsers() {
  const users = safeGetItem(USERS_KEY);
  return Array.isArray(users) ? users : [];
}

/**
 * Save the full users array to localStorage
 * @param {Array<Object>} users - Array of user objects
 * @returns {void}
 */
export function saveUsers(users) {
  safeSetItem(USERS_KEY, users);
}

/**
 * Add a single user to the users array in localStorage
 * @param {Object} user - User object to add
 * @returns {void}
 */
export function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

/**
 * Find a user by their username
 * @param {string} username - Username to search for
 * @returns {Object|undefined} The matching user or undefined
 */
export function findUserByUsername(username) {
  const users = getUsers();
  return users.find((u) => u.username === username);
}

// ─── Posts ────────────────────────────────────────────────────────────────────

/**
 * Get all posts from localStorage
 * @returns {Array<Object>} Array of post objects
 */
export function getPosts() {
  const posts = safeGetItem(POSTS_KEY);
  return Array.isArray(posts) ? posts : [];
}

/**
 * Save the full posts array to localStorage
 * @param {Array<Object>} posts - Array of post objects
 * @returns {void}
 */
export function savePosts(posts) {
  safeSetItem(POSTS_KEY, posts);
}

/**
 * Add a single post to the posts array in localStorage
 * @param {Object} post - Post object to add
 * @returns {void}
 */
export function addPost(post) {
  const posts = getPosts();
  posts.push(post);
  savePosts(posts);
}

/**
 * Find a post by its id
 * @param {string} id - Post id to search for
 * @returns {Object|undefined} The matching post or undefined
 */
export function findPostById(id) {
  const posts = getPosts();
  return posts.find((p) => p.id === id);
}

/**
 * Update an existing post in localStorage (matched by id)
 * @param {Object} updatedPost - Post object with updated fields
 * @returns {void}
 */
export function updatePost(updatedPost) {
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === updatedPost.id);
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updatedPost };
    savePosts(posts);
  }
}

/**
 * Delete a post by its id from localStorage
 * @param {string} id - Post id to delete
 * @returns {void}
 */
export function deletePost(id) {
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  savePosts(filtered);
}

// ─── Session ─────────────────────────────────────────────────────────────────

/**
 * Get the current session from localStorage
 * @returns {Object|null} Session object or null if not logged in
 */
export function getSession() {
  return safeGetItem(SESSION_KEY);
}

/**
 * Save a session object to localStorage
 * @param {Object} session - Session object to persist
 * @returns {void}
 */
export function saveSession(session) {
  safeSetItem(SESSION_KEY, session);
}

/**
 * Clear the current session from localStorage
 * @returns {void}
 */
export function clearSession() {
  safeRemoveItem(SESSION_KEY);
}