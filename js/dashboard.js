/* ==========================================================
   dashboard.js - Student dashboard logic
   ========================================================== */

// Route protection: only logged-in students may open this page
const user = requireAuth("student");

if (user) {
  document.getElementById("welcome").textContent = "Hello, " + user.name.split(" ")[0] + "!";

  const statsBox = document.getElementById("stats");
  const listBox = document.getElementById("issue-list");

  /* Re-draw stats and list (called after every change) */
  function refresh() {
    const mine = getIssuesForUser(user.id);
    renderStats(statsBox, mine);

    const filtered = filterIssues(mine, {
      q: document.getElementById("search").value,
      status: document.getElementById("filter-status").value,
      category: document.getElementById("filter-category").value,
    });

    const hasFilter =
      document.getElementById("search").value ||
      document.getElementById("filter-status").value ||
      document.getElementById("filter-category").value;

    renderIssues(listBox, filtered, {
      admin: false,
      emptyText: hasFilter
        ? "No issues match your search or filter."
        : "You have not reported any issues yet. Use the form to submit your first one.",
    });
  }

  /* Submit new issue */
  document.getElementById("issue-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const result = addIssue({
      title: document.getElementById("title").value,
      category: document.getElementById("category").value,
      location: document.getElementById("location").value,
      priority: document.getElementById("priority").value,
      description: document.getElementById("description").value,
    });

    if (!result.ok) {
      showAlert("alert", "error", result.msg);
      return;
    }
    this.reset();
    document.getElementById("priority").value = "Medium";
    document.getElementById("alert").className = "form-alert";
    showToast("Issue submitted successfully");
    refresh();
  });

  /* Delete (event delegation on the list) */
  listBox.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-action='delete']");
    if (!btn) return;
    if (confirm("Delete this issue permanently?")) {
      deleteIssue(btn.dataset.id);
      showToast("Issue deleted");
      refresh();
    }
  });

  /* Live search + filters */
  ["search", "filter-status", "filter-category"].forEach((id) => {
    document.getElementById(id).addEventListener("input", refresh);
  });

  refresh();
}
