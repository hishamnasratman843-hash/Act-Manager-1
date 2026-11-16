/* ACT Manager — install-as-app banner (Android/Chrome prompt + iPhone instructions) */
(function () {
  "use strict";
  var DISMISS = "actInstallDismissedAt";
  var standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (standalone) return;
  var lang = function () { return localStorage.getItem("actPhoneManager_language") === "en" ? "en" : "ar"; };
  var T = {
    ar: { title: "ثبّت ACT Manager على هاتفك", desc: "يفتح مباشرة كتطبيق بدون متصفح.", btn: "تثبيت", ios: "على الآيفون: اضغط زر المشاركة ثم «إضافة إلى الشاشة الرئيسية».", ok: "فهمت" },
    en: { title: "Install ACT Manager on your phone", desc: "Opens directly as an app, without the browser.", btn: "Install", ios: "On iPhone: tap the Share button, then “Add to Home Screen”.", ok: "Got it" }
  };
  var deferred = null, banner = null;
  function recentlyDismissed() { var t = Number(localStorage.getItem(DISMISS) || 0); return t && Date.now() - t < 3 * 86400000; }
  function build(isIos) {
    if (banner || recentlyDismissed()) return;
    var L = T[lang()];
    banner = document.createElement("div");
    banner.id = "act-install-banner";
    banner.setAttribute("dir", lang() === "ar" ? "rtl" : "ltr");
    banner.innerHTML = '<img src="./icons/icon-192.png" alt="ACT"><div class="ib-text"><b>' + L.title + '</b>' + (isIos ? L.ios : L.desc) + '</div><button type="button" class="ib-go">' + (isIos ? L.ok : L.btn) + '</button><button type="button" class="ib-close" aria-label="close">×</button>';
    document.body.appendChild(banner);
    requestAnimationFrame(function () { banner.classList.add("show"); });
    banner.querySelector(".ib-close").onclick = function () { localStorage.setItem(DISMISS, String(Date.now())); banner.remove(); banner = null; };
    banner.querySelector(".ib-go").onclick = async function () {
      if (!isIos && deferred) { deferred.prompt(); try { await deferred.userChoice; } catch (e) {} deferred = null; }
      localStorage.setItem(DISMISS, String(Date.now())); banner.remove(); banner = null;
    };
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); deferred = e; window.actDeferredInstallPrompt = e; setTimeout(function () { build(false); }, 4000); });
  window.addEventListener("appinstalled", function () { if (banner) banner.remove(); banner = null; });
  var ua = navigator.userAgent || "";
  if (/iphone|ipad|ipod/i.test(ua) && /safari/i.test(ua) && !/crios|fxios/i.test(ua)) setTimeout(function () { build(true); }, 6000);
})();
