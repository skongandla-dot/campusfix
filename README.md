# CampusFix - Campus Issue Reporting & Tracking System

A CA1 problem-statement project for Lovely Professional University students.
Students report campus problems (WiFi, water, electricity, hostel, classroom) and track them
from **Pending → In Progress → Resolved**. Admins see all issues and update their status.

## Problem statement
Students often do not know whom to tell about a campus problem, and cannot see what happened after
reporting it. CampusFix gives one place to report, track and resolve issues.

## Features
- Register / Login / Logout with validation and error messages
- Student and Admin roles (admin registration needs an access code)
- Route protection: dashboard and admin pages redirect to login if not signed in
- Report an issue (title, category, location, priority, description)
- Search and filter by status and category
- Dashboard counts (Total / Pending / In Progress / Resolved)
- Admin panel: view all issues, change status, delete
- Responsive design with mobile menu, toast messages and empty states

## Technologies
HTML5, CSS3 (variables, grid, flexbox, media queries), JavaScript (ES6), browser localStorage.

## Folder structure
```
campusfix/
├── index.html          Landing page
├── login.html          Login
├── register.html       Register
├── instructions.html   How to use + FAQ
├── dashboard.html      Student dashboard
├── admin.html          Admin panel
├── css/style.css       All styles
└── js/
    ├── main.js         Navbar, footer, toast (shared)
    ├── auth.js         Register, login, logout, route protection
    ├── issues.js       Issue CRUD, filters, stats, rendering
    ├── dashboard.js    Student page logic
    └── admin.js        Admin page logic
```

## Run locally
Open the folder in VS Code and use the Live Server extension (or just double-click `index.html`).

## Demo accounts
- Admin: `admin@campusfix.com` / `Admin@123`
- Student: register a new account
- Admin access code for new admin registration: `LPU-ADMIN-2026`

## Deploy on GitHub Pages
1. Push all files to a GitHub repository (files at the repository root).
2. Repository → Settings → Pages.
3. Source: Deploy from a branch → Branch: `main` → Folder: `/ (root)` → Save.
4. Wait about a minute. The site link appears at the top of the Pages screen.

## Limitations and future scope
- Data is stored in the browser (localStorage), so it is not shared across devices.
- Login is a front-end simulation; a real version needs a backend and secure password hashing.
- Future: Firebase/Node backend, photo upload, email notifications, analytics charts.

## Team and contributions
| Member | Reg. No. | Contribution |
|---|---|---|
| Member 1 | | Website code (HTML/CSS/JS) |
| Anmol Thakur | 12608120 | Content, testing, GitHub and deployment |
| Member 3 | | Documentation, video script, submission file, viva material |
