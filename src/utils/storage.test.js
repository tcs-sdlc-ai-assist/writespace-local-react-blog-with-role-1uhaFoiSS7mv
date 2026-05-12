import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getUsers,
  saveUsers,
  addUser,
  findUserByUsername,
  getPosts,
  savePosts,
  addPost,
  findPostById,
  updatePost,
  deletePost,
  getSession,
  saveSession,
  clearSession,
} from './storage.js';

describe('storage utility', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  // ─── Users ───────────────────────────────────────────────────────────────

  describe('getUsers', () => {
    it('returns an empty array when no users are stored', () => {
      expect(getUsers()).toEqual([]);
    });

    it('returns stored users from localStorage', () => {
      const users = [
        { id: '1', username: 'alice', displayName: 'Alice', role: 'user', password: 'pass' },
        { id: '2', username: 'bob', displayName: 'Bob', role: 'admin', password: 'pass' },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));
      expect(getUsers()).toEqual(users);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_users', '{invalid json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(getUsers()).toEqual([]);
      consoleSpy.mockRestore();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_users', JSON.stringify('not-an-array'));
      expect(getUsers()).toEqual([]);
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage under the correct key', () => {
      const users = [{ id: '1', username: 'alice', displayName: 'Alice', role: 'user', password: 'pass' }];
      saveUsers(users);
      expect(JSON.parse(localStorage.getItem('writespace_users'))).toEqual(users);
    });

    it('handles localStorage write errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveUsers([{ id: '1' }])).not.toThrow();
      consoleSpy.mockRestore();
    });
  });

  describe('addUser', () => {
    it('adds a user to the existing users array', () => {
      const existingUser = { id: '1', username: 'alice', displayName: 'Alice', role: 'user', password: 'pass' };
      localStorage.setItem('writespace_users', JSON.stringify([existingUser]));

      const newUser = { id: '2', username: 'bob', displayName: 'Bob', role: 'user', password: 'pass2' };
      addUser(newUser);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toHaveLength(2);
      expect(stored[1]).toEqual(newUser);
    });

    it('creates the users array if none exists', () => {
      const newUser = { id: '1', username: 'alice', displayName: 'Alice', role: 'user', password: 'pass' };
      addUser(newUser);

      const stored = JSON.parse(localStorage.getItem('writespace_users'));
      expect(stored).toHaveLength(1);
      expect(stored[0]).toEqual(newUser);
    });
  });

  describe('findUserByUsername', () => {
    it('returns the user matching the given username', () => {
      const users = [
        { id: '1', username: 'alice', displayName: 'Alice', role: 'user', password: 'pass' },
        { id: '2', username: 'bob', displayName: 'Bob', role: 'user', password: 'pass2' },
      ];
      localStorage.setItem('writespace_users', JSON.stringify(users));
      expect(findUserByUsername('bob')).toEqual(users[1]);
    });

    it('returns undefined when no user matches', () => {
      localStorage.setItem('writespace_users', JSON.stringify([]));
      expect(findUserByUsername('nonexistent')).toBeUndefined();
    });
  });

  // ─── Posts ────────────────────────────────────────────────────────────────

  describe('getPosts', () => {
    it('returns an empty array when no posts are stored', () => {
      expect(getPosts()).toEqual([]);
    });

    it('returns stored posts from localStorage', () => {
      const posts = [
        { id: 'p1', title: 'Post 1', content: 'Content 1', authorId: '1', createdAt: '2024-01-01T00:00:00.000Z' },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));
      expect(getPosts()).toEqual(posts);
    });

    it('returns an empty array when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_posts', 'not-json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(getPosts()).toEqual([]);
      consoleSpy.mockRestore();
    });

    it('returns an empty array when localStorage contains a non-array value', () => {
      localStorage.setItem('writespace_posts', JSON.stringify(42));
      expect(getPosts()).toEqual([]);
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage under the correct key', () => {
      const posts = [{ id: 'p1', title: 'Post 1', content: 'Content', authorId: '1', createdAt: '2024-01-01T00:00:00.000Z' }];
      savePosts(posts);
      expect(JSON.parse(localStorage.getItem('writespace_posts'))).toEqual(posts);
    });

    it('handles localStorage write errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => savePosts([{ id: 'p1' }])).not.toThrow();
      consoleSpy.mockRestore();
    });
  });

  describe('addPost', () => {
    it('adds a post to the existing posts array', () => {
      const existingPost = { id: 'p1', title: 'Post 1', content: 'Content', authorId: '1', createdAt: '2024-01-01T00:00:00.000Z' };
      localStorage.setItem('writespace_posts', JSON.stringify([existingPost]));

      const newPost = { id: 'p2', title: 'Post 2', content: 'Content 2', authorId: '2', createdAt: '2024-01-02T00:00:00.000Z' };
      addPost(newPost);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toHaveLength(2);
      expect(stored[1]).toEqual(newPost);
    });

    it('creates the posts array if none exists', () => {
      const newPost = { id: 'p1', title: 'Post 1', content: 'Content', authorId: '1', createdAt: '2024-01-01T00:00:00.000Z' };
      addPost(newPost);

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toHaveLength(1);
      expect(stored[0]).toEqual(newPost);
    });
  });

  describe('findPostById', () => {
    it('returns the post matching the given id', () => {
      const posts = [
        { id: 'p1', title: 'Post 1', content: 'Content 1', authorId: '1', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'p2', title: 'Post 2', content: 'Content 2', authorId: '2', createdAt: '2024-01-02T00:00:00.000Z' },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));
      expect(findPostById('p2')).toEqual(posts[1]);
    });

    it('returns undefined when no post matches', () => {
      localStorage.setItem('writespace_posts', JSON.stringify([]));
      expect(findPostById('nonexistent')).toBeUndefined();
    });
  });

  describe('updatePost', () => {
    it('updates an existing post matched by id', () => {
      const posts = [
        { id: 'p1', title: 'Original', content: 'Content', authorId: '1', createdAt: '2024-01-01T00:00:00.000Z' },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      updatePost({ id: 'p1', title: 'Updated Title', content: 'Updated Content' });

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored[0].title).toBe('Updated Title');
      expect(stored[0].content).toBe('Updated Content');
      expect(stored[0].authorId).toBe('1');
    });

    it('does nothing when the post id does not exist', () => {
      const posts = [
        { id: 'p1', title: 'Original', content: 'Content', authorId: '1', createdAt: '2024-01-01T00:00:00.000Z' },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      updatePost({ id: 'nonexistent', title: 'Updated' });

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('Original');
    });
  });

  describe('deletePost', () => {
    it('removes a post by id from localStorage', () => {
      const posts = [
        { id: 'p1', title: 'Post 1', content: 'Content 1', authorId: '1', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'p2', title: 'Post 2', content: 'Content 2', authorId: '2', createdAt: '2024-01-02T00:00:00.000Z' },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      deletePost('p1');

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('p2');
    });

    it('does nothing when the post id does not exist', () => {
      const posts = [
        { id: 'p1', title: 'Post 1', content: 'Content 1', authorId: '1', createdAt: '2024-01-01T00:00:00.000Z' },
      ];
      localStorage.setItem('writespace_posts', JSON.stringify(posts));

      deletePost('nonexistent');

      const stored = JSON.parse(localStorage.getItem('writespace_posts'));
      expect(stored).toHaveLength(1);
    });
  });

  // ─── Session ──────────────────────────────────────────────────────────────

  describe('getSession', () => {
    it('returns null when no session is stored', () => {
      expect(getSession()).toBeNull();
    });

    it('returns the stored session object', () => {
      const session = { userId: '1', username: 'alice', displayName: 'Alice', role: 'user' };
      localStorage.setItem('writespace_session', JSON.stringify(session));
      expect(getSession()).toEqual(session);
    });

    it('returns null when localStorage contains invalid JSON', () => {
      localStorage.setItem('writespace_session', 'bad-json');
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(getSession()).toBeNull();
      consoleSpy.mockRestore();
    });
  });

  describe('saveSession', () => {
    it('saves session object to localStorage under the correct key', () => {
      const session = { userId: '1', username: 'alice', displayName: 'Alice', role: 'user' };
      saveSession(session);
      expect(JSON.parse(localStorage.getItem('writespace_session'))).toEqual(session);
    });

    it('handles localStorage write errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      expect(() => saveSession({ userId: '1' })).not.toThrow();
      consoleSpy.mockRestore();
    });
  });

  describe('clearSession', () => {
    it('removes the session from localStorage', () => {
      const session = { userId: '1', username: 'alice', displayName: 'Alice', role: 'user' };
      localStorage.setItem('writespace_session', JSON.stringify(session));

      clearSession();

      expect(localStorage.getItem('writespace_session')).toBeNull();
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
    });

    it('handles localStorage removal errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('SecurityError');
      });
      expect(() => clearSession()).not.toThrow();
      consoleSpy.mockRestore();
    });
  });
});