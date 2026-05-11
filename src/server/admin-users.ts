import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

async function hasAnySuperAdmin() {
  const { count, error } = await supabaseAdmin
    .from("user_roles")
    .select("id", { count: "exact", head: true })
    .eq("role", "super_admin");
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}

async function requireSuperAdmin(accessToken: string) {
  if (!accessToken) throw new Error("جلسة الإدارة غير صالحة");

  const { data: authData, error: authErr } = await supabaseAdmin.auth.getUser(accessToken);
  if (authErr || !authData.user) throw new Error("جلسة الإدارة غير صالحة");

  const { data: role } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", authData.user.id)
    .eq("role", "super_admin")
    .maybeSingle();

  if (!role) throw new Error("غير مصرح: السوبر أدمن فقط");
  return authData.user;
}

async function findAuthUserByEmail(email: string) {
  const targetEmail = email.trim().toLowerCase();
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw new Error(error.message);
    const found = data.users.find((u) => u.email?.toLowerCase() === targetEmail);
    if (found || data.users.length < 1000) return found ?? null;
  }
  return null;
}

export const checkSuperAdminBootstrap = createServerFn({ method: "GET" })
  .handler(async () => ({ needsBootstrap: !(await hasAnySuperAdmin()) }));

export const createFirstSuperAdmin = createServerFn({ method: "POST" })
  .inputValidator((input: { fullName: string; email: string; password: string }) => {
    if (!input.fullName || !input.email || !input.password) throw new Error("جميع الحقول مطلوبة");
    if (input.password.length < 6) throw new Error("كلمة المرور 6 أحرف على الأقل");
    return input;
  })
  .handler(async ({ data }) => {
    if (await hasAnySuperAdmin()) throw new Error("يوجد سوبر أدمن بالفعل");

    const existing = await findAuthUserByEmail(data.email);
    let userId = existing?.id;

    if (userId) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: data.password,
        email_confirm: true,
        user_metadata: { full_name: data.fullName },
      });
      if (error) throw new Error(error.message);
    } else {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { full_name: data.fullName },
      });
      if (error || !created.user) throw new Error(error?.message ?? "تعذّر إنشاء السوبر أدمن");
      userId = created.user.id;
    }

    await supabaseAdmin.from("profiles").upsert(
      { user_id: userId, full_name: data.fullName },
      { onConflict: "user_id" },
    );

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "super_admin", academy_id: null });
    if (roleErr) throw new Error(roleErr.message);

    return { email: data.email };
  });

export const updateTeacherAccount = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string; userId: string; fullName: string; academyId: string }) => {
    if (!input.accessToken || !input.userId || !input.fullName || !input.academyId) throw new Error("بيانات ناقصة");
    return input;
  })
  .handler(async ({ data }) => {
    await requireSuperAdmin(data.accessToken);

    await supabaseAdmin.from("profiles").upsert(
      { user_id: data.userId, full_name: data.fullName },
      { onConflict: "user_id" },
    );
    await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      user_metadata: { full_name: data.fullName },
    });

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .update({ academy_id: data.academyId })
      .eq("user_id", data.userId)
      .eq("role", "teacher");
    if (roleErr) throw new Error(roleErr.message);

    const { error: academyErr } = await supabaseAdmin
      .from("academies")
      .update({ teacher_id: data.userId, teacher_name: data.fullName })
      .eq("id", data.academyId);
    if (academyErr) throw new Error(academyErr.message);

    return { ok: true };
  });

