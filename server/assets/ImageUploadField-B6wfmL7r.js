import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-cdzVwTsG.js";
import { s as supabase } from "./router-BfT70NIy.js";
import { I as Image } from "./image-DntQ77e3.js";
import { L as LoaderCircle } from "./loader-circle-B8rYq1WK.js";
import { c as createLucideIcon } from "./createLucideIcon-DHqPreVB.js";
import { X } from "./x-yy412flO.js";
const __iconNode = [
  ["path", { d: "M12 3v12", key: "1x0j5s" }],
  ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
];
const Upload = createLucideIcon("upload", __iconNode);
function ImageUploadField({ label, value, onChange, folder, hint }) {
  const ref = reactExports.useRef(null);
  const [busy, setBusy] = reactExports.useState(false);
  const [err, setErr] = reactExports.useState(null);
  async function handleFile(file) {
    setErr(null);
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("course-assets").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("course-assets").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "فشل الرفع");
    } finally {
      setBusy(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-24 rounded-xl bg-input border border-border overflow-hidden grid place-items-center shrink-0", children: value ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: value, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-6 text-muted-foreground" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => ref.current?.click(),
              disabled: busy,
              className: "inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-semibold disabled:opacity-60",
              children: [
                busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3.5" }),
                busy ? "جارٍ الرفع..." : "رفع صورة"
              ]
            }
          ),
          value && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => onChange(null),
              className: "inline-flex items-center gap-1 px-3 py-2 rounded-lg glass text-xs hover:bg-destructive/20 text-destructive",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-3.5" }),
                " إزالة"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: value ?? "",
            onChange: (e) => onChange(e.target.value || null),
            placeholder: "أو الصق رابط صورة...",
            className: "w-full px-3 py-2 rounded-lg bg-input border border-border focus:border-primary focus:outline-none text-xs"
          }
        ),
        hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground", children: hint }),
        err && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: err })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        ref,
        type: "file",
        accept: "image/*",
        className: "hidden",
        onChange: (e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          if (ref.current) ref.current.value = "";
        }
      }
    )
  ] });
}
export {
  ImageUploadField as I
};
