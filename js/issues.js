/* ==========================================================
   issues.js - Issue data (CRUD), filters, stats, rendering
   Used by dashboard.html (student) and admin.html (admin)
   ========================================================== */

const ISSUES_KEY = "cf_issues";
const STATUSES = ["Pending", "In Progress", "Resolved"];

/* ---- storage ---- */
function loadIssues() {
  try {
    return JSON.parse(localStorage.getItem(ISSUES_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveIssues(list) {
  localStorage.setItem(ISSUES_KEY, JSON.stringify(list));
}

/* ---- CREATE ---- */
function addIssue(data) {
  const user = getSession();
  const title = data.title.trim();
  const description = data.description.trim();
  const location = data.location.trim();

  if (title.length < 5) return { ok: false, msg: "Title must be at least 5 characters." };
  if (!data.category) return { ok: false, msg: "Please choose a category." };
  if (location.length < 2) return { ok: false, msg: "Please enter the location." };
  if (description.length < 10)
    return { ok: false, msg: "Description must be at least 10 characters." };

  const list = loadIssues();
  list.unshift({
    id: "i-" + Date.now(),
    title,
    category: data.category,
    location,
    priority: data.priority,
    description,
    status: "Pending",
    userId: user.id,
    userName: user.name,
    createdAt: new Date().toISOString(),
  });
  saveIssues(list);
  return { ok: true };
}

/* ---- READ (per user / all) ---- */
function getIssuesForUser(userId) {
  return loadIssues().filter((i) => i.userId === userId);
}

/* ---- UPDATE ---- */
function updateStatus(id, status) {
  if (!STATUSES.includes(status)) return;
  const list = loadIssues();
  const item = list.find((i) => i.id === id);
  if (item) {
    item.status = status;
    saveIssues(list);
  }
}

/* ---- DELETE ---- */
function deleteIssue(id) {
  saveIssues(loadIssues().filter((i) => i.id !== id));
}

/* ---- search + filter ---- */
function filterIssues(list, { q = "", status = "", category = "" }) {
  q = q.trim().toLowerCase();
  return list.filter((i) => {
    const matchText =
      !q ||
      i.title.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q);
    return matchText && (!status || i.status === status) && (!category || i.category === category);
  });
}

/* ---- stats ---- */
function countStats(list) {
  return {
    total: list.length,
    pending: list.filter((i) => i.status === "Pending").length,
    progress: list.filter((i) => i.status === "In Progress").length,
    resolved: list.filter((i) => i.status === "Resolved").length,
  };
}

function renderStats(container, list) {
  const s = countStats(list);
  container.innerHTML = `
    <div class="card stat-card total"><div class="num">${s.total}</div><div class="lbl">Total</div></div>
    <div class="card stat-card pending"><div class="num">${s.pending}</div><div class="lbl">Pending</div></div>
    <div class="card stat-card progress"><div class="num">${s.progress}</div><div class="lbl">In Progress</div></div>
    <div class="card stat-card resolved"><div class="num">${s.resolved}</div><div class="lbl">Resolved</div></div>`;
}

/* ---- render issue cards ----
   options.admin = true  -> show status dropdown + reporter name
   options.admin = false -> student view (status badge + delete) */
function renderIssues(container, list, options = {}) {
  if (list.length === 0) {
    container.innerHTML = `
      <div class="empty">
        <div class="icon">&#128196;</div>
        <p>${options.emptyText || "No issues found."}</p>
      </div>`;
    return;
  }

  container.innerHTML = list
    .map((i) => {
      const date = new Date(i.createdAt).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric",
      });
      const tagClass = i.status.replace(" ", "-");

      const adminControls = `
        <select data-action="status" data-id="${i.id}" aria-label="Change status">
          ${STATUSES.map(
            (s) => `<option value="${s}" ${s === i.status ? "selected" : ""}>${s}</option>`
          ).join("")}
        </select>`;

      return `
      <article class="card issue-card">
        <div class="issue-top">
          <div>
            <div class="issue-title">${escapeHTML(i.title)}</div>
            <div class="issue-meta">
              ${escapeHTML(i.category)} | ${escapeHTML(i.location)} | ${date}
              ${options.admin ? " | By " + escapeHTML(i.userName) : ""}
            </div>
          </div>
          <div>
            <span class="prio ${i.priority}">${i.priority} priority</span>
            <span class="tag ${tagClass}">${i.status}</span>
          </div>
        </div>
        <p class="issue-desc">${escapeHTML(i.description)}</p>
        <div class="issue-actions">
          ${options.admin ? adminControls : ""}
          <button class="btn btn-danger btn-small" data-action="delete" data-id="${i.id}">Delete</button>
        </div>
      </article>`;
    })
    .join("");
}
