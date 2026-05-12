# Deployment Guide — Vercel

This guide walks you through deploying WriteSpace to [Vercel](https://vercel.com/), from connecting your Git repository to verifying that client-side routing works on direct URL access.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Connecting Your Git Repository](#connecting-your-git-repository)
3. [Build Settings](#build-settings)
4. [SPA Rewrite Configuration](#spa-rewrite-configuration)
5. [Environment Variables](#environment-variables)
6. [Deploying](#deploying)
7. [Verifying the Deployment](#verifying-the-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A [Vercel](https://vercel.com/) account (free tier is sufficient).
- Your WriteSpace repository pushed to **GitHub**, **GitLab**, or **Bitbucket**.
- Node.js v18+ and npm v9+ installed locally (for optional CLI deployment).

---

## Connecting Your Git Repository

1. Log in to [vercel.com](https://vercel.com/) and click **Add New → Project**.
2. Select your Git provider (GitHub, GitLab, or Bitbucket) and authorize Vercel if prompted.
3. Find and import the **writespace** repository.
4. Vercel auto-detects the Vite framework — no manual framework selection is needed.

---

## Build Settings

Vercel automatically detects Vite projects. The following settings are applied by default, but you can verify them in **Project Settings → General → Build & Development Settings**:

| Setting              | Value            |
| -------------------- | ---------------- |
| **Framework Preset** | Vite             |
| **Build Command**    | `npm run build`  |
| **Output Directory** | `dist`           |
| **Install Command**  | `npm install`    |
| **Node.js Version**  | 18.x (or higher) |

These match the scripts defined in `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

The production build is created by Vite in the `dist/` directory with source maps enabled (configured in `vite.config.js`).

---

## SPA Rewrite Configuration

WriteSpace is a single-page application using React Router v6 for client-side routing. Without server-side rewrite rules, navigating directly to a route like `/blogs` or `/blog/some-id` would return a 404 from the hosting server.

The repository includes a `vercel.json` file at the project root that handles this:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**How it works:**

- Every incoming request — regardless of the URL path — is served the same `index.html` file.
- React Router then reads the browser URL and renders the correct page component.
- Static assets (JS bundles, CSS, images in `dist/assets/`) are still served normally because Vercel resolves existing files before applying rewrites.

> **Important:** Do not remove or modify `vercel.json`. Without it, direct URL access to any route other than `/` will result in a 404 error.

---

## Environment Variables

WriteSpace does **not** require any environment variables to run. All data is stored in the browser's `localStorage` — there is no backend, database, or external API.

One optional variable is available for branding customization:

| Variable        | Default      | Required | Description            |
| --------------- | ------------ | -------- | ---------------------- |
| `VITE_APP_NAME` | `WriteSpace` | No       | Application brand name |

### Setting Environment Variables on Vercel (Optional)

1. Go to **Project Settings → Environment Variables**.
2. Add the variable name (e.g., `VITE_APP_NAME`) and its value.
3. Select the environments where it should apply (Production, Preview, Development).
4. Click **Save**.

> **Note:** Vite environment variables must be prefixed with `VITE_` to be exposed to client-side code. They are accessed in the application via `import.meta.env.VITE_APP_NAME`. Never use `process.env` — Vite does not support it in client code.

---

## Deploying

### Option A: Automatic Deployment via Git

Once your repository is connected to Vercel:

- Every push to the **main** (or **master**) branch triggers a **production deployment**.
- Every push to any other branch or pull request triggers a **preview deployment** with a unique URL.

No additional configuration is needed.

### Option B: Manual Deployment via Vercel CLI

```bash
# Install the Vercel CLI globally
npm i -g vercel

# Navigate to the project root
cd writespace

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

The CLI will prompt you to link the project to your Vercel account on first run.

---

## Verifying the Deployment

After deployment completes, verify the following:

1. **Landing page** — Visit the root URL (`https://your-project.vercel.app/`). You should see the hero section, features, and latest posts.

2. **Direct URL access** — Navigate directly to `https://your-project.vercel.app/login` in a new browser tab. The login page should render correctly (not a 404). This confirms the `vercel.json` SPA rewrites are working.

3. **Client-side navigation** — Log in with the default admin account (`admin` / `admin123`), navigate between pages (Dashboard, Blogs, Write, Users), and confirm all routes load without errors.

4. **Page refresh on nested routes** — While on a page like `/blog/some-id` or `/dashboard`, press the browser refresh button. The page should reload correctly without a 404.

---

## Troubleshooting

### 404 on direct URL access (e.g., `/login`, `/blogs`, `/blog/:id`)

**Cause:** The `vercel.json` rewrite rules are not being applied.

**Fix:**
- Confirm that `vercel.json` exists at the project root (not inside `src/` or `public/`).
- Verify the file contains the correct rewrite rule:
  ```json
  {
    "rewrites": [
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```
- Redeploy after making changes.

### Build fails with "Module not found" or dependency errors

**Cause:** Dependencies are not installed or `package.json` is out of sync.

**Fix:**
- Run `npm install` locally and verify the build succeeds with `npm run build`.
- Ensure `package.json` lists all required dependencies.
- Check that the Node.js version on Vercel matches your local version (v18+). You can set this in **Project Settings → General → Node.js Version**.

### Blank page after deployment

**Cause:** The `index.html` entry point or the Vite build output is misconfigured.

**Fix:**
- Verify that `index.html` is at the project root and contains `<script type="module" src="/src/main.jsx"></script>`.
- Confirm the **Output Directory** in Vercel is set to `dist`.
- Check the browser console for JavaScript errors.

### localStorage data not persisting between sessions

**Cause:** This is expected browser behavior — `localStorage` is scoped to the browser and device. It is not shared across devices or browsers.

**Note:** WriteSpace stores all data (users, posts, sessions) in the browser's `localStorage`. Each user's browser maintains its own independent data store. Clearing browser data or using incognito mode will reset all application data.

### Environment variable not available in the app

**Cause:** The variable is missing the `VITE_` prefix or was added after the last build.

**Fix:**
- Ensure the variable name starts with `VITE_` (e.g., `VITE_APP_NAME`).
- Access it in code using `import.meta.env.VITE_APP_NAME` (not `process.env`).
- Redeploy after adding or changing environment variables — Vite injects them at build time, not runtime.

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [React Router — Configuring Your Server](https://reactrouter.com/en/main/start/overview)