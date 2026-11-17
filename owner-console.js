import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

(() => {
  "use strict";
  const OWNER_EMAIL = "hishamnasratman843@gmail.com";
  const firebaseConfig = { apiKey:"AIzaSyCbailKYigVmcbqZHhi3kbvR2FvT1Q2JDw", authDomain:"act-phone-manager.firebaseapp.com", projectId:"act-phone-manager", storageBucket:"act-phone-manager.firebasestorage.app", messagingSenderId:"277621100210", appId:"1:277621100210:web:0676faca9d539631a243ab", measurementId:"G-R8MVR935PL" };
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig), auth = getAuth(app);
  const $ = id => document.getElementById(id);
  let currentUser = null, isOwner = false, customers = [], supportTickets = [], selectedUid = "", activeView = "subscriptions", refreshBusy = false;
  const apiBase = () => String(window.ACT_CONTROL_API_URL || "").replace(/\/$/, "");
  const escapeHtml = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const date = value => { if (!value) return "—"; const n = Number(value); const d = new Date(n || value); return Number.isNaN(d.getTime()) ? "—" : d.toLocaleString("ar-EG"); };
  const days = value => Math.max(0, Math.ceil((Number(value || 0) - Date.now()) / 86400000));
  const statusLabel = r => {
    if (r.status === "active" && Number(r.subscriptionEndAt) > Date.now()) return "مشترك";
    if (r.status === "trial" && Number(r.trialEndAt) > Date.now()) return "تجريبي";
    if (r.status === "suspended") return "موقوف";
    if (r.status === "banned" || r.disabled) return "محظور";
    return "منتهي";
  };
  function message(text) { const node = $("act-owner-message"); if (node) node.textContent = text; }
  function deviceIcon(device) {
    const os = String(device?.os || device?.platform || "").toLowerCase();
    if (os.includes("android")) return "🤖";
    if (os.includes("ios") || os.includes("iphone")) return "📱";
    if (os.includes("ipad")) return "▣";
    if (os.includes("mac")) return "";
    if (os.includes("windows")) return "🖥️";
    if (os.includes("chromeos")) return "💻";
    return "💻";
  }
  async function deleteCustomer(uid, email) {
    const typed = prompt(`حذف نهائي لحساب العميل وبياناته المرتبطة في ACT وFirebase، حتى لو كان اشتراكه المدفوع ساريًا.\nلا يمكن التراجع عن هذه العملية.\n\nاكتب UID التالي للتأكيد:\n${uid}`);
    if (typed === null) return;
    if (typed.trim() !== uid) { message("لم يتم الحذف: معرّف التأكيد غير مطابق."); return; }
    if (!confirm(`تأكيد أخير: حذف الحساب ${email || uid} نهائيًا، بما في ذلك الاشتراك الحالي؟`)) return;
    try {
      await api("/api/owner/delete-customer", "POST", { uid, confirmUid: typed.trim() });
      if (selectedUid === uid) { selectedUid = ""; $("owner-customer-detail").hidden = true; }
      await Promise.all([loadCustomers(), loadSupport()]);
      message(`تم حذف حساب العميل ${email || uid} وبيانات ACT التابعة له.`);
    } catch (e) { message(`تعذر حذف الحساب: ${e.message}`); }
  }
  async function api(path, method = "GET", payload) {
    if (!apiBase() || apiBase().includes("REPLACE-WITH-YOUR-WORKER")) throw new Error("رابط خدمة ACT Control غير مضبوط داخل act-control-config.js.");
    if (!currentUser) throw new Error("انتهت الجلسة. سجّل الدخول مرة أخرى.");
    const token = await currentUser.getIdToken();
    const response = await fetch(apiBase() + path, { method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: method === "GET" ? undefined : JSON.stringify(payload || {}), cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `فشل الطلب (${response.status})`);
    return data;
  }
  function showView(view) {
    activeView = view === "messages" ? "messages" : "subscriptions";
    document.querySelectorAll("[data-owner-view]").forEach(button => button.setAttribute("aria-selected", String(button.dataset.ownerView === activeView)));
    $("owner-view-subscriptions").hidden = activeView !== "subscriptions";
    $("owner-view-messages").hidden = activeView !== "messages";
    if (activeView === "messages") loadSupport(); else renderSubscriptionQueue();
  }
  function renderStats() {
    const active = customers.filter(r => statusLabel(r) === "مشترك").length;
    const trial = customers.filter(r => statusLabel(r) === "تجريبي").length;
    const deviceCount = customers.reduce((n,r) => n + Number(r.devices || r.activeDeviceCount || 0), 0);
    const pending = customers.filter(r => r.subscriptionRequest?.status === "pending").length;
    const unread = supportTickets.filter(t => ["new","in-progress"].includes(t.status)).length;
    $("owner-stat-users").textContent = customers.length;
    $("owner-stat-subs").textContent = active;
    $("owner-stat-trials").textContent = trial;
    $("owner-stat-devices").textContent = deviceCount;
    $("owner-pending-count").textContent = pending;
    $("owner-message-count").textContent = unread;
  }
  function renderSubscriptionQueue() {
    const target = $("owner-subscription-queue"); if (!target) return;
    const rows = customers.filter(r => r.subscriptionRequest?.status === "pending").sort((a,b) => Number(b.subscriptionRequest.createdAt || 0) - Number(a.subscriptionRequest.createdAt || 0));
    target.innerHTML = rows.map(r => {
      const q = r.subscriptionRequest;
      return `<article class="owner-request-card"><div class="owner-request-head"><div class="owner-person"><strong>${escapeHtml(r.displayName || "عميل ACT")}</strong><span>${escapeHtml(r.email || "بدون بريد")}</span><small>UID: ${escapeHtml(r.uid)}</small></div><span class="owner-pill pending">طلب جديد · قيد المراجعة</span></div><div class="owner-request-meta"><span>رقم التحويل: <b>${escapeHtml(q.transferReference || "—")}</b></span><span>القيمة: ${Number(q.amount || 300).toLocaleString("ar-EG")} جنيه</span><span>المدة: ${Number(q.durationDays || 365)} يوم</span><span>الوسيلة: ${escapeHtml(q.method || "Vodafone Cash")}</span><span>تاريخ الطلب: ${date(q.createdAt)}</span></div><div class="owner-request-actions"><button type="button" data-open-customer="${escapeHtml(r.uid)}">فتح ملف العميل ومراجعة الإيصال</button><button type="button" class="owner-danger" data-quick-reject="${escapeHtml(r.uid)}">رفض الطلب</button></div></article>`;
    }).join("") || '<div class="owner-empty">لا توجد طلبات اشتراك قيد المراجعة حاليًا. الطلبات المعتمدة أو المرفوضة تختفي من هذه القائمة وتظل محفوظة داخل ملف العميل.</div>';
  }
  function renderCustomers() {
    const term = String($("owner-customer-search")?.value || "").trim().toLowerCase();
    const filter = $("owner-customer-filter")?.value || "all";
    const rows = customers.filter(r => {
      const state = statusLabel(r);
      const statusMatch = filter === "all" || (filter === "active" && state === "مشترك") || (filter === "trial" && state === "تجريبي") || (filter === "expired" && state === "منتهي") || (filter === "suspended" && state === "موقوف") || (filter === "banned" && state === "محظور");
      return statusMatch && [r.email,r.displayName,r.uid].some(v => String(v || "").toLowerCase().includes(term));
    });
    $("owner-customers-list").innerHTML = rows.map(r => {
      const end = r.status === "active" ? r.subscriptionEndAt : r.trialEndAt;
      const dev = r.latestDevice;
      const deviceLine = dev ? `${deviceIcon(dev)} ${escapeHtml(dev.deviceType || dev.os || "جهاز")} · ${escapeHtml(dev.os || "")} · ${escapeHtml(dev.model || "الموديل غير متاح")}` : "لم يسجل جهازًا بعد";
      return `<article class="owner-customer-card"><div class="owner-customer-head"><div class="owner-person"><strong>${escapeHtml(r.displayName || "عميل ACT")}</strong><span>${escapeHtml(r.email || "بدون بريد")}</span><small>UID: ${escapeHtml(r.uid)}</small></div><span class="owner-pill ${stateClass(statusLabel(r))}">${statusLabel(r)}</span></div><div class="owner-customer-meta"><span>المتبقي: ${days(end)} يوم</span><span>الأجهزة: ${Number(r.devices || 0)} / ${Number(r.allowedDevices || 1)}</span><span>التسجيل: ${date(r.authCreatedAt || r.createdAt)}</span><span>طريقة الدخول: ${escapeHtml((r.loginMethods || []).join("، ") || "غير محددة")}</span><span>آخر دخول: ${date(r.lastLoginAt || r.lastSeenAt)}</span><span class="owner-device-line">آخر جهاز: ${deviceLine}</span>${dev ? `<span>المتصفح: ${escapeHtml(dev.browser || "غير معروف")} · آخر نشاط جهاز: ${date(dev.lastSeenAt)}</span>` : ""}${r.subscriptionRequest?.status === "pending" ? '<span class="owner-unread">● لديه طلب اشتراك جديد</span>' : ""}</div><div class="owner-request-actions"><button type="button" data-open-customer="${escapeHtml(r.uid)}">فتح الملف الكامل</button><button type="button" class="owner-delete-icon" data-delete-customer="${escapeHtml(r.uid)}" data-customer-email="${escapeHtml(r.email || "")}" title="حذف الحساب نهائيًا" aria-label="حذف الحساب نهائيًا">🗑</button></div></article>`;
    }).join("") || '<div class="owner-empty">لا توجد حسابات مطابقة لعملية البحث.</div>';
  }
  function stateClass(state) { return state === "مشترك" ? "active" : state === "تجريبي" ? "" : "pending"; }
  async function loadCustomers() {
    if (!isOwner) return;
    try {
      const result = await api("/api/owner/customers");
      customers = Array.isArray(result.customers) ? result.customers : [];
      renderStats(); renderSubscriptionQueue(); renderCustomers();
    } catch (e) {
      $("owner-subscription-queue").innerHTML = `<div class="owner-empty act-owner-error">${escapeHtml(e.message)}</div>`;
      $("owner-customers-list").innerHTML = `<div class="owner-empty act-owner-error">${escapeHtml(e.message)}</div>`;
    }
  }
  function renderMessages() {
    const target = $("owner-support-list"); if (!target) return;
    const term = String($("owner-message-search")?.value || "").trim().toLowerCase();
    const groups = new Map();
    supportTickets.forEach(ticket => {
      const uid = String(ticket.customerUid || ("prelogin:" + String(ticket.email || "unknown").toLowerCase()));
      if (!groups.has(uid)) groups.set(uid, []);
      groups.get(uid).push(ticket);
    });
    const groupRows = [...groups.entries()].map(([uid,tickets]) => {
      tickets.sort((a,b) => Number(b.updatedAt || b.createdAt || 0) - Number(a.updatedAt || a.createdAt || 0));
      const first = tickets[0];
      const customer = customers.find(c => c.uid === uid) || {};
      return { uid, tickets, customer, first };
    }).filter(g => [g.customer.displayName,g.customer.email,g.uid,...g.tickets.map(t=>t.subject),...g.tickets.map(t=>t.message)].some(v => String(v || "").toLowerCase().includes(term))).sort((a,b)=>Number(b.first.updatedAt || b.first.createdAt || 0)-Number(a.first.updatedAt || a.first.createdAt || 0));
    target.innerHTML = groupRows.map(g => {
      const openCount = g.tickets.filter(t => ["new","in-progress"].includes(t.status)).length;
      const ticketHtml = g.tickets.map(t => `<article class="owner-message-item"><div class="owner-thread-head"><div><strong>${escapeHtml(t.subject || "رسالة دعم")}</strong><small> ${date(t.createdAt)} · ${escapeHtml(t.type || "دعم")}</small></div><span class="owner-pill ${t.status === "answered" || t.status === "closed" ? "active" : "pending"}">${({new:"جديد", "in-progress":"قيد المتابعة", answered:"تم الرد", closed:"مغلق"})[t.status] || "غير محدد"}</span></div><p>${escapeHtml(t.message || "")}</p>${t.ownerReply ? `<div class="owner-message-reply"><b>آخر رد من الإدارة</b><p>${escapeHtml(t.ownerReply)}</p></div>` : ""}<label>الرد على هذه الرسالة<textarea data-ticket-reply="${escapeHtml(t.id)}" rows="3" placeholder="اكتب ردًا خاصًا بهذا العميل...">${escapeHtml(t.ownerReply || "")}</textarea></label><div class="owner-message-actions"><button type="button" data-ticket-send="${escapeHtml(t.id)}">إرسال الرد</button><select data-ticket-status="${escapeHtml(t.id)}"><option value="new" ${t.status==="new"?"selected":""}>جديد</option><option value="in-progress" ${t.status==="in-progress"?"selected":""}>قيد المتابعة</option><option value="answered" ${t.status==="answered"?"selected":""}>تم الرد</option><option value="closed" ${t.status==="closed"?"selected":""}>مغلق</option></select><button type="button" data-ticket-update="${escapeHtml(t.id)}">حفظ الحالة</button></div></article>`).join("");
      return `<article class="owner-thread-card"><div class="owner-thread-head"><div class="owner-person"><strong>${escapeHtml(g.customer.displayName || g.first.displayName || "عميل ACT")}</strong><span>${escapeHtml(g.customer.email || g.first.email || "بدون بريد")}</span><small>${g.uid.startsWith("prelogin:") ? "طلب قبل تسجيل الدخول" : "UID: " + escapeHtml(g.uid)} · ${g.tickets.length} رسالة</small></div><div class="owner-request-actions">${openCount ? `<span class="owner-pill pending">${openCount} تحتاج متابعة</span>` : '<span class="owner-pill active">لا توجد رسائل معلقة</span>'}${g.uid.startsWith("prelogin:") ? "" : `<button type="button" data-open-customer="${escapeHtml(g.uid)}">ملف العميل</button>`}</div></div><div class="owner-thread-messages">${ticketHtml}</div></article>`;
    }).join("") || '<div class="owner-empty">لا توجد رسائل تطابق البحث.</div>';
  }
  async function loadSupport() {
    if (!isOwner) return;
    // Do not replace a reply/status field while the owner is actively editing it.
    if ($("owner-support-list")?.contains(document.activeElement)) return;
    try {
      const result = await api("/api/support");
      supportTickets = Array.isArray(result) ? result : [];
      renderStats(); renderMessages();
    } catch (e) { $("owner-support-list").innerHTML = `<div class="owner-empty act-owner-error">${escapeHtml(e.message)}</div>`; }
  }
  async function openCustomer(uid) {
    if (!isOwner || !uid) return;
    selectedUid = uid;
    const panel = $("owner-customer-detail"); panel.hidden = false;
    panel.scrollIntoView({ behavior:"smooth", block:"start" });
    $("owner-detail-summary").innerHTML = '<div class="owner-empty">جارٍ تحميل بيانات هذا العميل فقط...</div>';
    try {
      const d = await api("/api/owner/customer?uid=" + encodeURIComponent(uid));
      if (selectedUid !== uid) return;
      const r = d.record || {}, authInfo = d.auth || {};
      $("owner-detail-title").textContent = r.displayName || "عميل ACT";
      $("owner-detail-email").textContent = `${r.email || "بدون بريد"} · UID: ${uid}`;
      $("owner-detail-device-limit").value = String(r.allowedDevices || 1);
      $("owner-detail-days").value = "365";
      $("owner-detail-amount").value = "300";
      $("owner-detail-method").value = "transfer";
      $("owner-detail-payment-note").value = "";
      $("owner-detail-notes").value = r.notes || "";
      $("owner-detail-warning").value = "";
      const summary = [
        ["الحالة",statusLabel(r)],["تاريخ إنشاء الحساب",date(authInfo.createdAt || r.authCreatedAt || r.createdAt)],["آخر تسجيل دخول",date(authInfo.lastLoginAt || r.lastSeenAt)],["وسيلة الدخول",(authInfo.providers || []).join("، ") || "غير محدد"],["هاتف الحساب",authInfo.phoneNumber || "غير مسجل"],["الخطة",r.plan || "—"],["بداية التجربة",date(r.trialStartAt)],["نهاية التجربة",date(r.trialEndAt)],["بداية الاشتراك",date(r.subscriptionStartAt)],["نهاية الاشتراك",date(r.subscriptionEndAt)],["الأيام المتبقية",days(r.status === "active" ? r.subscriptionEndAt : r.trialEndAt)],["الأجهزة النشطة",`${(d.devices||[]).filter(x=>x.status==="active").length} / ${r.allowedDevices || 1}`],["آخر جهاز مستخدم",(d.devices||[]).slice().sort((a,b)=>Number(b.lastSeenAt||0)-Number(a.lastSeenAt||0))[0]?.deviceType || "غير مسجل"],["نظام التشغيل",(d.devices||[]).slice().sort((a,b)=>Number(b.lastSeenAt||0)-Number(a.lastSeenAt||0))[0]?.os || "غير معروف"],["موديل الجهاز",(d.devices||[]).slice().sort((a,b)=>Number(b.lastSeenAt||0)-Number(a.lastSeenAt||0))[0]?.model || "غير متاح"],["آخر نشاط",date(r.lastSeenAt)],["حساب Firebase",(authInfo.disabled || r.disabled) ? "معطل" : "نشط"]
      ];
      $("owner-detail-summary").innerHTML = summary.map(([k,v])=>`<article><small>${escapeHtml(k)}</small><strong>${escapeHtml(v)}</strong></article>`).join("");
      $("owner-detail-devices").innerHTML = (d.devices || []).map(x => `<article class="act-owner-ticket"><strong>${deviceIcon(x)} ${escapeHtml(x.deviceType || x.label || "جهاز")}</strong><small>النظام: ${escapeHtml(x.os || x.platform || "غير معروف")} · المتصفح: ${escapeHtml(x.browser || "غير معروف")}</small><small>الموديل: ${escapeHtml(x.model || "الموديل غير متاح من المتصفح")}</small><small>${escapeHtml(x.status || "")} · أول استخدام: ${date(x.firstSeenAt)} · آخر نشاط: ${date(x.lastSeenAt)}</small><small>${escapeHtml(x.userAgent || "")}</small><p>معرّف التثبيت: ${escapeHtml(x.deviceId || x.id)}</p>${x.status === "active" ? `<button type="button" data-revoke-device="${escapeHtml(x.deviceId || x.id)}">إخراج هذا الجهاز</button>` : "<small>غير نشط</small>"}</article>`).join("") || '<div class="owner-empty">لا توجد أجهزة مسجلة لهذا العميل.</div>';

      const q = d.subscriptionRequest;
      $("owner-detail-subscription-request").innerHTML = q ? `<article class="act-owner-ticket"><strong>حالة الطلب: ${escapeHtml(({pending:"قيد المراجعة",approved:"تمت الموافقة",rejected:"مرفوض"})[q.status] || q.status || "غير محدد")}</strong><small>تاريخ الطلب: ${date(q.createdAt)} · المبلغ: ${Number(q.amount || 300)} جنيه · المدة: ${Number(q.durationDays || 365)} يوم</small><p>رقم التحويل: <b>${escapeHtml(q.transferReference || "—")}</b></p>${q.receiptDataUrl ? `<a href="${escapeHtml(q.receiptDataUrl)}" target="_blank" rel="noopener">فتح صورة إيصال التحويل</a><img class="owner-receipt" src="${escapeHtml(q.receiptDataUrl)}" alt="إيصال تحويل العميل" loading="lazy">` : '<small>لا توجد صورة إيصال مرفقة.</small>'}${q.rejectionReason ? `<p>سبب الرفض: ${escapeHtml(q.rejectionReason)}</p>` : ""}${q.status === "pending" ? `<div class="owner-request-actions"><button type="button" data-approve-subscription="${escapeHtml(uid)}">موافقة وتفعيل سنة لهذا العميل</button><button type="button" class="owner-danger" data-reject-subscription="${escapeHtml(uid)}">رفض الطلب</button></div>` : ""}</article>` : '<div class="owner-empty">لا يوجد طلب اشتراك مسجل لهذا العميل.</div>';
      $("owner-detail-payments").innerHTML = (r.paymentHistory || []).slice().reverse().map(p => `<article class="act-owner-ticket"><strong>${Number(p.amount||0).toLocaleString("ar-EG")} جنيه · ${escapeHtml(p.method || "")}</strong><small>${date(p.createdAt)} · ${Number(p.days||0)} يوم</small><p>${escapeHtml(p.note || "")}</p></article>`).join("") || '<div class="owner-empty">لا توجد مدفوعات مسجلة لهذا العميل.</div>';
      const ownTickets = supportTickets.filter(t => t.customerUid === uid);
      $("owner-detail-support").innerHTML = ownTickets.map(t => `<article class="act-owner-ticket"><strong>${escapeHtml(t.subject || "طلب دعم")}</strong><small>${date(t.createdAt)} · ${escapeHtml(t.status || "new")}</small><p>${escapeHtml(t.message || "")}</p><p><b>رد الإدارة:</b> ${escapeHtml(t.ownerReply || "لم يتم الرد")}</p></article>`).join("") || '<div class="owner-empty">لا توجد رسائل لهذا العميل.</div>';
      $("owner-detail-audit").innerHTML = (d.audit || []).map(a => `<article class="act-owner-ticket"><strong>${escapeHtml(a.action || "إجراء")}</strong><small>${date(a.createdAt)} · ${escapeHtml(a.actorEmail || "")}</small><p>${escapeHtml(JSON.stringify(a.details || {}))}</p></article>`).join("") || '<div class="owner-empty">لا يوجد سجل سابق لهذا العميل.</div>';
    } catch (e) { $("owner-detail-summary").innerHTML = `<div class="owner-empty act-owner-error">${escapeHtml(e.message)}</div>`; }
  }
  async function ownerAction(action, extra = {}) {
    if (!selectedUid) return false;
    const uid = selectedUid;
    try {
      await api("/api/owner/action", "POST", { uid, action, ...extra });
      message("تم تنفيذ العملية على حساب العميل المحدد فقط، وتم تسجيلها في سجل الإدارة.");
      await Promise.all([loadCustomers(), loadSupport()]);
      await openCustomer(uid);
      return true;
    } catch (e) { message(e.message); return false; }
  }
  async function approveRequest(uid) {
    if (!confirm("تأكيد مراجعة رقم التحويل والإيصال؟ سيتم تفعيل اشتراك سنوي لهذا العميل وحده بقيمة 300 جنيه.")) return;
    selectedUid = uid;
    const done = await ownerAction("approveSubscriptionRequest");
    if (done) { message("تم اعتماد طلب هذا العميل وتفعيل حسابه لمدة 365 يومًا. بقية العملاء لم تتغير اشتراكاتهم."); renderSubscriptionQueue(); }
  }
  async function rejectRequest(uid) {
    const reason = prompt("اكتب سبب رفض الطلب ليظهر لهذا العميل فقط:", "تعذر تأكيد التحويل. راجع رقم العملية وصورة الإيصال.");
    if (reason === null) return;
    selectedUid = uid;
    const done = await ownerAction("rejectSubscriptionRequest", { reason });
    if (done) { message("تم رفض طلب العميل المحدد وإزالته من قائمة الطلبات المعلقة."); renderSubscriptionQueue(); }
  }

  document.querySelectorAll("[data-owner-view]").forEach(button => button.addEventListener("click", () => showView(button.dataset.ownerView)));
  $("owner-refresh")?.addEventListener("click", async () => { if (refreshBusy) return; refreshBusy = true; try { await Promise.all([loadCustomers(),loadSupport()]); message("تم تحديث بيانات لوحة المالك."); } finally { refreshBusy = false; } });
  $("owner-subscriptions-refresh")?.addEventListener("click", loadCustomers);
  $("owner-messages-refresh")?.addEventListener("click", loadSupport);
  $("owner-customer-search")?.addEventListener("input", renderCustomers);
  $("owner-customer-filter")?.addEventListener("change", renderCustomers);
  $("owner-message-search")?.addEventListener("input", renderMessages);
  document.addEventListener("click", e => {
    const open = e.target.closest("[data-open-customer]"); if (open) openCustomer(open.dataset.openCustomer);
    const del = e.target.closest("[data-delete-customer]"); if (del) { e.preventDefault(); deleteCustomer(del.dataset.deleteCustomer, del.dataset.customerEmail || ""); }
    const quickReject = e.target.closest("[data-quick-reject]"); if (quickReject) rejectRequest(quickReject.dataset.quickReject);
  });
  $("owner-detail-close")?.addEventListener("click", () => { $("owner-customer-detail").hidden = true; selectedUid = ""; });
  $("owner-fix-issue-code")?.addEventListener("click", async () => {
    const target = $("owner-fix-code-result"), deviceId = String($("owner-fix-device-id")?.value || "").trim().toUpperCase();
    if (!selectedUid) { if (target) target.textContent = "افتح ملف العميل أولًا."; return; }
    if (!/^FIX-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(deviceId)) { if (target) target.textContent = "أدخل معرّف FIX صحيحًا."; return; }
    try { const result = await api("/api/owner/fix/issue", "POST", { uid:selectedUid, deviceId }); if (target) target.textContent = `كود التفعيل: ${result.code} · صالح لمدة 20 دقيقة · أرسله لصاحب الجهاز فقط.`; }
    catch (error) { if (target) target.textContent = `تعذر إصدار الكود: ${error.message}`; }
  });
  $("owner-action-device-limit")?.addEventListener("click", () => ownerAction("setDeviceLimit", { value:Number($("owner-detail-device-limit").value) }));
  $("owner-action-activate")?.addEventListener("click", () => ownerAction("activate", { days:Number($("owner-detail-days").value), amount:Number($("owner-detail-amount").value), method:$("owner-detail-method").value, note:$("owner-detail-payment-note").value }));
  $("owner-action-delete-account")?.addEventListener("click", () => { if (selectedUid) deleteCustomer(selectedUid, $("owner-detail-email").textContent || ""); });
  $("owner-action-suspend")?.addEventListener("click", () => { const reason = prompt("سبب إيقاف هذا الحساب (اختياري):") || "إيقاف بواسطة الإدارة"; ownerAction("suspend", { reason }); });
  $("owner-action-unsuspend")?.addEventListener("click", () => ownerAction("unsuspend"));
  $("owner-action-ban")?.addEventListener("click", () => { if (confirm("سيتم تعطيل حساب Firebase لهذا العميل فقط. هل تريد المتابعة؟")) ownerAction("ban", { reason:"حظر بواسطة مالك ACT" }); });
  $("owner-action-unban")?.addEventListener("click", () => { if (confirm("إعادة تفعيل حساب هذا العميل فقط؟")) ownerAction("unban"); });
  $("owner-action-warn")?.addEventListener("click", () => ownerAction("warn", { message:$("owner-detail-warning").value }));
  $("owner-action-clear-warning")?.addEventListener("click", () => ownerAction("clearWarning"));
  $("owner-action-save-notes")?.addEventListener("click", () => ownerAction("note", { value:$("owner-detail-notes").value }));
  $("owner-detail-devices")?.addEventListener("click", e => { const b=e.target.closest("[data-revoke-device]"); if (b && confirm("إخراج هذا الجهاز من حساب العميل المحدد؟")) ownerAction("revokeDevice", { deviceId:b.dataset.revokeDevice }); });
  $("owner-detail-subscription-request")?.addEventListener("click", e => {
    const approve = e.target.closest("[data-approve-subscription]");
    const reject = e.target.closest("[data-reject-subscription]");
    if (approve) approveRequest(approve.dataset.approveSubscription);
    if (reject) rejectRequest(reject.dataset.rejectSubscription);
  });
  $("owner-support-list")?.addEventListener("click", async e => {
    const send = e.target.closest("[data-ticket-send]"), update = e.target.closest("[data-ticket-update]");
    try {
      if (send) {
        const id = send.dataset.ticketSend;
        const reply = document.querySelector(`[data-ticket-reply="${CSS.escape(id)}"]`)?.value || "";
        send.disabled = true;
        await api("/api/support", "POST", { action:"reply", id, reply });
        message("تم إرسال الرد داخل محادثة العميل صاحب الرسالة فقط.");
        await loadSupport();
        if (selectedUid) await openCustomer(selectedUid);
      }
      if (update) {
        const id = update.dataset.ticketUpdate;
        const status = document.querySelector(`[data-ticket-status="${CSS.escape(id)}"]`)?.value || "new";
        await api("/api/support", "POST", { action:"status", id, status });
        message("تم تحديث حالة الرسالة."); await loadSupport();
      }
    } catch (err) { message(err.message); if (send) send.disabled = false; }
  });

  const ownerLoginForm = $("owner-login-form");
  ownerLoginForm?.addEventListener("submit", async event => {
    event.preventDefault();
    const email = String($("owner-login-email")?.value || "").trim();
    const password = String($("owner-login-password")?.value || "");
    const button = $("owner-login-submit"), errorBox = $("owner-login-error");
    if (errorBox) errorBox.textContent = "";
    if (button) { button.disabled = true; button.textContent = "جارٍ التحقق..."; }
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      if (String(credential.user.email || "").trim().toLowerCase() !== OWNER_EMAIL) {
        const { signOut } = await import("https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js");
        await signOut(auth);
        throw new Error("هذا الحساب ليس حساب مالك ACT المصرح به.");
      }
    } catch (error) {
      if (errorBox) errorBox.textContent = error.code === "auth/invalid-credential" || error.code === "auth/wrong-password" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : (error.message || "تعذر تسجيل الدخول. حاول مرة أخرى.");
    } finally {
      if (button) { button.disabled = false; button.textContent = "دخول لوحة المالك"; }
    }
  });

  onAuthStateChanged(auth, async user => {
    currentUser = user;
    isOwner = !!user && String(user.email || "").trim().toLowerCase() === OWNER_EMAIL;
    if (!user) {
      customers = []; supportTickets = []; selectedUid = "";
      $("owner-access-state").textContent = "سجّل الدخول بحساب مالك ACT لفتح لوحة التحكم مباشرة.";
      if ($("owner-login-panel")) $("owner-login-panel").style.display = "block";
      if ($("owner-console-section")) $("owner-console-section").style.display = "none";
      return;
    }
    if (!isOwner) {
      $("owner-access-state").textContent = "غير مصرح: هذه الصفحة مخصصة لمالك ACT فقط.";
      if ($("owner-login-panel")) $("owner-login-panel").style.display = "block";
      $("owner-console-section").style.display = "none";
      return;
    }
    if ($("owner-login-panel")) $("owner-login-panel").style.display = "none";
    $("owner-access-state").textContent = "تم التحقق من حساب المالك. جارٍ تحميل بيانات العملاء والاشتراكات والرسائل...";
    $("owner-console-section").style.display = "block";
    await Promise.all([loadCustomers(),loadSupport()]);
    showView("subscriptions");
    $("owner-access-state").textContent = "تم فتح مركز تحكم المالك الخاص.";
  });
  // Multi-device sync: refresh shared owner data every 5 seconds while visible.
  // All devices use the same authenticated account and the same Cloudflare/Firebase data.
  // Pause while a manual refresh is running and preserve any support reply being edited.
  let syncRefreshRunning = false;
  const syncOwnerDevices = async () => {
    if (!isOwner || document.visibilityState !== "visible" || refreshBusy || syncRefreshRunning) return;
    syncRefreshRunning = true;
    try {
      await Promise.all([loadCustomers(), loadSupport()]);
    } finally {
      syncRefreshRunning = false;
    }
  };
  setInterval(syncOwnerDevices, 5000);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") syncOwnerDevices();
  });
})();
