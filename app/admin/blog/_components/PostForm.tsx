"use client";

import { useState } from "react";
import { AlertCircle, Save } from "lucide-react";
import { createPost, updatePost, type ActionResult } from "../actions";
import RichTextEditor from "../../_components/RichTextEditor";

export type PostInitial = {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string | null;
  body?: string;
  category?: string | null;
  author?: string | null;
  reading_minutes?: number | null;
  published_at?: string | null;
  is_published?: boolean;
};

const inputBase =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";

const CATEGORIES = ["Methodology", "Spiritual", "Story", "Practice", "Guidance"];

export default function PostForm({
  initial,
  mode,
}: {
  initial: PostInitial;
  mode: "create" | "edit";
}) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [bodyText, setBodyText] = useState(stripHtml(initial.body ?? ""));

  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;
  const estReading = Math.max(1, Math.round(wordCount / 220));

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    let result: ActionResult;
    if (mode === "create") {
      result = await createPost(formData);
    } else {
      result = await updatePost(initial.id!, formData);
    }
    setPending(false);
    if ("error" in result) setError(result.error);
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div>
        <Label>Title (SEO শিরোনাম)</Label>
        <input
          type="text"
          name="title"
          defaultValue={initial.title ?? ""}
          required
          maxLength={120}
          placeholder="৩০-৬০ অক্ষরের মধ্যে রাখুন SEO-র জন্য"
          className={`${inputBase} text-base font-bold`}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label>Slug (URL)</Label>
          <input
            type="text"
            name="slug"
            defaultValue={initial.slug ?? ""}
            disabled={mode === "edit"}
            placeholder="খালি রাখলে title থেকে generate হবে"
            className={`${inputBase} font-mono text-xs ${mode === "edit" ? "bg-slate-50 text-slate-500" : ""}`}
          />
        </div>
        <div>
          <Label>Category</Label>
          <select name="category" defaultValue={initial.category ?? ""} className={inputBase}>
            <option value="">— None —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Author</Label>
          <input type="text" name="author" defaultValue={initial.author ?? ""} placeholder="Editorial Team" className={inputBase} />
        </div>
      </div>

      <div>
        <Label>Excerpt (SEO description, 150-160 char)</Label>
        <textarea
          name="excerpt"
          defaultValue={initial.excerpt ?? ""}
          rows={2}
          maxLength={300}
          placeholder="Search results এ এই টেক্সট দেখাবে। ১৫০-১৬০ অক্ষরের মধ্যে রাখুন।"
          className={`${inputBase} resize-none`}
        />
      </div>

      <div>
        <Label>
          Body — rich editor (heading, list, image, table, YouTube, source HTML) · {wordCount} words · ~{estReading} min read
        </Label>
        <RichTextEditor
          name="body"
          defaultValue={initial.body ?? ""}
          onTextChange={setBodyText}
          placeholder="প্রথম প্যারাগ্রাফ লিখুন। উপরে toolbar থেকে heading/list/link/image যোগ করুন।"
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <Label>Published date</Label>
          <input
            type="date"
            name="published_at"
            title="Published date"
            aria-label="Published date"
            defaultValue={initial.published_at ?? new Date().toISOString().slice(0, 10)}
            className={inputBase}
          />
        </div>
        <div>
          <Label>Reading minutes (auto if blank)</Label>
          <input
            type="number"
            name="reading_minutes"
            defaultValue={initial.reading_minutes ?? ""}
            placeholder={`auto: ${estReading}`}
            className={inputBase}
          />
        </div>
        <label className="flex items-end gap-2 text-sm pb-2">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={initial.is_published ?? true}
            className="rounded border-slate-300"
          />
          <span className="text-slate-700">প্রকাশিত করুন</span>
        </label>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2">
        <a
          href="/dashboard/blog/"
          className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-bold"
        >
          বাতিল
        </a>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-1.5 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-bold disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5" />
          {pending ? "সংরক্ষণ হচ্ছে..." : mode === "create" ? "প্রকাশ করুন" : "আপডেট করুন"}
        </button>
      </div>
    </form>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-slate-700 mb-1.5">{children}</label>;
}

/* Editor stores HTML; word count needs plain text. Cheap regex strip
   is fine — runs on every keystroke, so DOMParser would be wasteful. */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
