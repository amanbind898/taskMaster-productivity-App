## TaskMaster – Productivity App

TaskMaster is a full‑stack task management app built with Next.js App Router. It features email/password authentication, MongoDB persistence, dark mode, rich task metadata (priority, category, due date, reminder), filtering, quick stats, and a polished UI.

### Tech Stack
- Next.js 15 (App Router)
- React 19
- NextAuth.js (Credentials provider, JWT sessions)
- MongoDB + Mongoose
- Tailwind CSS + PostCSS
- next-themes (dark mode)
- Heroicons

### Key Features
- Secure auth with email/password (JWT sessions)
- Create, read, update, and delete personal tasks
- Task attributes: title, description, category, priority, due date, reminder
- Custom categories (persisted locally) + filters (status, due date, priority)
- Dashboard with quick stats and category breakdown
- Responsive UI with light/dark theme toggle

---

## Getting Started

### Prerequisites
- Node.js 18.18+ or 20+
- A MongoDB connection string (Atlas or local)

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Create a `.env.local` file in the project root:
```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-strong-random-string
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority
```

Tips to generate a secret (any strong random string works):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3) Run the app
```bash
npm run dev
```
App will be available at `http://localhost:3000`.

---

## Available Scripts
- `npm run dev`: Start the Next.js dev server
- `npm run build`: Build for production
- `npm run start`: Start the production server
- `npm run lint`: Run Next.js ESLint

---

## Project Structure (high level)
```text
src/
  app/
    api/
      auth/[...nextauth]/route.js     # NextAuth credentials provider
      users/signup/route.js           # Sign‑up endpoint
      tasks/route.js                  # GET (list), POST (create) tasks
      tasks/[id]/route.js             # PUT (update), DELETE (remove) task
    components/                       # Navbar, Footer, DarkModeToggle, etc.
    dashboard/page.js                 # Main authenticated dashboard
    login/                            # Login page and form
    signup/                           # Sign-up page
    layout.js, page.js, globals.css   # App shell & styles
  lib/dbConnect.js                    # MongoDB connection helper
  models/User.js                      # User schema
  models/Task.js                      # Task schema
```

---

## Authentication
- Credentials-based login via NextAuth.js
- JWT session strategy; user id is added to the token and session
- UI routes: `/login`, `/signup`

Environment variables used by auth and database:
```bash
NEXTAUTH_URL=...
NEXTAUTH_SECRET=...
MONGODB_URI=...
```

---

## API Reference

All task endpoints require an authenticated session.

### Sign Up
POST `/api/users/signup`
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123"
}
```
Responses
- 201 Created: `{ success: true, user: { ...without password } }`
- 400/503/500: `{ error: string }`

### List Tasks
GET `/api/tasks`
- Returns the current user’s tasks sorted by creation date

### Create Task
POST `/api/tasks`
```json
{
  "title": "Finish report",
  "description": "Q3 results",
  "category": "Work",
  "dueDate": "2025-01-25",
  "reminder": null,
  "priority": "High"
}
```

### Update Task
PUT `/api/tasks/{id}`
```json
{ "completed": true }
```

### Delete Task
DELETE `/api/tasks/{id}`

---

## Styling & Theming
- Tailwind configured in `tailwind.config.js`
- Dark mode handled via `next-themes` (class strategy)

---

## Deployment
The app is optimized for deployment on Vercel.

1) Push to a Git repo (GitHub/GitLab/etc.)
2) Import the repo in Vercel
3) Set the environment variables (`NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `MONGODB_URI`)
4) Deploy

For custom servers, build and run:
```bash
npm run build
npm run start
```

---

## Troubleshooting
- Ensure your `MONGODB_URI` is correct and accessible from your environment
- Make sure `NEXTAUTH_SECRET` is set; auth will fail without it
- If you change env vars, restart the dev server

---

## License
This project is provided as-is; add your preferred license if you plan to distribute.
