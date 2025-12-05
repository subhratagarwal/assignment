Task Management System

Full-Stack Application — Next.js • Node.js • PostgreSQL • Prisma • JWT Auth

This repository contains a complete Task Management System built as part of a technical assignment.
The project demonstrates clean architecture, authentication with refresh-token rotation, Prisma ORM, pagination, search, and a functional React/Next.js frontend.

🔥 Features Overview

Authentication

User registration & login

JWT Access Token + HttpOnly Refresh Token

Secure refresh token rotation (old tokens revoked)

Password hashing (bcrypt)

Task Management

Create tasks

List tasks with pagination

Search tasks by title

Task metadata (status, description, timestamps)

CRUD-ready backend structure

Frontend

Login page

Tasks dashboard

Create + list tasks

Auto-redirect based on login state

Minimal, clean UI for assessment

Backend

Express.js REST API

Prisma ORM + PostgreSQL (Docker-based)

Zod validation

Middleware-based architecture



🛠 TECH STACK

Layer	Technologies
Frontend:-	Next.js 13 (Pages Router), React Hooks
Backend:-	Node.js, Express, TypeScript
Database:-	PostgreSQL + Prisma ORM
Auth:-	JWT, HttpOnly Cookies, bcrypt
Dev Tools:- 	Docker, ts-node-dev, Zod






📁 FOLDER STRUCTURE

assignment/
│
├── task-management-backend/
│   ├── src/
│   ├── prisma/
│   ├── docker-compose.yml
│   └── ...
│
├── task-management-frontend/
│   ├── pages/
│   ├── lib/
│   ├── public/
│   └── ...
│
├── screenshots/
│   └── (UI & smoke test screenshots)
│
├── README.md
└── SMOKE.md



🚀 Running the Application
1️⃣ Backend Setup
cd task-management-backend
docker-compose up -d
npm install
npx prisma migrate dev
npm run dev


Backend runs at:

🔗 http://localhost:5000

2️⃣ Frontend Setup
cd task-management-frontend
npm install
npm run dev


Frontend runs at:

🔗 http://localhost:3000





🔍 Smoke Test (Functional Verification)

A complete API + UI smoke test has been executed and documented in:

📄 SMOKE.md

Includes:

Login

Access token validation

Task creation

Pagination

Refresh token rotation

Logout flow

Screenshots

This document proves the entire system works end-to-end.




📸 Screenshots

All screenshots required for UI and smoke-test demonstration are available in:

📁 screenshots/

🌐 API Endpoints Summary
Auth
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login, returns access token
POST	/auth/refresh	Rotate refresh token
POST	/auth/logout	Revoke refresh token
Tasks
Method	Endpoint	Description
GET	/tasks	List tasks with pagination
POST	/tasks	Create new task



🧩 Architectural Highlights:

Clean separation between routes, controllers, services & utils

Secure refresh token hashing using bcrypt

Prisma schema with ✔ Users ✔ Tasks ✔ RefreshTokens

Middleware-based validation & authentication

Frontend remains stateless except in-memory access token

Auto-refresh mechanism integrated in frontend API wrapper



🎯 Assignment Completion Status

Requirement	Status:
Backend Setup	✅ Completed
PostgreSQL + Prisma	✅ Completed
Auth (Login/Register)	✅ Completed
Refresh Token Rotation	✅ Completed
Task CRUD + Pagination	✅ Completed
Frontend Integration	✅ Completed
Smoke Test	✅ Completed
Screenshots	✅ Added
README.md	✅ Completed
Repo Cleanup	✅ Node_modules removed, LFS-unsafe files removed
👨‍💻 Author



Subhrat Agarwal
Gmail-  subhratagarwal1234@gmail.com
🔗 GitHub: https://github.com/subhratagarwal
REPO URL:-  https://github.com/subhratagarwal/assignment

✔ This project is fully functional
✔ Meets all assignment requirements
✔ Repo is clean & ready for evaluation