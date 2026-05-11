import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { AuthShell, FormField } from "@/components/auth/AuthShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "استرجاع كلمة المرور — EduVerse" }] }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين");
      return;
    }
    setLoading(true);
    const { error: updateErr } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (updateErr) {
      setError(updateErr.message);
      return;
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/login" }), 1200);
  }

  return (
    <AuthShell
      title="تعيين كلمة مرور جديدة"
      subtitle="اختر كلمة مرور قوية لإعادة تفعيل الوصول إلى حسابك"
      footer={<Link to="/login" className="text-primary font-semibold hover:underline">العودة للدخول</Link>}
    >
      {!ready && !done ? (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          افتح الصفحة من رابط استرجاع كلمة المرور المرسل إلى بريدك.
        </div>
      ) : done ? (
        <div className="text-sm text-chemistry bg-chemistry/10 border border-chemistry/30 rounded-lg px-3 py-2 flex gap-2">
          <CheckCircle2 className="size-4 shrink-0 mt-0.5" />
          تم تحديث كلمة المرور بنجاح.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <FormField label="كلمة المرور الجديدة" name="password" type="password" value={password} onChange={setPassword} required />
          <FormField label="تأكيد كلمة المرور" name="confirmPassword" type="password" value={confirmPassword} onChange={setConfirmPassword} required />
          {error && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2 flex gap-2">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
          <button disabled={loading} className="w-full py-3.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary hover:opacity-95 transition disabled:opacity-60 inline-flex items-center justify-center gap-2">
            <KeyRound className="size-4" />
            {loading ? "جارٍ التحديث..." : "تحديث كلمة المرور"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}