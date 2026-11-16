/* FIX device gate — shown AFTER a successful login (welcome -> login -> FIX -> app).
 * Exposes window.actFixGate(user): resolves true when the device is activated,
 * or false when the person goes back to the login screen.
 */
(() => {
  "use strict";
  const $ = id => document.getElementById(id);
  const API = () => String(window.ACT_CONTROL_API_URL || "").replace(/\/$/, "");
  const SUPPORT_WA = "https://wa.me/201554640828";
  const random = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => (b % 36).toString(36)).join("").toUpperCase();
  let deviceId = localStorage.getItem("actFixDeviceId");
  if (!/^FIX-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(deviceId || "")) {
    deviceId = `FIX-${random(4)}-${random(4)}-${random(4)}`;
    localStorage.setItem("actFixDeviceId", deviceId);
  }
  const isActivated = () => localStorage.getItem("actFixActivatedDevice") === deviceId;

  const lang = () => (localStorage.getItem("actPhoneManager_language") === "en" ? "en" : "ar");
  const TXT = {
    ar: { title: "تأمين وتفعيل الجهاز", desc: "تم تسجيل الدخول بنجاح. الخطوة الأخيرة: أرسل معرّف جهازك إلى إدارة ACT، ثم أدخل كود التفعيل الذي يصلك من المسؤول، وبعدها يفتح البرنامج مباشرة.", copy: "نسخ معرّف الجهاز", copied: "تم نسخ معرّف الجهاز.", manual: "حدد المعرّف وانسخه يدويًا.", code: "كود التفعيل", go: "تحقق وافتح البرنامج", back: "↩ الرجوع لتسجيل الدخول", help: "تحتاج مساعدة؟ تواصل مع دعم ACT على واتساب", bad: "أدخل كود التفعيل المكوّن من 8 أحرف.", nocfg: "خدمة التفعيل غير مضبوطة. تواصل مع دعم ACT.", wait: "جارٍ التحقق بأمان...", retry: "الاتصال بطيء، جارٍ إعادة المحاولة...", ok: "تم التفعيل. جارٍ فتح البرنامج...", fail: "تعذر تفعيل الجهاز.", offline: "لا يوجد اتصال بالإنترنت. تأكد من الشبكة ثم اضغط مرة أخرى.", net: "تعذر الوصول إلى خدمة التفعيل. تأكد من الإنترنت ثم حاول مرة أخرى. إذا استمرت المشكلة تواصل مع دعم ACT.", timeout: "انتهت مهلة الاتصال. حاول مرة أخرى." },
    en: { title: "Secure & Activate Device", desc: "Signed in successfully. Last step: send your device ID to ACT management, then enter the activation code you receive. The app opens right after.", copy: "Copy device ID", copied: "Device ID copied.", manual: "Select the ID and copy it manually.", code: "Activation code", go: "Verify & open the app", back: "↩ Back to sign in", help: "Need help? Contact ACT support on WhatsApp", bad: "Enter the 8-character activation code.", nocfg: "Activation service is not configured. Contact ACT support.", wait: "Verifying securely...", retry: "Slow connection, retrying...", ok: "Activated. Opening the app...", fail: "Could not activate this device.", offline: "No internet connection. Check your network and try again.", net: "Could not reach the activation service. Check your internet and try again. If it continues, contact ACT support.", timeout: "Connection timed out. Please try again." }
  };

  // POST with timeout + automatic retry on network failures (Safari reports these as "Load failed").
  async function postActivate(payload, onRetry) {
    const urls = [API(), ...(Array.isArray(window.ACT_CONTROL_API_FALLBACKS) ? window.ACT_CONTROL_API_FALLBACKS.map(u => String(u).replace(/\/$/, "")) : [])].filter(Boolean);
    let lastError = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      for (const base of urls) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 20000);
        try {
          const res = await fetch(base + "/api/fix/activate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), cache: "no-store", signal: ctrl.signal });
          clearTimeout(timer);
          const data = await res.json().catch(() => ({}));
          return { res, data };
        } catch (e) {
          clearTimeout(timer);
          lastError = e;
        }
      }
      if (attempt < 2) { if (onRetry) onRetry(); await new Promise(r => setTimeout(r, 900 * (attempt + 1))); }
    }
    throw lastError || new Error("network");
  }

  function gate() {
    if (isActivated()) return Promise.resolve(true);
    if ($("fix-activation-screen")) return Promise.resolve(false);
    return new Promise(resolve => {
      const L = lang(), T = TXT[L];
      const light = localStorage.getItem("actPhoneManager_theme") === "light";
      const screen = document.createElement("section");
      screen.id = "fix-activation-screen"; screen.dir = L === "ar" ? "rtl" : "ltr";
      screen.setAttribute("data-fix-theme", light ? "light" : "dark");
      screen.innerHTML = `<style>
        #fix-activation-screen{--fx-bg:#000;--fx-card:#111;--fx-line:#2c2c2c;--fx-text:#fff;--fx-soft:#b5b5b5;--fx-input:#1b1b1b;--fx-accent:#25a7ff;--fx-warn:#ffd77a;position:fixed;inset:0;z-index:2147482000;display:grid;place-items:center;padding:16px;overflow:auto;background:var(--fx-bg);color:var(--fx-text);text-align:center;font-family:inherit}
        #fix-activation-screen[data-fix-theme="light"]{--fx-bg:#f2f3f5;--fx-card:#fff;--fx-line:#d6d9de;--fx-text:#111;--fx-soft:#4b5563;--fx-input:#f4f5f7;--fx-accent:#0a66d6;--fx-warn:#a15c00}
        #fix-activation-screen .fix-card{width:min(460px,100%);box-sizing:border-box;padding:30px 26px;border:1px solid var(--fx-line);border-radius:26px;background:var(--fx-card);box-shadow:0 24px 70px rgba(0,0,0,.28);animation:fixIn .35s ease both}
        #fix-activation-screen .fix-brand{font-size:54px;font-weight:900;letter-spacing:8px;color:var(--fx-accent);line-height:1.2}
        #fix-activation-screen h2{margin:8px 0 5px;font-size:23px;color:var(--fx-text)}
        #fix-activation-screen .fix-desc{color:var(--fx-soft);font-size:13px;line-height:1.9;margin:8px 0 18px}
        #fix-activation-screen .fix-id{padding:13px 8px;border:1px dashed var(--fx-accent);border-radius:12px;background:var(--fx-input);color:var(--fx-accent);font:800 17px ui-monospace,monospace;letter-spacing:1px;user-select:all;direction:ltr}
        #fix-activation-screen input{width:100%;box-sizing:border-box;margin:13px 0 5px;padding:15px;border:1px solid var(--fx-line);border-radius:12px;background:var(--fx-input);color:var(--fx-text);text-align:center;font-family:inherit;font-size:16px;font-weight:700;letter-spacing:3px}
        #fix-activation-screen button{width:100%;padding:14px;margin-top:10px;border:0;border-radius:12px;background:var(--fx-accent);color:#fff;font-family:inherit;font-weight:800;font-size:14px;cursor:pointer}
        #fix-activation-screen button.fix-back{background:transparent;border:1px solid var(--fx-line);color:var(--fx-text)}
        #fix-activation-screen button:disabled{opacity:.6;cursor:wait}
        #fix-activation-screen .fix-status{min-height:24px;margin-top:10px;color:var(--fx-warn);font-size:13px;line-height:1.7}
        #fix-activation-screen .fix-help{display:block;margin-top:15px;color:var(--fx-accent);text-decoration:none;font-size:13px}
        @keyframes fixIn{from{opacity:0;transform:translateY(12px) scale(.985)}to{opacity:1;transform:none}}
      </style>
      <div class="fix-card">
        <div class="fix-brand">FIX</div><h2>${T.title}</h2>
        <p class="fix-desc">${T.desc}</p>
        <div class="fix-id" id="fix-device-id"></div>
        <button type="button" id="fix-copy-id">${T.copy}</button>
        <input id="fix-activation-code" maxlength="8" inputmode="text" autocomplete="one-time-code" autocapitalize="characters" placeholder="${T.code}">
        <button type="button" id="fix-activate-button">${T.go}</button>
        <button type="button" id="fix-back-login" class="fix-back">${T.back}</button>
        <div class="fix-status" id="fix-activation-status" role="status" aria-live="polite"></div>
        <a class="fix-help" href="${SUPPORT_WA}" target="_blank" rel="noopener noreferrer">${T.help}</a>
      </div>`;
      document.body.appendChild(screen);
      $("fix-device-id").textContent = deviceId;
      const done = ok => { screen.remove(); resolve(ok); };

      $("fix-copy-id").addEventListener("click", async () => {
        try { await navigator.clipboard.writeText(deviceId); $("fix-activation-status").textContent = T.copied; }
        catch { $("fix-activation-status").textContent = T.manual; }
      });
      $("fix-back-login").addEventListener("click", () => done(false));
      $("fix-activate-button").addEventListener("click", async () => {
        const btn = $("fix-activate-button"), status = $("fix-activation-status"), code = $("fix-activation-code").value.trim().toUpperCase();
        if (!/^[A-Z0-9]{8}$/.test(code)) { status.textContent = T.bad; return; }
        if (!API()) { status.textContent = T.nocfg; return; }
        if (navigator.onLine === false) { status.textContent = T.offline; return; }
        btn.disabled = true; status.textContent = T.wait;
        try {
          const ua = navigator.userAgent || "", os = /Android/i.test(ua) ? "Android" : /iPhone|iPad|iPod/i.test(ua) ? "iOS" : /Windows/i.test(ua) ? "Windows" : /Mac/i.test(ua) ? "macOS" : "Web";
          const browser = /Edg/i.test(ua) ? "Edge" : /Chrome/i.test(ua) ? "Chrome" : /Safari/i.test(ua) ? "Safari" : "Browser";
          const { res, data } = await postActivate({ deviceId, code, platform: "web", os, browser, deviceType: os }, () => { status.textContent = T.retry; });
          if (!res.ok) throw Object.assign(new Error(data.error || T.fail), { server: true });
          localStorage.setItem("actFixActivatedDevice", deviceId);
          status.textContent = T.ok;
          setTimeout(() => done(true), 250);
        } catch (e) {
          // Server answers are shown as-is; raw browser errors ("Load failed", "Failed to fetch") become a clear message.
          status.textContent = e && e.server ? e.message : (e && e.name === "AbortError" ? T.timeout : T.net);
        } finally { btn.disabled = false; }
      });
    });
  }
  window.actFixGate = gate;
  window.actFixIsActivated = isActivated;
})();
