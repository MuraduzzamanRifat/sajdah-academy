"use client";

/* Repeating list field. Each item is a small object with sub-fields
   declared in schema.ts (itemFields). UI: card per item with up/down
   reorder + delete + "add new". State serialized as JSON into a hidden
   input — server action parses and stores in site_settings as jsonb.

   Stable keys: each item carries a `_id` (UUID) generated at hydration
   or when added. Without it React reused DOM by index — reorder/delete
   would leak field state (and image previews) into the wrong card. The
   _id is stripped before serialization so it never reaches the DB. */

import { useState } from "react";
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from "lucide-react";
import type { ListItemFieldDef } from "../schema";
import ImageField from "./ImageField";

type ItemValue = string | number | boolean;
type Item = Record<string, ItemValue> & { _id: string };

const inputBase =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm";

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function withId(item: Record<string, ItemValue>): Item {
  return { ...item, _id: makeId() };
}

function stripIds(items: Item[]): Record<string, ItemValue>[] {
  return items.map(({ _id: _drop, ...rest }) => {
    void _drop;
    return rest;
  });
}

export default function ListField({
  name,
  defaultValue,
  itemFields,
  itemLabel = "item",
  hint,
}: {
  name: string;
  defaultValue?: unknown;
  itemFields: ListItemFieldDef[];
  itemLabel?: string;
  hint?: string;
}) {
  const initial: Item[] = Array.isArray(defaultValue)
    ? (defaultValue as Record<string, ItemValue>[]).map(withId)
    : [];
  const [items, setItems] = useState<Item[]>(initial);

  const blank = (): Item => ({
    ...Object.fromEntries(itemFields.map((f) => [f.key, defaultForKind(f.kind)])),
    _id: makeId(),
  } as Item);

  function update(idx: number, key: string, val: ItemValue) {
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, [key]: val } : it))
    );
  }
  function remove(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }
  function move(idx: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const swap = idx + dir;
      if (swap < 0 || swap >= next.length) return prev;
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }
  function add() {
    setItems((prev) => [...prev, blank()]);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(stripIds(items))} />

      {items.length === 0 ? (
        <div className="text-xs text-slate-500 italic px-3 py-4 border border-dashed border-slate-200 rounded-lg text-center">
          কোনো {itemLabel} নেই — নিচের বাটন থেকে যোগ করুন।
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div
              key={item._id}
              className="border border-slate-200 rounded-lg bg-slate-50/50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-3 py-2 bg-slate-100 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-emerald-950">
                    {itemLabel} #{idx + 1}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => move(idx, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="উপরে"
                    aria-label="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="p-1 rounded hover:bg-slate-200 text-slate-600 disabled:opacity-30 cursor-pointer"
                    title="নিচে"
                    aria-label="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(idx)}
                    className="p-1 rounded hover:bg-rose-100 text-rose-600 ml-1 cursor-pointer"
                    title="মুছুন"
                    aria-label="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-3 bg-white">
                {itemFields.map((f) => (
                  <SubField
                    key={f.key}
                    field={f}
                    value={item[f.key]}
                    onChange={(v) => update(idx, f.key, v)}
                    namePath={`${name}.${idx}.${f.key}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border-2 border-dashed border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50 text-emerald-700 cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        {itemLabel} যোগ করুন
      </button>

      {hint && <p className="text-[10px] text-slate-500">{hint}</p>}
    </div>
  );
}

function SubField({
  field,
  value,
  onChange,
  namePath,
}: {
  field: ListItemFieldDef;
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean) => void;
  namePath: string;
}) {
  const id = `lf-${namePath}`;

  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-medium text-slate-600 mb-1">
        {field.label}
      </label>

      {field.kind === "string" && (
        <input
          id={id}
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputBase}
        />
      )}

      {field.kind === "text" && (
        <textarea
          id={id}
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows ?? 3}
          placeholder={field.placeholder}
          className={`${inputBase} resize-y`}
        />
      )}

      {field.kind === "number" && (
        <input
          id={id}
          type="number"
          value={typeof value === "number" ? String(value) : (value as string) ?? ""}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          className={inputBase}
        />
      )}

      {field.kind === "boolean" && (
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            id={id}
            type="checkbox"
            checked={value === true}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded border-slate-300"
          />
          <span className="text-slate-700">সক্রিয়</span>
        </label>
      )}

      {field.kind === "image" && (
        <ImageField
          value={typeof value === "string" ? value : ""}
          onChange={(v) => onChange(v)}
        />
      )}
    </div>
  );
}

function defaultForKind(kind: ListItemFieldDef["kind"]): string | number | boolean {
  switch (kind) {
    case "number":
      return 0;
    case "boolean":
      return false;
    default:
      return "";
  }
}
