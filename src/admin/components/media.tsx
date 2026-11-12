"use client";

/* eslint-disable @next/next/no-img-element -- admin previews of freshly uploaded files; next/image adds nothing here */

import { useId, useState } from "react";
import { UPLOAD_IMAGE_MAX_EDGE } from "@/lib/constants";
import { browserClient } from "@/lib/supabase/browser";
import { storageUrl } from "@/lib/supabase/env";
import type { StoredImage } from "@/lib/supabase/types";
import { describedBy, FieldShell, inputClass, smallButton } from "./FieldShell";

const MEDIA_LIMIT = 5 * 1024 * 1024;
const AUDIO_LIMIT = 15 * 1024 * 1024;

/** Resize to UPLOAD_IMAGE_MAX_EDGE and re-encode as WebP in the browser, so uploads stay small on mobile data. */
async function compressImage(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("This file could not be read as a photo. Save it as JPEG or PNG and try again.");
  }
  const scale = Math.min(1, UPLOAD_IMAGE_MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const encode = (quality: number) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", quality));
  let blob = await encode(0.82);
  if (blob && blob.size > MEDIA_LIMIT) blob = await encode(0.65);
  if (!blob || blob.type !== "image/webp") {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.82));
  }
  if (!blob) throw new Error("This photo could not be prepared for upload.");
  if (blob.size > MEDIA_LIMIT) throw new Error("This photo is still over 5MB after compressing. Try a smaller one.");
  return { blob, width, height };
}

function objectPath(folder: string, extension: string) {
  const year = new Date().getFullYear();
  return `${folder}/${year}/${crypto.randomUUID()}.${extension}`;
}

