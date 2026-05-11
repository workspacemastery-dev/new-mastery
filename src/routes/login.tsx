import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, KeyRound, UserPlus } from "lucide-react";
import { AuthShell, FormField } from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";
import { dashboardPathForRole, type AppRole } from "@/hooks/useAuth";
import { checkSuperAdminBootstrap, createFirstSuperAdmin } from "@/server-functions/admin-bootstrap";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "دخول الإدارة — EduVerse" }] }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "bootstrap" | "forgot">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    checkSuperAdminBootstrap()
      .then((result) => {
        if (active && result.needsBootstrap) setMode("bootstrap");
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr || !data.user) {
      setError(signInErr?.message ?? "تعذّر تسجيل الدخول");
      setLoading(false);
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id);

    const r = (roles ?? []).map((x) => x.role as AppRole);
    const isSuperAdmin = r.includes("super_admin");
    const isTeacher = r.includes("teacher");

    if (!isSuperAdmin) {
      const { data: needsBootstrap } = await supabase.rpc("needs_super_admin_bootstrap" as never);
      if (needsBootstrap === true && !isTeacher) {
        const { error: claimErr } = await supabase.rpc("claim_first_super_admin" as never, {
          _full_name: data.user.user_metadata?.full_name ?? email,
        } as never);
        if (!claimErr) {
          navigate({ to: "/dashboard/admin" });
          return;
        }
      }

      // Teachers must NOT log in from the admin page — only from their academy.
      await supabase.auth.signOut();
      setError(
        isTeacher
          ? "المعلمون يسجلون الدخول من صفحة أكاديميتهم فقط، وليس من هنا."
          : "هذا الحساب غير مصرّح له بالدخول. الطلاب يدخلون من صفحة الأكاديمية."
      );
      setLoading(false);
      return;
    }

    navigate({ to: dashboardPathForRole("super_admin") });
  }

  async function handleBootstrap(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      await createFirstSuperAdmin({ data: { fullName, email, password } });
      const { data, error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
      if (signInErr || !data.user) throw new Error(signInErr?.message ?? "تم إنشاء الحساب، لكن تعذّر الدخول");
      navigate({ to: "/dashboard/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر إنشاء السوبر أدمن");
      setLoading(false);
    }
  }

  async function handleForgot(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (resetErr) {
      setError(resetErr.message);
      return;
    }
    setNotice("تم إرسال رابط استرجاع كلمة المرور إذا كان البريد مسجلاً.");
  }

  return (
    <AuthShell
      title={mode === "bootstrap" ? "إنشاء أول Super Admin" : mode === "forgot" ? "استرجاع كلمة المرور" : "دخول الإدارة 🛡️"}
      subtitle={mode === "bootstrap" ? "لا يوجد سوبر أدمن حاليًا، أنشئ الحساب الرئيسي بأمان" : mode === "forgot" ? "أدخل بريد الحساب لاستلام رابط الاسترجاع" : "تسجيل دخول مسؤل المنصة فقط"}
      footer={
        <>
          {mode === "forgot" ? (
            <button type="button" onClick={() => { setMode("login"); setError(null); setNotice(null); }} className="text-primary font-semibold hover:underline">
              العودة لتسجيل الدخول
            </button>
          ) : mode === "bootstrap" ? (
            "سيظهر هذا النموذج فقط عند عدم وجود أي سوبر أدمن."
          ) : (
            <>
              هل أنت طالب او معلم ؟{" "}
              <Link to="/" className="text-primary font-semibold hover:underline">
                ادخل من صفحة أكاديميتك
              </Link>
            </>
          )}
        </>
      }
    >
     

      {mode === "bootstrap" ? (
        <form className="space-y-4" onSubmit={handleBootstrap}>
          <FormField label="الاسم" name="fullName" placeholder="المدير العام" value={fullName} onChange={setFullName} required />
          <FormField label="البريد الإلكتروني" name="email" type="email" placeholder="admin@eduverse.com" value={email} onChange={setEmail} required />
          <FormField label="كلمة المرور" name="password" type="password" placeholder="••••••••" value={password} onChange={setPassword} required />
          {error && <InlineMessage type="error" message={error} />}
          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
            <UserPlus className="size-4" />
            {loading ? "جارٍ الإنشاء..." : "إنشاء Super Admin"}
          </button>
        </form>
      ) : mode === "forgot" ? (
        <form className="space-y-4" onSubmit={handleForgot}>
          <FormField label="البريد الإلكتروني" name="email" type="email" placeholder="admin@eduverse.com" value={email} onChange={setEmail} required />
          {error && <InlineMessage type="error" message={error} />}
          {notice && <InlineMessage type="success" message={notice} />}
          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
            <KeyRound className="size-4" />
            {loading ? "جارٍ الإرسال..." : "إرسال رابط الاسترجاع"}
          </button>
        </form>
      ) : (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField
          label="البريد الإلكتروني"
          name="email"
          type="email"
          placeholder="admin@eduverse.com"
          value={email}
          onChange={setEmail}
          required
        />
        <FormField
          label="كلمة المرور"
          name="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          required
        />

        {error && <InlineMessage type="error" message={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60"
        >
          {loading ? "جارٍ الدخول..." : "تسجيل الدخول"}
        </button>
        <button type="button" onClick={() => { setMode("forgot"); setError(null); setNotice(null); }} className="w-full text-sm text-muted-foreground hover:text-foreground transition">
          نسيت كلمة المرور؟
        </button>
      </form>
      )}
    </AuthShell>
  );
}

function InlineMessage({ type, message }: { type: "error" | "success"; message: string }) {
  const Icon = type === "error" ? AlertCircle : CheckCircle2;
  return (
    <div className={`text-sm rounded-lg px-3 py-2 flex gap-2 ${type === "error" ? "text-destructive bg-destructive/10 border border-destructive/30" : "text-chemistry bg-chemistry/10 border border-chemistry/30"}`}>
      <Icon className="size-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}
