"use client";

import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import type { RichTextNode } from "@/lib/supabase/types";
import { cx } from "@/lib/cx";
import { FieldShell } from "./FieldShell";

// Only the formatting the public renderer understands (src/components/rich-text/RichText.tsx).
const extensions = [
  StarterKit.configure({
    heading: { levels: [2, 3] },
    code: false,
    codeBlock: false,
    strike: false,
    underline: false,
    link: { openOnClick: false, autolink: true, protocols: ["http", "https", "mailto"], defaultProtocol: "https" },
  }),
];

export function RichTextInput({
  id,
  label,
  help,
  error,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  value: RichTextNode | null;
  onChange: (value: RichTextNode | null) => void;
}) {
  const editor = useEditor({
    extensions,
    content: value ?? "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        id,
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": `${id}-label`,
        class: "rich-text-editor min-h-48 px-4 py-3 font-body text-body text-ink",
      },
    },
    onUpdate: ({ editor: e }) => onChange(e.getJSON() as RichTextNode),
  });

  const active = useEditorState({
    editor,
    selector: ({ editor: e }) =>
      e
        ? {
            h2: e.isActive("heading", { level: 2 }),
            h3: e.isActive("heading", { level: 3 }),
            bold: e.isActive("bold"),
            italic: e.isActive("italic"),
            bullet: e.isActive("bulletList"),
            ordered: e.isActive("orderedList"),
            quote: e.isActive("blockquote"),
            link: e.isActive("link"),
          }
        : null,
  });

  function setLink() {
    if (!editor) return;
    const previous = (editor.getAttributes("link").href as string | undefined) ?? "";
    const href = window.prompt("Link address (leave empty to remove the link)", previous);
    if (href === null) return;
    const chain = editor.chain().focus().extendMarkRange("link");
    if (!href.trim()) chain.unsetLink().run();
    else chain.setLink({ href: href.trim() }).run();
  }

  const tools: { label: string; on?: boolean; run: () => void }[] = editor
    ? [
        { label: "Heading", on: active?.h2, run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { label: "Subheading", on: active?.h3, run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
        { label: "Bold", on: active?.bold, run: () => editor.chain().focus().toggleBold().run() },
        { label: "Italic", on: active?.italic, run: () => editor.chain().focus().toggleItalic().run() },
        { label: "List", on: active?.bullet, run: () => editor.chain().focus().toggleBulletList().run() },
        { label: "Numbered", on: active?.ordered, run: () => editor.chain().focus().toggleOrderedList().run() },
        { label: "Quote", on: active?.quote, run: () => editor.chain().focus().toggleBlockquote().run() },
        { label: "Link", on: active?.link, run: setLink },
      ]
    : [];

  return (
    <FieldShell as="fieldset" id={id} label={label} help={help} error={error}>
      <span id={`${id}-label`} className="sr-only">
        {label}
      </span>
      <div className="border border-line bg-surface">
        <div role="toolbar" aria-label={`${label} formatting`} className="flex flex-wrap gap-1 border-b border-line p-1.5">
          {tools.map((t) => (
            <button
              key={t.label}
              type="button"
              aria-pressed={t.on}
              onClick={t.run}
              className={cx(
                "min-h-9 px-2.5 font-mono text-caption uppercase tracking-[0.1em]",
                t.on ? "bg-ink text-surface" : "text-ink hover:bg-ink/10",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <EditorContent editor={editor} />
      </div>
    </FieldShell>
  );
}
