/* ==========================================================
   auth.js - Register, Login, Logout, Route protection
   Data is stored in the browser (localStorage).
   NOTE: This is a front-end simulation. A real system would
   use a server + database and secure password hashing.
   ========================================================== */

const USERS_KEY = "cf_users";
const SESSION_KEY = "cf_session";
const ADMIN_CODE = "LPU-ADMIN-2026"; // needed to register as admin

/* ---- storage helpers ---- */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch (e) {
    return null;
  }
}

/* Simple hash so passwords are not stored as plain text.
   (Demo only - not secure enough for production.) */
function hashPassword(text) {
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return "h" + (hash >>> 0).toString(16);
}

/* Create a default admin so the project can be demoed immediately */
function seedAdmin() {
  const users = getUsers();
  if (!users.some((u) => u.email === "admin@campusfix.com")) {
    users.push({
      id: "u-admin",
      name: "Campus Admin",
      email: "admin@campusfix.com",
      password: hashPassword("Admin@123"),
      role: "admin",
    });
    saveUsers(users);
  }
}
seedAdmin();

/* ---- validation ---- */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isStrongPassword(pw) {
  // min 6 chars, at least one letter and one number
  return pw.length >= 6 && /[A-Za-z]/.test(pw) && /\d/.test(pw);
}

/* ---- register ---- */
function registerUser({ name, email, password, role, code }) {
  name = name.trim();
  email = email.trim().toLowerCase();

  if (name.length < 3) return { ok: false, msg: "Name must be at least 3 characters." };
  if (!isValidEmail(email)) return { ok: false, msg: "Enter a valid email address." };
  if (!isStrongPassword(password))
    return { ok: false, msg: "Password needs 6+ characters with letters and numbers." };
  if (role === "admin" && code !== ADMIN_CODE)
    return { ok: false, msg: "Invalid admin access code." };

  const users = getUsers();
  if (users.some((u) => u.email === email))
    return { ok: false, msg: "This email is already registered. Please login." };

  users.push({
    id: "u-" + Date.now(),
    name,
    email,
    password: hashPassword(password),
    role: role === "admin" ? "admin" : "student",
  });
  saveUsers(users);
  return { ok: true };
}

/* ---- login ---- */
function loginUser(email, password) {
  email = email.trim().toLowerCase();
  if (!email || !password) return { ok: false, msg: "Please fill in all fields." };

  const user = getUsers().find((u) => u.email === email);
  if (!user) return { ok: false, msg: "No account found with this email." };
  if (user.password !== hashPassword(password))
    return { ok: false, msg: "Incorrect password. Try again." };

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role })
  );
  return { ok: true, role: user.role };
}

/* ---- logout ---- */
function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
}

/* ---- route protection ----
   Call at the top of a protected page.
   role = "student" | "admin" | undefined (any logged-in user) */
function requireAuth(role) {
  const user = getSession();
  if (!user) {
    window.location.href = "login.html";
    return null;
  }
  if (role && user.role !== role) {
    window.location.href = user.role === "admin" ? "admin.html" : "dashboard.html";
    return null;
  }
  return user;
}

/* Logged-in users should not see login/register again */
function redirectIfLoggedIn() {
  const user = getSession();
  if (user) {
    window.location.href = user.role === "admin" ? "admin.html" : "dashboard.html";
  }
}
