/* ACT Manager Control API — Cloudflare Worker
 * All privileged Firebase operations stay on the server.
 * Required secrets: FIREBASE_SERVICE_ACCOUNT_JSON
 * Required vars: FIREBASE_PROJECT_ID, FIREBASE_API_KEY, OWNER_EMAIL, ALLOWED_ORIGIN
 */
const DAY = 86400000;
let tokenCache = { value: "", expires: 0 };
// Best-effort per-isolate fallback. Configure a Cloudflare Rate Limiting binding
// named ACT_API_LIMITER for globally enforced limits across Worker isolates.
const localRate = new Map();
const MAX_BODY_BYTES = 64 * 1024;
const LOCAL_RATE_WINDOW_MS = 60_000;
const LOCAL_RATE_LIMIT = 90;

const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers }
});
const b64url = bytes => btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
const enc = s => new TextEncoder().encode(s);
const decode64 = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
const safeId = s => String(s || "").replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 140);

function fromFs(v) {
  if (!v) return null;
  if ("stringValue" in v) return v.stringValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return Number(v.doubleValue);
  if ("booleanValue" in v) return v.booleanValue;
  if ("nullValue" in v) return null;
  if ("timestampValue" in v) return Date.parse(v.timestampValue);
  if ("arrayValue" in v) return (v.arrayValue.values || []).map(fromFs);
  if ("mapValue" in v) return fromFields(v.mapValue.fields || {});
  return null;
}
function fromFields(fields) { return Object.fromEntries(Object.entries(fields || {}).map(([k,v]) => [k, fromFs(v)])); }
function toFs(v) {
  if (v === null || v === undefined) return { nullValue: "NULL_VALUE" };
  if (typeof v === "string") return { stringValue: v };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(toFs) } };
  if (typeof v === "object") return { mapValue: { fields: toFields(v) } };
  return { stringValue: String(v) };
}
function toFields(data) { return Object.fromEntries(Object.entries(data).map(([k,v]) => [k, toFs(v)])); }

async function serviceToken(env) {
  if (tokenCache.value && tokenCache.expires > Date.now() + 60000) return tokenCache.value;
  const sa = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(enc(JSON.stringify({ alg: "RS256", typ: "JWT" })));
  const claim = b64url(enc(JSON.stringify({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/datastore https://www.googleapis.com/auth/identitytoolkit",
    aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600
  })));
  const unsigned = `${head}.${claim}`;
  const pem = sa.private_key.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "");
  const key = await crypto.subtle.importKey("pkcs8", decode64(pem), { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, enc(unsigned));
  const assertion = `${unsigned}.${b64url(signature)}`;
  const form = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion });
  const response = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: form });
  const result = await response.json();
  if (!response.ok || !result.access_token) throw new Error("Google service authorization failed: " + (result.error_description || result.error || response.status));
  tokenCache = { value: result.access_token, expires: Date.now() + Number(result.expires_in || 3600) * 1000 };
  return tokenCache.value;
}

async function verifyUser(request, env) {
  const auth = request.headers.get("authorization") || "";
  const idToken = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!idToken) throw Object.assign(new Error("يلزم تسجيل الدخول مرة أخرى."), { status: 401 });
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`, {
    method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ idToken })
  });
  const body = await response.json();
  const user = body.users && body.users[0];
  if (!response.ok || !user || user.localId === undefined) throw Object.assign(new Error("جلسة Firebase غير صالحة. سجّل الدخول مجددًا."), { status: 401 });
  const normalized = { uid: user.localId, email: String(user.email || "").trim().toLowerCase(), name: user.displayName || "", emailVerified: !!user.emailVerified, createdAt: Number(user.createdAt || Date.now()), lastLoginAt: Number(user.lastLoginAt || Date.now()), disabled: !!user.disabled };
  if (normalized.disabled) throw Object.assign(new Error("هذا الحساب معطّل. تواصل مع إدارة ACT."), { status: 403 });
  return normalized;
}
const isOwner = (user, env) => String(user?.email || "").trim().toLowerCase() === String(env.OWNER_EMAIL || "").trim().toLowerCase();
const root = env => `https://firestore.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents`;
async function fsRequest(env, path, options = {}) {
  const token = await serviceToken(env);
  const response = await fetch(`${root(env)}/${path}`, { ...options, headers: { authorization: `Bearer ${token}`, "content-type": "application/json", ...(options.headers || {}) } });
  if (response.status === 404) return null;
  const data = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) throw new Error(`Firestore ${response.status}: ${data?.error?.message || "request failed"}`);
  return data;
}
async function getDoc(env, path) {
  const d = await fsRequest(env, path);
  return d ? { id: d.name.split("/").pop(), ...fromFields(d.fields) } : null;
}
async function setDoc(env, path, data) {
  const params = Object.keys(data).map(k => `updateMask.fieldPaths=${encodeURIComponent(k)}`).join("&");
  const suffix = params ? `?${params}` : "";
  return fsRequest(env, path + suffix, { method: "PATCH", body: JSON.stringify({ fields: toFields(data) }) });
}
async function runCollectionQuery(env, parentPath, collectionId, where = null) {
  const parent = parentPath ? `${root(env)}/${parentPath}:runQuery` : `${root(env)}:runQuery`;
  const structuredQuery = { from: [{ collectionId }] };
  if (where) structuredQuery.where = { fieldFilter: {
    field: { fieldPath: where.field }, op: "EQUAL", value: toFs(where.value)
  } };
  const response = await fetch(parent, { method: "POST", headers: { authorization: `Bearer ${await serviceToken(env)}`, "content-type": "application/json" }, body: JSON.stringify({ structuredQuery }) });
  const data = await response.json();
  if (!response.ok) throw new Error(`Firestore query ${response.status}: ${data?.error?.message || "failed"}`);
  return (data || []).filter(x => x.document).map(x => ({ id: x.document.name.split("/").pop(), ...fromFields(x.document.fields) }));
}
async function listCollection(env, parentPath, collectionId) {
  return runCollectionQuery(env, parentPath, collectionId);
}
async function listCollectionByField(env, parentPath, collectionId, field, value) {
  return runCollectionQuery(env, parentPath, collectionId, { field, value });
}
async function deleteDoc(env, path) { return fsRequest(env, path, { method: "DELETE" }); }
async function batchCreateDocs(env, entries) {
  if (!entries.length) return;
  const token = await serviceToken(env);
  for (let i = 0; i < entries.length; i += 400) {
    const writes = entries.slice(i, i + 400).map(({ path, data }) => ({
      update: { name: `projects/${env.FIREBASE_PROJECT_ID}/databases/(default)/documents/${path}`, fields: toFields(data) }
    }));
    const response = await fetch(`${root(env)}:commit`, { method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ writes }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(`Firestore batch write ${response.status}: ${result?.error?.message || "failed"}`);
  }
}
async function setAuthDisabled(env, uid, disabled) {
  const token = await serviceToken(env);
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/accounts:update`, {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ localId: uid, disableUser: !!disabled })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Firebase Auth update ${response.status}: ${result?.error?.message || "failed"}`);
  return result;
}
async function deleteAuthUser(env, uid) {
  const token = await serviceToken(env);
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/accounts:delete`, {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
    body: JSON.stringify({ localId: uid })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Firebase Auth delete ${response.status}: ${result?.error?.message || "failed"}`);
  return result;
}

