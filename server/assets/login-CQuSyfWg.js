import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useNavigate, L as Link, s as supabase } from "./router-BfT70NIy.js";
import { A as AuthShell, F as FormField } from "./AuthShell-Bz5A70zO.js";
import { d as dashboardPathForRole } from "./useAuth-CuQlxuo9.js";
import { c as checkSuperAdminBootstrap, a as createFirstSuperAdmin } from "./admin-users-Dj0DvsD_.js";
import { c as createLucideIcon } from "./createLucideIcon-DHqPreVB.js";
import { K as KeyRound } from "./key-round-CUDXpV79.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./proxy-CnLLDCS6.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./shield-check-ct1nIaTm.js";
import "./book-open-D70hEmbw.js";
import "./sparkles-vouD53p5.js";
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function AdminLoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = reactExports.useState("login");
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [notice, setNotice] = reactExports.useState(null);
  reactExports.useEffect(() => {
    let active = true;
    checkSuperAdminBootstrap().then((result) => {
      if (active && result.needsBootstrap) setMode("bootstrap");
    }).catch(() => void 0);
    return () => {
      active = false;
    };
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const {
      data,
      error: signInErr
    } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (signInErr || !data.user) {
      setError(signInErr?.message ?? "تعذّر تسجيل الدخول");
      setLoading(false);
      return;
    }
    const {
      data: roles
    } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
    const r = (roles ?? []).map((x) => x.role);
    const isSuperAdmin = r.includes("super_admin");
    const isTeacher = r.includes("teacher");
    if (!isSuperAdmin) {
      const {
        data: needsBootstrap
      } = await supabase.rpc("needs_super_admin_bootstrap");
      if (needsBootstrap === true && !isTeacher) {
        const {
          error: claimErr
        } = await supabase.rpc("claim_first_super_admin", {
          _full_name: data.user.user_metadata?.full_name ?? email
        });
        if (!claimErr) {
          navigate({
            to: "/dashboard/admin"
          });
          return;
        }
      }
      await supabase.auth.signOut();
      setError(isTeacher ? "المعلمون يسجلون الدخول من صفحة أكاديميتهم فقط، وليس من هنا." : "هذا الحساب غير مصرّح له بالدخول. الطلاب يدخلون من صفحة الأكاديمية.");
      setLoading(false);
      return;
    }
    navigate({
      to: dashboardPathForRole("super_admin")
    });
  }
  async function handleBootstrap(e) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      await createFirstSuperAdmin({
        data: {
          fullName,
          email,
          password
        }
      });
      const {
        data,
        error: signInErr
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (signInErr || !data.user) throw new Error(signInErr?.message ?? "تم إنشاء الحساب، لكن تعذّر الدخول");
      navigate({
        to: "/dashboard/admin"
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر إنشاء السوبر أدمن");
      setLoading(false);
    }
  }
  async function handleForgot(e) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const {
      error: resetErr
    } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    setLoading(false);
    if (resetErr) {
      setError(resetErr.message);
      return;
    }
    setNotice("تم إرسال رابط استرجاع كلمة المرور إذا كان البريد مسجلاً.");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthShell, { title: mode === "bootstrap" ? "إنشاء أول Super Admin" : mode === "forgot" ? "استرجاع كلمة المرور" : "دخول الإدارة 🛡️", subtitle: mode === "bootstrap" ? "لا يوجد سوبر أدمن حاليًا، أنشئ الحساب الرئيسي بأمان" : mode === "forgot" ? "أدخل بريد الحساب لاستلام رابط الاسترجاع" : "تسجيل دخول مسؤل المنصة فقط", footer: /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: mode === "forgot" ? /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
    setMode("login");
    setError(null);
    setNotice(null);
  }, className: "text-primary font-semibold hover:underline", children: "العودة لتسجيل الدخول" }) : mode === "bootstrap" ? "سيظهر هذا النموذج فقط عند عدم وجود أي سوبر أدمن." : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    "هل أنت طالب او معلم ؟",
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-primary font-semibold hover:underline", children: "ادخل من صفحة أكاديميتك" })
  ] }) }), children: mode === "bootstrap" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: handleBootstrap, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "الاسم", name: "fullName", placeholder: "المدير العام", value: fullName, onChange: setFullName, required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "البريد الإلكتروني", name: "email", type: "email", placeholder: "admin@eduverse.com", value: email, onChange: setEmail, required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "كلمة المرور", name: "password", type: "password", placeholder: "••••••••", value: password, onChange: setPassword, required: true }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineMessage, { type: "error", message: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loading, className: "w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60 inline-flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-4" }),
      loading ? "جارٍ الإنشاء..." : "إنشاء Super Admin"
    ] })
  ] }) : mode === "forgot" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: handleForgot, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "البريد الإلكتروني", name: "email", type: "email", placeholder: "admin@eduverse.com", value: email, onChange: setEmail, required: true }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineMessage, { type: "error", message: error }),
    notice && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineMessage, { type: "success", message: notice }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loading, className: "w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60 inline-flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-4" }),
      loading ? "جارٍ الإرسال..." : "إرسال رابط الاسترجاع"
    ] })
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "البريد الإلكتروني", name: "email", type: "email", placeholder: "admin@eduverse.com", value: email, onChange: setEmail, required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "كلمة المرور", name: "password", type: "password", placeholder: "••••••••", value: password, onChange: setPassword, required: true }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineMessage, { type: "error", message: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: loading, className: "w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60", children: loading ? "جارٍ الدخول..." : "تسجيل الدخول" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => {
      setMode("forgot");
      setError(null);
      setNotice(null);
    }, className: "w-full text-sm text-muted-foreground hover:text-foreground transition", children: "نسيت كلمة المرور؟" })
  ] }) });
}
function InlineMessage({
  type,
  message
}) {
  const Icon = type === "error" ? CircleAlert : CircleCheck;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm rounded-lg px-3 py-2 flex gap-2 ${type === "error" ? "text-destructive bg-destructive/10 border border-destructive/30" : "text-chemistry bg-chemistry/10 border border-chemistry/30"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 shrink-0 mt-0.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: message })
  ] });
}
export {
  AdminLoginPage as component
};
