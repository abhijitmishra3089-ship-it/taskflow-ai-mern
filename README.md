# TaskFlow AI — MERN + Socket.IO

A dark, responsive project-management starter with JWT auth, workspaces/teams, projects, Kanban tasks, AI task breakdown, and real-time task updates.

## Requirements
- Node.js 20+ (Node 24 is also suitable)
- MongoDB Atlas or local MongoDB
- Optional Gemini API key for AI task breakdown

## Structure
```text 
taskflow-ai-mern/
├── client/
│   ├── src/
│   │   ├── components/       # App shell, protected route, task card, modal
│   │   ├── context/          # Auth context
│   │   ├── pages/            # Login, signup, dashboard, projects, team
│   │   ├── services/         # Axios API + Socket.IO client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
└── server/
    ├── src/
    │   ├── config/db.js
    │   ├── middleware/auth.js
    │   ├── models/            # User, Workspace, Project, Task
    │   ├── routes/             # auth, projects, tasks, teams, AI
    │   ├── utils/              # async handler, safe user
    │   └── server.js
    ├── .env.example
    └── package.json
```

## 1. Install dependencies
Open two terminals:

```bash
# Terminal 1
cd server
npm install
cp .env.example .env
npm run dev
```

```bash
# Terminal 2
cd client
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

Edit `server/.env`:
- `MONGODB_URI`: your MongoDB connection string
- `JWT_SECRET`: a random secret with at least 32 characters
- `CLIENT_URL=http://localhost:5173`
- `GEMINI_API_KEY`: optional; AI feature shows a helpful error if not configured

Edit `client/.env`:
- `VITE_API_URL=http://localhost:5000/api`
- `VITE_SOCKET_URL=http://localhost:5000`

Open http://localhost:5173.

## 2. Main API endpoints
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET|POST /api/projects`
- `GET|POST /api/tasks`
- `PATCH|DELETE /api/tasks/:id`
- `GET|POST /api/teams/members`
- `POST /api/ai/breakdown`

All task/project/team routes require a bearer token. Auth uses an HTTP-only cookie and also returns a token for local API-client compatibility. For production, keep HTTPS enabled and set `COOKIE_SECURE=true`.

## 3. Deploy
### MongoDB Atlas
Create a cluster, create a database user, allow your deployment provider's IP access (or configure network access securely), and copy the connection string into `MONGODB_URI`.

### Backend (Render)
- Create a new **Web Service** from your repository.
- Root directory: `server`
- Build command: `npm install`
- Start command: `npm start`
- Add environment variables: `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL` (your deployed frontend URL), `COOKIE_SECURE=true`, and optional `GEMINI_API_KEY`.
- After deployment, copy the backend URL, e.g. `https://your-service.onrender.com`.

### Frontend (Vercel)
- Import the same repository.
- Root directory: `client`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Set `VITE_API_URL=https://your-service.onrender.com/api`
- Set `VITE_SOCKET_URL=https://your-service.onrender.com`
- Redeploy after adding variables.

### Important production notes
- Set `CLIENT_URL` to the exact Vercel URL, no trailing slash.
- Cookies require HTTPS and `SameSite=None` in cross-site deployments. The server config does this when `COOKIE_SECURE=true`.
- For cross-site cookies, browser privacy policies may block third-party cookies. If that occurs, use a same-site deployment/domain strategy or switch to a carefully managed bearer-token-only flow.
- Add email invitations, password reset, audit logging, pagination, tests, and stricter per-workspace authorization before treating this as a production business application.
