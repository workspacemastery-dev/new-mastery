import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useNavigate, s as supabase } from "./router-BfT70NIy.js";
import { s as setStoredStudentToken } from "./useStudentAuth-Mzi_1DBf.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
function StudentLoginForm({ slug }) {
  const navigate = useNavigate();
  const [name, setName] = reactExports.useState("");
  const [code, setCode] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: rpcErr } = await supabase.rpc("student_login", {
      _academy_slug: slug,
      _student_code: code.trim(),
      _full_name: name.trim()
    });
    if (rpcErr || !data || data.length === 0) {
      console.error("[student-login] failed", rpcErr ?? "No matching student session");
      setError(rpcErr?.message ?? "بيانات غير صحيحة");
      setLoading(false);
      return;
    }
    setStoredStudentToken(data[0].token);
    await navigate({ to: "/dashboard/student" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "الاسم الكامل", value: name, onChange: setName, placeholder: "أحمد محمد", required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Student ID", value: code, onChange: setCode, placeholder: "STU-1001", required: true }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineError, { message: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "submit",
        disabled: loading,
        className: "w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60",
        children: loading ? "جارٍ الدخول..." : "دخول الأكاديمية"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "لا تملك Student ID؟ تواصل مع معلّمك للحصول على المعرّف الخاص بك." })
  ] });
}
function TeacherLoginForm({ academyId }) {
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (signInErr || !data.user) {
      console.error("[teacher-login] sign-in failed", signInErr ?? "Missing auth user");
      setError(signInErr?.message ?? "تعذّر تسجيل الدخول");
      setLoading(false);
      return;
    }
    const { data: roles, error: rolesErr } = await supabase.from("user_roles").select("role, academy_id").eq("user_id", data.user.id);
    if (rolesErr) console.error("[teacher-login] role lookup failed", rolesErr);
    const isTeacherHere = (roles ?? []).some((r) => r.role === "teacher" && r.academy_id === academyId);
    const isSuperAdmin = (roles ?? []).some((r) => r.role === "super_admin");
    if (!isTeacherHere && !isSuperAdmin) {
      await supabase.auth.signOut();
      setError("هذا الحساب ليس معلّماً في هذه الأكاديمية");
      setLoading(false);
      return;
    }
    await navigate({ to: isSuperAdmin && !isTeacherHere ? "/dashboard/admin" : "/dashboard/teacher" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "البريد الإلكتروني أو Teacher ID", value: email, onChange: setEmail, type: "text", placeholder: "teacher@eduverse.com", required: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "كلمة المرور", value: password, onChange: setPassword, type: "password", placeholder: "••••••••", required: true }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(InlineError, { message: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "submit",
        disabled: loading,
        className: "w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60",
        children: loading ? "جارٍ الدخول..." : "دخول المعلم"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "لا يمكن للمعلمين إنشاء حسابات. السوبر أدمن يصدر بيانات الدخول." })
  ] });
}
function InlineError({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 shrink-0 mt-0.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: message })
  ] });
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-medium mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type,
        value,
        placeholder,
        required,
        onChange: (e) => onChange(e.target.value),
        className: "w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition placeholder:text-muted-foreground/60"
      }
    )
  ] });
}
export {
  StudentLoginForm as S,
  TeacherLoginForm as T
};
