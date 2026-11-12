import type { ReactNode } from "react";
import type { RichTextNode } from "@/lib/supabase/types";
import { cx } from "@/lib/cx";

// Renders Tiptap JSON from Supabase. Only the node and mark types below are rendered; anything
// else is dropped. Text is always rendered as React text (never as HTML), and links are limited
// to http, https and mailto, so stored content cannot inject markup or scripts.

const SAFE_HREF = /^(https?:\/\/|mailto:)/i;

function renderText(node: RichTextNode, key: number): ReactNode {
  let out: ReactNode = node.text ?? "";
  for (const mark of node.marks ?? []) {
    if (mark.type === "bold") out = <strong className="font-semibold">{out}</strong>;
    else if (mark.type === "italic") out = <em className="font-semibold not-italic">{out}</em>;
    else if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href.trim() : "";
      if (SAFE_HREF.test(href)) {
        const external = /^https?:\/\//i.test(href);
        out = (
          <a
            href={href}
            className="text-accent underline underline-offset-4"
            {...(external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
          >
            {out}
          </a>
        );
      }
    }
  }
  return <span key={key}>{out}</span>;
}

function renderNodes(nodes: RichTextNode[] | undefined): ReactNode[] {
  return (nodes ?? []).map((node, i) => renderNode(node, i));
}

function renderNode(node: RichTextNode, key: number): ReactNode {
  switch (node.type) {
    case "text":
      return renderText(node, key);
    case "paragraph":
      return <p key={key}>{renderNodes(node.content)}</p>;
    case "heading":
      return node.attrs?.level === 3 ? (
        <h3 key={key} className="mt-6 font-display text-h3 font-medium">
          {renderNodes(node.content)}
        </h3>
      ) : (
        <h2 key={key} className="mt-8 font-display text-h2 font-medium">
          {renderNodes(node.content)}
        </h2>
      );
    case "bulletList":
      return (
        <ul key={key} className="list-disc pl-6">
          {renderNodes(node.content)}
        </ul>
      );
    case "orderedList":
      return (
        <ol key={key} className="list-decimal pl-6">
          {renderNodes(node.content)}
        </ol>
      );
    case "listItem":
      return <li key={key}>{renderNodes(node.content)}</li>;
    case "blockquote":
      return (
        <blockquote key={key} className="border-l-2 border-accent pl-6 font-display text-body-lg">
          {renderNodes(node.content)}
        </blockquote>
      );
    case "hardBreak":
      return <br key={key} />;
    case "horizontalRule":
      return <hr key={key} className="border-line" />;
    default:
      return null;
  }
}

/** Long-form text from the admin rich text editor. Renders nothing for empty content. */
export function RichText({ value, className }: { value: RichTextNode | null | undefined; className?: string }) {
  if (!value || value.type !== "doc" || !value.content?.length) return null;
  return (
    <div className={cx("flex max-w-measure flex-col gap-5 font-body text-body-lg text-ink", className)}>
      {renderNodes(value.content)}
    </div>
  );
}
