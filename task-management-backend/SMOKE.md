# SMOKE TEST – Task Management Assignment
Date: 2025-12-05

## Environment
- Backend: task-management-backend (Node + TypeScript + Express + Prisma)
- Frontend: task-management-frontend (Next.js)
- Database: Postgres (docker-compose)
- Local URLs:
  - Backend: http://localhost:5000
  - Frontend: http://localhost:3000

---

## Steps & Results

1. **Health check**
   - `GET /health`
   - Response: `{"status":"ok"}`
   - Result: ✅

2. **Register (idempotent)**
   - `POST /auth/register` (body: `{email,password,name}`)
   - If user already exists: `409 Conflict` (acceptable, idempotent)
   - Otherwise: `201 Created` and returns access token + user.
   - Result: ✅ (409 acceptable if previously created)

3. **Login**
   - `POST /auth/login` with registered credentials
   - Response body contains `accessToken` and `user` object.
   - A `refreshToken` cookie (HttpOnly) is set.
   - Result: ✅ (accessToken length > 0, refresh cookie present)

4. **Create task**
   - `POST /tasks` with Authorization `Bearer <accessToken>`
   - Returns `201 Created` and task object with `id`.
   - Result: ✅ (example created id: 8 during testing)

5. **List tasks**
   - `GET /tasks` with Authorization header
   - Returns `{ tasks: [...], pagination: {...} }` including tasks created earlier.
   - Result: ✅ (tasks list contains previously created tasks)

6. **Refresh access token using cookie**
   - `POST /auth/refresh` (no body; client sends cookie)
   - Returns new `accessToken`.
   - Result: ✅ (valid new access token returned)

7. **Logout**
   - `POST /auth/logout` with cookie
   - Server revokes the refresh token and clears cookie
   - Result: ✅ (cookie cleared; subsequent refresh fails)

---

## Notes / Observations
- Frontend `login` → receives access token and navigates to `/tasks` — working.
- Frontend `create` task button successfully posts to `/tasks` and UI refreshes.
- Token refresh logic is functional; refresh cookie is set as HttpOnly and is used by the backend.
- Docker Postgres and Prisma migrations were applied successfully during setup.

---

## Screenshots (included in `screenshots/` folder)
- `login.png` — Login page
- `tasks.png` — Tasks list page showing smoke task
- `create-task.png` — After creating a task
- `network-tasks.png` — Network tab showing GET /tasks
- `backend-smoke.png` — Terminal showing backend smoke-test outputs

---

## Conclusion
Backend and frontend are integrated correctly. All core flows (auth, create/list tasks, refresh, logout) work as expected.

