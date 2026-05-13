import { T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { N as Navigate } from "./router-BfT70NIy.js";
import { u as useAuth, d as dashboardPathForRole } from "./useAuth-CuQlxuo9.js";
import { g as getStoredStudentToken } from "./useStudentAuth-Mzi_1DBf.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-B6C1Fcum.js";
import "./createLucideIcon-DHqPreVB.js";
function DashboardRedirect() {
  const {
    user,
    role,
    loading
  } = useAuth();
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-8 animate-spin text-primary" }) });
  }
  if (!user && getStoredStudentToken()) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/dashboard/student" });
  }
  if (!user) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: dashboardPathForRole(role) });
}
export {
  DashboardRedirect as component
};