export const setTeacherDisabled = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string; userId: string; disabled: boolean }) => {
    if (!input.accessToken || !input.userId) throw new Error("بيانات ناقصة");
    return input;
  })
  .handler(async ({ data }) => {
    await requireSuperAdmin(data.accessToken);
    const { error } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      ban_duration: data.disabled ? "876000h" : "none",
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteTeacherAccount = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string; userId: string }) => {
    if (!input.accessToken || !input.userId) throw new Error("بيانات ناقصة");
    return input;
  })
  .handler(async ({ data }) => {
    await requireSuperAdmin(data.accessToken);
    await supabaseAdmin.from("academies").update({ teacher_id: null, teacher_name: null }).eq("teacher_id", data.userId);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * createTeacherAccount — server-side teacher creation.
 *
 * Why a server function (not browser supabase.auth.signUp):
 *  1. signUp() in the browser REPLACES the super admin's session with the new
 *     teacher's session — they get logged out.
 *  2. When email confirmation is required, signUp() returns a user object
 *     BEFORE the row is committed to auth.users, causing
 *     `user_roles_user_id_fkey` foreign-key violations on the follow-up insert.
 *
 * Using supabaseAdmin.auth.admin.createUser() with email_confirm=true:
 *  - Creates the user immediately and synchronously in auth.users.
 *  - Does NOT touch the caller's session.
 *  - Returns a real, persisted user.id we can safely link in user_roles.
 */
export const createTeacherAccount = createServerFn({ method: "POST" })
  .inputValidator((input: {
    accessToken: string;
    fullName: string;
    email: string;
    password: string;
    academyId: string;
  }) => {
    if (!input.accessToken || !input.email || !input.password || !input.fullName || !input.academyId) {
      throw new Error("جميع الحقول مطلوبة");
    }
    if (input.password.length < 6) throw new Error("كلمة المرور 6 أحرف على الأقل");
    return input;
  })
  .handler(async ({ data }) => {
    await requireSuperAdmin(data.accessToken);

    // 2) Create the auth user via admin API (bypasses RLS, persists synchronously)
    const existing = await findAuthUserByEmail(data.email);
    let newUserId = existing?.id;

    if (newUserId) {
      const { error: updateErr } = await supabaseAdmin.auth.admin.updateUserById(newUserId, {
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { full_name: data.fullName },
      });
      if (updateErr) throw new Error(updateErr.message);
    } else {
      const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { full_name: data.fullName },
      });
      if (createErr || !created.user) {
        throw new Error(createErr?.message ?? "تعذّر إنشاء الحساب");
      }
      newUserId = created.user.id;
    }

    // 3) Ensure profile exists (handle_new_user trigger should create it, but
    // race-safe upsert is cheap insurance).
    await supabaseAdmin
      .from("profiles")
      .upsert(
        { user_id: newUserId, full_name: data.fullName },
        { onConflict: "user_id" },
      );

    // 4) Insert teacher role linked to academy. user_id now exists in auth.users.
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: newUserId, role: "teacher", academy_id: data.academyId },
        { onConflict: "user_id,role,academy_id" },
      );
    if (roleErr) {
      // Rollback: delete the auth user to avoid orphans
      if (!existing) await supabaseAdmin.auth.admin.deleteUser(newUserId);
      throw new Error(`تعذّر تعيين الدور: ${roleErr.message}`);
    }

    // 5) Link teacher to academy record (display + ownership)
    await supabaseAdmin
      .from("academies")
      .update({ teacher_id: newUserId, teacher_name: data.fullName })
      .eq("id", data.academyId);

    return { userId: newUserId, email: data.email };
  });

/**
 * resetUserPassword — super admin sets a new password for any user.
 * Useful when a teacher forgets their password or when the super admin
 * needs to recover access from a new device.
 */
export const resetUserPassword = createServerFn({ method: "POST" })
  .inputValidator((input: { accessToken: string; email: string; newPassword: string }) => {
    if (!input.accessToken || !input.email || !input.newPassword) throw new Error("بيانات ناقصة");
    if (input.newPassword.length < 6) throw new Error("كلمة المرور 6 أحرف على الأقل");
    return input;
  })
  .handler(async ({ data }) => {
    await requireSuperAdmin(data.accessToken);

    const target = await findAuthUserByEmail(data.email);
    if (!target) throw new Error("لا يوجد مستخدم بهذا البريد");

    const { error: updErr } = await supabaseAdmin.auth.admin.updateUserById(
      target.id,
      { password: data.newPassword, email_confirm: true },
    );
    if (updErr) throw new Error(updErr.message);

    return { ok: true };
  });
