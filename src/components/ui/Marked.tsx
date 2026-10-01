import { Fragment, type ReactNode } from "react";

const MARKER = /(\[(?:DRAFT|PLACEHOLDER)[^\]]*\])/g;

/**
 * Renders review markers such as "[DRAFT]" or "[PLACEHOLDER: ...]" as small
 * mono tags so unfinished copy is obvious to the client without breaking
 * the type. Text without markers is returned unchanged.
 */
export function marked(text: string): ReactNode {
  if (!text.includes("[")) return text;
  const parts = text.split(MARKER);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <span
        key={i}
        className="mx-1 inline-block align-middle font-mono text-caption font-normal tracking-[0.08em] text-muted not-italic"
      >
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
