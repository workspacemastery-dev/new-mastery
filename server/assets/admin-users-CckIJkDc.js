import { $ as TSS_SERVER_FUNCTION, a0 as createServerFn } from "./worker-entry-cdzVwTsG.js";
import { c as createClient } from "./index-B6C1Fcum.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing Supabase server environment variables. Ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
async function hasAnySuperAdmin() {
  const {
    count,
    error
  } = await supabaseAdmin.from("user_roles").select("id", {
    count: "exact",
    head: true
  }).eq("role", "super_admin");
  if (error) throw new Error(error.message);
  return (count ?? 0) > 0;
}
async function requireSuperAdmin(accessToken) {
  if (!accessToken) throw new Error("جلسة الإدارة غير صالحة");
  const {
    data: authData,
    error: authErr
  } = await supabaseAdmin.auth.getUser(accessToken);
  if (authErr || !authData.user) throw new Error("جلسة الإدارة غير صالحة");
  const {
    data: role
  } = await supabaseAdmin.from("user_roles").select("id").eq("user_id", authData.user.id).eq("role", "super_admin").maybeSingle();
  if (!role) throw new Error("غير مصرح: السوبر أدمن فقط");
  return authData.user;
}
async function findAuthUserByEmail(email) {
  const targetEmail = email.trim().toLowerCase();
  for (let page = 1; page <= 10; page += 1) {
    const {
      data,
      error
    } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 1e3
    });
    if (error) throw new Error(error.message);
    const found = data.users.find((u) => u.email?.toLowerCase() === targetEmail);
    if (found || data.users.length < 1e3) return found ?? null;
  }
  return null;
}
const checkSuperAdminBootstrap_createServerFn_handler = createServerRpc({
  id: "db9c70c47f0c9e135a8dca781d9d3b1253f1939e248a07462a43dab7208ec7b5",
  name: "checkSuperAdminBootstrap",
  filename: "src/server-functions/admin-users.ts"
}, (opts) => checkSuperAdminBootstrap.__executeServer(opts));
const checkSuperAdminBootstrap = createServerFn({
  method: "GET"
}).handler(checkSuperAdminBootstrap_createServerFn_handler, async () => ({
  needsBootstrap: !await hasAnySuperAdmin()
}));
const createFirstSuperAdmin_createServerFn_handler = createServerRpc({
  id: "dbb45e12fc6cf0d94ec4d94f6513b92d75af36cf8019eeb3064c46bba4f5f13f",
  name: "createFirstSuperAdmin",
  filename: "src/server-functions/admin-users.ts"
}, (opts) => createFirstSuperAdmin.__executeServer(opts));
const createFirstSuperAdmin = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.fullName || !input.email || !input.password) {
    throw new Error("جميع الحقول مطلوبة");
  }
  if (input.password.length < 6) throw new Error("كلمة المرور 6 أحرف على الأقل");
  return input;
}).handler(createFirstSuperAdmin_createServerFn_handler, async ({
  data
}) => {
  if (await hasAnySuperAdmin()) throw new Error("يوجد سوبر أدمن بالفعل");
  const existing = await findAuthUserByEmail(data.email);
  let userId = existing?.id;
  if (userId) {
    const {
      error
    } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName
      }
    });
    if (error) throw new Error(error.message);
  } else {
    const {
      data: created,
      error
    } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName
      }
    });
    if (error || !created.user) {
      throw new Error(error?.message ?? "تعذّر إنشاء السوبر أدمن");
    }
    userId = created.user.id;
  }
  await supabaseAdmin.from("profiles").upsert({
    user_id: userId,
    full_name: data.fullName
  }, {
    onConflict: "user_id"
  });
  const {
    error: roleErr
  } = await supabaseAdmin.from("user_roles").insert({
    user_id: userId,
    role: "super_admin",
    academy_id: null
  });
  if (roleErr) throw new Error(roleErr.message);
  return {
    email: data.email
  };
});
const updateTeacherAccount_createServerFn_handler = createServerRpc({
  id: "46951ecafced0b821c72f69864ea24ac65464e070c0b9e36d01070ee6193c65c",
  name: "updateTeacherAccount",
  filename: "src/server-functions/admin-users.ts"
}, (opts) => updateTeacherAccount.__executeServer(opts));
const updateTeacherAccount = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.accessToken || !input.userId || !input.fullName || !input.academyId) {
    throw new Error("بيانات ناقصة");
  }
  return input;
}).handler(updateTeacherAccount_createServerFn_handler, async ({
  data
}) => {
  await requireSuperAdmin(data.accessToken);
  await supabaseAdmin.from("profiles").upsert({
    user_id: data.userId,
    full_name: data.fullName
  }, {
    onConflict: "user_id"
  });
  await supabaseAdmin.auth.admin.updateUserById(data.userId, {
    user_metadata: {
      full_name: data.fullName
    }
  });
  const {
    error: roleErr
  } = await supabaseAdmin.from("user_roles").update({
    academy_id: data.academyId
  }).eq("user_id", data.userId).eq("role", "teacher");
  if (roleErr) throw new Error(roleErr.message);
  const {
    error: academyErr
  } = await supabaseAdmin.from("academies").update({
    teacher_id: data.userId,
    teacher_name: data.fullName
  }).eq("id", data.academyId);
  if (academyErr) throw new Error(academyErr.message);
  return {
    ok: true
  };
});
const setTeacherDisabled_createServerFn_handler = createServerRpc({
  id: "927246533d221527309f1768e71c7b48fb5b6344a22289b01681b72ede4ff879",
  name: "setTeacherDisabled",
  filename: "src/server-functions/admin-users.ts"
}, (opts) => setTeacherDisabled.__executeServer(opts));
const setTeacherDisabled = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.accessToken || !input.userId) throw new Error("بيانات ناقصة");
  return input;
}).handler(setTeacherDisabled_createServerFn_handler, async ({
  data
}) => {
  await requireSuperAdmin(data.accessToken);
  const {
    error
  } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
    ban_duration: data.disabled ? "876000h" : "none"
  });
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const deleteTeacherAccount_createServerFn_handler = createServerRpc({
  id: "368650dcf7b757a6645e4ea55959a623f806d83674b5597137fed70ffa64cb46",
  name: "deleteTeacherAccount",
  filename: "src/server-functions/admin-users.ts"
}, (opts) => deleteTeacherAccount.__executeServer(opts));
const deleteTeacherAccount = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.accessToken || !input.userId) throw new Error("بيانات ناقصة");
  return input;
}).handler(deleteTeacherAccount_createServerFn_handler, async ({
  data
}) => {
  await requireSuperAdmin(data.accessToken);
  await supabaseAdmin.from("academies").update({
    teacher_id: null,
    teacher_name: null
  }).eq("teacher_id", data.userId);
  const {
    error
  } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
  if (error) throw new Error(error.message);
  return {
    ok: true
  };
});
const createTeacherAccount_createServerFn_handler = createServerRpc({
  id: "02641f65ffb672ffc5b0cdfea072b571372e5465f08462f9ddff7946f3f7684c",
  name: "createTeacherAccount",
  filename: "src/server-functions/admin-users.ts"
}, (opts) => createTeacherAccount.__executeServer(opts));
const createTeacherAccount = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.accessToken || !input.email || !input.password || !input.fullName || !input.academyId) {
    throw new Error("جميع الحقول مطلوبة");
  }
  if (input.password.length < 6) throw new Error("كلمة المرور 6 أحرف على الأقل");
  return input;
}).handler(createTeacherAccount_createServerFn_handler, async ({
  data
}) => {
  await requireSuperAdmin(data.accessToken);
  const existing = await findAuthUserByEmail(data.email);
  let newUserId = existing?.id;
  if (newUserId) {
    const {
      error: updateErr
    } = await supabaseAdmin.auth.admin.updateUserById(newUserId, {
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName
      }
    });
    if (updateErr) throw new Error(updateErr.message);
  } else {
    const {
      data: created,
      error: createErr
    } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: {
        full_name: data.fullName
      }
    });
    if (createErr || !created.user) {
      throw new Error(createErr?.message ?? "تعذّر إنشاء الحساب");
    }
    newUserId = created.user.id;
  }
  await supabaseAdmin.from("profiles").upsert({
    user_id: newUserId,
    full_name: data.fullName
  }, {
    onConflict: "user_id"
  });
  const {
    error: roleErr
  } = await supabaseAdmin.from("user_roles").upsert({
    user_id: newUserId,
    role: "teacher",
    academy_id: data.academyId
  }, {
    onConflict: "user_id,role,academy_id"
  });
  if (roleErr) {
    if (!existing) await supabaseAdmin.auth.admin.deleteUser(newUserId);
    throw new Error(`تعذّر تعيين الدور: ${roleErr.message}`);
  }
  await supabaseAdmin.from("academies").update({
    teacher_id: newUserId,
    teacher_name: data.fullName
  }).eq("id", data.academyId);
  return {
    userId: newUserId,
    email: data.email
  };
});
const resetUserPassword_createServerFn_handler = createServerRpc({
  id: "4ae6551e6d24ffce9d8fe567713f56441890b1c9310f6a4298f82e7daaa163cf",
  name: "resetUserPassword",
  filename: "src/server-functions/admin-users.ts"
}, (opts) => resetUserPassword.__executeServer(opts));
const resetUserPassword = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.accessToken || !input.email || !input.newPassword) {
    throw new Error("بيانات ناقصة");
  }
  if (input.newPassword.length < 6) throw new Error("كلمة المرور 6 أحرف على الأقل");
  return input;
}).handler(resetUserPassword_createServerFn_handler, async ({
  data
}) => {
  await requireSuperAdmin(data.accessToken);
  const target = await findAuthUserByEmail(data.email);
  if (!target) throw new Error("لا يوجد مستخدم بهذا البريد");
  const {
    error: updErr
  } = await supabaseAdmin.auth.admin.updateUserById(target.id, {
    password: data.newPassword,
    email_confirm: true
  });
  if (updErr) throw new Error(updErr.message);
  return {
    ok: true
  };
});
export {
  checkSuperAdminBootstrap_createServerFn_handler,
  createFirstSuperAdmin_createServerFn_handler,
  createTeacherAccount_createServerFn_handler,
  deleteTeacherAccount_createServerFn_handler,
  resetUserPassword_createServerFn_handler,
  setTeacherDisabled_createServerFn_handler,
  updateTeacherAccount_createServerFn_handler
};
