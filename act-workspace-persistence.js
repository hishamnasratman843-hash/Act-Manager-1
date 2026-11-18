/* ACT Manager: persist the exact visible workspace between app suspensions/reopens. */
(() => {
  "use strict";
  const KEY = "actPhoneManager_workspace_v2";
  const tracked = [
    "home-section","sales-area","customers-section","employees-section",
    "more-section","independent-sales-section","independent-purchases-section",
    "wallet-section","account-section","phone-sale-section","phone-purchases-section","sales-view-new","sales-view-history","sales-view-reports","maintenance-status-view"
  ];
  const visible = el => {
    if (!el || el.hidden) return false;
    for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
      if (getComputedStyle(node).display === "none" || node.hidden) return false;
    }
    return true;
  };
  function snapshot() {
    const login = document.getElementById("login-page");
    const main = document.getElementById("main-page");
    if (!main || !visible(main) || (login && visible(login))) return;
    const ids = tracked.filter(id => visible(document.getElementById(id)));
    const nested = [...document.querySelectorAll(".act-extra-section, #day-close-section, #customer-management-section, #safe-overview-section, #settings-section, #accessories-section, #general-reports-section, #previous-days-section")]
      .filter(visible).map(el => el.id).filter(Boolean);
    const nav = document.querySelector("#bottom-navigation .active, #bottom-navigation [aria-current='page']");
    const state = {
      ids, nested,
      navId: nav?.id || "",
      maintenanceSection: document.querySelector(".maintenance-buttons button.active[data-section]")?.dataset.section || "",
      scrollY: window.scrollY,
      savedAt: Date.now()
    };
    if (ids.length || nested.length) {
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
    }
  }
  function restore() {
    let state;
    try { state = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (_) { return; }
    if (!state || Date.now() - Number(state.savedAt || 0) > 30 * 24 * 60 * 60 * 1000) return;
    const login = document.getElementById("login-page");
    const main = document.getElementById("main-page");
    if (!main || !visible(main) || (login && visible(login))) return;
    const ids = Array.isArray(state.ids) ? state.ids : [];
    const all = tracked.map(id => document.getElementById(id)).filter(Boolean);
    all.forEach(el => { el.style.display = "none"; });
    const nestedAll = document.querySelectorAll(".act-extra-section, #day-close-section, #customer-management-section, #safe-overview-section, #settings-section, #accessories-section, #general-reports-section, #previous-days-section");
    nestedAll.forEach(el => { el.style.display = "none"; });
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.hidden = false; el.style.display = "block"; }
    });
    (Array.isArray(state.nested) ? state.nested : []).forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.hidden = false; el.style.display = "block"; }
    });
    document.querySelectorAll("#bottom-navigation .active").forEach(el => el.classList.remove("active"));
    if (state.navId) document.getElementById(state.navId)?.classList.add("active");
    if (Number.isFinite(state.scrollY)) window.scrollTo(0, state.scrollY);
    window.dispatchEvent(new CustomEvent("act-workspace-restored", { detail: { maintenanceSection: state.maintenanceSection || "" } }));
  }
  let restorePending = false;
  const queueRestore = () => {
    if (restorePending) return;
    restorePending = true;
    setTimeout(() => { restorePending = false; restore(); }, 700);
  };
  document.addEventListener("click", () => setTimeout(snapshot, 250), true);
  document.addEventListener("input", () => setTimeout(snapshot, 500), true);
  window.addEventListener("pagehide", snapshot);
  window.addEventListener("beforeunload", snapshot);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") snapshot();
    else queueRestore();
  });
  window.addEventListener("pageshow", queueRestore);
  const main = document.getElementById("main-page");
  if (main) new MutationObserver(queueRestore).observe(main, { attributes: true, attributeFilter: ["style","class"] });
  setInterval(snapshot, 2500);
})();
