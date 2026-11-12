import "server-only";
import { SLUG_PATTERN, type ContentType, type Field } from "./schema";

// Server-side validation for every admin save. The client form is a convenience; this is the gate.
// It also normalises values: trims text, turns empty strings into null, drops unknown keys.

export type FieldErrors = Record<string, string>;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RICH_TEXT_CHARS = 200_000;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

function validImage(v: unknown, key: string, errors: FieldErrors, required: boolean) {
  if (!isObject(v) || !str(v.path)) {
    if (required) errors[key] = "Add an image.";
    return null;
  }
  const path = str(v.path);
  if (path.includes("..") || path.startsWith("/")) {
    errors[key] = "That image path is not valid. Upload it again.";
    return null;
  }
  const alt = str(v.alt);
  if (!alt) errors[key] = "Describe the photo in the alt text box. Screen readers read it aloud.";
  const num = (n: unknown) => (typeof n === "number" && Number.isFinite(n) && n > 0 ? Math.round(n) : undefined);
  return {
    path,
    alt,
    width: num(v.width),
    height: num(v.height),
    caption: str(v.caption) || undefined,
    credit: str(v.credit) || undefined,
  };
}

function isEmptyDoc(v: Record<string, unknown>): boolean {
  const content = Array.isArray(v.content) ? v.content : [];
  return content.every((n) => isObject(n) && n.type === "paragraph" && !(Array.isArray(n.content) && n.content.length));
}

function validateField(field: Field, raw: unknown, key: string, errors: FieldErrors): unknown {
  switch (field.kind) {
    case "text": {
      const v = str(raw);
      if (!v) {
        if (field.required) errors[key] = `${field.label} is required.`;
        return null;
      }
      if (field.maxLength && v.length > field.maxLength) errors[key] = `Keep it under ${field.maxLength} characters.`;
      if (field.inputType === "email" && !EMAIL.test(v)) errors[key] = "That does not look like an email address.";
      return v;
    }
    case "slug": {
      const v = str(raw).toLowerCase();
      if (!v) {
        errors[key] = "Add a web address.";
        return null;
      }
      if (!new RegExp(SLUG_PATTERN).test(v)) errors[key] = "Use lowercase letters, numbers and single hyphens only.";
      return v;
    }
    case "url": {
      const v = str(raw);
      if (!v) {
        if (field.required) errors[key] = `${field.label} is required.`;
        return null;
      }
      if (!/^https?:\/\//i.test(v)) errors[key] = "Links must start with https://";
      else if (field.pattern && !new RegExp(field.pattern, "i").test(v)) errors[key] = field.patternHint ?? "That link is not the expected kind.";
      return v;
    }
    case "select": {
      const v = str(raw);
      if (!v) {
        if (field.required) errors[key] = `Choose a ${field.label.toLowerCase()}.`;
        return null;
      }
      if (!field.options.some((o) => o.value === v)) errors[key] = "Choose one of the options.";
      return v;
    }
    case "date": {
      const v = str(raw);
      if (!v) {
        if (field.required) errors[key] = `${field.label} is required.`;
        return null;
      }
      if (!DATE.test(v) || Number.isNaN(Date.parse(v))) errors[key] = "Use a real date.";
      return v;
    }
    case "number": {
      if (raw === "" || raw === null || raw === undefined) return null;
      const n = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isFinite(n)) {
        errors[key] = "Use a number.";
        return null;
      }
      if ((field.min !== undefined && n < field.min) || (field.max !== undefined && n > field.max)) {
        errors[key] = `Use a number between ${field.min} and ${field.max}.`;
      }
      return n;
    }
    case "boolean":
      return raw === true;
    case "image":
      return validImage(raw, key, errors, Boolean(field.required));
    case "gallery": {
      const list = Array.isArray(raw) ? raw : [];
      return list.map((img, i) => validImage(img, `${key}.${i}`, errors, true)).filter(Boolean);
    }
    case "audio": {
      const v = str(raw);
      if (v && (v.includes("..") || v.startsWith("/"))) errors[key] = "That recording path is not valid. Upload it again.";
      return v || null;
    }
    case "richText": {
      if (!isObject(raw) || raw.type !== "doc" || isEmptyDoc(raw)) return null;
      if (JSON.stringify(raw).length > MAX_RICH_TEXT_CHARS) errors[key] = "This text is too long to save in one piece.";
      return raw;
    }
    case "reference": {
      const v = str(raw);
      if (!v) {
        if (field.required) errors[key] = `Choose a ${field.label.toLowerCase()}.`;
        return null;
      }
      if (!UUID.test(v)) errors[key] = "Choose one of the options.";
      return v;
    }
    case "references": {
      const list = (Array.isArray(raw) ? raw : []).map(str).filter((v) => UUID.test(v));
      const unique = [...new Set(list)];
      if (field.max && unique.length > field.max) errors[key] = `Choose up to ${field.max}.`;
      return unique;
    }
    case "tags": {
      const list = (Array.isArray(raw) ? raw : []).map(str).filter(Boolean);
      if (list.length > 30) errors[key] = "Keep it to 30 or fewer.";
      return [...new Set(list)];
    }
    case "list": {
      const list = Array.isArray(raw) ? raw : [];
      if (field.max && list.length > field.max) errors[key] = `Keep it to ${field.max} or fewer.`;
      return list.map((item, i) => validateGroup(field.fields, isObject(item) ? item : {}, `${key}.${i}`, errors));
    }
    case "group": {
      const out = validateGroup(field.fields, isObject(raw) ? raw : {}, key, errors);
      return Object.values(out).some((v) => v !== null && v !== undefined && v !== "") ? out : null;
    }
  }
}

function validateGroup(fields: Field[], input: Record<string, unknown>, prefix: string, errors: FieldErrors) {
  const out: Record<string, unknown> = {};
  for (const f of fields) out[f.name] = validateField(f, input[f.name], prefix ? `${prefix}.${f.name}` : f.name, errors);
  return out;
}

/** Validates a whole document against its content type. Returns clean data and any field errors. */
export function validateDocument(type: ContentType, input: unknown) {
  const errors: FieldErrors = {};
  const data = validateGroup(type.fields, isObject(input) ? input : {}, "", errors);

  // Cross-field rules.
  const after = (start: string, end: string, label: string) => {
    if (typeof data[start] === "string" && typeof data[end] === "string" && data[end] < data[start]) {
      errors[end] = `${label} cannot be before the start date.`;
    }
  };
  after("opens_on", "closes_on", "The closing date");
  after("start_date", "end_date", "The end date");

  const accent = (headline: string, word: string) => {
    const h = data[headline];
    const w = data[word];
    if (typeof w === "string" && (typeof h !== "string" || !h.toLowerCase().includes(w.toLowerCase()))) {
      errors[word] = "The accent word must appear in the line above, spelled the same way.";
    }
  };
  accent("hero_headline", "hero_accent_word");
  accent("footer_closing_line", "footer_accent_word");

  return { data, errors, ok: Object.keys(errors).length === 0 };
}
