# CastTrack Frontend

React SPA for the CastTrack Fishing Conditions Platform.

**Stack:** React 18, Vite 7, React Router 7

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── footer.jsx
│   │   ├── login.jsx              # Login/signup modal + session button
│   │   ├── navigationBar.jsx
│   │   ├── searchBar.jsx          # (currently unused)
│   │   └── LocationSearch.jsx     # Open-Meteo geocoder used by RegulationPage
│   ├── lib/
│   │   ├── api.js                 # Fetch wrapper with JWT + base URL helper
│   │   └── auth.js                # Auth state hook + setAuth/clearAuth
│   ├── pages/
│   │   ├── homePage.jsx           # Browse waterbodies, weather/events/catches/trends
│   │   ├── catchPage.jsx          # Catch reports list + submission form
│   │   ├── eventPage.jsx          # Events + advisories with admin CRUD
│   │   └── regulationPage.jsx     # Free-form location weather (Open-Meteo)
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
├── .env                           # VITE_API_URL
├── index.html
├── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v20+
- A running CastTrack API (locally on port 3000/3001 or a deployed URL)

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   Create or edit `.env`:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
   Point this at your local backend or your deployed Render URL
   (e.g. `https://casttrack-api.onrender.com/api`).

3. **Start dev server**
   ```bash
   npm run dev
   ```
   Vite will print a local URL (typically `http://localhost:5173`).

## Environment Variables

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | yes | Base URL for the CastTrack API, including the `/api` suffix |

Vite reads variables prefixed with `VITE_` from `.env` at build time. Restart
the dev server after changing `.env`.

## Auth Model

JWT lives in `localStorage` under the keys `token` and `userRole`. Read and
written through `src/lib/auth.js`:

- `setAuth({ token, role })` stores both and fires a `casttrack:auth-change`
  event so subscribed components re-render.
- `clearAuth()` removes both and fires the same event (used on logout).
- `useAuth()` is a React hook returning `{ token, role, isLoggedIn }` that
  re-runs when auth changes locally or in another tab.

API calls go through `src/lib/api.js`, which automatically reads the token
from `localStorage` and attaches `Authorization: Bearer <token>` to every
request. No need to thread the token through component props.

## Useful Commands

```bash
npm run dev       # Start Vite dev server with hot reload
npm run build     # Production build to dist/
npm run preview   # Serve the production build locally for sanity checks
```

## Deploying

The build output is a static `dist/` folder, so any static host works:

- **Vercel** — `vercel --prod`, set `VITE_API_URL` in project settings.
- **Netlify** — drag-and-drop `dist/` or connect the repo. Set
  `VITE_API_URL` under Site settings → Environment variables.
- **Render Static Site** — point at this folder. Build command:
  `npm install && npm run build`. Publish directory: `dist`.

For each, set `VITE_API_URL` to your deployed backend's `/api` URL.

## Known Gaps and Follow-ups

- **`searchBar.jsx`** is unused and has bugs (mismatched `onchange` / `onChange`
  prop, missing return). Either delete it or fix it.
- **Favorites** (the saved-spots sidebar on the home page) are local React
  state and are not persisted. The backend has `/api/favorites` endpoints
  ready to wire up when needed.
- **Reminders** have no UI. The backend supports CRUD on license-expiration
  reminders and runs a daily cron, but nothing in the frontend exposes it yet.
- **`regulationPage.jsx`** calls Open-Meteo directly rather than going through
  the backend's cached NWS endpoint. This is a product decision (free-form
  location search vs. seeded waterbodies). Pick a direction before changing.
