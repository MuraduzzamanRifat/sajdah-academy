"use client";

/* Thin wrapper around RichTextEditor for use inside the Pages CMS form.
   Same API surface as the other field renderers (name + defaultValue),
   so PageSettingsForm doesn't need to know about Tiptap internals. */

import RichTextEditor from "../../_components/RichTextEditor";

export default function RichField({
  name,
  defaultValue,
  hint,
}: {
  name: string;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <RichTextEditor
        name={name}
        defaultValue={defaultValue ?? ""}
        uploadBucket="site-images"
        placeholder="এখানে লিখুন..."
      />
      {hint && <p className="text-[10px] text-slate-500">{hint}</p>}
    </div>
  );
}
