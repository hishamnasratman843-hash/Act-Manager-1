import { getApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const trialBanner = $("act-trial-banner"), welcome = $("act-welcome-backdrop"), paywall = $("act-subscription-backdrop"), form = $("act-subscription-form");
  if (!trialBanner || !welcome || !paywall || !form) return;
  let user = null, locked = false, currentStatus = null, polling = null;
  const apiBase = () => String(window.ACT_CONTROL_API_URL || "").replace(/\/$/, "");
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  async function api(path, method = "GET", payload) {
    if (!user || !apiBase()) throw new Error("تعذر الاتصال بخدمة الاشتراك. تحقق من اتصال الإنترنت.");
    const token = await user.getIdToken();
    const response = await fetch(apiBase() + path, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: method === "GET" ? undefined : JSON.stringify(payload || {}), cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `تعذر تنفيذ الطلب (${response.status})`);
    return data;
  }
  function openPaywall(force = false) {
    locked = force || locked;
    paywall.hidden = false;
    $("act-subscription-close").hidden = locked;
    $("act-subscription-recheck").hidden = true;
    refreshStatus().catch(e => setStatus(e.message));
  }
  function closePaywall() { if (!locked) paywall.hidden = true; }
  function setStatus(text) { $("act-subscription-status").textContent = text || ""; }
  function remainingDays(end) { return Math.max(0, Math.ceil((Number(end || 0) - Date.now()) / 86400000)); }
  async function refreshStatus() {
    if (!user) return;
    const data = await api("/api/subscription/status"); currentStatus = data;
    const req = data.latestRequest;
    if (data.status === "active" && Number(data.subscriptionEndAt) > Date.now()) {
      trialBanner.hidden = true;
      setStatus("اشتراكك السنوي مفعل حتى " + new Date(data.subscriptionEndAt).toLocaleDateString("ar-EG") + ".");
      form.hidden = true; $("act-subscription-close").hidden = locked; $("act-subscription-recheck").hidden = false;
      return;
    }
    if (req?.status === "pending") {
      form.hidden = true; setStatus("طلبك قيد المراجعة. سيتم تفعيل الاشتراك بعد تأكيد التحويل من الإدارة. رقم الطلب: " + req.id);
    } else {
      form.hidden = false;
      setStatus(req?.status === "rejected" ? (req.reviewNote || "لم يتم قبول الطلب. راجع بيانات التحويل وأرسل طلبًا جديدًا.") : "بعد التحويل، أدخل رقم المحوِّل ورقم العملية لإرسال الطلب.");
    }
  }
  function handleControlSession(session) {
    if (!session || session.owner) return;
    locked = session.allowed === false && session.status === "expired";
    if (locked) { trialBanner.hidden = true; welcome.hidden = true; openPaywall(true); return; }
    if (session.status === "trial") {
      trialBanner.hidden = false;
      $("act-trial-banner-text").textContent = `التجربة المجانية: متبقي ${remainingDays(session.expiresAt)} يوم`;
    } else trialBanner.hidden = true;
    if (session.showWelcome && session.status === "trial") welcome.hidden = false;
    refreshStatus().catch(() => {});
  }
  async function closeWelcome() {
    welcome.hidden = true;
    try { await api("/api/welcome/seen", "POST", {}); } catch (_) {}
  }
  $("act-open-subscription")?.addEventListener("click", () => openPaywall(false));
  $("act-welcome-start")?.addEventListener("click", closeWelcome);
  $("act-welcome-subscribe")?.addEventListener("click", async () => { await closeWelcome(); openPaywall(false); });
  $("act-subscription-close")?.addEventListener("click", closePaywall);
  $("act-copy-vodafone")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("01005740337"); $("act-copy-vodafone").textContent = "تم النسخ"; }
    catch (_) { setStatus("انسخ الرقم يدويًا: 01005740337"); }
  });
  $("act-subscription-recheck")?.addEventListener("click", () => location.reload());
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const button = $("act-subscription-submit");
    const payerPhone = $("act-payer-phone").value.trim(), reference = $("act-payment-reference").value.trim();
    button.disabled = true; setStatus("جارٍ إرسال طلب الاشتراك...");
    try {
      const result = await api("/api/subscription/request", "POST", { payerPhone, reference });
      setStatus(result.message || "تم إرسال طلبك للمراجعة."); await refreshStatus();
    } catch (error) { setStatus(error.message); }
    finally { button.disabled = false; }
  });
  try {
    const auth = getAuth(getApp());
    onAuthStateChanged(auth, async current => {
      user = current;
      if (!user) { trialBanner.hidden = true; welcome.hidden = true; if (!locked) paywall.hidden = true; if (polling) clearInterval(polling); return; }
      if (window.ACT_CONTROL_SESSION) handleControlSession(window.ACT_CONTROL_SESSION);
      if (polling) clearInterval(polling);
      polling = setInterval(() => { if (document.visibilityState === "visible") refreshStatus().catch(() => {}); }, 30000);
    });
  } catch (_) {}
  window.addEventListener("act:control-ready", event => handleControlSession(event.detail));
})();
