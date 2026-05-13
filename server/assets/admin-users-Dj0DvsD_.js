import { $ as TSS_SERVER_FUNCTION, a1 as getServerFnById, a0 as createServerFn } from "./worker-entry-cdzVwTsG.js";
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const checkSuperAdminBootstrap = createServerFn({
  method: "GET"
}).handler(createSsrRpc("db9c70c47f0c9e135a8dca781d9d3b1253f1939e248a07462a43dab7208ec7b5"));
const createFirstSuperAdmin = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.fullName || !input.email || !input.password) {
    throw new Error("جميع الحقول مطلوبة");
  }
  if (input.password.length < 6) throw new Error("كلمة المرور 6 أحرف على الأقل");
  return input;
}).handler(createSsrRpc("dbb45e12fc6cf0d94ec4d94f6513b92d75af36cf8019eeb3064c46bba4f5f13f"));
const updateTeacherAccount = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.accessToken || !input.userId || !input.fullName || !input.academyId) {
    throw new Error("بيانات ناقصة");
  }
  return input;
}).handler(createSsrRpc("46951ecafced0b821c72f69864ea24ac65464e070c0b9e36d01070ee6193c65c"));
const setTeacherDisabled = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.accessToken || !input.userId) throw new Error("بيانات ناقصة");
  return input;
}).handler(createSsrRpc("927246533d221527309f1768e71c7b48fb5b6344a22289b01681b72ede4ff879"));
const deleteTeacherAccount = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.accessToken || !input.userId) throw new Error("بيانات ناقصة");
  return input;
}).handler(createSsrRpc("368650dcf7b757a6645e4ea55959a623f806d83674b5597137fed70ffa64cb46"));
const createTeacherAccount = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.accessToken || !input.email || !input.password || !input.fullName || !input.academyId) {
    throw new Error("جميع الحقول مطلوبة");
  }
  if (input.password.length < 6) throw new Error("كلمة المرور 6 أحرف على الأقل");
  return input;
}).handler(createSsrRpc("02641f65ffb672ffc5b0cdfea072b571372e5465f08462f9ddff7946f3f7684c"));
const resetUserPassword = createServerFn({
  method: "POST"
}).inputValidator((input) => {
  if (!input.accessToken || !input.email || !input.newPassword) {
    throw new Error("بيانات ناقصة");
  }
  if (input.newPassword.length < 6) throw new Error("كلمة المرور 6 أحرف على الأقل");
  return input;
}).handler(createSsrRpc("4ae6551e6d24ffce9d8fe567713f56441890b1c9310f6a4298f82e7daaa163cf"));
export {
  createFirstSuperAdmin as a,
  createTeacherAccount as b,
  checkSuperAdminBootstrap as c,
  deleteTeacherAccount as d,
  resetUserPassword as r,
  setTeacherDisabled as s,
  updateTeacherAccount as u
};
