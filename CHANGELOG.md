# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

- **Public Landing Page** — Hero section with app branding, tagline, and call-to-action buttons; features section highlighting Role-Based Access, Local Storage, and Modern UI; latest posts preview showing up to 3 recent posts; footer with navigation links and copyright.
- **Authentication System** — Login page with username and password fields; registration page with display name, username, password, and confirm password fields; hard-coded admin account (`admin` / `admin123`); auto-login on successful registration; session persistence via localStorage.
- **Role-Based Routing** — `ProtectedRoute` component guarding authenticated routes; `adminOnly` flag for admin-restricted routes; unauthenticated users redirected to `/login`; non-admin users redirected to `/blogs` when accessing admin routes.
- **Blog CRUD Operations** — Create new posts at `/write` with title and content fields; edit existing posts at `/edit/:id` with ownership validation; read full posts at `/blog/:id` with author info and formatted date; delete posts with confirmation dialog; character limits for title (150) and content (5000).
- **Blog List View** — Authenticated blog list page at `/blogs` displaying all posts in a responsive grid sorted newest first; `BlogCard` component with truncated content preview, author avatar, and edit controls based on role and ownership; empty state with call-to-action to write first post.
- **Admin Dashboard** — Dashboard page at `/dashboard` with gradient banner header; four `StatCard` components displaying total posts, total users, admin count, and writer count; quick-action buttons for writing new posts and managing users; recent posts section showing up to 6 latest posts.
- **User Management** — Admin user management page at `/users` with user list and creation form; create new users with display name, username, password, and role selection; `UserRow` component displaying avatar, display name, username, role badge, and delete button; delete users with confirmation and cascade deletion of their posts; protection against deleting the hard-coded admin account and self-deletion.
- **Avatar System** — Reusable `Avatar` component with role-based visuals; crown icon for admin users; book icon for regular users; color-coded backgrounds using primary and secondary palette.
- **Navigation Components** — `Navbar` for authenticated pages with brand logo, navigation links (Blogs, Write), admin-only links (Dashboard, Users), avatar with display name, and logout button; `PublicNavbar` for public pages with brand logo, login/register buttons for guests, and dashboard link for authenticated users.
- **localStorage Persistence** — All data stored in browser localStorage with safe JSON parsing and error handling; separate storage keys for users (`writespace_users`), posts (`writespace_posts`), and session (`writespace_session`); graceful handling of invalid JSON and storage quota errors.
- **Vercel Deployment Configuration** — `vercel.json` with SPA rewrite rules routing all paths to `index.html`.
- **Tailwind CSS Design System** — Custom color palette with primary, secondary, neutral, success, danger, and warning scales; custom gradients for hero sections, cards, and backgrounds; custom box shadows, animations (fade-in, slide-up, slide-down), and typography settings; responsive design with mobile-first approach.
- **Testing Suite** — Unit tests for `auth` utility functions covering login, register, logout, session management, and role checking; unit tests for `storage` utility functions covering users, posts, and session CRUD operations; component tests for `ProtectedRoute` covering authentication and authorization scenarios; page tests for `LoginPage` and `RegisterPage` covering form rendering, submission, validation, error handling, and redirect behavior.