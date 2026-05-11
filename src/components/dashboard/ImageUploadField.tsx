import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  folder: string; // path inside bucket, e.g. "academies/cards"
  hint?: string;
}

/**
 * Image uploader that stores files in the public `course-assets` bucket and
 * returns a public URL via onChange. Also accepts a manual URL paste.
 */
export function ImageUploadField({ label, value, onChange, folder, hint }: Props) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(file: File) {
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

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-3 items-start">
        <div className="size-24 rounded-xl bg-input border border-border overflow-hidden grid place-items-center shrink-0">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => ref.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-primary text-primary-foreground text-xs font-semibold disabled:opacity-60"
            >
              {busy ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
              {busy ? "جارٍ الرفع..." : "رفع صورة"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg glass text-xs hover:bg-destructive/20 text-destructive"
              >
                <X className="size-3.5" /> إزالة
              </button>
            )}
          </div>
          <input
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            placeholder="أو الصق رابط صورة..."
            className="w-full px-3 py-2 rounded-lg bg-input border border-border focus:border-primary focus:outline-none text-xs"
          />
          {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
          {err && <p className="text-xs text-destructive">{err}</p>}
        </div>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          if (ref.current) ref.current.value = "";
        }}
      />
    </div>
  );
}
