"use client";

/* Tiptap-based rich-text editor for admin blog/content authoring.
   Outputs HTML via a hidden <input name={name}> so it drops into any
   server-action form. Supports headings, formatting, lists, blockquote,
   code blocks, links, images (URL or upload to Supabase Storage),
   tables, YouTube embeds, text alignment, highlight, and a source
   HTML toggle for advanced edits. */

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
/* StarterKit v3 already bundles paragraph, headings, bold/italic/strike,
   underline, link, lists, blockquote, code, codeBlock, hardBreak,
   horizontalRule, undoRedo, dropcursor, gapcursor, trailingNode. We
   only import the *extra* extensions: image, placeholder, text-align,
   typography, highlight, tables, youtube. */
import StarterKit from "@tiptap/starter-kit";
import ImageExt from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Highlight from "@tiptap/extension-highlight";
import { Table, TableRow, TableCell, TableHeader } from "@tiptap/extension-table";
import Youtube from "@tiptap/extension-youtube";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Minus,
  Link2,
  Link2Off,
  Image as ImageIcon,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo2,
  Redo2,
  Highlighter,
  Youtube as YoutubeIcon,
  Table as TableIcon,
  FileCode2,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createClient } from "../../../lib/supabase/client";

type Props = {
  name: string;
  defaultValue?: string;
  onTextChange?: (plainText: string) => void;
  placeholder?: string;
  /* Supabase Storage bucket for inline image uploads.
     Defaults to "blog-images" — caller must ensure the bucket exists. */
  uploadBucket?: string;
};

const STORAGE_BUCKET_DEFAULT = "blog-images";

