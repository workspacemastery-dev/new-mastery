import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { u as useAuth } from "./useAuth-CuQlxuo9.js";
import { s as supabase } from "./router-BfT70NIy.js";
import { P as PageContainer, a as PageHeader } from "./DashboardLayout-CKTD8bPJ.js";
import { I as ImageUploadField } from "./ImageUploadField-B6wfmL7r.js";
import { U as User } from "./user-Do_-wygY.js";
import { M as Mail } from "./mail-Btv11zbm.js";
import { S as Save } from "./save-DaTgwH4R.js";
import { K as KeyRound } from "./key-round-CUDXpV79.js";
import { I as Image } from "./image-DntQ77e3.js";
import { C as CircleCheck } from "./circle-check-D9LZDFiz.js";
import { C as CircleAlert } from "./circle-alert-c7tAyljS.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./useStudentAuth-Mzi_1DBf.js";
import "./graduation-cap-CI_zLsIZ.js";
import "./createLucideIcon-DHqPreVB.js";
import "./log-out-ajI5jNrW.js";
import "./x-yy412flO.js";
import "./loader-circle-B8rYq1WK.js";
function TeacherProfilePage() {
  const {
    user
  } = useAuth();
  const [fullName, setFullName] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [academy, setAcademy] = reactExports.useState(null);
  const [academyImage, setAcademyImage] = reactExports.useState(null);
  const [academyCover, setAcademyCover] = reactExports.useState(null);
  const [newPassword, setNewPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [savingProfile, setSavingProfile] = reactExports.useState(false);
  const [savingPwd, setSavingPwd] = reactExports.useState(false);
  const [savingAcademy, setSavingAcademy] = reactExports.useState(false);
  const [profileMsg, setProfileMsg] = reactExports.useState(null);
  const [pwdMsg, setPwdMsg] = reactExports.useState(null);
  const [acaMsg, setAcaMsg] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!user) return;
    void (async () => {
      setEmail(user.email ?? "");
      const [{
        data: profile
      }, {
        data: aca
      }] = await Promise.all([supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(), supabase.from("academies").select("id, name, slug, image_url, cover_image_url").eq("teacher_id", user.id).maybeSingle()]);
      setFullName(profile?.full_name ?? "");
      if (aca) {
        setAcademy(aca);
        setAcademyImage(aca.image_url);
        setAcademyCover(aca.cover_image_url);
      }
      setLoading(false);
    })();
  }, [user]);
  async function saveProfile(e) {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setProfileMsg(null);
    try {
      const {
        error: profErr
      } = await supabase.from("profiles").update({
        full_name: fullName.trim()
      }).eq("user_id", user.id);
      if (profErr) throw profErr;
      if (email.trim() && email.trim() !== user.email) {
        const {
          error: emailErr
        } = await supabase.auth.updateUser({
          email: email.trim()
        });
        if (emailErr) throw emailErr;
        setProfileMsg({
          type: "ok",
          text: "تم الحفظ. أُرسل رابط تأكيد إلى البريد الجديد."
        });
      } else {
        setProfileMsg({
          type: "ok",
          text: "تم حفظ بياناتك بنجاح."
        });
      }
    } catch (err) {
      setProfileMsg({
        type: "err",
        text: err instanceof Error ? err.message : "تعذّر الحفظ"
      });
    } finally {
      setSavingProfile(false);
    }
  }
  async function savePassword(e) {
    e.preventDefault();
    setPwdMsg(null);
    if (newPassword.length < 6) {
      setPwdMsg({
        type: "err",
        text: "كلمة المرور يجب أن تكون 6 أحرف على الأقل"
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({
        type: "err",
        text: "كلمتا المرور غير متطابقتين"
      });
      return;
    }
    setSavingPwd(true);
    try {
      const {
        error
      } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      setPwdMsg({
        type: "ok",
        text: "تم تحديث كلمة المرور."
      });
    } catch (err) {
      setPwdMsg({
        type: "err",
        text: err instanceof Error ? err.message : "تعذّر التحديث"
      });
    } finally {
      setSavingPwd(false);
    }
  }
  async function saveAcademy(e) {
    e.preventDefault();
    if (!academy) return;
    setSavingAcademy(true);
    setAcaMsg(null);
    try {
      const {
        error
      } = await supabase.from("academies").update({
        image_url: academyImage,
        cover_image_url: academyCover
      }).eq("id", academy.id);
      if (error) throw error;
      setAcaMsg({
        type: "ok",
        text: "تم تحديث صور الأكاديمية."
      });
    } catch (err) {
      setAcaMsg({
        type: "err",
        text: err instanceof Error ? err.message : "تعذّر الحفظ"
      });
    } finally {
      setSavingAcademy(false);
    }
  }
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "الملف الشخصي" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-muted-foreground", children: "جارٍ التحميل..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageContainer, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "الملف الشخصي", description: "إدارة بياناتك الشخصية وصور أكاديميتك" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-card-premium border border-border/60 rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold mb-5 inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-5 text-primary" }),
          " البيانات الشخصية"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: saveProfile, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "الاسم الكامل", value: fullName, onChange: setFullName, required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "البريد الإلكتروني", type: "email", value: email, onChange: setEmail, required: true, hint: "عند تغيير البريد، سيُرسل رابط تأكيد إلى العنوان الجديد.", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "size-4 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Msg, { msg: profileMsg }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: savingProfile, className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary disabled:opacity-60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
            savingProfile ? "جارٍ الحفظ..." : "حفظ البيانات"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-card-premium border border-border/60 rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold mb-5 inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-5 text-primary" }),
          " كلمة المرور"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-4", onSubmit: savePassword, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "كلمة المرور الجديدة", type: "password", value: newPassword, onChange: setNewPassword, required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "تأكيد كلمة المرور", type: "password", value: confirmPassword, onChange: setConfirmPassword, required: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Msg, { msg: pwdMsg }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: savingPwd, className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary disabled:opacity-60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-4" }),
            savingPwd ? "..." : "تحديث كلمة المرور"
          ] })
        ] })
      ] }),
      academy && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-card-premium border border-border/60 rounded-2xl p-6 lg:col-span-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-bold mb-1 inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-5 text-primary" }),
          " صور الأكاديمية: ",
          academy.name
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-5", children: "تظهر هذه الصور في الصفحة الرئيسية وصفحة الأكاديمية قبل تسجيل الدخول." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "space-y-5", onSubmit: saveAcademy, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUploadField, { label: "صورة كارت الأكاديمية (الصفحة الرئيسية)", value: academyImage, onChange: setAcademyImage, folder: "academies/cards" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ImageUploadField, { label: "صورة الغلاف (صفحة الأكاديمية)", value: academyCover, onChange: setAcademyCover, folder: "academies/covers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Msg, { msg: acaMsg }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: savingAcademy, className: "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold shadow-glow-primary disabled:opacity-60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
            savingAcademy ? "جارٍ الحفظ..." : "حفظ الصور"
          ] })
        ] })
      ] })
    ] })
  ] });
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  hint,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-sm font-medium mb-2", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      icon && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-3 top-1/2 -translate-y-1/2", children: icon }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, required, onChange: (e) => onChange(e.target.value), className: `w-full px-4 py-2.5 rounded-lg bg-input border border-border focus:border-primary focus:outline-none ${icon ? "pl-10" : ""}` })
    ] }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1", children: hint })
  ] });
}
function Msg({
  msg
}) {
  if (!msg) return null;
  const isOk = msg.type === "ok";
  const Icon = isOk ? CircleCheck : CircleAlert;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-sm rounded-lg px-3 py-2 flex gap-2 ${isOk ? "text-chemistry bg-chemistry/10 border border-chemistry/30" : "text-destructive bg-destructive/10 border border-destructive/30"}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-4 shrink-0 mt-0.5" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: msg.text })
  ] });
}
export {
  TeacherProfilePage as component
};
