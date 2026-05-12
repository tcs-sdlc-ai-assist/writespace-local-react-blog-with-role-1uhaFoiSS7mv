# WriteSpace

A distraction-free writing platform built with React 18, Vite, and Tailwind CSS. Create, share, and manage blog posts with role-based access control — all data stored locally in your browser's localStorage.

## Tech Stack

- **React 18** — UI library with functional components and hooks
- **Vite 5** — Fast build tool and dev server
- **Tailwind CSS 3** — Utility-first CSS framework
- **React Router v6** — Client-side routing with nested and protected routes
- **localStorage** — Browser-based persistence (no backend required)
- **Vitest** — Unit and component testing framework
- **React Testing Library** — Component testing utilities

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install
```

### Development

```bash
# Start the development server on http://localhost:3000
npm run dev
```

### Build

```bash
# Create a production build in the dist/ directory
npm run build

# Preview the production build locally
npm run preview
```

### Testing

```bash
# Run all tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment configuration
├── .env.example                # Environment variable template
├── public/
│   └── vite.svg                # Favicon
└── src/
    ├── main.jsx                # React DOM entry point
    ├── App.jsx                 # Root component with route definitions
    ├── index.css               # Tailwind CSS imports
    ├── setupTests.js           # Test setup (jest-dom matchers)
    ├── components/
    │   ├── Avatar.jsx          # Role-based avatar (crown/book icon)
    │   ├── BlogCard.jsx        # Blog post preview card
    │   ├── Navbar.jsx          # Authenticated navigation bar
    │   ├── PublicNavbar.jsx    # Public navigation bar
    │   ├── ProtectedRoute.jsx  # Route guard (auth + admin check)
    │   ├── ProtectedRoute.test.jsx
    │   ├── StatCard.jsx        # Dashboard statistics card
    │   └── UserRow.jsx         # User management list row
    ├── pages/
    │   ├── LandingPage.jsx     # Public landing page
    │   ├── LoginPage.jsx       # Login form
    │   ├── LoginPage.test.jsx
    │   ├── RegisterPage.jsx    # Registration form
    │   ├── RegisterPage.test.jsx
    │   ├── Home.jsx            # Blog list (all posts)
    │   ├── WriteBlog.jsx       # Create/edit blog post
    │   ├── ReadBlog.jsx        # Full blog post view
    │   ├── AdminDashboard.jsx  # Admin dashboard with stats
    │   └── UserManagement.jsx  # Admin user management
    └── utils/
        ├── auth.js             # Authentication logic
        ├── auth.test.js
        ├── storage.js          # localStorage CRUD operations
        └── storage.test.js
```

## Route Map

| Path           | Component        | Access          | Description                        |
| -------------- | ---------------- | --------------- | ---------------------------------- |
| `/`            | LandingPage      | Public          | Hero, features, latest posts       |
| `/login`       | LoginPage        | Public          | Login form                         |
| `/register`    | RegisterPage     | Public          | Registration form                  |
| `/blogs`       | Home             | Authenticated   | All posts grid                     |
| `/write`       | WriteBlog        | Authenticated   | Create a new post                  |
| `/edit/:id`    | WriteBlog        | Authenticated   | Edit an existing post              |
| `/blog/:id`    | ReadBlog         | Authenticated   | Read a full post                   |
| `/dashboard`   | AdminDashboard   | Admin only      | Platform stats and recent posts    |
| `/users`       | UserManagement   | Admin only      | Create and manage users            |

## Default Admin Account

A hard-coded admin account is available out of the box:

| Field    | Value      |
| -------- | ---------- |
| Username | `admin`    |
| Password | `admin123` |

## localStorage Schema

All application data is persisted in the browser's localStorage under the following keys:

### `writespace_users`

```json
[
  {
    "id": "uuid",
    "displayName": "Alice",
    "username": "alice",
    "password": "plaintext",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### `writespace_posts`

```json
[
  {
    "id": "uuid",
    "title": "Post Title",
    "content": "Post content...",
    "authorId": "uuid",
    "authorName": "Alice",
    "authorRole": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### `writespace_session`

```json
{
  "userId": "uuid",
  "username": "alice",
  "displayName": "Alice",
  "role": "user"
}
```

> **Note:** The hard-coded admin account (`admin` / `admin123`) is not stored in localStorage. It is checked at login time in the authentication logic.

## Role-Based Access

### Admin

- View the admin dashboard with platform statistics
- Create, edit, and delete **any** post
- Create and delete users (except the hard-coded admin account and themselves)
- Access all authenticated routes

### User (Writer)

- Create new blog posts
- Edit and delete **their own** posts only
- View all posts
- Cannot access admin dashboard or user management

## Deployment to Vercel

The project includes a `vercel.json` configuration for single-page application routing.

### Steps

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com/).
3. Vercel auto-detects Vite — no additional configuration is needed.
4. Deploy. All routes are rewritten to `index.html` via the `vercel.json` rewrites rule.

Alternatively, deploy from the CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Environment Variables

No environment variables are required to run this application. An optional branding variable is available:

| Variable        | Default      | Description            |
| --------------- | ------------ | ---------------------- |
| `VITE_APP_NAME` | `WriteSpace` | Application brand name |

Copy `.env.example` to `.env` to customize:

```bash
cp .env.example .env
```

## Usage Guide

1. **Visit the landing page** at `/` to see the hero section, features, and latest posts.
2. **Register** a new account at `/register` or **log in** at `/login` with existing credentials.
3. **Browse posts** at `/blogs` — all posts are displayed in a responsive grid sorted newest first.
4. **Write a post** by clicking "Write Post" or navigating to `/write`. Fill in the title (max 150 characters) and content (max 5,000 characters), then publish.
5. **Read a post** by clicking its title to open the full view at `/blog/:id`.
6. **Edit or delete** your own posts from the post view or the blog list. Admins can edit or delete any post.
7. **Admin dashboard** at `/dashboard` shows total posts, total users, admin count, and writer count with quick-action buttons.
8. **User management** at `/users` allows admins to create new user accounts with role selection and delete existing users.
9. **Log out** using the Logout button in the navigation bar.

## License

Private