export default function RichTextEditor({
  name,
  defaultValue = "",
  onTextChange,
  placeholder = "এখানে লিখুন... টাইপ করতে শুরু করুন বা / টাইপ করে কমান্ড দেখুন।",
  uploadBucket = STORAGE_BUCKET_DEFAULT,
}: Props) {
  const [html, setHtml] = useState(defaultValue);
  const [showSource, setShowSource] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkPopover, setShowLinkPopover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: "rte-codeblock" } },
        blockquote: { HTMLAttributes: { class: "rte-blockquote" } },
        link: {
          openOnClick: false,
          autolink: true,
          HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
        },
      }),
      ImageExt.configure({
        HTMLAttributes: { class: "rte-image" },
        allowBase64: false,
      }),
      Placeholder.configure({ placeholder }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Typography,
      Highlight.configure({ multicolor: false }),
      Table.configure({ resizable: true, HTMLAttributes: { class: "rte-table" } }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        controls: true,
        nocookie: true,
        HTMLAttributes: { class: "rte-youtube" },
      }),
    ],
    content: defaultValue,
    onUpdate({ editor }) {
      const next = editor.getHTML();
      setHtml(next);
      onTextChange?.(editor.getText());
    },
    editorProps: {
      attributes: {
        class:
          "rte-content prose prose-sm sm:prose-base max-w-none focus:outline-none min-h-[320px] px-4 py-3",
      },
    },
  });

  // Keep state in sync if defaultValue changes externally (rare).
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (defaultValue && current !== defaultValue && !html) {
      editor.commands.setContent(defaultValue);
      setHtml(defaultValue);
    }
  }, [defaultValue, editor, html]);

  if (!editor) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-xs text-slate-500">
        এডিটর লোড হচ্ছে...
      </div>
    );
  }

  function applyLink() {
    if (!linkUrl) {
      editor!.chain().focus().unsetLink().run();
    } else {
      const url = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`;
      editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setShowLinkPopover(false);
    setLinkUrl("");
  }

  async function handleImageUpload(file: File) {
    if (!file.type.startsWith("image/")) {
      alert("শুধু ইমেজ ফাইল আপলোড করুন।");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("ইমেজ ৫MB এর কম হতে হবে।");
      return;
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from(uploadBucket)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(uploadBucket).getPublicUrl(path);
      editor!.chain().focus().setImage({ src: pub.publicUrl, alt: file.name }).run();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      alert(`আপলোড ব্যর্থ: ${msg}\n\nSupabase → Storage → "${uploadBucket}" নামে public bucket আছে কিনা চেক করুন।`);
    } finally {
      setUploading(false);
    }
  }

  function insertImageByUrl() {
    const url = prompt("ইমেজের URL পেস্ট করুন:");
    if (url) editor!.chain().focus().setImage({ src: url }).run();
  }

  function insertYoutube() {
    const url = prompt("YouTube URL পেস্ট করুন:");
    if (url) editor!.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  function insertTable() {
    editor!.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  function onSourceChange(value: string) {
    setHtml(value);
    editor!.commands.setContent(value, { emitUpdate: false });
  }

  return (
    <div className="rte-wrapper rounded-lg border border-slate-200 bg-white overflow-hidden">
      <Toolbar
        editor={editor}
        onPickImage={() => fileInputRef.current?.click()}
        onImageUrl={insertImageByUrl}
        onYoutube={insertYoutube}
        onTable={insertTable}
        onLinkClick={() => {
          const prev = editor.getAttributes("link").href as string | undefined;
          setLinkUrl(prev ?? "");
          setShowLinkPopover((s) => !s);
        }}
        showSource={showSource}
        onToggleSource={() => setShowSource((s) => !s)}
        uploading={uploading}
      />

      {showLinkPopover && (
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 flex items-center gap-2">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-2 py-1 text-sm rounded border border-slate-300 outline-none focus:ring-2 focus:ring-emerald-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              } else if (e.key === "Escape") {
                setShowLinkPopover(false);
              }
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={applyLink}
            className="px-3 py-1 text-xs font-bold bg-emerald-700 text-white rounded hover:bg-emerald-800"
          >
            প্রয়োগ
          </button>
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().unsetLink().run();
              setShowLinkPopover(false);
              setLinkUrl("");
            }}
            className="px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 rounded"
            title="লিংক সরান"
          >
            <Link2Off className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {showSource ? (
        <textarea
          value={html}
          onChange={(e) => onSourceChange(e.target.value)}
          aria-label="HTML source editor"
          title="HTML source"
          placeholder="<p>HTML source...</p>"
          className="w-full min-h-[320px] px-4 py-3 font-mono text-xs text-slate-800 bg-slate-50 outline-none resize-y"
          spellCheck={false}
        />
      ) : (
        <EditorContent editor={editor} />
      )}

      {/* Hidden input gets the HTML to the form action */}
      <input type="hidden" name={name} value={html} />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        aria-label="ইমেজ ফাইল আপলোড"
        title="Upload image"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleImageUpload(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function Toolbar({
  editor,
  onPickImage,
  onImageUrl,
  onYoutube,
  onTable,
  onLinkClick,
  showSource,
  onToggleSource,
  uploading,
}: {
  editor: Editor;
  onPickImage: () => void;
  onImageUrl: () => void;
  onYoutube: () => void;
  onTable: () => void;
  onLinkClick: () => void;
  showSource: boolean;
  onToggleSource: () => void;
  uploading: boolean;
}) {
  return (
    <div className="border-b border-slate-200 bg-slate-50 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
      {/* Block type */}
      <Group>
        <Btn
          icon={Pilcrow}
          title="Paragraph"
          active={editor.isActive("paragraph")}
          onClick={() => editor.chain().focus().setParagraph().run()}
        />
        <Btn
          icon={Heading1}
          title="Heading 1"
          active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <Btn
          icon={Heading2}
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <Btn
          icon={Heading3}
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />
      </Group>

      <Sep />

      {/* Inline marks */}
      <Group>
        <Btn icon={Bold} title="Bold (⌘B)" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
        <Btn icon={Italic} title="Italic (⌘I)" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
        <Btn icon={UnderlineIcon} title="Underline (⌘U)" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
        <Btn icon={Strikethrough} title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} />
        <Btn icon={Highlighter} title="Highlight" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()} />
        <Btn icon={Code} title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()} />
        <Btn icon={Link2} title="Link" active={editor.isActive("link")} onClick={onLinkClick} />
      </Group>

      <Sep />

      {/* Lists / blocks */}
      <Group>
        <Btn icon={List} title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} />
        <Btn icon={ListOrdered} title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} />
        <Btn icon={Quote} title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} />
        <Btn icon={Code2} title="Code block" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} />
        <Btn icon={Minus} title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />
      </Group>

      <Sep />

      {/* Alignment */}
      <Group>
        <Btn icon={AlignLeft} title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
        <Btn icon={AlignCenter} title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
        <Btn icon={AlignRight} title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} />
        <Btn icon={AlignJustify} title="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} />
      </Group>

      <Sep />

      {/* Embeds */}
      <Group>
        <Btn icon={Upload} title={uploading ? "আপলোড..." : "ইমেজ আপলোড"} onClick={onPickImage} disabled={uploading} />
        <Btn icon={ImageIcon} title="ইমেজ URL" onClick={onImageUrl} />
        <Btn icon={YoutubeIcon} title="YouTube" onClick={onYoutube} />
        <Btn icon={TableIcon} title="Table" onClick={onTable} />
      </Group>

      <Sep />

      {/* Table actions (only show when in table) */}
      {editor.isActive("table") && (
        <>
          <Group>
            <TextBtn label="+ row" onClick={() => editor.chain().focus().addRowAfter().run()} />
            <TextBtn label="+ col" onClick={() => editor.chain().focus().addColumnAfter().run()} />
            <TextBtn label="− row" onClick={() => editor.chain().focus().deleteRow().run()} />
            <TextBtn label="− col" onClick={() => editor.chain().focus().deleteColumn().run()} />
            <Btn icon={Trash2} title="Delete table" onClick={() => editor.chain().focus().deleteTable().run()} />
          </Group>
          <Sep />
        </>
      )}

      {/* History + Source */}
      <Group>
        <Btn icon={Undo2} title="Undo (⌘Z)" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()} />
        <Btn icon={Redo2} title="Redo (⌘⇧Z)" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()} />
        <Btn
          icon={showSource ? FileCode2 : FileCode2}
          title={showSource ? "Visual editor" : "HTML source"}
          active={showSource}
          onClick={onToggleSource}
        />
      </Group>
    </div>
  );
}

function Group({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-0.5">{children}</div>;
}

function Sep() {
  return <span className="w-px h-5 bg-slate-300 mx-1" aria-hidden />;
}

function Btn({
  icon: Icon,
  title,
  active,
  disabled,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active ? "true" : "false"}
      disabled={disabled}
      onClick={onClick}
      className={[
        "p-1.5 rounded transition-colors cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        active
          ? "bg-emerald-700 text-white hover:bg-emerald-800"
          : "text-slate-700 hover:bg-slate-200",
      ].join(" ")}
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}

function TextBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-1 text-[10px] font-mono font-bold rounded text-slate-700 hover:bg-slate-200 cursor-pointer"
    >
      {label}
    </button>
  );
}
