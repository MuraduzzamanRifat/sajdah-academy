"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, Save } from "lucide-react";
import type { FieldDef } from "../schema";
import { saveSettings } from "../actions";

const inputBase =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";

export default function PageSettingsForm({
  groups,
  initial,
}: {
  groups: { title: string; fields: FieldDef[] }[];
  initial: Record<string, unknown>;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState<number | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSavedCount(null);

    const fd = new FormData(e.currentTarget);
    const fields: { key: string; type: "string" | "number" | "boolean" | "json"; value: string }[] = [];

    groups.forEach((g) => {
      g.fields.forEach((f) => {
        const raw = fd.get(f.key);
        const v = f.kind === "boolean" ? (raw === "on" ? "true" : "false") : String(raw ?? "");
        // "text" is just a multi-line string at the storage layer
        const storageType = f.kind === "text" ? "string" : f.kind;
        fields.push({ key: f.key, type: storageType, value: v });
      });
    });

    const result = await saveSettings(fields);
    setPending(false);
    if ("error" in result) {
      setError(result.error);
    } else {
      setSavedCount(result.saved);
      setTimeout(() => setSavedCount(null), 4000);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {groups.map((g) => (
        <fieldset key={g.title} className="border border-slate-200 rounded-xl p-4">
          <legend className="px-2 text-xs font-bold uppercase tracking-widest text-emerald-700">
            {g.title}
          </legend>
          <div className="space-y-4 pt-2">
            {g.fields.map((f) => (
              <Field key={f.key} field={f} initialValue={initial[f.key]} />
            ))}
          </div>
        </fieldset>
      ))}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {savedCount !== null && (
        <div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{savedCount} টি ফিল্ড সংরক্ষণ হয়েছে — পাবলিক পেজ আপডেট হয়েছে।</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 sticky bottom-4 bg-white pt-2 border-t border-slate-100">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {pending ? "সংরক্ষণ হচ্ছে..." : "সব পরিবর্তন সংরক্ষণ"}
        </button>
      </div>
    </form>
  );
}

function Field({ field, initialValue }: { field: FieldDef; initialValue: unknown }) {
  const id = `f-${field.key}`;
  const stringValue = typeof initialValue === "string" ? initialValue : "";
  const numValue = typeof initialValue === "number" ? String(initialValue) : "";
  const boolValue = initialValue === true;
  const jsonValue =
    initialValue === undefined || initialValue === null
      ? ""
      : JSON.stringify(initialValue, null, 2);

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-700 mb-1.5">
        {field.label}{" "}
        <code className="font-mono text-[10px] text-slate-400 ml-1">{field.key}</code>
      </label>

      {field.kind === "string" && (
        <input id={id} type="text" name={field.key} defaultValue={stringValue} className={inputBase} />
      )}

      {field.kind === "text" && (
        <textarea
          id={id}
          name={field.key}
          defaultValue={stringValue}
          rows={field.rows ?? 3}
          className={`${inputBase} resize-y`}
        />
      )}

      {field.kind === "number" && (
        <input id={id} type="number" name={field.key} defaultValue={numValue} className={inputBase} />
      )}

      {field.kind === "boolean" && (
        <label className="inline-flex items-center gap-2 text-sm">
          <input id={id} type="checkbox" name={field.key} defaultChecked={boolValue} className="rounded border-slate-300" />
          <span className="text-slate-700">সক্রিয়</span>
        </label>
      )}

      {field.kind === "json" && (
        <textarea
          id={id}
          name={field.key}
          defaultValue={jsonValue}
          rows={field.rows ?? 8}
          className={`${inputBase} resize-y font-mono text-xs`}
          spellCheck={false}
        />
      )}

      {field.hint && <p className="text-[10px] text-slate-500 mt-1">{field.hint}</p>}
    </div>
  );
}
