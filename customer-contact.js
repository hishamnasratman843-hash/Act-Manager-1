import { getApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const root = $("act-owner-contact-root");
  const arrow = $("act-owner-contact-toggle");
  const launcher = $("act-owner-contact-launch");
  const backdrop = $("act-owner-contact-backdrop");
  const panel = $("act-owner-contact-panel");
  const form = $("act-owner-contact-form");
  if (!root || !arrow || !launcher || !backdrop || !panel || !form) return;

  let currentUser = null, authReady = false;
  const status = text => { $("act-owner-contact-status").textContent = text; };
  const closeDialog = () => { backdrop.hidden = true; document.body.classList.remove("act-contact-modal-open"); };
  const hideLauncher = () => { launcher.hidden = true; arrow.setAttribute("aria-expanded", "false"); };
  const openDialog = () => { backdrop.hidden = false; document.body.classList.add("act-contact-modal-open"); setTimeout(() => $("act-owner-contact-subject")?.focus(), 0); };

  arrow.addEventListener("click", () => {
    const show = launcher.hidden;
    launcher.hidden = !show;
    arrow.setAttribute("aria-expanded", String(show));
    arrow.innerHTML = show ? '<span aria-hidden="true">❯</span>' : '<span aria-hidden="true">❮</span>';
  });
  launcher.addEventListener("click", openDialog);
  $("act-owner-contact-close")?.addEventListener("click", closeDialog);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closeDialog(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeDialog(); hideLauncher(); } });


  async function loadMyReplies() {
    if (!currentUser || !authReady) return;
    const target = $("act-support-replies");
    if (!target) return;
    try {
      const token = await currentUser.getIdToken();
      const base = String(window.ACT_CONTROL_API_URL || "").replace(/\/$/, "");
      const response = await fetch(base + "/api/support", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
      const rows = await response.json().catch(() => []);
      if (!response.ok) throw new Error(rows.error || "تعذر تحميل الرسائل الخاصة.");
      target.innerHTML = Array.isArray(rows) && rows.length ? rows.map(r => `<article class="act-customer-reply"><b>${escapeHtml(r.subject || "رسالة دعم")}</b><small>${new Date(Number(r.createdAt || Date.now())).toLocaleString("ar-EG")} · ${{new:"جديد","in-progress":"قيد المتابعة",answered:"تم الرد",closed:"مغلق"}[r.status] || ""}</small><p><strong>رسالتك:</strong> ${escapeHtml(r.message || "")}</p>${r.ownerReply ? `<div><strong>رد الإدارة:</strong><p>${escapeHtml(r.ownerReply)}</p></div>` : `<p class="act-reply-waiting">رسالتك قيد المراجعة، وسيظهر رد الإدارة هنا فور إرساله.</p>`}</article>`).join("") : "<p>لا توجد رسائل خاصة حتى الآن.</p>";
      const unread = rows.filter(r => r.ownerReply && !r.customerReplySeen).length;
      if (unread) status(`لديك ${unread} رد جديد من إدارة ACT.`);
    } catch (error) { target.innerHTML = `<p>${escapeHtml(error.message)}</p>`; }
  }
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c]));

  try {
    const auth = getAuth(getApp());
    onAuthStateChanged(auth, user => { currentUser = user; authReady = true; if (user) loadMyReplies(); });
  } catch (error) { status("تعذر تهيئة تسجيل الدخول. أعد تحميل البرنامج."); }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const send = $("act-owner-contact-send");
    const subject = $("act-owner-contact-subject").value.trim();
    const message = $("act-owner-contact-message").value.trim();
    const type = $("act-owner-contact-kind").value;
    if (!authReady || !currentUser) { status("سجّل الدخول إلى ACT أولًا ثم أرسل رسالتك."); return; }
    if (!subject || !message) { status("اكتب عنوان الرسالة وتفاصيلها أولًا."); return; }
    const apiBase = String(window.ACT_CONTROL_API_URL || "").replace(/\/$/, "");
    if (!apiBase) { status("خدمة التواصل غير مهيأة حاليًا."); return; }
    send.disabled = true; status("جارٍ إرسال رسالتك بشكل خاص...");
    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(apiBase + "/api/support", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", type, subject, message }), cache: "no-store"
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || `تعذر إرسال الرسالة (${response.status})`);
      form.reset();
      status(data.autoReply || "تم استلام رسالتك بنجاح.");
      await loadMyReplies();
    } catch (error) { status(error.message || "حدث خطأ أثناء إرسال الرسالة."); }
    finally { send.disabled = false; }
  });

  // Refresh only the signed-in customer's private conversation while the panel is open.
  setInterval(() => {
    if (document.visibilityState === "visible" && currentUser && !backdrop.hidden) loadMyReplies();
  }, 4000);
})();
