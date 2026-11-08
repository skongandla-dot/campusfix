/* ==========================================================
   admin.js - Admin panel logic
   ========================================================== */

// Route protection: only admins may open this page
const admin = requireAuth("admin");

if (admin) {
  const statsBox = document.getElementById("stats");
  const listBox = document.getElementById("issue-list");

  function refresh() {
    const all = loadIssues();
    renderStats(statsBox, all);

    const q = document.getElementById("search").value;
    const status = document.getElementById("filter-status").value;
    const category = document.getElementById("filter-category").value;

    renderIssues(listBox, filterIssues(all, { q, status, category }), {
      admin: true,
      emptyText: q || status || category
        ? "No issues match your search or filter."
        : "No issues have been reported yet.",
    });
  }

  /* Change status (dropdown inside each card) */
  listBox.addEventListener("change", function (e) {
    const select = e.target.closest("[data-action='status']");
    if (!select) return;
    updateStatus(select.dataset.id, select.value);
    showToast("Status updated to " + select.value);
    refresh();
  });

  /* Delete */
  listBox.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-action='delete']");
    if (!btn) return;
    if (confirm("Delete this issue permanently?")) {
      deleteIssue(btn.dataset.id);
      showToast("Issue deleted");
      refresh();
    }
  });

  ["search", "filter-status", "filter-category"].forEach((id) => {
    document.getElementById(id).addEventListener("input", refresh);
  });

  refresh();
}
