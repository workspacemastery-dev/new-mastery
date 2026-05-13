import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useNavigate, s as supabase, L as Link } from "./router-BfT70NIy.js";
import { A as AuthShell, F as FormField } from "./AuthShell-Bz5A70zO.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import { K as KeyRound } from "./key-round-CUDXpV79.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./proxy-CnLLDCS6.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./shield-check-ct1nIaTm.js";
import "./book-open-D70hEmbw.js";
import "./sparkles-vouD53p5.js";
function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [ready, setReady] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [done, setDone] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(({
      data
    }) => setReady(Boolean(data.session)));
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    const {
      error: updateErr
    } = await supabase.auth.updateUser({
      password
    });
    setLoading(false);
    if (updateErr) {
      setError(updateErr.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({
      to: "/login"
    }), 1200);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthShell, { title: "تعيين كلمة مرور جديدة", subtitle: "اختر كلمة مرور قوية لإعادة تفعيل الوصول إلى حسابك", footer: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/login", className: "text-primary font-semibold hover:underline", children: "العودة للدخول" }), children: !ready && !done ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 shrink-0 mt-0.5" }),
    "افتح الصفحة من رابط استرجاع كلمة المرور المرسل إلى بريدك."
  ] }) : done ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-chemistry bg-chemistry/10 border border-chemistry/30 rounded-lg px-3 py-2 flex gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 shrink-0 mt-0.5" }),
    "تم تحديث كلمة المرور بنجاح."
  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: handleSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "كلمة المرور الجديدة", name: "password", type: "password", value: password, onChange: setPassword, required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(FormField, { label: "تأكيد كلمة المرور", name: "confirmPassword", type: "password", value: confirmPassword, onChange: setConfirmPassword, required: true }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 shrink-0 mt-0.5" }),
      error
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: loading, className: "w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60 inline-flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-4" }),
      loading ? "جارٍ التحديث..." : "تحديث كلمة المرور"
    ] })
  ] }) });
}
export {
  ResetPasswordPage as component
};