async function audit(env, uid, actor, action, details = {}) {
  const id = crypto.randomUUID();
  await setDoc(env, `ownerCustomers/${uid}/audit/${id}`, { actorEmail: actor.email, action, details, createdAt: Date.now() });
}
async function lookupAuthUser(env, uid) {
  const token = await serviceToken(env);
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/accounts:lookup`, {
    method: "POST", headers: { authorization: `Bearer ${token}`, "content-type": "application/json" }, body: JSON.stringify({ localId: [uid] })
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(`Firebase Auth lookup ${response.status}: ${result?.error?.message || "failed"}`);
  return result.users?.[0] || null;
}
async function authUsers(env) {
  const token = await serviceToken(env);
  let pageToken = ""; const all = [];
  for (let page = 0; page < 10; page++) {
    const url = new URL(`https://identitytoolkit.googleapis.com/v1/projects/${env.FIREBASE_PROJECT_ID}/accounts:batchGet`);
    url.searchParams.set("maxResults", "1000"); if (pageToken) url.searchParams.set("nextPageToken", pageToken);
    const r = await fetch(url, { headers: { authorization: `Bearer ${token}` } });
    const d = await r.json();
    if (!r.ok) throw new Error(`Auth user listing ${r.status}: ${d?.error?.message || "failed"}`);
    all.push(...(d.users || [])); pageToken = d.nextPageToken || ""; if (!pageToken) break;
    if (page === 9) throw new Error("دليل الحسابات تجاوز 10,000 حساب؛ يلزم تقسيم الاستيراد إلى دفعات قبل عرض الجميع.");
  }
  return all;
}
function newCustomer(user, now, legacy = false) {
  const created = Number(user.createdAt || now);
  const start = legacy || now - created > 7 * DAY ? now : created;
  return {
    uid: user.uid || user.localId || "", email: user.email || "", displayName: user.displayName || user.name || "", phoneNumber: user.phoneNumber || "",
    authCreatedAt: created, createdAt: now, lastSeenAt: now, trialStartAt: start, trialEndAt: start + 7 * DAY,
    status: "trial", plan: "trial", subscriptionStartAt: null, subscriptionEndAt: null,
    allowedDevices: 1, activeDeviceCount: 0, disabled: !!user.disabled, legacyMigration: legacy || now - created > 7 * DAY,
    warning: null, paymentHistory: [], notes: ""
  };
}
async function ensureCustomer(env, user, legacy = false) {
  const path = `ownerCustomers/${user.uid}`;
  let record = await getDoc(env, path);
  if (!record) { record = newCustomer(user, Date.now(), legacy); await setDoc(env, path, record); }
  else await setDoc(env, path, { email: user.email || record.email || "", displayName: user.displayName || user.name || record.displayName || "", phoneNumber: user.phoneNumber || record.phoneNumber || "", lastSeenAt: Date.now(), authCreatedAt: Number(user.createdAt || record.authCreatedAt || Date.now()), disabled: !!user.disabled });
  return { ...record, uid: user.uid };
}
async function deviceRows(env, uid) { return listCollection(env, `ownerCustomers/${uid}`, "devices"); }
function describeDevice(body) {
  const ua = String(body.userAgent || "");
  const platform = String(body.platform || "");
  let os = "غير معروف", kind = "جهاز", model = String(body.deviceModel || "").trim() || "الموديل غير متاح من المتصفح";
  if (/Android/i.test(ua)) {
    os = "Android"; kind = /Mobile/i.test(ua) ? "هاتف Android" : "جهاز Android";
    const m = ua.match(/Android[^;)]*;\s*([^;)]+?)(?:\s+Build\/[^;)]+)?[;) ]/i);
    if (m && !/^(?:wv|\s*)$/i.test(m[1])) model = m[1].trim();
  } else if (/iPhone/i.test(ua)) { os = "iOS"; kind = "iPhone"; model = "iPhone (الطراز الدقيق غير متاح للمتصفح)"; }
  else if (/iPad/i.test(ua)) { os = "iPadOS"; kind = "iPad"; model = "iPad (الطراز الدقيق غير متاح للمتصفح)"; }
  else if (/Macintosh|Mac OS X/i.test(ua) || /Mac/i.test(platform)) { os = "macOS"; kind = "Mac"; }
  else if (/Windows/i.test(ua) || /Win/i.test(platform)) { os = "Windows"; kind = /Mobile/i.test(ua) ? "هاتف Windows" : "كمبيوتر Windows"; }
  else if (/CrOS/i.test(ua)) { os = "ChromeOS"; kind = "Chromebook"; }
  else if (/Linux/i.test(ua)) { os = "Linux"; kind = "كمبيوتر Linux"; }
  let browser = "متصفح غير معروف";
  if (/Edg\//i.test(ua)) browser = "Microsoft Edge";
  else if (/Firefox\//i.test(ua)) browser = "Firefox";
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = "Google Chrome";
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Safari";
  return { os, kind, model, browser };
}
async function registerDevice(env, user, record, body) {
  const deviceId = safeId(body.deviceId);
  if (!deviceId || deviceId.length < 16) throw Object.assign(new Error("معرّف تثبيت التطبيق غير صالح."), { status: 400 });
  const path = `ownerCustomers/${user.uid}/devices/${deviceId}`;
  const existing = await getDoc(env, path);
  if (existing?.status === "revoked") throw Object.assign(new Error("تم إخراج هذا الجهاز من الحساب. سجّل من جهاز مسموح أو تواصل مع الإدارة."), { status: 403 });
  const devices = await deviceRows(env, user.uid);
  const active = devices.filter(d => d.status === "active");
  if (!existing && active.length >= Number(record.allowedDevices || 1)) {
    throw Object.assign(new Error(`وصل الحساب إلى الحد الأقصى للأجهزة (${record.allowedDevices || 1}). اطلب من الإدارة إخراج جهاز قديم.`), { status: 403, code: "DEVICE_LIMIT" });
  }
  const now = Date.now();
  const info = describeDevice(body);
  await setDoc(env, path, { deviceId, status: "active", firstSeenAt: existing?.firstSeenAt || now, lastSeenAt: now, label: String(body.deviceLabel || info.kind).slice(0, 120), platform: String(body.platform || info.os).slice(0, 80), os: info.os, deviceType: info.kind, model: info.model, browser: info.browser, userAgent: String(body.userAgent || "").slice(0, 500) });
  await setDoc(env, `ownerCustomers/${user.uid}`, { activeDeviceCount: active.length + (existing ? 0 : 1), lastSeenAt: now });
  return { deviceId, activeDeviceCount: active.length + (existing ? 0 : 1) };
}
async function bootstrap(request, env, user, body) {
  if (isOwner(user, env)) return { allowed: true, owner: true, user: { uid: user.uid, email: user.email } };
  if (user.disabled) return { allowed: false, reason: "تم تعطيل حساب Firebase. تواصل مع الإدارة." };
  const record = await ensureCustomer(env, user);
  if (record.status === "suspended") return { allowed: false, reason: "تم إيقاف حسابك مؤقتًا بواسطة إدارة ACT. راجع الدعم الفني." };
  if (record.status === "banned") return { allowed: false, reason: "هذا الحساب موقوف. تواصل مع إدارة ACT." };
  const now = Date.now();
  const expiry = record.status === "active" ? Number(record.subscriptionEndAt || 0) : Number(record.trialEndAt || 0);
  if (!expiry || now >= expiry) {
    if (record.status !== "expired") await setDoc(env, `ownerCustomers/${user.uid}`, { status: "expired", expiredAt: now });
    return { allowed: false, reason: "انتهت صلاحية استخدام ACT Manager.", status: "expired", expiresAt: expiry, trialStartAt: Number(record.trialStartAt || 0), trialEndAt: Number(record.trialEndAt || 0), subscriptionEndAt: Number(record.subscriptionEndAt || 0) };
  }
  const device = await registerDevice(env, user, record, body);
  return { allowed: true, owner: false, status: record.status, expiresAt: expiry, remainingDays: Math.max(0, Math.ceil((expiry - now) / DAY)), warning: record.warning || null, device };
}
async function ownerCustomers(env) {
  // Build one isolated customer row per Firebase UID and attach only that UID's request.
  const [users, registry, requests] = await Promise.all([
    authUsers(env),
    listCollection(env, "", "ownerCustomers"),
    listCollection(env, "", "actSubscriptionRequests")
  ]);
  const records = new Map(registry.map(r => [r.uid || r.id, r]));
  const requestByUid = new Map(requests.map(r => [String(r.customerUid || r.id), r]));
  const missing = [];
  const out = [];
  const now = Date.now();
  for (const u of users) {
    if (!u.localId || String(u.email || "").toLowerCase() === String(env.OWNER_EMAIL || "").toLowerCase()) continue;
    let r = records.get(u.localId);
    const authUser = { uid: u.localId, email: u.email || "", displayName: u.displayName || "", phoneNumber: u.phoneNumber || "", createdAt: Number(u.createdAt || now), disabled: !!u.disabled };
    if (!r) { r = newCustomer({ ...authUser, localId: u.localId }, now, false); missing.push({ path: `ownerCustomers/${u.localId}`, data: r }); }
    const ownRequest = requestByUid.get(u.localId);
    // Do not return receipt bytes in the directory response; they are loaded only in this customer's detail view.
    const subscriptionRequest = ownRequest ? {
      id: ownRequest.id,
      customerUid: u.localId,
      status: ownRequest.status || "",
      transferReference: ownRequest.transferReference || "",
      amount: Number(ownRequest.amount || 300),
      durationDays: Number(ownRequest.durationDays || 365),
      method: ownRequest.method || "Vodafone Cash",
      createdAt: Number(ownRequest.createdAt || 0),
      reviewedAt: Number(ownRequest.reviewedAt || 0),
      rejectionReason: ownRequest.rejectionReason || ""
    } : null;
    const knownDevices = await deviceRows(env, u.localId);
    const latestDevice = knownDevices.slice().sort((a,b) => Number(b.lastSeenAt || 0) - Number(a.lastSeenAt || 0))[0] || null;
    const loginMethods = (u.providerUserInfo || []).map(p => p.providerId === "google.com" ? "Google" : p.providerId === "password" ? "البريد الإلكتروني وكلمة المرور" : p.providerId || "غير معروف");
    out.push({ ...r, uid: u.localId, email: authUser.email || r.email || "", displayName: authUser.displayName || r.displayName || "", authCreatedAt: authUser.createdAt || r.authCreatedAt || 0, lastLoginAt: Number(u.lastLoginAt || r.lastSeenAt || 0), disabled: !!u.disabled, loginMethods, devices: Number(r.activeDeviceCount || 0), latestDevice: latestDevice ? { os: latestDevice.os || latestDevice.platform || "غير معروف", deviceType: latestDevice.deviceType || latestDevice.label || "جهاز", model: latestDevice.model || "الموديل غير متاح", browser: latestDevice.browser || "غير معروف", lastSeenAt: Number(latestDevice.lastSeenAt || 0), status: latestDevice.status || "" } : null, subscriptionRequest });
  }
  await batchCreateDocs(env, missing);
  out.sort((a,b) => Number(b.authCreatedAt || 0) - Number(a.authCreatedAt || 0));
  return out;
}
async function ownerDetail(env, uid) {
  const record = await getDoc(env, `ownerCustomers/${uid}`);
  if (!record) throw Object.assign(new Error("الحساب غير موجود في سجل ACT."), { status: 404 });
  const [devices, logs, tickets, authUser] = await Promise.all([
    deviceRows(env, uid), listCollection(env, `ownerCustomers/${uid}`, "audit"), listCollectionByField(env, "", "actSupportRequests", "customerUid", uid), lookupAuthUser(env, uid)
  ]);
  const rawSubscriptionRequest = await getDoc(env, `actSubscriptionRequests/${uid}`);
  const subscriptionRequest = rawSubscriptionRequest && String(rawSubscriptionRequest.customerUid || rawSubscriptionRequest.id) === uid ? rawSubscriptionRequest : null;
  return { record, subscriptionRequest, auth: authUser ? { email: authUser.email || "", displayName: authUser.displayName || "", phoneNumber: authUser.phoneNumber || "", createdAt: Number(authUser.createdAt || 0), lastLoginAt: Number(authUser.lastLoginAt || 0), disabled: !!authUser.disabled, providers: (authUser.providerUserInfo || []).map(p => p.providerId) } : null, devices: devices.sort((a,b) => Number(b.lastSeenAt || 0) - Number(a.lastSeenAt || 0)), audit: logs.sort((a,b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)).slice(0,100), support: tickets.filter(t => t.customerUid === uid).sort((a,b) => Number(b.createdAt || 0) - Number(a.createdAt || 0)) };
}
async function ownerAction(env, actor, body) {
  const uid = safeId(body.uid); if (!uid) throw Object.assign(new Error("معرّف العميل غير صالح."), { status: 400 });
  const path = `ownerCustomers/${uid}`; const record = await getDoc(env, path);
  if (!record) throw Object.assign(new Error("العميل غير موجود."), { status: 404 });
  const now = Date.now(); let changes = {};
  switch (body.action) {
    case "approveSubscriptionRequest": {
      const requestPath = `actSubscriptionRequests/${uid}`;
      const request = await getDoc(env, requestPath);
      if (!request || String(request.customerUid || request.id) !== uid || request.status !== "pending") throw Object.assign(new Error("لا يوجد طلب اشتراك قيد المراجعة لهذا العميل."), { status: 409 });
      const days = 365, amount = 300;
      const alreadyApplied = Number(record.lastApprovedSubscriptionRequestCreatedAt || 0) === Number(request.createdAt || -1);
      let end = Number(record.subscriptionEndAt || 0);
      if (alreadyApplied) changes = { lastSubscriptionRequestReviewedAt: now };
      if (!alreadyApplied) {
        const oldEnd = Number(record.subscriptionEndAt || 0);
        const start = Math.max(now, oldEnd);
        end = start + days * DAY;
        const payment = { id: crypto.randomUUID(), amount, currency: "EGP", method: "Vodafone Cash", note: `رقم التحويل: ${String(request.transferReference || "").slice(0,80)}`, days, createdAt: now, createdBy: actor.email };
        changes = { status: "active", plan: "annual-300-egp", subscriptionStartAt: record.subscriptionStartAt || start, subscriptionEndAt: end, lastRenewedAt: now, lastApprovedSubscriptionRequestCreatedAt: Number(request.createdAt || now), paymentHistory: [...(record.paymentHistory || []), payment] };
      }
      changes.__approvedSubscriptionRequest = true;
      changes.__approvedUntil = end;
      break;
    }
    case "rejectSubscriptionRequest": {
      const requestPath = `actSubscriptionRequests/${uid}`;
      const request = await getDoc(env, requestPath);
      if (!request || String(request.customerUid || request.id) !== uid || request.status !== "pending") throw Object.assign(new Error("لا يوجد طلب اشتراك قيد المراجعة لهذا العميل."), { status: 409 });
      const reason = String(body.reason || "تعذر تأكيد التحويل. راجع البيانات وحاول مرة أخرى.").slice(0,300);
      changes = { lastPaymentRequestRejectedAt: now, __rejectedSubscriptionRequest: true, __rejectionReason: reason };
      break;
    }
    case "setDeviceLimit": {
      const n = Number(body.value); if (![1,2,3,4].includes(n)) throw Object.assign(new Error("حد الأجهزة يجب أن يكون من 1 إلى 4."), { status: 400 });
      const active = (await deviceRows(env, uid)).filter(d => d.status === "active");
      if (n < active.length) throw Object.assign(new Error(`لدى العميل ${active.length} أجهزة نشطة. أخرج بعض الأجهزة أولًا أو اختر حدًا أكبر.`), { status: 409 });
      changes = { allowedDevices: n }; break;
    }
    case "activate": {
      const days = Math.max(1, Math.min(3650, Number(body.days || 30)));
      const oldEnd = Number(record.subscriptionEndAt || 0);
      const start = Math.max(now, oldEnd);
      const end = start + days * DAY;
      const payment = { id: crypto.randomUUID(), amount: Math.max(0, Number(body.amount || 0)), currency: "EGP", method: String(body.method || "manual").slice(0,40), note: String(body.note || "").slice(0,300), days, createdAt: now, createdBy: actor.email };
      changes = { status: "active", plan: String(body.plan || `${days}-day`).slice(0,80), subscriptionStartAt: record.subscriptionStartAt || start, subscriptionEndAt: end, lastRenewedAt: now, paymentHistory: [...(record.paymentHistory || []), payment] }; break;
    }
    case "suspend": changes = { status: "suspended", suspendedAt: now, suspensionReason: String(body.reason || "إيقاف بواسطة الإدارة").slice(0,300) }; break;
    case "ban": {
      await setAuthDisabled(env, uid, true);
      changes = { status: "banned", disabled: true, bannedAt: now, banReason: String(body.reason || "حظر بواسطة الإدارة").slice(0,300) };
      break;
    }
    case "unban": {
      await setAuthDisabled(env, uid, false);
      const expiry = record.subscriptionEndAt ? Number(record.subscriptionEndAt) : Number(record.trialEndAt || 0);
      changes = { disabled: false, status: expiry > now ? (record.subscriptionEndAt ? "active" : "trial") : "expired", unbannedAt: now };
      break;
    }
    case "unsuspend": {
      const end = record.subscriptionEndAt ? Number(record.subscriptionEndAt) : Number(record.trialEndAt || 0);
      changes = { status: end > now ? (record.subscriptionEndAt ? "active" : "trial") : "expired", unsuspendedAt: now }; break;
    }
    case "warn": changes = { warning: { id: crypto.randomUUID(), message: String(body.message || "").slice(0,1000), createdAt: now, read: false } }; if (!changes.warning.message) throw Object.assign(new Error("اكتب نص التحذير أولًا."), { status: 400 }); break;
    case "clearWarning": changes = { warning: null }; break;
    case "revokeDevice": {
      const deviceId = safeId(body.deviceId); if (!deviceId) throw Object.assign(new Error("الجهاز غير محدد."), { status: 400 });
      const dpath = `${path}/devices/${deviceId}`; const d = await getDoc(env, dpath);
      if (!d) throw Object.assign(new Error("الجهاز غير موجود."), { status: 404 });
      await setDoc(env, dpath, { status: "revoked", revokedAt: now, revokedBy: actor.email });
      const activeCount = (await deviceRows(env, uid)).filter(x => x.status === "active").length;
      changes = { activeDeviceCount: activeCount }; break;
    }
    case "note": changes = { notes: String(body.value || "").slice(0,5000), notesUpdatedAt: now }; break;
    default: throw Object.assign(new Error("عملية غير معروفة."), { status: 400 });
  }
  const approvedRequest = changes.__approvedSubscriptionRequest === true;
  const rejectedRequest = changes.__rejectedSubscriptionRequest === true;
  const approvedUntil = changes.__approvedUntil;
  const rejectionReason = changes.__rejectionReason;
  delete changes.__approvedSubscriptionRequest;
  delete changes.__approvedUntil;
  delete changes.__rejectedSubscriptionRequest;
  delete changes.__rejectionReason;
  await setDoc(env, path, changes);
  if (approvedRequest) await setDoc(env, `actSubscriptionRequests/${uid}`, { status: "approved", reviewedAt: now, reviewedBy: actor.email, approvedUntil });
  if (rejectedRequest) await setDoc(env, `actSubscriptionRequests/${uid}`, { status: "rejected", reviewedAt: now, reviewedBy: actor.email, rejectionReason });
  await audit(env, uid, actor, body.action, changes);
  return { ok: true, changes };
}
async function deleteOwnerCustomer(env, actor, body) {
  const uid = safeId(body.uid);
  const confirmUid = String(body.confirmUid || "").trim();
  if (!uid || confirmUid !== uid) throw Object.assign(new Error("تأكيد الحذف غير مطابق لمعرّف الحساب."), { status: 400 });
  const authUser = await lookupAuthUser(env, uid);
  if (!authUser) throw Object.assign(new Error("حساب Firebase غير موجود بالفعل."), { status: 404 });
  if (String(authUser.email || "").trim().toLowerCase() === String(env.OWNER_EMAIL || "").trim().toLowerCase()) throw Object.assign(new Error("لا يمكن حذف حساب مالك النظام."), { status: 403 });
  // Remove UID-scoped records and child documents, then permanently delete the Auth identity.
  const [devices, auditRows, tickets, appData] = await Promise.all([
    deviceRows(env, uid), listCollection(env, `ownerCustomers/${uid}`, "audit"), listCollectionByField(env, "", "actSupportRequests", "customerUid", uid), listCollection(env, `users/${uid}`, "appData")
  ]);
  for (const d of devices) await deleteDoc(env, `ownerCustomers/${uid}/devices/${safeId(d.deviceId || d.id)}`);
  for (const a of auditRows) await deleteDoc(env, `ownerCustomers/${uid}/audit/${safeId(a.id)}`);
  for (const t of tickets) await deleteDoc(env, `actSupportRequests/${safeId(t.id)}`);
  for (const item of appData) await deleteDoc(env, `users/${uid}/appData/${encodeURIComponent(String(item.id))}`);
  await deleteDoc(env, `users/${uid}`);
  await deleteDoc(env, `actSubscriptionRequests/${uid}`);
  await deleteAuthUser(env, uid);
  await deleteDoc(env, `ownerCustomers/${uid}`);
  await setDoc(env, `ownerDeletionAudit/${crypto.randomUUID()}`, { action: "deleteCustomerAccount", customerUid: uid, actorEmail: actor.email, createdAt: Date.now() });
  return { ok: true, deletedUid: uid };
}

async function customerSubscriptionRoute(env, user, body, method) {
  if (isOwner(user, env)) throw Object.assign(new Error("هذه الصفحة مخصصة لحسابات العملاء."), { status: 403 });
  const record = await ensureCustomer(env, user);
  const path = `actSubscriptionRequests/${user.uid}`;
  if (method === "GET") {
    const request = await getDoc(env, path);
    return {
      record: {
        status: record.status,
        plan: record.plan,
        trialStartAt: Number(record.trialStartAt || 0),
        trialEndAt: Number(record.trialEndAt || 0),
        subscriptionStartAt: Number(record.subscriptionStartAt || 0),
        subscriptionEndAt: Number(record.subscriptionEndAt || 0)
      },
      request: request ? {
        status: request.status,
        transferReference: request.transferReference || "",
        createdAt: Number(request.createdAt || 0),
        reviewedAt: Number(request.reviewedAt || 0),
        rejectionReason: request.rejectionReason || ""
      } : null
    };
  }
  if (method !== "POST" || body.action !== "submit") throw Object.assign(new Error("العملية غير مسموح بها."), { status: 405 });
  if (record.status === "suspended" || record.status === "banned" || user.disabled) throw Object.assign(new Error("لا يمكن إرسال طلب اشتراك لهذا الحساب حاليًا. تواصل مع الإدارة."), { status: 403 });
  const transferReference = String(body.transferReference || "").trim();
  const receiptDataUrl = String(body.receiptDataUrl || "");
  if (!/^[A-Za-z0-9\u0600-\u06FF _-]{4,60}$/.test(transferReference)) throw Object.assign(new Error("اكتب رقم التحويل بشكل صحيح (من 4 إلى 60 حرفًا أو رقمًا)."), { status: 400 });
  if (!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(receiptDataUrl) || receiptDataUrl.length > 48000) throw Object.assign(new Error("صورة الإيصال غير صالحة أو حجمها أكبر من المسموح. اختر صورة واضحة أصغر حجمًا."), { status: 400 });
  const existing = await getDoc(env, path);
  if (existing?.status === "pending") throw Object.assign(new Error("طلبك قيد المراجعة بالفعل. انتظر رد الإدارة."), { status: 409 });
  const now = Date.now();
  await setDoc(env, path, {
    customerUid: user.uid,
    email: user.email || "",
    displayName: user.name || "",
    amount: 300,
    currency: "EGP",
    durationDays: 365,
    method: "Vodafone Cash",
    transferReference,
    receiptDataUrl,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    reviewedAt: null,
    reviewedBy: null,
    rejectionReason: ""
  });
  return { ok: true, status: "pending", message: "تم إرسال طلب الاشتراك بنجاح. سيتم مراجعته من إدارة ACT قبل التفعيل." };
}

async function supportRoute(env, user, owner, body, method, url) {
  const col = "actSupportRequests";
  if (method === "GET") {
    // Customer queries are scoped in Firestore itself; never download other customers' tickets.
    // The complete inbox is returned only after the caller passed the server-side owner check.
    const visible = owner
      ? await listCollection(env, "", col)
      : await listCollectionByField(env, "", col, "customerUid", user.uid);
    return visible.sort((a,b) => Number(b.updatedAt || b.createdAt || 0) - Number(a.updatedAt || a.createdAt || 0));
  }
  if (method !== "POST") throw Object.assign(new Error("Method not allowed"), { status: 405 });
  if (body.action === "create" && !owner) {
    const subject = String(body.subject || "").trim(), message = String(body.message || "").trim();
    if (!subject || subject.length > 100 || !message || message.length > 3000) throw Object.assign(new Error("راجع عنوان الرسالة وتفاصيلها."), { status: 400 });
    const previous = await listCollectionByField(env, "", col, "customerUid", user.uid);
    const isFirstContact = previous.length === 0;
    const autoReply = isFirstContact
      ? "أهلًا بيك في دعم ACT! شكرًا لتواصلك معنا. تم استلام رسالتك، وسنراجعها ونساعدك في أقرب وقت."
      : "تم استلام رسالتك، وسيتم الرد عليك في أقرب وقت. شكرًا لانتظارك.";
    const id = crypto.randomUUID(); const now = Date.now();
    await setDoc(env, `${col}/${id}`, { customerUid: user.uid, email: user.email, displayName: user.name || "", subject, message, type: String(body.type || "support").slice(0,40), priority: String(body.priority || "normal"), status: "new", ownerReply: "", autoReply, firstContact: isFirstContact, createdAt: now, updatedAt: now });
    return { ok: true, id, autoReply, firstContact: isFirstContact };
  }
  if (body.action === "reply" && owner) {
    const id = safeId(body.id), reply = String(body.reply || "").trim(); if (!id || !reply || reply.length > 3000) throw Object.assign(new Error("الرد مطلوب وبحد أقصى 3000 حرف."), { status: 400 });
    const path = `${col}/${id}`, ticket = await getDoc(env, path); if (!ticket) throw Object.assign(new Error("الطلب غير موجود."), { status: 404 });
    const repliedAt = Date.now();
    await setDoc(env, path, { ownerReply: reply, status: "answered", repliedAt, replySeenAt: null, updatedAt: repliedAt, repliedBy: user.email });
    await audit(env, ticket.customerUid, user, "supportReply", { ticketId: id }); return { ok: true };
  }
  if (body.action === "status" && owner) {
    const id = safeId(body.id), status = String(body.status || ""); if (!id || !["new","in-progress","answered","closed"].includes(status)) throw Object.assign(new Error("حالة الطلب غير صحيحة."), { status: 400 });
    const path = `${col}/${id}`, ticket = await getDoc(env, path); if (!ticket) throw Object.assign(new Error("الطلب غير موجود."), { status: 404 });
    await setDoc(env, path, { status, updatedAt: Date.now() }); await audit(env, ticket.customerUid, user, "supportStatus", { ticketId: id, status }); return { ok: true };
  }
  throw Object.assign(new Error("غير مسموح بتنفيذ العملية."), { status: 403 });
}

function securityHeaders(extra = {}) {
  return {
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "x-frame-options": "DENY",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
    "cache-control": "no-store, max-age=0",
    ...extra
  };
}
function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGIN || "").split(",").map(x => x.trim()).filter(Boolean);
}
async function enforceRateLimit(request, env, routeKey) {
  const ip = request.headers.get("cf-connecting-ip") || "unknown";
  const key = `${ip}:${routeKey}`;
  if (env.ACT_API_LIMITER && typeof env.ACT_API_LIMITER.limit === "function") {
    const result = await env.ACT_API_LIMITER.limit({ key });
    if (!result.success) throw Object.assign(new Error("طلبات كثيرة خلال وقت قصير. انتظر دقيقة ثم حاول مرة أخرى."), { status: 429, code: "RATE_LIMITED" });
    return;
  }
  const now = Date.now();
  const entry = localRate.get(key);
  if (!entry || now - entry.start >= LOCAL_RATE_WINDOW_MS) localRate.set(key, { start: now, count: 1 });
  else {
    entry.count++;
    if (entry.count > LOCAL_RATE_LIMIT) throw Object.assign(new Error("طلبات كثيرة خلال وقت قصير. انتظر دقيقة ثم حاول مرة أخرى."), { status: 429, code: "RATE_LIMITED" });
  }
  if (localRate.size > 5000) for (const [k, v] of localRate) if (now - v.start > LOCAL_RATE_WINDOW_MS) localRate.delete(k);
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get("origin") || "";
    const allowList = allowedOrigins(env);
    const originAllowed = !!origin && allowList.includes(origin);
    const cors = securityHeaders({
      "access-control-allow-origin": originAllowed ? origin : "null",
      "access-control-allow-methods": "GET,POST,OPTIONS",
      "access-control-allow-headers": "authorization,content-type",
      "access-control-max-age": "600",
      "vary": "Origin"
    });
    if (!allowList.length) return json({ error: "Worker origin allow-list is not configured." }, 503, securityHeaders());
    if (request.method === "OPTIONS") return originAllowed ? new Response(null, { status: 204, headers: cors }) : json({ error: "Origin not allowed" }, 403, securityHeaders());
    if (!originAllowed) return json({ error: "Origin not allowed" }, 403, securityHeaders());
    if (!["GET", "POST"].includes(request.method)) return json({ error: "Method not allowed" }, 405, cors);
    const url = new URL(request.url);
    try {
      if (url.pathname === "/health" && request.method === "GET") return json({ ok: true, service: "ACT Manager Control API", project: env.FIREBASE_PROJECT_ID }, 200, cors);
      if (!env.FIREBASE_PROJECT_ID || !env.FIREBASE_API_KEY || !env.OWNER_EMAIL || !env.FIREBASE_SERVICE_ACCOUNT_JSON) throw Object.assign(new Error("Worker security configuration is incomplete."), { status: 503 });
      await enforceRateLimit(request, env, url.pathname);
      const user = await verifyUser(request, env);
      if (!user.emailVerified) throw Object.assign(new Error("يجب تأكيد البريد الإلكتروني قبل استخدام ACT."), { status: 403 });
      const owner = isOwner(user, env);
      let body = {};
      if (request.method === "POST") {
        const declaredLength = Number(request.headers.get("content-length") || 0);
        if (declaredLength > MAX_BODY_BYTES) throw Object.assign(new Error("حجم الطلب أكبر من المسموح."), { status: 413 });
        const raw = await request.text();
        if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) throw Object.assign(new Error("حجم الطلب أكبر من المسموح."), { status: 413 });
        try { body = raw ? JSON.parse(raw) : {}; } catch { throw Object.assign(new Error("صيغة الطلب غير صحيحة."), { status: 400 }); }
        if (!body || typeof body !== "object" || Array.isArray(body)) throw Object.assign(new Error("بيانات الطلب غير صحيحة."), { status: 400 });
      }
      if ((url.pathname === "/api/bootstrap" || url.pathname === "/api/heartbeat") && request.method === "POST") return json(await bootstrap(request, env, user, body), 200, cors);
      if (url.pathname === "/api/owner/customers" && request.method === "GET") {
        if (!owner) throw Object.assign(new Error("غير مصرح."), { status: 403 });
        const customers = await ownerCustomers(env); return json({ customers }, 200, cors);
      }
      if (url.pathname === "/api/owner/customer" && request.method === "GET") {
        if (!owner) throw Object.assign(new Error("غير مصرح."), { status: 403 });
        const uid = safeId(url.searchParams.get("uid")); if (!uid) throw Object.assign(new Error("معرّف العميل غير صالح."), { status: 400 });
        return json(await ownerDetail(env, uid), 200, cors);
      }
      if (url.pathname === "/api/owner/action" && request.method === "POST") {
        if (!owner) throw Object.assign(new Error("غير مصرح."), { status: 403 });
        return json(await ownerAction(env, user, body), 200, cors);
      }
      if (url.pathname === "/api/owner/delete-customer" && request.method === "POST") {
        if (!owner) throw Object.assign(new Error("غير مصرح."), { status: 403 });
        return json(await deleteOwnerCustomer(env, user, body), 200, cors);
      }
      if (url.pathname === "/api/customer/subscription" && ["GET", "POST"].includes(request.method)) return json(await customerSubscriptionRoute(env, user, body, request.method), 200, cors);
      if (url.pathname === "/api/support") return json(await supportRoute(env, user, owner, body, request.method, url), 200, cors);
      if (url.pathname === "/api/customer/warning-read" && request.method === "POST") {
        if (owner) return json({ ok: true }, 200, cors);
        const r = await getDoc(env, `ownerCustomers/${user.uid}`);
        if (r?.warning?.id === body.id) await setDoc(env, `ownerCustomers/${user.uid}`, { warning: { ...r.warning, read: true, readAt: Date.now() } });
        return json({ ok: true }, 200, cors);
      }
      throw Object.assign(new Error("المسار غير موجود."), { status: 404 });
    } catch (error) {
      const status = Number(error.status || 500);
      if (status >= 500) console.error("ACT Control API error", error);
      return json({ error: status >= 500 ? "حدث خطأ داخلي في خدمة إدارة ACT." : error.message, code: error.code || "REQUEST_FAILED" }, status, cors);
    }
  }
};
