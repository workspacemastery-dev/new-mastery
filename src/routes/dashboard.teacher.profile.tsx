import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Save, AlertCircle, CheckCircle2, Mail, KeyRound, User as UserIcon, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { PageContainer, PageHeader } from "@/components/dashboard/DashboardLayout";
import { ImageUploadField } from "@/components/dashboard/ImageUploadField";

export const Route = createFileRoute("/dashboard/teacher/profile")({
  head: () => ({ meta: [{ title: "الملف الشخصي — EduVerse" }] }),
  component: TeacherProfilePage,
});

interface AcademyRow {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  cover_image_url: string | null;
}

function TeacherProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [academy, setAcademy] = useState<AcademyRow | null>(null);
  const [academyImage, setAcademyImage] = useState<string | null>(null);
  const [academyCover, setAcademyCover] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [savingAcademy, setSavingAcademy] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pwdMsg, setPwdMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [acaMsg, setAcaMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      setEmail(user.email ?? "");
      const [{ data: profile }, { data: aca }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
        supabase.from("academies").select("id, name, slug, image_url, cover_image_url").eq("teacher_id", user.id).maybeSingle(),
      ]);
      setFullName(profile?.full_name ?? "");
      if (aca) {
        setAcademy(aca as AcademyRow);
        setAcademyImage(aca.image_url);
        setAcademyCover(aca.cover_image_url);
      }
      setLoading(false);
    })();
  }, [user]);

  async function saveProfile(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      // Update profile name
      const { error: profErr } = await supabase
        .from("profiles")
        .update({ full_name: fullName.trim() })
        .eq("user_id", user.id);
      if (profErr) throw profErr;

      // Update email if changed (Supabase sends a confirmation email)
      if (email.trim() && email.trim() !== user.email) {
        const { error: emailErr } = await supabase.auth.updateUser({ email: email.trim() });
        if (emailErr) throw emailErr;
        setProfileMsg({ type: "ok", text: "تم الحفظ. أُرسل رابط تأكيد إلى البريد الجديد." });
      } else {
        setProfileMsg({ type: "ok", text: "تم حفظ بياناتك بنجاح." });
      }
    } catch (err) {
      setProfileMsg({ type: "err", text: err instanceof Error ? err.message : "تعذّر الحفظ" });
    } finally {
      setSavingProfile(false);
    }
  }

  async function savePassword(e: FormEvent) {
    e.preventDefault();
    setPwdMsg(null);
    if (newPassword.length < 6) {
      setPwdMsg({ type: "err", text: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "err", text: "كلمتا المرور غير متطابقتين" });
      return;
    }
    setSavingPwd(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      setPwdMsg({ type: "ok", text: "تم تحديث كلمة المرور." });
    } catch (err) {
      setPwdMsg({ type: "err", text: err instanceof Error ? err.message : "تعذّر التحديث" });
    } finally {
      setSavingPwd(false);
    }
  }

  async function saveAcademy(e: FormEvent) {
    e.preventDefault();
    if (!academy) return;
    setSavingAcademy(true);
    setAcaMsg(null);
    try {
      const { error } = await supabase
        .from("academies")
        .update({ image_url: academyImage, cover_image_url: academyCover })
        .eq("id", academy.id);
      if (error) throw error;
      setAcaMsg({ type: "ok", text: "تم تحديث صور الأكاديمية." });
    } catch (err) {
      setAcaMsg({ type: "err", text: err instanceof Error ? err.message : "تعذّر الحفظ" });
    } finally {
      setSavingAcademy(false);
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <PageHeader title="الملف الشخصي" />
        <div className="text-sm text-muted-foreground">جارٍ التحميل...</div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="الملف الشخصي" description="إدارة بياناتك الشخصية وصور أكاديميتك" />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Personal info */}
        <section className="bg-card-premium border border-border/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5 inline-flex items-center gap-2">
            <UserIcon className="size-5 text-primary" /> البيانات الشخصية
          </h2>
          <form className="space-y-4" onSubmit={saveProfile}>
            <Field
              label="الاسم الكامل"
              value={fullName}
              onChange={setFullName}
              required
            />
            <Field
              label="البريد الإلكتروني"
              type="email"
              value={email}
              onChange={setEmail}
              required
              hint="عند تغيير البريد، سيُرسل رابط تأكيد إلى العنوان الجديد."
              icon={<Mail className="size-4 text-muted-foreground" />}
            />
            <Msg msg={profileMsg} />
            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary disabled:opacity-60"
            >
              <Save className="size-4" />
              {savingProfile ? "جارٍ الحفظ..." : "حفظ البيانات"}
            </button>
          </form>
        </section>

        {/* Password */}
        <section className="bg-card-premium border border-border/60 rounded-2xl p-6">
          <h2 className="text-lg font-bold mb-5 inline-flex items-center gap-2">
            <KeyRound className="size-5 text-primary" /> كلمة المرور
          </h2>
          <form className="space-y-4" onSubmit={savePassword}>
            <Field
              label="كلمة المرور الجديدة"
              type="password"
              value={newPassword}
              onChange={setNewPassword}
              required
            />
            <Field
              label="تأكيد كلمة المرور"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
            />
            <Msg msg={pwdMsg} />
            <button
              type="submit"
              disabled={savingPwd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary disabled:opacity-60"
            >
              <KeyRound className="size-4" />
              {savingPwd ? "..." : "تحديث كلمة المرور"}
            </button>
          </form>
        </section>

        {/* Academy images */}
        {academy && (
          <section className="bg-card-premium border border-border/60 rounded-2xl p-6 lg:col-span-2">
            <h2 className="text-lg font-bold mb-1 inline-flex items-center gap-2">
              <ImageIcon className="size-5 text-primary" /> صور الأكاديمية: {academy.name}
            </h2>
            <p className="text-xs text-muted-foreground mb-5">
              تظهر هذه الصور في الصفحة الرئيسية وصفحة الأكاديمية قبل تسجيل الدخول.
            </p>
            <form className="space-y-5" onSubmit={saveAcademy}>
              <ImageUploadField
                label="صورة كارت الأكاديمية (الصفحة الرئيسية)"
                value={academyImage}
                onChange={setAcademyImage}
                folder="academies/cards"
              />
              <ImageUploadField
                label="صورة الغلاف (صفحة الأكاديمية)"
                value={academyCover}
                onChange={setAcademyCover}
                folder="academies/covers"
              />
              <Msg msg={acaMsg} />
              <button
                type="submit"
                disabled={savingAcademy}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary disabled:opacity-60"
              >
                <Save className="size-4" />
                {savingAcademy ? "جارٍ الحفظ..." : "حفظ الصور"}
              </button>
            </form>
          </section>
        )}
      </div>
    </PageContainer>
  );
}

function Field({
  label, value, onChange, type = "text", required, hint, icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-2">{label}</span>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
        <input
          type={type}
          value={value}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none ${icon ? "pl-10" : ""}`}
        />
      </div>
      {hint && <p className="text-[11px] text-muted-foreground mt-1">{hint}</p>}
    </label>
  );
}

function Msg({ msg }: { msg: { type: "ok" | "err"; text: string } | null }) {
  if (!msg) return null;
  const isOk = msg.type === "ok";
  const Icon = isOk ? CheckCircle2 : AlertCircle;
  return (
    <div className={`text-sm rounded-lg px-3 py-2 flex gap-2 ${isOk ? "text-chemistry bg-chemistry/10 border border-chemistry/30" : "text-destructive bg-destructive/10 border border-destructive/30"}`}>
      <Icon className="size-4 shrink-0 mt-0.5" />
      <span>{msg.text}</span>
    </div>
  );
}
