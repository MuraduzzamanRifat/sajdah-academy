"use client";

/* Image upload field for the Pages CMS. Uploads to a public Supabase
   Storage bucket and stores the public URL as a string in site_settings.
   Falls back to a manual URL input for advanced users (e.g. CDN paths). */

import { useRef, useState } from "react";
import { Image as ImageIcon, Upload, X, Link as LinkIcon } from "lucide-react";
import { createClient } from "../../../../lib/supabase/client";

const BUCKET = "site-images";

/* Controlled mode: pass `value` + `onChange` (used inside ListField for
   each item's image sub-field).
   Uncontrolled mode: pass `name` + `defaultValue` only — the component
   manages its own state and emits the URL via a hidden <input name>
   for native form submission. */
type Props = {
  aspect?: string;
  hint?: string;
} & (
  | { name: string; defaultValue?: string; value?: undefined; onChange?: undefined }
  | { name?: undefined; value: string; onChange: (url: string) => void; defaultValue?: undefined }
);

export default function ImageField(props: Props) {
  const isControlled = "value" in props && props.value !== undefined;
  const [internal, setInternal] = useState(
    isControlled ? "" : props.defaultValue ?? ""
  );
  const url = isControlled ? props.value! : internal;
  const setUrl = (next: string) => {
    if (isControlled) props.onChange!(next);
    else setInternal(next);
  };

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const { aspect, hint } = props;

  async function uploadFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("শুধু ইমেজ ফাইল আপলোড করুন।");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("ইমেজ ৫MB এর কম হতে হবে।");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const folder = (props.name ?? "list-item").replace(/\./g, "/");
      const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      setUrl(pub.publicUrl);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(`আপলোড ব্যর্থ: ${msg}`);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {/* Hidden input only emitted in uncontrolled mode (form-driven). */}
      {!isControlled && props.name && (
        <input type="hidden" name={props.name} value={url} />
      )}

      {url ? (
        <div className="relative inline-block group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Preview"
            className="h-32 rounded-lg border border-slate-200 object-cover bg-slate-50"
          />
          <button
            type="button"
            onClick={() => setUrl("")}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-600 text-white opacity-0 group-hover:opacity-100 hover:bg-rose-700 transition-opacity flex items-center justify-center cursor-pointer"
            title="ইমেজ সরান"
            aria-label="Remove image"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400">
          <ImageIcon className="w-6 h-6 mb-1" />
          <span className="text-[10px]">কোনো ইমেজ নেই</span>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white disabled:opacity-50 cursor-pointer"
        >
          <Upload className="w-3 h-3" />
          {uploading ? "আপলোড..." : url ? "পরিবর্তন" : "আপলোড"}
        </button>
        <button
          type="button"
          onClick={() => setShowUrlInput((s) => !s)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          URL
        </button>
        {aspect && (
          <span className="text-[10px] text-slate-500 font-mono">aspect {aspect}</span>
        )}
      </div>

      {showUrlInput && (
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-1.5 text-xs rounded border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
        />
      )}

      {error && <p className="text-[11px] text-rose-700">{error}</p>}
      {hint && <p className="text-[10px] text-slate-500">{hint}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        aria-label="ইমেজ ফাইল"
        title="Select image"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) uploadFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}
