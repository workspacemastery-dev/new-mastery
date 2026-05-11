import { useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { setStoredStudentToken } from "@/hooks/useStudentAuth";

export interface LoginAcademy {
  id: string;
  slug: string;
  name: string;
}

export function StudentLoginForm({ slug }: { slug: string }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { data, error: rpcErr } = await supabase.rpc("student_login", {
      _academy_slug: slug,
      _student_code: code.trim(),
      _full_name: name.trim(),
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

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="الاسم الكامل" value={name} onChange={setName} placeholder="أحمد محمد" required />
      <Field label="Student ID" value={code} onChange={setCode} placeholder="STU-1001" required />

      {error && <InlineError message={error} />}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60"
      >
        {loading ? "جارٍ الدخول..." : "دخول الأكاديمية"}
      </button>
      <p className="text-xs text-muted-foreground text-center">
        لا تملك Student ID؟ تواصل مع معلّمك للحصول على المعرّف الخاص بك.
      </p>
    </form>
  );
}

export function TeacherLoginForm({ academyId }: { academyId: string }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
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

    const { data: roles, error: rolesErr } = await supabase
      .from("user_roles")
      .select("role, academy_id")
      .eq("user_id", data.user.id);

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

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <Field label="البريد الإلكتروني أو Teacher ID" value={email} onChange={setEmail} type="text" placeholder="teacher@eduverse.com" required />
      <Field label="كلمة المرور" value={password} onChange={setPassword} type="password" placeholder="••••••••" required />

      {error && <InlineError message={error} />}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60"
      >
        {loading ? "جارٍ الدخول..." : "دخول المعلم"}
      </button>
      <p className="text-xs text-muted-foreground text-center">
        لا يمكن للمعلمين إنشاء حسابات. السوبر أدمن يصدر بيانات الدخول.
      </p>
    </form>
  );
}

function InlineError({ message }: { message: string }) {
  return (
    <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2">
      <AlertCircle className="size-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

function Field({
  label, value, onChange, type = "text", placeholder, required,
}: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-2">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-input border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition placeholder:text-muted-foreground/60"
      />
    </label>
  );
}