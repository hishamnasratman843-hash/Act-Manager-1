// ======================================================
// ACT PHONE MANAGER
// FULL JAVASCRIPT
// ======================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged,
    signOut,
    setPersistence,
    sendPasswordResetEmail,
    browserLocalPersistence

} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

// ======================================================
// FIRESTORE DATABASE
// ======================================================

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    deleteDoc,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

// ====================================================== 
// Firebase Config 
// ====================================================== 
 
const firebaseConfig = { 
    apiKey: "AIzaSyCbailKYigVmcbqZHhi3kbvR2FvT1Q2JDw", 
    authDomain: "act-phone-manager.firebaseapp.com", 
    projectId: "act-phone-manager", 
    storageBucket: "act-phone-manager.firebasestorage.app", 
    messagingSenderId: "277621100210", 
    appId: "1:277621100210:web:0676faca9d539631a243ab", 
    measurementId: "G-R8MVR935PL" 
}; 
 
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// تهيئة قاعدة البيانات السحابية
const db = getFirestore(app);


// ACT SECURE PERSISTENT SESSION
const authPersistenceReady = setPersistence(
    auth,
    browserLocalPersistence
);
const provider = new GoogleAuthProvider(); 
 
console.log("Firebase initialized successfully."); 
 
 
// ====================================================== 
// الأقسام 
// ====================================================== 
 
const SECTIONS = { 
    SALE: "sale", 
    PENDING: "maintenance-pending", 
    READY: "maintenance-ready", 
    FAILED: "maintenance-failed", 
    DELIVERED: "maintenance-delivered" 
}; 
 
const sectionNames = { 
    [SECTIONS.SALE]: "البيع", 
    [SECTIONS.PENDING]: "قيد الإصلاح", 
    [SECTIONS.READY]: "جاهز", 
    [SECTIONS.FAILED]: "لم يتم الإصلاح", 
    [SECTIONS.DELIVERED]: "تم التسليم" 
}; 
 
 
// ====================================================== 
// اللغة 
// ====================================================== 
 
let currentLanguage = 
    localStorage.getItem( 
        "actPhoneManager_language" 
    ) || "ar"; 
 
 
const translations = { 
 
    ar: { 
 
        loginTitle: "🔐 تسجيل الدخول", 
        loginWelcome: 
            "أهلاً بك في نظام إدارة أكت للموبايلات", 
 
        emailPlaceholder: 
            "📧 البريد الإلكتروني", 
 
        passwordPlaceholder: 
            "🔒 كلمة المرور", 
 
        emailLogin: 
            "🔑 دخول إلى النظام", 
 
        googleLogin: 
            "🔵 تسجيل الدخول باستخدام Google", 
 
        loginOr: "أو", 
 
        systemOnline: 
            "SYSTEM ONLINE • SECURE ACCESS", 
 
        headerTitle: 
            "Act Phone Manager", 
 
        headerSubtitle: 

       " إدارة متكاملة.. لخدمة أسرع وأدق", 
 
        online: 
            "SYSTEM ONLINE", 
 
        english: 
            "English", 
 
        arabic: 
            "العربية", 
 
        light: 
            "Light", 
 
        dark: 
            "Dark", 
 
        sale: 
            "📱 الأجهزة والبيع", 
 
        maintenance: 
            "👥 العملاء والصيانة", 
 
        employees: 
            "👨‍🔧 العاملين", 
 
        addSale: 
            "➕ إضافة جهاز جديد", 
 
        pending: 
            "🟡 قيد الإصلاح", 
 
        ready: 
            "🟢 جاهز", 
 
        failed: 
            "🔴 لم يتم الإصلاح", 
 
        delivered: 
            "📦 تم التسليم", 
 
        logout: 
            "🚪 تسجيل الخروج", 
 
        edit: 
            "✏️ تعديل", 
 
        delete: 
            "🗑️ حذف", 
 
        save: 
            "💾 حفظ", 
 
        cancel: 
            "✕ إلغاء", 
 
        deviceStatus: 
            "حالة الجهاز", 
 
        phone: 
            "الجهاز", 
 
        customer: 
            "صاحب الجهاز", 
 
        date: 
            "التاريخ", 
 
        time: 
            "الوقت", 
 
        problem: 
            "العيب", 
 
        changedParts: 
            "الأجزاء التي يتم تغييرها", 
 
        price: 
            "السعر", 
 
        notes: 
            "ملاحظات", 
 
        employee: 
            "العامل", 
 
        noDevices: 
            "لا توجد أجهزة هنا", 
 
        noEmployees: 
            "لا يوجد عاملين" 
 
    }, 
 
    en: { 
 
        loginTitle: 
            "🔐 Login", 
 
        loginWelcome: 
            "Welcome to Act Phone Manager", 
 
        emailPlaceholder: 
            "📧 Email", 
 
        passwordPlaceholder: 
            "🔒 Password", 
 
        emailLogin: 
            "🔑 Login", 
 
        googleLogin: 
            "🔵 Continue with Google", 
 
        loginOr: 
            "OR", 
 
        systemOnline: 
            "SYSTEM ONLINE • SECURE ACCESS", 
 
        headerTitle: 
            "Act Phone Manager", 
 
        headerSubtitle: 
            "Act Mobile Shop Management System", 
 
        online: 
            "SYSTEM ONLINE", 
 
        english: 
            "English", 
 
        arabic: 
            "العربية", 
 
        light: 
            "Light", 
 
        dark: 
            "Dark", 
 
        sale: 
            "📱 Sales", 
 
        maintenance: 
            "👥 Customers & Repair", 
 
        employees: 
            "👨‍🔧 Employees", 
 
        addSale: 
            "➕ Add New Device", 
 
        pending: 
            "🟡 In Repair", 
 
        ready: 
            "🟢 Ready", 
 
        failed: 
            "🔴 Not Repaired", 
 
        delivered: 
            "📦 Delivered", 
 
        logout: 
            "🚪 Logout", 
 
        edit: 
            "✏️ Edit", 
 
        delete: 
            "🗑️ Delete", 
 
        save: 
            "💾 Save", 
 
        cancel: 
            "✕ Cancel", 
 
        deviceStatus: 
            "Device Status", 
 
        phone: 
            "Device", 
 
        customer: 
            "Customer", 
 
        date: 
            "Date", 
 
        time: 
            "Time", 
 
        problem: 
            "Problem", 
 
        changedParts: 
            "Changed Parts", 
 
        price: 
            "Price", 
 
        notes: 
            "Notes", 
 
        employee: 
            "Employee", 
 
        noDevices: 
            "No devices here", 
 
        noEmployees: 
            "No employees" 
 
    } 
 
}; 
 
 
function t(key) { 
 
    return ( 
        translations[currentLanguage] && 
        translations[currentLanguage][key] 
    ) || key; 
} 
 
 
// ====================================================== 
// تطبيق اللغة 
// ====================================================== 
 
 function applyLanguage() {

    const html = document.documentElement;

    html.lang = currentLanguage;

    html.dir =
        currentLanguage === "ar"
            ? "rtl"
            : "ltr";


    const themeText =
        document.getElementById("theme-toggle-text");

    const themeButton =
        document.getElementById("theme-toggle");


    const theme =
        localStorage.getItem("actPhoneManager_theme")
        || "dark";


    if (themeText) {

        themeText.textContent =
            theme === "dark"
                ? t("light")
                : t("dark");

    }


    if (themeButton) {

        themeButton.title =
            theme === "dark"
                ? "Light Mode"
                : "Dark Mode";

    }


    updateStaticTexts();


    // =========================================
    // تحديث المحتوى بدون تغيير القسم المفتوح
    // =========================================

    if (currentSection === SECTIONS.SALE) {

        renderSaleDevices();

        return;
    }


    if (
        [
            SECTIONS.PENDING,
            SECTIONS.READY,
            SECTIONS.FAILED,
            SECTIONS.DELIVERED
        ].includes(currentSection)
    ) {

        renderMaintenance();

        return;
    }


    if (currentSection === "employees") {

        if (currentEmployeeView === "form") {

            return;
        }


        if (currentEmployeeView === "attendance") {

            renderAttendance();

            return;
        }


        if (currentEmployeeView === "salaries") {

            renderSalaries();

            return;
        }


        if (currentEmployeeView === "statistics") {

            renderEmployeeStatistics();

            return;
        }


        renderEmployees();

    }

}
 
// ====================================================== 
// تطبيق المظهر 
// ====================================================== 
 
function applyTheme() { 
 
    const theme = 
        localStorage.getItem( 
            "actPhoneManager_theme" 
        ) || "dark"; 
 
    document.documentElement.dataset.theme = 
        theme; 
 
    const themeText = 
        document.getElementById( 
            "theme-toggle-text" 
        ); 
 
    const themeButton = 
        document.getElementById( 
            "theme-toggle" 
        ); 
 
    if (themeText) { 
 
        themeText.textContent = 
            theme === "dark" 
                ? t("light") 
                : t("dark"); 
    } 
 
    if (themeButton) { 
 
        themeButton.title = 
            theme === "dark" 
                ? "Light Mode" 
                : "Dark Mode"; 
    } 
} 
 
 
// ====================================================== 
// تغيير المظهر 
// ====================================================== 
 
function toggleTheme() { 
 
    const current = 
        localStorage.getItem( 
            "actPhoneManager_theme" 
        ) || "dark"; 
 
    const next = 
        current === "dark" 
            ? "light" 
            : "dark"; 
 
    localStorage.setItem( 
        "actPhoneManager_theme", 
        next 
    ); 
 
    applyTheme(); 
} 
 

// ======================================================
// LANGUAGE & THEME CONTROLS
// ======================================================

const themeToggle =
    document.getElementById("theme-toggle");


if (themeToggle) {
    themeToggle.addEventListener(
        "click",
        toggleTheme
    );
}


// تطبيق المظهر عند تشغيل البرنامج
applyTheme();

 
 
// ======================================================
// المتغيرات
// ======================================================

let editingDeviceId = null;

let currentSection =
    SECTIONS.SALE;

window.addEventListener("act-workspace-restored", function (event) {
    const restoredSection = event.detail?.maintenanceSection;
    if (restoredSection && Object.values(SECTIONS).includes(restoredSection)) {
        currentSection = restoredSection;
        if (typeof renderCurrentView === "function") renderCurrentView();
    }
});

let formSection =
    SECTIONS.SALE;

let editingEmployeeId = null;

let currentEmployeeView =
    "main";

let devices = [];

let employees = [];

let currentUser = null;

// ======================================================
// AUTH MODE VARIABLES
// ======================================================

// البريد المرجعي لوضع تسجيل الدخول
let authModeBaselineEmail = "";

// هل تم تفعيل وضع تسجيل الدخول من قبل؟
let authLoginBaselineActive = false;

 // ======================================================
// DOM
// ======================================================

const loginPage =
    document.getElementById(
        "login-page"
    );

const emailLoginButton =
    document.getElementById(
        "email-login-button"
    );

const googleLoginButton =
    document.getElementById(
        "google-login-button"
    );

const createAccountButton =
    document.getElementById(
        "create-account-button"
    );

const loginEmail =
    document.getElementById(
        "login-email"
    );

const loginPassword =
    document.getElementById(
        "login-password"
    );

const salesArea =
    document.querySelector(
        ".sales-area"
    );

const customersSection =
    document.getElementById(
        "customers-section"
    );

const employeesSection =
    document.getElementById(
        "employees-section"
    );

const employeesSectionButton =
    document.getElementById(
        "employees-section-button"
    );

const sectionButtons =
    document.querySelectorAll(
        ".sections-buttons .section-button"
    );

const saleAddButton =
    document.getElementById(
        "sale-add-button"
    );

const deviceForm =
    document.getElementById(
        "device-form"
    );

const closeDeviceFormButton =
    document.getElementById(
        "close-device-form-button"
    );

const deviceList =
    document.getElementById(
        "devices-list"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const maintenanceButtons =
    document.querySelectorAll(
        ".maintenance-buttons button"
    );

const phoneName =
    document.getElementById(
        "phone-name"
    );

const customerName =
    document.getElementById(
        "customer-name"
    );

const receiveDate =
    document.getElementById(
        "receive-date"
    );

const receiveTime =
    document.getElementById(
        "receive-time"
    );

const problem =
    document.getElementById(
        "problem"
    );

const changedParts =
    document.getElementById(
        "changed-parts"
    );

const price =
    document.getElementById(
        "price"
    );

const notes =
    document.getElementById(
        "notes"
    );

// رقم السيريال يتم إنشاؤه تلقائياً داخل نموذج الجهاز إذا لم يكن موجوداً في HTML.
let serialNumber =
    document.getElementById(
        "serial-number"
    );

const saveDeviceButton =
    deviceForm
        ? deviceForm.querySelector(
            ".save-button"
        )
        : null;

ensureSerialField();
 
 
// ====================================================== 
// طباعة بيانات العامل 
// ====================================================== 
 
function printEmployeeData(id) {
    const employee = employees.find(item => item.id === id);
    if (!employee) return;

    // بطاقة الطباعة لا تعرض أي بيانات خاصة أو كود الحضور.
    const title = currentLanguage === "ar" ? "بطاقة العامل" : "Employee Card";
    const html = `<!DOCTYPE html>
<html lang="${currentLanguage}" dir="${currentLanguage === "ar" ? "rtl" : "ltr"}">
<head><meta charset="UTF-8"><title>${escapeHTML(title)}</title>
<style>
body{font-family:Arial,sans-serif;padding:30px;color:#111;background:#fff}
.card{max-width:520px;margin:35px auto;border:2px solid #111;border-radius:18px;padding:32px;text-align:center}
.number{font-size:18px;font-weight:700;margin:15px 0;color:#444}
h1{font-size:27px;margin:18px 0}.brand{font-size:14px;letter-spacing:2px;color:#555}
@media print{body{padding:0}.card{margin:0 auto;border:2px solid #111}}

/* auto light layer */

:where(html[data-theme="light"]) .card {
  border: 2px solid #c5c5c5;
}</style></head><body><div class="card">
<div class="brand">ACT MANAGER</div><h1>${escapeHTML(employee.name || "-")}</h1>
<div class="number">${currentLanguage === "ar" ? "رقم العامل" : "Employee No."}: #${escapeHTML(String(employees.findIndex(item => item.id === id) + 1))}</div>
</div><script>window.onload=function(){window.print();};<\/script></body></html>`;
    const printWindow = window.open("", "_blank", "width=700,height=500");
    if (!printWindow) {
        alert(currentLanguage === "ar" ? "السماح بالنوافذ المنبثقة مطلوب للطباعة." : "Please allow pop-ups to print.");
        return;
    }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
}

// ====================================================== 
// Employee DOM 
// ====================================================== 
 
const addEmployeeButton = 
    document.getElementById( 
        "add-employee-button" 
    ); 
 
const attendanceButton = 
    document.getElementById( 
        "employees-attendance-button" 
    ); 
 
const salariesButton = 
    document.getElementById( 
        "employees-salaries-button" 
    ); 
 
const statisticsButton = 
    document.getElementById( 
        "employees-statistics-button" 
    ); 
 
const employeeForm = 
    document.getElementById( 
        "employee-form" 
    ); 
 
const saveEmployeeButton = 
    document.getElementById( 
        "save-employee-button" 
    ); 
 
const cancelEmployeeButton = 
    document.getElementById( 
        "cancel-employee-button" 
    ); 
 
const employeesList = 
    document.getElementById( 
        "employees-list" 
    ); 
 
const attendanceSection = 
    document.getElementById( 
        "attendance-section" 
    ); 
 
const salariesSection = 
    document.getElementById( 
        "salaries-section" 
    ); 
 
const employeeStatisticsSection = 
    document.getElementById( 
        "employee-statistics-section" 
    ); 
 
const attendanceList = 
    document.getElementById( 
        "attendance-list" 
    ); 
 
const salariesList = 
    document.getElementById( 
        "salaries-list" 
    ); 
 
const employeeStatistics = 
    document.getElementById( 
        "employee-statistics" 
    ); 
 
const employeeName = 
    document.getElementById( 
        "employee-name" 
    ); 
 
const employeePhone = 
    document.getElementById( 
        "employee-phone" 
    ); 
 
const employeeJob = 
    document.getElementById( 
        "employee-job" 
    ); 
 
const employeeStartDate = 
    document.getElementById( 
        "employee-start-date" 
    ); 
 
const employeeSalary = 
    document.getElementById( 
        "employee-salary" 
    ); 
 
const employeeNotes = 
    document.getElementById( 
        "employee-notes" 
    ); 
 
const totalEmployees = 
    document.getElementById( 
        "total-employees" 
    ); 
 
const presentEmployees = 
    document.getElementById( 
        "present-employees" 
    ); 
 
const absentEmployees = 
    document.getElementById( 
        "absent-employees" 
    ); 
 
const totalSalaries = 
    document.getElementById( 
        "total-salaries" 
    ); 
 
 
// ====================================================== 
// تحديث النصوص الموجودة في HTML 
// ====================================================== 
 
function updateStaticTexts() { 
 
    const loginTitle = 
        document.querySelector( 
            ".login-box h1" 
        ); 
 
    if (loginTitle) { 
        loginTitle.textContent = 
            t("loginTitle"); 
    } 
 
 
    const loginWelcome = 
        document.querySelector( 
            ".login-box > p" 
        ); 
 
    if (loginWelcome) { 
 
        loginWelcome.innerHTML = 
            currentLanguage === "ar" 
                ? `أهلاً بك في نظام إدارة <strong>أكت للموبايلات</strong>` 
                : `Welcome to <strong>Act Phone Manager</strong>`; 
    } 
 
 
    if (loginEmail) { 
 
        loginEmail.placeholder = 
            t("emailPlaceholder"); 
    } 
 
 
    if (loginPassword) { 
 
        loginPassword.placeholder = 
            t("passwordPlaceholder"); 
    } 
 
 
    if (emailLoginButton) { 
 
        if (!emailLoginButton.disabled) { 
            emailLoginButton.textContent = 
                t("emailLogin"); 
        } 
    } 
 
 
    if (googleLoginButton) { 
 
        if (!googleLoginButton.disabled) { 
            googleLoginButton.textContent = 
                t("googleLogin"); 
        } 
    } 
 
 
    const loginOr = 
        document.querySelector( 
            ".login-or" 
        ); 
 
    if (loginOr) { 
        loginOr.textContent = 
            t("loginOr"); 
    } 
 
 
    const loginStatus = 
        document.querySelector( 
            ".login-status" 
        ); 
 
    if (loginStatus) { 
        loginStatus.textContent = 
            t("systemOnline"); 
    } 
 
 
    const headerTitle = 
        document.querySelector( 
            ".header h1" 
        ); 
 
    if (headerTitle) { 
        headerTitle.textContent = 
            t("headerTitle"); 
    } 
 
 
    const headerSubtitle = 
        document.querySelector( 
            ".header p" 
        ); 
 
    if (headerSubtitle) { 
        headerSubtitle.textContent = 
            t("headerSubtitle"); 
    } 
 
 
    const onlineStatus = 
        document.querySelector( 
            ".header-status" 
        ); 
 
    if (onlineStatus) { 
        onlineStatus.textContent = 
            t("online"); 
    } 
 
 
    if (saleAddButton) { 
        saleAddButton.textContent = 
            t("addSale"); 
    } 
 
 
    const sectionButtonTexts = 
        document.querySelectorAll( 
            ".section-button" 
        ); 
 
    sectionButtonTexts.forEach( 
        function (button, index) { 
 
            if (index === 0) { 
                button.textContent = 
                    t("sale"); 
            } 
 
            if (index === 1) { 
                button.textContent = 
                    t("maintenance"); 
            } 
 
            if (index === 2) { 
                button.textContent = 
                    t("employees"); 
            } 
        } 
    ); 
 
 
    if (searchInput) { 
 
        searchInput.placeholder = 
            currentLanguage === "ar" 
                ? "🔎 بحث باسم الجهاز أو صاحب الجهاز أو السيريال" 
                : "🔎 Search device, customer or serial"; 
    } 
 
 
    if (phoneName) { 
 
        phoneName.placeholder = 
            currentLanguage === "ar" 
                ? "اسم الجهاز" 
                : "Device name"; 
    } 
 
 
    if (customerName) { 
 
        customerName.placeholder = 
            currentLanguage === "ar" 
                ? "اسم صاحب الجهاز" 
                : "Customer name"; 
    } 
 
 
    if (problem) { 
 
        problem.placeholder = 
            currentLanguage === "ar" 
                ? "وصف العيب" 
                : "Problem description"; 
    } 
 
 
    if (changedParts) { 
 
        changedParts.placeholder = 
            currentLanguage === "ar" 
                ? "الأجزاء التي يتم تغييرها" 
                : "Changed parts"; 
    } 
 
 
    if (notes) { 
 
        notes.placeholder = 
            currentLanguage === "ar" 
                ? "ملاحظات" 
                : "Notes"; 
    } 
 
 
    if (employeeName) { 
 
        employeeName.placeholder = 
            currentLanguage === "ar" 
                ? "اسم العامل" 
                : "Employee name"; 
    } 
 
 
    if (employeePhone) { 
 
        employeePhone.placeholder = 
            currentLanguage === "ar" 
                ? "رقم الهاتف" 
                : "Phone number"; 
    } 
 
 
    if (employeeJob) { 
 
        employeeJob.placeholder = 
            currentLanguage === "ar" 
                ? "الوظيفة" 
                : "Job"; 
    } 
 
 
    if (employeeNotes) { 
 
        employeeNotes.placeholder = 
            currentLanguage === "ar" 
                ? "ملاحظات" 
                : "Notes"; 
    } 
} 
 
// ======================================================
// Firebase Authentication
// ======================================================

// ======================================================
// EMAIL LOGIN
// ======================================================

async function loginWithEmail() {

    if (emailLoginButton) {
        emailLoginButton.disabled = true;
        emailLoginButton.textContent =
            currentLanguage === "ar"
                ? "جاري تسجيل الدخول..."
                : "Signing in...";
    }

    try {

        await authPersistenceReady;

        if (!navigator.onLine) {
            alert(
                currentLanguage === "ar"
                    ? "لا يمكن إنشاء حساب جديد بدون اتصال بالإنترنت. تحقق من الاتصال وحاول مرة أخرى."
                    : "An internet connection is required to create an account. Please reconnect and try again."
            );
            return;
        }

        const email = loginEmail
            ? loginEmail.value.trim()
            : "";

        const password = loginPassword
            ? loginPassword.value
            : "";

        if (!email || !password) {
            alert(
                currentLanguage === "ar"
                    ? "من فضلك أدخل البريد الإلكتروني وكلمة المرور."
                    : "Please enter your email and password."
            );
            return;
        }

        const userCredential =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        await userCredential.user.reload();

        const currentAuthUser = auth.currentUser;

        if (
            currentAuthUser &&
            !currentAuthUser.emailVerified
        ) {

            await signOut(auth);

            setAuthScreenMode("login");

            alert(
                currentLanguage === "ar"
                    ? "حسابك غير مؤكد. افتح رسالة التأكيد في بريدك الإلكتروني أولاً."
                    : "Your email is not verified. Please check your inbox."
            );

            return;
        }

        setAuthScreenMode("login");

    } catch (error) {

        console.error("Email login error:", error);

        let message =
            currentLanguage === "ar"
                ? "حدث خطأ أثناء تسجيل الدخول."
                : "Login failed.";

        if (
            error &&
            (
                error.code === "auth/invalid-credential" ||
                error.code === "auth/wrong-password" ||
                error.code === "auth/user-not-found"
            )
        ) {
            message =
                currentLanguage === "ar"
                    ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
                    : "Incorrect email or password.";
        }

        if (
            error &&
            error.code === "auth/too-many-requests"
        ) {
            message =
                currentLanguage === "ar"
                    ? "تم إيقاف محاولات تسجيل الدخول مؤقتًا. حاول لاحقًا."
                    : "Too many attempts. Please try again later.";
        }

        if (
            error &&
            error.code === "auth/invalid-email"
        ) {
            message =
                currentLanguage === "ar"
                    ? "البريد الإلكتروني غير صحيح."
                    : "Invalid email address.";
        }

        alert(message);

    } finally {

        if (emailLoginButton) {
            emailLoginButton.disabled = false;
            emailLoginButton.textContent = t("emailLogin");
        }
    }
}


// ======================================================
// CREATE NEW ACCOUNT
// ======================================================

async function createNewAccount() {

    if (createAccountButton) {
        createAccountButton.disabled = true;
        createAccountButton.textContent =
            currentLanguage === "ar"
                ? "جاري إنشاء الحساب..."
                : "Creating account...";
    }

    try {

        await authPersistenceReady;

        const email = loginEmail
            ? loginEmail.value.trim()
            : "";

        const password = loginPassword
            ? loginPassword.value
            : "";

        if (!email || !password) {
            alert(
                currentLanguage === "ar"
                    ? "أدخل البريد الإلكتروني وكلمة المرور أولاً."
                    : "Please enter your email and password."
            );
            return;
        }

        if (password.length < 6) {
            alert(
                currentLanguage === "ar"
                    ? "كلمة المرور لازم تكون 6 أحرف على الأقل."
                    : "Password must be at least 6 characters."
            );
            return;
        }

        const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        await sendEmailVerification(
            userCredential.user,
            {
                url: window.location.href
            }
        );

        // التحويل إلى وضع تسجيل الدخول
        setAuthScreenMode("login");

        // تسجيل الخروج حتى يؤكد العميل بريده
        await signOut(auth);

        alert(
            currentLanguage === "ar"
                ? "تم إنشاء الحساب بنجاح وإرسال رسالة التأكيد. افتح بريدك الإلكتروني واضغط على رابط التأكيد، ثم سجل الدخول."
                : "Account created successfully. A verification email has been sent. Verify your email, then sign in."
        );

    } catch (error) {

        console.error("Create account error:", error);

        let message =
            currentLanguage === "ar"
                ? "حدث خطأ أثناء إنشاء الحساب."
                : "An error occurred while creating the account.";

        if (
            error &&
            error.code === "auth/email-already-in-use"
        ) {

            setAuthScreenMode("login");

            message =
                currentLanguage === "ar"
                    ? "هذا البريد مسجل بالفعل. تم تحويل الشاشة إلى تسجيل الدخول. استخدم كلمة المرور أو استعادة كلمة المرور."
                    : "This email is already registered. The screen has switched to sign in.";
        }

        if (
            error &&
            error.code === "auth/invalid-email"
        ) {
            message =
                currentLanguage === "ar"
                    ? "البريد الإلكتروني غير صحيح."
                    : "Invalid email address.";
        }

        if (
            error &&
            error.code === "auth/weak-password"
        ) {
            message =
                currentLanguage === "ar"
                    ? "كلمة المرور ضعيفة. استخدم 6 أحرف على الأقل."
                    : "Password is too weak. Use at least 6 characters.";
        }

        if (
            error &&
            error.code === "auth/too-many-requests"
        ) {
            message =
                currentLanguage === "ar"
                    ? "محاولات كثيرة. حاول مرة أخرى لاحقًا."
                    : "Too many attempts. Try again later.";
        }

        alert(message);

    } finally {

        if (createAccountButton) {
            createAccountButton.disabled = false;
            createAccountButton.textContent =
                currentLanguage === "ar"
                    ? "إنشاء حساب جديد"
                    : "Create Account";
        }
    }
}


// ======================================================
// GOOGLE LOGIN
// ======================================================

async function loginWithGoogle() {

    if (googleLoginButton) {
        googleLoginButton.disabled = true;
        googleLoginButton.textContent =
            currentLanguage === "ar"
                ? "جاري الدخول..."
                : "Signing in...";
    }

    try {

        await authPersistenceReady;

        await signInWithPopup(
            auth,
            provider
        );

    } catch (error) {

        console.error("Google login error:", error);

        let message =
            currentLanguage === "ar"
                ? "تعذر تسجيل الدخول باستخدام Google."
                : "Google sign-in failed.";

        if (
            error &&
            error.code === "auth/popup-closed-by-user"
        ) {
            message =
                currentLanguage === "ar"
                    ? "تم إغلاق نافذة تسجيل الدخول."
                    : "The sign-in window was closed.";
        }

        if (
            error &&
            error.code === "auth/unauthorized-domain"
        ) {
            message =
                currentLanguage === "ar"
                    ? "هذا النطاق غير مصرح به في Firebase Authentication."
                    : "This domain is not authorized in Firebase Authentication.";
        }

        if (
            error &&
            error.code === "auth/account-exists-with-different-credential"
        ) {
            message =
                currentLanguage === "ar"
                    ? "هذا البريد مرتبط بطريقة تسجيل دخول أخرى. جرّب تسجيل الدخول بالبريد الإلكتروني."
                    : "This email is associated with another sign-in method. Try email sign-in.";
        }

        if (
            error &&
            error.code === "auth/popup-blocked"
        ) {
            message =
                currentLanguage === "ar"
                    ? "المتصفح منع نافذة Google. اسمح بالنوافذ المنبثقة وحاول مرة أخرى."
                    : "The browser blocked the Google popup. Allow popups and try again.";
        }

        alert(message);

    } finally {

        if (googleLoginButton) {
            googleLoginButton.disabled = false;
            googleLoginButton.textContent = t("googleLogin");
        }
    }
}


// ======================================================
// PASSWORD RESET
// ======================================================

async function resetUserPassword() {

    try {

        // انتظار تجهيز حفظ الجلسة
        await authPersistenceReady;

        const email = loginEmail
            ? loginEmail.value.trim()
            : "";

        if (!email) {

            alert(
                currentLanguage === "ar"
                    ? "اكتب بريدك الإلكتروني أولاً."
                    : "Please enter your email first."
            );

            return;
        }

        await sendPasswordResetEmail(
            auth,
            email
        );

        alert(
            currentLanguage === "ar"
                ? "تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني. راجع صندوق الوارد والرسائل غير المرغوب فيها."
                : "A password reset link has been sent to your email. Check your inbox and spam folder."
        );

    } catch (error) {

        console.error(
            "Password reset error:",
            error
        );

        let message =
            currentLanguage === "ar"
                ? "تعذر إرسال رابط استعادة كلمة المرور."
                : "Unable to send password reset email.";

        if (
            error.code === "auth/invalid-email"
        ) {

            message =
                currentLanguage === "ar"
                    ? "البريد الإلكتروني غير صحيح."
                    : "Invalid email address.";
        }

        if (
            error.code === "auth/too-many-requests"
        ) {

            message =
                currentLanguage === "ar"
                    ? "محاولات كثيرة. حاول مرة أخرى لاحقًا."
                    : "Too many attempts. Try again later.";
        }

        alert(message);
    }
}


// ======================================================
// AUTHENTICATION BUTTONS
// ======================================================

if (emailLoginButton) {

    emailLoginButton.addEventListener(
        "click",
        loginWithEmail
    );
}


if (createAccountButton) {

    createAccountButton.addEventListener(
        "click",
        createNewAccount
    );
}


if (googleLoginButton) {

    googleLoginButton.addEventListener(
        "click",
        loginWithGoogle
    );
}


// ======================================================
// PASSWORD RESET BUTTON
// ======================================================

const resetPasswordButton =
    document.getElementById("reset-password-button");

if (resetPasswordButton) {

    resetPasswordButton.addEventListener(
        "click",
        resetUserPassword
    );
}


// ======================================================
// AUTH STATE
// ======================================================

// ======================================================
// فتح البرنامج بعد التأكد من الحساب
// ======================================================

async function openAppForUser(user) {

    if (!user) return;

    // منع تحميل البرنامج أكثر من مرة لنفس المستخدم
    if (
        currentUser &&
        currentUser.uid === user.uid &&
        mainPage &&
        mainPage.style.display !== "none"
    ) {
        return;
    }

    currentUser = user;

    const bottomNavigation =
        document.getElementById("bottom-navigation");

    if (loginPage) {
        loginPage.style.display = "none";
    }

    if (mainPage) {
        mainPage.style.display = "block";
    }

    if (bottomNavigation) {
        bottomNavigation.style.display = "flex";
    }

// مزامنة بيانات الحساب مع السحابة قبل تحميلها
try {

    await syncUserDataWithCloud(user);

} catch (error) {

    console.error(
        "ACT Cloud Sync Error:",
        error
    );

    alert(
        "تعذر الاتصال بالسحابة حاليًا. سيتم فتح البيانات المحلية."
    );

}
// فتح الشاشة الرئيسية بعد تسجيل الدخول
currentSection = "home";

// تحميل بيانات البرنامج
loadUserData();

// الأقسام تعيد تحميل بيانات المستخدم بعد اكتمال المزامنة السحابية.
window.dispatchEvent(new Event("act-user-data-ready"));

ensurePreviousDaysClosed();
if (typeof window.renderDashboardHistory === "function") window.renderDashboardHistory();

// إظهار الرئيسية وإخفاء قسم الأجهزة
const homeSectionOnLogin =
    document.getElementById("home-section");

const devicesSectionOnLogin =
    document.querySelector(".sales-area");

if (devicesSectionOnLogin) {
    devicesSectionOnLogin.style.display = "none";
}

if (homeSectionOnLogin) {
    homeSectionOnLogin.style.display = "block";
};

    applyLanguage();

    applyTheme();
}


// ======================================================
// AUTH SCREEN MODE
// ======================================================

function setAuthScreenMode(mode) {

    // حفظ البريد المرجعي عند تفعيل تسجيل الدخول
    if (mode === "login") {

        authModeBaselineEmail =
            loginEmail
                ? loginEmail.value.trim()
                : "";

        authLoginBaselineActive = true;
    }

    localStorage.setItem(
        "actPhoneManager_authMode",
        mode
    );

    if (emailLoginButton) {
        emailLoginButton.style.display =
            mode === "login" ? "flex" : "none";
    }

    if (createAccountButton) {
        createAccountButton.style.display =
            mode === "create" ? "flex" : "none";
    }
}


// ======================================================
// AUTO SWITCH WHEN EMAIL CHANGES
// ======================================================

if (loginEmail) {

    loginEmail.addEventListener(
        "input",
        function () {

            const currentEmail =
                loginEmail.value.trim();

            // FIX activation is followed by sign-in to an existing account only.
            setAuthScreenMode("login");
        }
    );
}


// ======================================================
// عرض شاشة تسجيل الدخول
// ======================================================

function showLoginPage() {

    currentUser = null;

    const bottomNavigation =
        document.getElementById("bottom-navigation");

    if (loginPage) {
        loginPage.style.display = "flex";
    }

    if (mainPage) {
        mainPage.style.display = "none";
    }

    if (bottomNavigation) {
        bottomNavigation.style.display = "none";
    }

    devices = [];

    employees = [];

    // استعادة وضع أزرار تسجيل الدخول
    const savedMode =
        localStorage.getItem(
            "actPhoneManager_authMode"
        );

    if (savedMode === "login") {

        setAuthScreenMode("login");

    } else {

        setAuthScreenMode("create");
    }
}

// ======================================================
// فحص تأكيد البريد عند الرجوع للموقع
// ======================================================

async function checkEmailVerificationOnReturn() {

    const user = auth.currentUser;

    if (!user) return;

    const isEmailAccount =
        user.providerData.some(function (provider) {
            return provider.providerId === "password";
        });

    if (!isEmailAccount) return;

    try {

        await user.reload();

        const refreshedUser = auth.currentUser;

        if (
            refreshedUser &&
            refreshedUser.emailVerified
        ) {

            openAppForUser(refreshedUser);
        }

    } catch (error) {

        console.error(
            "Email verification check error:",
            error
        );
    }
}

// ======================================================
// ACT SUBSCRIPTION + DEVICE SECURITY GATE
// Server-authoritative: app stays locked if API is not configured.
// ======================================================
async function actControlRequest(user, path, payload = {}) {
    const base = String(window.ACT_CONTROL_API_URL || "").replace(/\/$/, "");
    if (!base || base.includes("REPLACE-WITH-YOUR-WORKER")) {
        throw new Error("لم يتم إعداد خدمة التحقق الآمن بعد. يجب نشر خدمة ACT Control أولًا.");
    }
    const idToken = await user.getIdToken();
    const response = await fetch(base + path, {
        method: "POST",
        headers: { "Authorization": "Bearer " + idToken, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store"
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const requestError = new Error(data.error || "تعذر التحقق من صلاحية الحساب.");
        requestError.status = response.status;
        throw requestError;
    }
    return data;
}

function actGetInstallationId() {
    // FIX activation and ACT device registration must use the same installation ID.
    const fixId = localStorage.getItem("actFixDeviceId");
    if (fixId && /^FIX-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(fixId)) return fixId;
    const key = "act_manager_installation_id_v1";
    let id = localStorage.getItem(key);
    if (!id) {
        if (crypto && typeof crypto.randomUUID === "function") id = crypto.randomUUID();
        else { const bytes = new Uint8Array(24); crypto.getRandomValues(bytes); id = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join(""); }
        localStorage.setItem(key, id);
    }
    return id;
}

function actHandleOwnerWarning(user, warning) {
    if (!warning || warning.read || !warning.id) return;
    const warningKey = "act_warning_seen_" + warning.id;
    if (sessionStorage.getItem(warningKey)) return;
    alert("تحذير من إدارة ACT:\n\n" + warning.message);
    sessionStorage.setItem(warningKey, "1");
    actControlRequest(user, "/api/customer/warning-read", { id: warning.id }).catch(() => {});
}

async function actControlGet(user, path) {
    const base = String(window.ACT_CONTROL_API_URL || "").replace(/\/$/, "");
    if (!base || base.includes("REPLACE-WITH-YOUR-WORKER")) throw new Error("خدمة ACT Control غير مهيأة.");
    const idToken = await user.getIdToken();
    const response = await fetch(base + path, { method: "GET", headers: { "Authorization": "Bearer " + idToken }, cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "تعذر تحميل بيانات الاشتراك.");
    return data;
}

function actEnsureSubscriptionBanner(user, entitlement) {
    const bannerId = "act-subscription-banner";
    let banner = document.getElementById(bannerId);

    // شريط الاشتراك داخل حاوية المحتوى العامة ليظل ظاهرًا عند التنقل بين جميع الأقسام.
    // يختفي للمالك وبعد تفعيل الاشتراك، ويظهر للعميل أثناء التجربة فقط.
    if (!user || !entitlement || entitlement.owner || entitlement.status !== "trial") {
        if (banner) banner.hidden = true;
        return;
    }

    const appContent = document.getElementById("app-content");
    const home = document.getElementById("home-section");
    if (!appContent || !home) return;

    if (!banner) {
        banner = document.createElement("section");
        banner.id = bannerId;
        banner.className = "act-subscription-banner";
        banner.innerHTML = '<div><strong id="act-subscription-banner-title">تجربتك المجانية في ACT Manager</strong><small id="act-subscription-banner-detail"></small></div><button type="button" id="act-subscription-banner-open">تفاصيل الاشتراك</button>';
        banner.querySelector("button").addEventListener("click", () => actRenderSubscriptionScreen(auth.currentUser, window.ACT_CONTROL_SESSION));
    }
    // يوضع قبل الأقسام داخل app-content وليس داخل home-section حتى لا يختفي عند تغيير القسم.
    if (banner.parentElement !== appContent || banner.nextElementSibling !== home) {
        appContent.insertBefore(banner, home);
    }

    const expiry = Number(entitlement.expiresAt || entitlement.trialEndAt || 0);
    const days = Math.max(0, Math.ceil((expiry - Date.now()) / 86400000));
    const title = document.getElementById("act-subscription-banner-title");
    const detail = document.getElementById("act-subscription-banner-detail");
    if (title) title.textContent = "تجربتك المجانية في ACT Manager";
    if (detail) detail.textContent = `متبقي ${days} يومًا من التجربة المجانية · الاشتراك السنوي 300 جنيه`;
    banner.hidden = false;
}

function actSetSubscriptionMessage(message, state = "") {
    const node = document.getElementById("act-subscription-request-state");
    if (!node) return;
    node.className = "act-subscription-state" + (state ? " is-" + state : "");
    node.textContent = message;
}

async function actRenderSubscriptionScreen(user, entitlement = window.ACT_CONTROL_SESSION) {
    const screen = document.getElementById("act-subscription-screen");
    const login = document.getElementById("login-page");
    const main = document.getElementById("main-page");
    const nav = document.getElementById("bottom-navigation");
    if (!screen) throw new Error("شاشة الاشتراك غير موجودة في index.html.");
    if (login) login.style.display = "flex";
    if (main) main.style.display = "none";
    if (nav) nav.style.display = "none";
    screen.hidden = false;
    const title = document.getElementById("act-subscription-title");
    const intro = screen.querySelector(".act-subscription-intro");
    if (entitlement && entitlement.status === "trial") {
        const days = Math.max(0, Math.ceil((Number(entitlement.expiresAt || entitlement.trialEndAt || 0) - Date.now()) / 86400000));
        if (title) title.textContent = "تجربتك المجانية ما زالت متاحة";
        if (intro) intro.textContent = `متبقي ${days} يومًا من تجربة ACT Manager المجانية. يمكنك الاشتراك السنوي الآن أو متابعة استخدام البرنامج خلال التجربة.`;
    } else if (entitlement && entitlement.status === "active") {
        if (title) title.textContent = "اشتراك ACT Manager مفعل";
        if (intro) intro.textContent = "يمكنك مراجعة تفاصيل التجديد السنوي بقيمة 300 جنيه لمدة 365 يومًا.";
    } else {
        if (title) title.textContent = "انتهت فترة التجربة المجانية";
        if (intro) intro.textContent = "اشترك لمدة سنة لاستكمال استخدام جميع أدوات إدارة المحل.";
    }
    let continueButton = document.getElementById("act-subscription-continue");
    const canContinue = entitlement && (entitlement.status === "trial" || entitlement.status === "active");
    if (canContinue && !continueButton) {
        continueButton = document.createElement("button");
        continueButton.type = "button";
        continueButton.id = "act-subscription-continue";
        continueButton.className = "act-subscription-continue";
        continueButton.textContent = "العودة إلى البرنامج";
        document.getElementById("act-subscription-signout")?.before(continueButton);
        continueButton.addEventListener("click", () => {
            screen.hidden = true;
            if (login) login.style.display = "none";
            if (main) main.style.display = "block";
            if (nav) nav.style.display = "flex";
        });
    }
    if (continueButton) continueButton.hidden = !canContinue;
    const form = document.getElementById("act-subscription-form");
    const submit = document.getElementById("act-subscription-submit");
    const transfer = document.getElementById("act-subscription-transfer");
    const receipt = document.getElementById("act-subscription-receipt");
    const signout = document.getElementById("act-subscription-signout");
    const setFormEnabled = enabled => { if (form) Array.from(form.elements).forEach(el => { el.disabled = !enabled; }); };
    try {
        const info = await actControlGet(user, "/api/customer/subscription");
        const request = info.request;
        if (request?.status === "pending") {
            actSetSubscriptionMessage("طلب الاشتراك الخاص بك قيد المراجعة منذ " + new Date(Number(request.createdAt || Date.now())).toLocaleString("ar-EG") + ". ستصلك الموافقة بعد مراجعة التحويل. لا ترسل طلبًا آخر الآن.", "pending");
            setFormEnabled(false);
        } else if (request?.status === "rejected") {
            actSetSubscriptionMessage("لم تتم الموافقة على الطلب السابق. السبب: " + (request.rejectionReason || "يرجى مراجعة رقم التحويل والإيصال ثم إعادة الإرسال."), "rejected");
            setFormEnabled(true);
        } else {
            const status = entitlement?.status || window.ACT_CONTROL_SESSION?.status;
            if (status === "trial") {
                const expiry = Number(entitlement?.expiresAt || entitlement?.trialEndAt || window.ACT_CONTROL_SESSION?.trialEndAt || 0);
                const days = Math.max(0, Math.ceil((expiry - Date.now()) / 86400000));
                actSetSubscriptionMessage(`تجربتك المجانية ما زالت نشطة، متبقي ${days} يومًا. يمكنك الاستمرار في استخدام البرنامج أو إرسال طلب الاشتراك السنوي الآن.`);
            } else if (status === "active") {
                actSetSubscriptionMessage("اشتراكك السنوي مفعل حاليًا. يمكنك إرسال طلب تجديد مبكر إذا رغبت.");
            } else {
                actSetSubscriptionMessage("انتهت صلاحية التجربة أو الاشتراك. حوّل 300 جنيه إلى رقم فودافون كاش الموضح، ثم أرسل رقم العملية وصورة الإيصال.");
            }
            setFormEnabled(true);
        }
    } catch (error) {
        actSetSubscriptionMessage(error.message || "تعذر تحميل حالة الطلب. تحقق من الاتصال ثم أعد تحميل الصفحة.", "rejected");
        setFormEnabled(true);
    }
    if (form && !form.dataset.bound) {
        form.dataset.bound = "1";
        form.addEventListener("submit", async event => {
            event.preventDefault();
            if (!user || !transfer?.value.trim() || !receipt?.files?.[0]) {
                actSetSubscriptionMessage("اكتب رقم التحويل واختر صورة الإيصال أولًا.", "rejected");
                return;
            }
            const file = receipt.files[0];
            if (!String(file.type || "").startsWith("image/") || file.size > 10 * 1024 * 1024) {
                actSetSubscriptionMessage("اختر صورة صحيحة لا يتجاوز حجمها 10 ميجابايت.", "rejected");
                return;
            }
            try {
                submit.disabled = true;
                actSetSubscriptionMessage("جارٍ تجهيز صورة الإيصال وإرسال الطلب...");
                const receiptDataUrl = await actPrepareSubscriptionReceipt(file);
                const result = await actControlRequest(user, "/api/customer/subscription", {
                    action: "submit",
                    transferReference: transfer.value.trim(),
                    receiptDataUrl
                });
                form.reset();
                setFormEnabled(false);
                actSetSubscriptionMessage(result.message || "تم إرسال طلبك. انتظر مراجعة إدارة ACT.", "pending");
            } catch (error) {
                actSetSubscriptionMessage(error.message || "تعذر إرسال الطلب. حاول مرة أخرى.", "rejected");
                setFormEnabled(true);
            } finally {
                if (submit) submit.disabled = !!transfer?.disabled;
            }
        });
    }
    if (signout && !signout.dataset.bound) {
        signout.dataset.bound = "1";
        signout.addEventListener("click", async () => {
            if (window.__actControlHeartbeatTimer) clearInterval(window.__actControlHeartbeatTimer);
            await signOut(auth).catch(() => {});
            screen.hidden = true;
            showLoginPage();
        });
    }
}

async function actPrepareSubscriptionReceipt(file) {
    if (typeof createImageBitmap !== "function") throw new Error("المتصفح لا يدعم تجهيز صورة الإيصال. حدّث المتصفح ثم حاول مرة أخرى.");
    const bitmap = await createImageBitmap(file);
    const initialScale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
    let width = Math.max(1, Math.round(bitmap.width * initialScale)), height = Math.max(1, Math.round(bitmap.height * initialScale));
    const canvas = document.createElement("canvas");
    let dataUrl = "";
    for (let attempt = 0; attempt < 7; attempt++) {
        canvas.width = Math.max(1, Math.round(width));
        canvas.height = Math.max(1, Math.round(height));
        const ctx = canvas.getContext("2d");
        if (!ctx) break;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL("image/jpeg", Math.max(.38, .76 - attempt * .06));
        if (dataUrl.length <= 47000) break;
        width *= .82;
        height *= .82;
    }
    bitmap.close?.();
    if (!dataUrl || dataUrl.length > 48000) throw new Error("حجم صورة الإيصال ما زال كبيرًا. اختر صورة أصغر أو التقط صورة أوضح بحجم أقل.");
    return dataUrl;
}

async function actVerifySubscriptionAndDevice(user) {
    if (!navigator.onLine) throw new Error("يلزم الاتصال بالإنترنت عند فتح ACT للتحقق من الاشتراك والأجهزة.");
    const result = await actControlRequest(user, "/api/bootstrap", {
        deviceId: actGetInstallationId(),
        deviceLabel: (navigator.platform || "جهاز") + " · " + (navigator.userAgent.includes("Mobile") ? "موبايل" : "متصفح"),
        platform: navigator.userAgentData?.platform || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 ? "iPad" : navigator.platform) || "web",
        deviceModel: navigator.userAgentData?.model || "",
        userAgent: navigator.userAgent
    });
    if (!result.allowed) {
        if (result.status === "expired") {
            await actRenderSubscriptionScreen(user, result);
            return { blocked: true, status: "expired" };
        }
        throw new Error(result.reason || "هذا الحساب غير مسموح له بالدخول حاليًا.");
    }
    const subscriptionScreen = document.getElementById("act-subscription-screen");
    if (subscriptionScreen) subscriptionScreen.hidden = true;
    window.ACT_CONTROL_SESSION = result;
    actEnsureSubscriptionBanner(user, result);
    actHandleOwnerWarning(user, result.warning);
    if (window.__actControlHeartbeatTimer) clearInterval(window.__actControlHeartbeatTimer);
    window.__actControlHeartbeatTimer = setInterval(async () => {
        const current = auth.currentUser;
        if (!current) return;
        try {
            const ping = await actControlRequest(current, "/api/heartbeat", {
                deviceId: actGetInstallationId(), deviceLabel: navigator.platform || "جهاز",
                platform: navigator.userAgentData?.platform || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1 ? "iPad" : navigator.platform) || "web", deviceModel: navigator.userAgentData?.model || "", userAgent: navigator.userAgent
            });
            actHandleOwnerWarning(current, ping.warning);
            if (!ping.allowed) {
                clearInterval(window.__actControlHeartbeatTimer);
                alert(ping.reason || "تم إيقاف صلاحية هذا الحساب.");
                await signOut(auth);
                showLoginPage();
            }
        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                clearInterval(window.__actControlHeartbeatTimer);
                alert(error.message || "لم يعد هذا الجهاز مسموحًا له بالدخول.");
                await signOut(auth).catch(() => {});
                showLoginPage();
                return;
            }
            // Temporary connection loss does not erase the current session.
            console.warn("ACT entitlement heartbeat unavailable:", error.message);
        }
    }, 180000);
    return result;
}

// ACT cinematic welcome intro — يظهر عند فتح البرنامج قبل تسجيل الدخول.
async function showActFirstWelcome(appReady) {
    if (document.getElementById("act-first-welcome")) return;

    const layer = document.createElement("div");
    layer.id = "act-first-welcome";
    layer.setAttribute("role", "status");
    layer.setAttribute("aria-label", "مرحبًا بك في ACT Manager");
    layer.innerHTML = `
      <style>
        #act-first-welcome{position:fixed;inset:0;z-index:2147483000;overflow:hidden;display:grid;place-items:center;background:radial-gradient(ellipse at 50% 48%,rgba(255,255,255,0.154),transparent 42%),linear-gradient(145deg,#060606 0%,#141414 52%,#080808 100%);color:#e4e6eb;text-align:center;font-family:inherit;opacity:1}
        #act-first-welcome:before,#act-first-welcome:after{content:"";position:absolute;left:50%;top:50%;width:min(78vw,680px);height:min(78vw,680px);border:1px solid rgba(255,255,255,0.044);border-radius:50%;transform:translate(-50%,-50%) scale(.35);animation:actPortal 2.2s ease-out both;pointer-events:none}
        #act-first-welcome:after{width:min(58vw,500px);height:min(58vw,500px);animation-delay:.18s;border-color:rgba(255,255,255,0.048)}
        #act-first-welcome .welcome-core{position:relative;z-index:2;width:min(92vw,700px);padding:28px 18px;display:flex;flex-direction:column;align-items:center}
        #act-first-welcome .welcome-device{width:clamp(54px,9vw,86px);height:clamp(92px,15vw,142px);border:3px solid rgba(255,255,255,0.16);border-radius:19px;background:linear-gradient(155deg,#313131,#090909 70%);box-shadow:0 0 18px rgba(0,0,0,0.55), inset 0 0 18px rgba(0,0,0,0.24);position:relative;margin-bottom:-17px;opacity:0;transform:translateY(-180px) rotate(-12deg);animation:actDeviceDrop .95s cubic-bezier(.18,.82,.22,1.18) .15s forwards}
        #act-first-welcome .welcome-device:before{content:"";position:absolute;top:7px;left:50%;transform:translateX(-50%);width:25px;height:4px;border-radius:8px;background:#62dfff;box-shadow:0 0 8px rgba(0,0,0,0.55)}
        #act-first-welcome .welcome-device:after{content:"";position:absolute;inset:20px 8px 10px;border-radius:8px;background:linear-gradient(145deg,rgba(255,255,255,0.11),transparent 60%);border:1px solid rgba(255,255,255,0.04)}
        #act-first-welcome .welcome-logo{display:flex;direction:ltr;align-items:center;justify-content:center;gap:2px;font-size:clamp(66px,13vw,112px);line-height:1;font-weight:1000;letter-spacing:1px;color:#e4e6eb;text-shadow:0 0 10px rgba(0,0,0,0.55),0 0 30px rgba(0,0,0,0.55),0 0 60px rgba(0,0,0,0.55);margin-top:5px}
        #act-first-welcome .welcome-logo span{display:inline-block;opacity:0;transform:translate(var(--sx),var(--sy)) rotate(var(--sr)) scale(.25);animation:actLetterAssemble .78s cubic-bezier(.2,.85,.2,1.2) var(--delay) forwards}
        #act-first-welcome .welcome-logo span:nth-child(1){--sx:-180px;--sy:80px;--sr:-35deg;--delay:.58s}
        #act-first-welcome .welcome-logo span:nth-child(2){--sx:0px;--sy:-150px;--sr:22deg;--delay:.78s}
        #act-first-welcome .welcome-logo span:nth-child(3){--sx:180px;--sy:80px;--sr:35deg;--delay:.98s}
        #act-first-welcome .welcome-manager{font-size:clamp(25px,5vw,43px);font-weight:800;font-style:italic;letter-spacing:1px;color:#e4e6eb;text-shadow:0 0 15px rgba(0,0,0,0.55);opacity:0;transform:translateX(180px);animation:actManagerEnter .8s cubic-bezier(.2,.8,.2,1) 1.35s forwards}
        #act-first-welcome .welcome-tag{margin-top:17px;color:#e4e6eb;font-size:clamp(10px,2vw,13px);letter-spacing:2.5px;opacity:0;transform:translateX(-130px);animation:actSideEnter .7s ease 1.65s forwards}
        #act-first-welcome .welcome-slogan{margin:20px 0 0;padding:10px 28px;border-top:1px solid rgba(255,255,255,0.165);border-bottom:1px solid rgba(255,255,255,0.165);color:#fff;font-size:clamp(18px,3.7vw,27px);font-weight:800;text-shadow:0 0 14px rgba(0,0,0,0.55);opacity:0;transform:translateX(-180px);animation:actSideEnter .8s ease 1.9s forwards}
        #act-first-welcome .welcome-copy{margin:19px auto 0;max-width:510px;color:#e4e6eb;font-size:clamp(12px,2vw,14px);line-height:1.9;opacity:0;animation:actFadeUp .7s ease 2.25s forwards}
        #act-first-welcome .welcome-features{display:flex;justify-content:center;flex-wrap:wrap;gap:9px;margin-top:18px;opacity:0;animation:actFadeUp .7s ease 2.45s forwards}
        #act-first-welcome .welcome-features span{padding:7px 12px;border:1px solid rgba(255,255,255,0.066);border-radius:30px;background:rgba(24,24,24,0.72);color:#e4e6eb;font-size:11px}
        #act-first-welcome .welcome-loading{width:min(78vw,340px);height:6px;margin-top:25px;border-radius:10px;background:rgba(255,255,255,0.09);overflow:hidden;opacity:0;animation:actFadeUp .4s ease 2.5s forwards}
        #act-first-welcome .welcome-loading i{display:block;width:0;height:100%;border-radius:10px;background:linear-gradient(90deg,#007bff,#00e5ff,#fff);box-shadow:0 0 14px rgba(0,0,0,0.55);animation:actLoading 2.3s ease-in-out 2.55s forwards}
        #act-first-welcome .welcome-wait{margin-top:10px;color:#e4e6eb;font-size:12px;opacity:0;animation:actFadeUp .5s ease 2.55s forwards}
        @keyframes actDeviceDrop{0%{opacity:0;transform:translateY(-180px) rotate(-12deg)}75%{opacity:1;transform:translateY(8px) rotate(3deg)}100%{opacity:1;transform:translateY(0) rotate(0)}}
        @keyframes actLetterAssemble{0%{opacity:0;transform:translate(var(--sx),var(--sy)) rotate(var(--sr)) scale(.25);filter:blur(12px)}75%{opacity:1;transform:translate(0,0) rotate(0) scale(1.12);filter:blur(0)}100%{opacity:1;transform:translate(0,0) rotate(0) scale(1)}}
        @keyframes actManagerEnter{to{opacity:1;transform:translateX(0)}}@keyframes actSideEnter{to{opacity:1;transform:translateX(0)}}
        @keyframes actFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes actPortal{0%{opacity:0;transform:translate(-50%,-50%) scale(.35)}35%{opacity:.8}100%{opacity:0;transform:translate(-50%,-50%) scale(1.35)}}
        @keyframes actLoading{0%{width:0}100%{width:100%}}
        @media(prefers-reduced-motion:reduce){#act-first-welcome *,#act-first-welcome:before,#act-first-welcome:after{animation-duration:.01ms!important;animation-delay:0ms!important;transition:none!important;opacity:1!important;transform:none!important}}
        @media(max-width:480px){#act-first-welcome .welcome-core{padding:16px 12px}#act-first-welcome .welcome-copy{max-width:330px}#act-first-welcome .welcome-features{gap:6px}#act-first-welcome .welcome-features span{font-size:10px;padding:6px 9px}}
      
/* auto light layer */

:where(html[data-theme="light"]) #act-first-welcome {
  background: radial-gradient(ellipse at 50% 48%,rgba(0,0,0,0.139),transparent 42%),linear-gradient(145deg,#f8f8f8 0%,#f1f1f1 52%,#f7f7f7 100%);
  color: #303540;
}
:where(html[data-theme="light"]) #act-first-welcome:before,
:where(html[data-theme="light"]) #act-first-welcome:after {
  border: 1px solid rgba(0,0,0,0.04);
}
:where(html[data-theme="light"]) #act-first-welcome:after {
  border-color: rgba(0,0,0,0.043);
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-device {
  border: 3px solid rgba(0,0,0,0.144);
  background: linear-gradient(155deg,#e3e3e3,#f7f7f7 70%);
  box-shadow: 0 0 18px rgba(0,0,0,0.154), inset 0 0 18px rgba(0,0,0,0.067);
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-device:before {
  box-shadow: 0 0 8px rgba(0,0,0,0.154);
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-device:after {
  background: linear-gradient(145deg,rgba(0,0,0,0.099),transparent 60%);
  border: 1px solid rgba(0,0,0,0.036);
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-logo {
  color: #303540;
  text-shadow: 0 0 10px rgba(0,0,0,0.154),0 0 30px rgba(0,0,0,0.154),0 0 60px rgba(0,0,0,0.154);
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-manager {
  color: #303540;
  text-shadow: 0 0 15px rgba(0,0,0,0.154);
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-tag {
  color: #303540;
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-slogan {
  border-top: 1px solid rgba(0,0,0,0.149);
  border-bottom: 1px solid rgba(0,0,0,0.149);
  color: #1a1a1a;
  text-shadow: 0 0 14px rgba(0,0,0,0.154);
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-copy {
  color: #303540;
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-features span {
  border: 1px solid rgba(0,0,0,0.059);
  background: rgba(239,239,239,0.72);
  color: #303540;
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-loading {
  background: rgba(0,0,0,0.081);
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-loading i {
  box-shadow: 0 0 14px rgba(0,0,0,0.154);
}
:where(html[data-theme="light"]) #act-first-welcome .welcome-wait {
  color: #303540;
}</style>
      <div class="welcome-core">
        <div class="welcome-device" aria-hidden="true"></div>
        <div class="welcome-logo" aria-label="ACT"><span>A</span><span>C</span><span>T</span></div>
        <div class="welcome-manager">Manager</div>
        <div class="welcome-tag">COMPLETE SHOP MANAGEMENT SYSTEM</div>
        <div class="welcome-slogan">إدارة أسهل .. نجاح أكبر</div>
        <p class="welcome-copy">مرحبًا بك في ACT Manager — منظومة متكاملة لتنظيم وإدارة أعمال محلك من مكان واحد.</p>
        <div class="welcome-features"><span>إدارة الأجهزة</span><span>المبيعات والمشتريات</span><span>الصيانة والعملاء</span><span>تقارير وحسابات</span></div>
        <div class="welcome-loading"><i></i></div>
        <div class="welcome-wait">جاري تجهيز مساحة العمل الآمنة...</div>
      </div>`;
    document.body.appendChild(layer);
    await Promise.all([
        new Promise(resolve => setTimeout(resolve, 5200)),
        Promise.resolve(appReady)
    ]);
    layer.style.transition = "opacity .55s ease, transform .55s ease";
    layer.style.opacity = "0";
    layer.style.transform = "scale(1.025)";
    await new Promise(resolve => setTimeout(resolve, 580));
    layer.remove();
}

// شاشة الترحيب تظهر أول ما يُفتح البرنامج (قبل تسجيل الدخول) في كل مرة.
showActFirstWelcome(Promise.resolve());

// ======================================================
// مراقبة حالة تسجيل الدخول
// ACT SECURE AUTH STATE
// ======================================================

onAuthStateChanged(
    auth,
    async function (user) {

        try {

            // انتظار تجهيز حفظ واستعادة الجلسة
            await authPersistenceReady;

            // لا يوجد مستخدم مسجل
            if (!user) {

                const membershipBanner = document.getElementById("act-subscription-banner");
                if (membershipBanner) membershipBanner.hidden = true;
                showLoginPage();

                return;
            }

            // لا نسمح بدخول جلسة ACT قبل تفعيل تثبيت FIX الحالي.
            const isActOwnerAccount = String(user.email || "").trim().toLowerCase() === "hishamnasratman843@gmail.com";
            if (!isActOwnerAccount && localStorage.getItem("actFixActivatedDevice") !== localStorage.getItem("actFixDeviceId")) {
                // الترتيب الجديد: الترحيب ← تسجيل الدخول ← FIX ← البرنامج
                const fixPassed = typeof window.actFixGate === "function" ? await window.actFixGate() : false;
                if (!fixPassed) {
                    await signOut(auth).catch(() => {});
                    showLoginPage();
                    return;
                }
            }

            // التحقق من طريقة تسجيل الدخول
            const isEmailAccount =
                user.providerData.some(function (provider) {

                    return provider.providerId === "password";

                });

          
if (isEmailAccount) {

    // الاحتفاظ بحالة تأكيد البريد المحفوظة على الجهاز
    const wasEmailVerified = user.emailVerified === true;

    // تحديث حالة التأكيد من Firebase عند توفر الإنترنت
    if (navigator.onLine) {

        try {

            await user.reload();

            user = auth.currentUser;

        } catch (error) {

            console.warn(
                "Email verification refresh unavailable:",
                error
            );

            // السماح بالعمل دون إنترنت للحساب المؤكد سابقًا فقط
            if (navigator.onLine || !wasEmailVerified) {

                showLoginPage();

                return;
            }

            user = auth.currentUser || user;
        }
    }

    // منع الدخول إذا لم يكن البريد مؤكدًا
    if (
        !user ||
        !user.emailVerified
    ) {

        showLoginPage();

        return;
    }
}

// التحقق من الاشتراك والجهاز من الخدمة الخلفية قبل فتح أي بيانات
try {
    const gateResult = await actVerifySubscriptionAndDevice(user);
    if (gateResult?.blocked) return;
} catch (gateError) {
    console.warn("ACT access gate blocked:", gateError);
    showLoginPage();
    alert(gateError.message || "تعذر التحقق من صلاحية الحساب.");
    await signOut(auth).catch(() => {});
    return;
}

// ابدأ تحميل بيانات المستخدم خلف شاشة الترحيب، ولا تُخفِ الشاشة حتى يكتمل التحميل.
await openAppForUser(user);

        } catch (error) {

            console.error(
                "Auth state error:",
                error
            );

            showLoginPage();

        }

    }
);
// ======================================================
// فحص التأكيد عند الرجوع من Gmail
// ======================================================

window.addEventListener(
    "focus",
    checkEmailVerificationOnReturn
);

document.addEventListener(
    "visibilitychange",
    function () {

        if (document.visibilityState === "visible") {

            checkEmailVerificationOnReturn();
        }
    }
);
// ======================================================
// LOGOUT
// ======================================================

const logoutButton =
    document.getElementById("logout-button");

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        async function () {

            try {

                // حفظ وضع تسجيل الدخول قبل الخروج
                setAuthScreenMode("login");

                await signOut(auth);

            } catch (error) {

                console.error(
                    "Logout error:",
                    error
                );

                alert(
                    currentLanguage === "ar"
                        ? "حدث خطأ أثناء تسجيل الخروج."
                        : "Logout failed."
                );
            }
        }
    );
}


// ======================================================
// Local Storage Keys
// ======================================================

function getUserKey(type) {

    if (currentUser) {

        return (
            "actPhoneManager_" +
            type +
            "_" +
            currentUser.uid
        );
    }

    return (
        "actPhoneManager_" +
        type +
        "_guest"
    );
}

// ======================================================
// ACT SMART SYNC QUEUE
// طابور حفظ التغييرات عند انقطاع الإنترنت
// ======================================================

function getCloudQueueKey(uid) {
    return "actPhoneManager_syncQueue_" + uid;
}

function getCloudSyncQueue(uid) {
    try {
        const saved = localStorage.getItem(
            getCloudQueueKey(uid)
        );

        const queue = saved ? JSON.parse(saved) : [];

        return Array.isArray(queue) ? queue : [];

    } catch (error) {
        console.error("ACT Sync Queue Read Error:", error);
        return [];
    }
}

function saveCloudSyncQueue(uid, queue) {
    localStorage.setItem(
        getCloudQueueKey(uid),
        JSON.stringify(queue)
    );
}

// ======================================================
// إضافة أو تحديث عملية داخل الطابور
// ======================================================

function addCloudSyncTask(uid, task) {
    const queue = getCloudSyncQueue(uid);

    // أحدث عملية لنفس المفتاح هي المعتمدة
    const filteredQueue = queue.filter(
        item => item.key !== task.key
    );

    filteredQueue.push({
        ...task,
        id: Date.now() + "_" + Math.random().toString(36).slice(2),
        updatedAt: Date.now()
    });

    saveCloudSyncQueue(uid, filteredQueue);
}

// ======================================================
// تنفيذ طابور المزامنة
// ======================================================

const activeCloudSyncUsers = new Set();

async function flushCloudSyncQueue(user) {

    if (!user || !user.uid || !navigator.onLine) {
        return;
    }

    const uid = user.uid;

    if (activeCloudSyncUsers.has(uid)) {
        return;
    }

    activeCloudSyncUsers.add(uid);

    try {

        while (navigator.onLine) {

            const queue = getCloudSyncQueue(uid);

            if (!queue.length) {
                break;
            }

            const task = queue[0];

            const documentRef = doc(
                db,
                "users",
                uid,
                "appData",
                encodeURIComponent(task.key)
            );

            if (task.type === "delete") {

                await deleteDoc(documentRef);

            } else {

                await setDoc(documentRef, {
                    key: task.key,
                    value: String(task.value),
                    updatedAt: task.updatedAt
                });

            }

            // حذف المهمة التي تم تنفيذها فقط
            const latestQueue = getCloudSyncQueue(uid);

            const updatedQueue = latestQueue.filter(
                item => item.id !== task.id
            );

            saveCloudSyncQueue(uid, updatedQueue);

        }

        console.log(
            "ACT SMART SYNC: Queue completed."
        );

    } catch (error) {

        console.error(
            "ACT SMART SYNC: Waiting for connection.",
            error
        );

    } finally {

        activeCloudSyncUsers.delete(uid);

    }
}

// ======================================================
// ACT CLOUD SYNC
// المزامنة الأولية مع Firestore
// ======================================================

async function syncUserDataWithCloud(user) {

    if (!user || !user.uid) {
        throw new Error("لا يوجد مستخدم صالح للمزامنة.");
    }

    if (!navigator.onLine) {
        throw new Error("لا يوجد اتصال بالإنترنت.");
    }

    const uid = user.uid;

    const cloudCollection = collection(
        db,
        "users",
        uid,
        "appData"
    );

    try {

        // تنفيذ التغييرات المعلقة أولاً
        await flushCloudSyncQueue(user);

        // قراءة البيانات السحابية
        const cloudSnapshot = await getDocs(
            cloudCollection
        );

        const cloudKeys = new Set();

        // جمع مفاتيح المستخدم المحلية
        const localKeys = [];

        for (let i = 0; i < localStorage.length; i++) {

            const key = localStorage.key(i);

            if (
                key &&
                key.startsWith("actPhoneManager_") &&
                (
                    key.endsWith("_" + uid) ||
                    key.includes("_" + uid + "_")
                )
            ) {
                localKeys.push(key);
            }
        }

        // استعادة البيانات السحابية
        cloudSnapshot.forEach(function (documentSnapshot) {

            const data = documentSnapshot.data();

            if (
                !data ||
                typeof data.key !== "string" ||
                typeof data.value !== "string"
            ) {
                return;
            }

            cloudKeys.add(data.key);

            localStorage.setItem(
                data.key,
                data.value
            );

        });

        // رفع البيانات المحلية غير الموجودة في السحابة
        for (const key of localKeys) {

            if (cloudKeys.has(key)) {
                continue;
            }

            const value = localStorage.getItem(key);

            if (value === null) {
                continue;
            }

            await setDoc(
                doc(
                    cloudCollection,
                    encodeURIComponent(key)
                ),
                {
                    key: key,
                    value: value,
                    updatedAt: Date.now()
                }
            );

        }

        console.log(
            "ACT SMART SYNC: Initial synchronization completed."
        );

    } catch (error) {

        console.error(
            "ACT SMART SYNC Error:",
            error
        );

        throw error;

    }
}

// ======================================================
// ACT CLOUD AUTO SAVE
// حفظ محلي وسحابي مع طابور انتظار
// ======================================================

function saveUserDataToCloud(key, value) {

    if (!currentUser || !currentUser.uid) {
        return;
    }

    const uid = currentUser.uid;

    if (
        !key.endsWith("_" + uid) &&
        !key.includes("_" + uid + "_")
    ) {
        return;
    }

    addCloudSyncTask(uid, {
        type: "save",
        key: key,
        value: String(value)
    });

    if (navigator.onLine) {
        flushCloudSyncQueue(currentUser);
    }

}


// Flush pending cloud synchronization when the app is backgrounded or closed.
window.addEventListener("pagehide", function () {
    try { if (currentUser && currentUser.uid && typeof flushCloudSyncQueue === "function" && navigator.onLine) flushCloudSyncQueue(currentUser); } catch (error) { console.warn("ACT final sync attempt failed", error); }
});

// ======================================================
// ACT CLOUD DELETE
// حذف سحابي مع طابور انتظار
// ======================================================

function deleteUserDataFromCloud(key) {

    if (!currentUser || !currentUser.uid) {
        return;
    }

    const uid = currentUser.uid;

    if (
        !key.endsWith("_" + uid) &&
        !key.includes("_" + uid + "_")
    ) {
        return;
    }

    addCloudSyncTask(uid, {
        type: "delete",
        key: key
    });

    if (navigator.onLine) {
        flushCloudSyncQueue(currentUser);
    }

}

// ======================================================
// إعادة المحاولة عند رجوع الإنترنت
// ======================================================

window.addEventListener("online", function () {

    if (currentUser && currentUser.uid) {

        console.log(
            "ACT SMART SYNC: Internet connection restored."
        );

        flushCloudSyncQueue(currentUser);

    }

});



// ======================================================
// ACT SHOP NOTIFICATIONS — PER-ITEM DISMISSAL
// ======================================================
function getDismissedShopNotifications() {
    try {
        const key = getUserKey("shop_notification_dismissed");
        const value = JSON.parse(localStorage.getItem(key) || "[]");
        return Array.isArray(value) ? value.map(String) : [];
    } catch (_) { return []; }
}
function saveDismissedShopNotifications(ids) {
    const key = getUserKey("shop_notification_dismissed");
    const value = JSON.stringify([...new Set(ids.map(String))]);
    localStorage.setItem(key, value);
    if (typeof saveUserDataToCloud === "function") saveUserDataToCloud(key, value);
}
function dismissShopNotification(id) {
    if (!id) return;
    const dismissed = getDismissedShopNotifications();
    if (!dismissed.includes(String(id))) dismissed.push(String(id));
    saveDismissedShopNotifications(dismissed);
    renderShopNotifications();
    window.dispatchEvent(new CustomEvent("act-shop-notifications-updated"));
}

// ====================================================== 
// ACT SHOP NOTIFICATIONS — LIVE RENDERER
// ====================================================== 

function renderShopNotifications() {

    const list = document.getElementById("shop-notifications-list");
    const count = document.getElementById("shop-notifications-count");

    if (!list || !count) return;

    const allDevices = Array.isArray(devices) ? devices : [];

    const statusMap = {
        "قيد الإصلاح": SECTIONS.PENDING,
        "جاهز": SECTIONS.READY,
        "لم يتم الإصلاح": SECTIONS.FAILED,
        "تم التسليم": SECTIONS.DELIVERED
    };

    const details = {
        [SECTIONS.PENDING]: { icon: "🟡", label: "قيد الإصلاح" },
        [SECTIONS.READY]: { icon: "🟢", label: "جاهز للتسليم" },
        [SECTIONS.FAILED]: { icon: "🔴", label: "لم يتم الإصلاح" }
    };

    const escapeNotificationText = value =>
        String(value ?? "").replace(/[&<>"']/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[char]);

    const dismissedIds = getDismissedShopNotifications();
    const notifications = allDevices.filter(device => {
        const category = device.category || statusMap[device.status] || null;
        const notificationId = String(device.id || (device.phoneName + "_" + (device.customerName || "")));
        if (dismissedIds.includes(notificationId)) return false;
        return (
            (device.section === "maintenance" ||
                [SECTIONS.PENDING, SECTIONS.READY, SECTIONS.FAILED, SECTIONS.DELIVERED].includes(category)) &&
            [SECTIONS.PENDING, SECTIONS.READY, SECTIONS.FAILED].includes(category)
        );
    });

    count.textContent = String(notifications.length);
    if (!list.dataset.dismissBound) {
        list.dataset.dismissBound = "1";
        list.addEventListener("click", event => {
            const button = event.target.closest("[data-dismiss-shop-notification]");
            if (!button) return;
            event.preventDefault(); event.stopPropagation();
            dismissShopNotification(button.dataset.dismissShopNotification);
        });
    }

    if (!notifications.length) {
        list.innerHTML = `
            <div class="premium-notification-empty">
                <span>✓</span>
                <strong>لا توجد تنبيهات حالياً</strong>
                <small>المحل يعمل بشكل طبيعي</small>
            </div>
        `;
        return;
    }

    list.innerHTML = notifications.slice(0, 4).map(device => {
        const category = device.category || statusMap[device.status];
        const info = details[category];
        if (!info) return "";

        return `
            <div class="premium-notification-item" data-shop-notification="${escapeNotificationText(device.id || (device.phoneName + "_" + (device.customerName || "")))}">
                <span class="notification-icon">${info.icon}</span>
                <div class="notification-content">
                    <strong>${escapeNotificationText(device.phoneName || "جهاز بدون اسم")}</strong>
                    <small>${info.label} · العميل: ${escapeNotificationText(device.customerName || "غير محدد")}</small>
                </div>
                <button type="button" class="shop-notification-dismiss" data-dismiss-shop-notification="${escapeNotificationText(device.id || (device.phoneName + "_" + (device.customerName || "")))}" aria-label="حذف التنبيه" title="حذف التنبيه">✕</button>
            </div>
        `;
    }).join("");
}


// ====================================================== 

// تحميل البيانات 
// ====================================================== 
 
function loadUserData() { 
 
    try { 
 
        const devicesKey = 
            getUserKey( 
                "devices" 
            ); 
 
        const employeesKey = 
            getUserKey( 
                "employees" 
            ); 
 
 
        const storedDevices = 
            localStorage.getItem( 
                devicesKey 
            ); 
 
        const storedEmployees = 
            localStorage.getItem( 
                employeesKey 
            ); 
 
 
        devices = 
            storedDevices 
                ? JSON.parse( 
                    storedDevices 
                ) 
                : []; 
 
 
        employees = 
            storedEmployees 
                ? JSON.parse( 
                    storedEmployees 
                ) 
                : []; 

                        // ======================================================
        // تحميل سجل عمليات لوحة التحكم
        // ======================================================

        const operationsKey =
            getUserKey(
                "operations"
            );

        const storedOperations =
            localStorage.getItem(
                operationsKey
            );

        dashboardOperations =
            storedOperations
                ? JSON.parse(
                    storedOperations
                )
                : [];

        if (!Array.isArray(dashboardOperations)) {
            dashboardOperations = [];
        }
 
 
        if (!Array.isArray(devices)) { 
            devices = []; 
        } 
 
        if (!Array.isArray(employees)) { 
            employees = []; 
        } 
        normalizeEmployeeAttendanceCodes();
        processAutomaticEmployeeAbsences();
 
 renderCurrentView();

updateEmployeeStats();

renderDashboardOperations();

renderActNotifications();

renderShopNotifications();

    } catch (error) { 
 
        console.error( 
            "Load data error:", 
            error 
        ); 
 
        devices = []; 
 
        employees = []; 
    } 
} 
 
 
// ====================================================== 
// حفظ الأجهزة 
// ====================================================== 
function saveDevices() {

    try {

        const key = getUserKey("devices");

        const value = JSON.stringify(devices);

        // الحفظ المحلي
        localStorage.setItem(
            key,
            value
        );

        // الحفظ السحابي
        saveUserDataToCloud(
            key,
            value
        );
        window.dispatchEvent(new Event("act-user-data-ready"));
        window.dispatchEvent(new Event("act-devices-data-updated"));
        if (typeof addNotificationFromOperation === "function") {
            addNotificationFromOperation({type:"devices",icon:"📱",title:"تم حفظ بيانات الأجهزة",details:"تم تحديث سجل الأجهزة والصيانة"});
        }

    } catch (error) {

        console.error(
            "Save devices error:",
            error
        );

    }
}
 
 
// ====================================================== 
// حفظ العاملين 
// ====================================================== 
 function saveEmployees() {

    try {

        const key = getUserKey("employees");
        const value = JSON.stringify(employees);

        // الحفظ المحلي
        localStorage.setItem(key, value);

        // الحفظ السحابي
        saveUserDataToCloud(key, value);
        window.dispatchEvent(new Event("act-user-data-ready"));
        if (typeof addNotificationFromOperation === "function") {
            addNotificationFromOperation({type:"employees",icon:"👨‍💼",title:"تم حفظ بيانات الموظفين",details:"تم تحديث بيانات العاملين"});
        }

    } catch (error) {

        console.error(
            "Save employees error:",
            error
        );

    }
}
 // ======================================================
// سجل عمليات لوحة التحكم
// ======================================================

let dashboardOperations = [];


// ======================================================
// حفظ سجل العمليات
// ======================================================
function saveDashboardOperations() {

    try {

        const key = getUserKey("operations");
        const value = JSON.stringify(dashboardOperations);

        // الحفظ المحلي
        localStorage.setItem(key, value);

        // الحفظ السحابي
        saveUserDataToCloud(key, value);
        window.dispatchEvent(new Event("act-dashboard-operations-updated"));

    } catch (error) {

        console.error(
            "Save dashboard operations error:",
            error
        );

    }
}
 // ======================================================
// إضافة عملية جديدة + تسجيل إشعار
// ======================================================

function addDashboardOperation({
    type,
    icon = "📌",
    title,
    details = "",
    amount = null
}) {
    const operation = {
        id: createId("operation"),
        type,
        icon,
        title,
        details,
        amount: amount !== null ? Number(amount) || 0 : null,
        createdAt: new Date().toISOString()
    };

    dashboardOperations.unshift(operation);

    // الاحتفاظ بآخر 50 عملية فقط
    dashboardOperations = dashboardOperations.slice(0, 50);

    saveDashboardOperations();
    renderDashboardOperations();

    // تسجيل العملية كإشعار في الجرس
    if (typeof addNotificationFromOperation === "function") {
        addNotificationFromOperation(operation);
    }
}


// ======================================================
// عرض آخر العمليات في لوحة التحكم
// ======================================================

// ======================================================
// عرض آخر العمليات في لوحة التحكم
// ======================================================

function renderDashboardOperations() {

    const container = document.getElementById(
        "dashboard-latest-operations"
    );

    if (!container) return;

    const count = document.getElementById(
        "dashboard-operations-count"
    );

    const today = getToday();

 const todayOperations = dashboardOperations
    .filter(function (operation) {

        const isToday =
            getOperationDate(operation.createdAt) === today;

        const isFinancialOperation = [
            "deposit",
            "withdraw"
        ].includes(operation.type);

        return isToday && isFinancialOperation;
    })
        .sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    // تحديث العداد قبل أي return
    if (count) {
        count.textContent = todayOperations.length;
    }

    if (!todayOperations.length) {

        container.innerHTML = `
            <div class="dashboard-operation-empty"
                 style="grid-column:1/-1;text-align:center;padding:25px;opacity:.7;">
                لا توجد عمليات اليوم
            </div>
        `;

        return;
    }

    container.innerHTML = todayOperations.map(function (operation) {

        return `
            <div class="dashboard-operation-card"
                 data-operation-id="${escapeHTML(operation.id)}">

                <button
                    type="button"
                    class="dashboard-operation-delete"
                    data-delete-operation="${escapeHTML(operation.id)}"
                    aria-label="حذف العملية"
                    title="حذف العملية"
                >×</button>

                <div class="operation-icon">
                    ${escapeHTML(operation.icon || "📌")}
                </div>

                <div class="operation-info">
                    <strong>${escapeHTML(operation.title || "")}</strong>

                    ${
                        operation.amount !== null &&
                        operation.amount !== undefined
                            ? `<b>${formatMoney(operation.amount)}</b>`
                            : ""
                    }

                    ${
                        operation.details
                            ? `<small>${escapeHTML(operation.details)}</small>`
                            : ""
                    }

                    <small>
                        ${getCurrentTimeFromDate(operation.createdAt)}
                    </small>
                </div>

            </div>
        `;

    }).join("");
}


// ======================================================
// حذف عملية واحدة من سجل لوحة التحكم
// ======================================================

document.addEventListener("click", function (event) {

    const deleteButton = event.target.closest(
        "[data-delete-operation]"
    );

    if (!deleteButton) return;

    const operationId = deleteButton.dataset.deleteOperation;

    if (!operationId) return;

    if (!confirm("هل تريد حذف هذه العملية من سجل لوحة التحكم؟")) {
        return;
    }

    dashboardOperations = dashboardOperations.filter(function (operation) {
        return String(operation.id) !== String(operationId);
    });

    saveDashboardOperations();
    renderDashboardOperations();

    // تحديث نافذة عرض الكل لو كانت مفتوحة
    const modalList = document.getElementById(
        "dashboard-operations-modal-list"
    );

    const originalList = document.getElementById(
        "dashboard-latest-operations"
    );

    if (modalList && originalList) {
        modalList.replaceChildren(
            ...Array.from(originalList.children).map(function (item) {
                return item.cloneNode(true);
            })
        );
    }

});

function getCurrentTimeFromDate(dateValue) {

    const date =
        new Date(dateValue);

    const hours =
        String(
            date.getHours()
        ).padStart(
            2,
            "0"
        );

    const minutes =
        String(
            date.getMinutes()
        ).padStart(
            2,
            "0"
        );

    return (
        hours +
        ":" +
        minutes
    );
}



// ======================================================
// تاريخ العملية بالتوقيت المحلي
// ======================================================

function getOperationDate(
    dateValue
) {

    const date =
        new Date(
            dateValue
        );

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );

    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}



// ====================================================== 
// Helpers 
// ====================================================== 
 
function createId( 
    prefix 
) { 
 
    return ( 
        prefix + 
        "_" + 
        Date.now() + 
        "_" + 
        Math.random() 
            .toString(36) 
            .slice(2, 10) 
    ); 
} 
 
 
function escapeHTML( 
    value 
) { 
 
    return String( 
        value == null 
            ? "" 
            : value 
    ) 
        .replace( 
            /&/g, 
            "&amp;" 
        ) 
        .replace( 
            /</g, 
            "&lt;" 
        ) 
        .replace( 
            />/g, 
            "&gt;" 
        ) 
        .replace( 
            /"/g, 
            "&quot;" 
        ) 
        .replace( 
            /'/g, 
            "&#039;" 
        ); 
} 
 
 
function formatMoney( 
    value 
) { 
 
    const number = 
        Number(value) || 0; 
 
    return ( 
        new Intl.NumberFormat( 
            currentLanguage === "ar" 
                ? "ar-EG" 
                : "en-US", 
            { 
                maximumFractionDigits: 2 
            } 
        ).format(number) + 
        ( 
            currentLanguage === "ar" 
                ? " جنيه" 
                : " EGP" 
        ) 
    ); 
} 
 
 
function getToday() { 
 
    const date = 
        new Date(); 
 
    const year = 
        date.getFullYear(); 
 
    const month = 
        String( 
            date.getMonth() + 1 
        ).padStart( 
            2, 
            "0" 
        ); 
 
    const day = 
        String( 
            date.getDate() 
        ).padStart( 
            2, 
            "0" 
        ); 
 
    return ( 
        year + 
        "-" + 
        month + 
        "-" + 
        day 
    ); 
} 

// ======================================================
// 📅 ACT DAILY HISTORY — REAL SALES + DAILY OPERATIONS
// ======================================================
(function () {
    "use strict";

    let weekOffset = 0;
    const $ = id => document.getElementById(id);
    const safeArray = key => {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (_) { return []; }
    };
    const uid = () => (typeof currentUser !== "undefined" && currentUser && currentUser.uid) ? currentUser.uid : "guest";
    const userKey = name => typeof getUserKey === "function" ? getUserKey(name) : `actPhoneManager_${name}_${uid()}`;
    const dateOf = item => {
        const raw = item && (item.date || item.createdAt || item.timestamp || item.time);
        if (!raw) return "";
        if (typeof raw === "number") return new Date(raw).toLocaleDateString("en-CA");
        const text = String(raw);
        if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
        const parsed = new Date(text);
        return Number.isNaN(parsed.getTime()) ? "" : [parsed.getFullYear(), String(parsed.getMonth()+1).padStart(2,"0"), String(parsed.getDate()).padStart(2,"0")].join("-");
    };
    const amountOf = item => {
        const n = Number(item && (item.total ?? item.paid ?? item.price ?? item.amount ?? item.value ?? 0));
        return Number.isFinite(n) ? n : 0;
    };
    const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
    const money = value => `${Number(value || 0).toLocaleString("ar-EG", {maximumFractionDigits:2})} جنيه`;

    function readSales() {
        const key = typeof getSalesStorageKey === "function" ? getSalesStorageKey() : `actPhoneManager_sales_${uid()}`;
        return safeArray(key);
    }
    function readArchives() {
        return typeof loadDayCloseArchives === "function" ? loadDayCloseArchives() : [];
    }
    function readDayData(date) {
        const archives = readArchives();
        const archive = archives.find(x => x && x.date === date);
        const data = archive && archive.data ? archive.data : {};
        const sales = archive ? (Array.isArray(data.sales) ? data.sales : []) : readSales().filter(x => dateOf(x) === date);
        const purchases = archive ? [...(data.purchases || []), ...(data.independentPurchases || [])] : [...safeArray(userKey("phonePurchases")), ...safeArray(userKey("independentPurchases"))].filter(x => dateOf(x) === date);
        const devicesList = archive ? (data.devices || []) : (Array.isArray(devices) ? devices.filter(x => dateOf({date:x.receiveDate || x.createdAt}) === date) : []);
        const wallet = archive ? (data.wallet || []) : ["withdraw","deposit","recharge","bills","transfer"].flatMap(op => safeArray(`actPhoneManager_wallet_transactions_${op}_${uid()}`).filter(x => dateOf(x) === date));
        const ops = archive ? (data.operations || []) : (Array.isArray(dashboardOperations) ? dashboardOperations.filter(x => dateOf(x) === date) : []);
        let inventory = archive ? (data.inventory || {}) : null;
        if (!archive && date === (typeof getToday === "function" ? getToday() : new Date().toISOString().slice(0,10))) {
            try {
                const rows = JSON.parse(localStorage.getItem(userKey("accessories")) || "[]");
                const accessories = Array.isArray(rows) ? rows : [];
                const saleDevices = Array.isArray(devices) ? devices.filter(item => item.section === "sale" || item.category === "sale" || item.status === "البيع") : [];
                inventory = { devices:saleDevices, accessories, totalAccessoryUnits:accessories.reduce((sum,item)=>sum+(Number(item.quantity)||0),0), accessoryCostValue:accessories.reduce((sum,item)=>sum+(Number(item.quantity)||0)*(Number(item.cost)||0),0), accessoryRetailValue:accessories.reduce((sum,item)=>sum+(Number(item.quantity)||0)*(Number(item.price)||0),0) };
            } catch (_) { inventory = null; }
        }
        const summary = archive && archive.summary ? archive.summary : {};
        const salesTotal = sales.reduce((sum, x) => sum + amountOf(x), 0);
        return { archive, sales, purchases, devices:devicesList, wallet, operations:ops, inventory, count: Number(summary.salesCount ?? sales.length) || 0, total: Number(summary.salesTotal ?? salesTotal) || 0 };
    }

    function collectHistory() {
        const dates = new Set();
        const today = typeof getToday === "function" ? getToday() : new Date().toISOString().slice(0,10);
        readArchives().forEach(x => { if (x && x.date) dates.add(x.date); });
        readSales().forEach(x => { const d = dateOf(x); if (d) dates.add(d); });
        [userKey("phonePurchases"), userKey("independentPurchases")].forEach(k => safeArray(k).forEach(x => { const d=dateOf(x); if(d) dates.add(d); }));
        ["withdraw","deposit","recharge","bills","transfer"].forEach(op => safeArray(`actPhoneManager_wallet_transactions_${op}_${uid()}`).forEach(x => { const d=dateOf(x); if(d) dates.add(d); }));
        if (Array.isArray(devices)) devices.forEach(x => { const d=dateOf({date:x.receiveDate || x.createdAt}); if(d) dates.add(d); });
        if (Array.isArray(dashboardOperations)) dashboardOperations.forEach(x => { const d=dateOf(x); if(d) dates.add(d); });
        dates.add(today);
        return [...dates].filter(d => /^\d{4}-\d{2}-\d{2}$/.test(d) && d <= today).sort().reverse();
    }

    function renderDayDetails(date, target) {
        const day = readDayData(date);
        const groups = [
            ["المبيعات", "🛍️", day.sales, x => `${x.productName || x.phoneName || x.product || x.name || "عملية بيع"} — ${money(amountOf(x))}`],
            ["المشتريات", "📦", day.purchases, x => `${x.productName || x.phoneName || x.product || x.name || "عملية شراء"} — ${money(amountOf(x))}`],
            ["الأجهزة والصيانة", "📱", day.devices, x => `${x.phoneName || x.deviceName || x.model || "جهاز"} — ${x.customerName || x.customer || x.status || "مسجل"}`],
            ["الخزنة والمحفظة", "💳", day.wallet, x => `${x.service || x.operationName || x.operation || "عملية مالية"} — ${money(amountOf(x))}`],
            ["عمليات النظام", "🧾", day.operations, x => `${x.title || x.name || x.description || x.type || "عملية مسجلة"} — ${money(amountOf(x))}`]
        ];
        const content = groups.map(([label, icon, rows, describe]) => {
            if (!Array.isArray(rows) || !rows.length) return "";
            return `<div class="act-daily-detail-group"><h4>${icon} ${label} <small>(${rows.length})</small></h4><ul>${rows.map(x => `<li>${esc(describe(x))}<small>${esc(x.time || x.createdAt || x.date || "")}</small></li>`).join("")}</ul></div>`;
        }).join("");
        const inv = day.inventory;
        const inventoryHtml = inv ? `<div class="act-daily-detail-group"><h4>📦 جرد المخزون اليومي</h4><ul><li>أجهزة معروضة للبيع: ${Number((inv.devices||[]).length)||0}</li><li>أصناف إكسسوارات: ${Number((inv.accessories||[]).length)||0}</li><li>إجمالي قطع الإكسسوارات: ${Number(inv.totalAccessoryUnits)||0}</li><li>قيمة المخزون بالتكلفة: ${money(inv.accessoryCostValue||0)}</li><li>القيمة بسعر البيع: ${money(inv.accessoryRetailValue||0)}</li></ul>${(inv.accessories||[]).length ? `<ul>${inv.accessories.map(item=>`<li>${esc(item.name)} — كمية: ${Number(item.quantity)||0}</li>`).join("")}</ul>` : ""}</div>` : "";
        target.innerHTML = (content + inventoryHtml) || `<div class="dashboard-history-empty"><strong>لا توجد عمليات مسجلة لهذا اليوم.</strong></div>`;
    }

    function renderDashboardHistory() {
        const container = $("dashboard-daily-history");
        const dateElement = $("dashboard-current-date");
        if (!container) return;
        const today = typeof getToday === "function" ? getToday() : new Date().toISOString().slice(0,10);
        if (dateElement) dateElement.textContent = today;
        const dates = collectHistory();
        const maxOffset = Math.max(0, Math.ceil(dates.length / 7) - 1);
        weekOffset = Math.min(weekOffset, maxOffset);
        const start = weekOffset * 7;
        const visible = dates.slice(start, start + 7);
        container.innerHTML = "";
        const controls = document.createElement("div");
        controls.className = "dashboard-history-controls";
        controls.innerHTML = `<button type="button" data-history-newer ${weekOffset === 0 ? "disabled" : ""}>الأحدث ←</button><span>الأسبوع ${weekOffset + 1}</span><button type="button" data-history-older ${start + 7 >= dates.length ? "disabled" : ""}>→ الأقدم</button>`;
        container.appendChild(controls);
        controls.querySelector("[data-history-newer]").addEventListener("click", () => { if (weekOffset > 0) { weekOffset--; renderDashboardHistory(); } });
        controls.querySelector("[data-history-older]").addEventListener("click", () => { if ((weekOffset + 1) * 7 < dates.length) { weekOffset++; renderDashboardHistory(); } });
        if (!visible.length) {
            container.insertAdjacentHTML("beforeend", `<div class="dashboard-history-empty"><span>📅</span><strong>لا توجد بيانات حتى الآن</strong><small>ستظهر الأيام هنا عند تسجيل أول عملية.</small></div>`);
            return;
        }
        visible.forEach(date => {
            const day = readDayData(date);
            const card = document.createElement("article");
            card.className = "dashboard-history-card act-daily-history-card";
            card.innerHTML = `<div class="act-daily-history-summary"><div><span>📅 التاريخ</span><strong>${esc(date)}</strong></div><div><span>عدد المبيعات</span><strong>${day.count}</strong></div><div><span>إجمالي المبيعات</span><strong>${money(day.total)}</strong></div><button type="button" class="act-daily-expand" aria-expanded="false" aria-label="عرض عمليات يوم ${esc(date)}">⌄</button></div><div class="act-daily-history-details" hidden></div>`;
            const button = card.querySelector(".act-daily-expand");
            const details = card.querySelector(".act-daily-history-details");
            button.addEventListener("click", () => {
                const opening = details.hidden;
                details.hidden = !opening;
                button.setAttribute("aria-expanded", String(opening));
                button.textContent = opening ? "⌃" : "⌄";
                if (opening && !details.dataset.loaded) { renderDayDetails(date, details); details.dataset.loaded = "1"; }
            });
            container.appendChild(card);
        });
    }

    window.renderDashboardHistory = renderDashboardHistory;
    window.addEventListener("act-user-data-ready", renderDashboardHistory);
    window.addEventListener("act-sales-data-updated", renderDashboardHistory);
    window.addEventListener("act-dashboard-operations-updated", renderDashboardHistory);
    window.addEventListener("act-wallet-data-updated", renderDashboardHistory);
    window.addEventListener("storage", event => { if (!event.key || event.key.includes("actPhoneManager_")) renderDashboardHistory(); });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", renderDashboardHistory);
    else renderDashboardHistory();
})();


// ======================================================
// 🔒 نظام إقفال اليوم - أرشيف الأيام
// ======================================================

function getDayCloseStorageKey() {

    return getUserKey("day_closes");

}


// ======================================================
// تحميل أرشيف الأيام
// ======================================================

function loadDayCloseArchives() {

    try {

        const stored =
            localStorage.getItem(
                getDayCloseStorageKey()
            );

        if (!stored) {
            return [];
        }

        const archives =
            JSON.parse(stored);

        return Array.isArray(archives)
            ? archives
            : [];

    } catch (error) {

        console.error(
            "Load day close archives error:",
            error
        );

        return [];
    }
}


// ======================================================
// حفظ أرشيف الأيام
// ======================================================
function saveDayCloseArchives(archives) {

    try {

        const key = getDayCloseStorageKey();
        const value = JSON.stringify(archives);

        // الحفظ المحلي
        localStorage.setItem(
            key,
            value
        );

        // الحفظ السحابي
        saveUserDataToCloud(
            key,
            value
        );
        if (typeof window.renderDashboardHistory === "function") window.renderDashboardHistory();

    } catch (error) {

        console.error(
            "Save day close archives error:",
            error
        );

    }
}




// ======================================================
// 🔒 إنشاء لقطة كاملة لليوم المقفول
// ======================================================

function createDayCloseSnapshot(dateKey) {

    const userId =
        typeof currentUser !== "undefined" &&
        currentUser &&
        currentUser.uid
            ? currentUser.uid
            : "guest";


    // ==================================================
    // 📱 الأجهزة + الصيانة
    // ==================================================

    const dayDevices =
        Array.isArray(devices)
            ? devices.filter(function (device) {

                const deviceDate =
                    device.receiveDate ||
                    (
                        device.createdAt
                            ? device.createdAt.slice(0, 10)
                            : ""
                    );

                return deviceDate === dateKey;

            })
            : [];


            const dayMaintenance =
    dayDevices.filter(function (device) {
        return device.section === "maintenance";
    });

    // ==================================================
    // 🛒 المبيعات
    // ==================================================

    let daySales = [];

    try {

        const salesKey =
            typeof getSalesStorageKey === "function"
                ? getSalesStorageKey()
                : (
                    userId === "guest"
                        ? "actPhoneManager_sales_guest"
                        : "actPhoneManager_sales_" + userId
                );

        const savedSales =
            JSON.parse(
                localStorage.getItem(
                    salesKey
                ) || "[]"
            );

        if (Array.isArray(savedSales)) {

            daySales =
                savedSales.filter(
                    function (sale) {

                        const saleDate =
                            sale.date ||
                            sale.createdAt ||
                            "";

                        return (
                            saleDate.slice(0, 10) ===
                            dateKey
                        );

                    }
                );

        }

    } catch (error) {

        console.error(
            "Day close sales error:",
            error
        );

    }


    // ==================================================
    // 📦 المشتريات
    // ==================================================

    let dayPurchases = [];

    try {

        const purchaseData =
            JSON.parse(
                localStorage.getItem(
                    getUserKey("phonePurchases")
                ) || "[]"
            );

        if (Array.isArray(purchaseData)) {

            dayPurchases =
                purchaseData.filter(
                    function (purchase) {

                        const purchaseDate =
                            purchase.date ||
                            purchase.createdAt ||
                            "";

                        return (
                            purchaseDate.slice(0, 10) ===
                            dateKey
                        );

                    }
                );

        }

    } catch (error) {

        console.error(
            "Day close purchases error:",
            error
        );

    }


    // ==================================================
    // 🧾 المشتريات المستقلة
    // ==================================================

    let dayIndependentPurchases = [];
    try {
        const key = getUserKey("independentPurchases");
        const saved = JSON.parse(localStorage.getItem(key) || "[]");
        if (Array.isArray(saved)) {
            dayIndependentPurchases = saved.filter(function (purchase) {
                const value = purchase.date || purchase.createdAt || "";
                return String(value).slice(0, 10) === dateKey;
            });
        }
    } catch (error) {
        console.error("Day close independent purchases error:", error);
    }

    // ==================================================
    // 💳 المحفظة
    // ==================================================

    const walletOperations = [
        "withdraw",
        "deposit",
        "recharge",
        "bills",
        "transfer"
    ];

    const dayWalletTransactions = [];


    walletOperations.forEach(
        function (operation) {

            try {

                const key =
                    "actPhoneManager_wallet_transactions_" +
                    operation +
                    "_" +
                    userId;

                const data =
                    JSON.parse(
                        localStorage.getItem(
                            key
                        ) || "[]"
                    );

                if (Array.isArray(data)) {

                    data.forEach(
                        function (transaction) {

                            const transactionDate =
                                transaction.date ||
                                "";

                            if (
                                transactionDate.slice(0, 10) ===
                                dateKey
                            ) {

                                dayWalletTransactions.push({
                                    ...transaction
                                });

                            }

                        }
                    );

                }

            } catch (error) {

                console.error(
                    "Day close wallet error:",
                    operation,
                    error
                );

            }

        }
    );


    // ==================================================
    // 🎧 حركة مخزون الإكسسوارات
    // ==================================================
    let dayAccessoryMovements = [];
    try {
        const movementKey = getUserKey("accessoryMovements");
        const movementRows = JSON.parse(localStorage.getItem(movementKey) || "[]");
        if (Array.isArray(movementRows)) dayAccessoryMovements = movementRows.filter(item => String(item.date || item.createdAt || "").slice(0, 10) === dateKey);
    } catch (error) { console.warn("Day close accessory movement error", error); }

    // ==================================================
    // 👨‍💼 الموظفين
    // ==================================================

    let employeesSnapshot = [];

    try {

        const employeesKey =
            currentUser &&
            currentUser.uid
                ? "actPhoneManager_employees_" +
                  currentUser.uid
                : "actPhoneManager_employees_guest";

        const savedEmployees =
            JSON.parse(
                localStorage.getItem(
                    employeesKey
                ) || "[]"
            );

        if (Array.isArray(savedEmployees)) {

            employeesSnapshot =
                savedEmployees.map(
                    function (employee) {

                        const attendance =
                            employee.attendance || {};

                        const loans =
                            Array.isArray(
                                employee.loans
                            )
                                ? employee.loans.filter(
                                    function (loan) {

                                        return (
                                            loan.date ===
                                            dateKey
                                        );

                                    }
                                )
                                : [];

                        const bonuses =
                            Array.isArray(
                                employee.bonuses
                            )
                                ? employee.bonuses.filter(
                                    function (bonus) {

                                        return (
                                            bonus.date ===
                                            dateKey
                                        );

                                    }
                                )
                                : [];

                        return {

                            ...employee,

                            attendance: {
                                [dateKey]:
                                    attendance[dateKey] ||
                                    null
                            },

                            loans,

                            bonuses

                        };

                    }
                );

        }

    } catch (error) {

        console.error(
            "Day close employees error:",
            error
        );

    }


    // ==================================================
    // 📦 جرد المخزون اليومي (الأجهزة المعروضة + الإكسسوارات)
    // ==================================================
    let inventorySnapshot = { devices: [], accessories: [], totalAccessoryUnits: 0, accessoryCostValue: 0, accessoryRetailValue: 0 };
    try {
        const accessoryKey = getUserKey("accessories");
        const accessoryRows = JSON.parse(localStorage.getItem(accessoryKey) || "[]");
        const allAccessories = Array.isArray(accessoryRows) ? accessoryRows : [];
        const saleDevices = Array.isArray(devices) ? devices.filter(item => item.section === "sale" || item.category === "sale" || item.status === "البيع") : [];
        inventorySnapshot = {
            devices: saleDevices.map(item => ({ id:item.id, name:item.phoneName || item.deviceName || item.model || "جهاز", quantity:1, status:item.status || "متاح", cost:Number(item.purchasePrice || item.cost || 0), price:Number(item.salePrice || item.price || 0) })),
            accessories: allAccessories.map(item => ({ id:item.id, name:item.name || "صنف", code:item.code || "", quantity:Number(item.quantity) || 0, cost:Number(item.cost) || 0, price:Number(item.price) || 0 })),
            totalAccessoryUnits: allAccessories.reduce((sum,item)=>sum+(Number(item.quantity)||0),0),
            accessoryCostValue: allAccessories.reduce((sum,item)=>sum+(Number(item.quantity)||0)*(Number(item.cost)||0),0),
            accessoryRetailValue: allAccessories.reduce((sum,item)=>sum+(Number(item.quantity)||0)*(Number(item.price)||0),0)
        };
    } catch (inventoryError) { console.warn("Daily inventory snapshot error", inventoryError); }

    // ==================================================
    // 📊 العمليات العامة
    // ==================================================

    const dayOperations =
        Array.isArray(dashboardOperations)
            ? dashboardOperations.filter(
                function (operation) {

                    return (
                        getOperationDate(
                            operation.createdAt
                        ) ===
                        dateKey
                    );

                }
            )
            : [];


    // ==================================================
    // 💰 الإجماليات
    // ==================================================

    const salesTotal =
        daySales.reduce(
            function (total, sale) {

                return (
                    total +
                    Number(
                        sale.total ||
                        sale.price ||
                        0
                    )
                );

            },
            0
        );


    const purchasesTotal =
        dayPurchases.reduce(
            function (total, purchase) {

                return (
                    total +
                    Number(
                        purchase.total || purchase.price ||
                        0
                    )
                );

            },
            0
        );


    const independentPurchasesTotal = dayIndependentPurchases.reduce(function (total, purchase) {
        return total + Number(purchase.total || purchase.price || 0);
    }, 0);

    const walletWithdrawTotal =
        dayWalletTransactions
            .filter(
                function (transaction) {

                    return (
                        transaction.operation ===
                        "withdraw"
                    );

                }
            )
            .reduce(
                function (total, transaction) {

                    return (
                        total +
                        Number(
                            transaction.amount ||
                            0
                        )
                    );

                },
                0
            );


    const walletDepositTotal =
        dayWalletTransactions
            .filter(
                function (transaction) {

                    return (
                        transaction.operation ===
                        "deposit"
                    );

                }
            )
            .reduce(
                function (total, transaction) {

                    return (
                        total +
                        Number(
                            transaction.amount ||
                            0
                        )
                    );

                },
                0
            );


    // ==================================================
    // 🔒 اللقطة النهائية
    // ==================================================

    return {

        date:
            dateKey,

        closedAt:
            new Date().toISOString(),

        operationsCount:
            dayOperations.length,

        totalAmount:
            salesTotal,

        summary: {

            salesCount:
                daySales.length,

            salesTotal:
                salesTotal,

            purchasesCount:
                dayPurchases.length + dayIndependentPurchases.length,

            purchasesTotal:
                purchasesTotal + independentPurchasesTotal,

            devicesCount:
                dayDevices.length,

            walletTransactionsCount:
                dayWalletTransactions.length,

            walletWithdrawTotal:
                walletWithdrawTotal,

            walletDepositTotal:
                walletDepositTotal,

            employeesCount:
                employeesSnapshot.length,
            inventoryDeviceCount: inventorySnapshot.devices.length,
            inventoryAccessoryTypes: inventorySnapshot.accessories.length,
            inventoryAccessoryUnits: inventorySnapshot.totalAccessoryUnits,
            inventoryAccessoryCostValue: inventorySnapshot.accessoryCostValue,
            inventoryAccessoryRetailValue: inventorySnapshot.accessoryRetailValue

        },

        data: {

            devices:
                dayDevices,

                maintenance:
        dayMaintenance,

            sales:
                daySales,

            purchases:
                dayPurchases,

            independentPurchases:
                dayIndependentPurchases,

            wallet:
                dayWalletTransactions,

            accessoryMovements:
                dayAccessoryMovements,

            employees:
                employeesSnapshot,

            inventory:
                inventorySnapshot,

            operations:
                dayOperations

        }

    };

}


// ======================================================
// إقفال يوم واحد وحفظه
// ======================================================

function closeDay(
    dateKey
) {

    const archives =
        loadDayCloseArchives();


    const alreadyClosed =
        archives.some(
            function (archive) {

                return (
                    archive.date ===
                    dateKey
                );

            }
        );


    if (alreadyClosed) {

        return false;

    }


    const snapshot =
        createDayCloseSnapshot(
            dateKey
        );


    archives.push(
        snapshot
    );


    archives.sort(
        function (a, b) {

            return (
                b.date.localeCompare(
                    a.date
                )
            );

        }
    );


    saveDayCloseArchives(
        archives
    );


    return true;

}

// ======================================================
// إقفال الأيام السابقة تلقائيًا
// ======================================================

function ensurePreviousDaysClosed() {

    const today = getToday();

    const archives = loadDayCloseArchives();

    const knownDates = new Set(
        archives.map(function (archive) {
            return archive.date;
        })
    );

    const datesToArchive = new Set();

    // تحويل التاريخ إلى YYYY-MM-DD بالتوقيت المحلي
    function getLocalDateKey(date) {

        const year = date.getFullYear();

        const month = String(
            date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            date.getDate()
        ).padStart(2, "0");

        return year + "-" + month + "-" + day;
    }

    // إضافة تاريخ سابق لم يتم حفظه من قبل
    function addPastDate(value) {

        if (!value) {
            return;
        }

        const date = String(value).slice(0, 10);

        if (
            /^\d{4}-\d{2}-\d{2}$/.test(date) &&
            date < today &&
            !knownDates.has(date)
        ) {
            datesToArchive.add(date);
        }
    }

    // الأجهزة والصيانة
    if (Array.isArray(devices)) {

        devices.forEach(function (item) {

            addPastDate(
                item.receiveDate ||
                item.createdAt
            );

        });

    }

    // المبيعات
    try {

        const salesKey =
            currentUser && currentUser.uid
                ? "actPhoneManager_sales_" + currentUser.uid
                : "actPhoneManager_sales_guest";

        const sales = JSON.parse(
            localStorage.getItem(salesKey) || "[]"
        );

        if (Array.isArray(sales)) {

            sales.forEach(function (item) {

                addPastDate(
                    item.date || item.createdAt
                );

            });

        }

    } catch (error) {

        console.error(
            "Day close sales error:",
            error
        );

    }

    // المشتريات
    try {

        const purchases = JSON.parse(
            localStorage.getItem(
                getUserKey("phonePurchases")
            ) || "[]"
        );

        if (Array.isArray(purchases)) {

            purchases.forEach(function (item) {

                addPastDate(
                    item.date || item.createdAt
                );

            });

        }

    } catch (error) {

        console.error(
            "Day close purchases error:",
            error
        );

    }

    // عمليات المحفظة
    [
        "withdraw",
        "deposit",
        "recharge",
        "bills",
        "transfer"
    ].forEach(function (operation) {

        try {

            const userId =
                currentUser && currentUser.uid
                    ? currentUser.uid
                    : "guest";

            const key =
                "actPhoneManager_wallet_transactions_" +
                operation +
                "_" +
                userId;

            const transactions = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            if (Array.isArray(transactions)) {

                transactions.forEach(function (item) {

                    addPastDate(
                        item.date || item.createdAt
                    );

                });

            }

        } catch (error) {

            console.error(
                "Day close wallet error:",
                operation,
                error
            );

        }

    });

    // العمليات العامة
    if (Array.isArray(dashboardOperations)) {

        dashboardOperations.forEach(function (item) {

            addPastDate(
                item.createdAt
            );

        });

    }

    // استكمال الأيام الناقصة بعد آخر يوم محفوظ
    if (archives.length) {

        const latestArchiveDate = archives.reduce(
            function (latest, archive) {

                return archive.date > latest
                    ? archive.date
                    : latest;

            },
            ""
        );

        if (
            latestArchiveDate &&
            latestArchiveDate < today
        ) {

            const cursor = new Date(
                latestArchiveDate + "T00:00:00"
            );

            cursor.setDate(
                cursor.getDate() + 1
            );

            while (
                getLocalDateKey(cursor) < today
            ) {

                const date = getLocalDateKey(cursor);

                if (!knownDates.has(date)) {
                    datesToArchive.add(date);
                }

                cursor.setDate(
                    cursor.getDate() + 1
                );

            }

        }

    }

    // حفظ يوم أمس عند الانتقال إلى يوم جديد
    const yesterday = new Date();

    yesterday.setDate(
        yesterday.getDate() - 1
    );

    const yesterdayKey = getLocalDateKey(yesterday);

    if (!knownDates.has(yesterdayKey)) {

        datesToArchive.add(yesterdayKey);

    }

    // تسجيل غياب الأيام التي انتهت ولم يسجل العامل فيها حضورًا، ثم حفظ الجرد اليومي.
    [...datesToArchive]
        .sort()
        .forEach(function (date) {
            let attendanceChanged = false;
            if (Array.isArray(employees)) {
                employees.forEach(function(employee) {
                    if (!employee || (employee.startDate && employee.startDate > date)) return;
                    if (!employee.attendance) employee.attendance = {};
                    if (!employee.attendance[date]) {
                        employee.attendance[date] = "absent";
                        employee.attendanceMeta = employee.attendanceMeta || {};
                        employee.attendanceMeta[date] = { automatic: true, backfilled: true, at: new Date().toISOString() };
                        attendanceChanged = true;
                    }
                });
            }
            if (attendanceChanged && typeof saveEmployees === "function") saveEmployees();
            closeDay(date);
        });

}

// متابعة انتقال التاريخ حتى لو ظل البرنامج مفتوحًا طوال الليل.
(function initDailyRolloverWatcher() {
    let observedDate = getToday();
    window.setInterval(function() {
        const currentDate = getToday();
        if (currentDate !== observedDate) {
            observedDate = currentDate;
            if (typeof processAutomaticEmployeeAbsences === "function") processAutomaticEmployeeAbsences();
            if (typeof ensurePreviousDaysClosed === "function") ensurePreviousDaysClosed();
            if (typeof window.renderDashboardHistory === "function") window.renderDashboardHistory();
        }
    }, 60000);
})();

// ======================================================
// تنسيق تاريخ اليوم للجرد
// ======================================================

function formatDayCloseDate(
    dateKey
) {

    const date =
        new Date(
            dateKey + "T00:00:00"
        );


    return date.toLocaleDateString(
        "ar-EG",
        {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}


// ======================================================
// 🔒 عرض جرد اليوم
// ======================================================

function renderDayCloseCurrentSummary() {

    const container =
        document.getElementById(
            "day-close-current-summary"
        );

    if (!container) {
        return;
    }

    const today =
        getToday();

    const snapshot =
        createDayCloseSnapshot(today);

    const summary =
        snapshot.summary || {};

    container.innerHTML = `

        <div
            style="
                display:grid;
                grid-template-columns:
                    repeat(
                        auto-fit,
                        minmax(180px, 1fr)
                    );
                gap:15px;
                margin-top:20px;
            "
        >

            <div class="day-close-summary-card">
                📱
                <strong>
                    الأجهزة
                </strong>
                <span>
                    ${summary.devicesCount || 0}
                </span>
            </div>


            <div class="day-close-summary-card">
                🛒
                <strong>
                    المبيعات
                </strong>
                <span>
                    ${summary.salesCount || 0}
                </span>
                <small>
                    ${formatMoney(summary.salesTotal || 0)}
                </small>
            </div>


            <div class="day-close-summary-card">
                📦
                <strong>
                    المشتريات
                </strong>
                <span>
                    ${summary.purchasesCount || 0}
                </span>
                <small>
                    ${formatMoney(summary.purchasesTotal || 0)}
                </small>
            </div>


            <div class="day-close-summary-card">
                💳
                <strong>
                    عمليات المحفظة
                </strong>
                <span>
                    ${summary.walletTransactionsCount || 0}
                </span>
            </div>


            <div class="day-close-summary-card">
                💰
                <strong>
                    إيداع المحفظة
                </strong>
                <small>
                    ${formatMoney(summary.walletDepositTotal || 0)}
                </small>
            </div>


            <div class="day-close-summary-card">
                💸
                <strong>
                    سحب المحفظة
                </strong>
                <small>
                    ${formatMoney(summary.walletWithdrawTotal || 0)}
                </small>
            </div>


            <div class="day-close-summary-card">
                👨‍💼
                <strong>
                    الموظفين
                </strong>
                <span>
                    ${summary.employeesCount || 0}
                </span>
            </div>

        </div>

    `;

}

// ======================================================
// عرض سجل الأيام السابقة
// ======================================================

function renderPreviousDays() {

    const container =
        document.getElementById(
            "previous-days-list"
        );


    if (!container) {
        return;
    }


    const archives =
        loadDayCloseArchives();


    if (!archives.length) {

        container.innerHTML = `
            <div
                style="
                    padding:25px;
                    text-align:center;
                    opacity:.7;
                "
            >
                لا توجد أيام سابقة محفوظة حتى الآن
            </div>
        `;

        return;

    }


    const months = {};


    archives.forEach(
        function (archive) {

            const monthKey =
                archive.date.slice(
                    0,
                    7
                );


            if (!months[monthKey]) {
                months[monthKey] = [];
            }


            months[monthKey].push(
                archive
            );

        }
    );


    const sortedMonths =
        Object.keys(months).sort(
            function (a, b) {

                return b.localeCompare(a);

            }
        );


    container.innerHTML =
        sortedMonths
            .map(
                function (monthKey) {

                    const monthDate =
                        new Date(
                            monthKey +
                            "-01T00:00:00"
                        );


                    const monthName =
                        monthDate.toLocaleDateString(
                            "ar-EG",
                            {
                                year:
                                    "numeric",
                                month:
                                    "long"
                            }
                        );


                    const days =
                        months[
                            monthKey
                        ].sort(
                            function (a, b) {

                                return b.date.localeCompare(
                                    a.date
                                );

                            }
                        );


                    return `
                        <div
                            class="day-close-month"
                            style="
                                margin-bottom:20px;
                                padding:20px;
                                border-radius:18px;
                                border:1px solid rgba(255,255,255,.10);
                                background:rgba(255,255,255,.04);
                            "
                        >

                            <h3
                                style="
                                    margin:0 0 15px;
                                "
                            >
                                📅 ${monthName}
                            </h3>

                            <div
                                style="
                                    display:grid;
                                    grid-template-columns:
                                        repeat(
                                            auto-fit,
                                            minmax(
                                                180px,
                                                1fr
                                            )
                                        );
                                    gap:12px;
                                "
                            >

                                ${days.map(
                                    function (day) {

                                        return `
                                            <button
                                                type="button"
                                                class="day-close-day-card"
                                                data-day-close-date="${day.date}"
                                                style="
                                                    padding:16px;
                                                    border-radius:14px;
                                                    border:1px solid rgba(255,255,255,.08);
                                                    background:rgba(255,255,255,.03);
                                                    color:inherit;
                                                    cursor:pointer;
                                                    text-align:right;
                                                "
                                            >

                                                <strong>
                                                    🗓️
                                                    ${formatDayCloseDate(
                                                        day.date
                                                    )}
                                                </strong>

                                                <small
                                                    style="
                                                        display:block;
                                                        margin-top:8px;
                                                        opacity:.7;
                                                    "
                                                >
                                                    ${day.operationsCount}
                                                    عملية
                                                </small>

                                            </button>
                                        `;

                                    }
                                ).join("")}

                            </div>

                        </div>
                    `;

                }
            )
            .join("");


    container
        .querySelectorAll(
            ".day-close-day-card"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const date =
                            button.dataset
                                .dayCloseDate;

                        openDayCloseDetails(
                            date
                        );

                    }
                );

            }
        );

    renderDayCloseComparison();

}


// ======================================================
// تفاصيل يوم محفوظ
// ======================================================

function openDayCloseDetails(dateKey) {
    const archive = loadDayCloseArchives().find(item => item && item.date === dateKey);
    if (!archive) return;
    const esc = value => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[ch]));
    const summary = archive.summary || {};
    const groups = [
        ["المبيعات", archive.data?.sales || []],
        ["المشتريات", [...(archive.data?.purchases || []), ...(archive.data?.independentPurchases || [])]],
        ["حركة الأجهزة", archive.data?.devices || []],
        ["حركة المحفظة", archive.data?.wallet || []],
        ["حركة الإكسسوارات", archive.data?.accessoryMovements || []]
    ];
    const rows = groups.map(([title, items]) => `<section><h2>${title} (${items.length})</h2>${items.length ? `<table><thead><tr><th>البيان</th><th>القيمة / الكمية</th></tr></thead><tbody>${items.map(item => {
        const name = item.productName || item.phoneName || item.product || item.name || item.service || item.operationName || item.type || "عملية";
        const value = item.total ?? item.price ?? item.amount ?? item.quantity ?? "—";
        return `<tr><td>${esc(name)}</td><td>${esc(value)}</td></tr>`;
    }).join("")}</tbody></table>` : `<p>لا توجد عمليات مسجلة.</p>`}</section>`).join("");
    const popup = window.open("", "act-day-close-report", "width=900,height=750");
    if (!popup) { alert("اسمح بفتح النوافذ المنبثقة لعرض وطباعة التقرير."); return; }
    popup.document.open();
    popup.document.write(`<!doctype html><html lang="ar" dir="rtl"><meta charset="utf-8"><title>تقرير إقفال ${esc(dateKey)}</title><style>body{font-family:Arial,sans-serif;padding:24px;color:#182230}h1{margin:0 0 8px}.meta{color:#667085;margin-bottom:20px}.summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}.tile{border:1px solid #ddd;border-radius:10px;padding:12px}.tile b{display:block;margin-bottom:5px}section{margin-top:22px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:right}button{padding:10px 18px;margin:14px 0;cursor:pointer}@media print{button{display:none}}</style><h1>تقرير إقفال اليوم</h1><div class="meta">${esc(formatDayCloseDate(archive.date))} · تم الحفظ: ${esc(archive.closedAt || "—")}</div><div class="summary"><div class="tile"><b>عدد المبيعات</b>${Number(summary.salesCount)||0}</div><div class="tile"><b>إجمالي المبيعات</b>${esc(formatMoney(summary.salesTotal||0))}</div><div class="tile"><b>عدد المشتريات</b>${Number(summary.purchasesCount)||0}</div><div class="tile"><b>إجمالي المشتريات</b>${esc(formatMoney(summary.purchasesTotal||0))}</div><div class="tile"><b>إيداع المحفظة</b>${esc(formatMoney(summary.walletDepositTotal||0))}</div><div class="tile"><b>سحب المحفظة</b>${esc(formatMoney(summary.walletWithdrawTotal||0))}</div><div class="tile"><b>الأجهزة</b>${Number(summary.devicesCount)||0}</div><div class="tile"><b>الموظفون</b>${Number(summary.employeesCount)||0}</div></div><button onclick="window.print()">طباعة التقرير</button>${rows}</html>`);
    popup.document.close();
}

function renderDayCloseComparison() {
    const container = document.getElementById("day-close-comparison");
    if (!container) return;
    const archives = loadDayCloseArchives().slice().sort((a,b)=>b.date.localeCompare(a.date));
    if (archives.length < 2) { container.innerHTML = `<small>ستظهر المقارنة بعد حفظ إقفال يومين على الأقل.</small>`; return; }
    const options = archives.map(a => `<option value="${a.date}">${formatDayCloseDate(a.date)}</option>`).join("");
    container.innerHTML = `<div class="day-close-compare-controls"><label>اليوم الأول <select id="day-close-compare-a">${options}</select></label><label>اليوم الثاني <select id="day-close-compare-b">${options}</select></label><button type="button" id="day-close-compare-run">مقارنة اليومين</button></div><div id="day-close-compare-result"></div>`;
    const a = container.querySelector("#day-close-compare-a"), b = container.querySelector("#day-close-compare-b");
    if (b && archives[1]) b.value = archives[1].date;
    container.querySelector("#day-close-compare-run")?.addEventListener("click", () => {
        const first = archives.find(x=>x.date===a.value), second = archives.find(x=>x.date===b.value);
        const target = container.querySelector("#day-close-compare-result");
        if (!first || !second || first.date === second.date) { target.textContent = "اختر يومين مختلفين للمقارنة."; return; }
        const x=first.summary||{}, y=second.summary||{};
        const rows=[["المبيعات",x.salesTotal,y.salesTotal],["المشتريات",x.purchasesTotal,y.purchasesTotal],["عدد عمليات البيع",x.salesCount,y.salesCount],["عدد عمليات الشراء",x.purchasesCount,y.purchasesCount],["إيداع المحفظة",x.walletDepositTotal,y.walletDepositTotal],["سحب المحفظة",x.walletWithdrawTotal,y.walletWithdrawTotal]];
        target.innerHTML=`<div class="day-close-compare-table"><h4>${formatDayCloseDate(first.date)} مقابل ${formatDayCloseDate(second.date)}</h4><table><thead><tr><th>المؤشر</th><th>اليوم الأول</th><th>اليوم الثاني</th><th>الفرق</th></tr></thead><tbody>${rows.map(([label,v1,v2])=>`<tr><td>${label}</td><td>${formatMoney(v1||0)}</td><td>${formatMoney(v2||0)}</td><td>${formatMoney((Number(v2)||0)-(Number(v1)||0))}</td></tr>`).join("")}</tbody></table></div>`;
    });
}


// ======================================================
// تجهيز أرشيف الأيام عند تحميل النظام
// ======================================================



function getCurrentTime() { 
 
    const date = 
        new Date(); 
 
    const hours = 
        String( 
            date.getHours() 
        ).padStart( 
            2, 
            "0" 
        ); 
 
    const minutes = 
        String( 
            date.getMinutes() 
        ).padStart( 
            2, 
            "0" 
        ); 
 
    return ( 
        hours + 
        ":" + 
        minutes 
    ); 
} 
 
 
// ====================================================== 
// السيريال 
// ====================================================== 
 
function ensureSerialField() { 
 
    if (!deviceForm) { 
        return; 
    } 
 
    serialNumber = 
        document.getElementById( 
            "serial-number" 
        ); 
 
    if (serialNumber) { 
        return; 
    } 
 
 
    const wrapper = 
        document.createElement( 
            "div" 
        ); 
 
    wrapper.className = 
        "form-group serial-field-wrapper"; 
 
    wrapper.innerHTML = ` 
        <label for="serial-number"> 
            🔢 ${currentLanguage === "ar" ? "سيريال الجهاز" : "Device Serial"} 
        </label> 
 
        <input 
            type="text" 
            id="serial-number" 
            autocomplete="off" 
            placeholder="${ 
                currentLanguage === "ar" 
                    ? "أدخل سيريال الجهاز" 
                    : "Enter device serial" 
            }" 
        > 
    `; 
 
 
    const notesField = 
        notes 
            ? notes.closest( 
                ".form-group" 
            ) 
            : null; 
 
 
    if (notesField) { 
 
        notesField.parentNode.insertBefore( 
            wrapper, 
            notesField 
        ); 
 
    } else { 
 
        deviceForm.appendChild( 
            wrapper 
        ); 
    } 
 
 
    serialNumber = 
        document.getElementById( 
            "serial-number" 
        ); 
} 
 
 
// ====================================================== 
// إخفاء الأقسام الرئيسية 
// ====================================================== 
 
function hideAllMainSections() { 
 
    if (salesArea) { 
 
        salesArea.style.display = 
            "none"; 
    } 
 
    if (customersSection) { 
 
        customersSection.style.display = 
            "none"; 
    } 
 
    if (employeesSection) { 
 
        employeesSection.style.display = 
            "none"; 
    } 
} 
 
// ======================================================
// عرض البيع
// ======================================================

function showSalesArea() {

    hideAllMainSections();

    if (salesArea) {

        salesArea.style.display =
            "block";
    }

    currentSection =
        SECTIONS.SALE;

    formSection =
        SECTIONS.SALE;

    closeMaintenanceView();

    hideEmployeeViews();

    hideSaleSearch();


    // ==========================================
    // إغلاق نموذج إضافة الجهاز عند دخول القسم
    // ==========================================

    if (deviceForm) {

        deviceForm.style.display =
            "none";
    }


    renderSaleDevices();
}

// ====================================================== 
// عرض العملاء والصيانة 
// ====================================================== 
 
function showCustomersArea() { 
 
    hideAllMainSections(); 
 
    if (customersSection) { 
 
        customersSection.style.display = 
            "block"; 
    } 
 
    if (deviceForm) { 
 
        deviceForm.style.display = 
            "none"; 
    } 
 
    if (deviceList) { 
 
        deviceList.style.display = 
            "none"; 
    } 
 
    if (saleAddButton) { 
 
        saleAddButton.style.display = 
            "none"; 
    } 
 
    closeMaintenanceView(); 
 
    hideEmployeeViews(); 
} 
 
 
// ====================================================== 
// عرض العاملين 
// ====================================================== 
 
function showEmployeesArea() { 
 
    hideAllMainSections(); 
 
    if (employeesSection) { 
 
        employeesSection.style.display = 
            "block"; 
    } 
 
    if (saleAddButton) { 
 
        saleAddButton.style.display = 
            "none"; 
    } 
 
    if (deviceForm) { 
 
        deviceForm.style.display = 
            "none"; 
    } 
 
    if (deviceList) { 
 
        deviceList.style.display = 
            "none"; 
    } 
 
    closeMaintenanceView(); 
 
    showEmployeeMain(); 
 
    if (employeeSearchInput) { 
 
        employeeSearchInput.parentElement.style.display = 
            "block"; 
    } 
 
    renderEmployees(); 
 
    updateEmployeeStats(); 
} 
 
 
// ====================================================== 
// الأقسام الرئيسية 
// ====================================================== 
 
if (sectionButtons.length) { 
 
    sectionButtons.forEach( 
        function ( 
            button, 
            index 
        ) { 
 
            button.addEventListener( 
                "click", 
                function () { 
 
                    sectionButtons.forEach( 
                        item => 
                            item.classList.remove( 
                                "active" 
                            ) 
                    ); 
 
                    button.classList.add( 
                        "active" 
                    ); 
 
 
                    if (index === 0) { 
 
                        showSalesArea(); 
                    } 
 
 
                    if (index === 1) { 
 
                        showCustomersArea(); 
                    } 
 
 
                    if (index === 2) { 
 
                        showEmployeesArea(); 
                    } 
                } 
            ); 
        } 
    ); 
} 
 
 
if (employeesSectionButton) { 
 
    employeesSectionButton.addEventListener( 
        "click", 
        showEmployeesArea 
    ); 
} 
 
 
// ====================================================== 
// نموذج الجهاز 
// ====================================================== 
 
function clearDeviceForm() { 
 
    if (phoneName) { 
 
        phoneName.value = 
            ""; 
    } 
 
    if (customerName) { 
 
        customerName.value = 
            ""; 
    } 
 
    if (receiveDate) { 
 
        receiveDate.value = 
            getToday(); 
    } 
 
    if (receiveTime) { 
 
        receiveTime.value = 
            getCurrentTime(); 
    } 
 
    if (problem) { 
 
        problem.value = 
            ""; 
    } 
 
    if (changedParts) { 
 
        changedParts.value = 
            ""; 
    } 
 
    if (price) { 
 
        price.value = 
            ""; 
    } 
 
    if (notes) { 
 
        notes.value = 
            ""; 
    } 
 
    ensureSerialField(); 
 
    if (serialNumber) { 
 
        serialNumber.value = 
            ""; 
    } 
} 
 
 
function openDeviceForm() { 
 
    currentSection = 
        SECTIONS.SALE; 
 
    formSection = 
        SECTIONS.SALE; 
 
 
    if (deviceForm) { 
 
        deviceForm.style.display = 
            "block"; 
 
        deviceForm.scrollIntoView({ 
            behavior: 
                "smooth", 
            block: 
                "start" 
        }); 
    } 
 
 
    if (!editingDeviceId) { 
 
        clearDeviceForm(); 
    } 
} 
 
 
function closeDeviceForm() { 
 
    editingDeviceId = 
        null; 
 
    if (deviceForm) { 
 
        deviceForm.style.display = 
            "none"; 
    } 
 
    clearDeviceForm(); 
} 
 
 
if (saleAddButton) { 
 
    saleAddButton.addEventListener( 
        "click", 
        function () { 
 
            editingDeviceId = 
                null; 
 
            openDeviceForm(); 
        } 
    ); 
} 
 
 
if (closeDeviceFormButton) { 
 
    closeDeviceFormButton.addEventListener( 
        "click", 
        closeDeviceForm 
    ); 
} 
 
 // ======================================================
// حفظ الجهاز
// ======================================================

function saveDevice() {

    const devicePhotoData = document.getElementById("device-photo-input")?.dataset.imageData || "";

    const name =
        phoneName
            ? phoneName.value.trim()
            : "";

    const customer =
        customerName
            ? customerName.value.trim()
            : "";


    if (!name) {

        alert(
            currentLanguage === "ar"
                ? "من فضلك اكتب اسم الجهاز."
                : "Please enter the device name."
        );

        return;
    }


    if (!customer) {

        alert(
            currentLanguage === "ar"
                ? "من فضلك اكتب اسم صاحب الجهاز."
                : "Please enter the customer name."
        );

        return;
    }


    // الجهاز الذي تم حفظه فعليًا
    let savedDevice = null;


    // ==================================================
    // تعديل جهاز موجود
    // ==================================================

    if (editingDeviceId) {

        const index =
            devices.findIndex(
                device =>
                    device.id ===
                    editingDeviceId
            );


        if (index !== -1) {

            devices[index] = {

                ...devices[index],

                phoneName:
                    name,

                customerName:
                    customer,

                receiveDate:
                    receiveDate
                        ? receiveDate.value
                        : "",

                receiveTime:
                    receiveTime
                        ? receiveTime.value
                        : "",

                problem:
                    problem
                        ? problem.value.trim()
                        : "",

                changedParts:
                    changedParts
                        ? changedParts.value.trim()
                        : "",

                price:
                    price
                        ? price.value
                        : "",

                notes:
                    notes
                        ? notes.value.trim()
                        : "",

                serialNumber:
                    serialNumber
                        ? serialNumber.value.trim()
                        : "",
                photo: devicePhotoData || devices[index].photo || ""
            };


            savedDevice =
                devices[index];
        }

    }


    // ==================================================
    // إضافة جهاز جديد
    // ==================================================

    else {

        const device = {

            id:
                createId(
                    "device"
                ),

            number:
                Date.now(),

            phoneName:
                name,

            customerName:
                customer,

            receiveDate:
                receiveDate
                    ? receiveDate.value
                    : getToday(),

            receiveTime:
                receiveTime
                    ? receiveTime.value
                    : getCurrentTime(),

            problem:
                problem
                    ? problem.value.trim()
                    : "",

            changedParts:
                changedParts
                    ? changedParts.value.trim()
                    : "",

            price:
                price
                    ? price.value
                    : "",

            notes:
                notes
                    ? notes.value.trim()
                    : "",

            serialNumber:
                serialNumber
                    ? serialNumber.value.trim()
                    : "",

            category:
                SECTIONS.SALE,

            section:
                "sale",

            status:
                "البيع",

            photo: devicePhotoData,
            createdAt:
                new Date().toISOString()
        };


        const stockResult = window.actPhoneInventoryConsumeSale
            ? window.actPhoneInventoryConsumeSale(name, device.serialNumber)
            : { matched: false, ok: true };
        if (stockResult.matched && !stockResult.ok) {
            alert("هذا الجهاز غير متاح في مخزون الأجهزة. راجع الكمية قبل تسجيل البيع.");
            return;
        }

        devices.unshift(
            device
        );


        savedDevice =
            device;
    }


    // ==================================================
    // حفظ البيانات
    // ==================================================

    saveDevices();


    // ==================================================
    // تسجيل العملية في آخر العمليات
    // ==================================================

    if (
    !editingDeviceId &&
    savedDevice
) {

    try {

        addDashboardOperation({

            type:
                "device-add",

            icon:
                "📱",

            title:
                "إضافة جهاز",

            details:
                savedDevice.phoneName +
                " • " +
                savedDevice.customerName,

            amount:
                savedDevice.price
        });

    } catch (error) {

        console.warn(
            "تعذر تسجيل العملية في آخر العمليات:",
            error
        );

    }
}


    // ==================================================
    // إنهاء الحفظ
    // ==================================================

    editingDeviceId =
        null;

    // Each newly-created device starts with an empty photo selection.
    const savedPhotoInput = document.getElementById("device-photo-input");
    if (savedPhotoInput) { savedPhotoInput.value = ""; savedPhotoInput.dataset.imageData = ""; }
    const savedPhotoPreview = document.getElementById("device-photo-preview");
    if (savedPhotoPreview) { savedPhotoPreview.removeAttribute("src"); savedPhotoPreview.style.display = "none"; }

    closeDeviceForm();

    renderSaleDevices();
}


// ======================================================
// زر حفظ الجهاز
// ======================================================

if (saveDeviceButton) {

    saveDeviceButton.addEventListener(
        "click",
        saveDevice
    );
}

const devicePhotoInput = document.getElementById("device-photo-input");
const devicePhotoPreview = document.getElementById("device-photo-preview");
devicePhotoInput?.addEventListener("change", function () {
    const file = this.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("اختر صورة صالحة."); return; }
    const reader = new FileReader();
    reader.onload = () => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
            canvas.width = Math.round(img.width * scale);
            canvas.height = Math.round(img.height * scale);
            canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
            devicePhotoInput.dataset.imageData = canvas.toDataURL("image/jpeg", 0.78);
            if (devicePhotoPreview) { devicePhotoPreview.src = devicePhotoInput.dataset.imageData; devicePhotoPreview.style.display = "block"; }
        };
        img.src = reader.result;
    };
    reader.readAsDataURL(file);
});


// ======================================================
// بطاقات البيع
// ======================================================

function renderSaleDevices() {

    if (!deviceList) {
        return;
    }


    if (
        currentSection !==
        SECTIONS.SALE
    ) {
        return;
    }


    deviceList.style.display =
        "grid";


    if (saleAddButton) {

        saleAddButton.style.display =
            "";
    }


    const saleDevices =
        devices.filter(
            device =>
                device.category ===
                    SECTIONS.SALE ||
                (
                    device.section ===
                    "sale" &&
                    !device.category
                )
        );


    if (!saleDevices.length) {

        deviceList.innerHTML = `

            <div class="empty-state">

                <div style="font-size:45px;">
                    📱
                </div>

                <h3>
                    ${
                        currentLanguage === "ar"
                            ? "لا توجد أجهزة للبيع"
                            : "No devices for sale"
                    }
                </h3>

                <p>
                    ${
                        currentLanguage === "ar"
                            ? 'اضغط على "إضافة جهاز جديد" لإضافة أول جهاز.'
                            : 'Click "Add New Device" to add your first device.'
                    }
                </p>

            </div>
        `;

        return;
    }


    deviceList.innerHTML =
        saleDevices
            .map(
                function (
                    device,
                    index
                ) {

                    return `

                    <article
                        class="device-card"
                    >

                        <div
                            class="device-card-top"
                            style="
                                display:flex;
                                align-items:center;
                                justify-content:space-between;
                                gap:10px;
                            "
                        >

                            <div
                                class="device-number"
                            >
                                #${index + 1}
                            </div>


                            <div
                                class="device-actions"
                            >

                                <button
                                    type="button"
                                    class="card-edit-button"
                                    data-id="${escapeHTML(device.id)}"
                                    title="${t("edit")}"
                                >
                                    ${t("edit")}
                                </button>


                                <button
                                    type="button"
                                    class="card-delete-button"
                                    data-id="${escapeHTML(device.id)}"
                                    title="${t("delete")}"
                                >
                                    ${t("delete")}
                                </button>

                            </div>

                        </div>


                        <div
                            class="device-card-icon"
                            style="
                                font-size:38px;
                                margin:14px 0;
                            "
                        >
                            📱
                        </div>


                        ${device.photo ? `<img class="purchase-device-photo" src="${device.photo}" alt="صورة الجهاز">` : ""}
                        <h3>
                            ${escapeHTML(
                                device.phoneName
                            )}
                        </h3>


                        ${device.customerName ? `<div class="device-info purchase-detail-row"><strong>اسم العميل:</strong> <span>${escapeHTML(device.customerName)}</span></div>` : ""}
                        ${device.sellerName ? `<div class="device-info purchase-detail-row"><strong>اسم البائع:</strong> <span>${escapeHTML(device.sellerName)}</span></div>` : ""}
                        <div class="device-info purchase-detail-row"><strong>حالة الكرتونة:</strong> <span>${device.boxIncluded === false ? "بدون كرتونة" : "معاه كرتونة"}</span></div>


                        ${device.receiveDate ? `<div class="device-info purchase-detail-row"><strong>تاريخ الاستلام:</strong> <span>${escapeHTML(device.receiveDate)}</span></div>` : ""}


                        ${device.receiveTime ? `<div class="device-info purchase-detail-row"><strong>وقت الاستلام:</strong> <span>${escapeHTML(device.receiveTime)}</span></div>` : ""}


                        ${
                            device.serialNumber
                                ? `
                                <div class="device-info purchase-detail-row"><strong>رقم السيريال:</strong> <span>${escapeHTML(device.serialNumber)}</span></div>
                                `
                                : ""
                        }


                        ${
                            device.problem
                                ? `
                                <div class="device-info purchase-detail-row"><strong>العطل / الحالة:</strong> <span>${escapeHTML(device.problem)}</span></div>
                                `
                                : ""
                        }


                        ${
                            device.changedParts
                                ? `
                                <div class="device-info purchase-detail-row"><strong>القطع المتغيرة:</strong> <span>${escapeHTML(device.changedParts)}</span></div>
                                `
                                : ""
                        }


                        ${
                            device.price
                                ? `
                                <div class="device-price purchase-detail-row"><strong>السعر:</strong> <span>${formatMoney(device.price)}</span></div>
                                `
                                : ""
                        }


                        ${
                            device.notes
                                ? `
                                <div class="device-notes">
                                    📝
                                    ${escapeHTML(
                                        device.notes
                                    )}
                                </div>
                                `
                                : ""
                        }


                        <div
                            class="card-print-area"
                        >

                            <button
                                type="button"
                                class="card-print-button"
                                data-id="${escapeHTML(device.id)}"
                                title="${
                                    currentLanguage === "ar"
                                        ? "طباعة"
                                        : "Print"
                                }"
                            >
                                🖨️
                                ${
                                    currentLanguage === "ar"
                                        ? "طباعة"
                                        : "Print"
                                }
                            </button>

                        </div>

                    </article>
                    `;
                }
            )
            .join("");


    attachSaleCardEvents();
}


// ======================================================
// أحداث بطاقات البيع
// ======================================================

function attachSaleCardEvents() {

    if (!deviceList) {
        return;
    }


    deviceList
        .querySelectorAll(
            ".card-edit-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        editSaleDevice(
                            this.dataset.id
                        );
                    }
                );
            }
        );


    deviceList
        .querySelectorAll(
            ".card-delete-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        deleteSaleDevice(
                            this.dataset.id
                        );
                    }
                );
            }
        );


    deviceList
        .querySelectorAll(
            ".card-print-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        printDevice(
                            this.dataset.id
                        );
                    }
                );
            }
        );
}
 
// ====================================================== 
// تعديل جهاز البيع 
// ====================================================== 
 
function editSaleDevice( 
    id 
) { 
 
    const device = 
        devices.find( 
            item => 
                item.id === id 
        ); 
 
    if (!device) { 
        return; 
    } 
 
 
    editingDeviceId = 
        id; 
 
    currentSection = 
        SECTIONS.SALE; 
 
    formSection = 
        SECTIONS.SALE; 
 
 
    if (deviceForm) { 
 
        deviceForm.style.display = 
            "block"; 
    } 
 
 
    if (phoneName) { 
 
        phoneName.value = 
            device.phoneName || ""; 
    } 
 
    if (customerName) { 
 
        customerName.value = 
            device.customerName || ""; 
    } 
 
    if (receiveDate) { 
 
        receiveDate.value = 
            device.receiveDate || ""; 
    } 
 
    if (receiveTime) { 
 
        receiveTime.value = 
            device.receiveTime || ""; 
    } 
 
    if (problem) { 
 
        problem.value = 
            device.problem || ""; 
    } 
 
    if (changedParts) { 
 
        changedParts.value = 
            device.changedParts || ""; 
    } 
 
    if (price) { 
 
        price.value = 
            device.price || ""; 
    } 
 
    if (notes) { 
 
        notes.value = 
            device.notes || ""; 
    } 
 
    ensureSerialField(); 
 
    if (serialNumber) { 
 
        serialNumber.value = 
            device.serialNumber || ""; 
    } 
 
 
    if (deviceForm) { 
 
        deviceForm.scrollIntoView({ 
            behavior: 
                "smooth", 
            block: 
                "start" 
        }); 
    } 
} 
 
 
// ====================================================== 
// حذف جهاز البيع 
// ====================================================== 
 
function deleteSaleDevice( 
    id 
) { 
 
    const device = 
        devices.find( 
            item => 
                item.id === id 
        ); 
 
    if (!device) { 
        return; 
    } 
 
 
    const confirmed = 
        confirm( 
            currentLanguage === "ar" 
                ? `هل أنت متأكد من حذف جهاز "${device.phoneName}"؟` 
                : `Are you sure you want to delete "${device.phoneName}"?` 
        ); 
 
 
    if (!confirmed) { 
        return; 
    } 
 
 
    devices = 
        devices.filter( 
            item => 
                item.id !== id 
        ); 
 
 
    saveDevices(); 
 
    renderSaleDevices(); 
} 
 
 
// ====================================================== 
// طباعة الجهاز 
// ====================================================== 
 
function printDevice( 
    id 
) { 
 
    const device = 
        devices.find( 
            item => 
                item.id === id 
        ); 
 
    if (!device) { 
        return; 
    } 
 
 
    const title = 
        currentLanguage === "ar" 
            ? "بيانات الجهاز" 
            : "Device Details"; 
 
 
    const html = ` 
 
        <!DOCTYPE html> 
 
        <html 
            lang="${currentLanguage}" 
            dir="${ 
                currentLanguage === "ar" 
                    ? "rtl" 
                    : "ltr" 
            }" 
        > 
 
        <head> 
 
            <meta charset="UTF-8"> 
 
            <title> 
                ${escapeHTML(title)} 
            </title> 
 
            <style> 
 
                body { 
                    font-family: Arial, sans-serif; 
                    padding: 35px; 
                    color: #111; 
                    background: #fff; 
                } 
 
                .print-box { 
                    max-width: 760px; 
                    margin: auto; 
                    border: 2px solid #111; 
                    padding: 30px; 
                    border-radius: 16px; 
                } 
 
                h1 { 
                    text-align: center; 
                    margin-bottom: 8px; 
                } 
 
                h2 { 
                    text-align: center; 
                    margin-bottom: 25px; 
                } 
 
                .row { 
                    display: flex; 
                    justify-content: space-between; 
                    gap: 20px; 
                    padding: 12px 0; 
                    border-bottom: 1px solid #ddd; 
                } 
 
                .label { 
                    font-weight: 700; 
                } 
 
                .notes { 
                    margin-top: 20px; 
                    padding: 15px; 
                    background: #f5f5f5; 
                    border-radius: 10px; 
                    white-space: pre-wrap; 
                } 
 
                @media print { 
 
                    body { 
                        padding: 0; 
                    } 
 
                    .print-box { 
                        border: 0; 
                    } 
                } 
 
            
/* auto light layer */

:where(html[data-theme="light"]) .print-box {
  border: 2px solid #c5c5c5;
}</style> 
 
        </head> 
 
        <body> 
 
            <div class="print-box"> 
 
                <h1> 
                    ACT PHONE MANAGER 
                </h1> 
 
                <h2> 
                    ${escapeHTML(title)} 
                </h2> 
 
                <div class="row"> 
                    <span class="label"> 
                        ${ 
                            currentLanguage === "ar" 
                                ? "الجهاز" 
                                : "Device" 
                        } 
                    </span> 
 
                    <span> 
                        ${escapeHTML( 
                            device.phoneName || "-" 
                        )} 
                    </span> 
                </div> 
 
 
                <div class="row"> 
                    <span class="label"> 
                        ${ 
                            currentLanguage === "ar" 
                                ? "صاحب الجهاز" 
                                : "Customer" 
                        } 
                    </span> 
 
                    <span> 
                        ${escapeHTML( 
                            device.customerName || "-" 
                        )} 
                    </span> 
                </div> 
 
 
                <div class="row"> 
                    <span class="label"> 
                        ${ 
                            currentLanguage === "ar" 
                                ? "السيريال" 
                                : "Serial" 
                        } 
                    </span> 
 
                    <span> 
                        ${escapeHTML( 
                            device.serialNumber || "-" 
                        )} 
                    </span> 
                </div> 
 
 
                <div class="row"> 
                    <span class="label"> 
                        ${ 
                            currentLanguage === "ar" 
                                ? "التاريخ" 
                                : "Date" 
                        } 
                    </span> 
 
                    <span> 
                        ${escapeHTML( 
                            device.receiveDate || "-" 
                        )} 
                    </span> 
                </div> 
 
 
                <div class="row"> 
                    <span class="label"> 
                        ${ 
                            currentLanguage === "ar" 
                                ? "الوقت" 
                                : "Time" 
                        } 
                    </span> 
 
                    <span> 
                        ${escapeHTML( 
                            device.receiveTime || "-" 
                        )} 
                    </span> 
                </div> 
 
 
                <div class="row"> 
                    <span class="label"> 
                        ${ 
                            currentLanguage === "ar" 
                                ? "العيب" 
                                : "Problem" 
                        } 
                    </span> 
 
                    <span> 
                        ${escapeHTML( 
                            device.problem || "-" 
                        )} 
                    </span> 
                </div> 
 
 
                <div class="row"> 
                    <span class="label"> 
                        ${ 
                            currentLanguage === "ar" 
                                ? "الأجزاء التي يتم تغييرها" 
                                : "Changed Parts" 
                        } 
                    </span> 
 
                    <span> 
                        ${escapeHTML( 
                            device.changedParts || "-" 
                        )} 
                    </span> 
                </div> 
 
 
                <div class="row"> 
                    <span class="label"> 
                        ${ 
                            currentLanguage === "ar" 
                                ? "السعر" 
                                : "Price" 
                        } 
                    </span> 
 
                    <span> 
                        ${ 
                            device.price 
                                ? formatMoney( 
                                    device.price 
                                ) 
                                : "-" 
                        } 
                    </span> 
                </div> 
 
 
                ${ 
                    device.notes 
                        ? ` 
                            <div class="notes"> 
                                <strong> 
                                    ${ 
                                        currentLanguage === "ar" 
                                            ? "ملاحظات" 
                                            : "Notes" 
                                    } 
                                </strong> 
 
                                <br> 
 
                                ${escapeHTML( 
                                    device.notes 
                                )} 
                            </div> 
                        ` 
                        : "" 
                } 
 
            </div> 
 
 
            <script> 
                window.onload = function () { 
                    window.print(); 
                }; 
            <\/script> 
 
        </body> 
 
        </html> 
    `; 
 
 
    const printWindow = 
        window.open( 
            "", 
            "_blank", 
            "width=900,height=700" 
        ); 
 
 
    if (!printWindow) { 
 
        alert( 
            currentLanguage === "ar" 
                ? "السماح بالنوافذ المنبثقة مطلوب للطباعة." 
                : "Please allow pop-ups to print." 
        ); 
 
        return; 
    } 
 
 
    printWindow.document.open(); 
 
    printWindow.document.write( 
        html 
    ); 
 
    printWindow.document.close(); 
} 
 
 
// ====================================================== 
// البحث في الأجهزة 
// ====================================================== 
 
function filterSaleDevices( 
    searchValue 
) { 
 
    const value = 
        String( 
            searchValue || "" 
        ) 
            .trim() 
            .toLowerCase(); 
 
 
    if (!value) { 
 
        renderSaleDevices(); 
 
        return; 
    } 
 
 
    if (!deviceList) { 
        return; 
    } 
 
 
    const saleDevices = 
        devices.filter( 
            device => 
                ( 
                    device.category === 
                        SECTIONS.SALE || 
                    ( 
                        device.section === 
                        "sale" && 
                        !device.category 
                    ) 
                ) 
        ); 
 
 
    const filtered = 
        saleDevices.filter( 
            device => { 
 
                const text = [ 
 
                    device.phoneName, 
 
                    device.customerName, 
 
                    device.serialNumber, 
 
                    device.problem, 
 
                    device.changedParts, 
 
                    device.notes, 
 
                    device.price 
 
                ] 
                    .map( 
                        item => 
                            String( 
                                item || "" 
                            ) 
                                .toLowerCase() 
                    ) 
                    .join(" "); 
 
 
                return text.includes( 
                    value 
                ); 
            } 
        ); 
 
 
    if (!filtered.length) { 
 
        deviceList.innerHTML = ` 
 
            <div class="empty-state"> 
 
                <div style="font-size:45px;"> 
                    🔎 
                </div> 
 
                <h3> 
                    ${ 
                        currentLanguage === "ar" 
                            ? "لا توجد نتائج" 
                            : "No results" 
                    } 
                </h3> 
 
                <p> 
                    ${ 
                        currentLanguage === "ar" 
                            ? "جرب كلمة بحث مختلفة." 
                            : "Try another search." 
                    } 
                </p> 
 
            </div> 
 
        `; 
 
        return; 
    } 
 
 
    deviceList.innerHTML = 
        filtered 
            .map( 
                function ( 
                    device, 
                    index 
                ) { 
 
                    return ` 
 
                    <article 
                        class="device-card" 
                    > 
 
                        <div 
                            class="device-card-top" 
                            style=" 
                                display:flex; 
                                align-items:center; 
                                justify-content:space-between; 
                                gap:10px; 
                            " 
                        > 
 
                            <div 
                                class="device-number" 
                            > 
                                #${index + 1} 
                            </div> 
 
                            <div 
                                class="device-actions" 
                            > 
 
                                <button 
                                    type="button" 
                                    class="card-edit-button" 
                                    data-id="${escapeHTML(device.id)}" 
                                > 
                                    ${t("edit")} 
                                </button> 
 
                                <button 
                                    type="button" 
                                    class="card-delete-button" 
                                    data-id="${escapeHTML(device.id)}" 
                                > 
                                    ${t("delete")} 
                                </button> 
 
                            </div> 
 
                        </div> 
 
 
                        <div 
                            class="device-card-icon" 
                            style=" 
                                font-size:38px; 
                                margin:14px 0; 
                            " 
                        > 
                            📱 
                        </div> 
 
 
                        <h3> 
                            ${escapeHTML( 
                                device.phoneName 
                            )} 
                        </h3> 
 
 
                        <div class="device-info"> 
                            👤 
                            ${escapeHTML( 
                                device.customerName 
                            )} 
                        </div> 
 
 
                        <div class="device-info"> 
                            📅 
                            ${escapeHTML( 
                                device.receiveDate 
                            )} 
                        </div> 
 
 
                        ${ 
                            device.serialNumber 
                                ? ` 
                                <div class="device-info"> 
                                    🔢 
                                    ${escapeHTML( 
                                        device.serialNumber 
                                    )} 
                                </div> 
                                ` 
                                : "" 
                        } 
 
 
                        ${ 
                            device.problem 
                                ? ` 
                                <div class="device-info"> 
                                    🛠️ 
                                    ${escapeHTML( 
                                        device.problem 
                                    )} 
                                </div> 
                                ` 
                                : "" 
                        } 
 
 
                        ${ 
                            device.price 
                                ? ` 
                                <div class="device-price"> 
                                    💰 
                                    ${formatMoney( 
                                        device.price 
                                    )} 
                                </div> 
                                ` 
                                : "" 
                        } 
 
 
                        <div 
                            class="card-print-area" 
                        > 
 
                            <button 
                                type="button" 
                                class="card-print-button" 
                                data-id="${escapeHTML(device.id)}" 
                            > 
                                🖨️ 
                                ${ 
                                    currentLanguage === "ar" 
                                        ? "طباعة" 
                                        : "Print" 
                                } 
                            </button> 
 
                        </div> 
 
                    </article> 
 
                    `; 
                } 
            ) 
            .join(""); 
 
 
    attachSaleCardEvents(); 
} 
 
 
if (searchInput) { 
 
    searchInput.addEventListener( 
        "input", 
        function () { 
 
            filterSaleDevices( 
                this.value 
            ); 
        } 
    ); 
} 
 
 
// ====================================================== 
// البحث وإدارة ظهور البحث 
// ====================================================== 
 
function hideSaleSearch() { 
 
    if (!searchInput) { 
        return; 
    } 
 
 
    const wrapper = 
        searchInput.closest( 
            ".search-wrapper" 
        ); 
 
 
    if (wrapper) { 
 
        wrapper.style.display = 
            "block"; 
 
    } else { 
 
        searchInput.style.display = 
            "block"; 
    } 
} 
 
 
function prepareSaleSearch() { 
 
    if (!searchInput) { 
        return; 
    } 
 
    const wrapper = 
        searchInput.closest( 
            ".search-wrapper" 
        ); 
 
    if (wrapper) { 
 
        wrapper.style.display = 
            "block"; 
    } 
 
    searchInput.style.display = 
        "block"; 
} 
 
 
// ====================================================== 
// الصيانة 
// ====================================================== 
 
const maintenanceStatusView = 
    document.getElementById( 
        "maintenance-status-view" 
    ); 
 
 
const maintenanceDeviceList = 
    document.getElementById( 
        "maintenance-device-list" 
    ); 
 
 
let maintenanceSearchInput = null; 
 
let maintenanceSearchWrapper = null; 
 
// ======================================================
// عرض الصيانة
// ======================================================

function showMaintenanceSection(
    section
) {

    currentSection =
        section;

    maintenanceButtons.forEach(button => {
        const active = button.dataset.section === section;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    // إخفاء الأقسام الأخرى

    if (salesArea) {

        salesArea.style.display =
            "none";
    }

    if (customersSection) {

    customersSection.style.display =
        "block";
}

const moreSection =
    document.getElementById("more-section");

if (moreSection) {

    moreSection.style.display =
        "none";
}

    if (employeesSection) {

        employeesSection.style.display =
            "none";
    }

    if (deviceForm) {

        deviceForm.style.display =
            "none";
    }

    if (deviceList) {

        deviceList.style.display =
            "none";
    }

    if (saleAddButton) {

        saleAddButton.style.display =
            "none";
    }


    // إظهار شاشة الصيانة

    if (maintenanceStatusView) {

        maintenanceStatusView.style.display =
            "block";
    }


    // تجهيز زر إضافة جهاز الصيانة

    createMaintenanceAddButton();


    // عرض أجهزة الحالة الحالية

    renderMaintenance();


    // تشغيل البحث

    prepareMaintenanceSearch();
}
// ====================================================== 
// إغلاق عرض الصيانة 
// ====================================================== 
 
function closeMaintenanceView() { 
 
    if (maintenanceStatusView) { 
 
        maintenanceStatusView.style.display = 
            "none"; 
    } 
 
    if (maintenanceSearchWrapper) { 
 
        maintenanceSearchWrapper.style.display = 
            "none"; 
    } 
} 

// زر X للعودة إلى قسم المزيد
const maintenanceExitButton = document.getElementById(
    "maintenance-exit-button"
);

if (maintenanceExitButton) {
    maintenanceExitButton.onclick = function () {
        closeMaintenanceView();

        const customersSection = document.getElementById("customers-section");
        const moreSection = document.getElementById("more-section");

        if (customersSection) {
            customersSection.style.display = "none";
        }

        if (moreSection) {
            moreSection.style.display = "block";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
}
 
 
// ====================================================== 
// البحث في الصيانة 
// ====================================================== 
 
function prepareMaintenanceSearch() { 
 
    if (!maintenanceStatusView) { 
        return; 
    } 
 
 
    if ( 
        document.getElementById( 
            "maintenance-search-wrapper" 
        ) 
    ) { 
 
        maintenanceSearchWrapper = 
            document.getElementById( 
                "maintenance-search-wrapper" 
            ); 
 
    } else { 
 
        maintenanceSearchWrapper = 
            document.createElement( 
                "div" 
            ); 
 
        maintenanceSearchWrapper.id = 
            "maintenance-search-wrapper"; 
 
        maintenanceSearchWrapper.className = 
            "search-wrapper maintenance-search-wrapper"; 
 
        maintenanceSearchWrapper.innerHTML = ` 
 
            <input 
                type="search" 
                id="maintenance-search-input" 
                class="search-input" 
                autocomplete="off" 
                placeholder="" 
            > 
 
        `; 
 
 
        const heading = 
            maintenanceStatusView.querySelector( 
                "h2" 
            ); 
            

        if (heading) {

            heading.insertAdjacentElement(
                "afterend",
                maintenanceSearchWrapper
            );

        } else {

            maintenanceStatusView.prepend(
                maintenanceSearchWrapper
            );
        }
    }


    maintenanceSearchInput =
        document.getElementById(
            "maintenance-search-input"
        );


    if (!maintenanceSearchInput) {
        return;
    }


    maintenanceSearchInput.placeholder =
        currentLanguage === "ar"
            ? "🔎 ابحث باسم الجهاز أو صاحب الجهاز أو العيب"
            : "🔎 Search device, customer or problem";


    if (
        !maintenanceSearchInput.dataset.bound
    ) {

        maintenanceSearchInput.dataset.bound =
            "true";


        maintenanceSearchInput.addEventListener(
            "input",
            function () {

                renderMaintenance(
                    this.value
                );
            }
        );
    }


    maintenanceSearchWrapper.style.display =
        "block";
}


// ======================================================
// إضافة جهاز للصيانة
// ======================================================

function openMaintenanceDeviceForm(
    defaultSection
) {

    const existing =
        document.getElementById(
            "maintenance-add-modal"
        );


    if (existing) {

        existing.remove();
    }


    const modal =
        document.createElement(
            "div"
        );

    modal.id =
        "maintenance-add-modal";

    modal.className =
        "maintenance-add-modal";


    modal.innerHTML = `

        <div class="maintenance-add-box">

            <div
                class="maintenance-add-header"
            >

                <h2>
                    ${
                        currentLanguage === "ar"
                            ? "🔧 إضافة جهاز للصيانة"
                            : "🔧 Add Device for Repair"
                    }
                </h2>

                <button
                    type="button"
                    id="close-maintenance-add"
                    class="modal-close-button"
                >
                    ✕
                </button>

            </div>


            <div class="maintenance-add-grid">

                <div class="form-group">

                    <label>
                        ${
                            currentLanguage === "ar"
                                ? "اسم الجهاز"
                                : "Device Name"
                        }
                    </label>

                    <input
                        id="maintenance-phone-name"
                        type="text"
                        autocomplete="off"
                    >

                </div>


                <div class="form-group">

                    <label>
                        ${
                            currentLanguage === "ar"
                                ? "صاحب الجهاز"
                                : "Customer Name"
                        }
                    </label>

                    <input
                        id="maintenance-customer-name"
                        type="text"
                        autocomplete="off"
                    >

                </div>


                <div class="form-group">
                    <label>${currentLanguage === "ar" ? "رقم واتساب العميل" : "Customer WhatsApp"}</label>
                    <input id="maintenance-customer-phone" type="tel" inputmode="tel" placeholder="01xxxxxxxxx" autocomplete="tel">
                </div>

                <div class="form-group">

                    <label>
                        ${
                            currentLanguage === "ar"
                                ? "السيريال"
                                : "Serial"
                        }
                    </label>

                    <input
                        id="maintenance-serial-number"
                        type="text"
                        autocomplete="off"
                    >

                </div>


                <div class="form-group">

                    <label>
                        ${
                            currentLanguage === "ar"
                                ? "التاريخ"
                                : "Date"
                        }
                    </label>

                    <input
                        id="maintenance-receive-date"
                        type="date"
                        value="${getToday()}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        ${
                            currentLanguage === "ar"
                                ? "الوقت"
                                : "Time"
                        }
                    </label>

                    <input
                        id="maintenance-receive-time"
                        type="time"
                        value="${getCurrentTime()}"
                    >

                </div>


                <div class="form-group">

                    <label>
                        ${
                            currentLanguage === "ar"
                                ? "العيب"
                                : "Problem"
                        }
                    </label>

                    <input
                        id="maintenance-problem"
                        type="text"
                        autocomplete="off"
                    >

                </div>


                <div class="form-group">

                    <label>
                        ${
                            currentLanguage === "ar"
                                ? "الأجزاء التي يتم تغييرها"
                                : "Changed Parts"
                        }
                    </label>

                    <input
                        id="maintenance-changed-parts"
                        type="text"
                        autocomplete="off"
                    >

                </div>


                <div class="form-group">

                    <label>
                        ${
                            currentLanguage === "ar"
                                ? "السعر"
                                : "Price"
                        }
                    </label>

                    <input
                        id="maintenance-price"
                        type="number"
                        min="0"
                        step="0.01"
                    >

                </div>


                <div class="form-group">

                    <label>
                        ${
                            currentLanguage === "ar"
                                ? "ملاحظات"
                                : "Notes"
                        }
                    </label>

                    <textarea
                        id="maintenance-notes"
                        rows="3"
                    ></textarea>

                </div>

                <div class="form-group">
                    <label>صورة الجهاز (الأمام والخلف)</label>
                    <input id="maintenance-device-photo" type="file" accept="image/*">
                    <img id="maintenance-device-photo-preview" alt="معاينة صورة جهاز الصيانة" style="display:none;max-width:150px;max-height:150px;object-fit:contain;border-radius:12px;margin-top:8px">
                </div>

                <div class="form-group">

                    <label>
                        ${
                            currentLanguage === "ar"
                                ? "حالة الجهاز"
                                : "Device Status"
                        }
                    </label>

                    <select
                        id="maintenance-status-select"
                    >

                        <option
                            value="${SECTIONS.PENDING}"
                            ${
                                defaultSection ===
                                SECTIONS.PENDING
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${
                                currentLanguage === "ar"
                                    ? "قيد الإصلاح"
                                    : "In Repair"
                            }
                        </option>

                        <option
                            value="${SECTIONS.READY}"
                            ${
                                defaultSection ===
                                SECTIONS.READY
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${
                                currentLanguage === "ar"
                                    ? "جاهز"
                                    : "Ready"
                            }
                        </option>

                        <option
                            value="${SECTIONS.FAILED}"
                            ${
                                defaultSection ===
                                SECTIONS.FAILED
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${
                                currentLanguage === "ar"
                                    ? "لم يتم الإصلاح"
                                    : "Not Repaired"
                            }
                        </option>

                        <option
                            value="${SECTIONS.DELIVERED}"
                            ${
                                defaultSection ===
                                SECTIONS.DELIVERED
                                    ? "selected"
                                    : ""
                            }
                        >
                            ${
                                currentLanguage === "ar"
                                    ? "تم التسليم"
                                    : "Delivered"
                            }
                        </option>

                    </select>

                </div>

            </div>


            <div
                class="maintenance-add-actions"
            >

                <button
                    type="button"
                    id="save-maintenance-device"
                    class="save-button"
                >
                    ${
                        currentLanguage === "ar"
                            ? "💾 حفظ الجهاز"
                            : "💾 Save Device"
                    }
                </button>


                <button
                    type="button"
                    id="cancel-maintenance-device"
                    class="cancel-button"
                >
                    ${
                        currentLanguage === "ar"
                            ? "✕ إلغاء"
                            : "✕ Cancel"
                    }
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

    const maintenancePhotoInput = document.getElementById("maintenance-device-photo");
    const maintenancePhotoPreview = document.getElementById("maintenance-device-photo-preview");
    maintenancePhotoInput?.addEventListener("change", function () {
        const file = this.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { alert("اختر صورة صالحة."); return; }
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                maintenancePhotoInput.dataset.imageData = canvas.toDataURL("image/jpeg", 0.78);
                if (maintenancePhotoPreview) { maintenancePhotoPreview.src = maintenancePhotoInput.dataset.imageData; maintenancePhotoPreview.style.display = "block"; }
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

    const closeButton =
        document.getElementById(
            "close-maintenance-add"
        );

    const cancelButton =
        document.getElementById(
            "cancel-maintenance-device"
        );

    const saveButton =
        document.getElementById(
            "save-maintenance-device"
        );


    const closeModal =
        function () {

            modal.remove();
        };


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );
    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeModal
        );
    }


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function () {

                const name =
                    document.getElementById(
                        "maintenance-phone-name"
                    )?.value.trim() || "";

                const customer =
                    document.getElementById(
                        "maintenance-customer-name"
                    )?.value.trim() || "";

                const serial =
                    document.getElementById(
                        "maintenance-serial-number"
                    )?.value.trim() || "";

                const customerPhone =
                    document.getElementById("maintenance-customer-phone")?.value.trim() || "";

                const date =
                    document.getElementById(
                        "maintenance-receive-date"
                    )?.value || getToday();

                    

                const time =
                    document.getElementById(
                        "maintenance-receive-time"
                    )?.value || getCurrentTime();

                const problemValue =
                    document.getElementById(
                        "maintenance-problem"
                    )?.value.trim() || "";

                const changed =
                    document.getElementById(
                        "maintenance-changed-parts"
                    )?.value.trim() || "";

                const priceValue =
                    document.getElementById(
                        "maintenance-price"
                    )?.value || "";

                const notesValue =
                    document.getElementById(
                        "maintenance-notes"
                    )?.value.trim() || "";

                const status =
                    document.getElementById(
                        "maintenance-status-select"
                    )?.value ||
                    defaultSection ||
                    SECTIONS.PENDING;


                if (!name) {

                    alert(
                        currentLanguage === "ar"
                            ? "من فضلك اكتب اسم الجهاز."
                            : "Please enter the device name."
                    );

                    return;
                }


                if (!customer) {

                    alert(
                        currentLanguage === "ar"
                            ? "من فضلك اكتب اسم صاحب الجهاز."
                            : "Please enter the customer name."
                    );

                    return;
                }


                const device = {

                    id:
                        createId(
                            "device"
                        ),

                    number:
                        Date.now(),

                    phoneName:
                        name,

                    customerName:
                        customer,

                    customerPhone:
                        customerPhone,

                    serialNumber:
                        serial,

                    receiveDate:
                        date,

                    receiveTime:
                        time,

                    problem:
                        problemValue,

                    changedParts:
                        changed,

                    price:
                        priceValue,

                    notes:
                        notesValue,

                    photo: document.getElementById("maintenance-device-photo")?.dataset.imageData || "",

                    category:
                        status,

                    section:
                        "maintenance",

                    status:
                        sectionNames[
                            status
                        ],

                    createdAt:
                        new Date().toISOString()
                };

devices.unshift(
    device
);

// حفظ البيانات
saveDevices();

// تحديث تنبيهات حالة المحل فورًا
renderShopNotifications();


// إغلاق النافذة
modal.remove();

currentSection =
    status;

// تحديث شاشة الصيانة
renderMaintenance();
            }
        );
    }
}


// ======================================================
// زر إضافة جهاز للصيانة
// ======================================================

function createMaintenanceAddButton() {

    const statusView =
        document.getElementById(
            "maintenance-status-view"
        );

    if (!statusView) {
        return;
    }


    if (
        document.getElementById(
            "maintenance-add-button"
        )
    ) {
        return;
    }


    const button =
        document.createElement(
            "button"
        );

    button.type =
        "button";

    button.id =
        "maintenance-add-button";

    button.className =
        "add-maintenance-button";

    button.textContent =
        currentLanguage === "ar"
            ? "➕ إضافة جهاز للصيانة"
            : "➕ Add Repair Device";


    button.addEventListener(
        "click",
        function () {

            openMaintenanceDeviceForm(
                currentSection
            );
        }
    );


    const heading =
        statusView.querySelector(
            "h2"
        );


    if (heading) {

        heading.insertAdjacentElement(
            "afterend",
            button
        );

    } else {

        statusView.prepend(
            button
        );
    }
}


// ======================================================
// أحداث أزرار الصيانة
// ======================================================

maintenanceButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const section =
                    this.dataset.section;


                if (!section) {
                    return;
                }


                showMaintenanceSection(
                    section
                );
            }
        );
    }
);


// ======================================================
// بيانات الصيانة
// ======================================================

function getMaintenanceDevices() {

    return devices.filter(
        device =>
            device.section ===
                "maintenance" ||
            (
                device.category &&
                device.category !==
                    SECTIONS.SALE
            )
    );
}

function normalizeMaintenanceStatus(device) {
    const raw = String(device.category || device.status || device.section || "").trim();
    const map = {
        "قيد الإصلاح": SECTIONS.PENDING,
        "تحت الصيانة": SECTIONS.PENDING,
        "جاهز": SECTIONS.READY,
        "جاهز للتسليم": SECTIONS.READY,
        "لم يتم الإصلاح": SECTIONS.FAILED,
        "تم التسليم": SECTIONS.DELIVERED,
        "maintenance-pending": SECTIONS.PENDING,
        "maintenance-ready": SECTIONS.READY,
        "maintenance-failed": SECTIONS.FAILED,
        "maintenance-delivered": SECTIONS.DELIVERED
    };
    if (map[raw]) return map[raw];
    if ([SECTIONS.PENDING, SECTIONS.READY, SECTIONS.FAILED, SECTIONS.DELIVERED].includes(raw)) return raw;
    return SECTIONS.PENDING;
}

// ======================================================
// QR متابعة الصيانة داخل بطاقة الجهاز + واتساب اختياري
// ======================================================

function ensureRepairTrackingToken(device) {
    if (!device.repairTrackingToken) {
        const bytes = new Uint8Array(24);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(bytes);
            device.repairTrackingToken = Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
        } else {
            device.repairTrackingToken = `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
        }
    }
    return device.repairTrackingToken;
}

function getRepairTrackingUrl(device) {
    const token = ensureRepairTrackingToken(device);
    // Build the public link from the address the app is actually running on, so it always matches the real
    // GitHub Pages repo name / folder (a hard-coded repo name caused the 404 error).
    let publicBase = "https://hishamnasratman843-hash.github.io/-ACT-Managerr/";
    try {
        if (/^https?:$/.test(location.protocol) && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
            publicBase = new URL("./", location.href).href;
        }
    } catch (error) { /* keep the fallback */ }
    return new URL(`repair-tracking.html?id=${encodeURIComponent(token)}`, publicBase).href;
}

// رقم العميل اختياري. نقبل أرقام مصرية محلية أو أرقام دولية بصيغة صحيحة.
function buildCustomerWhatsAppUrl(device) {
    let phone = String(device && device.customerPhone || "").replace(/\D/g, "");
    if (!phone) return "";
    if (phone.startsWith("00")) phone = phone.slice(2);
    if (/^01\d{9}$/.test(phone)) phone = "20" + phone.slice(1);
    else if (/^1\d{9}$/.test(phone)) phone = "20" + phone;
    if (!/^\d{8,15}$/.test(phone) || phone.startsWith("0")) return "";
    const trackingUrl = getRepairTrackingUrl(device);
    const message = `مرحبًا ${device.customerName || ""}، لمتابعة حالة جهازك ${device.phoneName || ""} يمكنك فتح الرابط التالي:\n${trackingUrl}`;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

async function syncPublicRepairTracking(device) {
    if (!currentUser || !currentUser.uid || !device || !(device.section === "maintenance" || device.category !== SECTIONS.SALE)) return false;
    const token = ensureRepairTrackingToken(device);
    const status = normalizeMaintenanceStatus(device);
    const statusLabels = {
        [SECTIONS.PENDING]: "قيد الإصلاح",
        [SECTIONS.READY]: "جاهز للاستلام",
        [SECTIONS.FAILED]: "لم يتم الإصلاح",
        [SECTIONS.DELIVERED]: "تم التسليم"
    };
    try {
        await setDoc(doc(db, "publicRepairTracking", token), {
            ownerUid: currentUser.uid,
            deviceName: String(device.phoneName || "جهاز صيانة").slice(0, 100),
            customerName: String(device.customerName || "").slice(0, 100),
            problem: String(device.problem || "").slice(0, 500),
            status,
            statusLabel: statusLabels[status] || "قيد الإصلاح",
            receivedAt: String(device.receiveDate || "").slice(0, 30),
            updatedAt: new Date().toISOString(),
            active: true
        }, { merge: true });
        return true;
    } catch (error) {
        console.error("Public repair tracking sync failed:", error);
        return false;
    }
}

function renderMaintenance(searchValue = "") {
const list = document.getElementById("maintenance-device-list");


if (!list) return;

const value = String(searchValue || "").trim().toLowerCase();

const maintenanceDevices = getMaintenanceDevices().filter(device =>
    normalizeMaintenanceStatus(device) === currentSection
);

const filtered = value
    ? maintenanceDevices.filter(device => {
        const text = [
            device.phoneName,
            device.customerName,
            device.problem,
            device.changedParts,
            device.serialNumber,
            device.notes
        ]
            .map(item => String(item || "").toLowerCase())
            .join(" ");

        return text.includes(value);
    })
    : maintenanceDevices;

if (!filtered.length) {
    list.innerHTML = `
        <div class="empty-state">
            <div style="font-size:45px;">🔧</div>
            <h3>
                ${currentLanguage === "ar"
                    ? "لا توجد أجهزة في هذه الحالة"
                    : "No devices in this status"}
            </h3>
            <p>
                ${currentLanguage === "ar"
                    ? "اضغط على إضافة جهاز للصيانة."
                    : "Click Add Repair Device."}
            </p>
        </div>
    `;
    return;
}

list.innerHTML = filtered
    .map((device, index) => renderMaintenanceCard(device, index))
    .join("");

attachMaintenanceCardEvents();


}



// ======================================================
// PREMIUM MAINTENANCE CARD
// ======================================================

function renderMaintenanceCard(device, index) {

    return `
        <article
            class="maintenance-card premium-maintenance-card"
            data-device-id="${escapeHTML(device.id)}"
        >

            <!-- رأس الكارت -->
            <div class="premium-card-header">

                <span class="premium-device-number">
                    #${index + 1}
                </span>

                <div class="maintenance-actions">

                    <button
                        type="button"
                        class="maintenance-edit-button"
                        data-id="${escapeHTML(device.id)}"
                    >
                        ✏️ ${t("edit")}
                    </button>

                    <button
                        type="button"
                        class="maintenance-delete-button"
                        data-id="${escapeHTML(device.id)}"
                    >
                        🗑️ ${t("delete")}
                    </button>


                </div>

            </div>


            <!-- اسم الجهاز -->
            <div class="premium-device-heading">

                <span class="premium-phone-icon">📱</span>

                <h3>
                    ${escapeHTML(device.phoneName || "جهاز بدون اسم")}
                </h3>

            </div>


            ${device.photo ? `<img class="purchase-device-photo" src="${device.photo}" alt="صورة جهاز الصيانة">` : ""}

            <!-- بيانات الجهاز: كل معلومة في سطر -->
            <div class="premium-device-details">

                <div class="premium-detail-row">
                    <span class="premium-detail-label">👤 العميل</span>
                    <span class="premium-detail-value">
                        ${escapeHTML(device.customerName || "غير محدد")}
                    </span>
                </div>

                ${device.customerPhone ? `
                <div class="premium-detail-row">
                    <span class="premium-detail-label">📱 واتساب العميل</span>
                    <span class="premium-detail-value">${escapeHTML(device.customerPhone)}</span>
                </div>` : ""}

                <div class="premium-detail-row">
                    <span class="premium-detail-label">🔢 السيريال</span>
                    <span class="premium-detail-value">
                        ${escapeHTML(device.serialNumber || "غير مسجل")}
                    </span>
                </div>

                <div class="premium-detail-row">
                    <span class="premium-detail-label">📅 التاريخ</span>
                    <span class="premium-detail-value">
                        ${escapeHTML(device.receiveDate || "غير محدد")}
                    </span>
                </div>

                <div class="premium-detail-row">
                    <span class="premium-detail-label">🕐 الساعة</span>
                    <span class="premium-detail-value">
                        ${escapeHTML(device.receiveTime || "غير محدد")}
                    </span>
                </div>

            </div>


            <!-- QR المتابعة داخل بيانات الجهاز، والواتساب يظهر فقط عند وجود رقم صالح -->
            <section class="act-repair-inline-panel" aria-label="QR متابعة الصيانة">
                <div class="act-repair-inline-heading">
                    <strong>▦ QR متابعة العميل</strong>
                    <small>امسح الكود لعرض حالة الجهاز مباشرة</small>
                </div>
                <div class="act-repair-inline-qr" data-repair-qr-device="${escapeHTML(device.id)}">
                    <span>جارٍ تجهيز رمز المتابعة…</span>
                </div>
                <small class="act-repair-inline-ref">رقم العملية: ${escapeHTML(device.id)}</small>
                ${buildCustomerWhatsAppUrl(device) ? `
                    <a class="act-repair-customer-whatsapp" href="${escapeHTML(buildCustomerWhatsAppUrl(device))}" target="_blank" rel="noopener noreferrer">
                        <span>◉</span> مراسلة العميل على واتساب
                    </a>
                ` : ""}
            </section>

            <!-- العيب -->
            <div class="premium-problem-box">

                <span class="premium-problem-label">
                    🔧 العيب
                </span>

                <div class="premium-problem-value">
                    ${escapeHTML(device.problem || "لم يتم تحديد العيب")}
                </div>

            </div>


            <!-- قطع الغيار -->
            ${
                device.changedParts
                    ? `
                        <div class="premium-extra-row">
                            <span class="premium-detail-label">
                                🔩 قطع الغيار
                            </span>

                            <span class="premium-detail-value">
                                ${escapeHTML(device.changedParts)}
                            </span>
                        </div>
                    `
                    : ""
            }


            <!-- السعر -->
            ${
                device.price !== undefined &&
                device.price !== null &&
                device.price !== ""
                    ? `
                        <div class="premium-price-box">
                            <span>💰 السعر</span>
                            <strong>${formatMoney(device.price)}</strong>
                        </div>
                    `
                    : ""
            }


            <!-- الملاحظات -->
            ${
                device.notes
                    ? `
                        <div class="premium-extra-row">
                            <span class="premium-detail-label">
                                📝 ملاحظات
                            </span>

                            <span class="premium-detail-value">
                                ${escapeHTML(device.notes)}
                            </span>
                        </div>
                    `
                    : ""
            }


            <!-- حالة الصيانة -->
            <div class="maintenance-status-control premium-status">

                <label class="premium-status-label">
                    حالة الجهاز
                </label>

                <select
                    class="maintenance-status-select"
                    data-id="${escapeHTML(device.id)}"
                >

                    <option
                        value="${SECTIONS.PENDING}"
                        ${normalizeMaintenanceStatus(device) === SECTIONS.PENDING ? "selected" : ""}
                    >
                        ${currentLanguage === "ar" ? "🟡 قيد الإصلاح" : "🟡 In Repair"}
                    </option>

                    <option
                        value="${SECTIONS.READY}"
                        ${normalizeMaintenanceStatus(device) === SECTIONS.READY ? "selected" : ""}
                    >
                        ${currentLanguage === "ar" ? "🟢 جاهز" : "🟢 Ready"}
                    </option>

                    <option
                        value="${SECTIONS.FAILED}"
                        ${normalizeMaintenanceStatus(device) === SECTIONS.FAILED ? "selected" : ""}
                    >
                        ${currentLanguage === "ar" ? "🔴 لم يتم الإصلاح" : "🔴 Not Repaired"}
                    </option>

                    <option
                        value="${SECTIONS.DELIVERED}"
                        ${normalizeMaintenanceStatus(device) === SECTIONS.DELIVERED ? "selected" : ""}
                    >
                        ${currentLanguage === "ar" ? "📦 تم التسليم" : "📦 Delivered"}
                    </option>

                </select>

            </div>


            <!-- الطباعة -->
            <div class="card-print-area">

                <button
                    type="button"
                    class="card-print-button"
                    data-id="${escapeHTML(device.id)}"
                >
                    🖨️ ${currentLanguage === "ar" ? "طباعة بيانات الجهاز" : "Print Device Details"}
                </button>

            </div>

        </article>
    `;
}


// ======================================================
// أحداث كروت الصيانة
// ======================================================

function attachMaintenanceCardEvents() {

    const list = document.getElementById(
        "maintenance-device-list"
    );

    if (!list) {
        return;
    }


    // نشر سجل المتابعة وتجهيز QR داخل بطاقة الجهاز نفسها.
    list.querySelectorAll(".act-repair-inline-qr").forEach(async target => {
        if (target.dataset.qrReady === "1" || target.dataset.qrLoading === "1") return;
        const device = devices.find(item => String(item.id) === String(target.dataset.repairQrDevice));
        if (!device) return;
        target.dataset.qrLoading = "1";
        try {
            const published = await syncPublicRepairTracking(device);
            if (!published) {
                target.innerHTML = '<span class="act-repair-qr-error">تعذر نشر بيانات المتابعة. راجع اتصال Firebase وقواعد Firestore.</span>';
                return;
            }
            saveDevices();
            const url = getRepairTrackingUrl(device);
            if (window.QRCode) {
                target.innerHTML = "";
                new QRCode(target, { text: url, width: 168, height: 168, correctLevel: QRCode.CorrectLevel.H });
                target.dataset.qrReady = "1";
            } else {
                target.innerHTML = `<a href="${escapeHTML(url)}" target="_blank" rel="noopener">فتح صفحة المتابعة</a><span>تعذر تحميل مولّد QR. أعد تحميل الصفحة مع الاتصال بالإنترنت.</span>`;
            }
        } catch (error) {
            console.error("Inline repair QR error:", error);
            target.innerHTML = '<span class="act-repair-qr-error">تعذر تجهيز QR حاليًا.</span>';
        } finally {
            delete target.dataset.qrLoading;
        }
    });

    // تعديل الجهاز
    list
        .querySelectorAll(".maintenance-edit-button")
        .forEach(button => {

            button.addEventListener("click", function () {

                editMaintenanceDevice(
                    this.dataset.id
                );

            });

        });


    // حذف الجهاز
    list
        .querySelectorAll(".maintenance-delete-button")
        .forEach(button => {

            button.addEventListener("click", function () {

                deleteMaintenanceDevice(
                    this.dataset.id
                );

            });

        });


    // تغيير حالة الصيانة
    list
        .querySelectorAll(".maintenance-status-select")
        .forEach(select => {

            select.addEventListener("change", function () {

                updateMaintenanceStatus(
                    this.dataset.id,
                    this.value
                );

            });

        });


    // طباعة بيانات الجهاز
    list
        .querySelectorAll(".card-print-button")
        .forEach(button => {

            button.addEventListener("click", function () {

                printDevice(
                    this.dataset.id
                );

            });

        });

}



// ======================================================
// تعديل جهاز الصيانة
// ======================================================

function editMaintenanceDevice(
    id
) {

    const device =
        devices.find(
            item =>
                item.id === id
        );

    if (!device) {
        return;
    }


    const card =
        document.querySelector(
            `.maintenance-card[data-device-id="${CSS.escape(id)}"]`
        );


    if (!card) {

        renderMaintenance();

        return;
    }


    card.outerHTML =
        renderMaintenanceEditCard(
            device
        );


    const newCard =
        document.querySelector(
            `.maintenance-card[data-device-id="${CSS.escape(id)}"]`
        );


    if (!newCard) {
        return;
    }


    const saveButton =
        newCard.querySelector(
            '[data-action="save-maintenance-edit"]'
        );

    const cancelButton =
        newCard.querySelector(
            '[data-action="cancel-maintenance-edit"]'
        );


    if (saveButton) {

        saveButton.addEventListener(
            "click",
            function () {

                saveInlineMaintenanceEdit(
                    this.dataset.id,
                    newCard
                );
            }
        );
    }


    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            function () {

                renderMaintenance();
            }
        );
    }
}


// ======================================================
// كارت تعديل الصيانة
// ======================================================

function renderMaintenanceEditCard(
    device
) {

    return `

        <article
            class="maintenance-card"
            data-device-id="${escapeHTML(device.id)}"
        >

            <div
                class="inline-edit-card"
                style="
                    display:flex;
                    flex-direction:column;
                    gap:12px;
                "
            >

                <input
                    type="text"
                    data-edit-field="phoneName"
                    value="${escapeHTML(
                        device.phoneName || ""
                    )}"
                    placeholder="${
                        currentLanguage === "ar"
                            ? "اسم الجهاز"
                            : "Device name"
                    }"
                >


                <input
                    type="text"
                    data-edit-field="customerName"
                    value="${escapeHTML(
                        device.customerName || ""
                    )}"
                    placeholder="${
                        currentLanguage === "ar"
                            ? "اسم صاحب الجهاز"
                            : "Customer name"
                    }"
                >


                <input
                    type="tel"
                    data-edit-field="customerPhone"
                    value="${escapeHTML(device.customerPhone || "")}"
                    placeholder="رقم واتساب العميل"
                >

                <input
                    type="text"
                    data-edit-field="serialNumber"
                    value="${escapeHTML(
                        device.serialNumber || ""
                    )}"
                    placeholder="${
                        currentLanguage === "ar"
                            ? "السيريال"
                            : "Serial"
                    }"
                >


                <input
                    type="date"
                    data-edit-field="receiveDate"
                    value="${escapeHTML(
                        device.receiveDate || ""
                    )}"
                >


                <input
                    type="time"
                    data-edit-field="receiveTime"
                    value="${escapeHTML(
                        device.receiveTime || ""
                    )}"
                >


                <input
                    type="text"
                    data-edit-field="problem"
                    value="${escapeHTML(
                        device.problem || ""
                    )}"
                    placeholder="${
                        currentLanguage === "ar"
                            ? "العيب"
                            : "Problem"
                    }"
                >


                <input
                    type="text"
                    data-edit-field="changedParts"
                    value="${escapeHTML(
                        device.changedParts || ""
                    )}"
                    placeholder="${
                        currentLanguage === "ar"
                            ? "الأجزاء التي يتم تغييرها"
                            : "Changed parts"
                    }"
                >


                <input
                    type="number"
                    min="0"
                    step="0.01"
                    data-edit-field="price"
                    value="${escapeHTML(
                        device.price || ""
                    )}"
                    placeholder="${
                        currentLanguage === "ar"
                            ? "السعر"
                            : "Price"
                    }"
                >


                <textarea
                    data-edit-field="notes"
                    rows="3"
                    placeholder="${
                        currentLanguage === "ar"
                            ? "ملاحظات"
                            : "Notes"
                    }"
                >${escapeHTML(
                    device.notes || ""
                )}</textarea>


                <select
                    data-edit-field="category"
                >

                    <option
                        value="${SECTIONS.PENDING}"
                        ${
                            device.category ===
                            SECTIONS.PENDING
                                ? "selected"
                                : ""
                        }
                    >
                        ${
                            currentLanguage === "ar"
                                ? "قيد الإصلاح"
                                : "In Repair"
                        }
                    </option>


                    <option
                        value="${SECTIONS.READY}"
                        ${
                            device.category ===
                            SECTIONS.READY
                                ? "selected"
                                : ""
                        }
                    >
                        ${
                            currentLanguage === "ar"
                                ? "جاهز"
                                : "Ready"
                        }
                    </option>


                    <option
                        value="${SECTIONS.FAILED}"
                        ${
                            device.category ===
                            SECTIONS.FAILED
                                ? "selected"
                                : ""
                        }
                    >
                        ${
                            currentLanguage === "ar"
                                ? "لم يتم الإصلاح"
                                : "Not Repaired"
                        }
                    </option>


                    <option
                        value="${SECTIONS.DELIVERED}"
                        ${
                            device.category ===
                            SECTIONS.DELIVERED
                                ? "selected"
                                : ""
                        }
                    >
                        ${
                            currentLanguage === "ar"
                                ? "تم التسليم"
                                : "Delivered"
                        }
                    </option>

                </select>


                <div
                    style="
                        display:flex;
                        gap:10px;
                        flex-wrap:wrap;
                    "
                >

                    <button
                        type="button"
                        class="save-button"
                        data-action="save-maintenance-edit"
                        data-id="${escapeHTML(device.id)}"
                    >
                        ${t("save")}
                    </button>


                    <button
                        type="button"
                        class="cancel-button"
                        data-action="cancel-maintenance-edit"
                    >
                        ${t("cancel")}
                    </button>

                </div>

            </div>

        </article>

    `;
}


// ======================================================
// حفظ تعديل الصيانة
// ======================================================

function saveInlineMaintenanceEdit(
    id,
    container
) {

    const device =
        devices.find(
            item =>
                item.id === id
        );

    if (!device) {
        return;
    }


    function field(
        name
    ) {

        const element =
            container.querySelector(
                `[data-edit-field="${name}"]`
            );

        return element
            ? element.value.trim()
            : "";
    }


    const newPhoneName =
        field(
            "phoneName"
        );

    const newCustomerName =
        field(
            "customerName"
        );


    if (!newPhoneName) {

        alert(
            currentLanguage === "ar"
                ? "من فضلك اكتب اسم الجهاز."
                : "Please enter the device name."
        );

        return;
    }


    if (!newCustomerName) {

        alert(
            currentLanguage === "ar"
                ? "من فضلك اكتب اسم صاحب الجهاز."
                : "Please enter the customer name."
        );

        return;
    }


    const categoryElement =
        container.querySelector(
            '[data-edit-field="category"]'
        );


    const newCategory =
        categoryElement
            ? categoryElement.value
            : device.category;


    device.phoneName =
        newPhoneName;

    device.customerName =
        newCustomerName;

    device.customerPhone =
        field("customerPhone");

    device.receiveDate =
        field(
            "receiveDate"
        );

    device.receiveTime =
        field(
            "receiveTime"
        );

    device.problem =
        field(
            "problem"
        );

    device.changedParts =
        field(
            "changedParts"
        );

    device.price =
        field(
            "price"
        );

    device.notes =
        field(
            "notes"
        );

    device.serialNumber =
        field(
            "serialNumber"
        );

    device.category =
        newCategory;

    device.section =
        "maintenance";

    device.status =
        sectionNames[
            newCategory
        ];


saveDevices();

// تحديث تنبيهات حالة المحل فورًا
renderShopNotifications();

currentSection =
    newCategory;

renderMaintenance();
}


// ======================================================
// تحديث حالة جهاز الصيانة
// ======================================================

function updateMaintenanceStatus(
    id,
    newStatus
) {

    const device =
        devices.find(
            item =>
                item.id === id
        );

    if (!device) {
        return;
    }


    if (
        ![
            SECTIONS.PENDING,
            SECTIONS.READY,
            SECTIONS.FAILED,
            SECTIONS.DELIVERED
        ].includes(
            newStatus
        )
    ) {
        return;
    }


    device.category =
        newStatus;

    device.section =
        "maintenance";

    device.status =
        sectionNames[
            newStatus
        ];

saveDevices();
    // تحديث رابط المتابعة العام بعد تغيير حالة الجهاز.
    syncPublicRepairTracking(device).catch(error => console.error("Repair tracking update failed:", error));

// تحديث تنبيهات حالة المحل فور تغيير الحالة
renderShopNotifications();

currentSection =
    newStatus;

    renderMaintenance();
}


// ======================================================
// حذف جهاز الصيانة
// ======================================================

function deleteMaintenanceDevice(
    id
) {

    const device =
        devices.find(
            item =>
                item.id === id
        );

    if (!device) {
        return;
    }


    const confirmed =
        confirm(
            currentLanguage === "ar"
                ? `هل أنت متأكد من حذف جهاز "${device.phoneName}"؟`
                : `Are you sure you want to delete "${device.phoneName}"?`
        );


    if (!confirmed) {
        return;
    }


    devices =
        devices.filter(
            item =>
                item.id !== id
        );

saveDevices();

renderShopNotifications();

renderMaintenance();
}


// ======================================================
// موظفين
// ======================================================

function hideEmployeeViews() {

    if (employeeForm) {

        employeeForm.style.display =
            "none";
    }

    if (attendanceSection) {

        attendanceSection.style.display =
            "none";
    }

    if (salariesSection) {

        salariesSection.style.display =
            "none";
    }

    if (employeeStatisticsSection) {

        employeeStatisticsSection.style.display =
            "none";
    }
}


function showEmployeeMain() {

    currentEmployeeView =
        "main";

    hideEmployeeViews();


    if (employeesList) {

        employeesList.style.display =
            "grid";
    }


    if (employeeSearchInput) {

        employeeSearchInput.parentElement.style.display =
            "block";
    }
}


function showEmployeeForm() {

    currentEmployeeView =
        "form";

    hideEmployeeViews();


    if (employeesList) {

        employeesList.style.display =
            "none";
    }


    if (employeeSearchInput) {

        employeeSearchInput.parentElement.style.display =
            "none";
    }


    if (employeeForm) {

        employeeForm.style.display =
            "block";

        employeeForm.scrollIntoView({
            behavior:
                "smooth",
            block:
                "start"
        });
    }
}


function showEmployeeStatistics() {

    currentEmployeeView =
        "statistics";

    hideEmployeeViews();


    if (employeesList) {

        employeesList.style.display =
            "none";
    }


    if (employeeSearchInput) {

        employeeSearchInput.parentElement.style.display =
            "none";
    }


    if (employeeStatisticsSection) {

        employeeStatisticsSection.style.display =
            "block";

        employeeStatisticsSection.scrollIntoView({
            behavior:
                "smooth",
            block:
                "start"
        });
    }


    renderEmployeeStatistics();
}


if (addEmployeeButton) {

    addEmployeeButton.addEventListener(
        "click",
        function () {

            editingEmployeeId =
                null;

            clearEmployeeForm();

            showEmployeeForm();
        }
    );
}


if (attendanceButton) {

    attendanceButton.addEventListener(
        "click",
        showAttendance
    );
}


if (salariesButton) {

    salariesButton.addEventListener(
        "click",
        showSalaries
    );
}


if (statisticsButton) {

    statisticsButton.addEventListener(
        "click",
        showEmployeeStatistics
    );
}


// ======================================================
// نموذج العامل
// ======================================================

function clearEmployeeForm() {

    if (employeeName) {

        employeeName.value =
            "";
    }

    if (employeePhone) {

        employeePhone.value =
            "";
    }

    if (employeeJob) {

        employeeJob.value =
            "";
    }

    if (employeeStartDate) {

        employeeStartDate.value =
            getToday();
    }

    if (employeeSalary) {

        employeeSalary.value =
            "";
    }
    const shiftInput = document.getElementById("employee-shift-start");
    if (shiftInput) shiftInput.value = "09:00";
    const attendanceCodeInput = document.getElementById("employee-attendance-code-input");
    if (attendanceCodeInput) attendanceCodeInput.value = "";

    if (employeeNotes) {

        employeeNotes.value =
            "";
    }
}


function generateEmployeeAttendanceCode() {
    const used = new Set((Array.isArray(employees) ? employees : []).map(e => String(e.attendanceCode || "")));
    let code = "";
    do { code = String(Math.floor(100000 + Math.random() * 900000)); } while (used.has(code));
    return code;
}

function normalizeEmployeeAttendanceCodes() {
    if (!Array.isArray(employees)) return;
    let changed = false;
    const used = new Set();
    employees.forEach(employee => {
        if (!employee.attendanceCode || used.has(String(employee.attendanceCode))) {
            let code; do { code = String(Math.floor(100000 + Math.random() * 900000)); } while (used.has(code));
            employee.attendanceCode = code; changed = true;
        }
        used.add(String(employee.attendanceCode));
        if (!employee.shiftStartTime) { employee.shiftStartTime = "09:00"; changed = true; }
    });
    if (changed && typeof saveEmployees === "function") saveEmployees();
}

function saveEmployee() {
    if (editingEmployeeId) {
        alert(currentLanguage === "ar" ? "تعديل بيانات العامل غير مسموح من واجهة العاملين." : "Employee editing is disabled.");
        return;
    }

    const name =
        employeeName
            ? employeeName.value.trim()
            : "";

    const phone =
        employeePhone
            ? employeePhone.value.trim()
            : "";

    const job =
        employeeJob
            ? employeeJob.value.trim()
            : "";

    const startDate =
        employeeStartDate
            ? employeeStartDate.value
            : getToday();

    const salary =
        employeeSalary
            ? employeeSalary.value
            : "";

    const notesValue =
        employeeNotes
            ? employeeNotes.value.trim()
            : "";

    const attendanceCodeInput = document.getElementById("employee-attendance-code-input");
    const attendanceCode = String(attendanceCodeInput?.value || "").trim();

    if (!/^\d{6}$/.test(attendanceCode)) {
        alert("اكتب كود حضور مكوّنًا من 6 أرقام للعامل.");
        attendanceCodeInput?.focus();
        return;
    }

    const duplicateCode = employees.some(employee =>
        String(employee.attendanceCode || "") === attendanceCode &&
        employee.id !== editingEmployeeId
    );
    if (duplicateCode) {
        alert("هذا الكود مستخدم بالفعل لعامل آخر. اختر كودًا مختلفًا.");
        attendanceCodeInput?.focus();
        return;
    }

    if (!name) {

        alert(
            currentLanguage === "ar"
                ? "من فضلك اكتب اسم العامل."
                : "Please enter employee name."
        );

        return;
    }


    if (!job) {

        alert(
            currentLanguage === "ar"
                ? "من فضلك اكتب وظيفة العامل."
                : "Please enter employee job."
        );

        return;
    }


    if (editingEmployeeId) {

        const index =
            employees.findIndex(
                employee =>
                    employee.id ===
                    editingEmployeeId
            );


        if (index !== -1) {

            employees[index] = {

                ...employees[index],

                name:
                    name,

                phone:
                    phone,

                job:
                    job,

                startDate:
                    startDate,

                salary:
                    salary,

                attendanceCode:
                    attendanceCode,

                shiftStartTime:
                    document.getElementById("employee-shift-start")?.value || employees[index].shiftStartTime || "09:00",

                notes:
                    notesValue
            };
        }

    } else {

        employees.unshift({

            id:
                createId(
                    "employee"
                ),

            name:
                name,

            phone:
                phone,

            job:
                job,

            startDate:
                startDate,

            salary:
                salary,

            shiftStartTime:
                document.getElementById("employee-shift-start")?.value || "09:00",

            attendanceCode:
                attendanceCode,

            notes:
                notesValue,

            attendance:
                {},

            loans:
                [],

            bonuses:
                [],

            createdAt:
                new Date().toISOString()
        });
    }


    saveEmployees();

    editingEmployeeId =
        null;

    clearEmployeeForm();

    showEmployeeMain();

    renderEmployees();

    updateEmployeeStats();
}


if (saveEmployeeButton) {

    saveEmployeeButton.addEventListener(
        "click",
        saveEmployee
    );
}


if (cancelEmployeeButton) {

    cancelEmployeeButton.addEventListener(
        "click",
        function () {

            editingEmployeeId =
                null;

            clearEmployeeForm();

            showEmployeeMain();

            renderEmployees();
        }
    );
}


// ======================================================
// Render العاملين
// ======================================================

function renderEmployees() {
    if (!employeesList) return;
    employeesList.style.display = "grid";

    if (!employees.length) {
        employeesList.innerHTML = `<div class="empty-state"><div style="font-size:45px;">👨‍🔧</div><h3>${currentLanguage === "ar" ? "لا يوجد عاملين" : "No employees"}</h3><p>${currentLanguage === "ar" ? "اضغط على إضافة عامل لإضافة أول عامل." : "Click Add Employee to add your first employee."}</p></div>`;
        return;
    }

    employeesList.innerHTML = employees.map((employee, index) => `
        <article class="employee-card employee-private-card" data-id="${escapeHTML(employee.id)}">
            <div class="employee-card-top" style="display:flex;align-items:center;justify-content:space-between;gap:10px">
                <div class="employee-number">#${index + 1}</div>
                <button type="button" class="employee-print-button" data-id="${escapeHTML(employee.id)}">🖨️ ${currentLanguage === "ar" ? "طباعة البطاقة" : "Print card"}</button>
            </div>
            <div class="employee-card-icon" style="font-size:38px;margin:14px 0">👨‍🔧</div>
            <h3>${escapeHTML(employee.name || "-")}</h3>
            <div class="employee-private-access" style="margin-top:16px;padding:14px;border:1px solid rgba(0,170,255,.25);border-radius:12px;background:rgba(0,120,255,.06)">
                <label style="display:block;margin-bottom:8px;font-weight:700" for="employee-private-code-${index}">🔐 ${currentLanguage === "ar" ? "أدخل كودك لعرض بياناتك" : "Enter your code to view your details"}</label>
                <div style="display:flex;gap:8px;flex-wrap:wrap">
                    <input id="employee-private-code-${index}" class="employee-private-code-input" type="password" inputmode="numeric" maxlength="6" autocomplete="off" placeholder="••••••" style="flex:1;min-width:130px;padding:11px;border-radius:9px">
                    <button type="button" class="employee-private-reveal-button" data-id="${escapeHTML(employee.id)}">${currentLanguage === "ar" ? "عرض بياناتي" : "Show my details"}</button>
                </div>
                <small style="display:block;opacity:.7;margin-top:8px">${currentLanguage === "ar" ? "لن تظهر البيانات الخاصة إلا بعد إدخال الكود الصحيح." : "Private details appear only after the correct code is entered."}</small>
            </div>
            <div class="employee-private-details" hidden style="margin-top:14px;padding:15px;border-radius:12px;background:rgba(0,170,120,.07);border:1px solid rgba(0,190,130,.25)"></div>
        </article>
    `).join("");

    employeesList.querySelectorAll(".employee-print-button").forEach(button => {
        button.addEventListener("click", () => printEmployeeData(button.dataset.id));
    });
    employeesList.querySelectorAll(".employee-private-reveal-button").forEach(button => {
        button.addEventListener("click", () => revealEmployeePrivateDetails(button));
    });
    employeesList.querySelectorAll(".employee-private-code-input").forEach(input => {
        input.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                const card = input.closest(".employee-card");
                const reveal = card?.querySelector(".employee-private-reveal-button");
                if (reveal) reveal.click();
            }
        });
    });
}

function revealEmployeePrivateDetails(button) {
    const card = button.closest(".employee-card");
    const employee = employees.find(item => item.id === button.dataset.id);
    if (!card || !employee) return;
    const input = card.querySelector(".employee-private-code-input");
    const enteredCode = String(input?.value || "").trim();
    const details = card.querySelector(".employee-private-details");

    if (!/^\d{6}$/.test(enteredCode) || enteredCode !== String(employee.attendanceCode || "")) {
        if (details) { details.hidden = true; details.innerHTML = ""; }
        alert(currentLanguage === "ar" ? "الكود غير صحيح. لا يمكن عرض بيانات العامل." : "Incorrect code. Employee details cannot be shown.");
        if (input) { input.value = ""; input.focus(); }
        return;
    }

    const finance = getEmployeeFinance(employee);
    const today = getToday();
    const attendanceStatus = employee.attendance?.[today] === "present" ? "🟢 حاضر" : employee.attendance?.[today] === "absent" ? "🔴 غائب" : "🕒 لم يسجل اليوم";
    details.innerHTML = `
        <div style="font-weight:800;margin-bottom:12px">🔓 ${currentLanguage === "ar" ? "بياناتك الخاصة" : "Your private details"}</div>
        <div class="employee-info">📞 ${escapeHTML(employee.phone || "-")}</div>
        <div class="employee-info">💼 ${escapeHTML(employee.job || "-")}</div>
        <div class="employee-info">🕘 ${currentLanguage === "ar" ? "بداية الشيفت:" : "Shift starts:"} ${escapeHTML(employee.shiftStartTime || "09:00")}</div>
        <div class="employee-info">📅 ${escapeHTML(employee.startDate || "-")}</div>
        <div class="employee-info">💰 ${currentLanguage === "ar" ? "المرتب:" : "Salary:"} ${formatMoney(employee.salary)}</div>
        <div class="employee-info">💸 ${currentLanguage === "ar" ? "السلف:" : "Loans:"} ${formatMoney(finance.loanTotal)}</div>
        <div class="employee-info">🎁 ${currentLanguage === "ar" ? "المكافآت:" : "Bonuses:"} ${formatMoney(finance.bonusTotal)}</div>
        <div class="employee-info">🔴 ${currentLanguage === "ar" ? "خصم الغياب:" : "Absence deduction:"} ${formatMoney(finance.absenceDeduction)}</div>
        <div class="employee-info"><strong>💵 ${currentLanguage === "ar" ? "الصافي:" : "Net:"} ${formatMoney(finance.netSalary)}</strong></div>
        <div class="employee-info">📍 ${currentLanguage === "ar" ? "حالة اليوم:" : "Today's status:"} ${attendanceStatus}</div>
        ${employee.notes ? `<div class="employee-notes">📝 ${escapeHTML(employee.notes)}</div>` : ""}
        <button type="button" class="employee-self-delete-button" style="margin-top:14px;background:#b42332;color:#fff" data-id="${escapeHTML(employee.id)}">🗑️ ${currentLanguage === "ar" ? "حذف بطاقتي" : "Delete my card"}</button>
    `;
    details.hidden = false;
    input.value = "";
    details.querySelector(".employee-self-delete-button")?.addEventListener("click", () => deleteEmployeeWithCode(employee.id, enteredCode));
    // اخفاء البيانات الخاصة تلقائيًا بعد فترة قصيرة أو عند مغادرة التبويب.
    const hidePrivateDetails = () => {
        if (!details.isConnected) return;
        details.hidden = true;
        details.innerHTML = "";
    };
    window.setTimeout(hidePrivateDetails, 45000);
    document.addEventListener("visibilitychange", function hideOnLeave() {
        if (document.hidden) {
            hidePrivateDetails();
            document.removeEventListener("visibilitychange", hideOnLeave);
        }
    }, { once: true });
}

function deleteEmployeeWithCode(id, verifiedCode) {
    const employee = employees.find(item => item.id === id);
    if (!employee || String(employee.attendanceCode || "") !== String(verifiedCode || "")) {
        alert(currentLanguage === "ar" ? "لا تملك صلاحية حذف هذه البطاقة." : "You are not authorized to delete this card.");
        return;
    }
    const confirmed = confirm(currentLanguage === "ar" ? `سيتم حذف بطاقة العامل ${employee.name} وبياناته المرتبطة. هل أنت متأكد؟` : `Delete ${employee.name}'s card and related data?`);
    if (!confirmed) return;
    employees = employees.filter(item => item.id !== id);
    saveEmployees();
    renderEmployees();
    updateEmployeeStats();
}

// ======================================================
// أحداث العاملين
// ======================================================

function attachEmployeeCardEvents() {
    // بطاقات الموظفين لا تعرض أدوات تعديل؛ البيانات الخاصة لا تظهر إلا بعد التحقق بالكود.
}


// ======================================================
// تعديل العامل
// ======================================================

function editEmployee() {
    alert(currentLanguage === "ar" ? "تعديل بيانات العامل غير متاح." : "Employee editing is disabled.");
}


// ======================================================
// حذف العامل
// ======================================================

function deleteEmployee(id, verifiedCode) {
    // لا يسمح بالحذف إلا بعد مطابقة كود صاحب البطاقة.
    deleteEmployeeWithCode(id, verifiedCode);
}


// ======================================================
// الحضور والانصراف
// ======================================================

function showAttendance() {

    currentEmployeeView =
        "attendance";

    hideEmployeeViews();


    if (employeesList) {

        employeesList.style.display =
            "none";
    }


    if (employeeSearchInput) {

        employeeSearchInput.parentElement.style.display =
            "none";
    }


    if (attendanceSection) {

        attendanceSection.style.display =
            "block";

        attendanceSection.scrollIntoView({
            behavior:
                "smooth",
            block:
                "start"
        });
    }


    renderAttendance();
}


function renderAttendance() {
    if (!attendanceList) return;
    const today = getToday();
    processAutomaticEmployeeAbsences();
    attendanceList.innerHTML = employees.map(employee => {
        const status = employee.attendance && employee.attendance[today] || "";
        return `<div class="attendance-row" style="display:flex;align-items:center;justify-content:space-between;gap:15px;padding:15px;margin-bottom:10px;border-radius:12px;background:rgba(255,255,255,.04);flex-wrap:wrap;">
            <div><strong>${escapeHTML(employee.name)}</strong><div style="opacity:.7;margin-top:5px;">${escapeHTML(employee.job || "")}</div><small>الشيفت: ${escapeHTML(employee.shiftStartTime || "09:00")}</small></div>
            <strong>${status === "present" ? "🟢 حاضر" : status === "absent" ? "🔴 غائب تلقائيًا" : "🕒 في انتظار تسجيل الحضور"}</strong>
        </div>`;
    }).join("") || `<div class="empty-state">لا يوجد موظفون مسجلون.</div>`;
}

function registerEmployeeAttendanceByCode() {
    const input = document.getElementById("employee-attendance-code");
    const code = String(input?.value || "").trim();
    if (!/^\d{6}$/.test(code)) { alert("اكتب كود الحضور المكوّن من 6 أرقام."); return; }
    const employee = employees.find(item => String(item.attendanceCode || "") === code);
    if (!employee) { alert("كود الحضور غير صحيح."); return; }
    const today = getToday();
    if (!employee.attendance) employee.attendance = {};
    if (employee.attendance[today] === "present") { alert("تم تسجيل حضور العامل بالفعل اليوم."); return; }
    employee.attendance[today] = "present";
    employee.attendanceMeta = employee.attendanceMeta || {};
    employee.attendanceMeta[today] = { verifiedByCode: true, at: new Date().toISOString() };
    if (input) input.value = "";
    saveEmployees(); renderAttendance(); updateEmployeeStats();
    if (typeof addNotificationFromOperation === "function") addNotificationFromOperation({type:"employee-attendance",icon:"🟢",title:"تم تسجيل حضور عامل",details:employee.name + " — حضور بالكود"});
}

function processAutomaticEmployeeAbsences() {
    if (!Array.isArray(employees) || !employees.length) return;
    const now = new Date();
    const today = getToday();
    const currentTime = String(now.getHours()).padStart(2,"0") + ":" + String(now.getMinutes()).padStart(2,"0");
    let changed = false;
    employees.forEach(employee => {
        if (!employee || (employee.startDate && employee.startDate > today)) return;
        if (!employee.attendance) employee.attendance = {};
        const shift = /^\d{2}:\d{2}$/.test(employee.shiftStartTime || "") ? employee.shiftStartTime : "09:00";
        if (!employee.attendance[today] && currentTime >= shift) {
            employee.attendance[today] = "absent";
            employee.attendanceMeta = employee.attendanceMeta || {};
            employee.attendanceMeta[today] = { automatic: true, at: now.toISOString() };
            changed = true;
        }
    });
    if (changed) {
        saveEmployees();
        if (typeof addNotificationFromOperation === "function") addNotificationFromOperation({type:"employee-absence",icon:"🔴",title:"تسجيل غياب تلقائي",details:"تم تسجيل الغياب للعاملين الذين لم يسجلوا الحضور بعد موعد الشيفت."});
    }
}

(function initEmployeeAttendanceCodeEntry(){
    const button = document.getElementById("employee-attendance-submit");
    const input = document.getElementById("employee-attendance-code");
    if (button) button.addEventListener("click", registerEmployeeAttendanceByCode);
    if (input) input.addEventListener("keydown", event => { if (event.key === "Enter") { event.preventDefault(); registerEmployeeAttendanceByCode(); } });
    document.addEventListener("visibilitychange", () => { if (!document.hidden) { processAutomaticEmployeeAbsences(); if (typeof updateEmployeeStats === "function") updateEmployeeStats(); } });
    window.addEventListener("focus", () => { processAutomaticEmployeeAbsences(); if (typeof updateEmployeeStats === "function") updateEmployeeStats(); });
    window.setInterval(() => { if (!document.hidden) { processAutomaticEmployeeAbsences(); if (typeof updateEmployeeStats === "function") updateEmployeeStats(); } }, 60000);
})();

function setAttendance(
    employeeId,
    status
) {

    const employee =
        employees.find(
            item =>
                item.id === employeeId
        );

    if (!employee) {
        return;
    }


    if (!employee.attendance) {

        employee.attendance =
            {};
    }


    employee.attendance[
        getToday()
    ] = status;


    saveEmployees();

    renderAttendance();

    updateEmployeeStats();
}


// ======================================================
// المرتبات
// ======================================================

function showSalaries() {

    currentEmployeeView =
        "salaries";

    hideEmployeeViews();


    if (employeesList) {

        employeesList.style.display =
            "none";
    }


    if (employeeSearchInput) {

        employeeSearchInput.parentElement.style.display =
            "none";
    }


    if (salariesSection) {

        salariesSection.style.display =
            "block";

        salariesSection.scrollIntoView({
            behavior:
                "smooth",
            block:
                "start"
        });
    }


    renderSalaries();
}


function renderSalaries() {

    if (!salariesList) {
        return;
    }


    salariesList.innerHTML =
        employees
            .map(
                function (
                    employee,
                    index
                ) {

                    const finance =
                        getEmployeeFinance(
                            employee
                        );


                    return `

                        <div
                            class="salary-row"
                            style="
                                padding:18px;
                                margin-bottom:12px;
                                border-radius:14px;
                                background:rgba(255,255,255,.04);
                            "
                        >

                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                    gap:15px;
                                    flex-wrap:wrap;
                                "
                            >

                                <div>

                                    <strong>
                                        #${index + 1}
                                        -
                                        ${escapeHTML(
                                            employee.name
                                        )}
                                    </strong>

                                    <div
                                        style="
                                            opacity:.7;
                                            margin-top:5px;
                                        "
                                    >
                                        ${escapeHTML(
                                            employee.job || ""
                                        )}
                                    </div>

                                </div>


                                <button
                                    type="button"
                                    class="salary-print-button"
                                    data-id="${escapeHTML(employee.id)}"
                                >
                                    🖨️
                                    ${
                                        currentLanguage === "ar"
                                            ? "طباعة"
                                            : "Print"
                                    }
                                </button>

                            </div>


                            <div
                                class="salary-details"
                                style="
                                    display:grid;
                                    grid-template-columns:repeat(5,1fr);
                                    gap:10px;
                                    margin-top:15px;
                                "
                            >

                                <div>
                                    💰
                                    ${
                                        currentLanguage === "ar"
                                            ? "المرتب الأساسي"
                                            : "Base Salary"
                                    }:
                                    <strong>
                                        ${formatMoney(
                                            finance.baseSalary
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    🔴
                                    ${
                                        currentLanguage === "ar"
                                            ? "أيام الغياب"
                                            : "Absent Days"
                                    }:
                                    <strong>
                                        ${finance.absentDays}
                                    </strong>
                                </div>


                                <div>
                                    📉
                                    ${
                                        currentLanguage === "ar"
                                            ? "خصم الغياب"
                                            : "Absence Deduction"
                                    }:
                                    <strong>
                                        ${formatMoney(
                                            finance.absenceDeduction
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    💸
                                    ${
                                        currentLanguage === "ar"
                                            ? "السلف"
                                            : "Loans"
                                    }:
                                    <strong>
                                        ${formatMoney(
                                            finance.loanTotal
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    🎁
                                    ${
                                        currentLanguage === "ar"
                                            ? "المكافآت"
                                            : "Bonuses"
                                    }:
                                    <strong>
                                        ${formatMoney(
                                            finance.bonusTotal
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    💵
                                    ${
                                        currentLanguage === "ar"
                                            ? "الصافي"
                                            : "Net Salary"
                                    }:
                                    <strong>
                                        ${formatMoney(
                                            finance.netSalary
                                        )}
                                    </strong>
                                </div>

                            </div>


                            <div
                                style="
                                    display:flex;
                                    gap:10px;
                                    flex-wrap:wrap;
                                    margin-top:15px;
                                "
                            >

                                <button
                                    type="button"
                                    class="add-loan-button"
                                    data-id="${escapeHTML(employee.id)}"
                                >
                                    💸
                                    ${
                                        currentLanguage === "ar"
                                            ? "إضافة سلفة"
                                            : "Add Loan"
                                    }
                                </button>


                                <button
                                    type="button"
                                    class="add-bonus-button"
                                    data-id="${escapeHTML(employee.id)}"
                                >
                                    🎁
                                    ${
                                        currentLanguage === "ar"
                                            ? "إضافة مكافأة"
                                            : "Add Bonus"
                                    }
                                </button>

                            </div>

                        </div>

                    `;
                }
            )
            .join("");


    salariesList
        .querySelectorAll(
            ".salary-print-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        printEmployeeData(
                            this.dataset.id
                        );
                    }
                );
            }
        );


    salariesList
        .querySelectorAll(
            ".add-loan-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        addEmployeeLoan(
                            this.dataset.id
                        );
                    }
                );
            }
        );


    salariesList
        .querySelectorAll(
            ".add-bonus-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        addEmployeeBonus(
                            this.dataset.id
                        );
                    }
                );
            }
        );
}


// ======================================================
// السلف
// ======================================================

function addEmployeeLoan(
    id
) {

    const employee =
        employees.find(
            item =>
                item.id === id
        );

    if (!employee) {
        return;
    }


    const value =
        prompt(
            currentLanguage === "ar"
                ? `أدخل قيمة السلفة للعامل ${employee.name}:`
                : `Enter loan amount for ${employee.name}:`
        );


    if (
        value === null ||
        value.trim() === ""
    ) {
        return;
    }


    const amount =
        Number(
            value
        );


    if (
        !Number.isFinite(
            amount
        ) ||
        amount <= 0
    ) {

        alert(
            currentLanguage === "ar"
                ? "أدخل مبلغًا صحيحًا."
                : "Enter a valid amount."
        );

        return;
    }


    if (!employee.loans) {

        employee.loans =
            [];
    }


    employee.loans.push({

        id:
            createId(
                "loan"
            ),

        amount:
            amount,

        date:
            getToday(),

        createdAt:
            new Date().toISOString()
    });


    saveEmployees();

    renderSalaries();

    updateEmployeeStats();
}


// ======================================================
// المكافآت
// ======================================================

function addEmployeeBonus(
    id
) {

    const employee =
        employees.find(
            item =>
                item.id === id
        );

    if (!employee) {
        return;
    }


    const value =
        prompt(
            currentLanguage === "ar"
                ? `أدخل قيمة المكافأة للعامل ${employee.name}:`
                : `Enter bonus amount for ${employee.name}:`
        );


    if (
        value === null ||
        value.trim() === ""
    ) {
        return;
    }


    const amount =
        Number(
            value
        );


    if (
        !Number.isFinite(
            amount
        ) ||
        amount <= 0
    ) {

        alert(
            currentLanguage === "ar"
                ? "أدخل مبلغًا صحيحًا."
                : "Enter a valid amount."
        );

        return;
    }


    if (!employee.bonuses) {

        employee.bonuses =
            [];
    }


    employee.bonuses.push({

        id:
            createId(
                "bonus"
            ),

        amount:
            amount,

        date:
            getToday(),

        createdAt:
            new Date().toISOString()
    });


    saveEmployees();

    renderSalaries();

    updateEmployeeStats();
}


// ======================================================
// حسابات العامل
// ======================================================

function getEmployeeFinance(
    employee
) {

    const salary =
        Number(
            employee.salary
        ) || 0;


    const attendance =
        employee.attendance || {};


    const absentDays =
        Object.values(
            attendance
        )
            .filter(
                status =>
                    status ===
                    "absent"
            )
            .length;


    const dailySalary =
        salary /
        30;


    const absenceDeduction =
        dailySalary *
        absentDays;


    const loanTotal =
        Array.isArray(
            employee.loans
        )
            ? employee.loans.reduce(
                function (
                    total,
                    item
                ) {

                    return (
                        total +
                        (
                            Number(
                                item.amount
                            ) || 0
                        )
                    );
                },
                0
            )
            : 0;


    const bonusTotal =
        Array.isArray(
            employee.bonuses
        )
            ? employee.bonuses.reduce(
                function (
                    total,
                    item
                ) {

                    return (
                        total +
                        (
                            Number(
                                item.amount
                            ) || 0
                        )
                    );
                },
                0
            )
            : 0;


    const netSalary =
        salary -
        absenceDeduction -
        loanTotal +
        bonusTotal;


    return {

        baseSalary:
            salary,

        absentDays:
            absentDays,

        absenceDeduction:
            absenceDeduction,

        loanTotal:
            loanTotal,

        bonusTotal:
            bonusTotal,

        netSalary:
            netSalary
    };
}


// ======================================================
// إحصائيات العاملين
// ======================================================

function renderEmployeeStatistics() {

    if (!employeeStatistics) {
        return;
    }


    if (!employees.length) {

        employeeStatistics.innerHTML = `

            <div class="empty-state">

                <div
                    style="font-size:45px;"
                >
                    📊
                </div>

                <h3>
                    ${
                        currentLanguage === "ar"
                            ? "لا توجد بيانات للعاملين"
                            : "No employee data"
                    }
                </h3>

            </div>

        `;

        return;
    }


    const statsMonth = getToday().slice(0, 7);
    const statsAttendance = employees.reduce((totals, employee) => {
        Object.entries(employee.attendance || {}).forEach(([date, status]) => {
            if (date.startsWith(statsMonth)) {
                if (status === "present") totals.present++;
                if (status === "absent") totals.absent++;
            }
        });
        return totals;
    }, { present: 0, absent: 0 });
    const statsPayroll = employees.reduce((totals, employee) => {
        const finance = getEmployeeFinance(employee);
        totals.base += Number(finance.baseSalary) || 0;
        totals.net += Number(finance.netSalary) || 0;
        totals.loans += Number(finance.loanTotal) || 0;
        totals.bonuses += Number(finance.bonusTotal) || 0;
        return totals;
    }, { base: 0, net: 0, loans: 0, bonuses: 0 });
    const statsRate = (statsAttendance.present + statsAttendance.absent)
        ? Math.round(statsAttendance.present / (statsAttendance.present + statsAttendance.absent) * 100)
        : 0;
    const statsDashboard = `
        <div class="employee-statistics-overview" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin-bottom:20px">
            <div class="employee-stat-tile"><small>👥 إجمالي العاملين</small><h2>${employees.length}</h2></div>
            <div class="employee-stat-tile"><small>🟢 حضور الشهر</small><h2>${statsAttendance.present}</h2></div>
            <div class="employee-stat-tile"><small>🔴 غياب الشهر</small><h2>${statsAttendance.absent}</h2></div>
            <div class="employee-stat-tile"><small>📈 نسبة الحضور</small><h2>${statsRate}%</h2></div>
            <div class="employee-stat-tile"><small>💰 إجمالي الرواتب</small><h2>${formatMoney(statsPayroll.base)}</h2></div>
            <div class="employee-stat-tile"><small>💵 صافي المستحق</small><h2>${formatMoney(statsPayroll.net)}</h2></div>
            <div class="employee-stat-tile"><small>💸 إجمالي السلف</small><h2>${formatMoney(statsPayroll.loans)}</h2></div>
            <div class="employee-stat-tile"><small>🎁 إجمالي المكافآت</small><h2>${formatMoney(statsPayroll.bonuses)}</h2></div>
        </div>`;

    employeeStatistics.innerHTML =
        statsDashboard + employees
            .map(
                function (
                    employee,
                    index
                ) {

                    const finance =
                        getEmployeeFinance(
                            employee
                        );
                    const monthPrefix = getToday().slice(0, 7);
                    const monthAttendance = Object.entries(employee.attendance || {}).filter(([date]) => date.startsWith(monthPrefix));
                    const monthPresent = monthAttendance.filter(([,status]) => status === "present").length;
                    const monthAbsent = monthAttendance.filter(([,status]) => status === "absent").length;

                    return `

                        <div
                            class="employee-statistics-card"
                            style="
                                padding:20px;
                                margin-bottom:15px;
                                border-radius:16px;
                                background:rgba(255,255,255,.04);
                            "
                        >

                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                    gap:15px;
                                    flex-wrap:wrap;
                                "
                            >

                                <div>

                                    <h3>
                                        #${index + 1}
                                        -
                                        ${escapeHTML(
                                            employee.name
                                        )}
                                    </h3>

                                    <div
                                        style="
                                            opacity:.7;
                                        "
                                    >
                                        ${escapeHTML(
                                            employee.job || ""
                                        )}
                                    </div>

                                </div>


                                <button
                                    type="button"
                                    class="statistics-print-button"
                                    data-id="${escapeHTML(employee.id)}"
                                >
                                    🖨️
                                    ${
                                        currentLanguage === "ar"
                                            ? "طباعة"
                                            : "Print"
                                    }
                                </button>

                            </div>


                            <div
                                style="
                                    display:grid;
                                    grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
                                    gap:12px;
                                    margin-top:15px;
                                "
                            >

                                <div>
                                    💰
                                    ${
                                        currentLanguage === "ar"
                                            ? "المرتب"
                                            : "Salary"
                                    }

                                    <strong>
                                        ${formatMoney(
                                            finance.baseSalary
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    📅 حضور الشهر الحالي: <strong>${monthPresent}</strong>
                                </div>
                                <div>
                                    📅 غياب الشهر الحالي: <strong>${monthAbsent}</strong>
                                </div>
                                <div>
                                    🟢
                                    ${
                                        currentLanguage === "ar"
                                            ? "الحضور"
                                            : "Present"
                                    }

                                    <strong>
                                        ${
                                            getEmployeePresentDays(
                                                employee
                                            )
                                        }
                                    </strong>
                                </div>


                                <div>
                                    🔴
                                    ${
                                        currentLanguage === "ar"
                                            ? "الغياب"
                                            : "Absent"
                                    }

                                    <strong>
                                        ${finance.absentDays}
                                    </strong>
                                </div>


                                <div>
                                    📉
                                    ${
                                        currentLanguage === "ar"
                                            ? "خصم الغياب"
                                            : "Absence Deduction"
                                    }

                                    <strong>
                                        ${formatMoney(
                                            finance.absenceDeduction
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    💸
                                    ${
                                        currentLanguage === "ar"
                                            ? "السلف"
                                            : "Loans"
                                    }

                                    <strong>
                                        ${formatMoney(
                                            finance.loanTotal
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    🎁
                                    ${
                                        currentLanguage === "ar"
                                            ? "المكافآت"
                                            : "Bonuses"
                                    }

                                    <strong>
                                        ${formatMoney(
                                            finance.bonusTotal
                                        )}
                                    </strong>
                                </div>


                                <div>
                                    💵
                                    ${
                                        currentLanguage === "ar"
                                            ? "الصافي"
                                            : "Net"
                                    }

                                    <strong>
                                        ${formatMoney(
                                            finance.netSalary
                                        )}
                                    </strong>
                                </div>

                            </div>

                        </div>

                    `;
                }
            )
            .join("");


    employeeStatistics
        .querySelectorAll(
            ".statistics-print-button"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {

                        printEmployeeData(
                            this.dataset.id
                        );
                    }
                );
            }
        );
}


// ======================================================
// أيام الحضور
// ======================================================

function getEmployeePresentDays(
    employee
) {

    if (
        !employee ||
        !employee.attendance
    ) {

        return 0;
    }


    return Object.values(
        employee.attendance
    )
        .filter(
            status =>
                status ===
                "present"
        )
        .length;
}


// ======================================================
// تحديث إحصائيات لوحة العاملين
// ======================================================

function updateEmployeeStats() {

    if (totalEmployees) {

        totalEmployees.textContent =
            employees.length;
    }


    let present =
        0;

    let absent =
        0;


    const today =
        getToday();


    employees.forEach(
        function (
            employee
        ) {

            const status =
                employee.attendance &&
                employee.attendance[
                    today
                ];


            if (
                status ===
                "present"
            ) {

                present++;

            } else if (
                status ===
                "absent"
            ) {

                absent++;
            }
        }
    );


    if (presentEmployees) {

        presentEmployees.textContent =
            present;
    }


    if (absentEmployees) {

        absentEmployees.textContent =
            absent;
    }


    const totalSalary =
        employees.reduce(
            function (
                total,
                employee
            ) {

                const finance =
                    getEmployeeFinance(
                        employee
                    );

                return (
                    total +
                    finance.netSalary
                );
            },
            0
        );


    if (totalSalaries) {

        totalSalaries.textContent =
            formatMoney(
                totalSalary
            );
    }
}


// ======================================================
// بحث العاملين
// ======================================================

let employeeSearchInput =
    document.getElementById(
        "employee-search-input"
    );


if (!employeeSearchInput) {

    employeeSearchInput =
        document.querySelector(
            "#employees-section input[type='search']"
        );
}


if (employeeSearchInput) {

    employeeSearchInput.addEventListener(
        "input",
        function () {

            const value =
                this.value
                    .trim()
                    .toLowerCase();


            if (!value) {

                renderEmployees();

                return;
            }


            const filtered =
                employees.filter(
                    employee => {

                        const text = [

                            employee.name,

                            employee.phone,

                            employee.job,

                            employee.notes

                        ]
                            .map(
                                item =>
                                    String(
                                        item || ""
                                    )
                                        .toLowerCase()
                            )
                            .join(" ");


                        return text.includes(
                            value
                        );
                    }
                );


            renderEmployees(
                filtered
            );
        }
    );
}


// ======================================================
// إغلاق أقسام العاملين
// ======================================================

function closeEmployeeSubsection() {

    currentEmployeeView =
        "main";

    hideEmployeeViews();

    showEmployeeMain();

    renderEmployees();
}


// ======================================================
// ربط زر الإحصائيات
// ======================================================

if (statisticsButton) {

    statisticsButton.addEventListener(
        "click",
        showEmployeeStatistics
    );
}


// ======================================================
// تحديث عرض العاملين
// ======================================================

function refreshEmployeeArea() {

    if (
        currentSection ===
        "employees"
    ) {

        renderEmployees();

        updateEmployeeStats();
    }
}


// ======================================================
// عرض الصفحة الحالية
// ======================================================

function renderCurrentView() {

    if (!currentUser) {
        return;
    }


    if (
        currentSection ===
        SECTIONS.SALE
    ) {

        showSalesArea();

        return;
    }


    if (
        [
            SECTIONS.PENDING,
            SECTIONS.READY,
            SECTIONS.FAILED,
            SECTIONS.DELIVERED
        ].includes(
            currentSection
        )
    ) {

        showMaintenanceSection(
            currentSection
        );

        return;
    }


    if (
        currentSection ===
        "employees"
    ) {

        showEmployeesArea();

        return;
    }
}


// ======================================================
// زر الرجوع للأعلى
// ======================================================

const topBtn =
    document.getElementById(
        "topBtn"
    );


if (topBtn) {

    window.addEventListener(
        "scroll",
        function () {

            if (
                window.scrollY >
                500
            ) {

                topBtn.classList.add(
                    "show"
                );

            } else {

                topBtn.classList.remove(
                    "show"
                );
            }
        }
    );


    topBtn.addEventListener(
        "click",
        function () {

            window.scrollTo({
                top:
                    0,

                behavior:
                    "smooth"
            });


            
        }
    );
}



// ======================================================
// BOTTOM NAVIGATION - FINAL FIX
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    const navHome = document.getElementById("nav-home");
    const navDevices = document.getElementById("nav-devices");
    const navSales = document.getElementById("nav-sales");
    const navPurchases = document.getElementById("nav-purchases");
    const navAccount = document.getElementById("nav-account");
    const navMore = document.getElementById("nav-more");

    const homeSection = document.getElementById("home-section");
    const salesArea = document.querySelector(".sales-area");
    const customersSection = document.getElementById("customers-section");
    const employeesSection = document.getElementById("employees-section");
    const moreSection = document.getElementById("more-section");
    const walletSection = document.getElementById("wallet-section");
    const accountSection = document.getElementById("account-section");
    const moreWallet = document.getElementById("more-wallet");

    const independentSales =
        document.getElementById("independent-sales-section");

    const independentPurchases =
        document.getElementById("independent-purchases-section");

    // ==================================================
    // إخفاء جميع الأقسام
    // ==================================================

    function hideAllSections() {

        const sections = [
            homeSection,
            salesArea,
            customersSection,
            employeesSection,
            moreSection,
            independentSales,
            independentPurchases,
            walletSection,
            accountSection
        ];

        sections.forEach(function (section) {
            if (section) {
                section.style.display = "none";
            }
        });

        // Hide the private owner/support screens when navigating elsewhere.
        ["owner-console-section", "customer-support-section"].forEach(function (id) {
            const section = document.getElementById(id);
            if (section) section.style.display = "none";
        });

        // Hide all standalone modules when switching the main navigation.
        document.querySelectorAll(".act-extra-section, #day-close-section, #customer-management-section, #safe-overview-section, #settings-section, #accessories-section, #general-reports-section, #previous-days-section").forEach(function (section) {
            section.style.display = "none";
        });

        // Prevent a stale nested view from remaining visible beside the selected screen.
        document.querySelectorAll(".independent-sales-view, .independent-purchases-view, .more-grid").forEach(function (view) {
            if (view.classList.contains("more-grid")) return;
            view.style.display = "none";
        });

        if (independentSales) {

            independentSales
                .querySelectorAll(".independent-sales-view")
                .forEach(function (view) {
                    view.style.display = "none";
                });

            independentSales
                .querySelectorAll(".independent-sales-card")
                .forEach(function (card) {
                    card.classList.remove("active");
                });
        }
    }

    // ==================================================
    // تفعيل زر الشريط السفلي
    // ==================================================

    function activate(button) {

        document
            .querySelectorAll(".bottom-nav-button")
            .forEach(function (item) {
                item.classList.remove("active");
            });

        if (button) {
            button.classList.add("active");
        }
    }

    // ==================================================
    // إظهار القسم أسفل الهيدر
    // ==================================================

    function showSectionBelowHeader(section) {

        if (!section) {
            return;
        }

        const header = document.querySelector(".header");

        if (header && header.parentNode) {
            header.parentNode.insertBefore(
                section,
                header.nextSibling
            );
        }

        section.style.display = "block";

        window.scrollTo({
            top: 0,
            behavior: "auto"
        });
    }

  // ==================================================
// الرئيسية - إخفاء قسم الأجهزة نهائيًا من الشاشة
// ==================================================

if (navHome) {

    navHome.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopImmediatePropagation();

        hideAllSections();

        // إخفاء قسم الأجهزة بالقوة
        document.querySelectorAll(".sales-area").forEach(function (section) {
            section.style.setProperty("display", "none", "important");
        });

        // إظهار الرئيسية فقط
        if (homeSection) {
            homeSection.style.display = "block";
        }

        activate(navHome);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, true);
}


    // ==================================================
    // الأجهزة
    // ==================================================

    if (navDevices) {

        navDevices.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopImmediatePropagation();

            // إخفاء جميع الأقسام الأخرى
            hideAllSections();

            // إظهار قسم الأجهزة فقط
            if (salesArea) {
                salesArea.style.display = "block";
            }

            activate(navDevices);

            if (typeof showSalesArea === "function") {
                showSalesArea();
            }

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }, true);
    }

    // ==================================================
    // المبيعات المستقلة
    // ==================================================

    if (navSales) {

        navSales.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopImmediatePropagation();

            hideAllSections();

            if (independentSales) {

                showSectionBelowHeader(independentSales);

                const salesCards =
                    independentSales.querySelector(
                        ".independent-sales-grid"
                    );

                if (salesCards) {
                    salesCards.style.display = "grid";
                }

                independentSales
                    .querySelectorAll(".independent-sales-view")
                    .forEach(function (view) {
                        view.style.display = "none";
                    });

                independentSales
                    .querySelectorAll(".independent-sales-card")
                    .forEach(function (card) {
                        card.classList.remove("active");
                    });
            }

            activate(navSales);

        }, true);
    }

    // ==================================================
    // المشتريات المستقلة
    // ==================================================

    if (navPurchases) {

        navPurchases.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopImmediatePropagation();

            hideAllSections();

            if (!independentPurchases) {
                console.error(
                    "Purchases section not found: #independent-purchases-section"
                );
                return;
            }

            showSectionBelowHeader(independentPurchases);

            if (typeof window.renderIndependentPurchases === "function") {
                window.renderIndependentPurchases();
            }

            activate(navPurchases);

        }, true);
    }

    // ==================================================
    // حسابي
    // ==================================================

    if (navAccount) {

        navAccount.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopImmediatePropagation();

            hideAllSections();

            if (!accountSection) {
                console.error(
                    "Account section not found: #account-section"
                );
                return;
            }

            showSectionBelowHeader(accountSection);
            activate(navAccount);

        }, true);
    }

    // ==================================================
    // المزيد
    // ==================================================

    if (navMore) {

        navMore.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopImmediatePropagation();

            hideAllSections();

            if (moreSection) {

                showSectionBelowHeader(moreSection);

                const moreGrid =
                    moreSection.querySelector(".more-grid");

                if (moreGrid) {
                    moreGrid.style.display = "grid";
                }

                moreSection
                    .querySelectorAll(".more-card")
                    .forEach(function (card) {
                        card.style.display = "flex";
                    });
            }

            activate(navMore);

        }, true);
    }

    // ==================================================
    // ربط كروت الرئيسية بالأقسام الفعلية
    // ==================================================

    const homeDevices = document.getElementById("home-devices");
    const homeMaintenance = document.getElementById("home-maintenance");
    const homeEmployees = document.getElementById("home-employees");
    const homeSales = document.getElementById("home-sales");

    // كارت الأجهزة والبيع
    if (homeDevices) {
        homeDevices.addEventListener("click", function () {

            if (navDevices) {
                navDevices.click();
            }

        });
    }

    
    // كارت العملاء والصيانة
    if (homeMaintenance) {
        homeMaintenance.addEventListener("click", function (event) {

            event.preventDefault();

            hideAllSections();

            if (!customersSection) {
                console.error(
                    "Customers section not found: #customers-section"
                );
                return;
            }

            showSectionBelowHeader(customersSection);

            // فتح شاشة الصيانة الافتراضية مثل قسم المزيد
            if (typeof showMaintenanceSection === "function") {
                showMaintenanceSection("maintenance-pending");
            }

            activate(navMore);

            window.scrollTo({
                top: 0,
                behavior: "auto"
            });

        });
    }


    // كارت العاملين في الرئيسية: استخدم نفس مسار زر الموظفين داخل «المزيد».
    // بهذا يتم تشغيل نفس فحص الصلاحيات، وإظهار التطبيق، ورسم بيانات الموظفين.
    if (homeEmployees) {
        homeEmployees.addEventListener("click", function (event) {
            event.preventDefault();
            const moreEmployeesButton = document.getElementById("more-employees");
            if (moreEmployeesButton) {
                moreEmployeesButton.click();
            } else {
                console.error("Employees navigation button not found: #more-employees");
            }
        });
    }

    // كارت المبيعات
    if (homeSales) {
        homeSales.addEventListener("click", function () {

            if (navSales) {
                navSales.click();
            }

        });
    }

    // ==================================================
    // فتح المحفظة من المزيد
    // ==================================================

    if (moreWallet) {

        moreWallet.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const walletPage =
                document.getElementById("wallet-section");

            document.querySelectorAll(".act-extra-section").forEach(function (section) {
                section.style.display = "none";
            });

            const morePage =
                document.getElementById("more-section");

            if (!walletPage || !morePage) {
                return;
            }

            [
                homeSection,
                salesArea,
                customersSection,
                employeesSection,
                independentSales,
                independentPurchases,
                accountSection
            ].forEach(function (section) {
                if (section) {
                    section.style.display = "none";
                }
            });

            // إبقاء المزيد ظاهراً خلف المحفظة
            morePage.style.display = "block";
            walletPage.style.display = "block";
            walletPage.style.position = "relative";
            walletPage.style.zIndex = "100";

            if (typeof renderWalletTransactions === "function") {
                renderWalletTransactions(walletPage);
            }

            window.scrollTo({
                top: 0,
                behavior: "auto"
            });

        }, true);
    }

});

// ======================================================
// MAINTENANCE SECTION - POSITION FIX
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    const maintenanceCard =
        document.getElementById("more-maintenance");

    const maintenanceSection =
        document.getElementById("customers-section");

    const moreSection =
        document.getElementById("more-section");

    const header =
        document.querySelector(".header");

    const navMore =
        document.getElementById("nav-more");

    if (!maintenanceCard || !maintenanceSection) {
        return;
    }

    maintenanceCard.addEventListener("click", function (event) {

        event.preventDefault();
        event.stopPropagation();

        // إخفاء الأقسام الأخرى
        [
            document.getElementById("home-section"),
            document.querySelector(".sales-area"),
            document.getElementById("employees-section"),
            moreSection,
            document.getElementById("independent-sales-section"),
            document.getElementById("wallet-section"),
            document.getElementById("account-section")
        ].forEach(function (section) {

            if (section) {
                section.style.display = "none";
            }

        });

        // نقل قسم الصيانة ليظهر مباشرة بعد الهيدر
        if (header && header.parentNode) {

            header.parentNode.insertBefore(
                maintenanceSection,
                header.nextSibling
            );

        }

        // إظهار قسم الصيانة
        maintenanceSection.style.display = "block";

        // فتح شاشة الصيانة الافتراضية
        if (typeof showMaintenanceSection === "function") {
            showMaintenanceSection("maintenance-pending");
        }

        // تفعيل زر المزيد
        document
            .querySelectorAll(".bottom-nav-button")
            .forEach(function (button) {
                button.classList.remove("active");
            });

        if (navMore) {
            navMore.classList.add("active");
        }

        requestAnimationFrame(function () {

            window.scrollTo({
                top: 0,
                behavior: "auto"
            });

        });

    });

});

// ==================================================
// أزرار المبيعات الداخلية
// ==================================================

document.addEventListener(
    "click",
    function (event) {

        const card = event.target.closest(
            ".independent-sales-card"
        );

        if (!card) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        const salesSection =
            document.getElementById(
                "independent-sales-section"
            );

            const independentPurchases =
    document.getElementById(
        "independent-purchases-section"
    );

        if (!salesSection) {
            return;
        }

        // إخفاء كل صفحات المبيعات
        document
            .querySelectorAll(
                ".independent-sales-view"
            )
            .forEach(function (view) {
                view.style.display = "none";
            });

        // إزالة التفعيل من كل الكروت
        salesSection
            .querySelectorAll(
                ".independent-sales-card"
            )
            .forEach(function (item) {
                item.classList.remove("active");
            });

        // تفعيل الكارت المضغوط
        card.classList.add("active");

        // معرفة الصفحة المطلوبة
        const viewName =
            card.getAttribute(
                "data-sales-view"
            );

        const target =
            document.getElementById(
                "sales-view-" + viewName
            );

        if (!target) {
            return;
        }

        // إظهار الصفحة
      target.style.display = "block";


        // لو سجل المبيعات
        if (viewName === "history") {
            if (typeof renderSalesHistory === "function") {
                renderSalesHistory();
            }
        }

        // لو المرتجعات
        if (viewName === "returns") {
            if (typeof renderActReturns === "function") {
                renderActReturns();
            }
        }

        // لو التقارير
        if (viewName === "reports") {
            if (typeof renderSalesReports === "function") {
                renderSalesReports();
            }
        }

     
    },
    true
);
// ======================================================
// فتح الرئيسية بعد تسجيل الدخول
// ======================================================

onAuthStateChanged(
    auth,
    function (user) {

        if (!user) {
            return;
        }


        setTimeout(
            function () {

                const homeButton =
                    document.getElementById(
                        "nav-home"
                    );


                const mainPage =
                    document.getElementById(
                        "main-page"
                    );

                    const moreSection =
    document.getElementById(
        "more-section"
    );


                if (
                    homeButton &&
                    mainPage &&
                    mainPage.style.display !==
                        "none"
                ) {

                    homeButton.click();

                }

            },
            300
        );

    }
);


// ======================================================
// WALLET TRANSACTIONS STORAGE
// ======================================================

// ======================================================
// 💳 WALLET - RENDER TRANSACTIONS
// عرض سجل جميع عمليات المحفظة
// ======================================================

function renderWalletTransactions(walletPage) {

    if (!walletPage) {
        return;
    }

    const list =
        walletPage.querySelector(
            "#wallet-transactions-list"
        );

    const count =
        walletPage.querySelector(
            "#wallet-transactions-count"
        );

    const searchInput =
        walletPage.querySelector(
            "#wallet-transactions-search"
        );

    if (!list) {
        return;
    }


    // ==================================================
    // أنواع عمليات المحفظة
    // ==================================================

    const operations = [
        "withdraw",
        "deposit",
        "recharge",
        "bills",
        "transfer"
    ];


    // ==================================================
    // قراءة كل العمليات
    // ==================================================

    let transactions = [];

    operations.forEach(function (operation) {

        try {

            const storageKey =
                (typeof window.getWalletTransactionsStorageKey === "function"
                    ? window.getWalletTransactionsStorageKey
                    : function (op) {
                        return "actPhoneManager_wallet_transactions_" + op + "_" +
                            ((typeof currentUser !== "undefined" && currentUser && currentUser.uid) ? currentUser.uid : "guest");
                    })(operation);

            const saved =
                localStorage.getItem(
                    storageKey
                );

            if (!saved) {
                return;
            }

            const parsed =
                JSON.parse(saved);

            if (Array.isArray(parsed)) {

                transactions =
                    transactions.concat(
                        parsed
                    );

            }

        } catch (error) {

            console.error(
                "Wallet render error:",
                error
            );

        }

    });


    // ==================================================
    // ترتيب الأحدث أولًا
    // ==================================================

    transactions.sort(
        function (a, b) {

            return (
                Number(b.createdAt || 0) -
                Number(a.createdAt || 0)
            );

        }
    );


    // ==================================================
    // البحث
    // ==================================================

    const searchValue =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const opFilter = walletPage.dataset.logFilter || "";
    const opFilterNames = { withdraw: "السحب", deposit: "الإيداع", recharge: "الشحن", bills: "الفواتير", transfer: "التحويل" };
    if (opFilter) {
        transactions = transactions.filter(function (t) { return (t.operation || "") === opFilter; });
    }
    let filterBar = walletPage.querySelector("#wallet-log-filter");
    if (!filterBar) {
        filterBar = document.createElement("div");
        filterBar.id = "wallet-log-filter";
        filterBar.className = "wallet-log-filter";
        list.parentNode.insertBefore(filterBar, list);
        filterBar.addEventListener("click", function (e) {
            if (e.target.closest("[data-wallet-show-all]")) {
                walletPage.dataset.logFilter = "";
                walletPage.querySelectorAll(".wallet-operation-card.is-active").forEach(function (c) { c.classList.remove("is-active"); });
                renderWalletTransactions(walletPage);
            }
        });
    }
    filterBar.style.display = opFilter ? "flex" : "none";
    filterBar.innerHTML = opFilter
        ? '<span>📋 تظهر الآن عمليات <b>' + (opFilterNames[opFilter] || "") + '</b> فقط</span><button type="button" data-wallet-show-all>عرض كل العمليات</button>'
        : "";

    const filteredTransactions =
        transactions.filter(
            function (transaction) {

                if (!searchValue) {
                    return true;
                }

                const searchableText =
                    [
                        transaction.id,
                        transaction.operationName,
                        transaction.operation,
                        transaction.service,
                        transaction.account,
                        transaction.statusName,
                        transaction.notes,
                        transaction.amount
                    ]
                        .filter(function (value) {
                            return (
                                value !== undefined &&
                                value !== null
                            );
                        })
                        .join(" ")
                        .toLowerCase();

                return searchableText.includes(
                    searchValue
                );

            }
        );


    // ==================================================
    // العدد
    // ==================================================

    if (count) {

        count.textContent =
            filteredTransactions.length +
            " عملية";

    }


    // ==================================================
    // لا توجد عمليات
    // ==================================================

    if (!filteredTransactions.length) {

        list.innerHTML = `
            <div
                style="
                    text-align:center;
                    padding:35px 20px;
                    color:#8fa0b8;
                    background:#08111e;
                    border:1px solid #1d3048;
                    border-radius:16px;
                "
            >
                📋 لا توجد عمليات محفوظة في سجل المحفظة
            </div>
        `;

        return;
    }


    // ==================================================
    // الأيقونات
    // ==================================================

    const operationIcons = {

        withdraw: "💸",

        deposit: "💰",

        recharge: "📱",

        bills: "🧾",

        transfer: "🔄"

    };


    // ==================================================
    // رسم العمليات
    // ==================================================

    list.innerHTML =
        filteredTransactions
            .map(
                function (transaction) {

                    const icon =
                        operationIcons[
                            transaction.operation
                        ] || "💳";

                        const operationNames = {

    withdraw: "عملية سحب",

    deposit: "عملية إيداع",

    recharge: "عملية شحن",

    bills: "عملية فواتير",

    transfer: "عملية تحويل"

};

const operationName =
    operationNames[
        transaction.operation
    ] || "عملية محفظة";


                    const formattedAmount =
                        Number(
                            transaction.amount || 0
                        ).toLocaleString(
                            "ar-EG"
                        );


                    const formattedDate =
                        transaction.date
                            ? new Date(
                                transaction.date
                            ).toLocaleString(
                                "ar-EG"
                            )
                            : "-";


                    return `

                        <div
                            style="
                                background:#08111e;
                                border:1px solid #1d3048;
                                border-radius:16px;
                                padding:18px;
                                margin-bottom:14px;
                            "
                        >

                            <div
                                style="
                                    display:flex;
                                    justify-content:space-between;
                                    align-items:center;
                                    gap:15px;
                                    margin-bottom:14px;
                                "
                            >

                                <div
                                    style="
                                        display:flex;
                                        align-items:center;
                                        gap:12px;
                                    "
                                >

                                    <div
                                        style="
                                            width:48px;
                                            height:48px;
                                            border-radius:14px;
                                            background:#111d30;
                                            display:flex;
                                            align-items:center;
                                            justify-content:center;
                                            font-size:25px;
                                        "
                                    >
                                        ${icon}
                                    </div>


                                    <div>

                                        <strong
                                            style="
                                                display:block;
                                                font-size:17px;
                                                margin-bottom:5px;
                                            "
                                        >
                                            ${operationName}
                                        </strong>


                                        <small
                                            style="
                                                color:#8fa0b8;
                                            "
                                        >
                                            ${
                                                transaction.service ||
                                                "-"
                                            }
                                        </small>

                                    </div>

                                </div>


                                <strong
                                    style="
                                        color:#6ea8ff;
                                        font-size:18px;
                                        white-space:nowrap;
                                    "
                                >
                                    ${formattedAmount} جنيه
                                </strong>

                            </div>


                            <div
                                style="
                                    display:grid;
                                    grid-template-columns:
                                        repeat(
                                            auto-fit,
                                            minmax(180px, 1fr)
                                        );
                                    gap:10px;
                                    color:#b8c5d8;
                                    font-size:14px;
                                "
                            >

                                <div>
                                    📱 الحساب:
                                    ${
                                        transaction.account ||
                                        "-"
                                    }
                                </div>


                                <div>
                                    🆔 الرقم:
                                    ${
                                        transaction.id ||
                                        "-"
                                    }
                                </div>


                                <div>
                                    🕒 التاريخ:
                                    ${formattedDate}
                                </div>


                                <div>
                                    ✅ الحالة:
                                    ${
                                        transaction.statusName ||
                                        "تم الحفظ"
                                    }
                                </div>

                            </div>


                            ${
                                transaction.notes
                                    ? `
                                        <div
                                            style="
                                                margin-top:12px;
                                                padding-top:12px;
                                                border-top:
                                                    1px solid #1d3048;
                                                color:#8fa0b8;
                                            "
                                        >
                                            📝 ${
                                                transaction.notes
                                            }
                                        </div>
                                    `
                                    : ""
                            }


                            <div
                                style="
                                    display:flex;
                                    gap:10px;
                                    margin-top:16px;
                                "
                            >

                                <button
                                    type="button"
                                    class="wallet-view-transaction"
                                    data-id="${transaction.id}"
                                    data-operation="${transaction.operation}"
                                    style="
                                        flex:1;
                                        padding:11px;
                                        border:1px solid #1d3048;
                                        border-radius:10px;
                                        background:#101c2d;
                                        color:#ffffff;
                                        cursor:pointer;
                                    "
                                >
                                    👁️ تفاصيل
                                </button>


                                <button
                                    type="button"
                                    class="wallet-delete-transaction"
                                    data-id="${transaction.id}"
                                    data-operation="${transaction.operation}"
                                    style="
                                        flex:1;
                                        padding:11px;
                                        border:1px solid #3a2630;
                                        border-radius:10px;
                                        background:#1b1016;
                                        color:#ff9cae;
                                        cursor:pointer;
                                    "
                                >
                                    🗑️ حذف
                                </button>

                            </div>

                        </div>

                    `;

                }
            )
            .join("");

}

// ======================================================
// 👁️ تفاصيل + 🗑️ حذف عمليات المحفظة
// ======================================================

document.addEventListener("click", function (event) {

    // ==================================================
    // 👁️ تفاصيل العملية
    // ==================================================

    const viewButton =
        event.target.closest(
            ".wallet-view-transaction"
        );

    if (viewButton) {

        event.preventDefault();
        event.stopPropagation();

        const id =
            viewButton.dataset.id || "";

        const operation =
            viewButton.dataset.operation || "";

        if (!id || !operation) {
            return;
        }

        const walletPage =
            document.getElementById(
                "wallet-section"
            );

        if (!walletPage) {
            return;
        }

        // نفس مفتاح الحفظ المستخدم في عملية المحفظة
        let userId = "guest";

        if (
            typeof currentUser !== "undefined" &&
            currentUser &&
            currentUser.uid
        ) {
            userId = currentUser.uid;
        }

        const storageKey =
            "actPhoneManager_wallet_transactions_" +
            operation +
            "_" +
            userId;

        let transactions = [];

        try {

            const saved =
                localStorage.getItem(
                    storageKey
                );

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    transactions = parsed;
                }

            }

        } catch (error) {

            console.error(
                "Wallet details load error:",
                error
            );

            return;
        }

        const transaction =
            transactions.find(
                function (item) {
                    return item.id === id;
                }
            );

        if (!transaction) {

            alert(
                "لم يتم العثور على العملية."
            );

            return;
        }

        const operationNames = {

            withdraw: "💸 عملية سحب",

            deposit: "💰 عملية إيداع",

            recharge: "📱 عملية شحن",

            bills: "🧾 عملية فواتير",

            transfer: "🔄 عملية تحويل"

        };

        const operationName =
            operationNames[
                transaction.operation
            ] || "💳 عملية محفظة";

        const amount =
            Number(
                transaction.amount || 0
            ).toLocaleString("ar-EG");

        const date =
            transaction.date
                ? new Date(
                    transaction.date
                ).toLocaleString("ar-EG")
                : "-";

        const detailsMessage =

            operationName +
            "\n\n" +

            "🆔 رقم العملية: " +
            (transaction.id || "-") +

            "\n📱 الحساب / الرقم: " +
            (transaction.account || "-") +

            "\n💰 المبلغ: " +
            amount +
            " جنيه" +

            "\n📋 الخدمة: " +
            (transaction.service || "-") +

            "\n🕒 التاريخ: " +
            date +

            "\n✅ الحالة: " +
            (transaction.statusName || "تم الحفظ") +

            "\n📝 الملاحظات: " +
            (transaction.notes || "-");

        alert(detailsMessage);

        return;
    }


    // ==================================================
    // 🗑️ حذف العملية
    // ==================================================

    const deleteButton =
        event.target.closest(
            ".wallet-delete-transaction"
        );

    if (deleteButton) {

        event.preventDefault();
        event.stopPropagation();

        const id =
            deleteButton.dataset.id || "";

        const operation =
            deleteButton.dataset.operation || "";

        if (!id || !operation) {
            return;
        }

        const confirmDelete =
            confirm(
                "⚠️ هل أنت متأكد من حذف هذه العملية؟\n\n" +
                "لن يمكن استرجاع العملية بعد حذفها."
            );

        if (!confirmDelete) {
            return;
        }

        let userId = "guest";

        if (
            typeof currentUser !== "undefined" &&
            currentUser &&
            currentUser.uid
        ) {
            userId = currentUser.uid;
        }

        const storageKey =
            "actPhoneManager_wallet_transactions_" +
            operation +
            "_" +
            userId;

        let transactions = [];

        try {

            const saved =
                localStorage.getItem(
                    storageKey
                );

            if (saved) {

                const parsed =
                    JSON.parse(saved);

                if (Array.isArray(parsed)) {
                    transactions = parsed;
                }

            }

        } catch (error) {

            console.error(
                "Wallet delete load error:",
                error
            );

            alert(
                "حدث خطأ أثناء قراءة العملية."
            );

            return;
        }

        const oldLength =
            transactions.length;

        transactions =
            transactions.filter(
                function (item) {
                    return item.id !== id;
                }
            );

        if (
            transactions.length ===
            oldLength
        ) {

            alert(
                "لم يتم العثور على العملية."
            );

            return;
        }

        try {
const value = JSON.stringify(transactions);

// الحفظ المحلي
localStorage.setItem(storageKey, value);

// الحفظ السحابي
saveUserDataToCloud(storageKey, value);

        } catch (error) {

            console.error(
                "Wallet delete save error:",
                error
            );

            alert(
                "حدث خطأ أثناء حذف العملية."
            );

            return;
        }

        // تحديث السجل فورًا
        const walletPage =
            document.getElementById(
                "wallet-section"
            );

        if (
            walletPage &&
            typeof renderWalletTransactions ===
                "function"
        ) {

            renderWalletTransactions(
                walletPage
            );

        }

        alert(
            "✅ تم حذف العملية بنجاح."
        );

    }

});

// ======================================================
// 💳 البحث في سجل عمليات المحفظة
// ======================================================

const walletTransactionsSearch =
    document.getElementById(
        "wallet-transactions-search"
    );

if (walletTransactionsSearch) {

    walletTransactionsSearch.addEventListener(
        "input",
        function () {

            const walletPage =
                document.getElementById(
                    "wallet-section"
                );

            if (!walletPage) {
                return;
            }

            renderWalletTransactions(
                walletPage
            );

        }
    );

}
// =========================================================
// ACT PHONE MANAGER
// SALES SYSTEM
// بيع جديد → سجل المبيعات → التقارير
// =========================================================

(function () {

    "use strict";


    /* =========================================================
       STORAGE
    ========================================================= */

    function getSalesStorageKey() {

        if (
            typeof currentUser !== "undefined" &&
            currentUser &&
            currentUser.uid
        ) {

            return (
                "actPhoneManager_sales_" +
                currentUser.uid
            );

        }


        return "actPhoneManager_sales_guest";

    }


    let salesData = [];


    function loadSalesData() {

        try {

            const key =
                getSalesStorageKey();


            const saved =
                localStorage.getItem(key);


            salesData =
                saved
                    ? JSON.parse(saved)
                    : [];


            if (!Array.isArray(salesData)) {

                salesData = [];

            }

        } catch (error) {

            console.error(
                "Sales load error:",
                error
            );

            salesData = [];

        }


        renderSalesHistory();

        renderSalesReports();

        updateNewSaleSummary();

    }


function saveSalesData() {

    try {

        const key = getSalesStorageKey();
        const value = JSON.stringify(salesData);

        // الحفظ المحلي
        localStorage.setItem(
            key,
            value
        );

        // الحفظ السحابي
        saveUserDataToCloud(
            key,
            value
        );

        window.dispatchEvent(new Event("act-sales-data-updated"));
        if (typeof addNotificationFromOperation === "function") {
            addNotificationFromOperation({type:"sale",icon:"🛒",title:"تم تحديث سجل المبيعات",details:"تم حفظ بيانات المبيعات بنجاح"});
        }

    } catch (error) {

        console.error(
            "Sales save error:",
            error
        );

    }

}

    // =========================================================
    // باقي نظام المبيعات يكمل بعد هذا الجزء كما هو
    // =========================================================


    /* =========================================================
       HELPERS
       ========================================================= */

    function salesNumber(value) {

        const number =
            Number(value);

        return Number.isFinite(number)
            ? number
            : 0;
    }


    function salesMoney(value) {

        const number =
            salesNumber(value);

        if (
            typeof formatMoney === "function"
        ) {
            return formatMoney(number);
        }

        return number.toLocaleString("en-US");
    }


    function salesEscape(value) {

        if (
            typeof escapeHTML === "function"
        ) {
            return escapeHTML(
                String(value ?? "")
            );
        }

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getNextInvoiceNumber() {

        let highest = 0;

        salesData.forEach(function (sale) {

            const number =
                parseInt(
                    sale.invoiceNumber,
                    10
                );

            if (
                Number.isFinite(number) &&
                number > highest
            ) {
                highest = number;
            }

        });

        return String(highest + 1)
            .padStart(3, "0");
    }


    function getPaymentName(method) {

        const names = {

            cash: "نقدي / كاش",

            card: "بطاقة",

            transfer: "تحويل",

            installment: "تقسيط",

            credit: "آجل"

        };

        return (
            names[method] ||
            method ||
            "-"
        );
    }


    function getSaleDate(sale) {

        return (
            sale.date ||
            sale.createdAt ||
            ""
        );
    }

    


    function formatSaleDate(dateValue) {

        if (!dateValue) {
            return "-";
        }

        const date =
            new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return date.toLocaleString(
            "ar-EG",
            {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    /* =========================================================
       NEW SALE CALCULATIONS
       ========================================================= */

    function ensureSalesMultiItemUI() {
        const form = document.querySelector("#sales-view-new .sales-form-grid");
        if (!form || document.getElementById("sale-add-item-button")) return;
        const firstProduct = document.getElementById("sale-product-name");
        const firstSerial = document.getElementById("sale-serial");
        const firstPrice = document.getElementById("sale-price");
        if (!firstProduct || !firstSerial || !firstPrice) return;
        const typeField = document.createElement("div");
        typeField.className = "sales-field";
        typeField.innerHTML = '<label for="sale-item-type">نوع الصنف</label><select id="sale-item-type"><option value="phone">📱 جهاز / تلفون</option><option value="accessory">🎧 إكسسوار</option><option value="other">📦 صنف آخر</option></select>';
        const qtyField = document.createElement("div");
        qtyField.className = "sales-field";
        qtyField.innerHTML = '<label for="sale-item-quantity">الكمية</label><input id="sale-item-quantity" type="number" min="1" step="1" value="1">';
        firstProduct.parentElement.before(typeField);
        firstProduct.parentElement.after(qtyField);
        const tools = document.createElement("div");
        tools.className = "sales-multi-item-tools sales-field-full";
        tools.innerHTML = '<button type="button" id="sale-add-item-button">＋ إضافة صنف آخر للفاتورة</button><span id="sale-extra-items"></span>';
        form.after(tools);
        document.getElementById("sale-add-item-button").addEventListener("click", addExtraSaleItem);
        ["sale-item-type", "sale-item-quantity"].forEach(id => document.getElementById(id)?.addEventListener("change", updateNewSaleSummary));
    }

    let saleExtraItemSequence = 0;
    function addExtraSaleItem() {
        const host = document.getElementById("sale-extra-items");
        if (!host) return;
        const id = ++saleExtraItemSequence;
        const row = document.createElement("div");
        row.className = "sale-extra-item-row";
        row.dataset.saleItemRow = String(id);
        row.innerHTML = `<div class="sales-field"><label>نوع الصنف</label><select data-item-type><option value="phone">📱 جهاز / تلفون</option><option value="accessory">🎧 إكسسوار</option><option value="other">📦 صنف آخر</option></select></div><div class="sales-field"><label>اسم المنتج</label><input data-item-name type="text" placeholder="اسم المنتج"></div><div class="sales-field"><label>السيريال / IMEI</label><input data-item-serial type="text" placeholder="السيريال (إن وجد)"></div><div class="sales-field"><label>الكمية</label><input data-item-quantity type="number" min="1" step="1" value="1"></div><div class="sales-field"><label>سعر الوحدة</label><input data-item-price type="number" min="0" step="0.01" placeholder="سعر الوحدة"></div><button type="button" class="sale-remove-item" aria-label="حذف الصنف">حذف الصنف ✕</button>`;
        host.append(row);
        row.addEventListener("input", updateNewSaleSummary);
        row.addEventListener("change", updateNewSaleSummary);
        row.querySelector(".sale-remove-item").addEventListener("click", () => { row.remove(); updateNewSaleSummary(); });
        updateNewSaleSummary();
    }

    function readNewSaleItems() {
        const first = {
            type: document.getElementById("sale-item-type")?.value || "phone",
            name: document.getElementById("sale-product-name")?.value.trim() || "",
            serial: document.getElementById("sale-serial")?.value.trim() || "",
            quantity: Math.floor(salesNumber(document.getElementById("sale-item-quantity")?.value || 1)),
            unitPrice: salesNumber(document.getElementById("sale-price")?.value || 0)
        };
        const extras = Array.from(document.querySelectorAll("#sale-extra-items [data-sale-item-row]")).map(row => ({
            type: row.querySelector("[data-item-type]")?.value || "other",
            name: row.querySelector("[data-item-name]")?.value.trim() || "",
            serial: row.querySelector("[data-item-serial]")?.value.trim() || "",
            quantity: Math.floor(salesNumber(row.querySelector("[data-item-quantity]")?.value || 1)),
            unitPrice: salesNumber(row.querySelector("[data-item-price]")?.value || 0)
        }));
        return [first, ...extras].filter(item => item.name || item.unitPrice > 0);
    }

    function getNewSaleValues() {
        const items = readNewSaleItems();
        const price = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
        const discount = salesNumber(document.getElementById("sale-discount")?.value || 0);
        const paid = salesNumber(document.getElementById("sale-paid")?.value || 0);
        const total = Math.max(0, price - discount);
        const due = Math.max(0, total - paid);
        return { price, discount, paid, total, due, items, itemCount: items.reduce((sum, item) => sum + item.quantity, 0) };
    }


    function updateNewSaleSummary() {

        const values =
            getNewSaleValues();


        const view =
            document.getElementById(
                "sales-view-new"
            );

        if (!view) {
            return;
        }


        /*
         * يدعم صندوق الحساب الموجود
         * حتى لو كانت الـ IDs الخاصة
         * بالأرقام مختلفة.
         */

        const calculationBox =
            view.querySelector(
                ".sales-calculation-box"
            );

        if (calculationBox) {

            const valuesElements =
                calculationBox.querySelectorAll(
                    "strong"
                );

            if (valuesElements[0]) {
                valuesElements[0].textContent = String(values.itemCount || 0);
            }

            if (valuesElements[1]) {
                valuesElements[1].textContent =
                    salesMoney(
                        values.total
                    ) + " جنيه";
            }

            if (valuesElements[2]) {
                valuesElements[2].textContent =
                    salesMoney(
                        values.paid
                    ) + " جنيه";
            }

            if (valuesElements[3]) {
                valuesElements[3].textContent =
                    salesMoney(
                        values.due
                    ) + " جنيه";
            }
        }


        /*
         * لو الـ HTML فيه IDs مباشرة
         * هنحدثها أيضًا.
         */

        const totalElement =
            document.getElementById(
                "sales-new-total"
            );

        const paidElement =
            document.getElementById(
                "sales-new-paid"
            );

        const dueElement =
            document.getElementById(
                "sales-new-due"
            );

        const countElement = document.getElementById("new-sale-items-count");
        if (countElement) countElement.textContent = String(values.itemCount || 0);
        const priceCalculation = document.getElementById("sale-calculation-price");
        const discountCalculation = document.getElementById("sale-calculation-discount");
        const totalCalculation = document.getElementById("sale-calculation-total");
        const dueCalculation = document.getElementById("sale-calculation-due");
        if (priceCalculation) priceCalculation.textContent = salesMoney(values.price) + " جنيه";
        if (discountCalculation) discountCalculation.textContent = salesMoney(values.discount) + " جنيه";
        if (totalCalculation) totalCalculation.textContent = salesMoney(values.total) + " جنيه";
        if (dueCalculation) dueCalculation.textContent = salesMoney(values.due) + " جنيه";
        if (totalElement) {
            totalElement.textContent = salesMoney(values.total) + " جنيه";
        }

        if (paidElement) {
            paidElement.textContent =
                salesMoney(values.paid);
        }

        if (dueElement) {
            dueElement.textContent =
                salesMoney(values.due);
        }
    }


    /* =========================================================
       RESET FORM
       ========================================================= */

    function clearNewSaleForm() {

        const ids = [

            "sale-product-name",

            "sale-serial",

            "sale-customer",

            "sale-phone",

            "sale-price",

            "sale-discount",

            "sale-paid",

            "sale-notes"

        ];


        ids.forEach(function (id) {

            const element =
                document.getElementById(id);

            if (element) {
                element.value = "";
            }

        });


        document.getElementById("sale-extra-items")?.replaceChildren();
        const itemType = document.getElementById("sale-item-type");
        if (itemType) itemType.value = "phone";
        const itemQuantity = document.getElementById("sale-item-quantity");
        if (itemQuantity) itemQuantity.value = "1";

        const paymentMethod =
            document.getElementById(
                "sale-payment-method"
            );

        if (paymentMethod) {

            paymentMethod.selectedIndex =
                0;
        }


        updateNewSaleSummary();
    }


    /* =========================================================
       SAVE NEW SALE
       ========================================================= */

    function saveNewSale() {

        const productInput =
            document.getElementById(
                "sale-product-name"
            );

        const serialInput =
            document.getElementById(
                "sale-serial"
            );

        const customerInput =
            document.getElementById(
                "sale-customer"
            );

        const phoneInput =
            document.getElementById(
                "sale-phone"
            );

        const priceInput =
            document.getElementById(
                "sale-price"
            );

        const discountInput =
            document.getElementById(
                "sale-discount"
            );

        const paidInput =
            document.getElementById(
                "sale-paid"
            );

        const paymentInput =
            document.getElementById(
                "sale-payment-method"
            );

        const notesInput =
            document.getElementById(
                "sale-notes"
            );


        if (!productInput) {

            console.error(
                "sale-product-name not found"
            );

            return;
        }


        const items = readNewSaleItems();
        const productName = items.map(item => item.name).filter(Boolean).join("، ");
        const serial = items.map(item => item.serial).filter(Boolean).join("، ");
        const customerName = customerInput ? customerInput.value.trim() : "";
        const customerPhone = phoneInput ? phoneInput.value.trim() : "";
        const paymentMethod = paymentInput ? paymentInput.value : "";
        const notes = notesInput ? notesInput.value.trim() : "";
        const values = getNewSaleValues();

        if (!items.length || items.some(item => !item.name || item.unitPrice <= 0 || item.quantity < 1)) {
            alert("أدخل اسم وسعر وكمية صحيحة لكل صنف في الفاتورة.");
            productInput?.focus();
            return;
        }
        if (items.some(item => item.type === "phone" && item.serial && item.quantity > 1)) {
            alert("لو هتبيع أكثر من جهاز من نفس النوع، اترك السيريال فارغًا أو أضف كل جهاز بسيرياله في سطر مستقل.");
            return;
        }
        if (values.discount < 0 || values.paid < 0) {
            alert("الخصم والمبلغ المدفوع لا يمكن أن يكونا أقل من صفر.");
            return;
        }
        if (values.discount > values.price) {
            alert("الخصم لا يمكن أن يكون أكبر من إجمالي أسعار الأصناف.");
            discountInput?.focus();
            return;
        }
        if (values.paid > values.total) {
            alert("المبلغ المدفوع لا يمكن أن يكون أكبر من إجمالي الفاتورة.");
            paidInput?.focus();
            return;
        }
        if (!paymentMethod) {
            alert("من فضلك اختر طريقة الدفع.");
            paymentInput?.focus();
            return;
        }

        /* =========================
           CREATE INVOICE
           ========================= */

        const now =
            new Date();

        const sale = {

            id:
                typeof createId === "function"
                    ? createId("sale")
                    : "sale_" +
                      Date.now(),

            invoiceNumber:
                getNextInvoiceNumber(),

            productName,

            serial,

            items: items.map(item => ({ ...item, returnedQuantity: 0, stockSource: item.type })),

            customerName,

            customerPhone,

            price:
                values.price,

            discount:
                values.discount,

            total:
                values.total,

            paid:
                values.paid,

            due:
                values.due,

            paymentMethod,

            notes,

            date:
                now.toISOString(),

            createdAt:
                now.toISOString()

        };


        // Capture matching records already present in Devices > Phone Sales.
        // Those records consumed their purchase stock when they were first added,
        // so selling them here must remove the listing without consuming stock twice.
        for (const item of sale.items) {
            if (item.type !== "phone" || !Array.isArray(devices)) continue;
            const wantedName = String(item.name || "").trim().toLocaleLowerCase("ar");
            const wantedSerial = String(item.serial || "").trim();
            const matching = devices.filter(record => {
                const isForSale = record.section === "sale" || record.category === SECTIONS.SALE || record.status === "البيع";
                if (!isForSale) return false;
                if (wantedSerial) return String(record.serialNumber || record.serial || "").trim() === wantedSerial;
                return String(record.phoneName || record.productName || record.name || "").trim().toLocaleLowerCase("ar") === wantedName;
            }).slice(0, item.quantity);
            if (matching.length && matching.length !== item.quantity) {
                alert(`الجهاز ${item.name} موجود في قسم الأجهزة بعدد ${matching.length} فقط. راجع الكمية أو أضف كل جهاز إلى قسم بيع الأجهزة قبل إصدار الفاتورة.`);
                return;
            }
            item.deviceRecords = matching.map(record => ({ ...record }));
        }

        // Validate and consume every linked stock item before saving the invoice.
        // A missing item is an error (not permission to create an untracked sale).
        const consumed = [];
        const rollbackConsumedStock = () => consumed.slice().reverse().forEach(entry => {
            if (entry.type === "phone") window.actPhoneInventoryRestoreSale?.(entry.name, entry.serial, entry.quantity || 1);
            if (entry.type === "accessory") window.actAccessoryRestoreSale?.(entry.name, entry.quantity || 1);
        });
        for (const item of sale.items) {
            if (item.type !== "phone" && item.type !== "accessory") continue;
            // Device cards in Devices > Sale already consumed their purchase stock.
            if (item.type === "phone" && item.deviceRecords?.length === item.quantity) continue;
            if (item.type === "phone") {
                for (let unit = 0; unit < item.quantity; unit++) {
                    const result = window.actPhoneInventoryConsumeSale
                        ? window.actPhoneInventoryConsumeSale(item.name, item.serial)
                        : { matched: false, ok: false };
                    if (!result.matched || !result.ok) {
                        rollbackConsumedStock();
                        alert(`بيانات الجهاز «${item.name}» غير موجودة أو غير متاحة في مخزون الأجهزة. أضفه أولًا إلى قسم بيع الأجهزة.`);
                        return;
                    }
                    consumed.push({ type: "phone", name: item.name, serial: item.serial, quantity: 1 });
                }
            } else {
                const result = window.actAccessoryConsumeSale
                    ? window.actAccessoryConsumeSale(item.name, item.quantity)
                    : { matched: false, ok: false };
                if (!result.matched || !result.ok) {
                    rollbackConsumedStock();
                    alert(result.matched
                        ? `الصنف «${item.name}» موجود لكن الكمية المتاحة أقل من ${item.quantity}.`
                        : `الصنف «${item.name}» غير موجود في قسم الإكسسوارات. أضفه أولًا إلى المخزون.`);
                    return;
                }
                consumed.push({ type: "accessory", name: item.name, quantity: item.quantity });
            }
        }

        sale.stockMovements = consumed;
        const soldDeviceIds = new Set(sale.items.flatMap(item => (item.deviceRecords || []).map(record => record.id)));
        if (soldDeviceIds.size && Array.isArray(devices)) {
            devices = devices.filter(record => !soldDeviceIds.has(record.id));
            persistSalesLinkedDevices();
        }
        salesData.unshift(sale);

        saveSalesData();
        if (typeof addNotificationFromOperation === "function") {
            addNotificationFromOperation({ type: "sale", icon: "🛒", title: "تم تسجيل عملية بيع جديدة", details: `فاتورة #${sale.invoiceNumber} · ${sale.items.length} صنف · ${salesMoney(sale.total)} جنيه`, createdAt: sale.date });
        }
        if (customerName && customerPhone && typeof window.actCustomerUpsertFromSale === "function") {
            window.actCustomerUpsertFromSale({ name: customerName, phone: customerPhone });
        }


        /* =========================
           UPDATE EVERYTHING
           ========================= */

        renderSalesHistory();

        renderSalesReports();

        updateNewSaleSummary();


        alert(
            "تم حفظ الفاتورة رقم #" +
            sale.invoiceNumber +
            " بنجاح."
        );


        clearNewSaleForm();


        /*
         * الانتقال تلقائيًا إلى سجل المبيعات
         */

        const historyCard =
            document.querySelector(
                '.independent-sales-card[data-sales-view="history"]'
            );

        if (historyCard) {

            historyCard.click();

        }

    }


    /* =========================================================
       HISTORY FILTERS
       ========================================================= */

    function getFilteredSales() {

        let result =
            salesData.slice();


        const searchInput =
            document.getElementById(
                "sales-history-search"
            );

        const paymentFilter =
            document.getElementById(
                "sales-history-payment-filter"
            );

        const dateFilter =
            document.getElementById(
                "sales-history-date-filter"
            );


        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const payment =
            paymentFilter
                ? paymentFilter.value
                : "all";


        const date =
            dateFilter
                ? dateFilter.value
                : "all";


        /* =========================
           SEARCH
           ========================= */

        if (search) {

            result =
                result.filter(
                    function (sale) {

                        const text =
                            [
                                sale.invoiceNumber,
                                sale.productName,
                                sale.serial,
                                sale.customerName,
                                sale.customerPhone
                            ]
                            .join(" ")
                            .toLowerCase();

                        return text.includes(
                            search
                        );
                    }
                );
        }


        /* =========================
           PAYMENT
           ========================= */

        if (
            payment &&
            payment !== "all"
        ) {

            result =
                result.filter(
                    function (sale) {

                        return (
                            sale.paymentMethod ===
                            payment
                        );

                    }
                );
        }


        /* =========================
           DATE
           ========================= */

        if (
            date &&
            date !== "all"
        ) {

            const now =
                new Date();


            result =
                result.filter(
                    function (sale) {

                        const saleDate =
                            new Date(
                                getSaleDate(
                                    sale
                                )
                            );

                        if (
                            Number.isNaN(
                                saleDate.getTime()
                            )
                        ) {
                            return false;
                        }


                        if (
                            date === "today"
                        ) {

                            return (
                                saleDate
                                    .getFullYear() ===
                                    now.getFullYear() &&

                                saleDate
                                    .getMonth() ===
                                    now.getMonth() &&

                                saleDate
                                    .getDate() ===
                                    now.getDate()
                            );
                        }


                        if (
                            date === "week" ||
                            date === "7days"
                        ) {

                            const sevenDays =
                                7 *
                                24 *
                                60 *
                                60 *
                                1000;

                            return (
                                now -
                                saleDate <=
                                sevenDays &&
                                saleDate <=
                                now
                            );
                        }


                        if (
                            date === "month"
                        ) {

                            return (
                                saleDate
                                    .getFullYear() ===
                                    now.getFullYear() &&

                                saleDate
                                    .getMonth() ===
                                    now.getMonth()
                            );
                        }


                        return true;

                    }
                );
        }


        return result;
    }


    /* =========================================================
       HISTORY SUMMARY
       ========================================================= */

    function updateHistorySummary(
        visibleSales
    ) {

        const count =
            visibleSales.length;


        const total =
            visibleSales.reduce(
                function (sum, sale) {
                    return (
                        sum +
                        salesNumber(
                            sale.total
                        )
                    );
                },
                0
            );


        const paid =
            visibleSales.reduce(
                function (sum, sale) {
                    return (
                        sum +
                        salesNumber(
                            sale.paid
                        )
                    );
                },
                0
            );


        const due =
            visibleSales.reduce(
                function (sum, sale) {
                    return (
                        sum +
                        salesNumber(
                            sale.due
                        )
                    );
                },
                0
            );


        const countElement =
            document.getElementById(
                "sales-history-count"
            );

        const totalElement =
            document.getElementById(
                "sales-history-total"
            );

        const paidElement =
            document.getElementById(
                "sales-history-paid"
            );

        const dueElement =
            document.getElementById(
                "sales-history-due"
            );


        if (countElement) {
            countElement.textContent =
                count;
        }

        if (totalElement) {
            totalElement.textContent =
                salesMoney(total);
        }

        if (paidElement) {
            paidElement.textContent =
                salesMoney(paid);
        }

        if (dueElement) {
            dueElement.textContent =
                salesMoney(due);
        }
    }


    /* =========================================================
       RENDER SALES HISTORY
       ========================================================= */

    function renderSalesHistory() {

        const list =
            document.getElementById(
                "sales-history-list"
            );

        if (!list) {
            return;
        }


        const visibleSales =
            getFilteredSales();


        updateHistorySummary(
            visibleSales
        );


        if (
            visibleSales.length === 0
        ) {

            list.innerHTML = `
                <tr>
                    <td colspan="10">
                        <div class="sales-empty-state">
                            📋 لا توجد مبيعات حتى الآن
                        </div>
                    </td>
                </tr>
            `;

            return;
        }


        list.innerHTML =
            visibleSales
                .map(
                    function (sale) {

                        return `
                            <tr>

                                <td>
                                    <strong>
                                        #${salesEscape(
                                            sale.invoiceNumber
                                        )}
                                    </strong>
                                </td>

                                <td>
                                    ${Array.isArray(sale.items) && sale.items.length
                                        ? sale.items.map(item => `${salesEscape(item.name)} × ${salesEscape(item.quantity || 1)}`).join("<br>")
                                        : salesEscape(sale.productName)}

                                    ${
                                        sale.serial
                                            ? `
                                                <br>
                                                <small>
                                                    سريل:
                                                    ${salesEscape(
                                                        sale.serial
                                                    )}
                                                </small>
                                              `
                                            : ""
                                    }
                                </td>

                                <td>
                                    ${salesEscape(
                                        sale.customerName ||
                                        "-"
                                    )}

                                    ${
                                        sale.customerPhone
                                            ? `
                                                <br>
                                                <small>
                                                    ${salesEscape(
                                                        sale.customerPhone
                                                    )}
                                                </small>
                                              `
                                            : ""
                                    }
                                </td>

                                <td>
                                    ${salesMoney(
                                        sale.price
                                    )}
                                </td>

                                <td>
                                    ${salesMoney(
                                        sale.discount
                                    )}
                                </td>

                                <td>
                                    ${salesMoney(
                                        sale.paid
                                    )}
                                </td>

                                <td>
                                    ${salesMoney(
                                        sale.due
                                    )}
                                </td>

                                <td>
                                    ${salesEscape(
                                        getPaymentName(
                                            sale.paymentMethod
                                        )
                                    )}
                                </td>

                                <td>
                                    ${salesEscape(
                                        formatSaleDate(
                                            getSaleDate(
                                                sale
                                            )
                                        )
                                    )}
                                </td>

                                <td>

                                    <button
                                        type="button"
                                        class="sales-print-button"
                                        data-print-sale="${salesEscape(
                                            sale.id
                                        )}"
                                    >
                                        🖨️
                                    </button>

                                    <button type="button" class="sales-print-button sales-edit-button" data-edit-sale="${salesEscape(sale.id)}">✏️ تعديل</button>
                                    <button type="button" class="sales-return-button" data-return-sale="${salesEscape(sale.id)}">↩️ مرتجع</button>
                                    <button
                                        type="button"
                                        class="sales-delete-button"
                                        data-delete-sale="${salesEscape(
                                            sale.id
                                        )}"
                                    >
                                        🗑️
                                    </button>

                                </td>

                            </tr>
                        `;

                    }
                )
                .join("");


        attachHistoryActions();
    }


    /* =========================================================
       HISTORY ACTIONS
       ========================================================= */

    function attachHistoryActions() {

        document
            .querySelectorAll(
                "[data-print-sale]"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            printSaleInvoice(
                                button.getAttribute(
                                    "data-print-sale"
                                )
                            );

                        };

                }
            );


        document.querySelectorAll("[data-edit-sale]").forEach(button => {
            button.onclick = () => editExistingSale(button.getAttribute("data-edit-sale"));
        });

        document.querySelectorAll("[data-return-sale]").forEach(button => {
            button.onclick = () => returnSaleItem(button.getAttribute("data-return-sale"));
        });

        document
            .querySelectorAll(
                "[data-delete-sale]"
            )
            .forEach(
                function (button) {

                    button.onclick =
                        function () {

                            deleteSale(
                                button.getAttribute(
                                    "data-delete-sale"
                                )
                            );

                        };

                }
            );
    }


    /* =========================================================
       EDIT EXISTING INVOICE — append additional items safely
       ========================================================= */
    function editExistingSale(id) {
        const sale = salesData.find(item => String(item.id) === String(id));
        if (!sale) return;
        const name = prompt("اسم المنتج أو الصنف الإضافي:");
        if (name === null) return;
        if (!name.trim()) { alert("اكتب اسم المنتج أولاً."); return; }
        const quantity = Number(prompt("الكمية:", "1"));
        if (!Number.isInteger(quantity) || quantity < 1) { alert("الكمية يجب أن تكون رقمًا صحيحًا أكبر من صفر."); return; }
        const unitPrice = Number(prompt("سعر القطعة الواحدة بالجنيه:", "0"));
        if (!Number.isFinite(unitPrice) || unitPrice < 0) { alert("السعر غير صحيح."); return; }
        const typeChoice = prompt("نوع الصنف: اكتب 1 لجهاز، 2 لإكسسوار، 3 لصنف آخر:", "3");
        if (typeChoice === null) return;
        const itemType = typeChoice === "1" ? "phone" : typeChoice === "2" ? "accessory" : "other";
        if (!["1", "2", "3"].includes(typeChoice)) { alert("اختيار نوع الصنف غير صحيح."); return; }

        // خصم الكمية من المخزون إذا كان الصنف مربوطًا بمخزون الأجهزة أو الإكسسوارات.
        let trackedStock = false;
        let consumedUnits = 0;
        if (itemType === "accessory" && window.actAccessoryConsumeSale) {
            const stock = window.actAccessoryConsumeSale(name.trim(), quantity);
            if (!stock?.matched || !stock.ok) { alert(stock?.matched ? "الكمية غير متاحة في مخزون الإكسسوارات." : `الصنف «${name.trim()}» غير موجود في قسم الإكسسوارات.`); return; }
            trackedStock = true;
            consumedUnits = trackedStock ? quantity : 0;
        } else if (itemType === "phone" && window.actPhoneInventoryConsumeSale) {
            for (let unit = 0; unit < quantity; unit++) {
                const stock = window.actPhoneInventoryConsumeSale(name.trim(), "");
                if (!stock?.matched || !stock.ok) {
                    if (consumedUnits) window.actPhoneInventoryRestoreSale?.(name.trim(), "", consumedUnits);
                    alert(`الجهاز «${name.trim()}» غير موجود أو الكمية غير متاحة في قسم بيع الأجهزة؛ تم التراجع عن الخصم الجزئي.`);
                    return;
                }
                trackedStock = true; consumedUnits++;
            }
        }

        if (!Array.isArray(sale.items)) {
            sale.items = [{ type: "other", name: sale.productName || "الصنف السابق", quantity: 1, unitPrice: Number(sale.price || sale.total || 0), returnedQuantity: Number(sale.returnedQuantity || 0) }];
        }
        sale.items.push({ type: itemType, name: name.trim(), quantity, unitPrice, returnedQuantity: 0, addedAfterInvoice: true });
        if (trackedStock) {
            sale.stockMovements = Array.isArray(sale.stockMovements) ? sale.stockMovements : [];
            sale.stockMovements.push({ type: itemType, name: name.trim(), serial: "", quantity: consumedUnits, editedInvoice: true });
        }
        const subtotal = sale.items.reduce((sum, item) => sum + Math.max(0, Number(item.unitPrice ?? item.price ?? 0)) * Math.max(0, Number(item.quantity || 1)), 0);
        sale.price = subtotal;
        sale.total = Math.max(0, subtotal - Number(sale.discount || 0));
        sale.due = Math.max(0, sale.total - Number(sale.paid || 0));
        sale.productName = sale.items.map(item => item.name).filter(Boolean).join("، ");
        sale.updatedAt = new Date().toISOString();
        sale.editHistory = Array.isArray(sale.editHistory) ? sale.editHistory : [];
        sale.editHistory.unshift({ action: "إضافة صنف للفاتورة", item: name.trim(), quantity, unitPrice, date: sale.updatedAt });
        saveSalesData();
        renderSalesHistory();
        renderSalesReports();
        if (typeof addNotificationFromOperation === "function") addNotificationFromOperation({ type: "sale-edit", icon: "🧾", title: "تم تعديل فاتورة مبيعات", details: `فاتورة #${sale.invoiceNumber} · إضافة ${name.trim()} × ${quantity}` });
        alert(`تمت إضافة ${name.trim()} × ${quantity} إلى الفاتورة #${sale.invoiceNumber}.`);
    }

    /* =========================================================
       DELETE SALE
       ========================================================= */

    function persistSalesLinkedDevices() {
        try {
            if (!Array.isArray(devices)) return false;
            const key = getUserKey("devices");
            const value = JSON.stringify(devices);
            localStorage.setItem(key, value);
            if (typeof saveUserDataToCloud === "function") saveUserDataToCloud(key, value);
            window.dispatchEvent(new Event("act-devices-data-updated"));
            if (typeof renderSaleDevices === "function") renderSaleDevices();
            return true;
        } catch (error) {
            console.error("Sales linked device inventory save failed:", error);
            return false;
        }
    }

    function restoreSaleDeviceRecords(item, quantity, offset = 0) {
        if (!Array.isArray(devices) || !Array.isArray(item.deviceRecords)) return;
        item.returnedDeviceRecordIds = Array.isArray(item.returnedDeviceRecordIds) ? item.returnedDeviceRecordIds : [];
        const eligible = item.deviceRecords.filter(record => !item.returnedDeviceRecordIds.includes(record.id)).slice(0, Math.max(0, quantity));
        eligible.forEach(record => {
            if (!devices.some(existing => existing.id === record.id)) devices.unshift({ ...record });
            item.returnedDeviceRecordIds.push(record.id);
        });
        if (eligible.length) persistSalesLinkedDevices();
    }

    function applySalesReturn(saleId, itemIndex, quantity, working = true) {
        const sale = salesData.find(item => item.id === saleId || String(item.invoiceNumber) === String(saleId));
        if (!sale) return false;
        if (!Array.isArray(sale.items) || !sale.items.length) {
            sale.items = [{ type: "phone", name: sale.productName, serial: sale.serial, quantity: 1, returnedQuantity: Number(sale.returnedQuantity || 0) }];
        }
        const item = sale.items[Number(itemIndex)];
        if (!item) return false;
        const remaining = Math.max(0, Number(item.quantity || 1) - Number(item.returnedQuantity || 0));
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > remaining) return false;
        const wasTracked = Array.isArray(sale.stockMovements) && sale.stockMovements.some(m => m.type === item.type && String(m.name || "") === String(item.name || "") && (item.type !== "phone" || !item.serial || !m.serial || String(m.serial) === String(item.serial)));
        if (working && wasTracked && item.type === "phone") {
            const restored = window.actPhoneInventoryRestoreSale?.(item.name, item.serial, quantity);
            if (!restored || !restored.ok) return false;
        }
        if (working && wasTracked && item.type === "accessory") {
            const restored = window.actAccessoryRestoreSale?.(item.name, quantity);
            if (!restored || !restored.ok) return false;
        }
        if (working && item.type === "phone") restoreSaleDeviceRecords(item, quantity);
        item.returnedQuantity = Number(item.returnedQuantity || 0) + quantity;
        if (sale.items.length === 1) sale.returnedQuantity = item.returnedQuantity;
        sale.returned = sale.items.every(x => Number(x.returnedQuantity || 0) >= Number(x.quantity || 1));
        sale.returnHistory = Array.isArray(sale.returnHistory) ? sale.returnHistory : [];
        sale.returnHistory.unshift({ itemName: item.name, serial: item.serial || "", quantity, working: !!working, date: new Date().toISOString() });
        saveSalesData(); renderSalesHistory(); renderSalesReports();
        if (typeof addNotificationFromOperation === "function") addNotificationFromOperation({ type: "return", icon: "↩️", title: working ? "تم تسجيل مرتجع صالح للمخزون" : "تم تسجيل مرتجع غير صالح للبيع", details: `${item.name} · ${quantity} قطعة · فاتورة #${sale.invoiceNumber}` });
        return true;
    }

    function returnSaleItem(id) {
        const sale = salesData.find(item => item.id === id);
        if (!sale) return;
        const items = Array.isArray(sale.items) && sale.items.length ? sale.items : [{ name: sale.productName, quantity: 1, returnedQuantity: sale.returnedQuantity || 0 }];
        const available = items.map((item, index) => ({ item, index, remaining: Math.max(0, Number(item.quantity || 1) - Number(item.returnedQuantity || 0)) })).filter(x => x.remaining > 0);
        if (!available.length) { alert("تم إرجاع جميع أصناف هذه الفاتورة بالفعل."); return; }
        let selected = available[0];
        if (available.length > 1) {
            const choice = prompt("اكتب رقم الصنف المراد إرجاعه:\n" + available.map(x => `${x.index + 1}) ${x.item.name} — متبقي للإرجاع: ${x.remaining}`).join("\n"), "1");
            if (choice === null) return;
            selected = available.find(x => x.index + 1 === Number(choice));
            if (!selected) { alert("رقم الصنف غير صحيح."); return; }
        }
        const quantityText = prompt(`كم قطعة تريد إرجاعها من ${selected.item.name}؟ (المتاح للإرجاع ${selected.remaining})`, "1");
        if (quantityText === null) return;
        const quantity = Number(quantityText);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > selected.remaining) { alert("الكمية غير صحيحة."); return; }
        const working = confirm("هل الصنف المرتجع شغال وصالح للبيع؟\nموافق: يرجع إلى مخزونه الأصلي.\nإلغاء: يسجل كمرتجع غير صالح للبيع ولا يعود للمخزون.");
        if (!applySalesReturn(sale.id, selected.index, quantity, working)) { alert("تعذر تسجيل المرتجع. راجع المخزون والكمية المتاحة."); return; }
        window.actPhoneManagerReturns?.recordLinkedReturn?.({ saleId: sale.id, invoiceNumber: sale.invoiceNumber, itemIndex: selected.index, itemName: selected.item.name, quantity, working, customer: sale.customerName || "", price: Number(selected.item.unitPrice || 0) * quantity });
        alert(working ? "تم تسجيل المرتجع وإعادة الصنف إلى مخزونه الأصلي." : "تم تسجيل المرتجع كصنف غير صالح للبيع ولم تتم إضافته للمخزون.");
    }

    function deleteSale(id) {

        const sale =
            salesData.find(
                function (item) {
                    return item.id === id;
                }
            );


        if (!sale) {
            return;
        }


        const confirmed =
            confirm(
                "هل أنت متأكد من حذف الفاتورة رقم #" +
                sale.invoiceNumber +
                "؟"
            );


        if (!confirmed) {
            return;
        }
        const deleteItems = Array.isArray(sale.items) && sale.items.length ? sale.items : [{ type: "phone", name: sale.productName, serial: sale.serial, quantity: 1, returnedQuantity: sale.returnedQuantity || 0 }];
        deleteItems.forEach(item => {
            const remaining = Math.max(0, Number(item.quantity || 1) - Number(item.returnedQuantity || 0));
            const wasTracked = Array.isArray(sale.stockMovements) && sale.stockMovements.some(m => m.type === item.type && String(m.name || "") === String(item.name || ""));
            if (remaining && wasTracked && item.type === "phone") window.actPhoneInventoryRestoreSale?.(item.name, item.serial, remaining);
            if (remaining && wasTracked && item.type === "accessory") window.actAccessoryRestoreSale?.(item.name, remaining);
            if (remaining && item.type === "phone") restoreSaleDeviceRecords(item, remaining);
        });

        salesData =
            salesData.filter(
                function (item) {
                    return item.id !== id;
                }
            );


        saveSalesData();

        renderSalesHistory();

        renderSalesReports();

    }


    /* =========================================================
       REPORTS
       ========================================================= */

    function getTodaySales() {

        const now =
            new Date();

        return salesData.filter(
            function (sale) {

                const date =
                    new Date(
                        getSaleDate(
                            sale
                        )
                    );

                if (
                    Number.isNaN(
                        date.getTime()
                    )
                ) {
                    return false;
                }

                return (
                    date.getFullYear() ===
                    now.getFullYear() &&

                    date.getMonth() ===
                    now.getMonth() &&

                    date.getDate() ===
                    now.getDate()
                );
            }
        );
    }


    function getMonthSales() {

        const now =
            new Date();

        return salesData.filter(
            function (sale) {

                const date =
                    new Date(
                        getSaleDate(
                            sale
                        )
                    );

                if (
                    Number.isNaN(
                        date.getTime()
                    )
                ) {
                    return false;
                }

                return (
                    date.getFullYear() ===
                    now.getFullYear() &&

                    date.getMonth() ===
                    now.getMonth()
                );
            }
        );
    }


    function sumSales(
        list,
        property
    ) {

        return list.reduce(
            function (sum, sale) {

                return (
                    sum +
                    salesNumber(
                        sale[property]
                    )
                );

            },
            0
        );
    }


    function setReportValue(
        id,
        value
    ) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.textContent =
            value;
    }


    function renderSalesReports() {

        const todaySales =
            getTodaySales();

        const monthSales =
            getMonthSales();


        const todayTotal =
            sumSales(
                todaySales,
                "total"
            );


        const monthTotal =
            sumSales(
                monthSales,
                "total"
            );


        const allPaid =
            sumSales(
                salesData,
                "paid"
            );


        const allDue =
            sumSales(
                salesData,
                "due"
            );


        const allDiscounts =
            sumSales(
                salesData,
                "discount"
            );


        /* =========================
           REPORT CARDS
           ========================= */

        setReportValue(
            "sales-report-today",
            salesMoney(todayTotal)
        );


        setReportValue(
            "sales-report-month",
            salesMoney(monthTotal)
        );


        setReportValue(
            "sales-report-paid",
            salesMoney(allPaid)
        );


        setReportValue(
            "sales-report-due",
            salesMoney(allDue)
        );


        setReportValue(
            "sales-report-discounts",
            salesMoney(allDiscounts)
        );


        setReportValue(
            "sales-report-count",
            salesData.length
        );


        /* =========================
           TOP PRODUCTS
           ========================= */

        renderTopProducts();


        /* =========================
           PAYMENT STATISTICS
           ========================= */

        renderPaymentStatistics();

    }


    /* =========================================================
       TOP PRODUCTS
       ========================================================= */

    function renderTopProducts() {

        const container =
            document.getElementById(
                "sales-top-products"
            );

        if (!container) {
            return;
        }


        if (!salesData.length) {

            container.innerHTML = `
                <div class="sales-empty-state">
                    📦 لا توجد بيانات مبيعات
                </div>
            `;

            return;
        }


        const products = {};


        salesData.forEach(
            function (sale) {

                const name =
                    sale.productName ||
                    "غير محدد";

                if (!products[name]) {

                    products[name] = {
                        count: 0,
                        total: 0
                    };

                }

                products[name].count++;

                products[name].total +=
                    salesNumber(
                        sale.total
                    );

            }
        );


        const sorted =
            Object.entries(products)
                .sort(
                    function (a, b) {

                        return (
                            b[1].count -
                            a[1].count
                        );

                    }
                )
                .slice(0, 10);


        container.innerHTML =
            sorted
                .map(
                    function (entry) {

                        const name =
                            entry[0];

                        const data =
                            entry[1];

                        return `
                            <div class="sales-report-row">

                                <span>
                                    ${salesEscape(
                                        name
                                    )}
                                </span>

                                <strong>
                                    ${data.count}
                                    عملية
                                    —
                                    ${salesMoney(
                                        data.total
                                    )}
                                    جنيه
                                </strong>

                            </div>
                        `;

                    }
                )
                .join("");

    }


    /* =========================================================
       PAYMENT STATISTICS
       ========================================================= */

    function renderPaymentStatistics() {

        const container =
            document.getElementById(
                "sales-payment-statistics"
            );

        if (!container) {
            return;
        }


        if (!salesData.length) {

            container.innerHTML = `
                <div class="sales-empty-state">
                    💳 لا توجد بيانات دفع
                </div>
            `;

            return;
        }


        const payments = {};


        salesData.forEach(
            function (sale) {

                const method =
                    sale.paymentMethod ||
                    "unknown";


                if (!payments[method]) {

                    payments[method] = {
                        count: 0,
                        total: 0
                    };

                }


                payments[method].count++;

                payments[method].total +=
                    salesNumber(
                        sale.total
                    );

            }
        );


        container.innerHTML =
            Object.entries(payments)
                .map(
                    function (entry) {

                        const method =
                            entry[0];

                        const data =
                            entry[1];

                        return `
                            <div class="sales-report-row">

                                <span>
                                    ${salesEscape(
                                        getPaymentName(
                                            method
                                        )
                                    )}
                                </span>

                                <strong>
                                    ${data.count}
                                    عملية
                                    —
                                    ${salesMoney(
                                        data.total
                                    )}
                                    جنيه
                                </strong>

                            </div>
                        `;

                    }
                )
                .join("");

    }

    /* ========================================================= 
       PRINT SINGLE INVOICE 
       ========================================================= */ 
 
    function printSaleInvoice(id) { 
 
        const sale = 
            salesData.find( 
                function (item) { 
                    return item.id === id; 
                } 
            ); 
 
 
        if (!sale) { 
            return; 
        } 
 
 
        const printWindow = 
            window.open( 
                "", 
                "_blank", 
                "width=800,height=900" 
            ); 
 
 
        if (!printWindow) { 
 
            alert( 
                "المتصفح منع نافذة الطباعة. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى." 
            ); 
 
            return; 
        } 
 
 
        printWindow.document.write(` 
 
            <!DOCTYPE html> 
 
            <html lang="ar" dir="rtl"> 
 
            <head> 
 
                <meta charset="UTF-8"> 
 
                <title> 
                    فاتورة #${salesEscape( 
                        sale.invoiceNumber 
                    )} 
                </title> 
 
                <style> 
 
                    body { 
                        font-family: 
                            Arial, 
                            Tahoma, 
                            sans-serif; 
 
                        padding: 30px; 
 
                        color: #111; 
                    } 
 
                    .invoice { 
                        max-width: 700px; 
                        margin: auto; 
                    } 
 
                    h1 { 
                        text-align: center; 
                        margin-bottom: 5px; 
                    } 
 
                    .subtitle { 
                        text-align: center; 
                        margin-bottom: 30px; 
                    } 
 
                    .line { 
                        display: flex; 
                        justify-content: space-between; 
                        padding: 10px 0; 
                        border-bottom: 1px solid #ddd; 
                    } 
 
                    .total { 
                        font-size: 22px; 
                        font-weight: bold; 
                    } 
 
                    .footer { 
                        margin-top: 40px; 
                        text-align: center; 
                    } 
 
                
/* auto light layer */
</style> 
 
            </head> 
 
            <body> 
 
                <div class="invoice"> 
 
                    <h1> 
                        ACT PHONE MANAGER 
                    </h1> 
 
                    <div class="subtitle"> 
                        فاتورة بيع رقم 
                        #${salesEscape( 
                            sale.invoiceNumber 
                        )} 
                    </div> 
 
                    ${Array.isArray(sale.items) && sale.items.length ? `
                        <h3>الأصناف</h3>
                        <table style="width:100%;border-collapse:collapse;margin:12px 0"><thead><tr><th style="text-align:right;border-bottom:1px solid #ccc;padding:8px">الصنف</th><th style="border-bottom:1px solid #ccc;padding:8px">السيريال</th><th style="border-bottom:1px solid #ccc;padding:8px">الكمية</th><th style="border-bottom:1px solid #ccc;padding:8px">سعر الوحدة</th><th style="border-bottom:1px solid #ccc;padding:8px">الإجمالي</th></tr></thead><tbody>${sale.items.map(item => `<tr><td style="border-bottom:1px solid #eee;padding:8px">${salesEscape(item.name)}</td><td style="border-bottom:1px solid #eee;padding:8px">${salesEscape(item.serial || "—")}</td><td style="border-bottom:1px solid #eee;padding:8px;text-align:center">${salesEscape(item.quantity || 1)}</td><td style="border-bottom:1px solid #eee;padding:8px;text-align:center">${salesMoney(item.unitPrice)} ج.م</td><td style="border-bottom:1px solid #eee;padding:8px;text-align:center">${salesMoney(Number(item.unitPrice || 0) * Number(item.quantity || 1))} ج.م</td></tr>`).join("")}</tbody></table>
                    ` : `<div class="line"><span>المنتج</span><strong>${salesEscape(sale.productName)}</strong></div>`}
 
                    ${ 
                        sale.serial 
                            ? ` 
                                <div class="line"> 
                                    <span>السريل</span> 
                                    <strong> 
                                        ${salesEscape( 
                                            sale.serial 
                                        )} 
                                    </strong> 
                                </div> 
                              ` 
                            : "" 
                    } 
 
                    <div class="line"> 
                        <span>العميل</span> 
                        <strong> 
                            ${salesEscape( 
                                sale.customerName || 
                                "-" 
                            )} 
                        </strong> 
                    </div> 
 
                    ${ 
                        sale.customerPhone 
                            ? ` 
                                <div class="line"> 
                                    <span>الهاتف</span> 
                                    <strong> 
                                        ${salesEscape( 
                                            sale.customerPhone 
                                        )} 
                                    </strong> 
                                </div> 
                              ` 
                            : "" 
                    } 
 
                    <div class="line"> 
                        <span>السعر</span> 
                        <strong> 
                            ${salesMoney( 
                                sale.price 
                            )} 
                            جنيه 
                        </strong> 
                    </div> 
 
                    <div class="line"> 
                        <span>الخصم</span> 
                        <strong> 
                            ${salesMoney( 
                                sale.discount 
                            )} 
                            جنيه 
                        </strong> 
                    </div> 
 
                    <div class="line total"> 
                        <span>الإجمالي</span> 
                        <strong> 
                            ${salesMoney( 
                                sale.total 
                            )} 
                            جنيه 
                        </strong> 
                    </div> 
 
                    <div class="line"> 
                        <span>المدفوع</span> 
                        <strong> 
                            ${salesMoney( 
                                sale.paid 
                            )} 
                            جنيه 
                        </strong> 
                    </div> 
 
                    <div class="line"> 
                        <span>المتبقي</span> 
                        <strong> 
                            ${salesMoney( 
                                sale.due 
                            )} 
                            جنيه 
                        </strong> 
                    </div> 
 
                    <div class="line"> 
                        <span>طريقة الدفع</span> 
                        <strong> 
                            ${salesEscape( 
                                getPaymentName( 
                                    sale.paymentMethod 
                                ) 
                            )} 
                        </strong> 
                    </div> 
 
                    <div class="line"> 
                        <span>التاريخ</span> 
                        <strong> 
                            ${salesEscape( 
                                formatSaleDate( 
                                    getSaleDate( 
                                        sale 
                                    ) 
                                ) 
                            )} 
                        </strong> 
                    </div> 
 
                    ${ 
                        sale.notes 
                            ? ` 
                                <div class="line"> 
                                    <span>ملاحظات</span> 
                                    <strong> 
                                        ${salesEscape( 
                                            sale.notes 
                                        )} 
                                    </strong> 
                                </div> 
                              ` 
                            : "" 
                    } 
 
                    <div class="footer"> 
                        شكرًا لتعاملكم معنا 
                    </div> 
 
                </div> 
 
                <script> 
 
                    window.onload = function () { 
                        window.print(); 
                    }; 
 
                <\/script> 
 
            </body> 
 
            </html> 
 
        `); 
 
 
        printWindow.document.close(); 
 
    } 
 
 
    /* ========================================================= 
       PRINT SALES HISTORY 
       ========================================================= */ 
 
    function printSalesHistory() { 
 
        const visibleSales = 
            getFilteredSales(); 
 
 
        const printWindow = 
            window.open( 
                "", 
                "_blank", 
                "width=1200,height=900" 
            ); 
 
 
        if (!printWindow) { 
 
            alert( 
                "المتصفح منع نافذة الطباعة." 
            ); 
 
            return; 
        } 
 
        let rows = ""; 
 
 
        visibleSales.forEach( 
            function (sale) { 
 
                rows += ` 
 
                    <tr> 
 
                        <td> 
                            #${salesEscape( 
                                sale.invoiceNumber 
                            )} 
                        </td> 
 
                        <td> 
                            ${salesEscape( 
                                sale.productName 
                            )} 
                        </td> 
 
                        <td> 
                            ${salesEscape( 
                                sale.customerName || 
                                "-" 
                            )} 
                        </td> 
 
                        <td> 
                            ${salesMoney( 
                                sale.total 
                            )} 
                        </td> 
 
                        <td> 
                            ${salesMoney( 
                                sale.paid 
                            )} 
                        </td> 
 
                        <td> 
                            ${salesMoney( 
                                sale.due 
                            )} 
                        </td> 
 
                        <td> 
                            ${salesEscape( 
                                getPaymentName( 
                                    sale.paymentMethod 
                                ) 
                            )} 
                        </td> 
 
                    </tr> 
 
                `; 
 
            } 
        ); 
 
 
        printWindow.document.write(` 
 
            <!DOCTYPE html> 
 
            <html lang="ar" dir="rtl"> 
 
            <head> 
 
                <meta charset="UTF-8"> 
 
                <title> 
                    سجل المبيعات 
                </title> 
 
                <style> 
 
                    body { 
                        font-family: 
                            Arial, 
                            Tahoma, 
                            sans-serif; 
 
                        padding: 30px; 
                    } 
 
                    h1 { 
                        text-align: center; 
                    } 
 
                    table { 
                        width: 100%; 
                        border-collapse: collapse; 
                        margin-top: 25px; 
                    } 
 
                    th, 
                    td { 
                        border: 1px solid #ccc; 
                        padding: 10px; 
                        text-align: center; 
                    } 
 
                    th { 
                        font-weight: bold; 
                    } 
 
                
/* auto light layer */
</style> 
 
            </head> 
 
            <body> 
 
                <h1> 
                    ACT PHONE MANAGER 
                </h1> 
 
                <h2> 
                    📋 سجل المبيعات 
                </h2> 
 
                <table> 
 
                    <thead> 
 
                        <tr> 
 
                            <th>الفاتورة</th> 
                            <th>المنتج</th> 
                            <th>العميل</th> 
                            <th>الإجمالي</th> 
                            <th>المدفوع</th> 
                            <th>المتبقي</th> 
                            <th>طريقة الدفع</th> 
 
                        </tr> 
 
                    </thead> 
 
                    <tbody> 
 
                        ${rows} 
 
                    </tbody> 
 
                </table> 
 
                <script> 
 
                    window.onload = function () { 
                        window.print(); 
                    }; 
 
                <\/script> 
 
            </body> 
 
            </html> 
 
        `); 
 
 
        printWindow.document.close(); 
 
    } 
 
 
    /* ========================================================= 
       EVENTS 
       ========================================================= */ 
 
    function initSalesEvents() { 
 
        const saveButton = 
            document.getElementById( 
                "save-new-sale-button" 
            ); 
 
        const clearButton = 
            document.getElementById( 
                "clear-new-sale-button" 
            ); 
 
        const printHistoryButton = 
            document.querySelector( 
                "#sales-view-history .sales-print-button" 
            ); 
 
 
        if (saveButton) { 
 
            saveButton.addEventListener( 
                "click", 
                saveNewSale 
            ); 
 
        } 
 
 
        if (clearButton) { 
 
            clearButton.addEventListener( 
                "click", 
                clearNewSaleForm 
            ); 
 
        } 
 
 
        if (printHistoryButton) { 
 
            printHistoryButton.addEventListener( 
                "click", 
                printSalesHistory 
            ); 
 
        } 
 
 
        const calculationInputs = [ 
 
            "sale-price", 
 
            "sale-discount", 
 
            "sale-paid" 
 
        ]; 
 
 
        calculationInputs.forEach( 
            function (id) { 
 
                const input = 
                    document.getElementById( 
                        id 
                    ); 
 
                if (!input) { 
                    return; 
                } 
 
 
                input.addEventListener( 
                    "input", 
                    updateNewSaleSummary 
                ); 
 
                input.addEventListener( 
                    "change", 
                    updateNewSaleSummary 
                ); 
 
            } 
        ); 
 
 
        const searchInput = 
            document.getElementById( 
                "sales-history-search" 
            ); 
 
        const paymentFilter = 
            document.getElementById( 
                "sales-history-payment-filter" 
            ); 
 
        const dateFilter = 
            document.getElementById( 
                "sales-history-date-filter" 
            ); 
 
 
        if (searchInput) { 
 
            searchInput.addEventListener( 
                "input", 
                renderSalesHistory 
            ); 
 
        } 
 
        if (paymentFilter) { 
 
            paymentFilter.addEventListener( 
                "change", 
                renderSalesHistory 
            ); 
 
        } 
 
        if (dateFilter) { 
 
            dateFilter.addEventListener( 
                "change", 
                renderSalesHistory 
            ); 
 
        } 
 
    } 
 
 
 
// ================================================== 
// 💳 أزرار عمليات المحفظة 
// ================================================== 
 
document.addEventListener( 
    "click", 
    function (event) { 
 
        const walletCard = 
            event.target.closest( 
                ".wallet-operation-card" 
            ); 
 
        if (!walletCard) { 
            return; 
        } 
 
        event.preventDefault(); 
        event.stopPropagation(); 
 
        const walletPage = 
            document.getElementById( 
                "wallet-section" 
            ); 
 
        if (!walletPage) { 
            return; 
        } 
 
        const operation = 
            walletCard.getAttribute( 
                "data-wallet-operation" 
            ); 
 
        if (!operation) { 
            return; 
        } 
 
        const operationNames = { 
            withdraw: "عملية سحب", 
            deposit: "عملية إيداع", 
            recharge: "عملية شحن", 
            bills: "عملية فواتير", 
            transfer: "عملية تحويل" 
        }; 
 
        const operationDescriptions = { 
 
            withdraw: 
                "تسجيل عملية سحب من المحفظة", 
 
            deposit: 
                "تسجيل عملية إيداع في المحفظة", 
 
            recharge: 
                "تسجيل عملية شحن رصيد", 
 
            bills: 
                "تسجيل دفع فاتورة وتسجيلها", 
 
            transfer: 
                "تسجيل عملية تحويل ومتابعتها" 
 
        }; 
 
        walletPage.dataset.currentOperation = 
            operation; 
 
        walletPage.querySelectorAll(".wallet-operation-card.is-active").forEach(function (c) { c.classList.remove("is-active"); });
        walletCard.classList.add("is-active");

        const operationView = 
            document.getElementById( 
                "wallet-operation-view" 
            ); 

        if (operationView) { 
            // يفتح النموذج مباشرة تحت العملية التي تم الضغط عليها
            walletCard.insertAdjacentElement("afterend", operationView);
            operationView.style.display = "block"; 
        } 

        // تسميات الحقول حسب نوع العملية فقط
        const fieldLabels = {
            withdraw: ["رقم المحفظة / الحساب", "📱 رقم المحفظة أو الحساب", "الخدمة (جهة السحب)"],
            deposit:  ["رقم المحفظة / الحساب", "📱 رقم المحفظة أو الحساب", "الخدمة (جهة الإيداع)"],
            recharge: ["رقم الموبايل", "📱 رقم الموبايل المراد شحنه", "الشبكة / الباقة"],
            bills:    ["رقم الفاتورة / العداد", "🧾 رقم الفاتورة أو الاشتراك", "نوع الفاتورة"],
            transfer: ["رقم المستلم / الحساب", "🔄 رقم المستلم أو الحساب", "وسيلة التحويل"]
        };
        const fl = fieldLabels[operation] || fieldLabels.withdraw;
        const accLabel = document.querySelector('label[for="wallet-account"]');
        const svcLabel = document.querySelector('label[for="wallet-service"]');
        const accInput = document.getElementById("wallet-account");
        const svcBtn = document.getElementById("wallet-service-button");
        if (accLabel) accLabel.textContent = fl[0];
        if (accInput) accInput.placeholder = fl[1];
        if (svcLabel) svcLabel.textContent = fl[2];
        if (svcBtn) svcBtn.textContent = "📋 اختيار";
        walletPage.dataset.logFilter = operation; 
 
        const title = 
            document.getElementById( 
                "wallet-operation-title" 
            ); 
 
        if (title) { 
            title.textContent = 
                operationNames[operation] || 
                "عملية المحفظة"; 
        } 
 
        const description = 
            document.getElementById( 
                "wallet-operation-description" 
            ); 
 
        if (description) { 
            description.textContent = 
                operationDescriptions[operation] || 
                "تسجيل عملية جديدة وحفظها في سجل المحفظة"; 
        } 
 
        const account = 
            document.getElementById( 
                "wallet-account" 
            ); 
 
        const amount = 
            document.getElementById( 
                "wallet-amount" 
            ); 
 
        const service = 
            document.getElementById( 
                "wallet-service" 
            ); 
 
        const notes = 
            document.getElementById( 
                "wallet-notes" 
            ); 
 
        if (account) { 
            account.value = ""; 
        } 
 
        if (amount) { 
            amount.value = ""; 
        } 
 
        if (service) { 
            service.value = ""; 
        } 
 
        if (notes) { 
            notes.value = ""; 
        } 
 
        renderWalletTransactions(walletPage);
        renderWalletRecentPreview();

        if (operationView) {
            operationView.scrollIntoView({ behavior: "smooth", block: "nearest" });
        } 
 
    }, 
    true 
); 
 
// ====================================================== 
// 💳 WALLET - SAVE OPERATION 
// ====================================================== 
 
function getWalletTransactionsStorageKey(operation) { 
 
    const currentUserKey = 
        (typeof currentUser !== "undefined" && 
         currentUser && 
         currentUser.uid) 
            ? currentUser.uid 
            : "guest"; 
 
    return ( 
        "actPhoneManager_wallet_transactions_" + 
        operation + 
        "_" + 
        currentUserKey 
    ); 
} 

// expose to the rest of the app (defined inside a closed scope but used outside it)
window.getWalletTransactionsStorageKey = getWalletTransactionsStorageKey;
 
 
// ====================================================== 
// 💳 قائمة خدمات المحفظة حسب نوع العملية 
// ====================================================== 
 
const walletServiceOptions = { 
 
    withdraw: [ 
        ["🔴 Vodafone Cash", "Vodafone Cash"], 
        ["🟠 Orange Cash", "Orange Cash"], 
        ["🟢 Etisalat Cash", "Etisalat Cash"], 
        ["🔵 WE Pay", "WE Pay"], 
        ["💳 InstaPay", "InstaPay"], 
        ["🏦 بنك", "بنك"], 
        ["📱 رقم هاتف", "رقم هاتف"] 
    ], 
 
    deposit: [ 
        ["🔴 Vodafone Cash", "Vodafone Cash"], 
        ["🟠 Orange Cash", "Orange Cash"], 
        ["🟢 Etisalat Cash", "Etisalat Cash"], 
        ["🔵 WE Pay", "WE Pay"], 
        ["💳 InstaPay", "InstaPay"], 
        ["🏦 بنك", "بنك"], 
        ["📱 رقم هاتف", "رقم هاتف"] 
    ], 
 
    recharge: [ 
        ["🔴 Vodafone", "Vodafone"], 
        ["🟠 Orange", "Orange"], 
        ["🟢 Etisalat", "Etisalat"], 
        ["🔵 WE", "WE"], 
        ["📦 باقة", "باقة"], 
        ["📱 رصيد", "رصيد"] 
    ], 
 
    bills: [ 
        ["⚡ كهرباء", "كهرباء"], 
        ["💧 مياه", "مياه"], 
        ["🔥 غاز", "غاز"], 
        ["🌐 إنترنت", "إنترنت"], 
        ["☎️ تليفون أرضي", "تليفون أرضي"], 
        ["🧾 فاتورة أخرى", "فاتورة أخرى"] 
    ], 
 
    transfer: [ 
        ["🔴 Vodafone Cash", "Vodafone Cash"], 
        ["🟠 Orange Cash", "Orange Cash"], 
        ["🟢 Etisalat Cash", "Etisalat Cash"], 
        ["🔵 WE Pay", "WE Pay"], 
        ["💳 InstaPay", "InstaPay"], 
        ["🏦 بنك", "بنك"], 
        ["🔄 تحويل داخلي", "تحويل داخلي"] 
    ] 
 
}; 
 
 
// ====================================================== 
// 💳 زر اختيار خدمة المحفظة 
// ====================================================== 
 
document.addEventListener("click", function (event) { 
 
    const serviceButton = 
        event.target.closest( 
            "#wallet-service-button" 
        ); 
 
    if (!serviceButton) { 
        return; 
    } 
 
    event.preventDefault(); 
    event.stopPropagation(); 
 
    const walletPage = 
        document.getElementById( 
            "wallet-section" 
        ); 
 
    if (!walletPage) { 
        return; 
    } 
 
    const operation = 
        walletPage.dataset.currentOperation; 
 
    const options = 
        walletServiceOptions[operation] || []; 
 
    if (!options.length) { 
        return; 
    } 
 
    let menu = 
        document.getElementById( 
            "wallet-service-menu" 
        ); 
 
    if (!menu) { 
 
        menu = 
            document.createElement("div"); 
 
        menu.id = 
            "wallet-service-menu"; 
 
        menu.className = 
            "wallet-service-menu"; 
 
        document.body.appendChild(menu); 
    } 
 
    menu.innerHTML = 
        options.map(function (item) { 
 
            return ` 
                <button 
                    type="button" 
                    class="wallet-service-option" 
                    data-service-value="${item[1]}" 
                > 
                    ${item[0]} 
                </button> 
            `; 
 
        }).join(""); 
 
    const rect = 
        serviceButton.getBoundingClientRect(); 
 
    menu.style.display = 
        "flex"; 
 
    menu.style.position = 
        "fixed"; 
 
    menu.style.top = 
        (rect.bottom + 6) + "px"; 
 
    menu.style.left = 
        rect.left + "px"; 
 
    menu.style.minWidth = 
        Math.max( 
            rect.width, 
            180 
        ) + "px"; 
 
    menu.style.zIndex = 
        "99999"; 
 
}); 
 
 
// ====================================================== 
// 💳 اختيار خدمة من القائمة 
// ====================================================== 
 
document.addEventListener("click", function (event) { 
 
    const option = 
        event.target.closest( 
            ".wallet-service-option" 
        ); 
 
    if (!option) { 
        return; 
    } 
 
    const serviceInput = 
        document.getElementById( 
            "wallet-service" 
        ); 
 
    if (serviceInput) { 
 
        serviceInput.value = 
            option.dataset.serviceValue || ""; 
 
        serviceInput.dispatchEvent( 
            new Event("input", { 
                bubbles: true 
            }) 
        ); 
 
    } 
 
    const menu = 
        document.getElementById( 
            "wallet-service-menu" 
        ); 
 
    if (menu) { 
        menu.style.display = 
            "none"; 
    } 
 
}); 
 
 
// ====================================================== 
// 💳 إغلاق قائمة الخدمات عند الضغط خارجها 
// ====================================================== 
 
document.addEventListener("click", function (event) { 
 
    const menu = 
        document.getElementById( 
            "wallet-service-menu" 
        ); 
 
    const button = 
        document.getElementById( 
            "wallet-service-button" 
        ); 
 
    if (!menu || !button) { 
        return; 
    } 
 
    if ( 
        !menu.contains(event.target) && 
        !button.contains(event.target) 
    ) { 
        menu.style.display = 
            "none"; 
    } 
 
}); 
 
// ====================================================== 
// 💳 حفظ عملية المحفظة 
// ====================================================== 
 
document.addEventListener("click", function (event) { 
 
    const saveButton = 
        event.target.closest("#wallet-save-operation"); 
 
    if (!saveButton) { 
        return; 
    } 
 
    event.preventDefault(); 
    event.stopPropagation(); 
 
    const walletPage = 
        document.getElementById("wallet-section"); 
 
    if (!walletPage) { 
        alert("لم يتم العثور على قسم المحفظة."); 
        return; 
    } 
 
    const operation = 
        walletPage.dataset.currentOperation; 
 
    if (!operation) { 
        alert("من فضلك اختر نوع العملية أولاً."); 
        return; 
    } 
 
    const account = 
        document.getElementById("wallet-account"); 
 
    const amount = 
        document.getElementById("wallet-amount"); 
 
    const service = 
        document.getElementById("wallet-service"); 
 
    const notes = 
        document.getElementById("wallet-notes"); 
 
    const accountValue = 
        account ? account.value.trim() : ""; 
 
    const amountValue = 
        amount ? amount.value.trim() : ""; 
 
    const serviceValue = 
        service ? service.value.trim() : ""; 
 
    const notesValue = 
        notes ? notes.value.trim() : ""; 
 
    if (!accountValue) { 
 
        alert("من فضلك اكتب الحساب أو الرقم."); 
 
        if (account) { 
            account.focus(); 
        } 
 
        return; 
    } 
 
    const numericAmount = 
        Number(amountValue); 
 
    if ( 
        !amountValue || 
        !Number.isFinite(numericAmount) || 
        numericAmount <= 0 
    ) { 
 
        alert("من فضلك اكتب مبلغ صحيح."); 
 
        if (amount) { 
            amount.focus(); 
        } 
 
        return; 
    } 
 
    const operationNames = { 
 
        withdraw: "عملية سحب", 
 
        deposit: "عملية إيداع", 
 
        recharge: "عملية شحن", 
 
        bills: "عملية فواتير", 
 
        transfer: "عملية تحويل" 
 
    }; 
 
    const transaction = { 
 
        id: 
            "WALLET-" + 
            Date.now(), 
 
        operation: 
            operation, 
 
        operationName: 
            operationNames[operation] || 
            "عملية محفظة", 
 
        account: 
            accountValue, 
 
        amount: 
            numericAmount, 
 
        service: 
            serviceValue, 
 
        notes: 
            notesValue, 
 
        status: 
            "completed", 
 
        statusName: 
            "تم الحفظ", 
 
        date: 
            new Date().toISOString(), 
 
        createdAt: 
            Date.now() 
 
    }; 
 
    let userId = "guest"; 
 
    if ( 
        typeof currentUser !== "undefined" && 
        currentUser && 
        currentUser.uid 
    ) { 
        userId = currentUser.uid; 
    } 
 
    const storageKey = 
        "actPhoneManager_wallet_transactions_" + 
        operation + 
        "_" + 
        userId; 
 
    let transactions = []; 
 
    try { 
 
        const saved = 
            localStorage.getItem( 
                storageKey 
            ); 
 
        if (saved) { 
 
            const parsed = 
                JSON.parse(saved); 
 
            if (Array.isArray(parsed)) { 
 
                transactions = 
                    parsed; 
 
            } 
 
        } 
 
    } catch (error) { 
 
        console.error( 
            "❌ Wallet read error:", 
            error 
        ); 
 
        transactions = []; 
 
    } 
 
    transactions.unshift( 
        transaction 
    ); 
 
    try { 
const value = JSON.stringify(transactions);

// الحفظ المحلي
localStorage.setItem(storageKey, value);

// الحفظ السحابي
saveUserDataToCloud(storageKey, value);
window.dispatchEvent(new Event("act-wallet-data-updated"));
if (typeof addNotificationFromOperation === "function") {
    addNotificationFromOperation({ type: "wallet", icon: "💳", title: "تم حفظ عملية محفظة", details: `${transaction.operationName || "عملية مالية"} — ${Number(transaction.amount || 0).toLocaleString("ar-EG")} جنيه`, amount: transaction.amount });
}
        console.log( 
            "✅ Wallet transaction saved:", 
            transaction 
        ); 
 
        console.log( 
            "🔑 Storage key:", 
            storageKey 
        ); 
 
    } catch (error) { 
 
        console.error( 
            "❌ Wallet save error:", 
            error 
        ); 
 
        alert( 
            "حدث خطأ أثناء حفظ العملية." 
        ); 
 
        return; 
    } 
 
    if ( 
        typeof renderWalletTransactions === 
        "function" 
    ) { 
 
        try { 
 
            renderWalletTransactions( 
                walletPage 
            ); 
 
        } catch (error) { 
 
            console.error( 
                "❌ Wallet render error:", 
                error 
            ); 
 
        } 
 
    } 
 
    // تحديث الرصيد فور الحفظ 
    if ( 
        typeof updateWalletBalanceSummary === 
        "function" 
    ) { 
 
        updateWalletBalanceSummary(); 
 
    } 
 
    if (account) { 
        account.value = ""; 
    } 
 
    if (amount) { 
        amount.value = ""; 
    } 
 
    if (service) { 
        service.value = ""; 
    } 
 
    if (notes) { 
        notes.value = ""; 
    } 
 
    const walletOperationView = 
        document.getElementById( 
            "wallet-operation-view" 
        ); 
 
    const operationsGrid = 
        walletPage.querySelector( 
            ".wallet-operations-grid" 
        ); 
 
    if (walletOperationView) { 
 
        walletOperationView.style.display = 
            "none"; 
 
    } 
 
    if (operationsGrid) { 
 
        operationsGrid.style.display = 
            "grid"; 
 
    } 
 
// ==================================================
// ⚡ إضافة السحب والإيداع إلى TODAY ACTIVITY
// ==================================================

if (
    operation === "withdraw" ||
    operation === "deposit"
) {

    const walletActivityNames = {
        withdraw: "سحب محفظة",
        deposit: "إيداع محفظة"
    };

    const walletActivityIcons = {
        withdraw: "💸",
        deposit: "💰"
    };

    addDashboardOperation({
        type: "wallet-" + operation,

        icon:
            walletActivityIcons[operation],

        title:
            walletActivityNames[operation],

        details:
            (
                serviceValue
                    ? serviceValue + " • "
                    : ""
            ) +
            accountValue,

        amount:
            Number(amountValue) || 0
    });
}

    walletPage.querySelectorAll(".wallet-operation-card.is-active").forEach(function (c) { c.classList.remove("is-active"); });
    if (typeof updateWalletBalanceSummary === "function") updateWalletBalanceSummary();
    alert( 
        "✅ تم حفظ العملية بنجاح." 
    ); 
 
}); 
 
 
// ====================================================== 
// ↩️ زر رجوع من عملية المحفظة 
// ====================================================== 
 
const walletCancelOperation = 
    document.getElementById( 
        "wallet-cancel-operation" 
    ); 
 
if (walletCancelOperation) { 
 
    walletCancelOperation.addEventListener( 
        "click", 
        function () { 
 
            const walletPage = 
                document.getElementById( 
                    "wallet-section" 
                ); 
 
            if (!walletPage) { 
                return; 
            }
            walletPage.dataset.logFilter = "";
            walletPage.querySelectorAll(".wallet-operation-card.is-active").forEach(function (c) { c.classList.remove("is-active"); });
            if (typeof renderWalletTransactions === "function") renderWalletTransactions(walletPage);
 
 
            const operationsGrid = 
                walletPage.querySelector( 
                    ".wallet-operations-grid" 
                ); 
 
            const operationView = 
                document.getElementById( 
                    "wallet-operation-view" 
                ); 
 
            if (operationView) { 
                operationView.style.display = 
                    "none"; 
            } 
 
            if (operationsGrid) { 
                operationsGrid.style.display = 
                    "grid"; 
            } 
 
            } ); }


    /* =========================================================
       FIREBASE USER CHANGE 
       ========================================================= */ 
 
    function initSalesAuthListener() { 
 
        if ( 
            typeof onAuthStateChanged === 
                "function" && 
            typeof auth !== 
                "undefined" 
        ) { 
 
            onAuthStateChanged( 
                auth, 
                function () { 
 
                    loadSalesData(); 
 
                } 
            ); 
 
        } 
 
    } 
 
 
    /* ========================================================= 
       INITIALIZE 
       ========================================================= */ 
 
    function initializeSalesSystem() {

        ensureSalesMultiItemUI();
        initSalesEvents();

        loadSalesData();

        initSalesAuthListener();

        window.addEventListener("act-user-data-ready", loadSalesData);

    } 
 
 
    if ( 
        document.readyState === 
        "loading" 
    ) { 
 
        document.addEventListener( 
            "DOMContentLoaded", 
            initializeSalesSystem 
        ); 
 
    } else { 
 
        initializeSalesSystem(); 
 
    } 
 
 
    /* ========================================================= 
       GLOBAL ACCESS 
       ========================================================= */ 
 
    window.actPhoneManagerSales = { 
 
        load: 
            loadSalesData, 
 
        save: 
            saveNewSale, 
 
        clear: 
            clearNewSaleForm, 
 
        history: 
            renderSalesHistory, 
 
        reports: 
            renderSalesReports, 
 
        printInvoice: 
            printSaleInvoice, 
 
        printHistory: 
            printSalesHistory,
        getAll: () => salesData.slice(),
        returnFromInvoice: applySalesReturn 
 
    }; 
 
})(); 
 
/* ========================================================= 
   ACT PHONE MANAGER 
   RETURNS SYSTEM 
   ========================================================= */ 
 
(function () { 
 
    let actReturnsData = []; 
    let actSelectedReturnType = ""; 
    let actSelectedReturnStatus = ""; 
 
    const addReturnButton = 
        document.getElementById("add-return-button"); 
 
    const returnForm = 
        document.getElementById("return-form"); 
 
    const cancelReturnButton = 
        document.getElementById("cancel-return-button"); 
 
    const confirmReturnButton = 
        document.getElementById("confirm-return-button"); 
 
    const returnItemName = 
        document.getElementById("return-item-name"); 
 
    const returnPrice = 
        document.getElementById("return-price"); 
 
    const returnReason = 
        document.getElementById("return-reason"); 
 
    const returnCustomer = 
        document.getElementById("return-customer");
    const returnSaleInvoice = document.getElementById("return-sale-invoice");
    const returnSaleItem = document.getElementById("return-sale-item");
    const returnSaleQuantity = document.getElementById("return-sale-quantity");
    const returnSaleItemWrap = document.getElementById("return-sale-item-wrap");
    const returnSaleQuantityWrap = document.getElementById("return-sale-quantity-wrap"); 
 
    const returnsList = 
        document.getElementById("returns-list"); 
 
    const returnsEmpty = 
        document.getElementById("returns-empty"); 
 
    const returnsCount = 
        document.getElementById("returns-count"); 
 
    const returnTypeButtons = 
        document.querySelectorAll( 
            ".return-type-card" 
        ); 
 
    const returnStatusButtons = 
        document.querySelectorAll( 
            ".return-status-card" 
        ); 
 
 
    /* ===================================================== 
       STORAGE 
       ===================================================== */ 
 
    function getReturnsStorageKey() { 
 
        let userId = "guest"; 
 
        if ( 
            typeof currentUser !== "undefined" && 
            currentUser && 
            currentUser.uid 
        ) { 
            userId = currentUser.uid; 
        } 
 
        return "actPhoneManager_returns_" + userId; 
    } 
 
 
    function loadActReturns() { 
 
        try { 
 
            const saved = 
                localStorage.getItem( 
                    getReturnsStorageKey() 
                ); 
 
            actReturnsData = 
                saved 
                    ? JSON.parse(saved) 
                    : []; 
 
            if (!Array.isArray(actReturnsData)) { 
                actReturnsData = []; 
            } 
 
        } catch (error) { 
 
            console.error( 
                "Returns load error:", 
                error 
            ); 
 
            actReturnsData = []; 
        } 
 
        renderActReturns(); 
    } 
 
 function saveActReturns() {

    try {

        const key = getReturnsStorageKey();
        const value = JSON.stringify(actReturnsData);

        // الحفظ المحلي
        localStorage.setItem(
            key,
            value
        );

        // الحفظ السحابي
        saveUserDataToCloud(
            key,
            value
        );

    } catch (error) {

        console.error(
            "Returns save error:",
            error
        );

    }
}
 
 
    /* ===================================================== 
       RESET FORM 
       ===================================================== */ 
 
    function resetReturnForm() { 
 
        actSelectedReturnType = ""; 
        actSelectedReturnStatus = ""; 
 
        if (returnItemName) { 
            returnItemName.value = ""; 
        } 
 
        if (returnPrice) { 
            returnPrice.value = ""; 
        } 
 
        if (returnReason) { 
            returnReason.value = ""; 
        } 
 
        if (returnCustomer) {
            returnCustomer.value = "";
        }
        if (returnItemName) returnItemName.readOnly = false;
        if (returnSaleInvoice) returnSaleInvoice.value = "";
        if (returnSaleItem) returnSaleItem.innerHTML = '<option value="">اختر الصنف</option>';
        if (returnSaleQuantity) returnSaleQuantity.value = "1";
        if (returnSaleItemWrap) returnSaleItemWrap.hidden = true;
        if (returnSaleQuantityWrap) returnSaleQuantityWrap.hidden = true; 
 
        returnTypeButtons.forEach( 
            button => { 
                button.classList.remove("active"); 
            } 
        ); 
 
        returnStatusButtons.forEach( 
            button => { 
                button.classList.remove("active"); 
            } 
        ); 
    } 
 
 
    /* ===================================================== 
       OPEN FORM 
       ===================================================== */ 
 
    if (addReturnButton) { 
 
        addReturnButton.addEventListener( 
            "click", 
            function () { 
 
                resetReturnForm();
                if (returnSaleInvoice) {
                    const invoices = window.actPhoneManagerSales?.getAll?.() || [];
                    returnSaleInvoice.innerHTML = '<option value="">مرتجع يدوي غير مرتبط بفاتورة</option>' + invoices.map(sale => `<option value="${escapeReturnHTML(sale.id)}">فاتورة #${escapeReturnHTML(sale.invoiceNumber || sale.id)} — ${escapeReturnHTML(sale.productName || "أصناف متعددة")}</option>`).join("");
                } 
 
                if (returnForm) { 
 
                    returnForm.style.display = "block"; 
 
                    setTimeout( 
                        function () { 
 
                            returnForm.scrollIntoView({ 
                                behavior: "smooth", 
                                block: "start" 
                            }); 
 
                        }, 
                        50 
                    ); 
                } 
 
            } 
        ); 
 
    } 
 
 
    /* ===================================================== 
       RETURN TYPE 
       ===================================================== */ 
 
    returnTypeButtons.forEach( 
        button => { 
 
            button.addEventListener( 
                "click", 
                function () { 
 
                    returnTypeButtons.forEach( 
                        item => { 
                            item.classList.remove("active"); 
                        } 
                    ); 
 
                    this.classList.add("active"); 
 
                    actSelectedReturnType = 
                        this.dataset.returnType || ""; 
 
                } 
            ); 
 
        } 
    ); 
 
 
    /* ===================================================== 
       RETURN STATUS 
       ===================================================== */ 
 
    returnStatusButtons.forEach( 
        button => { 
 
            button.addEventListener( 
                "click", 
                function () { 
 
                    returnStatusButtons.forEach( 
                        item => { 
                            item.classList.remove("active"); 
                        } 
                    ); 
 
                    this.classList.add("active"); 
 
                    actSelectedReturnStatus = 
                        this.dataset.returnStatus || ""; 
 
                } 
            ); 
 
        } 
    ); 
 
 
    /* ===================================================== 
       CANCEL 
       ===================================================== */ 
 
    if (cancelReturnButton) { 
 
        cancelReturnButton.addEventListener( 
            "click", 
            function () { 
 
                resetReturnForm(); 
 
                if (returnForm) { 
                    returnForm.style.display = "none"; 
                } 
 
            } 
        ); 
 
    } 
 
 
    if (returnSaleInvoice) {
        returnSaleInvoice.addEventListener("change", () => {
            const sale = (window.actPhoneManagerSales?.getAll?.() || []).find(item => item.id === returnSaleInvoice.value);
            if (!sale) {
                if (returnSaleItemWrap) returnSaleItemWrap.hidden = true;
                if (returnSaleQuantityWrap) returnSaleQuantityWrap.hidden = true;
                if (returnItemName) returnItemName.readOnly = false;
                return;
            }
            const items = Array.isArray(sale.items) && sale.items.length ? sale.items : [{ name: sale.productName, serial: sale.serial, quantity: 1, returnedQuantity: sale.returnedQuantity || 0, unitPrice: sale.price || 0 }];
            returnSaleItem.innerHTML = '<option value="">اختر الصنف المرتجع</option>' + items.map((item, index) => {
                const remaining = Math.max(0, Number(item.quantity || 1) - Number(item.returnedQuantity || 0));
                return remaining ? `<option value="${index}">${escapeReturnHTML(item.name)}${item.serial ? " · " + escapeReturnHTML(item.serial) : ""} — متاح ${remaining}</option>` : "";
            }).join("");
            if (returnSaleItemWrap) returnSaleItemWrap.hidden = false;
            if (returnSaleQuantityWrap) returnSaleQuantityWrap.hidden = false;
            if (returnItemName) returnItemName.readOnly = true;
            if (returnCustomer) returnCustomer.value = sale.customerName || "";
            returnSaleItem.dispatchEvent(new Event("change"));
        });
        returnSaleItem?.addEventListener("change", () => {
            const sale = (window.actPhoneManagerSales?.getAll?.() || []).find(item => item.id === returnSaleInvoice.value);
            const item = sale?.items?.[Number(returnSaleItem.value)] || (sale && !sale.items?.length ? { name: sale.productName, quantity: 1, returnedQuantity: sale.returnedQuantity || 0, unitPrice: sale.price || 0 } : null);
            if (!item) return;
            const remaining = Math.max(0, Number(item.quantity || 1) - Number(item.returnedQuantity || 0));
            if (returnItemName) returnItemName.value = item.name || "";
            if (returnPrice) returnPrice.value = Number(item.unitPrice || sale.price || 0);
            if (returnSaleQuantity) { returnSaleQuantity.max = String(remaining); returnSaleQuantity.value = remaining ? "1" : "0"; }
            if (item.type === "accessory") document.querySelector('[data-return-type="part"]')?.click();
            else if (item.type === "phone") document.querySelector('[data-return-type="device"]')?.click();
            else if (item.type === "other") document.querySelector('[data-return-type="other"]')?.click();
        });
    }

    /* ===================================================== 
       CONFIRM RETURN 
       ===================================================== */ 
 
    if (confirmReturnButton) { 
 
        confirmReturnButton.addEventListener( 
            "click", 
            function () { 
 
                const itemName = 
                    returnItemName 
                        ? returnItemName.value.trim() 
                        : ""; 
 
                const price = 
                    returnPrice && 
                    returnPrice.value !== "" 
                        ? Number(returnPrice.value) 
                        : 0; 
 
                const reason = 
                    returnReason 
                        ? returnReason.value.trim() 
                        : ""; 
 
                const customer = 
                    returnCustomer 
                        ? returnCustomer.value.trim() 
                        : ""; 
 
                if (!actSelectedReturnType) { 
 
                    alert( 
                        "من فضلك اختر نوع المرتجع." 
                    ); 
 
                    return; 
                } 
 
                if (!itemName) { 
 
                    alert( 
                        "من فضلك اكتب اسم المنتج." 
                    ); 
 
                    if (returnItemName) { 
                        returnItemName.focus(); 
                    } 
 
                    return; 
                } 
 
                if (!actSelectedReturnStatus) { 
 
                    alert( 
                        "من فضلك اختر حالة المنتج." 
                    ); 
 
                    return; 
                } 
 
                if (!reason) { 
 
                    alert( 
                        "من فضلك اكتب سبب المرتجع." 
                    ); 
 
                    if (returnReason) { 
                        returnReason.focus(); 
                    } 
 
                    return; 
                } 
 
                let linkedSaleId = "";
                let linkedItemIndex = null;
                let linkedQuantity = 1;
                if (returnSaleInvoice?.value) {
                    linkedSaleId = returnSaleInvoice.value;
                    linkedItemIndex = Number(returnSaleItem?.value);
                    linkedQuantity = Number(returnSaleQuantity?.value || 1);
                    if (!returnSaleItem?.value || !Number.isInteger(linkedQuantity) || linkedQuantity < 1) {
                        alert("اختر الصنف والكمية الصحيحة من الفاتورة.");
                        return;
                    }
                    const applied = window.actPhoneManagerSales?.returnFromInvoice?.(linkedSaleId, linkedItemIndex, linkedQuantity, actSelectedReturnStatus === "working");
                    if (!applied) {
                        alert("تعذر ربط المرتجع بالفاتورة. تأكد من الكمية المتبقية وحالة المخزون.");
                        return;
                    }
                }

                const typeNames = { 
 
                    device: "جهاز", 
 
                    part: "قطعة", 
 
                    other: "أخرى" 
 
                }; 
 
                const statusNames = { 
 
                    working: "شغال", 
 
                    "not-working": "مش شغال" 
 
                }; 
 
                const newReturn = { 
 
                    id: 
                        Date.now().toString(), 
 
                    type: 
                        actSelectedReturnType, 
 
                    typeName: 
                        typeNames[ 
                            actSelectedReturnType 
                        ] || "أخرى", 
 
                    itemName: 
                        itemName, 
 
                    price: 
                        price, 
 
                    status: 
                        actSelectedReturnStatus, 
 
                    statusName: 
                        statusNames[ 
                            actSelectedReturnStatus 
                        ] || "", 
 
                    reason: 
                        reason, 
 
                    customer: 
                        customer,
                    linkedSaleId,
                    linkedItemIndex,
                    quantity: linkedQuantity, 
 
                    date: 
                        new Date().toISOString() 
 
                }; 
 
                actReturnsData.unshift( 
                    newReturn 
                ); 
 
                saveActReturns(); 
 
                renderActReturns(); 
 
                resetReturnForm(); 
 
                if (returnForm) { 
                    returnForm.style.display = "none"; 
                } 
 
                alert( 
                    "تم تسجيل المرتجع بنجاح ✅" 
                ); 
 
            } 
        ); 
 
    } 
 
 
    /* ===================================================== 
       RENDER RETURNS 
       ===================================================== */ 
 
    function renderActReturns() { 
 
        if (!returnsList) { 
            return; 
        } 
 
        const count = 
            actReturnsData.length; 
 
        if (returnsCount) { 
 
            returnsCount.textContent = 
                count + " مرتجع"; 
 
        } 
 
        if (count === 0) { 
 
            returnsList.innerHTML = ` 
                <div 
                    id="returns-empty" 
                    class="returns-empty" 
                > 
                    <span>↩️</span> 
 
                    <strong> 
                        لا توجد مرتجعات حتى الآن 
                    </strong> 
 
                    <small> 
                        عند إضافة مرتجع سيظهر هنا 
                    </small> 
                </div> 
            `; 
 
            return; 
        } 
 
        returnsList.innerHTML = 
            actReturnsData 
                .map( 
                    item => { 
 
                        const date = 
                            item.date 
                                ? new Date( 
                                    item.date 
                                ).toLocaleString( 
                                    "ar-EG" 
                                ) 
                                : ""; 
 
                        return ` 
                            <div 
                                class="return-item-card" 
                            > 
 
                                <div 
                                    class="return-item-top" 
                                > 
 
                                    <div> 
                                        <span 
                                            class="return-item-icon" 
                                        > 
                                            ↩️ 
                                        </span> 
 
                                        <div> 
                                            <strong> 
                                                ${escapeReturnHTML( 
                                                    item.itemName 
                                                )} 
                                            </strong> 
 
                                            <small> 
                                                ${escapeReturnHTML( 
                                                    item.typeName 
                                                )} 
                                            </small> 
                                        </div> 
                                    </div> 
 
                                    <div 
                                        class="return-item-price" 
                                    > 
                                        ${Number( 
                                            item.price || 0 
                                        ).toLocaleString( 
                                            "ar-EG" 
                                        )} جنيه 
                                    </div> 
 
                                </div> 
 
                                <div 
                                    class="return-item-info" 
                                > 
 
                                    <span> 
                                        الحالة: 
                                        <b 
                                            class="${ 
                                                item.status === 
                                                "working" 
                                                    ? "return-working" 
                                                    : "return-not-working" 
                                            }" 
                                        > 
                                            ${escapeReturnHTML( 
                                                item.statusName 
                                            )} 
                                        </b> 
                                    </span> 
 
                                    ${ 
                                        item.customer 
                                            ? ` 
                                                <span> 
                                                    العميل: 
                                                    <b> 
                                                        ${escapeReturnHTML( 
                                                            item.customer 
                                                        )} 
                                                    </b> 
                                                </span> 
                                            ` 
                                            : "" 
                                    } 
 
                                </div> 
 
                                <div 
                                    class="return-item-reason" 
                                > 
                                    <strong> 
                                        سبب المرتجع: 
                                    </strong> 
 
                                    <p> 
                                        ${escapeReturnHTML( 
                                            item.reason 
                                        )} 
                                    </p> 
                                </div> 
 
                                ${item.linkedSaleId ? `<div class="return-item-info"><span>الفاتورة: <b>#${escapeReturnHTML(item.invoiceNumber || item.linkedSaleId)}</b></span><span>الكمية: <b>${escapeReturnHTML(item.quantity || 1)}</b></span></div>` : ""}
                                <div 
                                    class="return-item-date" 
                                > 
                                    ${escapeReturnHTML( 
                                        date 
                                    )} 
                                </div> 
 
                            </div> 
                        `; 
 
                    } 
                ) 
                .join(""); 
 
    } 
 
 
    /* ===================================================== 
       HTML SAFETY 
       ===================================================== */ 
 
    function escapeReturnHTML(value) { 
 
        return String(value ?? "") 
            .replace( 
                /&/g, 
                "&amp;" 
            ) 
            .replace( 
                /</g, 
                "&lt;" 
            ) 
            .replace( 
                />/g, 
                "&gt;" 
            ) 
            .replace( 
                /"/g, 
                "&quot;" 
            ) 
            .replace( 
                /'/g, 
                "&#039;" 
            ); 
 
    } 
 
 
    /* ===================================================== 
       WHEN RETURNS PAGE OPENS 
       ===================================================== */ 
 
    document.addEventListener( 
        "click", 
        function (event) { 
 
            const returnsButton = 
                event.target.closest( 
                    '.independent-sales-card[data-sales-view="returns"]' 
                ); 
 
            if (!returnsButton) { 
                return; 
            } 
 
            setTimeout( 
                function () { 
                    loadActReturns(); 
                }, 
                50 
            ); 
 
        }, 
        true 
    ); 
 
 
    /* ===================================================== 
       INITIAL LOAD 
       ===================================================== */ 
 
    window.actPhoneManagerReturns = {
        recordLinkedReturn(data) {
            if (!data || !data.saleId) return false;
            actReturnsData.unshift({
                id: Date.now().toString(), type: "other", typeName: "مرتجع من فاتورة",
                itemName: data.itemName || "صنف", price: Number(data.price || 0),
                status: data.working ? "working" : "not-working", statusName: data.working ? "شغال" : "مش شغال",
                reason: "مرتجع مرتبط بفاتورة مبيعات", customer: data.customer || "",
                linkedSaleId: data.saleId, invoiceNumber: data.invoiceNumber,
                linkedItemIndex: data.itemIndex, quantity: Number(data.quantity || 1),
                date: new Date().toISOString()
            });
            saveActReturns(); renderActReturns(); return true;
        }
    };

    loadActReturns(); 
 
})(); 
/* ========================================================= 
   DEVICE SUB TABS 
   بيع التلفونات / مشتريات التلفونات 
   ========================================================= */ 
 
document.addEventListener("DOMContentLoaded", function () { 
 
    const saleTab = 
        document.getElementById("device-sale-tab"); 
 
    const purchaseTab = 
        document.getElementById("device-purchase-tab"); 
 
    const saleSection = 
        document.getElementById("phone-sale-section"); 
 
    const purchasesSection = 
        document.getElementById("phone-purchases-section"); 
 
    const purchaseForm = 
        document.getElementById("phone-purchase-form"); 
 
    const addPurchaseButton = 
        document.getElementById("phone-purchase-add-button"); 
 
    const closePurchaseButton = 
        document.getElementById("close-phone-purchase-form"); 
 
    const savePurchaseButton = 
        document.getElementById("save-phone-purchase"); 
 
    const purchasesList = 
        document.getElementById("phone-purchases-list"); 
 
const purchasesSearchInput =
    document.getElementById(
        "phone-purchases-search-input"
    );


    if (!saleTab || !purchaseTab) { 
        return; 
    } 
 function getPhonePurchasesStorageKey() {

    const uid =
        currentUser && currentUser.uid
            ? currentUser.uid
            : "guest";

    return "actPhoneManager_phonePurchases_" + uid;
}

function getIndependentPhonePurchasesStorageKey() {
    const uid = currentUser && currentUser.uid ? currentUser.uid : "guest";
    return "actPhoneManager_independentPurchases_" + uid;
}

function readIndependentPhonePurchases() {
    try {
        const rows = JSON.parse(localStorage.getItem(getIndependentPhonePurchasesStorageKey()) || "[]");
        return Array.isArray(rows) ? rows.filter(row => row && row.category === "phones") : [];
    } catch (error) {
        console.error("Independent phone purchases read error:", error);
        return [];
    }
}

function getPhonePurchaseCards() {
    const direct = phonePurchases.map(purchase => ({ ...purchase, source: "phone", cardId: String(purchase.id) }));
    const independent = readIndependentPhonePurchases().map(record => ({
        id: "independent:" + String(record.id),
        cardId: "independent:" + String(record.id),
        independentId: String(record.id),
        source: "independent",
        phoneName: record.product || "",
        serial: record.serial || "",
        sellerName: record.supplier || "",
        sellerPhone: record.supplierPhone || "",
        price: record.unitPrice ?? "",
        date: record.date || "",
        notes: record.notes || "",
        quantity: Number(record.quantity) || 1,
        paid: Number(record.paid) || 0,
        total: Number(record.total) || 0,
        category: record.category,
        boxIncluded: record.boxIncluded !== false,
        photo: record.photo || "",
        independentId: String(record.id),
        createdAt: record.createdAt || record.updatedAt || ""
    }));
    return [...direct, ...independent].sort((a, b) => String(b.date || b.createdAt || "").localeCompare(String(a.date || a.createdAt || "")));
}

function findPhonePurchaseCard(id) {
    return getPhonePurchaseCards().find(item => String(item.cardId || item.id) === String(id)) || null;
}

function saveIndependentPhonePurchaseFromForm(cardId, fields) {
    const key = getIndependentPhonePurchasesStorageKey();
    let rows;
    try { rows = JSON.parse(localStorage.getItem(key) || "[]"); } catch (_) { rows = []; }
    if (!Array.isArray(rows)) rows = [];
    const id = String(cardId).replace(/^independent:/, "");
    const index = rows.findIndex(row => String(row.id) === id && row.category === "phones");
    if (index < 0) return false;
    const oldRecord = { ...rows[index] };
    const quantity = Math.max(1, Number(oldRecord.quantity) || 1);
    const unitPrice = fields.price === "" ? 0 : Number(fields.price);
    rows[index] = {
        ...oldRecord,
        product: fields.phoneName,
        serial: fields.serial,
        supplier: fields.sellerName,
        supplierPhone: fields.sellerPhone,
        unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
        total: quantity * (Number.isFinite(unitPrice) ? unitPrice : 0),
        date: fields.date,
        notes: fields.notes,
        boxIncluded: fields.boxIncluded !== false,
        photo: fields.photo || oldRecord.photo || "",
        category: "phones",
        updatedAt: new Date().toISOString()
    };
    try {
        const raw = JSON.stringify(rows);
        localStorage.setItem(key, raw);
        if (typeof saveUserDataToCloud === "function") saveUserDataToCloud(key, raw);
        window.actPhoneInventoryUpsertPurchase?.("independent", rows[index], oldRecord);
        window.dispatchEvent(new Event("act-purchases-data-updated"));
        return true;
    } catch (error) {
        console.error("Independent phone purchase update error:", error);
        alert("تعذر حفظ استكمال بيانات عملية الشراء.");
        return false;
    }
}

function deleteIndependentPhonePurchase(cardId) {
    const key = getIndependentPhonePurchasesStorageKey();
    let rows;
    try { rows = JSON.parse(localStorage.getItem(key) || "[]"); } catch (_) { rows = []; }
    if (!Array.isArray(rows)) rows = [];
    const id = String(cardId).replace(/^independent:/, "");
    const oldRecord = rows.find(row => String(row.id) === id && row.category === "phones");
    if (!oldRecord) return false;
    const next = rows.filter(row => !(String(row.id) === id && row.category === "phones"));
    try {
        const raw = JSON.stringify(next);
        localStorage.setItem(key, raw);
        if (typeof saveUserDataToCloud === "function") saveUserDataToCloud(key, raw);
        window.actPhoneInventoryRemovePurchase?.("independent", oldRecord);
        window.dispatchEvent(new Event("act-purchases-data-updated"));
        return true;
    } catch (error) {
        console.error("Independent phone purchase delete error:", error);
        alert("تعذر حذف عملية الشراء.");
        return false;
    }
}


let phonePurchases = [];

try {

    const key = getPhonePurchasesStorageKey();

    phonePurchases = JSON.parse(
        localStorage.getItem(key) || "[]"
    );

    if (!Array.isArray(phonePurchases)) {
        phonePurchases = [];
    }

} catch (error) {

    console.error("Phone purchases load error:", error);

    phonePurchases = [];
}


let editingPurchaseId = null;


function savePhonePurchases() {

    try {

        const key = getPhonePurchasesStorageKey();
        const value = JSON.stringify(phonePurchases);

        // الحفظ المحلي
        localStorage.setItem(key, value);

        // الحفظ السحابي
        saveUserDataToCloud(key, value);
        if (typeof addNotificationFromOperation === "function") {
            addNotificationFromOperation({ type: "phone-purchase", icon: "📱", title: "تم حفظ مشتريات تلفون", details: "تم تحديث سجل مشتريات الأجهزة" });
        }
        window.dispatchEvent(new Event("act-purchases-data-updated"));

    } catch (error) {

        console.error(
            "Phone purchases save error:",
            error
        );

    }
}
 
    function clearPurchaseForm() { 
 
        const phone = 
            document.getElementById( 
                "purchase-phone-name" 
            ); 
 
        const serial = 
            document.getElementById( 
                "purchase-serial" 
            ); 
 
        const seller = 
            document.getElementById( 
                "purchase-seller-name" 
            ); 
 
        const sellerPhone = 
            document.getElementById( 
                "purchase-seller-phone" 
            ); 
 
        const price = 
            document.getElementById( 
                "purchase-price" 
            ); 
 
        const date = 
            document.getElementById( 
                "purchase-date" 
            ); 
 
        const notes = 
            document.getElementById( 
                "purchase-notes" 
            ); 
 
        if (phone) { 
            phone.value = ""; 
        } 
 
        if (serial) { 
            serial.value = ""; 
        } 
 
        if (seller) { 
            seller.value = ""; 
        } 
 
        if (sellerPhone) { 
            sellerPhone.value = ""; 
        } 
 
        if (price) { 
            price.value = ""; 
        } 
 
        if (date) { 
 
            date.value = 
                typeof getToday === "function" 
                    ? getToday() 
                    : ""; 
 
        } 
 
        if (notes) { 
            notes.value = ""; 
        } 
 
        const box = document.getElementById("purchase-box-included");
        const photo = document.getElementById("purchase-device-photo");
        const preview = document.getElementById("purchase-device-photo-preview");
        if (box) box.value = "yes";
        if (photo) { photo.value = ""; photo.dataset.imageData = ""; }
        if (preview) { preview.removeAttribute("src"); preview.style.display = "none"; }
        editingPurchaseId = null; 
 
        if (savePurchaseButton) { 
 
            savePurchaseButton.textContent = 
                "💾 حفظ المشتريات"; 
 
        } 
 
    } 


function updateActPurchaseDashboard() {
    const countElement = document.getElementById(
        "act-purchase-stat-count"
    );

    const totalElement = document.getElementById(
        "act-purchase-stat-total"
    );

    const monthElement = document.getElementById(
        "act-purchase-stat-month"
    );

    if (!countElement || !totalElement || !monthElement) {
        return;
    }

    const purchases = typeof getPhonePurchaseCards === "function"
        ? getPhonePurchaseCards()
        : (Array.isArray(phonePurchases) ? phonePurchases : []);

    const total = purchases.reduce(function (sum, purchase) {
        return sum + Math.max(0, Number(purchase.price) || 0);
    }, 0);

    const now = new Date();

    const currentMonth =
        now.getFullYear() + "-" +
        String(now.getMonth() + 1).padStart(2, "0");

    const monthCount = purchases.filter(function (purchase) {
        return typeof purchase.date === "string" &&
            purchase.date.startsWith(currentMonth);
    }).length;

    countElement.textContent =
        purchases.length.toLocaleString("ar-EG");

    totalElement.textContent =
        total.toLocaleString("ar-EG", {
            maximumFractionDigits: 2
        }) + " ج.م";

    monthElement.textContent =
        monthCount.toLocaleString("ar-EG");
}


 function isPhonePurchaseComplete(purchase) {
    if (!purchase) return false;
    const hasName = Boolean(String(purchase.phoneName || "").trim());
    const hasSerial = Boolean(String(purchase.serial || "").trim());
    const hasSeller = Boolean(String(purchase.sellerName || "").trim());
    const price = Number(purchase.price);
    const hasPrice = String(purchase.price ?? "").trim() !== "" && Number.isFinite(price) && price > 0;
    return hasName && hasSerial && hasSeller && hasPrice;
 }

 function renderPhonePurchases() {

    if (!purchasesList) {
        return;
    }

    const searchTerm = purchasesSearchInput
        ? purchasesSearchInput.value.trim().toLowerCase()
        : "";

    const allPhonePurchaseCards = getPhonePurchaseCards();
    const filteredPurchases = allPhonePurchaseCards.filter(
        function (purchase) {

            const searchableText = [
                purchase.phoneName,
                purchase.serial,
                purchase.sellerName,
                purchase.sellerPhone,
                purchase.date,
                purchase.notes
            ].join(" ").toLowerCase();

            return searchableText.includes(searchTerm);
        }
    );
 
        if (!allPhonePurchaseCards.length) { 
 
            purchasesList.innerHTML = ` 
 
                <div class="empty-state"> 
 
                    <div style="font-size:45px;"> 
                        🛒 
                    </div> 
 
                    <h3> 
                        لا توجد مشتريات 
                    </h3> 
 
                    <p> 
                        اضغط على "إضافة موبايل مشتريات" 
                        لإضافة أول جهاز. 
                    </p> 
 
                </div> 
 
            `; 
 
            return; 
        } 
 
        if (!filteredPurchases.length) {
            purchasesList.innerHTML = '<div class="empty-state"><div style="font-size:38px">🔎</div><h3>لا توجد نتائج مطابقة</h3><p>جرّب البحث باسم أو سيريال أو اسم البائع.</p></div>';
            return;
        }

        purchasesList.innerHTML = 
           filteredPurchases
    .map(
                    function ( 
                        purchase, 
                        index 
                    ) { 
 
                        return ` 
 
                            <article 
                                class="device-card purchase-card" 
                            > 
 
                                <div 
                                    class="device-card-top" 
                                    style=" 
                                        display:flex; 
                                        align-items:center; 
                                        justify-content:space-between; 
                                        gap:10px; 
                                        flex-wrap:wrap; 
                                    " 
                                > 
 
                                    <div class="device-number">#${index + 1}</div>
                                    <div class="purchase-completion-status ${isPhonePurchaseComplete(purchase) ? "is-complete" : "is-incomplete"}">
                                        ${isPhonePurchaseComplete(purchase) ? "✓ البيانات مكتملة" : "⚠ البيانات غير مكتملة — افتح التعديل لاستكمالها"}
                                    </div> 
 
                                    <div 
                                        class="device-actions" 
                                        style=" 
                                            display:flex; 
                                            align-items:center; 
                                            gap:6px; 
                                            flex-wrap:wrap; 
                                        " 
                                    > 
 
                                        <button 
                                            type="button" 
                                            class="purchase-edit-button" 
                                            data-id="${escapeHTML(purchase.cardId || purchase.id)}" 
                                            title="تعديل واستكمال بيانات المشتريات" 
                                        > 
                                            ${isPhonePurchaseComplete(purchase) ? "✏️ تعديل" : "✏️ استكمال البيانات"} 
                                        </button> 
 
                                        <button type="button" class="purchase-transfer-button" data-transfer-purchase="${escapeHTML(purchase.cardId || purchase.id)}">➡️ نقل إلى بيع التلفونات</button>
                                        <button 
                                            type="button" 
                                            class="purchase-print-button" 
                                            data-id="${escapeHTML(purchase.cardId || purchase.id)}" 
                                            title="طباعة المشتريات" 
                                        > 
                                            🖨️ طباعة 
                                        </button> 
 
                                        <button 
                                            type="button" 
                                            class="purchase-delete-button" 
                                            data-id="${escapeHTML(purchase.cardId || purchase.id)}" 
                                            title="حذف المشتريات" 
                                        > 
                                            🗑️ حذف 
                                        </button> 
 
                                    </div> 
 
                                </div> 
 
                                <div 
                                    class="device-card-icon" 
                                    style=" 
                                        font-size:38px; 
                                        margin:14px 0; 
                                    " 
                                > 
                                    🛒 
                                </div> 
 
                                ${purchase.photo ? `<img class="purchase-device-photo" src="${purchase.photo}" alt="صورة الجهاز">` : ""}
                                <div class="device-info purchase-detail-row"><strong>حالة الكرتونة:</strong> <span>${purchase.boxIncluded === false ? "بدون كرتونة" : "معاه كرتونة"}</span></div>
                                <h3> 
                                    ${escapeHTML( 
                                        purchase.phoneName || "" 
                                    )} 
                                </h3> 
 
                                ${ 
                                    purchase.serial 
                                        ? ` 
 
                                            <div class="device-info"> 
 
                                                🔢 
 
                                                ${escapeHTML( 
                                                    purchase.serial 
                                                )} 
 
                                            </div> 
 
                                        ` 
                                        : "" 
                                } 
 
                                ${ 
                                    purchase.sellerName 
                                        ? ` 
 
                                            <div class="device-info"> 
 
                                                👤 
 
                                                ${escapeHTML( 
                                                    purchase.sellerName 
                                                )} 
 
                                            </div> 
 
                                        ` 
                                        : "" 
                                } 
 
                                ${ 
                                    purchase.sellerPhone 
                                        ? ` 
 
                                            <div class="device-info"> 
 
                                                📞 
 
                                                ${escapeHTML( 
                                                    purchase.sellerPhone 
                                                )} 
 
                                            </div> 
                                        ` 
                                        : "" 
                                } 
 
                                ${ 
                                    purchase.price 
                                        ? ` 
 
                                            <div class="device-price"> 
 
                                                💰 
 
                                                ${formatMoney( 
                                                    purchase.price 
                                                )} 
 
                                            </div> 
 
                                        ` 
                                        : "" 
                                } 
 
                                ${Number(purchase.quantity || 1) > 1 ? `<div class="device-info purchase-detail-row"><strong>الكمية:</strong> <span>${Number(purchase.quantity).toLocaleString("ar-EG")}</span></div>` : ""}

                                ${ 
                                    purchase.date 
                                        ? ` 
 
                                            <div class="device-info"> 
 
                                                📅 
 
                                                ${escapeHTML( 
                                                    purchase.date 
                                                )} 
 
                                            </div> 
 
                                        ` 
                                        : "" 
                                } 
 
                                ${ 
                                    purchase.notes 
                                        ? ` 
 
                                            <div class="device-notes"> 
 
                                                📝 
 
                                                ${escapeHTML( 
                                                    purchase.notes 
                                                )} 
 
                                            </div> 
 
                                        ` 
                                        : "" 
                                } 
 
                            </article> 
 
                        `; 
 
                    } 
                ) 
                .join(""); 
 
        attachPurchaseEvents(); 
 
    } 
 
    function attachPurchaseEvents() { 
 
        if (!purchasesList) { 
            return; 
        } 
 
        purchasesList 
            .querySelectorAll( 
                ".purchase-edit-button" 
            ) 
            .forEach( 
                function (button) { 
 
                    button.addEventListener( 
                        "click", 
                        function () { 
 
                            const id = 
                                this.dataset.id; 
 
                            const purchase = findPhonePurchaseCard(id); 
 
                            if (!purchase) { 
 
                                alert( 
                                    "المشتريات غير موجودة ❌" 
                                ); 
 
                                return; 
 
                            } 
 
                            const phone = 
                                document.getElementById( 
                                    "purchase-phone-name" 
                                ); 
 
                            const serial = 
                                document.getElementById( 
                                    "purchase-serial" 
                                ); 
 
                            const seller = 
                                document.getElementById( 
                                    "purchase-seller-name" 
                                ); 
 
                            const sellerPhone = 
                                document.getElementById( 
                                    "purchase-seller-phone" 
                                ); 
 
                            const price = 
                                document.getElementById( 
                                    "purchase-price" 
                                ); 
 
                            const date = 
                                document.getElementById( 
                                    "purchase-date" 
                                ); 
 
                            const notes = 
                                document.getElementById( 
                                    "purchase-notes" 
                                ); 
 
                            if (phone) { 
                                phone.value = 
                                    purchase.phoneName || ""; 
                            } 
 
                            if (serial) { 
                                serial.value = 
                                    purchase.serial || ""; 
                            } 
 
                            if (seller) { 
                                seller.value = 
                                    purchase.sellerName || ""; 
                            } 
 
                            if (sellerPhone) { 
                                sellerPhone.value = 
                                    purchase.sellerPhone || ""; 
                            } 
 
                            if (price) { 
                                price.value = 
                                    purchase.price || ""; 
                            } 
 
                            if (date) { 
                                date.value = 
                                    purchase.date || ""; 
                            } 
 
                            if (notes) { 
                                notes.value = 
                                    purchase.notes || ""; 
                            }
                            const box = document.getElementById("purchase-box-included");
                            const photo = document.getElementById("purchase-device-photo");
                            const preview = document.getElementById("purchase-device-photo-preview");
                            if (box) box.value = purchase.boxIncluded === false ? "no" : "yes";
                            if (photo) photo.dataset.imageData = purchase.photo || "";
                            if (preview) { preview.src = purchase.photo || ""; preview.style.display = purchase.photo ? "block" : "none"; } 
 
                            editingPurchaseId = purchase.source === "independent"
                                ? "independent:" + String(purchase.independentId)
                                : purchase.id; 
 
                            if (purchaseForm) { 
 
                                purchaseForm.style.display = 
                                    "block"; 
 
                                purchaseForm.scrollIntoView({ 
                                    behavior: "smooth", 
                                    block: "center" 
                                }); 
 
                            } 
 
                            if (savePurchaseButton) { 
 
                                savePurchaseButton.textContent = 
                                    "💾 حفظ التعديل"; 
 
                            } 
 
                        } 
                    ); 
 
                } 
            ); 
 
        purchasesList 
            .querySelectorAll( 
                ".purchase-print-button" 
            ) 
            .forEach( 
                function (button) { 
 
                    button.addEventListener( 
                        "click", 
                        function () { 
 
                            const id = 
                                this.dataset.id; 
 
                            printPhonePurchase(id); 
 
                        } 
                    ); 
 
                } 
            ); 
 
        purchasesList 
            .querySelectorAll( 
                ".purchase-delete-button" 
            ) 
            .forEach( 
                function (button) { 
 
                    button.addEventListener( 
                        "click", 
                        function () { 
 
                            const id = 
                                this.dataset.id; 
 
                            const confirmed = 
                                confirm( 
                                    currentLanguage === "ar" 
                                        ? "هل تريد حذف هذه المشتريات؟" 
                                        : "Delete this purchase?" 
                                ); 
 
                            if (!confirmed) { 
                                return; 
                            } 
 
                            if (String(id).startsWith("independent:")) {
                                if (!deleteIndependentPhonePurchase(id)) return;
                            } else {
                                const removedPurchase = phonePurchases.find(purchase => String(purchase.id) === String(id));
                                if (removedPurchase) window.actPhoneInventoryRemovePurchase?.("phone", removedPurchase);
                                phonePurchases = phonePurchases.filter(purchase => String(purchase.id) !== String(id));
                                savePhonePurchases();
                            }
                            renderPhonePurchases();
                        } 
                    ); 
 
                } 
            ); 
 
    } 
 
    // إعادة تحميل مشتريات الحساب الصحيح بعد اكتمال المزامنة.
    window.addEventListener("act-purchases-data-updated", function () {
        renderPhonePurchases();
        updateActPurchaseDashboard();
    });

    window.addEventListener("act-user-data-ready", function () {
        try {
            const key = getPhonePurchasesStorageKey();
            const storedData = localStorage.getItem(key);
            const parsedData = storedData ? JSON.parse(storedData) : [];
            phonePurchases = Array.isArray(parsedData) ? parsedData : [];
            renderPhonePurchases();
            updateActPurchaseDashboard();
            console.log("ACT Phone Purchases Loaded:", key, phonePurchases.length);
        } catch (error) {
            console.error("Phone purchases reload error:", error);
            phonePurchases = [];
            renderPhonePurchases();
            updateActPurchaseDashboard();
        }
    });


    function printPhonePurchase(id) { 
 
        const purchase = findPhonePurchaseCard(id); 
 
        if (!purchase) { 
 
            alert( 
                "المشتريات غير موجودة ❌" 
            ); 
 
            return; 
 
        } 
 
        const printWindow = 
            window.open( 
                "", 
                "_blank", 
                "width=800,height=700" 
            ); 
 
        if (!printWindow) { 
 
            alert( 
                "لم يتم فتح نافذة الطباعة. اسمح بالنوافذ المنبثقة من المتصفح." 
            ); 
 
            return; 
 
        } 
 
        const phoneName = 
            escapeHTML( 
                purchase.phoneName || "-" 
            ); 
 
        const serial = 
            escapeHTML( 
                purchase.serial || "-" 
            ); 
 
        const sellerName = 
            escapeHTML( 
                purchase.sellerName || "-" 
            ); 
 
        const sellerPhone = 
            escapeHTML( 
                purchase.sellerPhone || "-" 
            ); 
 
        const price = 
            purchase.price 
                ? formatMoney( 
                    purchase.price 
                ) 
                : "-"; 
 
        const date = 
            escapeHTML( 
                purchase.date || "-" 
            ); 
 
        const notes = 
            escapeHTML( 
                purchase.notes || "-" 
            ); 
 
        printWindow.document.write(` 
 
            <!DOCTYPE html> 
 
            <html 
                lang="ar" 
                dir="rtl" 
            > 
 
            <head> 
 
                <meta charset="UTF-8"> 
 
                <title> 
                    فاتورة شراء - ${phoneName} 
                </title> 
 
                <style> 
 
                    * { 
                        box-sizing:border-box; 
                    } 
 
                    body { 
 
                        margin:0; 
 
                        padding:30px; 
 
                        background:#fff; 
 
                        color:#111; 
 
                        font-family: 
                            Arial, 
                            Tahoma, 
                            sans-serif; 
 
                        direction:rtl; 
 
                    } 
 
                    .print-container { 
 
                        max-width:700px; 
 
                        margin:auto; 
 
                        border:1px solid #ddd; 
 
                        border-radius:16px; 
 
                        padding:25px; 
 
                    } 
 
                    .print-header { 
 
                        text-align:center; 
 
                        border-bottom: 
                            2px solid #222; 
 
                        padding-bottom:18px; 
 
                        margin-bottom:20px; 
 
                    } 
 
                    .print-header h1 { 
 
                        margin:0 0 8px; 
 
                        font-size:25px; 
 
                    } 
 
                    .print-header p { 
 
                        margin:0; 
 
                        color:#666; 
 
                        font-size:13px; 
 
                    } 
 
                    .purchase-title { 
 
                        text-align:center; 
 
                        font-size:20px; 
 
                        font-weight:bold; 
 
                        margin-bottom:20px; 
 
                    } 
 
                    .info-row { 
 
                        display:flex; 
 
                        justify-content:space-between; 
 
                        gap:20px; 
 
                        padding:12px 0; 
 
                        border-bottom: 
                            1px solid #eee; 
 
                    } 
 
                    .info-label { 
 
                        font-weight:bold; 
 
                        color:#444; 
 
                    } 
 
                    .info-value { 
 
                        text-align:left; 
 
                        color:#111; 
 
                        word-break:break-word; 
 
                    } 
 
                    .price { 
 
                        font-size:20px; 
 
                        font-weight:bold; 
 
                    } 
 
                    .notes { 
 
                        margin-top:20px; 
 
                        padding:15px; 
 
                        background:#f5f5f5; 
 
                        border-radius:10px; 
 
                    } 
 
                    .footer { 
 
                        margin-top:25px; 
 
                        padding-top:15px; 
 
                        border-top: 
                            1px solid #ddd; 
 
                        text-align:center; 
 
                        color:#777; 
 
                        font-size:11px; 
 
                    } 
 
                    @media print { 
 
                        body { 
                            padding:0; 
                        } 
 
                        .print-container { 
                            border:0; 
                            max-width:none; 
                        } 
 
                    } 
 
                
/* auto light layer */

:where(html[data-theme="light"]) .print-header {
  border-bottom: 2px solid #bebebe;
}
:where(html[data-theme="light"]) .footer {
  color: #949494;
}</style> 
 
            </head> 
 
            <body> 
 
                <div class="print-container"> 
 
                    <div class="print-header"> 
 
                        <h1> 
                            ACT PHONE MANAGER 
                        </h1> 
 
                        <p> 
                           إدارة متكاملة.. لخدمة أسرع وأدق 
                        </p> 
 
                    </div> 
 
                    <div class="purchase-title"> 
 
                        🛒 فاتورة شراء موبايل 
 
                    </div> 
 
                    <div class="info-row"> 
 
                        <span class="info-label"> 
                            اسم الجهاز 
                        </span> 
 
                        <span class="info-value"> 
                            ${phoneName} 
                        </span> 
 
                    </div> 
 
                    <div class="info-row"> 
 
                        <span class="info-label"> 
                            السيريال 
                        </span> 
 
                        <span class="info-value"> 
                            ${serial} 
                        </span> 
 
                    </div> 
 
                    <div class="info-row"> 
 
                        <span class="info-label"> 
                            اسم البائع 
                        </span> 
 
                        <span class="info-value"> 
                            ${sellerName} 
                        </span> 
 
                    </div> 
 
                    <div class="info-row"> 
 
                        <span class="info-label"> 
                            رقم البائع 
                        </span> 
 
                        <span class="info-value"> 
                            ${sellerPhone} 
                        </span> 
 
                    </div> 
 
                    <div class="info-row"> 
 
                        <span class="info-label"> 
                            سعر الشراء 
                        </span> 
 
                        <span class="info-value price"> 
                            ${price} 
                        </span> 
 
                    </div> 
 
                    <div class="info-row"> 
 
                        <span class="info-label"> 
                            تاريخ الشراء 
                        </span> 
 
                        <span class="info-value"> 
                            ${date} 
                        </span> 
 
                    </div> 
 
                    <div class="notes"> 
 
                        <strong> 
                            📝 الملاحظات 
                        </strong> 
 
                        <div style="margin-top:8px;"> 
                            ${notes} 
                        </div> 
 
                    </div> 
 
                    <div class="footer"> 
 
                        تم إنشاء المستند بواسطة 
                        ACT PHONE MANAGER 
 
                    </div> 
 
                </div> 
 
                <script> 
 
                    window.onload = function () { 
 
                        window.print(); 
 
                    }; 
 
                <\/script> 
 
            </body> 
 
            </html> 
 
        `); 
 
        printWindow.document.close(); 
 
    } 
 
    function savePhonePurchase() { 
 
        const phone = 
            document.getElementById( 
                "purchase-phone-name" 
            ); 
 
        const serial = 
            document.getElementById( 
                "purchase-serial" 
            ); 
 
        const seller = 
            document.getElementById( 
                "purchase-seller-name" 
            ); 
 
        const sellerPhone = 
            document.getElementById( 
                "purchase-seller-phone" 
            ); 
 
        const price = 
            document.getElementById( 
                "purchase-price" 
            ); 
 
        const date = 
            document.getElementById( 
                "purchase-date" 
            ); 
 
        const notes = 
            document.getElementById("purchase-notes");
        const boxIncluded = document.getElementById("purchase-box-included");
        const photoInput = document.getElementById("purchase-device-photo");
        const photoData = photoInput?.dataset.imageData || ""; 
 
        const phoneName = 
            phone 
                ? phone.value.trim() 
                : ""; 
 
        const sellerName = 
            seller 
                ? seller.value.trim() 
                : ""; 
 
        const hasAnyPurchaseData = Boolean(
            phoneName ||
            (serial && serial.value.trim()) ||
            sellerName ||
            (sellerPhone && sellerPhone.value.trim()) ||
            (price && price.value.trim()) ||
            (notes && notes.value.trim())
        );

        if (!hasAnyPurchaseData) {
            alert("أدخل أي معلومة عن الجهاز على الأقل حتى تحفظ مسودة الشراء.");
            if (phone) phone.focus();
            return;
        }

        if (editingPurchaseId && String(editingPurchaseId).startsWith("independent:")) {
            const updated = saveIndependentPhonePurchaseFromForm(editingPurchaseId, {
                phoneName,
                serial: serial ? serial.value.trim() : "",
                sellerName,
                sellerPhone: sellerPhone ? sellerPhone.value.trim() : "",
                price: price ? price.value.trim() : "",
                date: date ? date.value : "",
                notes: notes ? notes.value.trim() : "",
                boxIncluded: boxIncluded?.value !== "no",
                photo: photoData || (findPhonePurchaseCard(editingPurchaseId)?.photo || "")
            });
            if (!updated) return;
            editingPurchaseId = null;
            clearPurchaseForm();
            if (purchaseForm) purchaseForm.style.display = "none";
            renderPhonePurchases();
            alert("تم استكمال بيانات عملية الشراء وتحديثها في سجل المشتريات.");
            return;
        }

        if (editingPurchaseId) { 
 
            const purchaseIndex = 
                phonePurchases.findIndex( 
                    function (purchase) { 
 
                        return String( 
                            purchase.id 
                        ) === String( 
                            editingPurchaseId 
                        ); 
 
                    } 
                ); 
 
            if (purchaseIndex === -1) { 
 
                alert( 
                    "المشتريات غير موجودة ❌" 
                ); 
 
                editingPurchaseId = null; 
 
                return; 
 
            } 
 
            const oldPurchase = 
                phonePurchases[ 
                    purchaseIndex 
                ]; 
 
            phonePurchases[ 
                purchaseIndex 
            ] = { 
 
                ...oldPurchase, 
 
                phoneName: 
                    phoneName, 
 
                serial: 
                    serial 
                        ? serial.value.trim() 
                        : "", 
 
                sellerName: 
                    sellerName, 
 
                sellerPhone: 
                    sellerPhone 
                        ? sellerPhone.value.trim() 
                        : "", 
 
                price: 
                    price 
                        ? price.value 
                        : "", 
 
                date: 
                    date 
                        ? date.value 
                        : "", 
 
                notes: 
                    notes 
                        ? notes.value.trim() 
                        : "",
                boxIncluded: boxIncluded?.value !== "no",
                photo: photoData || oldPurchase.photo || "", 
 
                updatedAt: 
                    new Date().toISOString() 
 
            }; 
 
            savePhonePurchases();
            window.actPhoneInventoryUpsertPurchase?.("phone", phonePurchases[purchaseIndex], oldPurchase); 
 
            renderPhonePurchases(); 
 
            clearPurchaseForm(); 
 
            if (purchaseForm) { 
 
                purchaseForm.style.display = 
                    "none"; 
 
            } 
 
            alert( 
                currentLanguage === "ar" 
                    ? "تم تعديل المشتريات بنجاح ✅" 
                    : "Purchase updated successfully." 
            ); 
 
            return; 
 
        } 
 
        const purchase = { 
 
            id: 
                "purchase-" + 
                Date.now(), 
 
            phoneName: 
                phoneName, 
 
            serial: 
                serial 
                    ? serial.value.trim() 
                    : "", 
 
            sellerName: 
                sellerName, 
 
            sellerPhone: 
                sellerPhone 
                    ? sellerPhone.value.trim() 
                    : "", 
 
            price: 
                price 
                    ? price.value 
                    : "", 
 
            date: 
                date 
                    ? date.value 
                    : "", 
 
            notes: 
                notes 
                    ? notes.value.trim() 
                    : "",
            boxIncluded: boxIncluded?.value !== "no",
            photo: photoData, 
 
            createdAt: 
                new Date().toISOString() 
 
        }; 
 
        phonePurchases.unshift( 
            purchase 
        ); 
 
        savePhonePurchases();
        window.actPhoneInventoryUpsertPurchase?.("phone", purchase, null); 
 
        renderPhonePurchases(); 
 
        clearPurchaseForm(); 
 
        if (purchaseForm) { 
 
            purchaseForm.style.display = 
                "none"; 
 
        } 
 
        alert( 
            currentLanguage === "ar" 
                ? "تم حفظ الموبايل في المشتريات بنجاح ✅" 
                : "Purchase saved successfully." 
        ); 
 
    } 
 
    function openSaleTab() { 
 
        saleTab.classList.add("active"); 
 
        purchaseTab.classList.remove("active"); 
 
        if (saleSection) { 
 
            saleSection.style.display = 
                "block"; 
 
        } 
 
        if (purchasesSection) { 
 
            purchasesSection.style.display = 
                "none"; 
 
        } 
 
        if (purchaseForm) { 
 
            purchaseForm.style.display = 
                "none"; 
 
        } 
 
        clearPurchaseForm(); 
 
        if ( 
            typeof renderSaleDevices === 
            "function" 
        ) { 
 
            renderSaleDevices(); 
 
        } 
 
    } 
 
    function openPurchaseTab() { 
 
        saleTab.classList.remove("active"); 
 
        purchaseTab.classList.add("active"); 
 
        if (saleSection) { 
 
            saleSection.style.display = 
                "none"; 
 
        } 
 
        if (purchasesSection) { 
 
            purchasesSection.style.display = 
                "block"; 
 
        } 
 
        if (purchaseForm) { 
 
            purchaseForm.style.display = 
                "none"; 
 
        } 
 
        renderPhonePurchases(); 
 
    } 
 if (purchasesSearchInput) {

    purchasesSearchInput.addEventListener(
        "input",
        function () {
            renderPhonePurchases();
        }
    );

}
 
saleTab.addEventListener(
    "click",
    openSaleTab
);

purchaseTab.addEventListener(
    "click",
    openPurchaseTab
);


 
    if (addPurchaseButton) { 
 
        addPurchaseButton.addEventListener( 
            "click", 
            function () { 
 
                editingPurchaseId = null; 
 
                clearPurchaseForm(); 
 
                if (purchaseForm) { 
 
                    purchaseForm.style.display = 
                        "block"; 
 
                    purchaseForm.scrollIntoView({ 
                        behavior: "smooth", 
                        block: "center" 
                    }); 
 
                } 
 
                if (savePurchaseButton) { 
 
                    savePurchaseButton.textContent = 
                        "💾 حفظ المشتريات"; 
 
                } 
 
            } 
        ); 
 
    } 
 
    if (closePurchaseButton) { 
 
        closePurchaseButton.addEventListener( 
            "click", 
            function () { 
 
                clearPurchaseForm(); 
 
                if (purchaseForm) { 
 
                    purchaseForm.style.display = 
                        "none"; 
 
                } 
 
            } 
        ); 
 
    } 
 
    if (savePurchaseButton) { 
 
        savePurchaseButton.addEventListener( 
            "click", 
            savePhonePurchase 
        ); 
 
    } 
 
    const purchasePhotoInput = document.getElementById("purchase-device-photo");
    const purchasePhotoPreview = document.getElementById("purchase-device-photo-preview");
    purchasePhotoInput?.addEventListener("change", function () {
        const file = this.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { alert("اختر صورة صالحة."); return; }
        const reader = new FileReader();
        reader.onload = () => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
                canvas.width = Math.round(img.width * scale);
                canvas.height = Math.round(img.height * scale);
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                this.dataset.imageData = canvas.toDataURL("image/jpeg", 0.78);
                if (purchasePhotoPreview) { purchasePhotoPreview.src = this.dataset.imageData; purchasePhotoPreview.style.display = "block"; }
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

    // زر نقل الجهاز من المشتريات إلى المبيعات — يربط مرة واحدة بعد تجهيز عناصر القسم.
    if (purchasesList && purchasesList.dataset.transferHandler !== "1") {
        purchasesList.dataset.transferHandler = "1";
        purchasesList.addEventListener("click", function (event) {
            const target = event.target;
            const button = target && target.closest ? target.closest(".purchase-transfer-button") : null;
            if (!button) return;
            const purchase = findPhonePurchaseCard(button.dataset.transferPurchase);
            if (!purchase || (purchase.source !== "phone" && !(purchase.source === "independent" && purchase.category === "phones"))) {
                alert("يمكن نقل مشتريات التلفونات فقط. مشتريات الإكسسوارات وقطع الغيار تظل في سجل المشتريات.");
                return;
            }
            if (!confirm("نقل الجهاز إلى قسم بيع التلفونات؟")) return;
            const device = {
                id: "device-" + Date.now(),
                phoneName: purchase.phoneName || "",
                serialNumber: purchase.serial || "",
                serial: purchase.serial || "",
                purchasePrice: Number(purchase.price || 0),
                phonePrice: Number(purchase.price || 0),
                sellerName: purchase.sellerName || "",
                sellerPhone: purchase.sellerPhone || "",
                boxIncluded: purchase.boxIncluded !== false,
                photo: purchase.photo || "",
                notes: purchase.notes || "",
                status: "البيع",
                category: SECTIONS.SALE,
                section: "sale",
                date: purchase.date || new Date().toISOString().slice(0, 10),
                createdAt: new Date().toISOString()
            };
            devices.unshift(device);
            if (purchase.source === "independent") {
                if (!deleteIndependentPhonePurchase(purchase.cardId || purchase.id)) {
                    devices = devices.filter(row => String(row.id) !== String(device.id));
                    alert("تعذر إتمام النقل من سجل المشتريات. لم يتم حذف عملية الشراء.");
                    return;
                }
                // deleteIndependentPhonePurchase handles inventory removal using the canonical stored record.
            } else {
                phonePurchases = phonePurchases.filter(function (row) {
                    return String(row.id) !== String(purchase.id);
                });
                savePhonePurchases();
                window.actPhoneInventoryRemovePurchase?.("phone", purchase);
            }
            saveDevices();
            renderPhonePurchases();
            if (typeof renderSaleDevices === "function") renderSaleDevices();
            if (typeof addNotificationFromOperation === "function") {
                addNotificationFromOperation({
                    type: "phone-transfer",
                    icon: "📱",
                    title: "تم نقل جهاز للمبيعات",
                    details: device.phoneName
                });
            }
            alert("تم نقل الجهاز إلى بيع التلفونات.");
        });
    }

    openSaleTab(); 
 
}); 
 
// ====================================================== 
// 💳 ACT WALLET — CLOSE BUTTON 
// ====================================================== 
 
const walletCloseButton = 
    document.getElementById("wallet-close-button"); 
 
if (walletCloseButton) { 
 
    walletCloseButton.addEventListener("click", function () { 
 
        const walletSection = 
            document.getElementById("wallet-section"); 
 
        if (walletSection) { 
            walletSection.style.display = "none"; 
        } 
 
        const operationView = 
            document.getElementById("wallet-operation-view"); 
 
        if (operationView) { 
            operationView.style.display = "none"; 
        } 
 
        const operationsGrid = 
            document.querySelector( 
                "#wallet-section .wallet-operations-grid" 
            ); 
 
        if (operationsGrid) { 
            operationsGrid.style.display = "grid"; 
        } 
 
        const moreButton = 
            document.getElementById("nav-more"); 
 
        if (moreButton) { 
            moreButton.click(); 
        } 
 
    }); 
 
} 
 
// ====================================================== 
// 💳 ACT WALLET — AUTO BALANCE CALCULATOR 
// ====================================================== 
 
function renderWalletRecentPreview() {
    const target = document.getElementById("wallet-recent-transactions");
    if (!target) return;
    const uid = typeof currentUser !== "undefined" && currentUser?.uid ? currentUser.uid : "guest";
    const ops = ["deposit", "withdraw", "recharge", "bills", "transfer"];
    const rows = [];
    ops.forEach(op => {
        try {
            const data = JSON.parse(localStorage.getItem(`actPhoneManager_wallet_transactions_${op}_${uid}`) || "[]");
            if (Array.isArray(data)) rows.push(...data.map(x => ({...x, operation: x.operation || op})));
        } catch (e) { console.warn("Wallet preview read failed", op, e); }
    });
    rows.sort((a,b) => Number(b.createdAt || new Date(b.date || 0).getTime() || 0) - Number(a.createdAt || new Date(a.date || 0).getTime() || 0));
    const recent = rows.slice(0,4);
    const money = n => Number(n || 0).toLocaleString("ar-EG", {minimumFractionDigits:2,maximumFractionDigits:2}) + " ج.م";
    if (!recent.length) { target.innerHTML = '<div class="wallet-recent-empty">لا توجد عمليات مسجلة حتى الآن.</div>'; return; }
    target.innerHTML = recent.map(t => {
        const deposit = t.operation === "deposit";
        const title = t.operationName || ({deposit:"إيداع",withdraw:"سحب",recharge:"شحن",bills:"فواتير",transfer:"تحويل"}[t.operation] || "عملية محفظة");
        const date = new Date(t.createdAt || t.date || Date.now());
        const stamp = Number.isNaN(date.getTime()) ? "" : date.toLocaleString("ar-EG", {dateStyle:"medium",timeStyle:"short"});
        return `<article class="wallet-recent-row"><span class="wallet-recent-icon ${deposit?'is-deposit':t.operation==='withdraw'?'is-withdraw':'is-service'}">${deposit?'↗':t.operation==='withdraw'?'↘':'↔'}</span><span class="wallet-recent-info"><b>${escapeHTML(title)}</b><small>${escapeHTML(t.service || t.account || "عملية مسجلة")} · ${escapeHTML(stamp)}</small></span><strong class="${deposit?'positive':t.operation==='withdraw'?'negative':''}">${deposit?'+':t.operation==='withdraw'?'−':''}${money(t.amount)}</strong><span class="wallet-recent-status">تم</span></article>`;
    }).join("");
}

function updateWalletBalanceSummary() { 
 
    const currentBalanceElement = 
        document.getElementById("wallet-current-balance"); 
 
    const totalWithdrawElement = 
        document.getElementById("wallet-total-withdraw"); 
 
    const totalDepositElement = 
        document.getElementById("wallet-total-deposit"); 
 
    const afterWithdrawElement = 
        document.getElementById("wallet-balance-after-withdraw"); 
 
    const afterDepositElement = 
        document.getElementById("wallet-balance-after-deposit"); 
 
    if (!currentBalanceElement || !totalWithdrawElement || !totalDepositElement) return; 
 
    let userId = "guest"; 
 
    if ( 
        typeof currentUser !== "undefined" && 
        currentUser && 
        currentUser.uid 
    ) { 
        userId = currentUser.uid; 
    } 
 
    let totalWithdraw = 0; 
    let totalDeposit = 0; 
 
    try { 
 
        const withdrawKey = 
            "actPhoneManager_wallet_transactions_withdraw_" + 
            userId; 
 
        const withdrawData = 
            JSON.parse( 
                localStorage.getItem(withdrawKey) || "[]" 
            ); 
 
        if (Array.isArray(withdrawData)) { 
 
            totalWithdraw = 
                withdrawData.reduce( 
                    function (total, transaction) { 
 
                        return ( 
                            total + 
                            Number(transaction.amount || 0) 
                        ); 
 
                    }, 
                    0 
                ); 
 
        } 
 
    } catch (error) { 
 
        console.error( 
            "Wallet withdraw balance error:", 
            error 
        ); 
 
    } 
 
    try { 
 
        const depositKey = 
            "actPhoneManager_wallet_transactions_deposit_" + 
            userId; 
 
        const depositData = 
            JSON.parse( 
                localStorage.getItem(depositKey) || "[]" 
            ); 
 
        if (Array.isArray(depositData)) { 
 
            totalDeposit = 
                depositData.reduce( 
                    function (total, transaction) { 
 
                        return ( 
                            total + 
                            Number(transaction.amount || 0) 
                        ); 
 
                    }, 
                    0 
                ); 
 
        } 
 
    } catch (error) { 
 
        console.error( 
            "Wallet deposit balance error:", 
            error 
        ); 
 
    } 
 
    const currentBalance = 
        totalDeposit - totalWithdraw; 
 
    function formatMoney(amount) { 
 
        return ( 
            Number(amount || 0).toLocaleString( 
                "ar-EG", 
                { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                } 
            ) + 
            " ج.م" 
        ); 
 
    } 
 
    totalWithdrawElement.textContent = 
        formatMoney(totalWithdraw); 
 
    totalDepositElement.textContent = 
        formatMoney(totalDeposit); 
 
    currentBalanceElement.innerHTML = Number(currentBalance || 0).toLocaleString("ar-EG", {minimumFractionDigits:2, maximumFractionDigits:2}) + " <small>جنيه</small>"; 
 
    if (afterWithdrawElement) afterWithdrawElement.textContent = formatMoney(currentBalance);
    if (afterDepositElement) afterDepositElement.textContent = formatMoney(currentBalance);
    renderWalletRecentPreview(); 
 
} 
 
updateWalletBalanceSummary();
function actWalletRefreshAll() {
    try { updateWalletBalanceSummary(); } catch (e) { console.warn("wallet summary", e); }
    try { renderWalletTransactions(document.getElementById("wallet-section")); } catch (e) { console.warn("wallet log", e); }
}
window.addEventListener("act-user-data-ready", actWalletRefreshAll);
window.addEventListener("act-wallet-data-updated", actWalletRefreshAll);
(function watchWalletOpen() {
    const w = document.getElementById("wallet-section");
    if (!w || typeof MutationObserver === "undefined") return;
    let was = w.style.display !== "none";
    new MutationObserver(function () {
        const now = w.style.display !== "none";
        if (now && !was) actWalletRefreshAll();
        was = now;
    }).observe(w, { attributes: true, attributeFilter: ["style"] });
})();
actWalletRefreshAll();
const walletShowAllButton = document.getElementById("wallet-show-all-transactions");
if (walletShowAllButton) walletShowAllButton.addEventListener("click", function () {
    const area = document.getElementById("wallet-transactions-area");
    if (area) area.scrollIntoView({behavior:"smooth",block:"start"});
});

 // ======================================================
 // 🔒 فتح صفحة إقفال اليوم
 // ======================================================

const moreDayClose = document.getElementById("more-day-close");
const dayCloseSection = document.getElementById("day-close-section");
const dayCloseBackButton = document.getElementById("day-close-back-button");

if (dayCloseBackButton) {
    dayCloseBackButton.onclick = function () {
        if (dayCloseSection) {
            dayCloseSection.style.display = "none";
        }

        if (mainPage) {
            mainPage.style.display = "block";
        }

        if (moreSection) {
            moreSection.style.display = "block";
        }
    };
}const mainPage = document.getElementById("main-page");
const walletSection = document.getElementById("wallet-section");
const moreSection = document.getElementById("more-section");

// ======================================================
// فتح إقفال اليوم
// ======================================================

if (moreDayClose) {
    moreDayClose.addEventListener("click", function () {

        if (mainPage) {
mainPage.style.display = "block";        }

        if (moreSection) {
            moreSection.style.display = "none";
        }

        if (walletSection) {
            walletSection.style.display = "none";
            walletSection.dataset.logFilter = "";
            walletSection.querySelectorAll(".wallet-operation-card.is-active").forEach(function (c) { c.classList.remove("is-active"); });
        }

        if (dayCloseSection) {
            dayCloseSection.style.display = "block";
        }

        const dateElement = document.getElementById("day-close-current-date");

        if (dateElement) {
            const today = new Date();

            dateElement.textContent = today.toLocaleDateString("ar-EG", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
        }

        ensurePreviousDaysClosed();
        renderDayCloseCurrentSummary();
        renderPreviousDays();
    });
}

// ======================================================
// زر الرجوع من إقفال اليوم
// ======================================================

if (dayCloseBackButton) {
    dayCloseBackButton.addEventListener("click", function () {

        if (dayCloseSection) {
            dayCloseSection.style.display = "none";
        }

        if (mainPage) {
            mainPage.style.display = "block";
        }
    });
}

/* ======================================================
   ACT PHONE MANAGER — PREMIUM ACCOUNT PROFILE
   عرض البيانات بعد الحفظ + تعديل عند الطلب
====================================================== */

(function initAccountProfile() {
    "use strict";

    const form = document.getElementById("account-profile-form");
    const photoInput = document.getElementById("account-photo-input");
    const photoPreview = document.getElementById("account-photo-preview");
    const resetButton = document.getElementById("account-reset-button");
    const logoutButton = document.getElementById("account-logout-button");
    const birthDateInput = document.getElementById("account-birth-date");
    const ageInput = document.getElementById("account-age");
    const profileCard = document.querySelector(
        "#account-section .account-profile-card"
    );

    if (!form || !photoPreview || !profileCard) {
        console.warn("Account profile elements were not found.");
        return;
    }

    const section = document.getElementById("account-section");

    const fieldIds = [
        "account-full-name",
        "account-nickname",
        "account-birth-date",
        "account-gender",
        "account-job",
        "account-phone",
        "account-country",
        "account-city",
        "account-address",
        "account-workplace",
        "account-website",
        "account-bio"
    ];

    const fieldLabels = {
        "account-full-name": "الاسم الكامل",
        "account-nickname": "اسم الشهرة",
        "account-birth-date": "تاريخ الميلاد",
        "account-gender": "النوع",
        "account-job": "الوظيفة",
        "account-phone": "رقم الهاتف",
        "account-country": "الدولة",
        "account-city": "المدينة",
        "account-address": "العنوان",
        "account-workplace": "جهة العمل",
        "account-website": "الموقع الإلكتروني",
        "account-bio": "نبذة عنك"
    };

    let activeUser = null;
    let selectedPhoto = "";
    let originalProfile = {};
    let hasSavedProfile = false;
    let authListenerStarted = false;

    const defaultPhoto =
        photoPreview.dataset.defaultPhoto ||
        photoPreview.getAttribute("src") ||
        "";

    // ==================================================
    // إنشاء تنسيق وضع العرض
    // ==================================================

    if (!document.getElementById("account-view-mode-styles")) {
        const style = document.createElement("style");
        style.id = "account-view-mode-styles";

        style.textContent = `
            #account-section .account-view-mode {
                display: grid;
                gap: 16px;
                margin: 0 0 18px;
            }

            #account-section .account-view-group {
                padding: 20px;
                background: #1a1a1a;
                border: 1px solid #444444;
                border-radius: 14px;
            }

            #account-section .account-view-group h3 {
                margin: 0 0 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid #444444;
                color: #e4e6eb;
                font-size: 16px;
            }

            #account-section .account-view-grid {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 12px;
            }

            #account-section .account-view-item {
                min-width: 0;
                padding: 13px;
                background: #131313;
                border: 1px solid #3f3f3f;
                border-radius: 9px;
            }

            #account-section .account-view-item.account-view-wide {
                grid-column: 1 / -1;
            }

            #account-section .account-view-label {
                display: block;
                margin-bottom: 7px;
                color: #e4e6eb;
                font-size: 12px;
            }

            #account-section .account-view-value {
                display: block;
                color: #e4e6eb;
                font-size: 14px;
                line-height: 1.8;
                overflow-wrap: anywhere;
                white-space: pre-wrap;
            }

            #account-section .account-view-value a {
                color: #e4e6eb;
                overflow-wrap: anywhere;
            }

            #account-section .account-view-empty {
                padding: 20px;
                border: 1px dashed #4b4b4b;
                border-radius: 10px;
                color: #e4e6eb;
                text-align: center;
                line-height: 1.9;
            }

            #account-section .account-edit-profile-button {
                width: 100%;
                min-height: 48px;
                padding: 12px 18px;
                border: 0;
                border-radius: 10px;
                background: #0284c7;
                color: white;
                font: inherit;
                font-weight: 800;
                cursor: pointer;
                transition: background 0.2s ease;
            }

            #account-section .account-edit-profile-button:hover {
                background: #0ea5e9;
            }

            #account-section .account-view-mode[hidden],
            #account-section #account-profile-form[hidden] {
                display: none !important;
            }

            @media (max-width: 600px) {
                #account-section .account-view-group {
                    padding: 15px;
                }

                #account-section .account-view-grid {
                    grid-template-columns: minmax(0, 1fr);
                }

                #account-section .account-view-item.account-view-wide {
                    grid-column: auto;
                }
            }
        
/* auto light layer */

:where(html[data-theme="light"]) #account-section .account-view-group {
  background: #eeeeee;
  border: 1px solid #b1b1b1;
}
:where(html[data-theme="light"]) #account-section .account-view-group h3 {
  border-bottom: 1px solid #b1b1b1;
  color: #303540;
}
:where(html[data-theme="light"]) #account-section .account-view-item {
  background: #f2f2f2;
  border: 1px solid #b3b3b3;
}
:where(html[data-theme="light"]) #account-section .account-view-label {
  color: #303540;
}
:where(html[data-theme="light"]) #account-section .account-view-value {
  color: #303540;
}
:where(html[data-theme="light"]) #account-section .account-view-value a {
  color: #303540;
}
:where(html[data-theme="light"]) #account-section .account-view-empty {
  border: 1px dashed #aeaeae;
  color: #303540;
}`;

        document.head.appendChild(style);
    }

    // ==================================================
    // تجهيز واجهة عرض البيانات وزر التعديل
    // ==================================================

    const viewContainer = document.createElement("div");
    viewContainer.className = "account-view-mode";
    viewContainer.hidden = true;

    profileCard.insertAdjacentElement("afterend", viewContainer);

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "account-edit-profile-button";
    editButton.textContent = "✏️ تعديل بياناتي";

    viewContainer.appendChild(editButton);

    // ==================================================
    // Firebase / Google
    // ==================================================

    function getProviderData() {
        if (!activeUser || !Array.isArray(activeUser.providerData)) {
            return [];
        }

        return activeUser.providerData;
    }

    function getFirebaseValue(property) {
        if (!activeUser) return "";

        if (activeUser[property]) {
            return activeUser[property];
        }

        for (const provider of getProviderData()) {
            if (provider && provider[property]) {
                return provider[property];
            }
        }

        return "";
    }

    function getFirebasePhoto() {
        return getFirebaseValue("photoURL") || defaultPhoto;
    }

    function getProfileKey() {
        return activeUser && activeUser.uid
            ? "actPhoneManager_account_profile_" + activeUser.uid
            : "actPhoneManager_account_profile_guest";
    }

    // ==================================================
    // قراءة وحفظ الملف الشخصي
    // ==================================================

    function readProfile() {
        try {
            const raw = localStorage.getItem(getProfileKey());

            if (!raw) return {};

            const parsed = JSON.parse(raw);

            return parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
                ? parsed
                : {};
        } catch (error) {
            console.error("Account profile read error:", error);
            return {};
        }
    }

    function getAutomaticProfile() {
        return {
            "account-full-name": getFirebaseValue("displayName") || "",
            "account-phone": getFirebaseValue("phoneNumber") || "",
            photo: ""
        };
    }

    function getFieldValues() {
        const data = {};

        fieldIds.forEach(function (id) {
            const field = document.getElementById(id);

            if (field) {
                data[id] = field.value.trim();
            }
        });

        data.photo = selectedPhoto || "";
        return data;
    }

    function setFieldValues(data) {
        const profile = data || {};

        fieldIds.forEach(function (id) {
            const field = document.getElementById(id);

            if (field) {
                field.value =
                    profile[id] !== undefined &&
                    profile[id] !== null
                        ? profile[id]
                        : "";
            }
        });

        selectedPhoto = profile.photo || "";

        photoPreview.src = selectedPhoto || getFirebasePhoto();

        const emailField = document.getElementById("account-email");

        if (emailField) {
            emailField.value = getFirebaseValue("email") || "";
        }

        updateAge();
        updateProfileHeader();
    }

    // ==================================================
    // حساب العمر
    // ==================================================

    function updateAge() {
        if (!birthDateInput || !ageInput) return;

        if (!birthDateInput.value) {
            ageInput.value = "";
            return;
        }

        const birthDate = new Date(
            birthDateInput.value + "T00:00:00"
        );

        const today = new Date();

        if (
            Number.isNaN(birthDate.getTime()) ||
            birthDate > today
        ) {
            ageInput.value = "";
            return;
        }

        let age = today.getFullYear() - birthDate.getFullYear();

        if (
            today.getMonth() < birthDate.getMonth() ||
            (
                today.getMonth() === birthDate.getMonth() &&
                today.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }

        ageInput.value = String(age);
    }

    // ==================================================
    // تحديث رأس الحساب
    // ==================================================

    function updateProfileHeader() {
        const nameField = document.getElementById("account-full-name");
        const nicknameField = document.getElementById("account-nickname");
        const displayName = document.getElementById("account-display-name");
        const displayEmail = document.getElementById("account-display-email");
        const emailField = document.getElementById("account-email");

        const name =
            (nicknameField && nicknameField.value.trim()) ||
            (nameField && nameField.value.trim()) ||
            getFirebaseValue("displayName") ||
            "اسم المستخدم";

        const email = getFirebaseValue("email") || "";

        if (displayName) displayName.textContent = name;

        if (displayEmail) {
            displayEmail.textContent = email || "لا يوجد بريد إلكتروني";
        }

        if (emailField) emailField.value = email;

        const userId = document.getElementById("account-user-id");

        if (userId) {
            userId.textContent =
                activeUser && activeUser.uid
                    ? activeUser.uid
                    : "حساب زائر";
        }

        const createdAt = document.getElementById("account-created-at");
        const creationTime =
            activeUser &&
            activeUser.metadata &&
            activeUser.metadata.creationTime;

        if (createdAt) {
            createdAt.textContent = creationTime
                ? new Date(creationTime).toLocaleDateString("ar-EG")
                : "غير متاح";
        }

        const loginMethod = document.getElementById("account-login-method");

        if (loginMethod) {
            const providers = getProviderData().map(function (item) {
                return item.providerId;
            });

            if (providers.includes("google.com")) {
                loginMethod.textContent = "Google";
            } else if (providers.includes("password")) {
                loginMethod.textContent = "البريد الإلكتروني";
            } else {
                loginMethod.textContent = activeUser ? "طريقة أخرى" : "زائر";
            }
        }
    }

    // ==================================================
    // تنسيق القيم للعرض
    // ==================================================

    function getDisplayValue(id, value) {
        if (!value) return "";

        if (id === "account-gender") {
            const genderLabels = {
                male: "ذكر",
                female: "أنثى",
                other: "أفضل عدم التحديد"
            };

            return genderLabels[value] || value;
        }

        if (id === "account-birth-date") {
            const date = new Date(value + "T00:00:00");

            return Number.isNaN(date.getTime())
                ? value
                : date.toLocaleDateString("ar-EG");
        }

        return value;
    }

    function createViewItem(label, value, wide, website) {
        const item = document.createElement("div");
        item.className = "account-view-item";

        if (wide) {
            item.classList.add("account-view-wide");
        }

        const labelElement = document.createElement("span");
        labelElement.className = "account-view-label";
        labelElement.textContent = label;

        const valueElement = document.createElement("span");
        valueElement.className = "account-view-value";

        if (website && value) {
            try {
                const url = new URL(value);

                if (url.protocol === "http:" || url.protocol === "https:") {
                    const link = document.createElement("a");
                    link.href = url.href;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    link.textContent = value;
                    valueElement.appendChild(link);
                } else {
                    valueElement.textContent = value;
                }
            } catch (error) {
                valueElement.textContent = value;
            }
        } else {
            valueElement.textContent = value;
        }

        item.append(labelElement, valueElement);
        return item;
    }

    // ==================================================
    // بناء واجهة العرض من البيانات المكتوبة فقط
    // ==================================================

    function renderViewMode() {
        viewContainer.replaceChildren();

        const groups = [
            {
                title: "🪪 البيانات الشخصية",
                fields: [
                    "account-full-name",
                    "account-nickname",
                    "account-birth-date",
                    "account-gender",
                    "account-job"
                ]
            },
            {
                title: "📞 بيانات الاتصال",
                fields: [
                    "account-phone",
                    "account-country",
                    "account-city",
                    "account-address"
                ]
            },
            {
                title: "✨ معلومات إضافية",
                fields: [
                    "account-workplace",
                    "account-website",
                    "account-bio"
                ]
            }
        ];

        let visibleItems = 0;

        groups.forEach(function (group) {
            const items = [];

            group.fields.forEach(function (id) {
                const field = document.getElementById(id);

                if (!field) return;

                const rawValue = field.value.trim();

                // لا نعرض أي حقل فارغ.
                if (!rawValue) return;

                const value = getDisplayValue(id, rawValue);

                items.push(
                    createViewItem(
                        fieldLabels[id],
                        value,
                        id === "account-address" ||
                        id === "account-bio" ||
                        id === "account-website",
                        id === "account-website"
                    )
                );
            });

            // العمر محسوب تلقائيًا من تاريخ الميلاد.
            if (
                group.title === "🪪 البيانات الشخصية" &&
                ageInput &&
                ageInput.value.trim() &&
                document.getElementById("account-birth-date").value
            ) {
                items.push(
                    createViewItem(
                        "العمر",
                        ageInput.value + " سنة",
                        false,
                        false
                    )
                );
            }

            if (!items.length) return;

            const groupElement = document.createElement("div");
            groupElement.className = "account-view-group";

            const heading = document.createElement("h3");
            heading.textContent = group.title;

            const grid = document.createElement("div");
            grid.className = "account-view-grid";

            items.forEach(function (item) {
                grid.appendChild(item);
            });

            groupElement.append(heading, grid);
            viewContainer.appendChild(groupElement);

            visibleItems += items.length;
        });

        if (!visibleItems) {
            const empty = document.createElement("div");
            empty.className = "account-view-empty";
            empty.textContent =
                "لسه مفيش بيانات شخصية محفوظة. اضغط على «تعديل بياناتي» لإضافة بياناتك.";
            viewContainer.appendChild(empty);
        }

        // زر التعديل يظهر أسفل بيانات العرض.
        viewContainer.appendChild(editButton);
    }

    // ==================================================
    // التحكم في وضعي العرض والتعديل
    // ==================================================

    function showViewMode() {
        updateAge();
        updateProfileHeader();
        renderViewMode();

        form.hidden = true;
        viewContainer.hidden = false;
    }

    function showEditMode() {
        viewContainer.hidden = true;
        form.hidden = false;
    }

    editButton.addEventListener("click", function () {
        setFieldValues(getFieldValues());
        showEditMode();
    });

    // ==================================================
    // تحميل الملف الشخصي
    // ==================================================

    function loadProfile() {
        const saved = readProfile();
        const automatic = getAutomaticProfile();

        hasSavedProfile = Object.keys(saved).length > 0;

        const merged = Object.assign({}, automatic, saved);

        originalProfile = Object.assign({}, merged);

        setFieldValues(merged);

        if (hasSavedProfile) {
            showViewMode();
        } else {
            showEditMode();
        }
    }

    // ==================================================
    // حفظ البيانات والعودة لوضع العرض
    // ==================================================

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        try {
            updateAge();

            const data = getFieldValues();
const key = getProfileKey();
const value = JSON.stringify(data);

// الحفظ المحلي
localStorage.setItem(key, value);

// الحفظ السحابي
saveUserDataToCloud(key, value);

            originalProfile = Object.assign({}, data);
            hasSavedProfile = true;

            setFieldValues(data);
            showViewMode();

            alert("تم حفظ بيانات حسابك بنجاح.");
        } catch (error) {
            console.error("Account profile save error:", error);

            alert(
                "تعذر حفظ البيانات. قد تكون مساحة التخزين ممتلئة."
            );
        }
    });

    // ==================================================
    // تحديث العمر تلقائيًا
    // ==================================================

    if (birthDateInput) {
        birthDateInput.addEventListener("input", updateAge);
        birthDateInput.addEventListener("change", updateAge);
    }

    // ==================================================
    // تحديث رأس الحساب أثناء الكتابة
    // ==================================================

    ["account-full-name", "account-nickname"].forEach(function (id) {
        const field = document.getElementById(id);

        if (field) {
            field.addEventListener("input", updateProfileHeader);
        }
    });

    // ==================================================
    // رفع صورة شخصية
    // ==================================================

    if (photoInput) {
        photoInput.addEventListener("change", function () {
            const file = photoInput.files && photoInput.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {
                alert("اختر ملف صورة صالحًا.");
                photoInput.value = "";
                return;
            }

            if (file.size > 8 * 1024 * 1024) {
                alert("حجم الصورة كبير. اختر صورة أقل من 8 ميجابايت.");
                photoInput.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onload = function () {
                const image = new Image();

                image.onload = function () {
                    const maxSize = 500;
                    const scale = Math.min(
                        1,
                        maxSize / Math.max(image.width, image.height)
                    );

                    const canvas = document.createElement("canvas");

                    canvas.width = Math.max(
                        1,
                        Math.round(image.width * scale)
                    );

                    canvas.height = Math.max(
                        1,
                        Math.round(image.height * scale)
                    );

                    const context = canvas.getContext("2d");

                    if (!context) {
                        alert("تعذر تجهيز الصورة.");
                        return;
                    }

                    context.drawImage(
                        image,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    selectedPhoto = canvas.toDataURL("image/jpeg", 0.78);
                    photoPreview.src = selectedPhoto;
                };

                image.onerror = function () {
                    alert("تعذر فتح الصورة المختارة.");
                };

                image.src = reader.result;
            };

            reader.onerror = function () {
                alert("تعذر قراءة ملف الصورة.");
            };

            reader.readAsDataURL(file);
        });
    }

    // ==================================================
    // إلغاء التعديلات
    // ==================================================

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            setFieldValues(originalProfile);

            if (photoInput) {
                photoInput.value = "";
            }

            if (hasSavedProfile) {
                showViewMode();
            } else {
                showEditMode();
            }
        });
    }

    // ==================================================
    // تسجيل الخروج
    // ==================================================

    if (logoutButton) {
        logoutButton.addEventListener("click", async function () {
            if (!activeUser) {
                alert("لا يوجد حساب مسجل الدخول حاليًا.");
                return;
            }

            if (!window.confirm("هل تريد تسجيل الخروج؟")) {
                return;
            }

            logoutButton.disabled = true;

            try {
                await signOut(auth);
            } catch (error) {
                console.error("Account logout error:", error);
                alert("تعذر تسجيل الخروج. حاول مرة أخرى.");
            } finally {
                logoutButton.disabled = false;
            }
        });
    }

    // ==================================================
    // مراقبة تسجيل الدخول
    // ==================================================

    if (
        authListenerStarted ||
        typeof onAuthStateChanged !== "function" ||
        typeof auth === "undefined"
    ) {
        console.warn("Account profile: Firebase Auth is unavailable.");
        return;
    }

    authListenerStarted = true;

    onAuthStateChanged(auth, function (user) {
        activeUser = user || null;
        selectedPhoto = "";
        originalProfile = {};
        hasSavedProfile = false;

        if (photoInput) {
            photoInput.value = "";
        }

        if (!activeUser) {
            fieldIds.forEach(function (id) {
                const field = document.getElementById(id);

                if (field) field.value = "";
            });

            const emailField = document.getElementById("account-email");

            if (emailField) emailField.value = "";

            photoPreview.src = defaultPhoto;
            viewContainer.hidden = true;
            form.hidden = false;

            updateAge();
            updateProfileHeader();
            return;
        }

        loadProfile();
    });

})();

/* =========================================================
   ACT INDEPENDENT PURCHASES - COMPLETE SYSTEM
   تسجيل وحساب وبحث وتعديل وحذف وإحصائيات وحفظ مستقل
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const section = document.getElementById(
        "independent-purchases-section"
    );

    if (!section) {
        console.error("Independent purchases section not found.");
        return;
    }

    const form = section.querySelector("#ind-purchase-form");
    const productInput = section.querySelector("#ind-purchase-product");
    const supplierInput = section.querySelector("#ind-purchase-supplier");
    const quantityInput = section.querySelector("#ind-purchase-quantity");
    const priceInput = section.querySelector("#ind-purchase-unit-price");
    const paidInput = section.querySelector("#ind-purchase-paid");
    const dateInput = section.querySelector("#ind-purchase-date");
    const notesInput = section.querySelector("#ind-purchase-notes");
    const categoryInput = section.querySelector("#ind-purchase-category");
    const previewTotal = section.querySelector(
        "#ind-purchase-preview-total"
    );
    const purchasesList = section.querySelector("#ind-purchases-list");
    const searchInput = section.querySelector("#ind-purchases-search");
    const saveButton = form
        ? form.querySelector('[type="submit"]')
        : null;
    const addPurchaseItemButton = section.querySelector("#ind-purchase-add-item");
    const extraPurchaseItemsHost = section.querySelector("#ind-purchase-extra-items");
    let purchaseItemSequence = 0;

    function addPurchaseInvoiceItem() {
        if (!extraPurchaseItemsHost) return;
        const row = document.createElement("div");
        row.className = "ind-purchase-extra-item";
        row.dataset.purchaseItem = String(++purchaseItemSequence);
        row.style.cssText = "display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;padding:14px;border:1px solid #64748b55;border-radius:12px;background:var(--input-bg,#0b1626);";
        row.innerHTML = `<label>نوع الصنف<select data-extra-category><option value="phones">📱 تلفون</option><option value="accessories">🎧 إكسسوار</option><option value="parts">🔧 قطعة غيار</option></select></label><label>اسم الصنف<input data-extra-product type="text" placeholder="اسم المنتج" required></label><label>الكمية<input data-extra-quantity type="number" min="1" step="1" value="1" required></label><label>سعر القطعة<input data-extra-price type="number" min="0" step="0.01" value="0" required></label><div style="display:flex;align-items:end;"><button type="button" data-remove-extra style="padding:10px 14px;border:0;border-radius:9px;cursor:pointer;">حذف الصنف ✕</button></div>`;
        extraPurchaseItemsHost.appendChild(row);
        row.querySelector("[data-remove-extra]").addEventListener("click", () => { row.remove(); updatePreview(); });
        row.addEventListener("input", updatePreview);
        row.addEventListener("change", updatePreview);
    }

    function readExtraPurchaseItems() {
        return Array.from(extraPurchaseItemsHost?.querySelectorAll("[data-purchase-item]") || []).map(row => ({
            category: row.querySelector("[data-extra-category]")?.value || "accessories",
            product: row.querySelector("[data-extra-product]")?.value.trim() || "",
            quantity: Number(row.querySelector("[data-extra-quantity]")?.value || 0),
            unitPrice: Number(row.querySelector("[data-extra-price]")?.value || 0)
        })).filter(item => item.product);
    }

    addPurchaseItemButton?.addEventListener("click", addPurchaseInvoiceItem);

    if (
        !form || !productInput || !supplierInput ||
        !quantityInput || !priceInput || !paidInput ||
        !dateInput || !notesInput || !categoryInput ||
        !previewTotal || !purchasesList || !searchInput
    ) {
        console.error("Independent purchases form is incomplete.");
        return;
    }

    const countElement = section.querySelector("#ind-purchases-count");
    const totalElement = section.querySelector("#ind-purchases-total");
    const quantityElement = section.querySelector(
        "#ind-purchases-quantity"
    );

    const categoryNames = {
        phones: "تلفونات",
        accessories: "إكسسوارات",
        parts: "قطع غيار"
    };

    let purchases = [];
    let editingId = null;

    function getToday() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function getStorageKey() {
        let uid = "guest";

        try {
            if (
                typeof currentUser !== "undefined" &&
                currentUser &&
                currentUser.uid
            ) {
                uid = currentUser.uid;
            }
        } catch (error) {
            uid = "guest";
        }

        return "actPhoneManager_independentPurchases_" + uid;
    }

    function loadPurchases() {
        try {
            const saved = localStorage.getItem(getStorageKey());
            const parsed = saved ? JSON.parse(saved) : [];

            purchases = Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            purchases = [];
            console.error("Could not load independent purchases.", error);
        }
    }
function savePurchases() {
    try {

        const key = getStorageKey();
        const value = JSON.stringify(purchases);

        // الحفظ المحلي
        localStorage.setItem(key, value);

        // الحفظ السحابي
        saveUserDataToCloud(key, value);

        window.dispatchEvent(new Event("act-purchases-data-updated"));
        if (typeof addNotificationFromOperation === "function") {
            addNotificationFromOperation({type:"purchase",icon:"📦",title:"تم حفظ عملية شراء",details:"تم تحديث سجل المشتريات بنجاح"});
        }

        return true;

    } catch (error) {

        alert(
            "تعذر حفظ المشتريات في المتصفح. تأكد من توفر مساحة تخزين."
        );

        console.error(
            "Could not save independent purchases.",
            error
        );

        return false;
    }
}

    function money(value) {
        return Number(value || 0).toLocaleString("ar-EG", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }) + " جنيه";
    }

    function getFormTotal() {
        const quantity = Number(quantityInput.value);
        const price = Number(priceInput.value);

        if (
            !Number.isFinite(quantity) ||
            !Number.isFinite(price) ||
            quantity <= 0 ||
            price < 0
        ) {
            return 0;
        }

        const extrasTotal = readExtraPurchaseItems().reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        return quantity * price + extrasTotal;
    }

    function updatePreview() {
        previewTotal.textContent = money(getFormTotal());
    }

    function makeId() {
        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {
            return window.crypto.randomUUID();
        }

        return Date.now().toString(36) +
            Math.random().toString(36).slice(2);
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value).replace(
            /[&<>"']/g,
            function (character) {
                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                }[character];
            }
        );
    }

    function updateStats() {
        const totalValue = purchases.reduce(function (sum, purchase) {
            return sum + Number(purchase.total || 0);
        }, 0);

        const totalQuantity = purchases.reduce(function (sum, purchase) {
            return sum + Number(purchase.quantity || 0);
        }, 0);

        if (countElement) {
            countElement.textContent = new Set(purchases.map(item => item.invoiceId || ("single-" + item.id))).size.toLocaleString("ar-EG");
        }

        if (totalElement) {
            totalElement.textContent = money(totalValue);
        }

        if (quantityElement) {
            quantityElement.textContent =
                totalQuantity.toLocaleString("ar-EG");
        }
    }

    function renderPurchases() {
        updateStats();
        const query = searchInput.value.trim().toLocaleLowerCase();
        const matches = purchases.filter(function (purchase) {
            return [purchase.product, purchase.supplier, purchase.date, purchase.notes,
                purchase.invoiceId, categoryNames[purchase.category] || purchase.category]
                .join(" ").toLocaleLowerCase().includes(query);
        });
        if (!matches.length) {
            purchasesList.innerHTML = '<div class="ind-purchases-empty">' +
                (purchases.length ? "لا توجد نتائج مطابقة للبحث." : "لا توجد عمليات شراء مسجلة حتى الآن.") + '</div>';
            return;
        }
        const grouped = new Map();
        matches.forEach(function (purchase) {
            const key = purchase.invoiceId || ("single-" + purchase.id);
            if (!grouped.has(key)) grouped.set(key, []);
            grouped.get(key).push(purchase);
        });
        purchasesList.innerHTML = Array.from(grouped.entries()).map(function ([invoiceId, lines]) {
            const first = lines[0];
            const total = lines.reduce((sum, item) => sum + Number(item.total || 0), 0);
            const paid = lines.reduce((sum, item) => sum + Number(item.paid || 0), 0);
            const quantity = lines.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
            const cardId = "purchase-invoice-" + String(invoiceId).replace(/[^a-zA-Z0-9_-]/g, "");
            return `
              <article class="ind-purchase-record ind-purchase-invoice" style="padding:15px;margin-bottom:12px;border:1px solid #64748b55;border-radius:14px;background:var(--input-bg,#0b1626);">
                <div class="ind-purchase-invoice-head">
                  <div><strong style="font-size:16px">فاتورة مشتريات #${escapeHTML(String(invoiceId).slice(-8))}</strong>
                    <div class="ind-purchase-invoice-meta"><span>المورد: ${escapeHTML(first.supplier || "غير محدد")}</span><span>التاريخ: ${escapeHTML(first.date || "—")}</span><span>${lines.length} صنف</span><span>الكمية: ${quantity.toLocaleString("ar-EG")}</span></div>
                  </div>
                  <div class="ind-purchase-invoice-total">${escapeHTML(money(total))}<small>المدفوع: ${escapeHTML(money(paid))}</small></div>
                </div>
                <button type="button" class="ind-purchase-details-toggle" aria-expanded="false" aria-controls="${cardId}">عرض تفاصيل الفاتورة <span>⌄</span></button>
                <div id="${cardId}" class="ind-purchase-invoice-lines" hidden>
                  ${lines.map(function (purchase) { return `
                    <section class="ind-purchase-line">
                      <div class="ind-purchase-line-title"><strong>${escapeHTML(purchase.product || "صنف بدون اسم")}</strong><b>${escapeHTML(money(purchase.total))}</b></div>
                      <div class="ind-purchase-line-data">
                        <span><b>نوع الصنف:</b> ${escapeHTML(categoryNames[purchase.category] || "مشتريات")}</span>
                        <span><b>الكمية:</b> ${escapeHTML(purchase.quantity)}</span>
                        <span><b>سعر القطعة:</b> ${escapeHTML(money(purchase.unitPrice))}</span>
                        <span><b>إجمالي الصنف:</b> ${escapeHTML(money(purchase.total))}</span>
                        <span><b>المدفوع:</b> ${escapeHTML(money(purchase.paid))}</span>
                      </div>
                      ${purchase.notes ? `<p class="ind-purchase-line-notes">ملاحظات: ${escapeHTML(purchase.notes)}</p>` : ""}
                      <div class="ind-purchase-line-actions">
                        <button type="button" data-purchase-action="edit" data-purchase-id="${escapeHTML(purchase.id)}">✏️ تعديل الصنف</button>
                        <button type="button" data-purchase-action="delete" data-purchase-id="${escapeHTML(purchase.id)}">🗑️ حذف الصنف</button>
                      </div>
                    </section>`; }).join("")}
                  <div class="ind-purchase-invoice-footer"><b>إجمالي الفاتورة: ${escapeHTML(money(total))}</b><b>المتبقي: ${escapeHTML(money(Math.max(0,total-paid)))}</b></div>
                </div>
              </article>`;
        }).join("");
        purchasesList.querySelectorAll('.ind-purchase-details-toggle').forEach(function (button) {
            button.addEventListener('click', function () {
                const panel = document.getElementById(button.getAttribute('aria-controls'));
                if (!panel) return;
                const opening = panel.hidden;
                panel.hidden = !opening;
                button.setAttribute('aria-expanded', String(opening));
                button.innerHTML = opening ? 'إخفاء تفاصيل الفاتورة <span>⌃</span>' : 'عرض تفاصيل الفاتورة <span>⌄</span>';
            });
        });
    }

    function clearForm() {
        form.reset();
        if (extraPurchaseItemsHost) extraPurchaseItemsHost.innerHTML = "";
        editingId = null;
        categoryInput.value = "phones";
        dateInput.value = getToday();

        section.querySelectorAll("[data-purchase-category]").forEach(
            function (button) {
                button.classList.toggle(
                    "active",
                    button.dataset.purchaseCategory === "phones"
                );
            }
        );

        if (saveButton) {
            saveButton.textContent = "💾 حفظ عملية الشراء";
        }

        updatePreview();
    }

    function editPurchase(id) {
        const purchase = purchases.find(function (item) {
            return item.id === id;
        });

        if (!purchase) {
            return;
        }

        editingId = purchase.id;
        productInput.value = purchase.product || "";
        supplierInput.value = purchase.supplier || "";
        quantityInput.value = purchase.quantity;
        priceInput.value = purchase.unitPrice;
        paidInput.value = purchase.paid || 0;
        dateInput.value = purchase.date || getToday();
        notesInput.value = purchase.notes || "";
        categoryInput.value = purchase.category || "phones";

        section.querySelectorAll("[data-purchase-category]").forEach(
            function (button) {
                button.classList.toggle(
                    "active",
                    button.dataset.purchaseCategory === categoryInput.value
                );
            }
        );

        if (saveButton) {
            saveButton.textContent = "💾 حفظ التعديلات";
        }

        updatePreview();

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        productInput.focus();
    }

    // تحديث الإجمالي مباشرة عند تغيير الكمية أو السعر
    quantityInput.addEventListener("input", updatePreview);
    priceInput.addEventListener("input", updatePreview);

    // اختيار تصنيف المشتريات
    section.querySelectorAll("[data-purchase-category]").forEach(
        function (button) {
            button.addEventListener("click", function () {
                const category = button.dataset.purchaseCategory;

                if (!categoryNames[category]) {
                    return;
                }

                categoryInput.value = category;

                section.querySelectorAll("[data-purchase-category]").forEach(
                    function (item) {
                        item.classList.toggle("active", item === button);
                    }
                );
            });
        }
    );

    // حفظ عملية شراء جديدة أو تعديل عملية موجودة
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const product = productInput.value.trim();
        const supplier = supplierInput.value.trim();
        const quantity = Number(quantityInput.value);
        const unitPrice = Number(priceInput.value);
        const paid = Number(paidInput.value || 0);
        const date = dateInput.value;
        const notes = notesInput.value.trim();
        const category = categoryInput.value;

        if (!product) {
            alert("اكتب اسم المنتج أولًا.");
            productInput.focus();
            return;
        }

        if (
            !Number.isSafeInteger(quantity) ||
            quantity < 1
        ) {
            alert("أدخل كمية صحيحة لا تقل عن قطعة واحدة.");
            quantityInput.focus();
            return;
        }

        if (
            !Number.isFinite(unitPrice) ||
            unitPrice < 0 ||
            !Number.isFinite(paid) ||
            paid < 0
        ) {
            alert("تأكد من صحة سعر القطعة والمبلغ المدفوع.");
            return;
        }

        if (!date) {
            alert("اختر تاريخ الشراء.");
            dateInput.focus();
            return;
        }

        if (!categoryNames[category]) {
            alert("اختر تصنيفًا صحيحًا للمشتريات.");
            return;
        }

        const extraItems = editingId ? [] : readExtraPurchaseItems();
        for (const item of extraItems) {
            if (!categoryNames[item.category] || !Number.isSafeInteger(item.quantity) || item.quantity < 1 || !Number.isFinite(item.unitPrice) || item.unitPrice < 0) {
                alert("راجع نوع وكمية وسعر كل صنف إضافي.");
                return;
            }
        }
        const invoiceId = editingId ? (purchases.find(p => p.id === editingId)?.invoiceId || makeId()) : makeId();
        const invoiceLines = [{ product, category, quantity, unitPrice }, ...extraItems];
        const invoiceTotal = invoiceLines.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        if (!Number.isFinite(invoiceTotal)) {
            alert("إجمالي العملية أكبر من القيمة التي يمكن حسابها.");
            return;
        }
        const invoiceRecords = invoiceLines.map((item, index) => {
            const lineTotal = item.quantity * item.unitPrice;
            const linePaid = invoiceTotal > 0 ? paid * (lineTotal / invoiceTotal) : (index === 0 ? paid : 0);
            return {
                id: index === 0 ? (editingId || makeId()) : makeId(),
                invoiceId, invoiceLine: index + 1, invoiceLinesCount: invoiceLines.length,
                product: item.product, supplier, quantity: item.quantity, unitPrice: item.unitPrice,
                total: lineTotal, paid: linePaid, date, notes, category: item.category,
                updatedAt: new Date().toISOString()
            };
        });
        const record = invoiceRecords[0];
        const previousPurchases = purchases.slice();
        const oldRecord = editingId ? purchases.find(p => p.id === editingId) : null;

        if (editingId) {
            purchases = purchases.map(function (purchase) {
                return purchase.id === editingId ? record : purchase;
            });
        } else {
            purchases = [...invoiceRecords, ...purchases];
        }

        if (!savePurchases()) {
            purchases = previousPurchases;
            return;
        }

        if (oldRecord && oldRecord.category === "phones" && record.category !== "phones") {
            window.actPhoneInventoryRemovePurchase?.("independent", oldRecord);
        }
        if (record.category === "phones") {
            window.actPhoneInventoryUpsertPurchase?.("independent", record, oldRecord);
        }
        if (!editingId) {
            invoiceRecords.slice(1).filter(line => line.category === "phones").forEach(line => {
                window.actPhoneInventoryUpsertPurchase?.("independent", line, null);
            });
        }

        clearForm();
        renderPurchases();

        alert(
            editingId
                ? "تم تحديث عملية الشراء بنجاح."
                : "تم حفظ عملية الشراء بنجاح."
        );

        // Phone purchases are routed to the phone-purchases tab only.
        if (category === "phones") {
            const devicesNavigation = document.getElementById("nav-devices");
            if (devicesNavigation) devicesNavigation.click();
            window.setTimeout(function () {
                const phonePurchasesTab = document.getElementById("device-purchase-tab");
                if (phonePurchasesTab) phonePurchasesTab.click();
            }, 80);
        }
    });

    // البحث في السجل
    searchInput.addEventListener("input", renderPurchases);

    // التعديل والحذف من سجل المشتريات
    purchasesList.addEventListener("click", function (event) {
        const button = event.target.closest("[data-purchase-action]");

        if (!button || !purchasesList.contains(button)) {
            return;
        }

        const id = button.dataset.purchaseId;
        const action = button.dataset.purchaseAction;

        if (action === "edit") {
            editPurchase(id);
            return;
        }

        if (action === "delete") {
            const purchase = purchases.find(function (item) {
                return item.id === id;
            });

            if (!purchase) {
                return;
            }

            if (!confirm(
                'هل أنت متأكد من حذف عملية شراء "' +
                purchase.product +
                '"؟'
            )) {
                return;
            }

            const previousPurchases = purchases.slice();
            if (purchase.category === "phones") {
                window.actPhoneInventoryRemovePurchase?.("independent", purchase);
            }

            purchases = purchases.filter(function (item) {
                return item.id !== id;
            });

            if (!savePurchases()) {
                purchases = previousPurchases;
                if (purchase.category === "phones") window.actPhoneInventoryUpsertPurchase?.("independent", purchase, null);
                return;
            }

            if (editingId === id) {
                clearForm();
            }

            renderPurchases();
        }
    });

    // يسمح لزر الشريط السفلي بتحديث السجل بعد تغيير المستخدم
    window.renderIndependentPurchases = function () {
        loadPurchases();
        renderPurchases();
    };

    window.addEventListener("act-user-data-ready", function () {
        loadPurchases();
        renderPurchases();
    });

    window.addEventListener("act-purchases-data-updated", function () {
        loadPurchases();
        renderPurchases();
    });

    dateInput.value = getToday();
    loadPurchases();
    updatePreview();
    renderPurchases();
});

// ======================================================
// ACT PHONE MANAGER - NOTIFICATIONS BELL
// PREMIUM NOTIFICATIONS SYSTEM
// ======================================================

let actNotifications = [];

// مفتاح تخزين إشعارات المستخدم
function getActNotificationsKey() {
    const uid =
        typeof currentUser !== "undefined" &&
        currentUser &&
        currentUser.uid
            ? currentUser.uid
            : "guest";

    return "actPhoneManager_notifications_" + uid;
}

// تحميل الإشعارات
function loadActNotifications() {
    try {
        const saved = localStorage.getItem(getActNotificationsKey());

        actNotifications = saved ? JSON.parse(saved) : [];

        if (!Array.isArray(actNotifications)) {
            actNotifications = [];
        }
    } catch (error) {
        console.error("Notifications load error:", error);
        actNotifications = [];
    }
}

// حفظ الإشعارات محليًا وسحابيًا
function saveActNotifications() {
    try {
        const key = getActNotificationsKey();
        const value = JSON.stringify(actNotifications);

        localStorage.setItem(key, value);

        if (typeof saveUserDataToCloud === "function") {
            saveUserDataToCloud(key, value);
        }

    } catch (error) {
        console.error("Notifications save error:", error);
    }
}

// إضافة إشعار جديد
function addNotificationFromOperation(operation) {
    if (!operation) return;

    loadActNotifications();

    actNotifications.unshift({
        id: operation.id || createId("notification"),
        type: operation.type || "general",
        icon: operation.icon || "🔔",
        title: operation.title || "إشعار جديد",
        details: operation.details || "",
        amount: operation.amount ?? null,
        createdAt: operation.createdAt || new Date().toISOString(),
        read: false
    });

    actNotifications = actNotifications.slice(0, 100);

    saveActNotifications();
    renderActNotifications();

    try {
        if (typeof Notification !== "undefined" && Notification.permission === "granted" && document.visibilityState === "hidden") {
            const show = registration => {
                if (registration && typeof registration.showNotification === "function") {
                    registration.showNotification(operation.title || "إشعار ACT Manager", {
                        body: operation.details || "تم تسجيل عملية جديدة في البرنامج.",
                        icon: "./icons/icon-192.png",
                        badge: "./icons/icon-192.png",
                        tag: operation.type || "act-operation"
                    });
                } else {
                    new Notification(operation.title || "إشعار ACT Manager", { body: operation.details || "تم تسجيل عملية جديدة في البرنامج.", icon: "./icons/icon-192.png" });
                }
            };
            if ("serviceWorker" in navigator) navigator.serviceWorker.ready.then(show).catch(() => show(null));
            else show(null);
        }
    } catch (notificationError) {
        console.warn("ACT system notification unavailable:", notificationError);
    }

}


// ======================================================
// عرض الإشعارات مع زر حذف كل إشعار بشكل منفصل
// ======================================================

function renderActNotifications() {

    const list = document.getElementById("notification-list");
    const count = document.getElementById("notification-unread-count");

    if (!list) return;

    // حساب عدد الإشعارات غير المقروءة
    const unreadCount = actNotifications.filter(
        notification => !notification.read
    ).length;

    // تحديث عداد الإشعارات
    if (count) {
        count.textContent = unreadCount > 99 ? "99+" : unreadCount;
        count.style.display = unreadCount ? "inline-flex" : "none";
    }

    // إذا لم توجد إشعارات
    if (!actNotifications.length) {

        list.innerHTML = `
            <div class="notification-empty">
                لا توجد إشعارات حتى الآن
            </div>
        `;

        return;
    }

    // عرض جميع الإشعارات
    list.innerHTML = actNotifications.map(notification => `

        <div
            class="notification-item ${notification.read ? "is-read" : "is-unread"}"
            data-notification-id="${escapeHTML(notification.id)}"
        >

            <span class="notification-item-icon">
                ${escapeHTML(notification.icon || "🔔")}
            </span>

            <span class="notification-item-content">

                <strong>
                    ${escapeHTML(notification.title || "")}
                </strong>

                ${
                    notification.details
                        ? `<small>${escapeHTML(notification.details)}</small>`
                        : ""
                }

                <small>
                    ${escapeHTML(getCurrentTimeFromDate(notification.createdAt))}
                </small>

            </span>

            ${
                notification.read
                    ? ""
                    : `<span class="notification-unread-dot"></span>`
            }

            <!-- زر حذف الإشعار -->
            <button
                type="button"
                class="notification-delete-button"
                data-delete-notification="${escapeHTML(notification.id)}"
                aria-label="حذف الإشعار"
                title="حذف الإشعار"
            >✕</button>

        </div>

    `).join("");

    // التعامل مع الضغط على الإشعار
    list.querySelectorAll(".notification-item").forEach(item => {

        item.addEventListener("click", function (event) {

            const notificationId = this.dataset.notificationId;

            // التأكد من الضغط على زر الحذف
            const deleteButton = event.target.closest(
                "[data-delete-notification]"
            );

            // حذف الإشعار المحدد فقط
            if (deleteButton) {

                event.preventDefault();
                event.stopPropagation();

                actNotifications = actNotifications.filter(
                    notification =>
                        String(notification.id) !== String(notificationId)
                );

                saveActNotifications();
                renderActNotifications();

                return;
            }

            // تحديد الإشعار كمقروء
            const notification = actNotifications.find(
                notification =>
                    String(notification.id) === String(notificationId)
            );

            if (!notification || notification.read) return;

            notification.read = true;

            saveActNotifications();
            renderActNotifications();

        });

    });

}

// تحديد جميع الإشعارات كمقروءة
function markAllActNotificationsRead() {
    if (!Array.isArray(actNotifications)) return;

    actNotifications.forEach(function (notification) {
        if (notification) {
            notification.read = true;
        }
    });

    saveActNotifications();
    renderActNotifications();
}

// تشغيل نظام الإشعارات
function initActNotifications() {
    const bell = document.getElementById("notification-bell-button");
    const panel = document.getElementById("notification-panel");
    const markAll = document.getElementById("notification-mark-all-read");

    loadActNotifications();
    renderActNotifications();

    if (!bell || !panel) {
        console.warn("Notifications: bell or panel not found.");
        return;
    }

    if (!bell.dataset.notificationsReady) {
        bell.dataset.notificationsReady = "true";

        panel.hidden = true;
        panel.style.display = "none";

        bell.setAttribute("aria-expanded", "false");

        // فتح وإغلاق لوحة الإشعارات
        bell.addEventListener("click", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const shouldOpen = panel.hidden;

            panel.hidden = !shouldOpen;
            panel.style.display = shouldOpen ? "flex" : "none";

            bell.setAttribute("aria-expanded", String(shouldOpen));
        });

        // منع إغلاق اللوحة عند الضغط داخلها
        panel.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        // الإغلاق عند الضغط خارج اللوحة
        document.addEventListener("click", function () {
            panel.hidden = true;
            panel.style.display = "none";
            bell.setAttribute("aria-expanded", "false");
        });

        // الإغلاق بزر Escape
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                panel.hidden = true;
                panel.style.display = "none";
                bell.setAttribute("aria-expanded", "false");
            }
        });
    }

    // زر تحديد الكل كمقروء
    if (markAll && !markAll.dataset.notificationsReady) {
        markAll.dataset.notificationsReady = "true";

        markAll.addEventListener(
            "click",
            markAllActNotificationsRead
        );
    }
}

// بدء التشغيل
if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initActNotifications
    );
} else {
    initActNotifications();
}

// تحديث الإشعارات عند تغير الحساب
if (
    typeof auth !== "undefined" &&
    auth &&
    typeof auth.onAuthStateChanged === "function"
) {
    auth.onAuthStateChanged(function () {
        loadActNotifications();
        renderActNotifications();
    });
}

/* =====================================================
   ACT MARKET DASHBOARD — REAL DATA
   PREMIUM BLUE LINE CHART
===================================================== */

(function () {
    "use strict";

    const $ = id => document.getElementById(id);
    let period = 7;

    function readArray(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.error("Dashboard read error:", key, error);
            return [];
        }
    }

    function getSales() {
        const uid =
            typeof currentUser !== "undefined" && currentUser
                ? currentUser.uid
                : "guest";

        return readArray("actPhoneManager_sales_" + uid);
    }

    function getDate(item) {
        if (!item) return null;
        const raw = item.date || item.createdAt || item.saleDate ||
            item.purchaseDate || item.receiveDate || item.timestamp || item.created_at || "";
        if (!raw) return null;
        if (raw && typeof raw.toDate === "function") {
            const converted = raw.toDate();
            return converted instanceof Date && !Number.isNaN(converted.getTime()) ? converted : null;
        }
        // Parse YYYY-MM-DD as a local calendar date, not UTC.
        const dateOnly = String(raw).match(/^(\d{4})-(\d{2})-(\d{2})$/);
        const date = dateOnly
            ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
            : new Date(raw);
        return Number.isNaN(date.getTime()) ? null : date;
    }

    function numeric(value) {
        if (typeof value === "number") return Number.isFinite(value) ? value : 0;
        const normalized = String(value == null ? "" : value)
            .replace(/[٠-٩]/g, d => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
            .replace(/[۰-۹]/g, d => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
            .replace(/[٬,،\s]/g, "").replace(/٫/g, ".").replace(/[^0-9.+-]/g, "");
        const parsed = Number(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    }

    function amount(item) {
        if (!item) return 0;
        for (const field of ["total", "totalPrice", "finalPrice", "salePrice", "unitPrice", "price", "amount"]) {
            const value = item[field];
            if (value !== undefined && value !== null && value !== "") return numeric(value);
        }
        return 0;
    }

    function getDevices() {
        const key = typeof getUserKey === "function"
            ? getUserKey("devices")
            : "actPhoneManager_devices_guest";
        return readArray(key);
    }

    function money(value) {
        return Number(value || 0).toLocaleString("ar-EG", {
            maximumFractionDigits: 0
        });
    }

    function inRange(item, start, end) {
        const date = getDate(item);
        return date && date >= start && date < end;
    }

    function sum(items) {
        return items.reduce((total, item) => total + amount(item), 0);
    }

    function setText(id, value) {
        const element = $(id);
        if (element) element.textContent = value;
    }

    function changeText(id, current, previous) {
        const element = $(id);
        if (!element) return;

        if (previous === 0) {
            element.textContent = current === 0
                ? "لا توجد حركة"
                : "لا توجد فترة سابقة للمقارنة";

            element.className = "act-change";
            return;
        }

        const change =
            ((current - previous) / Math.abs(previous)) * 100;

        const up = change >= 0;

        element.textContent =
            (up ? "▲ " : "▼ ") +
            Math.abs(change).toLocaleString("ar-EG", {
                maximumFractionDigits: 1
            }) +
            "% مقارنة بالفترة السابقة";

        element.className =
            "act-change " + (up ? "is-up" : "is-down");
    }

    function drawLine(daily) {
        const chart = $("act-sales-line-chart");
        const axis = $("act-sales-chart-axis");

        if (!chart || !axis) return;

        const maxValue = Math.max(
            ...daily.map(day => day.sales),
            1
        );

        const chartMax = Math.ceil(maxValue / 5) * 5 || 5;

        const width = 720;
        const height = 300;
        const left = 75;
        const right = 15;
        const top = 25;
        const bottom = 245;

        const plotWidth = width - left - right;
        const plotHeight = bottom - top;

        const points = daily.map((day, index) => {
            const x = left +
                index * plotWidth /
                Math.max(daily.length - 1, 1);

            const y = bottom -
                (day.sales / chartMax) * plotHeight;

            return {
                x,
                y,
                value: day.sales,
                date: day.date
            };
        });

        const linePath = points.map((point, index) =>
            (index ? "L" : "M") + point.x.toFixed(2) + " " + point.y.toFixed(2)
        ).join(" ");

        const first = points[0];
        const last = points[points.length - 1];

        const areaPath = points.length
            ? linePath +
              " L " + last.x + " " + bottom +
              " L " + first.x + " " + bottom +
              " Z"
            : "";

        const grid = [];

        for (let i = 0; i <= 4; i++) {
            const ratio = i / 4;
            const y = top + ratio * plotHeight;
            const value = chartMax * (1 - ratio);

            grid.push(`
                <line
                    x1="${left}"
                    y1="${y}"
                    x2="${width - right}"
                    y2="${y}"
                    stroke="#7890aa"
                    stroke-opacity=".17"
                    stroke-dasharray="4 6"
                />

                <text
                    x="${left - 12}"
                    y="${y + 4}"
                    text-anchor="end"
                    fill="#91A7BE"
                    font-size="12"
                >${money(value)}</text>
            `);
        }

        if (!points.length) {
            chart.innerHTML = `
                <div class="act-chart-empty">
                    لا توجد بيانات مبيعات في الفترة المحددة.
                </div>
            `;
            axis.innerHTML = "";
            return;
        }

        chart.innerHTML = `
            <svg
                viewBox="0 0 ${width} ${height}"
                role="img"
                aria-label="حركة المبيعات اليومية"
                style="width:100%;height:auto;display:block"
            >
                <defs>
                    <linearGradient
                        id="actSalesAreaGradient"
                        x1="0" y1="0"
                        x2="0" y2="1"
                    >
                        <stop offset="0%" stop-color="#20B9FF" stop-opacity=".35"/>
                        <stop offset="100%" stop-color="#087BFF" stop-opacity="0"/>
                    </linearGradient>

                    <filter
                        id="actSalesGlow"
                        x="-50%" y="-50%"
                        width="200%" height="200%"
                    >
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feMerge>
                            <feMergeNode in="blur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>

                ${grid.join("")}

                <path d="${areaPath}" fill="url(#actSalesAreaGradient)"/>

                <path
                    d="${linePath}"
                    fill="none"
                    stroke="#20B9FF"
                    stroke-width="3.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    filter="url(#actSalesGlow)"
                    class="act-sales-animated-line"
                />

                ${points.map((point,index) => `
                    <g class="act-sales-point" data-point-index="${index}" tabindex="0" role="button" aria-label="تفاصيل مبيعات ${point.date.toLocaleDateString("ar-EG")}">
                      <circle cx="${point.x}" cy="${point.y}" r="10" class="act-sales-point-hit" />
                      <circle cx="${point.x}" cy="${point.y}" r="7" fill="#20B9FF" opacity=".18" class="act-sales-point-pulse" />
                      <circle cx="${point.x}" cy="${point.y}" r="3.8" fill="#FFFFFF" stroke="#20B9FF" stroke-width="2" class="act-sales-point-core" />
                    </g>
                `).join("")}
            </svg>
        `;
        const details = $("act-sales-point-details");
        const showPoint = index => {
            const point = points[index]; if (!point || !details) return;
            const dayStart = new Date(point.date.getFullYear(), point.date.getMonth(), point.date.getDate());
            const dayEnd = new Date(dayStart); dayEnd.setDate(dayEnd.getDate()+1);
            const daySales = getSales().filter(item => inRange(item, dayStart, dayEnd));
            const total = daySales.reduce((sum,item)=>sum+amount(item),0);
            const count = daySales.length;
            const avg = count ? total/count : 0;
            const uid = typeof currentUser !== "undefined" && currentUser?.uid ? currentUser.uid : "guest";
            const phonePurchaseKey = typeof getUserKey === "function" ? getUserKey("phonePurchases") : `actPhoneManager_phonePurchases_${uid}`;
            const extraPurchaseKey = typeof getUserKey === "function" ? getUserKey("independentPurchases") : `actPhoneManager_independentPurchases_${uid}`;
            const dayPurchases = [...readArray(phonePurchaseKey), ...readArray(extraPurchaseKey)].filter(item=>inRange(item,dayStart,dayEnd));
            const purchaseTotal = dayPurchases.reduce((sum,item)=>sum+amount(item),0);
            const walletRows = ["deposit","withdraw","recharge","bills","transfer"].flatMap(op=>readArray(`actPhoneManager_wallet_transactions_${op}_${uid}`).map(item=>({...item,_walletType:op})));
            const dayWallet = walletRows.filter(item=>inRange(item,dayStart,dayEnd));
            const walletIn = dayWallet.filter(item=>item._walletType==="deposit").reduce((sum,item)=>sum+numeric(item.amount),0);
            const walletOut = dayWallet.filter(item=>item._walletType==="withdraw").reduce((sum,item)=>sum+numeric(item.amount),0);
            const maintenanceCount = getDevices().filter(item=>String(item.section||"").toLowerCase().includes("maintenance") && inRange({...item,date:item.receiveDate||item.createdAt},dayStart,dayEnd)).length;
            const prior = points[index-1];
            const delta = prior ? point.value-prior.value : 0;
            let reason = "أول يوم في الفترة";
            if (prior) {
                const priorStart = new Date(prior.date.getFullYear(), prior.date.getMonth(), prior.date.getDate());
                const priorEnd = new Date(priorStart); priorEnd.setDate(priorEnd.getDate()+1);
                const priorRows = getSales().filter(item => inRange(item, priorStart, priorEnd));
                const priorCount = priorRows.length;
                const priorAverage = priorCount ? prior.value/priorCount : 0;
                const countDown = count < priorCount;
                const avgDown = avg < priorAverage;
                if (delta < 0) reason = countDown && avgDown ? "الانخفاض مرتبط بانخفاض عدد عمليات البيع ومتوسط قيمة العملية مقارنة باليوم السابق." : countDown ? "الانخفاض مرتبط بتسجيل عمليات بيع أقل من اليوم السابق." : avgDown ? "عدد العمليات لم ينخفض، لكن متوسط قيمة العملية أقل من اليوم السابق." : "الإجمالي أقل رغم عدد العمليات؛ راجع تفاصيل الفواتير المسجلة أدناه.";
                else if (delta > 0) reason = count > priorCount && avg >= priorAverage ? "الزيادة جاءت مع ارتفاع عدد العمليات ومتوسط قيمتها." : count > priorCount ? "الزيادة مرتبطة بزيادة عدد عمليات البيع." : avg > priorAverage ? "الزيادة مرتبطة بارتفاع متوسط قيمة عملية البيع." : "إجمالي المبيعات أعلى من اليوم السابق.";
                else reason = "إجمالي المبيعات يساوي اليوم السابق.";
            }
            const deltaText = !prior ? reason : (delta > 0 ? `زيادة ${money(delta)} جنيه` : delta < 0 ? `انخفاض ${money(Math.abs(delta))} جنيه` : "لا يوجد تغير") + " · " + reason;
            const detailsList = daySales.slice(0,5).map((item,i)=>{const itemNames=Array.isArray(item.items)?item.items.map(x=>x.name).filter(Boolean).join("، "):"";return `<li><span>${escapeHTML(itemNames || item.phoneName || item.deviceName || item.productName || item.customerName || (item.invoiceNumber ? `فاتورة #${item.invoiceNumber}` : `عملية بيع ${i+1}`))}</span><b>${money(amount(item))} ج.م</b></li>`;}).join("");
            details.innerHTML = `<div class="act-sales-detail-head"><b>${point.date.toLocaleDateString("ar-EG",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</b><span>${escapeHTML(deltaText)}</span></div><div class="act-sales-detail-stats"><span>إجمالي المبيعات<strong>${money(total)} ج.م</strong></span><span>عدد عمليات البيع<strong>${count.toLocaleString("ar-EG")}</strong></span><span>متوسط العملية<strong>${money(avg)} ج.م</strong></span><span>المشتريات المسجلة<strong>${money(purchaseTotal)} ج.م · ${dayPurchases.length} عملية</strong></span><span>صافي حركة المحفظة<strong>${money(walletIn-walletOut)} ج.م</strong></span><span>أجهزة الصيانة المستلمة<strong>${maintenanceCount.toLocaleString("ar-EG")}</strong></span></div>${detailsList ? `<ul>${detailsList}</ul>` : `<p>لا توجد فواتير بيع مسجلة لهذا اليوم. لا يمكن استنتاج سبب الحركة من دون عمليات مسجلة.</p>`}`;
            chart.querySelectorAll(".act-sales-point").forEach(el=>el.classList.toggle("is-selected",Number(el.dataset.pointIndex)===index));
        };
        chart.querySelectorAll(".act-sales-point").forEach(el=>{
            const activate=()=>showPoint(Number(el.dataset.pointIndex));
            el.addEventListener("click",activate);
            el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();activate();}});
        });
        if (points.length) showPoint(points.length-1);

        const step = Math.max(1, Math.ceil(daily.length / 7));

        axis.innerHTML = daily
            .filter((day, index) =>
                index % step === 0 ||
                index === daily.length - 1
            )
            .map(day => `
                <span>
                    ${day.date.toLocaleDateString("ar-EG", {
                        day: "numeric",
                        month: "short"
                    })}
                </span>
            `)
            .join("");
    }

    function drawComparison(
        sales,
        purchases,
        previousSales,
        previousPurchases
    ) {
        const chart = $("act-sales-purchases-chart");
        if (!chart) return;

        const max = Math.max(
            sales,
            purchases,
            previousSales,
            previousPurchases,
            1
        );

        const bars = [
            {
                label: "المبيعات الحالية",
                value: sales,
                cls: "act-bar-sales"
            },
            {
                label: "المبيعات السابقة",
                value: previousSales,
                cls: "act-bar-sales act-bar-muted"
            },
            {
                label: "المشتريات الحالية",
                value: purchases,
                cls: "act-bar-purchases"
            },
            {
                label: "المشتريات السابقة",
                value: previousPurchases,
                cls: "act-bar-purchases act-bar-muted"
            }
        ];

        chart.innerHTML = bars.map(bar => `
            <div class="act-bar-row">
                <div class="act-bar-label">
                    <span>${bar.label}</span>
                    <strong>${money(bar.value)} ج.م</strong>
                </div>

                <div class="act-bar-track">
                    <span
                        class="${bar.cls}"
                        style="width:${Math.max(0, bar.value / max * 100)}%"
                    ></span>
                </div>
            </div>
        `).join("");
    }

    function render() {
        const now = new Date();

        const end = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1
        );

        const start = new Date(end);
        start.setDate(start.getDate() - period);

        const previousStart = new Date(start);
        previousStart.setDate(previousStart.getDate() - period);

        const sales = getSales();

        const uid =
            typeof currentUser !== "undefined" && currentUser && currentUser.uid
                ? currentUser.uid
                : "guest";

        const purchasesKey = typeof getUserKey === "function"
            ? getUserKey("independentPurchases")
            : "actPhoneManager_independentPurchases_" + uid;
        const purchases = readArray(purchasesKey);
        const devices = getDevices();

        const currentSales = sales.filter(item =>
            inRange(item, start, end)
        );

        const currentPurchases = purchases.filter(item =>
            inRange(item, start, end)
        );

        const previousSalesItems = sales.filter(item =>
            inRange(item, previousStart, start)
        );

        const previousPurchaseItems = purchases.filter(item =>
            inRange(item, previousStart, start)
        );

        const salesTotal = sum(currentSales);
        const purchasesTotal = sum(currentPurchases);

        const previousSalesTotal = sum(previousSalesItems);
        const previousPurchasesTotal = sum(previousPurchaseItems);

        setText("act-kpi-sales-value", money(salesTotal));
        setText("act-kpi-purchases-value", money(purchasesTotal));
        setText("act-kpi-net-value", money(salesTotal - purchasesTotal));

        setText(
            "act-kpi-count-value",
            currentSales.length.toLocaleString("ar-EG")
        );

        const saleDevices = devices.filter(item => {
            const status = String(item.status || "").trim();
            return status === "البيع" || item.section === "sale" ||
                item.category === "sale" || item.category === "بيع";
        });
        const inventoryValue = saleDevices.reduce((total, item) =>
            total + numeric(item.price || item.salePrice || item.sellingPrice || 0), 0
        );
        setText("act-kpi-inventory-value", money(inventoryValue));
        setText("act-kpi-inventory-count", saleDevices.length.toLocaleString("ar-EG") + " جهاز مسجل للبيع");

        setText("act-kpi-period-label", "آخر " + period + " أيام");

        changeText("act-kpi-sales-change", salesTotal, previousSalesTotal);
        changeText("act-kpi-purchases-change", purchasesTotal, previousPurchasesTotal);

        changeText(
            "act-kpi-count-change",
            currentSales.length,
            previousSalesItems.length
        );

        const netProgress = $("act-kpi-net-progress");

        if (netProgress) {
            const ratio = salesTotal > 0
                ? Math.max(
                    0,
                    Math.min(
                        100,
                        (salesTotal - purchasesTotal) / salesTotal * 100
                    )
                )
                : 0;

            netProgress.style.width = ratio + "%";
        }

        setText(
            "act-kpi-net-note",
            salesTotal >= purchasesTotal
                ? "المبيعات أعلى من المشتريات"
                : "المشتريات أعلى من المبيعات"
        );

        const daily = [];

        for (let i = 0; i < period; i++) {
            const dayStart = new Date(start);
            dayStart.setDate(start.getDate() + i);

            const dayEnd = new Date(dayStart);
            dayEnd.setDate(dayEnd.getDate() + 1);

            daily.push({
                date: dayStart,
                sales: sum(
                    currentSales.filter(item =>
                        inRange(item, dayStart, dayEnd)
                    )
                )
            });
        }

        drawLine(daily);

        drawComparison(
            salesTotal,
            purchasesTotal,
            previousSalesTotal,
            previousPurchasesTotal
        );
    }

    document.querySelectorAll("[data-act-period]")
        .forEach(button => {
            button.addEventListener("click", function () {
                period = Number(this.dataset.actPeriod) || 7;

                document.querySelectorAll("[data-act-period]")
                    .forEach(item => {
                        item.classList.toggle("is-active", item === this);
                    });

                render();
            });
        });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", render);
    } else {
        render();
    }

    window.addEventListener("storage", render);
    window.addEventListener("focus", render);
    window.addEventListener("act-user-data-ready", render);
    window.addEventListener("act-sales-data-updated", render);
    window.addEventListener("act-purchases-data-updated", render);
    window.addEventListener("act-wallet-data-updated", function () { updateWalletBalanceSummary(); renderWalletRecentPreview(); });

    setInterval(render, 10000);

})();

/* =====================================================
   ACT BUSINESS INTELLIGENCE — KPI SHORTCUT ARROWS
===================================================== */
(function(){
  document.querySelectorAll('[data-act-kpi-link]').forEach(button=>button.addEventListener('click',()=>{
    const target=button.dataset.actKpiLink;
    if(target==='sales'){document.getElementById('nav-sales')?.click();return;}
    if(target==='purchases'){document.getElementById('nav-purchases')?.click();return;}
    if(target==='reports'){document.getElementById('more-section')?.style.setProperty('display','block');document.getElementById('nav-more')?.click();document.getElementById('more-reports')?.click();}
  }));
})();

/* ==========================================
   ACT TOP PROFILE — EXISTING ACCOUNT DATA
========================================== */

(function initTopProfileMenu() {
    const profile = document.getElementById("top-profile");
    const toggle = document.getElementById("top-profile-toggle");
    const dropdown = document.getElementById("top-profile-dropdown");

    if (!profile || !toggle || !dropdown) return;

    const topPhoto = document.getElementById("top-profile-photo");
    const topName = document.getElementById("top-profile-name");
    const menuName = document.getElementById("top-profile-menu-name");
    const menuEmail = document.getElementById("top-profile-menu-email");

    function syncProfile() {
        const sourcePhoto = document.getElementById("account-photo-preview");
        const sourceName = document.getElementById("account-display-name");
        const sourceEmail = document.getElementById("account-display-email");

        if (sourcePhoto && sourcePhoto.src) {
            topPhoto.src = sourcePhoto.src;
        }

        const name = sourceName?.textContent?.trim() || "اسم المستخدم";
        const email = sourceEmail?.textContent?.trim() || "";

        topName.textContent = name;
        menuName.textContent = name;
        menuEmail.textContent = email;
    }

    function closeMenu() {
        dropdown.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function (event) {
        event.stopPropagation();
        syncProfile();

        dropdown.hidden = !dropdown.hidden;

        toggle.setAttribute(
            "aria-expanded",
            String(!dropdown.hidden)
        );
    });

    dropdown.addEventListener("click", function (event) {
        event.stopPropagation();

        const action = event.target.closest("[data-top-profile-action]");
        if (!action) return;

        closeMenu();

        if (action.dataset.topProfileAction === "account") {
            const accountButton = document.getElementById("nav-account");
            if (accountButton) accountButton.click();
        }

        if (action.dataset.topProfileAction === "logout") {
            const logoutButton = document.getElementById("account-logout-button");

            if (logoutButton) {
                logoutButton.click();
            } else {
                console.error("Account logout button was not found.");
            }
        }
    });

    document.addEventListener("click", function (event) {
        if (!profile.contains(event.target)) closeMenu();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") closeMenu();
    });

    syncProfile();

    const accountSection = document.getElementById("account-section");

    if (accountSection) {
        const observer = new MutationObserver(syncProfile);

        observer.observe(accountSection, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true
        });
    }
})();


document.documentElement.classList.toggle(
    "android-device",
    /Android/i.test(navigator.userAgent)
);

/* =========================================================
   ACT DEVICE INVENTORY LINK — PURCHASES / SALES
   Source-aware stock rows; no accessory or spare-part mixing.
========================================================= */
(function ACTPhoneInventoryLink(){
  "use strict";
  const uid=()=>{try{return currentUser&&currentUser.uid?currentUser.uid:"guest";}catch(e){return "guest";}};
  const key=()=>`actPhoneManager_phoneInventory_${uid()}`;
  const read=()=>{try{const v=JSON.parse(localStorage.getItem(key())||"[]");return Array.isArray(v)?v:[];}catch(e){console.error("Phone inventory read error",e);return [];}};
  const norm=s=>String(s||"").trim().toLocaleLowerCase("ar").replace(/[أإآ]/g,"ا").replace(/\s+/g," ");
  function persist(rows){try{const k=key(),raw=JSON.stringify(rows);localStorage.setItem(k,raw);if(typeof saveUserDataToCloud==="function")saveUserDataToCloud(k,raw);return true;}catch(e){console.error("Phone inventory save error",e);alert("تعذر حفظ مخزون الأجهزة.");return false;}}
  function render(){
    const list=document.getElementById("act-phone-inventory-list"),units=document.getElementById("act-phone-inventory-units"),salesList=document.getElementById("act-phone-inventory-sales-list");if(!list)return;
    let rows=read(),changed=false;
    const initialRowsSnapshot=JSON.stringify(rows);
    // Import existing phone-purchase records once so earlier purchases are visible after this update.
    const uidValue=uid();
    const sources=[{key:`actPhoneManager_independentPurchases_${uidValue}`,source:"independent",phoneOnly:true},{key:`actPhoneManager_phonePurchases_${uidValue}`,source:"phone",phoneOnly:false}];
    const sourceRowsByRef=new Map();
    sources.forEach(src=>{try{const saved=JSON.parse(localStorage.getItem(src.key)||"[]");if(Array.isArray(saved))saved.forEach(record=>{if(!src.phoneOnly||record.category==="phones")sourceRowsByRef.set(src.source+":"+String(record.id),record);});}catch(e){}});
    rows=rows.filter(row=>{
      if(!row.sourceRef||(!row.sourceRef.startsWith("phone:")&&!row.sourceRef.startsWith("independent:")))return true;
      const record=sourceRowsByRef.get(row.sourceRef);
      const name=record&&(record.product||record.phoneName||record.productName||"");
      const serial=String(record?.serial||"").trim();
      const supplier=String(record?.supplier||record?.sellerName||"").trim();
      const rawPrice=record?.unitPrice??record?.price;
      const price=Number(rawPrice);
      const complete=Boolean(record&&String(name).trim()&&serial&&supplier&&String(rawPrice??"").trim()!==""&&Number.isFinite(price)&&price>0);
      if(!complete){if(Number(row.sold)>0){row.quantity=Number(row.sold);row.remaining=0;row.sourceRemoved=true;return true;}return false;}
      const sold=Math.max(0,Number(row.sold)||0);
      const quantity=row.source==="phone"?1:Math.max(1,Number(record.quantity)||1);
      row.product=name;row.serial=serial;row.supplier=supplier;row.unitPrice=price;row.quantity=Math.max(quantity,sold);row.remaining=Math.max(0,row.quantity-sold);
      return true;
    });
    sources.forEach(src=>{try{const saved=JSON.parse(localStorage.getItem(src.key)||"[]");if(!Array.isArray(saved))return;saved.forEach(record=>{if(src.phoneOnly&&record.category!=="phones")return;const ref=src.source+":"+String(record.id);const name=record.product||record.phoneName||"";const serial=String(record.serial||"").trim();const supplier=String(record.supplier||record.sellerName||"").trim();const rawPrice=record.unitPrice??record.price;const price=Number(rawPrice);const complete=Boolean(String(name).trim()&&serial&&supplier&&String(rawPrice??"").trim()!==""&&Number.isFinite(price)&&price>0);if(!complete)return;if(rows.some(x=>x.sourceRef===ref))return;const quantity=src.source==="phone"?1:Math.max(1,Number(record.quantity)||1);rows.unshift({sourceRef:ref,source:src.source,product:name,serial,quantity,sold:0,remaining:quantity,unitPrice:price,date:record.date||new Date().toISOString().slice(0,10),supplier,sales:[],updatedAt:new Date().toISOString()});changed=true;});}catch(e){console.warn("Phone purchase migration skipped",src.key,e);}});
    if(JSON.stringify(rows)!==initialRowsSnapshot)changed=true;
    if(changed)persist(rows);
    const total=rows.reduce((s,x)=>s+(Number(x.remaining)||0),0);if(units)units.textContent=total.toLocaleString("ar-EG")+" قطعة";
    if(!rows.length){list.innerHTML='<div class="act-phone-inventory-empty">لا توجد أجهزة في المخزون بعد. سجّل مشتريات من تصنيف «تلفونات» لتظهر هنا.</div>';}else{list.innerHTML=rows.filter(x=>Number(x.quantity)>0||Number(x.sold)>0).map(x=>`<article class="act-phone-stock-card"><div><strong>${esc(x.product)}</strong><small>${x.serial?'السيريال: '+esc(x.serial)+' · ':''}سعر الشراء: ${Number(x.unitPrice||0).toLocaleString('ar-EG')} ج.م</small><small>المورد: ${esc(x.supplier||'—')} · تاريخ الشراء: ${esc(x.date||'—')}</small></div><div class="act-phone-stock-qty"><strong>${Number(x.remaining)||0}</strong><small>متاح</small><small>من ${Number(x.quantity)||0}</small></div></article>`).join("")||'<div class="act-phone-inventory-empty">لا توجد أجهزة متاحة.</div>';}
    if(salesList){const sales=rows.flatMap(x=>(Array.isArray(x.sales)?x.sales:[]).map(s=>({...s,product:s.product||x.product}))).sort((a,b)=>String(b.date||"").localeCompare(String(a.date||""))).slice(0,10);salesList.innerHTML=sales.length?sales.map(s=>`<article class="act-phone-stock-card"><div><strong>${esc(s.product)}</strong><small>${s.serial?'السيريال: '+esc(s.serial)+' · ':''}تم تسجيل البيع</small></div><div class="act-phone-stock-qty"><small>${esc(String(s.date||"").slice(0,16).replace("T"," "))}</small><small>قطعة واحدة</small></div></article>`).join(""):'<div class="act-phone-inventory-empty">لا توجد مبيعات أجهزة مسجلة من هذا المخزون حتى الآن.</div>';}
  }
  function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function upsert(source,record,oldRecord){
    const rows=read();const ref=source+":"+String(record.id),oldRef=oldRecord?source+":"+String(oldRecord.id):ref;let index=rows.findIndex(x=>x.sourceRef===oldRef);
    if(record.category!==undefined&&record.category!=="phones"){if(index>=0){const existing=rows[index];if(Number(existing.sold)>0){existing.quantity=Number(existing.sold);existing.remaining=0;existing.sourceRemoved=true;}else rows.splice(index,1);}persist(rows);render();return;}
    const name=record.product||record.phoneName||record.productName||"",serial=String(record.serial||"").trim(),supplier=String(record.supplier||record.sellerName||"").trim(),rawPrice=record.unitPrice??record.price,unitPrice=Number(rawPrice);
    const complete=Boolean(String(name).trim()&&serial&&supplier&&String(rawPrice??"").trim()!==""&&Number.isFinite(unitPrice)&&unitPrice>0);
    const existing=index>=0?rows[index]:null;
    if(!complete){if(existing){if(Number(existing.sold)>0){existing.quantity=Number(existing.sold);existing.remaining=0;existing.sourceRemoved=true;}else rows.splice(index,1);}persist(rows);render();return;}
    const requested=source==="phone"?1:Math.max(1,Number(record.quantity)||1),sold=existing?Math.max(0,Number(existing.sold)||0):0,quantity=Math.max(requested,sold);
    const row={...(existing||{}),sourceRef:ref,source,product:name,serial,quantity,sold,remaining:Math.max(0,quantity-sold),unitPrice,date:record.date||new Date().toISOString().slice(0,10),supplier,sales:existing?.sales||[],updatedAt:new Date().toISOString()};if(index>=0)rows[index]=row;else rows.unshift(row);persist(rows);render();
  }
  function remove(source,record){if(!record)return;const ref=source+":"+String(record.id),rows=read(),index=rows.findIndex(x=>x.sourceRef===ref);if(index<0)return;const row=rows[index];if(Number(row.sold)>0){row.quantity=Number(row.sold);row.remaining=0;row.sourceRemoved=true;}else rows.splice(index,1);persist(rows);render();}
  function consume(product,serial){
    const rows=read(),wantedSerial=String(serial||"").trim(),wanted=norm(product),candidates=rows.filter(x=>Number(x.remaining)>0);let found=null;
    if(wantedSerial){const exact=rows.find(x=>String(x.serial||"").trim()===wantedSerial);if(exact){if(Number(exact.remaining)<=0)return {matched:true,ok:false,remaining:0};found=exact;}else found=candidates.find(x=>!String(x.serial||"").trim()&&norm(x.product)===wanted);}
    else found=candidates.find(x=>norm(x.product)===wanted);
    if(!found){const exists=rows.some(x=>(wantedSerial&&String(x.serial||"").trim()===wantedSerial)||(!wantedSerial&&norm(x.product)===wanted)||(wantedSerial&&!String(x.serial||"").trim()&&norm(x.product)===wanted));return {matched:exists,ok:!exists,remaining:0};}
    found.remaining=Math.max(0,Number(found.remaining)-1);found.sold=(Number(found.sold)||0)+1;found.sales=Array.isArray(found.sales)?found.sales:[];found.sales.unshift({product:found.product,serial:wantedSerial||found.serial||"",date:new Date().toISOString()});found.updatedAt=new Date().toISOString();persist(rows);render();return {matched:true,ok:true,remaining:found.remaining};
  }
  function restoreSale(product,serial,quantity=1){
    const rows=read(),wantedSerial=String(serial||"").trim(),wanted=norm(product);
    const found=rows.find(x=>(wantedSerial&&String(x.serial||"").trim()===wantedSerial)||(!wantedSerial&&norm(x.product)===wanted));
    if(!found)return {matched:false,ok:false};
    const count=Math.max(1,Math.floor(Number(quantity)||1));
    found.remaining=Math.max(0,Number(found.remaining)||0)+count;
    found.sold=Math.max(0,(Number(found.sold)||0)-count);
    found.returns=Array.isArray(found.returns)?found.returns:[];
    found.returns.unshift({product:found.product,serial:found.serial||"",quantity:count,date:new Date().toISOString()});
    found.updatedAt=new Date().toISOString();persist(rows);render();return {matched:true,ok:true,remaining:found.remaining};
  }
  window.actPhoneInventoryUpsertPurchase=upsert;window.actPhoneInventoryRemovePurchase=remove;window.actPhoneInventoryConsumeSale=consume;window.actPhoneInventoryRestoreSale=restoreSale;window.renderActPhoneInventory=render;
  document.addEventListener("DOMContentLoaded",render);window.addEventListener("act-user-data-ready",render);window.addEventListener("act-phone-inventory-updated",render);
})();

/* =========================================================
   ACT TRAINING CENTER V5 — ISOLATED TRAINER ACCOUNTS
========================================================= */
(function ACTTrainingIndependentV5(){
  "use strict";
  const $=id=>document.getElementById(id), section=$('training-section');
  if(!section || window.actTrainingV5Ready) return; window.actTrainingV5Ready=true;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ownerUid=()=>{try{return currentUser?.uid||null}catch(e){return null}};
  let trainingApp, trainingAuth, trainingDb, trainerProfile=null, students=[], finance=[], photoData='', trainerPhotoData='', ownerMode=true;
  try { trainingApp=initializeApp(firebaseConfig,'act-training-auth-v5'); trainingAuth=getAuth(trainingApp); trainingDb=getFirestore(trainingApp); }
  catch(e){ console.error('ACT training Firebase init:',e); }
  const trainerRef=id=>doc(db,'actTrainingTrainers',id);
  const activeTrainingDb=()=>ownerMode?db:trainingDb;
  const studentsCol=id=>collection(activeTrainingDb(),'actTrainingTrainers',id,'students');
  const financeCol=id=>collection(activeTrainingDb(),'actTrainingTrainers',id,'finance');
  const money=n=>`${(Number(n)||0).toLocaleString('ar-EG')} ج.م`;
  function show(view){['act-training-owner-view','act-training-login-view','act-training-trainer-view'].forEach(id=>{const el=$(id);if(el)el.hidden=id!==view;});}
  function open(){const app=$('main-page'),content=$('app-content'),device=$('devices-main-section');if(app)app.style.display='block';if(content)content.style.display='block';if(device)device.style.display='none';document.querySelectorAll('#home-section,#customers-section,#employees-section,#wallet-section,#account-section,#independent-sales-section,#independent-purchases-section,#more-section,#day-close-section,.act-extra-section').forEach(n=>{if(n!==section)n.style.display='none';});section.hidden=false;section.style.setProperty('display','block','important');document.getElementById('nav-more')?.classList.add('active');document.querySelectorAll('.bottom-nav-button').forEach(n=>{if(n.id!=='nav-more')n.classList.remove('active')});show('act-training-owner-view');loadTrainers();window.scrollTo({top:0,behavior:'smooth'});}
  const trainerEmailForUsername=username=>`${String(username||'').trim().toLowerCase()}@trainers.actmanager.invalid`;
  async function loadTrainers(){const uid=ownerUid(),list=$('act-training-trainers-list');if(!uid){show('act-training-login-view');return;}if(!list)return;list.innerHTML='<div class="act-extra-empty">جارٍ تحميل حسابات المدربين...</div>';try{const q=query(collection(db,'actTrainingTrainers'),where('ownerUid','==',uid));const snap=await getDocs(q);const term=($('act-training-trainer-search')?.value||'').trim().toLowerCase();const rows=snap.docs.map(d=>({id:d.id,...d.data()})).filter(x=>String(x.name||'').toLowerCase().includes(term));list.innerHTML=rows.length?rows.map(t=>`<article class="act-extra-item act-training-card"><div class="act-training-person-head"><div class="act-training-avatar">${t.photo?`<img src="${t.photo}" alt="صورة المدرب">`:'👨‍🏫'}</div><div class="act-training-person-info"><strong>${esc(t.name||'مدرب بدون اسم')}</strong></div></div><div class="act-extra-actions"><button type="button" data-training-enter="${esc(t.id)}">دخول المدرب — تأكيد كلمة المرور</button></div></article>`).join(''):'<div class="act-extra-empty">لا توجد حسابات مدربين حتى الآن.</div>'; }catch(e){console.error(e);list.innerHTML='<div class="act-extra-empty">تعذر تحميل المدربين. راجع صلاحيات Firestore.</div>';}}
  const createPanel=$('act-training-create-panel'), studentPanel=$('act-training-student-panel'), financePanel=$('act-training-finance-panel');
  const reveal=(panel,focusId)=>{if(!panel)return;panel.hidden=false;panel.scrollIntoView({behavior:'smooth',block:'start'});if(focusId)setTimeout(()=>$(focusId)?.focus(),180);};
  const conceal=panel=>{if(panel)panel.hidden=true;};
  $('act-training-show-create')?.addEventListener('click',()=>reveal(createPanel,'act-training-trainer-name'));
  $('act-training-show-login')?.addEventListener('click',()=>{show('act-training-login-view');$('act-training-login-username')?.focus();});
  $('act-training-login-back')?.addEventListener('click',()=>{show('act-training-owner-view');loadTrainers();});
  document.querySelectorAll('[data-training-close-create]').forEach(b=>b.addEventListener('click',()=>{conceal(createPanel);$('act-training-trainer-form')?.reset();$('act-training-trainer-salary').value='0';}));
  $('act-training-toggle-student')?.addEventListener('click',()=>{if(studentPanel.hidden)reveal(studentPanel,'act-training-student-name');else conceal(studentPanel);});
  $('act-training-toggle-finance')?.addEventListener('click',()=>{if(financePanel.hidden)reveal(financePanel,'act-training-finance-type');else conceal(financePanel);});
  $('act-training-student-cancel-top')?.addEventListener('click',()=>{resetStudent();conceal(studentPanel);});
  $('act-training-finance-cancel')?.addEventListener('click',()=>conceal(financePanel));
  $('act-training-finance-cancel-bottom')?.addEventListener('click',()=>conceal(financePanel));
  $('act-training-trainer-photo')?.addEventListener('change',()=>{const f=$('act-training-trainer-photo').files?.[0];if(!f)return;if(!f.type.startsWith('image/')||f.size>8*1024*1024){alert('اختر صورة واضحة لا تتجاوز 8 ميجابايت.');$('act-training-trainer-photo').value='';return;}const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),scale=Math.min(1,420/Math.max(im.width,im.height));c.width=Math.max(1,Math.round(im.width*scale));c.height=Math.max(1,Math.round(im.height*scale));c.getContext('2d').drawImage(im,0,0,c.width,c.height);trainerPhotoData=c.toDataURL('image/jpeg',.68);$('act-training-trainer-photo-preview').innerHTML=`<img src="${trainerPhotoData}" alt="معاينة صورة المدرب">`;};im.src=String(r.result);};r.readAsDataURL(f);});
  $('act-training-trainer-form')?.addEventListener('submit',async e=>{e.preventDefault();const uid=ownerUid();if(!uid||!trainingAuth){alert('يجب تسجيل دخول صاحب البرنامج أولًا.');return;}const username=$('act-training-trainer-username').value.trim().toLowerCase(),password=$('act-training-trainer-password').value; if(!/^[a-z0-9._-]{3,40}$/.test(username)){alert('اسم المستخدم يجب أن يتكون من 3 إلى 40 حرفًا إنجليزيًا أو رقمًا.');return;}const btn=e.submitter;if(btn)btn.disabled=true;try{const exists=await getDocs(query(collection(db,'actTrainingTrainers'),where('ownerUid','==',uid),where('username','==',username)));if(!exists.empty)throw new Error('اسم المستخدم مستخدم بالفعل. اختر اسمًا آخر.');const cred=await createUserWithEmailAndPassword(trainingAuth,trainerEmailForUsername(username),password);const id=cred.user.uid;const profile={ownerUid:uid,username,name:$('act-training-trainer-name').value.trim(),phone:$('act-training-trainer-phone').value.trim(),nationalId:$('act-training-trainer-national').value.trim(),photo:trainerPhotoData,specialty:$('act-training-trainer-specialty').value.trim(),salary:Number($('act-training-trainer-salary').value)||0,notes:$('act-training-trainer-notes').value.trim(),createdAt:new Date().toISOString()};await setDoc(trainerRef(id),profile);await signOut(trainingAuth);e.target.reset();trainerPhotoData='';$('act-training-trainer-photo-preview').textContent='لم يتم اختيار صورة';$('act-training-trainer-salary').value='0';alert('تم إنشاء حساب المدرب. أعطه اسم المستخدم وكلمة المرور التي حددتها له.');await loadTrainers();}catch(err){console.error('Create trainer error',err);alert(err.code==='auth/email-already-in-use'?'اسم المستخدم مستخدم بالفعل.':'تعذر إنشاء الحساب: '+(err.message||err));}finally{if(btn)btn.disabled=false;}});
  $('act-training-trainer-search')?.addEventListener('input',loadTrainers);
  $('act-training-trainers-list')?.addEventListener('click',async e=>{const enter=e.target.closest('[data-training-enter]');if(!enter)return;const id=enter.dataset.trainingEnter;const snap=await getDoc(trainerRef(id));if(!snap.exists()){alert('حساب المدرب غير موجود.');return;}const profile={id,...snap.data()};const password=window.prompt(`تأكيد هوية المدرب: ${profile.name||profile.username}\nليفتح المدرب ملفه، يجب أن يدخل كلمة مروره بنفسه.`);if(password===null)return;if(!password){alert('يجب إدخال كلمة المرور للتحقق.');return;}enter.disabled=true;try{if(trainingAuth.currentUser)await signOut(trainingAuth);const credential=await signInWithEmailAndPassword(trainingAuth,trainerEmailForUsername(profile.username),password);if(credential.user.uid!==id)throw new Error('بيانات الحساب لا تطابق هذا المدرب.');await signOut(trainingAuth);trainerProfile=profile;ownerMode=true;await loadTrainerWorkspace();}catch(err){try{if(trainingAuth.currentUser)await signOut(trainingAuth);}catch(_){}console.error('Trainer identity verification failed',err);alert(err.code==='auth/invalid-credential'||err.code==='auth/wrong-password'||err.code==='auth/user-not-found'?'كلمة المرور غير صحيحة. لن يتم فتح ملف المدرب.':'تعذر التحقق من هوية المدرب: '+(err.message||err));}finally{enter.disabled=false;}});
  $('act-training-login-form')?.addEventListener('submit',async e=>{e.preventDefault();try{const username=$('act-training-login-username').value.trim().toLowerCase();const cred=await signInWithEmailAndPassword(trainingAuth,trainerEmailForUsername(username),$('act-training-login-password').value);const snap=await getDoc(doc(trainingDb,'actTrainingTrainers',cred.user.uid));if(!snap.exists()||snap.data().username!==username){await signOut(trainingAuth);throw new Error('اسم المستخدم أو كلمة المرور غير صحيحة.');}trainerProfile={id:cred.user.uid,...snap.data()};ownerMode=false;await loadTrainerWorkspace();}catch(err){alert('تعذر تسجيل الدخول: '+(err.code==='auth/invalid-credential'?'اسم المستخدم أو كلمة المرور غير صحيحة.':(err.message||err)));}});
  $('act-training-logout')?.addEventListener('click',async()=>{try{await signOut(trainingAuth);}catch(e){}trainerProfile=null;students=[];finance=[];photoData='';ownerMode=true;conceal(studentPanel);conceal(financePanel);$('act-training-login-password').value='';show(ownerUid()?'act-training-owner-view':'act-training-login-view');if(ownerUid())loadTrainers();});
  async function loadTrainerWorkspace(){show('act-training-trainer-view');conceal(studentPanel);conceal(financePanel);$('act-training-current-trainer').textContent=trainerProfile.name||'المدرب';const avatar=$('act-training-current-trainer-photo');if(avatar)avatar.innerHTML=trainerProfile.photo?`<img src="${trainerProfile.photo}" alt="صورة المدرب">`:'👨‍🏫';await Promise.all([loadStudents(),loadFinance()]);}
  async function loadStudents(){try{const snap=await getDocs(studentsCol(trainerProfile.id));students=snap.docs.map(d=>({id:d.id,...d.data()}));renderStudents();}catch(e){console.error(e);alert('تعذر تحميل الطلاب. تحقق من قواعد Firestore.');}}
  async function loadFinance(){try{const snap=await getDocs(financeCol(trainerProfile.id));finance=snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));renderFinance();}catch(e){console.error(e);}}
  function renderStudents(){const q=($('act-training-student-search')?.value||'').trim().toLowerCase(),rows=students.filter(x=>[x.name,x.phone,x.nationalId,x.level].join(' ').toLowerCase().includes(q)),list=$('act-training-students-list');$('act-training-stats').innerHTML=[['عدد الطلاب',students.length,'👨‍🎓'],['إجمالي الرسوم',money(students.reduce((s,x)=>s+(+x.fee||0),0)),'💳'],['المحصل',money(students.reduce((s,x)=>s+(+x.paid||0),0)),'✅'],['المتبقي',money(students.reduce((s,x)=>s+Math.max(0,(+x.fee||0)-(+x.paid||0)),0)),'⏳']].map(x=>`<article class="act-module-stat"><span>${x[2]}</span><small>${x[0]}</small><strong>${x[1]}</strong></article>`).join('');list.innerHTML=rows.length?rows.map(s=>`<article class="act-extra-item act-training-card" data-student-id="${esc(s.id)}"><div class="act-training-person-head"><div class="act-training-avatar">${s.photo?`<img src="${s.photo}" alt="صورة المتدرب">`:'👨‍🎓'}</div><div class="act-training-person-info"><strong>${esc(s.name)}</strong><small>${esc(s.phone||'—')} · بطاقة: ${esc(s.nationalId||'—')}</small><small>المستوى: ${esc(s.level||'مبتدئ')}</small><small>الرسوم: ${money(s.fee)} · المدفوع: ${money(s.paid)} · المتبقي: ${money(Math.max(0,(+s.fee||0)-(+s.paid||0)))}</small></div></div><div class="act-extra-actions"><button type="button" data-student-edit="${esc(s.id)}">تعديل</button><button type="button" data-student-delete="${esc(s.id)}">حذف</button></div>${s.notes?`<small>${esc(s.notes)}</small>`:''}</article>`).join(''):'<div class="act-extra-empty">لا يوجد طلاب مطابقون. أضف أول متدرب من النموذج.</div>';}
  $('act-training-student-search')?.addEventListener('input',renderStudents);
  $('act-training-student-photo')?.addEventListener('change',()=>{const f=$('act-training-student-photo').files?.[0];if(!f)return;if(!f.type.startsWith('image/')||f.size>8*1024*1024){alert('اختر صورة لا تتجاوز 8 ميجابايت.');return;}const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const c=document.createElement('canvas'),scale=Math.min(1,420/Math.max(im.width,im.height));c.width=Math.max(1,Math.round(im.width*scale));c.height=Math.max(1,Math.round(im.height*scale));c.getContext('2d').drawImage(im,0,0,c.width,c.height);photoData=c.toDataURL('image/jpeg',.7);$('act-training-student-photo-preview').innerHTML=`<img src="${photoData}" alt="معاينة الصورة">`;};im.src=String(r.result);};r.readAsDataURL(f);});
  function resetStudent(){ $('act-training-student-form').reset();$('act-training-student-id').value='';$('act-training-student-fee').value='0';$('act-training-student-paid').value='0';$('act-training-student-photo').value='';$('act-training-student-photo-preview').textContent='لا توجد صورة مختارة';$('act-training-student-form-title').textContent='إضافة متدرب';photoData=''; }
  $('act-training-student-cancel')?.addEventListener('click',()=>{resetStudent();conceal(studentPanel);});
  $('act-training-student-form')?.addEventListener('submit',async e=>{e.preventDefault();const id=$('act-training-student-id').value||('st_'+Date.now()+'_'+Math.random().toString(36).slice(2,7)),old=students.find(x=>x.id===id);const data={name:$('act-training-student-name').value.trim(),phone:$('act-training-student-phone').value.trim(),nationalId:$('act-training-student-national').value.trim(),level:$('act-training-student-level').value,fee:Number($('act-training-student-fee').value)||0,paid:Number($('act-training-student-paid').value)||0,photo:photoData||(old?.photo||''),notes:$('act-training-student-notes').value.trim(),createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};if(!data.name)return;try{await setDoc(doc(studentsCol(trainerProfile.id),id),data);resetStudent();conceal(studentPanel);await loadStudents();}catch(err){alert('تعذر حفظ المتدرب: '+err.message);}});
  $('act-training-students-list')?.addEventListener('click',async e=>{const edit=e.target.closest('[data-student-edit]'),del=e.target.closest('[data-student-delete]');if(edit){const s=students.find(x=>x.id===edit.dataset.studentEdit);if(!s)return;$('act-training-student-id').value=s.id;$('act-training-student-name').value=s.name||'';$('act-training-student-phone').value=s.phone||'';$('act-training-student-national').value=s.nationalId||'';$('act-training-student-level').value=s.level||'مبتدئ';$('act-training-student-fee').value=s.fee||0;$('act-training-student-paid').value=s.paid||0;$('act-training-student-notes').value=s.notes||'';photoData=s.photo||'';$('act-training-student-photo-preview').innerHTML=photoData?`<img src="${photoData}" alt="الصورة الحالية">`:'لا توجد صورة مختارة';$('act-training-student-form-title').textContent='تعديل بيانات المتدرب';reveal(studentPanel,'act-training-student-name');}if(del){const id=del.dataset.studentDelete;if(!confirm('تأكيد حذف ملف المتدرب؟'))return;try{await deleteDoc(doc(studentsCol(trainerProfile.id),id));await loadStudents();}catch(err){alert('تعذر الحذف: '+err.message);}}});
  $('act-training-finance-form')?.addEventListener('submit',async e=>{e.preventDefault();const data={type:$('act-training-finance-type').value,amount:Number($('act-training-finance-amount').value)||0,note:$('act-training-finance-note').value.trim(),createdAt:new Date().toISOString()};try{const ref=doc(financeCol(trainerProfile.id));await setDoc(ref,data);e.target.reset();conceal(financePanel);await loadFinance();}catch(err){alert('تعذر حفظ العملية المالية: '+err.message);}});
  function renderFinance(){const labels={salary:'راتب',bonus:'مكافأة',loan:'سلفة / قرض',deduction:'خصم'};$('act-training-finance-list').innerHTML=finance.length?finance.map(x=>`<article class="act-extra-item"><div><strong>${labels[x.type]||'عملية مالية'} — ${money(x.amount)}</strong><small>${esc(x.note)} · ${new Date(x.createdAt).toLocaleString('ar-EG')}</small></div><button type="button" data-finance-delete="${esc(x.id)}">حذف</button></article>`).join(''):'<div class="act-extra-empty">لا توجد عمليات مالية مسجلة.</div>';}
  $('act-training-finance-list')?.addEventListener('click',async e=>{const b=e.target.closest('[data-finance-delete]');if(!b||!confirm('حذف العملية المالية؟'))return;try{await deleteDoc(doc(financeCol(trainerProfile.id),b.dataset.financeDelete));await loadFinance();}catch(err){alert('تعذر الحذف: '+err.message);}});
  $('more-training')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();open();},true);
  section.querySelector('[data-act-training-back]')?.addEventListener('click',()=>document.getElementById('nav-more')?.click());
  window.actOpenTraining=open;window.addEventListener('act-user-data-ready',()=>{if(section.style.display!=='none'&&ownerUid())loadTrainers();});
  if(!ownerUid())show('act-training-login-view');else show('act-training-owner-view');

  // ACT SECTION PASSWORD GATE — per owner/device
  const lockTargets={maintenance:{label:'الصيانة',selectors:['#more-maintenance']},training:{label:'التدريب',selectors:['#more-training']},account:{label:'الحساب الشخصي',selectors:['#nav-account']},employees:{label:'الموظفين',selectors:['#more-employees']},customers:{label:'العملاء',selectors:['#more-customers']},accessories:{label:'الإكسسوارات',selectors:['#more-accessories']},safe:{label:'الخزنة',selectors:['#more-safe']},wallet:{label:'إيداع / سحب المحفظة',selectors:['#more-wallet']},reports:{label:'التقارير',selectors:['#more-reports']},dayclose:{label:'إقفال اليوم',selectors:['#more-day-close']},sales:{label:'المبيعات',selectors:['#nav-sales']},purchases:{label:'المشتريات',selectors:['#nav-purchases']},devices:{label:'الأجهزة',selectors:['#nav-devices']}};
  const lockKey=()=>`actManager_sectionLocks_${ownerUid()||'guest'}`;
  const readLocks=()=>{try{return JSON.parse(localStorage.getItem(lockKey())||'{}')||{};}catch(_){return {};}};
  const writeLocks=v=>localStorage.setItem(lockKey(),JSON.stringify(v));
  const hashPassword=async value=>{const bytes=new TextEncoder().encode(String(value));const digest=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(digest)).map(x=>x.toString(16).padStart(2,'0')).join('');};
  function renderLocks(){const host=$('act-section-lock-list');if(!host)return;const locks=readLocks();host.innerHTML=Object.entries(lockTargets).map(([id,item])=>`<div class="act-extra-item"><div><strong>${item.label}</strong><small>${locks[id]?'🔐 محمي بكلمة سر':'🔓 بدون حماية'}</small></div></div>`).join('');}
  $('act-section-lock-form')?.addEventListener('submit',async e=>{e.preventDefault();const id=$('act-section-lock-target').value,pw=$('act-section-lock-password').value;if(pw.length<4){alert('اكتب كلمة سر من 4 أحرف أو أرقام على الأقل.');return;}try{const locks=readLocks();locks[id]={hash:await hashPassword(pw),updatedAt:new Date().toISOString()};writeLocks(locks);$('act-section-lock-password').value='';renderLocks();alert('تم تفعيل كلمة سر للقسم المحدد.');}catch(err){alert('تعذر حفظ كلمة السر في هذا المتصفح.');console.error(err);}});
  $('act-section-unlock')?.addEventListener('click',()=>{const id=$('act-section-lock-target').value,locks=readLocks();if(!locks[id]){alert('القسم المحدد غير محمي حاليًا.');return;}if(!confirm('هل تريد إلغاء كلمة سر هذا القسم؟'))return;delete locks[id];writeLocks(locks);renderLocks();alert('تم إلغاء حماية القسم.');});
  document.addEventListener('click',async e=>{const el=e.target.closest('#more-maintenance,#more-training,#nav-account,#more-employees,#more-customers,#more-accessories,#more-safe,#more-wallet,#more-reports,#more-day-close,#nav-sales,#nav-purchases,#nav-devices');if(!el)return;if(el.dataset.actLockApproved==='1'){delete el.dataset.actLockApproved;return;}const id=Object.keys(lockTargets).find(k=>lockTargets[k].selectors.some(sel=>el.matches(sel)));if(!id)return;const lock=readLocks()[id];if(!lock)return;e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();const entered=prompt(`هذا القسم محمي. أدخل كلمة السر للدخول إلى: ${lockTargets[id].label}`);if(entered===null)return;try{if(await hashPassword(entered)!==lock.hash){alert('كلمة السر غير صحيحة.');return;}el.dataset.actLockApproved='1';el.click();delete el.dataset.actLockApproved;}catch(err){alert('تعذر التحقق من كلمة السر.');}},true);
  renderLocks();
})();

/* =========================================================
   ACT MANAGER — GLOBAL SMART SEARCH
   بحث شامل في الأقسام والبيانات والسجلات
   يوضع في نهاية ملف script.js
========================================================= */

(function ACTGlobalSearch() {
    "use strict";

    if (window.actGlobalSearchReady) return;
    window.actGlobalSearchReady = true;

    const input = document.getElementById("act-nav-search");
    const searchBox = input
        ? input.closest(".act-nav-search")
        : null;

    if (!input || !searchBox) {
        console.warn("ACT Global Search: search input not found.");
        return;
    }

    /* =========================================
       إنشاء قائمة النتائج
    ========================================= */

    const resultsBox = document.createElement("div");
    resultsBox.id = "act-global-search-results";
    resultsBox.setAttribute("role", "listbox");
    resultsBox.setAttribute("aria-label", "نتائج البحث");

    Object.assign(resultsBox.style, {
        position: "absolute",
        top: "calc(100% + 10px)",
        right: "0",
        left: "0",
        zIndex: "999999",
        display: "none",
        maxHeight: "min(65vh, 480px)",
        overflowY: "auto",
        padding: "8px",
        borderRadius: "14px",
        border: "1px solid rgba(55, 170, 255, .28)",
        background: "#081321",
        boxShadow: "0 15px 45px rgba(0,0,0,.45)",
        color: "#eef7ff",
        textAlign: "right",
        direction: "rtl"
    });

    if (getComputedStyle(searchBox).position === "static") {
        searchBox.style.position = "relative";
    }

    searchBox.appendChild(resultsBox);

    const style = document.createElement("style");
    style.textContent = `
        #act-global-search-results .act-search-result {
            width: 100%;
            display: flex;
            align-items: center;
            gap: 11px;
            padding: 11px 12px;
            margin: 3px 0;
            border: 1px solid transparent;
            border-radius: 10px;
            background: transparent;
            color: #e4e6eb;
            text-align: right;
            cursor: pointer;
            font: inherit;
        }

        #act-global-search-results .act-search-result:hover,
        #act-global-search-results .act-search-result:focus {
            outline: none;
            background: rgba(255,255,255,0.083);
            border-color: rgba(255,255,255,0.066);
        }

        #act-global-search-results .act-search-icon {
            width: 35px;
            height: 35px;
            flex: 0 0 35px;
            display: grid;
            place-items: center;
            border-radius: 10px;
            background: rgba(255,255,255,0.072);
            font-size: 17px;
        }

        #act-global-search-results .act-search-text {
            min-width: 0;
            flex: 1;
        }

        #act-global-search-results .act-search-title {
            display: block;
            font-size: 13px;
            font-weight: 700;
            overflow-wrap: anywhere;
        }

        #act-global-search-results .act-search-detail {
            display: block;
            margin-top: 4px;
            color: #e4e6eb;
            font-size: 11px;
            overflow-wrap: anywhere;
        }

        #act-global-search-results .act-search-empty {
            padding: 18px 10px;
            text-align: center;
            color: #e4e6eb;
            font-size: 13px;
        }

        #act-global-search-results .act-search-heading {
            padding: 8px 10px 5px;
            color: #e4e6eb;
            font-size: 11px;
            font-weight: 800;
        }

        @media(max-width:700px) {
            #act-global-search-results {
                position: fixed !important;
                top: 78px !important;
                right: 10px !important;
                left: 10px !important;
                width: auto !important;
                max-height: 65vh !important;
            }
        }
    
/* auto light layer */

:where(html[data-theme="light"]) #act-global-search-results .act-search-result {
  color: #303540;
}
:where(html[data-theme="light"]) #act-global-search-results .act-search-result:hover,
:where(html[data-theme="light"]) #act-global-search-results .act-search-result:focus {
  background: rgba(0,0,0,0.075);
  border-color: rgba(0,0,0,0.059);
}
:where(html[data-theme="light"]) #act-global-search-results .act-search-icon {
  background: rgba(0,0,0,0.065);
}
:where(html[data-theme="light"]) #act-global-search-results .act-search-detail {
  color: #303540;
}
:where(html[data-theme="light"]) #act-global-search-results .act-search-empty {
  color: #303540;
}
:where(html[data-theme="light"]) #act-global-search-results .act-search-heading {
  color: #303540;
}`;

    document.head.appendChild(style);

    /* =========================================
       أدوات عامة
    ========================================= */

    function getCurrentUid() {
        try {
            if (
                typeof currentUser !== "undefined" &&
                currentUser &&
                currentUser.uid
            ) {
                return currentUser.uid;
            }
        } catch (error) {}

        try {
            if (
                typeof auth !== "undefined" &&
                auth &&
                auth.currentUser &&
                auth.currentUser.uid
            ) {
                return auth.currentUser.uid;
            }
        } catch (error) {}

        return "guest";
    }

    function normalize(value) {
        return String(value == null ? "" : value)
            .toLocaleLowerCase("ar")
            .replace(/[أإآ]/g, "ا")
            .replace(/ة/g, "ه")
            .replace(/ى/g, "ي")
            .replace(/[ًٌٍَُِّْـ]/g, "")
            .trim();
    }

    function escapeHTML(value) {
        return String(value == null ? "" : value).replace(
            /[&<>"']/g,
            function (character) {
                return {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '"': "&quot;",
                    "'": "&#39;"
                }[character];
            }
        );
    }

    function getObjectText(value, depth) {
        depth = depth || 0;

        if (depth > 4 || value == null) return "";

        if (
            typeof value === "string" ||
            typeof value === "number"
        ) {
            return String(value);
        }

        if (Array.isArray(value)) {
            return value.map(item =>
                getObjectText(item, depth + 1)
            ).join(" ");
        }

        if (typeof value === "object") {
            return Object.entries(value)
                .map(([key, item]) => {
                    if (
                        typeof item === "function" ||
                        item == null
                    ) {
                        return "";
                    }

                    return key + " " + getObjectText(item, depth + 1);
                })
                .join(" ");
        }

        return "";
    }

    function getRecordTitle(record) {
        if (!record || typeof record !== "object") {
            return String(record || "سجل");
        }

        const fields = [
            "name",
            "customerName",
            "productName",
            "product",
            "phoneName",
            "deviceName",
            "title",
            "supplier",
            "sellerName",
            "employeeName",
            "fullName",
            "nationalId",
            "account",
            "service",
            "operationName",
            "invoiceNumber",
            "serial",
            "id"
        ];

        for (const field of fields) {
            if (
                record[field] !== undefined &&
                record[field] !== null &&
                String(record[field]).trim()
            ) {
                return String(record[field]);
            }
        }

        return "سجل محفوظ";
    }

    function getRecordDetail(record) {
        if (!record || typeof record !== "object") return "";

        const fields = [
            "customerPhone",
            "sellerPhone",
            "phone",
            "serial",
            "date",
            "statusName",
            "nationalId",
            "section",
            "job",
            "category",
            "notes",
            "amount",
            "total",
            "price"
        ];

        return fields
            .filter(field =>
                record[field] !== undefined &&
                record[field] !== null &&
                String(record[field]).trim()
            )
            .slice(0, 4)
            .map(field => String(record[field]))
            .join(" • ");
    }

    /* =========================================
       تحديد القسم المرتبط بكل نتيجة
    ========================================= */

    function getDestination(key, record) {
        const source = normalize(key);

        if (source.includes("account_profile")) {
            return {
                button: "nav-account",
                section: "account-section"
            };
        }

        if (source.includes("training")) {
            return { button: "nav-more", section: "training-section", target: "more-training" };
        }

        if (source.includes("accessories")) {
            return { button: "nav-more", section: "accessories-section", target: "more-accessories" };
        }
        if (source.includes("settings")) {
            return { button: "nav-more", section: "settings-section", target: "more-settings" };
        }

        if (source.includes("general-reports") || source.includes("reports")) {
            return { button: "nav-more", section: "general-reports-section", target: "more-reports" };
        }

        if (source.includes("notifications")) {
            return {
                button: "nav-more",
                section: "more-section",
                target: "notification-bell-button"
            };
        }

        if (source.includes("wallet")) {
            return {
                button: "nav-more",
                section: "wallet-section"
            };
        }

        if (source.includes("employee")) {
            return {
                button: "nav-more",
                section: "employees-section"
            };
        }

        if (source.includes("independentpurchases")) {
            return {
                button: "nav-purchases",
                section: "independent-purchases-section"
            };
        }

        if (
            source.includes("phonepurchases") ||
            source.includes("purchases")
        ) {
            return {
                button: "nav-purchases",
                section: "independent-purchases-section"
            };
        }

        if (source.includes("returns")) {
            return {
                button: "nav-sales",
                section: "independent-sales-section",
                target: "sales-view-returns"
            };
        }

        if (source.includes("sales")) {
            return {
                button: "nav-sales",
                section: "independent-sales-section",
                target: "sales-view-history"
            };
        }

        if (source.includes("devices")) {
            return {
                button: "nav-devices",
                section: "customers-section"
            };
        }

        if (source.includes("dashboard")) {
            return {
                button: "nav-home",
                section: "home-section"
            };
        }

        if (source.includes("dayclose")) {
            return {
                button: "nav-more",
                section: "day-close-section"
            };
        }

        return {
            button: "nav-home",
            section: "home-section"
        };
    }

    function getSectionDestination(element) {
        const id = element.id || "";
        const text = normalize(
            element.innerText ||
            element.textContent ||
            element.getAttribute("aria-label") ||
            ""
        );

        const section = element.closest(
            "section, [id$='-section'], .section"
        );

        if (id === "nav-home" || id === "nav-devices" ||
            id === "nav-sales" || id === "nav-purchases" ||
            id === "nav-account" || id === "nav-more") {
            return {
                button: id,
                section: element.dataset.section || ""
            };
        }

        if (id.includes("training") || text.includes("التدريب") || text.includes("متدرب") || text.includes("مدرب")) {
            return { button: "nav-more", section: "training-section", target: "more-training" };
        }
        if (id.includes("accessories") || text.includes("الاكسسوار")) {
            return { button: "nav-more", section: "accessories-section", target: "more-accessories" };
        }
        if (id.includes("reports") || text.includes("التقارير")) {
            return { button: "nav-more", section: "general-reports-section", target: "more-reports" };
        }
        if (id.includes("settings") || text.includes("الاعدادات")) {
            return { button: "nav-more", section: "settings-section", target: "more-settings" };
        }

        if (
            id.includes("employee") ||
            text.includes("الموظف") ||
            text.includes("العامل")
        ) {
            return {
                button: "nav-more",
                section: "employees-section"
            };
        }

        if (
            id.includes("maintenance") ||
            text.includes("الصيانه") ||
            text.includes("الاصلاح")
        ) {
            return {
                button: "nav-devices",
                section: "customers-section",
                target: id || ""
            };
        }

        if (
            id.includes("wallet") ||
            text.includes("الخزنه") ||
            text.includes("المحفظه")
        ) {
            return {
                button: "nav-more",
                section: "wallet-section"
            };
        }

        if (
            id.includes("day-close") ||
            text.includes("اقفال اليوم")
        ) {
            return {
                button: "nav-more",
                section: "day-close-section"
            };
        }

        if (section && section.id) {
            return {
                button: "nav-home",
                section: section.id
            };
        }

        return {
            button: "nav-home",
            section: "home-section"
        };
    }

    /* =========================================
       قراءة بيانات التخزين الخاصة بالمستخدم
    ========================================= */

    function readStoredRecords() {
        const results = [];
        const uid = getCurrentUid();

        const allowedKeys = [
            "actPhoneManager_devices_" + uid,
            "actPhoneManager_employees_" + uid,
            "actPhoneManager_accessories_" + uid,
            "actPhoneManager_dashboard_operations_" + uid,
            "actPhoneManager_sales_" + uid,
            "actPhoneManager_independentPurchases_" + uid,
            "actPhoneManager_phonePurchases_" + uid,
            "actPhoneManager_training_" + uid,
            "actPhoneManager_returns_" + uid,
            "actPhoneManager_account_profile_" + uid,
            "actPhoneManager_notifications_" + uid,
            "actPhoneManager_wallet_transactions_withdraw_" + uid,
            "actPhoneManager_wallet_transactions_deposit_" + uid,
            "actPhoneManager_wallet_transactions_recharge_" + uid,
            "actPhoneManager_wallet_transactions_bills_" + uid,
            "actPhoneManager_wallet_transactions_transfer_" + uid,
            "actPhoneManager_day_close_archives_" + uid,
            "actPhoneManager_phonePurchases"
        ];

        const keys = new Set(allowedKeys);

        // إضافة مفاتيح ACT الخاصة بالمستخدم الحالي فقط.
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);

                if (!key || !key.startsWith("actPhoneManager_")) {
                    continue;
                }

                if (
                    key.endsWith("_" + uid) ||
                    key.includes("_" + uid + "_") ||
                    key === "actPhoneManager_phonePurchases"
                ) {
                    keys.add(key);
                }
            }
        } catch (error) {
            console.warn("Search storage scan error:", error);
        }

        keys.forEach(function (key) {
            try {
                const raw = localStorage.getItem(key);
                if (!raw) return;

                const parsed = JSON.parse(raw);
                if (!Array.isArray(parsed)) return;

                parsed.forEach(function (record) {
                    if (!record || typeof record !== "object") return;

                    results.push({
                        kind: "record",
                        key: key,
                        record: record,
                        title: getRecordTitle(record),
                        detail: getRecordDetail(record),
                        searchText: normalize(
                            key + " " + getObjectText(record)
                        ),
                        destination: getDestination(key, record)
                    });
                });
            } catch (error) {
                // نتجاوز المفاتيح غير القابلة للتحليل.
            }
        });

        // البيانات الموجودة في الذاكرة إذا لم تكن موجودة بالتخزين.
        try {
            if (
                typeof devices !== "undefined" &&
                Array.isArray(devices)
            ) {
                devices.forEach(function (record) {
                    results.push({
                        kind: "record",
                        key: "devices",
                        record: record,
                        title: getRecordTitle(record),
                        detail: getRecordDetail(record),
                        searchText: normalize(getObjectText(record)),
                        destination: {
                            button: "nav-devices",
                            section: "customers-section"
                        }
                    });
                });
            }
        } catch (error) {}

        try {
            if (
                typeof employees !== "undefined" &&
                Array.isArray(employees)
            ) {
                employees.forEach(function (record) {
                    results.push({
                        kind: "record",
                        key: "employees",
                        record: record,
                        title: getRecordTitle(record),
                        detail: getRecordDetail(record),
                        searchText: normalize(getObjectText(record)),
                        destination: {
                            button: "nav-more",
                            section: "employees-section"
                        }
                    });
                });
            }
        } catch (error) {}

        return results;
    }

    /* =========================================
       البحث في عناصر الواجهة والأقسام
    ========================================= */

    function readInterfaceItems() {
        const results = [];

        const elements = document.querySelectorAll(
            [
                ".bottom-nav-button",
                ".act-mobile-menu-toggle",
                ".act-mobile-menu-popup button",
                ".sections-buttons button",
                ".sections-buttons a",
                "button[data-section]",
                "button[data-target]",
                "[data-sales-view]",
                "[data-purchase-category]",
                ".independent-sales-card",
                ".maintenance-buttons button",
                ".employee-buttons button",
                "#more-section button",
                "#more-section a",
                "#home-section button",
                "#home-section a",
                "#customers-section button",
                "#employees-section button",
                "#wallet-section button",
                "#day-close-section button"
            ].join(",")
        );

        elements.forEach(function (element) {
            if (
                element === input ||
                element.closest("#act-global-search-results")
            ) {
                return;
            }

            const label = (
                element.innerText ||
                element.textContent ||
                element.getAttribute("aria-label") ||
                element.title ||
                ""
            ).trim();

            if (!label || label.length > 180) return;

            const destination = getSectionDestination(element);

            results.push({
                kind: "interface",
                title: label,
                detail: "قسم أو زر داخل البرنامج",
                searchText: normalize(
                    label + " " +
                    element.id + " " +
                    element.className + " " +
                    element.getAttribute("aria-label")
                ),
                element: element,
                destination: destination
            });
        });

        // الأقسام الرئيسية نفسها.
        const sections = document.querySelectorAll(
            [
                "#home-section",
                "#sales-section",
                "#independent-sales-section",
                "#independent-purchases-section",
                "#customers-section",
                "#employees-section",
                "#wallet-section",
                "#day-close-section",
                "#account-section",
                "#more-section",
                "#training-section",
                "#attendance-section",
                "#salaries-section",
                "#employee-statistics-section",
                "#phone-sale-section",
                "#phone-purchases-section"
            ].join(",")
        );

        sections.forEach(function (section) {
            const heading = section.querySelector(
                "h1, h2, h3, .section-title, .section-header"
            );

            const label = (
                heading?.innerText ||
                section.getAttribute("aria-label") ||
                section.id
            ).trim();

            if (!label) return;

            results.push({
                kind: "section",
                title: label,
                detail: "قسم في البرنامج",
                searchText: normalize(label + " " + section.id),
                destination: getSectionDestination(section)
            });
        });

        return results;
    }

    /* =========================================
       فتح القسم المطلوب
    ========================================= */

    function clickButton(id) {
        const button = document.getElementById(id);

        if (!button) return false;

        button.click();
        return true;
    }

    function findMatchingVisibleRecord(record) {
        const possibleIds = [
            record?.id,
            record?.serial,
            record?.invoiceNumber
        ].filter(Boolean).map(String);

        if (possibleIds.length) {
            for (const id of possibleIds) {
                const selectors = [
                    `[data-id="${CSS.escape(id)}"]`,
                    `[data-device-id="${CSS.escape(id)}"]`,
                    `[data-employee-id="${CSS.escape(id)}"]`,
                    `[data-purchase-id="${CSS.escape(id)}"]`,
                    `[data-sale-id="${CSS.escape(id)}"]`
                ];

                for (const selector of selectors) {
                    try {
                        const element = document.querySelector(selector);

                        if (element) return element;
                    } catch (error) {}
                }
            }
        }

        const title = normalize(getRecordTitle(record));

        if (!title || title === "سجل محفوظ") return null;

        const candidates = document.querySelectorAll(
            [
                ".device-card",
                ".maintenance-card",
                ".employee-card",
                ".sale-record",
                ".ind-purchase-record",
                ".phone-purchase-card",
                ".wallet-transaction",
                "tr"
            ].join(",")
        );

        for (const element of candidates) {
            if (
                normalize(element.innerText || "")
                    .includes(title)
            ) {
                return element;
            }
        }

        return null;
    }

    function navigateToResult(result) {
        closeResults();
        const destination = result.destination || {};
        const sectionId = destination.section;

        // Navigate through the app's own menu controls first. Do not forcibly hide
        // unrelated containers: several modules are nested and that caused a blank page.
        if (destination.button) clickButton(destination.button);

        const openTarget = () => {
            if (!destination.target) return;
            const target = document.getElementById(destination.target);
            if (target && target.isConnected) target.click();
        };
        openTarget();

        const revealAncestors = (node) => {
            let parent = node;
            while (parent && parent !== document.body) {
                if (parent.hidden) parent.hidden = false;
                if (getComputedStyle(parent).display === "none") parent.style.setProperty("display", "block", "important");
                parent = parent.parentElement;
            }
        };

        if (result.kind === "interface" && result.element && result.element.isConnected) {
            const element = result.element;
            // A section/menu target was already activated above; only click ordinary controls.
            if (!destination.target && !destination.section) element.click();
            setTimeout(() => {
                revealAncestors(element);
                element.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 180);
            return;
        }

        setTimeout(() => {
            let target = null;
            if (result.kind === "record" && result.record) {
                target = findMatchingVisibleRecord(result.record);
                if (!target && result.record.id) {
                    const safeId = String(result.record.id).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
                    target = document.querySelector(`[data-id="${safeId}"], [data-device-id="${safeId}"], [data-sale-id="${safeId}"]`);
                }
            }
            if (!target && sectionId) target = document.getElementById(sectionId);
            if (target) {
                revealAncestors(target);
                target.scrollIntoView({ behavior: "smooth", block: result.kind === "record" ? "center" : "start" });
                if (result.kind === "record") {
                    target.style.outline = "2px solid #20baff";
                    target.style.outlineOffset = "4px";
                    setTimeout(() => { target.style.outline = ""; target.style.outlineOffset = ""; }, 2200);
                }
            }
        }, 420);
    }

    /* =========================================
       عرض النتائج
    ========================================= */

    function closeResults() {
        resultsBox.style.display = "none";
        input.setAttribute("aria-expanded", "false");
    }

    function showResults() {
        resultsBox.style.display = "block";
        input.setAttribute("aria-expanded", "true");
    }

    function renderResults(query) {
        const normalizedQuery = normalize(query);

        resultsBox.innerHTML = "";

        if (normalizedQuery.length < 2) {
            closeResults();
            return;
        }

        const interfaceItems = readInterfaceItems();
        const dataItems = readStoredRecords();

        const allItems = interfaceItems.concat(dataItems);

        const matches = [];
        const seen = new Set();

        allItems.forEach(function (item) {
            if (!item.searchText.includes(normalizedQuery)) {
                return;
            }

            const identity = [
                item.kind,
                item.title,
                item.detail,
                item.key || ""
            ].join("|");

            if (seen.has(identity)) return;

            seen.add(identity);
            matches.push(item);
        });

        // إظهار نتائج الواجهة أولاً ثم السجلات.
        matches.sort(function (a, b) {
            if (a.kind === b.kind) return 0;
            return a.kind === "interface" ? -1 : 1;
        });

        const limited = matches.slice(0, 35);

        if (!limited.length) {
            resultsBox.innerHTML = `
                <div class="act-search-empty">
                    <div style="font-size:24px;margin-bottom:8px;">🔎</div>
                    لا توجد نتائج مطابقة لـ
                    <strong>${escapeHTML(query)}</strong>
                </div>
            `;

            showResults();
            return;
        }

        let lastGroup = "";

        limited.forEach(function (item, index) {
            const group = item.kind === "record"
                ? "السجلات والبيانات"
                : "الأقسام والأزرار";

            if (group !== lastGroup) {
                const heading = document.createElement("div");
                heading.className = "act-search-heading";
                heading.textContent = group;
                resultsBox.appendChild(heading);
                lastGroup = group;
            }

            const button = document.createElement("button");
            button.type = "button";
            button.className = "act-search-result";
            button.setAttribute("role", "option");

            const icon = item.kind === "record"
                ? "📄"
                : item.kind === "section"
                    ? "📂"
                    : "🔹";

            button.innerHTML = `
                <span class="act-search-icon">${icon}</span>

                <span class="act-search-text">
                    <span class="act-search-title">
                        ${escapeHTML(item.title)}
                    </span>

                    <span class="act-search-detail">
                        ${escapeHTML(item.detail || "نتيجة بحث")}
                    </span>
                </span>

                <span style="color:#55bdff;font-size:17px;">‹</span>
            `;

            button.addEventListener("click", function () {
                navigateToResult(item);
                input.value = "";
            });

            resultsBox.appendChild(button);
        });

        const footer = document.createElement("div");
        footer.className = "act-search-empty";
        footer.textContent =
            "عدد النتائج: " + matches.length.toLocaleString("ar-EG");

        resultsBox.appendChild(footer);

        showResults();
    }

    /* =========================================
       تشغيل البحث والتفاعل
    ========================================= */

    input.setAttribute("autocomplete", "off");
    input.setAttribute("aria-haspopup", "listbox");
    input.setAttribute("aria-expanded", "false");

    input.addEventListener("input", function () {
        renderResults(this.value);
    });

    input.addEventListener("focus", function () {
        if (this.value.trim().length >= 2) {
            renderResults(this.value);
        }
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeResults();
            input.blur();
            return;
        }

        if (event.key === "Enter") {
            const firstResult = resultsBox.querySelector(
                ".act-search-result"
            );

            if (firstResult) {
                event.preventDefault();
                firstResult.click();
            }
        }

        if (event.key === "ArrowDown") {
            const firstResult = resultsBox.querySelector(
                ".act-search-result"
            );

            if (firstResult) {
                event.preventDefault();
                firstResult.focus();
            }
        }
    });

    resultsBox.addEventListener("keydown", function (event) {
        const buttons = Array.from(
            resultsBox.querySelectorAll(".act-search-result")
        );

        const currentIndex = buttons.indexOf(document.activeElement);

        if (event.key === "ArrowDown") {
            event.preventDefault();

            const next = buttons[currentIndex + 1] || buttons[0];
            if (next) next.focus();
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            if (currentIndex <= 0) {
                input.focus();
            } else {
                buttons[currentIndex - 1].focus();
            }
        }

        if (event.key === "Escape") {
            closeResults();
            input.focus();
        }
    });

    document.addEventListener("click", function (event) {
        if (
            !searchBox.contains(event.target) &&
            !resultsBox.contains(event.target)
        ) {
            closeResults();
        }
    });

    // إعادة تحميل النتائج عند تغيير الحساب.
    window.addEventListener("focus", function () {
        if (input.value.trim().length >= 2) {
            renderResults(input.value);
        }
    });

    console.log("ACT Global Search initialized successfully.");

})();
// =================================================
// SHOP NOTIFICATIONS MODAL — ALL DEVICES
// =================================================

(function () {

    const toggle = document.getElementById("shop-notifications-toggle");
    const modal = document.getElementById("shop-notifications-modal");
    const closeButton = document.getElementById("shop-notifications-modal-close");
    const modalList = document.getElementById("shop-notifications-modal-list");

    if (!toggle || !modal || !closeButton || !modalList) {
        return;
    }

    function openShopNotifications() {

        // تحديث جميع التنبيهات قبل فتح النافذة
        if (typeof renderShopNotifications === "function") {
            renderShopNotifications();
        }

        // قراءة جميع أجهزة الصيانة مباشرة
        const allDevices = Array.isArray(devices) ? devices : [];

        const statusMap = {
            "قيد الإصلاح": SECTIONS.PENDING,
            "جاهز": SECTIONS.READY,
            "لم يتم الإصلاح": SECTIONS.FAILED,
            "تم التسليم": SECTIONS.DELIVERED
        };

        const statusDetails = {
            [SECTIONS.PENDING]: {
                icon: "🟡",
                label: "قيد الإصلاح"
            },
            [SECTIONS.READY]: {
                icon: "🟢",
                label: "جاهز للتسليم"
            },
            [SECTIONS.FAILED]: {
                icon: "🔴",
                label: "لم يتم الإصلاح"
            }
        };

        const escapeHTML = value =>
            String(value ?? "").replace(/[&<>"']/g, char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            })[char]);

        // استخراج كل الأجهزة التي تحتاج متابعة
        const dismissedIds = typeof getDismissedShopNotifications === "function" ? getDismissedShopNotifications() : [];
        const maintenanceDevices = allDevices.filter(device => {

            const category =
                device.category ||
                statusMap[device.status] ||
                null;

            const notificationId = String(device.id || (device.phoneName + "_" + (device.customerName || "")));
            if (dismissedIds.includes(notificationId)) return false;
            return (
                (
                    device.section === "maintenance" ||
                    [
                        SECTIONS.PENDING,
                        SECTIONS.READY,
                        SECTIONS.FAILED,
                        SECTIONS.DELIVERED
                    ].includes(category)
                ) &&
                [
                    SECTIONS.PENDING,
                    SECTIONS.READY,
                    SECTIONS.FAILED
                ].includes(category)
            );

        });

        // إنشاء إشعار مستقل لكل جهاز
        if (maintenanceDevices.length) {

            modalList.innerHTML = maintenanceDevices.map(device => {

                const category =
                    device.category ||
                    statusMap[device.status];

                const info = statusDetails[category];

                if (!info) return "";

                return `
                    <div
                        class="premium-notification-item"
                        data-shop-notification="${escapeHTML(device.id || "")}"
                    >

                        <span class="notification-icon">
                            ${info.icon}
                        </span>

                        <div class="notification-content">

                            <strong>
                                ${escapeHTML(device.phoneName || "جهاز بدون اسم")}
                            </strong>

                            <small>
                                ${info.label}
                                · العميل:
                                ${escapeHTML(device.customerName || "غير محدد")}
                            </small>

                        </div>
                        <button type="button" class="shop-notification-dismiss" data-dismiss-shop-notification="${escapeHTML(device.id || (device.phoneName + "_" + (device.customerName || "")))}" aria-label="حذف التنبيه" title="حذف التنبيه">✕</button>

                    </div>
                `;

            }).join("");

        } else {

            modalList.innerHTML = `
                <div class="premium-notification-empty">
                    <span>✓</span>
                    <strong>المحل يعمل بشكل طبيعي</strong>
                    <small>لا توجد تنبيهات حالياً</small>
                </div>
            `;

        }

        modal.hidden = false;
        toggle.setAttribute("aria-expanded", "true");

        closeButton.focus();
    }

    function closeShopNotifications() {

        modal.hidden = true;

        toggle.setAttribute("aria-expanded", "false");

        toggle.focus();
    }

    toggle.addEventListener("click", function (event) {

        event.preventDefault();

        openShopNotifications();
    });

    closeButton.addEventListener("click", closeShopNotifications);
    modalList.addEventListener("click", function(event) {
        const button = event.target.closest("[data-dismiss-shop-notification]");
        if (!button) return;
        event.preventDefault(); event.stopPropagation();
        if (typeof dismissShopNotification === "function") dismissShopNotification(button.dataset.dismissShopNotification);
        openShopNotifications();
    });
    window.addEventListener("act-shop-notifications-updated", () => { if (!modal.hidden) openShopNotifications(); });

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {
            closeShopNotifications();
        }

    });

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && !modal.hidden) {
            closeShopNotifications();
        }

    });

})();

/* =================================================
   DASHBOARD OPERATIONS MODAL
================================================= */

(function () {

    const toggle = document.getElementById("dashboard-operations-toggle");
    const modal = document.getElementById("dashboard-operations-modal");
    const closeButton = document.getElementById("dashboard-operations-modal-close");

    const originalList = document.getElementById("dashboard-latest-operations");
    const modalList = document.getElementById("dashboard-operations-modal-list");

    if (!toggle || !modal || !closeButton || !originalList || !modalList) {
        return;
    }

    function openOperationsModal() {

        modalList.replaceChildren(
            ...Array.from(originalList.children).map(item => item.cloneNode(true))
        );

        modal.hidden = false;
        toggle.setAttribute("aria-expanded", "true");

        closeButton.focus();
    }

    function closeOperationsModal() {
        modal.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
    }

    toggle.addEventListener("click", function (event) {
        event.preventDefault();
        openOperationsModal();
    });

    closeButton.addEventListener("click", closeOperationsModal);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeOperationsModal();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && !modal.hidden) {
            closeOperationsModal();
        }
    });

})();


/* =====================================================
   ACT MANAGER — MOBILE NAVIGATION CONTROLS
===================================================== */

(function initActMobileControls() {
    "use strict";

    const navigation = document.getElementById("bottom-navigation");

    if (!navigation || navigation.dataset.mobileControlsReady === "true") {
        return;
    }

    const menuToggle = document.getElementById("mobile-nav-menu-toggle");
    const menu = document.getElementById("mobile-nav-menu");

    const searchToggle = document.getElementById("mobile-search-toggle");
    const searchInput = document.getElementById("act-nav-search");
    const searchBox = searchInput?.closest(".act-nav-search");

    const logoutButton = document.getElementById("mobile-nav-logout");
    const existingLogout = document.getElementById("account-logout-button");

    const links = navigation.querySelector(".act-nav-links");


    /* =====================================
       1. إغلاق وفتح قائمة الأقسام
    ===================================== */

    function closeMobileMenu() {
        if (!menu || !menuToggle) return;

        menu.hidden = true;
        menuToggle.setAttribute("aria-expanded", "false");
    }

    function openMobileMenu() {
        if (!menu || !menuToggle) return;

        menu.hidden = false;
        menuToggle.setAttribute("aria-expanded", "true");
    }


    /* =====================================
       2. إغلاق البحث
    ===================================== */

    function closeMobileSearch() {
        if (!searchBox) return;

        searchBox.classList.remove("mobile-search-open");
    }


    /* =====================================
       3. إنشاء قائمة الأقسام
       الرئيسية أول عنصر داخل ☰
    ===================================== */

    if (menuToggle && menu && links) {

        const originalButtons = Array.from(
            links.querySelectorAll(".bottom-nav-button")
        );

        menu.replaceChildren();

        originalButtons.forEach(originalButton => {

            const item = document.createElement("button");

            item.type = "button";
            item.className = "mobile-nav-menu-item";

            // نسخ محتوى الزر الأصلي
            item.innerHTML = originalButton.innerHTML;

            // تمييز الرئيسية داخل القائمة
            if (originalButton.id === "nav-home") {
                item.classList.add("mobile-menu-home-item");
            }

            // تحسين وضوح الأيقونات
            item.querySelectorAll("i, svg, .icon, img").forEach(icon => {

                icon.style.setProperty("opacity", "1", "important");
                icon.style.setProperty("visibility", "visible", "important");
                icon.style.setProperty("filter", "none", "important");
                icon.style.setProperty("flex-shrink", "0", "important");

                if (icon.tagName.toLowerCase() === "svg") {
                    icon.style.setProperty("width", "23px", "important");
                    icon.style.setProperty("height", "23px", "important");
                    icon.style.setProperty("stroke", "#42baff", "important");
                    icon.style.setProperty("stroke-width", "2.2", "important");
                }

                if (icon.tagName.toLowerCase() === "i") {
                    icon.style.setProperty("font-size", "22px", "important");
                    icon.style.setProperty("color", "#42baff", "important");
                }

                if (icon.tagName.toLowerCase() === "img") {
                    icon.style.setProperty("width", "23px", "important");
                    icon.style.setProperty("height", "23px", "important");
                    icon.style.setProperty("object-fit", "contain", "important");
                }
            });

            // تنسيق عناصر القائمة
            item.style.cssText = [
                "display:flex",
                "align-items:center",
                "gap:12px",
                "width:100%",
                "padding:13px 14px",
                "margin:3px 0",
                "border:0",
                "border-radius:10px",
                "background:transparent",
                "color:#edf4ff",
                "font:inherit",
                "text-align:right",
                "cursor:pointer"
            ].join(";");

            // تشغيل القسم الأصلي عند الضغط
            item.addEventListener("click", function () {
                closeMobileMenu();
                originalButton.click();
            });

            menu.appendChild(item);
        });


        // زر فتح وإغلاق القائمة
        menuToggle.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            if (menu.hidden) {
                openMobileMenu();
            } else {
                closeMobileMenu();
            }
        });

        menu.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        // إغلاق القائمة عند الضغط خارجها
        document.addEventListener("click", function (event) {

            if (
                !menu.hidden &&
                !menu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });
    }


    /* =====================================
       4. زر البحث
    ===================================== */

    if (searchToggle && searchBox && searchInput) {

        searchToggle.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const isOpen = searchBox.classList.contains(
                "mobile-search-open"
            );

            if (isOpen) {

                closeMobileSearch();
                searchInput.blur();

            } else {

                closeMobileMenu();
                searchBox.classList.add("mobile-search-open");

                setTimeout(function () {
                    searchInput.focus();
                }, 50);
            }
        });

        searchBox.addEventListener("click", function (event) {
            event.stopPropagation();
        });

        document.addEventListener("click", function (event) {

            if (
                searchBox.classList.contains("mobile-search-open") &&
                !searchBox.contains(event.target) &&
                !searchToggle.contains(event.target)
            ) {
                closeMobileSearch();
            }
        });
    }


    /* =====================================
       5. زر تسجيل الخروج
       يستخدم تسجيل الخروج الأصلي
    ===================================== */

    if (logoutButton && existingLogout) {

        logoutButton.addEventListener("click", function (event) {

            event.preventDefault();
            existingLogout.click();
        });
    }


    /* =====================================
       6. إغلاق القوائم بزر Escape
    ===================================== */

    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape") {
            closeMobileMenu();
            closeMobileSearch();
        }
    });


    /* =====================================
       7. إنهاء التهيئة
    ===================================== */

    navigation.dataset.mobileControlsReady = "true";

    console.log("ACT Mobile Navigation initialized.");

})();
// ==========================================
// ACT MANAGER — PWA SERVICE WORKER
// ==========================================

if ("serviceWorker" in navigator) {

    window.addEventListener("load", async () => {

        try {

            const registration =
                await navigator.serviceWorker.register(
                    "./service-worker.js"
                );

            console.log(
                "ACT Manager PWA: Service Worker Registered",
                registration.scope
            );

        } catch (error) {

            console.error(
                "ACT Manager PWA Registration Error:",
                error
            );

        }

    });

}

// ======================================================
// ACT EXTRA MODULES: ACCESSORIES + GENERAL REPORTS
// Local-first storage, cloud sync, stock movements, notifications.
// ======================================================
(function initActExtraModules(){
  "use strict";
  const $ = id => document.getElementById(id);
  const accessoriesSection = $('accessories-section');
  const reportsSection = $('general-reports-section');
  const settingsSection = $('settings-section');
  const customersModule = $('customer-management-section');
  const safeSection = $('safe-overview-section');
  const more = $('more-section');
  const main = $('main-page');

  // IMPORTANT: these screens were nested inside #devices-main-section (.sales-area).
  // openExtra() correctly hides .sales-area, but that also hid every nested screen,
  // leaving Customers, Employees, Safe and Settings completely blank. Move the
  // standalone modules to the shared app-content container before wiring handlers.
  const appContent = document.querySelector('#main-page > #app-content') ||
                     document.getElementById('app-content');
  if (appContent) {
    [
      $('employees-section'),
      $('customer-management-section'),
      $('safe-overview-section'),
      $('settings-section')
    ].forEach(section => {
      if (section && section.parentElement !== appContent) {
        appContent.appendChild(section);
      }
    });
  } else {
    console.error('ACT Manager: app-content container not found; standalone modules were not relocated.');
  }

  if (!accessoriesSection || !reportsSection) return;

  const storageKey = () => typeof getUserKey === 'function' ? getUserKey('accessories') : 'actPhoneManager_accessories_guest';
  const movementsKey = () => typeof getUserKey === 'function' ? getUserKey('accessoryMovements') : 'actPhoneManager_accessoryMovements_guest';
  const readKey = key => { try { const v=JSON.parse(localStorage.getItem(key)||'[]'); return Array.isArray(v)?v:[]; } catch(e){ console.error('ACT extra read error',key,e); return []; } };
  const read = () => readKey(storageKey());
  const saveKey = (key, rows) => {
    const raw=JSON.stringify(rows);
    try { localStorage.setItem(key,raw); } catch(error) { console.error('ACT extra local save failed',error); alert('تعذر الحفظ على هذا الجهاز. تأكد من مساحة التخزين.'); return false; }
    if(typeof saveUserDataToCloud==='function') { try { saveUserDataToCloud(key,raw); } catch(error) { console.error('ACT extra cloud queue error',error); } }
    window.dispatchEvent(new Event('act-user-data-ready'));
    window.dispatchEvent(new Event('act-accessories-data-updated'));
    return true;
  };
  const save = rows => saveKey(storageKey(),rows);
  function saveAccessoryStockQuietly(rows){
    const raw=JSON.stringify(rows);
    try{localStorage.setItem(storageKey(),raw);}catch(error){console.error('Accessory stock save failed',error);return false;}
    if(typeof saveUserDataToCloud==='function'){try{saveUserDataToCloud(storageKey(),raw);}catch(error){console.error('Accessory stock cloud queue failed',error);}}
    window.dispatchEvent(new Event('act-accessories-data-updated'));
    return true;
  }
  function saveAccessoryMovementsQuietly(rows){
    const raw=JSON.stringify(rows);
    try{localStorage.setItem(movementsKey(),raw);}catch(error){console.error('Accessory movement save failed',error);return false;}
    if(typeof saveUserDataToCloud==='function'){try{saveUserDataToCloud(movementsKey(),raw);}catch(error){console.error('Accessory movement cloud queue failed',error);}}
    window.dispatchEvent(new Event('act-accessories-data-updated'));
    return true;
  }
  const notify = (title,details,icon='🎧',type='accessories') => {
    if(typeof addNotificationFromOperation==='function') addNotificationFromOperation({type,title,details,icon,createdAt:new Date().toISOString()});
  };
  let editingId=null;
  function hideExtras(){accessoriesSection.style.display='none';reportsSection.style.display='none';if(settingsSection)settingsSection.style.display='none';if(customersModule)customersModule.style.display='none';if(safeSection)safeSection.style.display='none';const employeesSection=$('employees-section');if(employeesSection)employeesSection.style.display='none';}
  function openExtra(section){
    if(!section)return;
    hideExtras();
    [
      $('home-section'),document.querySelector('.sales-area'),$('customers-section'),
      $('employees-section'),$('wallet-section'),$('account-section'),$('safe-overview-section'),
      $('independent-sales-section'),$('independent-purchases-section'),$('day-close-section')
    ].forEach(part=>{if(part)part.style.display='none';});
    if(more) more.style.display='none';
    if(main) main.style.display='block';
    section.style.display='block';
    $('nav-more')?.classList.add('active');
    document.querySelectorAll('.bottom-nav-button').forEach(button=>{if(button.id!=='nav-more')button.classList.remove('active');});
    if(section===accessoriesSection) renderAccessories(); else if(section===reportsSection) renderReports(); else if(section===customersModule) renderCustomers(); else if(section===settingsSection) renderSettings(); else if(section===safeSection) renderSafeOverview();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  function renderAccessories(){
    const list=$('accessory-list'); if(!list)return;
    const q=($('accessory-search')?.value||'').trim().toLocaleLowerCase();
    const rows=read().filter(x=>String(x.name||'').toLocaleLowerCase().includes(q)||String(x.code||'').toLocaleLowerCase().includes(q));
    list.innerHTML='';
    const all=read();
    const stats=$('act-accessory-stats');
    if(stats){const units=all.reduce((a,x)=>a+(Number(x.quantity)||0),0);const cost=all.reduce((a,x)=>a+(Number(x.quantity)||0)*(Number(x.cost)||0),0);const retail=all.reduce((a,x)=>a+(Number(x.quantity)||0)*(Number(x.price)||0),0);stats.innerHTML=[['الأصناف',all.length,'🎧'],['إجمالي القطع',units,'📦'],['قيمة المخزون بالتكلفة',money(cost)+' ج.م','💰'],['القيمة بسعر البيع',money(retail)+' ج.م','🏷️']].map(x=>`<article class="act-module-stat"><span>${x[2]}</span><small>${x[0]}</small><strong>${x[1]}</strong></article>`).join('');}
    const count=$('accessory-result-count');if(count)count.textContent=`${rows.length} صنف`;
    renderAccessoryMovements();
    if(!rows.length){list.innerHTML='<div class="act-extra-empty">لا توجد أصناف مطابقة. أضف أول صنف من النموذج.</div>';return;}
    rows.forEach(item=>{
      const card=document.createElement('article');card.className='act-extra-item';
      const info=document.createElement('div');
      const title=document.createElement('strong');title.textContent=item.name||'بدون اسم';
      const meta=document.createElement('small');meta.textContent=`الكود: ${item.code||'—'} | المتاح: ${item.quantity} | شراء: ${item.cost} | بيع: ${item.price}`;
      info.append(title,meta);
      const actions=document.createElement('div');actions.className='act-extra-actions';
      const edit=document.createElement('button');edit.type='button';edit.textContent='تعديل';edit.onclick=()=>{editingId=item.id;$('accessory-name').value=item.name||'';$('accessory-code').value=item.code||'';$('accessory-quantity').value=item.quantity??0;$('accessory-cost').value=item.cost??0;$('accessory-price').value=item.price??0;const saveButton=$('accessory-save-button');if(saveButton)saveButton.textContent='💾 حفظ التعديلات';$('accessory-form')?.scrollIntoView({behavior:'smooth',block:'center'});};
      const sale=document.createElement('button');sale.type='button';sale.textContent='تسجيل بيع قطعة';sale.disabled=Number(item.quantity)<=0;sale.onclick=()=>{
        const rowsNow=read();const current=rowsNow.find(x=>x.id===item.id);if(!current||Number(current.quantity)<=0){alert('الكمية غير متاحة.');return;}
        const quantity=Number(current.quantity)-1;current.quantity=quantity;current.updatedAt=new Date().toISOString();
        if(!save(rowsNow))return;
        const movements=readKey(movementsKey());movements.unshift({id:'accmove_'+Date.now(),itemId:item.id,name:item.name,kind:'sale',quantity:1,unitPrice:Number(item.price)||0,total:Number(item.price)||0,date:new Date().toISOString()});saveKey(movementsKey(),movements);
        notify('تم تسجيل بيع إكسسوار',`${item.name} — قطعة واحدة — ${Number(item.price)||0} جنيه`,'🛒');renderAccessories();
      };
      const adjust=document.createElement('button');adjust.type='button';adjust.textContent='تسوية الكمية';adjust.onclick=()=>{const raw=prompt('أدخل مقدار التغيير: رقم موجب للإضافة أو رقم سالب للصرف', '1');if(raw===null)return;const delta=Number(raw);if(!Number.isInteger(delta)||delta===0){alert('أدخل عددًا صحيحًا غير صفر.');return;}const rowsNow=read();const current=rowsNow.find(x=>x.id===item.id);if(!current)return;const nextQty=Number(current.quantity||0)+delta;if(nextQty<0){alert('لا يمكن أن تصبح الكمية أقل من صفر.');return;}current.quantity=nextQty;current.updatedAt=new Date().toISOString();if(save(rowsNow)){const moves=readKey(movementsKey());moves.unshift({id:'accmove_'+Date.now(),itemId:item.id,name:item.name,kind:delta>0?'stock_in':'stock_out',quantity:Math.abs(delta),delta,date:new Date().toISOString()});saveKey(movementsKey(),moves);notify(delta>0?'تمت إضافة كمية للمخزون':'تم صرف كمية من المخزون',`${item.name} — ${Math.abs(delta)} قطعة`,'📦');renderAccessories();}};
      const del=document.createElement('button');del.type='button';del.textContent='حذف';del.onclick=()=>{if(!confirm('تأكيد حذف الصنف؟'))return;const next=read().filter(x=>x.id!==item.id);if(save(next)){notify('تم حذف صنف إكسسوارات',item.name,'🗑️');renderAccessories();}};
      actions.append(edit,sale,adjust,del);card.append(info,actions);list.append(card);
    });
  }
  function renderAccessoryMovements(){
    const target=$('accessory-movements-list');if(!target)return;
    const rows=readKey(movementsKey()).slice(0,12);target.innerHTML='';
    if(!rows.length){target.innerHTML='<div class="act-extra-empty">لا توجد حركات مخزون مسجلة حتى الآن.</div>';return;}
    rows.forEach(m=>{const card=document.createElement('article');card.className='act-extra-item';const label=m.kind==='stock_in'?'إضافة مخزون':m.kind==='stock_out'?'صرف مخزون':m.kind==='sale'?'بيع إكسسوار':'حركة مخزون';const info=document.createElement('div');const title=document.createElement('strong');title.textContent=`${m.name||'صنف'} — ${label}`;const meta=document.createElement('small');meta.textContent=`الكمية: ${m.quantity||1} · ${new Date(m.date||Date.now()).toLocaleString('ar-EG')}`;info.append(title,meta);card.append(info);target.append(card);});
  }
  $('accessory-cancel-edit')?.addEventListener('click',()=>{editingId=null;$('accessory-form')?.reset();const b=$('accessory-save-button');if(b)b.textContent='💾 حفظ الصنف';});
  $('accessory-form')?.addEventListener('submit',e=>{
    e.preventDefault();
    const name=$('accessory-name').value.trim();
    const quantity=Number($('accessory-quantity').value),cost=Number($('accessory-cost').value),price=Number($('accessory-price').value);
    if(!name||![quantity,cost,price].every(Number.isFinite)||!Number.isInteger(quantity)||quantity<0||cost<0||price<0){alert('راجع اسم الصنف والكمية الصحيحة وأسعار الشراء والبيع');return;}
    const rows=read();const existing=rows.find(x=>x.id===editingId);
    const item={id:editingId||('acc_'+Date.now()+'_'+Math.random().toString(36).slice(2,7)),name,code:$('accessory-code').value.trim(),quantity,cost,price,createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};
    const index=rows.findIndex(x=>x.id===editingId);if(index>=0)rows[index]=item;else rows.unshift(item);
    if(!save(rows))return;
    notify(editingId?'تم تحديث صنف إكسسوارات':'تمت إضافة صنف إكسسوارات',`${name} — الكمية ${quantity}`,'🎧');
    editingId=null;e.target.reset();const saveButton=$('accessory-save-button');if(saveButton)saveButton.textContent='💾 حفظ الصنف';renderAccessories();
  });
  $('accessory-search')?.addEventListener('input',renderAccessories);

  function consumeAccessorySale(name, quantity=1){
    const rows=read();
    const wanted=String(name||'').trim().toLocaleLowerCase('ar');
    const item=rows.find(x=>String(x.name||'').trim().toLocaleLowerCase('ar')===wanted||String(x.code||'').trim().toLocaleLowerCase('ar')===wanted);
    if(!item)return {matched:false,ok:true};
    const count=Math.max(1,Math.floor(Number(quantity)||1));
    if(Number(item.quantity||0)<count)return {matched:true,ok:false,remaining:Number(item.quantity||0)};
    item.quantity=Number(item.quantity||0)-count;item.updatedAt=new Date().toISOString();
    if(!saveAccessoryStockQuietly(rows))return {matched:true,ok:false,remaining:Number(item.quantity||0)};
    const moves=readKey(movementsKey());moves.unshift({id:'accmove_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),itemId:item.id,name:item.name,kind:'sale',quantity:count,unitPrice:Number(item.price)||0,total:(Number(item.price)||0)*count,date:new Date().toISOString()});saveAccessoryMovementsQuietly(moves);
    renderAccessories();
    return {matched:true,ok:true,itemId:item.id,remaining:item.quantity};
  }
  function restoreAccessorySale(name, quantity=1){
    const rows=read();const wanted=String(name||'').trim().toLocaleLowerCase('ar');
    const item=rows.find(x=>String(x.name||'').trim().toLocaleLowerCase('ar')===wanted||String(x.code||'').trim().toLocaleLowerCase('ar')===wanted);
    if(!item)return {matched:false,ok:false};
    const count=Math.max(1,Math.floor(Number(quantity)||1));item.quantity=Math.max(0,Number(item.quantity)||0)+count;item.updatedAt=new Date().toISOString();
    if(!saveAccessoryStockQuietly(rows))return {matched:true,ok:false};
    const moves=readKey(movementsKey());moves.unshift({id:'accmove_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),itemId:item.id,name:item.name,kind:'return',quantity:count,delta:count,date:new Date().toISOString()});saveAccessoryMovementsQuietly(moves);
    notify('تم إرجاع إكسسوار للمخزون',`${item.name} — ${count} قطعة`,'↩️');renderAccessories();return {matched:true,ok:true,remaining:item.quantity};
  }
  window.actAccessoryConsumeSale=consumeAccessorySale;
  window.actAccessoryRestoreSale=restoreAccessorySale;

  function readArrayFor(type){const key=typeof getUserKey==='function'?getUserKey(type):`actPhoneManager_${type}_guest`;return readKey(key);}
  function money(value){return Number(value||0).toLocaleString('ar-EG',{maximumFractionDigits:2});}
  function sum(rows,fields){return rows.reduce((acc,row)=>{for(const f of fields){if(row[f]!==undefined&&row[f]!==null&&row[f]!==''){const n=Number(row[f]);if(Number.isFinite(n))return acc+n;}}return acc;},0);}
  function renderReports(){
    const target=$('general-reports-content');if(!target)return;
    const devices=readArrayFor('devices'),sales=readArrayFor('sales'),purchases=readArrayFor('independentPurchases'),employees=readArrayFor('employees'),accessories=read();
    const salesTotal=sum(sales,['total','totalPrice','finalPrice','salePrice','price','amount']);
    const purchaseTotal=sum(purchases,['total','totalPrice','amount']);
    const inventoryValue=devices.filter(x=>x.status==='البيع'||x.section==='sale'||x.category==='sale').reduce((a,x)=>a+(Number(x.price||x.salePrice||0)||0),0);
    const accessoryValue=accessories.reduce((a,x)=>a+(Number(x.quantity)||0)*(Number(x.cost)||0),0);
    const specs=[['إجمالي المبيعات',money(salesTotal)+' ج.م'],['إجمالي المشتريات',money(purchaseTotal)+' ج.م'],['فرق الحركة',money(salesTotal-purchaseTotal)+' ج.م'],['عمليات البيع',sales.length],['عمليات الشراء',purchases.length],['الأجهزة المسجلة',devices.length],['قيمة الأجهزة المعروضة',money(inventoryValue)+' ج.م'],['أصناف الإكسسوارات',accessories.length],['قيمة مخزون الإكسسوارات بالتكلفة',money(accessoryValue)+' ج.م'],['الموظفون',employees.length],['سجل الأيام السابقة',readKey(typeof getUserKey==='function'?getUserKey('day_closes'):'actPhoneManager_day_closes_guest').length]];
    target.innerHTML='';
    specs.forEach(([label,value])=>{const card=document.createElement('div');card.className='act-extra-item';const name=document.createElement('strong');name.textContent=label;const val=document.createElement('span');val.textContent=String(value);card.append(name,val);target.append(card);});
    const note=document.createElement('p');note.className='act-extra-note';note.textContent='ملاحظة: فرق المبيعات والمشتريات مؤشر حركة نقدية مبسط وليس صافي الربح أو قائمة دخل محاسبية.';target.append(note);
  }
  $('general-reports-refresh')?.addEventListener('click',renderReports);
  $('more-accessories')?.addEventListener('click',()=>openExtra(accessoriesSection));
  $('more-reports')?.addEventListener('click',()=>openExtra(reportsSection));
  $('more-settings')?.addEventListener('click',()=>{if(settingsSection)openExtra(settingsSection);});
  $('more-customers')?.addEventListener('click',()=>{if(customersModule)openExtra(customersModule);});
  $('employees-section-button')?.addEventListener('click',()=>{ $('more-employees')?.click(); });

  $('more-employees')?.addEventListener('click',()=>{
    hideExtras();
    if(more)more.style.display='none';
    // The login shell hides the complete app until a section explicitly reveals it.
    // Employees previously used the legacy renderer without revealing #main-page.
    if(main)main.style.display='block';
    [ $('home-section'), document.querySelector('.sales-area'), $('customers-section'),
      $('wallet-section'), $('account-section'), $('independent-sales-section'),
      $('independent-purchases-section'), $('day-close-section')
    ].forEach(part=>{if(part)part.style.display='none';});
    if(typeof showEmployeesArea==='function')showEmployeesArea();
    const section=$('employees-section');
    if(section)section.style.display='block';
    $('nav-more')?.classList.add('active');
    document.querySelectorAll('.bottom-nav-button').forEach(button=>{
      if(button.id!=='nav-more')button.classList.remove('active');
    });
    if(typeof renderEmployees==='function')renderEmployees();
    window.scrollTo({top:0,behavior:'smooth'});
  });
  $('more-safe')?.addEventListener('click',()=>{if(safeSection)openExtra(safeSection);});

  // Dedicated customer CRM (kept separate from maintenance records).
  const customerKey=()=>typeof getUserKey==='function'?getUserKey('customers'):'actPhoneManager_customers_guest';
  const readCustomers=()=>readKey(customerKey());
  let editingCustomerId=null;
  function saveCustomers(rows){const raw=JSON.stringify(rows);try{localStorage.setItem(customerKey(),raw);}catch(err){console.error('Customer save failed',err);alert('تعذر حفظ بيانات العميل على هذا الجهاز.');return false;}if(typeof saveUserDataToCloud==='function'){try{saveUserDataToCloud(customerKey(),raw);}catch(err){console.error('Customer cloud sync failed',err);}}window.dispatchEvent(new Event('act-user-data-ready'));return true;}
  function renderCustomers(){const list=$('act-customer-list');if(!list)return;const all=readCustomers();const q=($('act-customer-search')?.value||'').trim().toLocaleLowerCase();const rows=all.filter(x=>[x.name,x.phone,x.email,x.address].some(v=>String(v||'').toLocaleLowerCase().includes(q)));const stats=$('act-customer-stats');if(stats)stats.innerHTML=[['إجمالي العملاء',all.length,'👥'],['لديهم هاتف',all.filter(x=>x.phone).length,'📱'],['أضيفوا هذا الشهر',all.filter(x=>String(x.createdAt||'').slice(0,7)===new Date().toISOString().slice(0,7)).length,'🗓️']].map(x=>`<article class="act-module-stat"><span>${x[2]}</span><small>${x[0]}</small><strong>${x[1]}</strong></article>`).join('');const count=$('act-customer-count');if(count)count.textContent=`${rows.length} عميل`;list.innerHTML='';if(!rows.length){list.innerHTML='<div class="act-extra-empty">لا توجد نتائج. أضف أول عميل من النموذج.</div>';return;}rows.forEach(customer=>{const card=document.createElement('article');card.className='act-extra-item act-customer-card';const info=document.createElement('div');const title=document.createElement('strong');title.textContent=customer.name||'عميل بدون اسم';const meta=document.createElement('small');meta.textContent=`📱 ${customer.phone||'بدون هاتف'}${customer.email?' · ✉️ '+customer.email:''}${customer.address?' · 📍 '+customer.address:''}`;info.append(title,meta);if(customer.notes){const note=document.createElement('small');note.textContent='ملاحظات: '+customer.notes;info.append(note);}const actions=document.createElement('div');actions.className='act-extra-actions';const invoices=document.createElement('button');invoices.type='button';invoices.textContent='سجل الفواتير';invoices.onclick=()=>showCustomerInvoices(customer);const edit=document.createElement('button');edit.type='button';edit.textContent='تعديل';edit.onclick=()=>{editingCustomerId=customer.id;$('act-customer-name').value=customer.name||'';$('act-customer-phone').value=customer.phone||'';$('act-customer-email').value=customer.email||'';$('act-customer-address').value=customer.address||'';$('act-customer-notes').value=customer.notes||'';$('act-customer-save').textContent='حفظ التعديلات';$('act-customer-form').scrollIntoView({behavior:'smooth',block:'center'});};const del=document.createElement('button');del.type='button';del.textContent='حذف';del.onclick=()=>{if(!confirm('تأكيد حذف ملف العميل؟ لن يتم حذف فواتيره أو عمليات البيع السابقة.'))return;if(saveCustomers(readCustomers().filter(x=>x.id!==customer.id))){notify('تم حذف ملف عميل',customer.name,'👥','customers');renderCustomers();}};actions.append(invoices,edit,del);card.append(info,actions);list.append(card);});}
  window.actCustomerUpsertFromSale=function(data){if(!data||!data.name||!data.phone)return;const rows=readCustomers();const phone=String(data.phone).trim();const existing=rows.find(x=>String(x.phone||'').trim()===phone);if(existing){existing.name=String(data.name).trim();existing.updatedAt=new Date().toISOString();}else{rows.unshift({id:'cust_'+Date.now(),name:String(data.name).trim(),phone,email:'',address:'',notes:'تم إنشاء الملف تلقائيًا من فاتورة بيع',createdAt:new Date().toISOString(),updatedAt:new Date().toISOString()});}saveCustomers(rows);};
  function showCustomerInvoices(customer){const sales=readArrayFor('sales');const phone=String(customer.phone||'').trim();const name=String(customer.name||'').trim();const invoices=sales.filter(x=>(phone&&String(x.customerPhone||'').trim()===phone)||(name&&String(x.customerName||'').trim()===name)).sort((a,b)=>new Date(b.date||b.createdAt||0)-new Date(a.date||a.createdAt||0));const details=invoices.length?invoices.map(x=>`${String(x.date||x.createdAt||'').slice(0,10)} — فاتورة #${x.invoiceNumber||x.id||'—'} — ${money(x.total??x.price??0)} ج.م — ${Array.isArray(x.items)?x.items.map(i=>`${i.name} × ${i.quantity||1}`).join('، '):(x.productName||'—')}`).join('\n'):'لا توجد فواتير مطابقة لهذا العميل في سجل المبيعات.';alert(`سجل فواتير: ${customer.name}\nعدد الفواتير: ${invoices.length}\n\n${details}`);}
  $('act-customer-form')?.addEventListener('submit',e=>{e.preventDefault();const name=$('act-customer-name').value.trim(),phone=$('act-customer-phone').value.trim();if(!name||!phone){alert('اكتب اسم العميل ورقم الهاتف.');return;}const rows=readCustomers();const duplicate=rows.find(x=>x.id!==editingCustomerId&&x.phone===phone);if(duplicate){alert('رقم الهاتف مسجل بالفعل لعميل آخر.');return;}const existing=rows.find(x=>x.id===editingCustomerId);const item={id:editingCustomerId||('cust_'+Date.now()),name,phone,email:$('act-customer-email').value.trim(),address:$('act-customer-address').value.trim(),notes:$('act-customer-notes').value.trim(),createdAt:existing?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString()};const index=rows.findIndex(x=>x.id===editingCustomerId);if(index>=0)rows[index]=item;else rows.unshift(item);if(saveCustomers(rows)){notify(editingCustomerId?'تم تحديث بيانات عميل':'تمت إضافة عميل جديد',`${name} — ${phone}`,'👥','customers');editingCustomerId=null;e.target.reset();$('act-customer-save').textContent='💾 حفظ العميل';renderCustomers();}});
  $('act-customer-search')?.addEventListener('input',renderCustomers);
  $('act-customer-cancel')?.addEventListener('click',()=>{editingCustomerId=null;$('act-customer-form')?.reset();$('act-customer-save').textContent='💾 حفظ العميل';});

  // Cashbox overview is separate from the wallet-operation screen.
  function walletRows(operation){const key=typeof getWalletTransactionsStorageKey==='function'?getWalletTransactionsStorageKey(operation):`actPhoneManager_wallet_transactions_${operation}_${typeof currentUser!=='undefined'&&currentUser?currentUser.uid:'guest'}`;return readKey(key);}
  function renderSafeOverview(){const deposits=walletRows('deposit'),withdrawals=walletRows('withdraw');const totalDeposit=deposits.reduce((a,x)=>a+(Number(x.amount)||0),0),totalWithdraw=withdrawals.reduce((a,x)=>a+(Number(x.amount)||0),0);const stats=$('act-safe-stats');if(stats)stats.innerHTML=[['الرصيد المحسوب',money(totalDeposit-totalWithdraw)+' ج.م','💰'],['إجمالي الإيداعات',money(totalDeposit)+' ج.م','📥'],['إجمالي السحوبات',money(totalWithdraw)+' ج.م','📤'],['عدد العمليات',deposits.length+withdrawals.length,'🧾']].map(x=>`<article class="act-module-stat"><span>${x[2]}</span><small>${x[0]}</small><strong>${x[1]}</strong></article>`).join('');const target=$('act-safe-transactions');if(!target)return;const rows=[...deposits.map(x=>({...x,_kind:'إيداع'})),...withdrawals.map(x=>({...x,_kind:'سحب'}))].sort((a,b)=>new Date(b.date||b.createdAt||0)-new Date(a.date||a.createdAt||0)).slice(0,20);target.innerHTML='';if(!rows.length){target.innerHTML='<div class="act-extra-empty">لا توجد عمليات إيداع أو سحب مسجلة حتى الآن.</div>';return;}rows.forEach(x=>{const card=document.createElement('article');card.className='act-extra-item';const info=document.createElement('div');const title=document.createElement('strong');title.textContent=`${x._kind} — ${x.service||x.operationName||'عملية خزنة'}`;const meta=document.createElement('small');meta.textContent=`${x.account||'—'} · ${new Date(x.date||x.createdAt||Date.now()).toLocaleString('ar-EG')} · ${x.statusName||'مسجلة'}`;const amount=document.createElement('strong');amount.textContent=money(x.amount||0)+' ج.م';amount.style.color=x._kind==='إيداع'?'#28c98b':'#ff9b78';info.append(title,meta);card.append(info,amount);target.append(card);});}
  $('act-safe-open-wallet')?.addEventListener('click',()=>{$('more-wallet')?.click();});
  $('act-safe-refresh')?.addEventListener('click',renderSafeOverview);
  window.addEventListener('act-wallet-data-updated',()=>{if(safeSection&&safeSection.style.display!=='none')renderSafeOverview();});

  // Settings actions: preferences, browser notifications, PWA install and update check.
  let deferredInstallPrompt=null;window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstallPrompt=event;const status=$('act-pwa-status');if(status)status.textContent='التطبيق جاهز للتثبيت على هذا الجهاز.';});
  function renderSettings(){const lang=$('act-settings-language'),theme=$('act-settings-theme');if(lang)lang.value=localStorage.getItem('actPhoneManager_language')||'ar';if(theme)theme.value=localStorage.getItem('actPhoneManager_theme')||'dark';const permission=$('act-notification-permission-status');if(permission){permission.textContent=typeof Notification==='undefined'?'هذا المتصفح لا يدعم إشعارات النظام':Notification.permission==='granted'?'إشعارات النظام مفعّلة':Notification.permission==='denied'?'تم حظر الإشعارات من إعدادات المتصفح':'لم يتم منح إذن الإشعارات بعد';}const pwa=$('act-pwa-status');if(pwa&&'serviceWorker'in navigator){navigator.serviceWorker.getRegistration().then(reg=>{pwa.textContent=reg?'التطبيق مسجل ويعمل كـ PWA على هذا الجهاز.':'لم يتم تسجيل Service Worker بعد.';}).catch(()=>{pwa.textContent='تعذر قراءة حالة التطبيق.';});}}
  async function refreshActStorageStatus(requestPermission=false){
    const status=$('act-storage-status');
    if(!status)return;
    if(!navigator.storage || !navigator.storage.estimate){status.textContent='المتصفح لا يتيح عرض تفاصيل مساحة التخزين.';return;}
    try{
      let persisted=false;
      if(requestPermission && navigator.storage.persist){persisted=await navigator.storage.persist();}
      else if(navigator.storage.persisted){persisted=await navigator.storage.persisted();}
      const estimate=await navigator.storage.estimate();
      const used=Number(estimate.usage||0),quota=Number(estimate.quota||0);
      const gb=n=> (n/1024/1024/1024).toFixed(2);
      status.textContent=`المستخدم: ${gb(used)} جيجابايت — الحد الذي يتيحه المتصفح حاليًا: ${gb(quota)} جيجابايت — حماية التخزين: ${persisted?'مفعّلة':'لم يمنحها المتصفح'}. لا يمكن حجز 2 جيجابايت بالقوة؛ المساحة يحددها المتصفح والجهاز.`;
    }catch(error){console.warn('ACT storage estimate unavailable',error);status.textContent='تعذر قراءة مساحة التخزين من المتصفح.';}
  }
  $('act-protect-storage')?.addEventListener('click',()=>refreshActStorageStatus(true));
  refreshActStorageStatus(false);

  $('act-save-settings')?.addEventListener('click',()=>{const lang=$('act-settings-language')?.value||'ar',theme=$('act-settings-theme')?.value||'dark';if(!['ar','en'].includes(lang)||!['dark','light'].includes(theme))return;localStorage.setItem('actPhoneManager_language',lang);localStorage.setItem('actPhoneManager_theme',theme);if(typeof applyLanguage==='function'){try{currentLanguage=lang;applyLanguage();}catch(err){console.warn('Language apply issue',err);}}if(typeof applyTheme==='function')applyTheme();const status=$('act-backup-status');if(status)status.textContent='تم حفظ اللغة والمظهر وتطبيقهما.';notify('تم تحديث إعدادات النظام','تم حفظ اللغة والمظهر','⚙️','settings');});
  $('act-enable-notifications')?.addEventListener('click',async()=>{if(typeof Notification==='undefined'){alert('المتصفح لا يدعم إشعارات النظام.');return;}try{const result=await Notification.requestPermission();renderSettings();if(result==='granted')notify('تم تفعيل إشعارات النظام','يمكن للمتصفح الآن عرض الإشعارات بعد منح الإذن','🔔','settings');}catch(err){console.error('Notification permission error',err);alert('تعذر طلب إذن الإشعارات.');}});
  $('act-install-app')?.addEventListener('click',async()=>{if(!deferredInstallPrompt){const status=$('act-pwa-status');if(status)status.textContent='إذا لم يظهر خيار التثبيت، افتح قائمة المتصفح واختر تثبيت التطبيق أو إضافة إلى الشاشة الرئيسية.';return;}deferredInstallPrompt.prompt();try{await deferredInstallPrompt.userChoice;}catch(err){console.warn('PWA install prompt result unavailable',err);}deferredInstallPrompt=null;});
  $('act-check-update')?.addEventListener('click',async()=>{const status=$('act-pwa-status');try{if(!('serviceWorker'in navigator)){if(status)status.textContent='Service Worker غير مدعوم في هذا المتصفح.';return;}const reg=await navigator.serviceWorker.getRegistration();if(!reg){if(status)status.textContent='لا يوجد Service Worker مسجل. تحقق من فتح الموقع عبر HTTPS أو localhost.';return;}await reg.update();if(status)status.textContent='تم فحص التحديثات. إذا وُجد تحديث فسيتم تحميله حسب دورة Service Worker.';}catch(err){console.error('PWA update check failed',err);if(status)status.textContent='تعذر فحص التحديثات: '+(err.message||'خطأ غير معروف');}});

  // Export/import ACT-only local data for user-controlled device backups.
  $('act-export-backup')?.addEventListener('click',()=>{
    const data={format:'ACT_MANAGER_BACKUP',version:1,exportedAt:new Date().toISOString(),data:{}};
    for(let i=0;i<localStorage.length;i++){const key=localStorage.key(i);if(key&&key.startsWith('actPhoneManager_'))data.data[key]=localStorage.getItem(key);}
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;
    a.download='ACT_Manager_Backup_'+new Date().toISOString().slice(0,10)+'.json';
    document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    const status=$('act-backup-status');if(status)status.textContent='تم إنشاء ملف النسخة الاحتياطية. احتفظ به في مكان آمن.';
    notify('تم إنشاء نسخة احتياطية','تم تصدير بيانات ACT Manager إلى ملف على جهازك','💾','backup');
  });
  $('act-import-backup')?.addEventListener('change',async event=>{
    const file=event.target.files&&event.target.files[0];if(!file)return;
    try{
      const parsed=JSON.parse(await file.text());
      if(!parsed||parsed.format!=='ACT_MANAGER_BACKUP'||!parsed.data||typeof parsed.data!=='object'||Array.isArray(parsed.data))throw new Error('invalid backup format');
      const entries=Object.entries(parsed.data).filter(([key,value])=>key.startsWith('actPhoneManager_')&&typeof value==='string');
      if(!entries.length)throw new Error('empty backup');
      if(!confirm(`سيتم استعادة ${entries.length} عنصرًا من النسخة الاحتياطية واستبدال العناصر المطابقة. هل تريد المتابعة؟`))return;
      entries.forEach(([key,value])=>localStorage.setItem(key,value));
      if(typeof saveUserDataToCloud==='function') entries.forEach(([key,value])=>{try{saveUserDataToCloud(key,value);}catch(syncError){console.error('Backup cloud sync failed',key,syncError);}});
      window.dispatchEvent(new Event('act-user-data-ready'));
      const status=$('act-backup-status');if(status)status.textContent=`تمت استعادة ${entries.length} عنصرًا. أعد تحميل الصفحة لتحديث جميع الأقسام.`;
      notify('تمت استعادة نسخة احتياطية',`تم استعادة ${entries.length} عنصرًا`,'♻️','backup');
    }catch(error){console.error('ACT backup restore error',error);alert('ملف النسخة الاحتياطية غير صالح أو يحتوي على بيانات غير مكتملة. لم يتم استيراد الملف.');}
    finally{event.target.value='';}
  });
  document.querySelectorAll('[data-act-extra-back]').forEach(btn=>btn.addEventListener('click',()=>{hideExtras();if(more)more.style.display='block';}));
  window.addEventListener('act-user-data-ready',()=>{if(accessoriesSection.style.display!=='none')renderAccessories();if(reportsSection.style.display!=='none')renderReports();if(customersModule&&customersModule.style.display!=='none')renderCustomers();if(safeSection&&safeSection.style.display!=='none')renderSafeOverview();});
  window.addEventListener('act-accessories-data-updated',()=>{if(reportsSection.style.display!=='none')renderReports();});
})();


// ACT MANUAL DAILY CLOSE ACTION
document.getElementById("manual-day-close-button")?.addEventListener("click", function () {
    const today = typeof getToday === "function" ? getToday() : new Date().toISOString().slice(0, 10);
    if (!confirm("تأكيد حفظ إقفال اليوم؟ سيتم حفظ لقطة من حركة اليوم في سجل الأيام السابقة.")) return;
    const saved = typeof closeDay === "function" ? closeDay(today) : false;
    if (!saved) { alert("اليوم محفوظ بالفعل في سجل الأيام السابقة، أو تعذر حفظه."); return; }
    if (typeof addNotificationFromOperation === "function") addNotificationFromOperation({ type: "day-close", icon: "🔒", title: "تم إقفال اليوم", details: "تم حفظ ملخص حركة اليوم في سجل الأيام السابقة." });
    if (typeof renderDayCloseCurrentSummary === "function") renderDayCloseCurrentSummary();
    if (typeof renderPreviousDays === "function") renderPreviousDays();
    alert("تم حفظ إقفال اليوم بنجاح.");
});


// =====================================================
// ACT PRE-LOGIN SUPPORT — connected to the owner inbox
// =====================================================
(function initPreloginSupport() {
  const apiBase = () => String(window.ACT_CONTROL_API_URL || "").replace(/\/$/, "");
  const form = document.getElementById("act-prelogin-support-form");
  const checkForm = document.getElementById("act-prelogin-support-check");
  const status = document.getElementById("act-prelogin-support-status");
  const reply = document.getElementById("act-prelogin-support-reply");
  if (form) form.addEventListener("submit", async event => {
    event.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    const data = Object.fromEntries(new FormData(form).entries());
    if (button) button.disabled = true;
    if (status) status.textContent = "جارٍ إرسال طلبك إلى دعم ACT...";
    try {
      const base = apiBase(); if (!base) throw new Error("خدمة دعم ACT غير مهيأة.");
      const response = await fetch(base + "/api/public/support", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data),cache:"no-store"});
      const result = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(result.error || "تعذر إرسال الطلب.");
      form.reset();
      if (status) status.innerHTML = `تم استلام طلبك بنجاح. رقم الطلب: <b>${String(result.id || "")}</b><br>احتفظ بالرقم والبريد لمتابعة الرد.`;
      const idInput = checkForm?.querySelector('[name="ticketId"]'); const emailInput = checkForm?.querySelector('[name="email"]');
      if (idInput) idInput.value = result.id || ""; if (emailInput) emailInput.value = data.email || "";
    } catch (error) { if (status) status.textContent = error.message || "حدث خطأ أثناء إرسال الطلب."; }
    finally { if (button) button.disabled = false; }
  });
  if (checkForm) checkForm.addEventListener("submit", async event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(checkForm).entries());
    if (reply) reply.textContent = "جارٍ البحث عن طلبك...";
    try {
      const base = apiBase(); if (!base) throw new Error("خدمة دعم ACT غير مهيأة.");
      const url = base + "/api/public/support?id=" + encodeURIComponent(data.ticketId) + "&email=" + encodeURIComponent(data.email);
      const response = await fetch(url, {method:"GET",cache:"no-store"}); const result = await response.json().catch(()=>({}));
      if (!response.ok) throw new Error(result.error || "تعذر العثور على الطلب.");
      const labels = {new:"جديد — في انتظار المراجعة", "in-progress":"قيد المتابعة", answered:"تم الرد", closed:"مغلق"};
      if (reply) reply.innerHTML = `<b>${labels[result.status] || "حالة الطلب"}</b>${result.ownerReply ? `<p>${String(result.ownerReply).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}</p>` : "<p>لم يصل رد من الإدارة حتى الآن.</p>"}`;
    } catch (error) { if (reply) reply.textContent = error.message || "حدث خطأ أثناء متابعة الطلب."; }
  });
})();

