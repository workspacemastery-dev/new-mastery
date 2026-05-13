import { T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { L as Link } from "./router-BfT70NIy.js";
function LoginError({
  message
}) {
  console.error("[student-login-route]", message);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen grid place-items-center px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-2", children: "تعذّر فتح دخول الطالب" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-4", children: message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-primary underline", children: "العودة للرئيسية" })
  ] }) });
}
export {
  LoginError as L
};
