# Stapl: Sports Activity Logging & Analysis API

## Overview
- Backend `Node.js` + `Express` with `JWT` auth and `MongoDB` via `Mongoose`.
- Core flows: register/login, log activity, list/filter, insights, consistency analytics.
- Infra: backend Dockerfile, Nginx proxy config with custom header, one-click local setup script.

## Why MongoDB
- Flexible activity metrics across different sports without rigid schema changes.
- Fast aggregation for time-range insights and category/metric computations.
- Simple local setup using Docker; document model fits event-like activity logs.

## API
- `POST /api/register` — create account.
- `POST /api/login` — returns `token`.
- `GET /api/profile` — current user (auth).
- `POST /api/activities/log` — log activity (auth).
- `GET /api/activities` — list/filter by `date`, `category`, `metric` (auth).
- `GET /api/activities/insights?from&to` — totals, top category, metric max/min (auth).
- `GET /api/activities/analytics/consistency` — per-category consistency score, last 30 days (auth).

### Request/Response Examples
- Register
```
POST /api/register
{ "name": "Demo", "email": "demo@stapl.io", "password": "Password@123" }
```

- Login
```
POST /api/login
{ "email": "demo@stapl.io", "password": "Password@123" }
-> { "token": "..." }
```

- Log Activity
```
POST /api/activities/log
Authorization: Bearer <token>
{ "category": "Running", "metric": "distance", "value": 5, "duration": 35, "date": "2025-11-22" }
```

- Filter Activities
```
GET /api/activities?date=2025-11-01&category=Running&metric=distance
Authorization: Bearer <token>
```

- Insights
```
GET /api/activities/insights?from=2025-01-01&to=2025-12-31
Authorization: Bearer <token>
```

- Consistency
```
GET /api/activities/analytics/consistency
Authorization: Bearer <token>
-> { "Running": 43.33, "Gym": 36.67 }
```

## Data Model
- `User`: `name`, `email` (unique), `password` (bcrypt).
- `Activity`: `userId`, `category`, `metric`, `value`, `duration`, `date`.

## Analytics Logic
- Insights: iterate activities in range, sum `duration`, count per `category`, compute per-metric `max`/`min`.
- Consistency score: last 30 days, unique active days per category, score = `(activeDays/30)*100`.

## Local Setup
- Requirements: Docker Desktop, Node.js 18+.
- Run: `./setup.ps1`
- Server env created at `server/.env` with `MONGO_URI` and `JWT_SECRET`.
- Demo data seeded automatically; server can start with `npm start` in `server`.
- Client can run with `npm run dev` in `client` (uses `VITE_SERVER_URL`).

## Docker (Backend)
- Build: `docker build -t stapl-server ./server`
- Run: `docker run -p 5000:5000 --env-file ./server/.env stapl-server`

## Nginx Proxy
- Use `nginx.conf` to proxy `/api` to backend.
- Adds `X-Stapl-Proxy: on` response header.
- Example container: `docker run -p 80:80 -v $PWD/nginx.conf:/etc/nginx/nginx.conf:ro nginx:stable`

## Sample Data
- JSON: `server/data/sample_user.json`, `server/data/sample_activities.json`.
- Script: `node server/scripts/seed.js` inserts 30 days of mixed activities.

## Troubleshooting
- 401/403: ensure `Authorization: Bearer <token>` set and `JWT_SECRET` matches.
- DB connection: confirm `MONGO_URI` reachable and container running.
- CORS: client `.env` `VITE_SERVER_URL` must point to backend URL.

## User Stories
- As an athlete, I register and login to secure my data.
- As an athlete, I log training sessions with category and metrics.
- As an athlete, I view and filter past sessions by date/category/metric.
- As an athlete, I get insights over custom ranges to track progress.
- As an athlete, I see consistency scores to understand routine adherence.

## Sprint Plan
- Auth: implement register/login, JWT middleware, profile endpoint.
- Activities: schema, log endpoint, filters, validation.
- Insights: totals, top category, per-metric max/min.
- Analytics: consistency score endpoint and UI integration.
- Infra: Dockerfile, Nginx proxy config, setup script, seeding.
- Docs: README and sample requests; publish repo to GitHub.

## GitHub Publishing
- Initialize: `git init && git add . && git commit -m "chore: initial"`
- Push: create remote repo, `git remote add origin <url>`, `git push -u origin main`.
- Commit progressively with descriptive messages per feature.