async function uploadImage(file: File, folder: string): Promise<StoredImage> {
  const { blob, width, height } = await compressImage(file);
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const path = objectPath(folder, ext);
  const { error } = await browserClient().storage.from("media").upload(path, blob, {
    contentType: blob.type,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw new Error("Upload failed. Check your connection and try again.");
  return { path, alt: "", width, height };
}

// Single image -------------------------------------------------------------------------

type ImageProps = {
  id: string;
  label: string;
  help?: string;
  error?: string;
  required?: boolean;
  folder: string;
  value: StoredImage | null;
  onChange: (value: StoredImage | null) => void;
};

export function ImageInput({ id, label, help, error, required, folder, value, onChange }: ImageProps) {
  return (
    <FieldShell as="fieldset" id={id} label={label} help={help} error={error} required={required}>
      <ImageEditor id={id} folder={folder} value={value} onChange={onChange} error={error} />
    </FieldShell>
  );
}

function ImageEditor({
  id,
  folder,
  value,
  onChange,
  error,
  onRemove,
}: {
  id: string;
  folder: string;
  value: StoredImage | null;
  onChange: (value: StoredImage | null) => void;
  error?: string;
  onRemove?: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setProblem(null);
    try {
      const uploaded = await uploadImage(file, folder);
      onChange({ ...uploaded, alt: value?.alt ?? "", caption: value?.caption, credit: value?.credit });
    } catch (e) {
      setProblem(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  const set = (patch: Partial<StoredImage>) => value && onChange({ ...value, ...patch });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden border border-line bg-ink/5 sm:w-56">
        {value?.path ? (
          <img src={storageUrl("media", value.path)} alt="" className="size-full object-cover" />
        ) : (
          <span className="absolute inset-0 grid place-items-center font-mono text-caption uppercase tracking-[0.12em] text-muted">
            No photo
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <label className={`${smallButton} cursor-pointer`}>
            {busy ? "Uploading…" : value?.path ? "Replace photo" : "Upload photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="sr-only"
              disabled={busy}
              onChange={(e) => {
                void pick(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          {value?.path && (
            <button type="button" className={smallButton} onClick={() => (onRemove ? onRemove() : onChange(null))}>
              Remove
            </button>
          )}
        </div>
        <p role="status" aria-live="polite" className="text-caption text-ink">
          {problem}
        </p>
        {value?.path && (
          <>
            <label className="flex flex-col gap-1">
              <span className="text-caption font-semibold text-ink">Alt text (required)</span>
              <input
                className={inputClass}
                value={value.alt}
                onChange={(e) => set({ alt: e.target.value })}
                placeholder="What a person would see in this photo"
                aria-describedby={describedBy(id, undefined, error)}
                aria-invalid={Boolean(error) || undefined}
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-caption font-semibold text-ink">Caption</span>
                <input className={inputClass} value={value.caption ?? ""} onChange={(e) => set({ caption: e.target.value })} />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-caption font-semibold text-ink">Photo credit</span>
                <input className={inputClass} value={value.credit ?? ""} onChange={(e) => set({ credit: e.target.value })} />
              </label>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Gallery ------------------------------------------------------------------------------

export function GalleryInput({
  id,
  label,
  help,
  errors,
  folder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help?: string;
  errors: Record<string, string>;
  folder: string;
  value: StoredImage[];
  onChange: (value: StoredImage[]) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);
  const items = value ?? [];

  async function add(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setProblem(null);
    const added: StoredImage[] = [];
    for (const file of Array.from(files)) {
      try {
        added.push(await uploadImage(file, folder));
      } catch (e) {
        setProblem(e instanceof Error ? `${file.name}: ${e.message}` : "Upload failed.");
      }
    }
    onChange([...items, ...added]);
    setBusy(false);
  }

  const move = (i: number, d: -1 | 1) => {
    const next = [...items];
    const [item] = next.splice(i, 1);
    next.splice(i + d, 0, item);
    onChange(next);
  };

  const groupError = Object.keys(errors).some((k) => k.startsWith(`${id}.`)) ? "Every photo needs alt text." : undefined;

  return (
    <FieldShell as="fieldset" id={id} label={label} help={help} error={groupError}>
      <ol className="flex flex-col divide-y divide-line border-y border-line">
        {items.map((img, i) => (
          <li key={img.path} className="flex flex-col gap-3 py-5">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-caption uppercase tracking-[0.12em] text-muted">Photo {i + 1}</span>
              <div className="flex gap-2">
                <button type="button" className={smallButton} disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move photo ${i + 1} up`}>
                  ↑
                </button>
                <button
                  type="button"
                  className={smallButton}
                  disabled={i === items.length - 1}
                  onClick={() => move(i, 1)}
                  aria-label={`Move photo ${i + 1} down`}
                >
                  ↓
                </button>
              </div>
            </div>
            <ImageEditor
              id={`${id}.${i}`}
              folder={folder}
              value={img}
              error={errors[`${id}.${i}`]}
              onChange={(next) => onChange(items.map((it, j) => (j === i && next ? next : it)))}
              onRemove={() => onChange(items.filter((_, j) => j !== i))}
            />
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className={`${smallButton} cursor-pointer`}>
          {busy ? "Uploading…" : "Add photos"}
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="sr-only"
            disabled={busy}
            onChange={(e) => {
              void add(e.target.files);
              e.target.value = "";
            }}
          />
        </label>
        <p role="status" aria-live="polite" className="text-caption text-ink">
          {problem}
        </p>
      </div>
    </FieldShell>
  );
}

// Audio --------------------------------------------------------------------------------

export function AudioInput({
  id,
  label,
  help,
  error,
  folder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help?: string;
  error?: string;
  folder: string;
  value: string | null;
  onChange: (value: string | null) => void;
}) {
  const inputId = useId();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  async function pick(file: File | undefined) {
    if (!file) return;
    if (file.size > AUDIO_LIMIT) {
      setProblem("This recording is over 15MB. Upload it to SoundCloud or YouTube and paste the link below instead.");
      return;
    }
    setBusy(true);
    setProblem(null);
    const ext = (file.name.split(".").pop() ?? "mp3").toLowerCase().replace(/[^a-z0-9]/g, "") || "mp3";
    const path = objectPath(folder, ext);
    const { error: uploadError } = await browserClient().storage.from("audio").upload(path, file, {
      contentType: file.type || "audio/mpeg",
      cacheControl: "31536000",
      upsert: false,
    });
    setBusy(false);
    if (uploadError) {
      setProblem("Upload failed. Use MP3, M4A, OGG or WAV, and check your connection.");
      return;
    }
    onChange(path);
  }

  return (
    <FieldShell id={inputId} label={label} help={help} error={error}>
      <div className="flex flex-col gap-3">
        {value && <audio controls preload="none" src={storageUrl("audio", value)} className="w-full" />}
        <div className="flex flex-wrap gap-2">
          <label className={`${smallButton} cursor-pointer`}>
            {busy ? "Uploading…" : value ? "Replace recording" : "Upload recording"}
            <input
              id={inputId}
              type="file"
              accept="audio/*"
              className="sr-only"
              disabled={busy}
              aria-describedby={describedBy(id, help, error)}
              onChange={(e) => {
                void pick(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          {value && (
            <button type="button" className={smallButton} onClick={() => onChange(null)}>
              Remove
            </button>
          )}
        </div>
        <p role="status" aria-live="polite" className="text-caption text-ink">
          {problem}
        </p>
      </div>
    </FieldShell>
  );
}
