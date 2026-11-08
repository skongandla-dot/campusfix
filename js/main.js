/* ==========================================================
   main.js - shared on every page
   Builds navbar + footer, mobile menu, toast messages
   ========================================================== */

function currentPage() {
  const file = window.location.pathname.split("/").pop();
  return file === "" ? "index.html" : file;
}

function buildNavbar() {
  const holder = document.getElementById("site-nav");
  if (!holder) return;

  const user = getSession(); // from auth.js
  const page = currentPage();
  const link = (href, text, extra = "") =>
    `<li><a href="${href}" class="${page === href ? "active" : ""} ${extra}">${text}</a></li>`;

  let links = link("index.html", "Home") + link("instructions.html", "Instructions");

  if (user) {
    const dest = user.role === "admin" ? "admin.html" : "dashboard.html";
    const label = user.role === "admin" ? "Admin Panel" : "Dashboard";
    links += link(dest, label);
    links += `<li class="nav-user">${escapeHTML(user.name)} (${user.role})</li>`;
    links += `<li><a href="#" id="logout-btn" class="nav-btn">Logout</a></li>`;
  } else {
    links += link("login.html", "Login");
    links += link("register.html", "Register", "nav-btn");
  }

  holder.innerHTML = `
    <nav class="navbar">
      <div class="container nav-inner">
        <a href="index.html" class="brand">Campus<span>Fix</span></a>
        <button class="menu-toggle" id="menu-toggle" aria-label="Open menu">&#9776;</button>
        <ul class="nav-links" id="nav-links">${links}</ul>
      </div>
    </nav>`;

  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("nav-links").classList.toggle("open");
  });

  const logout = document.getElementById("logout-btn");
  if (logout) {
    logout.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  }
}

function buildFooter() {
  const holder = document.getElementById("site-footer");
  if (!holder) return;
  holder.innerHTML = `
    <footer class="footer">
      <div class="container">
        <p><strong>CampusFix</strong> - Campus Issue Reporting &amp; Tracking System</p>
        <p>Made for Lovely Professional University students | CA1 Project</p>
        <p>Contact: <a href="mailto:support@campusfix.example">support@campusfix.example</a></p>
      </div>
    </footer>`;
}

/* Small popup message at bottom-right */
function showToast(message) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

/* Show an error/success box inside a form */
function showAlert(id, type, message) {
  const box = document.getElementById(id);
  if (!box) return;
  box.className = `form-alert show ${type}`;
  box.textContent = message;
}

function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text == null ? "" : String(text);
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  buildNavbar();
  buildFooter();
});
